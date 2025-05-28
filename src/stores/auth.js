import { defineStore } from "pinia";
import { ref, computed } from "vue";

export const useAuthStore = defineStore("auth", () => {
  const user = ref(null);
  const isLoading = ref(false);

  // Usuarios de prueba hardcodeados
  const testUsers = [
    {
      id: 1,
      email: "admin@test.com",
      password: "admin123",
      name: "Administrador",
      role: "admin",
      avatar:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
    },
    {
      id: 2,
      email: "usuario@test.com",
      password: "user123",
      name: "Usuario Regular",
      role: "user",
      avatar:
        "https://images.unsplash.com/photo-1494790108755-2616b612b3e5?w=100&h=100&fit=crop&crop=face",
    },
    {
      id: 3,
      email: "maria@test.com",
      password: "maria123",
      name: "María García",
      role: "user",
      avatar:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
    },
    {
      id: 4,
      email: "mario@test.com",
      password: "mario123",
      name: "Mario Monroy",
      role: "user",
      avatar:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
    },
  ];

  // Computed
  const isAuthenticated = computed(() => !!user.value);
  const isAdmin = computed(() => user.value?.role === "admin");

  // Actions
  const login = async (email, password) => {
    isLoading.value = true;

    try {
      // Simular delay de API
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const foundUser = testUsers.find(
        (u) => u.email === email && u.password === password
      );

      if (!foundUser) {
        throw new Error("Credenciales incorrectas");
      }

      // Excluir password del usuario
      const { password: _, ...userWithoutPassword } = foundUser;
      user.value = userWithoutPassword;

      // Guardar en localStorage para persistencia
      localStorage.setItem("user", JSON.stringify(userWithoutPassword));

      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    } finally {
      isLoading.value = false;
    }
  };

  const logout = () => {
    user.value = null;
    localStorage.removeItem("user");
  };

  const checkAuth = () => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      try {
        user.value = JSON.parse(savedUser);
      } catch (error) {
        localStorage.removeItem("user");
      }
    }
  };

  const getTestUsers = () => {
    return testUsers.map(({ password, ...user }) => user);
  };

  return {
    // State
    user,
    isLoading,

    // Getters
    isAuthenticated,
    isAdmin,

    // Actions
    login,
    logout,
    checkAuth,
    getTestUsers,
  };
});
