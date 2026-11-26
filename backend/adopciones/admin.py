from django.contrib import admin

from .models import (
    HistorialMedico,
    MascotaRescatada,
    SeguimientoPostAdopcion,
    SolicitudAdopcion,
)

admin.site.register(MascotaRescatada)
admin.site.register(HistorialMedico)
admin.site.register(SolicitudAdopcion)
admin.site.register(SeguimientoPostAdopcion)
