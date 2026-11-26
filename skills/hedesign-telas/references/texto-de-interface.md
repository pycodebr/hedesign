# Texto de interface

O texto faz parte do design. No hedesign ele é escrito como um colega falaria: frase completa, curta, com a informação
que ajuda a decidir.

## Regras

1. **Frase completa.** "Três itens esperam a sua decisão", e não "3 pendentes". Artigos e preposições ficam.
2. **Situação antes de instrução.** O subtítulo de uma tela diz o que há ali agora. A instrução aparece só se o gesto
   não for óbvio ("Arraste para mudar a etapa ou a data").
3. **Botão com verbo e objeto.** "Aprovar e agendar", "Pedir ajuste", "Tentar de novo". Nunca "OK", "Sim", "Confirmar"
   ou "Enviar" sozinho.
4. **Título de uma palavra para destinos** ("Hoje", "Planejamento", "Resultados") e título de frase para seções
   ("Para você decidir", "Sai hoje").
5. **Número com unidade e base.** "12% a mais que no mês passado". Data próxima é relativa: "hoje · 18h", "amanhã",
   "qui 26/11".
6. **Sem caixa alta** fora do rótulo de painel. Sem ponto de exclamação. Sem reticências.
7. **Uma ideia por aviso.** O aviso diz o que aconteceu no passado perfeito: "Item arquivado." "Aprovado e agendado
   para quinta, 18h."
8. **Vocabulário estável.** Escolha um nome para cada coisa do domínio e use sempre o mesmo. Se é "item", não vira
   "card", "post" e "conteúdo" na mesma tela.
9. **Exemplo é fictício.** Nomes, números e marcas de demonstração não vêm de um caso verdadeiro.

## Estado vazio

Três partes: o que cabe ali, por que está vazio (se ajudar) e o primeiro passo.

| Fraco | Melhor |
|---|---|
| Nenhum item. | **Nenhum item nesta etapa.** Guarde uma ideia ou peça sugestões. [Pedir ideias] |
| Sem dados. | **Sem resultados ainda.** Os números aparecem depois da primeira publicação. [Ver agendados] |
| Lista vazia! | **Fila zerada.** Você decidiu tudo. O próximo passo é o planejamento. [Ver o planejamento] |

## Erro

Três partes: o que aconteceu, o que ficou preservado, o que fazer.

| Fraco | Melhor |
|---|---|
| Erro 500. | **Não consegui salvar a legenda.** A conexão caiu no meio do envio. O texto continua aqui; tente de novo. [Tentar de novo] |
| Arquivo inválido. | **capa.png passou de 20 MB.** Reduza a imagem e envie de novo. [Escolher outro] |
| Operação falhou. | **A publicação não saiu.** A conta desconectou ontem. Reconecte e o item entra no próximo horário. [Reconectar] |

No campo de formulário, o erro fica abaixo do campo, diz a regra e dá um exemplo: "O endereço não pode ter espaço. Tente
estudio-norte."

## Confirmação e Desfazer

- Ação reversível: sem pergunta. Aviso com o resultado e o botão "Desfazer".
- Ação irreversível: folha com título que nomeia a ação ("Apagar 3 arquivos?"), uma frase com a consequência ("Eles
  saem da biblioteca e dos itens que os usam.") e botões "Apagar 3 arquivos" e "Manter".

## Carregando

- Menos de um segundo: nada.
- Lista: esqueleto, sem texto.
- Tarefa longa: diga o passo ("Enviando aula-3.mp4 · 62%").

## Acessibilidade do texto

- Botão só com ícone tem `aria-label` com verbo ("Fechar", "Editar o título").
- Link diz para onde vai. "Abrir a fila", não "Clique aqui".
- Texto que só leitor de tela precisa usa `he-sr` ("Carregando", "3 esperando decisão").
- Não dependa de cor na frase: "o item em laranja" vira "o item em Aprovação".
