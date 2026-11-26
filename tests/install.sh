#!/usr/bin/env bash
# Instala o hedesign a partir deste checkout em uma pasta pessoal isolada, usa os comandos e desinstala.
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT
export HOME="$TMP/home"
mkdir -p "$HOME/.claude" "$HOME/.codex" "$HOME/.hermes" "$TMP/projeto"
export PATH="$HOME/.local/bin:$PATH"

bash "$ROOT/install.sh"
for d in "$HOME/.claude/skills" "$HOME/.agents/skills" "$HOME/.hermes/skills/creative"; do
  for s in hedesign hedesign-telas hedesign-auditoria; do
    [ -f "$d/$s/SKILL.md" ] || { echo "FALHA: $d/$s não foi ligada"; exit 1; }
  done
done
hedesign doctor
[ "$(hedesign version)" = "$(cat "$ROOT/VERSION")" ] || { echo "FALHA: versão diferente"; exit 1; }

hedesign add "$TMP/projeto/static/hedesign"
for f in hedesign.css hedesign.js hedesign-theme.js hedesign-fonts.css; do
  [ -s "$TMP/projeto/static/hedesign/$f" ] || { echo "FALHA: $f não foi copiado"; exit 1; }
done
cat > "$TMP/projeto/index.html" <<'HTML'
<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<link rel="stylesheet" href="static/hedesign/hedesign.css"><script src="static/hedesign/hedesign-theme.js"></script></head>
<body><main class="he-main"><div class="he-page"><button class="he-btn he-btn--primary">Salvar</button></div></main></body></html>
HTML
hedesign audit "$TMP/projeto/index.html"

bash "$ROOT/install.sh" --uninstall
[ ! -e "$HOME/.claude/skills/hedesign" ] || { echo "FALHA: a skill continuou depois de desinstalar"; exit 1; }
[ ! -e "$HOME/.local/bin/hedesign" ] || { echo "FALHA: o comando continuou depois de desinstalar"; exit 1; }
echo "instalação, uso e desinstalação conferidos."
