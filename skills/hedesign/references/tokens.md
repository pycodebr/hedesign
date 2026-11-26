# Tokens do hedesign e como adaptar a marca

Fonte: `src/css/00-tokens.css`. Os mesmos valores em JSON (DTCG) estão em `tokens/tokens.json`, com o valor do tema
escuro em `$extensions.dark`. `tokens/tokens.css` traz só os tokens, para quem quer as variáveis sem os componentes.

## Mapa

| Grupo | Tokens |
|---|---|
| Fundo e superfície | `--he-bg`, `--he-bg-sunken`, `--he-surface`, `--he-soft`, `--he-raise`, `--he-paper`, `--he-paper-ink` |
| Tinta | `--he-ink`, `--he-ink-2`, `--he-muted`, `--he-faint`, `--he-ghost` |
| Linhas e realce | `--he-line`, `--he-line-strong`, `--he-hover`, `--he-hover-strong`, `--he-scrim`, `--he-spot` |
| Destaque e estados | `--he-accent`, `--he-accent-ink`, `--he-accent-soft`, `--he-on-accent`, `--he-ok`, `--he-ok-soft`, `--he-danger`, `--he-danger-soft` |
| IA | `--he-ai`, `--he-ai-ink`, `--he-ai-soft`, `--he-ai-line`, `--he-ai-1`, `--he-ai-2`, `--he-ai-3`, `--he-ai-grad` |
| Seis tons | `--he-<tom>`, `--he-<tom>-fg`, `--he-<tom>-bg`, `--he-<tom>-solid` para `blue`, `violet`, `pink`, `orange`, `teal`, `green`; `--he-on-tone`; `--he-rail` |
| Tipografia | `--he-font`, `--he-mono`, `--he-text-display`, `-h1`, `-h2`, `-h3`, `-title`, `-lead`, `-body`, `-small`, `-label`, `-overline` |
| Espaço | `--he-s-1` (4px) a `--he-s-8` (64px): 4, 8, 12, 16, 24, 32, 48, 64 |
| Forma | `--he-r-xs` 6px, `--he-r-sm` 10px, `--he-r` 14px, `--he-r-lg` 20px, `--he-r-full` 999px |
| Elevação | `--he-shadow-1`, `--he-shadow-2`, `--he-shadow-pop`, `--he-shadow-ai` |
| Movimento | `--he-fast` 150ms, `--he-med` 220ms, `--he-ease` `cubic-bezier(.2, .7, .2, 1)` |
| Casca | `--he-sidebar-w`, `--he-topbar-h`, `--he-top-h`, `--he-dock-h`, `--he-mnav-h`, `--he-bottom`, `--he-content-max`, `--he-reading-max` |

## Tom por atributo

`data-tone="blue|violet|pink|orange|teal|green|ai|accent|danger|neutral"` em um elemento define nele e nos descendentes
`--tone` (cor viva), `--tone-fg` (texto), `--tone-bg` (fundo suave) e `--tone-solid` (fundo cheio). Em CSS próprio:

```css
.minha-faixa { background: var(--tone-bg); color: var(--tone-fg); box-shadow: inset 3px 0 0 var(--tone); }
```

## Tema

- `data-he-theme="light|dark"` no `<html>`, aplicado por `hedesign-theme.js` a partir de `localStorage["he.theme"]`
  (`light`, `dark` ou `auto`). Sem valor guardado vale `auto`; `data-he-theme-default="light"` no `<html>` troca o padrão.
- Sem o atributo (página sem o script), o CSS segue `prefers-color-scheme`.
- O atributo também funciona em qualquer elemento (ilha de tema).
- Nenhuma regra de componente depende do tema: tudo passa pelos tokens. CSS próprio deve seguir a mesma disciplina.

## Adaptar a marca

Crie um arquivo carregado depois do `hedesign.css` e redefina só valores. Mantenha o papel de cada token.

```css
/* marca.css */
:root, [data-he-theme="light"] {
  --he-accent: #0a7d5a;          /* foco, link, seleção */
  --he-accent-ink: #086247;      /* texto sobre a superfície: 4,5:1 ou mais */
  --he-accent-soft: #e3f4ee;
  --he-font: "Sua Fonte", system-ui, sans-serif;
}
[data-he-theme="dark"] {
  --he-accent: #4fd1a5;
  --he-accent-ink: #86e3c3;
  --he-accent-soft: #17352c;
  --he-on-accent: #06231a;
}
```

Regras ao trocar valores:

1. Todo token de cor trocado no claro precisa do par no escuro.
2. `-ink` e `-fg` são cores de texto: confira 4,5:1 sobre `--he-surface` e sobre o próprio `-soft` ou `-bg`.
3. A cor viva de um tom precisa de 3:1 sobre a superfície, porque é elemento gráfico.
4. Não troque o significado: laranja continua sendo "espera você" e verde, "feito". Se a marca é laranja, mude o
   `--he-accent`, não o tom de atenção.
5. A cor da IA pode mudar (`--he-ai*` e o gradiente `--he-ai-1` a `-3`), mas continua exclusiva da IA.
6. A marca do menu é o conteúdo de `.he-brand__mark` (uma letra ou uma imagem). Vazio, ele mostra a marca do hedesign.

## Tailwind

- v4: `@import "hedesign/tokens/tailwind-v4.css";` depois do `hedesign.css`. Gera `bg-he-surface`, `text-he-ink`,
  `rounded-he`, `shadow-he-1`, `font-he`, e a variante `dark:` segue `data-he-theme`.
- v3: `presets: [require("./hedesign/tokens/tailwind.preset.js")]`.
- Os utilitários servem para arranjo e ajustes locais. Componentes continuam sendo as classes `he-*`.

## Fora da web

Para aplicativo nativo, e-mail ou imagem, use `tokens/tokens.json`: cores, raios, espaços e tipografia com os mesmos
nomes. O que não é CSS (orbe, brilho, movimento) segue a descrição do `DESIGN.md`.
