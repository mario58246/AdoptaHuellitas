"""Rutas globales de la API Adopta Huellitas."""

from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import include, path
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from adopciones.views import (
    HistorialMedicoViewSet,
    MascotaViewSet,
    SeguimientoPostAdopcionViewSet,
    SolicitudAdopcionViewSet,
)

router = DefaultRouter()
router.register("mascotas", MascotaViewSet, basename="mascota")
router.register("historial-medico", HistorialMedicoViewSet, basename="historial")
router.register("solicitudes", SolicitudAdopcionViewSet, basename="solicitud")
router.register("seguimientos", SeguimientoPostAdopcionViewSet, basename="seguimiento")

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/token/", TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("api/token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("api/", include(router.urls)),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
