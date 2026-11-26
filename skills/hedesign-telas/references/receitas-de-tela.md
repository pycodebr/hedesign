# Receitas de tela

Cada receita diz para que serve a tela, a estrutura de cima para baixo e o exemplo de onde partir. Os exemplos estão em
`docs/src/examples/<nome>.html` (fonte) e `docs/examples/<nome>.html` (pronto para abrir), na raiz do hedesign.

## Painel do dia (`painel.html`)

Tarefa: saber o que precisa de mim agora.

1. `he-head`: saudação no `h1` e uma frase com a situação ("Três itens esperam a sua decisão").
2. `he-hero[data-tone="orange"]`: o número de itens na fila, o leque com as miniaturas e o botão principal que abre a fila.
3. Seções em ordem de urgência, cada uma com contador: para decidir (pergunta da IA em `he-question` + cartões), pronto
   para a próxima etapa, sai hoje, o que a IA está fazendo (`he-job`).
4. Campo de pedido com sugestões do tipo "montar a próxima semana".

Regras: seção vazia some; se todas somem, um `he-empty` de dia livre. Nada de gráfico aqui, a não ser que mude a decisão.

## Lista em quadro, calendário e grade (`planejamento.html`)

Tarefa: organizar itens por etapa e por data.

1. `he-head` com o alternador `he-views` (quadro, calendário, grade) em `he-head__actions`.
2. `he-toolbar`: chips de filtro à esquerda (`he-chips--scroll` no celular), metas do período (`he-goals`) à direita.
3. Quadro: `he-board` com uma `he-col[data-tone]` por etapa; `he-quick` no topo da primeira coluna; cartões
   `he-card--board` arrastáveis. Coluna final `is-locked` (só o sistema move para lá).
4. Calendário: `he-cal` com `he-card--cal`; dia vazio com `he-cal__add` ("Sugerir").
5. Grade: `he-grid3` com `he-card--tile`, separador entre o que está por vir e o que já saiu.

Regras: soltar salva na hora e avisa com Desfazer; a visão escolhida fica guardada; a mesma cor de etapa nas três visões.

## Fila de revisão (`fila.html`)

Tarefa: decidir um item por vez.

1. `html.he-focus` (esconde a barra inferior no celular). `he-page--full`.
2. `he-toolbar`: sair da fila, contador `he-counter` ("1 de 3"), etapa, alternador antes e depois, setas.
3. `he-split`: à esquerda `he-studio` com `he-phone--fit` e a prévia; à direita painéis com passos, texto, o que mudou
   (`he-diff`) e conferências (`he-checks`).
4. `he-decide` fixa embaixo: negar (N), pedir ajuste (J), aprovar (A), e trocar data.
5. Depois da decisão: `HE.stamp` na prévia, aviso com Desfazer, próximo item com `he-in-next`.
6. Fim da fila: `he-empty` de fila zerada com o próximo passo.

Regras: marcadores de comentário na própria prévia (`HE.pins`); pedir ajuste abre uma folha com ajustes prontos em
chips, os marcadores e um campo livre; negar pede o motivo em uma linha.

## Detalhe do item (`item.html`)

Tarefa: produzir e acompanhar um item.

1. `he-head`: tipo, selo de etapa (como botão, para trocar), de quem é a vez, `h1` com o título; ações: pedir à IA e a
   ação principal da etapa.
2. `he-steps` com as etapas.
3. `he-split--3`: conversa e linha do tempo (`he-feed`), estúdio com a prévia e a tira (`he-strip`), painel com abas
   (conteúdo, referências, agenda, arquivos).
4. Campo de pedido com a etiqueta do item e da parte selecionada.

Regras: abre em camada (`HE.layer`) a partir de qualquer lista e também tem endereço próprio; cada entrega da IA é uma
versão com restaurar.

## Mural de referências (`referencias.html`)

Tarefa: guardar e reencontrar referências.

1. `he-head` com busca e `he-quick` grande ("Cole um link, escreva uma nota ou solte um arquivo").
2. Chips por tipo e por etiqueta.
3. `he-mural` com `he-clip` por tipo. O que a IA está lendo fica com `is-reading` e brilho suave.
4. `he-dropzone` cobrindo a tela ao arrastar um arquivo.

## Resultados (`resultados.html`)

Tarefa: entender o que funcionou.

1. `he-head` com o alternador de período.
2. `he-stats` com quatro indicadores e a variação.
3. Um bloco "o que aprendemos" em texto (painel da IA com `data-tone="ai"`), antes dos gráficos.
4. Barras por categoria, colunas no tempo, e a tabela dos itens com ordenação.

Regras: todo número tem base de comparação; estado sem dados explica quando os números chegam.

## Ajustes (`ajustes.html`)

Tarefa: mudar uma configuração sem medo.

`he-page--narrow` ou `he-settings` com `he-sidenav` e `he-formsec` por assunto. Interruptor vale na hora com Desfazer;
campos salvam no rodapé da seção; `is-dirty` avisa mudança por salvar.

## Conversa com a IA (`conversa.html`)

Tarefa: conversar em tela cheia.

Sem o campo fixo do rodapé (o compositor é a própria tela). `he-feed` com `he-msg--me` e `he-msg--ai`, sugestões
iniciais em `he-sug` quando a conversa está vazia, compositor com ferramentas, botão de parar enquanto a IA responde.

## Entrar (`entrar.html`)

Tarefa: entrar no sistema.

Sem casca. Cartão central de 420 px com a marca, um `h1`, os campos, um botão principal de largura total e uma linha de
ajuda. Erro no campo, não em caixa.

## Página de apresentação (`pagina.html`)

Tarefa: apresentar um produto fora do aplicativo.

Sem casca. Barra simples no topo, abertura com `he-display`, a prévia do produto em `he-studio`, blocos em `he-panel`,
uma ilha de tema escuro para o destaque e um único botão principal repetido no fim. Sem rótulo decorativo acima dos
títulos.

## Leitura (`leitura.html`)

Tarefa: ler um artigo ou uma ajuda.

`he-page--narrow` com `he-prose`. Sumário em `he-sidenav` se o texto for longo. `he-callout` para avisos.

## Quando nenhuma receita serve

1. Escreva a tarefa em uma frase.
2. Escolha o arranjo: uma coluna de leitura, `he-split` (conteúdo e apoio) ou largura total (quadro, tabela).
3. Monte com `he-head`, `he-sec`, cartões ou painéis, e os quatro estados.
4. Releia os seis princípios do `DESIGN.md`. Se a tela precisa de um componente novo, ele usa só tokens, tem os dois
   temas, foco visível, alvo de 40 px e versão de celular.
