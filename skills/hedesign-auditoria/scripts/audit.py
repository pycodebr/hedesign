#!/usr/bin/env python3
"""Auditoria estática de um projeto contra as regras do hedesign. Só biblioteca padrão.

    hedesign audit <arquivo-ou-pasta> [--json] [--strict]

Confere classes he-* e tokens --he-* que não existem, valores inválidos de data-tone, data-state e data-who, cor fixa
fora dos tokens, texto menor que 12 px, caixa alta em botão, foco removido, animação de medida, confirm() para ação
reversível, botão só com ícone sem rótulo e imagem sem alt. Sai com código 1 quando há erro (ou aviso, com --strict).
"""
import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[3]
EXT = {".html", ".htm", ".css", ".scss", ".less", ".jsx", ".tsx", ".js", ".ts", ".vue", ".svelte", ".astro", ".erb", ".php",
       ".jinja", ".j2", ".twig", ".hbs", ".njk"}
SKIP_DIRS = {"node_modules", ".git", "dist", "build", ".next", ".nuxt", "vendor", "venv", ".venv", "__pycache__", "staticfiles",
             "coverage"}
STYLE_EXT = {".css", ".scss", ".less"}
TONES = {"blue", "violet", "pink", "orange", "teal", "green", "ai", "accent", "danger", "neutral"}
ORB_STATES = {"idle", "working", "waiting"}
WHO = {"you", "ai"}
# classes que o JS liga no <html> ou que servem só de gancho, e por isso não aparecem como seletor simples no CSS
HOOKS = {"he-tips", "he-tip", "he-wide", "he-keyhint", "he-focus", "he-lock", "he-dock-open", "he-layer-open", "he-dragging",
         "he-has-decide", "he-nav-open", "he-nav-collapsed", "he-sprite", "he-toasts"}


def load_system() -> tuple:
    css_path = ROOT / "dist" / "hedesign.css"
    if not css_path.exists():
        print(f"não encontrei {css_path}; rode a auditoria a partir de uma instalação completa do hedesign", file=sys.stderr)
        sys.exit(2)
    css = css_path.read_text(encoding="utf-8")
    classes = set(re.findall(r"\.(he-[a-zA-Z0-9_-]+)", css)) | HOOKS
    tokens = set(re.findall(r"(--he-[a-z0-9-]+)\s*:", css))
    keyframes = set(re.findall(r"@keyframes (he-[a-z0-9-]+)", css))
    return classes | keyframes, tokens


def files_of(target: Path):
    if target.is_file():
        yield target
        return
    for path in sorted(target.rglob("*")):
        if not path.is_file() or path.suffix.lower() not in EXT:
            continue
        if set(path.parts) & SKIP_DIRS or path.name.startswith("hedesign"):
            continue
        yield path


def audit_file(path: Path, classes: set, tokens: set) -> list:
    out = []
    try:
        text = path.read_text(encoding="utf-8")
    except (UnicodeDecodeError, OSError):
        return out
    is_style = path.suffix.lower() in STYLE_EXT

    def add(level: str, line: int, rule: str, message: str) -> None:
        out.append({"file": str(path), "line": line, "level": level, "rule": rule, "message": message})

    primary = 0
    for number, line in enumerate(text.split("\n"), 1):
        bare = re.sub(r"url\([^)]*\)", "url()", line)
        for cls in sorted(set(re.findall(r"(?<![\w-])(he-[a-zA-Z0-9_-]+)", bare))):
            if cls in classes or cls.startswith(("he-i-", "he-grad-")) or f"--{cls}" in tokens:
                continue
            if re.search(r"--" + re.escape(cls), bare) or re.search(re.escape(cls) + r"[.:]", bare):
                continue  # nome de token próprio do projeto, evento "he:nome" ou chave de armazenamento "he.nome"
            add("erro", number, "classe-desconhecida", f"a classe {cls} não existe no hedesign")
        for token in sorted(set(re.findall(r"var\(\s*(--he-[a-z0-9-]+)", bare))):
            if token not in tokens:
                add("erro", number, "token-desconhecido", f"o token {token} não existe no hedesign")
        for value in re.findall(r'data-tone=["\']([a-z-]+)["\']', bare):
            if value not in TONES:
                add("erro", number, "tom-invalido", f'data-tone="{value}" não existe; use um de: {", ".join(sorted(TONES))}')
        for value in re.findall(r'class=["\'][^"\']*he-orb[^"\']*["\'][^>]*data-state=["\']([a-z-]+)["\']', bare):
            if value not in ORB_STATES:
                add("erro", number, "estado-invalido", f'data-state="{value}" no orbe; use idle, working ou waiting')
        for value in re.findall(r'data-who=["\']([a-z-]+)["\']', bare):
            if value not in WHO:
                add("erro", number, "quem-invalido", f'data-who="{value}"; use you ou ai')
        primary += len(re.findall(r"(?<![\w-])he-btn--primary", bare))
        defines_token = bool(re.match(r"\s*--[a-z0-9-]+\s*:", bare))
        if not defines_token and (is_style or "style=" in bare):
            styled = bare if is_style else " ".join(re.findall(r'style=["\']([^"\']*)["\']', bare))
            if re.search(r"(?<![\w-])#[0-9a-fA-F]{3,8}\b|\brgba?\(|\bhsla?\(", styled) and "--he-" not in styled:
                add("aviso", number, "cor-fixa", "cor escrita à mão; use um token --he-* para a tela funcionar nos dois temas")
        for size in re.findall(r"font-size\s*:\s*([\d.]+)px", bare):
            if 0 < float(size) < 12:
                add("aviso", number, "texto-pequeno", f"texto com {size}px; texto de leitura começa em 12px (abaixo disso, só micro-rótulo em peso 600 ou mais)")
        if re.search(r"text-transform\s*:\s*uppercase", bare) and re.search(r"btn|button", bare):
            add("aviso", number, "caixa-alta", "caixa alta em botão; no hedesign ela fica só no rótulo de painel (.he-overline)")
        if is_style and re.search(r"outline\s*:\s*(none|0)\b", bare) and "focus-visible" not in bare:
            add("aviso", number, "foco-removido", "outline removido; garanta outro realce de foco visível")
        if re.search(r"transition\s*:[^;]*\b(all|width|height|margin|padding|top|left)\b", bare):
            add("aviso", number, "animacao-de-medida", "anime só transform, opacity, box-shadow e background-position")
        if not is_style and re.search(r"(?<![\w.])confirm\(", bare):
            add("aviso", number, "confirmacao",
                "confirm() encontrado; para ação reversível, execute e ofereça Desfazer com HE.toast({ onUndo })")
        for tag in re.findall(r"<(?:button|a)\b[^>]*he-iconbtn[^>]*>", bare):
            if "aria-label" not in tag and "aria-labelledby" not in tag and "title=" not in tag:
                add("erro", number, "sem-rotulo", "botão só com ícone sem aria-label")
        for tag in re.findall(r"<img\b[^>]*>", bare):
            if not re.search(r"\balt\s*=|:alt\s*=|\{\.\.\.", tag):
                add("aviso", number, "imagem-sem-alt", 'imagem sem alt (use alt="" quando for decorativa)')

    if path.suffix.lower() in {".html", ".htm"} and "<html" in text:
        if "hedesign" in text and "hedesign-theme" not in text and "data-he-theme" not in text:
            add("aviso", 1, "tema", "página sem hedesign-theme.js no <head>: o tema escolhido só entra depois da primeira pintura")
        if not re.search(r"<html[^>]*\blang=", text):
            add("aviso", 1, "idioma", "falta o atributo lang no <html>")
        if "viewport" not in text:
            add("erro", 1, "viewport", "falta a meta viewport; sem ela o modo celular não funciona")
        if primary > 3:
            add("aviso", 1, "botao-principal", f"{primary} botões principais na mesma página; o sistema pede um por tela ou por folha")
    return out


def main() -> int:
    args = [a for a in sys.argv[1:] if not a.startswith("--")]
    if not args:
        print(__doc__)
        return 2
    as_json, strict = "--json" in sys.argv, "--strict" in sys.argv
    classes, tokens = load_system()
    findings, count = [], 0
    for arg in args:
        target = Path(arg)
        if not target.exists():
            print(f"não encontrei {arg}", file=sys.stderr)
            return 2
        for path in files_of(target):
            count += 1
            findings.extend(audit_file(path, classes, tokens))
    errors = sum(1 for f in findings if f["level"] == "erro")
    warnings = len(findings) - errors
    if as_json:
        print(json.dumps({"files": count, "errors": errors, "warnings": warnings, "findings": findings}, ensure_ascii=False, indent=2))
    else:
        for f in findings:
            print(f'{f["level"].upper():5} {f["file"]}:{f["line"]}  [{f["rule"]}] {f["message"]}')
        print(f"\n{count} arquivo(s) conferido(s): {errors} erro(s), {warnings} aviso(s).")
    return 1 if errors or (strict and warnings) else 0


if __name__ == "__main__":
    sys.exit(main())
