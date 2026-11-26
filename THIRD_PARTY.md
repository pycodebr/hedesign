# Componentes de terceiros

O hedesign não versiona nenhum arquivo de terceiros. O que ele usa de fora é carregado ou baixado na hora.

| Componente | Licença | Como entra |
|---|---|---|
| [Inter](https://github.com/rsms/inter), pelo pacote [@fontsource-variable/inter](https://www.npmjs.com/package/@fontsource-variable/inter) 5.3.0 | SIL Open Font License 1.1 | `dist/hedesign-fonts.css` aponta para o jsDelivr. `hedesign add` e `scripts/fonts.sh` baixam os dois arquivos `woff2` para o seu projeto, conferem o sha256 e gravam o texto da licença ao lado. |
| [terser](https://github.com/terser/terser) 5.36.0 | BSD 2-Clause | Usado só na geração de `dist/hedesign.min.js` (`tools/build.py`, via `npx`). Não é dependência de quem usa. |

Os ícones do sprite, as ilustrações dos estados vazios e as imagens dos exemplos foram desenhados para este
repositório e seguem a licença MIT dele.

Nomes de produtos e serviços citados na documentação pertencem aos seus donos. O hedesign não tem vínculo com eles.
