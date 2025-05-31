graph TD
Usuario["<img src='https://img.icons8.com/ios-filled/50/000000/user.png' width='40' /> <br> Usuario"]
Sistema["<img src='https://img.icons8.com/fluency/48/000000/task.png' width='40' /> <br> Sistema de Gestión de Incidencias"]
LocalStorage["<img src='https://img.icons8.com/ios-filled/50/000000/database.png' width='40' /> <br> LocalStorage (Navegador)"]

    Usuario -- "Credenciales de Login" --> Sistema
    Usuario -- "Datos de Tarea (Nueva/Editada)" --> Sistema
    Usuario -- "Solicitudes de Visualización (Dashboard, Tareas, Perfil)" --> Sistema
    Usuario -- "Acciones de Tarea (Cambiar Estado, Eliminar)" --> Sistema

    Sistema -- "Interfaz de Login" --> Usuario
    Sistema -- "Interfaz de Aplicación (Vistas, Modales)" --> Usuario
    Sistema -- "Confirmaciones y Errores" --> Usuario
    Sistema -- "Datos de Tareas Mostrados" --> Usuario

    Sistema -- "Guardar/Cargar Sesión de Usuario" --> LocalStorage
    Sistema -- "Guardar/Cargar Tareas" --> LocalStorage

    style Usuario fill:#D1E8FF,stroke:#333,stroke-width:2px
    style Sistema fill:#C8E6C9,stroke:#333,stroke-width:2px
    style LocalStorage fill:#FFDDC1,stroke:#333,stroke-width:2px
