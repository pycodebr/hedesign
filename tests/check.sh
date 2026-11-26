#!/usr/bin/env bash
# Tudo o que o CI confere sem navegador. Rode antes de qualquer commit:  bash tests/check.sh
set -euo pipefail
cd "$(dirname "$0")/.."
echo "== sintaxe dos scripts de shell"
bash -n install.sh; bash -n bin/hedesign; bash -n scripts/fonts.sh; bash -n tests/install.sh
echo "== dist/ e tokens/ em sincronia com src/"
python3 tools/build.py --check
echo "== documentação e exemplos em sincronia com docs/src/"
python3 tools/docs.py --check
echo "== skills, versão, links, texto, guarda de publicação e auditoria"
python3 tests/check_repo.py
echo "tudo certo."
