/*! hedesign 1.0.1 · MIT · https://github.com/pycodebr/hedesign */
/* hedesign.js
   Comportamentos do design system hedesign. API pública em window.HE; referência em docs/api-js.md.
   Um arquivo só, sem dependências e sem build. Não faz chamadas de rede: o que depende do servidor
   chega à aplicação por callback ou por evento. */
(function () {
  "use strict";
  if (window.HE && window.HE.version) return;

  var doc = document, html = doc.documentElement;
  /* O build troca as duas marcas abaixo: a versão do pacote e o conteúdo do sprite de ícones. */
  var HE = window.HE = { version: "1.0.1" };
  var SPRITE = "<svg id=\"he-sprite\" class=\"he-sprite\" xmlns=\"http://www.w3.org/2000/svg\" aria-hidden=\"true\" focusable=\"false\"><defs><linearGradient id=\"he-grad-ai\" x1=\"0\" y1=\"0\" x2=\"1\" y2=\"1\"><stop offset=\"0\" stop-color=\"#6b3fa8\"/><stop offset=\".55\" stop-color=\"#3d5fd9\"/><stop offset=\"1\" stop-color=\"#0075de\"/></linearGradient></defs>\n<symbol id=\"he-i-check\" viewBox=\"0 0 24 24\"><path d=\"m5 12 4.5 4.5L19 7\"/></symbol>\n<symbol id=\"he-i-x\" viewBox=\"0 0 24 24\"><path d=\"M6 6l12 12M18 6 6 18\"/></symbol>\n<symbol id=\"he-i-search\" viewBox=\"0 0 24 24\"><circle cx=\"11\" cy=\"11\" r=\"7\"/><path d=\"m20 20-3.5-3.5\"/></symbol>\n<symbol id=\"he-i-upload\" viewBox=\"0 0 24 24\"><path d=\"M12 16V4M7 9l5-5 5 5\"/><path d=\"M4 16v3a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-3\"/></symbol>\n<symbol id=\"he-i-download\" viewBox=\"0 0 24 24\"><path d=\"M12 4v12M7 11l5 5 5-5\"/><path d=\"M4 16v3a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-3\"/></symbol>\n<symbol id=\"he-i-play\" viewBox=\"0 0 24 24\"><path d=\"M7 4v16l13-8Z\"/></symbol>\n<symbol id=\"he-i-pause\" viewBox=\"0 0 24 24\"><path d=\"M8 5v14M16 5v14\"/></symbol>\n<symbol id=\"he-i-copy\" viewBox=\"0 0 24 24\"><rect x=\"9\" y=\"9\" width=\"11\" height=\"11\" rx=\"2\"/><path d=\"M5 15V5a2 2 0 0 1 2-2h10\"/></symbol>\n<symbol id=\"he-i-trash\" viewBox=\"0 0 24 24\"><path d=\"M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3\"/></symbol>\n<symbol id=\"he-i-edit\" viewBox=\"0 0 24 24\"><path d=\"M12 20h9\"/><path d=\"M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z\"/></symbol>\n<symbol id=\"he-i-arrow_left\" viewBox=\"0 0 24 24\"><path d=\"M19 12H5M11 18l-6-6 6-6\"/></symbol>\n<symbol id=\"he-i-chevron_right\" viewBox=\"0 0 24 24\"><path d=\"m9 6 6 6-6 6\"/></symbol>\n<symbol id=\"he-i-external\" viewBox=\"0 0 24 24\"><path d=\"M14 4h6v6M20 4l-9 9\"/><path d=\"M19 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h5\"/></symbol>\n<symbol id=\"he-i-refresh\" viewBox=\"0 0 24 24\"><path d=\"M20 11a8 8 0 0 0-14.8-4.2L4 8M4 4v4h4M4 13a8 8 0 0 0 14.8 4.2L20 16M20 20v-4h-4\"/></symbol>\n<symbol id=\"he-i-calendar\" viewBox=\"0 0 24 24\"><rect x=\"3\" y=\"5\" width=\"18\" height=\"16\" rx=\"2\"/><path d=\"M3 10h18M8 3v4M16 3v4\"/></symbol>\n<symbol id=\"he-i-info\" viewBox=\"0 0 24 24\"><circle cx=\"12\" cy=\"12\" r=\"9\"/><path d=\"M12 11v5M12 8h.01\"/></symbol>\n<symbol id=\"he-i-chart\" viewBox=\"0 0 24 24\"><path d=\"M4 20V10M10 20V4M16 20v-7M22 20H2\"/></symbol>\n<symbol id=\"he-i-star\" viewBox=\"0 0 24 24\"><path d=\"m12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9Z\"/></symbol>\n<symbol id=\"he-i-alert\" viewBox=\"0 0 24 24\"><path d=\"M12 3 2 20h20Z\"/><path d=\"M12 10v4M12 17h.01\"/></symbol>\n<symbol id=\"he-i-trend\" viewBox=\"0 0 24 24\"><path d=\"m3 17 6-6 4 4 8-8\"/><path d=\"M14 7h7v7\"/></symbol>\n<symbol id=\"he-i-filter\" viewBox=\"0 0 24 24\"><path d=\"M3 5h18l-7 8v6l-4 2v-8Z\"/></symbol>\n<symbol id=\"he-i-sparkles\" viewBox=\"0 0 24 24\"><path d=\"M10 3.5 11.6 8a2 2 0 0 0 1.2 1.2l4.5 1.6-4.5 1.6a2 2 0 0 0-1.2 1.2L10 18.1l-1.6-4.5a2 2 0 0 0-1.2-1.2L2.7 10.8l4.5-1.6A2 2 0 0 0 8.4 8Z\"/><path d=\"M19 3v4M17 5h4M18 16v3M16.5 17.5h3\"/></symbol>\n<symbol id=\"he-i-eye\" viewBox=\"0 0 24 24\"><path d=\"M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z\"/><circle cx=\"12\" cy=\"12\" r=\"3\"/></symbol>\n<symbol id=\"he-i-grip\" viewBox=\"0 0 24 24\"><circle cx=\"9\" cy=\"6\" r=\"1\"/><circle cx=\"15\" cy=\"6\" r=\"1\"/><circle cx=\"9\" cy=\"12\" r=\"1\"/><circle cx=\"15\" cy=\"12\" r=\"1\"/><circle cx=\"9\" cy=\"18\" r=\"1\"/><circle cx=\"15\" cy=\"18\" r=\"1\"/></symbol>\n<symbol id=\"he-i-arrow_up\" viewBox=\"0 0 24 24\"><path d=\"M12 19V5M5 12l7-7 7 7\"/></symbol>\n<symbol id=\"he-i-arrow_down\" viewBox=\"0 0 24 24\"><path d=\"M12 5v14M19 12l-7 7-7-7\"/></symbol>\n<symbol id=\"he-i-undo\" viewBox=\"0 0 24 24\"><path d=\"M9 14 4 9l5-5\"/><path d=\"M4 9h10.5a5.5 5.5 0 0 1 0 11H11\"/></symbol>\n<symbol id=\"he-i-redo\" viewBox=\"0 0 24 24\"><path d=\"m15 14 5-5-5-5\"/><path d=\"M20 9H9.5a5.5 5.5 0 0 0 0 11H13\"/></symbol>\n<symbol id=\"he-i-smartphone\" viewBox=\"0 0 24 24\"><rect x=\"6\" y=\"2\" width=\"12\" height=\"20\" rx=\"2\"/><path d=\"M11 18h2\"/></symbol>\n<symbol id=\"he-i-type\" viewBox=\"0 0 24 24\"><path d=\"M4 7V5h16v2M9 19h6M12 5v14\"/></symbol>\n<symbol id=\"he-i-image\" viewBox=\"0 0 24 24\"><rect x=\"3\" y=\"3\" width=\"18\" height=\"18\" rx=\"2\"/><circle cx=\"9\" cy=\"9\" r=\"2\"/><path d=\"m21 15-5-5L5 21\"/></symbol>\n<symbol id=\"he-i-link\" viewBox=\"0 0 24 24\"><path d=\"M10 13a5 5 0 0 0 7.5.5l3-3a5 5 0 0 0-7-7l-1.7 1.7\"/><path d=\"M14 11a5 5 0 0 0-7.5-.5l-3 3a5 5 0 0 0 7 7l1.7-1.7\"/></symbol>\n<symbol id=\"he-i-history\" viewBox=\"0 0 24 24\"><path d=\"M3 12a9 9 0 1 0 3-6.7L3 8\"/><path d=\"M3 3v5h5M12 7v5l3 2\"/></symbol>\n<symbol id=\"he-i-quote\" viewBox=\"0 0 24 24\"><path d=\"M7 7h4v4c0 3-1.5 5-4 6M15 7h4v4c0 3-1.5 5-4 6\"/></symbol>\n<symbol id=\"he-i-gear\" viewBox=\"0 0 24 24\"><circle cx=\"12\" cy=\"12\" r=\"3\"/><path d=\"M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1Z\"/></symbol>\n<symbol id=\"he-i-plus\" viewBox=\"0 0 24 24\"><path d=\"M12 5v14M5 12h14\"/></symbol>\n<symbol id=\"he-i-clock\" viewBox=\"0 0 24 24\"><circle cx=\"12\" cy=\"12\" r=\"9\"/><path d=\"M12 7v5l3 2\"/></symbol>\n<symbol id=\"he-i-list\" viewBox=\"0 0 24 24\"><path d=\"M8 6h13M8 12h13M8 18h13\"/><circle cx=\"3.5\" cy=\"6\" r=\"1\"/><circle cx=\"3.5\" cy=\"12\" r=\"1\"/><circle cx=\"3.5\" cy=\"18\" r=\"1\"/></symbol>\n<symbol id=\"he-i-bolt\" viewBox=\"0 0 24 24\"><path d=\"M13 2 4 14h7l-1 8 9-12h-7Z\"/></symbol>\n<symbol id=\"he-i-user\" viewBox=\"0 0 24 24\"><circle cx=\"12\" cy=\"8\" r=\"4\"/><path d=\"M4 21c1-4 4.2-6 8-6s7 2 8 6\"/></symbol>\n<symbol id=\"he-i-minus\" viewBox=\"0 0 24 24\"><path d=\"M5 12h14\"/></symbol>\n<symbol id=\"he-i-file\" viewBox=\"0 0 24 24\"><path d=\"M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9Z\"/><path d=\"M14 3v6h6M8 13h8M8 17h5\"/></symbol>\n<symbol id=\"he-i-paperclip\" viewBox=\"0 0 24 24\"><path d=\"m21 11-8.5 8.5a5 5 0 0 1-7-7L14 4a3.5 3.5 0 0 1 5 5l-8.5 8.5a2 2 0 0 1-3-3L15 7\"/></symbol>\n<symbol id=\"he-i-send\" viewBox=\"0 0 24 24\"><path d=\"M21 3 10 14\"/><path d=\"m21 3-7 18-4-7-7-4Z\"/></symbol>\n<symbol id=\"he-i-tag\" viewBox=\"0 0 24 24\"><path d=\"M20.6 13.4 13.4 20.6a2 2 0 0 1-2.8 0L3 13V3h10l7.6 7.6a2 2 0 0 1 0 2.8Z\"/><circle cx=\"8\" cy=\"8\" r=\"1.4\"/></symbol>\n<symbol id=\"he-i-sun\" viewBox=\"0 0 24 24\"><circle cx=\"12\" cy=\"12\" r=\"4\"/><path d=\"M12 2.5v2M12 19.5v2M5.3 5.3l1.4 1.4M17.3 17.3l1.4 1.4M2.5 12h2M19.5 12h2M5.3 18.7l1.4-1.4M17.3 6.7l1.4-1.4\"/></symbol>\n<symbol id=\"he-i-moon\" viewBox=\"0 0 24 24\"><path d=\"M20 14.5A8.5 8.5 0 0 1 9.5 4 8.5 8.5 0 1 0 20 14.5Z\"/></symbol>\n<symbol id=\"he-i-bulb\" viewBox=\"0 0 24 24\"><path d=\"M9.5 18h5M10.5 21h3\"/><path d=\"M12 3a6 6 0 0 0-3.6 10.8c.6.5 1 1.3 1.1 2.2h5c.1-.9.5-1.7 1.1-2.2A6 6 0 0 0 12 3Z\"/></symbol>\n<symbol id=\"he-i-board\" viewBox=\"0 0 24 24\"><rect x=\"3\" y=\"4\" width=\"5\" height=\"16\" rx=\"1.5\"/><rect x=\"9.5\" y=\"4\" width=\"5\" height=\"10\" rx=\"1.5\"/><rect x=\"16\" y=\"4\" width=\"5\" height=\"13\" rx=\"1.5\"/></symbol>\n<symbol id=\"he-i-grid\" viewBox=\"0 0 24 24\"><rect x=\"3\" y=\"3\" width=\"7.5\" height=\"7.5\" rx=\"1.5\"/><rect x=\"13.5\" y=\"3\" width=\"7.5\" height=\"7.5\" rx=\"1.5\"/><rect x=\"3\" y=\"13.5\" width=\"7.5\" height=\"7.5\" rx=\"1.5\"/><rect x=\"13.5\" y=\"13.5\" width=\"7.5\" height=\"7.5\" rx=\"1.5\"/></symbol>\n<symbol id=\"he-i-library\" viewBox=\"0 0 24 24\"><rect x=\"4\" y=\"4\" width=\"4\" height=\"16\" rx=\"1\"/><rect x=\"8\" y=\"4\" width=\"4\" height=\"16\" rx=\"1\"/><path d=\"m14.2 6.6 3.6-1 3.8 13.8-3.6 1Z\"/></symbol>\n<symbol id=\"he-i-heart\" viewBox=\"0 0 24 24\"><path d=\"M12 20.5S4.6 16 2.9 11.3C1.7 8 3.6 4.5 7.1 4.5c1.9 0 3.5 1 4.9 2.8 1.4-1.8 3-2.8 4.9-2.8 3.5 0 5.4 3.5 4.2 6.8C19.4 16 12 20.5 12 20.5Z\"/></symbol>\n<symbol id=\"he-i-comment\" viewBox=\"0 0 24 24\"><path d=\"M20.5 12a8.5 8.5 0 0 1-12.7 7.4L3.5 20.5l1.2-4.2A8.5 8.5 0 1 1 20.5 12Z\"/></symbol>\n<symbol id=\"he-i-share\" viewBox=\"0 0 24 24\"><path d=\"M21.5 3 2.5 10.5l7 3 3 7Z\"/><path d=\"M21.5 3 9.5 13.5\"/></symbol>\n<symbol id=\"he-i-bookmark\" viewBox=\"0 0 24 24\"><path d=\"M6 3.5h12v17l-6-4.5-6 4.5Z\"/></symbol>\n<symbol id=\"he-i-more\" viewBox=\"0 0 24 24\"><circle cx=\"5\" cy=\"12\" r=\"1.1\"/><circle cx=\"12\" cy=\"12\" r=\"1.1\"/><circle cx=\"19\" cy=\"12\" r=\"1.1\"/></symbol>\n<symbol id=\"he-i-chevron_left\" viewBox=\"0 0 24 24\"><path d=\"m15 6-6 6 6 6\"/></symbol>\n<symbol id=\"he-i-chevron_down\" viewBox=\"0 0 24 24\"><path d=\"m6 9 6 6 6-6\"/></symbol>\n<symbol id=\"he-i-chevron_up\" viewBox=\"0 0 24 24\"><path d=\"m6 15 6-6 6 6\"/></symbol>\n<symbol id=\"he-i-arrow_right\" viewBox=\"0 0 24 24\"><path d=\"M5 12h14M13 6l6 6-6 6\"/></symbol>\n<symbol id=\"he-i-volume\" viewBox=\"0 0 24 24\"><path d=\"M4 9.5v5h3.5L12 18V6L7.5 9.5Z\"/><path d=\"M15.5 9a4 4 0 0 1 0 6M18 6.5a8 8 0 0 1 0 11\"/></symbol>\n<symbol id=\"he-i-mute\" viewBox=\"0 0 24 24\"><path d=\"M4 9.5v5h3.5L12 18V6L7.5 9.5Z\"/><path d=\"m16 9.5 5 5M21 9.5l-5 5\"/></symbol>\n<symbol id=\"he-i-note\" viewBox=\"0 0 24 24\"><path d=\"M5 4h14v10l-6 6H5Z\"/><path d=\"M19 14h-6v6M8.5 9h7M8.5 12.5h3.5\"/></symbol>\n<symbol id=\"he-i-video\" viewBox=\"0 0 24 24\"><rect x=\"3\" y=\"6\" width=\"13\" height=\"12\" rx=\"2\"/><path d=\"m16 10.5 5-3v9l-5-3\"/></symbol>\n<symbol id=\"he-i-reel\" viewBox=\"0 0 24 24\"><rect x=\"3\" y=\"3\" width=\"18\" height=\"18\" rx=\"4.5\"/><path d=\"M3 8.5h18M8 3l2.5 5.5M14 3l2.5 5.5\"/><path d=\"M10.5 12v5l4.5-2.5Z\"/></symbol>\n<symbol id=\"he-i-carousel\" viewBox=\"0 0 24 24\"><rect x=\"6.5\" y=\"4\" width=\"11\" height=\"16\" rx=\"2\"/><path d=\"M3 7v10M21 7v10\"/></symbol>\n<symbol id=\"he-i-story\" viewBox=\"0 0 24 24\"><circle cx=\"12\" cy=\"12\" r=\"9\" stroke-dasharray=\"3.6 3\"/><path d=\"M12 8.5v7M8.5 12h7\"/></symbol>\n<symbol id=\"he-i-pin\" viewBox=\"0 0 24 24\"><path d=\"M9 3h6l-1 6 3.5 3.5V14h-11v-1.5L10 9Z\"/><path d=\"M12 14v7\"/></symbol>\n<symbol id=\"he-i-lock\" viewBox=\"0 0 24 24\"><rect x=\"5\" y=\"11\" width=\"14\" height=\"9\" rx=\"2\"/><path d=\"M8 11V8a4 4 0 0 1 8 0v3\"/></symbol>\n<symbol id=\"he-i-unlock\" viewBox=\"0 0 24 24\"><rect x=\"5\" y=\"11\" width=\"14\" height=\"9\" rx=\"2\"/><path d=\"M8 11V8a4 4 0 0 1 7.6-1.7\"/></symbol>\n<symbol id=\"he-i-keyboard\" viewBox=\"0 0 24 24\"><rect x=\"2.5\" y=\"6\" width=\"19\" height=\"12\" rx=\"2\"/><path d=\"M6.5 10h.01M10 10h.01M13.5 10h.01M17 10h.01M7.5 14h9\"/></symbol>\n<symbol id=\"he-i-mic\" viewBox=\"0 0 24 24\"><rect x=\"9\" y=\"3\" width=\"6\" height=\"11\" rx=\"3\"/><path d=\"M5.5 11a6.5 6.5 0 0 0 13 0M12 17.5V21\"/></symbol>\n<symbol id=\"he-i-compass\" viewBox=\"0 0 24 24\"><circle cx=\"12\" cy=\"12\" r=\"9\"/><path d=\"m15.5 8.5-2 5-5 2 2-5Z\"/></symbol>\n<symbol id=\"he-i-inbox\" viewBox=\"0 0 24 24\"><path d=\"M3 13.5 5.5 5h13L21 13.5V19H3Z\"/><path d=\"M3 13.5h5.5a3.5 3.5 0 0 0 7 0H21\"/></symbol>\n<symbol id=\"he-i-archive\" viewBox=\"0 0 24 24\"><rect x=\"3\" y=\"4\" width=\"18\" height=\"5\" rx=\"1.5\"/><path d=\"M5 9v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V9M10 13h4\"/></symbol>\n<symbol id=\"he-i-wand\" viewBox=\"0 0 24 24\"><path d=\"m4 20 10.5-10.5\"/><path d=\"M14.5 3.5l.9 2.1 2.1.9-2.1.9-.9 2.1-.9-2.1-2.1-.9 2.1-.9ZM19 12.5l.6 1.4 1.4.6-1.4.6-.6 1.4-.6-1.4-1.4-.6 1.4-.6Z\"/></symbol>\n<symbol id=\"he-i-swap\" viewBox=\"0 0 24 24\"><path d=\"M7 4 3 8l4 4M3 8h14M17 20l4-4-4-4M21 16H7\"/></symbol>\n<symbol id=\"he-i-music\" viewBox=\"0 0 24 24\"><path d=\"M9 18V5l11-2v13\"/><circle cx=\"6.5\" cy=\"18\" r=\"2.5\"/><circle cx=\"17.5\" cy=\"16\" r=\"2.5\"/></symbol>\n<symbol id=\"he-i-help\" viewBox=\"0 0 24 24\"><circle cx=\"12\" cy=\"12\" r=\"9\"/><path d=\"M9.5 9.5a2.5 2.5 0 1 1 3.6 2.2c-.7.4-1.1 1-1.1 1.8M12 17h.01\"/></symbol>\n<symbol id=\"he-i-camera\" viewBox=\"0 0 24 24\"><path d=\"M4 8h3l1.5-2.5h7L17 8h3a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1Z\"/><circle cx=\"12\" cy=\"13\" r=\"3.5\"/></symbol>\n<symbol id=\"he-i-target\" viewBox=\"0 0 24 24\"><circle cx=\"12\" cy=\"12\" r=\"9\"/><circle cx=\"12\" cy=\"12\" r=\"5\"/><circle cx=\"12\" cy=\"12\" r=\"1\"/></symbol>\n<symbol id=\"he-i-folder\" viewBox=\"0 0 24 24\"><path d=\"M3 6.5A1.5 1.5 0 0 1 4.5 5H9l2 2.5h8.5A1.5 1.5 0 0 1 21 9v8.5a1.5 1.5 0 0 1-1.5 1.5h-15A1.5 1.5 0 0 1 3 17.5Z\"/></symbol>\n</svg>";

  /* Local usado nas datas por extenso (padrão pt-BR). */
  HE.locale = "";

  /* ===== Textos =====
     Tudo o que aparece na tela ou é lido por leitor de tela. Troque com HE.config({labels: {chave: "texto"}}).
     Variáveis entram como {nome}; listas usam barra vertical entre os itens. */
  HE.labels = {
    close: "Fechar",
    cancel: "Cancelar",
    error: "Não deu certo.",
    retry: "Tentar de novo",

    themeUseLight: "Usar tema claro",
    themeUseDark: "Usar tema escuro",
    themeLight: "Tema claro",
    themeDark: "Tema escuro",

    toastClose: "Fechar aviso",
    undo: "Desfazer",
    undoing: "Desfazendo",
    undone: "Desfeito.",
    undoFailed: "Não deu para desfazer.",

    dockPlaceholder: "Peça à IA",
    dockRemoveContext: "Tirar {label} do contexto",
    askEmpty: "Escreva o pedido.",
    askFailed: "O pedido não foi enviado.",

    presenceIdle: "IA livre",
    presenceWorking: "Trabalhando em {n}",
    presenceWaiting: "Aguardando você",
    presenceIdleLong: "A IA está livre",
    presenceWorkingLongOne: "A IA está trabalhando em 1 pedido",
    presenceWorkingLongMany: "A IA está trabalhando em {n} pedidos",
    presenceWaitingLongOne: "A IA aguarda você em 1 pedido",
    presenceWaitingLongMany: "A IA aguarda você em {n} pedidos",
    presenceOpen: "Abrir atividade.",

    activityWaiting: "Aguardando você",
    activityRunning: "Em andamento",
    activityFailed: "Não concluídos",
    activityDone: "Concluídos",
    activityEmptyTitle: "A IA está livre",
    activityEmptyText: "Faça um pedido e acompanhe o andamento aqui.",
    jobUntitled: "Pedido à IA",
    jobQueued: "Na fila",
    jobRunning: "Trabalhando",
    jobWaiting: "Aguardando você",
    jobApproval: "Esperando sua permissão",
    jobFailed: "Não concluiu",
    jobCanceled: "Cancelado",
    jobDone: "Pronto",

    newTitle: "Criar",

    paletteTitle: "Buscar e agir",
    palettePlaceholder: "Buscar ou pedir",
    paletteClose: "Fechar busca",
    paletteResults: "Resultados",
    paletteActions: "Ações",
    paletteAsk: "Pedir à IA",
    paletteAskHint: "com o contexto da tela",
    paletteAskOpenHint: "abre o campo de pedido",
    paletteLoading: "Buscando",
    paletteError: "A busca não respondeu agora. As ações continuam funcionando.",
    paletteEmpty: "Nada encontrado com esse texto.",
    paletteHintMove: "escolher",
    paletteHintOpen: "abrir",
    paletteHintClose: "fechar",
    paletteThemeKeywords: "tema claro escuro aparência dark light",
    paletteShortcutsKeywords: "ajuda teclas atalhos teclado",

    layerLabel: "Detalhe",
    layerBack: "Voltar (Esc)",
    layerFull: "Abrir em página inteira",

    shortcutsTitle: "Atalhos de teclado",
    shortcutsAnywhere: "Em qualquer tela",
    shortcutsDecide: "Decisão",
    shortcutsPreview: "Prévia",
    shortcutsDrag: "Arrastar",
    shortcutAsk: "Pedir à IA",
    shortcutPalette: "Buscar e agir",
    shortcutClose: "Fechar e voltar ao ponto em que estava",
    shortcutHelp: "Mostrar estes atalhos",
    shortcutSlide: "Trocar de slide",
    shortcutPlay: "Tocar ou pausar o vídeo",
    shortcutMove: "Mover o item em foco",
    keySpace: "Espaço",
    keyArrows: "setas",

    carouselRole: "carrossel",
    carouselLabel: "Slide {i} de {n}",
    carouselPrev: "Slide anterior",
    carouselNext: "Próximo slide",
    carouselGo: "Ir para o slide {i}",
    captionMore: "mais",
    captionLess: "menos",

    playerPlay: "Tocar",
    playerPause: "Pausar",
    playerMute: "Tirar o som",
    playerUnmute: "Ligar o som",
    playerTimeline: "Linha do tempo",
    playerPosition: "{time} de {total}",

    pinLabel: "Comentário {n}",
    pinAt: "Comentário {n} em {time}",

    decideApprove: "Aprovar",
    decideAdjust: "Pedir ajuste",
    decideDeny: "Negar",
    decideFailed: "A decisão não foi registrada.",
    decideQuick: "Mais direto|Mais curto|Mais detalhe|Outro tom",
    decideQuickLabel: "Atalhos de ajuste",
    decideAdjustLabel: "O que ajustar",
    decideAdjustPlaceholder: "Escreva com suas palavras",
    decideAdjustSend: "Enviar à IA",
    decideAdjustEmpty: "Diga o que ajustar ou escolha um atalho.",
    decideSendHint: "envia.",
    decidePinTip: "Dica: feche e toque num ponto da prévia para prender um comentário ali.",
    decidePinPlaceholder: "O que ajustar neste ponto",
    decideDenyTitle: "Negar",
    decideReasons: "Fora do momento|Repetido|Fora do padrão",
    decideReasonLabel: "Motivo",
    decideDenyLabel: "Motivo (ajuda a IA a acertar da próxima vez)",
    decideDenyPlaceholder: "Opcional",
    decideDenySend: "Negar",
    decideDenyHint: "",

    glow: "IA trabalhando",

    stampOk: "Aprovado",
    stampAdjust: "Ajuste pedido",
    stampDenied: "Negado",

    dndFailed: "Não deu para mover.",
    dndMoved: "Movido, posição {n}.",
    dndMovedTo: "Movido para {zone}, posição {n}.",

    dateNow: "agora",
    dateMinutesAgo: "há {n} min",
    dateHoursAgo: "há {n} h",
    dateDaysAgo: "há {n} dias",
    dateYesterday: "ontem",
    dateToday: "hoje",
    dateTomorrow: "amanhã",
    dateWeekdays: "dom|seg|ter|qua|qui|sex|sáb"
  };

  /* Texto de HE.labels com variáveis no formato {nome}. */
  function t(key, vars) {
    var s = HE.labels[key];
    if (s == null) return "";
    s = String(s);
    if (!vars) return s;
    return s.replace(/\{(\w+)\}/g, function (m, k) { return vars[k] != null ? vars[k] : ""; });
  }
  /* Singular e plural: usa as chaves <chave>One e <chave>Many. */
  function tn(key, n) { return t(key + (n === 1 ? "One" : "Many"), { n: n }); }
  /* Lista guardada em um texto só, com os itens separados por barra vertical. */
  function tlist(key) {
    return t(key).split("|").map(function (s) { return s.trim(); }).filter(Boolean);
  }

  /* ===== Utilidades ===== */
  function $(sel, root) { return (root || doc).querySelector(sel); }
  function $$(sel, root) { return Array.prototype.slice.call((root || doc).querySelectorAll(sel)); }
  function noop() {}
  function esc(v) {
    return String(v == null ? "" : v).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function icon(name, cls) {
    return '<svg class="he-i' + (cls ? " " + cls : "") + '" aria-hidden="true" focusable="false"><use href="#he-i-' + esc(name) + '"/></svg>';
  }
  function el(tag, attrs, inner) {
    var node = doc.createElement(tag), k;
    if (attrs) {
      for (k in attrs) {
        if (!Object.prototype.hasOwnProperty.call(attrs, k) || attrs[k] == null || attrs[k] === false) continue;
        if (k === "class") node.className = attrs[k];
        else if (k === "text") node.textContent = attrs[k];
        else node.setAttribute(k, attrs[k] === true ? "" : attrs[k]);
      }
    }
    if (inner != null) {
      if (typeof inner === "string") node.innerHTML = inner; else node.appendChild(inner);
    }
    return node;
  }
  function emit(target, name, detail, cancelable) {
    var ev = new CustomEvent(name, { bubbles: true, cancelable: !!cancelable, detail: detail || {} });
    (target || doc).dispatchEvent(ev);
    return ev;
  }
  function media(query) { return !!(window.matchMedia && window.matchMedia(query).matches); }
  function reduced() { return media("(prefers-reduced-motion: reduce)"); }
  function isMobile() { return media("(max-width: 760px)"); }
  function isTyping(target) {
    var node = target || doc.activeElement;
    if (!node || node === doc.body) return false;
    if (node.isContentEditable) return true;
    var tag = (node.tagName || "").toLowerCase();
    if (tag === "textarea" || tag === "select") return true;
    if (tag === "input") return !/^(button|checkbox|radio|range|submit|reset|file|color)$/i.test(node.type || "");
    return false;
  }
  function focusables(root) {
    var sel = 'a[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), ' +
      'textarea:not([disabled]), [tabindex]:not([tabindex="-1"]), video[controls]';
    return $$(sel, root).filter(function (n) { return n.getClientRects().length > 0 && !n.closest("[hidden], [inert]"); });
  }
  function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }
  function fmtTime(s) {
    s = Math.max(0, Math.floor(s || 0));
    return Math.floor(s / 60) + ":" + ("0" + (s % 60)).slice(-2);
  }
  function resolveNode(target) { return typeof target === "string" ? $(target) : target; }
  function focusQuiet(node) {
    if (!node || !node.focus) return;
    try { node.focus({ preventScroll: true }); } catch (e) { node.focus(); }
  }
  /* Remove com a animação de saída quando houver movimento; nunca depende só do animationend. */
  function leave(node, cb) {
    if (!node || !node.parentNode) { if (cb) cb(); return; }
    /* Saindo: já não recebe foco nem cliques */
    if (node.contains(doc.activeElement)) { try { doc.activeElement.blur(); } catch (e) {} }
    node.setAttribute("inert", "");
    node.style.pointerEvents = "none";
    node.classList.add("is-closing", "is-leaving");
    var done = false;
    function finish() {
      if (done) return;
      done = true;
      if (node.parentNode) node.parentNode.removeChild(node);
      if (cb) cb();
    }
    if (reduced()) { finish(); return; }
    node.addEventListener("animationend", function (e) { if (e.target === node) finish(); });
    setTimeout(finish, 200);
  }

  /* Datas curtas e relativas: "qui 28/11 · 18h", "hoje · 20h", "há 2 h". */
  function fmtDate(iso, mode) {
    if (!iso) return "";
    var d = iso instanceof Date ? iso : new Date(iso);
    if (isNaN(d.getTime())) return String(iso);
    var now = new Date(), day = 86400000;
    var d0 = new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
    var n0 = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    var diff = Math.round((d0 - n0) / day);
    var hm = d.getHours() + "h" + (d.getMinutes() ? ("0" + d.getMinutes()).slice(-2) : "");
    if (mode === "rel") {
      var mins = Math.round((now.getTime() - d.getTime()) / 60000);
      if (mins >= 0 && mins < 1) return t("dateNow");
      if (mins >= 0 && mins < 60) return t("dateMinutesAgo", { n: mins });
      if (mins >= 60 && mins < 1440) return t("dateHoursAgo", { n: Math.round(mins / 60) });
      if (diff === -1) return t("dateYesterday");
      if (diff < 0 && diff > -7) return t("dateDaysAgo", { n: -diff });
    }
    var dow = tlist("dateWeekdays")[d.getDay()] || "";
    if (HE.locale && !/^pt/i.test(HE.locale)) {
      try { dow = d.toLocaleDateString(HE.locale, { weekday: "short" }); } catch (e) {}
    }
    var dm = ("0" + d.getDate()).slice(-2) + "/" + ("0" + (d.getMonth() + 1)).slice(-2);
    var base = diff === 0 ? t("dateToday") : diff === 1 ? t("dateTomorrow") : diff === -1 ? t("dateYesterday") : (dow + " " + dm).trim();
    if (d.getFullYear() !== now.getFullYear()) base += "/" + String(d.getFullYear()).slice(-2);
    if (mode === "day" || mode === "rel") return base;
    if (mode === "time") return hm;
    return base + " · " + hm;
  }
  function initTime(node) {
    var iso = node.getAttribute("datetime");
    if (!iso || node._heTime) return;
    node._heTime = true;
    var out = fmtDate(iso, node.getAttribute("data-he-time") || "");
    if (!out) return;
    node.textContent = out;
    var d = new Date(iso);
    if (!isNaN(d.getTime())) node.title = d.toLocaleString(HE.locale || "pt-BR");
  }

  HE.util = {
    $: $, $$: $$, esc: esc, el: el, emit: emit, icon: icon, isTyping: isTyping, isMobile: isMobile,
    focusables: focusables, fmtTime: fmtTime, fmtDate: fmtDate, reduced: reduced, clamp: clamp
  };
  HE.icon = icon;
  HE.esc = esc;
  HE.fmtDate = fmtDate;

  /* ===== Ícones: sprite embutido pelo build ===== */
  HE.icons = {
    /* Injeta o sprite no começo do <body> quando a página ainda não tem #he-sprite. */
    mount: function () {
      if (!doc.body || doc.getElementById("he-sprite")) return false;
      /* Sem build o texto ainda é a marca, que não começa com "<": nada a injetar. */
      if (!SPRITE || SPRITE.charAt(0) !== "<") return false;
      var box = doc.createElement("div");
      box.innerHTML = SPRITE;
      var svg = box.firstElementChild;
      if (!svg) return false;
      svg.id = "he-sprite";
      svg.classList.add("he-sprite");
      svg.setAttribute("aria-hidden", "true");
      svg.setAttribute("width", "0");
      svg.setAttribute("height", "0");
      doc.body.insertBefore(svg, doc.body.firstChild);
      return true;
    }
  };

  /* Contêiner das camadas (direto no body, fora de qualquer ancestral com transform). */
  var layersRoot = null, liveRegion = null;
  function layers() {
    if (!layersRoot || !doc.contains(layersRoot)) {
      layersRoot = el("div", { class: "he-layers", "data-he-layers": true });
      doc.body.appendChild(layersRoot);
    }
    return layersRoot;
  }
  /* Anúncio para leitor de tela. */
  function say(text) {
    if (!liveRegion || !doc.contains(liveRegion)) {
      liveRegion = el("div", { class: "he-sr", "aria-live": "polite", role: "status" });
      doc.body.appendChild(liveRegion);
    }
    liveRegion.textContent = "";
    setTimeout(function () { liveRegion.textContent = text; }, 30);
  }
  HE.say = say;

  /* ===== Tema ===== */
  var THEME_KEY = "he.theme";
  var THEME_COLOR = { light: "#f4f2ee", dark: "#131316" };
  var darkQuery = window.matchMedia ? window.matchMedia("(prefers-color-scheme: dark)") : null;
  function themeDefault() {
    var d = html.getAttribute("data-he-theme-default");
    return d === "light" || d === "dark" ? d : "auto";
  }
  function themePref() {
    var v = null;
    try { v = localStorage.getItem(THEME_KEY); } catch (e) {}
    return v === "light" || v === "dark" || v === "auto" ? v : themeDefault();
  }
  function themeReal(pref) {
    if (pref === "auto") return darkQuery && darkQuery.matches ? "dark" : "light";
    return pref === "dark" ? "dark" : "light";
  }
  function applyTheme(pref, silent) {
    var real = themeReal(pref);
    html.setAttribute("data-he-theme", real);
    var meta = $('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", THEME_COLOR[real]);
    syncThemeButtons();
    if (!silent) emit(doc, "he:theme", { theme: real, pref: pref });
  }
  function syncThemeButtons() {
    var dark = HE.theme.get() === "dark";
    var label = t(dark ? "themeUseLight" : "themeUseDark");
    $$("[data-he-theme-toggle]").forEach(function (b) {
      b.setAttribute("aria-pressed", dark ? "true" : "false");
      b.setAttribute("aria-label", label);
      b.title = t(dark ? "themeLight" : "themeDark");
      var text = $("[data-he-theme-label]", b);
      if (!text) { b.innerHTML = icon(dark ? "sun" : "moon"); return; }
      /* Botão com rótulo visível: troca só o ícone e o texto */
      text.textContent = label;
      var fresh = el("span", null, icon(dark ? "sun" : "moon")).firstChild, old = $("svg.he-i", b);
      if (old) old.parentNode.replaceChild(fresh, old); else b.insertBefore(fresh, b.firstChild);
    });
  }
  HE.theme = {
    /* Tema em uso: "light" ou "dark". */
    get: function () { return html.getAttribute("data-he-theme") === "dark" ? "dark" : "light"; },
    /* Preferência guardada: "light", "dark" ou "auto". */
    pref: themePref,
    set: function (value) {
      var pref = value === "light" || value === "dark" || value === "auto" ? value : themeDefault();
      try { localStorage.setItem(THEME_KEY, pref); } catch (e) {}
      applyTheme(pref);
    },
    toggle: function () { HE.theme.set(HE.theme.get() === "dark" ? "light" : "dark"); }
  };
  /* Em "auto" o tema acompanha o sistema ao vivo. */
  function onSystemTheme() {
    if (themePref() !== "auto") return;
    if (themeReal("auto") !== html.getAttribute("data-he-theme")) applyTheme("auto");
  }
  if (darkQuery) {
    if (darkQuery.addEventListener) darkQuery.addEventListener("change", onSystemTheme);
    else if (darkQuery.addListener) darkQuery.addListener(onSystemTheme);
  }

  /* ===== Pilha de camadas: Esc, foco preso, rolagem travada ===== */
  var stack = [];
  function lockScroll(on) {
    if (on && !html.classList.contains("he-lock")) {
      html.style.setProperty("--he-sbw", Math.max(0, window.innerWidth - html.clientWidth) + "px");
    }
    html.classList.toggle("he-lock", on);
  }
  function pushOverlay(o) {
    o.returnFocus = o.returnFocus || doc.activeElement;
    stack.push(o);
    lockScroll(true);
    return o;
  }
  function popOverlay(o) {
    var i = stack.indexOf(o);
    if (i >= 0) stack.splice(i, 1);
    if (!stack.length) lockScroll(false);
    var back = o.returnFocus;
    if (back && back.focus && doc.contains(back)) focusQuiet(back);
  }
  function topOverlay() { return stack[stack.length - 1] || null; }
  HE.overlayOpen = function () { return stack.length > 0; };
  doc.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && !e.defaultPrevented && menu.el) {
      e.preventDefault();
      closeMenu(true);
      return;
    }
    var top = topOverlay();
    if (!top) {
      if (e.key === "Escape" && !e.defaultPrevented && html.classList.contains("he-nav-open")) { e.preventDefault(); navOpen(false); }
      return;
    }
    if (e.key === "Escape" && !e.defaultPrevented) {
      /* Esc primeiro sai do campo de pedido, depois fecha a camada */
      if (dock.el && dock.el.contains(doc.activeElement) && top.withDock) {
        doc.activeElement.blur();
        dockClose();
        e.preventDefault();
        return;
      }
      e.preventDefault();
      top.close("esc");
      return;
    }
    if (e.key !== "Tab") return;
    /* Foco preso: nas bordas de cada zona o Tab segue para a zona seguinte, em roda */
    var zones = [top.el];
    if (top.withDock && dock.el) zones.push(dock.el);
    var groups = zones.map(function (z) { return { el: z, list: focusables(z) }; }).filter(function (g) { return g.list.length > 0; });
    if (!groups.length) { e.preventDefault(); top.el.focus(); return; }
    var active = doc.activeElement, gi = -1;
    groups.forEach(function (g, i) { if (g.el.contains(active)) gi = i; });
    if (gi < 0) { e.preventDefault(); groups[0].list[0].focus(); return; }
    var list = groups[gi].list, n = groups.length, to = null;
    if (!e.shiftKey && active === list[list.length - 1]) to = groups[(gi + 1) % n].list[0];
    else if (e.shiftKey && (active === list[0] || active === groups[gi].el)) {
      var prev = groups[(gi - 1 + n) % n].list;
      to = prev[prev.length - 1];
    }
    if (to) { e.preventDefault(); to.focus(); }
  }, true);

  /* ===== Avisos (toasts) com Desfazer ===== */
  var UNDO_MS = 10000;
  var TOAST_ICON = { ok: "check", error: "alert", ai: "sparkles", info: "info" };
  function toastBox() {
    var box = doc.getElementById("he-toasts");
    if (!box) {
      box = el("div", { class: "he-toasts", id: "he-toasts", "aria-live": "polite", role: "status" });
      doc.body.appendChild(box);
    }
    return box;
  }
  /* HE.toast("texto") ou HE.toast({text, sub, kind, duration, action: {label, onClick}, onUndo}) */
  function toast(opts) {
    if (typeof opts === "string") opts = { text: opts };
    opts = opts || {};
    var hasUndo = typeof opts.onUndo === "function";
    var kind = TOAST_ICON[opts.kind] ? opts.kind : (hasUndo ? "ok" : "info");
    var ms = opts.duration || (hasUndo ? UNDO_MS : kind === "error" ? 9000 : 4500);
    var sub = opts.sub != null ? opts.sub : opts.detail;
    var box = toastBox();
    var node = el("div", { class: "he-toast he-toast--" + kind, role: kind === "error" ? "alert" : null });
    node.innerHTML = '<span class="he-toast__ico">' + icon(TOAST_ICON[kind]) + '</span><span class="he-toast__text">' +
      esc(opts.text || "") + (sub ? "<small>" + esc(sub) + "</small>" : "") + "</span>";
    var timer = null, closed = false, remaining = ms, started = 0;
    function close() {
      if (closed) return;
      closed = true;
      clearTimeout(timer);
      leave(node);
    }
    function arm() { if (closed) return; started = Date.now(); clearTimeout(timer); timer = setTimeout(close, remaining); }
    function pause() { clearTimeout(timer); remaining = Math.max(1200, remaining - (Date.now() - started)); }
    function addBtn(label, fn, cls) {
      var b = el("button", { type: "button", class: cls || "he-toast__btn", text: label });
      b.addEventListener("click", function () { fn(b); });
      node.appendChild(b);
      return b;
    }
    if (hasUndo) {
      addBtn(t("undo"), function (b) {
        b.disabled = true;
        b.textContent = t("undoing");
        /* onUndo pode devolver uma promessa: "Desfeito." só aparece quando ela termina. Se ela resolver com
           false, o próprio onUndo já avisou o que não voltou. */
        var out;
        try { out = opts.onUndo(); } catch (e) { out = Promise.reject(e); }
        Promise.resolve(out).then(function (ok) {
          close();
          emit(doc, "he:undone", { result: ok });
          if (ok !== false) toast({ text: t("undone"), kind: "info", duration: 2500 });
        }, function (err) {
          close();
          toast({ kind: "error", text: t("undoFailed"), sub: err && err.message });
        });
      });
    }
    if (opts.action && opts.action.label) {
      addBtn(opts.action.label, function () {
        close();
        if (opts.action.onClick) opts.action.onClick();
      });
    }
    var x = addBtn("", close, "he-toast__x");
    x.setAttribute("aria-label", t("toastClose"));
    x.innerHTML = icon("x");
    if (hasUndo) {
      var bar = el("span", { class: "he-toast__bar" });
      bar.style.setProperty("--he-toast-ms", ms + "ms");
      node.appendChild(bar);
    }
    node.addEventListener("mouseenter", pause);
    node.addEventListener("mouseleave", arm);
    node.addEventListener("focusin", pause);
    node.addEventListener("focusout", arm);
    box.appendChild(node);
    while (box.children.length > 3) box.removeChild(box.firstElementChild);
    arm();
    return { el: node, close: close };
  }
  /* HE.toast.error(erroOuTexto, {text, sub, retry, action}) */
  toast.error = function (err, opts) {
    opts = opts || {};
    if (err && err.silent) return { el: null, close: noop };   /* a pessoa cancelou: nada a avisar */
    var text = typeof err === "string" ? err : (opts.text || t("error"));
    var sub = typeof err === "string" ? opts.sub : ((err && err.message) || opts.sub);
    return toast({ kind: "error", text: text, sub: sub, action: opts.retry ? { label: t("retry"), onClick: opts.retry } : opts.action });
  };
  HE.toast = toast;

  /* ===== Contadores ===== */
  var counts = {};
  function countOf(key) { return parseInt(counts[key], 10) || 0; }
  function paintCounts() {
    $$("[data-he-count]").forEach(function (node) {
      var k = node.getAttribute("data-he-count");
      if (counts[k] == null) return;
      node.textContent = countOf(k);
      if (!node.hasAttribute("data-he-count-keep")) node.hidden = countOf(k) <= 0;
    });
    $$("[data-he-count-hide]").forEach(function (node) {
      var k = node.getAttribute("data-he-count-hide");
      if (counts[k] != null) node.hidden = countOf(k) <= 0;
    });
  }
  HE.counts = {
    get: function () { return Object.assign({}, counts); },
    set: function (next) {
      Object.assign(counts, next || {});
      paintCounts();
      emit(doc, "he:counts", HE.counts.get());
    }
  };

  /* ===== Compositor: campo de texto que cresce, Enter envia, Shift+Enter quebra linha ===== */
  var coarse = window.matchMedia ? window.matchMedia("(pointer: coarse)") : { matches: false };
  var nativeValue = Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype, "value");
  var COMPOSER = "textarea.he-composer__input";
  function composerMax(node) {
    var m = parseFloat(window.getComputedStyle(node).maxHeight);
    return isFinite(m) && m > 0 ? m : 320;
  }
  function composerSync(node) {
    if (!node || !node.matches || !node.matches(COMPOSER)) return;
    var form = node.closest(".he-composer");
    if (form) form.classList.toggle("is-empty", !String(node.value || "").trim());
    if (!node.offsetParent && node.getClientRects().length === 0) return;   /* escondido: mede quando aparecer */
    node.style.height = "auto";
    var limit = composerMax(node), full = node.scrollHeight;
    node.style.height = Math.min(full, limit) + "px";
    node.style.overflowY = full > limit + 1 ? "auto" : "hidden";
  }
  /* Quem troca o texto por código (sugestão, limpar depois de enviar) também ajusta a altura. */
  function composerWatch(node) {
    if (!node || node._heComposer) return;
    node._heComposer = true;
    if (nativeValue && nativeValue.set) {
      try {
        Object.defineProperty(node, "value", {
          configurable: true,
          get: function () { return nativeValue.get.call(this); },
          set: function (v) { nativeValue.set.call(this, v); composerSync(this); }
        });
      } catch (e) { /* navegador antigo: segue sem o ajuste automático */ }
    }
    composerSync(node);
  }
  function composerEnhance(root) {
    root = root || doc;
    if (root.matches && root.matches(COMPOSER)) composerWatch(root);
    if (root.querySelectorAll) $$(COMPOSER, root).forEach(composerWatch);
  }
  /* No toque, Enter quebra linha e o envio é pelo botão (Ctrl ou Cmd + Enter também envia). */
  function isSendKey(e) {
    if (e.key !== "Enter" || e.shiftKey || e.altKey || e.isComposing || e.keyCode === 229) return false;
    if (coarse.matches && !e.ctrlKey && !e.metaKey) return false;
    return true;
  }
  function onComposerTouch(e) {
    if (e.target.matches && e.target.matches(COMPOSER)) { composerWatch(e.target); composerSync(e.target); }
  }
  doc.addEventListener("input", onComposerTouch);
  doc.addEventListener("focusin", onComposerTouch);
  /* Campo dentro de <details> só tem tamanho quando abre. */
  doc.addEventListener("toggle", function (e) {
    if (e.target.open && e.target.querySelectorAll) $$(COMPOSER, e.target).forEach(function (n) { composerWatch(n); composerSync(n); });
  }, true);
  /* Formulário comum com data-he-composer-enter: Enter dispara o submit do próprio formulário. */
  doc.addEventListener("keydown", function (e) {
    var node = e.target;
    if (!node.matches || !node.matches(COMPOSER)) return;
    var form = node.closest("form[data-he-composer-enter]");
    if (!form || !isSendKey(e)) return;
    e.preventDefault();
    if (!node.value.trim()) return;
    if (form.requestSubmit) form.requestSubmit(); else form.submit();
  });
  /* Clique no espaço vazio da caixa (fora de botões e campos) leva ao campo. */
  doc.addEventListener("mousedown", function (e) {
    var box = e.target.closest && e.target.closest(".he-composer__box");
    if (!box || e.target.closest("button, a, input, select, label, textarea, [contenteditable]")) return;
    var input = box.querySelector(COMPOSER);
    if (input && !input.disabled) { e.preventDefault(); input.focus(); }
  });
  window.addEventListener("resize", function () { $$(COMPOSER).forEach(composerSync); });
  HE.composer = { sync: composerSync, enhance: composerEnhance, isSendKey: isSendKey };

  /* ===== Campo de pedido fixo (dock) ===== */
  var dock = { el: null, form: null, input: null, ctxEl: null, sugsEl: null, chips: [], sugs: null, pendingAction: null, sending: 0, busy: false, blurT: null };
  function ctxObject() {
    var o = {};
    dock.chips.forEach(function (c) { o[c.key] = c.value != null ? c.value : c.label; });
    return o;
  }
  function normChip(c) {
    if (!c || c.key == null || c.key === "") return null;
    var label = c.label != null ? c.label : c.value;
    return { key: String(c.key), label: String(label != null ? label : c.key), value: c.value != null ? c.value : label, kind: c.kind != null ? String(c.kind) : "" };
  }
  function renderCtx() {
    if (!dock.ctxEl) return;
    dock.ctxEl.innerHTML = "";
    dock.chips.forEach(function (c) {
      var chip = el("span", { class: "he-ctx", "data-key": c.key });
      chip.innerHTML = '<span class="he-ctx__label">' + (c.kind ? '<span class="he-ctx__kind">' + esc(c.kind) + "</span>" : "") + esc(c.label) + "</span>";
      var name = (c.kind ? c.kind + " " : "") + c.label;
      var x = el("button", { type: "button", class: "he-ctx__x", "aria-label": t("dockRemoveContext", { label: name }) }, icon("x"));
      x.addEventListener("click", function () {
        HE.dock.removeContext(c.key);
        if (dock.input) dock.input.focus();
      });
      chip.appendChild(x);
      dock.ctxEl.appendChild(chip);
    });
    measureDock();
  }
  function contextChanged() {
    renderCtx();
    emit(doc, "he:context", { context: ctxObject() });
  }
  function setDockText(text) {
    if (!dock.input) return;
    dock.input.value = text;
    composerSync(dock.input);
  }
  function caretToEnd(input) {
    try { input.setSelectionRange(input.value.length, input.value.length); } catch (e) {}
  }
  function renderSugs() {
    if (!dock.sugsEl) return;
    dock.sugsEl.innerHTML = "";
    (dock.sugs || []).forEach(function (s) {
      if (typeof s === "string") s = { label: s, prompt: s };
      if (!s || !s.label) return;
      var b = el("button", { type: "button", class: "he-sug" }, icon(s.icon || "sparkles") + "<span>" + esc(s.label) + "</span>");
      /* mousedown não tira o foco do campo: o rodapé continua aberto */
      b.addEventListener("mousedown", function (e) { e.preventDefault(); });
      b.addEventListener("click", function () {
        if (s.send === true) { HE.ask({ prompt: s.prompt || s.label, action: s.action }).catch(noop); return; }
        dock.pendingAction = s.action || null;
        HE.dock.focus(s.prompt || s.label);
      });
      dock.sugsEl.appendChild(b);
    });
  }
  function dockOpen() {
    if (!dock.el) return;
    dock.el.classList.add("is-open");
    html.classList.add("he-dock-open");
    measureDock();
  }
  function dockClose() {
    if (!dock.el) return;
    dock.el.classList.remove("is-open");
    html.classList.remove("he-dock-open");
    measureDock();
  }
  function paintDockBusy() {
    if (!dock.el) return;
    var on = dock.busy || dock.sending > 0;
    dock.el.classList.toggle("is-sending", on);
    if (on) dock.el.setAttribute("aria-busy", "true"); else dock.el.removeAttribute("aria-busy");
    var send = $(".he-composer__send", dock.el);
    if (send) send.classList.toggle("is-busy", on);
  }
  /* --he-dock-h: altura que o campo ocupa em repouso (linha do campo mais o respiro do contêiner).
     As sugestões abertas não entram na conta, para a página não saltar a cada foco. */
  function measureDock() {
    if (!dock.el) return;
    var row = $(".he-dock__row", dock.el) || dock.form || dock.el;
    var h = row.getBoundingClientRect().height;
    if (!h) return;
    if (row !== dock.el) {
      var cs = window.getComputedStyle(dock.el);
      h += (parseFloat(cs.paddingTop) || 0) + (parseFloat(cs.paddingBottom) || 0);
    }
    html.style.setProperty("--he-dock-h", Math.round(h) + "px");
  }
  HE.dock = {
    /* Chamado a cada pedido com {prompt, context, action}. Pode devolver uma Promise. */
    onAsk: null,
    /* Substitui as etiquetas. Aceita lista [{key, label, value, kind}] ou objeto {chave: {label, value}}. */
    setContext: function (ctx) {
      var list = [];
      if (Array.isArray(ctx)) list = ctx;
      else if (ctx && typeof ctx === "object") {
        Object.keys(ctx).forEach(function (k) {
          var v = ctx[k];
          if (v == null) return;
          list.push(typeof v === "object" ? Object.assign({ key: k }, v) : { key: k, label: v, value: v });
        });
      }
      dock.chips = list.map(normChip).filter(Boolean);
      contextChanged();
    },
    addContext: function (chip) {
      chip = normChip(chip);
      if (!chip) return;
      dock.chips = dock.chips.filter(function (c) { return c.key !== chip.key; }).concat([chip]);
      contextChanged();
    },
    removeContext: function (key) {
      dock.chips = dock.chips.filter(function (c) { return c.key !== String(key); });
      contextChanged();
    },
    getContext: ctxObject,
    /* Lista de sugestões: [{label, prompt, action, icon, send}] ou textos. null tira todas. */
    setSuggestions: function (list) {
      dock.sugs = Array.isArray(list) ? list : null;
      renderSugs();
    },
    focus: function (text) {
      if (!dock.input) return;
      if (typeof text === "string") setDockText(text);
      dock.input.focus();
      caretToEnd(dock.input);
    },
    setPlaceholder: function (text) {
      if (dock.input) dock.input.placeholder = text || t("dockPlaceholder");
    },
    setBusy: function (on) {
      dock.busy = !!on;
      paintDockBusy();
    },
    get el() { return dock.el; },
    get input() { return dock.input; }
  };

  /* HE.ask: o mesmo caminho do campo de pedido. Dispara he:ask (cancelável) e chama HE.dock.onAsk.
     Devolve uma Promise com o que onAsk devolveu, ou false quando alguém cancelou o evento. */
  HE.ask = function (req) {
    if (typeof req === "string") req = { prompt: req };
    req = req || {};
    var prompt = String(req.prompt || "").trim();
    if (!prompt) return Promise.reject(new Error(t("askEmpty")));
    var detail = Object.assign({}, req, {
      prompt: prompt,
      context: Object.assign({}, ctxObject(), req.context || {}),
      action: req.action || null
    });
    delete detail.silent;
    var ev = emit(doc, "he:ask", detail, true);
    if (ev.defaultPrevented) return Promise.resolve(false);
    var out;
    try { out = typeof HE.dock.onAsk === "function" ? HE.dock.onAsk(detail) : undefined; } catch (e) { out = Promise.reject(e); }
    dock.sending += 1;
    paintDockBusy();
    function release() {
      dock.sending = Math.max(0, dock.sending - 1);
      paintDockBusy();
    }
    return Promise.resolve(out).then(function (res) {
      release();
      if (dock.input && dock.input.value.trim() === prompt) setDockText("");
      emit(doc, "he:asked", { request: detail, response: res });
      return res;
    }, function (err) {
      release();
      if (!req.silent) toast.error(err, { text: t("askFailed"), retry: function () { HE.ask(req).catch(noop); } });
      throw err;
    });
  };
  function submitDock() {
    if (!dock.input) return;
    var text = dock.input.value.trim();
    if (!text) { dock.input.focus(); return; }
    if (dock.busy || dock.sending > 0) return;   /* um pedido por vez */
    var action = dock.pendingAction;
    dock.pendingAction = null;
    HE.ask({ prompt: text, action: action }).then(function (res) {
      if (res !== false && isMobile() && dock.input) dock.input.blur();
    }, noop);
  }
  function initDock() {
    if (dock.el) return;
    dock.el = $("[data-he-dock]") || $(".he-dock");
    if (!dock.el) return;
    dock.form = $("form", dock.el);
    dock.input = $(".he-composer__input", dock.el);
    dock.ctxEl = $("[data-he-ctx]", dock.el) || $(".he-dock__ctx", dock.el);
    dock.sugsEl = $("[data-he-sugs]", dock.el) || $(".he-dock__sugs", dock.el);
    renderCtx();
    renderSugs();
    /* Só o campo de texto abre o rodapé (etiquetas e sugestões); tocar na orbe não desloca nada. */
    dock.el.addEventListener("focusin", function (e) {
      clearTimeout(dock.blurT);
      if (e.target === dock.input) dockOpen();
    });
    dock.el.addEventListener("focusout", function () {
      clearTimeout(dock.blurT);
      dock.blurT = setTimeout(function () { if (!dock.el.contains(doc.activeElement)) dockClose(); }, 120);
    });
    if (dock.input) {
      dock.input.addEventListener("keydown", function (e) {
        if (e.key === "Escape") {
          if (!stack.length) { e.preventDefault(); dock.input.blur(); }
          return;
        }
        if (isSendKey(e)) { e.preventDefault(); submitDock(); }
      });
    }
    if (dock.form) dock.form.addEventListener("submit", function (e) { e.preventDefault(); submitDock(); });
    if (window.ResizeObserver) new ResizeObserver(measureDock).observe(dock.el);
    window.addEventListener("resize", measureDock);
    measureDock();
  }

  /* ===== Presença do assistente ===== */
  var presence = { state: "idle", working: 0, waiting: 0, label: null };
  function normPresence(p) {
    p = p || {};
    var working = Math.max(0, parseInt(p.working, 10) || 0), waiting = Math.max(0, parseInt(p.waiting, 10) || 0);
    var state = /^(idle|working|waiting)$/.test(p.state || "") ? p.state : (waiting > 0 ? "waiting" : working > 0 ? "working" : "idle");
    return { state: state, working: working, waiting: waiting, label: p.label != null && p.label !== "" ? String(p.label) : null };
  }
  function presenceLabel(d) {
    if (d.label) return d.label;
    if (d.state === "waiting") return t("presenceWaiting");
    if (d.state === "working") return t("presenceWorking", { n: Math.max(1, d.working) });
    return t("presenceIdle");
  }
  function presenceLong(d) {
    if (d.state === "waiting") return tn("presenceWaitingLong", Math.max(1, d.waiting));
    if (d.state === "working") return tn("presenceWorkingLong", Math.max(1, d.working));
    return t("presenceIdleLong");
  }
  function paintPresence(keepLabel) {
    var d = presence;
    $$("[data-he-presence]").forEach(function (btn) {
      btn.setAttribute("data-state", d.state);
      btn.setAttribute("aria-label", presenceLong(d) + ". " + t("presenceOpen"));
      btn.title = presenceLong(d);
      var orb = $(".he-orb", btn);
      if (orb) orb.setAttribute("data-state", d.state);
      var label = $("[data-he-presence-label]", btn);
      if (label && !(keepLabel && label.textContent.trim())) label.textContent = presenceLabel(d);
    });
  }
  var JOB_STEP = { queued: "jobQueued", running: "jobRunning", waiting: "jobWaiting", approval: "jobApproval", failed: "jobFailed", canceled: "jobCanceled", done: "jobDone" };
  function jobHtml(j) {
    j = j || {};
    var status = JOB_STEP[j.status] ? j.status : "running";
    var ended = status === "failed" || status === "canceled" || status === "done";
    var orbState = status === "waiting" || status === "approval" ? "waiting" : ended ? "idle" : "working";
    var title = esc(j.title || t("jobUntitled"));
    if (j.href) title = '<a href="' + esc(j.href) + '">' + title + "</a>";
    var stepIcon;
    if (status === "failed") stepIcon = icon("alert", "he-i--sm");
    else if (status === "canceled") stepIcon = icon("x", "he-i--sm");
    else if (status === "done") stepIcon = icon("check", "he-i--sm");
    else if (status === "approval") stepIcon = icon("lock", "he-i--sm");
    else stepIcon = '<span class="he-dots3" aria-hidden="true"><i></i><i></i><i></i></span>';
    return '<li class="he-job" data-status="' + status + '"' + (j.id != null ? ' data-job="' + esc(j.id) + '"' : "") +
      (j.tone ? ' data-tone="' + esc(j.tone) + '"' : "") + ">" +
      '<span class="he-orb he-orb--sm" data-state="' + orbState + '" aria-hidden="true"></span>' +
      '<div class="he-job__title">' + title + "</div>" +
      '<div class="he-job__step">' + stepIcon + "<span>" + esc(j.step || t(JOB_STEP[status])) + "</span></div>" +
      (j.meta ? '<div class="he-job__meta">' + esc(j.meta) + "</div>" : "") + "</li>";
  }
  /* HTML da lista de atividade a partir dos pedidos. Não busca nada: quem chama entrega a lista. */
  function renderActivity(jobs) {
    jobs = Array.isArray(jobs) ? jobs : [];
    var groups = [
      { title: t("activityWaiting"), count: true, match: function (s) { return s === "waiting" || s === "approval"; } },
      { title: t("activityRunning"), count: true, match: function (s) { return s === "running" || s === "queued" || !JOB_STEP[s]; } },
      { title: t("activityFailed"), count: false, match: function (s) { return s === "failed" || s === "canceled"; } },
      { title: t("activityDone"), count: false, match: function (s) { return s === "done"; } }
    ];
    var out = "";
    groups.forEach(function (g) {
      var list = jobs.filter(function (j) { return j && g.match(j.status); });
      if (!list.length) return;
      out += '<section class="he-act__group"><h3>' + esc(g.title) + (g.count ? ' <span class="he-sec__n">' + list.length + "</span>" : "") +
        '</h3><ul class="he-act__list">' + list.map(jobHtml).join("") + "</ul></section>";
    });
    if (!out) {
      out = '<div class="he-empty he-empty--compact"><span class="he-orb he-orb--lg" data-state="idle" aria-hidden="true"></span>' +
        '<div class="he-empty__title">' + esc(t("activityEmptyTitle")) + '</div><div class="he-empty__text">' + esc(t("activityEmptyText")) + "</div></div>";
    }
    return '<div class="he-act">' + out + "</div>";
  }
  HE.presence = {
    /* Chamado no clique em [data-he-presence], com {el, state, working, waiting}. */
    onOpen: null,
    get: function () { return { state: presence.state, working: presence.working, waiting: presence.waiting, label: presenceLabel(presence) }; },
    /* HE.presence.set({state: "idle"|"working"|"waiting", working: n, waiting: n, label}) */
    set: function (next) {
      next = normPresence(typeof next === "string" ? { state: next } : next);
      var changed = next.state !== presence.state || next.working !== presence.working || next.waiting !== presence.waiting || next.label !== presence.label;
      presence = next;
      paintPresence();
      if (changed) emit(doc, "he:presence", HE.presence.get());
    },
    renderActivity: renderActivity
  };

  /* ===== Gaveta lateral e folha ===== */
  var drawerSeq = 0;
  function fill(target, content) {
    if (typeof content === "string") target.innerHTML = content;
    else if (content) target.appendChild(content);
  }
  function openDrawer(opts) {
    var existing = opts instanceof Element ? opts : (opts && opts.el instanceof Element ? opts.el : null);
    if (existing && existing._heDrawer) return existing._heDrawer;
    opts = opts instanceof Element ? {} : (opts || {});
    var node, home = null, homeNext = null, id = "he-drawer-" + (++drawerSeq);
    if (existing) {
      /* Gaveta que já está na página: sai do lugar enquanto aberta e volta ao fechar */
      node = existing;
      home = node.parentNode;
      homeNext = node.nextSibling;
      if (!$(".he-drawer__grip", node)) {
        node.insertBefore(el("button", { type: "button", class: "he-drawer__grip", "data-he-close": true, "aria-label": t("close") }), node.firstChild);
      }
    } else {
      node = el("div", {
        class: "he-drawer" + (opts.side === "left" ? " he-drawer--left" : "") + (opts.sheet ? " he-drawer--sheet" : "") +
          (opts.wide ? " he-drawer--wide" : "") + (opts.className ? " " + opts.className : "")
      });
      node.innerHTML = '<button type="button" class="he-drawer__grip" data-he-close aria-label="' + esc(t("close")) + '"></button>' +
        '<div class="he-drawer__head"><h2 class="he-drawer__title" id="' + id + '-t">' + esc(opts.title || "") + "</h2>" +
        '<button type="button" class="he-iconbtn" data-he-close aria-label="' + esc(t("close")) + '">' + icon("x") + "</button></div>" +
        '<div class="he-drawer__body"></div>' + (opts.foot != null ? '<div class="he-drawer__foot"></div>' : "");
      fill($(".he-drawer__body", node), opts.body);
      if (opts.foot != null) fill($(".he-drawer__foot", node), opts.foot);
    }
    node.setAttribute("role", "dialog");
    node.setAttribute("aria-modal", "true");
    node.setAttribute("tabindex", "-1");
    var titleEl = $(".he-drawer__title", node);
    if (opts.label) node.setAttribute("aria-label", opts.label);
    else if (titleEl) {
      if (!titleEl.id) titleEl.id = id + "-t";
      node.setAttribute("aria-labelledby", titleEl.id);
    }
    var scrim = el("div", { class: "he-scrim" });
    var root = layers();
    root.appendChild(scrim);
    root.appendChild(node);
    node.hidden = false;
    node.classList.remove("is-closing");
    var closed = false;
    var handle = { el: node, body: $(".he-drawer__body", node), foot: $(".he-drawer__foot", node), close: close };
    var overlay = pushOverlay({ el: node, close: close, returnFocus: opts.returnFocus });
    function close(reason) {
      if (closed) return;
      closed = true;
      node._heDrawer = null;
      node.removeEventListener("click", onDrawerClick);
      leave(scrim);
      if (existing) {
        node.classList.add("is-closing");
        setTimeout(function () {
          node.classList.remove("is-closing");
          node.hidden = true;
          node.style.transform = "";
          if (home) home.insertBefore(node, homeNext && homeNext.parentNode === home ? homeNext : null);
        }, reduced() ? 0 : 150);
      } else leave(node);
      popOverlay(overlay);
      if (opts.onClose) opts.onClose(reason);
      emit(existing ? node : doc, "he:drawer:close", { reason: reason });
    }
    function onDrawerClick(e) {
      var x = e.target.closest("[data-he-close]");
      if (!x || !node.contains(x)) return;
      e.preventDefault();
      close("button");
    }
    scrim.addEventListener("click", function () { close("scrim"); });
    node.addEventListener("click", onDrawerClick);
    /* Celular: puxar a alça para baixo fecha */
    var grip = $(".he-drawer__grip", node), drag = null;
    if (grip) {
      grip.onpointerdown = function (e) {
        drag = { y: e.clientY, dy: 0 };
        try { grip.setPointerCapture(e.pointerId); } catch (x) {}
      };
      grip.onpointermove = function (e) {
        if (!drag) return;
        drag.dy = Math.max(0, e.clientY - drag.y);
        node.style.transform = "translateY(" + drag.dy + "px)";
      };
      grip.onpointerup = grip.onpointercancel = function () {
        if (!drag) return;
        var dy = drag.dy;
        drag = null;
        if (dy > 90) close("swipe"); else node.style.transform = "";
      };
    }
    node._heDrawer = handle;
    if (!existing) HE.init(node);
    var target = $("[autofocus]", node) || (opts.focus && $(opts.focus, node)) || focusables(handle.body || node)[0] || node;
    setTimeout(function () {
      if (closed) return;
      try { target.focus({ preventScroll: true }); } catch (e) { node.focus(); }
    }, 30);
    return handle;
  }
  HE.drawer = {
    /* HE.drawer.open({title, body, foot, side, wide, label, focus, onClose}) ou HE.drawer.open(elemento) */
    open: openDrawer,
    close: function () {
      var top = topOverlay();
      if (top && top.el.classList.contains("he-drawer")) top.close("api");
    }
  };
  /* Folha: caixa central no computador, sobe de baixo no celular. */
  HE.sheet = function (opts) { return openDrawer(Object.assign({ sheet: true }, opts || {})); };
  /* Declarativo: data-he-drawer-open="#id" abre um .he-drawer que já está na página (hidden). */
  doc.addEventListener("click", function (e) {
    var opener = e.target.closest && e.target.closest("[data-he-drawer-open]");
    if (!opener) return;
    var target = null;
    try { target = $(opener.getAttribute("data-he-drawer-open")); } catch (x) {}
    if (target) { e.preventDefault(); openDrawer({ el: target, returnFocus: opener }); }
  });

  /* ===== Menu ancorado ===== */
  var menu = { el: null, anchor: null, onClose: null };
  function menuItemHtml(it, i, cls) {
    return '<button type="button" class="' + cls + '" role="menuitem" data-he-menu-item="' + i + '"' +
      (it.tone ? ' data-tone="' + esc(it.tone) + '"' : "") + (it.disabled ? " disabled" : "") + ">" +
      (it.icon ? '<span class="he-menu__ico">' + icon(it.icon) + "</span>" : "") +
      '<span class="he-menu__text"><b>' + esc(it.label) + "</b>" + (it.sub ? "<small>" + esc(it.sub) + "</small>" : "") + "</span></button>";
  }
  function closeMenu(focusBack) {
    if (!menu.el) return;
    var node = menu.el, anchor = menu.anchor, onClose = menu.onClose;
    menu.el = null;
    menu.anchor = null;
    menu.onClose = null;
    if (anchor && anchor.setAttribute) anchor.setAttribute("aria-expanded", "false");
    leave(node);
    if (focusBack && anchor) focusQuiet(anchor);
    if (onClose) onClose();
  }
  /* HE.menu.open(âncora, [{label, sub, icon, tone, onClick}], {label, align, sheet, title, onClose}) */
  function openMenu(anchor, items, opts) {
    anchor = resolveNode(anchor) || null;
    opts = opts || {};
    items = (items || []).filter(function (it) { return it && it.label; });
    if (menu.el) {
      var same = menu.anchor === anchor;
      closeMenu(same);
      if (same) return null;   /* segundo clique na mesma âncora só fecha */
    }
    if (!items.length) return null;
    function choose(i) {
      var it = items[i];
      if (it && !it.disabled && typeof it.onClick === "function") it.onClick(it);
    }
    /* No celular, com sheet: true, o menu vira uma folha com botões grandes */
    if (opts.sheet && isMobile()) {
      var grid = '<div class="he-newgrid" role="menu" aria-label="' + esc(opts.label || opts.title || "") + '">' +
        items.map(function (it, i) { return menuItemHtml(it, i, "he-newgrid__item"); }).join("") + "</div>";
      var sheet = HE.sheet({ title: opts.title || opts.label || "", body: grid, returnFocus: anchor, onClose: opts.onClose });
      sheet.el.addEventListener("click", function (e) {
        var b = e.target.closest("[data-he-menu-item]");
        if (!b) return;
        sheet.close("select");
        setTimeout(function () { choose(+b.getAttribute("data-he-menu-item")); }, 30);
      });
      return { el: sheet.el, close: sheet.close };
    }
    var node = el("div", { class: "he-menu", role: "menu", "aria-label": opts.label || null },
      items.map(function (it, i) { return menuItemHtml(it, i, "he-menu__item"); }).join(""));
    layers().appendChild(node);
    var r = anchor ? anchor.getBoundingClientRect() : { left: 8, right: 8, top: 8, bottom: 8 };
    var w = node.offsetWidth || 288, h = node.offsetHeight || 0;
    var x = opts.align === "right" ? r.right - w : r.left;
    var y = r.bottom + 6;
    if (y + h > window.innerHeight - 8 && r.top - h - 6 >= 8) y = r.top - h - 6;   /* sem espaço embaixo: abre para cima */
    node.style.setProperty("--x", Math.round(clamp(x, 8, Math.max(8, window.innerWidth - w - 8))) + "px");
    node.style.setProperty("--y", Math.round(Math.max(8, y)) + "px");
    menu.el = node;
    menu.anchor = anchor;
    menu.onClose = opts.onClose || null;
    if (anchor) anchor.setAttribute("aria-expanded", "true");
    var buttons = $$(".he-menu__item", node);
    function enabled() { return buttons.filter(function (b) { return !b.disabled; }); }
    setTimeout(function () { if (menu.el === node && enabled()[0]) enabled()[0].focus(); }, 20);
    node.addEventListener("click", function (e) {
      var b = e.target.closest("[data-he-menu-item]");
      if (!b || b.disabled) return;
      closeMenu(true);
      choose(+b.getAttribute("data-he-menu-item"));
    });
    node.addEventListener("keydown", function (e) {
      var list = enabled(), i = list.indexOf(doc.activeElement);
      if (!list.length) return;
      if (e.key === "ArrowDown") { e.preventDefault(); list[(i + 1) % list.length].focus(); }
      else if (e.key === "ArrowUp") { e.preventDefault(); list[(i - 1 + list.length) % list.length].focus(); }
      else if (e.key === "Home") { e.preventDefault(); list[0].focus(); }
      else if (e.key === "End") { e.preventDefault(); list[list.length - 1].focus(); }
      else if (e.key === "Tab") closeMenu(false);
    });
    return { el: node, close: function () { if (menu.el === node) closeMenu(false); } };
  }
  HE.menu = { open: openMenu, close: function () { closeMenu(false); } };
  doc.addEventListener("pointerdown", function (e) {
    if (menu.el && !menu.el.contains(e.target) && !(menu.anchor && menu.anchor.contains(e.target))) closeMenu(false);
  }, true);
  window.addEventListener("resize", function () { closeMenu(false); });
  window.addEventListener("scroll", function () { closeMenu(false); }, { passive: true });

  /* Botão Novo: [data-he-new] abre o menu declarado em HE.newMenu.items; sem itens, só dispara he:new. */
  HE.newMenu = {
    items: [],
    open: function (btn) {
      btn = resolveNode(btn) || $("[data-he-new]");
      var items = (HE.newMenu.items || []).filter(Boolean);
      if (!items.length) { emit(doc, "he:new", { el: btn || null }, true); return null; }
      var wrapped = items.map(function (it) {
        return Object.assign({}, it, {
          onClick: function () {
            var ev = emit(doc, "he:new", { key: it.key != null ? it.key : null, item: it, el: btn || null }, true);
            if (!ev.defaultPrevented && typeof it.onClick === "function") it.onClick(it);
          }
        });
      });
      return openMenu(btn, wrapped, { label: t("newTitle"), title: t("newTitle"), sheet: true, align: "right" });
    },
    close: function () { closeMenu(false); }
  };

  /* ===== Paleta de comandos (Ctrl K) ===== */
  var pal = { node: null, input: null, list: null, items: [], sel: 0, moved: false, timer: null, q: "", sources: [], remote: {}, state: "idle", token: 0, overlay: null, seq: 0 };
  function fold(s) { return String(s || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, ""); }
  function builtinSource() {
    var dark = HE.theme.get() === "dark";
    return {
      group: t("paletteActions"),
      items: [
        { label: t(dark ? "themeUseLight" : "themeUseDark"), icon: dark ? "sun" : "moon", keywords: t("paletteThemeKeywords"), keep: true, onSelect: function () { HE.theme.toggle(); } },
        { label: t("shortcutsTitle"), icon: "keyboard", hint: "?", keywords: t("paletteShortcutsKeywords"), onSelect: function () { HE.shortcuts.open(); } }
      ]
    };
  }
  function paletteSources() {
    return HE.palette.builtins === false ? pal.sources : pal.sources.concat([builtinSource()]);
  }
  function paletteAskItem(q) {
    if (HE.palette.askAI === false) return null;
    if (!q && !dock.input) return null;   /* sem texto e sem campo de pedido não há o que oferecer */
    return {
      ai: true, label: q,
      onSelect: function () {
        if (q) HE.ask({ prompt: q }).catch(noop);
        else setTimeout(function () { HE.dock.focus(); }, 60);
      }
    };
  }
  function renderPalette() {
    if (!pal.node) return;
    var q = pal.q, fq = fold(q), items = [], hasRemote = false;
    paletteSources().forEach(function (src) {
      var list = typeof src.items === "function" ? src.items(q) : src.items;
      list = (Array.isArray(list) ? list : []).filter(function (it) {
        return it && it.label && (!fq || fold(it.label + " " + (it.keywords || "") + " " + (it.hint || "")).indexOf(fq) >= 0);
      });
      if (src.search && q && pal.remote[src._id]) { list = list.concat(pal.remote[src._id]); hasRemote = hasRemote || pal.remote[src._id].length > 0; }
      list.forEach(function (it) { items.push({ group: src.group || "", item: it }); });
    });
    var found = items.length;
    var ask = paletteAskItem(q);
    if (ask) items.push({ group: "", item: ask });
    pal.items = items;
    pal.sel = clamp(pal.sel, 0, Math.max(0, items.length - 1));
    var out = "", group = null;
    items.forEach(function (entry, i) {
      var it = entry.item, sel = i === pal.sel;
      var head = '<li class="he-pal__item' + (it.ai ? " he-pal__item--ai" : "") + (sel ? " is-sel" : "") + '" role="option" id="he-pal-o' + i + '" data-i="' + i + '" aria-selected="' + sel + '"';
      if (it.ai) {
        out += head + '><span class="he-pal__ico"><span class="he-orb" data-state="idle" aria-hidden="true"></span></span><span class="he-pal__text">' +
          esc(t("paletteAsk")) + (q ? ": <q>" + esc(q) + "</q>" : "") + '</span><span class="he-pal__hint">' + esc(t(q ? "paletteAskHint" : "paletteAskOpenHint")) + "</span></li>";
        return;
      }
      if (entry.group !== group) {
        group = entry.group;
        if (group) out += '<li class="he-pal__group" role="presentation">' + esc(group) + "</li>";
      }
      var ico = it.img ? '<img src="' + esc(it.img) + '" alt="">' : icon(it.icon || "file");
      out += head + (it.tone ? ' data-tone="' + esc(it.tone) + '"' : "") + '><span class="he-pal__ico">' + ico + '</span><span class="he-pal__text">' + esc(it.label) + "</span>" +
        (it.hint ? '<span class="he-pal__hint">' + esc(it.hint) + "</span>" : "") + "</li>";
    });
    var note = "";
    if (q && pal.state === "loading" && !hasRemote) note = t("paletteLoading");
    else if (q && pal.state === "error") note = t("paletteError");
    else if (q && pal.state !== "loading" && !found) note = t("paletteEmpty");
    pal.list.innerHTML = (note ? '<li class="he-pal__note" role="presentation">' + esc(note) + "</li>" : "") + out;
    if (items.length) pal.input.setAttribute("aria-activedescendant", "he-pal-o" + pal.sel);
    else pal.input.removeAttribute("aria-activedescendant");
    var selEl = $("#he-pal-o" + pal.sel, pal.list);
    if (selEl) {
      var lr = pal.list.getBoundingClientRect(), r = selEl.getBoundingClientRect();
      if (r.bottom > lr.bottom) pal.list.scrollTop += r.bottom - lr.bottom + 6;
      else if (r.top < lr.top) pal.list.scrollTop -= lr.top - r.top + 40;
    }
  }
  /* Fontes com search(q): espera a pessoa parar de digitar e descarta resposta de texto antigo. */
  function searchPalette() {
    var q = pal.q, token = ++pal.token;
    clearTimeout(pal.timer);
    var searchers = pal.sources.filter(function (s) { return typeof s.search === "function"; });
    if (!q || !searchers.length) {
      if (!q) pal.remote = {};
      pal.state = "idle";
      renderPalette();
      return;
    }
    pal.state = "loading";
    renderPalette();
    pal.timer = setTimeout(function () {
      var left = searchers.length, failed = 0;
      searchers.forEach(function (src) {
        var out;
        try { out = src.search(q); } catch (e) { out = Promise.reject(e); }
        Promise.resolve(out).then(function (list) {
          if (token !== pal.token || !pal.node) return;
          pal.remote[src._id] = (Array.isArray(list) ? list : []).filter(function (it) { return it && it.label; });
        }, function () {
          if (token !== pal.token || !pal.node) return;
          failed += 1;
          pal.remote[src._id] = [];
        }).then(function () {
          if (token !== pal.token || !pal.node) return;
          left -= 1;
          if (!left) pal.state = failed === searchers.length ? "error" : "done";
          if (!pal.moved) pal.sel = 0;
          renderPalette();
        });
      });
    }, 160);
  }
  function runPalette(i) {
    var entry = pal.items[i];
    if (!entry) return;
    var it = entry.item;
    if (!it.ai) {
      var ev = emit(doc, "he:palette-select", { item: it, query: pal.q }, true);
      if (ev.defaultPrevented) { HE.palette.close(); return; }
    }
    if (!it.keep) HE.palette.close();
    try {
      if (typeof it.onSelect === "function") it.onSelect(it);
      else if (it.href) location.href = it.href;
    } catch (e) { toast.error(e); }
    if (it.keep && pal.node) renderPalette();
  }
  function movePalette(to) {
    if (!pal.items.length) return;
    pal.sel = (to + pal.items.length) % pal.items.length;
    pal.moved = true;
    renderPalette();
  }
  HE.palette = {
    /* false tira o item fixo "Pedir à IA". */
    askAI: true,
    /* false tira as ações internas (tema e atalhos). */
    builtins: true,
    /* false desliga Ctrl K e Cmd K. */
    hotkey: true,
    open: function (text) {
      if (pal.node) { pal.input.focus(); return; }
      var node = el("div", { class: "he-pal", role: "dialog", "aria-modal": "true", "aria-label": t("paletteTitle") });
      node.innerHTML = '<div class="he-pal__box"><div class="he-pal__top">' + icon("search") +
        '<input class="he-pal__input" type="text" role="combobox" aria-expanded="true" aria-controls="he-pal-list" aria-autocomplete="list" ' +
        'autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="' + esc(t("palettePlaceholder")) + '" aria-label="' + esc(t("palettePlaceholder")) + '">' +
        '<button type="button" class="he-iconbtn" data-he-pal-close aria-label="' + esc(t("paletteClose")) + '">' + icon("x") + "</button></div>" +
        '<ul class="he-pal__list" id="he-pal-list" role="listbox" aria-label="' + esc(t("paletteResults")) + '"></ul>' +
        '<div class="he-pal__foot"><span><kbd class="he-kbd">↑</kbd><kbd class="he-kbd">↓</kbd> ' + esc(t("paletteHintMove")) + "</span>" +
        '<span><kbd class="he-kbd">Enter</kbd> ' + esc(t("paletteHintOpen")) + '</span><span><kbd class="he-kbd">Esc</kbd> ' + esc(t("paletteHintClose")) + "</span></div></div>";
      pal.node = node;
      pal.input = $(".he-pal__input", node);
      pal.list = $(".he-pal__list", node);
      pal.q = ""; pal.sel = 0; pal.moved = false; pal.remote = {}; pal.state = "idle";
      layers().appendChild(node);
      pal.overlay = pushOverlay({ el: node, close: HE.palette.close });
      pal.input.addEventListener("input", function () {
        pal.q = pal.input.value.trim();
        pal.sel = 0;
        pal.moved = false;
        searchPalette();
      });
      pal.input.addEventListener("keydown", function (e) {
        if (e.key === "ArrowDown") { e.preventDefault(); movePalette(pal.sel + 1); }
        else if (e.key === "ArrowUp") { e.preventDefault(); movePalette(pal.sel - 1); }
        else if (e.key === "Home" && !pal.input.value) { e.preventDefault(); movePalette(0); }
        else if (e.key === "End" && !pal.input.value) { e.preventDefault(); movePalette(pal.items.length - 1); }
        else if (e.key === "Enter" && !e.isComposing) {
          e.preventDefault();
          /* Ctrl + Enter vai direto para o pedido à IA, que é sempre o último item */
          var last = pal.items[pal.items.length - 1];
          runPalette((e.ctrlKey || e.metaKey) && last && last.item.ai ? pal.items.length - 1 : pal.sel);
        }
      });
      pal.list.addEventListener("mousemove", function (e) {
        var li = e.target.closest(".he-pal__item");
        if (!li) return;
        var i = +li.getAttribute("data-i");
        if (i === pal.sel) return;
        pal.sel = i;
        pal.moved = true;
        $$(".he-pal__item", pal.list).forEach(function (n) {
          var on = +n.getAttribute("data-i") === i;
          n.classList.toggle("is-sel", on);
          n.setAttribute("aria-selected", on);
        });
        pal.input.setAttribute("aria-activedescendant", "he-pal-o" + i);
      });
      pal.list.addEventListener("click", function (e) {
        var li = e.target.closest(".he-pal__item");
        if (li) runPalette(+li.getAttribute("data-i"));
      });
      node.addEventListener("mousedown", function (e) { if (e.target === node) HE.palette.close(); });
      $("[data-he-pal-close]", node).addEventListener("click", function () { HE.palette.close(); });
      if (typeof text === "string" && text) {
        pal.input.value = text;
        pal.q = text.trim();
        searchPalette();
      } else renderPalette();
      setTimeout(function () { if (pal.node === node) pal.input.focus(); }, 20);
    },
    close: function () {
      if (!pal.node) return;
      var node = pal.node;
      pal.node = null;
      pal.token += 1;
      clearTimeout(pal.timer);
      leave(node);
      popOverlay(pal.overlay);
      pal.overlay = null;
    },
    toggle: function () { if (pal.node) HE.palette.close(); else HE.palette.open(); },
    /* Fonte: {id, group, items: [item]} ou {id, group, search(q) -> itens | Promise}.
       Item: {label, hint, icon, tone, img, href, onSelect, keywords}. Devolve a função que tira a fonte. */
    register: function (source) {
      if (Array.isArray(source)) {
        var offs = source.map(HE.palette.register);
        return function () { offs.forEach(function (off) { off(); }); };
      }
      if (!source || typeof source !== "object") return noop;
      if (source.id != null) HE.palette.unregister(source.id);
      var src = Object.assign({}, source);
      src._id = "s" + (++pal.seq);
      pal.sources.push(src);
      if (pal.node) searchPalette();
      return function () { HE.palette.unregister(src); };
    },
    unregister: function (ref) {
      if (ref == null) return;
      pal.sources = pal.sources.filter(function (s) {
        if (s === ref) return false;
        if (typeof ref === "object") return !(ref.id != null && s.id === ref.id);
        return s.id !== ref;
      });
      if (pal.node) renderPalette();
    }
  };

  /* ===== Camada de detalhe: abre por cima da tela e devolve foco e rolagem ao ponto exato ===== */
  var layer = { node: null, overlay: null, opts: null, scrollY: 0, handle: null };
  function buildLayer() {
    var node = el("div", { class: "he-layer", role: "dialog", "aria-modal": "true", tabindex: "-1" });
    node.innerHTML = '<div class="he-layer__panel"><div class="he-layer__bar">' +
      '<button type="button" class="he-iconbtn" data-he-layer-close aria-label="' + esc(t("layerBack")) + '">' + icon("arrow_left") + "</button>" +
      '<span class="he-layer__title" data-he-layer-title></span>' +
      '<a class="he-iconbtn" data-he-layer-direct hidden aria-label="' + esc(t("layerFull")) + '" title="' + esc(t("layerFull")) + '">' + icon("external") + "</a>" +
      '</div><div class="he-layer__body" data-he-layer-body></div></div>';
    node.addEventListener("click", function (e) {
      if (e.target.closest("[data-he-layer-close]")) { e.preventDefault(); HE.layer.close("button"); }
      else if (e.target === node) HE.layer.close("scrim");
    });
    return node;
  }
  function fillLayer(opts) {
    var node = layer.node, body = $("[data-he-layer-body]", node), direct = $("[data-he-layer-direct]", node);
    var title = opts.title || "";
    $("[data-he-layer-title]", node).textContent = title;
    node.setAttribute("aria-label", opts.label || title || t("layerLabel"));
    if (opts.href) { direct.setAttribute("href", opts.href); direct.hidden = false; }
    else { direct.removeAttribute("href"); direct.hidden = true; }
    body.innerHTML = "";
    var root = el("div", { class: "he-layer__content", "data-he-layer-root": true });
    fill(root, opts.body);
    body.appendChild(root);
    body.scrollTop = 0;
    layer.handle.body = root;
    HE.init(root);
  }
  HE.layer = {
    get current() { return layer.handle; },
    /* HE.layer.open({title, body, href, label, onClose}). O conteúdo vem de quem chama: nada é carregado por URL. */
    open: function (opts) {
      opts = opts || {};
      if (layer.node) {
        /* Já aberta: troca o conteúdo e avisa o dono anterior */
        var prev = layer.opts;
        layer.opts = opts;
        if (prev && prev.onClose) prev.onClose("replace");
        fillLayer(opts);
        emit(doc, "he:layer-open", { title: opts.title || "", href: opts.href || null, root: layer.handle.body });
        return layer.handle;
      }
      layer.scrollY = window.pageYOffset;
      layer.opts = opts;
      layer.node = buildLayer();
      layer.handle = { el: layer.node, body: null, close: function (reason) { HE.layer.close(reason || "api"); } };
      layers().appendChild(layer.node);
      layer.overlay = pushOverlay({ el: layer.node, close: function (reason) { HE.layer.close(reason); }, withDock: true, returnFocus: opts.returnFocus });
      html.classList.add("he-layer-open");
      fillLayer(opts);
      measureDock();
      focusQuiet(layer.node);
      emit(doc, "he:layer-open", { title: opts.title || "", href: opts.href || null, root: layer.handle.body });
      return layer.handle;
    },
    close: function (reason) {
      if (!layer.node) return;
      var node = layer.node, opts = layer.opts, y = layer.scrollY, overlay = layer.overlay;
      layer.node = null; layer.opts = null; layer.handle = null; layer.overlay = null;
      html.classList.remove("he-layer-open");
      leave(node);
      popOverlay(overlay);
      window.scrollTo(0, y);
      measureDock();
      if (opts && opts.onClose) opts.onClose(reason || "api");
      emit(doc, "he:layer-close", { reason: reason || "api" });
    }
  };
  /* Link com data-he-layer: a aplicação responde a he:layer-request com preventDefault() e abre a camada.
     Sem resposta, o link navega normalmente. Ctrl, Cmd e botão do meio continuam abrindo aba nova. */
  doc.addEventListener("click", function (e) {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    var a = e.target.closest && e.target.closest("[data-he-layer]");
    if (!a || a.getAttribute("target") === "_blank") return;
    var ev = emit(a, "he:layer-request", { href: a.getAttribute("href") || a.getAttribute("data-href") || "", id: a.getAttribute("data-he-layer") || "", el: a }, true);
    if (ev.defaultPrevented) e.preventDefault();
  });

  /* ===== Ajuda de atalhos (tecla ?) ===== */
  var keysExtra = [], keysOpen = null;
  var keys = { approve: "a", adjust: "j", deny: "n" };
  function keysBase() {
    var any = t("shortcutsAnywhere"), list = [];
    if (dock.input) list.push({ group: any, keys: ["/"], label: t("shortcutAsk") });
    if (HE.palette.hotkey !== false) list.push({ group: any, keys: ["Ctrl", "K"], label: t("shortcutPalette") });
    list.push({ group: any, keys: ["Esc"], label: t("shortcutClose") });
    list.push({ group: any, keys: ["?"], label: t("shortcutHelp") });
    if ($("[data-he-decide-bar], .he-decide")) {
      list.push({ group: t("shortcutsDecide"), keys: [keys.approve.toUpperCase()], label: t("decideApprove") });
      list.push({ group: t("shortcutsDecide"), keys: [keys.adjust.toUpperCase()], label: t("decideAdjust") });
      list.push({ group: t("shortcutsDecide"), keys: [keys.deny.toUpperCase()], label: t("decideDeny") });
    }
    if ($(".he-carousel")) list.push({ group: t("shortcutsPreview"), keys: ["←", "→"], label: t("shortcutSlide") });
    if ($(".he-player")) list.push({ group: t("shortcutsPreview"), keys: [t("keySpace")], label: t("shortcutPlay") });
    if ($("[data-he-drag]")) list.push({ group: t("shortcutsDrag"), keys: ["Alt", t("keyArrows")], label: t("shortcutMove") });
    return list;
  }
  HE.shortcuts = {
    /* HE.shortcuts.add("Fila", ["←", "→"], "Item anterior e próximo") */
    add: function (group, keyList, label) { keysExtra.push({ group: group, keys: [].concat(keyList), label: label }); },
    list: function () { return keysBase().concat(keysExtra); },
    open: function () {
      if (keysOpen) return keysOpen;
      var groups = {}, order = [];
      HE.shortcuts.list().forEach(function (k) {
        if (!groups[k.group]) { groups[k.group] = []; order.push(k.group); }
        groups[k.group].push(k);
      });
      var mac = /Mac|iPhone|iPad/.test(navigator.platform || "");
      var out = order.map(function (g) {
        return '<section class="he-keys__group"><h3>' + esc(g) + "</h3>" + groups[g].map(function (k) {
          return '<div class="he-keys__row"><span>' + esc(k.label) + "</span><span>" + k.keys.map(function (x) {
            return '<kbd class="he-kbd he-kbd--always">' + esc(mac && x === "Ctrl" ? "⌘" : x) + "</kbd>";
          }).join("") + "</span></div>";
        }).join("") + "</section>";
      }).join("");
      keysOpen = HE.sheet({ title: t("shortcutsTitle"), body: '<div class="he-keys">' + out + "</div>", onClose: function () { keysOpen = null; } });
      return keysOpen;
    }
  };

  /* ===== Carrossel ===== */
  function carousel(root) {
    root = resolveNode(root);
    if (!root) return null;
    if (root._heCarousel) return root._heCarousel;
    var track = $(".he-carousel__track", root);
    if (!track) return null;
    var scope = root.closest(".he-phone, [data-he-carousel-scope]") || root.parentNode;
    var dots = scope ? $("[data-he-dots]", scope) : null;
    var prev = $("[data-he-prev]", root), next = $("[data-he-next]", root), count = $("[data-he-slide-count]", root);
    if (!prev) {
      prev = el("button", { type: "button", class: "he-carousel__nav he-carousel__nav--prev", "data-he-prev": true, "aria-label": t("carouselPrev"), tabindex: "-1" }, icon("chevron_left"));
      root.appendChild(prev);
    }
    if (!next) {
      next = el("button", { type: "button", class: "he-carousel__nav he-carousel__nav--next", "data-he-next": true, "aria-label": t("carouselNext"), tabindex: "-1" }, icon("chevron_right"));
      root.appendChild(next);
    }
    if (!count) {
      count = el("span", { class: "he-carousel__count", "data-he-slide-count": true, "aria-hidden": "true" });
      root.appendChild(count);
    }
    if (!root.hasAttribute("tabindex")) root.setAttribute("tabindex", "0");
    if (!root.hasAttribute("role")) {
      root.setAttribute("role", "group");
      root.setAttribute("aria-roledescription", t("carouselRole"));
    }
    var state = { index: 0, total: 0, target: null, targetT: null }, raf = 0;
    function slides() { return Array.prototype.filter.call(track.children, function (n) { return n.classList.contains("he-slide"); }); }
    function leftOf(slide) { return slide.offsetLeft - track.offsetLeft; }
    function paint(silent) {
      var list = slides();
      state.total = list.length;
      state.index = clamp(state.index, 0, Math.max(0, list.length - 1));
      prev.disabled = state.index <= 0;
      next.disabled = state.index >= list.length - 1;
      count.textContent = (state.index + 1) + "/" + list.length;
      count.hidden = list.length < 2;
      prev.hidden = next.hidden = list.length < 2;
      root.setAttribute("aria-label", t("carouselLabel", { i: state.index + 1, n: list.length }));
      list.forEach(function (s, i) { s.setAttribute("aria-hidden", i === state.index ? "false" : "true"); });
      if (dots) {
        if (dots.children.length !== list.length) {
          dots.innerHTML = "";
          if (list.length > 1 && list.length <= 20) {
            list.forEach(function (_, i) {
              var d = el("button", { type: "button", class: "he-dots__dot", "aria-label": t("carouselGo", { i: i + 1 }), tabindex: "-1" });
              d.addEventListener("click", function () { go(i); });
              dots.appendChild(d);
            });
          }
        }
        Array.prototype.forEach.call(dots.children, function (d, i) {
          d.classList.toggle("is-active", i === state.index);
          d.classList.toggle("is-far", Math.abs(i - state.index) > 2 && list.length > 6);
        });
      }
      if (silent) return;
      var cur = list[state.index] || null;
      emit(root, "he:slide", { index: state.index, total: list.length, slide: cur, id: cur ? cur.getAttribute("data-slide-id") : null });
    }
    function settle() { state.target = null; clearTimeout(state.targetT); }
    /* Rede de segurança: se a rolagem animada parar antes do destino, volta a valer a posição real */
    function hold() { clearTimeout(state.targetT); state.targetT = setTimeout(settle, 600); }
    function go(i, instant) {
      var list = slides();
      i = clamp(i, 0, Math.max(0, list.length - 1));
      var target = list[i];
      if (!target) return;
      var left = leftOf(target), smooth = !(instant || reduced());
      /* Durante a rolagem animada o índice já é o de destino: a posição intermediária não conta */
      settle();
      if (smooth && Math.abs(track.scrollLeft - left) > 1) {
        state.target = left;
        hold();
      }
      if (track.scrollTo) track.scrollTo({ left: left, behavior: smooth ? "smooth" : "auto" }); else track.scrollLeft = left;
      if (state.index !== i) { state.index = i; paint(); }
    }
    track.addEventListener("scroll", function () {
      if (state.target != null) {
        if (Math.abs(track.scrollLeft - state.target) <= 2) settle(); else hold();
        return;
      }
      if (raf) return;
      raf = requestAnimationFrame(function () {
        raf = 0;
        if (state.target != null) return;
        /* O slide mais perto da posição atual é o da vez */
        var i = state.index, best = Infinity;
        slides().forEach(function (slide, n) {
          var d = Math.abs(leftOf(slide) - track.scrollLeft);
          if (d < best) { best = d; i = n; }
        });
        if (i !== state.index) { state.index = i; paint(); }
      });
    }, { passive: true });
    /* O dedo ou a roda assumem a rolagem: volta a valer a posição real */
    ["pointerdown", "touchstart", "wheel"].forEach(function (name) { track.addEventListener(name, settle, { passive: true }); });
    prev.addEventListener("click", function () { go(state.index - 1); });
    next.addEventListener("click", function () { go(state.index + 1); });
    root.addEventListener("keydown", function (e) {
      if (isTyping(e.target) || e.altKey || e.ctrlKey || e.metaKey) return;
      if (e.key === "ArrowLeft") { e.preventDefault(); go(state.index - 1); }
      else if (e.key === "ArrowRight") { e.preventDefault(); go(state.index + 1); }
      else if (e.key === "Home") { e.preventDefault(); go(0); }
      else if (e.key === "End") { e.preventDefault(); go(state.total - 1); }
    });
    if (window.ResizeObserver) {
      new ResizeObserver(function () {
        var list = slides();
        if (list[state.index] && state.target == null) track.scrollLeft = leftOf(list[state.index]);
      }).observe(track);
    }
    var api = {
      el: root, go: go,
      next: function () { go(state.index + 1); },
      prev: function () { go(state.index - 1); },
      refresh: function () { paint(true); },
      get index() { return state.index; },
      get total() { return state.total; }
    };
    root._heCarousel = api;
    paint(true);
    return api;
  }
  HE.carousel = carousel;

  /* Legenda com "mais" */
  doc.addEventListener("click", function (e) {
    var b = e.target.closest && e.target.closest(".he-post__more-btn");
    if (!b) return;
    var cap = b.closest(".he-post__caption");
    if (!cap) return;
    var open = cap.classList.toggle("is-open");
    b.textContent = t(open ? "captionLess" : "captionMore");
    b.setAttribute("aria-expanded", open ? "true" : "false");
  });
  function initCaption(cap) {
    var text = $(".he-post__captext", cap), btn = $(".he-post__more-btn", cap);
    if (!text) return;
    if (!btn) {
      btn = el("button", { type: "button", class: "he-post__more-btn", "aria-expanded": "false", text: t("captionMore") });
      cap.appendChild(btn);
    }
    if (cap.classList.contains("is-open")) return;
    btn.hidden = !(text.scrollHeight > text.clientHeight + 2);
  }

  /* ===== Player de vídeo e linha do tempo ===== */
  function player(root) {
    root = resolveNode(root);
    if (!root) return null;
    if (root._hePlayer) return root._hePlayer;
    var video = $("video", root);
    if (!video) return null;
    video.removeAttribute("controls");
    video.setAttribute("playsinline", "");
    var big = $(".he-player__big", root);
    if (!big) {
      big = el("button", { type: "button", class: "he-player__big", "aria-label": t("playerPlay") }, "<span>" + icon("play", "he-i--fill") + "</span>");
      root.appendChild(big);
    }
    var bar = $(".he-player__bar", root);
    if (!bar) {
      bar = el("div", { class: "he-player__bar" });
      bar.innerHTML = '<button type="button" class="he-player__btn" data-he-play aria-label="' + esc(t("playerPlay")) + '">' + icon("play", "he-i--fill") + "</button>" +
        '<div class="he-tl" data-he-timeline role="slider" tabindex="0" aria-label="' + esc(t("playerTimeline")) + '" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0"><div class="he-tl__fill"></div></div>' +
        '<span class="he-player__time" data-he-clock>0:00</span>' +
        '<button type="button" class="he-player__btn" data-he-mute aria-label="' + esc(t("playerMute")) + '">' + icon("volume") + "</button>";
      root.appendChild(bar);
    }
    var playBtn = $("[data-he-play]", bar), muteBtn = $("[data-he-mute]", bar);
    var tl = $("[data-he-timeline]", bar) || $("[data-he-timeline]", root), timeEl = $("[data-he-clock], .he-player__time", bar);
    var seeking = false;
    function dur() { return isFinite(video.duration) && video.duration > 0 ? video.duration : (parseFloat(root.getAttribute("data-duration")) || 0); }
    function paint() {
      var d = dur(), now = video.currentTime || 0, playing = !video.paused && !video.ended;
      root.classList.toggle("is-playing", playing);
      if (playBtn) {
        playBtn.innerHTML = playing ? icon("pause", "he-i--bold") : icon("play", "he-i--fill");
        playBtn.setAttribute("aria-label", t(playing ? "playerPause" : "playerPlay"));
      }
      big.setAttribute("aria-label", t(playing ? "playerPause" : "playerPlay"));
      if (muteBtn) {
        muteBtn.innerHTML = icon(video.muted ? "mute" : "volume");
        muteBtn.setAttribute("aria-label", t(video.muted ? "playerUnmute" : "playerMute"));
      }
      if (tl) {
        tl.style.setProperty("--p", d ? clamp(now / d, 0, 1) : 0);
        tl.setAttribute("aria-valuenow", d ? Math.round(now / d * 100) : 0);
        tl.setAttribute("aria-valuetext", t("playerPosition", { time: fmtTime(now), total: fmtTime(d) }));
      }
      if (timeEl) timeEl.textContent = fmtTime(now) + (d ? " / " + fmtTime(d) : "");
      placePins();
    }
    function placePins() {
      var d = dur();
      if (!tl || !d) return;
      $$(".he-pin[data-t], .he-tl__range[data-t]", tl).forEach(function (p) {
        var at = parseFloat(p.getAttribute("data-t")) || 0, end = parseFloat(p.getAttribute("data-t-end"));
        p.style.setProperty("--t", clamp(at / d, 0, 1));
        if (!isNaN(end)) p.style.setProperty("--w", clamp((end - at) / d, 0, 1));
      });
    }
    function play() {
      var p = video.play();
      if (p && p.catch) p.catch(noop);
    }
    function toggle() { if (video.paused || video.ended) play(); else video.pause(); }
    function seekTo(sec) {
      var d = dur();
      try { video.currentTime = clamp(sec, 0, d || sec); } catch (e) {}
      paint();
      emit(root, "he:time", { time: video.currentTime, duration: d });
    }
    function seekFromPointer(e) {
      var r = tl.getBoundingClientRect();
      seekTo(clamp((e.clientX - r.left) / r.width, 0, 1) * dur());
    }
    big.addEventListener("click", function () {
      if (root.closest(".he-pinnable.is-pinning")) return;
      toggle();
    });
    if (playBtn) playBtn.addEventListener("click", toggle);
    if (muteBtn) muteBtn.addEventListener("click", function () { video.muted = !video.muted; paint(); });
    if (tl) {
      tl.addEventListener("pointerdown", function (e) {
        if (e.target.closest(".he-pin")) return;
        seeking = true;
        tl.classList.add("is-seeking");
        try { tl.setPointerCapture(e.pointerId); } catch (x) {}
        seekFromPointer(e);
      });
      tl.addEventListener("pointermove", function (e) { if (seeking) seekFromPointer(e); });
      var endSeek = function () { seeking = false; tl.classList.remove("is-seeking"); };
      tl.addEventListener("pointerup", endSeek);
      tl.addEventListener("pointercancel", endSeek);
      tl.addEventListener("keydown", function (e) {
        if (e.key === "ArrowLeft") { e.preventDefault(); e.stopPropagation(); seekTo((video.currentTime || 0) - 2); }
        else if (e.key === "ArrowRight") { e.preventDefault(); e.stopPropagation(); seekTo((video.currentTime || 0) + 2); }
        else if (e.key === " " || e.key === "Enter") { e.preventDefault(); toggle(); }
      });
      tl.addEventListener("click", function (e) {
        var p = e.target.closest(".he-pin[data-t]");
        if (!p) return;
        var at = parseFloat(p.getAttribute("data-t")) || 0;
        seekTo(at);
        emit(p, "he:pin", { n: p.textContent.trim(), t: at });
      });
    }
    root.addEventListener("keydown", function (e) {
      if (e.target !== root && e.target !== big) return;
      if (e.key === " " || e.key === "k") { e.preventDefault(); toggle(); }
      else if (e.key === "m") { video.muted = !video.muted; paint(); }
    });
    ["play", "pause", "ended", "timeupdate", "loadedmetadata", "durationchange", "volumechange"].forEach(function (name) {
      video.addEventListener(name, function () {
        paint();
        if (name === "timeupdate") emit(root, "he:time", { time: video.currentTime, duration: dur() });
      });
    });
    video.addEventListener("error", function () { root.classList.add("is-error"); });
    var api = {
      el: root, video: video, play: play, pause: function () { video.pause(); }, toggle: toggle, seek: seekTo,
      get time() { return video.currentTime || 0; },
      get duration() { return dur(); },
      /* Marcador numerado na linha do tempo: {n, t, tEnd, resolved} */
      addPin: function (p) {
        if (!tl || !p) return null;
        if (p.tEnd != null) tl.appendChild(el("span", { class: "he-tl__range", "data-t": p.t, "data-t-end": p.tEnd, "data-n": p.n }));
        var b = el("button", {
          type: "button", class: "he-pin" + (p.resolved ? " is-resolved" : ""), "data-t": p.t, "data-n": p.n,
          "aria-label": t("pinAt", { n: p.n, time: fmtTime(p.t) })
        }, "<span>" + esc(p.n) + "</span>");
        tl.appendChild(b);
        placePins();
        return b;
      },
      clearPins: function () { if (tl) $$(".he-pin, .he-tl__range", tl).forEach(function (n) { n.parentNode.removeChild(n); }); }
    };
    root._hePlayer = api;
    paint();
    return api;
  }
  HE.player = player;

  /* ===== Marcadores numerados sobre a imagem ===== */
  function placePin(p) {
    var x = parseFloat(p.getAttribute("data-x")), y = parseFloat(p.getAttribute("data-y"));
    if (!isNaN(x)) p.style.setProperty("--x", clamp(x, 0, 100));
    if (!isNaN(y)) p.style.setProperty("--y", clamp(y, 0, 100));
  }
  /* HE.pins(escopo, {onAdd({n, x, y, slideId, el, host}), onSelect({n, el}), start}): cada .he-pinnable do escopo aceita marcadores */
  HE.pins = function (scope, opts) {
    scope = resolveNode(scope);
    opts = opts || {};
    if (!scope) return null;
    if (scope._hePins) { Object.assign(scope._hePins.opts, opts); return scope._hePins; }
    var st = { on: false, seq: opts.start || 0, opts: opts };
    $$(".he-pin[data-x]", scope).forEach(function (p) {
      placePin(p);
      st.seq = Math.max(st.seq, parseInt(p.textContent, 10) || 0);
    });
    function hosts() {
      var list = $$(".he-pinnable", scope);
      if (scope.classList.contains("he-pinnable")) list.unshift(scope);
      return list;
    }
    function hostOf(target) {
      var h = target.closest(".he-pinnable");
      return h && scope.contains(h) ? h : (scope.classList.contains("he-pinnable") ? scope : null);
    }
    function add(host, p) {
      var n = p.n != null ? p.n : ++st.seq;
      var b = el("button", {
        type: "button", class: "he-pin" + (p.resolved ? " is-resolved" : ""), "data-x": p.x, "data-y": p.y, "data-n": n,
        "aria-label": t("pinLabel", { n: n }) + (p.label ? ": " + p.label : "")
      }, esc(n));
      placePin(b);
      host.appendChild(b);
      return b;
    }
    scope.addEventListener("click", function (e) {
      var pin = e.target.closest(".he-pin");
      if (pin && scope.contains(pin) && !pin.closest(".he-tl")) {
        e.preventDefault();
        e.stopPropagation();
        var n = pin.getAttribute("data-n") || pin.textContent.trim();
        if (st.opts.onSelect) st.opts.onSelect({ n: n, el: pin });
        emit(pin, "he:pin", { n: n });
        return;
      }
      if (!st.on) return;
      var host = hostOf(e.target);
      if (!host) return;
      if (e.target.closest("button:not(.he-player__big), a, input, textarea")) return;
      e.preventDefault();
      e.stopPropagation();
      var r = host.getBoundingClientRect();
      var x = Math.round(clamp((e.clientX - r.left) / r.width * 100, 2, 98) * 10) / 10;
      var y = Math.round(clamp((e.clientY - r.top) / r.height * 100, 2, 98) * 10) / 10;
      var b = add(host, { x: x, y: y });
      var slide = host.closest("[data-slide-id]");
      var info = { n: +b.getAttribute("data-n"), x: x, y: y, slideId: slide ? slide.getAttribute("data-slide-id") : null, el: b, host: host };
      if (st.opts.onAdd) st.opts.onAdd(info);
      emit(host, "he:pin:add", info);
    }, true);
    var api = {
      opts: opts,
      start: function () { st.on = true; hosts().forEach(function (h) { h.classList.add("is-pinning"); }); },
      stop: function () { st.on = false; hosts().forEach(function (h) { h.classList.remove("is-pinning"); }); },
      get active() { return st.on; },
      add: function (p) {
        var host = p.host || (p.slideId != null ? $('[data-slide-id="' + p.slideId + '"]', scope) : null) || hosts()[0];
        if (p.n != null) st.seq = Math.max(st.seq, +p.n || 0);
        return host ? add(host, p) : null;
      },
      remove: function (n) { $$('.he-pin[data-n="' + n + '"]', scope).forEach(function (p) { p.parentNode.removeChild(p); }); },
      clear: function () {
        $$(".he-pin", scope).forEach(function (p) { if (!p.closest(".he-tl")) p.parentNode.removeChild(p); });
        st.seq = opts.start || 0;
      },
      next: function () { return st.seq + 1; }
    };
    scope._hePins = api;
    return api;
  };

  /* ===== Barra de decisão: aprovar, pedir ajuste, negar ===== */
  var decides = [];
  function chipButtons(list) {
    return list.map(function (q) { return '<button type="button" class="he-chip" aria-pressed="false" data-q="' + esc(q) + '">' + esc(q) + "</button>"; }).join("");
  }
  /* HE.decide(el, {onApprove(), onAdjust({quick, text, pins}), onDeny({reason}), onSwap(), onAdjustStart({el}), getPins(), quick, reasons}) */
  HE.decide = function (root, opts) {
    root = resolveNode(root);
    if (!root) return null;
    if (root._heDecide) { Object.assign(root._heDecide.opts, opts || {}); return root._heDecide; }
    opts = opts || {};
    var busy = false;
    function setBusy(on) { busy = on; root.classList.toggle("is-busy", on); }
    function run(name, payload, fn) {
      var ev = emit(root, "he:decide", Object.assign({ decision: name }, payload || {}), true);
      if (ev.defaultPrevented || !fn) return Promise.resolve();
      var out;
      try { out = fn(payload); } catch (e) { out = Promise.reject(e); }
      if (!out || !out.then) return Promise.resolve(out);
      setBusy(true);
      return out.then(function (v) { setBusy(false); return v; }, function (err) {
        setBusy(false);
        toast.error(err, { text: t("decideFailed") });
        throw err;
      });
    }
    function flash(btn) {
      if (!btn) return;
      btn.classList.add("is-pressed");
      setTimeout(function () { btn.classList.remove("is-pressed"); }, 160);
    }
    function approve() {
      if (busy) return;
      flash($('[data-he-decide="approve"]', root));
      run("approve", {}, api.opts.onApprove).catch(noop);
    }
    function adjust() {
      if (busy || api.sheet) return;
      /* A tela pode assumir o ajuste: onAdjustStart devolvendo false impede a folha padrão. */
      if (api.opts.onAdjustStart && api.opts.onAdjustStart({ el: root }) === false) return;
      var pins = api.opts.getPins ? (api.opts.getPins() || []) : [];
      var quick = api.opts.quick || tlist("decideQuick");
      var tip = api.opts.getPins && !pins.length ? esc(t("decidePinTip")) + " " : "";
      var bodyHtml = '<form class="he-adjust" data-he-adjust-form>' +
        (quick.length ? '<div class="he-chips he-adjust__quick" role="group" aria-label="' + esc(t("decideQuickLabel")) + '">' + chipButtons(quick) + "</div>" : "") +
        (pins.length ? '<ul class="he-adjust__pins">' + pins.map(function (p) {
          return '<li class="he-adjust__pin"><span class="he-pin he-pin--static">' + esc(p.n) + "</span><div><small>" + esc(p.where || "") +
            '</small><input type="text" data-pin="' + esc(p.n) + '" value="' + esc(p.text || "") + '" placeholder="' + esc(t("decidePinPlaceholder")) +
            '" aria-label="' + esc(t("pinLabel", { n: p.n })) + '"></div></li>';
        }).join("") + "</ul>" : "") +
        '<div class="he-field"><label for="he-adjust-text">' + esc(t("decideAdjustLabel")) + '</label><textarea class="he-textarea" id="he-adjust-text" rows="3" placeholder="' +
        esc(t("decideAdjustPlaceholder")) + '"></textarea></div>' +
        '<div class="he-adjust__hint">' + tip + '<span class="he-keyhint"><kbd class="he-kbd">Ctrl</kbd> <kbd class="he-kbd">Enter</kbd> ' + esc(t("decideSendHint")) + "</span></div></form>";
      var foot = '<button type="button" class="he-btn he-btn--ghost" data-he-close>' + esc(t("cancel")) + '</button><button type="button" class="he-btn he-btn--primary" data-he-adjust-send>' + esc(t("decideAdjustSend")) + "</button>";
      var sheet = api.sheet = HE.sheet({ title: t("decideAdjust"), body: bodyHtml, foot: foot, focus: "#he-adjust-text", onClose: function () { api.sheet = null; } });
      var form = $("[data-he-adjust-form]", sheet.el), ta = $("textarea", form);
      form.addEventListener("click", function (e) {
        var c = e.target.closest(".he-chip");
        if (c) c.setAttribute("aria-pressed", c.getAttribute("aria-pressed") === "true" ? "false" : "true");
      });
      function send() {
        var chosen = $$('.he-chip[aria-pressed="true"]', form).map(function (c) { return c.getAttribute("data-q"); });
        var pinTexts = $$("input[data-pin]", form).map(function (i) {
          var base = pins.filter(function (p) { return String(p.n) === i.getAttribute("data-pin"); })[0] || {};
          return Object.assign({}, base, { text: i.value.trim() });
        });
        var text = ta.value.trim();
        if (!chosen.length && !text && !pinTexts.some(function (p) { return p.text; })) {
          ta.focus();
          toast({ text: t("decideAdjustEmpty"), kind: "info" });
          return;
        }
        sheet.close("send");
        run("adjust", { quick: chosen, text: text, pins: pinTexts }, api.opts.onAdjust).catch(noop);
      }
      $("[data-he-adjust-send]", sheet.el).addEventListener("click", send);
      form.addEventListener("submit", function (e) { e.preventDefault(); send(); });
      form.addEventListener("keydown", function (e) { if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) { e.preventDefault(); send(); } });
    }
    function deny() {
      if (busy || api.sheet) return;
      var reasons = api.opts.reasons || tlist("decideReasons"), hint = t("decideDenyHint");
      var bodyHtml = '<form class="he-adjust" data-he-deny-form>' +
        (reasons.length ? '<div class="he-chips" role="group" aria-label="' + esc(t("decideReasonLabel")) + '">' + chipButtons(reasons) + "</div>" : "") +
        '<div class="he-field"><label for="he-deny-text">' + esc(t("decideDenyLabel")) + '</label><input class="he-input" id="he-deny-text" type="text" placeholder="' + esc(t("decideDenyPlaceholder")) + '"></div>' +
        (hint ? '<div class="he-adjust__hint">' + esc(hint) + "</div>" : "") + "</form>";
      var foot = '<button type="button" class="he-btn he-btn--ghost" data-he-close>' + esc(t("cancel")) + '</button><button type="button" class="he-btn he-btn--danger" data-he-deny-send>' + esc(t("decideDenySend")) + "</button>";
      var sheet = api.sheet = HE.sheet({ title: t("decideDenyTitle"), body: bodyHtml, foot: foot, focus: "[data-he-deny-send]", onClose: function () { api.sheet = null; } });
      var form = $("[data-he-deny-form]", sheet.el), input = $("input", form);
      form.addEventListener("click", function (e) {
        var c = e.target.closest(".he-chip");
        if (!c) return;
        $$(".he-chip", form).forEach(function (o) { o.setAttribute("aria-pressed", o === c && c.getAttribute("aria-pressed") !== "true" ? "true" : "false"); });
      });
      function send() {
        var chip = $('.he-chip[aria-pressed="true"]', form);
        var reason = [chip ? chip.getAttribute("data-q") : "", input.value.trim()].filter(Boolean).join(". ");
        sheet.close("send");
        run("deny", { reason: reason }, api.opts.onDeny).catch(noop);
      }
      $("[data-he-deny-send]", sheet.el).addEventListener("click", send);
      form.addEventListener("submit", function (e) { e.preventDefault(); send(); });
    }
    root.addEventListener("click", function (e) {
      var b = e.target.closest("[data-he-decide]");
      if (!b || !root.contains(b)) return;
      var name = b.getAttribute("data-he-decide");
      if (name === "approve") approve();
      else if (name === "adjust") adjust();
      else if (name === "deny") deny();
      else if (name === "swap") run("swap", {}, api.opts.onSwap).catch(noop);
    });
    var api = {
      el: root, opts: opts, sheet: null, approve: approve, adjust: adjust, deny: deny,
      destroy: function () {
        decides = decides.filter(function (d) { return d !== api; });
        root._heDecide = null;
        syncDecideClass();
      },
      /* Troca o rótulo do botão principal: setApprove("Aprovar", "qui 28/11 · 18h") ou setApprove(["Aprovar", " e programar"], sub).
         A segunda parte da lista some em tela estreita. */
      setApprove: function (label, sub) {
        var b = $('[data-he-decide="approve"] .he-decide__label', root);
        if (!b) return;
        var main = Array.isArray(label) ? label[0] : label, more = Array.isArray(label) ? label[1] : "";
        b.innerHTML = esc(main || "") + (more ? '<span class="he-decide__more">' + esc(more) + "</span>" : "") + (sub ? "<small>" + esc(sub) + "</small>" : "");
      }
    };
    root._heDecide = api;
    decides.push(api);
    syncDecideClass();
    return api;
  };
  function syncDecideClass() {
    decides = decides.filter(function (d) { return doc.contains(d.el); });
    html.classList.toggle("he-has-decide", decides.some(function (d) { return !d.el.classList.contains("he-decide--static") && !d.el.hidden; }));
  }
  function activeDecide() {
    decides = decides.filter(function (d) { return doc.contains(d.el); });
    var top = topOverlay(), scope = top ? top.el : null;
    for (var i = decides.length - 1; i >= 0; i--) {
      var d = decides[i];
      if (d.el.hidden || !d.el.getClientRects().length) continue;
      if (scope ? scope.contains(d.el) : true) return d;
    }
    return null;
  }

  /* ===== Alternador de visões ===== */
  /* <div class="he-views" data-he-views data-param="visao" data-storage="app.visao"> <button class="he-views__item" data-view="quadro"> */
  HE.views = function (root, opts) {
    root = resolveNode(root);
    if (!root) return null;
    if (root._heViews) return root._heViews;
    opts = opts || {};
    var param = opts.param || root.getAttribute("data-param") || "", storage = opts.storage || root.getAttribute("data-storage") || "";
    var items = $$(".he-views__item", root);
    var thumb = $(".he-views__thumb", root);
    if (!thumb) {
      thumb = el("span", { class: "he-views__thumb", "aria-hidden": "true" });
      root.insertBefore(thumb, root.firstChild);
    }
    /* Links navegam sozinhos, a menos que a tela peça para trocar por JS */
    var linksNavigate = !opts.onChange && !root.hasAttribute("data-he-views-js");
    function isOn(n) { return n.classList.contains("is-active") || n.getAttribute("aria-pressed") === "true" || n.getAttribute("aria-current") === "true"; }
    function current() {
      var a = items.filter(isOn)[0];
      return a ? a.getAttribute("data-view") : null;
    }
    function store(view) {
      if (!storage) return;
      try { localStorage.setItem(storage, view); } catch (e) {}
    }
    function place() {
      var a = items.filter(isOn)[0];
      if (!a || !a.offsetWidth) { thumb.style.width = "0px"; return; }
      thumb.style.width = a.offsetWidth + "px";
      thumb.style.transform = "translateX(" + a.offsetLeft + "px)";
      root.classList.add("is-ready");
    }
    function set(view, silent) {
      var found = false;
      items.forEach(function (n) {
        var on = n.getAttribute("data-view") === view;
        if (on) found = true;
        n.classList.toggle("is-active", on);
        if (n.tagName === "BUTTON") n.setAttribute("aria-pressed", on ? "true" : "false");
        else if (on) n.setAttribute("aria-current", "true");
        else n.removeAttribute("aria-current");
      });
      if (!found) return;
      place();
      store(view);
      if (silent) return;
      if (param) {
        try {
          var u = new URL(location.href);
          u.searchParams.set(param, view);
          history.replaceState(history.state, "", u.pathname + u.search + u.hash);
        } catch (e) {}
      }
      if (opts.onChange) opts.onChange(view);
      emit(root, "he:view", { view: view });
    }
    root.addEventListener("click", function (e) {
      var it = e.target.closest(".he-views__item");
      if (!it || !root.contains(it)) return;
      var view = it.getAttribute("data-view");
      if (it.tagName === "A" && it.getAttribute("href") && linksNavigate) { store(view); return; }
      e.preventDefault();
      set(view);
    });
    root.addEventListener("keydown", function (e) {
      if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
      var i = items.indexOf(doc.activeElement);
      if (i < 0) return;
      e.preventDefault();
      var n = items[(i + (e.key === "ArrowRight" ? 1 : -1) + items.length) % items.length];
      n.focus();
      if (n.tagName === "BUTTON") n.click();
    });
    /* Na carga vale a URL, depois a escolha guardada */
    var fromUrl = null, stored = null;
    try { fromUrl = param ? new URL(location.href).searchParams.get(param) : null; } catch (e) {}
    try { stored = storage ? localStorage.getItem(storage) : null; } catch (e) {}
    var want = fromUrl || stored;
    if (want && want !== current()) {
      var target = items.filter(function (n) { return n.getAttribute("data-view") === want; })[0];
      if (target && target.tagName === "A" && !fromUrl && linksNavigate) location.replace(target.href);
      else if (target) set(want, false);
    } else if (!current() && items[0]) set(items[0].getAttribute("data-view"), true);
    place();
    if (window.ResizeObserver) new ResizeObserver(place).observe(root);
    if (doc.fonts && doc.fonts.ready) doc.fonts.ready.then(place);
    var api = { el: root, set: set, get: current };
    root._heViews = api;
    return api;
  };

  /* ===== Chips: <div class="he-chips" data-he-chips="multi|single" data-name="tipo"> <button class="he-chip" aria-pressed="false" data-value="a"> ===== */
  doc.addEventListener("click", function (e) {
    var chip = e.target.closest && e.target.closest("button.he-chip[aria-pressed]");
    if (!chip) return;
    var group = chip.closest("[data-he-chips]");
    if (!group) return;
    var single = group.getAttribute("data-he-chips") === "single", on = chip.getAttribute("aria-pressed") !== "true";
    var all = $$("button.he-chip[aria-pressed]", group);
    if (chip.hasAttribute("data-he-chip-clear")) {
      all.forEach(function (c) { c.setAttribute("aria-pressed", "false"); });
    } else {
      if (single) all.forEach(function (c) { if (c !== chip) c.setAttribute("aria-pressed", "false"); });
      chip.setAttribute("aria-pressed", on ? "true" : "false");
    }
    var values = all.filter(function (c) { return c.getAttribute("aria-pressed") === "true"; }).map(function (c) { return c.getAttribute("data-value"); });
    emit(group, "he:chips", { name: group.getAttribute("data-name") || "", values: values, value: single ? (values[0] || null) : values, chip: chip });
  });

  /* ===== Abas: <div class="he-tabs" data-he-tabs> <button class="he-tab" aria-controls="p1" aria-selected="true"> e painéis .he-tabpanel#p1 ===== */
  HE.tabs = function (root) {
    root = resolveNode(root);
    if (!root) return null;
    if (root._heTabs) return root._heTabs;
    var tabs = $$(".he-tab", root);
    root.setAttribute("role", "tablist");
    function panel(tab) {
      var id = tab.getAttribute("aria-controls");
      return id ? doc.getElementById(id) : null;
    }
    function select(tab, focus, silent) {
      if (!tab) return;
      tabs.forEach(function (o) {
        var on = o === tab;
        o.setAttribute("role", "tab");
        o.setAttribute("aria-selected", on ? "true" : "false");
        o.setAttribute("tabindex", on ? "0" : "-1");
        o.classList.toggle("is-active", on);
        var p = panel(o);
        if (!p) return;
        p.hidden = !on;
        p.setAttribute("role", "tabpanel");
        if (!p.hasAttribute("tabindex")) p.setAttribute("tabindex", "0");
        if (o.id) p.setAttribute("aria-labelledby", o.id);
      });
      if (focus) tab.focus();
      if (!silent) emit(root, "he:tab", { tab: tab.getAttribute("data-tab") || tab.getAttribute("aria-controls"), el: tab });
    }
    root.addEventListener("click", function (e) {
      var tab = e.target.closest(".he-tab");
      if (tab && root.contains(tab) && tab.tagName !== "A") { e.preventDefault(); select(tab); }
    });
    root.addEventListener("keydown", function (e) {
      var i = tabs.indexOf(doc.activeElement);
      if (i < 0) return;
      if (e.key === "ArrowRight") { e.preventDefault(); select(tabs[(i + 1) % tabs.length], true); }
      else if (e.key === "ArrowLeft") { e.preventDefault(); select(tabs[(i - 1 + tabs.length) % tabs.length], true); }
      else if (e.key === "Home") { e.preventDefault(); select(tabs[0], true); }
      else if (e.key === "End") { e.preventDefault(); select(tabs[tabs.length - 1], true); }
    });
    /* Abas em <a> são links comuns: só as de botão são controladas aqui */
    if (tabs.length && tabs[0].tagName !== "A") {
      var start = tabs.filter(function (o) { return o.getAttribute("aria-selected") === "true" || o.classList.contains("is-active"); })[0] || tabs[0];
      select(start, false, true);
    }
    var api = {
      el: root,
      select: function (key) {
        select(tabs.filter(function (o) { return o.getAttribute("data-tab") === key || o.getAttribute("aria-controls") === key; })[0]);
      }
    };
    root._heTabs = api;
    return api;
  };

  /* Brilho de "IA trabalhando" em qualquer elemento. */
  HE.glow = function (target, on, label) {
    var node = resolveNode(target);
    if (!node) return;
    node.classList.toggle("he-glow", on !== false);
    if (on === false) {
      node.removeAttribute("data-he-glow");
      node.removeAttribute("aria-busy");
      return;
    }
    node.setAttribute("aria-busy", "true");
    if (label === "") node.removeAttribute("data-he-glow"); else node.setAttribute("data-he-glow", label || t("glow"));
  };

  /* ===== Linha de passos: HE.steps(root, índice) marca os anteriores como feitos e o atual ===== */
  HE.steps = function (root, index) {
    root = resolveNode(root);
    if (!root) return null;
    var api = root._heSteps;
    if (!api) {
      api = root._heSteps = {
        el: root,
        get: function () {
          var list = $$(".he-steps__step", root);
          for (var i = 0; i < list.length; i++) if (list[i].classList.contains("is-current")) return i;
          return -1;
        },
        /* Índice igual ao total de passos marca todos como feitos; negativo limpa. */
        set: function (i) {
          i = parseInt(i, 10);
          if (isNaN(i)) i = -1;
          $$(".he-steps__step", root).forEach(function (step, n) {
            step.classList.toggle("is-done", n < i);
            step.classList.toggle("is-current", n === i);
            if (n === i) step.setAttribute("aria-current", "step"); else step.removeAttribute("aria-current");
          });
          return api;
        }
      };
    }
    if (index != null) api.set(index);
    return api;
  };

  /* ===== Chave liga e desliga: .he-switch[role=switch] ===== */
  function toggleSwitch(node) {
    if (node.disabled || node.getAttribute("aria-disabled") === "true") return;
    var on = node.getAttribute("aria-checked") !== "true";
    node.setAttribute("aria-checked", on ? "true" : "false");
    var input = $('input[type="checkbox"]', node);
    if (input) input.checked = on;
    emit(node, "he:switch", { checked: on, name: node.getAttribute("data-name") || node.getAttribute("name") || "", el: node });
  }
  HE.switch = {
    toggle: function (target) { var node = resolveNode(target); if (node) toggleSwitch(node); },
    set: function (target, on) {
      var node = resolveNode(target);
      if (node && (node.getAttribute("aria-checked") === "true") !== !!on) toggleSwitch(node);
    }
  };
  doc.addEventListener("click", function (e) {
    var sw = e.target.closest && e.target.closest('.he-switch[role="switch"]');
    if (sw) toggleSwitch(sw);
  });
  doc.addEventListener("keydown", function (e) {
    if (e.key !== " " || e.ctrlKey || e.metaKey || e.altKey) return;
    var sw = e.target.matches && e.target.matches('.he-switch[role="switch"]') ? e.target : null;
    /* <button> já transforma Espaço em clique; os outros elementos precisam de ajuda */
    if (!sw || sw.tagName === "BUTTON") return;
    e.preventDefault();
    toggleSwitch(sw);
  });

  /* ===== Menu lateral: recolhido no computador, gaveta no celular ===== */
  var NAV_KEY = "he.nav.collapsed";
  var nav = { opener: null };
  function navWide() { return !media("(max-width: " + HE.sidebar.breakpoint + "px)"); }
  function navState() { return { open: html.classList.contains("he-nav-open"), collapsed: html.classList.contains("he-nav-collapsed") }; }
  function syncNavButtons() {
    var s = navState(), expanded = navWide() ? !s.collapsed : s.open;
    $$("[data-he-sidebar-toggle]").forEach(function (b) { b.setAttribute("aria-expanded", expanded ? "true" : "false"); });
  }
  function navOpen(on, opener) {
    on = !!on;
    if (navState().open === on) return;
    html.classList.toggle("he-nav-open", on);
    syncNavButtons();
    if (on) {
      nav.opener = opener || doc.activeElement;
      var side = $(".he-sidebar"), first = side ? focusables(side)[0] : null;
      if (first) focusQuiet(first);
    } else {
      var back = nav.opener;
      nav.opener = null;
      if (back && back.focus && doc.contains(back)) focusQuiet(back);
    }
    emit(doc, "he:sidebar", navState());
  }
  function navCollapse(on) {
    on = !!on;
    html.classList.toggle("he-nav-collapsed", on);
    try { localStorage.setItem(NAV_KEY, on ? "1" : "0"); } catch (e) {}
    syncNavButtons();
    emit(doc, "he:sidebar", navState());
  }
  HE.sidebar = {
    /* Até esta largura (px) o menu lateral é gaveta; acima, recolhe. */
    breakpoint: 1023,
    toggle: function (opener) { if (navWide()) navCollapse(!navState().collapsed); else navOpen(!navState().open, opener); },
    collapse: function (on) { navCollapse(on === undefined ? !navState().collapsed : on); },
    open: function () { navOpen(true); },
    close: function () { navOpen(false); },
    state: navState
  };
  doc.addEventListener("click", function (e) {
    if (!e.target.closest) return;
    var toggle = e.target.closest("[data-he-sidebar-toggle]");
    if (toggle) { e.preventDefault(); HE.sidebar.toggle(toggle); return; }
    if (e.target.closest(".he-scrim-nav")) navOpen(false);
  });
  window.addEventListener("resize", function () {
    if (navState().open && navWide()) navOpen(false);
    else syncNavButtons();
  });

  /* ===== Carimbo: aparece sobre o alvo e some sozinho ===== */
  var STAMP_ICON = { ok: "check", adjust: "edit", denied: "x" };
  var STAMP_TEXT = { ok: "stampOk", adjust: "stampAdjust", denied: "stampDenied" };
  /* HE.stamp(alvo, {text, kind: "ok"|"adjust"|"denied", icon, duration}) */
  HE.stamp = function (target, opts) {
    var host = resolveNode(target);
    if (!host) return null;
    if (typeof opts === "string") opts = { text: opts };
    opts = opts || {};
    var kind = STAMP_ICON[opts.kind] ? opts.kind : "ok";
    var text = opts.text != null ? opts.text : t(STAMP_TEXT[kind]);
    var node = el("div", { class: "he-stamp", "data-kind": kind, "aria-hidden": "true" }, icon(opts.icon || STAMP_ICON[kind]) + "<span>" + esc(text) + "</span>");
    host.appendChild(node);
    void node.offsetWidth;   /* garante o estado inicial antes da classe que anima */
    node.classList.add("he-stamp--pop");
    if (text) say(text);
    var gone = false;
    function remove() {
      if (gone) return;
      gone = true;
      clearTimeout(timer);
      leave(node);
    }
    var timer = setTimeout(remove, opts.duration || 1400);
    return { el: node, remove: remove };
  };

  /* ===== Arrastar e soltar por ponteiro (mouse, caneta e toque) e por teclado ===== */
  /* HE.dnd(raiz, {item, zone, handle, axis, delay, canDrop(ctx), onStart(ctx), onDrop(ctx), onCancel(ctx)})
     ctx: {item, from, to, index, fromIndex, before, after, revert(), pointer}. onDrop pode devolver uma Promise; se falhar, o item volta. */
  HE.dnd = function (root, opts) {
    root = resolveNode(root);
    if (!root) return null;
    opts = Object.assign({ item: "[data-he-drag]", zone: "[data-he-drop]", handle: null, axis: null, delay: 240, threshold: 6, keyboard: true }, opts || {});
    var s = null, suppressClick = false;
    function itemsOf(zone) {
      return Array.prototype.filter.call(zone.querySelectorAll(opts.item), function (n) {
        return n.closest(opts.zone) === zone && !n.classList.contains("he-drag-ghost");
      });
    }
    function axisOf(zone) {
      var a = zone.getAttribute("data-he-axis") || opts.axis;
      if (a) return a;
      var cs = getComputedStyle(zone);
      if (cs.display.indexOf("grid") >= 0 && cs.gridTemplateColumns.split(" ").length > 1) return "grid";
      if (cs.display.indexOf("flex") >= 0 && cs.flexDirection.indexOf("row") === 0) return cs.flexWrap === "nowrap" ? "x" : "grid";
      return "y";
    }
    function ctxFor(zone, index) {
      return { item: s.item, from: s.from, to: zone, index: index, fromIndex: s.fromIndex, pointer: s.pointerType };
    }
    function allowed(item, from, zone) {
      if (!zone) return false;
      if (zone.hasAttribute("data-he-drop-locked")) return false;
      if (!opts.canDrop) return true;
      return opts.canDrop({ item: item, from: from, to: zone }) !== false;
    }
    function putBack(home, item) {
      home.parent.insertBefore(item, home.next && home.next.parentNode === home.parent ? home.next : null);
    }
    function afterDrop(ctx, revert) {
      emit(ctx.item, "he:drop", ctx);
      if (!opts.onDrop) return;
      var out;
      try { out = opts.onDrop(ctx); } catch (e) { revert(); toast.error(e, { text: t("dndFailed") }); return; }
      if (out && out.then) {
        out.catch(function (err) {
          revert();
          if (err && err.message) toast.error(err, { text: t("dndFailed") });
        });
      }
    }
    function onDown(e) {
      if (s || (e.pointerType === "mouse" && e.button !== 0)) return;
      var item = e.target.closest(opts.item);
      if (!item || !root.contains(item) || item.hasAttribute("data-he-nodrag")) return;
      if (opts.handle) { if (!e.target.closest(opts.handle)) return; }
      else if (e.target.closest("input, textarea, select, [contenteditable=''], [contenteditable='true'], [data-he-nodrag], .he-card__actions")) return;
      var zone = item.closest(opts.zone);
      if (!zone || !root.contains(zone)) return;
      s = {
        item: item, from: zone, fromIndex: itemsOf(zone).indexOf(item), x0: e.clientX, y0: e.clientY, x: e.clientX, y: e.clientY,
        id: e.pointerId, pointerType: e.pointerType, started: false, timer: null, next: item.nextSibling
      };
      doc.addEventListener("pointermove", onMove, true);
      doc.addEventListener("pointerup", onUp, true);
      doc.addEventListener("pointercancel", onCancel, true);
      if (e.pointerType === "touch") {
        /* Toque longo arma o arrasto; antes disso o dedo rola a tela */
        s.timer = setTimeout(function () {
          if (!s || s.started) return;
          item.classList.add("he-drag-arm");
          if (navigator.vibrate) { try { navigator.vibrate(8); } catch (x) {} }
          start();
        }, opts.delay);
      }
    }
    function start() {
      var item = s.item, r = item.getBoundingClientRect();
      s.started = true;
      s.dx = s.x - r.left;
      s.dy = s.y - r.top;
      var ghost = item.cloneNode(true);
      ghost.classList.remove("he-drag-arm");
      ghost.classList.add("he-drag-ghost");
      ghost.removeAttribute("id");
      ghost.style.width = r.width + "px";
      ghost.style.height = r.height + "px";
      var toned = item.closest("[data-tone]");
      if (toned && !ghost.hasAttribute("data-tone")) ghost.setAttribute("data-tone", toned.getAttribute("data-tone"));
      doc.body.appendChild(ghost);
      s.ghost = ghost;
      var ph = doc.createElement(item.tagName === "LI" ? "li" : "div");
      ph.className = "he-drag-ph";
      ph.setAttribute("aria-hidden", "true");
      ph.style.height = r.height + "px";
      if (axisOf(s.from) !== "y") ph.style.width = r.width + "px";
      item.parentNode.insertBefore(ph, item);
      s.ph = ph;
      s.zone = s.from;
      item.classList.remove("he-drag-arm");
      item.classList.add("he-drag-src");
      html.classList.add("he-dragging");
      moveGhost();
      if (opts.onStart) opts.onStart(ctxFor(s.from, s.fromIndex));
      emit(item, "he:dragstart", { from: s.from });
      s.raf = requestAnimationFrame(tick);
    }
    function moveGhost() { s.ghost.style.transform = "translate3d(" + Math.round(s.x - s.dx) + "px," + Math.round(s.y - s.dy) + "px,0)"; }
    function onMove(e) {
      if (!s || e.pointerId !== s.id) return;
      s.x = e.clientX;
      s.y = e.clientY;
      if (!s.started) {
        var dist = Math.abs(s.x - s.x0) + Math.abs(s.y - s.y0);
        if (s.pointerType === "touch") { if (dist > 10) cleanup(); return; }   /* o dedo andou antes do toque longo: é rolagem */
        if (dist < opts.threshold) return;
        start();
      }
      e.preventDefault();
      moveGhost();
      place();
    }
    function place() {
      var under = doc.elementFromPoint(clamp(s.x, 0, window.innerWidth - 1), clamp(s.y, 0, window.innerHeight - 1));
      var zone = under && under.closest ? under.closest(opts.zone) : null;
      if (zone && !root.contains(zone)) zone = null;
      if (s.hover && s.hover !== zone) s.hover.classList.remove("he-drop-on", "he-drop-no");
      s.hover = zone;
      if (!zone) return;
      if (zone !== s.from && !allowed(s.item, s.from, zone)) {
        /* Sobre zona fechada o marcador volta ao lugar de origem: soltar ali cancela */
        zone.classList.add("he-drop-no");
        if (s.ph.nextSibling !== s.item) {
          s.item.parentNode.insertBefore(s.ph, s.item);
          s.ph.style.width = axisOf(s.from) !== "y" ? s.ghost.style.width : "";
        }
        s.zone = s.from;
        return;
      }
      zone.classList.add("he-drop-on");
      var axis = axisOf(zone), list = itemsOf(zone).filter(function (n) { return n !== s.item; }), before = null;
      for (var i = 0; i < list.length; i++) {
        var r = list[i].getBoundingClientRect(), hit;
        if (axis === "x") hit = s.x < r.left + r.width / 2;
        else if (axis === "grid") hit = s.y < r.top || (s.y <= r.bottom && s.x < r.left + r.width / 2);
        else hit = s.y < r.top + r.height / 2;
        if (hit) { before = list[i]; break; }
      }
      if (s.ph.parentNode !== zone || s.ph.nextElementSibling !== before) {
        if (before) zone.insertBefore(s.ph, before); else zone.appendChild(s.ph);
        s.ph.style.width = axis !== "y" ? s.ghost.style.width : "";
      }
      s.zone = zone;
    }
    function scrollParent(node, horiz) {
      for (var p = node; p && p !== doc.body && p !== html; p = p.parentElement) {
        var cs = getComputedStyle(p), ov = horiz ? cs.overflowX : cs.overflowY;
        if (/(auto|scroll)/.test(ov) && (horiz ? p.scrollWidth > p.clientWidth + 1 : p.scrollHeight > p.clientHeight + 1)) return p;
      }
      return null;
    }
    /* Rola sozinho perto das bordas enquanto arrasta */
    function tick() {
      if (!s || !s.started) return;
      var edge = 56, speed = 14, moved = false;
      var base = s.hover || s.zone || root;
      var hx = scrollParent(base, true), vy = scrollParent(base, false);
      if (hx) {
        var rx = hx.getBoundingClientRect();
        if (s.x < rx.left + edge) { hx.scrollLeft -= speed; moved = true; }
        else if (s.x > rx.right - edge) { hx.scrollLeft += speed; moved = true; }
      }
      if (vy) {
        var ry = vy.getBoundingClientRect();
        if (s.y < ry.top + edge) { vy.scrollTop -= speed; moved = true; }
        else if (s.y > ry.bottom - edge) { vy.scrollTop += speed; moved = true; }
      } else if (!stack.length) {
        if (s.y < edge + 60) { window.scrollBy(0, -speed); moved = true; }
        else if (s.y > window.innerHeight - edge - 40) { window.scrollBy(0, speed); moved = true; }
      }
      if (moved) place();
      s.raf = requestAnimationFrame(tick);
    }
    function finish(drop) {
      var st = s;
      if (!st) return;
      if (!st.started) { cleanup(); return; }
      var item = st.item, zone = st.ph.parentNode, ok = drop && zone && zone.matches && zone.matches(opts.zone);
      var home = { parent: st.from, next: st.next };
      if (ok) zone.insertBefore(item, st.ph);
      var index = ok ? itemsOf(zone).indexOf(item) : st.fromIndex;
      var changed = ok && (zone !== st.from || index !== st.fromIndex);
      cleanup();
      /* O clique que vem logo depois de soltar é ignorado */
      suppressClick = true;
      setTimeout(function () { suppressClick = false; }, 60);
      function revert() { putBack(home, item); }
      var ctx = {
        item: item, from: st.from, to: ok ? zone : st.from, index: index, fromIndex: st.fromIndex,
        before: item.nextElementSibling, after: item.previousElementSibling, revert: revert, pointer: st.pointerType
      };
      if (!changed) {
        if (!ok) revert();
        if (opts.onCancel) opts.onCancel(ctx);
        return;
      }
      afterDrop(ctx, revert);
    }
    function cleanup() {
      if (!s) return;
      clearTimeout(s.timer);
      cancelAnimationFrame(s.raf);
      doc.removeEventListener("pointermove", onMove, true);
      doc.removeEventListener("pointerup", onUp, true);
      doc.removeEventListener("pointercancel", onCancel, true);
      if (s.ghost && s.ghost.parentNode) s.ghost.parentNode.removeChild(s.ghost);
      if (s.ph && s.ph.parentNode) s.ph.parentNode.removeChild(s.ph);
      if (s.hover) s.hover.classList.remove("he-drop-on", "he-drop-no");
      $$(".he-drop-on, .he-drop-no", root).forEach(function (z) { z.classList.remove("he-drop-on", "he-drop-no"); });
      s.item.classList.remove("he-drag-src", "he-drag-arm");
      html.classList.remove("he-dragging");
      s = null;
    }
    function onUp(e) { if (s && e.pointerId === s.id) finish(true); }
    function onCancel(e) { if (s && (!e || e.pointerId === s.id)) finish(false); }
    function onKey(e) {
      if (s && s.started && e.key === "Escape") { e.preventDefault(); e.stopPropagation(); finish(false); return; }
      /* Teclado: Alt + setas move o item em foco dentro da zona e entre zonas */
      if (!opts.keyboard || !e.altKey || s || !/^Arrow/.test(e.key)) return;
      var item = e.target.closest && e.target.closest(opts.item);
      if (!item || !root.contains(item)) return;
      var zone = item.closest(opts.zone);
      if (!zone) return;
      var zones = $$(opts.zone, root), zi = zones.indexOf(zone), list = itemsOf(zone), i = list.indexOf(item), axis = axisOf(zone);
      var back = axis === "y" ? "ArrowUp" : "ArrowLeft", fwd = axis === "y" ? "ArrowDown" : "ArrowRight";
      var sideBack = axis === "y" ? "ArrowLeft" : "ArrowUp", sideFwd = axis === "y" ? "ArrowRight" : "ArrowDown";
      var along = e.key === back ? -1 : e.key === fwd ? 1 : 0;
      var across = e.key === sideBack ? -1 : e.key === sideFwd ? 1 : 0;
      var home = { parent: zone, next: item.nextSibling }, to = zone, moved = false;
      if (along && list[i + along]) {
        if (along < 0) zone.insertBefore(item, list[i - 1]); else zone.insertBefore(item, list[i + 1].nextSibling);
        moved = true;
      } else if (across) {
        var n = zi + across;
        while (zones[n] && !allowed(item, zone, zones[n])) n += across;
        if (zones[n]) {
          to = zones[n];
          to.insertBefore(item, itemsOf(to)[0] || null);
          moved = true;
        }
      }
      if (!moved) return;
      e.preventDefault();
      var focusEl = item.matches("a, button, [tabindex]") ? item : $("a, button, [tabindex]", item);
      if (focusEl) focusEl.focus();
      function revert() { putBack(home, item); }
      var ctx = {
        item: item, from: zone, to: to, index: itemsOf(to).indexOf(item), fromIndex: i,
        before: item.nextElementSibling, after: item.previousElementSibling, revert: revert, pointer: "keyboard"
      };
      var name = to.getAttribute("aria-label") || "";
      say(name ? t("dndMovedTo", { zone: name, n: ctx.index + 1 }) : t("dndMoved", { n: ctx.index + 1 }));
      afterDrop(ctx, revert);
    }
    function onTouchMove(e) { if (s && s.started && e.cancelable) e.preventDefault(); }
    function onClick(e) { if (suppressClick) { e.preventDefault(); e.stopPropagation(); suppressClick = false; } }
    function onNative(e) { if (e.target.closest && e.target.closest(opts.item)) e.preventDefault(); }
    function onContext(e) { if (s) e.preventDefault(); }
    root.addEventListener("pointerdown", onDown);
    root.addEventListener("dragstart", onNative);
    root.addEventListener("click", onClick, true);
    root.addEventListener("contextmenu", onContext);
    doc.addEventListener("touchmove", onTouchMove, { passive: false });
    doc.addEventListener("keydown", onKey, true);
    return {
      el: root,
      get dragging() { return !!(s && s.started); },
      cancel: function () { finish(false); },
      destroy: function () {
        cleanup();
        root.removeEventListener("pointerdown", onDown);
        root.removeEventListener("dragstart", onNative);
        root.removeEventListener("click", onClick, true);
        root.removeEventListener("contextmenu", onContext);
        doc.removeEventListener("touchmove", onTouchMove, { passive: false });
        doc.removeEventListener("keydown", onKey, true);
      }
    };
  };

  /* ===== Inicialização dos componentes declarativos ===== */
  /* Chame HE.init(raiz) depois de inserir HTML novo. */
  HE.init = function (root) {
    root = resolveNode(root) || doc;
    function all(sel) {
      var list = $$(sel, root);
      if (root.matches && root.matches(sel)) list.unshift(root);
      return list;
    }
    all("[data-he-carousel]").forEach(carousel);
    all("[data-he-player]").forEach(player);
    all("[data-he-views]").forEach(function (n) { HE.views(n); });
    all("[data-he-tabs]").forEach(function (n) { HE.tabs(n); });
    all("[data-he-steps]").forEach(function (n) { var i = n.getAttribute("data-he-steps"); HE.steps(n, i === "" ? null : i); });
    all("[data-he-decide-bar]").forEach(function (n) { HE.decide(n); });
    all("[data-he-chips] button.he-chip:not([aria-pressed])").forEach(function (n) { n.setAttribute("aria-pressed", n.classList.contains("is-active") ? "true" : "false"); });
    all(".he-post__caption").forEach(initCaption);
    all(".he-pin[data-x]").forEach(placePin);
    all("time[data-he-time]").forEach(initTime);
    all("[data-he-count]").forEach(function (n) {
      var k = n.getAttribute("data-he-count");
      if (counts[k] != null && n.textContent.trim() === "") n.textContent = counts[k];
    });
    composerEnhance(root);
    syncDecideClass();
    return HE;
  };

  /* Observador opcional: liga sozinho o que for inserido depois. HE.config({observe: true}) */
  var observer = null;
  function observe(on) {
    if (!window.MutationObserver || !doc.body) return;
    if (!on) { if (observer) { observer.disconnect(); observer = null; } return; }
    if (observer) return;
    var pend = [], raf = 0;
    observer = new MutationObserver(function (list) {
      for (var i = 0; i < list.length; i++) {
        for (var j = 0; j < list[i].addedNodes.length; j++) {
          var n = list[i].addedNodes[j];
          if (n.nodeType === 1 && !n.classList.contains("he-drag-ghost") && !n.classList.contains("he-drag-ph")) pend.push(n);
        }
      }
      if (!pend.length || raf) return;
      raf = requestAnimationFrame(function () {
        raf = 0;
        var batch = pend;
        pend = [];
        batch.forEach(function (n) { if (doc.contains(n)) HE.init(n); });
      });
    });
    observer.observe(doc.body, { childList: true, subtree: true });
  }

  /* HE.config({labels, locale, keys, observe}) */
  var booted = false, wantObserve = false;
  HE.config = function (opts) {
    opts = opts || {};
    if (opts.labels) Object.assign(HE.labels, opts.labels);
    if (opts.locale != null) HE.locale = opts.locale;
    if (opts.keys) {
      Object.keys(keys).forEach(function (k) { if (opts.keys[k]) keys[k] = String(opts.keys[k]).toLowerCase(); });
    }
    if (opts.observe != null) {
      wantObserve = !!opts.observe;
      if (booted) observe(wantObserve);
    }
    if (opts.labels && booted) { syncThemeButtons(); paintPresence(); }
    return HE;
  };

  function boot() {
    if (booted) return;
    booted = true;
    HE.icons.mount();
    if (!html.getAttribute("data-he-theme")) applyTheme(themePref(), true); else applyTheme(html.getAttribute("data-he-theme"), true);
    try { if (localStorage.getItem(NAV_KEY) === "1") html.classList.add("he-nav-collapsed"); } catch (e) {}
    syncNavButtons();
    initDock();
    /* Estado inicial da presença e dos contadores vem da marcação */
    var pBtn = $("[data-he-presence]");
    if (pBtn) {
      presence = normPresence({ state: pBtn.getAttribute("data-state"), working: pBtn.getAttribute("data-working"), waiting: pBtn.getAttribute("data-waiting") });
      paintPresence(true);
    }
    $$("[data-he-count]").forEach(function (n) {
      var k = n.getAttribute("data-he-count"), v = parseInt(n.textContent, 10);
      if (!isNaN(v) && counts[k] == null) counts[k] = v;
    });
    paintCounts();
    HE.init(doc);
    if (wantObserve) observe(true);
  }

  /* ===== Cliques e teclas globais ===== */
  doc.addEventListener("click", function (e) {
    var hit = e.target.closest && e.target.closest("[data-he-new], [data-he-presence], [data-he-palette-open], [data-he-theme-toggle], [data-he-shortcuts-open], [data-he-ask], [data-he-focus-dock]");
    if (!hit) return;
    if (hit.hasAttribute("data-he-new")) { e.preventDefault(); HE.newMenu.open(hit); }
    else if (hit.hasAttribute("data-he-presence")) {
      var detail = Object.assign({ el: hit }, HE.presence.get());
      var asked = emit(hit, "he:presence-open", detail, true), handled = asked.defaultPrevented;
      if (typeof HE.presence.onOpen === "function") { HE.presence.onOpen(detail); handled = true; }
      /* Link de presença só navega quando ninguém assumiu a abertura */
      if (handled || hit.tagName !== "A") e.preventDefault();
    }
    else if (hit.hasAttribute("data-he-palette-open")) { e.preventDefault(); HE.palette.open(); }
    else if (hit.hasAttribute("data-he-theme-toggle")) { e.preventDefault(); HE.theme.toggle(); }
    else if (hit.hasAttribute("data-he-shortcuts-open")) { e.preventDefault(); HE.shortcuts.open(); }
    else if (hit.hasAttribute("data-he-ask")) {
      /* Botão que pede à IA: data-he-ask="texto do pedido" [data-action] [data-fill] */
      e.preventDefault();
      var prompt = hit.getAttribute("data-he-ask");
      if (hit.hasAttribute("data-fill") || !prompt) { HE.dock.focus(prompt || ""); return; }
      hit.disabled = true;
      var free = function () { hit.disabled = false; };
      HE.ask({ prompt: prompt, action: hit.getAttribute("data-action") || undefined, el: hit }).then(free, free);
    }
    else if (hit.hasAttribute("data-he-focus-dock")) { e.preventDefault(); HE.dock.focus(hit.getAttribute("data-he-focus-dock") || undefined); }
  });
  doc.addEventListener("keydown", function (e) {
    if (e.defaultPrevented) return;
    var key = e.key, mod = e.ctrlKey || e.metaKey;
    if (mod && !e.altKey && !e.shiftKey && (key === "k" || key === "K")) {
      if (HE.palette.hotkey === false) return;
      e.preventDefault();
      HE.palette.toggle();
      return;
    }
    if (mod || e.altKey || isTyping(e.target)) return;
    if (pal.node) return;
    var top = topOverlay();
    if (key === "/" && (!top || top.withDock) && dock.input) { e.preventDefault(); HE.dock.focus(); return; }
    if (key === "?" && !top) { e.preventDefault(); HE.shortcuts.open(); return; }
    if (e.repeat || key.length !== 1) return;
    var lower = key.toLowerCase();
    if (lower !== keys.approve && lower !== keys.adjust && lower !== keys.deny) return;
    /* Teclas da barra de decisão: valem com a barra visível e sem gaveta aberta */
    if (top && top.el.classList.contains("he-drawer")) return;
    var d = activeDecide();
    if (!d) return;
    e.preventDefault();
    if (lower === keys.approve) d.approve(); else if (lower === keys.adjust) d.adjust(); else d.deny();
  });

  if (doc.readyState === "loading") doc.addEventListener("DOMContentLoaded", boot); else boot();
})();
