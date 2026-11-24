# Produtora: gerador das peças do Instagram

Transforma fotos de trabalho em peças prontas para o Instagram da Isa, seguindo o guia visual "Identidade Isa Paglioni" (design system no Claude). As cores e medidas vêm de `tokens.json`, cópia do guia: mudou o guia, copie o `tokens.json` de novo.

## Uso

```bash
pip install pillow
python tools/produtora/gerar.py roteiro.json
```

O roteiro é uma lista de peças em JSON (veja `exemplo.json`). Caminhos relativos partem da pasta do roteiro. Destaque em rosa: marque o trecho com asteriscos, como em `"Cada coisa no *seu lugar.*"`.

## Modelos

| Modelo | Campos | Sai |
|---|---|---|
| `story_frase` | `foto`, `frase`, `saida` | Story 1080×1920: frase numa faixa rosada, foto embaixo |
| `story_antes_depois` | `antes`, `depois`, `saida` | Story dividido ao meio com os selos ANTES e DEPOIS |
| `story_dica` | `titulo`, `texto`, `foto`, `saida` | Story com selo DICA, título, até 3 linhas e foto em cartão |
| `capa_reel` | `foto`, `titulo`, `saida`, `apoio`? | Capa 1080×1920 com o título no recorte que a grade mostra |
| `carrossel` | `capa`, `passos`, `final`, `pasta` | Slides 1080×1350: capa, um slide por passo e o chamado final |
| `capa_destaque` | `letra`, `saida` | Capa de destaque com a inicial em Playfair itálico |

Opcional em qualquer foto: `foco` (`[x, y]` de 0 a 1) diz que parte da foto preservar no recorte. O padrão é o centro.

## Regras que o gerador garante

- Fotos de borda a borda, sem filtro, recortadas sem distorcer.
- Títulos reduzem a fonte até caber no número de linhas do guia (2 no story e na capa, 3 no texto).
- O texto do story respeita as áreas seguras (250px no topo, 340px na base). Se não couber, o gerador para com erro em vez de gerar uma peça cortada.
- As peças saem sem os metadados da foto original, inclusive a localização GPS.

## Fontes

O guia usa **Playfair Display** e **Inter** (Google Fonts, licença OFL). Coloque os arquivos em `fonts/`:

- `PlayfairDisplay[wght].ttf` e `PlayfairDisplay-Italic[wght].ttf`
- `Inter[opsz,wght].ttf`

Sem eles, o gerador usa Georgia e Segoe UI do Windows e avisa no final. Num servidor Linux, os arquivos em `fonts/` são obrigatórios.
