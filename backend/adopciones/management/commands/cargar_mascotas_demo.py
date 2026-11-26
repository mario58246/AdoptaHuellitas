"""Carga mascotas de muestra sin modificar los registros existentes."""

from django.core.management.base import BaseCommand

from adopciones.models import MascotaRescatada

MASCOTAS_DEMO = (
    {
        "nombre": "Lía",
        "especie": "Perro",
        "edad_aproximada_meses": 18,
        "tamaño": "Mediano",
        "sexo": "Hembra",
        "nivel_actividad": "Medio",
        "codigo_chip": "999999999999901",
        "historia": "Es una compañera dulce y sociable. Disfruta los paseos tranquilos y aprender juegos nuevos.",
        "imagen_url": "https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=900&q=85",
    },
    {
        "nombre": "Simón",
        "especie": "Gato",
        "edad_aproximada_meses": 10,
        "tamaño": "Pequeño",
        "sexo": "Macho",
        "nivel_actividad": "Alto",
        "codigo_chip": "999999999999902",
        "historia": "Curioso y juguetón, le gusta explorar cada rincón y después dormir cerca de su gente.",
        "imagen_url": "https://images.unsplash.com/photo-1573865526739-10659fec78a5?auto=format&fit=crop&w=900&q=85",
    },
    {
        "nombre": "Canela",
        "especie": "Perro",
        "edad_aproximada_meses": 36,
        "tamaño": "Grande",
        "sexo": "Hembra",
        "nivel_actividad": "Medio",
        "codigo_chip": "999999999999903",
        "historia": "Una perra tranquila y compañera que espera una familia para compartir caminatas y siestas al sol.",
        "imagen_url": "https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=900&q=85",
    },
    {
        "nombre": "Nube",
        "especie": "Gato",
        "edad_aproximada_meses": 14,
        "tamaño": "Pequeño",
        "sexo": "Hembra",
        "nivel_actividad": "Bajo",
        "codigo_chip": "999999999999904",
        "historia": "Afectuosa y serena; su plan favorito es encontrar un rincón tibio y recibir caricias.",
        "imagen_url": "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=900&q=85",
    },
    {
        "nombre": "Bruno",
        "especie": "Perro",
        "edad_aproximada_meses": 24,
        "tamaño": "Mediano",
        "sexo": "Macho",
        "nivel_actividad": "Alto",
        "codigo_chip": "999999999999905",
        "historia": "Alegre y activo, disfruta jugar al aire libre y compartir aventuras con su familia.",
        "imagen_url": "https://images.unsplash.com/photo-1605568427561-40dd23c2acea?auto=format&fit=crop&w=900&q=85",
    },
)


class Command(BaseCommand):
    help = "Agrega mascotas de muestra al catálogo sin modificar registros existentes."

    def handle(self, *args, **options):
        creadas = 0
        existentes = 0

        for datos in MASCOTAS_DEMO:
            _, creada = MascotaRescatada.objects.get_or_create(
                codigo_chip=datos["codigo_chip"],
                defaults=datos,
            )
            if creada:
                creadas += 1
            else:
                existentes += 1

        self.stdout.write(
            self.style.SUCCESS(
                f"Mascotas de ejemplo creadas: {creadas}; ya existentes: {existentes}."
            )
        )
