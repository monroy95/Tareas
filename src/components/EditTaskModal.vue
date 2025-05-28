<template>
  <div class="modal-overlay" @click="handleOverlayClick">
    <div class="modal-content" @click.stop>
      <!-- Header del modal -->
      <div class="modal-header">
        <h2 class="modal-title">
          <Edit class="icon" />
          Editar Tarea
        </h2>
        <button class="close-button" @click="$emit('close')">
          <X class="icon" />
        </button>
      </div>

      <!-- Formulario -->
      <form @submit.prevent="handleSubmit" class="modal-form">
        <!-- Título -->
        <div class="form-group">
          <label for="edit-title">Título *</label>
          <input
            id="edit-title"
            v-model="form.title"
            type="text"
            class="input"
            :class="{ 'input--error': errors.title }"
            placeholder="Describe brevemente la tarea"
            maxlength="100"
          />
          <div v-if="errors.title" class="error">{{ errors.title }}</div>
          <div class="char-count">{{ form.title.length }}/100</div>
        </div>

        <!-- Descripción -->
        <div class="form-group">
          <label for="edit-description">Descripción *</label>
          <textarea
            id="edit-description"
            v-model="form.description"
            class="input textarea"
            :class="{ 'input--error': errors.description }"
            placeholder="Proporciona detalles sobre la tarea..."
            rows="4"
            maxlength="500"
          ></textarea>
          <div v-if="errors.description" class="error">{{ errors.description }}</div>
          <div class="char-count">{{ form.description.length }}/500</div>
        </div>

        <!-- Prioridad, Estado y Usuario asignado -->
        <div class="form-grid">
          <div class="form-group">
            <label for="edit-priority">Prioridad</label>
            <div class="select-wrapper">
              <select
                id="edit-priority"
                v-model="form.priority"
                class="input select"
              >
                <option
                  v-for="priority in tasksStore.priorities"
                  :key="priority.value"
                  :value="priority.value"
                >
                  {{ priority.label }}
                </option>
              </select>
              <ChevronDown class="select-icon" />
            </div>
          </div>

          <div class="form-group">
            <label for="edit-status">Estado</label>
            <div class="select-wrapper">
              <select
                id="edit-status"
                v-model="form.status"
                class="input select"
              >
                <option
                  v-for="status in tasksStore.taskStatuses"
                  :key="status.value"
                  :value="status.value"
                >
                  {{ status.label }}
                </option>
              </select>
              <ChevronDown class="select-icon" />
            </div>
          </div>

          <div class="form-group">
            <label for="edit-assignedTo">Asignar a</label>
            <div class="select-wrapper">
              <select
                id="edit-assignedTo"
                v-model="form.assignedTo"
                class="input select"
              >
                <option
                  v-for="user in availableUsers"
                  :key="user.id"
                  :value="user.id"
                >
                  {{ user.name }}
                </option>
              </select>
              <ChevronDown class="select-icon" />
            </div>
          </div>
        </div>

        <!-- Fecha de vencimiento -->
        <div class="form-group">
          <label for="edit-dueDate">Fecha de vencimiento</label>
          <div class="input-wrapper">
            <Calendar class="input-icon" />
            <input
              id="edit-dueDate"
              v-model="form.dueDate"
              type="date"
              class="input"
              :min="today"
            />
            <button
              v-if="form.dueDate"
              type="button"
              class="clear-date-btn"
              @click="form.dueDate = ''"
              title="Quitar fecha"
            >
              <X class="icon" />
            </button>
          </div>
        </div>

        <!-- Información adicional -->
        <div class="task-info">
          <div class="info-row">
            <span class="info-label">Creado:</span>
            <span class="info-value">{{ formatDate(task.createdAt) }}</span>
          </div>
          <div class="info-row">
            <span class="info-label">Última actualización:</span>
            <span class="info-value">{{ formatDate(task.updatedAt) }}</span>
          </div>
        </div>

        <!-- Botones -->
        <div class="modal-actions">
          <button
            type="button"
            class="btn btn--outline"
            @click="$emit('close')"
          >
            Cancelar
          </button>
          <button
            type="submit"
            class="btn btn--primary"
            :disabled="isSubmitting || !hasChanges"
            :class="{ loading: isSubmitting }"
          >
            <span v-if="!isSubmitting">Guardar Cambios</span>
            <span v-else>Guardando...</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useTasksStore } from '@/stores/tasks'
import { useAuthStore } from '@/stores/auth'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import {
  Edit,
  X,
  ChevronDown,
  Calendar
} from 'lucide-vue-next'

// Props
const props = defineProps({
  task: {
    type: Object,
    required: true
  }
})

// Emits
const emit = defineEmits(['close', 'updated'])

// Stores
const tasksStore = useTasksStore()
const authStore = useAuthStore()

// State
const isSubmitting = ref(false)

const form = reactive({
  title: '',
  description: '',
  priority: 'medium',
  status: 'pending',
  assignedTo: 1,
  dueDate: ''
})

const errors = reactive({
  title: '',
  description: ''
})

// Computed
const today = computed(() => {
  return new Date().toISOString().split('T')[0]
})

const availableUsers = computed(() => {
  return authStore.getTestUsers()
})

const hasChanges = computed(() => {
  return (
    form.title !== props.task.title ||
    form.description !== props.task.description ||
    form.priority !== props.task.priority ||
    form.status !== props.task.status ||
    form.assignedTo !== props.task.assignedTo ||
    form.dueDate !== (props.task.dueDate ? props.task.dueDate.split('T')[0] : '')
  )
})

// Methods
const initializeForm = () => {
  form.title = props.task.title
  form.description = props.task.description
  form.priority = props.task.priority
  form.status = props.task.status
  form.assignedTo = props.task.assignedTo
  form.dueDate = props.task.dueDate ? props.task.dueDate.split('T')[0] : ''
}

const clearErrors = () => {
  errors.title = ''
  errors.description = ''
}

const validateForm = () => {
  clearErrors()
  let isValid = true

  if (!form.title.trim()) {
    errors.title = 'El título es requerido'
    isValid = false
  } else if (form.title.trim().length < 3) {
    errors.title = 'El título debe tener al menos 3 caracteres'
    isValid = false
  }

  if (!form.description.trim()) {
    errors.description = 'La descripción es requerida'
    isValid = false
  } else if (form.description.trim().length < 10) {
    errors.description = 'La descripción debe tener al menos 10 caracteres'
    isValid = false
  }

  return isValid
}

const handleSubmit = async () => {
  if (!validateForm()) return
  if (!hasChanges.value) return

  isSubmitting.value = true

  try {
    const updates = {
      title: form.title.trim(),
      description: form.description.trim(),
      priority: form.priority,
      status: form.status,
      assignedTo: form.assignedTo,
      dueDate: form.dueDate ? new Date(form.dueDate).toISOString() : null
    }

    await tasksStore.updateTask(props.task.id, updates)
    emit('updated')
  } catch (error) {
    console.error('Error updating task:', error)
  } finally {
    isSubmitting.value = false
  }
}

const handleOverlayClick = (event) => {
  if (event.target === event.currentTarget) {
    emit('close')
  }
}

const formatDate = (dateString) => {
  return format(new Date(dateString), 'dd MMM yyyy, HH:mm', { locale: es })
}

// Lifecycle
onMounted(() => {
  initializeForm()
  
  // Focus en el primer campo
  const titleInput = document.getElementById('edit-title')
  if (titleInput) {
    titleInput.focus()
    titleInput.select()
  }
})
</script>

<style lang="scss" scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: $spacing-md;
}

.modal-content {
  background: $white;
  border-radius: $border-radius-lg;
  box-shadow: $shadow-lg;
  width: 100%;
  max-width: 40rem;
  max-height: 90vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: $spacing-lg;
  border-bottom: 1px solid $gray-200;

  .modal-title {
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

  .close-button {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 2rem;
    height: 2rem;
    background: none;
    border: none;
    border-radius: $border-radius;
    cursor: pointer;
    color: $gray-500;
    transition: all 0.2s ease;

    &:hover {
      background: $gray-100;
      color: $gray-700;
    }

    .icon {
      width: 1.25rem;
      height: 1.25rem;
    }
  }
}

.modal-form {
  padding: $spacing-lg;
  overflow-y: auto;
  flex: 1;

  .form-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: $spacing-md;

    @media (max-width: $tablet) {
      grid-template-columns: 1fr;
    }

    @media (min-width: $tablet) and (max-width: $desktop) {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  .textarea {
    resize: vertical;
    min-height: 100px;
  }

  .char-count {
    font-size: $font-size-xs;
    color: $gray-500;
    text-align: right;
    margin-top: $spacing-xs;
  }

  .select-wrapper {
    position: relative;

    .select {
      appearance: none;
      padding-right: 2.5rem;
      cursor: pointer;
    }

    .select-icon {
      position: absolute;
      right: $spacing-md;
      top: 50%;
      transform: translateY(-50%);
      width: 1rem;
      height: 1rem;
      color: $gray-400;
      pointer-events: none;
    }
  }

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

    .clear-date-btn {
      position: absolute;
      right: $spacing-md;
      top: 50%;
      transform: translateY(-50%);
      background: none;
      border: none;
      cursor: pointer;
      color: $gray-400;
      padding: $spacing-xs;
      border-radius: $border-radius-sm;
      transition: all 0.2s ease;

      &:hover {
        background: $gray-100;
        color: $gray-600;
      }

      .icon {
        width: 0.875rem;
        height: 0.875rem;
      }
    }
  }

  .task-info {
    background: $gray-50;
    border-radius: $border-radius;
    padding: $spacing-md;
    margin-bottom: $spacing-lg;

    .info-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: $spacing-xs;

      &:last-child {
        margin-bottom: 0;
      }

      .info-label {
        font-size: $font-size-sm;
        color: $gray-600;
        font-weight: 500;
      }

      .info-value {
        font-size: $font-size-sm;
        color: $gray-900;
      }
    }
  }
}

.modal-actions {
  display: flex;
  gap: $spacing-md;
  justify-content: flex-end;
  padding-top: $spacing-lg;
  border-top: 1px solid $gray-200;
  margin-top: $spacing-lg;

  @media (max-width: $mobile) {
    flex-direction: column-reverse;
  }

  .btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
}

// Animaciones
.modal-overlay {
  animation: fadeIn 0.2s ease-out;
}

.modal-content {
  animation: slideIn 0.2s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-20px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}
</style> 