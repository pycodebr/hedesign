# Receitas por stack

Em todas: `hedesign-fonts.css`, `hedesign.css` e `hedesign-theme.js` no `<head>`; `hedesign.js` antes de `</body>`. Abaixo,
`/static/hedesign/` é a pasta em que `hedesign add` pôs os arquivos. As classes `he-*` são globais em qualquer stack.

## HTML puro e geradores de site estático

```html
<link rel="stylesheet" href="/static/hedesign/hedesign-fonts.css">
<link rel="stylesheet" href="/static/hedesign/hedesign.css">
<script src="/static/hedesign/hedesign-theme.js"></script>
…
<script src="/static/hedesign/hedesign.js"></script>
```

## Django, Flask (Jinja), Rails, Laravel, Phoenix: páginas feitas no servidor

- Ponha as quatro linhas no layout base. A casca (menu lateral, barra do topo, barra da área, campo de pedido) vira
  parcial incluída pelo layout; cada tela preenche o bloco de conteúdo dentro de `.he-page`.
- O destino ativo do menu recebe `is-active` e `aria-current="page"` no servidor.
- Componentes repetidos (cartão, selo, vazio, erro) viram parciais com parâmetros. Não copie a marcação tela a tela.
- Mensagens do servidor depois de um redirecionamento viram aviso no carregamento:

```html
{% for m in messages %}<script>document.addEventListener("DOMContentLoaded", () => HE.toast({ kind: "{{ m.tags }}", text: "{{ m|escapejs }}" }));</script>{% endfor %}
```

- Formulário com erro: `aria-invalid="true"` no campo e `<p class="he-field__error">` com a mensagem do servidor.
- Com htmx, Turbo ou LiveView, chame `HE.init(elemento)` no conteúdo trocado:

```js
document.body.addEventListener("htmx:afterSwap", (e) => HE.init(e.target));
document.addEventListener("turbo:render", () => HE.init(document.body));
```

## React e Next

- Importe o CSS uma vez, no ponto de entrada (`app/layout.tsx`, `_app.tsx` ou `main.tsx`). No Next, copie `dist/` para
  `public/hedesign/` e carregue o script de tema no `<head>` com `<script src="/hedesign/hedesign-theme.js" />`
  (no App Router, dentro de `<head>` no `layout.tsx`, sem `next/script`, para rodar antes da pintura). Marque o `<html>`
  com `suppressHydrationWarning`, porque o script escreve `data-he-theme` nele.
- `hedesign.js` vai com `<Script src="/hedesign/hedesign.js" strategy="afterInteractive" />` ou import dinâmico no cliente.
- Componentes são funções finas sobre as classes. Exemplo:

```tsx
type Tone = "blue" | "violet" | "pink" | "orange" | "teal" | "green" | "neutral";
export function Badge({ tone, children, size }: { tone: Tone; children: React.ReactNode; size?: "sm" | "lg" }) {
  return <span className={`he-badge${size ? ` he-badge--${size}` : ""}`} data-tone={tone}>{children}</span>;
}
export function Icon({ name, className = "" }: { name: string; className?: string }) {
  return <svg className={`he-i ${className}`} aria-hidden="true" focusable="false"><use href={`#he-i-${name}`} /></svg>;
}
```

- O que o `HE` liga por atributo (alternador, abas, carrossel, compositor) precisa de `HE.init` depois de montar:

```tsx
const ref = useRef<HTMLDivElement>(null);
useEffect(() => { window.HE?.init(ref.current!); }, []);
```

- Estado da aplicação manda. Para alternador, abas e chips controlados pelo React, escreva `aria-pressed` e
  `aria-selected` a partir do estado e escute `he:view`, `he:tab` e `he:chips` para atualizar o estado.
- Avisos, gaveta, folha, paleta e camada são imperativos e vivem fora da árvore: chame `HE.toast(...)` e
  `HE.drawer.open({ body: elemento })` a partir de eventos. Para renderizar React dentro de uma camada, crie um nó,
  passe em `body` e use `createPortal` nele; no `onClose`, desmonte.
- Tipos: declare `interface Window { HE: any }` ou escreva os tipos do que usar a partir de `docs/api-js.md`.

## Vue e Nuxt

- CSS no ponto de entrada (`main.ts`) ou em `css: []` do `nuxt.config`. Script de tema em `app.head.script` com
  `tagPosition: "head"`; `hedesign.js` em `app.head.script` com `tagPosition: "bodyClose"`.
- `onMounted(() => window.HE.init(el.value))` em componentes que usam alternador, abas, carrossel ou compositor.
- `data-tone`, `aria-pressed` e `class` por `:bind`. Componentes de arquivo único não precisam de `<style>` para o que
  o sistema já resolve.

## Svelte e SvelteKit

- CSS em `+layout.svelte` (`import "…/hedesign.css"`), script de tema em `src/app.html` dentro do `<head>`.
- `use:action` para ligar: `export const he = (node) => { window.HE.init(node); };` e `<div use:he>`.

## Tailwind

- Carregue o `hedesign.css` depois da base do Tailwind. O sistema já define a base da página com especificidade zero.
- v4: `@import "…/tokens/tailwind-v4.css";`. v3: `presets: [require("…/tokens/tailwind.preset.js")]`.
- Use utilitários para arranjo (`grid`, `gap-he-4`, `max-w-…`) e as classes `he-*` para componentes. Não recrie um
  botão com utilitários.
- A variante `dark:` acompanha `data-he-theme="dark"`.

## Bibliotecas de componentes já instaladas (shadcn, Radix, MUI, Bootstrap)

- Não misture duas linguagens na mesma tela. Migre tela por tela.
- Enquanto conviverem, mapeie as variáveis da biblioteca para os tokens, para as cores e os raios baterem:

```css
:root { --background: var(--he-bg); --foreground: var(--he-ink); --card: var(--he-surface); --border: var(--he-line-strong);
        --primary: var(--he-ink); --primary-foreground: var(--he-bg); --ring: var(--he-accent); --radius: var(--he-r-sm); }
```

- Comportamentos complexos que a biblioteca já resolve bem (combobox, seletor de data) podem ficar, vestidos com os
  tokens. O que o hedesign tem (aviso, gaveta, folha, paleta, menu, abas) passa a ser o dele.

## Aplicativo nativo, e-mail e imagem

Sem CSS do sistema. Use `tokens/tokens.json` para cor, tipo, espaço e raio com os mesmos nomes, e o `DESIGN.md` para
proporções, sombras e movimento. Em e-mail, use só o tema claro e cores sólidas.
