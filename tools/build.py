#!/usr/bin/env python3
"""Monta dist/ e tokens/ a partir de src/. Só biblioteca padrão do Python.

    python3 tools/build.py           # monta tudo
    python3 tools/build.py --check   # falha se dist/ ou tokens/ estiverem diferentes do que src/ gera (usado no CI)
"""
import json
import re
import shutil
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "src"
DIST = ROOT / "dist"
TOKENS = ROOT / "tokens"
VERSION = (ROOT / "VERSION").read_text().strip()
BANNER = f"/*! hedesign {VERSION} · MIT · https://github.com/pycodebr/hedesign */\n"
DARK = '[data-he-theme="dark"]'
AUTO = ":root:not([data-he-theme])"


def read_css() -> str:
    parts = [p.read_text().rstrip() for p in sorted((SRC / "css").glob("*.css"))]
    return "\n\n".join(parts) + "\n"


def system_dark_fallback(css: str) -> str:
    """Sem o script de tema (nenhum data-he-theme no <html>), a página segue o tema do sistema."""
    block = re.search(re.escape(DARK) + r" \{\n(.*?)\n\}\n", css, re.S)
    assert block, "bloco de tokens do tema escuro não encontrado"
    assert "html[data-he-theme" not in css, "regra de componente presa ao tema: o tema fica só nos tokens"
    body = "\n".join("  " + line for line in block.group(1).split("\n"))
    return ("\n/* Sem data-he-theme no <html> (página sem o script de tema), vale o tema do sistema */\n"
            "@media (prefers-color-scheme: dark) {\n  " + AUTO + " {\n" + body + "\n  }\n}\n")


def minify_css(css: str) -> str:
    css = re.sub(r"/\*(?!!).*?\*/", "", css, flags=re.S)
    css = re.sub(r"\s+", " ", css)
    css = re.sub(r"\s*([{};])\s*", r"\1", css)
    css = re.sub(r";}", "}", css)
    return css.strip() + "\n"


def minify_js(js: str) -> str | None:
    """Usa o terser pelo npx quando existe; sem ele, o .min.js não é gerado e o build avisa."""
    if not shutil.which("npx"):
        return None
    try:
        out = subprocess.run(["npx", "--yes", "terser@5.36.0", "--compress", "--mangle", "--comments", "/^!/"],
                             input=js, capture_output=True, text=True, timeout=240)
    except (OSError, subprocess.TimeoutExpired):
        return None
    return out.stdout if out.returncode == 0 and out.stdout.strip() else None


def parse_tokens(css: str) -> tuple[dict, dict]:
    light = re.search(r':root, \[data-he-theme="light"\] \{\n(.*?)\n\}\n', css, re.S).group(1)
    dark = re.search(re.escape(DARK) + r" \{\n(.*?)\n\}\n", css, re.S).group(1)

    def decls(block: str) -> dict:
        block = re.sub(r"/\*.*?\*/", "", block, flags=re.S)
        return {m.group(1): m.group(2).strip() for m in re.finditer(r"--he-([a-z0-9-]+):\s*([^;]+);", block)}

    return decls(light), decls(dark)


def token_type(name: str, value: str) -> str:
    if name.startswith("shadow"):
        return "shadow"
    if name.startswith("text-"):
        return "typography"
    if name in ("font", "mono"):
        return "fontFamily"
    if name in ("fast", "med"):
        return "duration"
    if name == "ease":
        return "cubicBezier"
    if "gradient" in value or name in ("rail", "ai-grad"):
        return "gradient"
    if re.fullmatch(r"#[0-9a-fA-F]{3,8}|rgba?\([^)]*\)", value):
        return "color"
    if re.fullmatch(r"-?[\d.]+(px|rem|em)", value):
        return "dimension"
    return "other"


def build_tokens(css: str) -> dict:
    light, dark = parse_tokens(css)
    out = {"$description": f"hedesign {VERSION}: tokens gerados de src/css/00-tokens.css. Valor do tema escuro em $extensions.dark.",
           "he": {}}
    for name, value in light.items():
        node = {"$value": value, "$type": token_type(name, value)}
        if name in dark and dark[name] != value:
            node["$extensions"] = {"dark": dark[name]}
        out["he"][name] = node
    return out


def tailwind_files(css: str) -> dict:
    light, _ = parse_tokens(css)
    colors = [n for n, v in light.items() if token_type(n, v) == "color"]
    js_colors = ",\n".join(f'        "{n}": "var(--he-{n})"' for n in colors)
    preset = f"""/* hedesign {VERSION}: preset do Tailwind v3. As cores apontam para os tokens CSS, então os dois temas funcionam
   sem variantes dark:. Carregue dist/hedesign.css (ou tokens/tokens.css) na página.
   Uso: module.exports = {{ presets: [require("./hedesign/tokens/tailwind.preset.js")] }} */
module.exports = {{
  darkMode: ["selector", '[data-he-theme="dark"]'],
  theme: {{
    extend: {{
      colors: {{
        he: {{
{js_colors}
        }}
      }},
      fontFamily: {{ he: "var(--he-font)", "he-mono": "var(--he-mono)" }},
      borderRadius: {{ "he-xs": "var(--he-r-xs)", "he-sm": "var(--he-r-sm)", he: "var(--he-r)", "he-lg": "var(--he-r-lg)" }},
      boxShadow: {{ "he-1": "var(--he-shadow-1)", "he-2": "var(--he-shadow-2)", "he-pop": "var(--he-shadow-pop)", "he-ai": "var(--he-shadow-ai)" }},
      spacing: {{ "he-1": "var(--he-s-1)", "he-2": "var(--he-s-2)", "he-3": "var(--he-s-3)", "he-4": "var(--he-s-4)", "he-5": "var(--he-s-5)", "he-6": "var(--he-s-6)", "he-7": "var(--he-s-7)", "he-8": "var(--he-s-8)" }},
      transitionTimingFunction: {{ he: "var(--he-ease)" }},
      transitionDuration: {{ "he-fast": "var(--he-fast)", "he-med": "var(--he-med)" }}
    }}
  }}
}};
"""
    v4_colors = "\n".join(f"  --color-he-{n}: var(--he-{n});" for n in colors)
    v4 = f"""/* hedesign {VERSION}: tema do Tailwind v4. Importe depois de dist/hedesign.css (ou tokens/tokens.css).
   Gera utilitários como bg-he-surface, text-he-ink, rounded-he, shadow-he-1 e font-he, nos dois temas. */
@custom-variant dark (&:where([data-he-theme="dark"], [data-he-theme="dark"] *));
@theme inline {{
{v4_colors}
  --font-he: var(--he-font);
  --font-he-mono: var(--he-mono);
  --radius-he-xs: var(--he-r-xs);
  --radius-he-sm: var(--he-r-sm);
  --radius-he: var(--he-r);
  --radius-he-lg: var(--he-r-lg);
  --shadow-he-1: var(--he-shadow-1);
  --shadow-he-2: var(--he-shadow-2);
  --shadow-he-pop: var(--he-shadow-pop);
  --ease-he: var(--he-ease);
}}
"""
    return {"tailwind.preset.js": preset, "tailwind-v4.css": v4}


def outputs() -> dict:
    css = read_css()
    full = BANNER + css + system_dark_fallback(css)
    tokens_css = BANNER + (SRC / "css" / "00-tokens.css").read_text()
    sprite = (SRC / "icons" / "sprite.svg").read_text().strip()
    out = {
        DIST / "hedesign.css": full,
        DIST / "hedesign.min.css": BANNER + minify_css(full),
        DIST / "hedesign-sprite.svg": sprite + "\n",
        DIST / "hedesign-fonts.css": BANNER + (SRC / "fonts" / "hedesign-fonts.css").read_text(),
        TOKENS / "tokens.css": tokens_css,
        TOKENS / "tokens.json": json.dumps(build_tokens(css), ensure_ascii=False, indent=2) + "\n",
    }
    for name, text in tailwind_files(css).items():
        out[TOKENS / name] = text
    js_path = SRC / "js" / "hedesign.js"
    if js_path.exists():
        js = js_path.read_text().replace('"@@HE_SPRITE@@"', json.dumps(sprite, ensure_ascii=False)).replace("@@HE_VERSION@@", VERSION)
        out[DIST / "hedesign.js"] = BANNER + js
        out[DIST / "hedesign-theme.js"] = BANNER + (SRC / "js" / "hedesign-theme.js").read_text()
    return out


def main() -> int:
    check = "--check" in sys.argv
    out = outputs()
    bad = []
    for path, text in out.items():
        if check:
            if not path.exists() or path.read_text() != text:
                bad.append(str(path.relative_to(ROOT)))
        else:
            path.parent.mkdir(parents=True, exist_ok=True)
            path.write_text(text)
    js = out.get(DIST / "hedesign.js")
    if js and not check:
        small = minify_js(js)
        if small:
            (DIST / "hedesign.min.js").write_text(small if small.startswith("/*!") else BANNER + small)
        else:
            print("aviso: terser indisponível, dist/hedesign.min.js não foi atualizado")
    if check:
        if bad:
            print("dist/ ou tokens/ fora de sincronia com src/ (rode python3 tools/build.py):", ", ".join(bad))
            return 1
        print("dist/ e tokens/ em sincronia com src/")
        return 0
    for path in out:
        print(f"{path.relative_to(ROOT)}  {path.stat().st_size / 1024:.1f} KB")
    return 0


if __name__ == "__main__":
    sys.exit(main())
