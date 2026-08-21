# Log de Sessões — Portfolio

## [2026-08-21 10:45] /juroscompostos.html, dia 1, tabela e ajuda - v5.72
- Pedido: rodape numa frase so com o copyleft no fim; botao "?" com explicacao simples de juros
  compostos em menu lateral; botao de tabela abrindo a projecao; a contagem comeca no dia 1 e
  o dia 1 nao dobra, a primeira dobra e no dia 2.
- Feito: indexacao refeita, dia 1 = valor inicial e o valor passou a ser DISCRETO por dia
  (antes a curva era continua e o dinheiro crescia dentro do proprio dia 1, o que estava errado);
  duracao padrao 31 dias, fechando em R$ 10.737.418,24 como na planilha do Eric. Duas gavetas novas
  irmas da de configuracao: Tabela (projecao dia a dia com valor e ganho do dia, dia atual
  destacado e marcacao de quem passou do milhao) e "?" (explicacao simples, com juros simples x
  compostos, a formula e a ressalva de que 100% ao dia nao existe). Curva do grafico agora liga
  ponto a ponto por dia e o cruzamento do milhao virou dia inteiro (dia 28). Rodape numa linha so.
- Arquivos: juroscompostos.html, _log/LOG.md

## [2026-08-21 10:20] /juroscompostos.html, copyleft a esquerda no rodape - v5.71
- Pedido: o copyleft fica a esquerda, nao abaixo do rodape.
- Feito: rodape passou a usar o mesmo .foot-row do site (flex, space-between): o link copyleft
  colado na borda esquerda e o credito na direita, na mesma linha. O disclaimer segue abaixo,
  em largura cheia, quando o link e acionado.
- Arquivos: juroscompostos.html, _log/LOG.md

## [2026-08-21 10:10] /juroscompostos.html, Play e Reset na barra do topo - v5.70
- Pedido: Play e Reset ficam acima, na frente do Configurar.
- Feito: os dois sairam do cabecalho do grafico e foram para a barra fixa do topo, antes do
  Configurar, na mesma medida dos demais botoes (36px de altura). Isso tambem elimina a colisao
  que eles teriam com a barra fixa ao rolar a pagina. O cabecalho do grafico ficou so com o titulo
  e o seletor Linear/Log. Folga do header e breakpoint ajustados para a barra maior (1120px).
  Versao saltou de 5.68 para 5.70 porque havia dois commits numerados 5.68.
- Arquivos: juroscompostos.html, _log/LOG.md

## [2026-08-21 09:55] /juroscompostos.html, ajustes de rodape e legenda - v5.68
- Pedido: copyleft como link (nao botao), por ultimo, depois do ano, com a setinha diagonal de link;
  a legenda do grafico sai do titulo e vai para o canto inferior direito.
- Feito: rodape na ordem credito e depois o link copyleft, no padrao .contato-links do site (mono,
  caixa alta, setinha e hover translate(3px,-3px)); a seta gira 90 graus quando o texto abre.
  Legenda movida para .chart-foot alinhada a direita, abaixo da curva.
- Arquivos: juroscompostos.html, _log/LOG.md

## [2026-08-21 09:35] Animação de juros compostos publicada em /juroscompostos.html - v5.67
- Pedido: publicar no portfolio a página interativa "O que você escolheria?" para ficar em ericleite.co.
- Feito: página única na raiz, autocontida (sem dependência de assets do site, só Google Fonts).
  Compara R$ 1 milhão com 1 centavo dobrando por 30 dias em dois quadros de bolinhas, com curva
  Ganhos x Dias, tema claro/escuro nos tokens do site, board de configuração em gaveta e rodapé
  copyleft. Não foi linkada no index.html, o acesso e direto pela URL.
- Arquivos: juroscompostos.html (novo), _log/LOG.md

## [2026-08-18 06:50] Book de Cases RH da Equatorial publicado em /equatorial.html - v5.61
- Pedido: subir o book de cases da Equatorial para o GitHub, no endereço ericleite.co/equatorial.html.
- Feito: capa do book na raiz como equatorial.html e o restante em /equatorial (7 cases, pesquisa,
  assets e os 11 anexos referenciados). nav.js passou a calcular o prefixo, porque a capa mora na
  raiz e as páginas na pasta. Corrigido no index.html o último resíduo do case de folha: o parágrafo
  de Resultados dizia "tempo das contratações comuns caiu 30%" e agora diz "tempo do processo de
  folha", coerente com a tabela.
- Arquivos: equatorial.html, equatorial/ (novo), index.html, _log/LOG.md

## [2026-08-07 14:04] Cases em Markdown — v1
- Pedido: gerar um Markdown de cada case e guardar em `Portfolio\Cases`.
- Feito: extraí os 17 templates `case-*` do index.html com script Python (scratchpad) e converti para Markdown fiel: capa (título, cota do estudo, standfirst, setor/papel), seções 01 a 08 com tabela de destaques, listas, citação e notas. Conferência automática de cobertura (h2, li, linhas de tabela, citações) bateu 17/17; zero travessão, zero entidade HTML, zero tag remanescente. Índice em README.md.
- Arquivos: `Portfolio\Cases\01-adquirencia.md` a `17-ia-processos.md` (17 arquivos) + `Portfolio\Cases\README.md`

## [2026-08-06 22:10] Tag malformada `<\em>` no case do Radar — v1
- Pedido: corrigir `<em>deveria<\em>` (barra invertida) por volta da linha 1402 do index.html, no template `case-radar-mudanca`, e varrer outras tags com o mesmo padrão.
- Feito: não reproduziu. O template está na linha 1525 e o standfirst na 1531 já traz `<em>deveria</em>` correto. Varredura por regex `<\` seguido de letra em todo o index.html: zero ocorrências. `git log -S '<\em>'` não acha o padrão em nenhum commit do histórico. Confirmado no preview: o DOM parseia a tag e o texto sai limpo ("ela deveria ser"), sem lixo visível. Nenhuma alteração feita, portanto sem snapshot nem entrada de CHANGELOG.
- Arquivos: - (nenhum alterado)
