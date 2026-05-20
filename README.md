# 🛍️ joelBazar - E-commerce de Bazar

joelBazar es una tienda online de bazar diseñada como una Single Page Application (SPA) utilizando JavaScript Vanilla, Bootstrap 5 y Airtable como base de datos.

## 🛠️ Stack Tecnológico

- **Frontend:** HTML5, CSS3, JavaScript (ES6+)
- **Framework CSS:** Bootstrap 5
- **Base de Datos:** Airtable API
- **Pagos:** MercadoPago & Transferencias Bancarias
- **Herramientas:** Vite, npm

## 🚀 Instalación y Configuración

### Requisitos Previos
- Node.js v18+
- npm

### Paso a Paso
1. **Clonar el repositorio:**
   ```bash
   git clone https://github.com/usuario/joelBazar.git
   cd joelBazar
   ```

2. **Instalar dependencias:**
   ```bash
   npm install
   ```

3. **Configurar variables de entorno:**
   - Copia el archivo `.env.example` a `.env`:
     ```bash
     cp .env.example .env
     ```
   - Abre `.env` y completa tus credenciales de Airtable y MercadoPago.

4. **Ejecutar en modo desarrollo:**
   ```bash
   npm run dev
   ```

## ⚙️ Configuración de Servicios

### Airtable
Para que la tienda funcione, debes crear una base en Airtable con las siguientes tablas:
- `Productos`: (id, nombre, descripcion, precio, stock, categoria_id, imagen_url, colores, tallas)
- `Categorias`: (id, nombre, descripcion)
- `Ordenes`: (id, numero_orden, cliente_nombre, cliente_email, cliente_telefono, cliente_direccion, productos, total, metodo_pago, estado)

### MercadoPago
1. Crea una cuenta de desarrollador en MercadoPago.
2. Obtén tu `Public Key` desde el panel de aplicaciones.
3. Agrégala a tu archivo `.env` en la variable `VITE_MERCADOPAGO_PUBLIC_KEY`.

## 📂 Estructura de Carpetas

- `src/components/`: Componentes UI reutilizables.
- `src/services/`: Lógica de comunicación con APIs.
- `src/utils/`: Funciones auxiliares, constantes y validadores.
- `src/styles/`: Hojas de estilo CSS.
- `src/pages/`: Vistas de la aplicación.
- `public/`: Assets estáticos (imágenes, iconos).

## 🔗 Links Útiles
- [Airtable API Docs](https://airtable.com/api)
- [MercadoPago API Docs](https://www.mercadopago.com.ar/developers/es/docs)
- [Bootstrap 5 Docs](https://getbootstrap.com/docs/5.3/)
