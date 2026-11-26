#!/usr/bin/env bash
# Baixa a Inter variável (SIL OFL 1.1) para uma pasta do seu projeto, confere o sha256 e grava um hedesign-fonts.css
# que aponta para os arquivos locais.   Uso: bash scripts/fonts.sh <pasta-de-destino>
set -euo pipefail
DEST="${1:?informe a pasta de destino, por exemplo static/hedesign}"
VERSION="5.3.0"
BASE="https://cdn.jsdelivr.net/npm/@fontsource-variable/inter@${VERSION}/files"
mkdir -p "$DEST/fonts"

sha_of() { if command -v sha256sum >/dev/null 2>&1; then sha256sum "$1" | cut -d' ' -f1; else shasum -a 256 "$1" | cut -d' ' -f1; fi; }
fetch() { # arquivo sha256
  local out="$DEST/fonts/$1"
  if [ ! -f "$out" ] || [ "$(sha_of "$out")" != "$2" ]; then curl -fsSL "$BASE/$1" -o "$out"; fi
  if [ "$(sha_of "$out")" != "$2" ]; then echo "[hedesign] sha256 diferente do esperado em $1; arquivo removido" >&2; rm -f "$out"; exit 1; fi
}
fetch inter-latin-wght-normal.woff2 3100e775e8616cd2611beecfa23a4263d7037586789b43f035236a2e6fbd4c62
fetch inter-latin-ext-wght-normal.woff2 34b9c504cab7a73e37b746343a449132e56cf7b5481af2cb81dc74dcff25c956

cat > "$DEST/hedesign-fonts.css" <<'CSS'
/* hedesign · Inter variável servida do seu domínio. Licença da fonte: SIL Open Font License 1.1 (fonts/OFL.txt). */
@font-face {
  font-family: "Inter"; font-style: normal; font-weight: 400 700; font-display: swap;
  src: url("fonts/inter-latin-wght-normal.woff2") format("woff2");
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}
@font-face {
  font-family: "Inter"; font-style: normal; font-weight: 400 700; font-display: swap;
  src: url("fonts/inter-latin-ext-wght-normal.woff2") format("woff2");
  unicode-range: U+0100-02BA, U+02BD-02C5, U+02C7-02CC, U+02CE-02D7, U+02DD-02FF, U+0304, U+0308, U+0329, U+1D00-1DBF, U+1E00-1E9F, U+1EF2-1EFF, U+2020, U+20A0-20AB, U+20AD-20C4, U+2113, U+2C60-2C7F, U+A720-A7FF;
}
CSS
curl -fsSL "https://cdn.jsdelivr.net/npm/@fontsource-variable/inter@${VERSION}/LICENSE" -o "$DEST/fonts/OFL.txt" || echo "[hedesign] aviso: não consegui baixar o texto da licença da fonte (SIL OFL 1.1)" >&2
echo "[hedesign] fontes em $DEST/fonts e $DEST/hedesign-fonts.css"
