#!/usr/bin/env python3
"""Gera a documentação viva (docs/index.html) e a versão em arquivo único (docs/hedesign.html) a partir de docs/src/.

    python3 tools/docs.py           # gera
    python3 tools/docs.py --check   # falha se os arquivos gerados estiverem diferentes da fonte (CI)

Fonte: docs/src/layout.html e docs/src/sections/NN-nome.html. Em cada seção:
  <!-- nav: Grupo | Título -->                 primeira linha: grupo do menu e título da seção (o id vem do nome do arquivo)
  {i:nome} ou {i:nome|he-i--sm}                ícone do sprite
  <!--demo--> ... <!--/demo-->                 prévia + bloco "Ver o código" com o mesmo HTML
  <!--demo both--> ... <!--/demo-->            prévia repetida em duas ilhas de tema, clara e escura
  <!--demo plain--> ... <!--/demo-->           prévia sem a moldura (o componente já tem fundo próprio)
  <!--code--> ... <!--/code-->                 só o código, sem prévia (HTML, CSS ou JS)
"""
import base64
import html
import mimetypes
import re
import sys
import textwrap
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
DOCS = ROOT / "docs"
SRC = DOCS / "src"
VERSION = (ROOT / "VERSION").read_text().strip()
PUBLIC = "https://pycodebr.github.io/hedesign/docs/"   # onde a documentação fica publicada (GitHub Pages)


def icon(match: re.Match) -> str:
    name, _, extra = match.group(1).partition("|")
    cls = "he-i" + (" " + extra.strip() if extra else "")
    return f'<svg class="{cls}" aria-hidden="true" focusable="false"><use href="#he-i-{name.strip()}"/></svg>'


def expand_icons(text: str) -> str:
    return re.sub(r"\{i:([a-z0-9_|\- ]+)\}", icon, text)


def dedent(block: str) -> str:
    return textwrap.dedent(block.strip("\n")).strip()


def code_block(source: str, label: str = "Ver o código") -> str:
    body = html.escape(dedent(source), quote=False)
    return (f'<details class="doc-code"><summary>{label}</summary><div class="doc-code__box">'
            f'<button type="button" class="he-btn he-btn--sm doc-copy" data-doc-copy>Copiar</button>'
            f'<pre class="he-code"><code>{body}</code></pre></div></details>')


def demo(match: re.Match) -> str:
    opts = match.group(1).split()
    inner = expand_icons(match.group(2))
    cls = "doc-demo" + (" doc-demo--plain" if "plain" in opts else "")
    if "both" in opts:
        preview = (f'<div class="doc-both"><div class="{cls}" data-he-theme="light"><span class="doc-both__tag">Claro</span>{inner}</div>'
                   f'<div class="{cls}" data-he-theme="dark"><span class="doc-both__tag">Escuro</span>{inner}</div></div>')
    else:
        preview = f'<div class="{cls}">{inner}</div>'
    return preview + ("" if "nocode" in opts else code_block(inner))


def only_code(match: re.Match) -> str:
    return ('<div class="doc-code doc-code--open"><div class="doc-code__box">'
            '<button type="button" class="he-btn he-btn--sm doc-copy" data-doc-copy>Copiar</button>'
            f'<pre class="he-code"><code>{html.escape(dedent(match.group(1)), quote=False)}</code></pre></div></div>')


def render_section(path: Path) -> dict:
    raw = path.read_text()
    head = re.match(r"<!--\s*nav:\s*(.*?)\s*\|\s*(.*?)\s*-->\n", raw)
    assert head, f"{path.name}: falta a linha <!-- nav: Grupo | Título -->"
    body = raw[head.end():]
    body = re.sub(r"<!--code-->(.*?)<!--/code-->", only_code, body, flags=re.S)
    body = re.sub(r"<!--demo([a-z ]*)-->(.*?)<!--/demo-->", demo, body, flags=re.S)
    body = expand_icons(body)
    sid = re.sub(r"^\d+-", "", path.stem)
    return {"id": sid, "group": head.group(1), "title": head.group(2),
            "html": f'<section class="doc-sec" id="{sid}" data-doc-sec>\n<h2 class="doc-sec__title"><a href="#{sid}">{head.group(2)}</a></h2>\n{body}\n</section>'}


def build_nav(sections: list) -> str:
    out, group = [], None
    for sec in sections:
        if sec["group"] != group:
            if group is not None:
                out.append("</div>")
            group = sec["group"]
            out.append(f'<div class="he-side__section"><div class="he-side__label">{group}</div>')
        out.append(f'<a class="he-side__item" href="#{sec["id"]}" data-doc-nav="{sec["id"]}"><span class="he-side__text">{sec["title"]}</span></a>')
    out.append("</div>")
    return "\n".join(out)


def page(assets: dict) -> str:
    sections = [render_section(p) for p in sorted((SRC / "sections").glob("*.html"))]
    layout = (SRC / "layout.html").read_text()
    out = (layout.replace("{{nav}}", build_nav(sections))
           .replace("{{content}}", "\n\n".join(s["html"] for s in sections))
           .replace("{{version}}", VERSION))
    for key, value in assets.items():
        out = out.replace("{{" + key + "}}", value)
    return expand_icons(out)


EX_NAV = [("hoje", "painel.html", "sun", "Hoje"), ("referencias", "referencias.html", "bulb", "Referências"),
          ("planejamento", "planejamento.html", "board", "Planejamento"), ("resultados", "resultados.html", "chart", "Resultados"),
          ("conversa", "conversa.html", "comment", "Conversa")]
EX_SIDE = [(None, [("hoje", "painel.html", "compass", "Painel"), ("conversa", "conversa.html", "comment", "Conversa com a IA")]),
           ("Conteúdo", [("planejamento", "planejamento.html", "board", "Planejamento"), ("fila", "fila.html", "inbox", "Fila de revisão"),
                         ("referencias", "referencias.html", "bulb", "Referências"), ("resultados", "resultados.html", "chart", "Resultados")]),
           ("Sistema", [("ajustes", "ajustes.html", "gear", "Ajustes")]),
           ("Fora do aplicativo", [("entrar", "entrar.html", "lock", "Entrar"), ("pagina", "pagina.html", "star", "Página de apresentação"),
                                   ("leitura", "leitura.html", "file", "Leitura")])]


def example_parts(active: str) -> dict:
    """Trechos da casca dos exemplos com o destino ativo marcado."""
    def cur(key: str) -> str:
        return ' is-active" aria-current="page' if key == active else ""
    top = "\n".join(f'<a class="he-nav__item{cur(k)}" href="{h}">{{i:{i}}}<span>{t}</span>'
                    + ('<span class="he-count" data-he-count="fila">3</span>' if k == "hoje" else "") + "</a>" for k, h, i, t in EX_NAV)
    mnav = "\n".join(f'<a class="he-mnav__item{cur(k)}" href="{h}">{{i:{i}}}<span>{t}</span>'
                     + ('<span class="he-count" data-he-count="fila">3</span>' if k == "hoje" else "") + "</a>" for k, h, i, t in EX_NAV)
    side = []
    for label, items in EX_SIDE:
        side.append('<div class="he-side__section">' + (f'<div class="he-side__label">{label}</div>' if label else ""))
        for k, h, i, t in items:
            count = '<span class="he-count" data-he-count="fila" data-he-count-hide="fila">3</span>' if k == "fila" else ""
            side.append(f'<a class="he-side__item{cur(k)}" href="{h}" data-he-tip="{t}"><span class="he-side__icon">{{i:{i}}}</span>'
                        f'<span class="he-side__text">{t}</span>{count}</a>')
        side.append("</div>")
    return {"top_nav": top, "mnav": mnav, "side_nav": "\n".join(side)}


def render_example(path: Path) -> str:
    raw = path.read_text()
    head = re.match(r"<!--\s*example:\s*(.*?)\s*-->\n", raw)
    assert head, f"{path.name}: falta a linha <!-- example: Título | active: chave | shell: app|plain|bare | page: classes -->"
    meta = {"title": head.group(1).split("|")[0].strip(), "active": "", "shell": "app", "page": "", "html": ""}
    for part in head.group(1).split("|")[1:]:
        key, _, value = part.partition(":")
        meta[key.strip()] = value.strip()
    layout = (SRC / f"example-{meta['shell']}.html").read_text()
    out = layout.replace("{{content}}", raw[head.end():]).replace("{{title}}", meta["title"]).replace("{{page}}", meta["page"])
    out = out.replace("{{html_class}}", meta["html"]).replace("{{version}}", VERSION)
    for key, value in example_parts(meta["active"]).items():
        out = out.replace("{{" + key + "}}", value)
    return expand_icons(out)


def data_uri(path: Path) -> str:
    mime = mimetypes.guess_type(path.name)[0] or "application/octet-stream"
    return f"data:{mime};base64,{base64.b64encode(path.read_bytes()).decode()}"


def inline_media(text: str) -> str:
    """Troca src="examples/media/arquivo" por data URI (versão em arquivo único)."""
    def repl(match: re.Match) -> str:
        path = DOCS / match.group(2)
        return f'{match.group(1)}"{data_uri(path)}"' if path.exists() and path.stat().st_size < 400_000 else match.group(0)
    return re.sub(r'((?:src|poster)=)"(examples/media/[^"]+)"', repl, text)


def outputs() -> dict:
    linked = {
        "head_assets": ('<link rel="stylesheet" href="../dist/hedesign-fonts.css">\n<link rel="stylesheet" href="../dist/hedesign.css">\n'
                        '<link rel="stylesheet" href="assets/docs.css">\n<script src="../dist/hedesign-theme.js"></script>'),
        "body_assets": '<script src="../dist/hedesign.js"></script>\n<script src="assets/docs.js"></script>',
    }
    css = (ROOT / "dist" / "hedesign.css").read_text()
    fonts = (ROOT / "dist" / "hedesign-fonts.css").read_text()
    theme = (ROOT / "dist" / "hedesign-theme.js").read_text() if (ROOT / "dist" / "hedesign-theme.js").exists() else ""
    js = (ROOT / "dist" / "hedesign.js").read_text() if (ROOT / "dist" / "hedesign.js").exists() else ""
    single = {
        "head_assets": (f"<style>\n{fonts}\n{css}\n{(DOCS / 'assets' / 'docs.css').read_text()}</style>\n<script>\n{theme}</script>"),
        "body_assets": "<script>\n" + js.replace("</script", "<\\/script") + "</script>\n<script>\n" + (DOCS / "assets" / "docs.js").read_text() + "</script>",
    }
    alone = inline_media(page(single))
    for attr, folder in (("href", "examples/"), ("src", "examples/"), ("src", "img/")):
        alone = alone.replace(f'{attr}="{folder}', f'{attr}="{PUBLIC}{folder}')
    out = {DOCS / "index.html": page(linked), DOCS / "hedesign.html": alone}
    for path in sorted((SRC / "examples").glob("*.html")):
        out[DOCS / "examples" / path.name] = render_example(path)
    return out


def main() -> int:
    check = "--check" in sys.argv
    bad = []
    for path, text in outputs().items():
        if check:
            if not path.exists() or path.read_text() != text:
                bad.append(str(path.relative_to(ROOT)))
        else:
            path.write_text(text)
            print(f"{path.relative_to(ROOT)}  {len(text.encode()) / 1024:.0f} KB")
    if check and bad:
        print("documentação fora de sincronia com docs/src (rode python3 tools/docs.py):", ", ".join(bad))
        return 1
    return 0


if __name__ == "__main__":
    sys.exit(main())
