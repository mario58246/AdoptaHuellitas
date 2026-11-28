from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError as DjangoValidationError
from rest_framework import serializers
from rest_framework.request import Request
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

from .imagenes import validar_url_imagen
from .models import (
    EstadoAdopcion,
    HistorialMedico,
    MascotaRescatada,
    SeguimientoPostAdopcion,
    SolicitudAdopcion,
)

User = get_user_model()


class RegistroAdoptanteSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, trim_whitespace=False)
    password_confirmacion = serializers.CharField(
        write_only=True, trim_whitespace=False
    )

    class Meta:
        model = User
        fields = [
            "id",
            "username",
            "email",
            "first_name",
            "last_name",
            "password",
            "password_confirmacion",
        ]
        read_only_fields = ["id"]
        extra_kwargs = {
            "email": {"required": True},
            "first_name": {"required": True},
            "last_name": {"required": True},
        }

    def validate_email(self, value):
        email = value.strip().lower()
        if User.objects.filter(email__iexact=email).exists():
            raise serializers.ValidationError(
                "Ya existe una cuenta registrada con este correo."
            )
        return email

    def validate(self, attrs):
        password = attrs.get("password")
        if password != attrs.get("password_confirmacion"):
            raise serializers.ValidationError(
                {"password_confirmacion": "Las contraseñas no coinciden."}
            )

        user = User(
            username=attrs.get("username"),
            email=attrs.get("email"),
            first_name=attrs.get("first_name"),
            last_name=attrs.get("last_name"),
        )
        try:
            validate_password(password, user=user)
        except DjangoValidationError as error:
            raise serializers.ValidationError(
                {"password": list(error.messages)}
            ) from error
        return attrs

    def create(self, validated_data):
        validated_data.pop("password_confirmacion")
        password = validated_data.pop("password")
        return User.objects.create_user(password=password, **validated_data)


class AdoptaTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)
        data.update(
            {
                "is_staff": self.user.is_staff,
                "username": self.user.get_username(),
                "first_name": self.user.first_name,
                "last_name": self.user.last_name,
                "email": self.user.email,
            }
        )
        return data


class MascotaRescatadaSerializer(serializers.ModelSerializer):
    imagen_display = serializers.SerializerMethodField()
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

    def get_imagen_display(self, obj):
        """Devuelve una URL absoluta para que el frontend pueda mostrar la foto."""
        imagen = obj.imagen_display
        if not imagen:
            return None
        if imagen.startswith("/"):
            request = self.context.get("request")
            if isinstance(request, Request):
                return request.build_absolute_uri(imagen)
            return f"http://127.0.0.1:8000{imagen}"
        return imagen

    def validate_imagen_url(self, valor):
        """Evita guardar páginas web como si fueran fotos."""
        return validar_url_imagen(valor)

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

    def validate_mascota(self, mascota):
        if (
            mascota.estado_adopcion != EstadoAdopcion.DISPONIBLE
            or mascota.archivada
        ):
            raise serializers.ValidationError(
                "Esta mascota ya no está disponible para nuevas solicitudes."
            )
        return mascota

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
