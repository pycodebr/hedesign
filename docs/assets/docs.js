/* Comportamentos só da documentação do hedesign. A biblioteca em si é dist/hedesign.js (window.HE). */
(function () {
  "use strict";
  var HE = window.HE;
  if (!HE) return;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return [].slice.call((r || document).querySelectorAll(s)); };

  function copy(text, done) {
    var ok = function () { HE.toast({ kind: "ok", text: done || "Copiado." }); };
    if (navigator.clipboard && window.isSecureContext) navigator.clipboard.writeText(text).then(ok, fallback);
    else fallback();
    function fallback() {
      var ta = document.createElement("textarea");
      ta.value = text; ta.style.cssText = "position:fixed;opacity:0";
      document.body.appendChild(ta); ta.select();
      try { document.execCommand("copy"); ok(); } catch (e) { HE.toast({ kind: "error", text: "Não consegui copiar." }); }
      ta.remove();
    }
  }

  /* Menu lateral: marca a seção visível e atualiza o caminho do topo */
  var links = $$("[data-doc-nav]"), current = $("[data-doc-current]"), secs = $$("[data-doc-sec]");
  function mark(id) {
    links.forEach(function (a) {
      var on = a.getAttribute("data-doc-nav") === id;
      a.classList.toggle("is-active", on);
      if (on) { a.setAttribute("aria-current", "true"); if (current) current.textContent = a.textContent; } else a.removeAttribute("aria-current");
    });
  }
  if ("IntersectionObserver" in window && secs.length) {
    var seen = {};
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { seen[e.target.id] = e.isIntersecting; });
      for (var i = 0; i < secs.length; i++) if (seen[secs[i].id]) { mark(secs[i].id); break; }
    }, { rootMargin: "-80px 0px -60% 0px" });
    secs.forEach(function (s) { io.observe(s); });
  }
  links.forEach(function (a) { a.addEventListener("click", function () { if (window.innerWidth < 1024) HE.sidebar.close(); }); });

  /* Copiar código */
  document.addEventListener("click", function (e) {
    var b = e.target.closest("[data-doc-copy]");
    if (b) { var code = $("code", b.parentNode); if (code) copy(code.textContent, "Código copiado."); }
  });

  /* Cores: mostra o valor do token no tema em que a amostra está e copia o nome */
  function fillTokens() {
    $$("[data-doc-token]").forEach(function (el) {
      var out = $("small", el), v = getComputedStyle(el).getPropertyValue(el.getAttribute("data-doc-token")).trim();
      if (out) out.textContent = v.length > 26 ? v.slice(0, 24) + "…" : v;
    });
  }
  fillTokens();
  document.addEventListener("he:theme", fillTokens);
  document.addEventListener("click", function (e) {
    var sw = e.target.closest("[data-doc-token]");
    if (sw) copy("var(" + sw.getAttribute("data-doc-token") + ")", sw.getAttribute("data-doc-token") + " copiado.");
  });

  /* Ícones: grade montada a partir do sprite */
  var grid = $("[data-doc-icons]");
  if (grid) {
    var names = $$("#he-sprite symbol").map(function (s) { return s.id.replace("he-i-", ""); });
    grid.innerHTML = names.map(function (n) {
      return '<button type="button" class="doc-icon" data-doc-icon="' + n + '" title="' + n + '">' + HE.icon(n) + "<span>" + n + "</span></button>";
    }).join("");
    grid.addEventListener("click", function (e) {
      var b = e.target.closest("[data-doc-icon]");
      if (b) copy('<svg class="he-i" aria-hidden="true" focusable="false"><use href="#he-i-' + b.getAttribute("data-doc-icon") + '"/></svg>', "Ícone " + b.getAttribute("data-doc-icon") + " copiado.");
    });
  }

  /* Movimento: clicar repete a animação */
  document.addEventListener("click", function (e) {
    var item = e.target.closest("[data-doc-anim]");
    if (!item) return;
    var target = $(".doc-motion__stage > *", item);
    if (!target) return;
    target.style.animation = "none";
    void target.offsetWidth;
    target.style.animation = item.getAttribute("data-doc-anim");
  });

  /* Paleta: seções da documentação e exemplos */
  HE.palette.register({ group: "Seções", items: links.map(function (a) { return { label: a.textContent.trim(), icon: "file", href: a.getAttribute("href"), hint: "documentação" }; }) });
  HE.palette.register({ group: "Exemplos", items: $$(".doc-shot").map(function (a) { return { label: $("span", a).firstChild.textContent.trim(), icon: "grid", href: a.getAttribute("href"), hint: "tela completa" }; }) });
  HE.palette.register({ group: "Ações", items: [
    { label: "Alternar o tema", icon: "moon", onSelect: function () { HE.theme.toggle(); } },
    { label: "Ver os atalhos", icon: "keyboard", onSelect: function () { HE.shortcuts.open(); } }
  ] });
  HE.shortcuts.add("Documentação", ["T"], "Alternar o tema");
  document.addEventListener("keydown", function (e) {
    if (e.key === "t" && !e.ctrlKey && !e.metaKey && !e.altKey && !HE.util.isTyping(e.target) && !HE.overlayOpen()) HE.theme.toggle();
  });

  /* Campo de pedido: nesta página a "IA" só finge que trabalha */
  var states = ["idle", "working", "waiting"], stateIndex = 0;
  HE.dock.onAsk = function (detail) {
    HE.presence.set({ state: "working", working: 1 });
    return new Promise(function (resolve) {
      setTimeout(function () {
        HE.presence.set({ state: "idle" });
        HE.toast({ kind: "ai", text: "Pedido recebido: “" + detail.prompt.slice(0, 60) + "”.", sub: "Nesta página a IA é só uma demonstração." });
        resolve();
      }, 1400);
    });
  };
  HE.dock.setContext([{ key: "tela", label: "Documentação", value: "docs" }]);
  var SUGS = [
    { label: "Montar uma tela de painel", prompt: "Monte uma tela de painel com o hedesign." },
    { label: "Aplicar no meu projeto", prompt: "Aplique o hedesign no meu projeto." },
    { label: "Auditar uma tela", prompt: "Audite esta tela contra as regras do hedesign." }
  ];
  HE.dock.setSuggestions(SUGS);
  HE.presence.onOpen = function () {
    HE.drawer.open({ title: "Atividade da IA", body: HE.presence.renderActivity([
      { id: 1, title: "Texto do carrossel", step: "Escrevendo a lâmina 4 de 7", status: "running", meta: "começou há 40 s" },
      { id: 2, title: "Pesquisa de referências", step: "Na fila", status: "queued" },
      { id: 3, title: "Legenda do vídeo", step: "A busca não respondeu a tempo", status: "failed" }
    ]) });
  };
  HE.newMenu.items = [
    { label: "Ideia", sub: "Uma linha, para não perder", icon: "bulb", tone: "blue", onClick: function () { HE.toast("Ideia guardada."); } },
    { label: "Carrossel", sub: "A IA escreve o primeiro texto", icon: "carousel", tone: "violet", onClick: function () { HE.toast({ kind: "ai", text: "A IA começou o carrossel." }); } },
    { label: "Vídeo curto", sub: "Roteiro e envio da gravação", icon: "reel", tone: "pink", onClick: function () { HE.toast("Vídeo criado."); } },
    { label: "Referência", sub: "Link, imagem ou nota", icon: "link", tone: "ai", onClick: function () { HE.toast("Referência guardada."); } }
  ];

  var actions = {
    "ask": function () { HE.dock.focus(); },
    "theme-auto": function () { HE.theme.set("auto"); HE.toast("O tema agora segue o sistema."); },
    "toast-undo": function () { HE.toast({ text: "Item arquivado.", onUndo: function () { HE.toast({ kind: "ok", text: "Item restaurado." }); } }); },
    "toast-ok": function () { HE.toast({ kind: "ok", text: "Aprovado e agendado para quinta, 18h." }); },
    "toast-error": function () { HE.toast({ kind: "error", text: "Não consegui salvar a legenda.", sub: "A conexão caiu. O texto continua aqui.", action: { label: "Tentar de novo", onClick: function () { HE.toast({ kind: "ok", text: "Legenda salva." }); } } }); },
    "toast-ai": function () { HE.toast({ kind: "ai", text: "A IA terminou o texto do carrossel." }); },
    "drawer": function () { HE.drawer.open({ title: "Filtros", body: '<div class="he-stack"><div class="he-field"><label for="dw-1">Campanha</label><input class="he-input" id="dw-1" placeholder="Todas"></div><div class="he-chips"><button type="button" class="he-chip" aria-pressed="true">Com você</button><button type="button" class="he-chip" aria-pressed="false">Com a IA</button></div></div>', foot: '<button type="button" class="he-btn" data-he-close>Limpar</button><button type="button" class="he-btn he-btn--primary" data-he-close>Aplicar</button>' }); },
    "sheet": function () { HE.sheet({ title: "Marcar como publicado", body: '<div class="he-stack"><p class="he-sheet__lead">Cole o endereço da publicação para a IA acompanhar os resultados.</p><div class="he-field"><label for="sh-1">Endereço</label><input class="he-input" id="sh-1" placeholder="https://"></div></div>', foot: '<button type="button" class="he-btn" data-he-close>Agora não</button><button type="button" class="he-btn he-btn--primary" data-he-close>Marcar</button>' }); },
    "layer": function () { HE.layer.open({ title: "5 erros no seu primeiro agente", body: '<header class="he-head"><div class="he-head__main"><h1>5 erros no seu primeiro agente</h1><p class="he-head__sub">A camada de detalhe cobre a tela e devolve você ao mesmo ponto ao fechar.</p></div></header><ol class="he-steps" style="max-width:640px"><li class="he-steps__step is-done" data-tone="blue"><span>Ideia</span></li><li class="he-steps__step is-done" data-tone="violet"><span>Texto</span></li><li class="he-steps__step is-current" data-tone="pink" aria-current="step"><span>Produção</span></li><li class="he-steps__step" data-tone="orange"><span>Aprovação</span></li></ol>' }); },
    "menu": function (btn) { HE.menu.open(btn, HE.newMenu.items); },
    "glow": function (btn) { var p = $(".he-panel", btn.closest(".doc-demo")); if (p) HE.glow(p, !p.classList.contains("he-glow"), "IA escrevendo"); },
    "context": function () { HE.dock.addContext({ key: "item", label: "5 erros no seu primeiro agente", value: 12 }); HE.dock.focus(); },
    "suggestions": function () { HE.dock.setSuggestions([{ label: "Refazer esta lâmina", prompt: "Refaça esta lâmina." }, { label: "Outro gancho", prompt: "Proponha outro gancho." }]); HE.dock.focus(); },
    "presence": function () { stateIndex = (stateIndex + 1) % 3; HE.presence.set({ state: states[stateIndex], working: 2, waiting: 1 }); },
    "stamp-ok": function () { stamp("Aprovado", "ok", "check"); },
    "stamp-adjust": function () { stamp("Ajuste pedido", "adjust", "edit"); },
    "stamp-denied": function () { stamp("Negado", "denied", "x"); }
  };
  function stamp(text, kind, icon) { var t = $("[data-doc-stamp-target]"); if (t) HE.stamp(t, { text: text, kind: kind, icon: icon }); }
  document.addEventListener("click", function (e) {
    var b = e.target.closest("[data-doc]");
    if (b && actions[b.getAttribute("data-doc")]) { e.preventDefault(); actions[b.getAttribute("data-doc")](b); }
  });

  /* Quadro e barra de decisão das demonstrações */
  $$("[data-doc-board]").forEach(function (board) {
    HE.dnd(board, { item: "[data-he-drag]", zone: "[data-he-drop]", onDrop: function (ctx) {
      $$(".he-col", board).forEach(function (c) { var n = $(".he-col__n", c); if (n) n.textContent = $$(".he-card", c).length; });
      HE.toast({ text: "Item movido.", onUndo: function () { ctx.revert(); $$(".he-col", board).forEach(function (c) { var n = $(".he-col__n", c); if (n) n.textContent = $$(".he-card", c).length; }); } });
    } });
  });
  $$("[data-he-decide-bar]").forEach(function (bar) {
    HE.decide(bar, {
      onApprove: function () { HE.toast({ kind: "ok", text: "Aprovado e agendado para quinta, 18h.", onUndo: function () {} }); },
      onAdjust: function () { HE.toast({ kind: "ai", text: "Ajuste enviado à IA." }); },
      onDeny: function () { HE.toast({ text: "Negado e arquivado.", onUndo: function () {} }); },
      onSwap: function () { actions.sheet(); }
    });
  });
  $$("[data-doc-composer]").forEach(function (form) {
    form.addEventListener("submit", function (e) { e.preventDefault(); var t = $("textarea", form); if (t && t.value.trim()) { HE.toast({ kind: "ai", text: "Pedido recebido." }); t.value = ""; HE.composer.sync(t); } });
  });
})();
