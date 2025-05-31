import { defineStore } from "pinia";
import { ref, computed } from "vue";

// Importar avatares SVG locales
import adminAvatar from "@/assets/avatars/admin.svg";
import userAvatar from "@/assets/avatars/user.svg";
import victorAvatar from "@/assets/avatars/victor.svg";
import juan1Avatar from "@/assets/avatars/juan1.svg";
import juan2Avatar from "@/assets/avatars/juan2.svg";

export const useAuthStore = defineStore("auth", () => {
  const user = ref(null);
  const isLoading = ref(false);

  // Función para generar avatar SVG como fallback
  const generateAvatarSVG = (name, backgroundColor = "#3b82f6") => {
    const initials = name
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2);

    return `data:image/svg+xml;base64,${btoa(`
      <svg width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <circle cx="50" cy="50" r="50" fill="${backgroundColor}"/>
        <text x="50" y="50" font-family="Inter, sans-serif" font-size="32" font-weight="600" 
              fill="white" text-anchor="middle" dominant-baseline="central">${initials}</text>
      </svg>
    `)}`;
  };

  // Usuarios de prueba hardcodeados
  const testUsers = [
    {
      id: 1,
      email: "admin@test.com",
      password: "admin123",
      name: "Administrador",
      role: "admin",
      avatar: adminAvatar, // Usar avatar SVG local
    },
    {
      id: 2,
      email: "mmonroyc4@miumg.edu.gt",
      password: "user123",
      name: "Mario Joel Monroy Canizales",
      role: "user",
      avatar: userAvatar, // Usar avatar SVG local
    },
    {
      id: 3,
      email: "hola@test.com",
      password: "hola123",
      name: "Víctor Estuardo Florian Castellanos",
      role: "user",
      avatar: victorAvatar, // Usar avatar SVG local
    },
    {
      id: 4,
      email: "juan@test.com",
      password: "juanio123",
      name: "Juan Isaias Chopen Par",
      role: "user",
      avatar: juan1Avatar, // Usar avatar SVG local
    },
    {
      id: 5,
      email: "juanmiguel@test.com", // Cambiar email para evitar duplicados
      password: "juan123",
      name: "Juan Miguel Ramirez Hernandez",
      role: "user",
      avatar: juan2Avatar, // Usar avatar SVG local
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
