# **Adopta Huellitas** 

Estado del proyecto, herramientas usadas y pase para Mario 

26 de noviembre de 2026 

## **1. Estado real en GitHub** 

Sí, Angie: todo quedó pusheado, pero con un matiz importante: está en las ramas y en los PR, no en main. 

feature/admin-dashboard-refugio -> 9f791de33e714b1c7b0f0b761ef5d72bb0cb4b07 feature/base-compartida        -> 4d79bb806f658d68257ed41a1aabb1d792db0e2f main                           -> e61d32ab84ed6466e01b9a8dff0374549eff3354 

- **PR #1 (panel admin):** Open, 13 commits. Aparece como “No reviews” y sin reviewer asignado. 

- **PR #2 (base compartida):** Open, 3 commits. Sí aparece mario58246 como reviewer esperando. 

Entonces: sí, solo falta Mario entrar a GitHub, revisar, dejar la aprobación escrita y hacer merge. Yo no apruebo ni mergeo por él. Orden recomendado: PR #2 primero, luego PR #1. Si en el PR #1 no le aparece como reviewer, que lo agregue en Reviewers o que deje el comentario de aprobación igual. 

**Links:** <u>PR #2 · PR #1</u> 

## **2. Resumen de todo lo hecho** 

|**Bloque**|**Qué quedó implementado**|**Commits**|
|---|---|---|
|Base del proyecto|Monorepo /backend + /frontend, DRF +<br>SimpleJWT, healthcheck /health, raíz<br>informativa, favicon sin 404, README<br>y .env.example|7052a0c, f5d0570|
|Identidad visual|Logo oficial, contacto real, hero local,<br>iconos del panel|4d79bb8, abd6d93, a46d1e2|
|Panel de Angie|Login JWT, shell con iconos y etiquetas,<br>ver/ocultar contraseña, Resumen,<br>Mascotas, Solicitudes, Seguimiento e<br>Historial|75f0f6a, fb9d05b, abd6d93|
|Reglas de negocio|Microchip ISO de 15 dígitos, conversión<br>de chips antiguos, bajas con fecha_baja,<br>DELETE = 405, fallecidos ocultos, purga a<br>5 años, comando purgar_bajas, 15<br>reportes atómicos y semáforo|dda3aa0|
|Landing pública|Catálogo dinámico, /ingresar, límite de<br>fichas, imágenes genéricas por especie,<br>validación de URL directa de imagen|cacbfee, a46d1e2, 649de49, 32a6a59|
|UX del panel|Modales propios para baja, reestablecer,<br>aprobar/rechazar y aprobar/corregir;<br>botón Editar azul; logo visible en la barra<br>lateral|4682ace, 32a6a59, 9f791de|



**Último commit:** 9f791de feat(admin): reemplaza avisos nativos por modales en seguimiento y solicitudes. 

**Verificaciones actuales:** 

- python manage.py test → 15/15 OK. 

- npm run build → limpio. 

- Sin confirm(), alert() ni prompt() en frontend/src/app. 

- Sin diálogos nativos ni errores de consola en navegador. 

**Nota:** los textos de los PR todavía dicen 7/7 OK; ya son 15/15. Mario puede actualizarlos al revisar. 

## **3. Herramientas usadas** 

### **Del stack que sí estaba en los documentos iniciales** 

- Python 3.13 en .venv, Django 5.1, DRF, SimpleJWT. 

- SQLite local; PostgreSQL/Supabase previsto para producción. 

- Angular 21, standalone components, Tailwind + CSS3/glassmorphism. 

- Git y GitHub con ramas feature/* y Conventional Commits. 

- Cloudinary, Render y Vercel: previstos, aún no implementados. 

### **Herramientas adicionales del entorno, que no aparecían en esos documentos** 

- **Navegador integrado de OpenCode:** para probar login, landing, modales, formularios, semáforo y consola. 

- **Code Mode:** para orquestar esas pruebas de navegador. 

- **webfetch:** para leer los PR en GitHub, porque gh no está instalado. 

- **git ls-remote / git status:** para comprobar que el push llegó realmente. 

- **npm run build y python manage.py test / manage.py shell:** para validar y limpiar datos de prueba. 

- **Pillow:** para revisar dimensiones y transparencia de PNG; ya estaba en requirements.txt, no es una dependencia nueva. 

- **Generador de imágenes del entorno:** para apoyar assets visuales; el logo y el gato final que quedaron son los que conservamos/adjuntaste, no una versión generada. 

No se usó ninguna herramienta de pago ni se agregó una librería nueva al proyecto. 

## **4. Texto para pasarle a Mario (copiar/pegar)** 

### **Tu rol, Mario** 

Eres dueño del repositorio, reviewer y también el futuro visitante + adoptante. 

### **1. Revisión de los PR** 

- Entrar a https://github.com/mario58246/AdoptaHuellitas/pulls. 

- Revisar primero PR #2 (feature/base-compartida → main). 

- Dejar comentario escrito de aprobación y hacer merge. 

- Luego revisar PR #1 (feature/admin-dashboard-refugio → main), aprobar y hacer merge. 

- No hacer commit directo a main. 

En PR #1 apareces sin reviewer asignado: agrégate como reviewer o deja igual el comentario de aprobación. 

### **2. Lo que te falta implementar** 

Tu parte es el módulo adoptante en frontend/src/app/modules/adoptante/: 

- Registro/login del adoptante. 

- Formulario de solicitud de adopción. 

- Portal "Mis adopciones" con los 15 reportes. 

- Carga de evidencia por reporte. 

- Ver la retroalimentación que deja Angie. 

Hoy no existe endpoint público de registro: solo /api/token/. Necesitas agregar algo como: 

<mark>POST /api/usuarios/registro/</mark> 

Como eso toca backend compartido, va en su propio feature/*, con PR y revisión antes de merge. Si el PR lo abres tú, Angie revisa y tú haces el merge final por ser el dueño del repo. 

Métodos que faltan en ApiService: 

crearSolicitud(datos): Observable<Solicitud>; 

enviarEvidencia(id, archivo?, url?, observaciones?): Observable<Seguimiento>; 

### **3. Cuándo escribirle a Angie** 

Escríbeme cuando: 

- Vayas a mezclar algo en main. 

- Cambies ApiService, AuthService, modelos, serializers, views, rutas, README, logo, contacto o landing. 

- Agregues el endpoint de registro. 

- El formulario de solicitud cambie de campos. 

- Un adoptante intente enviar evidencia y reciba 400, 403 o 404. 

- Necesites que apruebe/rechace una solicitud para generar los 15 reportes. 

- Necesites que apruebe o corrija un reporte de seguimiento. 

- Vayas a conectar Supabase, Cloudinary, Render o Vercel. 

- Plantilla de mensaje: 

Rama: feature/adoptante-portal Commit: abc123 

Cambié: ... Probé: npm run build OK / manage.py test 15/15 OK Necesito que valides: en /admin/solicitudes aparece la solicitud y al aprobar se generan 15 reportes. 

### **4. Cómo conectamos solicitudes y seguimiento** 

- Mario: el adoptante se registra y hace login JWT. 

- Mario: envía POST /api/solicitudes/ con: 

mascota, nombre_adoptante, correo_contacto, telefono, direccion_residencia, caracteristicas_hogar, convivencia_otras_mascotas, motivo_adopcion 

- El backend asigna adoptante automáticamente y la mascota pasa a En Proceso. La solicitud queda Pendiente. 

- Angie: ve la solicitud en /admin/solicitudes y usa el modal Aprobar. Se crean los 15 reportes: meses 1-12, 16, 20 y 24. 

- Mario: en su portal ve esos 15 reportes con numero_reporte, mes_programado, fecha_limite, estado, semaforo y retroalimentacion. 

- Mario: carga evidencia con: 

<mark>PATCH /api/seguimientos/{id}/enviar-evidencia/</mark> 

Con archivo_evidencia (multipart) o url_evidencia, más observaciones_adoptante. El reporte pasa a En Revisión / azul. 

- Angie: revisa en /admin/seguimiento y usa Aprobar o Corregir; ambos abren modales con la retroalimentación. 

- Mario: vuelve a ver la retroalimentación y corrige si hace falta. 

Las mascotas Fallecido no aparecen ni en solicitudes ni en seguimiento. 

### **5. Hasta dónde avanzas tú** 

Avanzas hasta que: 

- El adoptante pueda enviar su solicitud. 

- El adoptante vea sus 15 reportes. 

- El adoptante cargue evidencia. 

Te detienes cuando el estado depende de mí: solicitud Pendiente o reporte En Revisión. No toques bajas, purga, semáforo ni el panel /admin sin coordinarlo conmigo. 

_Este documento es la versión en Word de la respuesta anterior. Si se quiere también en Markdown dentro del repo, se puede guardar como docs/PASO_MARIO.md._ 

