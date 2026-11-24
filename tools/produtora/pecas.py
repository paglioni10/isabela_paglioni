"""Gerador das peças do Instagram da Isa Paglioni.

Cada função desenha um modelo do guia visual ("Identidade Isa Paglioni")
a partir das cores e medidas de tokens.json, que é cópia do guia.

Destaque em rosa: marque o trecho com asteriscos, como em
"Cada coisa no *seu lugar.*".

As imagens saem em JPEG, sem os metadados da foto original (inclusive a
localização GPS, que poderia revelar o endereço da cliente).
"""

from __future__ import annotations

import json
import re
from dataclasses import dataclass
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont, ImageOps

AQUI = Path(__file__).parent
TOKENS = json.loads((AQUI / "tokens.json").read_text(encoding="utf-8"))

STORY = (1080, 1920)
SLIDE = (1080, 1350)


# ---------------------------------------------------------------- tokens

def _cor(nome: str) -> str:
    for t in TOKENS["color"]["tokens"]:
        if t["name"] == nome:
            v = t["value"]
            return v["light"] if isinstance(v, dict) else v
    raise KeyError(f"cor {nome!r} não existe em tokens.json")


def _medida(familia: str, nome: str) -> int:
    for t in TOKENS[familia]["tokens"]:
        if t["name"] == nome:
            return int(str(t["value"]).removesuffix("px"))
    raise KeyError(f"{familia} {nome!r} não existe em tokens.json")


C = {t["name"]: _cor(t["name"]) for t in TOKENS["color"]["tokens"]}
MARGEM = _medida("spacing", "margem")
RESPIRO = _medida("spacing", "respiro")
TOPO_SEGURO = _medida("spacing", "story-topo-seguro")
BASE_SEGURA = _medida("spacing", "story-base-segura")
GRADE_RECORTE = _medida("spacing", "grade-recorte")
RAIO_BLOCO = _medida("radius", "raio-bloco")


# ---------------------------------------------------------------- fontes
# Usa as fontes do guia (Playfair Display e Inter) se estiverem em fonts/.
# Sem elas, cai para Georgia e Segoe UI do Windows, que são parecidas.

FONTES = {
    # papel: (arquivos do guia, peso para fonte variável, reserva do Windows)
    "titulo": (["PlayfairDisplay-Bold.ttf", "PlayfairDisplay[wght].ttf"], 700, "georgiab.ttf"),
    "italico": (["PlayfairDisplay-Italic.ttf", "PlayfairDisplay-Italic[wght].ttf"], 400, "georgiai.ttf"),
    "texto": (["Inter-Regular.ttf", "Inter[opsz,wght].ttf"], 400, "segoeui.ttf"),
    "selo": (["Inter-SemiBold.ttf", "Inter[opsz,wght].ttf"], 600, "seguisb.ttf"),
}
_cache: dict[tuple[str, int], ImageFont.FreeTypeFont] = {}
avisos: set[str] = set()


def fonte(papel: str, tamanho: int) -> ImageFont.FreeTypeFont:
    chave = (papel, tamanho)
    if chave in _cache:
        return _cache[chave]
    arquivos, peso, reserva = FONTES[papel]
    f = None
    for nome in arquivos:
        caminho = AQUI / "fonts" / nome
        if caminho.exists():
            f = ImageFont.truetype(str(caminho), tamanho)
            if "[" in nome:  # fonte variável: escolhe o peso
                try:
                    f.set_variation_by_axes([peso] if "opsz" not in nome else [min(32, max(14, tamanho)), peso])
                except OSError:
                    pass
            break
    if f is None:
        avisos.add(f"Fonte do guia não encontrada para '{papel}'; usando {reserva}.")
        for base in (Path("C:/Windows/Fonts"), Path("/usr/share/fonts/truetype/dejavu")):
            if (base / reserva).exists():
                f = ImageFont.truetype(str(base / reserva), tamanho)
                break
        if f is None:
            f = ImageFont.load_default(tamanho)
    _cache[chave] = f
    return f


# ---------------------------------------------------------------- texto com destaque

@dataclass
class Palavra:
    texto: str
    destaque: bool


def _palavras(frase: str) -> list[Palavra]:
    """'Cada coisa no *seu lugar.*' -> palavras com a marca de destaque."""
    saida: list[Palavra] = []
    for i, trecho in enumerate(re.split(r"\*", frase)):
        # Mantém "\n" como palavra própria: é a quebra de linha manual
        for p in re.findall(r"\n|[^\s]+", trecho):
            saida.append(Palavra(p, destaque=i % 2 == 1))
    return saida


def _quebrar(frase: str, f: ImageFont.FreeTypeFont, largura: int) -> list[list[Palavra]]:
    linhas: list[list[Palavra]] = [[]]
    espaco = f.getlength(" ")
    usado = 0.0
    for p in _palavras(frase):
        if p.texto == "\n":
            linhas.append([])
            usado = 0
            continue
        w = f.getlength(p.texto)
        if linhas[-1] and usado + espaco + w > largura:
            linhas.append([])
            usado = 0
        usado += (espaco if linhas[-1] else 0) + w
        linhas[-1].append(p)
    return [l for l in linhas if l]


def _ajustar(frase: str, papel: str, tamanho: int, largura: int, max_linhas: int):
    """Diminui a fonte até a frase caber no número de linhas do guia."""
    while True:
        f = fonte(papel, tamanho)
        linhas = _quebrar(frase, f, largura)
        if len(linhas) <= max_linhas or tamanho <= 40:
            return f, linhas
        tamanho -= 4


def _desenhar_linhas(d: ImageDraw.ImageDraw, linhas, f, x: int, y: int, entrelinha: float,
                     cor: str, destaque: str, largura: int | None = None, centro=False) -> int:
    """Desenha linha a linha. Devolve o y logo abaixo do texto."""
    altura = round(f.size * entrelinha)
    espaco = f.getlength(" ")
    for linha in linhas:
        w = sum(f.getlength(p.texto) for p in linha) + espaco * (len(linha) - 1)
        cx = x + (largura - w) / 2 if centro and largura else x
        for p in linha:
            d.text((cx, y), p.texto, font=f, fill=destaque if p.destaque else cor)
            cx += f.getlength(p.texto) + espaco
        y += altura
    return y


def _altura_texto(linhas, f, entrelinha: float) -> int:
    return round(f.size * entrelinha) * len(linhas)


def _selo(d: ImageDraw.ImageDraw, x: int, y: int, texto: str, fundo: str, cor: str) -> tuple[int, int]:
    """Etiqueta em pílula (ANTES, DICA, PASSO 1). Devolve largura e altura."""
    f = fonte("selo", 28)
    texto = texto.upper()
    espac = 28 * 0.14
    w = sum(f.getlength(ch) for ch in texto) + espac * (len(texto) - 1)
    alt = 28 + 2 * 14 + 6
    larg = round(w + 2 * 28)
    d.rounded_rectangle((x, y, x + larg, y + alt), radius=alt // 2, fill=fundo)
    cx = x + 28
    for ch in texto:
        d.text((cx, y + 14), ch, font=f, fill=cor)
        cx += f.getlength(ch) + espac
    return larg, alt


# ---------------------------------------------------------------- fotos

def _abrir(foto: str | Path) -> Image.Image:
    return ImageOps.exif_transpose(Image.open(foto)).convert("RGB")


def _cobrir(img: Image.Image, tamanho: tuple[int, int], foco=(0.5, 0.5)) -> Image.Image:
    """Recorta a foto para preencher o espaço, sem distorcer (borda a borda)."""
    return ImageOps.fit(img, tamanho, Image.LANCZOS, centering=foco)


def _colar_arredondada(base: Image.Image, img: Image.Image, xy: tuple[int, int], raio: int) -> None:
    mascara = Image.new("L", img.size, 0)
    ImageDraw.Draw(mascara).rounded_rectangle((0, 0, img.width - 1, img.height - 1), radius=raio, fill=255)
    base.paste(img, xy, mascara)


def _salvar(img: Image.Image, saida: str | Path) -> Path:
    saida = Path(saida)
    saida.parent.mkdir(parents=True, exist_ok=True)
    # Sem exif=: a peça sai sem os metadados (e sem GPS) da foto original
    img.convert("RGB").save(saida, "JPEG", quality=92, optimize=True)
    return saida


# ================================================================ modelos

def story_frase(foto, frase: str, saida, foco=(0.5, 0.5)) -> Path:
    """Faixa de fundo-rosado com a frase e a foto do resultado embaixo."""
    W, H = STORY
    img = Image.new("RGB", STORY, C["fundo-rosado"])
    d = ImageDraw.Draw(img)
    altura_foto = H - 480
    img.paste(_cobrir(_abrir(foto), (W, altura_foto), foco), (0, H - altura_foto))
    f, linhas = _ajustar(frase, "titulo", 72, W - 2 * MARGEM, 2)
    y = 480 - 56 - _altura_texto(linhas, f, 1.1)
    assert y >= TOPO_SEGURO, "frase longa demais para a faixa do story"
    _desenhar_linhas(d, linhas, f, MARGEM, y, 1.1, C["tinta"], C["rosa"], W - 2 * MARGEM, centro=True)
    return _salvar(img, saida)


def story_antes_depois(antes, depois, saida, foco_antes=(0.5, 0.5), foco_depois=(0.5, 0.5)) -> Path:
    """Metade de cima: antes. Metade de baixo: depois. Mesmo ângulo."""
    W, H = STORY
    img = Image.new("RGB", STORY, C["fundo-rosado"])
    img.paste(_cobrir(_abrir(antes), (W, H // 2), foco_antes), (0, 0))
    img.paste(_cobrir(_abrir(depois), (W, H // 2), foco_depois), (0, H // 2))
    d = ImageDraw.Draw(img)
    d.rectangle((0, H // 2 - 4, W, H // 2 + 4), fill=C["fundo-rosado"])
    _selo(d, MARGEM, TOPO_SEGURO + 30, "Antes", C["tinta"], C["branco"])
    _selo(d, MARGEM, H // 2 + 40, "Depois", C["rosa"], C["branco"])
    return _salvar(img, saida)


def story_dica(titulo: str, texto: str, foto, saida, foco=(0.5, 0.5)) -> Path:
    """Selo DICA, título, até 3 linhas de texto e a foto num cartão."""
    W, H = STORY
    img = Image.new("RGB", STORY, C["fundo-rosado"])
    d = ImageDraw.Draw(img)
    y = 300
    _, alt = _selo(d, MARGEM, y, "Dica", C["rosa-claro"], C["rosa-escuro"])
    y += alt + RESPIRO
    f, linhas = _ajustar(titulo, "titulo", 72, W - 2 * MARGEM, 2)
    y = _desenhar_linhas(d, linhas, f, MARGEM, y, 1.1, C["tinta"], C["rosa"]) + RESPIRO
    f, linhas = _ajustar(texto, "texto", 40, W - 2 * MARGEM, 3)
    y = _desenhar_linhas(d, linhas, f, MARGEM, y, 1.4, C["tinta"], C["rosa-escuro"]) + RESPIRO
    # O cartão vai até a área segura da base
    altura = H - BASE_SEGURA - y
    cartao = _cobrir(_abrir(foto), (W - 2 * MARGEM, altura), foco)
    _colar_arredondada(img, cartao, (MARGEM, y), RAIO_BLOCO)
    return _salvar(img, saida)


def capa_reel(foto, titulo: str, saida, apoio: str | None = None, foco=(0.5, 0.5)) -> Path:
    """Foto de borda a borda e o bloco de título no recorte que a grade mostra."""
    W, H = STORY
    img = _cobrir(_abrir(foto), STORY, foco)
    d = ImageDraw.Draw(img)
    pad_x, pad_y = 56, 48
    f, linhas = _ajustar(titulo, "titulo", 96, W - 2 * MARGEM - 2 * pad_x, 2)
    h = _altura_texto(linhas, f, 1.0) + 2 * pad_y
    fa = fonte("texto", 30)
    if apoio:
        h += 16 + round(30 * 1.3)
    base = H - 300
    topo = base - h
    recorte_topo = (H - GRADE_RECORTE) // 2
    assert topo >= recorte_topo, "título alto demais para o recorte da grade"
    d.rounded_rectangle((MARGEM, topo, W - MARGEM, base), radius=RAIO_BLOCO, fill=C["fundo-rosado"])
    y = _desenhar_linhas(d, linhas, f, MARGEM + pad_x, topo + pad_y, 1.0, C["tinta"], C["rosa"])
    if apoio:
        d.text((MARGEM + pad_x, y + 16), apoio, font=fa, fill=C["cinza"])
    return _salvar(img, saida)


def carrossel(capa: dict, passos: list[dict], final: dict, pasta) -> list[Path]:
    """Gera 01.jpg (capa), os passos e o slide final em `pasta`.

    capa:   {"foto", "titulo", "subtitulo"?}
    passos: [{"titulo", "texto", "foto"}]
    final:  {"pergunta", "chamado"?}
    """
    W, H = SLIDE
    pasta = Path(pasta)
    total = len(passos) + 2
    saidas: list[Path] = []

    # 1. capa
    img = Image.new("RGB", SLIDE, C["fundo-rosado"])
    img.paste(_cobrir(_abrir(capa["foto"]), (W, 900), tuple(capa.get("foco", (0.5, 0.5)))), (0, 0))
    d = ImageDraw.Draw(img)
    f, linhas = _ajustar(capa["titulo"], "titulo", 80, W - 2 * MARGEM, 2)
    fi = fonte("italico", 48)
    h = _altura_texto(linhas, f, 1.05) + (24 + 60 if capa.get("subtitulo") else 0)
    y = _desenhar_linhas(d, linhas, f, MARGEM, H - 96 - h, 1.05, C["tinta"], C["rosa"])
    if capa.get("subtitulo"):
        d.text((MARGEM, y + 24), capa["subtitulo"], font=fi, fill=C["cinza"])
    saidas.append(_salvar(img, pasta / "01.jpg"))

    # 2..n. passos, alternando branco e fundo-rosado
    for i, p in enumerate(passos, start=1):
        fundo = C["branco"] if i % 2 else C["fundo-rosado"]
        img = Image.new("RGB", SLIDE, fundo)
        d = ImageDraw.Draw(img)
        fa = fonte("texto", 30)
        num = f"{i + 1}/{total}"
        d.text((W - MARGEM - fa.getlength(num), 96), num, font=fa, fill=C["cinza"])
        y = 96
        _, alt = _selo(d, MARGEM, y, f"Passo {i}", C["rosa-claro"], C["rosa-escuro"])
        y += alt + RESPIRO
        f, linhas = _ajustar(p["titulo"], "titulo", 64, W - 2 * MARGEM, 2)
        y = _desenhar_linhas(d, linhas, f, MARGEM, y, 1.05, C["tinta"], C["rosa"]) + 24
        f, linhas = _ajustar(p["texto"], "texto", 40, W - 2 * MARGEM, 3)
        y = _desenhar_linhas(d, linhas, f, MARGEM, y, 1.4, C["tinta"], C["rosa-escuro"]) + RESPIRO
        altura = H - 96 - y
        if p.get("foto") and altura > 200:
            cartao = _cobrir(_abrir(p["foto"]), (W - 2 * MARGEM, altura), tuple(p.get("foco", (0.5, 0.5))))
            _colar_arredondada(img, cartao, (MARGEM, y), RAIO_BLOCO)
        saidas.append(_salvar(img, pasta / f"{i + 1:02d}.jpg"))

    # final: chamado em rosa
    img = Image.new("RGB", SLIDE, C["rosa"])
    d = ImageDraw.Draw(img)
    f, l1 = _ajustar(final["pergunta"], "titulo", 80, W - 2 * MARGEM, 3)
    chamado = final.get("chamado", "Me chama no WhatsApp. O link está na bio.")
    fc, l2 = _ajustar(chamado, "texto", 40, W - 2 * MARGEM, 3)
    h = _altura_texto(l1, f, 1.05) + 40 + _altura_texto(l2, fc, 1.4)
    y = (H - h) // 2
    y = _desenhar_linhas(d, l1, f, MARGEM, y, 1.05, C["branco"], C["branco"]) + 40
    _desenhar_linhas(d, l2, fc, MARGEM, y, 1.4, C["branco"], C["branco"])
    saidas.append(_salvar(img, pasta / f"{total:02d}.jpg"))
    return saidas


def capa_destaque(letra: str, saida) -> Path:
    """Capa de destaque: a inicial em Playfair itálico, rosa-escuro."""
    W, H = STORY
    img = Image.new("RGB", STORY, C["fundo-rosado"])
    d = ImageDraw.Draw(img)
    f = fonte("italico", 480)
    caixa = d.textbbox((0, 0), letra, font=f)
    w, h = caixa[2] - caixa[0], caixa[3] - caixa[1]
    d.text(((W - w) / 2 - caixa[0], (H - h) / 2 - caixa[1]), letra, font=f, fill=C["rosa-escuro"])
    return _salvar(img, saida)


MODELOS = {
    "story_frase": story_frase,
    "story_antes_depois": story_antes_depois,
    "story_dica": story_dica,
    "capa_reel": capa_reel,
    "carrossel": carrossel,
    "capa_destaque": capa_destaque,
}
