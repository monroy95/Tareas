# 📋 Aplicación de Gestión de Incidencias

Una aplicación web moderna y responsive para la gestión de incidencias y tareas diarias, desarrollada con Vue 3 y diseño mobile-first.

## ✨ Características

### 🔐 Sistema de Autenticación
- Login simulado con usuarios de prueba
- Persistencia de sesión con localStorage
- Roles de usuario (Administrador y Usuario)
- Interfaz de login moderna con preview de usuarios

### 📱 Diseño Responsive
- **Mobile-first**: Optimizada para dispositivos móviles
- **Responsive**: Se adapta a tablets y escritorio
- **Navegación intuitiva**: Menú hamburguesa en móviles
- **Touch-friendly**: Botones y elementos apropiados para touch

### 📊 Dashboard Interactivo
- **Estadísticas visuales**: Métricas de tareas en tiempo real
- **Gráficos informativos**: Distribución por estado y prioridad
- **Tareas recientes**: Vista rápida de la actividad
- **Alertas de prioridad**: Destacado de tareas urgentes

### 🎯 Gestión de Tareas
- **CRUD completo**: Crear, leer, actualizar y eliminar tareas
- **Estados personalizables**: Pendiente, En Progreso, Completada, Cancelada
- **Prioridades**: Baja, Media, Alta con códigos de color
- **Fechas de vencimiento**: Control de deadlines
- **Asignación de usuarios**: Gestión de responsables
- **Búsqueda y filtros**: Encontrar tareas rápidamente

### 🔍 Vista Detallada
- **Información completa**: Toda la información de la tarea
- **Historial de cambios**: Timeline de progreso
- **Acciones rápidas**: Cambio de estado directo
- **Metadatos**: Fechas, asignaciones, prioridad

### 👤 Perfil de Usuario
- **Información personal**: Datos del usuario
- **Estadísticas personales**: Métricas de productividad
- **Actividad reciente**: Historial de acciones
- **Configuración**: Preferencias de notificaciones

## 🚀 Tecnologías Utilizadas

- **Vue 3** - Framework principal con Composition API
- **Vue Router** - Navegación y rutas protegidas
- **Pinia** - Estado global de la aplicación
- **Vite** - Herramienta de desarrollo y build
- **SCSS** - Preprocesador CSS con variables
- **Lucide Vue** - Iconografía moderna
- **date-fns** - Manipulación de fechas
- **@vueuse/core** - Utilities para Vue

## 📦 Instalación

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

3. **Iniciar el servidor de desarrollo**
   ```bash
   npm run dev
   ```

4. **Abrir en el navegador**
   ```
   http://localhost:3000
   ```

## 👥 Usuarios de Prueba

La aplicación incluye usuarios hardcodeados para testing:

### Administrador
- **Email**: `admin@test.com`
- **Contraseña**: `admin123`
- **Permisos**: Acceso completo al sistema

### Usuario Regular
- **Email**: `usuario@test.com`
- **Contraseña**: `user123`
- **Permisos**: Gestión de tareas asignadas

### Usuario María
- **Email**: `maria@test.com`
- **Contraseña**: `maria123`
- **Permisos**: Usuario regular

## 🎮 Guía de Uso

### 1. Inicio de Sesión
- Accede a la aplicación
- Haz clic en cualquier usuario de prueba para autocompletar credenciales
- O ingresa manualmente email y contraseña
- Presiona "Iniciar Sesión"

### 2. Dashboard
- **Vista general**: Estadísticas principales en tarjetas
- **Tareas recientes**: Lista de últimas tareas modificadas
- **Crear tarea**: Botón "Nueva Tarea" en la parte superior
- **Navegación**: Links rápidos a secciones principales

### 3. Gestión de Tareas
- **Lista de tareas**: Vista de todas las tareas con filtros
- **Búsqueda**: Campo de búsqueda en tiempo real
- **Filtros por estado**: Pestañas para filtrar por estado
- **Crear tarea**: Modal con formulario completo
- **Acciones rápidas**: Menú contextual en cada tarea
- **Vista detallada**: Click en una tarea para ver detalles

### 4. Filtros y Búsqueda
- **Búsqueda por texto**: Busca en título y descripción
- **Filtros por estado**: Todas, Pendientes, En Progreso, Completadas
- **Ordenamiento**: Por fecha de creación (más recientes primero)

### 5. Estados de Tarea
- **Pendiente**: Tarea creada, esperando inicio
- **En Progreso**: Trabajo activo en la tarea
- **Completada**: Tarea finalizada exitosamente
- **Cancelada**: Tarea cancelada o descartada

### 6. Responsive Design
- **Móvil**: Navegación mediante menú hamburguesa
- **Tablet**: Layout adaptado a pantalla media
- **Desktop**: Vista completa con sidebar

## 🏗️ Estructura del Proyecto

```
src/
├── components/          # Componentes reutilizables
│   ├── CreateTaskModal.vue
│   └── EditTaskModal.vue
├── stores/             # Pinia stores
│   ├── auth.js         # Autenticación
│   └── tasks.js        # Gestión de tareas
├── views/              # Páginas principales
│   ├── LoginView.vue
│   ├── DashboardView.vue
│   ├── TasksView.vue
│   ├── TaskDetailView.vue
│   └── ProfileView.vue
├── router/             # Configuración de rutas
│   └── index.js
├── styles/             # Estilos globales
│   ├── variables.scss
│   └── main.scss
├── App.vue             # Componente raíz
└── main.js             # Punto de entrada
```

## 📱 Características Responsive

### Mobile (< 768px)
- Menú hamburguesa colapsible
- Tarjetas de tareas en columna única
- Botones optimizados para touch
- Formularios adaptados a pantalla pequeña

### Tablet (768px - 1024px)
- Grid de 2 columnas para tarjetas
- Navegación híbrida
- Balance entre información y usabilidad

### Desktop (> 1024px)
- Vista completa con todas las funcionalidades
- Grid de múltiples columnas
- Navegación siempre visible
- Espaciado generoso

## 🎨 Sistema de Diseño

### Colores
- **Primario**: #3b82f6 (Azul)
- **Éxito**: #10b981 (Verde)
- **Advertencia**: #f59e0b (Naranja)
- **Error**: #ef4444 (Rojo)
- **Info**: #06b6d4 (Cyan)

### Tipografía
- **Fuente**: Inter (Google Fonts)
- **Pesos**: 300, 400, 500, 600, 700
- **Escalas**: xs, sm, base, lg, xl, 2xl, 3xl

### Espaciado
- **Sistema**: Múltiplos de 4px
- **Variables**: xs(4px), sm(8px), md(16px), lg(24px), xl(32px), 2xl(48px)

## 🔧 Scripts Disponibles

```bash
# Desarrollo
npm run dev

# Build para producción
npm run build

# Preview del build
npm run preview

# Linting
npm run lint

# Formateo de código
npm run format
```

## 🌟 Funcionalidades Destacadas

### 1. Persistencia Local
- Las tareas se guardan en localStorage
- La sesión persiste entre recargas
- Datos de ejemplo incluidos

### 2. Validación de Formularios
- Validación en tiempo real
- Mensajes de error descriptivos
- Límites de caracteres visuales

### 3. Estados de Carga
- Indicadores visuales de carga
- Simulación de delays de API
- Estados de carga para mejor UX

### 4. Accesibilidad
- Navegación por teclado
- Labels descriptivos
- Contraste de colores adecuado
- Focus states visibles

### 5. Performance
- Lazy loading de componentes
- Computed properties optimizadas
- Debounce en búsquedas

## 🚀 Futuras Mejoras

### Funcionalidades Pendientes
- [ ] Notificaciones push
- [ ] Modo oscuro
- [ ] Exportar tareas a PDF/Excel
- [ ] Comentarios en tareas
- [ ] Archivos adjuntos
- [ ] Integración con API real
- [ ] Tests unitarios y E2E
- [ ] PWA (Progressive Web App)
- [ ] Sincronización offline

### Mejoras Técnicas
- [ ] Autenticación JWT real
- [ ] Base de datos persistente
- [ ] API REST completa
- [ ] Docker containerization
- [ ] CI/CD pipeline
- [ ] Monitoring y logging

## 🤝 Contribución

Las contribuciones son bienvenidas. Por favor:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 👨‍💻 Autor

Desarrollado como demo de aplicación Vue 3 responsive para gestión de incidencias.

---

¡Gracias por usar nuestra aplicación de gestión de incidencias! 🎉 