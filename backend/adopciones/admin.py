from django.contrib import admin

from .models import (
    HistorialMedico,
    MascotaRescatada,
    SeguimientoPostAdopcion,
    SolicitudAdopcion,
)

@admin.register(MascotaRescatada)
class MascotaRescatadaAdmin(admin.ModelAdmin):
    """Las bajas se gestionan por estado; se prohíbe el borrado directo."""

    list_display = ("nombre", "codigo_chip", "estado_adopcion", "fecha_baja")
    list_filter = ("estado_adopcion", "especie")
    search_fields = ("nombre", "codigo_chip")

    def has_delete_permission(self, request, obj=None):
        return False


admin.site.register(HistorialMedico)
admin.site.register(SolicitudAdopcion)
admin.site.register(SeguimientoPostAdopcion)
