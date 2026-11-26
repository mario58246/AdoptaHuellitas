from django.utils import timezone
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.exceptions import PermissionDenied, ValidationError
from rest_framework.permissions import IsAdminUser, IsAuthenticated
from rest_framework.response import Response

from .models import (
    EstadoAdopcion,
    HistorialMedico,
    MascotaRescatada,
    SeguimientoPostAdopcion,
    SolicitudAdopcion,
)
from .serializers import (
    HistorialMedicoSerializer,
    MascotaRescatadaSerializer,
    SeguimientoPostAdopcionSerializer,
    SolicitudAdopcionSerializer,
)
from .services import aprobar_solicitud, purgar_bajas_vencidas, rechazar_solicitud


class MascotaViewSet(viewsets.ModelViewSet):
    """Catálogo público de lectura y CRUD privado del refugio."""

    serializer_class = MascotaRescatadaSerializer
    queryset = MascotaRescatada.objects.all()
    # No se permite borrado directo: las bajas se gestionan por estado.
    http_method_names = ["get", "post", "put", "patch", "head", "options"]
    filterset_fields = [
        "especie",
        "tamaño",
        "sexo",
        "nivel_actividad",
        "estado_adopcion",
        "archivada",
    ]
    search_fields = ["nombre", "codigo_chip", "historia"]
    ordering_fields = ["fecha_ingreso", "edad_aproximada_meses", "nombre"]

    def get_queryset(self):
        if self.action in {"list", "bajas"}:
            purgar_bajas_vencidas()
        queryset = MascotaRescatada.objects.all()
        if self.action == "list":
            queryset = queryset.exclude(estado_adopcion=EstadoAdopcion.FALLECIDO)
        elif self.action == "bajas":
            queryset = queryset.filter(estado_adopcion=EstadoAdopcion.FALLECIDO)
        elif self.action == "retrieve" and not self.request.user.is_staff:
            queryset = queryset.exclude(estado_adopcion=EstadoAdopcion.FALLECIDO)
        return queryset

    def get_permissions(self):
        if self.action in {"list", "retrieve"}:
            return []
        return [IsAdminUser()]

    @action(detail=False, methods=["get"], permission_classes=[IsAdminUser])
    def bajas(self, request):
        """Listado exclusivo de mascotas dadas de baja (Fallecido)."""
        return Response(self.get_serializer(self.get_queryset(), many=True).data)


class HistorialMedicoViewSet(viewsets.ModelViewSet):
    """Ficha clínica: lectura pública, escritura exclusiva del refugio."""

    serializer_class = HistorialMedicoSerializer
    queryset = HistorialMedico.objects.exclude(
        mascota__estado_adopcion=EstadoAdopcion.FALLECIDO
    )
    filterset_fields = ["mascota", "tipo_procedimiento"]
    ordering_fields = ["fecha_procedimiento"]

    def get_permissions(self):
        if self.action in {"list", "retrieve"}:
            return []
        return [IsAdminUser()]


class SolicitudAdopcionViewSet(viewsets.ModelViewSet):
    """Postulaciones: el adoptante ve las suyas; el refugio gestiona todas."""

    serializer_class = SolicitudAdopcionSerializer

    def get_queryset(self):
        queryset = SolicitudAdopcion.objects.select_related("mascota", "adoptante")
        queryset = queryset.exclude(
            mascota__estado_adopcion=EstadoAdopcion.FALLECIDO
        )
        user = self.request.user
        if not user.is_authenticated:
            return queryset.none()
        if user.is_staff:
            return queryset
        return queryset.filter(adoptante=user)

    def get_permissions(self):
        if self.action in {"aprobar", "rechazar"}:
            return [IsAdminUser()]
        return [IsAuthenticated()]

    def perform_create(self, serializer):
        solicitud = serializer.save(adoptante=self.request.user)
        mascota = solicitud.mascota
        if mascota.estado_adopcion == EstadoAdopcion.DISPONIBLE:
            mascota.estado_adopcion = EstadoAdopcion.EN_PROCESO
            mascota.save(update_fields=["estado_adopcion", "actualizado_en"])

    @action(detail=True, methods=["post"], permission_classes=[IsAdminUser])
    def aprobar(self, request, pk=None):
        solicitud = self.get_object()
        aprobar_solicitud(solicitud, request.data.get("observaciones", ""))
        return Response(self.get_serializer(solicitud).data)

    @action(detail=True, methods=["post"], permission_classes=[IsAdminUser])
    def rechazar(self, request, pk=None):
        solicitud = self.get_object()
        rechazar_solicitud(solicitud, request.data.get("observaciones", ""))
        return Response(self.get_serializer(solicitud).data)


class SeguimientoPostAdopcionViewSet(viewsets.ModelViewSet):
    """Portal de seguimiento: evidencia del adoptante y auditoría del refugio."""

    serializer_class = SeguimientoPostAdopcionSerializer
    queryset = SeguimientoPostAdopcion.objects.exclude(
        mascota__estado_adopcion=EstadoAdopcion.FALLECIDO
    )
    filterset_fields = ["solicitud", "mascota", "estado", "numero_reporte"]
    ordering_fields = ["numero_reporte", "fecha_limite"]

    def get_queryset(self):
        queryset = SeguimientoPostAdopcion.objects.select_related(
            "solicitud", "mascota"
        )
        user = self.request.user
        if not user.is_authenticated:
            return queryset.none()
        if user.is_staff:
            return queryset
        return queryset.filter(solicitud__adoptante=user)

    def get_permissions(self):
        if self.action in {"aprobar", "solicitar_correccion"}:
            return [IsAdminUser()]
        return [IsAuthenticated()]

    @action(detail=True, methods=["patch"], url_path="enviar-evidencia")
    def enviar_evidencia(self, request, pk=None):
        reporte = self.get_object()
        if (
            not request.user.is_staff
            and reporte.solicitud.adoptante_id != request.user.id
        ):
            raise PermissionDenied("Este reporte pertenece a otro adoptante.")

        if "archivo_evidencia" in request.FILES:
            reporte.archivo_evidencia = request.FILES["archivo_evidencia"]
        if "url_evidencia" in request.data:
            reporte.url_evidencia = request.data.get("url_evidencia", "")
        if "observaciones_adoptante" in request.data:
            reporte.observaciones_adoptante = request.data.get(
                "observaciones_adoptante", ""
            )
        if not reporte.archivo_evidencia and not reporte.url_evidencia:
            raise ValidationError("Adjunta un archivo o una URL de evidencia.")

        reporte.estado = SeguimientoPostAdopcion.EstadoReporte.EN_REVISION
        reporte.fecha_envio = timezone.now()
        reporte.save()
        return Response(self.get_serializer(reporte).data)

    @action(detail=True, methods=["post"])
    def aprobar(self, request, pk=None):
        reporte = self.get_object()
        reporte.estado = SeguimientoPostAdopcion.EstadoReporte.APROBADO
        reporte.fecha_revision = timezone.now()
        reporte.retroalimentacion = request.data.get("retroalimentacion", "")
        reporte.save()
        return Response(self.get_serializer(reporte).data)

    @action(detail=True, methods=["post"], url_path="solicitar-correccion")
    def solicitar_correccion(self, request, pk=None):
        reporte = self.get_object()
        reporte.estado = SeguimientoPostAdopcion.EstadoReporte.PENDIENTE
        reporte.retroalimentacion = request.data.get("retroalimentacion", "")
        reporte.save()
        return Response(self.get_serializer(reporte).data)
