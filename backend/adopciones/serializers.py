from rest_framework import serializers

from .models import (
    EstadoAdopcion,
    HistorialMedico,
    MascotaRescatada,
    SeguimientoPostAdopcion,
    SolicitudAdopcion,
)


class MascotaRescatadaSerializer(serializers.ModelSerializer):
    imagen_display = serializers.CharField(read_only=True)
    historial_count = serializers.IntegerField(
        source="historial_medico.count", read_only=True
    )
    seguimientos_count = serializers.IntegerField(
        source="seguimientos.count", read_only=True
    )

    class Meta:
        model = MascotaRescatada
        fields = [
            "id",
            "nombre",
            "especie",
            "edad_aproximada_meses",
            "tamaño",
            "sexo",
            "nivel_actividad",
            "estado_adopcion",
            "codigo_chip",
            "fecha_ingreso",
            "historia",
            "imagen",
            "imagen_url",
            "imagen_display",
            "archivada",
            "fecha_baja",
            "historial_count",
            "seguimientos_count",
            "creado_en",
            "actualizado_en",
        ]
        read_only_fields = ["creado_en", "actualizado_en"]

    def validate(self, attrs):
        """En Bajas solo se permite cambiar el estado; el resto queda intacto."""
        if (
            self.instance
            and self.instance.estado_adopcion == EstadoAdopcion.FALLECIDO
            and set(attrs) - {"estado_adopcion"}
        ):
            raise serializers.ValidationError(
                "Una mascota en Bajas solo puede cambiar de estado; "
                "no se pueden modificar sus datos."
            )
        return attrs


class HistorialMedicoSerializer(serializers.ModelSerializer):
    class Meta:
        model = HistorialMedico
        fields = [
            "id",
            "mascota",
            "tipo_procedimiento",
            "descripcion",
            "fecha_procedimiento",
            "veterinario_responsable",
        ]


class SolicitudAdopcionSerializer(serializers.ModelSerializer):
    adoptante = serializers.PrimaryKeyRelatedField(read_only=True)
    mascota_nombre = serializers.CharField(source="mascota.nombre", read_only=True)

    class Meta:
        model = SolicitudAdopcion
        fields = [
            "id",
            "mascota",
            "mascota_nombre",
            "adoptante",
            "nombre_adoptante",
            "correo_contacto",
            "telefono",
            "direccion_residencia",
            "caracteristicas_hogar",
            "convivencia_otras_mascotas",
            "motivo_adopcion",
            "estado_solicitud",
            "fecha_solicitud",
            "fecha_resolucion",
            "observaciones_admin",
        ]
        read_only_fields = [
            "adoptante",
            "estado_solicitud",
            "fecha_solicitud",
            "fecha_resolucion",
            "observaciones_admin",
        ]


class SeguimientoPostAdopcionSerializer(serializers.ModelSerializer):
    semaforo = serializers.CharField(read_only=True)
    evidencia_display = serializers.CharField(read_only=True)
    mascota_nombre = serializers.CharField(source="mascota.nombre", read_only=True)

    class Meta:
        model = SeguimientoPostAdopcion
        fields = [
            "id",
            "solicitud",
            "mascota",
            "mascota_nombre",
            "numero_reporte",
            "mes_programado",
            "fecha_limite",
            "archivo_evidencia",
            "url_evidencia",
            "evidencia_display",
            "observaciones_adoptante",
            "estado",
            "semaforo",
            "fecha_envio",
            "fecha_revision",
            "retroalimentacion",
        ]
        read_only_fields = [
            "solicitud",
            "mascota",
            "numero_reporte",
            "mes_programado",
            "fecha_limite",
            "estado",
            "fecha_envio",
            "fecha_revision",
            "retroalimentacion",
        ]
