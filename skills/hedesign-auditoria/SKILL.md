---
name: hedesign-auditoria
description: 'Use quando pedirem para revisar, auditar ou conferir uma interface feita com o hedesign, antes de entregar uma tela, ou quando algo parecer fora do padrão (design review, UI audit, QA visual, contraste, dark mode quebrado, responsivo, acessibilidade). Roda a auditoria estática, tira capturas nos dois temas e em duas larguras, confere teclado e estados, e devolve uma lista de correções em ordem de gravidade.'
license: MIT
metadata:
  version: 1.0.1
  author: PycodeBR (Felipe Azambuja)
---

# hedesign: auditar uma interface

Esta skill confere se uma tela está de acordo com o hedesign e funciona nos dois temas, no celular e pelo teclado.
Ela encontra e descreve os problemas; a correção usa as skills `hedesign` e `hedesign-telas`.

## Pré-requisito

```bash
command -v hedesign || ls ~/.hedesign/src/bin/hedesign
```

Se não existir: `curl -fsSL https://raw.githubusercontent.com/pycodebr/hedesign/main/install.sh | bash`.

## Procedimento

1. **Auditoria estática.** Aponte para a pasta de templates, componentes e CSS do projeto:

   ```bash
   hedesign audit caminho/do/projeto            # erros e avisos por arquivo e linha
   hedesign audit caminho/do/projeto --json     # para processar
   hedesign audit caminho/da/tela.html --strict # aviso também reprova
   ```

   Erros (classe ou token que não existe, tom inválido, botão de ícone sem rótulo, falta de viewport) são defeitos e
   precisam ser corrigidos. Avisos (cor fixa, texto pequeno, foco removido, `confirm()`) pedem leitura: corrija ou
   registre o motivo.

2. **Capturas.** Com a aplicação rodando, tire a tela nos dois temas e em duas larguras:

   ```bash
   python3 ~/.hedesign/src/skills/hedesign-auditoria/scripts/shots.py http://localhost:8000/painel/ --out /tmp/he-shots
   ```

   O script usa o Playwright quando está instalado e também relata rolagem horizontal, erros de console e alvos de
   toque menores que 40 px. Sem Playwright, use o navegador do seu agente e siga a lista da referência.
   **Olhe as quatro capturas** antes de dizer que está certo: o relatório não vê alinhamento, hierarquia nem sobreposição.

3. **Roteiro manual** de `references/roteiro.md`: teclado, estados, movimento, texto e IA. Marque item por item.

4. **Relatório.** Entregue a lista em ordem de gravidade, cada item com arquivo e linha (ou captura), o que está
   errado, a regra do sistema e a correção. Separe em três grupos: quebra o uso, foge do sistema, refinamento.

5. **Depois da correção, rode tudo de novo.** A auditoria só fecha com zero erros e as quatro capturas revistas.

## O que costuma falhar

- Tema escuro com cor fixa: texto escuro sobre fundo escuro, imagem com fundo branco, sombra clara.
- Celular: rolagem horizontal por um elemento com largura fixa; botão de 32 px; campo com fonte menor que 16 px, que
  faz o navegador ampliar a página; conteúdo escondido atrás do campo de pedido (falta `padding-bottom` com
  `--he-bottom`).
- Teclado: camada que não devolve o foco; elemento clicável feito com `div`; foco invisível em fundo colorido.
- Estados: lista sem vazio; carregamento que desloca a tela quando o conteúdo chega; erro sem botão.
- IA: campo de pedido sem contexto da tela; tarefa rodando sem nenhum sinal; conteúdo trocado sem versão.
- Movimento: animação em laço sem motivo; transição de largura ou altura; nada muda com `prefers-reduced-motion`.
- Texto: botão "OK"; título em caixa alta; exclamação; erro que não diz o que fazer.
