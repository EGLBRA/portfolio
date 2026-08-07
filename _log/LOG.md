# Log de Sessões — Portfolio

## [2026-08-06 22:10] Tag malformada `<\em>` no case do Radar — v1
- Pedido: corrigir `<em>deveria<\em>` (barra invertida) por volta da linha 1402 do index.html, no template `case-radar-mudanca`, e varrer outras tags com o mesmo padrão.
- Feito: não reproduziu. O template está na linha 1525 e o standfirst na 1531 já traz `<em>deveria</em>` correto. Varredura por regex `<\` seguido de letra em todo o index.html: zero ocorrências. `git log -S '<\em>'` não acha o padrão em nenhum commit do histórico. Confirmado no preview: o DOM parseia a tag e o texto sai limpo ("ela deveria ser"), sem lixo visível. Nenhuma alteração feita, portanto sem snapshot nem entrada de CHANGELOG.
- Arquivos: - (nenhum alterado)
