<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="isVisible"
        class="fixed inset-0 z-50 flex items-center justify-center p-4"
        @click="handleBackdropClick"
      >
        <!-- Backdrop -->
        <div class="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>

        <!-- Dialog -->
        <Transition
          enter-active-class="transition duration-300 ease-out"
          enter-from-class="opacity-0 scale-95 translate-y-4"
          enter-to-class="opacity-100 scale-100 translate-y-0"
          leave-active-class="transition duration-200 ease-in"
          leave-from-class="opacity-100 scale-100 translate-y-0"
          leave-to-class="opacity-0 scale-95 translate-y-4"
        >
          <div
            v-if="isVisible"
            class="relative bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 overflow-hidden"
            @click.stop
          >
            <!-- Header -->
            <div class="px-6 py-4 border-b border-gray-200">
              <div class="flex items-center justify-between">
                <div class="flex items-center space-x-3">
                  <div
                    class="w-10 h-10 rounded-full flex items-center justify-center"
                    :class="iconClasses"
                  >
                    <span class="text-xl">{{ icon }}</span>
                  </div>
                  <h3 class="text-lg font-semibold text-gray-900">
                    {{ title }}
                  </h3>
                </div>
                <button
                  v-if="showCloseButton"
                  @click="close"
                  class="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg
                    class="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            </div>

            <!-- Content -->
            <div class="px-6 py-4">
              <p class="text-gray-600 leading-relaxed">{{ message }}</p>
            </div>

            <!-- Actions -->
            <div class="px-6 py-4 bg-gray-50 flex justify-end space-x-3">
              <button
                v-if="showCancelButton"
                @click="handleCancel"
                class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
              >
                {{ cancelText }}
              </button>
              <button
                @click="handleConfirm"
                class="px-4 py-2 text-sm font-medium text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors"
                :class="confirmButtonClasses"
              >
                {{ confirmText }}
              </button>
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<script lang="ts" setup>
import { computed, watch } from 'vue';

const props = defineProps<{
  isVisible: boolean;
  title?: string;
  message: string;
  type?: 'info' | 'success' | 'warning' | 'error';
  showCloseButton?: boolean;
  showCancelButton?: boolean;
  confirmText?: string;
  cancelText?: string;
  closeOnBackdrop?: boolean;
}>();

const emit = defineEmits<{
  close: [];
  confirm: [];
  cancel: [];
}>();

const icon = computed(() => {
  const icons = {
    info: 'ℹ️',
    success: '✅',
    warning: '⚠️',
    error: '❌',
  };
  return icons[props.type];
});

const iconClasses = computed(() => {
  const classes = {
    info: 'bg-blue-100 text-blue-600',
    success: 'bg-green-100 text-green-600',
    warning: 'bg-yellow-100 text-yellow-600',
    error: 'bg-red-100 text-red-600',
  };
  return classes[props.type];
});

const confirmButtonClasses = computed(() => {
  const classes = {
    info: 'bg-primary-600 hover:bg-primary-700 focus:ring-primary-500',
    success: 'bg-green-600 hover:bg-green-700 focus:ring-green-500',
    warning: 'bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500',
    error: 'bg-red-600 hover:bg-red-700 focus:ring-red-500',
  };
  return classes[props.type];
});

const close = (): void => {
  emit('close');
};

const handleConfirm = (): void => {
  emit('confirm');
  close();
};

const handleCancel = (): void => {
  emit('cancel');
  close();
};

const handleBackdropClick = (): void => {
  if (props.closeOnBackdrop) {
    close();
  }
};

// Close on Escape key
const handleKeydown = (event: KeyboardEvent): void => {
  if (event.key === 'Escape' && props.isVisible) {
    close();
  }
};

watch(
  () => props.isVisible,
  (isVisible: boolean) => {
    if (isVisible) {
      document.addEventListener('keydown', handleKeydown);
      document.body.style.overflow = 'hidden';
    } else {
      document.removeEventListener('keydown', handleKeydown);
      document.body.style.overflow = '';
    }
  }
);
</script>
