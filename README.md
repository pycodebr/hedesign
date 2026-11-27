# hedesign

**Um estúdio calmo, com a IA sempre à mão.** Design system de CSS e JavaScript puros para sistemas web em que uma pessoa decide e uma IA trabalha junto. Tema claro e escuro, sem dependências, sem etapa de build, em qualquer stack.

[![ci](https://github.com/pycodebr/hedesign/actions/workflows/ci.yml/badge.svg)](https://github.com/pycodebr/hedesign/actions/workflows/ci.yml)
[![licença MIT](https://img.shields.io/badge/licen%C3%A7a-MIT-1b1a18)](LICENSE)
[![versão](https://img.shields.io/github/v/release/pycodebr/hedesign?label=vers%C3%A3o&color=6b3fa8)](https://github.com/pycodebr/hedesign/releases)

[![Painel de exemplo, metade no tema claro e metade no tema escuro](docs/img/capa.webp)](https://pycodebr.github.io/hedesign/docs/examples/painel.html)

| Ver funcionando | |
|---|---|
| [Documentação viva](https://pycodebr.github.io/hedesign/docs/) | Tokens, componentes, movimento e regras de experiência, com prévia e código de cada peça |
| [Onze telas de exemplo](https://pycodebr.github.io/hedesign/docs/examples/) | Painel, planejamento, fila de revisão, detalhe, referências, resultados, ajustes, conversa, entrar, página e leitura |
| [`docs/hedesign.html`](docs/hedesign.html) | O design system inteiro em um arquivo só, para guardar ou abrir sem servidor |
| [`DESIGN.md`](DESIGN.md) | A especificação que um agente de IA lê para aplicar o sistema |

## O que vem no pacote

- **Tokens** dos dois temas: superfícies, cinco degraus de tinta, seis tons com quatro papéis cada, a cor da IA, tipografia, espaço, forma, elevação e movimento.
- **Casca de aplicativo:** menu lateral que recolhe, barra do topo, barra da área, barra inferior no celular e o campo de pedido à IA fixo no rodapé.
- **Mais de sessenta componentes:** botões, campos, selos, cartões em cinco formas, quadro com arrastar e soltar, calendário, tabela, gráficos em CSS, avisos com Desfazer, gaveta, folha, camada de detalhe, paleta de comandos, moldura de aparelho com carrossel e vídeo, barra de decisão, mural de recortes e os estados vazio, carregando e erro.
- **IA presente:** orbe com três estados, presença, brilho de trabalho, pergunta com respostas prontas, pedido de permissão, conversa e linha do tempo.
- **82 ícones** de traço em um sprite.
- **`window.HE`:** os comportamentos, em um arquivo, sem dependências.
- **Para agentes de IA:** `DESIGN.md`, `llms.txt`, três skills, um comando de auditoria e um instalador.

## Começar em um minuto

```html
<!doctype html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/pycodebr/hedesign@1.0.2/dist/hedesign-fonts.css">
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/pycodebr/hedesign@1.0.2/dist/hedesign.min.css">
  <script src="https://cdn.jsdelivr.net/gh/pycodebr/hedesign@1.0.2/dist/hedesign-theme.js"></script>
</head>
<body>
  <main class="he-main">
    <div class="he-page he-page--narrow">
      <header class="he-head">
        <div class="he-head__main">
          <h1>Bom dia, Ana</h1>
          <p class="he-head__sub">Dois itens esperam a sua decisão.</p>
        </div>
        <div class="he-head__actions">
          <button class="he-btn" data-he-theme-toggle>Trocar o tema</button>
          <button class="he-btn he-btn--primary" id="revisar">Revisar agora</button>
        </div>
      </header>
      <span class="he-badge" data-tone="orange">Aprovação</span>
      <span class="he-who" data-who="ai">com a IA</span>
    </div>
  </main>
  <script src="https://cdn.jsdelivr.net/gh/pycodebr/hedesign@1.0.2/dist/hedesign.min.js"></script>
  <script>
    document.getElementById("revisar").addEventListener("click", function () {
      HE.toast({ text: "Item aprovado.", onUndo: function () { HE.toast("Aprovação desfeita."); } });
    });
  </script>
</body>
</html>
```

Para servir os arquivos do seu domínio, com as fontes junto:

```bash
curl -fsSL https://raw.githubusercontent.com/pycodebr/hedesign/main/install.sh | bash -s -- --assets static/hedesign
```

O instalador não usa sudo. Ele baixa o repositório para `~/.hedesign/src`, cria o comando `hedesign` em `~/.local/bin`, liga as skills nos agentes de IA que encontrar e, com `--assets`, copia `dist/` para a pasta indicada e baixa a fonte Inter com conferência de sha256. Para desfazer tudo: `bash ~/.hedesign/src/install.sh --uninstall`.

## Os princípios

1. **Estúdio calmo.** Fundo de papel quente, superfícies claras, muito respiro e um único botão em tinta por tela. O conteúdo é o que tem cor.
2. **A cor diz o estado.** Seis tons percorrem o fluxo, do azul ao verde. O mesmo tom aparece no selo, na coluna, no calendário e na barra de passos.
3. **IA presente, fora do caminho.** O campo de pedido fica no mesmo lugar em todas as telas e já sabe o contexto. O orbe mostra se a IA está livre, trabalhando ou esperando você.
4. **Toda ação tem volta.** Nada pede confirmação antes. A ação acontece na hora e o aviso traz o Desfazer.
5. **A prévia é a protagonista.** O que vai ser publicado aparece na moldura do aparelho, do tamanho que o público vai ver.
6. **Um gesto por decisão.** Aprovar, pedir ajuste ou negar cabem em uma barra, com tecla de atalho no computador e alvo de toque grande no celular.

## Paletas

O tema claro parte de um papel quente; o escuro, de um grafite levemente azulado. Cada token tem um papel, e o papel importa mais que o valor. [Cores na documentação](https://pycodebr.github.io/hedesign/docs/#cores).

![Tokens de fundo, superfície e tinta nos dois temas](docs/img/doc-cores.webp)

Seis tons com quatro papéis cada (cor viva, texto, fundo suave e fundo cheio) e uma cor que é só da IA. Um atributo `data-tone` no contêiner dá a mesma cor a tudo o que está dentro dele. [Tons na documentação](https://pycodebr.github.io/hedesign/docs/#tons).

![Os seis tons e os quatro papéis de cada um, no claro e no escuro](docs/img/doc-tons.webp)

```html
<article class="he-card" data-tone="orange">…</article>   <!-- selo, faixa e realce em laranja -->
<span class="he-badge" data-tone="green">Publicado</span>
```

## Tipografia, forma e movimento

| | |
|---|---|
| ![Escala tipográfica](docs/img/doc-tipografia.webp) | ![Espaço, raios e níveis de elevação](docs/img/doc-medidas.webp) |
| Inter variável, títulos pesados e apertados, texto de leitura a partir de 12 px | Escala de base 4, pílula em tudo o que se clica, quatro níveis de elevação |

Duas durações (150 e 220 ms) e uma curva cobrem quase tudo. Laço infinito só para estado em andamento, e com `prefers-reduced-motion` nada anima e todo estado continua legível. [Movimento na documentação](https://pycodebr.github.io/hedesign/docs/#movimento), com cada animação para repetir no clique.

![Entradas, saídas e estados em andamento](docs/img/doc-movimento.webp)

## Componentes

| | |
|---|---|
| [![Botões](docs/img/doc-botoes.webp)](https://pycodebr.github.io/hedesign/docs/#botoes) | [![Campos e formulários](docs/img/doc-campos.webp)](https://pycodebr.github.io/hedesign/docs/#campos) |
| [![Cartão de item](docs/img/doc-cartoes.webp)](https://pycodebr.github.io/hedesign/docs/#cartoes) | [![Quadro, calendário e metas](docs/img/doc-quadro.webp)](https://pycodebr.github.io/hedesign/docs/#quadro) |
| [![Números, gráficos e tabela](docs/img/doc-numeros.webp)](https://pycodebr.github.io/hedesign/docs/#numeros) | [![Vazio, carregando e erro](docs/img/doc-vazio.webp)](https://pycodebr.github.io/hedesign/docs/#vazio) |

Cada seção da documentação tem a prévia nos dois temas e o código para copiar. A lista completa de classes, com a marcação mínima de cada uma, está em [`skills/hedesign/references/componentes.md`](skills/hedesign/references/componentes.md).

## IA presente

A IA tem um lugar fixo para receber pedidos, uma cor só dela e três sinais para mostrar o que está fazendo: o orbe muda de estado, o item em que ela mexe ganha um brilho e a atividade lista o passo atual.

[![Orbe, presença, brilho, pergunta e atividade da IA](docs/img/doc-ia.webp)](https://pycodebr.github.io/hedesign/docs/#ia)

```js
HE.dock.setContext([{ key: "tela", label: "Planejamento", value: "planejamento" }]);
HE.dock.onAsk = ({ prompt, context }) => fetch("/api/pedidos", { method: "POST", body: JSON.stringify({ prompt, context }) });
HE.presence.set({ state: "working", working: 2 });
HE.glow(cartao, true, "IA escrevendo");
```

## Estúdio e decisão

| | |
|---|---|
| [![Prévia na moldura do aparelho](docs/img/doc-estudio.webp)](https://pycodebr.github.io/hedesign/docs/#estudio) | [![Barra de decisão e carimbo](docs/img/doc-decisao.webp)](https://pycodebr.github.io/hedesign/docs/#decisao) |
| A prévia do tamanho real, com carrossel, vídeo e marcadores de comentário | Negar, pedir ajuste e aprovar em uma barra, com tecla, carimbo e Desfazer |

## Telas de exemplo

Telas completas, feitas só com o hedesign e dados fictícios. Clique para abrir; a fonte de cada uma está em [`docs/src/examples/`](docs/src/examples/).

| Claro | Escuro |
|---|---|
| [![Painel do dia](docs/img/exemplo-painel-light.webp)](https://pycodebr.github.io/hedesign/docs/examples/painel.html) | [![Painel do dia no escuro](docs/img/exemplo-painel-dark.webp)](https://pycodebr.github.io/hedesign/docs/examples/painel.html) |
| [![Planejamento em quadro](docs/img/exemplo-planejamento-light.webp)](https://pycodebr.github.io/hedesign/docs/examples/planejamento.html) | [![Planejamento no escuro](docs/img/exemplo-planejamento-dark.webp)](https://pycodebr.github.io/hedesign/docs/examples/planejamento.html) |
| [![Fila de revisão](docs/img/exemplo-fila-light.webp)](https://pycodebr.github.io/hedesign/docs/examples/fila.html) | [![Fila de revisão no escuro](docs/img/exemplo-fila-dark.webp)](https://pycodebr.github.io/hedesign/docs/examples/fila.html) |
| [![Detalhe do item](docs/img/exemplo-item-light.webp)](https://pycodebr.github.io/hedesign/docs/examples/item.html) | [![Detalhe do item no escuro](docs/img/exemplo-item-dark.webp)](https://pycodebr.github.io/hedesign/docs/examples/item.html) |
| [![Referências](docs/img/exemplo-referencias-light.webp)](https://pycodebr.github.io/hedesign/docs/examples/referencias.html) | [![Referências no escuro](docs/img/exemplo-referencias-dark.webp)](https://pycodebr.github.io/hedesign/docs/examples/referencias.html) |
| [![Resultados](docs/img/exemplo-resultados-light.webp)](https://pycodebr.github.io/hedesign/docs/examples/resultados.html) | [![Resultados no escuro](docs/img/exemplo-resultados-dark.webp)](https://pycodebr.github.io/hedesign/docs/examples/resultados.html) |
| [![Ajustes](docs/img/exemplo-ajustes-light.webp)](https://pycodebr.github.io/hedesign/docs/examples/ajustes.html) | [![Conversa com a IA no escuro](docs/img/exemplo-conversa-dark.webp)](https://pycodebr.github.io/hedesign/docs/examples/conversa.html) |
| [![Entrar](docs/img/exemplo-entrar-light.webp)](https://pycodebr.github.io/hedesign/docs/examples/entrar.html) | [![Página de apresentação no escuro](docs/img/exemplo-pagina-dark.webp)](https://pycodebr.github.io/hedesign/docs/examples/pagina.html) |

No celular os destinos descem para a barra inferior, o campo de pedido fica logo acima dela, as camadas sobem de baixo e a moldura do aparelho some, porque a tela já é um aparelho.

| | | | |
|---|---|---|---|
| ![Painel no celular](docs/img/celular-painel-light.webp) | ![Planejamento no celular](docs/img/celular-planejamento-dark.webp) | ![Fila de revisão no celular](docs/img/celular-fila-light.webp) | ![Conversa no celular](docs/img/celular-conversa-dark.webp) |

## Tema claro e escuro

O tema fica em `data-he-theme` no `<html>`. O script `hedesign-theme.js` lê a escolha guardada (`light`, `dark` ou `auto`) e aplica antes da primeira pintura. Sem escolha guardada vale `auto`, que segue o sistema; sem o script, a página também segue o sistema.

```js
HE.theme.set("dark");     // "light" | "dark" | "auto"
HE.theme.toggle();
```

O mesmo atributo funciona em qualquer elemento. Um trecho com `data-he-theme="dark"` fica escuro numa página clara, e o contrário. Nenhuma regra de componente depende do tema: tudo passa pelos tokens, e é por isso que as duas coisas funcionam.

## JavaScript

`dist/hedesign.js` expõe `window.HE`. O que era chamada de rede no seu sistema entra nos callbacks; a biblioteca não busca nada sozinha.

```js
HE.toast({ text: "Item arquivado.", onUndo: () => restaurar(id) });
HE.drawer.open({ title: "Filtros", body: "<p>Conteúdo</p>" });
HE.palette.register({ group: "Ir para", items: [{ label: "Planejamento", icon: "board", href: "/planejamento/" }] });
HE.dnd(quadro, { onDrop: (ctx) => salvar(ctx).catch(() => ctx.revert()) });
HE.decide(barra, { onApprove, onAdjust, onDeny });
```

Referência completa em [`docs/api-js.md`](docs/api-js.md).

## Tokens fora do CSS

| Arquivo | Uso |
|---|---|
| [`tokens/tokens.css`](tokens/tokens.css) | Só as variáveis, sem os componentes |
| [`tokens/tokens.json`](tokens/tokens.json) | Formato DTCG, com o valor do tema escuro em `$extensions.dark` |
| [`tokens/tailwind-v4.css`](tokens/tailwind-v4.css) | Tema do Tailwind v4 (`bg-he-surface`, `text-he-ink`, `rounded-he`) |
| [`tokens/tailwind.preset.js`](tokens/tailwind.preset.js) | Preset do Tailwind v3 |

Para adaptar a marca, redefina valores de token em um arquivo seu, carregado depois do `hedesign.css`. O passo a passo está em [`skills/hedesign/references/tokens.md`](skills/hedesign/references/tokens.md).

## Para agentes de IA

Esta seção é para o agente que recebeu o link deste repositório. Siga na ordem.

**1. Instale** (uma vez, sem sudo):

```bash
curl -fsSL https://raw.githubusercontent.com/pycodebr/hedesign/main/install.sh | bash
~/.local/bin/hedesign doctor
```

Dentro de um clone deste repositório não é preciso instalar: use os caminhos a partir da raiz e `bash bin/hedesign` no lugar do comando. Sem terminal, leia os arquivos pelo GitHub e carregue o sistema pelo jsDelivr.

**2. Leia:**

| Arquivo | Para quê | Quando |
|---|---|---|
| [`DESIGN.md`](DESIGN.md) | Princípios, cores, tipografia, forma, movimento, IA, o que fazer e o que não fazer | Sempre |
| [`skills/hedesign/SKILL.md`](skills/hedesign/SKILL.md) | Aplicar o sistema em um projeto, passo a passo | Ao mexer em código |
| [`componentes.md`](skills/hedesign/references/componentes.md) | Todas as classes com marcação mínima | Antes de escrever um componente |
| [`stacks.md`](skills/hedesign/references/stacks.md) | HTML, Django, Rails, Laravel, React, Next, Vue, Svelte, Tailwind | Ao integrar |
| [`tokens.md`](skills/hedesign/references/tokens.md) | Tokens e adaptação de marca | Ao mudar cor, fonte ou raio |
| [`skills/hedesign-telas/`](skills/hedesign-telas/SKILL.md) | Receitas de tela, IA presente e texto de interface | Ao criar ou redesenhar uma tela |
| [`docs/api-js.md`](docs/api-js.md) | API de `window.HE` | Ao ligar comportamentos |
| [`skills/hedesign-auditoria/`](skills/hedesign-auditoria/SKILL.md) | Auditoria, capturas e roteiro de conferência | Antes de entregar |

A marcação completa de cada componente está em [`docs/src/sections/`](docs/src/sections/), e telas inteiras para adaptar, em [`docs/src/examples/`](docs/src/examples/). Com pouco contexto, comece pelo [`llms.txt`](llms.txt).

**3. Ponha no projeto:** `hedesign add static/hedesign` e, no layout base, `hedesign-fonts.css`, `hedesign.css` e `hedesign-theme.js` no `<head>` (o script sem `defer`) e `hedesign.js` antes de `</body>`.

**4. Regras que valem para todo trabalho:**

1. Use as classes `he-*` e os tokens `--he-*` que existem. Antes de criar um componente, procure em `componentes.md`.
2. Nenhuma cor fixa em tela. Valor novo entra como token nos dois temas.
3. Cor de etapa, categoria ou situação vem de `data-tone` no contêiner. Laranja é "espera você"; verde é "feito".
4. Um botão principal (`he-btn--primary`) por tela ou por folha.
5. A cor da IA só aparece onde a IA age. Toda tela do aplicativo tem o campo de pedido no rodapé, com o contexto da tela.
6. Ação reversível não pede confirmação: execute e ofereça Desfazer com `HE.toast({ text, onUndo })`.
7. Toda lista tem vazio com primeiro passo, esqueleto e erro com saída.
8. Texto de interface em frases completas e curtas, botão com verbo, sem caixa alta e sem exclamação.
9. Dados de exemplo são fictícios.
10. Não edite `dist/`. Adaptação de marca vai em um arquivo próprio, carregado depois, só com valores de token.

**5. Confira antes de entregar:**

```bash
hedesign audit caminho/do/projeto
python3 ~/.hedesign/src/skills/hedesign-auditoria/scripts/shots.py http://localhost:8000/tela/ --out /tmp/he-shots
```

Abra as quatro capturas (claro e escuro, 390 e 1440 px) e olhe para elas. Depois passe o roteiro de [`roteiro.md`](skills/hedesign-auditoria/references/roteiro.md). O trabalho só termina com zero erros na auditoria, sem rolagem horizontal, sem erro de console e com as capturas revistas.

### Skills

| Skill | Quando o agente usa |
|---|---|
| [`hedesign`](skills/hedesign/SKILL.md) | Instalar o sistema num projeto e migrar a interface para os tokens e componentes |
| [`hedesign-telas`](skills/hedesign-telas/SKILL.md) | Desenhar uma tela ou um fluxo com as regras de experiência |
| [`hedesign-auditoria`](skills/hedesign-auditoria/SKILL.md) | Conferir uma interface antes de entregar |

O instalador liga as três em Claude Code, Codex, Gemini CLI, OpenCode, Cursor e Hermes. Depois disso basta pedir: "aplique o hedesign neste projeto".

### Comando

| Comando | O que faz |
|---|---|
| `hedesign add <pasta>` | Copia `dist/` para o projeto e baixa as fontes para lá |
| `hedesign audit <caminho>` | Aponta classe ou token que não existe, tom inválido, cor fixa, texto pequeno, foco removido, `confirm()`, botão de ícone sem rótulo |
| `hedesign docs` | Mostra onde estão a documentação e as referências |
| `hedesign doctor` | Confere a instalação |
| `hedesign update` | Atualiza o código instalado |

## Estrutura do repositório

```
dist/        hedesign.css, hedesign.js e os demais arquivos prontos para usar
src/         a fonte: css/ (tokens, base, casca, componentes), js/ e icons/
tokens/      os tokens em CSS, JSON (DTCG) e tema do Tailwind
docs/        documentação viva, versão em arquivo único, telas de exemplo e a referência do JavaScript
skills/      hedesign, hedesign-telas e hedesign-auditoria
bin/         o comando hedesign
tools/       build.py, docs.py e media.py (só biblioteca padrão do Python)
tests/       o que o CI confere: comportamentos, páginas nos dois temas, instalação e guarda de publicação
DESIGN.md    a especificação para agentes
llms.txt     o índice para agentes
```

## Navegadores

Chrome e Edge 111 ou mais novos, Safari 16.4 ou mais novo e Firefox 121 ou mais novo. O sistema usa `:has()`, `color-mix()` e consultas de contêiner.

## Desenvolvimento

```bash
python3 tools/build.py     # dist/ e tokens/ a partir de src/
python3 tools/docs.py      # documentação e exemplos a partir de docs/src/
bash tests/check.sh        # tudo o que o CI confere sem navegador
python3 tests/js/test_js.py && python3 tests/pages.py   # com Playwright
```

Como contribuir e publicar uma versão: [`CONTRIBUTING.md`](CONTRIBUTING.md). Mudanças por versão: [`CHANGELOG.md`](CHANGELOG.md).

## Licença e créditos

[MIT](LICENSE). Feito pela [PycodeBR](https://github.com/pycodebr) (Felipe Azambuja). O hedesign nasceu de um sistema de produção de conteúdo operado junto com agentes de IA e foi generalizado para servir a qualquer produto.

A fonte Inter é carregada do jsDelivr ou baixada na instalação, sob a SIL Open Font License 1.1. Nenhum arquivo de terceiros é versionado aqui. Detalhes em [`THIRD_PARTY.md`](THIRD_PARTY.md).
