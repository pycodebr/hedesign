---
version: alpha
name: hedesign
description: Estúdio calmo com IA presente. Papel quente, tinta, seis tons que dizem o estado e uma cor só da IA, em tema claro e escuro.
colors:
  primary: "#1b1a18"
  on-primary: "#f4f2ee"
  background: "#f4f2ee"
  background-sunken: "#ebe8e2"
  surface: "#ffffff"
  surface-soft: "#f8f7f4"
  ink: "#1b1a18"
  ink-2: "#31302e"
  muted: "#5f5b56"
  faint: "#6b6761"
  ghost: "#a39e98"
  accent: "#0075de"
  accent-ink: "#005bab"
  accent-soft: "#e8f2fc"
  on-accent: "#ffffff"
  danger: "#c4352b"
  danger-soft: "#fbeceb"
  ok: "#136c2a"
  ok-soft: "#e0f3e4"
  ai: "#6b3fa8"
  ai-ink: "#5b3e8f"
  ai-soft: "#f3ecfb"
  ai-line: "#ddd3f3"
  blue: "#3d8fd6"
  blue-fg: "#1c5f99"
  blue-bg: "#e4f0fb"
  violet: "#8a55cc"
  violet-fg: "#6537a6"
  violet-bg: "#f0e8fb"
  pink: "#d23fa0"
  pink-fg: "#a3246f"
  pink-bg: "#fce6f3"
  orange: "#dd5b00"
  orange-fg: "#a04300"
  orange-bg: "#fdecdc"
  teal: "#1f9c97"
  teal-fg: "#136a67"
  teal-bg: "#dcf2f0"
  green: "#1a8a35"
  green-fg: "#136c2a"
  green-bg: "#e0f3e4"
  on-tone: "#ffffff"
  toast: "#1f1d1a"
  on-toast: "#f6f3ee"
  paper: "#fbf7ef"
  paper-ink: "#201d18"
colors-dark:
  primary: "#f2f0eb"
  on-primary: "#131316"
  background: "#131316"
  background-sunken: "#0d0d10"
  surface: "#1d1d22"
  surface-soft: "#18181c"
  surface-raised: "#26262d"
  ink: "#f2f0eb"
  ink-2: "#d9d6cf"
  muted: "#aaa69e"
  faint: "#96928a"
  ghost: "#6d6a64"
  accent: "#5aa9ff"
  accent-ink: "#8cc4ff"
  accent-soft: "#1c2e45"
  on-accent: "#0b1220"
  danger: "#ff8a80"
  danger-soft: "#3d2222"
  ok: "#7bdc94"
  ok-soft: "#1f3526"
  ai: "#a67be6"
  ai-ink: "#c4a8f5"
  ai-soft: "#2b2440"
  ai-line: "#453a66"
  blue: "#5aa9ee"
  blue-fg: "#8cc4f6"
  blue-bg: "#29394b"
  violet: "#a67be6"
  violet-fg: "#c9acf5"
  violet-bg: "#383049"
  pink: "#ec63b8"
  pink-fg: "#f79ad2"
  pink-bg: "#462b40"
  orange: "#ff8a3d"
  orange-fg: "#ffb07a"
  orange-bg: "#4a3327"
  teal: "#35c2bb"
  teal-fg: "#72d9d3"
  teal-bg: "#223e41"
  green: "#3fc463"
  green-fg: "#7bdc94"
  green-bg: "#243e2f"
  on-tone: "#131316"
  toast: "#34343c"
  on-toast: "#f6f3ee"
  paper: "#24211c"
  paper-ink: "#f3ede1"
typography:
  display:
    fontFamily: Inter
    fontSize: 40px
    fontWeight: 700
    lineHeight: 1.1
    letterSpacing: "-1px"
  h1:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: 700
    lineHeight: 1.1
    letterSpacing: "-0.9px"
  h2:
    fontFamily: Inter
    fontSize: 26px
    fontWeight: 700
    lineHeight: 1.23
    letterSpacing: "-0.6px"
  h3:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: 700
    lineHeight: 1.3
    letterSpacing: "-0.3px"
  title:
    fontFamily: Inter
    fontSize: 14.5px
    fontWeight: 600
    lineHeight: 1.35
    letterSpacing: "-0.1px"
  lead:
    fontFamily: Inter
    fontSize: 17px
    fontWeight: 400
    lineHeight: 1.55
  body:
    fontFamily: Inter
    fontSize: 15.5px
    fontWeight: 400
    lineHeight: 1.5
  small:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: 400
    lineHeight: 1.4
  label:
    fontFamily: Inter
    fontSize: 12.5px
    fontWeight: 600
    lineHeight: 1.3
  overline:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: 700
    lineHeight: 1.3
    letterSpacing: "0.3px"
  button:
    fontFamily: Inter
    fontSize: 14.5px
    fontWeight: 600
    lineHeight: 1.2
rounded:
  xs: 6px
  sm: 10px
  md: 14px
  lg: 20px
  full: 999px
spacing:
  "1": 4px
  "2": 8px
  "3": 12px
  "4": 16px
  "5": 24px
  "6": 32px
  "7": 48px
  "8": 64px
components:
  page:
    backgroundColor: "{colors.background}"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    typography: "{typography.button}"
    rounded: "{rounded.full}"
    height: 40px
    padding: 16px
  button-default:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    typography: "{typography.button}"
    rounded: "{rounded.full}"
    height: 40px
    padding: 16px
  button-accent:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.on-accent}"
    rounded: "{rounded.full}"
    height: 40px
  button-ok:
    backgroundColor: "{colors.green-fg}"
    textColor: "{colors.on-tone}"
    rounded: "{rounded.full}"
    height: 40px
  button-danger-hover:
    backgroundColor: "{colors.danger-soft}"
    textColor: "{colors.danger}"
    rounded: "{rounded.full}"
  button-ai:
    backgroundColor: "{colors.ai-soft}"
    textColor: "{colors.ai-ink}"
    rounded: "{rounded.full}"
    height: 40px
  input:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.sm}"
    height: 40px
    padding: 12px
  card:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    typography: "{typography.title}"
    rounded: "{rounded.md}"
  panel:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink-2}"
    rounded: "{rounded.lg}"
    padding: 16px
  panel-soft:
    backgroundColor: "{colors.surface-soft}"
    textColor: "{colors.muted}"
    rounded: "{rounded.lg}"
  caption:
    backgroundColor: "{colors.background}"
    textColor: "{colors.faint}"
    typography: "{typography.small}"
  keycap:
    backgroundColor: "{colors.background-sunken}"
    textColor: "{colors.muted}"
    rounded: "{rounded.xs}"
  link:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.accent-ink}"
  selection:
    backgroundColor: "{colors.accent-soft}"
    textColor: "{colors.accent-ink}"
  badge-blue:
    backgroundColor: "{colors.blue-bg}"
    textColor: "{colors.blue-fg}"
    rounded: "{rounded.full}"
    height: 24px
  badge-violet:
    backgroundColor: "{colors.violet-bg}"
    textColor: "{colors.violet-fg}"
    rounded: "{rounded.full}"
  badge-pink:
    backgroundColor: "{colors.pink-bg}"
    textColor: "{colors.pink-fg}"
    rounded: "{rounded.full}"
  badge-orange:
    backgroundColor: "{colors.orange-bg}"
    textColor: "{colors.orange-fg}"
    rounded: "{rounded.full}"
  badge-teal:
    backgroundColor: "{colors.teal-bg}"
    textColor: "{colors.teal-fg}"
    rounded: "{rounded.full}"
  badge-green:
    backgroundColor: "{colors.green-bg}"
    textColor: "{colors.green-fg}"
    rounded: "{rounded.full}"
  badge-ok:
    backgroundColor: "{colors.ok-soft}"
    textColor: "{colors.ok}"
    rounded: "{rounded.full}"
  ai-bubble:
    backgroundColor: "{colors.ai-soft}"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
  toast:
    backgroundColor: "{colors.toast}"
    textColor: "{colors.on-toast}"
    rounded: "{rounded.md}"
    height: 48px
  note:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.paper-ink}"
    rounded: "{rounded.md}"
  ai-orb:
    backgroundColor: "{colors.ai}"
    rounded: "{rounded.full}"
    size: 22px
  ai-outline:
    backgroundColor: "{colors.ai-line}"
    height: 1px
  tone-bar-blue:
    backgroundColor: "{colors.blue}"
    height: 3px
  tone-bar-violet:
    backgroundColor: "{colors.violet}"
    height: 3px
  tone-bar-pink:
    backgroundColor: "{colors.pink}"
    height: 3px
  tone-bar-orange:
    backgroundColor: "{colors.orange}"
    height: 3px
  tone-bar-teal:
    backgroundColor: "{colors.teal}"
    height: 3px
  tone-bar-green:
    backgroundColor: "{colors.green}"
    height: 3px
  tone-dot-neutral:
    backgroundColor: "{colors.ghost}"
    rounded: "{rounded.full}"
    size: 7px
---

## Overview

O hedesign é a linguagem visual de um **estúdio calmo com IA presente**: um sistema web em que uma pessoa decide e uma
IA trabalha junto. O fundo é um papel quente, as superfícies são claras, há muito respiro, e o que tem cor é o conteúdo
e o estado das coisas. A interface nunca compete com o que está sendo produzido.

Seis princípios decidem tudo:

1. **Estúdio calmo.** Um botão em tinta por tela. Superfícies paradas têm só um contorno interno de 1 px.
2. **A cor diz o estado.** Seis tons, do azul ao verde, percorrem o fluxo. O mesmo tom aparece no selo, na coluna, no
   calendário e na barra de passos.
3. **IA presente, fora do caminho.** O campo de pedido fica no mesmo lugar em todas as telas e já sabe o contexto. Um
   orbe mostra se a IA está livre, trabalhando ou esperando a pessoa.
4. **Toda ação tem volta.** Nada pede confirmação antes. A ação acontece e o aviso traz o Desfazer.
5. **A prévia é a protagonista.** O que vai ser publicado aparece na moldura do aparelho, do tamanho real.
6. **Um gesto por decisão.** Aprovar, pedir ajuste ou negar cabem em uma barra, com tecla e alvo de toque grande.

Implementação de referência: `dist/hedesign.css` (tokens `--he-*`, classes `he-*`) e `dist/hedesign.js` (`window.HE`).
Use a implementação pronta sempre que a stack permitir; recrie a partir deste documento só quando não der para carregar
o CSS. Os valores do bloco YAML são os do tema claro; `colors-dark` traz os do tema escuro, com os mesmos nomes.

## Colors

O tema fica em `data-he-theme="light|dark"` no `<html>` (ou em qualquer elemento, como ilha de tema). Todo valor de cor
de uma tela vem de um token. Cor fixa em tela quebra o tema escuro.

- **Fundo `background` (#f4f2ee / #131316):** o papel da página. Sobre ele há uma luz suave no topo.
- **Superfície `surface` (#ffffff / #1d1d22):** cartões, campos e painéis. `surface-soft` é a superfície secundária
  dentro de um painel; `background-sunken` é para trilhos, teclas e código.
- **Tinta `ink` (#1b1a18 / #f2f0eb):** texto principal e botão principal. No tema escuro o botão principal é claro com
  texto escuro. `ink-2` é o texto de apoio forte, `muted` o secundário, `faint` a legenda (limite para texto pequeno,
  ainda 4,5:1) e `ghost` só decoração.
- **Destaque `accent` (#0075de / #5aa9ff):** foco, link e seleção. Não é a cor do botão principal.
- **Estados:** `ok` e `danger`, cada um com a versão `-soft` para fundo.
- **IA `ai` (#6b3fa8 / #a67be6):** cor exclusiva da IA, com `ai-ink`, `ai-soft` e `ai-line`. O gradiente da IA vai de
  #6b3fa8 a #3d5fd9 a #0075de em 135 graus e aparece no orbe, no botão de enviar e no brilho de trabalho.
- **Seis tons:** `blue`, `violet`, `pink`, `orange`, `teal`, `green`. Cada um tem quatro papéis: viva (ponto, barra,
  contorno), `-fg` (texto), `-bg` (fundo suave) e `-solid` (fundo cheio, igual ao `-fg` no claro e à viva no escuro).
  Texto `-fg` sobre a superfície e sobre o próprio `-bg` passa de 4,5:1 nos dois temas.
- **Significados fixos:** laranja é "espera você" (fila, pergunta da IA, ajuste, marcador). Verde é "feito" (aprovar,
  publicado, meta batida, interruptor ligado). Violeta é texto ou rascunho. O trilho com os seis tons em sequência é a
  assinatura do sistema.
- **Linhas e realce:** linha de 10% da tinta, linha forte de 20%, realce de hover de 6% e 11%. No escuro, as mesmas
  proporções em branco.

Um elemento com `data-tone="blue|violet|pink|orange|teal|green|ai|accent|danger|neutral"` recebe `--tone`, `--tone-fg`,
`--tone-bg` e `--tone-solid`, e todo componente dentro dele usa essas quatro variáveis.

## Typography

Uma família, **Inter** (variável, pesos 400 a 700), com a fonte do sistema como reserva. Títulos pesados e apertados,
com espaçamento negativo; apoio um degrau mais claro. Texto de leitura nunca fica abaixo de 12 px; só micro-rótulos (contador, tecla, selo
pequeno, legenda de miniatura) usam de 10,5 a 11,5 px, sempre em peso 600 ou mais. Números que mudam usam algarismos
tabulares.

- `display` 40/1.1/700/-1px para aberturas de página fora do aplicativo.
- `h1` 32/1.1/700/-0.9px: um por tela, seguido de uma frase que diz o que há para fazer.
- `h2` 26/1.23/700 e `h3` 18/1.3/700 para seções. `title` 14.5/1.35/600 para título de cartão.
- `body` 15.5/1.5/400, `lead` 17/1.55, `small` 13/1.4, `label` 12.5/600 para rótulo de campo.
- `overline` 12/700 em caixa alta com 0,3 px: só para rotular painel ou grupo. Nunca em botão ou título.
- No celular, todo campo de texto usa 16 px, para o navegador não ampliar a página.
- Texto de interface em frases completas e curtas. Botão começa com verbo e diz a ação.

## Layout

- Escala de espaço de base 4: 4, 8, 12, 16, 24, 32, 48, 64. Dentro de componente, 4 e 8; entre blocos, 24 e 32.
- Página com até 1320 px (860 px para leitura), 28 px de respiro no topo e 32 px nas laterais (16 px no celular).
- **Casca:** menu lateral fixo de 256 px (64 px recolhido), barra do topo de 52 px com o caminho, barra da área de 56 px
  com até cinco destinos, e o campo de pedido fixo no rodapé, centralizado, com 760 px no máximo.
- **Celular (até 760 px):** o menu lateral vira gaveta, os destinos descem para uma barra inferior de 58 px, o campo de
  pedido fica logo acima dela, e gaveta, folha e camada sobem de baixo.
- Pontos de quebra: 1023 px (menu vira gaveta), 900 px (colunas viram pilha), 760 px (modo celular), 480 px (a moldura
  do aparelho some).
- Alvo de toque de 40 px no mínimo, 52 px na barra de decisão.
- A tela inicial responde "o que precisa de mim agora?": destaque com o número, o que espera decisão, o que a IA
  perguntou, o que está pronto para a próxima etapa e o que sai hoje.

## Elevation & Depth

- **Parado:** `box-shadow: inset 0 0 0 1px` na cor da linha. Sem `border`, para a medida não mudar.
- **Nível 1:** `0 1px 2px rgba(20,18,16,.05), 0 6px 18px -10px rgba(20,18,16,.18)`. Cartão e item ativo.
- **Nível 2:** `0 2px 6px rgba(20,18,16,.06), 0 18px 44px -18px rgba(20,18,16,.32)`. Cartão sob o ponteiro.
- **Flutuante:** contorno de 1 px mais `0 12px 28px -8px` e `0 32px 80px -24px`. Menu, paleta, gaveta, folha.
- **IA:** sombra com tinta violeta (`0 16px 40px -18px rgba(48,28,96,.45)`) no campo de pedido.
- Barras fixas usam o fundo com 88% de opacidade e desfoque de 14 px.
- Ordem das camadas: barra da área, barra do topo, camada de detalhe, campo de pedido, menu lateral, véu, gaveta, menu,
  paleta, avisos, item arrastado.

## Shapes

- Tudo o que se clica é **pílula** (raio 999 px): botões, chips, destinos, selos.
- Cartão e aviso: 14 px. Painel, coluna e folha: 20 px. Campo e item de menu: 10 px. Etiqueta e tecla: 6 px.
- O campo de pedido tem raio de 24 a 26 px e os botões dele são círculos de 36 px.
- A moldura do aparelho tem 46 px de raio externo e 37 px na tela.
- Ícones de traço em grade de 24 px, espessura 1,9, pontas arredondadas, na cor do texto.
- O orbe da IA é um círculo com gradiente cônico e um brilho no canto de cima.

## Components

Lista completa, com marcação e código, em `docs/index.html`. Os essenciais:

- **Botão** (`button-primary`, `button-default`, `button-accent`, `button-ok`, `button-ai`): pílula de 40 px, encolhe
  para 97% ao pressionar. Um principal por tela. O botão da IA leva o orbe pequeno antes do texto.
- **Campo** (`input`): 40 px, contorno forte; no foco, borda azul e anel de 3 px. Rótulo acima.
- **Compositor:** campo de pedido no padrão dos chats de IA, texto e barra de ações no mesmo contorno, botão redondo de
  enviar com o gradiente da IA.
- **Selo** (`badge-*`): ponto na cor viva e texto na cor de texto do tom, 24 px de altura.
- **Cartão** (`card`): miniatura 4:3, faixa de 3 px na cor do tom, título em duas linhas, etapa, data e de quem é a vez.
  Sobe 2 px sob o ponteiro. Variantes para quadro, linha, calendário e grade.
- **Painel** (`panel`, `panel-soft`): agrupa informação ao lado do conteúdo, com rótulo em caixa alta.
- **Quadro, calendário e grade:** três formas de ver a mesma lista, com arrastar e soltar.
- **Aviso** (`toast`): escuro nos dois temas, com Desfazer e barra de contagem nos seis tons.
- **Gaveta, folha e camada de detalhe:** complemento, decisão curta e item aberto.
- **Paleta:** Ctrl K, com itens, telas e ações, e o pedido à IA como último resultado.
- **Presença, brilho e pergunta da IA** (`ai-bubble`): os três sinais de que a IA está agindo.
- **Estúdio:** moldura de aparelho com a prévia, carrossel, vídeo, marcadores de comentário.
- **Barra de decisão:** negar, pedir ajuste e aprovar, com carimbo de confirmação.
- **Recorte** (`note`): referência guardada; a nota é papel.
- **Vazio, esqueleto e erro com saída:** os três estados que toda lista tem.

## Do's and Don'ts

**Faça**

- Use os tokens e as classes prontas. Para cor de estado, use `data-tone` no contêiner.
- Dê a cada tela um botão principal em tinta e uma frase que diz o que há para fazer.
- Mantenha o campo de pedido no rodapé de toda tela do aplicativo, com as etiquetas de contexto da tela.
- Mostre o orbe, o brilho e a atividade sempre que a IA estiver trabalhando.
- Execute a ação na hora e ofereça Desfazer no aviso.
- Desenhe os estados vazio, carregando e erro de toda lista.
- Teste cada tela nos dois temas, em 390 px e em 1440 px, e só com o teclado.

**Não faça**

- Não escreva cor fixa em tela, nem crie um tom novo sem os quatro papéis nos dois temas.
- Não use o azul de destaque como botão principal, nem a cor da IA para algo que não seja a IA.
- Não use caixa de confirmação para ação reversível.
- Não use caixa alta em botão ou título, nem texto de leitura abaixo de 12 px.
- Não anime largura, altura ou margem; não deixe decoração em laço.
- Não troque conteúdo pela IA sem versão, sem marcar o que mudou e sem caminho de volta.
- Não esconda no hover o que o toque também precisa.

## Motion

- `--he-fast` 150 ms para resposta ao ponteiro e para toda saída. `--he-med` 220 ms para entradas.
- Curva única: `cubic-bezier(.2, .7, .2, 1)`.
- Entradas percorrem pouco: 8 px de baixo (cartão, menu), 28 px de lado (gaveta), 40 px (folha), sempre com opacidade.
- Estados em laço só para a IA e carregamento: orbe respira em 4,5 s, gira com halo ao trabalhar, pulsa em laranja ao
  esperar; o brilho corre em 2,4 s; o esqueleto em 1,4 s.
- Só `transform`, `opacity`, `box-shadow` e `background-position`.
- Com `prefers-reduced-motion`, nada anima e todo estado continua legível (anel fixo no orbe, contorno liso no brilho).

## AI presence

- **Campo de pedido:** fixo no rodapé. Etiquetas de contexto (tela, período, item) removíveis. Sugestões em botões
  quando recebe foco. Tecla `/` foca. Enter envia.
- **Presença:** orbe com estado `idle`, `working` ou `waiting` e rótulo ("IA livre", "Trabalhando em 2", "Esperando
  você"). Clicar abre a atividade.
- **Brilho:** contorno em gradiente que corre no elemento em que a IA está mexendo, com rótulo curto.
- **Pergunta:** bloco laranja no topo, com respostas prontas em botões.
- **Permissão:** antes de uma ação com efeito externo, a IA mostra exatamente o que vai fazer, com permitir e negar.
- **De quem é a vez:** todo item diz "com você" ou "com a IA". Sugestão da IA é tracejada até ser aceita.
- **Rastro:** cada entrega da IA vira uma versão, com a diferença marcada e botão de restaurar.

## Accessibility

- Contraste de 4,5:1 no texto e 3:1 nos elementos gráficos, nos dois temas.
- Foco sempre visível: contorno de 2 px no azul de destaque, ou na cor da IA dentro do campo de pedido.
- Teclado completo: Tab em ordem, setas em abas, menus e carrossel, Esc fecha a camada de cima, `?` lista os atalhos.
- Camadas com foco preso e devolvido; avisos com `aria-live`; carregamento com `aria-busy`.
- Estado nunca depende só de cor: selo tem texto, conferência tem ícone, orbe tem rótulo.
