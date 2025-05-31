<template>
  <div class="task-detail">
    <!-- Loading state -->
    <div v-if="isLoading" class="loading-container">
      <div class="loading">Cargando tarea...</div>
    </div>

    <!-- Task not found or no access -->
    <div v-else-if="!task" class="not-found">
      <div class="not-found-content">
        <AlertCircle class="not-found-icon" />
        <h2>Tarea no encontrada</h2>
        <p>
          La tarea que buscas no existe, ha sido eliminada o no tienes permisos
          para verla.
        </p>
        <router-link to="/tasks" class="btn btn--primary">
          <ArrowLeft class="icon" />
          Volver a Tareas
        </router-link>
      </div>
    </div>

    <!-- Task detail content -->
    <div v-else class="task-content">
      <!-- Header -->
      <div class="task-header">
        <div class="header-nav">
          <button class="btn btn--outline btn--small" @click="$router.go(-1)">
            <ArrowLeft class="icon" />
            Volver
          </button>
          <div class="task-id">Tarea #{{ task.id }}</div>
        </div>

        <div class="header-actions">
          <button
            v-if="canEdit"
            class="btn btn--outline btn--small"
            @click="showEditModal = true"
          >
            <Edit class="icon" />
            Editar
          </button>
          <button
            v-if="canDelete"
            class="btn btn--danger btn--small"
            @click="handleDelete"
          >
            <Trash2 class="icon" />
            Eliminar
          </button>
        </div>
      </div>

      <!-- Main content -->
      <div class="task-main">
        <div class="task-info">
          <!-- Title and description -->
          <div class="info-section">
            <div class="task-title-section">
              <h1 class="task-title">{{ task.title }}</h1>
              <div class="task-badges">
                <span
                  class="priority-badge"
                  :class="`priority-${task.priority}`"
                >
                  {{ getPriorityLabel(task.priority) }}
                </span>
                <span class="status-badge" :class="`status-${task.status}`">
                  {{ getStatusLabel(task.status) }}
                </span>
              </div>
            </div>

            <div class="task-description">
              <h3>Descripción</h3>
              <p>{{ task.description }}</p>
            </div>
          </div>

          <!-- Status actions -->
          <div class="status-actions">
            <h3>Cambiar estado</h3>
            <div class="status-buttons">
              <button
                v-for="status in availableStatuses"
                :key="status.value"
                class="status-btn"
                :class="`btn--${status.color}`"
                @click="changeStatus(status.value)"
              >
                <component :is="getStatusIcon(status.value)" class="icon" />
                {{ status.label }}
              </button>
            </div>
          </div>
        </div>

        <!-- Sidebar -->
        <div class="task-sidebar">
          <!-- Details card -->
          <div class="detail-card">
            <h3>Detalles</h3>

            <div class="detail-item">
              <div class="detail-label">
                <User class="icon" />
                Asignado a
              </div>
              <div class="detail-value">
                <div class="user-info">
                  <UserAvatar
                    :src="assignedUser?.avatar"
                    :name="assignedUser?.name"
                    size="small"
                  />
                  <span>{{ assignedUser?.name }}</span>
                </div>
              </div>
            </div>

            <div class="detail-item">
              <div class="detail-label">
                <User class="icon" />
                Creado por
              </div>
              <div class="detail-value">
                <div class="user-info">
                  <UserAvatar
                    :src="createdByUser?.avatar"
                    :name="createdByUser?.name"
                    size="small"
                  />
                  <span>{{ createdByUser?.name }}</span>
                </div>
              </div>
            </div>

            <div class="detail-item">
              <div class="detail-label">
                <Calendar class="icon" />
                Fecha de creación
              </div>
              <div class="detail-value">
                {{ formatDateTime(task.createdAt) }}
              </div>
            </div>

            <div class="detail-item">
              <div class="detail-label">
                <Clock class="icon" />
                Última actualización
              </div>
              <div class="detail-value">
                {{ formatDateTime(task.updatedAt) }}
              </div>
            </div>

            <div v-if="task.dueDate" class="detail-item">
              <div class="detail-label">
                <AlertTriangle class="icon" />
                Fecha de vencimiento
              </div>
              <div
                class="detail-value"
                :class="{ overdue: isOverdue(task.dueDate) }"
              >
                {{ formatDateTime(task.dueDate) }}
                <span v-if="isOverdue(task.dueDate)" class="overdue-label">
                  (Vencida)
                </span>
              </div>
            </div>
          </div>

          <!-- Progress card -->
          <div class="progress-card">
            <h3>Progreso</h3>

            <div class="progress-timeline">
              <div
                v-for="(timelineStatus, index) in statusTimeline"
                :key="timelineStatus.value"
                class="timeline-item"
                :class="{
                  active: task.status === timelineStatus.value,
                  completed: isStatusCompleted(timelineStatus.value),
                }"
              >
                <div class="timeline-icon">
                  <component
                    :is="getStatusIcon(timelineStatus.value)"
                    class="icon"
                  />
                </div>
                <div class="timeline-content">
                  <div class="timeline-label">{{ timelineStatus.label }}</div>
                  <div
                    v-if="task.status === timelineStatus.value"
                    class="timeline-current"
                  >
                    Estado actual
                  </div>
                </div>
                <div
                  v-if="index < statusTimeline.length - 1"
                  class="timeline-line"
                  :class="{
                    completed: isStatusCompleted(timelineStatus.value),
                  }"
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Edit Modal -->
    <EditTaskModal
      v-if="showEditModal && task"
      :task="task"
      @close="showEditModal = false"
      @updated="handleTaskUpdated"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useTasksStore } from "@/stores/tasks";
import { useAuthStore } from "@/stores/auth";
import { format, isAfter } from "date-fns";
import { es } from "date-fns/locale";
import EditTaskModal from "@/components/EditTaskModal.vue";
import UserAvatar from "@/components/UserAvatar.vue";
import {
  ArrowLeft,
  Edit,
  Trash2,
  AlertCircle,
  User,
  Calendar,
  Clock,
  AlertTriangle,
  PlayCircle,
  CheckCircle,
  XCircle,
} from "lucide-vue-next";

const route = useRoute();
const router = useRouter();
const tasksStore = useTasksStore();
const authStore = useAuthStore();

// State
const isLoading = ref(true);
const showEditModal = ref(false);

// Computed
const task = computed(() => {
  const taskId = parseInt(route.params.id);
  return tasksStore.getTaskById(taskId);
});

const assignedUser = computed(() => {
  if (!task.value) return null;
  return authStore
    .getTestUsers()
    .find((user) => user.id === task.value.assignedTo);
});

const createdByUser = computed(() => {
  if (!task.value) return null;
  return authStore
    .getTestUsers()
    .find((user) => user.id === task.value.createdBy);
});

const availableStatuses = computed(() => {
  if (!task.value) return [];
  return tasksStore.taskStatuses.filter(
    (status) => status.value !== task.value.status
  );
});

const statusTimeline = computed(() => [
  { value: "pending", label: "Pendiente", icon: Clock },
  { value: "in-progress", label: "En Progreso", icon: PlayCircle },
  { value: "completed", label: "Completada", icon: CheckCircle },
]);

const canEdit = computed(() => {
  if (!task.value) return false;
  return tasksStore.canEditTask(task.value.id);
});

const canDelete = computed(() => {
  if (!task.value) return false;
  return tasksStore.canDeleteTask(task.value.id);
});

// Methods
const formatDateTime = (dateString) => {
  return format(new Date(dateString), "dd MMM yyyy, HH:mm", { locale: es });
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

const isStatusCompleted = (status) => {
  if (!task.value) return false;

  const statusOrder = ["pending", "in-progress", "completed"];
  const currentIndex = statusOrder.indexOf(task.value.status);
  const checkIndex = statusOrder.indexOf(status);

  return checkIndex <= currentIndex;
};

const changeStatus = async (newStatus) => {
  if (!task.value) return;

  try {
    await tasksStore.changeTaskStatus(task.value.id, newStatus);
  } catch (error) {
    console.error("Error changing task status:", error);
  }
};

const handleDelete = async () => {
  if (!task.value) return;

  if (
    confirm(
      "¿Estás seguro de que quieres eliminar esta tarea? Esta acción no se puede deshacer."
    )
  ) {
    try {
      await tasksStore.deleteTask(task.value.id);
      router.push("/tasks");
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  }
};

const handleTaskUpdated = () => {
  showEditModal.value = false;
};

// Lifecycle
onMounted(async () => {
  if (tasksStore.tasks.length === 0) {
    await tasksStore.loadTasks();
  }
  isLoading.value = false;
});
</script>

<style lang="scss" scoped>
@use "sass:color";
.task-detail {
  max-width: 1200px;
  margin: 0 auto;
}

.loading-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 50vh;
}

.not-found {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 50vh;

  .not-found-content {
    text-align: center;
    max-width: 400px;

    .not-found-icon {
      width: 4rem;
      height: 4rem;
      color: $gray-400;
      margin: 0 auto $spacing-lg auto;
    }

    h2 {
      font-size: $font-size-2xl;
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

.task-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: $spacing-xl;
  gap: $spacing-md;

  @media (max-width: $tablet) {
    flex-direction: column;
    align-items: stretch;
  }

  .header-nav {
    display: flex;
    align-items: center;
    gap: $spacing-md;

    .task-id {
      font-size: $font-size-sm;
      color: $gray-500;
      font-weight: 500;
    }
  }

  .header-actions {
    display: flex;
    gap: $spacing-sm;

    @media (max-width: $tablet) {
      justify-content: flex-end;
    }
  }
}

.task-main {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: $spacing-xl;

  @media (max-width: $desktop) {
    grid-template-columns: 1fr;
  }
}

.task-info {
  .info-section {
    background: $white;
    border-radius: $border-radius-lg;
    box-shadow: $shadow;
    padding: $spacing-xl;
    margin-bottom: $spacing-lg;

    .task-title-section {
      margin-bottom: $spacing-lg;

      .task-title {
        font-size: $font-size-3xl;
        font-weight: 700;
        color: $gray-900;
        margin: 0 0 $spacing-md 0;
        line-height: 1.2;

        @media (max-width: $mobile) {
          font-size: $font-size-2xl;
        }
      }

      .task-badges {
        display: flex;
        gap: $spacing-sm;
        flex-wrap: wrap;

        .priority-badge,
        .status-badge {
          padding: $spacing-xs $spacing-md;
          border-radius: $border-radius;
          font-size: $font-size-sm;
          font-weight: 500;
        }

        .priority-badge {
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

        .status-badge {
          &.status-pending {
            background: rgba($warning, 0.1);
            color: color.adjust($warning, $lightness: -20%);
          }

          &.status-in-progress {
            background: rgba($info, 0.1);
            color: color.adjust($info, $lightness: -20%);
          }

          &.status-completed {
            background: rgba($success, 0.1);
            color: color.adjust($success, $lightness: -20%);
          }

          &.status-cancelled {
            background: rgba($error, 0.1);
            color: color.adjust($error, $lightness: -20%);
          }
        }
      }
    }

    .task-description {
      h3 {
        font-size: $font-size-lg;
        font-weight: 600;
        color: $gray-900;
        margin: 0 0 $spacing-md 0;
      }

      p {
        color: $gray-700;
        line-height: 1.6;
        margin: 0;
        white-space: pre-line;
      }
    }
  }

  .status-actions {
    background: $white;
    border-radius: $border-radius-lg;
    box-shadow: $shadow;
    padding: $spacing-xl;

    h3 {
      font-size: $font-size-lg;
      font-weight: 600;
      color: $gray-900;
      margin: 0 0 $spacing-md 0;
    }

    .status-buttons {
      display: flex;
      gap: $spacing-sm;
      flex-wrap: wrap;

      .status-btn {
        display: flex;
        align-items: center;
        gap: $spacing-sm;
        padding: $spacing-sm $spacing-md;
        border: none;
        border-radius: $border-radius;
        cursor: pointer;
        font-size: $font-size-sm;
        font-weight: 500;
        transition: all 0.2s ease;

        .icon {
          width: 1rem;
          height: 1rem;
        }

        &.btn--warning {
          background: $warning;
          color: $white;

          &:hover {
            background: color.adjust($warning, $lightness: -10%);
          }
        }

        &.btn--info {
          background: $info;
          color: $white;

          &:hover {
            background: color.adjust($info, $lightness: -10%);
          }
        }

        &.btn--success {
          background: $success;
          color: $white;

          &:hover {
            background: color.adjust($success, $lightness: -10%);
          }
        }

        &.btn--error {
          background: $error;
          color: $white;

          &:hover {
            background: color.adjust($error, $lightness: -10%);
          }
        }
      }
    }
  }
}

.task-sidebar {
  display: flex;
  flex-direction: column;
  gap: $spacing-lg;
}

.detail-card,
.progress-card {
  background: $white;
  border-radius: $border-radius-lg;
  box-shadow: $shadow;
  padding: $spacing-lg;

  h3 {
    font-size: $font-size-lg;
    font-weight: 600;
    color: $gray-900;
    margin: 0 0 $spacing-lg 0;
  }
}

.detail-item {
  display: flex;
  flex-direction: column;
  gap: $spacing-sm;
  margin-bottom: $spacing-md;

  &:last-child {
    margin-bottom: 0;
  }

  .detail-label {
    display: flex;
    align-items: center;
    gap: $spacing-sm;
    font-size: $font-size-sm;
    font-weight: 500;
    color: $gray-600;

    .icon {
      width: 1rem;
      height: 1rem;
    }
  }

  .detail-value {
    font-size: $font-size-sm;
    color: $gray-900;

    &.overdue {
      color: $error;

      .overdue-label {
        font-weight: 500;
      }
    }

    .user-info {
      display: flex;
      align-items: center;
      gap: $spacing-sm;
    }
  }
}

.progress-timeline {
  .timeline-item {
    position: relative;
    display: flex;
    align-items: flex-start;
    gap: $spacing-md;
    padding-bottom: $spacing-md;

    &:last-child {
      padding-bottom: 0;

      .timeline-line {
        display: none;
      }
    }

    .timeline-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 2rem;
      height: 2rem;
      border-radius: 50%;
      background: $gray-200;
      color: $gray-500;
      flex-shrink: 0;

      .icon {
        width: 1rem;
        height: 1rem;
      }
    }

    .timeline-content {
      flex: 1;
      padding-top: $spacing-xs;

      .timeline-label {
        font-size: $font-size-sm;
        font-weight: 500;
        color: $gray-700;
      }

      .timeline-current {
        font-size: $font-size-xs;
        color: $primary;
        font-weight: 500;
        margin-top: $spacing-xs;
      }
    }

    .timeline-line {
      position: absolute;
      left: 1rem;
      top: 2rem;
      width: 2px;
      height: calc(100% - 1rem);
      background: $gray-200;
      transform: translateX(-50%);
    }

    &.completed,
    &.active {
      .timeline-icon {
        background: $primary;
        color: $white;
      }

      .timeline-line.completed {
        background: $primary;
      }
    }

    &.active {
      .timeline-content .timeline-label {
        color: $primary;
        font-weight: 600;
      }
    }
  }
}
</style>
