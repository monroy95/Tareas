# Diccionario de Datos: Sistema de Gestión de Incidencias

## 1. Entidades Principales

### 1.1. Usuario (User)

Representa a un usuario del sistema.

| Atributo | Tipo         | Descripción                                         | PK/FK | Restricciones     |
| -------- | ------------ | --------------------------------------------------- | ----- | ----------------- |
| id       | Número       | Identificador único del usuario                     | PK    | Requerido, Único  |
| email    | Cadena       | Correo electrónico del usuario                      |       | Requerido, Único  |
| password | Cadena       | Contraseña del usuario (almacenada de forma segura) |       | Requerido, Mín. 6 |
| name     | Cadena       | Nombre completo del usuario                         |       | Requerido         |
| role     | Cadena       | Rol del usuario en el sistema ('admin', 'user')     |       | Requerido         |
| avatar   | Cadena (URL) | URL de la imagen de avatar del usuario              |       | Opcional          |

### 1.2. Tarea (Task)

Representa una incidencia o tarea a gestionar.

| Atributo    | Tipo       | Descripción                                                                    | PK/FK           | Restricciones                                 |
| ----------- | ---------- | ------------------------------------------------------------------------------ | --------------- | --------------------------------------------- |
| id          | Número     | Identificador único de la tarea                                                | PK              | Requerido, Único (timestamp)                  |
| title       | Cadena     | Título breve de la tarea                                                       |                 | Requerido, Mín. 3 caracteres, Máx. 100        |
| description | Cadena     | Descripción detallada de la tarea                                              |                 | Requerido, Mín. 10 caracteres, Máx. 500       |
| priority    | Cadena     | Prioridad de la tarea ('low', 'medium', 'high')                                |                 | Requerido, Valor de lista predefinida         |
| status      | Cadena     | Estado actual de la tarea ('pending', 'in-progress', 'completed', 'cancelled') |                 | Requerido, Valor de lista predefinida         |
| assignedTo  | Número     | ID del usuario al que se asigna la tarea                                       | FK (Usuario.id) | Requerido, Debe existir un Usuario con ese ID |
| createdBy   | Número     | ID del usuario que creó la tarea                                               | FK (Usuario.id) | Requerido, Debe existir un Usuario con ese ID |
| createdAt   | Fecha/Hora | Fecha y hora de creación de la tarea                                           |                 | Requerido, Generado automáticamente           |
| updatedAt   | Fecha/Hora | Fecha y hora de la última actualización                                        |                 | Requerido, Generado automáticamente           |
| dueDate     | Fecha      | Fecha de vencimiento de la tarea                                               |                 | Opcional                                      |

## 2. Almacenes de Datos (Stores en Pinia / LocalStorage)

### 2.1. DS_Usuarios (authStore / localStorage 'user')

Almacena la información del usuario autenticado y la lista de usuarios de prueba.

- **Estructura (usuario autenticado):** Objeto `User` (sin el campo `password`).
- **Estructura (testUsers en authStore):** Array de objetos `User`.

### 2.2. DS_Tareas (tasksStore / localStorage 'tasks')

Almacena la lista de todas las tareas creadas en el sistema.

- **Estructura:** Array de objetos `Task`.

## 3. Flujos de Datos Importantes (Selección)

### 3.1. Credenciales de Login

- **Descripción:** Datos enviados por el usuario para iniciar sesión.
- **Composición:**
  - `email` (Cadena)
  - `password` (Cadena)

### 3.2. Datos de Nueva Tarea

- **Descripción:** Información proporcionada por el usuario para crear una nueva tarea.
- **Composición:**
  - `title` (Cadena)
  - `description` (Cadena)
  - `priority` (Cadena)
  - `assignedTo` (Número - ID Usuario)
  - `dueDate` (Cadena - Fecha ISO, opcional)

### 3.3. Datos de Edición Tarea

- **Descripción:** Actualizaciones que el usuario aplica a una tarea existente.
- \*\*Composición (parcial, solo campos modificables por el usuario a través del modal):
  - `title` (Cadena)
  - `description` (Cadena)
  - `priority` (Cadena)
  - `status` (Cadena)
  - `assignedTo` (Número - ID Usuario)
  - `dueDate` (Cadena - Fecha ISO, opcional)

### 3.4. Interfaz de Usuario (General)

- **Descripción:** Datos visuales y de estado que el sistema presenta al usuario.
- **Composición:** Varía según la vista, pero incluye elementos como:
  - Listas de tareas (arrays de objetos `Task` enriquecidos con info de usuario).
  - Detalles de una tarea específica (objeto `Task` enriquecido).
  - Estadísticas del dashboard.
  - Formularios de entrada.
  - Mensajes de confirmación/error.

## 4. Enumeraciones y Valores Predefinidos

### 4.1. Roles de Usuario (`User.role`)

- `admin`: Administrador del sistema.
- `user`: Usuario regular.

### 4.2. Prioridades de Tarea (`Task.priority`)

- `low`: Baja
- `medium`: Media
- `high`: Alta

### 4.3. Estados de Tarea (`Task.status`)

- `pending`: Pendiente
- `in-progress`: En Progreso
- `completed`: Completada
- `cancelled`: Cancelada
