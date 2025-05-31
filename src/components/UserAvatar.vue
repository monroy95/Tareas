<template>
  <div class="user-avatar" :class="sizeClass">
    <img
      v-if="avatarSrc"
      :src="avatarSrc"
      :alt="name"
      class="avatar-image"
      @error="handleImageError"
    />
    <div
      v-else
      class="avatar-fallback"
      :style="{ backgroundColor: fallbackColor }"
    >
      <span class="avatar-initials">{{ initials }}</span>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";

const props = defineProps({
  src: {
    type: String,
    default: "",
  },
  name: {
    type: String,
    required: true,
  },
  size: {
    type: String,
    default: "medium",
    validator: (value) =>
      ["small", "medium", "large", "xlarge"].includes(value),
  },
  fallbackColor: {
    type: String,
    default: "#3b82f6",
  },
});

const avatarSrc = ref(props.src);

const initials = computed(() => {
  return props.name
    .split(" ")
    .map((word) => word.charAt(0))
    .join("")
    .toUpperCase()
    .slice(0, 2);
});

const sizeClass = computed(() => `avatar--${props.size}`);

const handleImageError = () => {
  avatarSrc.value = "";
};

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

// Si no hay src, generar SVG automáticamente
if (!avatarSrc.value) {
  avatarSrc.value = generateAvatarSVG(props.name, props.fallbackColor);
}
</script>

<style lang="scss" scoped>
.user-avatar {
  position: relative;
  display: inline-block;
  border-radius: 50%;
  overflow: hidden;
  flex-shrink: 0;

  &.avatar--small {
    width: 1.5rem;
    height: 1.5rem;
  }

  &.avatar--medium {
    width: 2rem;
    height: 2rem;
  }

  &.avatar--large {
    width: 3rem;
    height: 3rem;
  }

  &.avatar--xlarge {
    width: 5rem;
    height: 5rem;
  }

  .avatar-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 50%;
  }

  .avatar-fallback {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;

    .avatar-initials {
      color: white;
      font-weight: 600;
      font-size: 0.75em;
      line-height: 1;
    }
  }
}
</style>
