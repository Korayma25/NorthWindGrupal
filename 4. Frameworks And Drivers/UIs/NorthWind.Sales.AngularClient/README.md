# NorthWind Sales - Frontend Angular Client

Frontend SPA moderno desarrollado en **Angular (versión estable actual)** utilizando componentes standalone, **Signals** para reactividad fina, arquitectura por capas (Domain, Application, Infrastructure, Presentation), y estilizado con **Bootstrap 5** respetando fielmente la paleta corporativa y diseño visual del cliente Blazor WebAssembly original (`NorthWind.Sales.BlazorClient`).

---

## 1. Requisitos Previos

- **Node.js**: v20.x o superior (LTS recomendado).
- **npm**: v10.x o superior.
- **Backend ASP.NET Core**: ejecutándose en `http://localhost:8081`.

---

## 2. Instalación de Dependencias

Desde la terminal, ubícate en esta carpeta (`4. Frameworks And Drivers/UIs/NorthWind.Sales.AngularClient/`):

```bash
npm install
```

> **Nota:** La única librería externa de componentes y estilos instalada vía npm es **Bootstrap 5** (y Bootstrap Icons). No se utilizan bibliotecas pesadas de terceros (sin Angular Material, PrimeNG, etc.).

---

## 3. Ejecución en Desarrollo (con Proxy)

Para iniciar el servidor de desarrollo de Angular consumiendo el backend local sin requerir cambios de CORS en el backend:

```bash
npm start
# O alternativamente:
ng serve --proxy-config proxy.conf.js
```

La aplicación estará disponible en `http://localhost:4200/`.

### ¿Por qué se utiliza el Proxy de Desarrollo?
El backend ASP.NET Core Minimal APIs no tiene políticas de CORS habilitadas para el puerto 4200. Siguiendo la regla de no modificar el backend, el archivo `proxy.conf.js` intercepta las solicitudes hacia:
- `/user/*`
- `/CreateOrder`
- `/SearchCustomers`
- `/SearchProducts`
- `/SearchInvoices`
- `/GetInvoice`
- `/GetInvoicePdf`

y las redirige a `http://localhost:8081`. Además, incorpora una función `bypass` que detecta cuando una petición acepta `text/html` (navegación del navegador a rutas como `/user/login`, `/user/register` o `/user/logout`) para devolver `/index.html` y permitir que Angular Router sirva la aplicación en lugar de reenviarla al backend.

---

## 4. Compilación para Producción

Para compilar el paquete optimizado para producción:

```bash
npm run build
```

Los artefactos generados se guardarán en:
`dist/NorthWind.Sales.AngularClient/browser/`

---

## 5. Variables de Entorno y Configuración para Producción

Las configuraciones se gestionan mediante los archivos en `src/environments/`:

- **`environment.development.ts`**:
  ```typescript
  export const environment = {
    production: false,
    apiBaseUrl: '' // Rutas relativas redirigidas por proxy.conf.json
  };
  ```

- **`environment.production.ts`**:
  ```typescript
  export const environment = {
    production: true,
    apiBaseUrl: 'https://api.northwindsales.com' // Placeholder configurable
  };
  ```

### Consideración Crucial de Despliegue en Producción (CORS vs Reverse Proxy):
En un entorno de producción real, dado que el backend no posee CORS habilitado en el código base original, existen dos opciones recomendadas:
1. **Proxy Inverso en el Mismo Origen (Recomendado)**:
   Desplegar el frontend compilado y el backend detrás de un mismo servidor web o API Gateway (por ejemplo Nginx, Azure Application Gateway, Cloudflare Workers o AWS CloudFront). En este caso, `apiBaseUrl` se mantiene como `''` (cadena vacía) y el proxy inverso enruta las peticiones de API al backend.
2. **Habilitación de CORS en el Backend**:
   Si el frontend y el backend residen en dominios o subdominios distintos (ej. `app.northwindsales.com` y `api.northwindsales.com`), el administrador del backend deberá registrar `app.UseCors()` permitiendo el origen del frontend en `Program.cs`.

---

## 6. Catálogo de Pantallas y Flujos de Usuario

| Ruta | Pantalla | Protección | Descripción |
|---|---|:---:|---|
| `/` | **Inicio** | Pública / Dinámica | Muestra mensaje de bienvenida si no está autenticado. Si está autenticado, muestra tarjetas interactivas de "Crear orden" y "Facturas". |
| `/user/login` | **Iniciar Sesión** | Pública | Formulario reactivo con correo y contraseña. Manejo de errores de credenciales y redirección a `returnUrl`. |
| `/user/register` | **Crear Cuenta** | Pública | Registro de usuario con validación de complejidad de contraseña (mínimo 6 caracteres, mayúscula, minúscula, dígito y no alfanumérico). |
| `/user/logout` | **Cerrar Sesión** | Pública | Limpia la sesión del `AuthService`, tokens locales y redirige a la pantalla de inicio. |
| `/createorder` | **Punto de Venta / Crear Orden** | Protegida (`authGuard`) | Registro completo de ventas. Incluye selección de cliente, adición de líneas de detalle, cálculo automático de subtotales, IVA (15% o 0%), descuentos y total con redondeo away-from-zero idéntico a .NET. |
| Modal Cliente | **Búsqueda de Clientes** | En `/createorder` | Ventana emergente con filtros dinámicos (nombre y cédula), debounce de 400ms y paginador. |
| Modal Producto | **Búsqueda de Productos** | En `/createorder` | Ventana emergente con filtros por código y descripción, stock en tiempo real y prevención de duplicados. |
| Diálogo Confirmación | **Eliminar Producto** | En `/createorder` | Modal accesible (soporta Escape y Enter) para confirmar la eliminación de una línea de pedido. |
| `/invoices` | **Búsqueda de Facturas** | Protegida (`authGuard`) | Consulta paginada con filtros por número de factura (formato `001-001-000000001`) y nombre de cliente, debounce de 400ms, y enlace de acceso al detalle. |
| `/invoices/:id` | **Detalle de Factura** | Protegida (`authGuard`) | Visualización completa de cabecera, datos del cliente, tabla de líneas y totales. Manejo de error 404 mediante ProblemDetails sin romper la interfaz. |
| Visor PDF | **Visor de Factura (PDF)** | En `/invoices/:id` | Renderizado del PDF generado por el servidor en un iframe de 80vh con borde navy, botón "Descargar" y botón "Imprimir". Liberación estricta de `URL.revokeObjectURL` para evitar fugas de memoria. |
| Navbar / Header | **Reloj en Tiempo Real** | Global | Componente que actualiza fecha en español y hora segundo a segundo fuera de `NgZone` para no penalizar el rendimiento. |

---

## 7. Pruebas Unitarias y Calidad

Para ejecutar la suite de pruebas unitarias:

```bash
npm test -- --watch=false
```

- **Runner**: Vitest optimizado para Angular.
- **Cobertura**: 26 suites y **130 pruebas unitarias** pasando al 100%.
- **Casos probados**:
  - Algoritmo oficial de validación de cédulas ecuatorianas (`EcuadorianIdentityCard`).
  - Reglas de filtrado de texto (`TextRules`: `keepLetters`, `keepDigits`, `keepDigitsAndHyphen`, `keepLoginCharacters`).
  - Cálculo de totales con múltiples líneas, líneas exentas de IVA (0%), y redondeo midpoint away-from-zero.
  - Prevención de duplicados en pedidos.
  - Interceptores HTTP (token Bearer, auto-logout en 401, parseo de 400 y 404 con ProblemDetails).
  - Componentes accesibles (SearchModal, ConfirmDialog, Pager, PdfViewer con liberación de memoria).
  - Páginas completas (Login, Register, Home, CreateOrder, InvoiceSearch, InvoiceDetail).

---

## 8. Accesibilidad y Diseño Adaptativo (Responsive)

- **Contraste de Colores (WCAG AA/AAA)**: Los textos en `--nw-navy` (#0a2540) sobre fondo blanco poseen un ratio de contraste de 13.5:1 (superando con holgura el mínimo de 4.5:1).
- **Tablas Adaptativas**: Todas las tablas de datos (`CreateOrder`, `SearchModal`, `InvoiceSearch`, `InvoiceDetail`) están contenidas en contenedores `.table-responsive` que permiten desplazamiento horizontal suave en dispositivos móviles sin desbordar el diseño.
- **Teclado y Foco Visible**: Modales y botones cuentan con soporte para tecla `Escape`, `Enter` y anillos de enfoque visual claros (`focus-visible`).
