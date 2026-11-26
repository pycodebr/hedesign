/*! hedesign 1.0.1 · MIT · https://github.com/pycodebr/hedesign */
/* hedesign-theme.js
   Aplica o tema antes da primeira pintura. Carregue no <head>, sem defer nem async.
   Preferência em localStorage["he.theme"]: "light", "dark" ou "auto". Sem preferência salva vale "auto",
   ou o que estiver em <html data-he-theme-default="light|dark">. O resto fica em hedesign.js. */
(function () {
  "use strict";
  var html = document.documentElement;
  var fallback = html.getAttribute("data-he-theme-default");
  var pref = null;
  try { pref = localStorage.getItem("he.theme"); } catch (e) {}
  if (pref !== "light" && pref !== "dark" && pref !== "auto") pref = fallback === "light" || fallback === "dark" ? fallback : "auto";
  if (pref === "auto") pref = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  html.setAttribute("data-he-theme", pref);
  /* O menu lateral recolhido também vale desde a primeira pintura, para a página não saltar. */
  try { if (localStorage.getItem("he.nav.collapsed") === "1") html.classList.add("he-nav-collapsed"); } catch (e) {}
  var meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute("content", pref === "dark" ? "#131316" : "#f4f2ee");
})();
