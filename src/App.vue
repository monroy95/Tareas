<template>
  <div id="app">
    <!-- Layout para usuarios autenticados -->
    <div v-if="authStore.isAuthenticated" class="app-layout">
      <!-- Header -->
      <header class="app-header">
        <div class="container">
          <div class="header-content">
            <!-- Logo y título -->
            <div class="logo-section">
              <button
                class="mobile-menu-btn md:hidden"
                @click="toggleMobileMenu"
              >
                <Menu class="icon" />
              </button>
              <h1 class="app-title">
                <ClipboardList class="icon" />
                Gestión de Incidencias
              </h1>
            </div>

            <!-- Navegación desktop -->
            <nav class="desktop-nav">
              <router-link to="/dashboard" class="nav-link">
                <LayoutDashboard class="icon" />
                Dashboard
              </router-link>
              <router-link to="/tasks" class="nav-link">
                <CheckSquare class="icon" />
                Tareas
              </router-link>
            </nav>

            <!-- Perfil de usuario -->
            <div class="user-section">
              <div class="user-info">
                <UserAvatar
                  :src="authStore.user.avatar"
                  :name="authStore.user.name"
                  size="medium"
                />
                <span class="user-name hidden md:block">{{
                  authStore.user.name
                }}</span>
              </div>
              <button class="btn btn--outline btn--small" @click="logout">
                <LogOut class="icon" />
                <span class="hidden md:inline">Salir</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <!-- Navegación móvil -->
      <nav v-if="showMobileMenu" class="mobile-nav md:hidden">
        <router-link
          to="/dashboard"
          class="mobile-nav-link"
          @click="closeMobileMenu"
        >
          <LayoutDashboard class="icon" />
          Dashboard
        </router-link>
        <router-link
          to="/tasks"
          class="mobile-nav-link"
          @click="closeMobileMenu"
        >
          <CheckSquare class="icon" />
          Tareas
        </router-link>
        <router-link
          to="/profile"
          class="mobile-nav-link"
          @click="closeMobileMenu"
        >
          <User class="icon" />
          Perfil
        </router-link>
      </nav>

      <!-- Contenido principal -->
      <main class="main-content">
        <div class="container">
          <router-view />
        </div>
      </main>
    </div>

    <!-- Layout para usuarios no autenticados -->
    <div v-else class="auth-layout">
      <router-view />
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import UserAvatar from "@/components/UserAvatar.vue";
import {
  Menu,
  ClipboardList,
  LayoutDashboard,
  CheckSquare,
  User,
  LogOut,
} from "lucide-vue-next";

const router = useRouter();
const authStore = useAuthStore();
const showMobileMenu = ref(false);

const toggleMobileMenu = () => {
  showMobileMenu.value = !showMobileMenu.value;
};

const closeMobileMenu = () => {
  showMobileMenu.value = false;
};

const logout = () => {
  authStore.logout();
  router.push("/login");
};
</script>

<style lang="scss" scoped>
.app-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.app-header {
  background: $white;
  border-bottom: 1px solid $gray-200;
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: $shadow-sm;

  .header-content {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: $spacing-md 0;
    gap: $spacing-md;
  }
}

.logo-section {
  display: flex;
  align-items: center;
  gap: $spacing-md;

  .mobile-menu-btn {
    padding: $spacing-sm;
    background: none;
    border: none;
    cursor: pointer;
    border-radius: $border-radius;

    &:hover {
      background: $gray-100;
    }

    .icon {
      width: 1.25rem;
      height: 1.25rem;
    }
  }

  .app-title {
    display: flex;
    align-items: center;
    gap: $spacing-sm;
    font-size: $font-size-lg;
    font-weight: 600;
    color: $primary;
    margin: 0;

    .icon {
      width: 1.5rem;
      height: 1.5rem;
    }

    @media (max-width: $mobile) {
      font-size: $font-size-base;

      .icon {
        width: 1.25rem;
        height: 1.25rem;
      }
    }
  }
}

.desktop-nav {
  display: none;
  gap: $spacing-lg;

  @media (min-width: $tablet) {
    display: flex;
  }

  .nav-link {
    display: flex;
    align-items: center;
    gap: $spacing-sm;
    padding: $spacing-sm $spacing-md;
    text-decoration: none;
    color: $gray-600;
    border-radius: $border-radius;
    transition: all 0.2s ease;

    &:hover {
      color: $primary;
      background: $gray-50;
    }

    &.router-link-active {
      color: $primary;
      background: rgba($primary, 0.1);
    }

    .icon {
      width: 1rem;
      height: 1rem;
    }
  }
}

.user-section {
  display: flex;
  align-items: center;
  gap: $spacing-md;

  .user-info {
    display: flex;
    align-items: center;
    gap: $spacing-sm;

    .user-name {
      font-weight: 500;
      color: $gray-700;
    }
  }
}

.mobile-nav {
  background: $white;
  border-bottom: 1px solid $gray-200;
  padding: $spacing-md 0;

  .mobile-nav-link {
    display: flex;
    align-items: center;
    gap: $spacing-sm;
    padding: $spacing-sm $spacing-md;
    text-decoration: none;
    color: $gray-600;
    margin-bottom: $spacing-xs;

    &:hover {
      color: $primary;
      background: $gray-50;
    }

    &.router-link-active {
      color: $primary;
      background: rgba($primary, 0.1);
    }

    .icon {
      width: 1rem;
      height: 1rem;
    }
  }
}

.main-content {
  flex: 1;
  padding: $spacing-lg 0;

  @media (max-width: $mobile) {
    padding: $spacing-md 0;
  }
}

.auth-layout {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, $primary 0%, $primary-dark 100%);
}

.icon {
  width: 1rem;
  height: 1rem;
}
</style>
