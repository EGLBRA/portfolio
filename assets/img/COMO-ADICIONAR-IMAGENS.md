# Como adicionar imagens ao portfólio

O site já está **pronto pra receber** foto e logo. É só soltar o arquivo com o nome certo, nesta pasta, e ele aparece sozinho (com fallback elegante enquanto não existir).

## 1. Sua foto (seção Sobre)
- Arquivo: `assets/img/eric.jpg`
- Retrato profissional, vertical (proporção ~4:5). Enquanto não existir, mostra um placeholder técnico.

## 2. Fotos dos estudos de caso
- Pasta: `assets/img/cases/`
- Nome do arquivo = id do case + `.jpg`. Se existir, a foto entra no card **e** no topo do estudo; se não, fica o diagrama.
- Ideal: horizontal, boa resolução (mín. 1200px de largura).

| Arquivo a soltar | Estudo |
|---|---|
| `cases/adquirencia.jpg` | Rede/Itaú — Pix no prazo |
| `cases/fidelidade.jpg` | Smiles/GOL — 60% da mudança |
| `cases/pd-beleza.jpg` | Natura — Fluxo Unificado |
| `cases/dados-industria.jpg` | Vale/Braskem — programa travado |
| `cases/programas-nacionais.jpg` | SOFTEX — baseline em 100% |
| `cases/seguros-saude.jpg` | Seguros Unimed — wiki que virou agente |

## 3. Logos reais (muro "Onde passei")
- Pasta: `assets/img/logos/`
- Nome = slug + `.svg` (de preferência SVG monocromático; PNG com fundo transparente também serve se trocar a extensão no JS).
- Enquanto não existir o arquivo, aparece o nome da empresa em wordmark (já fica bonito e uniforme).

Slugs esperados:
`seguros-unimed, natura, itau, carrefour, google, vale, braskem, gol, bny-mellon, te-connectivity, siemens, voith, fia-usp, softex, piracanjuba, infosys`

> Dica: para os logos ficarem uniformes no muro, use versões monocromáticas (só o contorno/branco). O site já aplica escala de cinza + realce no hover.
