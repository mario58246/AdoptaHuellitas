"""Rutas globales de la API Adopta Huellitas."""

from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.http import HttpResponse, JsonResponse
from django.urls import include, path
from django.views.generic import RedirectView
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from adopciones.serializers import AdoptaTokenObtainPairSerializer
from adopciones.views import (
    HistorialMedicoViewSet,
    MascotaViewSet,
    RegistroAdoptanteView,
    SeguimientoPostAdopcionViewSet,
    SolicitudAdopcionViewSet,
)


class AdoptaTokenObtainPairView(TokenObtainPairView):
    serializer_class = AdoptaTokenObtainPairSerializer


router = DefaultRouter()
router.register("mascotas", MascotaViewSet, basename="mascota")
router.register("historial-medico", HistorialMedicoViewSet, basename="historial")
router.register("solicitudes", SolicitudAdopcionViewSet, basename="solicitud")
router.register("seguimientos", SeguimientoPostAdopcionViewSet, basename="seguimiento")


def health(request):
    """Endpoint simple para comprobaciones de Render/VS Code."""
    return JsonResponse({"status": "ok", "proyecto": "Adopta Huellitas"})


def favicon(request):
    """Evita el 404 del icono en la consola de desarrollo."""
    return HttpResponse(status=204)


urlpatterns = [
    path("", RedirectView.as_view(url="/api/", permanent=False)),
    path("health", health, name="health"),
    path("favicon.ico", favicon),
    path("admin/", admin.site.urls),
    path("api/token/", AdoptaTokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("api/token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path(
        "api/usuarios/registro/",
        RegistroAdoptanteView.as_view({"post": "create"}),
        name="registro_adoptante",
    ),
    path("api/", include(router.urls)),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
