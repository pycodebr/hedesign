#!/usr/bin/env python3
"""Abre a documentação e todos os exemplos nos dois temas e em duas larguras e confere o que dá para medir:
rolagem horizontal, erros de console, imagens quebradas, tema aplicado e fontes do sistema carregadas.
Nas páginas com menu lateral, recolhe o menu numa janela baixa e confere que nenhum item some e que dá para expandir de novo.

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


COLLAPSED = """() => {
    const items = [...document.querySelectorAll('.he-sidebar .he-side__item')];
    const seen = (n) => { if (!n) return false; const r = n.getBoundingClientRect(); return r.width > 4 && r.height > 4; };
    const toggle = document.querySelector('.he-sidebar [data-he-sidebar-toggle]');
    const r = toggle.getBoundingClientRect();
    const side = document.querySelector('.he-side');
    return {
        collapsed: document.documentElement.classList.contains('he-nav-collapsed'),
        blank: items.filter((i) => !seen(i.querySelector('.he-side__icon')) && !seen(i.querySelector('.he-side__text'))).length,
        unnamed: items.filter((i) => !i.getAttribute('data-he-tip')).length,
        inside: r.top >= 0 && r.bottom <= innerHeight,
        reachable: toggle.contains(document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2)),
        sideways: side.scrollWidth - side.clientWidth
    };
}"""


def collapsed_menu(page) -> list:
    """Menu lateral recolhido em uma janela baixa: todo item mostra ícone ou inicial e tem nome na dica, o botão do
    rodapé cabe na janela e o menu volta a abrir. Devolve a lista de achados."""
    toggle = ".he-sidebar [data-he-sidebar-toggle]"
    if not page.locator(toggle).count():
        return []
    page.set_viewport_size({"width": 1440, "height": 560})
    page.click(toggle)
    page.wait_for_timeout(300)
    info = page.evaluate(COLLAPSED)
    bad = []
    if not info["collapsed"]:
        bad.append("o menu não recolheu")
    if info["blank"]:
        bad.append(f"{info['blank']} item(ns) em branco no menu recolhido")
    if info["unnamed"]:
        bad.append(f"{info['unnamed']} item(ns) do menu sem data-he-tip")
    if not info["inside"] or not info["reachable"]:
        bad.append("botão de expandir fora da janela com o menu recolhido")
    if info["sideways"] > 0:
        bad.append("o menu recolhido rola de lado")
    if not bad:
        page.click(toggle)
        if page.evaluate("() => document.documentElement.classList.contains('he-nav-collapsed')"):
            bad.append("o menu não expandiu de volta")
    return bad


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
                    if width >= 1024 and theme == "light":
                        bad += collapsed_menu(page)
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
