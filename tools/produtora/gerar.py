"""Gera peças do Instagram a partir de um roteiro em JSON.

Uso:
    python tools/produtora/gerar.py roteiro.json

O roteiro é uma lista de peças. Caminhos relativos partem da pasta do roteiro.
Veja exemplo.json.
"""

import json
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent))
import pecas  # noqa: E402

CAMPOS_DE_CAMINHO = {"foto", "antes", "depois", "saida", "pasta"}


def _resolver(valor, base: Path):
    if isinstance(valor, dict):
        return {k: (str(base / v) if k in CAMPOS_DE_CAMINHO and isinstance(v, str) else _resolver(v, base)) for k, v in valor.items()}
    if isinstance(valor, list):
        return [_resolver(v, base) for v in valor]
    return valor


def main(caminho: str) -> None:
    roteiro = Path(caminho).resolve()
    base = roteiro.parent
    for peca in json.loads(roteiro.read_text(encoding="utf-8")):
        peca = _resolver(dict(peca), base)
        modelo = peca.pop("modelo")
        if "foco" in peca:
            peca["foco"] = tuple(peca["foco"])
        resultado = pecas.MODELOS[modelo](**peca)
        for r in resultado if isinstance(resultado, list) else [resultado]:
            print(f"{modelo}: {r}")
    for aviso in sorted(pecas.avisos):
        print("aviso:", aviso)


if __name__ == "__main__":
    if len(sys.argv) != 2:
        sys.exit(__doc__)
    main(sys.argv[1])
