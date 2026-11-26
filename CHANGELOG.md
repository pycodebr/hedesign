# Changelog

Todas as mudanças publicadas do hedesign. O formato segue o [Keep a Changelog](https://keepachangelog.com/pt-BR/1.1.0/)
e as versões seguem o [SemVer](https://semver.org/lang/pt-BR/).

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
