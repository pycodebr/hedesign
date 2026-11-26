#!/usr/bin/env python3
"""Conferências do repositório que não precisam de navegador: skills, versão, texto e guarda de publicação.

    python3 tests/check_repo.py
"""
import py_compile
import re
import subprocess
import sys
import tempfile
from pathlib import Path

if not __debug__:
    raise RuntimeError("rode sem -O: as conferências usam assert")

ROOT = Path(__file__).resolve().parent.parent
VERSION = (ROOT / "VERSION").read_text().strip()
SKILLS = ["hedesign", "hedesign-telas", "hedesign-auditoria"]
TEXT_EXT = {".md", ".html", ".css", ".js", ".py", ".sh", ".json", ".txt", ".yml", ".svg", ""}
problems = []


def fail(message: str) -> None:
    problems.append(message)


def tracked_files() -> list:
    try:
        out = subprocess.run(["git", "-C", str(ROOT), "ls-files", "-co", "--exclude-standard"], capture_output=True, text=True, check=True)
        return [ROOT / line for line in out.stdout.splitlines() if line and (ROOT / line).is_file()]
    except (OSError, subprocess.CalledProcessError):
        return [p for p in ROOT.rglob("*") if p.is_file() and ".git" not in p.parts and "__pycache__" not in p.parts]


# ── skills ──────────────────────────────────────────────────────────────────
def check_skills() -> None:
    changelog = (ROOT / "CHANGELOG.md").read_text()
    assert f"## {VERSION} (" in changelog, f"CHANGELOG.md sem a seção da versão {VERSION}"
    for name in SKILLS:
        path = ROOT / "skills" / name / "SKILL.md"
        text = path.read_text()
        head = re.match(r"^---\n(.*?)\n---\n", text, re.S)
        if not head:
            fail(f"{name}: SKILL.md sem frontmatter")
            continue
        front = head.group(1)
        if not re.search(rf"^name: {re.escape(name)}$", front, re.M):
            fail(f"{name}: o campo name precisa ser igual ao nome da pasta")
        desc = re.search(r"^description: '(.*)'$", front, re.M)
        if not desc or not desc.group(1).startswith("Use quando"):
            fail(f"{name}: description entre aspas simples, começando com 'Use quando'")
        if not re.search(rf"^  version: {re.escape(VERSION)}$", front, re.M):
            fail(f"{name}: metadata.version diferente de VERSION ({VERSION})")
        for ref in re.findall(r"`((?:references|scripts)/[\w./-]+)`", text):
            if not (path.parent / ref).exists():
                fail(f"{name}: SKILL.md cita {ref}, que não existe")
        for ref in re.findall(r"`\.\./([\w./-]+)`", text):
            if not (ROOT / "skills" / ref).exists():
                fail(f"{name}: SKILL.md cita ../{ref}, que não existe")
    for path in list((ROOT / "skills").rglob("*.py")) + list((ROOT / "tools").glob("*.py")) + list((ROOT / "tests").rglob("*.py")):
        try:
            with tempfile.TemporaryDirectory() as tmp:
                py_compile.compile(str(path), cfile=str(Path(tmp) / "x.pyc"), doraise=True)
        except py_compile.PyCompileError as exc:
            fail(f"erro de sintaxe em {path.relative_to(ROOT)}: {exc.msg.strip()}")


# ── versão nas URLs públicas ─────────────────────────────────────────────────
def check_version_urls() -> None:
    for rel in ["README.md", "llms.txt", "AGENTS.md", "skills/hedesign/SKILL.md", "docs/src/sections/02-instalar.html"]:
        path = ROOT / rel
        if not path.exists():
            continue
        for found in re.findall(r"pycodebr/hedesign@([\w.]+)/", path.read_text()):
            if found != VERSION:
                fail(f"{rel}: URL do jsDelivr com a versão {found}; a atual é {VERSION}")


# ── caminhos citados nos documentos para agentes ─────────────────────────────
def check_links() -> None:
    for rel in ["llms.txt", "README.md", "AGENTS.md"]:
        path = ROOT / rel
        if not path.exists():
            continue
        for target in re.findall(r"\]\((?!https?://|#|mailto:)([^)\s]+)\)", path.read_text()):
            if not (ROOT / target.split("#")[0]).exists():
                fail(f"{rel}: o link para {target} não existe no repositório")


# ── texto em português ───────────────────────────────────────────────────────
PLAIN = ["nao", "voce", "acao", "acoes", "funcao", "versao", "padrao", "botao", "botoes", "tambem", "ate", "ja", "so", "sao", "entao",
         "atencao", "informacao", "configuracao", "aplicacao", "descricao", "opcao", "opcoes", "pagina", "codigo", "icone", "icones",
         "titulo", "numero", "util", "possivel", "visivel", "disponivel", "necessario", "unico", "ultimo", "proximo", "historico",
         "conteudo", "area", "apos", "alem", "experiencia", "referencia", "referencias", "sequencia", "voce"]
PLAIN_RE = re.compile(r"(?<![\w/.#@:=\-`\"'<>{}\[\]()])(" + "|".join(sorted(set(PLAIN))) + r")(?![\w/.\-=`\"'<>{}\[\]():])", re.I)


def prose_lines(path: Path):
    """Linhas de prosa: fora de blocos de código e sem trechos entre crases."""
    fenced = False
    for number, line in enumerate(path.read_text().split("\n"), 1):
        if line.lstrip().startswith("```"):
            fenced = not fenced
            continue
        if fenced or line.startswith("    "):
            continue
        yield number, re.sub(r"`[^`]*`", "", line)


def check_text() -> None:
    docs = [p for p in tracked_files() if p.suffix == ".md" or p.name == "llms.txt"]
    for path in docs:
        rel = path.relative_to(ROOT)
        for number, line in prose_lines(path):
            if "\u2014" in line or " \u2013 " in line:
                fail(f"{rel}:{number}: travessão no texto")
            if "..." in line or "\u2026" in line:
                fail(f"{rel}:{number}: reticências no texto")
            for word in PLAIN_RE.findall(line):
                if word.lower() in {"so", "ja", "ate", "area", "apos", "util"} and rel.name == "CHANGELOG.md":
                    continue
                fail(f"{rel}:{number}: palavra sem acento: {word}")
    for path in (ROOT / "docs" / "src").rglob("*.html"):
        rel = path.relative_to(ROOT)
        text = re.sub(r"<!--code-->.*?<!--/code-->", "", path.read_text(), flags=re.S)
        text = re.sub(r"<script.*?</script>", "", text, flags=re.S)
        for number, line in enumerate(text.split("\n"), 1):
            visible = re.sub(r"<[^>]+>", " ", line)
            if "\u2014" in visible:
                fail(f"{rel}:{number}: travessão no texto")
            if "..." in visible:
                fail(f"{rel}:{number}: reticências no texto")
            for word in PLAIN_RE.findall(visible):
                fail(f"{rel}:{number}: palavra sem acento: {word}")


# ── guarda de publicação ─────────────────────────────────────────────────────
GUARD = [
    (r"\bkratos\b", "nome de agente interno"), (r"\bradar-?x\b", "sistema interno"), (r"\berp\b", "sistema interno"),
    (r"\bclickup\b", "plataforma do fluxo interno"), (r"\bhubla\b", "plataforma interna"), (r"\bkiwify\b", "plataforma interna"),
    (r"\bevolution\b", "plataforma interna"), (r"\blibelite\b|\blibpycode\b", "sistema interno"), (r"\bia master\b|\belite\b", "produto"),
    (r"\bcocrie\b|\bpaolla\b|\bzucchi\b|\bulisses\b", "pessoa ou equipe"), (r"/root/|/var/www/", "caminho de servidor"),
    (r"\bblack (november|friday|20\d\d)\b", "campanha"), (r"\bantia\b", "material editorial interno"),
    (r"@pycodebr\b|@pycode\.br\b", "conta de rede social"), (r"\b\d{2}\s?9\d{4}-?\d{4}\b", "telefone"),
    (r"R\$\s?\d", "valor em reais"), (r"\b(sk|ghp|gho|xox[bap])[-_][A-Za-z0-9_-]{16,}", "formato de token"),
    (r"-----BEGIN [A-Z ]*PRIVATE KEY-----", "chave privada"),
    (r"[\w.+-]+@(?!exemplo\.com|example\.com|users\.noreply\.github\.com)(?:[\w-]+\.)+[a-z]{2,}\b", "e-mail"),
]
GUARD_SKIP_EMAIL = re.compile(r"@(fontsource|google|media|container|keyframes|font-face|import|theme|custom-variant|supports|layer|[\d.]+/)")
RASTER = {".png", ".jpg", ".jpeg", ".webp", ".gif", ".avif"}
BINARY_OK = {"docs/examples/media/clip.mp4"}
VALUE_OK = re.compile(r"R\$ 4\.120,00")   # espécime de número na seção de tipografia


def check_guard() -> None:
    for path in tracked_files():
        rel = path.relative_to(ROOT).as_posix()
        size = path.stat().st_size
        if path.suffix.lower() in RASTER:
            if not rel.startswith("docs/img/"):
                fail(f"{rel}: imagem fora de docs/img/")
            if size > 700_000:
                fail(f"{rel}: imagem com {size // 1024} KB (limite de 700 KB)")
            continue
        if path.suffix.lower() in {".mp4", ".webm"}:
            if rel not in BINARY_OK or size > 200_000:
                fail(f"{rel}: vídeo não previsto ou acima de 200 KB")
            continue
        if path.suffix.lower() in {".woff", ".woff2", ".ttf", ".otf", ".zip", ".mp3", ".wav", ".mov", ".pdf"}:
            fail(f"{rel}: tipo de arquivo que não entra no repositório")
            continue
        if size > 900_000:
            fail(f"{rel}: arquivo com {size // 1024} KB")
        if path.suffix.lower() not in TEXT_EXT and path.name not in {"hedesign", "LICENSE", "VERSION", ".gitignore", ".nojekyll"}:
            continue
        if rel == "tests/check_repo.py":
            continue
        try:
            text = path.read_text()
        except UnicodeDecodeError:
            fail(f"{rel}: binário não previsto")
            continue
        for number, line in enumerate(text.split("\n"), 1):
            if len(line) > 4000:
                continue  # linha gerada (sprite, CSS ou JS embutido); a fonte dela é conferida no próprio arquivo
            low = line.lower()
            for pattern, label in GUARD:
                match = re.search(pattern, line if label in {"valor em reais", "formato de token", "chave privada"} else low)
                if not match:
                    continue
                if label == "e-mail" and (GUARD_SKIP_EMAIL.search(match.group(0)) or "@" + VERSION in line or "jsdelivr" in low or "@media" in low):
                    continue
                if label == "valor em reais" and VALUE_OK.search(line):
                    continue
                fail(f"{rel}:{number}: {label}: {match.group(0)[:40]}")


# ── auditoria: os exemplos passam e um erro plantado é pego ──────────────────
def check_audit() -> None:
    audit = [sys.executable, str(ROOT / "skills" / "hedesign-auditoria" / "scripts" / "audit.py")]
    out = subprocess.run(audit + [str(ROOT / "docs" / "examples")], capture_output=True, text=True)
    if out.returncode != 0:
        fail("auditoria dos exemplos com erro:\n" + out.stdout[-1500:])
    with tempfile.TemporaryDirectory() as tmp:
        bad = Path(tmp) / "tela.html"
        bad.write_text('<html><body><button class="he-btn he-btn--principal"></button><span class="he-badge" data-tone="roxo">x</span>'
                       '<button class="he-iconbtn"></button><div style="color: var(--he-tinta)"></div></body></html>')
        res = subprocess.run(audit + [str(bad), "--json"], capture_output=True, text=True)
        for rule in ["classe-desconhecida", "tom-invalido", "sem-rotulo", "token-desconhecido", "viewport"]:
            if rule not in res.stdout:
                fail(f"a auditoria deixou passar um erro plantado: {rule}")
        if res.returncode != 1:
            fail("a auditoria deveria sair com código 1 quando há erro")


def main() -> int:
    for step in (check_skills, check_version_urls, check_links, check_text, check_guard, check_audit):
        try:
            step()
        except AssertionError as exc:
            fail(str(exc))
    if problems:
        print("\n".join(problems))
        print(f"\n{len(problems)} problema(s).")
        return 1
    print("repositório conferido: skills, versão, links, texto, guarda de publicação e auditoria.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
