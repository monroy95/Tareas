import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { useAuthStore } from "./auth";

export const useTasksStore = defineStore("tasks", () => {
  const tasks = ref([]);
  const isLoading = ref(false);
  const filter = ref("all"); // all, pending, in-progress, completed

  // Estados de las tareas
  const taskStatuses = [
    { value: "pending", label: "Pendiente", color: "warning" },
    { value: "in-progress", label: "En Progreso", color: "info" },
    { value: "completed", label: "Completada", color: "success" },
    { value: "cancelled", label: "Cancelada", color: "error" },
  ];

  // Prioridades
  const priorities = [
    { value: "low", label: "Baja", color: "success" },
    { value: "medium", label: "Media", color: "warning" },
    { value: "high", label: "Alta", color: "error" },
  ];

  // Computed - Tareas filtradas por autorización (solo las del usuario actual)
  const authorizedTasks = computed(() => {
    const authStore = useAuthStore();
    if (!authStore.user) return [];

    const userId = authStore.user.id;
    return tasks.value.filter(
      (task) => task.assignedTo === userId || task.createdBy === userId
    );
  });

  const filteredTasks = computed(() => {
    if (filter.value === "all") return authorizedTasks.value;
    return authorizedTasks.value.filter((task) => task.status === filter.value);
  });

  const tasksByStatus = computed(() => {
    return taskStatuses.reduce((acc, status) => {
      acc[status.value] = authorizedTasks.value.filter(
        (task) => task.status === status.value
      );
      return acc;
    }, {});
  });

  const taskStats = computed(() => {
    const total = authorizedTasks.value.length;
    const pending = authorizedTasks.value.filter(
      (t) => t.status === "pending"
    ).length;
    const inProgress = authorizedTasks.value.filter(
      (t) => t.status === "in-progress"
    ).length;
    const completed = authorizedTasks.value.filter(
      (t) => t.status === "completed"
    ).length;

    return { total, pending, inProgress, completed };
  });

  // Actions
  const loadTasks = async () => {
    isLoading.value = true;

    try {
      // Simular carga desde API
      await new Promise((resolve) => setTimeout(resolve, 800));

      // Cargar tareas desde localStorage o crear datos de ejemplo
      const savedTasks = localStorage.getItem("tasks");
      if (savedTasks) {
        tasks.value = JSON.parse(savedTasks);
      } else {
        // Datos de ejemplo
        tasks.value = generateSampleTasks();
        saveTasks();
      }
    } finally {
      isLoading.value = false;
    }
  };

  const createTask = async (taskData) => {
    const authStore = useAuthStore();

    const newTask = {
      id: Date.now(),
      title: taskData.title,
      description: taskData.description,
      priority: taskData.priority || "medium",
      status: "pending",
      assignedTo: taskData.assignedTo || authStore.user.id,
      createdBy: authStore.user.id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      dueDate: taskData.dueDate || null,
    };

    tasks.value.unshift(newTask);
    saveTasks();
    return newTask;
  };

  const updateTask = async (taskId, updates) => {
    const authStore = useAuthStore();
    const taskIndex = tasks.value.findIndex((t) => t.id === taskId);
    if (taskIndex === -1) throw new Error("Tarea no encontrada");

    const task = tasks.value[taskIndex];
    const userId = authStore.user.id;

    // Verificar permisos: el usuario debe ser el creador o el asignado
    if (task.assignedTo !== userId && task.createdBy !== userId) {
      throw new Error("No tienes permisos para actualizar esta tarea");
    }

    tasks.value[taskIndex] = {
      ...tasks.value[taskIndex],
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    saveTasks();
    return tasks.value[taskIndex];
  };

  const deleteTask = async (taskId) => {
    const authStore = useAuthStore();
    const taskIndex = tasks.value.findIndex((t) => t.id === taskId);
    if (taskIndex === -1) throw new Error("Tarea no encontrada");

    const task = tasks.value[taskIndex];
    const userId = authStore.user.id;

    // Verificar permisos: solo el creador puede eliminar la tarea
    if (task.createdBy !== userId) {
      throw new Error("Solo el creador de la tarea puede eliminarla");
    }

    tasks.value.splice(taskIndex, 1);
    saveTasks();
  };

  const changeTaskStatus = async (taskId, newStatus) => {
    return updateTask(taskId, { status: newStatus });
  };

  const setFilter = (newFilter) => {
    filter.value = newFilter;
  };

  const saveTasks = () => {
    localStorage.setItem("tasks", JSON.stringify(tasks.value));
  };

  const getTaskById = (taskId) => {
    const authStore = useAuthStore();
    const task = tasks.value.find((t) => t.id === taskId);

    // Verificar autorización: el usuario debe ser el creador o el asignado
    if (task && authStore.user) {
      const userId = authStore.user.id;
      if (task.assignedTo === userId || task.createdBy === userId) {
        return task;
      }
    }

    return null;
  };

  // Función para verificar si el usuario puede ver una tarea específica
  const canAccessTask = (taskId) => {
    const authStore = useAuthStore();
    const task = tasks.value.find((t) => t.id === taskId);

    if (!task || !authStore.user) return false;

    const userId = authStore.user.id;
    return task.assignedTo === userId || task.createdBy === userId;
  };

  // Función para verificar si el usuario puede editar una tarea
  const canEditTask = (taskId) => {
    const authStore = useAuthStore();
    const task = tasks.value.find((t) => t.id === taskId);

    if (!task || !authStore.user) return false;

    const userId = authStore.user.id;
    // El usuario puede editar si es el creador o el asignado
    return task.assignedTo === userId || task.createdBy === userId;
  };

  // Función para verificar si el usuario puede eliminar una tarea
  const canDeleteTask = (taskId) => {
    const authStore = useAuthStore();
    const task = tasks.value.find((t) => t.id === taskId);

    if (!task || !authStore.user) return false;

    const userId = authStore.user.id;
    // Solo el creador puede eliminar la tarea
    return task.createdBy === userId;
  };

  // Generar datos de ejemplo
  const generateSampleTasks = () => {
    return [
      {
        id: 1,
        title: "Resolver problema de conexión a la base de datos",
        description:
          "Los usuarios reportan errores intermitentes al acceder a la aplicación. Investigar y solucionar el problema de conectividad.",
        priority: "high",
        status: "in-progress",
        assignedTo: 1,
        createdBy: 1,
        createdAt: new Date(Date.now() - 86400000).toISOString(), // Hace 1 día
        updatedAt: new Date().toISOString(),
        dueDate: new Date(Date.now() + 172800000).toISOString(), // En 2 días
      },
      {
        id: 2,
        title: "Actualizar documentación de API",
        description:
          "La documentación actual está desactualizada. Necesita incluir los nuevos endpoints y parámetros.",
        priority: "medium",
        status: "pending",
        assignedTo: 2,
        createdBy: 1,
        createdAt: new Date(Date.now() - 172800000).toISOString(), // Hace 2 días
        updatedAt: new Date(Date.now() - 172800000).toISOString(),
        dueDate: new Date(Date.now() + 604800000).toISOString(), // En 1 semana
      },
      {
        id: 3,
        title: "Implementar autenticación de dos factores",
        description:
          "Mejorar la seguridad del sistema implementando 2FA para todos los usuarios administrativos.",
        priority: "high",
        status: "pending",
        assignedTo: 3,
        createdBy: 1,
        createdAt: new Date(Date.now() - 259200000).toISOString(), // Hace 3 días
        updatedAt: new Date(Date.now() - 259200000).toISOString(),
        dueDate: new Date(Date.now() + 1209600000).toISOString(), // En 2 semanas
      },
      {
        id: 4,
        title: "Optimizar rendimiento de consultas",
        description:
          "Las consultas a la base de datos están tardando más de lo esperado. Revisar y optimizar índices.",
        priority: "medium",
        status: "completed",
        assignedTo: 2,
        createdBy: 1,
        createdAt: new Date(Date.now() - 432000000).toISOString(), // Hace 5 días
        updatedAt: new Date(Date.now() - 86400000).toISOString(), // Actualizada hace 1 día
        dueDate: new Date(Date.now() - 86400000).toISOString(), // Vencía hace 1 día
      },
      {
        id: 5,
        title: "Revisar logs de errores del servidor",
        description:
          "Analizar los logs de la última semana para identificar patrones de errores y posibles mejoras.",
        priority: "low",
        status: "pending",
        assignedTo: 3,
        createdBy: 2,
        createdAt: new Date(Date.now() - 86400000).toISOString(), // Hace 1 día
        updatedAt: new Date(Date.now() - 86400000).toISOString(),
        dueDate: new Date(Date.now() + 432000000).toISOString(), // En 5 días
      },
    ];
  };

  return {
    // State
    tasks,
    isLoading,
    filter,
    taskStatuses,
    priorities,

    // Getters
    authorizedTasks,
    filteredTasks,
    tasksByStatus,
    taskStats,

    // Actions
    loadTasks,
    createTask,
    updateTask,
    deleteTask,
    changeTaskStatus,
    setFilter,
    getTaskById,
    canAccessTask,
    canEditTask,
    canDeleteTask,
  };
});
