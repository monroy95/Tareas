# 📋 Sistema de Gestión de Incidencias

Una aplicación web moderna y responsive para la gestión de tareas e incidencias, desarrollada con Vue 3, que permite crear, administrar y dar seguimiento a tareas diarias con un sistema de autenticación simulado.

## ✨ Características Principales

### 🔐 Sistema de Autenticación

- Login simulado con credenciales hardcodeadas
- 5 usuarios de prueba con diferentes roles
- Persistencia de sesión en localStorage
- Rutas protegidas con guards de navegación

### 📱 Diseño Responsive

- **Mobile-first**: Optimizado para dispositivos móviles
- **Breakpoints**: 480px (móvil), 768px (tablet), 1024px (desktop)
- **Navegación adaptativa**: Menú hamburguesa en móviles
- **Grid responsive**: Tarjetas que se adaptan al tamaño de pantalla

### 📊 Dashboard Interactivo

- Estadísticas visuales en tiempo real
- Gráficos de distribución por estado
- Tareas recientes y de alta prioridad
- Métricas de productividad

### ✅ Gestión Completa de Tareas

- **CRUD completo**: Crear, leer, actualizar y eliminar
- **Estados**: Pendiente, En Progreso, Completada, Cancelada
- **Prioridades**: Baja (verde), Media (amarillo), Alta (rojo)
- **Asignación**: Sistema de usuarios con permisos
- **Fechas**: Vencimiento con indicadores visuales
- **Búsqueda**: Filtros en tiempo real por texto y estado

### 🎨 Sistema de Avatares

- **Avatares SVG**: Generados dinámicamente con iniciales
- **Colores únicos**: Cada usuario tiene un color distintivo
- **Fallback automático**: Si falla la imagen, muestra iniciales
- **Componente reutilizable**: `UserAvatar` con múltiples tamaños
- **Archivos locales**: SVGs almacenados en `src/assets/avatars/`

### 🔒 Sistema de Permisos

- **Visualización**: Solo tareas asignadas o creadas por el usuario
- **Edición**: Creador y asignado pueden modificar
- **Eliminación**: Solo el creador puede eliminar
- **Estados**: Cualquier usuario autorizado puede cambiar estados

## 🚀 Instalación y Configuración

### Prerrequisitos

- Node.js 16+
- npm o yarn

### Pasos de instalación

1. **Clonar el repositorio**

```bash
git clone <url-del-repositorio>
cd app_tareas
```

2. **Instalar dependencias**

```bash
npm install
```

3. **Ejecutar en modo desarrollo**

```bash
npm run dev
```

4. **Construir para producción**

```bash
npm run build
```

## 👥 Usuarios de Prueba

| Usuario                             | Email                  | Contraseña | Rol   | Avatar                     |
| ----------------------------------- | ---------------------- | ---------- | ----- | -------------------------- |
| Administrador                       | admin@test.com         | admin123   | admin | Rojo con iniciales "AD"    |
| Mario Joel Monroy Canizales         | mmonroyc4@miumg.edu.gt | user123    | user  | Azul con iniciales "MM"    |
| Víctor Estuardo Florian Castellanos | hola@test.com          | hola123    | user  | Púrpura con iniciales "VF" |
| Juan Isaias Chopen Par              | juan@test.com          | juanio123  | user  | Cyan con iniciales "JC"    |
| Juan Miguel Ramirez Hernandez       | juanmiguel@test.com    | juan123    | user  | Rosa con iniciales "JR"    |

## 📁 Estructura del Proyecto

```
src/
├── assets/
│   └── avatars/          # Avatares SVG locales
│       ├── admin.svg
│       ├── user.svg
│       ├── victor.svg
│       ├── juan1.svg
│       └── juan2.svg
├── components/
│   ├── CreateTaskModal.vue
│   ├── EditTaskModal.vue
│   └── UserAvatar.vue    # Componente de avatar reutilizable
├── router/
│   └── index.js          # Configuración de rutas
├── stores/
│   ├── auth.js           # Store de autenticación
│   └── tasks.js          # Store de tareas
├── styles/
│   ├── variables.scss    # Variables SCSS
│   └── main.scss         # Estilos globales
├── views/
│   ├── LoginView.vue
│   ├── DashboardView.vue
│   ├── TasksView.vue
│   ├── TaskDetailView.vue
│   └── ProfileView.vue
├── App.vue               # Componente principal
└── main.js               # Punto de entrada
```

## 🛠️ Tecnologías Utilizadas

### Frontend

- **Vue 3** - Framework principal con Composition API
- **Vue Router** - Navegación y rutas protegidas
- **Pinia** - Gestión de estado global
- **Vite** - Build tool y servidor de desarrollo

### Estilos

- **SCSS** - Preprocesador CSS con variables
- **CSS Grid & Flexbox** - Layout responsive
- **Google Fonts (Inter)** - Tipografía moderna

### Iconografía y Assets

- **Lucide Vue** - Iconos SVG optimizados
- **Avatares SVG** - Generados dinámicamente
- **date-fns** - Manipulación de fechas

## 🎯 Guía de Uso

### 1. Acceso al Sistema

- Visita la aplicación en tu navegador
- Usa cualquiera de los usuarios de prueba listados arriba
- El sistema recordará tu sesión

### 2. Dashboard

- **Estadísticas**: Visualiza el resumen de tus tareas
- **Tareas recientes**: Acceso rápido a las últimas tareas
- **Alta prioridad**: Tareas que requieren atención inmediata

### 3. Gestión de Tareas

- **Crear**: Botón "Nueva Tarea" en dashboard o lista
- **Editar**: Click en tarea → botón "Editar" (si tienes permisos)
- **Estados**: Cambia el estado desde la vista detalle
- **Eliminar**: Solo disponible para el creador de la tarea

### 4. Búsqueda y Filtros

- **Búsqueda**: Escribe en la barra de búsqueda
- **Filtros**: Usa las pestañas (Todas, Pendientes, En Progreso, Completadas)
- **Combinación**: Puedes combinar búsqueda con filtros

### 5. Perfil de Usuario

- **Información personal**: Datos del usuario actual
- **Estadísticas**: Métricas de productividad
- **Actividad reciente**: Historial de acciones

## 🎨 Sistema de Avatares

### Componente UserAvatar

```vue
<UserAvatar
  :src="user.avatar"
  :name="user.name"
  size="medium"
  fallback-color="#3b82f6"
/>
```

### Tamaños disponibles

- `small`: 1.5rem (24px)
- `medium`: 2rem (32px)
- `large`: 3rem (48px)
- `xlarge`: 5rem (80px)

### Características

- **Fallback automático**: Si la imagen falla, muestra iniciales
- **Colores únicos**: Cada usuario tiene un color distintivo
- **SVG optimizado**: Archivos ligeros y escalables
- **Responsive**: Se adapta a diferentes tamaños de pantalla

### Paleta de Colores de Avatares

- 🔴 **Administrador**: Gradiente rojo (#dc2626 → #991b1b)
- 🔵 **Mario Joel**: Gradiente azul (#3b82f6 → #1d4ed8)
- 🟣 **Víctor Estuardo**: Gradiente púrpura (#8b5cf6 → #7c3aed)
- 🔵 **Juan Isaias**: Gradiente cyan (#06b6d4 → #0891b2)
- 🌸 **Juan Miguel**: Gradiente rosa (#ec4899 → #db2777)

## 🔧 Personalización

### Agregar nuevos usuarios

1. Edita `src/stores/auth.js`
2. Agrega el usuario al array `testUsers`
3. Crea un avatar SVG en `src/assets/avatars/`
4. Importa y asigna el avatar

### Modificar colores

1. Edita `src/styles/variables.scss`
2. Cambia las variables de color
3. Los avatares se actualizarán automáticamente

### Agregar nuevos estados de tarea

1. Modifica `taskStatuses` en `src/stores/tasks.js`
2. Agrega los iconos correspondientes en los componentes
3. Actualiza los estilos CSS si es necesario

## 📱 Responsive Design

### Breakpoints

- **Móvil**: < 480px
- **Tablet**: 480px - 768px
- **Desktop**: 768px - 1024px
- **Large**: > 1024px

### Características responsive

- Menú hamburguesa en móviles
- Grid adaptativo para tarjetas
- Navegación optimizada por dispositivo
- Formularios que se adaptan al tamaño de pantalla

## 🚀 Próximas Mejoras

- [ ] Notificaciones push
- [ ] Modo oscuro
- [ ] Exportación de datos
- [ ] Integración con API real
- [ ] Sistema de comentarios en tareas
- [ ] Adjuntar archivos a tareas
- [ ] Calendario de vencimientos

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

---

**Desarrollado con ❤️ usando Vue 3 y tecnologías modernas**
