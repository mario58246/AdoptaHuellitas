Aquí tienes el resumen completo del **stack tecnológico y las herramientas recomendadas** (100% gratuitas o con planes gratuitos de por vida) para el desarrollo y despliegue de **Adopta Huellitas** : 

# **1. Stack Principal de Desarrollo** 

- **Backend: Django REST Framework (Python 3.11+)** 

- Manejo de la lógica de negocio, arquitectura de APIs REST, autenticación stateless con SimpleJWT y procesamiento de datos. 

- **Frontend: Angular 19+** 

- Desarrollo de la SPA (Single Page Application) responsiva, componentes reactivos, consumo de APIs mediante HttpClient y protección de rutas con _Guards_ (AuthGuard, AdminGuard). 

- **Estilos y UI: Tailwind CSS + CSS3 Nativo** 

- Maquetación fluida y moderna, incluyendo componentes con efectos de vidrio esmerilado ( _Glassmorphism_ ), degradados de texto (bg-clip-text) y botones estilo píldora. 

# **2. Base de Datos y Almacenamiento** 

- **Base de Datos Local (Desarrollo): SQLite** 

- Incluida por defecto en Django; no requiere configuración de servidores pesados en las computadoras de desarrollo. 

- **Base de Datos en Producción: PostgreSQL en Supabase** 

- Plan _Free Tier_ (500 MB de almacenamiento relacional gratuito). Se conecta directamente con la configuración de DATABASES en Django settings.py. 

- **Almacenamiento de Imágenes y Evidencias: Cloudinary (API) + URLs Externas (Carga Híbrida)** 

- **Cloudinary (Free Tier - 25 GB):** Almacenamiento en la nube para fotos de mascotas, carné clínico y archivos locales subidos en el seguimiento. 

- **URLs externas:** Enlaces directos a archivos o videos alojados en Google Drive o YouTube. 

# **3. Infraestructura y Despliegue en la Nube (Hosting Gratuito)** 

- **Frontend Hosting: Vercel** _(o Netlify / GitHub Pages)_ 

- Plan _Hobby_ (100% gratuito). Integración directa con GitHub para compilación y despliegue automático en cada git push a main, otorgando una URL pública con HTTPS gratis (.vercel.app). 

- **Backend Hosting: Render** 

- Plan _Free Web Service_ . Alojamiento gratuito de la API Python/Django (.onrender.com). 

- **Autenticación: JSON Web Tokens (JWT)** con djangorestframework-simplejwt. 

# **4. Herramientas de Apoyo y Control de Versiones** 

- **Control de Versiones y Repositorio: GitHub (Monorepo)** 

- Un único repositorio con subcarpetas /backend y /frontend. 

- **Flujo de Trabajo:** _GitHub Flow Simplificado_ mediante ramas de tareas (feature/nombretarea) y Pull Requests (PR) obligatorios antes de integrar a main. 

- **Pruebas de API: Postman** (o extensión _REST Client_ para VS Code). 

- **Editor de Código: Visual Studio Code** con extensiones de Angular, Python y Tailwind CSS. 

# 📊 **Cuadro Resumen de Herramientas y Servicios** 

|**Capa / Función**|**Tecnología Propuesta**|**Plan / Costo**|
|---|---|---|
|**Frontend**|Angular 19+ + Tailwind CSS<br>en**Vercel**|Gratis (Free Tier)|
|**Backend API**|Django REST Framework en<br>**Render**|Gratis (Free Web Service)|
|**Base de Datos**|PostgreSQL en**Supabase**<br>(Desarrollo: SQLite)|Gratis (500 MB)|
|**Archivos / Evidencias**|**Cloudinary API**+ URLs<br>externas|Gratis (25 GB)|
|**Control de Versiones**|**GitHub**(GitHub Flow +<br>PRs)|Gratis|
|**Dominio y SSL**|Subdominio automático<br>con HTTPS|Incluido gratis|



