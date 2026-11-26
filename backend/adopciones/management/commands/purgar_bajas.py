"""Elimina las bajas con 5 años o más y todo su historial asociado."""

from django.core.management.base import BaseCommand

from adopciones.services import purgar_bajas_vencidas


class Command(BaseCommand):
    help = "Purga mascotas Fallecido con fecha_baja de 5 años o más."

    def handle(self, *args, **options):
        cantidad = purgar_bajas_vencidas()
        self.stdout.write(
            self.style.SUCCESS(f"Se eliminaron {cantidad} bajas vencidas.")
        )
