# A IA presente: onde ela aparece e como

O hedesign trata a IA como uma colega que trabalha no mesmo sistema. Ela tem um lugar fixo para receber pedidos, uma
cor só dela e três sinais para mostrar o que está fazendo. A pessoa nunca precisa procurar a IA nem adivinhar o estado.

## Os sete pontos de contato

| Onde | O que | Como |
|---|---|---|
| Rodapé de toda tela | Campo de pedido | `he-dock` com `HE.dock.setContext` e `HE.dock.setSuggestions` da tela |
| Barra da área | Presença | `he-presence[data-he-presence]`; clique abre a atividade |
| Estado vazio | Primeiro passo | `he-btn--ai` que preenche o campo: `HE.dock.focus("Sugira 5 ideias")` |
| Item | De quem é a vez e brilho | `he-who[data-who]`; `HE.glow(el, true, "IA escrevendo")` |
| Topo da lista | Pergunta | `he-question` com respostas em botões |
| Paleta | Último resultado | "Pedir à IA: texto digitado" |
| Calendário e listas | Sugestão | item `is-suggestion` (tracejado) com aceitar e dispensar |

## Ciclo de um pedido

1. **A pessoa pede** no campo, com as etiquetas de contexto que a tela pôs lá (tela, período, item, parte).
2. **Recebido:** o campo limpa, o orbe passa a `working`, o item alvo ganha o brilho e a tarefa entra na atividade.
3. **Em andamento:** a atividade mostra o passo atual em palavras ("Escrevendo a lâmina 4 de 7").
4. **Dúvida:** a presença passa a `waiting`, a pergunta aparece no topo com respostas prontas.
5. **Permissão:** antes de qualquer efeito fora do sistema (publicar, enviar, apagar), `he-approval` mostra a ação
   exata, com permitir, permitir sempre e negar.
6. **Entrega:** o brilho sai, o item muda de etapa e de dono ("com você"), um aviso do tipo `ai` conta o que ficou
   pronto, e a versão nova fica registrada com a diferença marcada.
7. **Falha:** a tarefa fica em "não concluíram" com o motivo em uma frase e o botão de tentar de novo.

```js
HE.dock.onAsk = async ({ prompt, context, action }) => {
  const tarefa = await api.criarPedido({ prompt, context, action });   // enquanto espera, o campo fica "enviando"
  HE.presence.set({ state: "working", working: tarefa.emAndamento });
  if (context.item) HE.glow(document.querySelector(`[data-id="${context.item}"]`), true, "IA trabalhando");
};
servidor.on("tarefa", (t) => {                                        // tempo real: uma conexão para a tela toda
  HE.presence.set({ state: t.esperando ? "waiting" : t.emAndamento ? "working" : "idle", working: t.emAndamento, waiting: t.esperando });
});
```

## Contexto e sugestões por tela

- A etiqueta da tela entra sempre. Com um item aberto, entra a do item; com uma parte selecionada, a da parte.
- A pessoa pode tirar qualquer etiqueta no "x". O pedido vai só com as que ficaram.
- Três ou quatro sugestões por tela, escritas como ação ("Montar a próxima semana"), não como pergunta.
- Sugestão com `send: true` envia direto; use só para pedidos sem ambiguidade.

## Regras de confiança

- A IA **propõe**; a pessoa **decide**. O que ela cria nasce como rascunho ou sugestão tracejada.
- Nada que a IA fez é trocado em silêncio. Sempre há versão, diferença e restaurar.
- Efeito externo pede permissão com a ação escrita por extenso, nunca um resumo.
- O que a IA afirma com base em fonte mostra a fonte (`he-clip__sources`, "4 fontes").
- A cor da IA só aparece onde ela age. Um botão comum nunca é violeta.
- Enquanto a IA mexe em um item, a pessoa ainda pode abrir e ler, e a tela diz o que ainda vai mudar (`he-glow--veil`).

## Texto da IA na interface

- Presença: "IA livre", "Trabalhando em 2", "Esperando você".
- Passo: verbo no gerúndio e o objeto ("Lendo a referência", "Escrevendo a lâmina 4 de 7").
- Pergunta: uma frase, com duas a quatro respostas prontas e curtas.
- Entrega: o que ficou pronto e onde ("Texto pronto em 5 erros no seu primeiro agente").
- Falha: o que aconteceu, sem jargão ("A busca não respondeu a tempo").
- Dê à IA do seu produto um nome próprio se fizer sentido; o orbe e a cor continuam os mesmos.
