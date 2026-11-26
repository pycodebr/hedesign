#!/usr/bin/env python3
"""Abre a documentação e todos os exemplos nos dois temas e em duas larguras e confere o que dá para medir:
rolagem horizontal, erros de console, imagens quebradas, tema aplicado e fontes do sistema carregadas.

    python3 tests/pages.py [--shots pasta] [nome ...]      # nomes: docs, galeria, painel, fila etc.; sem nomes, confere tudo
"""
import sys
from pathlib import Path

from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parent.parent
SIZES = [(1440, 900), (390, 844)]


def key(path: Path) -> str:
    """Nome de uma página nos argumentos e nas capturas: docs para a documentação, galeria para a lista de exemplos."""
    if path.parent.name == "docs":
        return "docs"
    return "galeria" if path.stem == "index" else path.stem


def targets(names: list) -> list:
    pages = [ROOT / "docs" / "index.html"] + sorted((ROOT / "docs" / "examples").glob("*.html"))
    return [p for p in pages if not names or key(p) in names]


def main() -> int:
    args = [a for a in sys.argv[1:] if not a.startswith("--")]
    shots = None
    if "--shots" in sys.argv:
        shots = Path(sys.argv[sys.argv.index("--shots") + 1])
        args = [a for a in args if a != str(shots)]
        shots.mkdir(parents=True, exist_ok=True)
    failures, count = [], 0
    with sync_playwright() as pw:
        browser = pw.chromium.launch(args=["--no-sandbox"])
        for path in targets(args):
            for theme in ("light", "dark"):
                for width, height in SIZES:
                    context = browser.new_context(viewport={"width": width, "height": height}, color_scheme=theme)
                    context.add_init_script(f'try {{ localStorage.setItem("he.theme", "{theme}"); }} catch (e) {{}}')
                    page = context.new_page()
                    errors = []
                    page.on("console", lambda m, errors=errors: errors.append(m.text[:160]) if m.type == "error" else None)
                    page.on("pageerror", lambda e, errors=errors: errors.append(str(e)[:160]))
                    page.goto(path.as_uri(), wait_until="load")
                    page.wait_for_timeout(350)
                    info = page.evaluate("""() => ({
                        theme: document.documentElement.getAttribute('data-he-theme'),
                        overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
                        broken: [...document.images].filter((i) => i.complete && !i.naturalWidth && !i.loading).map((i) => i.getAttribute('src')),
                        he: typeof window.HE === 'object',
                        sprite: !!document.getElementById('he-sprite'),
                        bg: getComputedStyle(document.body).backgroundColor
                    })""")
                    label = f"{path.relative_to(ROOT / 'docs')} {width} {theme}"
                    bad = []
                    if info["theme"] != theme:
                        bad.append(f"tema {info['theme']}")
                    if info["overflow"] > 1:
                        bad.append(f"rolagem horizontal de {info['overflow']}px")
                    if errors:
                        bad.append("console: " + " | ".join(errors[:3]))
                    if info["broken"]:
                        bad.append("imagem quebrada: " + ", ".join(info["broken"][:3]))
                    if not info["he"] or not info["sprite"]:
                        bad.append("window.HE ou o sprite não carregou")
                    expected = "rgb(244, 242, 238)" if theme == "light" else "rgb(19, 19, 22)"
                    if info["bg"] != expected and "pagina" not in path.stem:
                        bad.append(f"fundo {info['bg']}")
                    if shots:
                        page.screenshot(path=str(shots / f"{key(path)}-{width}-{theme}.png"))
                    count += 1
                    if bad:
                        failures.append(f"FALHA {label}: " + "; ".join(bad))
                    context.close()
        browser.close()
    print("\n".join(failures) if failures else "sem achados.")
    print(f"{count} combinações conferidas, {len(failures)} com falha.")
    return 1 if failures else 0


if __name__ == "__main__":
    sys.exit(main())
