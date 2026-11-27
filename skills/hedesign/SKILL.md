---
name: hedesign
description: 'Use quando pedirem para aplicar, instalar ou usar o hedesign em um projeto, ou para dar a um sistema web o visual de estúdio calmo com IA presente (design system, tokens, tema claro e escuro, dark mode, UI kit, CSS components, layout de aplicativo com menu lateral, campo de pedido à IA). Instala os arquivos, liga o tema, monta a casca e troca a interface para os tokens e componentes he-*, em qualquer stack (HTML puro, Django, Rails, Laravel, React, Next, Vue, Svelte, Tailwind).'
license: MIT
metadata:
  version: 1.0.2
  author: PycodeBR (Felipe Azambuja)
---

# hedesign: aplicar o design system em um projeto

O hedesign é um design system de CSS e JavaScript puros, sem dependências e sem etapa de build. Esta skill leva um
projeto do estado atual até uma interface que usa os tokens (`--he-*`), as classes (`he-*`) e os comportamentos
(`window.HE`) do sistema, nos dois temas.

Skills irmãs: `hedesign-telas` (desenhar telas novas com as regras de experiência) e `hedesign-auditoria` (conferir o
resultado). Use esta primeiro.

## Onde está cada coisa

Descubra a pasta do hedesign (o instalador a deixa em `~/.hedesign/src`; num checkout, é a raiz do repositório):

```bash
command -v hedesign >/dev/null && hedesign docs || ls ~/.hedesign/src
```

Se não existir, instale uma vez (sem sudo):

```bash
curl -fsSL https://raw.githubusercontent.com/pycodebr/hedesign/main/install.sh | bash
```

| Preciso de | Leia |
|---|---|
| Decidir cor, tipo, espaço, forma, movimento | `DESIGN.md` na raiz do hedesign |
| Lista de classes com marcação mínima | `references/componentes.md` (esta skill) |
| Tokens e como adaptar a marca | `references/tokens.md` |
| Receita para a stack do projeto | `references/stacks.md` |
| API do JavaScript | `docs/api-js.md` na raiz do hedesign |
| Marcação completa de um componente | `docs/src/sections/*.html` (fonte da documentação viva) |
| Tela inteira pronta para adaptar | `docs/src/examples/*.html` e `docs/examples/*.html` |

## Procedimento

1. **Conheça o projeto antes de mexer.** Descubra a stack, onde ficam o layout base, os arquivos estáticos e o CSS
   atual, e se já existe tema escuro. Liste as telas e o que cada uma faz. Não troque a arquitetura do projeto.
2. **Ponha os arquivos no projeto.** `hedesign add <pasta-de-estáticos>/hedesign` copia `dist/` e baixa a Inter com
   conferência de sha256. Sem acesso à pasta, use o jsDelivr com a versão fixada
   (`https://cdn.jsdelivr.net/gh/pycodebr/hedesign@1.0.2/dist/...`).
3. **Ligue no layout base**, nesta ordem: no `<head>`, `hedesign-fonts.css`, `hedesign.css` e `hedesign-theme.js`
   (script comum, sem `defer`, para o tema entrar antes da primeira pintura); antes de `</body>`, `hedesign.js`. O
   `<html>` precisa de `lang` e a página, da meta viewport com `viewport-fit=cover`.
4. **Monte a casca** que o projeto pede (`references/componentes.md`, seção Casca): menu lateral, barra do topo, barra
   da área e campo de pedido são opcionais e independentes. Site de conteúdo ou página pública não usa a casca.
5. **Troque a interface por partes**, uma tela por vez, nesta ordem: fundo e tipografia, botões e campos, cartões e
   listas, estados (vazio, carregando, erro), camadas e avisos. Em cada tela, remova o CSS antigo que a classe `he-*`
   substituiu. O que for específico do projeto continua em CSS próprio, mas só com tokens `--he-*`.
6. **Ligue os comportamentos** que a tela usa (`docs/api-js.md`): tema, avisos com Desfazer, gaveta e folha, paleta,
   campo de pedido. O que era chamada de rede no seu sistema entra nos callbacks (`HE.dock.onAsk`, `onUndo`, `onDrop`).
7. **Adapte a marca só pelos tokens** (`references/tokens.md`): troque valores em um arquivo próprio carregado depois
   do `hedesign.css`. Não edite o arquivo do sistema.
8. **Confira** com `hedesign audit <pasta>` e abra cada tela nos dois temas, em 390 px e 1440 px, e só com o teclado.
   A skill `hedesign-auditoria` tem o roteiro completo.

## Regras que não se negociam

- Nenhuma cor fixa em tela. Valor novo entra como token, nos dois temas.
- Cor de etapa, categoria ou situação vem de `data-tone` no contêiner, nunca de classe de cor por elemento.
- Um botão principal (`he-btn--primary`) por tela ou por folha. O azul de destaque não é botão principal.
- A cor da IA (`--he-ai*`, `he-btn--ai`, orbe, brilho) só aparece onde a IA age.
- Ação reversível não pede confirmação: execute e ofereça Desfazer com `HE.toast({ text, onUndo })`.
- Toda lista tem estado vazio, esqueleto de carregamento e erro com saída.
- Alvo de toque de 40 px no mínimo; campo de texto com 16 px no celular (as classes já fazem isso).
- Não recrie o que existe. Antes de escrever um componente, procure em `references/componentes.md`.

## Armadilhas

- `hedesign-theme.js` com `defer` ou no fim do `<body>` faz a página piscar no tema errado.
- O sistema usa `:has()`, `color-mix()` e consultas de contêiner: funciona nos navegadores atuais (Chrome e Edge 111+,
  Safari 16.4+, Firefox 121+). Projeto que precise de navegador mais antigo deve saber disso antes.
- `.he-top`, `.he-dock` e `.he-layer` se posicionam pelas medidas da casca. Se o projeto tem cabeçalho próprio fixo,
  informe a altura dele em `--he-topbar-h` no `:root`.
- Em React, Vue ou Svelte, chame `HE.init(elemento)` depois que o componente monta, para ligar alternador, abas,
  carrossel e compositor dentro dele. Camadas e avisos são criados pelo `HE` fora da árvore do framework.
- Framework com CSS em escopo (CSS Modules, `scoped`): as classes `he-*` são globais; use-as como estão.
- Tailwind: não use o `preflight` contra o sistema. Carregue o `hedesign.css` depois e use o tema de `tokens/` para os
  utilitários lerem os tokens.
- Sprite de ícones: com `hedesign.js` na página ele entra sozinho. Sem JS, inclua `hedesign-sprite.svg` no `<body>`.
