# Como contribuir

## Onde mexer

| Quero mudar | Edite | Gerado a partir disso |
|---|---|---|
| Tokens, base, casca, componentes | `src/css/*.css` | `dist/hedesign.css`, `dist/hedesign.min.css`, `tokens/*` |
| Comportamentos | `src/js/hedesign.js`, `src/js/hedesign-theme.js` | `dist/hedesign.js`, `dist/hedesign.min.js`, `dist/hedesign-theme.js` |
| Ícones | `src/icons/sprite.svg` | `dist/hedesign-sprite.svg` e o sprite dentro do JS |
| Documentação | `docs/src/layout.html`, `docs/src/sections/*.html`, `docs/assets/` | `docs/index.html`, `docs/hedesign.html` |
| Exemplos | `docs/src/examples/*.html`, `docs/src/example-*.html`, `docs/examples/assets/` | `docs/examples/*.html` |
| Skills | `skills/<nome>/` | nada |

Nunca edite um arquivo gerado. Depois de mexer na fonte:

```bash
python3 tools/build.py     # dist/ e tokens/
python3 tools/docs.py      # documentação e exemplos
bash tests/check.sh        # tudo o que o CI confere
```

## Regras do sistema

- Tema só pelos tokens. Nenhuma regra de componente pode depender de `[data-he-theme]`; o build falha se encontrar.
- Token novo de cor tem valor nos dois temas e, se for texto, 4,5:1 sobre a superfície em que aparece.
- Componente novo usa só tokens, tem foco visível, alvo de 40 px, versão de celular e respeita movimento reduzido.
- Componente novo entra com uma seção na documentação (prévia e código) e uma linha em
  `skills/hedesign/references/componentes.md`.
- Texto em português do Brasil, com acentuação completa, frases inteiras, sem travessão e sem reticências.
- Exemplos e capturas usam dados fictícios. Nada de marca, pessoa, número ou endereço de um caso verdadeiro.
- Nenhum arquivo de terceiros entra no repositório (fontes, bibliotecas, sons, imagens de banco).

## Publicar uma versão

1. Atualize `VERSION` e acrescente a seção no topo do `CHANGELOG.md`, com a data entre parênteses.
2. Atualize o número da versão nas URLs do jsDelivr do `README.md`, do `llms.txt`, da skill `hedesign` e da seção
   Instalar da documentação. `bash tests/check.sh` aponta o que ficou para trás.
3. Rode o build, a documentação e os testes. Refaça as capturas com `python3 tests/shots.py` se algo visual mudou.
4. Commit, push e espere o CI ficar verde.
5. Tag anotada `vX.Y.Z` e release marcada como a mais recente, com as notas do changelog.
