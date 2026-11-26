"""Utilidades para aceptar solo URLs que realmente apuntan a una imagen."""

from urllib.error import URLError
from urllib.parse import urlparse
from urllib.request import Request, urlopen

from django.core.exceptions import ValidationError

EXTENSIONES_IMAGEN = (
    ".jpg",
    ".jpeg",
    ".png",
    ".gif",
    ".webp",
    ".avif",
    ".svg",
    ".bmp",
)

HOSTS_IMAGEN = (
    "img.magnific.com",
    "images.unsplash.com",
    "res.cloudinary.com",
    "drive.google.com",
    "lh3.googleusercontent.com",
    "firebasestorage.googleapis.com",
    "raw.githubusercontent.com",
)

MENSAJE_URL_INVALIDA = (
    "La URL debe apuntar directamente a una imagen, no a una página web. "
    "Entrá a la foto, clic derecho y elegí “Copiar dirección de imagen”. "
    "Ejemplo: https://img.magnific.com/vector-gratis/vaca_96037-417.jpg"
)


def validar_url_imagen(valor):
    """Acepta URLs de imagen y rechaza páginas HTML con mensaje claro."""
    if not valor:
        return valor

    parsed = urlparse(valor)
    if parsed.scheme not in ("http", "https") or not parsed.netloc:
        raise ValidationError(MENSAJE_URL_INVALIDA)

    ruta = parsed.path.lower()
    if ruta.endswith(EXTENSIONES_IMAGEN):
        return valor
    if any(host in parsed.netloc.lower() for host in HOSTS_IMAGEN):
        return valor

    headers = {
        "User-Agent": (
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
            "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36"
        ),
        "Accept": "image/avif,image/webp,image/apng,image/*,*/*;q=0.8",
    }

    try:
        peticion = Request(valor, headers=headers, method="HEAD")
        with urlopen(peticion, timeout=5) as respuesta:
            if respuesta.headers.get_content_type().startswith("image/"):
                return valor
    except (OSError, URLError, ValueError):
        pass

    raise ValidationError(MENSAJE_URL_INVALIDA)
