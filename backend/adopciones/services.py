"""Reglas de negocio del ciclo de adopción.

Al aprobar una solicitud se ejecuta en una sola transacción:
  1. La solicitud pasa a Aprobada.
  2. La mascota pasa a Adoptado.
  3. Se generan los 15 reportes del seguimiento (meses 1-12 y 16, 20, 24).
"""

from calendar import monthrange

from django.db import transaction
from django.utils import timezone

from .models import EstadoAdopcion, SeguimientoPostAdopcion, SolicitudAdopcion

MESES_REPORTES = list(range(1, 13)) + [16, 20, 24]


def sumar_meses(fecha, meses):
    """Suma meses a una fecha respetando el último día de cada mes."""
    indice = fecha.month - 1 + meses
    anio = fecha.year + indice // 12
    mes = indice % 12 + 1
    dia = min(fecha.day, monthrange(anio, mes)[1])
    return fecha.replace(year=anio, month=mes, day=dia)


def generar_cronograma_seguimiento(solicitud):
    """Crea (o respeta) los 15 hitos de seguimiento de una adopción."""
    fecha_inicio = solicitud.fecha_resolucion.date() if solicitud.fecha_resolucion else timezone.localdate()

    for numero, mes in enumerate(MESES_REPORTES, start=1):
        SeguimientoPostAdopcion.objects.get_or_create(
            solicitud=solicitud,
            numero_reporte=numero,
            defaults={
                "mascota": solicitud.mascota,
                "mes_programado": mes,
                "fecha_limite": sumar_meses(fecha_inicio, mes),
            },
        )


@transaction.atomic
def aprobar_solicitud(solicitud, observaciones=""):
    """Aprueba la solicitud, actualiza la mascota y genera el cronograma."""
    solicitud.estado_solicitud = SolicitudAdopcion.EstadoSolicitud.APROBADA
    solicitud.fecha_resolucion = timezone.now()
    if observaciones:
        solicitud.observaciones_admin = observaciones
    solicitud.save(
        update_fields=[
            "estado_solicitud",
            "fecha_resolucion",
            "observaciones_admin",
        ]
    )

    mascota = solicitud.mascota
    mascota.estado_adopcion = EstadoAdopcion.ADOPTADO
    mascota.save(update_fields=["estado_adopcion", "actualizado_en"])

    generar_cronograma_seguimiento(solicitud)
    return solicitud


@transaction.atomic
def rechazar_solicitud(solicitud, observaciones=""):
    """Rechaza la solicitud y deja la mascota disponible."""
    solicitud.estado_solicitud = SolicitudAdopcion.EstadoSolicitud.RECHAZADA
    solicitud.fecha_resolucion = timezone.now()
    if observaciones:
        solicitud.observaciones_admin = observaciones
    solicitud.save(
        update_fields=[
            "estado_solicitud",
            "fecha_resolucion",
            "observaciones_admin",
        ]
    )

    mascota = solicitud.mascota
    if mascota.estado_adopcion == EstadoAdopcion.EN_PROCESO:
        mascota.estado_adopcion = EstadoAdopcion.DISPONIBLE
        mascota.save(update_fields=["estado_adopcion", "actualizado_en"])
    return solicitud
