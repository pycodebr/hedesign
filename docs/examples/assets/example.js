/* Ligações comuns dos exemplos do hedesign. Tudo aqui é demonstração: os dados são fictícios e nada sai da página.
   Em um sistema de verdade, cada função abaixo conversa com o seu servidor. */
(function () {
  "use strict";
  var HE = window.HE;
  if (!HE) return;
  var $ = HE.util.$, $$ = HE.util.$$;
  var EX = window.EX = {};

  /* Fila e presença iniciais */
  HE.counts.set({ fila: 3 });
  HE.presence.set({ state: "working", working: 2 });

  EX.jobs = [
    { id: 11, title: "O prompt que mudou meu fluxo", step: "Escrevendo a lâmina 4 de 7", status: "running", meta: "Texto · pedido há 2 min", href: "item.html" },
    { id: 12, title: "Pesquisa: o que mudou na distribuição de vídeos curtos", step: "Na fila", status: "queued", meta: "Pesquisa" }
  ];
  HE.presence.onOpen = function () {
    HE.drawer.open({ title: "Atividade da IA", body: HE.presence.renderActivity(EX.jobs) });
  };

  /* O pedido "vai" para a IA: aqui só espera um instante e avisa */
  HE.dock.onAsk = function (detail) {
    HE.presence.set({ state: "working", working: 3 });
    return new Promise(function (resolve) {
      window.setTimeout(function () {
        HE.presence.set({ state: "working", working: 2 });
        HE.toast({ kind: "ai", text: "Pedido recebido.", sub: "“" + detail.prompt.slice(0, 70) + "”" });
        resolve();
      }, 1200);
    });
  };

  /* Menu Novo */
  HE.newMenu.items = [
    { label: "Ideia", sub: "Uma linha, para não perder", icon: "bulb", tone: "blue", onClick: function () { HE.toast({ text: "Ideia guardada.", onUndo: function () {} }); } },
    { label: "Carrossel", sub: "A IA escreve o primeiro texto", icon: "carousel", tone: "violet", onClick: function () { HE.toast({ kind: "ai", text: "A IA começou o carrossel." }); } },
    { label: "Vídeo curto", sub: "Roteiro e envio da gravação", icon: "reel", tone: "pink", onClick: function () { HE.toast("Vídeo criado em Ideia."); } },
    { label: "Referência", sub: "Link, imagem ou nota", icon: "link", tone: "ai", onClick: function () { window.location.href = "referencias.html"; } }
  ];

  /* Paleta: telas e itens fictícios */
  HE.palette.register({ group: "Ir para", items: [
    { label: "Painel", icon: "compass", href: "painel.html" },
    { label: "Planejamento", icon: "board", href: "planejamento.html" },
    { label: "Fila de revisão", icon: "inbox", href: "fila.html", hint: "3 esperando" },
    { label: "Referências", icon: "bulb", href: "referencias.html" },
    { label: "Resultados", icon: "chart", href: "resultados.html" },
    { label: "Conversa com a IA", icon: "comment", href: "conversa.html" },
    { label: "Ajustes", icon: "gear", href: "ajustes.html" }
  ] });
  HE.palette.register({ group: "Itens", items: [
    { label: "5 erros no seu primeiro agente", hint: "Aprovação", tone: "orange", icon: "carousel", href: "item.html" },
    { label: "O prompt que mudou meu fluxo", hint: "Texto", tone: "violet", icon: "carousel", href: "item.html" },
    { label: "Python em 30 segundos", hint: "Produção", tone: "pink", icon: "reel", href: "item.html" },
    { label: "Checklist de publicação sem susto", hint: "Agendado", tone: "teal", icon: "carousel", href: "item.html" }
  ] });
  HE.palette.register({ group: "Ações", items: [
    { label: "Alternar o tema", icon: "moon", onSelect: function () { HE.theme.toggle(); } },
    { label: "Ver os atalhos", icon: "keyboard", onSelect: function () { HE.shortcuts.open(); } },
    { label: "Documentação do hedesign", icon: "file", href: "../index.html" }
  ] });

  /* Respostas à pergunta da IA */
  document.addEventListener("click", function (e) {
    var b = e.target.closest("[data-ex-answer]");
    if (!b) return;
    var q = b.closest(".he-question");
    if (q) q.classList.add("is-answered");
    $$("button", q).forEach(function (x) { x.disabled = true; });
    HE.presence.set({ state: "working", working: 2 });
    HE.toast({ kind: "ai", text: "Resposta enviada: " + b.textContent.trim() + "." });
  });

  /* Botões que entregam um pedido pronto à IA */
  document.addEventListener("click", function (e) {
    var b = e.target.closest("[data-ex-ask]");
    if (b) { e.preventDefault(); HE.dock.focus(b.getAttribute("data-ex-ask")); }
  });

  /* Aviso simples por atributo, para ações de demonstração */
  document.addEventListener("click", function (e) {
    var b = e.target.closest("[data-ex-toast]");
    if (!b) return;
    e.preventDefault();
    var opts = { text: b.getAttribute("data-ex-toast"), kind: b.getAttribute("data-ex-kind") || undefined };
    if (b.hasAttribute("data-ex-undo")) opts.onUndo = function () {};
    HE.toast(opts);
  });
})();
