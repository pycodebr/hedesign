# Changelog

Todas as mudanças publicadas do hedesign. O formato segue o [Keep a Changelog](https://keepachangelog.com/pt-BR/1.1.0/)
e as versões seguem o [SemVer](https://semver.org/lang/pt-BR/).

## 1.0.2 (2026-11-27)

### Corrigido

- Menu lateral recolhido: a lista de itens voltou a rolar dentro do menu e o rodapé, onde fica o botão de expandir,
  não sai mais da janela. Antes, com mais itens do que cabiam na altura da janela, o rodapé era empurrado para fora e
  não havia como expandir o menu de novo.
- A dica com o nome do item no menu recolhido passou a ser fixa na janela, ao lado do menu, para não ser cortada pela
  lista que rola. O `hedesign.js` informa a altura do item em `--he-tip-y`.
- Com o menu aberto, a dica dos itens não aparece mais por cima do item vizinho repetindo o nome que já está escrito.
- No menu recolhido, o nome do item continua disponível para o leitor de tela, e um item sem `he-side__icon` mostra a
  inicial do nome no lugar de ficar em branco.
- Documentação: cada seção do menu ganhou ícone e dica. Sem eles, o menu recolhido ficava vazio. O gerador
  (`tools/docs.py`) agora exige o ícone na linha `<!-- nav: Grupo | Título | ícone -->`.
- Documentação e exemplos: a dica do botão do rodapé diz "Expandir menu", a ação disponível com o menu recolhido.

### Testes

- `tests/js/test_js.py` confere o menu recolhido com mais itens do que cabem na janela: rolagem, botão de expandir
  alcançável, ícone ou inicial em todo item e posição da dica com ponteiro, rolagem e teclado.
- `tests/pages.py` recolhe e expande o menu da documentação e de cada exemplo em uma janela baixa.

## 1.0.1 (2026-11-26)

### Corrigido

- `LICENSE` só com o texto padrão da licença MIT. A versão 1.0.0 saiu com um parágrafo a mais no fim, que citava um
  arquivo que não existe neste repositório e impedia o GitHub de reconhecer a licença. Os componentes de terceiros
  continuam descritos em `THIRD_PARTY.md`.
- `tests/check_repo.py` passou a conferir o texto do `LICENSE`.

## 1.0.0 (2026-11-25)

Primeira versão pública.

### Sistema

- Tokens dos temas claro e escuro: fundo e superfícies, cinco degraus de tinta, linhas, destaque, estados, a cor da IA,
  seis tons com quatro papéis cada, tipografia, espaço, forma, elevação e movimento.
- Tema por `data-he-theme` no `<html>` ou em qualquer elemento (ilhas de tema), com `hedesign-theme.js` para aplicar
  antes da primeira pintura e reserva por `prefers-color-scheme` quando não há script.
- Casca: menu lateral que recolhe, barra do topo, barra da área que se aperta sozinha, barra inferior no celular e
  campo de pedido à IA fixo no rodapé.
- Componentes: botões, campos, compositor, selos, alternador, chips, abas, cartão em cinco formas, quadro, calendário,
  grade, passos, painéis, conferências, indicadores, barras, colunas, tabela, lista, interruptor, tela de ajustes,
  vazio, esqueleto, erro, avisos com Desfazer, gaveta, folha, camada de detalhe, menu, paleta de comandos, orbe,
  presença, brilho de trabalho, pergunta e permissão da IA, conversa, linha do tempo, estúdio com moldura de aparelho,
  carrossel, vídeo vertical, marcadores de comentário, barra de decisão, carimbo, recortes em mural, destaque do dia e
  envio de arquivos.
- 82 ícones de traço em sprite.
- `hedesign.js` (`window.HE`), sem dependências.

### Para agentes

- `DESIGN.md` no formato do Google, `llms.txt` e três skills: `hedesign`, `hedesign-telas` e `hedesign-auditoria`.
- Comando `hedesign` (`add`, `audit`, `docs`, `doctor`, `update`) e instalador sem sudo para Claude Code, Codex,
  Gemini CLI, OpenCode, Cursor e Hermes.
- Tokens em JSON (DTCG), CSS isolado e tema para Tailwind v3 e v4.

### Documentação

- Documentação viva em `docs/index.html`, versão em arquivo único em `docs/hedesign.html` e onze telas de exemplo.
