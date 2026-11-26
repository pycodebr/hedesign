# Componentes do hedesign: classes e marcação mínima

Catálogo para consulta rápida. A marcação completa de cada um, com variações, está em `docs/src/sections/` e, renderizada,
em `docs/index.html`. Ícone: `<svg class="he-i" aria-hidden="true"><use href="#he-i-NOME"/></svg>` (abaixo, `{i:NOME}`).

## Casca

```html
<aside class="he-sidebar" id="he-sidebar">
  <div class="he-sidebar__head"><a class="he-brand" href="/"><span class="he-brand__mark">N</span>
    <span class="he-brand__text"><span class="he-brand__name">Nome</span><span class="he-brand__sub">Apoio</span></span></a></div>
  <nav class="he-side"><div class="he-side__section"><div class="he-side__label">Grupo</div>
    <a class="he-side__item is-active" href="#" aria-current="page" data-he-tip="Painel">
      <span class="he-side__icon">{i:compass}</span><span class="he-side__text">Painel</span><span class="he-count">4</span></a></div></nav>
  <div class="he-sidebar__foot"><button class="he-side__item" data-he-sidebar-toggle><span class="he-side__icon">{i:list}</span><span class="he-side__text">Recolher menu</span></button></div>
</aside>
<header class="he-topbar">
  <button class="he-topbar__menu" data-he-sidebar-toggle aria-label="Abrir menu">{i:list}</button>
  <nav class="he-crumbs"><a href="#">Sistema</a><span class="he-crumbs__sep">/</span><span class="he-crumbs__current">Tela</span></nav>
  <div class="he-topbar__actions"><span class="he-live">Tempo real</span><button class="he-topbar__btn"><span class="he-avatar">A</span></button></div>
</header>
<div class="he-scrim-nav"></div>
<main class="he-main">
  <div class="he-top">                       <!-- barra da área: até 5 destinos -->
    <a class="he-top__brand" href="#"><span class="he-top__mark"></span><span>Área</span></a>
    <nav class="he-nav"><a class="he-nav__item is-active" href="#">{i:sun}<span>Hoje</span><span class="he-count">3</span></a></nav>
    <div class="he-top__actions">
      <button class="he-new" data-he-new>{i:plus}<span class="he-new__label">Novo</span></button>
      <a class="he-review" href="#"><span>Revisar<span class="he-review__long"> agora</span></span><span class="he-review__n" data-he-count="fila">3</span></a>
      <button class="he-presence" data-he-presence data-state="idle"><span class="he-orb" data-state="idle"></span><span class="he-presence__label" data-he-presence-label>IA livre</span></button>
      <button class="he-iconbtn" data-he-palette-open aria-label="Buscar">{i:search}</button>
      <button class="he-iconbtn" data-he-theme-toggle aria-label="Usar tema escuro">{i:moon}</button>
    </div>
  </div>
  <div class="he-page">…</div>               <!-- he-page--narrow (860px) · he-page--full -->
  <div class="he-dock" data-he-dock>…</div>   <!-- campo de pedido: ver "IA" -->
  <nav class="he-mnav"><a class="he-mnav__item is-active" href="#">{i:sun}<span>Hoje</span></a></nav>   <!-- só no celular -->
</main>
```

Cabeçalho de tela: `<header class="he-head"><div class="he-head__main"><h1>Título</h1><p class="he-head__sub">Frase.</p></div><div class="he-head__actions">…</div></header>`.
Seção: `<section class="he-sec"><div class="he-sec__head"><h2>Título</h2><span class="he-sec__n">3</span><a class="he-btn he-btn--ghost he-btn--sm">Ver tudo</a></div>…</section>`.

Arranjos: `he-stack` (`--sm`, `--lg`), `he-row` (`--between`, `--nowrap`), `he-grow`, `he-grid` (`--2`, `--3`, `--4`, variável `--min`),
`he-split` (`--3`), `he-toolbar`, `he-cards` (`--list`).

## Tipografia

`he-display`, `he-h1`, `he-h2`, `he-h3`, `he-title`, `he-lead`, `he-text`, `he-small`, `he-label`, `he-overline`, `he-muted`,
`he-faint`, `he-mono`, `he-num`. Texto corrido sem classes por elemento: `<div class="he-prose">…</div>`.

## Botões e campos

| Classe | Uso |
|---|---|
| `he-btn` + `--primary`, `--soft`, `--ghost`, `--accent`, `--ok`, `--danger`, `--ai` | Botão. Tamanhos `--sm`, `--lg`; `--block` ocupa a largura. |
| `he-iconbtn` + `--solid`, `.is-active` | Botão só com ícone. Exige `aria-label`. |
| `he-new`, `he-review` + `he-review__n` | Botão Novo e ação principal com contador. |
| `he-kbd` (`--always` mantém no toque) | Tecla. |
| `he-field` > `label` + `he-input` / `he-textarea` / `he-select` | Campo com rótulo acima. Erro: `aria-invalid` + `<p class="he-field__error">`. Apoio: `he-help`. |
| `he-suffix` > `he-input` + `span` | Campo com unidade à direita. |
| `he-quick` > ícone + `input` | Captura rápida em uma linha. |
| `he-switch[role=switch][aria-checked]` > `he-switch__knob` | Interruptor. Dentro de `he-toggle` > `he-toggle__text` (`b` + `small`). |
| `he-checkbox` > `input`, `he-radio` > `input[type=radio]` | Caixa de seleção e opção única nativas, com a cor do sistema. |
| `he-btn[aria-busy="true"]` | Botão ocupado: a ação foi pedida e ainda não terminou. |
| `he-quick--lg` | Captura rápida grande, como entrada principal de uma tela. |
| `he-composer` | Compositor (ver "IA"). |

## Selos e pessoas

| Classe | Uso |
|---|---|
| `he-badge[data-tone]` + `--sm`, `--lg`, `--solid`, `--dot` | Selo de etapa ou situação. Como `button`, vira seletor. |
| `he-who[data-who="you|ai"]` + `--mini` | De quem é a vez. |
| `he-tag`, `he-count`, `he-sec__n`, `he-sync` | Etiqueta, contador de atenção, contador neutro, selo de sincronia. |
| `he-delta` + `--up`, `--down`, `--none` | Variação de um número. |
| `he-avatar` + `--ring`; `he-avatars` | Pessoa; pilha de pessoas. |
| `he-live` (`data-state="off"`) | Conexão em tempo real. |

## Navegação dentro da tela

```html
<div class="he-views" data-he-views aria-label="Visão">
  <button class="he-views__item is-active" data-view="quadro" aria-pressed="true">{i:board}<span>Quadro</span></button>
  <button class="he-views__item" data-view="lista" aria-pressed="false">{i:list}<span>Lista</span></button>
</div>
<div class="he-chips" data-he-chips="multi" data-name="tipo"><span class="he-chips__label">Tipo</span>
  <button class="he-chip" aria-pressed="true" data-value="a">Um <span class="he-chip__n">6</span></button>
  <button class="he-chip" data-tone="pink" aria-pressed="false" data-value="b">Com tom</button>
  <button class="he-chip he-chip--clear">Limpar</button></div>
<div class="he-tabs" data-he-tabs><button class="he-tab" aria-controls="p1" aria-selected="true">Uma</button><button class="he-tab" aria-controls="p2">Outra</button></div>
<div class="he-tabpanel" id="p1">…</div><div class="he-tabpanel" id="p2" hidden>…</div>
```

## Cartão, quadro, calendário

```html
<article class="he-card" data-tone="orange">          <!-- + he-card--board | --row | --cal | --tile · .is-suggestion · he-glow -->
  <div class="he-card__thumb"><img src="…" alt="">     <!-- ou <div class="he-card__poster"><span>Texto</span></div> -->
    <span class="he-card__kind">{i:carousel}Tipo</span></div>
  <div class="he-card__body">
    <h3 class="he-card__title"><a class="he-card__link" href="#">Título</a></h3>
    <div class="he-card__meta"><span class="he-badge he-badge--sm" data-tone="orange">Etapa</span>
      <span class="he-card__date">{i:clock}qui 26/11 · 18h</span><span class="he-card__camp">campanha</span></div>
    <div class="he-card__foot"><span class="he-who" data-who="you">com você</span></div>
  </div>
</article>

<div class="he-board">
  <section class="he-col" data-tone="blue"><div class="he-col__head"><h3 class="he-col__title">Etapa</h3><span class="he-col__n">2</span></div>
    <div class="he-col__list" data-he-drop><article class="he-card he-card--board" data-tone="blue" data-he-drag>…</article></div></section>
</div>

<div class="he-cal">                                    <!-- he-cal--month para o mês -->
  <div class="he-cal__day is-today"><div class="he-cal__head"><span class="he-cal__num">25</span>qua</div>
    <div class="he-cal__list"><article class="he-card he-card--cal" data-tone="teal">…</article></div>
    <button class="he-cal__add">{i:sparkles}Sugerir</button></div>
</div>
```

Grade de miniaturas: `he-grid3` com `he-card--tile` e separador `he-grid3__sep`. Metas: `he-goals` > `he-goal` (`.is-done`).

## Passos, painéis e avisos na página

| Classe | Uso |
|---|---|
| `ol.he-steps` > `li.he-steps__step[data-tone]` (`.is-done`, `.is-current` + `aria-current="step"`) > `span` | Linha de passos; `--bar` é a versão compacta. `HE.steps(el, índice)`. |
| `he-panel` (`--soft`, `[data-tone]`) > `he-panel__title` + `he-panel__text` | Painel lateral. Com `data-tone`, o painel inteiro é tingido (`ai` para o que a IA concluiu). |
| `div.he-disclosures` > `details.he-disclosure` > `summary` (texto + `{i:chevron_down}`) + conteúdo | Pergunta que abre e fecha. |
| `ul.he-checks` > `li.he-check[data-state="warn|fail|wait"]` (`small` para detalhe) | Conferências automáticas. |
| `he-diff` com `<ins>` e `<del>` | O que mudou entre versões. |
| `he-callout[data-tone]` > ícone + `he-callout__main` (`__title`, `__text`) | Aviso dentro da página. |
| `he-error[role=alert]` > ícone + `he-error__main` (`__title`, `__text`, `__actions`) | Erro com saída. |
| `he-hint[data-tone]` > `span` + `he-btn` | Dica em pílula com ação. |
| `ul.he-list` > `li` > `a.he-list__row` (`__ico[data-tone]`, `__main` > `__title` + `__sub`, `__end`) | Lista de linhas. |
| `he-code` (`--wrap`) | Bloco de código. |

## Números

```html
<div class="he-stats"><div class="he-stat"><span class="he-stat__label">Alcance</span><span class="he-stat__value">48.210</span>
  <span class="he-delta he-delta--up">12% <small>vs. mês passado</small></span></div></div>
<ul class="he-bars"><li class="he-bar" data-tone="blue"><span class="he-bar__name">Nome</span><span class="he-bar__track"><i style="--v:.8"></i></span><span class="he-bar__val">80</span></li></ul>
<ol class="he-cols"><li class="he-cols__col" style="--v:.4">S1</li><li class="he-cols__col is-current" style="--v:1" data-tone="green">S2</li></ol>
<div class="he-tablewrap"><table class="he-table"><thead><tr><th>Item</th><th class="is-num">Valor</th></tr></thead>
  <tbody><tr><th>Linha</th><td class="is-num">12.480</td></tr></tbody></table></div>
```

## Estados

- Vazio: `he-empty` (`--boxed`, `--compact`) > `svg.he-empty__art` + `he-empty__title` + `he-empty__text` + `he-empty__actions`.
  No desenho, use as classes `a` (superfície), `b` (rebaixado), `c1` a `c6` (tons), `k` (IA) e `l` (linha).
- Carregando: `he-skel` + `--text`, `--title`, `--thumb`, `--card`, `--row`, `--phone`, `--circle`, `--w40`, `--w60`, `--w80`.
  Contêiner com `aria-busy="true"` e `<span class="he-sr" role="status">Carregando</span>`.
- Erro: `he-error` (acima). Envio de arquivo: `he-upload` (`__text`, `__track` > `i` com `--p`), `he-upload--error`,
  `he-dropzone` (`--inline`) > `he-dropzone__box` (`__ico`, `b`).

## Camadas e avisos (criados pelo JavaScript)

`HE.toast`, `HE.drawer.open`, `HE.sheet`, `HE.layer.open`, `HE.menu.open`, `HE.palette`, `HE.shortcuts`. Marcação gerada:
`he-toasts` > `he-toast`; `he-scrim` + `he-drawer` (`--left`, `--wide`, `--sheet`) > `__head`, `__body`, `__foot`;
`he-layer` > `he-layer__panel` > `__bar`, `__body`; `he-menu` > `he-menu__item` (`__ico`, `__text`); `he-pal`.
Qualquer botão com `data-he-close` dentro de uma camada fecha a camada. Os avisos ficam acima do campo de pedido e sobem
sozinhos quando há barra de decisão; tela com rodapé próprio grudado informa a altura em `--he-toasts-bottom`, no `<html>`.

## IA

```html
<span class="he-orb" data-state="idle|working|waiting"></span>        <!-- he-orb--sm | --lg | --xl -->
<div class="he-glow" data-he-glow="IA escrevendo">…</div>             <!-- he-glow--soft · he-glow--veil -->
<div class="he-question"><span class="he-orb" data-state="waiting"></span>
  <div><div class="he-question__who">A IA pergunta · Item</div><div class="he-question__text">Pergunta?</div></div>
  <div class="he-question__answers"><button class="he-btn he-btn--sm">Resposta</button></div></div>
<li class="he-job" data-status="running|queued|failed|approval|canceled"><span class="he-orb" data-state="working"></span>
  <div class="he-job__title">Tarefa</div><div class="he-job__step">Passo atual <span class="he-dots3"><i></i><i></i><i></i></span></div>
  <div class="he-job__meta">há 40 s</div></li>
<div class="he-approval"><div class="he-approval__head">{i:lock}A IA quer…</div><p class="he-approval__desc">O que vai acontecer.</p>
  <pre class="he-approval__cmd">ação exata</pre><div class="he-approval__actions">…</div></div>

<div class="he-dock" data-he-dock>
  <div class="he-dock__sugs" data-he-sugs></div>
  <div class="he-dock__row"><form class="he-composer is-empty" data-he-ask-form novalidate><div class="he-composer__box">
    <button type="button" class="he-dock__orb" data-he-presence data-state="idle" aria-label="Atividade da IA"><span class="he-orb" data-state="idle"></span></button>
    <div class="he-dock__ctx" data-he-ctx></div>
    <textarea class="he-composer__input" name="prompt" rows="1" placeholder="Peça à IA" aria-label="Pedido à IA"></textarea>
    <div class="he-composer__bar"><span class="he-composer__tools"></span><span class="he-composer__actions"><kbd class="he-kbd">/</kbd>
      <button class="he-composer__send" type="submit" aria-label="Enviar"></button></span></div>
  </div></form></div>
</div>

<div class="he-feed">                          <!-- he-feed--scroll: rola dentro de um painel -->
  <div class="he-msg he-msg--me"><div class="he-bubble">Pedido.</div><div class="he-msg__meta">você · 9h14</div></div>
  <div class="he-msg he-msg--ai"><span class="he-orb"></span><div class="he-msg__main"><div class="he-msg__meta">IA · 9h14</div><p class="he-msg__text">Resposta.</p></div></div>
  <div class="he-event" data-tone="green"><div class="he-event__main"><span><b>Ana</b> aprovou</span></div><time>9h20</time></div>
</div>
```

Compositor fora do rodapé: o mesmo `form.he-composer`, com ferramentas em `he-composer__tools` (`he-composer__tool`,
`he-composer__pill`, `he-composer__check`, `he-composer__seg`), `he-composer__stop` para interromper e `he-composer__hint`.

## Estúdio

```html
<div class="he-studio" data-tone="orange"><div class="he-phone">        <!-- he-phone--sm | --lg | --fit | --flat -->
  <div class="he-phone__screen"><div class="he-phone__status"><span>9:41</span></div>
    <div class="he-post__head"><span class="he-avatar he-avatar--ring"><span>N</span></span>
      <span class="he-post__who"><span class="he-post__account">conta</span><span class="he-post__sub">apoio</span></span></div>
    <div class="he-post__media he-carousel" data-ratio="4x5" data-he-carousel><div class="he-carousel__track">
      <div class="he-slide"><img src="…" alt="Lâmina 1"></div>
      <div class="he-slide he-slide--text"><span class="he-slide__n"><b>2</b>Lâmina</span><p class="he-slide__text">Texto</p></div></div></div>
    <div class="he-post__actions">…<div class="he-dots" data-he-dots></div></div>
    <div class="he-post__caption"><span class="he-post__captext"><b>conta</b>Legenda.</span></div>
  </div></div></div>
```

Vídeo vertical: `he-reel` > `he-player[data-he-player]` > `video`, `he-reel__side`, `he-reel__info`. Linha do tempo: `he-tl`
(`--light`) com `--p`, `he-tl__fill`, `he-tl__range`. Marcadores: `he-pinnable` > `button.he-pin` com `--x` e `--y` em
porcentagem (`.is-resolved`, `--static`). Tira: `he-strip` > `he-strip__item` (`.is-active`) + `he-strip__add`.

Decisão: `he-decide[data-he-decide-bar]` (`--static`) > `he-decide__btn--deny|--adjust|--approve` com
`data-he-decide="deny|adjust|approve"`, `he-decide__label`, `he-decide__more`, `small`, e `he-decide__swap`. Carimbo:
`HE.stamp(alvo, { text, kind })`.

Recortes: `he-mural` > `article.he-clip[data-kind="note|link|image|video|research"]` (`.is-reading`) > `he-clip__media`,
`he-clip__body` (`__kind`, `__title`, `__text`, `__host`, `__sources`, `__tags`, `__foot`), `he-clip__pin`.

Destaque: `he-hero[data-tone]` > `he-fan` (até três `he-fan__card`) + `he-hero__main` (`he-hero__count` > `b`, botão).

Ajustes: `he-settings` > `nav.he-sidenav` (`he-sidenav__item`) + `he-formsecs` > `section.he-formsec` (`.is-dirty`) >
`__head`, `__body`, `__foot`.

## Movimento pronto

`he-in-rise`, `he-in-fade`, `he-in-pop`, `he-in-next`, `he-in-prev`, `he-stagger` (filhos em sequência), `he-ping`.
Keyframes: `he-rise`, `he-fade`, `he-fade-out`, `he-pop`, `he-slide-in`, `he-slide-out`, `he-sheet-in`, `he-sheet-out`,
`he-stamp`, `he-shimmer`, `he-glow-run`, `he-pulse`, `he-breathe`, `he-spin`, `he-halo`, `he-ping`, `he-scan`, `he-blink`,
`he-countdown`, `he-live`.

## Utilitários

`he-sr` (só para leitor de tela), `[hidden]`, `he-tips` no `<body>` ou `he-tip` no elemento para mostrar `data-he-tip`,
`he-wide` (some em tela estreita dentro da barra do topo), `html.he-focus` (esconde a barra inferior do celular numa
tela de tarefa única).
