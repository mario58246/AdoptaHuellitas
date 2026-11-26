# **ESPECIFICACIÓN FUNCIONAL Y ARQUITECTURA DE MÓDULOS** 

## **Proyecto Final Academic: Adopta Huellitas** 

### **1. Visión General del Proyecto** 

La plataforma **Adopta Huellitas** es una solución web ecosistémica de arquitectura Full Stack (Django REST Framework en el backend y Angular 19+ en el frontend) diseñada para modernizar y formalizar el flujo operativo de refugios y fundaciones de protección animal. 

El sistema digitaliza el ciclo completo de adopción, cubriendo desde la publicación de ejemplares en un catálogo interactivo hasta el control clínico veterinario integral y la ejecución estricta de un protocolo de seguimiento pos-adopción automatizado a 24 meses (compuesto por 15 reportes obligatorios). 

### **2. Matriz de Roles y Niveles de Permiso** 

#### **🔴 Rol 1: Usuario No Autenticado (Visitante Público)** 

- **Nivel de acceso:** Lectura pública / Sin sesión iniciada. 

- **Funcionalidades:** 

   - Explorar el Catálogo Público de Mascotas mediante una interfaz reactiva con filtros combinatorios (especie, edad, tamaño, sexo y nivel de actividad). 

   - Consultar la ficha técnica básica, galería fotográfica e historia singular de cada animal rescatado. 

   - Visualizar la sección informativa sobre el protocolo y normatividad del seguimiento pos-adopción. 

   - Explorar la página de bienvenida ( _Landing Page_ ) con la propuesta de valor institucional. 

   - Acceso a las pantallas de autenticación (Login) y registro de cuenta comunitaria. 

#### **🔴 Rol 2: Usuario Autenticado (Adoptante / Comunidad)** 

- **Nivel de acceso:** Autenticación basada en tokens JWT (JSON Web Token) con rol asignado `ADOPTANTE` . 

- **Funcionalidades:** 

      - Administrar el perfil de usuario (datos de contacto, ubicación residencial, características del hogar y convivencia con otras mascotas). 

      - Postularse formalmente a la adopción de un ejemplar mediante la cumplimentación del Formulario Digital de Solicitud de Adopción. 

      - Consultar en tiempo real el estado de evaluación de sus postulaciones ( _Pendiente_ , _En Revisión_ , _Aprobada_ , _Rechazada_ ). 

      - Acceder al **Portal de Seguimiento Pos-Adopción** en el momento en que una solicitud cambie a estado _Aprobada_ . 

      - Registrar y subir evidencias correspondientes al plan de 15 reportes obligatorios (fase mensual para meses 1 a 12; fase cuatrimestral para meses 13 a 24) utilizando una modalidad de Carga Híbrida (almacenamiento directo de archivos o vinculación mediante URLs externas como Google Drive o YouTube). 

      - Visualizar el historial médico compartido y certificado de la mascota vinculada a su adopción. 

- 🟢 **Rol 3: Administrador del Recurso (Refugio / Fundación / Superusuario)** 

   - **Nivel de acceso:** Control administrativo total ( `is_staff` / `is_superuser` ). 

   - **Funcionalidades:** 

      - **CRUD de Mascotas:** Registrar, editar, archivar y actualizar estados ( _Disponible_ , _En Proceso_ , _Adoptado_ , _Fallecido_ ), asignando obligatoriamente el código único de microchip corporativo ( `CHIP-XXXX-XXXXX` ). 

      - **Gestión de Solicitudes:** Auditar, evaluar y dictaminar (aprobar/rechazar) las solicitudes recibidas, accediendo al perfil del postulante. 

      - **Control del Cronograma Pos-Adopción:** Monitorear el panel general de seguimiento equipado con un sistema de semaforización visual de vencimientos: 

         - **Verde:** Reporte Aprobado. 

         - **Azul:** En Revisión (Evidencia enviada por el adoptante). 

         - **Amarillo:** Pendiente (Dentro del plazo de entrega). 

         - **Rojo:** Vencido / En Mora. 

      - **Validación de Evidencias:** Auditar los reportes enviados, emitiendo aprobaciones o solicitudes formales de corrección con retroalimentación en texto. 

      - **Gestión de Historial Médico:** Registrar y actualizar esquemas de vacunación, desparasitaciones, intervenciones quirúrgicas y consultas clínicas periódicas. 

      - **Gestión de Contenido:** Administrar los testimonios, historias de éxito de rescate y los datos de canales directos de donación. 

### **3. Descripción Detallada de Módulos del Sistema** 

|Módulo|Componentes Backend (Django<br>REST)|Componentes Frontend (Angular<br>19+)|
|---|---|---|
|**1. Auth & Seguridad**|`SimpleJWT`,`UserSerializer`,<br>Custom Permissions|`AuthService`,`AuthGuard`,<br>`AdminGuard`,`HTTPInterceptor`|
|**2. Catálogo & Historias**|`PetViewSet`,`StoryViewSet`,<br>`django-filters`|`PetListComponent`,<br>`PetDetailComponent`,<br>`GlassFilterPipe`|
|**3. Adopciones**|`ApplicationViewSet`,<br>`ApplicationStatusTransition`|`ApplicationFormComponent`,<br>`ApplicationDashboardCompone`<br>`nt`|
|**4. Historial Médico**|`MedicalRecordViewSet`,<br>`VaccineSchemeModel`|`MedicalCardComponent`,<br>`TimelineMedicalComponent`|
|**5. Portal Seguimiento**|`MilestoneGenerator`,<br>`ReportUploadView`,<br>`CloudinaryService`|`TrackingPortalComponent`,<br>`MilestoneTimelineComponent`|



#### **Módulo 1: Autenticación & Seguridad (Auth Module)** 

- Autenticación sin estado ( _stateless_ ) respaldada por JSON Web Tokens ( `access_token` y `refresh_token` ). 

- Protección de rutas en el cliente Angular mediante `AuthGuard` (para usuarios autenticados) y `AdminGuard` (restringido a `is_staff` ). 

- Interceptor de HTTP para adjuntar la cabecera `Bearer <token>` en peticiones salientes y gestionar la renovación automática de tokens expirados. 

#### **Módulo 2: Catálogo Público & Historias** 

- Listado de especímenes con visualización basada en tarjetas informativas con badges distintivos de estado y edad. 

- Interfaz con componentes visuales modernos ( _Glassmorphism_ ), filtrado dinámico en tiempo real sin recarga de página. 

- Módulo editorial para publicar la trayectoria de rescate y recuperación de animales antes y después de su ingreso al refugio. 

#### **Módulo 3: Gestión de Adopciones** 

- Formulario reactivo estructurado para capturar información socioambiental y motivos de adopción del postulante. 

- Panel administrativo para el personal del refugio que permite la gestión de estados de solicitud mediante acciones de un solo clic. 

- Disparo automático del expediente de adopción y generación de la estructura de seguimiento al concretar la aprobación. 

#### **Módulo 4: Historial Médico Veterinario** 

- Expediente clínico por ejemplar que compila antecedentes de salud, esterilización, alergias y condiciones especiales. 

- Cronograma de intervenciones que registra fechas de aplicación de vacunas, desparasitaciones internas/externas y procedimientos quirúrgicos. 

#### **Módulo 5: Portal de Seguimiento Pos-Adopción (24 Meses / 15 Reportes)** 

- Creación automatizada de 15 hitos de control al momento de la firma/aprobación de la adopción: 

   - **Meses 1 al 12:** 12 reportes obligatorios con frecuencia mensual. 

   - **Meses 13 al 24:** 3 reportes obligatorios con frecuencia cuatrimestral (Meses 16, 20 y 24). 

- Interfaz para el adoptante organizada como línea de tiempo interactiva con visualización tipo semáforo de compromisos. 

- Mecanismo de Carga Híbrida: el adoptante puede adjuntar directamente archivos de imagen/video (procesados y almacenados en la nube mediante Cloudinary) o ingresar enlaces URL verificables (Google Drive, YouTube, OneDrive). 

### **4. Organización del Trabajo en Pareja (GitHub Flow)** 

- **Estructura de Repositorio Monorepo:** 

   - `/backend` : Aplicación y servicios construidos en Django REST Framework. 

   - `/frontend` : Cliente Web construido en Angular 19+. 

- **Estrategia de Ramificación (Git Branching):** 

   - `main` : Rama de producción. Contiene código estable e integrable. 

   - `feature/<nombre-tarea>` : Ramas de trabajo individual derivadas de `main` para el desarrollo de módulos o componentes específicos. 

- **Protocolo de Integración y Revisión (Pull Requests):** 

   - La fusión de cualquier rama de desarrollo ( `feature/*` ) hacia `main` requiere obligatoriamente la creación de un Pull Request (PR). 

- Todo PR debe contar con la revisión y aprobación escrita del otro integrante del equipo antes de ejecutarse el _merge_ , garantizando el control de calidad cruzado. 

