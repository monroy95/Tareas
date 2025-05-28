<template>
  <div class="tasks-page">
    <!-- Header -->
    <div class="page-header">
      <div class="header-content">
        <h1 class="page-title">Gestión de Tareas</h1>
        <p class="page-subtitle">
          Administra y da seguimiento a todas tus incidencias
        </p>
      </div>
      <button class="btn btn--primary" @click="showCreateModal = true">
        <Plus class="icon" />
        Nueva Tarea
      </button>
    </div>

    <!-- Filtros y búsqueda -->
    <div class="filters-section">
      <div class="search-box">
        <Search class="search-icon" />
        <input
          v-model="searchTerm"
          type="text"
          placeholder="Buscar tareas..."
          class="search-input"
        />
      </div>

      <div class="filter-tabs">
        <button
          v-for="filterOption in filterOptions"
          :key="filterOption.value"
          class="filter-tab"
          :class="{ active: tasksStore.filter === filterOption.value }"
          @click="tasksStore.setFilter(filterOption.value)"
        >
          <component :is="filterOption.icon" class="icon" />
          {{ filterOption.label }}
          <span class="count">{{ getFilterCount(filterOption.value) }}</span>
        </button>
      </div>
    </div>

    <!-- Loading state -->
    <div v-if="tasksStore.isLoading" class="loading-container">
      <div class="loading">Cargando tareas...</div>
    </div>

    <!-- Lista de tareas -->
    <div v-else class="tasks-container">
      <div v-if="filteredTasks.length === 0" class="empty-state">
        <div class="empty-content">
          <ClipboardList class="empty-icon" />
          <h3>No se encontraron tareas</h3>
          <p v-if="searchTerm">
            No hay tareas que coincidan con "{{ searchTerm }}"
          </p>
          <p v-else-if="tasksStore.filter !== 'all'">
            No hay tareas en el estado "{{ getCurrentFilterLabel() }}"
          </p>
          <p v-else>Aún no tienes tareas creadas. ¡Crea tu primera tarea!</p>
          <button
            v-if="!searchTerm"
            class="btn btn--primary"
            @click="showCreateModal = true"
          >
            <Plus class="icon" />
            Crear Primera Tarea
          </button>
        </div>
      </div>

      <div v-else class="tasks-grid">
        <div
          v-for="task in filteredTasks"
          :key="task.id"
          class="task-card"
          @click="$router.push(`/tasks/${task.id}`)"
        >
          <!-- Header de la tarjeta -->
          <div class="task-header">
            <div class="task-priority" :class="`priority-${task.priority}`">
              <span class="priority-label">{{
                getPriorityLabel(task.priority)
              }}</span>
            </div>
            <div class="task-actions" @click.stop>
              <button class="action-btn" @click="showTaskMenu(task.id, $event)">
                <MoreVertical class="icon" />
              </button>
            </div>
          </div>

          <!-- Contenido de la tarjeta -->
          <div class="task-content">
            <h3 class="task-title">{{ task.title }}</h3>
            <p class="task-description">
              {{ truncateText(task.description, 120) }}
            </p>
          </div>

          <!-- Footer de la tarjeta -->
          <div class="task-footer">
            <div class="task-status">
              <div
                class="status-indicator"
                :class="`status-${task.status}`"
              ></div>
              <span class="status-label">{{
                getStatusLabel(task.status)
              }}</span>
            </div>

            <div class="task-meta">
              <div
                v-if="task.dueDate"
                class="due-date"
                :class="{ overdue: isOverdue(task.dueDate) }"
              >
                <Calendar class="icon" />
                <span>{{ formatDate(task.dueDate) }}</span>
              </div>
              <div class="assigned-user">
                <img
                  :src="getAssignedUser(task.assignedTo)?.avatar"
                  :alt="getAssignedUser(task.assignedTo)?.name"
                  class="user-avatar"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Menú contextual -->
    <div
      v-if="showMenu"
      ref="contextMenu"
      class="context-menu"
      :style="{ top: menuPosition.y + 'px', left: menuPosition.x + 'px' }"
      @click.stop
    >
      <template v-if="selectedTask && tasksStore.canEditTask(selectedTask.id)">
        <button
          v-for="status in tasksStore.taskStatuses.filter(
            (s) => s.value !== selectedTask?.status
          )"
          :key="status.value"
          class="menu-item"
          @click="changeTaskStatus(selectedTask.id, status.value)"
        >
          <component :is="getStatusIcon(status.value)" class="icon" />
          Marcar como {{ status.label.toLowerCase() }}
        </button>
      </template>

      <div
        v-if="
          selectedTask &&
          tasksStore.canEditTask(selectedTask.id) &&
          tasksStore.canDeleteTask(selectedTask.id)
        "
        class="menu-divider"
      ></div>

      <button
        v-if="selectedTask && tasksStore.canDeleteTask(selectedTask.id)"
        class="menu-item menu-item--danger"
        @click="deleteTask(selectedTask.id)"
      >
        <Trash2 class="icon" />
        Eliminar tarea
      </button>

      <div
        v-if="
          selectedTask &&
          !tasksStore.canEditTask(selectedTask.id) &&
          !tasksStore.canDeleteTask(selectedTask.id)
        "
        class="menu-item menu-item--disabled"
      >
        No tienes permisos para modificar esta tarea
      </div>
    </div>

    <!-- Overlay para cerrar menú -->
    <div v-if="showMenu" class="menu-overlay" @click="closeMenu"></div>

    <!-- Modal de crear tarea -->
    <CreateTaskModal
      v-if="showCreateModal"
      @close="showCreateModal = false"
      @created="handleTaskCreated"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from "vue";
import { useTasksStore } from "@/stores/tasks";
import { useAuthStore } from "@/stores/auth";
import { format, isAfter } from "date-fns";
import { es } from "date-fns/locale";
import CreateTaskModal from "@/components/CreateTaskModal.vue";
import {
  Plus,
  Search,
  ClipboardList,
  Calendar,
  MoreVertical,
  Clock,
  PlayCircle,
  CheckCircle,
  XCircle,
  Trash2,
} from "lucide-vue-next";

const tasksStore = useTasksStore();
const authStore = useAuthStore();

// State
const searchTerm = ref("");
const showCreateModal = ref(false);
const showMenu = ref(false);
const selectedTask = ref(null);
const menuPosition = ref({ x: 0, y: 0 });
const contextMenu = ref(null);

// Computed
const filterOptions = computed(() => [
  { value: "all", label: "Todas", icon: ClipboardList },
  { value: "pending", label: "Pendientes", icon: Clock },
  { value: "in-progress", label: "En Progreso", icon: PlayCircle },
  { value: "completed", label: "Completadas", icon: CheckCircle },
]);

const filteredTasks = computed(() => {
  let tasks = tasksStore.filteredTasks;

  if (searchTerm.value) {
    const search = searchTerm.value.toLowerCase();
    tasks = tasks.filter(
      (task) =>
        task.title.toLowerCase().includes(search) ||
        task.description.toLowerCase().includes(search)
    );
  }

  return tasks.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
});

// Methods
const formatDate = (dateString) => {
  return format(new Date(dateString), "dd MMM", { locale: es });
};

const truncateText = (text, length) => {
  if (text.length <= length) return text;
  return text.substring(0, length) + "...";
};

const isOverdue = (dueDate) => {
  return isAfter(new Date(), new Date(dueDate));
};

const getPriorityLabel = (priority) => {
  const priorityObj = tasksStore.priorities.find((p) => p.value === priority);
  return priorityObj ? priorityObj.label : priority;
};

const getStatusLabel = (status) => {
  const statusObj = tasksStore.taskStatuses.find((s) => s.value === status);
  return statusObj ? statusObj.label : status;
};

const getStatusIcon = (status) => {
  const iconMap = {
    pending: Clock,
    "in-progress": PlayCircle,
    completed: CheckCircle,
    cancelled: XCircle,
  };
  return iconMap[status] || Clock;
};

const getAssignedUser = (userId) => {
  return authStore.getTestUsers().find((user) => user.id === userId);
};

const getFilterCount = (filter) => {
  if (filter === "all") return tasksStore.authorizedTasks.length;
  return tasksStore.authorizedTasks.filter((task) => task.status === filter)
    .length;
};

const getCurrentFilterLabel = () => {
  const current = filterOptions.value.find(
    (f) => f.value === tasksStore.filter
  );
  return current ? current.label.toLowerCase() : "";
};

const showTaskMenu = async (taskId, event) => {
  selectedTask.value = tasksStore.getTaskById(taskId);
  showMenu.value = true;

  await nextTick();

  const rect = event.target.getBoundingClientRect();
  menuPosition.value = {
    x: rect.left - 150,
    y: rect.bottom + 5,
  };

  // Ajustar posición si se sale de la pantalla
  if (contextMenu.value) {
    const menuRect = contextMenu.value.getBoundingClientRect();
    if (menuRect.right > window.innerWidth) {
      menuPosition.value.x = rect.right - menuRect.width;
    }
    if (menuRect.bottom > window.innerHeight) {
      menuPosition.value.y = rect.top - menuRect.height - 5;
    }
  }
};

const closeMenu = () => {
  showMenu.value = false;
  selectedTask.value = null;
};

const changeTaskStatus = async (taskId, newStatus) => {
  // Verificar permisos antes de cambiar el estado
  if (!tasksStore.canEditTask(taskId)) {
    alert("No tienes permisos para modificar esta tarea.");
    closeMenu();
    return;
  }

  try {
    await tasksStore.changeTaskStatus(taskId, newStatus);
    closeMenu();
  } catch (error) {
    console.error("Error changing task status:", error);
  }
};

const deleteTask = async (taskId) => {
  // Verificar permisos antes de eliminar
  if (!tasksStore.canDeleteTask(taskId)) {
    alert(
      "No tienes permisos para eliminar esta tarea. Solo el creador puede eliminarla."
    );
    closeMenu();
    return;
  }

  if (confirm("¿Estás seguro de que quieres eliminar esta tarea?")) {
    try {
      await tasksStore.deleteTask(taskId);
      closeMenu();
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  }
};

const handleTaskCreated = () => {
  showCreateModal.value = false;
};

// Lifecycle
onMounted(() => {
  tasksStore.loadTasks();

  // Cerrar menú al hacer clic fuera
  document.addEventListener("click", closeMenu);
});
</script>

<style lang="scss" scoped>
@use "sass:color";
.tasks-page {
  max-width: 1200px;
  margin: 0 auto;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: $spacing-xl;
  gap: $spacing-md;

  @media (max-width: $tablet) {
    flex-direction: column;
    align-items: stretch;
  }

  .header-content {
    flex: 1;

    .page-title {
      font-size: $font-size-3xl;
      font-weight: 700;
      color: $gray-900;
      margin: 0 0 $spacing-xs 0;

      @media (max-width: $mobile) {
        font-size: $font-size-2xl;
      }
    }

    .page-subtitle {
      color: $gray-600;
      margin: 0;
    }
  }
}

.filters-section {
  background: $white;
  border-radius: $border-radius-lg;
  box-shadow: $shadow;
  padding: $spacing-lg;
  margin-bottom: $spacing-xl;

  .search-box {
    position: relative;
    margin-bottom: $spacing-lg;

    .search-icon {
      position: absolute;
      left: $spacing-md;
      top: 50%;
      transform: translateY(-50%);
      width: 1rem;
      height: 1rem;
      color: $gray-400;
    }

    .search-input {
      width: 100%;
      padding: $spacing-sm $spacing-md $spacing-sm 2.5rem;
      border: 1px solid $gray-300;
      border-radius: $border-radius;
      font-size: $font-size-base;
      transition: border-color 0.2s ease;

      &:focus {
        outline: none;
        border-color: $primary;
        box-shadow: 0 0 0 3px rgba($primary, 0.1);
      }
    }
  }

  .filter-tabs {
    display: flex;
    gap: $spacing-sm;
    overflow-x: auto;

    .filter-tab {
      display: flex;
      align-items: center;
      gap: $spacing-sm;
      padding: $spacing-sm $spacing-md;
      background: none;
      border: 1px solid $gray-300;
      border-radius: $border-radius;
      cursor: pointer;
      transition: all 0.2s ease;
      white-space: nowrap;
      font-size: $font-size-sm;

      &:hover {
        border-color: $primary;
        background: rgba($primary, 0.05);
      }

      &.active {
        background: $primary;
        border-color: $primary;
        color: $white;

        .count {
          background: rgba($white, 0.2);
          color: $white;
        }
      }

      .icon {
        width: 1rem;
        height: 1rem;
      }

      .count {
        background: $gray-200;
        color: $gray-600;
        padding: $spacing-xs $spacing-sm;
        border-radius: $border-radius-sm;
        font-size: $font-size-xs;
        font-weight: 500;
        min-width: 1.5rem;
        text-align: center;
      }
    }
  }
}

.loading-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 200px;
}

.empty-state {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;

  .empty-content {
    text-align: center;
    max-width: 400px;

    .empty-icon {
      width: 4rem;
      height: 4rem;
      color: $gray-400;
      margin: 0 auto $spacing-lg auto;
    }

    h3 {
      font-size: $font-size-xl;
      font-weight: 600;
      color: $gray-900;
      margin: 0 0 $spacing-md 0;
    }

    p {
      color: $gray-600;
      margin: 0 0 $spacing-lg 0;
    }
  }
}

.tasks-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: $spacing-lg;

  @media (max-width: $mobile) {
    grid-template-columns: 1fr;
    gap: $spacing-md;
  }
}

.task-card {
  background: $white;
  border-radius: $border-radius-lg;
  box-shadow: $shadow;
  padding: $spacing-lg;
  cursor: pointer;
  transition: all 0.2s ease;
  border-left: 4px solid transparent;

  &:hover {
    box-shadow: $shadow-md;
    transform: translateY(-2px);
  }

  .task-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: $spacing-md;

    .task-priority {
      padding: $spacing-xs $spacing-sm;
      border-radius: $border-radius-sm;
      font-size: $font-size-xs;
      font-weight: 500;

      &.priority-low {
        background: rgba($success, 0.1);
        color: color.adjust($success, $lightness: -20%);
      }

      &.priority-medium {
        background: rgba($warning, 0.1);
        color: color.adjust($warning, $lightness: -20%);
      }

      &.priority-high {
        background: rgba($error, 0.1);
        color: color.adjust($error, $lightness: -20%);
      }
    }

    .task-actions {
      .action-btn {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 2rem;
        height: 2rem;
        background: none;
        border: none;
        border-radius: $border-radius;
        cursor: pointer;
        color: $gray-400;
        transition: all 0.2s ease;

        &:hover {
          background: $gray-100;
          color: $gray-600;
        }

        .icon {
          width: 1rem;
          height: 1rem;
        }
      }
    }
  }

  .task-content {
    margin-bottom: $spacing-lg;

    .task-title {
      font-size: $font-size-lg;
      font-weight: 600;
      color: $gray-900;
      margin: 0 0 $spacing-sm 0;
      line-height: 1.3;
    }

    .task-description {
      color: $gray-600;
      line-height: 1.5;
      margin: 0;
    }
  }

  .task-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .task-status {
      display: flex;
      align-items: center;
      gap: $spacing-sm;

      .status-indicator {
        width: 0.5rem;
        height: 0.5rem;
        border-radius: 50%;

        &.status-pending {
          background: $warning;
        }
        &.status-in-progress {
          background: $info;
        }
        &.status-completed {
          background: $success;
        }
        &.status-cancelled {
          background: $error;
        }
      }

      .status-label {
        font-size: $font-size-sm;
        color: $gray-600;
        font-weight: 500;
      }
    }

    .task-meta {
      display: flex;
      align-items: center;
      gap: $spacing-md;

      .due-date {
        display: flex;
        align-items: center;
        gap: $spacing-xs;
        font-size: $font-size-xs;
        color: $gray-500;

        &.overdue {
          color: $error;
        }

        .icon {
          width: 0.875rem;
          height: 0.875rem;
        }
      }

      .assigned-user {
        .user-avatar {
          width: 1.5rem;
          height: 1.5rem;
          border-radius: 50%;
          object-fit: cover;
        }
      }
    }
  }
}

.context-menu {
  position: fixed;
  background: $white;
  border-radius: $border-radius;
  box-shadow: $shadow-lg;
  border: 1px solid $gray-200;
  z-index: 1000;
  min-width: 200px;
  overflow: hidden;

  .menu-item {
    display: flex;
    align-items: center;
    gap: $spacing-sm;
    width: 100%;
    padding: $spacing-sm $spacing-md;
    background: none;
    border: none;
    text-align: left;
    cursor: pointer;
    transition: background-color 0.2s ease;
    font-size: $font-size-sm;
    color: $gray-700;

    &:hover {
      background: $gray-50;
    }

    &--danger {
      color: $error;

      &:hover {
        background: rgba($error, 0.05);
      }
    }

    &--disabled {
      color: $gray-400;
      cursor: default;
      font-style: italic;

      &:hover {
        background: none;
      }
    }

    .icon {
      width: 1rem;
      height: 1rem;
    }
  }

  .menu-divider {
    height: 1px;
    background: $gray-200;
    margin: $spacing-xs 0;
  }
}

.menu-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 999;
}
</style>
