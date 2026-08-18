# Log de Sessões — Portfolio

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
