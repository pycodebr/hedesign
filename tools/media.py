#!/usr/bin/env python3
"""Gera as imagens fictícias dos exemplos (docs/examples/media/*.svg). Só biblioteca padrão.

    python3 tools/media.py

São capas de publicações inventadas para a marca fictícia dos exemplos. Edite a lista e rode de novo.
"""
from pathlib import Path

OUT = Path(__file__).resolve().parent.parent / "docs" / "examples" / "media"
HANDLE = "@estudionorte"
# nome, rótulo, linhas do título, cor inicial, cor final
POSTS = [
    ("s1", "CAPA", ["5 erros no seu", "primeiro agente"], "#1d2a6b", "#0075de"),
    ("s2", "ERRO 1", ["1. Pedir tudo", "de uma vez"], "#101012", "#3b2a66"),
    ("s3", "ERRO 2", ["2. Não dar", "contexto"], "#0f3d3a", "#1f9c97"),
    ("s4", "ERRO 3", ["3. Ignorar", "o retorno"], "#4a1f3d", "#d23fa0"),
    ("s5", "FECHO", ["Salve para", "consultar depois"], "#3d2208", "#dd5b00"),
    ("s6", "VÍDEO", ["Python em", "30 segundos"], "#143d1f", "#1a8a35"),
    ("s7", "STORY", ["Bastidores", "da gravação"], "#22262e", "#5b6b82"),
    ("s8", "CAPA", ["O prompt que", "mudou meu fluxo"], "#2b1b4d", "#8a55cc"),
    ("s9", "CAPA", ["Checklist de", "publicação"], "#0b2e4f", "#3d8fd6"),
    ("s10", "VÍDEO", ["3 ganchos que", "seguram a audiência"], "#4a1c0a", "#dd5b00"),
    ("s11", "ENQUETE", ["Qual tema para", "a próxima aula?"], "#12343b", "#1f9c97"),
    ("s12", "CAPA", ["Como eu organizo", "um repositório"], "#1f2430", "#6537a6"),
]
# nome, cor inicial, cor final (recortes de referência, sem texto)
CLIPS = [("i1", "#e8d9c5", "#c9a27a"), ("i2", "#cfe3f5", "#7fb2e0"), ("i3", "#e6d7f5", "#a985dc"), ("i4", "#d6efe3", "#6fbf9a")]


def post(label: str, lines: list, start: str, end: str) -> str:
    size = 92 if max(len(line) for line in lines) <= 16 else 78
    spans = "".join(f'<tspan x="80" dy="{0 if i == 0 else size + 12}">{line}</tspan>' for i, line in enumerate(lines))
    font = 'font-family="Inter, Arial, sans-serif"'
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1080 1350" width="1080" height="1350"><defs>'
            f'<linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="{start}"/><stop offset="1" stop-color="{end}"/>'
            f'</linearGradient></defs><rect width="1080" height="1350" fill="url(#g)"/>'
            f'<circle cx="900" cy="230" r="260" fill="#fff" opacity=".07"/><circle cx="160" cy="1180" r="200" fill="#fff" opacity=".05"/>'
            f'<text x="80" y="150" {font} font-size="34" font-weight="700" fill="#fff" opacity=".7" letter-spacing="6">{label}</text>'
            f'<text x="80" y="620" {font} font-size="{size}" font-weight="800" fill="#fff" letter-spacing="-3">{spans}</text>'
            f'<text x="80" y="1260" {font} font-size="34" font-weight="600" fill="#fff" opacity=".75">{HANDLE}</text></svg>\n')


def clip(start: str, end: str) -> str:
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 1000" width="800" height="1000"><defs>'
            f'<linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="{start}"/><stop offset="1" stop-color="{end}"/>'
            f'</linearGradient></defs><rect width="800" height="1000" fill="url(#g)"/>'
            f'<rect x="96" y="180" width="400" height="300" rx="24" fill="#fff" opacity=".55"/>'
            f'<circle cx="576" cy="660" r="128" fill="#fff" opacity=".4"/></svg>\n')


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    for name, label, lines, start, end in POSTS:
        (OUT / f"{name}.svg").write_text(post(label, lines, start, end))
    for name, start, end in CLIPS:
        (OUT / f"{name}.svg").write_text(clip(start, end))
    print(f"{len(POSTS) + len(CLIPS)} imagens em {OUT}")


if __name__ == "__main__":
    main()
