#!/usr/bin/env python3
"""Capturas de uma tela nos dois temas e em duas larguras, com um relatório do que dá para medir.

    python3 shots.py <url-ou-arquivo.html> [--out pasta] [--full]

Precisa do Playwright (pip install playwright; python -m playwright install chromium). Relata por captura: rolagem
horizontal da página, erros de console, pedidos que falharam e alvos de toque menores que 40 px na largura de celular.
Sai com código 1 se houver rolagem horizontal ou erro de console.
"""
import json
import sys
from pathlib import Path

SIZES = {"1440": (1440, 900), "390": (390, 844)}
THEMES = ("light", "dark")
SMALL_TARGETS = """
() => [...document.querySelectorAll('a[href], button, [role="button"], [role="switch"], input:not([type="hidden"]), select, textarea')]
  .filter((el) => { const r = el.getBoundingClientRect(); const s = getComputedStyle(el);
    if (!r.width || !r.height || s.visibility === 'hidden' || s.display === 'none') return false;
    if (el.closest('.he-prose, p, li, .he-crumbs') && el.tagName === 'A') return false;      // link dentro de texto
    const after = getComputedStyle(el, '::after'); const pad = after.content !== 'none' && after.position === 'absolute';
    return !pad && (r.height < 39.5 && r.width < 39.5); })
  .slice(0, 12).map((el) => (el.getAttribute('aria-label') || el.textContent || el.tagName).trim().slice(0, 40))
"""


def main() -> int:
    args = [a for a in sys.argv[1:] if not a.startswith("--")]
    if not args:
        print(__doc__)
        return 2
    try:
        from playwright.sync_api import sync_playwright
    except ImportError:
        print("Playwright não instalado. Rode: pip install playwright && python -m playwright install chromium")
        return 2
    target = args[0]
    url = target if "://" in target else Path(target).resolve().as_uri()
    out = Path(sys.argv[sys.argv.index("--out") + 1]) if "--out" in sys.argv else Path("he-shots")
    out.mkdir(parents=True, exist_ok=True)
    full = "--full" in sys.argv
    report, bad = [], False
    with sync_playwright() as pw:
        browser = pw.chromium.launch(args=["--no-sandbox"])
        for theme in THEMES:
            for name, (width, height) in SIZES.items():
                context = browser.new_context(viewport={"width": width, "height": height}, color_scheme=theme,
                                              has_touch=name == "390", is_mobile=name == "390")
                context.add_init_script(f'try {{ localStorage.setItem("he.theme", "{theme}"); }} catch (e) {{}}')
                page = context.new_page()
                errors, failed = [], []
                page.on("console", lambda m, errors=errors: errors.append(m.text[:200]) if m.type == "error" else None)
                page.on("pageerror", lambda e, errors=errors: errors.append(str(e)[:200]))
                page.on("requestfailed", lambda r, failed=failed: failed.append(r.url[:120]))
                page.goto(url, wait_until="networkidle")
                page.wait_for_timeout(500)
                overflow = page.evaluate("document.documentElement.scrollWidth - document.documentElement.clientWidth")
                small = page.evaluate(SMALL_TARGETS) if name == "390" else []
                shot = out / f"{name}-{theme}.png"
                page.screenshot(path=str(shot), full_page=full)
                item = {"shot": str(shot), "theme": page.evaluate("document.documentElement.getAttribute('data-he-theme')"),
                        "overflow_px": overflow, "console_errors": errors, "failed_requests": failed, "small_targets": small}
                report.append(item)
                bad = bad or overflow > 1 or bool(errors)
                context.close()
        browser.close()
    (out / "report.json").write_text(json.dumps(report, ensure_ascii=False, indent=2))
    for item in report:
        flags = []
        if item["overflow_px"] > 1:
            flags.append(f'rolagem horizontal de {item["overflow_px"]}px')
        if item["console_errors"]:
            flags.append(f'{len(item["console_errors"])} erro(s) de console')
        if item["failed_requests"]:
            flags.append(f'{len(item["failed_requests"])} pedido(s) falharam')
        if item["small_targets"]:
            flags.append("alvos pequenos: " + "; ".join(item["small_targets"][:5]))
        print(f'{item["shot"]}  tema={item["theme"]}  ' + ("; ".join(flags) if flags else "sem achados medidos"))
    print(f"relatório em {out / 'report.json'}. Abra as capturas e olhe: alinhamento e hierarquia não aparecem aqui.")
    return 1 if bad else 0


if __name__ == "__main__":
    sys.exit(main())
