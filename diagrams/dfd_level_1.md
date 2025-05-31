graph TD
Usuario(["<img src='https://img.icons8.com/ios-filled/50/000000/user.png' width='30' /> Usuario"])

    subgraph Sistema_Gestion_Incidencias
        P1["<img src='https://img.icons8.com/fluency/48/000000/login-rounded-right.png' width='25'/> <br>1. Gestionar<br>Autenticación"]
        P2["<img src='https://img.icons8.com/fluency/48/000000/add-file.png' width='25'/> <br>2. Gestionar<br>Tareas"]
        P3["<img src='https://img.icons8.com/fluency/48/000000/combo-chart.png' width='25'/> <br>3. Visualizar<br>Dashboard"]
        P4["<img src='https://img.icons8.com/fluency/48/000000/contacts.png' width='25'/> <br>4. Visualizar<br>Perfil"]
    end

    DS_Tareas[/"<img src='https://img.icons8.com/ios-filled/50/000000/data-configuration.png' width='20' /> Tareas"/]
    DS_Usuarios[/"<img src='https://img.icons8.com/ios-filled/50/000000/data-configuration.png' width='20' /> Usuarios"/]

    Usuario -- "Credenciales" --> P1
    P1 -- "Info Sesión / Error Login" --> Usuario
    P1 -- "Datos de Usuario Autenticado" --> DS_Usuarios
    P1 -- "Leer Info Usuario" --> DS_Usuarios

    Usuario -- "Datos Nueva Tarea" --> P2
    Usuario -- "Datos Edición Tarea" --> P2
    Usuario -- "Solicitud Borrar Tarea" --> P2
    Usuario -- "Solicitud Cambiar Estado Tarea" --> P2
    P2 -- "Confirmación / Error" --> Usuario
    P2 -- "Lista Tareas / Detalles Tarea" --> Usuario
    P2 -- "CRUD Tareas" --> DS_Tareas
    P2 -- "Leer Datos Usuario (Asignado/Creador)" --> DS_Usuarios

    Usuario -- "Solicitud Dashboard" --> P3
    P3 -- "Datos Agregados de Tareas" --> Usuario
    P3 -- "Leer Tareas" --> DS_Tareas

    Usuario -- "Solicitud Perfil" --> P4
    P4 -- "Datos de Perfil y Actividad" --> Usuario
    P4 -- "Leer Info Usuario" --> DS_Usuarios
    P4 -- "Leer Tareas (para estadísticas)" --> DS_Tareas

    style Usuario fill:#D1E8FF,stroke:#333,stroke-width:2px
    style P1 fill:#C8E6C9,stroke:#333,stroke-width:2px
    style P2 fill:#C8E6C9,stroke:#333,stroke-width:2px
    style P3 fill:#C8E6C9,stroke:#333,stroke-width:2px
    style P4 fill:#C8E6C9,stroke:#333,stroke-width:2px
    style DS_Tareas fill:#FFDDC1,stroke:#333,stroke-width:2px
    style DS_Usuarios fill:#FFDDC1,stroke:#333,stroke-width:2px
