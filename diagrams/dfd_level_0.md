graph TD
Usuario(["<img src='https://img.icons8.com/ios-filled/50/000000/user.png' width='30' /> Usuario"])
P0["<img src='https://img.icons8.com/fluency/48/000000/task.png' width='30' /> <br> 0. Sistema de<br>Gestión de Incidencias"]
DS_Tareas[/"<img src='https://img.icons8.com/ios-filled/50/000000/data-configuration.png' width='20' /> Tareas"/]
DS_Usuarios[/"<img src='https://img.icons8.com/ios-filled/50/000000/data-configuration.png' width='20' /> Usuarios"/]

    Usuario -- "Solicitud de Login" --> P0
    P0 -- "Interfaz de Usuario" --> Usuario
    Usuario -- "Datos de Nueva Tarea" --> P0
    Usuario -- "Solicitud de Lista de Tareas" --> P0
    P0 -- "Lista de Tareas" --> Usuario
    Usuario -- "Actualización de Tarea" --> P0
    Usuario -- "Solicitud de Eliminación de Tarea" --> P0

    P0 -- "Lectura/Escritura de Tareas" --> DS_Tareas
    P0 -- "Lectura de Usuarios (Autenticación)" --> DS_Usuarios
    P0 -- "Escritura de Sesión de Usuario" --> DS_Usuarios

    subgraph Almacenes de Datos
        DS_Tareas
        DS_Usuarios
    end

    style Usuario fill:#D1E8FF,stroke:#333,stroke-width:2px
    style P0 fill:#C8E6C9,stroke:#333,stroke-width:2px
    style DS_Tareas fill:#FFDDC1,stroke:#333,stroke-width:2px
    style DS_Usuarios fill:#FFDDC1,stroke:#333,stroke-width:2px
