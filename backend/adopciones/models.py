import re

from django.conf import settings
from django.core.exceptions import ValidationError
from django.core.validators import MaxValueValidator, MinValueValidator
from django.db import models
from django.utils import timezone

CHIP_PATTERN = re.compile(r"^\d{15}$")


def validar_codigo_chip(value):
    """Valida el microchip según ISO 11784/11785: 15 dígitos, sin letras ni guiones."""
    if not CHIP_PATTERN.fullmatch(value or ""):
        raise ValidationError(
            "El microchip debe tener 15 dígitos numéricos (ISO 11784/11785), "
            "por ejemplo 981000123456789."
        )


class Especie(models.TextChoices):
    PERRO = "Perro", "Perro"
    GATO = "Gato", "Gato"
    OTRO = "Otro", "Otro"


class Tamano(models.TextChoices):
    PEQUENO = "Pequeño", "Pequeño"
    MEDIANO = "Mediano", "Mediano"
    GRANDE = "Grande", "Grande"


class Sexo(models.TextChoices):
    MACHO = "Macho", "Macho"
    HEMBRA = "Hembra", "Hembra"


class NivelActividad(models.TextChoices):
    BAJO = "Bajo", "Bajo"
    MEDIO = "Medio", "Medio"
    ALTO = "Alto", "Alto"


class EstadoAdopcion(models.TextChoices):
    DISPONIBLE = "Disponible", "Disponible"
    EN_PROCESO = "En Proceso", "En Proceso"
    ADOPTADO = "Adoptado", "Adoptado"
    FALLECIDO = "Fallecido", "Fallecido"


class MascotaRescatada(models.Model):
    """Ficha principal de un animal rescatado por el refugio."""

    nombre = models.CharField(max_length=80)
    especie = models.CharField(max_length=10, choices=Especie.choices)
    edad_aproximada_meses = models.PositiveIntegerField()
    tamaño = models.CharField(max_length=10, choices=Tamano.choices)
    sexo = models.CharField(
        max_length=10, choices=Sexo.choices, blank=True, default=""
    )
    nivel_actividad = models.CharField(
        max_length=10, choices=NivelActividad.choices, blank=True, default=""
    )
    estado_adopcion = models.CharField(
        max_length=15,
        choices=EstadoAdopcion.choices,
        default=EstadoAdopcion.DISPONIBLE,
    )
    codigo_chip = models.CharField(
        max_length=15,
        unique=True,
        validators=[validar_codigo_chip],
        help_text="ISO 11784/11785: 15 dígitos, por ejemplo 981000123456789.",
    )
    fecha_ingreso = models.DateField(default=timezone.localdate)
    historia = models.TextField(blank=True)
    imagen = models.ImageField(upload_to="mascotas/", blank=True, null=True)
    imagen_url = models.URLField(blank=True)
    archivada = models.BooleanField(default=False)
    fecha_baja = models.DateField(
        null=True,
        blank=True,
        help_text="Fecha en que pasó a Fallecido; inicia el plazo de 5 años.",
    )
    creado_en = models.DateTimeField(auto_now_add=True)
    actualizado_en = models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):
        """Registra la fecha de baja al pasar a Fallecido y la limpia al reactivar."""
        anterior = None
        if self.pk:
            anterior = (
                type(self)
                .objects.filter(pk=self.pk)
                .values_list("estado_adopcion", flat=True)
                .first()
            )

        if self.estado_adopcion == EstadoAdopcion.FALLECIDO:
            if anterior != EstadoAdopcion.FALLECIDO:
                self.fecha_baja = timezone.localdate()
        elif anterior == EstadoAdopcion.FALLECIDO:
            self.fecha_baja = None

        actualizados = kwargs.get("update_fields")
        if actualizados is not None:
            campos = set(actualizados)
            campos.add("fecha_baja")
            kwargs["update_fields"] = list(campos)

        super().save(*args, **kwargs)

    class Meta:
        verbose_name = "Mascota rescatada"
        verbose_name_plural = "Mascotas rescatadas"
        ordering = ["-fecha_ingreso"]

    def __str__(self):
        return f"{self.nombre} ({self.codigo_chip})"

    @property
    def imagen_display(self):
        """Unifica carga local, URL externa (Cloudinary/Drive) y placeholder."""
        if self.imagen:
            return self.imagen.url
        if self.imagen_url:
            return self.imagen_url
        return None


class HistorialMedico(models.Model):
    """Registro cronológico de atención veterinaria de una mascota."""

    class TipoProcedimiento(models.TextChoices):
        VACUNA = "Vacuna", "Vacuna"
        DESPARASITACION = "Desparasitación", "Desparasitación"
        ESTERILIZACION = "Esterilización", "Esterilización"
        CONSULTA = "Consulta", "Consulta"
        CIRUGIA = "Cirugía", "Cirugía"

    mascota = models.ForeignKey(
        MascotaRescatada,
        on_delete=models.CASCADE,
        related_name="historial_medico",
    )
    tipo_procedimiento = models.CharField(
        max_length=20, choices=TipoProcedimiento.choices
    )
    descripcion = models.TextField()
    fecha_procedimiento = models.DateField()
    veterinario_responsable = models.CharField(max_length=120)

    class Meta:
        verbose_name = "Registro médico"
        verbose_name_plural = "Historial médico"
        ordering = ["-fecha_procedimiento"]

    def __str__(self):
        return f"{self.tipo_procedimiento} - {self.mascota.nombre}"


class SolicitudAdopcion(models.Model):
    """Postulación de un adoptante para una mascota."""

    class EstadoSolicitud(models.TextChoices):
        PENDIENTE = "Pendiente", "Pendiente"
        EN_REVISION = "En Revisión", "En Revisión"
        APROBADA = "Aprobada", "Aprobada"
        RECHAZADA = "Rechazada", "Rechazada"

    mascota = models.ForeignKey(
        MascotaRescatada,
        on_delete=models.CASCADE,
        related_name="solicitudes",
    )
    adoptante = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="solicitudes",
    )
    nombre_adoptante = models.CharField(max_length=120)
    correo_contacto = models.EmailField()
    telefono = models.CharField(max_length=30)
    direccion_residencia = models.CharField(max_length=200)
    caracteristicas_hogar = models.TextField(blank=True)
    convivencia_otras_mascotas = models.TextField(blank=True)
    motivo_adopcion = models.TextField(blank=True)
    estado_solicitud = models.CharField(
        max_length=15,
        choices=EstadoSolicitud.choices,
        default=EstadoSolicitud.PENDIENTE,
    )
    fecha_solicitud = models.DateTimeField(auto_now_add=True)
    fecha_resolucion = models.DateTimeField(null=True, blank=True)
    observaciones_admin = models.TextField(blank=True)

    class Meta:
        verbose_name = "Solicitud de adopción"
        verbose_name_plural = "Solicitudes de adopción"
        ordering = ["-fecha_solicitud"]

    def __str__(self):
        return f"{self.nombre_adoptante} → {self.mascota.nombre}"


class SeguimientoPostAdopcion(models.Model):
    """Uno de los 15 hitos obligatorios del plan de seguimiento a 24 meses."""

    class EstadoReporte(models.TextChoices):
        PENDIENTE = "Pendiente", "Pendiente"
        EN_REVISION = "En Revisión", "En Revisión"
        APROBADO = "Aprobado", "Aprobado"
        VENCIDO = "Vencido", "Vencido"

    solicitud = models.ForeignKey(
        SolicitudAdopcion,
        on_delete=models.CASCADE,
        related_name="seguimientos",
    )
    mascota = models.ForeignKey(
        MascotaRescatada,
        on_delete=models.CASCADE,
        related_name="seguimientos",
    )
    numero_reporte = models.PositiveIntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(15)]
    )
    mes_programado = models.PositiveIntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(24)]
    )
    fecha_limite = models.DateField()
    archivo_evidencia = models.FileField(
        upload_to="evidencias/", blank=True, null=True
    )
    url_evidencia = models.URLField(blank=True)
    observaciones_adoptante = models.TextField(blank=True)
    estado = models.CharField(
        max_length=15,
        choices=EstadoReporte.choices,
        default=EstadoReporte.PENDIENTE,
    )
    fecha_envio = models.DateTimeField(null=True, blank=True)
    fecha_revision = models.DateTimeField(null=True, blank=True)
    retroalimentacion = models.TextField(blank=True)

    class Meta:
        verbose_name = "Reporte de seguimiento"
        verbose_name_plural = "Reportes de seguimiento"
        ordering = ["numero_reporte"]
        constraints = [
            models.UniqueConstraint(
                fields=["solicitud", "numero_reporte"],
                name="unique_reporte_por_solicitud",
            )
        ]

    def __str__(self):
        return f"Reporte {self.numero_reporte} - {self.mascota.nombre}"

    @property
    def evidencia_display(self):
        if self.archivo_evidencia:
            return self.archivo_evidencia.url
        return self.url_evidencia or None

    @property
    def semaforo(self):
        """Color de la semaforización: verde, azul, amarillo o rojo."""
        if self.estado == self.EstadoReporte.APROBADO:
            return "verde"
        if self.estado == self.EstadoReporte.EN_REVISION:
            return "azul"
        if self.estado == self.EstadoReporte.VENCIDO:
            return "rojo"
        if self.fecha_limite < timezone.localdate():
            return "rojo"
        return "amarillo"
