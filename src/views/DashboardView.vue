<template>
  <div class="dashboard">
    <!-- Header del dashboard -->
    <div class="dashboard-header">
      <div class="header-content">
        <h1 class="page-title">Dashboard</h1>
        <p class="page-subtitle">
          Bienvenido, {{ authStore.user.name }}. Aquí tienes un resumen de tus
          tareas.
        </p>
      </div>
      <button class="btn btn--primary" @click="showCreateModal = true">
        <Plus class="icon" />
        Nueva Tarea
      </button>
    </div>

    <!-- Loading state -->
    <div v-if="tasksStore.isLoading" class="loading-state">
      <div class="loading">Cargando dashboard...</div>
    </div>

    <!-- Dashboard content -->
    <div v-else class="dashboard-content">
      <!-- Estadísticas -->
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon stat-icon--total">
            <ClipboardList class="icon" />
          </div>
          <div class="stat-content">
            <div class="stat-number">{{ taskStats.total }}</div>
            <div class="stat-label">Total de Tareas</div>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon stat-icon--pending">
            <Clock class="icon" />
          </div>
          <div class="stat-content">
            <div class="stat-number">{{ taskStats.pending }}</div>
            <div class="stat-label">Pendientes</div>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon stat-icon--progress">
            <PlayCircle class="icon" />
          </div>
          <div class="stat-content">
            <div class="stat-number">{{ taskStats.inProgress }}</div>
            <div class="stat-label">En Progreso</div>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon stat-icon--completed">
            <CheckCircle class="icon" />
          </div>
          <div class="stat-content">
            <div class="stat-number">{{ taskStats.completed }}</div>
            <div class="stat-label">Completadas</div>
          </div>
        </div>
      </div>

      <!-- Contenido principal -->
      <div class="dashboard-grid">
        <!-- Tareas recientes -->
        <div class="dashboard-section">
          <div class="section-header">
            <h2 class="section-title">
              <Clock class="icon" />
              Tareas Recientes
            </h2>
            <router-link to="/tasks" class="section-link">
              Ver todas
              <ArrowRight class="icon" />
            </router-link>
          </div>

          <div class="recent-tasks">
            <div
              v-for="task in recentTasks"
              :key="task.id"
              class="task-item"
              @click="$router.push(`/tasks/${task.id}`)"
            >
              <div
                class="task-priority"
                :class="`priority-${task.priority}`"
              ></div>
              <div class="task-content">
                <h3 class="task-title">{{ task.title }}</h3>
                <p class="task-description">
                  {{ truncateText(task.description, 80) }}
                </p>
                <div class="task-meta">
                  <span class="task-status" :class="`status-${task.status}`">
                    {{ getStatusLabel(task.status) }}
                  </span>
                  <span class="task-date">{{
                    formatDate(task.createdAt)
                  }}</span>
                </div>
              </div>
            </div>

            <div v-if="recentTasks.length === 0" class="empty-state">
              <ClipboardList class="empty-icon" />
              <p>No hay tareas recientes</p>
            </div>
          </div>
        </div>

        <!-- Tareas por estado -->
        <div class="dashboard-section">
          <div class="section-header">
            <h2 class="section-title">
              <BarChart3 class="icon" />
              Tareas por Estado
            </h2>
          </div>

          <div class="status-breakdown">
            <div
              v-for="status in tasksStore.taskStatuses"
              :key="status.value"
              class="status-item"
            >
              <div class="status-info">
                <div
                  class="status-color"
                  :class="`color-${status.color}`"
                ></div>
                <span class="status-name">{{ status.label }}</span>
              </div>
              <div class="status-count">
                {{ getTaskCountByStatus(status.value) }}
              </div>
              <div class="status-bar">
                <div
                  class="status-fill"
                  :class="`fill-${status.color}`"
                  :style="{ width: getStatusPercentage(status.value) + '%' }"
                ></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Tareas de alta prioridad -->
        <div class="dashboard-section">
          <div class="section-header">
            <h2 class="section-title">
              <AlertTriangle class="icon" />
              Alta Prioridad
            </h2>
          </div>

          <div class="priority-tasks">
            <div
              v-for="task in highPriorityTasks"
              :key="task.id"
              class="priority-task"
              @click="$router.push(`/tasks/${task.id}`)"
            >
              <div class="priority-indicator"></div>
              <div class="priority-content">
                <h4 class="priority-title">{{ task.title }}</h4>
                <div class="priority-meta">
                  <span
                    class="priority-status"
                    :class="`status-${task.status}`"
                  >
                    {{ getStatusLabel(task.status) }}
                  </span>
                  <span v-if="task.dueDate" class="priority-due">
                    Vence: {{ formatDate(task.dueDate) }}
                  </span>
                </div>
              </div>
            </div>

            <div v-if="highPriorityTasks.length === 0" class="empty-state">
              <CheckCircle class="empty-icon" />
              <p>No hay tareas de alta prioridad</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de crear tarea -->
    <CreateTaskModal
      v-if="showCreateModal"
      @close="showCreateModal = false"
      @created="handleTaskCreated"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useAuthStore } from "@/stores/auth";
import { useTasksStore } from "@/stores/tasks";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import CreateTaskModal from "@/components/CreateTaskModal.vue";
import {
  Plus,
  ClipboardList,
  Clock,
  PlayCircle,
  CheckCircle,
  ArrowRight,
  BarChart3,
  AlertTriangle,
} from "lucide-vue-next";

const authStore = useAuthStore();
const tasksStore = useTasksStore();
const showCreateModal = ref(false);

// Computed properties
const taskStats = computed(() => tasksStore.taskStats);

const recentTasks = computed(() => {
  return tasksStore.authorizedTasks
    .slice()
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);
});

const highPriorityTasks = computed(() => {
  return tasksStore.authorizedTasks
    .filter((task) => task.priority === "high" && task.status !== "completed")
    .slice(0, 3);
});

// Methods
const formatDate = (dateString) => {
  return format(new Date(dateString), "dd MMM yyyy", { locale: es });
};

const truncateText = (text, length) => {
  if (text.length <= length) return text;
  return text.substring(0, length) + "...";
};

const getStatusLabel = (status) => {
  const statusObj = tasksStore.taskStatuses.find((s) => s.value === status);
  return statusObj ? statusObj.label : status;
};

const getTaskCountByStatus = (status) => {
  return tasksStore.authorizedTasks.filter((task) => task.status === status)
    .length;
};

const getStatusPercentage = (status) => {
  const total = tasksStore.authorizedTasks.length;
  if (total === 0) return 0;
  const count = getTaskCountByStatus(status);
  return Math.round((count / total) * 100);
};

const handleTaskCreated = () => {
  showCreateModal.value = false;
  // Las tareas se actualizan automáticamente a través del store
};

// Lifecycle
onMounted(() => {
  tasksStore.loadTasks();
});
</script>

<style lang="scss" scoped>
@use "sass:color";
.dashboard {
  max-width: 1200px;
  margin: 0 auto;
}

.dashboard-header {
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

.loading-state {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 200px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: $spacing-lg;
  margin-bottom: $spacing-xl;

  @media (max-width: $mobile) {
    grid-template-columns: repeat(2, 1fr);
    gap: $spacing-md;
  }
}

.stat-card {
  background: $white;
  border-radius: $border-radius-lg;
  padding: $spacing-lg;
  box-shadow: $shadow;
  display: flex;
  align-items: center;
  gap: $spacing-md;

  .stat-icon {
    width: 3rem;
    height: 3rem;
    border-radius: $border-radius;
    display: flex;
    align-items: center;
    justify-content: center;

    .icon {
      width: 1.5rem;
      height: 1.5rem;
      color: $white;
    }

    &--total {
      background: $primary;
    }
    &--pending {
      background: $warning;
    }
    &--progress {
      background: $info;
    }
    &--completed {
      background: $success;
    }
  }

  .stat-content {
    .stat-number {
      font-size: $font-size-2xl;
      font-weight: 700;
      color: $gray-900;
      line-height: 1;
    }

    .stat-label {
      font-size: $font-size-sm;
      color: $gray-600;
      margin-top: $spacing-xs;
    }
  }
}

.dashboard-grid {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr;
  gap: $spacing-xl;

  @media (max-width: $desktop) {
    grid-template-columns: 1fr 1fr;
  }

  @media (max-width: $tablet) {
    grid-template-columns: 1fr;
    gap: $spacing-lg;
  }
}

.dashboard-section {
  background: $white;
  border-radius: $border-radius-lg;
  box-shadow: $shadow;
  overflow: hidden;

  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: $spacing-lg;
    border-bottom: 1px solid $gray-200;

    .section-title {
      display: flex;
      align-items: center;
      gap: $spacing-sm;
      font-size: $font-size-lg;
      font-weight: 600;
      color: $gray-900;
      margin: 0;

      .icon {
        width: 1.25rem;
        height: 1.25rem;
        color: $primary;
      }
    }

    .section-link {
      display: flex;
      align-items: center;
      gap: $spacing-xs;
      color: $primary;
      text-decoration: none;
      font-size: $font-size-sm;
      font-weight: 500;

      &:hover {
        color: $primary-dark;
      }

      .icon {
        width: 1rem;
        height: 1rem;
      }
    }
  }
}

.recent-tasks {
  padding: $spacing-lg;

  .task-item {
    display: flex;
    gap: $spacing-md;
    padding: $spacing-md;
    border-radius: $border-radius;
    cursor: pointer;
    transition: background-color 0.2s ease;

    &:hover {
      background: $gray-50;
    }

    &:not(:last-child) {
      margin-bottom: $spacing-sm;
    }

    .task-priority {
      width: 4px;
      border-radius: 2px;
      flex-shrink: 0;

      &.priority-low {
        background: $success;
      }
      &.priority-medium {
        background: $warning;
      }
      &.priority-high {
        background: $error;
      }
    }

    .task-content {
      flex: 1;
      min-width: 0;

      .task-title {
        font-size: $font-size-base;
        font-weight: 500;
        color: $gray-900;
        margin: 0 0 $spacing-xs 0;
      }

      .task-description {
        font-size: $font-size-sm;
        color: $gray-600;
        margin: 0 0 $spacing-sm 0;
        line-height: 1.4;
      }

      .task-meta {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: $spacing-sm;

        .task-status {
          font-size: $font-size-xs;
          font-weight: 500;
          padding: $spacing-xs $spacing-sm;
          border-radius: $border-radius-sm;

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
        }

        .task-date {
          font-size: $font-size-xs;
          color: $gray-500;
        }
      }
    }
  }
}

.status-breakdown {
  padding: $spacing-lg;

  .status-item {
    display: grid;
    grid-template-columns: 1fr auto 100px;
    align-items: center;
    gap: $spacing-md;

    &:not(:last-child) {
      margin-bottom: $spacing-md;
    }

    .status-info {
      display: flex;
      align-items: center;
      gap: $spacing-sm;

      .status-color {
        width: 0.75rem;
        height: 0.75rem;
        border-radius: 50%;

        &.color-warning {
          background: $warning;
        }
        &.color-info {
          background: $info;
        }
        &.color-success {
          background: $success;
        }
        &.color-error {
          background: $error;
        }
      }

      .status-name {
        font-size: $font-size-sm;
        color: $gray-700;
      }
    }

    .status-count {
      font-weight: 600;
      color: $gray-900;
    }

    .status-bar {
      background: $gray-200;
      height: 6px;
      border-radius: 3px;
      overflow: hidden;

      .status-fill {
        height: 100%;
        transition: width 0.3s ease;

        &.fill-warning {
          background: $warning;
        }
        &.fill-info {
          background: $info;
        }
        &.fill-success {
          background: $success;
        }
        &.fill-error {
          background: $error;
        }
      }
    }
  }
}

.priority-tasks {
  padding: $spacing-lg;

  .priority-task {
    display: flex;
    gap: $spacing-sm;
    padding: $spacing-md;
    border-radius: $border-radius;
    cursor: pointer;
    transition: background-color 0.2s ease;

    &:hover {
      background: $gray-50;
    }

    &:not(:last-child) {
      margin-bottom: $spacing-sm;
    }

    .priority-indicator {
      width: 4px;
      background: $error;
      border-radius: 2px;
      flex-shrink: 0;
    }

    .priority-content {
      flex: 1;

      .priority-title {
        font-size: $font-size-sm;
        font-weight: 500;
        color: $gray-900;
        margin: 0 0 $spacing-xs 0;
      }

      .priority-meta {
        display: flex;
        flex-direction: column;
        gap: $spacing-xs;

        .priority-status {
          font-size: $font-size-xs;
          font-weight: 500;

          &.status-pending {
            color: color.adjust($warning, $lightness: -20%);
          }
          &.status-in-progress {
            color: color.adjust($info, $lightness: -20%);
          }
        }

        .priority-due {
          font-size: $font-size-xs;
          color: $gray-500;
        }
      }
    }
  }
}

.empty-state {
  text-align: center;
  padding: $spacing-xl;
  color: $gray-500;

  .empty-icon {
    width: 3rem;
    height: 3rem;
    margin: 0 auto $spacing-md auto;
    opacity: 0.5;
  }

  p {
    margin: 0;
    font-size: $font-size-sm;
  }
}
</style>
