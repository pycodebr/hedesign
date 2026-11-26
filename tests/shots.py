#!/usr/bin/env python3
"""Refaz as capturas do README e da documentação (docs/img/*.webp). Precisa do Playwright e do Pillow.

    python3 tests/shots.py            # todas
    python3 tests/shots.py painel     # só as que têm esse trecho no nome
"""
import io
import sys
from pathlib import Path

from PIL import Image
from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "docs" / "img"
EXAMPLES = ["painel", "planejamento", "fila", "item", "referencias", "resultados", "ajustes", "conversa", "entrar", "pagina", "leitura"]
MOBILE = ["painel", "planejamento", "fila", "item", "conversa", "resultados"]
SECTIONS = ["cores", "tons", "tipografia", "medidas", "movimento", "botoes", "campos", "cartoes", "quadro", "numeros", "vazio", "ia",
            "estudio", "decisao", "recortes"]


def save(png: bytes, name: str, width: int | None = None) -> None:
    image = Image.open(io.BytesIO(png)).convert("RGB")
    if width and image.width > width:
        image = image.resize((width, round(image.height * width / image.width)), Image.LANCZOS)
    path = OUT / f"{name}.webp"
    image.save(path, "WEBP", quality=84, method=6)
    print(f"{path.relative_to(ROOT)}  {path.stat().st_size // 1024} KB")


def split(light: bytes, dark: bytes) -> bytes:
    """Metade clara e metade escura da mesma tela, com corte inclinado."""
    a, b = Image.open(io.BytesIO(light)).convert("RGB"), Image.open(io.BytesIO(dark)).convert("RGB")
    mask = Image.new("L", a.size, 0)
    lean = a.height // 5
    for y in range(a.height):
        edge = a.width // 2 + lean // 2 - round(lean * y / a.height)
        mask.paste(255, (edge, y, a.width, y + 1))
    out = Image.composite(b, a, mask)
    buffer = io.BytesIO()
    out.save(buffer, "PNG")
    return buffer.getvalue()


def main() -> None:
    wanted = [a for a in sys.argv[1:] if not a.startswith("--")]
    want = lambda name: not wanted or any(w in name for w in wanted)
    OUT.mkdir(parents=True, exist_ok=True)
    with sync_playwright() as pw:
        browser = pw.chromium.launch(args=["--no-sandbox"])

        def open_page(path: Path, theme: str, width: int, height: int, scale: float = 1):
            context = browser.new_context(viewport={"width": width, "height": height}, color_scheme=theme, device_scale_factor=scale)
            context.add_init_script(f'try {{ localStorage.setItem("he.theme", "{theme}"); }} catch (e) {{}}')
            page = context.new_page()
            page.goto(path.as_uri(), wait_until="load")
            page.evaluate("document.fonts.ready.then(() => true)")
            page.wait_for_timeout(700)
            return context, page

        shots = {}
        for name in EXAMPLES:
            for theme in ("light", "dark"):
                if not (want(f"exemplo-{name}") or (name == "painel" and want("capa"))):
                    continue
                context, page = open_page(ROOT / "docs" / "examples" / f"{name}.html", theme, 1440, 900)
                shots[(name, theme)] = page.screenshot()
                save(shots[(name, theme)], f"exemplo-{name}-{theme}", 1280)
                context.close()
        if want("capa") and ("painel", "light") in shots:
            save(split(shots[("painel", "light")], shots[("painel", "dark")]), "capa", 1440)
        for name in MOBILE:
            for theme in ("light", "dark"):
                if not want(f"celular-{name}"):
                    continue
                context, page = open_page(ROOT / "docs" / "examples" / f"{name}.html", theme, 390, 844, 2)
                save(page.screenshot(), f"celular-{name}-{theme}", 520)
                context.close()
        todo = [s for s in SECTIONS if want(f"doc-{s}")]
        if todo:
            # as seções já mostram os dois temas lado a lado, então uma captura clara basta
            context, page = open_page(ROOT / "docs" / "index.html", "light", 1440, 900)
            page.add_style_tag(content="html { scroll-behavior: auto !important; } .he-dock { display: none !important; }")
            for section in todo:
                page.evaluate("id => { const s = document.getElementById(id); window.scrollTo(0, s.getBoundingClientRect().top + scrollY - 64); }", section)
                page.wait_for_timeout(300)
                save(page.screenshot(), f"doc-{section}", 1280)
            context.close()
        browser.close()


if __name__ == "__main__":
    main()
