<template>
  <div class="profile-page">
    <!-- Header -->
    <div class="page-header">
      <h1 class="page-title">Mi Perfil</h1>
      <p class="page-subtitle">
        Información personal y estadísticas de actividad
      </p>
    </div>

    <!-- Contenido principal -->
    <div class="profile-content">
      <!-- Información del usuario -->
      <div class="profile-card">
        <div class="profile-header">
          <div class="avatar-section">
            <UserAvatar
              :src="authStore.user.avatar"
              :name="authStore.user.name"
              size="xlarge"
            />
            <div class="avatar-overlay">
              <Camera class="camera-icon" />
            </div>
          </div>

          <div class="user-info">
            <h2 class="user-name">{{ authStore.user.name }}</h2>
            <p class="user-email">{{ authStore.user.email }}</p>
            <div class="user-role">
              <Crown v-if="authStore.isAdmin" class="role-icon" />
              <User v-else class="role-icon" />
              <span>{{ authStore.isAdmin ? "Administrador" : "Usuario" }}</span>
            </div>
          </div>

          <button class="btn btn--outline btn--small">
            <Edit class="icon" />
            Editar Perfil
          </button>
        </div>

        <div class="profile-details">
          <h3>Información Personal</h3>

          <div class="detail-grid">
            <div class="detail-item">
              <div class="detail-label">
                <Mail class="icon" />
                Correo Electrónico
              </div>
              <div class="detail-value">{{ authStore.user.email }}</div>
            </div>

            <div class="detail-item">
              <div class="detail-label">
                <Shield class="icon" />
                Rol
              </div>
              <div class="detail-value">
                {{ authStore.isAdmin ? "Administrador" : "Usuario Regular" }}
              </div>
            </div>

            <div class="detail-item">
              <div class="detail-label">
                <Calendar class="icon" />
                Miembro desde
              </div>
              <div class="detail-value">Enero 2024</div>
            </div>

            <div class="detail-item">
              <div class="detail-label">
                <Clock class="icon" />
                Última actividad
              </div>
              <div class="detail-value">{{ formatDate(new Date()) }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Estadísticas -->
      <div class="stats-section">
        <h3>Estadísticas de Actividad</h3>

        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-header">
              <ClipboardList class="stat-icon" />
              <span class="stat-title">Tareas Totales</span>
            </div>
            <div class="stat-value">{{ userStats.totalTasks }}</div>
            <div class="stat-change positive">
              <TrendingUp class="icon" />
              +{{ userStats.tasksThisMonth }} este mes
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-header">
              <CheckCircle class="stat-icon" />
              <span class="stat-title">Completadas</span>
            </div>
            <div class="stat-value">{{ userStats.completedTasks }}</div>
            <div class="stat-progress">
              <div class="progress-bar">
                <div
                  class="progress-fill"
                  :style="{ width: userStats.completionRate + '%' }"
                ></div>
              </div>
              <span class="progress-text"
                >{{ userStats.completionRate }}% completadas</span
              >
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-header">
              <Clock class="stat-icon" />
              <span class="stat-title">En Progreso</span>
            </div>
            <div class="stat-value">{{ userStats.inProgressTasks }}</div>
            <div class="stat-change">
              <Activity class="icon" />
              Trabajando activamente
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-header">
              <AlertTriangle class="stat-icon" />
              <span class="stat-title">Pendientes</span>
            </div>
            <div class="stat-value">{{ userStats.pendingTasks }}</div>
            <div
              class="stat-change"
              :class="{ negative: userStats.overdueTasks > 0 }"
            >
              <AlertCircle class="icon" />
              {{ userStats.overdueTasks }} vencidas
            </div>
          </div>
        </div>
      </div>

      <!-- Actividad reciente -->
      <div class="activity-section">
        <div class="section-header">
          <h3>Actividad Reciente</h3>
          <button class="btn btn--outline btn--small">
            <Filter class="icon" />
            Filtrar
          </button>
        </div>

        <div class="activity-list">
          <div
            v-for="activity in recentActivity"
            :key="activity.id"
            class="activity-item"
          >
            <div class="activity-icon" :class="`activity-${activity.type}`">
              <component :is="getActivityIcon(activity.type)" class="icon" />
            </div>

            <div class="activity-content">
              <div class="activity-description">{{ activity.description }}</div>
              <div class="activity-time">
                {{ formatRelativeTime(activity.timestamp) }}
              </div>
            </div>

            <div v-if="activity.taskId" class="activity-link">
              <router-link
                :to="`/tasks/${activity.taskId}`"
                class="btn btn--outline btn--small"
              >
                Ver Tarea
              </router-link>
            </div>
          </div>

          <div v-if="recentActivity.length === 0" class="empty-activity">
            <Activity class="empty-icon" />
            <p>No hay actividad reciente</p>
          </div>
        </div>
      </div>

      <!-- Configuración rápida -->
      <!-- <div class="settings-section">
        <h3>Configuración</h3>

        <div class="settings-list">
          <div class="setting-item">
            <div class="setting-info">
              <div class="setting-name">
                <Bell class="icon" />
                Notificaciones
              </div>
              <div class="setting-description">
                Recibir notificaciones sobre actualizaciones de tareas
              </div>
            </div>
            <div class="setting-control">
              <label class="toggle">
                <input type="checkbox" checked />
                <span class="toggle-slider"></span>
              </label>
            </div>
          </div>

          <div class="setting-item">
            <div class="setting-info">
              <div class="setting-name">
                <Mail class="icon" />
                Resumen por Email
              </div>
              <div class="setting-description">
                Recibir resumen semanal de tareas por correo
              </div>
            </div>
            <div class="setting-control">
              <label class="toggle">
                <input type="checkbox" />
                <span class="toggle-slider"></span>
              </label>
            </div>
          </div>

          <div class="setting-item">
            <div class="setting-info">
              <div class="setting-name">
                <Moon class="icon" />
                Modo Oscuro
              </div>
              <div class="setting-description">
                Cambiar a tema oscuro para mejor visibilidad
              </div>
            </div>
            <div class="setting-control">
              <label class="toggle">
                <input type="checkbox" />
                <span class="toggle-slider"></span>
              </label>
            </div>
          </div>
        </div>
      </div> -->
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useAuthStore } from "@/stores/auth";
import { useTasksStore } from "@/stores/tasks";
import { format, formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";
import UserAvatar from "@/components/UserAvatar.vue";
import {
  Camera,
  Crown,
  User,
  Edit,
  Mail,
  Shield,
  Calendar,
  Clock,
  ClipboardList,
  CheckCircle,
  AlertTriangle,
  AlertCircle,
  TrendingUp,
  Activity,
  Filter,
  Bell,
  Moon,
  Plus,
  Trash2,
} from "lucide-vue-next";

const authStore = useAuthStore();
const tasksStore = useTasksStore();

// Computed
const userStats = computed(() => {
  const userTasks = tasksStore.authorizedTasks.filter(
    (task) =>
      task.assignedTo === authStore.user.id ||
      task.createdBy === authStore.user.id
  );

  const totalTasks = userTasks.length;
  const completedTasks = userTasks.filter(
    (task) => task.status === "completed"
  ).length;
  const inProgressTasks = userTasks.filter(
    (task) => task.status === "in-progress"
  ).length;
  const pendingTasks = userTasks.filter(
    (task) => task.status === "pending"
  ).length;

  const overdueTasks = userTasks.filter((task) => {
    if (!task.dueDate) return false;
    return new Date(task.dueDate) < new Date() && task.status !== "completed";
  }).length;

  const completionRate =
    totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Simular tareas de este mes
  const tasksThisMonth = Math.floor(totalTasks * 0.3);

  return {
    totalTasks,
    completedTasks,
    inProgressTasks,
    pendingTasks,
    overdueTasks,
    completionRate,
    tasksThisMonth,
  };
});

const recentActivity = computed(() => {
  // Simular actividad reciente basada en las tareas del usuario
  const userTasks = tasksStore.authorizedTasks
    .filter(
      (task) =>
        task.assignedTo === authStore.user.id ||
        task.createdBy === authStore.user.id
    )
    .slice(0, 5);

  return userTasks.map((task, index) => ({
    id: `activity-${task.id}-${index}`,
    type: getActivityType(task),
    description: getActivityDescription(task),
    timestamp: task.updatedAt,
    taskId: task.id,
  }));
});

// Methods
const formatDate = (date) => {
  return format(date, "dd MMM yyyy", { locale: es });
};

const formatRelativeTime = (dateString) => {
  return formatDistanceToNow(new Date(dateString), {
    addSuffix: true,
    locale: es,
  });
};

const getActivityType = (task) => {
  switch (task.status) {
    case "completed":
      return "completed";
    case "in-progress":
      return "started";
    default:
      return "created";
  }
};

const getActivityDescription = (task) => {
  switch (getActivityType(task)) {
    case "completed":
      return `Completaste la tarea "${task.title}"`;
    case "started":
      return `Iniciaste trabajo en "${task.title}"`;
    default:
      return `Creaste la tarea "${task.title}"`;
  }
};

const getActivityIcon = (type) => {
  switch (type) {
    case "completed":
      return CheckCircle;
    case "started":
      return Clock;
    case "created":
      return Plus;
    case "deleted":
      return Trash2;
    default:
      return Activity;
  }
};
</script>

<style lang="scss" scoped>
.profile-page {
  max-width: 1200px;
  margin: 0 auto;
}

.page-header {
  margin-bottom: $spacing-xl;

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

.profile-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: $spacing-xl;

  @media (max-width: $desktop) {
    grid-template-columns: 1fr;
    gap: $spacing-lg;
  }
}

.profile-card {
  background: $white;
  border-radius: $border-radius-lg;
  box-shadow: $shadow;
  overflow: hidden;
  grid-column: 1 / -1;

  .profile-header {
    display: flex;
    align-items: center;
    gap: $spacing-lg;
    padding: $spacing-xl;
    border-bottom: 1px solid $gray-200;

    @media (max-width: $tablet) {
      flex-direction: column;
      text-align: center;
    }

    .avatar-section {
      position: relative;
      flex-shrink: 0;

      .avatar-overlay {
        position: absolute;
        bottom: 0;
        right: 0;
        width: 1.5rem;
        height: 1.5rem;
        background: $primary;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: background-color 0.2s ease;

        &:hover {
          background: $primary-dark;
        }

        .camera-icon {
          width: 0.875rem;
          height: 0.875rem;
          color: $white;
        }
      }
    }

    .user-info {
      flex: 1;

      .user-name {
        font-size: $font-size-2xl;
        font-weight: 700;
        color: $gray-900;
        margin: 0 0 $spacing-xs 0;
      }

      .user-email {
        font-size: $font-size-base;
        color: $gray-600;
        margin: 0 0 $spacing-sm 0;
      }

      .user-role {
        display: flex;
        align-items: center;
        gap: $spacing-sm;
        font-size: $font-size-sm;
        color: $gray-700;

        @media (max-width: $tablet) {
          justify-content: center;
        }

        .role-icon {
          width: 1rem;
          height: 1rem;
          color: $primary;
        }
      }
    }
  }

  .profile-details {
    padding: $spacing-xl;

    h3 {
      font-size: $font-size-lg;
      font-weight: 600;
      color: $gray-900;
      margin: 0 0 $spacing-lg 0;
    }

    .detail-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: $spacing-lg;

      @media (max-width: $tablet) {
        grid-template-columns: 1fr;
      }
    }

    .detail-item {
      .detail-label {
        display: flex;
        align-items: center;
        gap: $spacing-sm;
        font-size: $font-size-sm;
        font-weight: 500;
        color: $gray-600;
        margin-bottom: $spacing-xs;

        .icon {
          width: 1rem;
          height: 1rem;
        }
      }

      .detail-value {
        font-size: $font-size-base;
        color: $gray-900;
      }
    }
  }
}

.stats-section,
.activity-section,
.settings-section {
  background: $white;
  border-radius: $border-radius-lg;
  box-shadow: $shadow;
  padding: $spacing-xl;

  h3 {
    font-size: $font-size-lg;
    font-weight: 600;
    color: $gray-900;
    margin: 0 0 $spacing-lg 0;
  }
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: $spacing-lg;

  @media (max-width: $mobile) {
    grid-template-columns: 1fr;
  }
}

.stat-card {
  border: 1px solid $gray-200;
  border-radius: $border-radius;
  padding: $spacing-lg;

  .stat-header {
    display: flex;
    align-items: center;
    gap: $spacing-sm;
    margin-bottom: $spacing-md;

    .stat-icon {
      width: 1.25rem;
      height: 1.25rem;
      color: $primary;
    }

    .stat-title {
      font-size: $font-size-sm;
      font-weight: 500;
      color: $gray-600;
    }
  }

  .stat-value {
    font-size: $font-size-3xl;
    font-weight: 700;
    color: $gray-900;
    margin-bottom: $spacing-sm;
  }

  .stat-change {
    display: flex;
    align-items: center;
    gap: $spacing-xs;
    font-size: $font-size-sm;
    color: $gray-600;

    &.positive {
      color: $success;
    }

    &.negative {
      color: $error;
    }

    .icon {
      width: 1rem;
      height: 1rem;
    }
  }

  .stat-progress {
    .progress-bar {
      background: $gray-200;
      height: 6px;
      border-radius: 3px;
      overflow: hidden;
      margin-bottom: $spacing-xs;

      .progress-fill {
        height: 100%;
        background: $success;
        transition: width 0.3s ease;
      }
    }

    .progress-text {
      font-size: $font-size-xs;
      color: $gray-600;
    }
  }
}

.activity-section {
  grid-column: 1 / -1;

  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: $spacing-lg;

    h3 {
      margin: 0;
    }
  }

  .activity-list {
    .activity-item {
      display: flex;
      align-items: center;
      gap: $spacing-md;
      padding: $spacing-md;
      border-radius: $border-radius;
      transition: background-color 0.2s ease;

      &:hover {
        background: $gray-50;
      }

      &:not(:last-child) {
        margin-bottom: $spacing-sm;
      }

      .activity-icon {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 2rem;
        height: 2rem;
        border-radius: 50%;
        flex-shrink: 0;

        .icon {
          width: 1rem;
          height: 1rem;
          color: $white;
        }

        &.activity-completed {
          background: $success;
        }

        &.activity-started {
          background: $info;
        }

        &.activity-created {
          background: $primary;
        }
      }

      .activity-content {
        flex: 1;

        .activity-description {
          font-size: $font-size-base;
          color: $gray-900;
          margin-bottom: $spacing-xs;
        }

        .activity-time {
          font-size: $font-size-sm;
          color: $gray-500;
        }
      }
    }

    .empty-activity {
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
  }
}

.settings-list {
  .setting-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: $spacing-lg;
    border: 1px solid $gray-200;
    border-radius: $border-radius;

    &:not(:last-child) {
      margin-bottom: $spacing-md;
    }

    .setting-info {
      flex: 1;

      .setting-name {
        display: flex;
        align-items: center;
        gap: $spacing-sm;
        font-size: $font-size-base;
        font-weight: 500;
        color: $gray-900;
        margin-bottom: $spacing-xs;

        .icon {
          width: 1rem;
          height: 1rem;
        }
      }

      .setting-description {
        font-size: $font-size-sm;
        color: $gray-600;
      }
    }

    .setting-control {
      .toggle {
        position: relative;
        display: inline-block;
        width: 3rem;
        height: 1.5rem;
        cursor: pointer;

        input {
          opacity: 0;
          width: 0;
          height: 0;
        }

        .toggle-slider {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: $gray-300;
          border-radius: 1.5rem;
          transition: 0.3s;

          &::before {
            content: "";
            position: absolute;
            height: 1.125rem;
            width: 1.125rem;
            left: 0.1875rem;
            bottom: 0.1875rem;
            background: $white;
            border-radius: 50%;
            transition: 0.3s;
          }
        }

        input:checked + .toggle-slider {
          background: $primary;
        }

        input:checked + .toggle-slider::before {
          transform: translateX(1.5rem);
        }
      }
    }
  }
}
</style>
