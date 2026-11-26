# Roteiro de auditoria

Marque cada item. "Não se aplica" é uma resposta válida, desde que escrita.

## 1. Sistema

- [ ] `hedesign audit` sem erros na pasta da tela.
- [ ] Nenhuma cor fixa em CSS próprio ou em `style`. Valores novos viraram tokens nos dois temas.
- [ ] Cor de etapa ou situação vem de `data-tone`. O mapa de tons é o mesmo em todas as telas.
- [ ] Um botão principal por tela ou por folha. O azul de destaque não foi usado como principal.
- [ ] A cor da IA só aparece onde a IA age.
- [ ] Superfícies paradas têm contorno interno; sombra só no que responde ao ponteiro ou flutua.
- [ ] Tudo o que se clica é pílula; cartões e painéis usam 14 e 20 px.

## 2. Dois temas

- [ ] Tela conferida em claro e em escuro, por captura.
- [ ] Texto legível sobre toda superfície nos dois temas (4,5:1).
- [ ] Imagens e ilustrações não têm fundo branco fixo.
- [ ] O tema escolhido entra antes da primeira pintura (script de tema no `<head>`, sem `defer`).

## 3. Celular (390 px) e computador (1440 px)

- [ ] Sem rolagem horizontal da página.
- [ ] Destinos na barra inferior, no máximo cinco, com o ativo marcado.
- [ ] Alvos de toque de 40 px ou mais; barra de decisão com 52 px.
- [ ] Campos com 16 px no celular.
- [ ] Nada fica atrás do campo de pedido ou da barra inferior no fim da rolagem.
- [ ] Gaveta, folha e camada sobem de baixo e fecham pela alça.
- [ ] Quadro rola de lado com encaixe; calendário vira agenda; tabela rola dentro da moldura.
- [ ] Entre 760 e 1023 px (tablet) a barra da área ainda cabe e o menu lateral vira gaveta.

## 4. Teclado e leitor de tela

- [ ] Tab percorre a tela na ordem visual, sem armadilha.
- [ ] Foco sempre visível, inclusive sobre fundos coloridos.
- [ ] Esc fecha a camada de cima e o foco volta a quem abriu.
- [ ] Setas funcionam em abas, menus, paleta e carrossel.
- [ ] Todo botão de ícone tem `aria-label`; toda imagem tem `alt` (vazio se decorativa).
- [ ] Um `h1` por tela e títulos em ordem.
- [ ] Avisos em região `aria-live`; carregamento com `aria-busy`.
- [ ] Estado nunca depende só de cor.

## 5. Estados

- [ ] Cada lista tem: com dados, vazio com primeiro passo, esqueleto com a forma do conteúdo, erro com saída.
- [ ] Formulário: erro abaixo do campo, com a regra e um exemplo; `aria-invalid` e `aria-describedby`.
- [ ] Ação lenta mostra progresso com o passo atual.
- [ ] Sem conexão ou com falha do servidor, a tela volta ao estado anterior e explica.

## 6. Ação e volta

- [ ] Ação reversível não pede confirmação e oferece Desfazer no aviso.
- [ ] Ação irreversível nomeia o que vai acontecer no título e no botão.
- [ ] Arrastar e soltar salva na hora e pode ser desfeito.
- [ ] Abrir um item e fechar devolve a rolagem e o foco ao mesmo ponto.

## 7. IA presente

- [ ] Campo de pedido no rodapé, com a etiqueta da tela (e do item aberto).
- [ ] Sugestões próprias da tela.
- [ ] Presença visível e correta nos três estados.
- [ ] Item em que a IA mexe tem brilho e o selo "com a IA".
- [ ] Pergunta da IA com respostas prontas; ação externa com pedido de permissão por extenso.
- [ ] Entrega da IA vira versão, com diferença marcada e restaurar.
- [ ] Sugestão tracejada até ser aceita.

## 8. Movimento

- [ ] Só `transform`, `opacity`, `box-shadow` e `background-position` animam.
- [ ] Entradas em 220 ms, respostas e saídas em 150 ms, com a curva do sistema.
- [ ] Laço infinito só em estado em andamento.
- [ ] Com `prefers-reduced-motion`, nada anima e os estados continuam legíveis.

## 9. Texto

- [ ] `h1` com uma frase de situação logo abaixo.
- [ ] Botões com verbo e objeto.
- [ ] Sem caixa alta fora do rótulo de painel, sem exclamação, sem reticências.
- [ ] Datas próximas relativas; números com unidade e base de comparação.
- [ ] O mesmo nome para a mesma coisa em todas as telas.
- [ ] Dados de exemplo fictícios.

## Formato do relatório

```
QUEBRA O USO
1. templates/painel.html:42  Botão de fechar sem aria-label.  Regra: botão de ícone tem rótulo.  Correção: aria-label="Fechar".

FOGE DO SISTEMA
2. static/painel.css:18  color: #333.  Regra: sem cor fixa.  Correção: var(--he-ink-2).

REFINAMENTO
3. Captura 390 escuro  O contador some sobre o cartão.  Correção: usar he-count no lugar do texto solto.
```
