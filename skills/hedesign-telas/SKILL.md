---
name: hedesign-telas
description: 'Use quando pedirem para desenhar, criar ou redesenhar uma tela, um fluxo ou a experiência de um sistema com o hedesign (UI/UX, dashboard, painel, kanban, quadro, calendário, fila de aprovação, tela de detalhe, ajustes, chat com IA, landing page, onboarding, estados vazios, mobile). Parte da tarefa de quem usa, escolhe a receita de tela, encaixa a IA no lugar certo, escreve o texto da interface e entrega a tela pronta nos dois temas e no celular.'
license: MIT
metadata:
  version: 1.0.1
  author: PycodeBR (Felipe Azambuja)
---

# hedesign: desenhar telas e a experiência

A skill `hedesign` põe o sistema no projeto. Esta decide **o que vai em cada tela e como a pessoa passa por ela**, para
o resultado ter a mesma fluidez da referência: a pessoa abre, entende o que precisa dela e resolve em um gesto.

Pré-requisito: o projeto já carrega `hedesign.css` e `hedesign.js` (se não, rode a skill `hedesign` antes).

## Leitura

| Preciso de | Leia |
|---|---|
| Estrutura pronta para o tipo de tela | `references/receitas-de-tela.md` |
| Onde e como a IA aparece | `references/ia-presente.md` |
| Como escrever títulos, botões, vazios e erros | `references/texto-de-interface.md` |
| Classes e marcação | `../hedesign/references/componentes.md` |
| Tela inteira para adaptar | `docs/src/examples/` na raiz do hedesign |

## Procedimento

1. **Escreva a tarefa em uma frase.** "Nesta tela a pessoa decide o que publicar hoje." Se a frase tiver "e", são duas
   telas ou uma tela com camada de detalhe. Toda decisão seguinte serve a essa frase.
2. **Escolha a receita** em `references/receitas-de-tela.md` (painel, lista em quadro, fila de revisão, detalhe,
   mural, resultados, ajustes, conversa, entrada, página pública, leitura). Parta do exemplo correspondente em
   `docs/src/examples/` e troque o conteúdo. Não comece do zero.
3. **Defina a hierarquia antes do visual:** um `h1` com uma frase de situação, uma ação principal, e os blocos em ordem
   de urgência. O que não ajuda a tarefa sai da tela ou vai para uma camada.
4. **Dê tom ao que tem estado.** Liste as etapas, categorias ou situações do domínio e atribua um dos seis tons a cada
   uma, respeitando os significados fixos (laranja espera a pessoa, verde é feito). Use o mesmo mapa no sistema todo.
5. **Encaixe a IA** conforme `references/ia-presente.md`: campo de pedido com o contexto da tela, sugestões que mudam
   por tela, botão de pedido nos vazios, selo de quem é a vez, brilho e atividade quando ela trabalha.
6. **Desenhe os quatro estados** de cada lista: com dados, vazio (com o primeiro passo), carregando (esqueleto com a
   forma do conteúdo) e erro (com saída).
7. **Escreva o texto** com `references/texto-de-interface.md`. Texto de exemplo é sempre fictício e plausível.
8. **Faça o celular de propósito:** destinos na barra inferior, camadas subindo de baixo, quadro com encaixe,
   calendário em agenda, alvos de 40 px. Não é a tela grande encolhida.
9. **Ligue o movimento que explica:** entrada dos cartões (`he-stagger`), carimbo depois da decisão, item seguinte
   entrando de lado, aviso com Desfazer. Nada em laço que não seja estado em andamento.
10. **Confira** nos dois temas, em 390 e 1440 px, só com teclado, e rode `hedesign audit`. Tire capturas e olhe para
    elas antes de entregar.

## Regras de experiência

- **A primeira tela responde "o que precisa de mim agora?"** Número grande, o que espera decisão, o que a IA
  perguntou, o que vem a seguir. Bloco vazio some.
- **No máximo cinco destinos** na área, com nomes de uma palavra. Eles viram a barra inferior no celular.
- **Abrir um item não troca de tela.** Ele sobe em camada, e fechar devolve a rolagem e o foco ao mesmo ponto.
- **A mesma lista em várias formas** (quadro, calendário, grade), com a escolha guardada.
- **Ação direta com volta:** arrastar salva; aprovar não pede confirmação; o aviso traz Desfazer por dez segundos.
- **Uma decisão, uma barra:** negar, pedir ajuste, aprovar, nessa ordem, com teclas.
- **A prévia do que será publicado aparece do tamanho real**, na moldura do aparelho, com os controles em volta.
- **A IA trabalha à vista** e nunca troca conteúdo sem versão, diferença marcada e caminho de volta.
- **Sugestão é tracejada** até alguém aceitar.
- **Nada depende do hover.** O que aparece com o ponteiro aparece com o foco e está visível no toque.

## Armadilhas

- Tela cheia de cartões de indicador antes da tarefa: o número só entra se muda a decisão de quem olha.
- Dois botões em tinta na mesma tela: o segundo vira contorno.
- Modal de confirmação para arquivar, mover ou aprovar: troque por ação direta com Desfazer.
- Rótulo decorativo acima de cada título de seção: o título já é a mensagem.
- Tom usado como enfeite: se a cor não diz etapa ou situação, o elemento é neutro.
- Estado vazio só com "Nenhum item": falta dizer o que cabe ali e oferecer o primeiro passo.
- Esqueleto genérico de três linhas para uma grade de cartões: o esqueleto tem a forma do que vem.
- Campo de pedido que não sabe onde a pessoa está: toda tela chama `HE.dock.setContext`.
- Celular testado só redimensionando a janela: confira alvos de toque, teclado virtual e a barra inferior.
