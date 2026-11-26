from datetime import date

from django.contrib.auth import get_user_model
from django.core.exceptions import ValidationError
from django.test import TestCase
from rest_framework.test import APIClient

from .models import (
    EstadoAdopcion,
    MascotaRescatada,
    SolicitudAdopcion,
    SeguimientoPostAdopcion,
    validar_codigo_chip,
)
from .services import aprobar_solicitud, sumar_meses


class ReglasNegocioTests(TestCase):
    def setUp(self):
        self.usuario = get_user_model().objects.create_user(
            username="angie", password="clave-segura-123"
        )
        self.mascota = MascotaRescatada.objects.create(
            nombre="Nala",
            especie="Perro",
            edad_aproximada_meses=24,
            tamaño="Mediano",
            codigo_chip="CHIP-9810-12345",
        )
        self.solicitud = SolicitudAdopcion.objects.create(
            mascota=self.mascota,
            adoptante=self.usuario,
            nombre_adoptante="Angie Galindez",
            correo_contacto="angie@example.com",
            telefono="3001234567",
            direccion_residencia="Calle 1 # 2-3",
        )

    def test_microchip_formato_valido(self):
        validar_codigo_chip("CHIP-9810-12345")

    def test_microchip_formato_invalido(self):
        with self.assertRaises(ValidationError):
            validar_codigo_chip("CHIP-981-X1234")

    def test_sumar_meses_respeta_fin_de_mes(self):
        self.assertEqual(sumar_meses(date(2026, 1, 31), 1), date(2026, 2, 28))

    def test_aprobar_genera_quince_reportes_y_actualiza_mascota(self):
        aprobar_solicitud(self.solicitud)

        self.mascota.refresh_from_db()
        self.assertEqual(self.mascota.estado_adopcion, EstadoAdopcion.ADOPTADO)

        reportes = SeguimientoPostAdopcion.objects.filter(solicitud=self.solicitud)
        self.assertEqual(reportes.count(), 15)
        self.assertEqual(
            list(reportes.values_list("mes_programado", flat=True)),
            list(range(1, 13)) + [16, 20, 24],
        )
        self.assertEqual(
            reportes.get(numero_reporte=15).semaforo, "amarillo"
        )


class ApiTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.usuario = get_user_model().objects.create_user(
            username="adoptante", password="clave-segura-123"
        )
        self.admin = get_user_model().objects.create_superuser(
            username="admin", password="clave-segura-123"
        )
        self.mascota = MascotaRescatada.objects.create(
            nombre="Mora",
            especie="Gato",
            edad_aproximada_meses=12,
            tamaño="Pequeño",
            codigo_chip="CHIP-1234-54321",
        )
        self.solicitud = SolicitudAdopcion.objects.create(
            mascota=self.mascota,
            adoptante=self.usuario,
            nombre_adoptante="Angie Galindez",
            correo_contacto="angie@example.com",
            telefono="3001234567",
            direccion_residencia="Calle 1 # 2-3",
        )

    def test_catalogo_publico_listo(self):
        respuesta = self.client.get("/api/mascotas/")
        self.assertEqual(respuesta.status_code, 200)
        self.assertEqual(len(respuesta.data), 1)

    def test_anonimo_no_puede_crear_mascota(self):
        respuesta = self.client.post(
            "/api/mascotas/",
            {
                "nombre": "Bruno",
                "especie": "Perro",
                "edad_aproximada_meses": 8,
                "tamaño": "Grande",
                "codigo_chip": "CHIP-9999-99999",
            },
            format="json",
        )
        self.assertIn(respuesta.status_code, (401, 403))

    def test_admin_aprueba_por_api_y_genera_cronograma(self):
        self.client.force_authenticate(self.admin)
        respuesta = self.client.post(
            f"/api/solicitudes/{self.solicitud.id}/aprobar/", {}, format="json"
        )
        self.assertEqual(respuesta.status_code, 200)
        self.assertEqual(
            SeguimientoPostAdopcion.objects.filter(solicitud=self.solicitud).count(),
            15,
        )
