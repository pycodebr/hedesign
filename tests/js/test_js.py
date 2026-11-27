#!/usr/bin/env python3
"""Teste do hedesign.js no navegador (Playwright + Chromium).

Uso: /usr/bin/python3 tests/js/test_js.py
Abre tests/js/harness.html por file:// em 1440x900 e em 390x844, confere cada módulo e imprime "OK nome".
Sai com código 1 se algum teste falhar ou se a página registrar erro no console.
"""
import json
import os
import sys
import traceback

from playwright.sync_api import sync_playwright

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.normpath(os.path.join(HERE, "..", ".."))
URL = "file://" + os.path.join(HERE, "harness.html")
LIB = os.path.join(ROOT, "src", "js", "hedesign.js")
THEME = os.path.join(ROOT, "src", "js", "hedesign-theme.js")
SPRITE = os.path.join(ROOT, "src", "icons", "sprite.svg")
SIZES = [(1440, 900), (390, 844)]
TIMEOUT = 15000


# ---------- apoio ----------

def ev(page, expr, arg=None):
    """Avalia uma expressão JS na página."""
    if arg is None:
        return page.evaluate("() => (" + expr + ")")
    return page.evaluate("(arg) => (" + expr + ")", arg)


def wait(page, expr):
    """Espera a expressão JS ficar verdadeira."""
    page.wait_for_function("() => (" + expr + ")", timeout=TIMEOUT)


def fresh(page):
    """Recarrega a página de teste sem nada guardado."""
    page.evaluate("() => { try { localStorage.clear(); } catch (e) {} }")
    page.goto(URL)
    wait(page, "window.T && T.ready === true")


def reload(page):
    page.goto(URL)
    wait(page, "window.T && T.ready === true")


def click(page, sel):
    """Clique real, com o alvo no meio da tela (longe do campo fixo do rodapé)."""
    page.evaluate("(s) => document.querySelector(s).scrollIntoView({ block: 'center', inline: 'nearest' })", sel)
    page.click(sel)


def blur(page):
    page.evaluate("() => { if (document.activeElement && document.activeElement.blur) document.activeElement.blur(); }")


def active_id(page):
    return page.evaluate("() => (document.activeElement && document.activeElement.id) || ''")


def has_class(page, cls):
    return page.evaluate("(c) => document.documentElement.classList.contains(c)", cls)


def closed(page):
    """Nenhuma camada aberta e nada mais saindo de cena."""
    wait(page, "!HE.overlayOpen() && !document.querySelector('.he-layers .is-closing')")


def box(page, sel):
    r = page.evaluate(
        "(s) => { var r = document.querySelector(s).getBoundingClientRect(); return { x: r.left, y: r.top, w: r.width, h: r.height }; }", sel)
    r["cx"] = r["x"] + r["w"] / 2
    r["cy"] = r["y"] + r["h"] / 2
    return r


def eq(got, want, what=""):
    assert got == want, "%s: esperado %r, veio %r" % (what or "valor", want, got)


# ---------- testes ----------

def t_api(page, mobile):
    names = ["util", "icon", "esc", "icons", "theme", "overlayOpen", "toast", "say", "counts", "dock", "ask", "composer", "presence",
             "drawer", "sheet", "menu", "newMenu", "palette", "layer", "shortcuts", "carousel", "player", "pins", "decide", "views",
             "tabs", "glow", "dnd", "fmtDate", "switch", "sidebar", "stamp", "steps", "init", "config", "labels"]
    missing = ev(page, "arg.filter(function (n) { return HE[n] == null; })", names)
    eq(missing, [], "membros de HE")
    eq(ev(page, "typeof HE.version === 'string' && HE.version.length > 0"), True, "HE.version")
    eq(ev(page, "['$', '$$', 'esc', 'el', 'emit', 'isTyping', 'isMobile', 'focusables'].filter(function (n) { return typeof HE.util[n] !== 'function'; })"), [], "HE.util")
    eq(ev(page, "HE.icon('check', 'he-i--lg')"), '<svg class="he-i he-i--lg" aria-hidden="true" focusable="false"><use href="#he-i-check"/></svg>', "HE.icon")
    eq(ev(page, "HE.esc('<a href=\"x\">&</a>')"), "&lt;a href=&quot;x&quot;&gt;&amp;&lt;/a&gt;", "HE.esc")
    eq(ev(page, "HE.util.isMobile()"), mobile, "isMobile")
    # a página já traz o sprite: mount não duplica
    eq(ev(page, "HE.icons.mount()"), False, "icons.mount com sprite presente")
    eq(ev(page, "document.querySelectorAll('#he-sprite').length"), 1, "um sprite só")
    eq(ev(page, "typeof HE.fetch + typeof HE.api + typeof HE.html + typeof HE.boot + typeof HE.urls"), "undefined" * 5, "nada de rede nem de domínio")


def t_theme(page, mobile):
    eq(ev(page, "T_THEME_AT_HEAD"), "light", "tema antes da pintura")
    eq(ev(page, "HE.theme.pref()"), "auto", "padrão sem preferência")
    eq(ev(page, "HE.theme.get()"), "light")
    # auto acompanha o sistema ao vivo
    page.emulate_media(color_scheme="dark")
    wait(page, "document.documentElement.getAttribute('data-he-theme') === 'dark'")
    eq(ev(page, "[T.last('he:theme').theme, T.last('he:theme').pref]"), ["dark", "auto"], "evento he:theme em auto")
    eq(ev(page, "document.querySelector('meta[name=theme-color]').content"), "#131316", "theme-color escuro")
    page.emulate_media(color_scheme="light")
    wait(page, "document.documentElement.getAttribute('data-he-theme') === 'light'")
    eq(ev(page, "document.querySelector('meta[name=theme-color]').content"), "#f4f2ee", "theme-color claro")
    # botão alterna, atualiza aria-pressed, ícone e rótulo
    click(page, "#t-theme")
    eq(ev(page, "HE.theme.get()"), "dark", "toggle")
    eq(ev(page, "localStorage.getItem('he.theme')"), "dark", "preferência salva")
    eq(ev(page, "Array.from(document.querySelectorAll('[data-he-theme-toggle]')).map(function (b) { return b.getAttribute('aria-pressed'); })"), ["true", "true"])
    eq(ev(page, "document.querySelector('#t-theme use').getAttribute('href')"), "#he-i-sun", "ícone do botão")
    eq(ev(page, "document.querySelector('#t-theme').getAttribute('aria-label')"), "Usar tema claro", "rótulo acessível")
    eq(ev(page, "document.querySelector('#t-theme-text [data-he-theme-label]').textContent"), "Usar tema claro", "rótulo visível")
    eq(ev(page, "document.querySelector('#t-theme-text use').getAttribute('href')"), "#he-i-sun", "ícone do botão com rótulo")
    # preferência fixa não segue o sistema
    page.emulate_media(color_scheme="dark")
    page.emulate_media(color_scheme="light")
    eq(ev(page, "HE.theme.get()"), "dark", "preferência fixa")
    # persistência: o script do <head> aplica antes do resto
    reload(page)
    eq(ev(page, "T_THEME_AT_HEAD"), "dark", "tema persistido antes da pintura")
    eq(ev(page, "document.querySelector('#t-theme').getAttribute('aria-pressed')"), "true", "botão depois da recarga")
    ev(page, "HE.theme.toggle()")
    eq(ev(page, "[HE.theme.get(), localStorage.getItem('he.theme')]"), ["light", "light"], "toggle por código")
    # set('auto') volta a seguir o sistema
    ev(page, "HE.theme.set('auto')")
    eq(ev(page, "[HE.theme.pref(), HE.theme.get()]"), ["auto", "light"])
    page.emulate_media(color_scheme="dark")
    wait(page, "HE.theme.get() === 'dark'")
    reload(page)
    eq(ev(page, "T_THEME_AT_HEAD"), "dark", "auto persistido com sistema escuro")
    page.emulate_media(color_scheme="light")
    wait(page, "HE.theme.get() === 'light'")
    # data-he-theme-default troca o padrão quando não há preferência
    eq(ev(page, "(function () { localStorage.removeItem('he.theme'); document.documentElement.setAttribute('data-he-theme-default', 'dark'); return HE.theme.pref(); })()"), "dark")


def t_toast(page, mobile):
    eq(ev(page, "document.getElementById('he-toasts')"), None, "contêiner só nasce com o primeiro aviso")
    ev(page, "void HE.toast({ text: 'Item movido.', onUndo: function () { T.call('undo'); } })")
    eq(page.locator("#he-toasts .he-toast").count(), 1)
    eq(ev(page, "document.getElementById('he-toasts').getAttribute('aria-live')"), "polite")
    eq(page.locator("#he-toasts .he-toast__btn").inner_text(), "Desfazer", "botão Desfazer")
    eq(page.locator("#he-toasts .he-toast__bar").count(), 1, "barra de contagem")
    eq(ev(page, "document.querySelector('.he-toast__x').getAttribute('aria-label')"), "Fechar aviso")
    page.click("#he-toasts .he-toast__btn")
    wait(page, "T.calls.undo && T.calls.undo.length === 1")
    wait(page, "Array.from(document.querySelectorAll('.he-toast__text')).some(function (n) { return n.textContent === 'Desfeito.'; })")
    eq(ev(page, "T.count('he:undone')"), 1)
    # onUndo com promessa que falha: aviso de erro com o motivo
    ev(page, "void HE.toast({ text: 'Lote movido.', onUndo: function () { return Promise.reject(new Error('Sem conexão.')); } })")
    page.click("#he-toasts .he-toast:last-child .he-toast__btn")
    wait(page, "(function () { var n = document.querySelector('.he-toast--error .he-toast__text'); return !!n && n.textContent.indexOf('Não deu para desfazer.') === 0 && n.textContent.indexOf('Sem conexão.') > 0; })()")
    eq(ev(page, "document.querySelector('.he-toast--error').getAttribute('role')"), "alert")
    fresh(page)
    # tipo, segunda linha e ação
    ev(page, "void HE.toast({ text: 'Pedido enviado.', sub: 'Resumo da semana', kind: 'ai', action: { label: 'Acompanhar', onClick: function () { T.call('action'); } } })")
    eq(ev(page, "document.querySelector('.he-toast--ai .he-toast__text small').textContent"), "Resumo da semana")
    eq(ev(page, "document.querySelector('.he-toast--ai use').getAttribute('href')"), "#he-i-sparkles")
    page.click("#he-toasts .he-toast__btn")
    wait(page, "T.calls.action && T.calls.action.length === 1")
    # texto simples e no máximo três na tela
    ev(page, "void [1, 2, 3, 4, 5].forEach(function (i) { HE.toast('Aviso ' + i); })")
    assert ev(page, "document.querySelectorAll('#he-toasts .he-toast').length") <= 3, "mais de três avisos na tela"
    fresh(page)
    page.mouse.move(700, 80)   # ponteiro longe dos avisos: o que nasce embaixo dele ficaria pausado
    # pausa com o ponteiro em cima: o tempo só volta a contar quando ele sai
    ev(page, "void (function () { var t = HE.toast({ text: 'Com pausa.', duration: 300, onUndo: function () {} }); T.paused = t.el; t.el.dispatchEvent(new MouseEvent('mouseenter')); })()")
    page.wait_for_timeout(700)
    eq(ev(page, "document.contains(T.paused)"), True, "aviso pausado continua na tela")
    ev(page, "void T.paused.dispatchEvent(new MouseEvent('mouseleave'))")
    wait(page, "!document.contains(T.paused)")
    # duração curta some sozinho; erro com Tentar de novo
    ev(page, "void (T.quick = HE.toast({ text: 'Rápido.', duration: 120 }).el)")
    wait(page, "!document.contains(T.quick)")
    ev(page, "void HE.toast.error(new Error('O servidor não respondeu.'), { text: 'Não foi salvo.', retry: function () { T.call('retry'); } })")
    eq(page.locator(".he-toast--error .he-toast__btn").inner_text(), "Tentar de novo")
    page.click(".he-toast--error .he-toast__btn")
    wait(page, "T.calls.retry && T.calls.retry.length === 1")
    # anúncio para leitor de tela
    ev(page, "void HE.say('Lista atualizada.')")
    wait(page, "Array.from(document.querySelectorAll('.he-sr[aria-live]')).some(function (n) { return n.textContent === 'Lista atualizada.'; })")


def t_counts(page, mobile):
    eq(ev(page, "HE.counts.get().inbox"), 3, "valor lido da marcação")
    ev(page, "void HE.counts.set({ inbox: 0, novos: 2 })")
    eq(ev(page, "[document.querySelector('#t-count').hidden, document.querySelector('#t-count-hide').hidden]"), [True, True], "zero esconde")
    eq(ev(page, "T.last('he:counts')"), {"inbox": 0, "novos": 2}, "evento he:counts")
    ev(page, "void HE.counts.set({ inbox: 12 })")
    eq(ev(page, "[document.querySelector('#t-count').textContent, document.querySelector('#t-count').hidden, document.querySelector('#t-count-hide').hidden]"), ["12", False, False])
    eq(ev(page, "HE.counts.get()"), {"inbox": 12, "novos": 2})
    # chave com aspas não quebra nada; data-he-count-keep mantém o zero à vista
    ev(page, "void (document.querySelector('#t-count').setAttribute('data-he-count-keep', ''), HE.counts.set({ inbox: 0, 'a\"b': 1 }))")
    eq(ev(page, "[document.querySelector('#t-count').textContent, document.querySelector('#t-count').hidden, document.querySelector('#t-count-hide').hidden]"), ["0", False, True])


def t_drawer(page, mobile):
    click(page, "#t-open-drawer")
    page.wait_for_selector(".he-layers .he-drawer[role=dialog]")
    eq(ev(page, "[HE.overlayOpen(), document.documentElement.classList.contains('he-lock')]"), [True, True], "pilha e trava de rolagem")
    assert ev(page, "/^\\d+px$/.test(document.documentElement.style.getPropertyValue('--he-sbw'))"), "--he-sbw"
    eq(ev(page, "document.querySelector('.he-layers .he-drawer').getAttribute('aria-modal')"), "true")
    eq(ev(page, "(function () { var d = document.querySelector('.he-layers .he-drawer'); return document.getElementById(d.getAttribute('aria-labelledby')).textContent; })()"), "Detalhes")
    wait(page, "document.querySelector('.he-layers .he-drawer').contains(document.activeElement)")
    # foco preso: Tab e Shift+Tab não saem da gaveta
    for key in ["Tab"] * 6 + ["Shift+Tab"] * 5:
        page.keyboard.press(key)
        assert ev(page, "document.querySelector('.he-layers .he-drawer').contains(document.activeElement)"), "o foco saiu da gaveta com " + key
    page.keyboard.press("Escape")
    closed(page)
    eq(active_id(page), "t-open-drawer", "foco devolvido")
    eq(ev(page, "[T.calls.drawerClose[0], T.last('he:drawer:close').reason]"), ["esc", "esc"])
    eq(has_class(page, "he-lock"), False)
    # fecha pelo botão, pelo clique fora e por código
    click(page, "#t-open-drawer")
    page.wait_for_selector(".he-layers .he-drawer")
    page.click("#t-in-2")
    closed(page)
    eq(ev(page, "T.calls.drawerClose[1]"), "button")
    click(page, "#t-open-drawer")
    page.wait_for_selector(".he-layers .he-scrim")
    page.mouse.click(40, 24)
    closed(page)
    eq(ev(page, "T.calls.drawerClose[2]"), "scrim")
    eq(active_id(page), "t-open-drawer", "foco devolvido depois do clique fora")
    click(page, "#t-open-drawer")
    page.wait_for_selector(".he-layers .he-drawer")
    ev(page, "void HE.drawer.close()")
    closed(page)
    eq(ev(page, "T.calls.drawerClose[3]"), "api")
    # opções: lado, largura, nó como corpo e retorno {el, body, close}
    eq(ev(page, "(function () { var p = document.createElement('p'); p.id = 't-node'; p.textContent = 'Nó'; var d = HE.drawer.open({ title: 'Esquerda', side: 'left', wide: true, body: p }); var out = [d.el.classList.contains('he-drawer--left'), d.el.classList.contains('he-drawer--wide'), d.body.firstChild.id, typeof d.close]; d.close(); return out; })()"),
       [True, True, "t-node", "function"])
    closed(page)


def t_sheet(page, mobile):
    click(page, "#t-open-sheet")
    page.wait_for_selector(".he-layers .he-drawer--sheet[role=dialog]")
    wait(page, "document.activeElement.id === 't-sheet-date'")
    page.keyboard.press("Escape")
    closed(page)
    eq(active_id(page), "t-open-sheet", "foco devolvido")
    eq(ev(page, "T.calls.sheetClose[0]"), "esc")
    # duas camadas: Esc fecha só a de cima
    click(page, "#t-open-drawer")
    page.wait_for_selector(".he-layers .he-drawer")
    ev(page, "void HE.sheet({ title: 'Por cima', body: '<button type=\"button\" class=\"he-btn\" id=\"t-top\">Certo</button>' })")
    wait(page, "document.activeElement.id === 't-top'")
    page.keyboard.press("Escape")
    wait(page, "document.querySelectorAll('.he-layers .he-drawer:not(.is-closing)').length === 1")
    eq(ev(page, "HE.overlayOpen()"), True, "a de baixo continua aberta")
    page.keyboard.press("Escape")
    closed(page)
    eq(active_id(page), "t-open-drawer")
    # gaveta declarada na página: abre no lugar certo e volta para casa ao fechar
    click(page, "#t-open-declared")
    wait(page, "!document.querySelector('#t-drawer').hidden && document.querySelector('#t-drawer').parentNode.classList.contains('he-layers')")
    eq(ev(page, "document.querySelector('#t-drawer').getAttribute('role')"), "dialog")
    page.keyboard.press("Escape")
    wait(page, "document.querySelector('#t-drawer').hidden && document.querySelector('#t-drawer').parentNode.id === 's-overlays'")
    closed(page)
    eq(active_id(page), "t-open-declared")


def t_palette(page, mobile):
    blur(page)
    page.keyboard.press("Control+k")
    page.wait_for_selector(".he-pal[role=dialog]")
    wait(page, "document.activeElement === document.querySelector('.he-pal__input')")
    texts = ev(page, "Array.from(document.querySelectorAll('.he-pal__item .he-pal__text')).map(function (n) { return n.textContent; })")
    for want in ["Painel geral", "Usar tema escuro", "Atalhos de teclado"]:
        assert want in texts, "paleta sem o item " + want
    # busca em fonte registrada (assíncrona) e Enter seleciona
    page.keyboard.type("alfa")
    wait(page, "(function () { var s = document.querySelector('.he-pal__item.is-sel'), c = T.calls.search || []; return !!s && s.textContent.indexOf('Projeto Alfa') >= 0 && c[c.length - 1] === 'alfa'; })()")
    eq(ev(page, "document.querySelector('.he-pal__group').textContent"), "Projetos", "grupo da fonte")
    eq(ev(page, "document.querySelector('.he-pal__item.is-sel').getAttribute('data-tone')"), "blue")
    eq(ev(page, "document.querySelector('.he-pal__input').getAttribute('aria-activedescendant')"), "he-pal-o0")
    eq(ev(page, "T.calls.search[T.calls.search.length - 1]"), "alfa", "texto entregue à fonte")
    page.keyboard.press("Enter")
    wait(page, "T.calls.palette && T.calls.palette[0] === 'alfa'")
    closed(page)
    eq(ev(page, "T.last('he:palette-select').item.label"), "Projeto Alfa")
    # botão declarativo, fonte fixa e setas
    click(page, "#t-pal-open")
    page.wait_for_selector(".he-pal")
    wait(page, "document.activeElement === document.querySelector('.he-pal__input')")
    page.keyboard.type("projeto")
    wait(page, "T.calls.search[T.calls.search.length - 1] === 'projeto' && document.querySelectorAll('.he-pal__item:not(.he-pal__item--ai)').length === 2")
    page.keyboard.press("ArrowDown")
    wait(page, "(function () { var s = document.querySelector('.he-pal__item.is-sel'); return !!s && s.textContent.indexOf('Projeto Beta') >= 0; })()")
    page.keyboard.press("Enter")
    wait(page, "T.calls.palette.length === 2 && T.calls.palette[1] === 'beta'")
    closed(page)
    eq(active_id(page), "t-pal-open", "foco devolvido ao botão")
    # item fixo da IA chama he:ask com o texto digitado
    blur(page)
    page.keyboard.press("Control+k")
    page.wait_for_selector(".he-pal")
    wait(page, "document.activeElement === document.querySelector('.he-pal__input')")
    page.keyboard.type("resuma a semana")
    wait(page, "(function () { var q = document.querySelector('.he-pal__item--ai q'); return !!q && q.textContent === 'resuma a semana'; })()")
    assert ev(page, "document.querySelector('.he-pal__item--ai .he-pal__text').textContent.indexOf('Pedir à IA') === 0"), "rótulo do item da IA"
    page.keyboard.press("Control+Enter")
    wait(page, "T.count('he:ask') === 1")
    eq(ev(page, "T.last('he:ask').prompt"), "resuma a semana")
    closed(page)
    # Ctrl K alterna e Esc fecha
    page.keyboard.press("Control+k")
    page.wait_for_selector(".he-pal")
    page.keyboard.press("Control+k")
    closed(page)
    ev(page, "void HE.palette.open('painel')")
    wait(page, "(function () { var s = document.querySelector('.he-pal__item.is-sel'); return !!s && s.textContent.indexOf('Painel geral') >= 0; })()")
    page.keyboard.press("Escape")
    closed(page)
    # sem o item da IA e sem resultado: aviso de nada encontrado
    ev(page, "void (HE.palette.askAI = false, HE.palette.open('zzzz'))")
    wait(page, "(function () { var n = document.querySelector('.he-pal__note'); return !!n && n.textContent === 'Nada encontrado com esse texto.'; })()")
    eq(page.locator(".he-pal__item").count(), 0)
    page.keyboard.press("Enter")
    page.keyboard.press("ArrowDown")
    ev(page, "void (HE.palette.close(), HE.palette.askAI = true)")
    closed(page)


def t_dock(page, mobile):
    assert ev(page, "/^\\d+px$/.test(document.documentElement.style.getPropertyValue('--he-dock-h'))"), "--he-dock-h com a altura real"
    assert ev(page, "parseInt(document.documentElement.style.getPropertyValue('--he-dock-h'), 10) >= 40"), "--he-dock-h pequeno demais"
    # contexto
    ev(page, "void HE.dock.setContext([{ key: 'projeto', label: 'Projeto Alfa', value: 7, kind: 'Projeto' }, { key: 'pagina', label: 'Painel' }])")
    eq(page.locator("#he-dock .he-ctx").count(), 2)
    eq(ev(page, "HE.dock.getContext()"), {"projeto": 7, "pagina": "Painel"})
    ev(page, "void HE.dock.addContext({ key: 'item', label: 'Item 3', value: 'i3' })")
    eq(ev(page, "T.last('he:context').context"), {"projeto": 7, "pagina": "Painel", "item": "i3"})
    ev(page, "void HE.dock.removeContext('pagina')")
    eq(page.locator("#he-dock .he-ctx").count(), 2)
    ev(page, "void HE.dock.setContext({ semana: { label: 'Semana 48', value: '2026-W48' }, projeto: 'Alfa' })")
    eq(ev(page, "HE.dock.getContext()"), {"semana": "2026-W48", "projeto": "Alfa"})
    eq(ev(page, "document.querySelector('#he-dock .he-ctx__x').getAttribute('aria-label')"), "Tirar Semana 48 do contexto")
    # sugestões aparecem com o foco no campo
    ev(page, "void HE.dock.setSuggestions([{ label: 'Resumir', prompt: 'Resuma esta tela.', action: 'resumo' }, 'Listar pendências'])")
    page.click("#t-dock-input")
    wait(page, "document.querySelector('#he-dock').classList.contains('is-open') && document.documentElement.classList.contains('he-dock-open')")
    eq(page.locator("#he-dock .he-sug").count(), 2)
    # a etiqueta sai pelo x, com o campo aberto
    page.click("#he-dock .he-ctx[data-key='projeto'] .he-ctx__x")
    eq(ev(page, "HE.dock.getContext()"), {"semana": "2026-W48"})
    page.click("#he-dock .he-sug >> nth=0")
    eq(ev(page, "document.querySelector('#t-dock-input').value"), "Resuma esta tela.", "sugestão preenche o campo")
    eq(active_id(page), "t-dock-input")
    eq(ev(page, "document.querySelector('#he-dock .he-composer').classList.contains('is-empty')"), False)
    # Enter emite he:ask com {prompt, context, action} e limpa o campo
    page.keyboard.press("Enter")
    wait(page, "T.count('he:ask') === 1")
    eq(ev(page, "(function () { var d = T.last('he:ask'); return [d.prompt, d.action, d.context]; })()"), ["Resuma esta tela.", "resumo", {"semana": "2026-W48"}])
    wait(page, "document.querySelector('#t-dock-input').value === '' && document.querySelector('#he-dock .he-composer').classList.contains('is-empty')")
    wait(page, "T.count('he:asked') === 1")
    # a tecla / leva o cursor ao campo
    blur(page)
    wait(page, "!document.querySelector('#he-dock').classList.contains('is-open') && !document.documentElement.classList.contains('he-dock-open')")
    page.keyboard.press("/")
    wait(page, "document.activeElement.id === 't-dock-input'")
    eq(ev(page, "document.querySelector('#t-dock-input').value"), "", "a barra não entra no campo")
    # Shift+Enter quebra linha e não envia
    page.keyboard.type("linha um")
    page.keyboard.press("Shift+Enter")
    page.keyboard.type("linha dois")
    eq(ev(page, "document.querySelector('#t-dock-input').value"), "linha um\nlinha dois")
    eq(ev(page, "T.count('he:ask')"), 1)
    # onAsk com promessa: is-sending enquanto pendente, limpa ao resolver
    ev(page, "void (HE.dock.onAsk = function (d) { T.call('onAsk', d.prompt); return new Promise(function (res, rej) { T.resolveAsk = res; T.rejectAsk = rej; }); })")
    page.keyboard.press("Enter")
    wait(page, "document.querySelector('#he-dock').classList.contains('is-sending')")
    eq(ev(page, "[T.calls.onAsk.length, document.querySelector('#t-dock-input').value]"), [1, "linha um\nlinha dois"], "texto fica enquanto envia")
    page.keyboard.press("Enter")
    eq(ev(page, "T.calls.onAsk.length"), 1, "um pedido por vez")
    ev(page, "void T.resolveAsk({ id: 31 })")
    wait(page, "!document.querySelector('#he-dock').classList.contains('is-sending') && document.querySelector('#t-dock-input').value === ''")
    eq(ev(page, "T.last('he:asked').response.id"), 31)
    # ao rejeitar: aviso de erro e o texto fica
    page.focus("#t-dock-input")
    page.keyboard.type("vai falhar")
    page.click("#t-dock-send")
    wait(page, "document.querySelector('#he-dock').classList.contains('is-sending')")
    ev(page, "void T.rejectAsk(new Error('Servidor fora do ar.'))")
    wait(page, "(function () { var n = document.querySelector('.he-toast--error .he-toast__text'); return !!n && n.textContent.indexOf('O pedido não foi enviado.') === 0; })()")
    eq(ev(page, "[document.querySelector('#t-dock-input').value, document.querySelector('#he-dock').classList.contains('is-sending')]"), ["vai falhar", False])
    # he:ask é cancelável: nada é chamado e o texto fica
    ev(page, "void document.addEventListener('he:ask', function (e) { e.preventDefault(); }, { once: true })")
    page.focus("#t-dock-input")
    page.keyboard.press("Enter")
    eq(ev(page, "[T.calls.onAsk.length, document.querySelector('#t-dock-input').value]"), [2, "vai falhar"])
    # por código: HE.ask, setBusy, setPlaceholder, focus com texto
    ev(page, "void (HE.dock.onAsk = function (d) { return { ok: d.prompt }; })")
    eq(ev(page, "HE.ask({ prompt: '  Faça um resumo  ', action: 'resumo', context: { extra: 1 } }).then(function (r) { return [r.ok, T.last('he:ask').context.extra, T.last('he:ask').action]; })"), ["Faça um resumo", 1, "resumo"])
    eq(ev(page, "HE.ask('').then(function () { return 'resolveu'; }, function (e) { return e.message; })"), "Escreva o pedido.")
    ev(page, "void HE.dock.setBusy(true)")
    eq(ev(page, "[document.querySelector('#he-dock').classList.contains('is-sending'), document.querySelector('#t-dock-send').classList.contains('is-busy')]"), [True, True])
    ev(page, "void HE.dock.setBusy(false)")
    eq(ev(page, "document.querySelector('#he-dock').classList.contains('is-sending')"), False)
    ev(page, "void HE.dock.setPlaceholder('Peça algo sobre este item')")
    eq(ev(page, "document.querySelector('#t-dock-input').placeholder"), "Peça algo sobre este item")
    ev(page, "void HE.dock.focus('Texto pronto')")
    eq(ev(page, "[document.activeElement.id, document.querySelector('#t-dock-input').value]"), ["t-dock-input", "Texto pronto"])
    # botão declarativo que pede direto
    ev(page, "void (function () { var b = document.createElement('button'); b.id = 't-ask-btn'; b.type = 'button'; b.className = 'he-btn'; b.textContent = 'Pedir'; b.setAttribute('data-he-ask', 'Revise este texto.'); b.setAttribute('data-action', 'revisao'); document.querySelector('#t-bar').appendChild(b); })()")
    n = ev(page, "T.count('he:ask')")
    click(page, "#t-ask-btn")
    wait(page, "T.count('he:ask') === %d" % (n + 1))
    eq(ev(page, "[T.last('he:ask').prompt, T.last('he:ask').action]"), ["Revise este texto.", "revisao"])


def t_presence(page, mobile):
    eq(ev(page, "(function () { var p = HE.presence.get(); return [p.state, p.working, p.waiting]; })()"), ["working", 2, 0], "estado lido da marcação")
    states = "Array.from(document.querySelectorAll('[data-he-presence]')).map(function (b) { return b.getAttribute('data-state') + '/' + b.querySelector('.he-orb').getAttribute('data-state'); })"
    label = "document.querySelector('#t-presence [data-he-presence-label]').textContent"
    ev(page, "void HE.presence.set({ state: 'waiting', waiting: 1 })")
    eq(ev(page, states), ["waiting/waiting", "waiting/waiting"])
    eq(ev(page, label), "Aguardando você")
    eq(ev(page, "document.querySelector('#t-presence').getAttribute('aria-label')"), "A IA aguarda você em 1 pedido. Abrir atividade.")
    eq(ev(page, "T.last('he:presence').state"), "waiting")
    ev(page, "void HE.presence.set({ state: 'working', working: 3 })")
    eq(ev(page, states), ["working/working", "working/working"])
    eq(ev(page, label), "Trabalhando em 3")
    ev(page, "void HE.presence.set({ state: 'idle' })")
    eq(ev(page, states), ["idle/idle", "idle/idle"])
    eq(ev(page, label), "IA livre")
    eq(ev(page, "T.count('he:presence')"), 3)
    ev(page, "void HE.presence.set({ state: 'idle' })")
    eq(ev(page, "T.count('he:presence')"), 3, "sem mudança, sem evento")
    ev(page, "void HE.presence.set({ working: 1, label: 'Escrevendo o resumo' })")
    eq(ev(page, "[HE.presence.get().state, " + label + "]"), ["working", "Escrevendo o resumo"], "estado deduzido e rótulo próprio")
    # clique dispara he:presence-open e chama onOpen
    click(page, "#t-presence")
    eq(ev(page, "[T.count('he:presence-open'), T.calls.presenceOpen[0], T.last('he:presence-open').el.id]"), [1, "working", "t-presence"])
    # link de presença: navega só quando ninguém assume a abertura
    ev(page, "void (function () { var a = document.createElement('a'); a.id = 't-presence-link'; a.href = '#atividade'; a.setAttribute('data-he-presence', ''); a.textContent = 'Atividade'; document.querySelector('#t-bar').appendChild(a); })()")
    click(page, "#t-presence-link")
    eq(ev(page, "[location.hash, T.calls.presenceOpen.length]"), ["", 2], "com onOpen o link não navega")
    ev(page, "void (HE.presence.onOpen = null)")
    click(page, "#t-presence-link")
    eq(ev(page, "[location.hash, T.count('he:presence-open')]"), ["#atividade", 3], "sem onOpen o link navega")
    # lista de atividade a partir dos pedidos, sem buscar nada
    jobs = [
        {"id": 1, "title": "Resumo da semana", "step": "Lendo as notas", "status": "running", "meta": "Resumo", "tone": "violet"},
        {"id": 2, "title": "Relatório", "status": "queued"},
        {"id": 3, "title": "Limpar a pasta", "status": "approval", "href": "#pedido-3"},
        {"id": 4, "title": "Exportar <b>tudo</b>", "status": "failed", "step": "O arquivo não abriu."},
        {"id": 5, "title": "Importar", "status": "canceled"},
        {"id": 6, "title": "Traduzir", "status": "done"},
    ]
    got = ev(page, "(function () { var box = document.createElement('div'); box.innerHTML = HE.presence.renderActivity(arg); var q = function (s) { return box.querySelectorAll(s).length; }; return { act: q('.he-act'), jobs: q('.he-job'), groups: Array.from(box.querySelectorAll('.he-act__group h3')).map(function (h) { return h.textContent.trim(); }), running: box.querySelector('[data-job=\"1\"]').getAttribute('data-tone') + '/' + box.querySelector('[data-job=\"1\"] .he-job__step > span:last-child').textContent, queued: box.querySelector('[data-job=\"2\"] .he-job__step > span:last-child').textContent, link: box.querySelector('[data-job=\"3\"] a').getAttribute('href'), orb: box.querySelector('[data-job=\"3\"] .he-orb').getAttribute('data-state'), safe: q('.he-job b'), status: Array.from(box.querySelectorAll('.he-job')).map(function (j) { return j.getAttribute('data-status'); }) }; })()", jobs)
    eq(got["act"], 1)
    eq(got["jobs"], 6)
    eq(got["groups"], ["Aguardando você 1", "Em andamento 2", "Não concluídos", "Concluídos"])
    eq(got["running"], "violet/Lendo as notas")
    eq(got["queued"], "Na fila", "rótulo padrão do passo")
    eq(got["link"], "#pedido-3")
    eq(got["orb"], "waiting")
    eq(got["safe"], 0, "título escapado")
    eq(got["status"], ["approval", "running", "queued", "failed", "canceled", "done"])
    assert "he-empty" in ev(page, "HE.presence.renderActivity([])"), "lista vazia sem estado vazio"


def t_views(page, mobile):
    v = "HE.views('#t-views')"
    eq(ev(page, v + ".get()"), "quadro")
    eq(ev(page, "document.querySelector('#t-views').classList.contains('is-ready')"), True)
    before = ev(page, "document.querySelector('#t-views .he-views__thumb').style.transform")
    click(page, "#t-views [data-view='lista']")
    eq(ev(page, "[T.count('he:view'), T.last('he:view').view]"), [1, "lista"], "evento he:view")
    after = ev(page, "document.querySelector('#t-views .he-views__thumb').style.transform")
    assert after and after != before, "o indicador não se moveu (%r)" % after
    eq(after, ev(page, "'translateX(' + document.querySelector('#t-views [data-view=\"lista\"]').offsetLeft + 'px)'"), "indicador sob o item ativo")
    eq(ev(page, "Array.from(document.querySelectorAll('#t-views .he-views__item')).map(function (b) { return b.getAttribute('aria-pressed'); })"), ["false", "true", "false"])
    eq(ev(page, "localStorage.getItem('t.view')"), "lista")
    eq(ev(page, "new URL(location.href).searchParams.get('visao')"), "lista", "parâmetro na URL")
    # setas e API
    page.keyboard.press("ArrowRight")
    eq(ev(page, "[" + v + ".get(), document.activeElement.getAttribute('data-view')]"), ["grade", "grade"])
    ev(page, "void " + v + ".set('quadro')")
    eq(ev(page, "[T.count('he:view'), T.last('he:view').view]"), [3, "quadro"])
    ev(page, "void " + v + ".set('lista')")
    # na carga vale a escolha guardada
    reload(page)
    eq(ev(page, v + ".get()"), "lista", "visão guardada volta na carga")


def t_tabs(page, mobile):
    eq(ev(page, "[document.querySelector('#t-tabs').getAttribute('role'), document.querySelector('#t-tab-1').getAttribute('role'), document.querySelector('#t-p1').getAttribute('role')]"), ["tablist", "tab", "tabpanel"])
    eq(ev(page, "Array.from(document.querySelectorAll('#t-tabs .he-tab')).map(function (t) { return t.getAttribute('tabindex'); })"), ["0", "-1", "-1"])
    page.focus("#t-tab-1")
    page.keyboard.press("ArrowRight")
    eq(ev(page, "[document.activeElement.id, document.querySelector('#t-tab-2').getAttribute('aria-selected'), document.querySelector('#t-p1').hidden, document.querySelector('#t-p2').hidden]"), ["t-tab-2", "true", True, False])
    eq(ev(page, "[T.count('he:tab'), T.last('he:tab').tab]"), [1, "t-p2"])
    page.keyboard.press("End")
    eq(active_id(page), "t-tab-3")
    page.keyboard.press("ArrowRight")
    eq(active_id(page), "t-tab-1", "a seta dá a volta")
    page.keyboard.press("ArrowLeft")
    eq(active_id(page), "t-tab-3")
    page.keyboard.press("Home")
    eq(ev(page, "[document.activeElement.id, document.querySelector('#t-p1').hidden, document.querySelector('#t-p3').hidden]"), ["t-tab-1", False, True])
    click(page, "#t-tab-2")
    eq(ev(page, "[document.querySelector('#t-tab-2').classList.contains('is-active'), document.querySelector('#t-p2').hidden, document.querySelector('#t-p2').getAttribute('aria-labelledby')]"), [True, False, "t-tab-2"])
    ev(page, "void HE.tabs('#t-tabs').select('t-p3')")
    eq(ev(page, "document.querySelector('#t-tab-3').getAttribute('aria-selected')"), "true")


def t_chips(page, mobile):
    click(page, "#t-chips [data-value='texto']")
    click(page, "#t-chips [data-value='video']")
    eq(ev(page, "(function () { var d = T.last('he:chips'); return [T.count('he:chips'), d.name, d.values, d.value, d.chip.getAttribute('data-value')]; })()"), [2, "tipo", ["texto", "video"], ["texto", "video"], "video"])
    click(page, "#t-chips [data-value='texto']")
    eq(ev(page, "T.last('he:chips').values"), ["video"])
    click(page, "#t-chips [data-he-chip-clear]")
    eq(ev(page, "[T.last('he:chips').values, document.querySelectorAll('#t-chips [aria-pressed=\"true\"]').length]"), [[], 0])
    # grupo de escolha única
    click(page, "#t-chips-one [data-value='antigos']")
    eq(ev(page, "[T.last('he:chips').value, document.querySelector('#t-chips-one [data-value=\"recentes\"]').getAttribute('aria-pressed')]"), ["antigos", "false"])
    click(page, "#t-chips-one [data-value='antigos']")
    eq(ev(page, "T.last('he:chips').value"), None, "desmarcar o único")


def t_carousel(page, mobile):
    c = "HE.carousel('#t-carousel')"
    settled = "(function () { var t = document.querySelector('#t-carousel .he-carousel__track'); var s = t.querySelectorAll('.he-slide')[%s.index]; return Math.abs(t.scrollLeft - (s.offsetLeft - t.offsetLeft)) < 2; })()" % c
    dots = "Array.from(document.querySelectorAll('#t-phone .he-dots__dot')).map(function (d) { return d.classList.contains('is-active') ? 1 : 0; })"
    ev(page, "void document.querySelector('#t-carousel').scrollIntoView({ block: 'center' })")
    eq(ev(page, "[%s.index, %s.total]" % (c, c)), [0, 4])
    eq(ev(page, dots), [1, 0, 0, 0], "pontos")
    eq(ev(page, "[document.querySelector('#t-carousel [data-he-slide-count]').textContent, document.querySelector('#t-carousel [data-he-prev]').disabled, document.querySelector('#t-carousel').getAttribute('aria-label')]"), ["1/4", True, "Slide 1 de 4"])
    # seta da tela
    ev(page, "void document.querySelector('#t-carousel [data-he-next]').click()")
    eq(ev(page, c + ".index"), 1)
    eq(ev(page, "[T.last('he:slide').index, T.last('he:slide').id, T.last('he:slide').total]"), [1, "s2", 4])
    wait(page, settled)
    page.wait_for_timeout(120)
    eq(ev(page, "T.events.filter(function (e) { return e.name === 'he:slide'; }).map(function (e) { return e.detail.index; })"), [1], "o índice não oscila durante a rolagem")
    # setas do teclado, Home e End
    page.focus("#t-carousel")
    page.keyboard.press("ArrowRight")
    eq(ev(page, c + ".index"), 2)
    wait(page, settled)
    page.keyboard.press("ArrowLeft")
    eq(ev(page, c + ".index"), 1)
    wait(page, settled)
    page.keyboard.press("End")
    eq(ev(page, "[%s.index, document.querySelector('#t-carousel [data-he-next]').disabled]" % c), [3, True])
    wait(page, settled)
    page.keyboard.press("Home")
    eq(ev(page, c + ".index"), 0)
    wait(page, settled)
    # pontos
    ev(page, "void document.querySelectorAll('#t-phone .he-dots__dot')[2].click()")
    eq(ev(page, c + ".index"), 2)
    eq(ev(page, dots), [0, 0, 1, 0])
    eq(ev(page, "document.querySelector('#t-carousel [data-he-slide-count]').textContent"), "3/4")
    wait(page, settled)
    eq(ev(page, "Array.from(document.querySelectorAll('#t-carousel .he-slide')).map(function (s) { return s.getAttribute('aria-hidden'); })"), ["true", "true", "false", "true"])
    # rolagem feita pela pessoa atualiza o índice
    ev(page, "void (function () { var t = document.querySelector('#t-carousel .he-carousel__track'); t.scrollTo({ left: t.scrollWidth, behavior: 'auto' }); })()")
    wait(page, c + ".index === 3")
    eq(ev(page, dots), [0, 0, 0, 1])
    # API: go sem animação, prev e next
    ev(page, "void %s.go(0, true)" % c)
    eq(ev(page, "[%s.index, document.querySelector('#t-carousel .he-carousel__track').scrollLeft]" % c), [0, 0])
    ev(page, "void %s.next()" % c)
    eq(ev(page, c + ".index"), 1)
    wait(page, settled)
    ev(page, "void %s.prev()" % c)
    eq(ev(page, c + ".index"), 0)


def t_pins(page, mobile):
    ev(page, "void document.querySelector('#t-pinbox').scrollIntoView({ block: 'center' })")
    page.click("#t-pinbox", position={"x": 60, "y": 35})
    eq(page.locator("#t-pinbox .he-pin").count(), 0, "fora do modo marcar, clique não marca")
    ev(page, "void T.pins.start()")
    eq(ev(page, "[T.pins.active, document.querySelector('#t-pinbox').classList.contains('is-pinning')]"), [True, True])
    page.click("#t-pinbox", position={"x": 60, "y": 35})
    eq(page.locator("#t-pinbox .he-pin").count(), 1)
    pin = ev(page, "T.calls.pin[0]")
    assert pin["n"] == 1 and abs(pin["x"] - 25) < 1.5 and abs(pin["y"] - 25) < 1.5, "marcador fora do ponto clicado: %r" % pin
    eq(ev(page, "(function () { var p = document.querySelector('#t-pinbox .he-pin'); return [p.getAttribute('aria-label'), p.style.getPropertyValue('--x') === String(T.calls.pin[0].x), p.style.getPropertyValue('--y') === String(T.calls.pin[0].y), T.count('he:pin:add')]; })()"), ["Comentário 1", True, True, 1])
    ev(page, "void T.pins.stop()")
    ev(page, "void T.pins.add({ x: 50, y: 50, n: 7 })")
    eq(ev(page, "[document.querySelectorAll('#t-pinbox .he-pin').length, T.pins.next()]"), [2, 8])
    ev(page, "void T.pins.remove(7)")
    eq(page.locator("#t-pinbox .he-pin").count(), 1)
    ev(page, "void T.pins.clear()")
    eq(page.locator("#t-pinbox .he-pin").count(), 0)


def t_player(page, mobile):
    p = "HE.player('#t-player')"
    eq(ev(page, "[typeof %s.toggle, %s.duration, %s.time]" % (p, p, p)), ["function", 30, 0])
    eq(ev(page, "[document.querySelectorAll('#t-player .he-player__bar').length, document.querySelector('#t-player [data-he-timeline]').getAttribute('role'), document.querySelector('#t-player .he-player__big').getAttribute('aria-label')]"), [1, "slider", "Tocar"])
    ev(page, "void (%s.addPin({ n: 1, t: 10, tEnd: 15 }), %s.toggle(), %s.pause(), %s.seek(5))" % (p, p, p, p))
    eq(ev(page, "(function () { var pin = document.querySelector('#t-player .he-tl .he-pin'); return [pin.getAttribute('aria-label'), Math.round(parseFloat(pin.style.getPropertyValue('--t')) * 100), document.querySelectorAll('#t-player .he-tl__range').length]; })()"), ["Comentário 1 em 0:10", 33, 1])
    ev(page, "void %s.clearPins()" % p)
    eq(page.locator("#t-player .he-tl .he-pin").count(), 0)


def t_decide(page, mobile):
    eq(has_class(page, "he-has-decide"), False, "barra estática não reserva espaço")
    click(page, "#t-decide [data-he-decide='approve']")
    eq(ev(page, "[T.calls.approve.length, T.last('he:decide').decision]"), [1, "approve"])
    # pedir ajuste: folha com atalhos e texto livre
    click(page, "#t-decide [data-he-decide='adjust']")
    page.wait_for_selector(".he-drawer--sheet [data-he-adjust-form]")
    wait(page, "document.activeElement.id === 'he-adjust-text'")
    page.click("[data-he-adjust-send]")
    wait(page, "Array.from(document.querySelectorAll('.he-toast__text')).some(function (n) { return n.textContent === 'Diga o que ajustar ou escolha um atalho.'; })")
    eq(ev(page, "[HE.overlayOpen(), T.calls.adjust]"), [True, None], "sem conteúdo não envia")
    ev(page, "void document.querySelectorAll('#he-toasts .he-toast__x').forEach(function (b) { b.click(); })")
    wait(page, "!document.querySelector('#he-toasts .he-toast')")
    page.click("[data-he-adjust-form] .he-chip >> nth=1")
    page.fill("#he-adjust-text", "Trocar o título")
    page.click("[data-he-adjust-send]")
    wait(page, "T.calls.adjust && T.calls.adjust.length === 1")
    eq(ev(page, "T.calls.adjust[0]"), {"quick": ["Mais curto"], "text": "Trocar o título", "pins": []})
    closed(page)
    # negar: motivo em botão e em texto
    click(page, "#t-decide [data-he-decide='deny']")
    page.wait_for_selector(".he-drawer--sheet [data-he-deny-form]")
    page.click("[data-he-deny-form] .he-chip >> nth=1")
    page.fill("#he-deny-text", "já saiu")
    page.click("[data-he-deny-send]")
    wait(page, "T.calls.deny && T.calls.deny.length === 1")
    eq(ev(page, "T.calls.deny[0]"), {"reason": "Repetido. já saiu"})
    closed(page)
    # teclas A, J e N com a barra visível e ninguém digitando
    blur(page)
    page.keyboard.press("a")
    eq(ev(page, "T.calls.approve.length"), 2, "tecla A")
    page.keyboard.press("j")
    page.wait_for_selector("[data-he-adjust-form]")
    page.keyboard.press("Escape")
    closed(page)
    page.keyboard.press("n")
    page.wait_for_selector("[data-he-deny-form]")
    page.keyboard.press("Escape")
    closed(page)
    page.focus("#t-composer-input")
    page.keyboard.press("a")
    eq(ev(page, "T.calls.approve.length"), 2, "digitando, a tecla não decide")
    # callback com promessa deixa a barra ocupada; he:decide é cancelável
    ev(page, "void HE.decide('#t-decide', { onApprove: function () { return new Promise(function (res) { T.resApprove = res; }); } })")
    click(page, "#t-decide [data-he-decide='approve']")
    eq(ev(page, "document.querySelector('#t-decide').classList.contains('is-busy')"), True)
    ev(page, "void T.resApprove()")
    wait(page, "!document.querySelector('#t-decide').classList.contains('is-busy')")
    ev(page, "void (HE.decide('#t-decide', { onApprove: function () { T.call('approve'); } }), document.querySelector('#t-decide').addEventListener('he:decide', function (e) { e.preventDefault(); }, { once: true }))")
    click(page, "#t-decide [data-he-decide='approve']")
    eq(ev(page, "T.calls.approve.length"), 2, "decisão cancelada pelo evento")
    ev(page, "void HE.decide('#t-decide').setApprove(['Aprovar', ' e agendar'], 'qui 28/11 · 18h')")
    eq(ev(page, "[document.querySelector('#t-decide .he-decide__more').textContent, document.querySelector('#t-decide [data-he-decide=\"approve\"] small').textContent]"), [" e agendar", "qui 28/11 · 18h"])


def drag(page, src, x, y, drop=True):
    a = box(page, src)
    page.mouse.move(a["cx"], a["cy"])
    page.mouse.down()
    page.mouse.move(a["cx"] + 10, a["cy"] + 8, steps=3)
    page.mouse.move(x, y, steps=12)
    if drop:
        page.mouse.up()


def t_dnd(page, mobile):
    ev(page, "void window.scrollTo(0, document.querySelector('#t-board').getBoundingClientRect().top + window.pageYOffset - 230)")
    order = "['t-col-a', 't-col-b', 't-col-c'].map(function (id) { return Array.from(document.querySelectorAll('#' + id + ' > .t-item')).map(function (n) { return n.id; }).join(','); })"
    eq(ev(page, order), ["t-item-1,t-item-2", "t-item-3", ""])
    # arrasto por ponteiro entre duas colunas
    b = box(page, "#t-col-b")
    drag(page, "#t-item-1", b["cx"], b["y"] + b["h"] - 24, drop=False)
    eq(ev(page, "[document.documentElement.classList.contains('he-dragging'), document.querySelectorAll('.he-drag-ghost').length, document.querySelector('.he-drag-ph').parentNode.id, document.querySelector('#t-col-b').classList.contains('he-drop-on'), document.querySelector('#t-item-1').classList.contains('he-drag-src')]"),
       [True, 1, "t-col-b", True, True], "estado durante o arrasto")
    page.mouse.up()
    wait(page, "T.calls.drop && T.calls.drop.length === 1")
    eq(ev(page, "T.calls.drop[0]"), {"id": "t-item-1", "from": "t-col-a", "to": "t-col-b", "index": 1, "pointer": "mouse"})
    eq(ev(page, order), ["t-item-2", "t-item-3,t-item-1", ""])
    eq(ev(page, "[document.documentElement.classList.contains('he-dragging'), document.querySelectorAll('.he-drag-ghost, .he-drag-ph, .he-drop-on, .he-drag-src').length, T.count('he:drop')]"), [False, 0, 1], "limpeza depois de soltar")
    # revert devolve ao ponto de origem
    ev(page, "void T.drop.revert()")
    eq(ev(page, order), ["t-item-1,t-item-2", "t-item-3", ""], "revert")
    # reordenar dentro da coluna
    a2 = box(page, "#t-item-2")
    drag(page, "#t-item-1", a2["cx"], a2["y"] + a2["h"] - 4)
    wait(page, "T.calls.drop.length === 2")
    eq(ev(page, "[T.calls.drop[1].to, T.calls.drop[1].index]"), ["t-col-a", 1])
    eq(ev(page, order), ["t-item-2,t-item-1", "t-item-3", ""])
    # zona travada: mostra que não aceita e soltar ali cancela
    c = box(page, "#t-col-c")
    drag(page, "#t-item-3", c["cx"], c["cy"], drop=False)
    eq(ev(page, "[document.querySelector('#t-col-c').classList.contains('he-drop-no'), document.querySelector('.he-drag-ph').parentNode.id]"), [True, "t-col-b"])
    page.mouse.up()
    wait(page, "T.calls.dropCancel && T.calls.dropCancel.length === 1")
    eq(ev(page, order), ["t-item-2,t-item-1", "t-item-3", ""])
    eq(ev(page, "T.calls.drop.length"), 2)
    # Esc cancela no meio do arrasto
    drag(page, "#t-item-2", b["cx"], b["cy"], drop=False)
    page.keyboard.press("Escape")
    eq(ev(page, "[document.documentElement.classList.contains('he-dragging'), T.calls.dropCancel.length]"), [False, 2])
    page.mouse.up()
    eq(ev(page, order), ["t-item-2,t-item-1", "t-item-3", ""])
    # teclado: Alt + setas move dentro da zona e entre zonas, pulando a travada
    page.wait_for_timeout(80)
    page.focus("#t-item-1")
    page.keyboard.press("Alt+ArrowUp")
    eq(ev(page, order), ["t-item-1,t-item-2", "t-item-3", ""])
    eq(ev(page, "[T.calls.drop[2].pointer, T.calls.drop[2].index, document.activeElement.id]"), ["keyboard", 0, "t-item-1"])
    page.keyboard.press("Alt+ArrowRight")
    eq(ev(page, order), ["t-item-2", "t-item-1,t-item-3", ""])
    page.keyboard.press("Alt+ArrowRight")
    eq(ev(page, order), ["t-item-2", "t-item-1,t-item-3", ""], "zona travada não recebe pelo teclado")
    wait(page, "Array.from(document.querySelectorAll('.he-sr[aria-live]')).some(function (n) { return n.textContent === 'Movido para Feito, posição 1.'; })")
    # onDrop com promessa que falha: o item volta sozinho e sai o aviso
    ev(page, "void T.board.destroy()")
    ev(page, "void (T.board2 = HE.dnd('#t-board', { keyboard: false, onDrop: function () { return Promise.reject(new Error('Sem permissão.')); } }))")
    a = box(page, "#t-col-a")
    drag(page, "#t-item-3", a["cx"], a["y"] + a["h"] - 20)
    wait(page, "(function () { var n = document.querySelector('.he-toast--error .he-toast__text'); return !!n && n.textContent.indexOf('Não deu para mover.') === 0; })()")
    eq(ev(page, order), ["t-item-2", "t-item-1,t-item-3", ""], "falha devolve o item")
    ev(page, "void T.board2.destroy()")


def t_layer(page, mobile):
    ev(page, "void document.querySelector('#t-layer-link').scrollIntoView({ block: 'center' })")
    y0 = ev(page, "window.pageYOffset")
    assert y0 > 300, "a página de teste precisa estar rolada (%r)" % y0
    page.click("#t-layer-link")
    page.wait_for_selector(".he-layer[role=dialog]")
    eq(ev(page, "[document.documentElement.classList.contains('he-layer-open'), document.documentElement.classList.contains('he-lock'), HE.overlayOpen()]"), [True, True, True])
    eq(ev(page, "[document.querySelector('.he-layer__title').textContent, document.querySelector('.he-layer').getAttribute('aria-label'), document.querySelector('.he-layer [data-he-layer-root] h1').textContent]"), ["Detalhe 42", "Detalhe 42", "Detalhe 42"])
    eq(ev(page, "[document.querySelector('[data-he-layer-direct]').getAttribute('href'), document.querySelector('[data-he-layer-direct]').hidden]"), ["#detalhe-42", False])
    eq(ev(page, "document.querySelector('#t-layer-tabs').getAttribute('role')"), "tablist", "HE.init no conteúdo da camada")
    eq(ev(page, "[location.hash, T.count('he:layer-request'), T.count('he:layer-open'), T.last('he:layer-request').href, T.last('he:layer-request').el.id]"), ["", 1, 1, "#detalhe-42", "t-layer-link"])
    wait(page, "document.querySelector('.he-layer').contains(document.activeElement)")
    # foco preso entre a camada e o campo de pedido
    for _ in range(8):
        page.keyboard.press("Tab")
        assert ev(page, "document.querySelector('.he-layer').contains(document.activeElement) || document.querySelector('#he-dock').contains(document.activeElement)"), "o foco saiu da camada"
    page.keyboard.press("Escape")
    if ev(page, "document.documentElement.classList.contains('he-layer-open')"):
        page.keyboard.press("Escape")   # o primeiro Esc só tirou o foco do campo de pedido
    wait(page, "!document.documentElement.classList.contains('he-layer-open')")
    eq(ev(page, "window.pageYOffset"), y0, "rolagem preservada")
    eq(active_id(page), "t-layer-link", "foco devolvido")
    eq(ev(page, "[T.calls.layerClose[0], T.count('he:layer-close'), HE.layer.current]"), ["esc", 1, None])
    closed(page)
    wait(page, "!document.querySelector('.he-layer')")
    eq(has_class(page, "he-lock"), False)
    # fecha pelo botão de voltar, com a rolagem no mesmo ponto
    page.click("#t-layer-link")
    page.wait_for_selector(".he-layer")
    page.click("[data-he-layer-close]")
    wait(page, "!document.documentElement.classList.contains('he-layer-open')")
    eq(ev(page, "[window.pageYOffset, T.calls.layerClose[1]]"), [y0, "button"])
    closed(page)
    # troca de conteúdo com a camada aberta e fechamento por código
    page.click("#t-layer-link")
    page.wait_for_selector(".he-layer")
    ev(page, "void (function () { var n = document.createElement('p'); n.id = 't-layer-node'; n.textContent = 'Outro conteúdo'; HE.layer.open({ title: 'Outro', body: n, onClose: function (r) { T.call('layerClose2', r); } }); })()")
    eq(ev(page, "[document.querySelector('.he-layer__title').textContent, document.querySelectorAll('.he-layer').length, !!document.querySelector('.he-layer #t-layer-node'), T.calls.layerClose[2], document.querySelector('[data-he-layer-direct]').hidden]"), ["Outro", 1, True, "replace", True])
    ev(page, "void HE.layer.close()")
    wait(page, "!document.documentElement.classList.contains('he-layer-open')")
    eq(ev(page, "[T.calls.layerClose2[0], window.pageYOffset]"), ["api", y0])
    closed(page)
    # link que ninguém assume navega normalmente
    page.click("#t-layer-plain")
    eq(ev(page, "[location.hash, HE.overlayOpen(), T.last('he:layer-request').id]"), ["#sem-camada", False, "99"])


def t_menu(page, mobile):
    click(page, "#t-menu-btn")
    page.wait_for_selector(".he-menu[role=menu]")
    eq(ev(page, "[document.querySelectorAll('.he-menu [role=menuitem]').length, document.querySelector('#t-menu-btn').getAttribute('aria-expanded'), document.querySelector('.he-menu').getAttribute('aria-label')]"), [3, "true", "Mais ações"])
    eq(ev(page, "[document.querySelector('.he-menu small').textContent, document.querySelectorAll('.he-menu [data-tone=\"orange\"]').length]"), ["Cria uma cópia", 1])
    assert ev(page, "(function () { var r = document.querySelector('.he-menu').getBoundingClientRect(); return r.left >= 0 && r.right <= window.innerWidth + 1 && r.top >= 0; })()"), "menu fora da tela"
    item = "Array.from(document.querySelectorAll('.he-menu [role=menuitem]')).indexOf(document.activeElement)"
    wait(page, item + " === 0")
    page.keyboard.press("ArrowDown")
    eq(ev(page, item), 1)
    page.keyboard.press("ArrowDown")
    page.keyboard.press("ArrowDown")
    eq(ev(page, item), 0, "a seta dá a volta")
    page.keyboard.press("End")
    eq(ev(page, item), 2)
    page.keyboard.press("ArrowUp")
    eq(ev(page, item), 1)
    page.keyboard.press("Enter")
    wait(page, "T.calls.menu && T.calls.menu[0] === 'arquivar'")
    wait(page, "!document.querySelector('.he-menu')")
    eq(ev(page, "[document.activeElement.id, document.querySelector('#t-menu-btn').getAttribute('aria-expanded')]"), ["t-menu-btn", "false"])
    # Esc fecha e devolve o foco
    click(page, "#t-menu-btn")
    page.wait_for_selector(".he-menu:not(.is-closing)")
    wait(page, item + " === 0")
    page.keyboard.press("Escape")
    wait(page, "!document.querySelector('.he-menu')")
    eq(active_id(page), "t-menu-btn")
    # clique fora e segundo clique na âncora fecham
    click(page, "#t-menu-btn")
    page.wait_for_selector(".he-menu:not(.is-closing)")
    spot = ev(page, "(function () { var r = document.querySelector('.he-menu').getBoundingClientRect(), x = window.innerWidth - 6, y = 6; return { x: x, y: y, outside: x > r.right || y < r.top }; })()")
    assert spot["outside"], "o ponto de teste caiu dentro do menu"
    page.mouse.click(spot["x"], spot["y"])
    wait(page, "!document.querySelector('.he-menu')")
    click(page, "#t-menu-btn")
    page.wait_for_selector(".he-menu:not(.is-closing)")
    page.click("#t-menu-btn")
    wait(page, "!document.querySelector('.he-menu')")
    eq(ev(page, "T.calls.menu.length"), 1)
    # botão Novo: abre os itens declarados e avisa por he:new
    click(page, "#t-new")
    if mobile:
        page.wait_for_selector(".he-drawer--sheet .he-newgrid [role=menuitem]")
        page.click(".he-newgrid [role=menuitem] >> nth=1")
    else:
        page.wait_for_selector(".he-menu [role=menuitem]")
        page.click(".he-menu [role=menuitem] >> nth=1")
    wait(page, "T.calls.new && T.calls.new[0] === 'tarefa'")
    eq(ev(page, "[T.count('he:new'), T.last('he:new').key]"), [1, "tarefa"])
    closed(page)
    wait(page, "!document.querySelector('.he-menu')")
    # sem itens declarados só dispara he:new
    ev(page, "void (HE.newMenu.items = [])")
    click(page, "#t-new")
    eq(ev(page, "[T.count('he:new'), T.last('he:new').key === undefined, T.last('he:new').el.id, !!document.querySelector('.he-menu'), HE.overlayOpen()]"), [2, True, "t-new", False, False])


def t_switch(page, mobile):
    click(page, "#t-switch")
    eq(ev(page, "[document.querySelector('#t-switch').getAttribute('aria-checked'), T.count('he:switch'), T.last('he:switch').checked, T.last('he:switch').name]"), ["true", 1, True, "email"])
    page.focus("#t-switch")
    page.keyboard.press("Space")
    eq(ev(page, "[document.querySelector('#t-switch').getAttribute('aria-checked'), T.count('he:switch')]"), ["false", 2], "Espaço no botão alterna uma vez")
    # elemento que não é botão: Espaço e clique
    page.focus("#t-switch-span")
    page.keyboard.press("Space")
    eq(ev(page, "[document.querySelector('#t-switch-span').getAttribute('aria-checked'), T.count('he:switch'), T.last('he:switch').el.id]"), ["false", 3, "t-switch-span"])
    click(page, "#t-switch-span")
    eq(ev(page, "document.querySelector('#t-switch-span').getAttribute('aria-checked')"), "true")
    # desligado não alterna; API
    ev(page, "void (document.querySelector('#t-switch').setAttribute('aria-disabled', 'true'), document.querySelector('#t-switch').click())")
    eq(ev(page, "document.querySelector('#t-switch').getAttribute('aria-checked')"), "false")
    ev(page, "void (document.querySelector('#t-switch').removeAttribute('aria-disabled'), HE.switch.set('#t-switch', true), HE.switch.set('#t-switch', true))")
    eq(ev(page, "[document.querySelector('#t-switch').getAttribute('aria-checked'), T.count('he:switch')]"), ["true", 5])


def t_sidebar(page, mobile):
    eq(ev(page, "[T_NAV_AT_HEAD, HE.sidebar.state()]"), [False, {"open": False, "collapsed": False}])
    if mobile:
        # celular: gaveta com html.he-nav-open, fecha com Esc e no clique fora
        click(page, "#t-side-toggle")
        eq(ev(page, "[document.documentElement.classList.contains('he-nav-open'), document.documentElement.classList.contains('he-nav-collapsed'), document.querySelector('#t-side-toggle').getAttribute('aria-expanded')]"), [True, False, "true"])
        eq(active_id(page), "t-side-first", "foco entra no menu")
        eq(ev(page, "T.last('he:sidebar')"), {"open": True, "collapsed": False})
        page.keyboard.press("Escape")
        eq(ev(page, "[document.documentElement.classList.contains('he-nav-open'), document.querySelector('#t-side-toggle').getAttribute('aria-expanded'), document.activeElement.id]"), [False, "false", "t-side-toggle"])
        click(page, "#t-side-toggle")
        eq(has_class(page, "he-nav-open"), True)
        page.mouse.click(360, 420)
        eq(has_class(page, "he-nav-open"), False, "clique no fundo fecha")
        ev(page, "void HE.sidebar.toggle()")
        eq(has_class(page, "he-nav-open"), True)
        ev(page, "void HE.sidebar.close()")
        eq(has_class(page, "he-nav-open"), False)
        eq(ev(page, "localStorage.getItem('he.nav.collapsed')"), None, "no celular nada é guardado")
    else:
        # computador: recolhe com html.he-nav-collapsed, guardado em localStorage
        click(page, "#t-side-toggle")
        eq(ev(page, "[document.documentElement.classList.contains('he-nav-collapsed'), document.documentElement.classList.contains('he-nav-open'), localStorage.getItem('he.nav.collapsed'), document.querySelector('#t-side-toggle').getAttribute('aria-expanded')]"), [True, False, "1", "false"])
        eq(ev(page, "T.last('he:sidebar')"), {"open": False, "collapsed": True})
        reload(page)
        eq(ev(page, "[T_NAV_AT_HEAD, document.documentElement.classList.contains('he-nav-collapsed'), document.querySelector('#t-side-toggle').getAttribute('aria-expanded')]"), [True, True, "false"], "recolhido volta na carga")
        click(page, "#t-side-toggle")
        eq(ev(page, "[document.documentElement.classList.contains('he-nav-collapsed'), localStorage.getItem('he.nav.collapsed'), document.querySelector('#t-side-toggle').getAttribute('aria-expanded')]"), [False, "0", "true"])
        ev(page, "void HE.sidebar.toggle()")
        eq(has_class(page, "he-nav-collapsed"), True)
    ev(page, "void HE.sidebar.collapse(true)")
    eq(ev(page, "[document.documentElement.classList.contains('he-nav-collapsed'), localStorage.getItem('he.nav.collapsed')]"), [True, "1"])
    ev(page, "void HE.sidebar.collapse(false)")
    eq(ev(page, "[document.documentElement.classList.contains('he-nav-collapsed'), localStorage.getItem('he.nav.collapsed')]"), [False, "0"])


SIDE_FILL = """void (function () {
  var box = document.querySelector('#t-side-many'), html = '';
  for (var i = 1; i <= 30; i++) html += '<a class="he-side__item" href="#s' + i + '" id="t-side-' + i + '" data-he-tip="Seção ' + i + '"><span class="he-side__icon"><svg class="he-i" aria-hidden="true"><use href="#he-i-star"/></svg></span><span class="he-side__text">Seção ' + i + '</span></a>';
  box.innerHTML = html;
})()"""
SIDE_BOX = "(function (n) { var r = n.getBoundingClientRect(); return { top: r.top, bottom: r.bottom, w: r.width, h: r.height, cy: Math.round(r.top + r.height / 2) }; })(document.querySelector(arg))"
SIDE_TIP = "(function (n) { var c = getComputedStyle(n, '::after'); return [c.content, c.position, c.top, c.left]; })(document.querySelector(arg))"


def t_sidebar_collapsed(page, mobile):
    """Menu recolhido com mais itens do que cabem na janela: nada some, a lista rola e o botão de expandir fica à vista."""
    ev(page, SIDE_FILL)
    page.evaluate("() => document.body.classList.add('he-tips')")
    if mobile:
        # na gaveta do celular o menu não recolhe: o nome de cada item continua escrito
        ev(page, "void HE.sidebar.collapse(true)")
        ev(page, "void HE.sidebar.open()")
        eq(ev(page, SIDE_BOX, "#t-side-first .he-side__text")["w"] > 20, True, "nome visível na gaveta")
        ev(page, "void HE.sidebar.close()")
        return
    # aberto: o nome está escrito e a dica do item não aparece, nem com he-tips no body
    page.hover("#t-side-gear")
    eq(ev(page, SIDE_TIP, "#t-side-gear")[0], "none", "dica com o menu aberto")
    eq(ev(page, SIDE_BOX, "#t-side-first .he-side__text")["w"] > 20, True, "nome visível com o menu aberto")
    page.mouse.move(700, 80)
    click(page, "#t-side-foot")
    eq(has_class(page, "he-nav-collapsed"), True)
    # a lista rola dentro do menu e o rodapé fica dentro da janela, com o botão por cima de tudo
    eq(ev(page, "(function (n) { return n.scrollHeight > n.clientHeight + 100 && n.scrollWidth <= n.clientWidth; })(document.querySelector('#t-side'))"), True, "a lista rola só na vertical")
    foot = ev(page, SIDE_BOX, "#t-side-foot")
    eq(foot["bottom"] <= ev(page, "innerHeight"), True, "botão de expandir dentro da janela")
    eq(ev(page, "(function (n) { var r = n.getBoundingClientRect(); return n.contains(document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2)); })(document.querySelector('#t-side-foot'))"), True, "botão de expandir alcançável")
    # item com ícone: o ícone fica e o nome sai da vista sem sair da árvore de acessibilidade
    eq(ev(page, SIDE_BOX, "#t-side-first .he-side__icon")["w"] > 16, True, "ícone visível")
    eq(ev(page, SIDE_BOX, "#t-side-first .he-side__text")["w"] <= 1, True, "nome fora da vista")
    eq(ev(page, "getComputedStyle(document.querySelector('#t-side-first .he-side__text')).display !== 'none'"), True, "nome continua para o leitor de tela")
    # item sem ícone: sobra a inicial, em maiúscula
    plain = ev(page, SIDE_BOX, "#t-side-plain .he-side__text")
    eq(4 < plain["w"] < 20 and plain["h"] > 10, True, "inicial do item sem ícone")
    eq(ev(page, "(function (c) { return [c.fontSize, c.textTransform]; })(getComputedStyle(document.querySelector('#t-side-plain .he-side__text'), '::first-letter'))"), ["14px", "uppercase"])
    # a dica é fixa na janela, ao lado do menu e na altura do item, inclusive depois de rolar a lista
    page.hover("#t-side-gear")
    cy = ev(page, SIDE_BOX, "#t-side-gear")["cy"]
    eq(ev(page, SIDE_TIP, "#t-side-gear"), ['"Ajustes"', "fixed", "%dpx" % cy, "68px"], "dica do item")
    ev(page, "void (document.querySelector('#t-side').scrollTop = 10)")   # pouco, para o ponteiro continuar sobre o item
    wait(page, "document.querySelector('#t-side-gear').style.getPropertyValue('--he-tip-y') === '%dpx'" % (cy - 10))
    eq(ev(page, SIDE_TIP, "#t-side-gear")[2], "%dpx" % (cy - 10), "a dica acompanha a rolagem")
    # pelo teclado: o foco no último item leva a lista até ele e a dica acompanha
    page.mouse.move(700, 80)
    page.evaluate("() => document.querySelector('#t-side-30').focus({ focusVisible: true })")
    last = ev(page, SIDE_BOX, "#t-side-30")
    eq(last["top"] >= 0 and last["bottom"] <= foot["top"] + 1, True, "item em foco dentro da lista")
    eq(ev(page, "document.querySelector('#t-side-30').style.getPropertyValue('--he-tip-y')"), "%dpx" % last["cy"], "altura da dica no foco")
    # o botão do rodapé tem a dica da ação e expande de volta
    page.hover("#t-side-foot")
    eq(ev(page, SIDE_TIP, "#t-side-foot")[0], '"Expandir menu"', "dica do botão")
    page.click("#t-side-foot")
    eq(ev(page, "[document.documentElement.classList.contains('he-nav-collapsed'), document.querySelector('#t-side-foot').getAttribute('aria-expanded')]"), [False, "true"], "expande de volta")
    eq(ev(page, SIDE_BOX, "#t-side-first .he-side__text")["w"] > 20, True, "nome de volta")


def t_shortcuts(page, mobile):
    ev(page, "void HE.shortcuts.add('Teste', ['T', 'X'], 'Atalho de teste')")
    blur(page)
    page.keyboard.press("?")
    page.wait_for_selector(".he-drawer--sheet .he-keys")
    rows = ev(page, "Array.from(document.querySelectorAll('.he-keys__row')).map(function (r) { return r.firstChild.textContent + '=' + Array.from(r.querySelectorAll('kbd')).map(function (k) { return k.textContent; }).join('+'); })")
    for want in ["Pedir à IA=/", "Buscar e agir=Ctrl+K", "Mostrar estes atalhos=?", "Aprovar=A", "Trocar de slide=←+→", "Mover o item em foco=Alt+setas", "Atalho de teste=T+X"]:
        assert want in rows, "folha de atalhos sem %r (%r)" % (want, rows)
    eq(ev(page, "document.querySelector('.he-drawer--sheet .he-drawer__title').textContent"), "Atalhos de teclado")
    assert "Teste" in ev(page, "Array.from(document.querySelectorAll('.he-keys__group h3')).map(function (h) { return h.textContent; })")
    page.keyboard.press("?")
    eq(page.locator(".he-layers .he-drawer:not(.is-closing)").count(), 1, "a tecla não abre duas folhas")
    page.keyboard.press("Escape")
    closed(page)
    # botão declarativo devolve o foco
    click(page, "#t-keys-open")
    page.wait_for_selector(".he-keys")
    page.keyboard.press("Escape")
    closed(page)
    eq(active_id(page), "t-keys-open")
    # digitando, a tecla é só texto
    page.focus("#t-composer-input")
    page.keyboard.press("?")
    eq(ev(page, "[HE.overlayOpen(), document.querySelector('#t-composer-input').value]"), [False, "?"])


def t_steps(page, mobile):
    marks = "Array.from(document.querySelectorAll('#t-steps .he-steps__step')).map(function (s) { return (s.classList.contains('is-done') ? 'd' : '') + (s.classList.contains('is-current') ? 'c' : '') + (s.getAttribute('aria-current') === 'step' ? '*' : ''); })"
    eq(ev(page, marks), ["", "", "", "", "", ""])
    ev(page, "void HE.steps('#t-steps', 2)")
    eq(ev(page, marks), ["d", "d", "c*", "", "", ""])
    eq(ev(page, "HE.steps('#t-steps').get()"), 2)
    ev(page, "void HE.steps('#t-steps').set(4)")
    eq(ev(page, marks), ["d", "d", "d", "d", "c*", ""])
    ev(page, "void HE.steps(document.querySelector('#t-steps'), 6)")
    eq(ev(page, marks), ["d", "d", "d", "d", "d", "d"], "todos feitos")
    ev(page, "void HE.steps('#t-steps', 0)")
    eq(ev(page, marks), ["c*", "", "", "", "", ""])
    eq(ev(page, "HE.steps('#nao-existe', 1)"), None)
    # declarativo: data-he-steps="índice" vale no HE.init
    ev(page, "void (document.querySelector('#t-steps').setAttribute('data-he-steps', '3'), HE.init(document.querySelector('#s-decide')))")
    eq(ev(page, marks), ["d", "d", "d", "c*", "", ""])


def t_stamp(page, mobile):
    ev(page, "void (T.stamp = HE.stamp('#t-stamp-target', { kind: 'ok', text: 'Aprovado', duration: 400 }))")
    eq(ev(page, "(function () { var s = document.querySelector('#t-stamp-target > .he-stamp'); return [s.getAttribute('data-kind') === 'ok', s.classList.contains('he-stamp--pop'), s.textContent, s.querySelector('use').getAttribute('href'), T.stamp.el === s]; })()"), [True, True, "Aprovado", "#he-i-check", True])
    wait(page, "!document.querySelector('#t-stamp-target .he-stamp')")
    # tipos, texto padrão e ícone próprio
    eq(ev(page, "(function () { var a = HE.stamp('#t-stamp-target', { kind: 'adjust', duration: 5000 }), d = HE.stamp(document.querySelector('#t-stamp-target'), { kind: 'denied', icon: 'lock', duration: 5000 }); var out = [a.el.className, a.el.getAttribute('data-kind'), a.el.textContent, d.el.getAttribute('data-kind'), d.el.textContent, d.el.querySelector('use').getAttribute('href')]; a.remove(); d.remove(); return out; })()"),
       ["he-stamp he-stamp--pop", "adjust", "Ajuste pedido", "denied", "Negado", "#he-i-lock"])
    wait(page, "!document.querySelector('#t-stamp-target .he-stamp')")
    eq(ev(page, "HE.stamp('#nao-existe', { text: 'x' })"), None)


def t_composer(page, mobile):
    inp = "document.querySelector('#t-composer-input')"
    ev(page, "void document.querySelector('#t-composer').scrollIntoView({ block: 'center' })")
    eq(ev(page, "document.querySelector('#t-composer').classList.contains('is-empty')"), True)
    # clique no espaço vazio da caixa leva ao campo
    ev(page, "void document.querySelector('#t-composer-box').dispatchEvent(new MouseEvent('mousedown', { bubbles: true, cancelable: true }))")
    eq(active_id(page), "t-composer-input")
    page.keyboard.type("primeira linha")
    eq(ev(page, "document.querySelector('#t-composer').classList.contains('is-empty')"), False)
    h1 = ev(page, inp + ".getBoundingClientRect().height")
    # Shift+Enter quebra linha e a altura acompanha o texto
    for i in range(4):
        page.keyboard.press("Shift+Enter")
        page.keyboard.type("mais uma linha")
    h2 = ev(page, inp + ".getBoundingClientRect().height")
    assert h2 > h1 + 20, "a altura não acompanhou o texto (%r, %r)" % (h1, h2)
    eq(ev(page, "T.calls.composerSubmit"), None)
    # Enter envia (submit do próprio formulário)
    page.keyboard.press("Enter")
    eq(ev(page, "T.calls.composerSubmit.length"), 1)
    assert ev(page, "T.calls.composerSubmit[0].split('\\n').length") == 5
    # texto trocado por código também ajusta a altura e o estado vazio
    ev(page, "void (" + inp + ".value = '')")
    h3 = ev(page, inp + ".getBoundingClientRect().height")
    assert h3 < h2 - 20, "a altura não voltou (%r, %r)" % (h2, h3)
    eq(ev(page, "document.querySelector('#t-composer').classList.contains('is-empty')"), True)
    page.keyboard.press("Enter")
    eq(ev(page, "T.calls.composerSubmit.length"), 1, "campo vazio não envia")
    eq(ev(page, "[HE.composer.isSendKey({ key: 'Enter' }), HE.composer.isSendKey({ key: 'Enter', shiftKey: true }), HE.composer.isSendKey({ key: 'a' }), HE.composer.isSendKey({ key: 'Enter', isComposing: true })]"), [True, False, False, False])
    eq(ev(page, "typeof HE.composer.sync + typeof HE.composer.enhance"), "functionfunction")


def t_time(page, mobile):
    eq(ev(page, "document.querySelector('#t-time').textContent"), "amanhã · 18h")
    assert ev(page, "document.querySelector('#t-time').title.length > 5"), "data por extenso no title"
    eq(ev(page, "document.querySelector('#t-time-rel').textContent"), "há 2 h")
    eq(ev(page, "[HE.fmtDate(new Date().toISOString(), 'day'), HE.fmtDate(new Date(Date.now() - 86400000).toISOString(), 'day'), HE.fmtDate('', 'day'), HE.fmtDate('texto', 'day')]"), ["hoje", "ontem", "", "texto"])
    eq(ev(page, "HE.fmtDate(new Date(2020, 5, 15, 9, 30).toISOString())"), "seg 15/06/20 · 9h30")
    eq(ev(page, "HE.fmtDate(new Date(2020, 5, 15, 9, 30).toISOString(), 'time')"), "9h30")
    eq(ev(page, "HE.fmtDate(new Date(Date.now() - 5 * 60000).toISOString(), 'rel')"), "há 5 min")
    # textos trocáveis por HE.config
    eq(ev(page, "(HE.config({ labels: { dateToday: 'Hoje mesmo', presenceIdle: 'Livre' } }), [HE.fmtDate(new Date().toISOString(), 'day'), HE.labels.presenceIdle, HE.labels.undo])"), ["Hoje mesmo", "Livre", "Desfazer"])
    ev(page, "void HE.presence.set({ state: 'idle' })")
    eq(ev(page, "document.querySelector('#t-presence [data-he-presence-label]').textContent"), "Livre")


def t_glow(page, mobile):
    ev(page, "void HE.glow('#t-glow', true, 'A IA está escrevendo')")
    eq(ev(page, "(function () { var g = document.querySelector('#t-glow'); return [g.classList.contains('he-glow'), g.getAttribute('data-he-glow'), g.getAttribute('aria-busy')]; })()"), [True, "A IA está escrevendo", "true"])
    ev(page, "void HE.glow(document.querySelector('#t-glow'), true)")
    eq(ev(page, "document.querySelector('#t-glow').getAttribute('data-he-glow')"), "IA trabalhando")
    ev(page, "void HE.glow('#t-glow', false)")
    eq(ev(page, "(function () { var g = document.querySelector('#t-glow'); return [g.classList.contains('he-glow'), g.getAttribute('data-he-glow'), g.getAttribute('aria-busy')]; })()"), [False, None, None])
    ev(page, "void HE.glow('#nao-existe', true)")


def t_init(page, mobile):
    html = ("<div class='he-tabs' data-he-tabs id='t-dyn-ID'><button type='button' class='he-tab' aria-controls='t-dyn-ID-p'>A</button></div>"
            "<div class='he-tabpanel' id='t-dyn-ID-p'>A</div><time data-he-time datetime='2020-06-15T09:30:00'></time>"
            "<div class='he-views' data-he-views><button type='button' class='he-views__item' data-view='a'>A</button><button type='button' class='he-views__item' data-view='b'>B</button></div>"
            "<div class='he-chips' data-he-chips='multi'><button type='button' class='he-chip is-active'>Um</button></div>"
            "<textarea class='he-composer__input'></textarea>")
    add = "(function (id) { var d = document.createElement('div'); d.id = 't-box-' + id; d.innerHTML = arg.split('ID').join(id); document.querySelector('#s-composer').appendChild(d); return d; })"
    ev(page, "void " + add + "('um')", html)
    eq(ev(page, "document.querySelector('#t-dyn-um').getAttribute('role')"), None, "conteúdo novo só liga com HE.init")
    ev(page, "void HE.init(document.querySelector('#t-box-um'))")
    eq(ev(page, "[document.querySelector('#t-dyn-um').getAttribute('role'), document.querySelector('#t-box-um time').textContent.length > 4, !!document.querySelector('#t-box-um .he-views__thumb'), document.querySelector('#t-box-um .he-chip').getAttribute('aria-pressed'), document.querySelector('#t-box-um textarea')._heComposer]"),
       ["tablist", True, True, "true", True])
    ev(page, "void (HE.init(document.querySelector('#t-box-um')), HE.init('#t-box-um'), HE.init())")
    eq(ev(page, "document.querySelectorAll('#t-box-um .he-views__thumb').length"), 1, "HE.init repetido não duplica")
    # observador opcional liga sozinho o que entra depois
    ev(page, "void HE.config({ observe: true })")
    ev(page, "void " + add + "('dois')", html)
    wait(page, "document.querySelector('#t-dyn-dois').getAttribute('role') === 'tablist'")
    ev(page, "void HE.config({ observe: false })")


def t_empty_page(browser, size):
    """Página vazia: carregar os dois scripts não gera erro nem cria elemento."""
    ctx = browser.new_context(viewport={"width": size[0], "height": size[1]})
    try:
        page = ctx.new_page()
        errors = []
        page.on("console", lambda m: errors.append(m.text) if m.type == "error" else None)
        page.on("pageerror", lambda e: errors.append(str(e)))
        page.goto("about:blank")
        page.add_script_tag(path=THEME)
        page.add_script_tag(path=LIB)
        eq(page.evaluate("() => typeof HE.init"), "function")
        page.evaluate("() => { HE.init(); HE.init(document.body); HE.counts.set({ a: 1 }); HE.presence.set({ state: 'working', working: 1 }); HE.dock.setContext([{ key: 'a', label: 'A' }]); HE.dock.setSuggestions(['x']); HE.dock.focus('x'); HE.dock.setBusy(true); HE.dock.setBusy(false); HE.glow(null, true); HE.sidebar.collapse(false); HE.theme.set('dark'); HE.theme.toggle(); HE.drawer.close(); HE.layer.close(); HE.palette.close(); HE.menu.close(); HE.carousel(null); HE.player(null); HE.pins(null); HE.decide(null); HE.views(null); HE.tabs(null); HE.dnd(null); HE.steps(null, 1); HE.stamp(null); HE.newMenu.open(); }")
        for key in ["/", "Escape", "a", "j", "n", "Tab"]:
            page.keyboard.press(key)
        page.mouse.click(50, 50)
        eq(page.evaluate("() => HE.ask('Pedido sem campo').then(function (r) { return r === undefined; })"), True, "HE.ask sem marcação")
        eq(page.evaluate("() => [HE.icons.mount(), document.getElementById('he-sprite')]"), [False, None], "sem build não há sprite a injetar")
        eq(page.evaluate("() => Array.from(document.body.querySelectorAll('*')).filter(function (n) { return n.tagName !== 'SCRIPT'; }).length"), 0, "elementos criados na página vazia")
        eq(page.evaluate("() => document.documentElement.getAttribute('data-he-theme')"), "light")
        eq(errors, [], "erros no console da página vazia")
        # com o sprite embutido pelo build, HE.icons.mount injeta uma vez só
        page2 = ctx.new_page()
        errors2 = []
        page2.on("console", lambda m: errors2.append(m.text) if m.type == "error" else None)
        page2.on("pageerror", lambda e: errors2.append(str(e)))
        page2.goto("about:blank")
        src = open(LIB, encoding="utf-8").read()
        mark = '"@@HE_SPRITE@@"'
        eq(src.count(mark), 1, "marca do sprite no código")
        page2.add_script_tag(content=src.replace(mark, json.dumps(open(SPRITE, encoding="utf-8").read().strip())))
        eq(page2.evaluate("() => [document.querySelectorAll('#he-sprite').length, document.body.firstElementChild.id, document.querySelectorAll('#he-sprite symbol#he-i-check').length, HE.icons.mount()]"), [1, "he-sprite", 1, False])
        eq(page2.evaluate("() => { var r = document.getElementById('he-sprite').getBoundingClientRect(); return [r.width, r.height]; }"), [0, 0], "sprite sem área visível")
        eq(errors2, [], "erros no console com o sprite embutido")
    finally:
        ctx.close()


TESTS = [
    ("api", t_api), ("tema", t_theme), ("toast", t_toast), ("counts", t_counts), ("drawer", t_drawer), ("sheet", t_sheet),
    ("paleta", t_palette), ("dock", t_dock), ("presenca", t_presence), ("views", t_views), ("tabs", t_tabs), ("chips", t_chips),
    ("carousel", t_carousel), ("pins", t_pins), ("player", t_player), ("decide", t_decide), ("dnd", t_dnd), ("layer", t_layer),
    ("menu", t_menu), ("switch", t_switch), ("sidebar", t_sidebar), ("menu_recolhido", t_sidebar_collapsed), ("shortcuts", t_shortcuts), ("steps", t_steps), ("stamp", t_stamp),
    ("composer", t_composer), ("datas", t_time), ("glow", t_glow), ("init", t_init),
]


def run_size(browser, size):
    """Roda todos os testes em uma largura. Devolve (passaram, total)."""
    tag = "%dx%d" % size
    mobile = size[0] <= 760
    ctx = browser.new_context(viewport={"width": size[0], "height": size[1]}, color_scheme="light", locale="pt-BR")
    page = ctx.new_page()
    page.set_default_timeout(TIMEOUT)
    errors = []
    page.on("console", lambda m: errors.append("console: " + m.text) if m.type == "error" else None)
    page.on("pageerror", lambda e: errors.append("pageerror: " + str(e)))
    ok = total = 0
    page.goto(URL)
    for name, fn in TESTS:
        total += 1
        try:
            page.emulate_media(color_scheme="light")
            fresh(page)
            fn(page, mobile)
            ok += 1
            print("OK %s [%s]" % (name, tag), flush=True)
        except Exception as exc:   # noqa: BLE001
            print("FAIL %s [%s]: %s" % (name, tag, str(exc).strip().split("\n")[0]), flush=True)
            traceback.print_exc()
    total += 1
    try:
        t_empty_page(browser, size)
        ok += 1
        print("OK pagina_vazia [%s]" % tag, flush=True)
    except Exception as exc:   # noqa: BLE001
        print("FAIL pagina_vazia [%s]: %s" % (tag, str(exc).strip().split("\n")[0]), flush=True)
        traceback.print_exc()
    total += 1
    if errors:
        print("FAIL console [%s]: %d erro(s)" % (tag, len(errors)), flush=True)
        for line in errors[:20]:
            print("  " + line, flush=True)
    else:
        ok += 1
        print("OK console [%s]: zero erros" % tag, flush=True)
    ctx.close()
    return ok, total


def main():
    ok = total = 0
    with sync_playwright() as pw:
        browser = pw.chromium.launch(args=["--no-sandbox"])
        try:
            for size in SIZES:
                a, b = run_size(browser, size)
                ok += a
                total += b
        finally:
            browser.close()
    print("RESULTADO: %d de %d passaram" % (ok, total), flush=True)
    return 0 if ok == total else 1


if __name__ == "__main__":
    sys.exit(main())
