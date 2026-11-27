# hedesign.js: referência da API

Comportamentos do design system hedesign. Um arquivo só, sem dependências e sem build, em ES2017. Tudo fica em `window.HE`.

A biblioteca não faz chamadas de rede. O que depende do servidor chega à sua aplicação por **callback** ou por **evento**, e é ela quem responde.

## Como carregar

```html
<html lang="pt-BR">
<head>
  <meta name="theme-color" content="#f4f2ee">
  <link rel="stylesheet" href="hedesign.css">
  <!-- bloqueante, no head: aplica o tema antes da primeira pintura -->
  <script src="hedesign-theme.js"></script>
</head>
<body>
  <!-- marcação da página -->
  <script src="hedesign.js"></script>
</body>
</html>
```

- `hedesign-theme.js` lê `localStorage["he.theme"]`, escreve `html[data-he-theme]`, ajusta `meta[name=theme-color]` e reaplica `html.he-nav-collapsed` quando o menu lateral foi recolhido.
- `hedesign.js` liga tudo no `DOMContentLoaded`. Carregado numa página sem marcação nenhuma, não gera erro nem cria elemento.

## Convenções

- **Seletores.** Classes `he-*`, atributos `data-he-*`, tons em `data-tone="blue|violet|pink|orange|teal|green|neutral"`.
- **Eventos.** Todos são `CustomEvent` com `bubbles: true` e os dados em `event.detail`. Os que saem no `document` podem ser ouvidos em qualquer lugar. Os marcados como canceláveis respeitam `event.preventDefault()`.
- **Conteúdo inserido depois.** Chame `HE.init(raiz)` no trecho novo. Gaveta, folha e camada já fazem isso com o próprio conteúdo.
- **Falta de marcação.** Cada módulo só age se o elemento existir. Funções que recebem um elemento aceitam também um seletor e devolvem `null` quando não acham nada.
- **Movimento.** Com `prefers-reduced-motion: reduce`, as saídas são imediatas e o carrossel rola sem animação.

## Textos: `HE.labels` e `HE.config`

Todo texto visível ou lido por leitor de tela fica em `HE.labels`, um objeto plano com padrão em PT-BR. Variáveis entram como `{nome}` e listas usam barra vertical entre os itens.

```js
HE.config({
  labels: {
    dockPlaceholder: "Pergunte ao assistente",
    presenceIdle: "Assistente livre",
    decideQuick: "Mais direto|Mais curto|Outro tom"
  },
  locale: "pt-BR",                                 // local das datas por extenso
  keys: { approve: "a", adjust: "j", deny: "n" },  // teclas da barra de decisão
  observe: false                                   // true liga sozinho o HTML inserido depois
});
```

| Opção | Efeito |
|---|---|
| `labels` | Mescla em `HE.labels`. Botões de tema e presença são repintados na hora. |
| `locale` | Grava `HE.locale`. Usado no `title` das datas e, quando não for português, no nome do dia da semana. |
| `keys` | Teclas de aprovar, pedir ajuste e negar. |
| `observe` | Liga ou desliga um `MutationObserver` que chama `HE.init` em tudo o que entrar no `<body>`. Desligado por padrão. |

Grupos de chaves: `theme*`, `toast*` e `undo*`, `dock*` e `ask*`, `presence*`, `activity*` e `job*`, `palette*`, `layer*`, `shortcut*` e `key*`, `carousel*`, `caption*`, `player*`, `pin*`, `decide*`, `stamp*`, `dnd*`, `date*`, além de `close`, `cancel`, `error`, `retry`, `newTitle` e `glow`. Plural usa o par `<chave>One` e `<chave>Many`.

## `HE.util`, `HE.icon`, `HE.esc`

| Função | Para quê |
|---|---|
| `HE.util.$(sel, raiz)` | Primeiro elemento que casa com o seletor. |
| `HE.util.$$(sel, raiz)` | Lista (array) dos elementos que casam. |
| `HE.util.esc(texto)` | Escapa HTML. Atalho: `HE.esc`. |
| `HE.util.el(tag, attrs, conteudo)` | Cria um elemento. `attrs.class` e `attrs.text` têm tratamento próprio; `true` vira atributo vazio; `null` e `false` são ignorados. |
| `HE.util.emit(alvo, nome, detalhe, cancelavel)` | Dispara um `CustomEvent` e devolve o evento. |
| `HE.util.isTyping(alvo)` | `true` quando o foco está num campo de texto. Use nos seus atalhos de teclado. |
| `HE.util.isMobile()` | `true` até 760 px de largura. |
| `HE.util.focusables(raiz)` | Elementos que recebem foco, visíveis e fora de `[hidden]` e `[inert]`. |
| `HE.util.icon`, `fmtTime`, `fmtDate`, `reduced`, `clamp` | Apoios usados pela própria biblioteca. |
| `HE.icon(nome, classes)` | HTML do ícone: `<svg class="he-i"><use href="#he-i-nome"/></svg>`. |

```js
alvo.innerHTML = HE.icon("check", "he-i--lg") + HE.esc(titulo);
```

## `HE.icons`

`HE.icons.mount()` injeta o sprite de ícones no começo do `<body>` quando a página ainda não tem `#he-sprite`. Devolve `true` se injetou. Roda sozinho na carga.

O conteúdo do sprite entra no arquivo pelo build, na marca `var SPRITE = "@@HE_SPRITE@@";`. Sem build (a marca continua lá), nada é injetado: nesse caso ponha o `sprite.svg` direto no HTML.

`HE.version` traz a versão do pacote, que o build grava no lugar da marca `@@HE_VERSION@@`.

## `HE.theme`

| Membro | Efeito |
|---|---|
| `HE.theme.get()` | Tema em uso: `"light"` ou `"dark"`. |
| `HE.theme.pref()` | Preferência: `"light"`, `"dark"` ou `"auto"`. |
| `HE.theme.set(valor)` | Guarda em `localStorage["he.theme"]` e aplica. |
| `HE.theme.toggle()` | Alterna entre claro e escuro. |

- Sem preferência salva vale `auto`. `<html data-he-theme-default="light">` (ou `dark`) troca esse padrão.
- Em `auto`, o tema acompanha `prefers-color-scheme` ao vivo.
- O tema fica em `html[data-he-theme="light|dark"]`. `meta[name=theme-color]` recebe `#f4f2ee` no claro e `#131316` no escuro.
- Botões `[data-he-theme-toggle]` alternam no clique e têm `aria-pressed`, `aria-label`, `title` e ícone atualizados. Com um filho `[data-he-theme-label]`, o texto visível também é atualizado; sem ele, o botão passa a conter só o ícone.
- Evento `he:theme` no `document`: `{theme, pref}`.

```html
<button type="button" class="he-iconbtn" data-he-theme-toggle aria-pressed="false" aria-label="Usar tema escuro"></button>
```

```js
HE.theme.set("auto");
document.addEventListener("he:theme", function (e) { console.log(e.detail.theme); });
```

## Pilha de camadas

Gaveta, folha, paleta e camada de detalhe entram numa pilha comum:

- `HE.overlayOpen()` diz se há alguma aberta. Use para não disparar atalhos por baixo.
- A rolagem da página trava com `html.he-lock`, e a largura da barra de rolagem vai para `--he-sbw` para nada saltar de lugar.
- `Esc` fecha a de cima. `Tab` e `Shift+Tab` ficam presos dentro dela.
- Ao fechar, o foco volta ao elemento que estava em foco na abertura.

## `HE.toast` e `HE.say`

```js
HE.toast("Legenda salva.");
HE.toast({
  text: "Item movido para Feito.",
  sub: "Projeto Alfa",                 // segunda linha
  kind: "ok",                          // ok | error | ai (sem kind: neutro)
  duration: 6000,                      // ms
  action: { label: "Abrir", onClick: function () { abrir(); } },
  onUndo: function () { return desfazerNoServidor(); }
});
HE.toast.error(erro, { text: "A legenda não foi salva.", retry: salvar });
HE.say("Lista atualizada.");           // só para leitor de tela
```

| Opção | Valor |
|---|---|
| `text`, `sub` | Texto e segunda linha. |
| `kind` | `ok`, `error` ou `ai`. Erro usa `role="alert"`. |
| `duration` | Padrão 4,5 s; erro 9 s; com Desfazer 10 s. |
| `action` | `{label, onClick}`: um botão que fecha o aviso e chama `onClick`. |
| `onUndo` | Mostra o botão Desfazer com barra de contagem. Pode devolver uma `Promise`. |

- Devolve `{el, close}`. O contêiner `#he-toasts` é criado no primeiro aviso; no máximo três ficam na tela.
- O tempo para enquanto o ponteiro ou o foco está no aviso.
- Desfazer: o botão fica em "Desfazendo" até `onUndo` terminar. Depois sai o evento `he:undone` `{result}` e o aviso "Desfeito.". Se `onUndo` resolver com `false`, o "Desfeito." não aparece (o próprio `onUndo` já avisou). Se rejeitar, aparece o aviso de erro com a mensagem.
- `HE.toast.error(erroOuTexto, {text, sub, retry, action})` monta o aviso de erro; `retry` vira o botão "Tentar de novo". Erro com `silent: true` não mostra nada.

## `HE.counts`

```html
<span class="he-count" data-he-count="fila">3</span>
<a class="he-btn" data-he-count-hide="fila" href="/fila/">Revisar</a>
```

```js
HE.counts.set({ fila: 2, novos: 5 });   // qualquer chave
HE.counts.get();                        // {fila: 2, novos: 5}
```

- Todo `[data-he-count="chave"]` recebe o número e some com zero (`hidden`). `data-he-count-keep` mantém o zero à vista.
- Todo `[data-he-count-hide="chave"]` some quando o valor é zero.
- Na carga, o valor inicial é lido do texto da marcação.
- Evento `he:counts` no `document`, com todos os contadores.

## `HE.dock` e `HE.ask`

Campo de pedido fixo. A biblioteca procura `[data-he-dock]` ou `.he-dock` (o `id` é opcional).

```html
<div class="he-dock" data-he-dock>
  <div class="he-dock__sugs" data-he-sugs role="group" aria-label="Sugestões de pedido"></div>
  <div class="he-dock__row">
    <form class="he-composer is-empty" novalidate>
      <div class="he-composer__box">
        <div class="he-dock__ctx" data-he-ctx aria-label="Contexto do pedido"></div>
        <textarea class="he-composer__input" rows="1" placeholder="Peça à IA" aria-label="Pedido à IA"></textarea>
        <div class="he-composer__bar"><span class="he-composer__actions"><button class="he-composer__send" type="submit" aria-label="Enviar pedido"></button></span></div>
      </div>
    </form>
  </div>
</div>
```

```js
HE.dock.setContext([{ key: "projeto", label: "Projeto Alfa", value: 7, kind: "Projeto" }]);
HE.dock.setContext({ semana: { label: "Semana 48", value: "2026-W48" } });   // forma de objeto
HE.dock.addContext({ key: "item", label: "Item 3", value: "i3" });
HE.dock.removeContext("item");
HE.dock.getContext();                                  // {projeto: 7, semana: "2026-W48"}
HE.dock.setSuggestions([
  { label: "Resumir", prompt: "Resuma esta tela.", action: "resumo" },
  { label: "Listar pendências", prompt: "Liste as pendências.", send: true }   // send: envia direto
]);
HE.dock.focus("texto opcional");
HE.dock.setPlaceholder("Peça algo sobre este item");
HE.dock.setBusy(true);

HE.dock.onAsk = function (detail) {                    // {prompt, context, action}
  return enviarAoServidor(detail);                     // pode devolver uma Promise
};
```

| Membro | Efeito |
|---|---|
| `setContext(listaOuObjeto)` | Substitui as etiquetas de contexto. Item: `{key, label, value, kind}`. |
| `addContext(item)`, `removeContext(chave)` | Acrescenta (ou troca) e tira uma etiqueta. A pessoa também tira pelo "x". |
| `getContext()` | Objeto `{chave: valor}`. |
| `setSuggestions(lista)` | Botões que aparecem com o foco no campo. Item: `{label, prompt, action, icon, send}` ou texto. `null` tira todas. |
| `focus(texto)` | Foca o campo e, com texto, preenche. |
| `setPlaceholder(texto)` | Troca o texto de apoio. |
| `setBusy(bool)` | Liga e desliga o estado de envio por conta da aplicação. |
| `onAsk` | Função chamada a cada pedido. |
| `el`, `input` | Elementos do campo, quando existem. |

Comportamento:

- Foco no campo: `.he-dock.is-open` e `html.he-dock-open` (etiquetas e sugestões à mostra).
- `Enter` envia, `Shift+Enter` quebra linha. Em tela de toque o envio é pelo botão.
- A tecla `/` leva o cursor ao campo, fora de campos de texto. `Esc` sai do campo.
- `--he-dock-h`, no `<html>`, recebe a altura que o campo ocupa em repouso (a linha do campo mais o respiro do contêiner). As sugestões abertas não entram na conta.
- Evento `he:context` no `document` a cada mudança de etiquetas: `{context}`.

**Envio.** Pelo campo, por sugestão com `send: true`, por `[data-he-ask]` ou por `HE.ask`, o caminho é o mesmo:

1. Sai `he:ask` no `document`, cancelável, com `{prompt, context, action}`. `preventDefault()` interrompe: nada é chamado e o texto fica no campo.
2. Se existir, `HE.dock.onAsk(detail)` é chamado.
3. Enquanto a `Promise` de `onAsk` está pendente, o campo fica com `is-sending` (e o botão com `is-busy`), e um segundo envio pelo campo é ignorado.
4. Ao resolver, o campo é limpo e sai `he:asked` `{request, response}`.
5. Ao rejeitar, aparece o aviso de erro com "Tentar de novo" e o texto continua no campo.

```js
HE.ask({ prompt: "Resuma a semana", action: "resumo", context: { extra: 1 } })
  .then(function (resposta) { /* o que onAsk devolveu; false se o evento foi cancelado */ })
  .catch(function (erro) { /* o aviso de erro já apareceu; silent: true no pedido evita o aviso */ });
```

Sem JS de tela:

```html
<button type="button" class="he-btn he-btn--ai" data-he-ask="Revise este texto." data-action="revisao">Pedir revisão</button>
<button type="button" class="he-btn" data-he-ask="Pesquise sobre " data-fill>Pedir pesquisa</button>
<button type="button" class="he-btn" data-he-focus-dock>Fazer um pedido</button>
```

`data-fill` só preenche o campo, para a pessoa completar. `data-he-focus-dock` foca o campo.

## `HE.composer`

Vale para qualquer `textarea.he-composer__input` dentro de `.he-composer`, no campo fixo ou fora dele.

- A altura acompanha o texto, até o `max-height` do CSS. A classe `is-empty` fica no `.he-composer` enquanto o campo está vazio.
- Clique no espaço vazio de `.he-composer__box` foca o campo.
- Em `form[data-he-composer-enter]`, `Enter` dispara o `submit` do próprio formulário (com texto), e `Shift+Enter` quebra linha. Trate o `submit` na sua aplicação.

| Função | Para quê |
|---|---|
| `HE.composer.sync(textarea)` | Recalcula altura e `is-empty`. Trocar `value` por código já chama. |
| `HE.composer.enhance(raiz)` | Liga os campos de um trecho novo (o `HE.init` chama). |
| `HE.composer.isSendKey(evento)` | `true` quando a tecla é de envio. Use em telas com envio próprio. |

```html
<form class="he-composer is-empty" data-he-composer-enter>
  <div class="he-composer__box">
    <textarea class="he-composer__input" rows="1" aria-label="Comentário"></textarea>
    <div class="he-composer__bar"><span class="he-composer__actions"><button class="he-composer__send" type="submit" aria-label="Enviar"></button></span></div>
  </div>
</form>
```

## `HE.presence`

Mostra o estado do assistente em todo `[data-he-presence]`.

```html
<button type="button" class="he-presence" data-he-presence data-state="idle" aria-haspopup="dialog">
  <span class="he-orb" data-state="idle" aria-hidden="true"></span>
  <span class="he-presence__label" data-he-presence-label>IA livre</span>
</button>
```

```js
HE.presence.set({ state: "working", working: 2 });      // idle | working | waiting
HE.presence.set({ state: "waiting", waiting: 1, label: "Precisa de você" });
HE.presence.get();                                      // {state, working, waiting, label}
HE.presence.onOpen = function (detail) {                // clique em [data-he-presence]
  HE.drawer.open({ title: "Atividade", body: HE.presence.renderActivity(pedidos) });
};
```

- `set` atualiza `data-state` do elemento e da orbe (`.he-orb`), o texto de `[data-he-presence-label]`, `aria-label` e `title`. Sem `state`, ele é deduzido de `waiting` e `working`. `label` troca o texto padrão.
- Na carga, o estado inicial é lido de `data-state`, `data-working` e `data-waiting` do primeiro `[data-he-presence]`.
- Evento `he:presence` no `document` quando algo muda: `{state, working, waiting, label}`.
- Clique em `[data-he-presence]`: evento `he:presence-open` `{el, state, working, waiting, label}` e, se existir, `HE.presence.onOpen(detail)`. Quando o elemento é um link, ele só navega se não houver `onOpen` e ninguém chamar `preventDefault()` no evento.

`HE.presence.renderActivity(pedidos)` devolve o HTML da lista de atividade (`.he-act`, `.he-job`), sem buscar nada:

```js
HE.presence.renderActivity([
  { id: 1, title: "Resumo da semana", step: "Lendo as notas", status: "running", meta: "Resumo", tone: "violet" },
  { id: 2, title: "Limpar a pasta", status: "approval", href: "/pedidos/2/" },
  { id: 3, title: "Exportar", status: "failed", step: "O arquivo não abriu." }
]);
```

`status`: `running`, `queued`, `approval`, `waiting`, `failed`, `canceled` ou `done`. Os pedidos saem em grupos (aguardando você, em andamento, não concluídos, concluídos). Sem `step`, vale o rótulo padrão do estado. Lista vazia devolve um estado vazio.

## `HE.drawer` e `HE.sheet`

```js
var g = HE.drawer.open({
  title: "Sem data",
  body: "<p>Itens sem data.</p>",        // HTML ou nó
  foot: "<button type='button' class='he-btn' data-he-close>Fechar</button>",
  side: "left",                          // padrão: direita
  wide: true,                            // gaveta larga
  label: "Itens sem data",               // aria-label (sem ele, vale o título)
  focus: "#campo",                       // quem recebe o foco ao abrir
  onClose: function (motivo) {}          // esc | scrim | button | swipe | api
});
g.el; g.body; g.foot; g.close();

var f = HE.sheet({
  title: "Trocar a data",
  body: campoDeData,                     // nó já montado
  foot: "<button type='button' class='he-btn he-btn--primary' data-he-close>Guardar</button>"
});
HE.drawer.close();                       // fecha a gaveta de cima
```

- Gaveta: lateral no computador, sobe de baixo no celular, com a alça `.he-drawer__grip` para puxar e fechar.
- Folha: caixa central no computador, sobe de baixo no celular. Mesmas opções da gaveta.
- As duas têm `role="dialog"`, prendem o foco, fecham com `Esc`, clique fora ou `[data-he-close]`, e devolvem o foco a quem abriu.
- Evento `he:drawer:close` `{reason}` (no `document`, ou no próprio elemento quando a gaveta já estava na página).

Declarativo, para gaveta que já está na página:

```html
<button type="button" class="he-btn" data-he-drawer-open="#sem-data">Sem data</button>
<div class="he-drawer he-drawer--left" id="sem-data" hidden>
  <div class="he-drawer__head"><h2 class="he-drawer__title">Sem data</h2><button type="button" class="he-iconbtn" data-he-close aria-label="Fechar"></button></div>
  <div class="he-drawer__body">Conteúdo</div>
</div>
```

## `HE.menu` e `HE.newMenu`

```js
var m = HE.menu.open(botao, [
  { label: "Duplicar", sub: "Cria uma cópia", icon: "copy", onClick: function () { duplicar(); } },
  { label: "Arquivar", icon: "archive", tone: "orange", onClick: arquivar },
  { label: "Excluir", icon: "trash", disabled: true }
], { label: "Mais ações", align: "right" });
m.close();
HE.menu.close();
```

| Opção | Valor |
|---|---|
| `label` | `aria-label` do menu. |
| `align` | `"right"` alinha pela borda direita da âncora. Padrão: esquerda. |
| `sheet`, `title` | Com `sheet: true`, no celular o menu vira uma folha com botões grandes e esse título. |
| `onClose` | Chamado ao fechar. |

- Menu `.he-menu` com `role="menu"`, preso à âncora e sempre dentro da tela (abre para cima se faltar espaço).
- Setas, `Home` e `End` navegam; `Enter` escolhe; `Esc` fecha e devolve o foco à âncora; `Tab`, clique fora, rolagem e redimensionamento fecham.
- A âncora recebe `aria-expanded`. Um segundo clique nela fecha o menu.

Botão Novo:

```html
<button type="button" class="he-new" data-he-new aria-haspopup="menu" aria-expanded="false">Novo</button>
```

```js
HE.newMenu.items = [
  { key: "nota", label: "Nota", sub: "Texto livre", icon: "note", onClick: function () { novaNota(); } },
  { key: "tarefa", label: "Tarefa", icon: "check" }
];
document.addEventListener("he:new", function (e) { if (e.detail.key === "tarefa") novaTarefa(); });
HE.newMenu.open();
```

- `[data-he-new]` abre os itens de `HE.newMenu.items` (menu no computador, folha no celular).
- Ao escolher, sai `he:new` no `document`, cancelável, com `{key, item, el}`; sem `preventDefault()`, o `onClick` do item roda.
- Sem itens declarados, o clique só dispara `he:new` com `{el}`.

## `HE.palette`

Paleta de comandos. `Ctrl K` e `Cmd K` abrem e fecham; `[data-he-palette-open]` também abre.

```js
HE.palette.register({
  id: "paginas", group: "Páginas",
  items: [{ label: "Painel geral", icon: "chart", href: "/painel/", keywords: "inicio resumo" }]
});
var tirar = HE.palette.register({
  id: "projetos", group: "Projetos",
  search: function (q) {                               // devolve itens ou uma Promise
    return buscarProjetos(q).then(function (lista) {
      return lista.map(function (p) {
        return { label: p.nome, hint: "Projeto", icon: "folder", tone: "blue", onSelect: function () { abrir(p); } };
      });
    });
  }
});
HE.palette.open("texto opcional");
HE.palette.close();
tirar();                                               // ou HE.palette.unregister("projetos")
```

| Membro | Efeito |
|---|---|
| `open(texto)`, `close()`, `toggle()` | Abre (com texto inicial opcional), fecha, alterna. |
| `register(fonte)` | Registra uma fonte (ou lista de fontes). Devolve a função que tira. Mesmo `id` substitui. |
| `unregister(idOuFonte)` | Tira uma fonte. |
| `askAI` | `false` tira o item fixo da IA. Padrão `true`. |
| `builtins` | `false` tira as ações internas (alternar tema e ver atalhos). |
| `hotkey` | `false` desliga `Ctrl K` e `Cmd K`. |

- **Fonte:** `{id, group, items}` (lista fixa de itens, filtrada pelo texto, em `label`, `keywords` e `hint`, sem diferenciar acentos) ou `{id, group, search(q)}` (chamada com o texto, depois de 160 ms sem digitação; resposta de texto antigo é descartada).
- **Item:** `{label, hint, icon, tone, img, href, onSelect, keywords, keep}`. `img` troca o ícone por uma miniatura; `keep: true` mantém a paleta aberta depois de escolher.
- Ao escolher: evento `he:palette-select` no `document`, cancelável, com `{item, query}`. Sem `preventDefault()`, roda `onSelect(item)` ou, na falta dele, navega para `href`.
- Último item fixo, **Pedir à IA: «texto»**: chama `HE.ask({prompt: texto})`. `Ctrl Enter` vai direto para ele. Sem texto, ele leva o cursor ao campo de pedido (e só aparece se o campo existir).
- Setas escolhem, `Enter` abre, `Esc` fecha. Lista com `role="listbox"` e `aria-activedescendant`.

## `HE.layer`

Camada de detalhe por cima da tela. Quem chama entrega o conteúdo: nada é carregado por URL.

```html
<a href="/itens/42/" data-he-layer="42">Abrir o item 42</a>
```

```js
document.addEventListener("he:layer-request", function (e) {     // {href, id, el}
  e.preventDefault();                                            // a aplicação assume
  carregar(e.detail.href).then(function (html) {
    HE.layer.open({ title: "Item 42", body: html, href: e.detail.href, onClose: function (motivo) {} });
  });
});
HE.layer.close();
```

| Opção | Valor |
|---|---|
| `title` | Título da barra e `aria-label` (ou `label`). |
| `body` | HTML ou nó. Vai para `.he-layer__content[data-he-layer-root]`, e passa pelo `HE.init`. |
| `href` | Mostra o link "Abrir em página inteira". |
| `onClose(motivo)` | `esc`, `button`, `scrim`, `api` ou `replace`. |

- `open` devolve `{el, body, close}`. Chamado com a camada aberta, troca o conteúdo (o `onClose` anterior recebe `replace`). `HE.layer.current` é a camada aberta ou `null`.
- Aberta: `html.he-layer-open` e `html.he-lock`. O foco fica preso entre a camada e o campo de pedido, que continua utilizável.
- Ao fechar, a rolagem volta ao ponto exato e o foco volta ao elemento de origem.
- Eventos no `document`: `he:layer-open` `{title, href, root}` e `he:layer-close` `{reason}`.
- Links `[data-he-layer]`: no clique simples sai `he:layer-request`, cancelável. Sem `preventDefault()`, o link navega normalmente. `Ctrl`, `Cmd`, `Shift` e o botão do meio continuam abrindo aba nova.

## `HE.shortcuts`

```js
HE.shortcuts.add("Fila", ["←", "→"], "Item anterior e próximo");
HE.shortcuts.open();        // folha de ajuda
HE.shortcuts.list();        // [{group, keys, label}]
```

A tecla `?` abre a folha, fora de campos de texto e sem camada aberta; `[data-he-shortcuts-open]` também. A lista padrão mostra só o que existe na página (campo de pedido, paleta, barra de decisão, carrossel, player, itens arrastáveis). `add` registra a linha na ajuda: a tecla em si é tratada pela sua tela.

## `HE.carousel`

```html
<div class="he-carousel" data-he-carousel>
  <div class="he-carousel__track">
    <div class="he-slide" data-slide-id="s1">Um</div>
    <div class="he-slide" data-slide-id="s2">Dois</div>
  </div>
</div>
<div class="he-dots" data-he-dots></div>
```

```js
var c = HE.carousel(el);     // {el, index, total, go(i, semAnimacao), next(), prev(), refresh()}
el.addEventListener("he:slide", function (e) { /* {index, total, slide, id} */ });
```

Liga sozinho com `data-he-carousel`: desliza com o dedo, botões de anterior e próximo, teclado com o carrossel em foco (setas, `Home`, `End`), contador "2/5" e pontos. Os pontos entram no `[data-he-dots]` do mesmo `.he-phone` ou `[data-he-carousel-scope]` (ou do elemento pai). Chame `refresh()` depois de acrescentar ou tirar slides.

## `HE.player`

```html
<div class="he-player" data-he-player><video src="video.mp4" poster="capa.jpg"></video></div>
```

```js
var p = HE.player(el);       // {el, video, play(), pause(), toggle(), seek(seg), time, duration, addPin(), clearPins()}
p.addPin({ n: 1, t: 7.2, tEnd: 12 });               // marcador na linha do tempo (trecho opcional)
el.addEventListener("he:time", function (e) { /* {time, duration} */ });
```

Monta os controles: tocar e pausar (clique, `Espaço`, `K`), linha do tempo com arrasto e setas (`role="slider"`), tempo e som (`M`). Clique num marcador leva o vídeo ao ponto e dispara `he:pin` `{n, t}`. `data-duration` informa a duração enquanto o vídeo não carrega.

## `HE.pins`

Marcadores numerados sobre qualquer `.he-pinnable` do escopo.

```html
<div class="he-pinnable" id="previa"><img src="capa.jpg" alt="Capa"></div>
```

```js
var pins = HE.pins("#previa", {
  onAdd: function (p) { /* {n, x, y, slideId, el, host} */ },
  onSelect: function (p) { /* {n, el} */ }
});
pins.start();                                       // modo marcar: o próximo clique prende um marcador
pins.stop();
pins.add({ x: 40, y: 60, n: 3, slideId: "s2" });    // desenha um que já existe (posição em porcentagem)
pins.remove(3); pins.clear(); pins.active; pins.next();
```

Eventos: `he:pin:add` no alvo, com os mesmos dados de `onAdd`, e `he:pin` `{n}` no marcador clicado. `.he-pin[data-x][data-y]` que já vem na marcação é posicionado pelo `HE.init`.

## `HE.decide`

```html
<div class="he-decide" data-he-decide-bar role="group" aria-label="Decisão">
  <button type="button" class="he-decide__btn he-decide__btn--deny" data-he-decide="deny"><span class="he-decide__label">Negar</span></button>
  <button type="button" class="he-decide__btn he-decide__btn--adjust" data-he-decide="adjust"><span class="he-decide__label">Pedir ajuste</span></button>
  <button type="button" class="he-decide__btn he-decide__btn--approve" data-he-decide="approve"><span class="he-decide__label">Aprovar</span></button>
</div>
```

```js
var d = HE.decide(barra, {
  onApprove: function () { return salvar("aprovado"); },         // Promise deixa a barra ocupada
  onAdjust: function (dados) { /* {quick: ["Mais curto"], text: "", pins: [{n, where, text}]} */ },
  onDeny: function (dados) { /* {reason} */ },
  onSwap: function () {},                                         // botão data-he-decide="swap"
  onAdjustStart: function (ctx) { return false; },               // false impede a folha padrão
  getPins: function () { return comentarios; },                  // [{n, where, text}] mostrados na folha
  quick: ["Mais direto", "Mais curto"],                          // atalhos de ajuste
  reasons: ["Fora do momento", "Repetido"]                       // motivos de negar
});
d.approve(); d.adjust(); d.deny();
d.setApprove(["Aprovar", " e agendar"], "qui 28/11 · 18h");       // a segunda parte some em tela estreita
d.destroy();
```

- "Pedir ajuste" abre uma folha com atalhos em botões, os comentários de `getPins` e texto livre (`Ctrl Enter` envia). "Negar" abre uma folha com motivo opcional.
- Teclas `A`, `J` e `N` (trocáveis em `HE.config({keys})`) valem com a barra visível, ninguém digitando e sem gaveta aberta. Com uma camada aberta, vale a barra de dentro dela.
- Se o callback devolver uma `Promise`, a barra fica com `is-busy` até terminar; em erro aparece o aviso.
- Evento `he:decide` na barra, cancelável: `{decision: "approve|adjust|deny|swap"}` mais os dados da decisão.
- `html.he-has-decide` fica ligado enquanto houver uma barra que não seja `.he-decide--static`.

## `HE.views`

```html
<div class="he-views" data-he-views data-param="visao" data-storage="app.visao" aria-label="Visão">
  <button type="button" class="he-views__item is-active" data-view="quadro" aria-pressed="true">Quadro</button>
  <button type="button" class="he-views__item" data-view="lista" aria-pressed="false">Lista</button>
</div>
```

```js
var v = HE.views(el, { onChange: function (visao) {} });   // {el, set(visao), get()}
el.addEventListener("he:view", function (e) { /* {view} */ });
```

- Com `<button>`: troca a visão, move o indicador `.he-views__thumb`, grava em `localStorage[data-storage]`, põe `?visao=` na URL (`replaceState`) e dispara `he:view`. Setas esquerda e direita trocam.
- Na carga vale a URL, depois o que estava guardado.
- Com `<a href>`: a navegação segue normal e a escolha é guardada. `data-he-views-js` (ou `onChange`) faz os links trocarem por JS.
- Opções `param` e `storage` substituem os atributos.

## `HE.tabs`

```html
<div class="he-tabs" data-he-tabs>
  <button type="button" class="he-tab" aria-controls="p-resumo" aria-selected="true">Resumo</button>
  <button type="button" class="he-tab" aria-controls="p-base">Base</button>
</div>
<div class="he-tabpanel" id="p-resumo">Resumo</div>
<div class="he-tabpanel" id="p-base" hidden>Base</div>
```

```js
var t = HE.tabs(el);        // {el, select(chave)}  chave: data-tab ou aria-controls
el.addEventListener("he:tab", function (e) { /* {tab, el} */ });
```

Aplica `role="tablist"`, `tab` e `tabpanel`, `aria-selected`, `tabindex` e mostra só o painel da aba ativa. Setas, `Home` e `End` trocam de aba. Abas em `<a>` continuam links comuns.

## Chips

```html
<div class="he-chips" data-he-chips="multi" data-name="tipo">
  <button type="button" class="he-chip" aria-pressed="false" data-value="texto">Texto</button>
  <button type="button" class="he-chip" aria-pressed="false" data-value="imagem" data-tone="pink">Imagem</button>
  <button type="button" class="he-chip he-chip--clear" data-he-chip-clear aria-pressed="false">Limpar</button>
</div>
```

```js
grupo.addEventListener("he:chips", function (e) { /* {name, values, value, chip} */ });
```

`data-he-chips="single"` deixa um só marcado (clicar nele de novo desmarca). Em `multi`, `value` é a lista; em `single`, o valor marcado ou `null`. Não precisa de chamada: o clique é tratado por delegação.

## `HE.glow`

```js
HE.glow(el, true, "A IA está escrevendo");   // liga, com rótulo (texto vazio: sem rótulo)
HE.glow(el, false);                          // desliga
```

Liga a classe `he-glow`, o atributo `data-he-glow` (rótulo) e `aria-busy`.

## `HE.steps`

```html
<ol class="he-steps" aria-label="Etapas">
  <li class="he-steps__step" data-tone="blue"><span>Ideia</span></li>
  <li class="he-steps__step" data-tone="violet"><span>Texto</span></li>
  <li class="he-steps__step" data-tone="green"><span>Publicado</span></li>
</ol>
```

```js
var s = HE.steps(el, 1);    // {el, set(i), get()}
s.set(2);
```

Os passos antes do índice ganham `is-done`; o do índice ganha `is-current` e `aria-current="step"`. Índice igual ao total marca todos como feitos; negativo limpa. Declarativo: `<ol class="he-steps" data-he-steps="1">`.

## `HE.dnd`

Arrastar e soltar com mouse, caneta, toque (toque longo de 240 ms arma o arrasto) e teclado.

```html
<div id="quadro">
  <div data-he-drop aria-label="A fazer">
    <div data-he-drag tabindex="0">Item um</div>
  </div>
  <div data-he-drop aria-label="Feito"></div>
  <div data-he-drop data-he-drop-locked aria-label="Arquivo"></div>
</div>
```

```js
var d = HE.dnd("#quadro", {
  item: "[data-he-drag]",                 // padrão
  zone: "[data-he-drop]",                 // padrão
  handle: null,                           // seletor de alça, se só uma parte arrasta
  axis: null,                             // "y", "x" ou "grid"; sem isso é detectado (ou data-he-axis na zona)
  canDrop: function (ctx) { return true; },
  onStart: function (ctx) {},
  onDrop: function (ctx) {
    // ctx: {item, from, to, index, fromIndex, before, after, revert(), pointer: "mouse|touch|pen|keyboard"}
    return salvarOrdem(ctx).then(function () {
      HE.toast({ text: "Movido.", onUndo: ctx.revert });
    });
  },
  onCancel: function (ctx) {}
});
d.dragging; d.cancel(); d.destroy();
```

- O item acompanha o ponteiro (`.he-drag-ghost`), um marcador (`.he-drag-ph`) mostra onde cai, e o DOM já fica na posição nova antes de `onDrop`.
- Se `onDrop` devolver uma `Promise` que falha, o item volta sozinho e sai o aviso de erro. `ctx.revert()` desfaz na mão.
- Zona travada: `data-he-drop-locked`. Item que não arrasta: `data-he-nodrag`.
- `Esc` cancela. Perto das bordas, a zona ou a página rola sozinha.
- Teclado: com o item em foco, `Alt` + setas move dentro da zona e entre zonas, com anúncio para leitor de tela (usa o `aria-label` da zona).
- O clique logo depois de soltar é ignorado.
- Durante o arrasto: `html.he-dragging`, `.he-drag-src` no item, `.he-drop-on` e `.he-drop-no` nas zonas. Eventos `he:dragstart` e `he:drop` no item.

## `HE.fmtDate` e `data-he-time`

```html
<time datetime="2026-11-27T18:00:00-03:00" data-he-time></time>      <!-- sex 27/11 · 18h -->
<time datetime="2026-11-25T09:00:00-03:00" data-he-time="rel"></time> <!-- há 2 h -->
```

```js
HE.fmtDate(iso);            // "hoje · 18h", "amanhã · 9h30", "qui 26/11 · 18h"
HE.fmtDate(iso, "day");     // "hoje", "ontem", "qui 26/11"
HE.fmtDate(iso, "time");    // "18h"
HE.fmtDate(iso, "rel");     // "agora", "há 5 min", "há 2 h", "ontem", "há 3 dias"
```

Datas de outro ano ganham o ano com dois dígitos. O `HE.init` reescreve todo `time[data-he-time]` e põe a data por extenso no `title`. Os textos saem de `HE.labels` (`date*`); `HE.locale` é opcional.

## `HE.switch`

```html
<button type="button" class="he-switch" role="switch" aria-checked="false" aria-label="Avisar por e-mail" data-name="email"></button>
```

```js
document.addEventListener("he:switch", function (e) { /* {checked, name, el} */ });
HE.switch.toggle("#chave");
HE.switch.set("#chave", true);
```

Clique e `Espaço` em `.he-switch[role=switch]` alternam `aria-checked` e disparam `he:switch`. Funciona em `<button>` e em qualquer elemento com `tabindex`. `aria-disabled="true"` ou `disabled` impedem. Um `input[type=checkbox]` dentro da chave acompanha o valor.

## `HE.sidebar`

```html
<button type="button" class="he-iconbtn" data-he-sidebar-toggle aria-controls="menu" aria-label="Menu lateral"></button>
<aside class="he-sidebar" id="menu">Links</aside>
<div class="he-scrim-nav"></div>
```

```js
HE.sidebar.toggle();
HE.sidebar.collapse(true);      // sem argumento, alterna
HE.sidebar.open(); HE.sidebar.close();
HE.sidebar.state();             // {open, collapsed}
HE.sidebar.breakpoint = 1023;   // até esta largura o menu é gaveta
```

- **Computador** (acima de `breakpoint`): `toggle` recolhe e expande com `html.he-nav-collapsed`, guardado em `localStorage["he.nav.collapsed"]` e reaplicado antes da primeira pintura pelo `hedesign-theme.js`.
- **Celular:** `toggle` abre e fecha a gaveta com `html.he-nav-open`. O foco entra no menu, `Esc` e o clique em `.he-scrim-nav` fecham, e o foco volta ao botão.
- Botões `[data-he-sidebar-toggle]` recebem `aria-expanded`. Evento `he:sidebar` no `document`: `{open, collapsed}`.
- **Menu recolhido:** a lista `.he-side` continua rolando e o `.he-sidebar__foot` fica à vista. A dica de cada `.he-side__item[data-he-tip]` é fixa na janela, ao lado do menu; a altura dela vem de `--he-tip-y`, que o script escreve no item quando o ponteiro passa, o foco chega ou a lista rola. Com o menu aberto, a dica dos itens não aparece.

## `HE.stamp`

```js
HE.stamp(alvo, { kind: "ok", text: "Aprovado" });          // ok | adjust | denied
HE.stamp("#cartao", { kind: "denied", icon: "lock", duration: 2000 });
```

Põe um carimbo `.he-stamp` com `data-kind="ok|adjust|denied"` dentro do alvo, liga `.he-stamp--pop` para ele aparecer e tira sozinho (1,4 s por padrão; na saída ganha `is-leaving`). O texto também é anunciado para leitor de tela. Sem `text`, vale o padrão do tipo. Devolve `{el, remove}`.

## `HE.init`

```js
alvo.innerHTML = htmlNovo;
HE.init(alvo);
```

Liga o que é declarativo dentro da raiz: `data-he-carousel`, `data-he-player`, `data-he-views`, `data-he-tabs`, `data-he-steps`, `data-he-decide-bar`, chips, `time[data-he-time]`, marcadores `.he-pin[data-x]`, legenda com "mais" (`.he-post__caption`), contadores e campos do compositor. Roda sozinho no `DOMContentLoaded` e pode ser chamado quantas vezes for preciso: quem já está ligado não é ligado de novo.

## Eventos

| Evento | Onde | Cancelável | Detalhe |
|---|---|---|---|
| `he:theme` | `document` | não | `{theme, pref}` |
| `he:counts` | `document` | não | todos os contadores |
| `he:context` | `document` | não | `{context}` |
| `he:ask` | `document` | sim | `{prompt, context, action}` |
| `he:asked` | `document` | não | `{request, response}` |
| `he:undone` | `document` | não | `{result}` |
| `he:presence` | `document` | não | `{state, working, waiting, label}` |
| `he:presence-open` | elemento clicado | sim | `{el, state, working, waiting, label}` |
| `he:drawer:close` | `document` ou a gaveta | não | `{reason}` |
| `he:new` | `document` | sim | `{key, item, el}` ou `{el}` |
| `he:palette-select` | `document` | sim | `{item, query}` |
| `he:layer-request` | link | sim | `{href, id, el}` |
| `he:layer-open`, `he:layer-close` | `document` | não | `{title, href, root}`, `{reason}` |
| `he:slide` | carrossel | não | `{index, total, slide, id}` |
| `he:time` | player | não | `{time, duration}` |
| `he:pin`, `he:pin:add` | marcador, alvo | não | `{n}`, `{n, x, y, slideId, el, host}` |
| `he:decide` | barra | sim | `{decision}` mais os dados |
| `he:view` | alternador | não | `{view}` |
| `he:tab` | abas | não | `{tab, el}` |
| `he:chips` | grupo de chips | não | `{name, values, value, chip}` |
| `he:switch` | chave | não | `{checked, name, el}` |
| `he:sidebar` | `document` | não | `{open, collapsed}` |
| `he:dragstart`, `he:drop` | item arrastado | não | `{from}`, contexto do arrasto |

## Atributos declarativos

| Atributo | Efeito |
|---|---|
| `data-he-theme-toggle` | Alterna o tema. |
| `data-he-palette-open` | Abre a paleta. |
| `data-he-shortcuts-open` | Abre a ajuda de atalhos. |
| `data-he-new` | Abre o menu do botão Novo. |
| `data-he-presence` | Mostra a presença e avisa o clique. |
| `data-he-ask="texto"`, `data-action`, `data-fill` | Pede à IA ou preenche o campo. |
| `data-he-focus-dock` | Foca o campo de pedido. |
| `data-he-drawer-open="#id"` | Abre uma gaveta da página. |
| `data-he-close` | Fecha a gaveta ou folha em que está. |
| `data-he-layer="id"` | Link que pede a camada de detalhe. |
| `data-he-sidebar-toggle` | Recolhe ou abre o menu lateral. |
| `data-he-count`, `data-he-count-hide`, `data-he-count-keep` | Contadores. |
| `data-he-carousel`, `data-he-player`, `data-he-views`, `data-he-tabs`, `data-he-steps`, `data-he-decide-bar`, `data-he-chips`, `data-he-time` | Componentes ligados pelo `HE.init`. |
| `data-he-drag`, `data-he-drop`, `data-he-drop-locked`, `data-he-nodrag`, `data-he-axis` | Arrastar e soltar. |
| `data-he-composer-enter` | Formulário em que `Enter` envia. |

## O que o JS escreve no `<html>`

| Classe ou variável | Quando |
|---|---|
| `data-he-theme="light\|dark"` | Sempre. |
| `he-lock`, `--he-sbw` | Há gaveta, folha, paleta ou camada aberta. |
| `he-dock-open` | O campo de pedido está em uso. |
| `--he-dock-h` | Altura do campo de pedido em repouso. |
| `he-layer-open` | A camada de detalhe está aberta. |
| `he-has-decide` | Há barra de decisão fixa na tela. |
| `he-dragging` | Um arrasto está em curso. |
| `he-nav-open`, `he-nav-collapsed` | Menu lateral aberto (celular) ou recolhido (computador). |

Outras variáveis escritas pelo JS, nos próprios elementos: `--x` e `--y` (menu e marcadores), `--p`, `--t` e `--w` (linha do tempo), `--he-toast-ms` (barra do Desfazer).

## CSS

Todas as classes, os estados e as variáveis que o JavaScript usa estão em `dist/hedesign.css`. O JS só escreve classes
de estado, atributos `aria-*` e as variáveis listadas acima; nenhuma aparência é definida por ele.

## Teste

```sh
python3 tests/js/test_js.py
```

Abre `tests/js/harness.html` por `file://` no Chromium (Playwright), em 1440x900 e em 390x844, confere cada módulo e imprime `OK nome`. Termina com `RESULTADO: N de N passaram` e sai com código 1 se algo falhar ou se a página registrar erro no console.
