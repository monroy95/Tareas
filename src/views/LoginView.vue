<template>
  <div class="login-container">
    <div class="login-card">
      <!-- Header -->
      <div class="login-header">
        <div class="logo">
          <ClipboardList class="logo-icon" />
          <h1>Gestión de Incidencias</h1>
        </div>
        <p class="subtitle">Accede a tu cuenta para gestionar tus tareas</p>
      </div>

      <!-- Formulario de login -->
      <form @submit.prevent="handleLogin" class="login-form">
        <div class="form-group">
          <label for="email">Correo electrónico</label>
          <div class="input-wrapper">
            <Mail class="input-icon" />
            <input
              id="email"
              v-model="form.email"
              type="email"
              class="input"
              :class="{ 'input--error': errors.email }"
              placeholder="tu@email.com"
              required
            />
          </div>
          <div v-if="errors.email" class="error">{{ errors.email }}</div>
        </div>

        <div class="form-group">
          <label for="password">Contraseña</label>
          <div class="input-wrapper">
            <Lock class="input-icon" />
            <input
              id="password"
              v-model="form.password"
              :type="showPassword ? 'text' : 'password'"
              class="input"
              :class="{ 'input--error': errors.password }"
              placeholder="Tu contraseña"
              required
            />
            <button
              type="button"
              class="password-toggle"
              @click="showPassword = !showPassword"
            >
              <Eye v-if="!showPassword" class="icon" />
              <EyeOff v-else class="icon" />
            </button>
          </div>
          <div v-if="errors.password" class="error">{{ errors.password }}</div>
        </div>

        <div v-if="errors.general" class="error general-error">
          {{ errors.general }}
        </div>

        <button
          type="submit"
          class="btn btn--primary btn--large"
          :disabled="authStore.isLoading"
          :class="{ loading: authStore.isLoading }"
        >
          <span v-if="!authStore.isLoading">Iniciar Sesión</span>
          <span v-else>Iniciando sesión...</span>
        </button>
      </form>

      <!-- Usuarios de prueba -->
      <!-- <div class="demo-section">
        <h3>Usuarios de Prueba</h3>
        <div class="demo-users">
          <div
            v-for="user in testUsers"
            :key="user.id"
            class="demo-user"
            @click="fillDemoCredentials(user)"
          >
            <img :src="user.avatar" :alt="user.name" class="demo-avatar" />
            <div class="demo-info">
              <div class="demo-name">{{ user.name }}</div>
              <div class="demo-email">{{ user.email }}</div>
              <div class="demo-role">
                {{ user.role === "admin" ? "Administrador" : "Usuario" }}
              </div>
            </div>
          </div>
        </div>
        <p class="demo-note">
          <Info class="icon" />
          Haz clic en cualquier usuario para usar sus credenciales
        </p>
      </div> -->
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import { ClipboardList, Mail, Lock, Eye, EyeOff, Info } from "lucide-vue-next";

const router = useRouter();
const authStore = useAuthStore();

const showPassword = ref(false);

const form = reactive({
  email: "",
  password: "",
});

const errors = reactive({
  email: "",
  password: "",
  general: "",
});

const testUsers = authStore.getTestUsers();

const clearErrors = () => {
  errors.email = "";
  errors.password = "";
  errors.general = "";
};

const validateForm = () => {
  clearErrors();
  let isValid = true;

  if (!form.email) {
    errors.email = "El correo es requerido";
    isValid = false;
  } else if (!/\S+@\S+\.\S+/.test(form.email)) {
    errors.email = "Correo inválido";
    isValid = false;
  }

  if (!form.password) {
    errors.password = "La contraseña es requerida";
    isValid = false;
  } else if (form.password.length < 6) {
    errors.password = "La contraseña debe tener al menos 6 caracteres";
    isValid = false;
  }

  return isValid;
};

const handleLogin = async () => {
  if (!validateForm()) return;

  const result = await authStore.login(form.email, form.password);

  if (result.success) {
    router.push("/dashboard");
  } else {
    errors.general = result.error;
  }
};

const fillDemoCredentials = (user) => {
  form.email = user.email;
  form.password = getDemoPassword(user.email);
  clearErrors();
};

const getDemoPassword = (email) => {
  const passwordMap = {
    "admin@test.com": "admin123",
    "usuario@test.com": "user123",
    "maria@test.com": "maria123",
    "mario@test.com": "mario123",
  };
  return passwordMap[email] || "password";
};
</script>

<style lang="scss" scoped>
.login-container {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: $spacing-md;
}

.login-card {
  background: $white;
  border-radius: $border-radius-lg;
  box-shadow: $shadow-lg;
  padding: $spacing-2xl;
  width: 100%;
  max-width: 28rem;

  @media (max-width: $mobile) {
    padding: $spacing-lg;
    max-width: 100%;
  }
}

.login-header {
  text-align: center;
  margin-bottom: $spacing-2xl;

  .logo {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: $spacing-sm;
    margin-bottom: $spacing-md;

    .logo-icon {
      width: 2rem;
      height: 2rem;
      color: $primary;
    }

    h1 {
      font-size: $font-size-2xl;
      font-weight: 700;
      color: $gray-900;
      margin: 0;

      @media (max-width: $mobile) {
        font-size: $font-size-xl;
      }
    }
  }

  .subtitle {
    color: $gray-600;
    margin: 0;
  }
}

.login-form {
  margin-bottom: $spacing-xl;

  .input-wrapper {
    position: relative;

    .input-icon {
      position: absolute;
      left: $spacing-md;
      top: 50%;
      transform: translateY(-50%);
      width: 1rem;
      height: 1rem;
      color: $gray-400;
      z-index: 1;
    }

    .input {
      padding-left: 2.5rem;
      padding-right: 2.5rem;
    }

    .password-toggle {
      position: absolute;
      right: $spacing-md;
      top: 50%;
      transform: translateY(-50%);
      background: none;
      border: none;
      cursor: pointer;
      padding: 0;
      color: $gray-400;

      &:hover {
        color: $gray-600;
      }

      .icon {
        width: 1rem;
        height: 1rem;
      }
    }
  }

  .general-error {
    text-align: center;
    margin-bottom: $spacing-md;
    padding: $spacing-sm;
    background: rgba($error, 0.1);
    border: 1px solid rgba($error, 0.2);
    border-radius: $border-radius;
  }
}

.demo-section {
  border-top: 1px solid $gray-200;
  padding-top: $spacing-lg;

  h3 {
    font-size: $font-size-lg;
    font-weight: 600;
    color: $gray-900;
    margin: 0 0 $spacing-md 0;
    text-align: center;
  }

  .demo-users {
    display: flex;
    flex-direction: column;
    gap: $spacing-sm;
    margin-bottom: $spacing-md;
  }

  .demo-user {
    display: flex;
    align-items: center;
    gap: $spacing-md;
    padding: $spacing-sm;
    border: 1px solid $gray-200;
    border-radius: $border-radius;
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover {
      border-color: $primary;
      background: rgba($primary, 0.05);
    }

    .demo-avatar {
      width: 2.5rem;
      height: 2.5rem;
      border-radius: 50%;
      object-fit: cover;
    }

    .demo-info {
      flex: 1;

      .demo-name {
        font-weight: 500;
        color: $gray-900;
      }

      .demo-email {
        font-size: $font-size-sm;
        color: $gray-600;
      }

      .demo-role {
        font-size: $font-size-xs;
        color: $primary;
        font-weight: 500;
      }
    }
  }

  .demo-note {
    display: flex;
    align-items: center;
    gap: $spacing-sm;
    font-size: $font-size-sm;
    color: $gray-600;
    text-align: center;
    justify-content: center;
    margin: 0;

    .icon {
      width: 1rem;
      height: 1rem;
    }
  }
}
</style>
