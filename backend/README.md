# Backend Duo Dinámico

Este es el backend de la aplicación Duo Dinámico, desarrollado con Node.js y Express.

## Requisitos Previos

- Node.js >= 22.0.0
- MySQL

## Configuración

1. Clonar el repositorio
2. Instalar dependencias:
```bash
npm install
```
3. Crear un archivo `.env` en la raíz del proyecto con las siguientes variables:

```
DB_HOST=localhost
DB_USER=tu_usuario
DB_PASSWORD=tu_contraseña
DB_NAME=botilleria
```

## Scripts Disponibles

- `npm start`: Inicia el servidor en modo producción
- `npm run dev`: Inicia el servidor en modo desarrollo con recarga automática
- `npm run db:sync`: Sincroniza los modelos con la base de datos
- `npm run db:seed`: Puebla la base de datos con datos de ejemplo
- `npm run db:clear`: Limpia todos los datos de la base de datos

## Endpoints

### Common
#### Productos
- `GET /products`: Obtener lista de productos
  - Retorna: Lista de productos disponibles
  - Filtros: En el futuro incluirá filtros por categoría, subcategoría, rol, etc.
- `GET /products/:id`: Obtener producto por ID
  - Parámetros: ID del producto
  - Retorna: Detalles del producto específico

### SuperAdmin
#### Productos
- `GET /super-admin/products`: Rutas base para productos
  - Acceso: Solo para super administradores
  - Funcionalidad: Gestión completa de productos

#### Users
- `POST /super-admin/users`: Crear un nuevo usuario administrador
  - Requiere: 
    - name: Nombre del usuario
    - email: Correo electrónico
    - password: Contraseña
    - role_id: ID del rol asignado
  - Retorna: 
    - Usuario creado con sus datos (sin password)
    - Mensaje de éxito
  - Validaciones:
    - Todos los campos son requeridos
    - El email no debe estar registrado previamente
    - La contraseña se encripta automáticamente

## Base de Datos

El proyecto utiliza MySQL como base de datos principal. Los scripts de base de datos se encuentran en el directorio `scripts/`:

- `sync.js`: Sincroniza los modelos con la base de datos
- `seed.js`: Puebla la base de datos con datos de ejemplo
- `clearDatabase.js`: Limpia todos los datos de la base de datos

## Estructura del Proyecto

```
backend/
├── app.js              # Configuración de Express
├── index.js           # Punto de entrada de la aplicación
├── config/            # Configuraciones (base de datos, etc)
├── controllers/       # Controladores de la aplicación
│   └── superAdmin/     # Controladores de los super admins
│   └── admin/         # Controladores de los admins
│   └── client/       # Controladores del cliente
│   └── common/       # Controladores comunes entre ambos
├── models/           # Modelos de la base de datos
├── routes/           # Rutas de la API
│   └── superAdmin/     # Rutas de los super admins
│   └── admin/         # Rutas de los admins
│   └── client/       # Rutas del cliente
│   └── common/       # Rutas comunes entre ambos
└── scripts/         # Scripts 
```

## Tecnologías Utilizadas

- Node.js
- Express
- MySQL
- Sequelize (ORM)
- bcrypt para encriptación
- cors para manejo de CORS
