#!/usr/bin/env bash
# Instalador do hedesign: baixa o design system, liga as skills nos seus agentes de IA e cria o comando `hedesign`.
#   curl -fsSL https://raw.githubusercontent.com/pycodebr/hedesign/main/install.sh | bash
#   bash install.sh [--agent claude|codex|gemini|opencode|cursor|hermes|all] [--copy] [--assets PASTA] [--uninstall]
# Sem sudo. Nada é instalado fora de ~/.hedesign, de ~/.local/bin/hedesign e das pastas de skills dos agentes.
set -euo pipefail
REPO="https://github.com/pycodebr/hedesign"
HOME_DIR="${HEDESIGN_HOME:-$HOME/.hedesign}"
SRC="$HOME_DIR/src"
AGENT="auto"; MODE="link"; ASSETS=""; UNINSTALL=0
while [ $# -gt 0 ]; do
  case "$1" in
    --agent) AGENT="$2"; shift 2 ;;
    --copy) MODE="copy"; shift ;;
    --assets) ASSETS="$2"; shift 2 ;;
    --uninstall) UNINSTALL=1; shift ;;
    *) echo "opção desconhecida: $1"; exit 2 ;;
  esac
done
say() { printf '\033[1;35m[hedesign]\033[0m %s\n' "$*"; }
ALL="claude codex gemini opencode cursor hermes"
skill_dir_for() {
  case "$1" in
    claude) echo "$HOME/.claude/skills" ;;
    codex) echo "$HOME/.agents/skills" ;;
    gemini) echo "$HOME/.gemini/skills" ;;
    opencode) echo "$HOME/.config/opencode/skills" ;;
    cursor) echo "$HOME/.cursor/skills" ;;
    hermes) echo "$HOME/.hermes/skills/creative" ;;
    *) echo "" ;;
  esac
}
marker_for() {
  case "$1" in
    claude) echo "$HOME/.claude" ;;
    codex) echo "$HOME/.codex" ;;
    gemini) echo "$HOME/.gemini" ;;
    opencode) echo "$HOME/.config/opencode" ;;
    cursor) echo "$HOME/.cursor" ;;
    hermes) echo "$HOME/.hermes" ;;
  esac
}

if [ "$UNINSTALL" = 1 ]; then
  for a in $ALL; do
    d="$(skill_dir_for "$a")"
    for s in hedesign hedesign-telas hedesign-auditoria; do
      if [ -L "$d/$s" ] || [ -f "$d/$s/.hedesign-installed" ]; then rm -rf "${d:?}/$s"; say "removido $d/$s"; fi
    done
  done
  d="$HOME/.agents/skills"
  for s in hedesign hedesign-telas hedesign-auditoria; do if [ -L "$d/$s" ] || [ -f "$d/$s/.hedesign-installed" ]; then rm -rf "${d:?}/$s"; say "removido $d/$s"; fi; done
  [ -L "$HOME/.local/bin/hedesign" ] && rm -f "$HOME/.local/bin/hedesign" && say "removido ~/.local/bin/hedesign"
  rm -rf "$HOME_DIR" && say "removido $HOME_DIR"
  exit 0
fi

# código-fonte: este checkout, ou clone/atualização em ~/.hedesign/src, ou o pacote do main quando não há git
HERE=""
if [ -n "${BASH_SOURCE[0]:-}" ] && [ -f "${BASH_SOURCE[0]}" ]; then HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"; fi
if [ -n "$HERE" ] && [ -f "$HERE/skills/hedesign/SKILL.md" ]; then SRC="$HERE"
elif [ -d "$SRC/.git" ]; then git -C "$SRC" pull --ff-only -q || say "aviso: não consegui atualizar $SRC; sigo com a versão instalada"
elif command -v git >/dev/null 2>&1; then mkdir -p "$HOME_DIR"; rm -rf "$SRC"; git clone -q --depth 1 "$REPO.git" "$SRC"
else
  command -v curl >/dev/null 2>&1 || { say "preciso do git ou do curl para baixar o hedesign"; exit 1; }
  mkdir -p "$SRC"; curl -fsSL "$REPO/archive/refs/heads/main.tar.gz" | tar -xz -C "$SRC" --strip-components 1
fi
say "código-fonte: $SRC (versão $(cat "$SRC/VERSION"))"

# comando
mkdir -p "$HOME/.local/bin"
chmod +x "$SRC/bin/hedesign" 2>/dev/null || true
ln -sfn "$SRC/bin/hedesign" "$HOME/.local/bin/hedesign"
case ":$PATH:" in *":$HOME/.local/bin:"*) ;; *) say "aviso: ~/.local/bin não está no PATH; use $HOME/.local/bin/hedesign ou acrescente a pasta ao PATH" ;; esac

# agentes
targets=""
if [ "$AGENT" = "all" ]; then targets="$ALL"
elif [ "$AGENT" = "auto" ]; then
  for a in $ALL; do [ -d "$(marker_for "$a")" ] && targets="$targets $a"; done
else targets="$AGENT"; fi
link_into() { # pasta-de-skills
  local dir="$1" s
  mkdir -p "$dir"
  for s in hedesign hedesign-telas hedesign-auditoria; do
    rm -rf "${dir:?}/$s"
    if [ "$MODE" = "copy" ]; then cp -R "$SRC/skills/$s" "$dir/$s"; : > "$dir/$s/.hedesign-installed"; else ln -s "$SRC/skills/$s" "$dir/$s"; fi
  done
  say "skills ligadas em $dir"
}
if [ -z "$(echo "$targets" | tr -d ' ')" ]; then link_into "$HOME/.agents/skills"; say "nenhum agente detectado: usei ~/.agents/skills (lida por Codex, Gemini CLI e outros)"
else
  for a in $targets; do
    d="$(skill_dir_for "$a")"
    [ -n "$d" ] || { say "agente desconhecido: $a"; exit 2; }
    link_into "$d"
  done
fi

# arquivos do design system dentro do projeto (opcional)
if [ -n "$ASSETS" ]; then bash "$SRC/bin/hedesign" add "$ASSETS"; fi

bash "$SRC/bin/hedesign" doctor || true
say "pronto. Peça ao seu agente: \"aplique o hedesign neste projeto\". Leitura inicial: $SRC/llms.txt"
