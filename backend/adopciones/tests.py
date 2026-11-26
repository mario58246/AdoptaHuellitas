from datetime import date, timedelta
from unittest.mock import MagicMock, patch

from django.contrib.auth import get_user_model
from django.core.exceptions import ValidationError
from django.test import TestCase
from django.utils import timezone
from rest_framework.test import APIClient

from .imagenes import validar_url_imagen
from .models import (
    EstadoAdopcion,
    HistorialMedico,
    MascotaRescatada,
    SeguimientoPostAdopcion,
    SolicitudAdopcion,
    validar_codigo_chip,
)
from .services import (
    ANIOS_CONSERVACION_BAJA,
    aprobar_solicitud,
    purgar_bajas_vencidas,
    restar_anios,
    sumar_meses,
)


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
            codigo_chip="981000123456789",
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
        validar_codigo_chip("981000123456789")

    def test_microchip_formato_invalido(self):
        for chip in ("CHIP-9810-12345", "98100012345678A", "98100012345678"):
            with self.subTest(chip=chip), self.assertRaises(ValidationError):
                validar_codigo_chip(chip)

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
            codigo_chip="981000222222222",
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
                "codigo_chip": "981000333333333",
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

    def test_admin_crea_mascota_con_chip_iso(self):
        self.client.force_authenticate(self.admin)
        respuesta = self.client.post(
            "/api/mascotas/",
            {
                "nombre": "Bruno",
                "especie": "Perro",
                "edad_aproximada_meses": 8,
                "tamaño": "Grande",
                "codigo_chip": "981000444444444",
            },
            format="json",
        )
        self.assertEqual(respuesta.status_code, 201, respuesta.data)

    def test_admin_no_crea_mascota_con_chip_con_letras(self):
        self.client.force_authenticate(self.admin)
        respuesta = self.client.post(
            "/api/mascotas/",
            {
                "nombre": "Bruno",
                "especie": "Perro",
                "edad_aproximada_meses": 8,
                "tamaño": "Grande",
                "codigo_chip": "CHIP-4444-44444",
            },
            format="json",
        )
        self.assertEqual(respuesta.status_code, 400)
        self.assertIn("codigo_chip", respuesta.data)


class BajasTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.admin = get_user_model().objects.create_superuser(
            username="admin", password="clave-segura-123"
        )
        self.mascota = MascotaRescatada.objects.create(
            nombre="Nala",
            especie="Perro",
            edad_aproximada_meses=24,
            tamaño="Mediano",
            codigo_chip="981000555555555",
        )
        HistorialMedico.objects.create(
            mascota=self.mascota,
            tipo_procedimiento="Vacuna",
            descripcion="Vacuna anual",
            fecha_procedimiento=timezone.localdate(),
            veterinario_responsable="Dra. Pérez",
        )

    def test_dar_de_baja_registra_fecha_y_sale_del_catalogo(self):
        self.client.force_authenticate(self.admin)
        respuesta = self.client.patch(
            f"/api/mascotas/{self.mascota.id}/",
            {"estado_adopcion": EstadoAdopcion.FALLECIDO},
            format="json",
        )
        self.assertEqual(respuesta.status_code, 200, respuesta.data)
        self.mascota.refresh_from_db()
        self.assertEqual(self.mascota.fecha_baja, timezone.localdate())
        self.assertEqual(len(self.client.get("/api/mascotas/").data), 0)
        self.assertEqual(len(self.client.get("/api/mascotas/bajas/").data), 1)
        self.assertEqual(len(self.client.get("/api/historial-medico/").data), 0)

    def test_baja_solo_permite_cambiar_estado(self):
        self.mascota.estado_adopcion = EstadoAdopcion.FALLECIDO
        self.mascota.save()
        self.client.force_authenticate(self.admin)

        respuesta = self.client.patch(
            f"/api/mascotas/{self.mascota.id}/",
            {"nombre": "Otro nombre"},
            format="json",
        )
        self.assertEqual(respuesta.status_code, 400)
        self.assertIn("non_field_errors", respuesta.data)

        respuesta = self.client.patch(
            f"/api/mascotas/{self.mascota.id}/",
            {"estado_adopcion": EstadoAdopcion.DISPONIBLE},
            format="json",
        )
        self.assertEqual(respuesta.status_code, 200, respuesta.data)
        self.mascota.refresh_from_db()
        self.assertIsNone(self.mascota.fecha_baja)

    def test_no_se_permite_borrado_directo(self):
        self.client.force_authenticate(self.admin)
        respuesta = self.client.delete(f"/api/mascotas/{self.mascota.id}/")
        self.assertEqual(respuesta.status_code, 405)

    def test_purga_bajas_vencidas_con_todo_su_historial(self):
        self.mascota.estado_adopcion = EstadoAdopcion.FALLECIDO
        self.mascota.save()
        fecha_vencida = restar_anios(
            timezone.localdate(), ANIOS_CONSERVACION_BAJA
        ) - timedelta(days=1)
        MascotaRescatada.objects.filter(pk=self.mascota.pk).update(
            fecha_baja=fecha_vencida
        )

        self.assertEqual(purgar_bajas_vencidas(), 1)
        self.assertFalse(MascotaRescatada.objects.filter(pk=self.mascota.pk).exists())
        self.assertFalse(HistorialMedico.objects.exists())


class UrlImagenTests(TestCase):
    def test_acepta_url_directa_de_imagen(self):
        url = "https://img.magnific.com/vector-gratis/vaca_96037-417.jpg"
        self.assertEqual(validar_url_imagen(url), url)

    def test_rechaza_url_de_pagina_web(self):
        respuesta = MagicMock()
        respuesta.__enter__.return_value.headers.get_content_type.return_value = "text/html"
        with patch("adopciones.imagenes.urlopen", return_value=respuesta):
            with self.assertRaises(ValidationError) as error:
                validar_url_imagen(
                    "https://www.magnific.com/es/fotos-vectores-gratis/vaca-animada"
                )
        self.assertIn("página web", str(error.exception))
