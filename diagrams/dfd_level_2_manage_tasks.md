graph TD
Usuario(["<img src='https://img.icons8.com/ios-filled/50/000000/user.png' width='30' /> Usuario"])

    subgraph Proceso2_Gestionar_Tareas
        P2_1["<img src='https://img.icons8.com/fluency/48/000000/add-file.png' width='20'/> <br>2.1 Crear Tarea"]
        P2_2["<img src='https://img.icons8.com/fluency/48/000000/overview-pages-3.png' width='20'/> <br>2.2 Leer Tareas"]
        P2_3["<img src='https://img.icons8.com/fluency/48/000000/approve-and-update.png' width='20'/> <br>2.3 Actualizar Tarea"]
        P2_4["<img src='https://img.icons8.com/fluency/48/000000/delete-file.png' width='20'/> <br>2.4 Eliminar Tarea"]
        P2_5["<img src='https://img.icons8.com/fluency/48/000000/data-quality.png' width='20'/> <br>2.5 Cambiar Estado Tarea"]
    end

    DS_Tareas[/"<img src='https://img.icons8.com/ios-filled/50/000000/data-configuration.png' width='20' /> Tareas"/]
    DS_Usuarios[/"<img src='https://img.icons8.com/ios-filled/50/000000/data-configuration.png' width='20' /> Usuarios"/]

    Usuario -- "Datos Nueva Tarea" --> P2_1
    P2_1 -- "Tarea Creada / Error" --> Usuario
    P2_1 -- "Escribir Nueva Tarea" --> DS_Tareas
    P2_1 -- "Leer ID Usuario (Creador)" --> DS_Usuarios

    Usuario -- "Solicitud Lista/Detalle Tareas" --> P2_2
    P2_2 -- "Lista Tareas / Detalles Tarea" --> Usuario
    P2_2 -- "Leer Tareas" --> DS_Tareas
    P2_2 -- "Leer Datos Usuario (Asignado/Creador)" --> DS_Usuarios

    Usuario -- "Datos Edición Tarea" --> P2_3
    P2_3 -- "Tarea Actualizada / Error" --> Usuario
    P2_3 -- "Actualizar Tarea Existente" --> DS_Tareas
    P2_3 -- "Leer ID Usuario (Verificar Permisos)" --> DS_Usuarios

    Usuario -- "Solicitud Borrar Tarea" --> P2_4
    P2_4 -- "Confirmación Eliminación / Error" --> Usuario
    P2_4 -- "Eliminar Tarea" --> DS_Tareas
    P2_4 -- "Leer ID Usuario (Verificar Permisos)" --> DS_Usuarios

    Usuario -- "Nuevo Estado" --> P2_5
    P2_5 -- "Confirmación Cambio Estado / Error" --> Usuario
    P2_5 -- "Actualizar Estado Tarea" --> DS_Tareas
    P2_5 -- "Leer ID Usuario (Verificar Permisos)" --> DS_Usuarios

    style Usuario fill:#D1E8FF,stroke:#333,stroke-width:2px
    style P2_1 fill:#C8E6C9,stroke:#333,stroke-width:2px
    style P2_2 fill:#C8E6C9,stroke:#333,stroke-width:2px
    style P2_3 fill:#C8E6C9,stroke:#333,stroke-width:2px
    style P2_4 fill:#C8E6C9,stroke:#333,stroke-width:2px
    style P2_5 fill:#C8E6C9,stroke:#333,stroke-width:2px
    style DS_Tareas fill:#FFDDC1,stroke:#333,stroke-width:2px
    style DS_Usuarios fill:#FFDDC1,stroke:#333,stroke-width:2px
