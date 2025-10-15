<template>
  <div
    v-if="show"
    class="fixed inset-0 bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center z-50"
  >
    <div class="text-center max-w-md mx-auto px-6">
      <!-- Animated Logo -->
      <div class="mb-8">
        <div class="relative inline-block">
          <!-- Scrabster Logo with animation -->
          <div class="w-20 h-20 mx-auto mb-4 relative">
            <svg
              viewBox="0 0 100 100"
              class="w-full h-full"
              xmlns="http://www.w3.org/2000/svg"
            >
              <!-- Background circle with pulse animation -->
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="url(#gradient)"
                stroke-width="2"
                class="animate-pulse"
              />

              <!-- Gradient definition -->
              <defs>
                <linearGradient
                  id="gradient"
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="100%"
                >
                  <stop
                    offset="0%"
                    style="stop-color: #3b82f6; stop-opacity: 1"
                  />
                  <stop
                    offset="100%"
                    style="stop-color: #1d4ed8; stop-opacity: 1"
                  />
                </linearGradient>
              </defs>

              <!-- Animated letter tiles -->
              <g class="letter-tiles">
                <!-- S -->
                <rect
                  x="25"
                  y="30"
                  width="12"
                  height="12"
                  rx="2"
                  fill="#3b82f6"
                  class="tile-animation"
                  style="animation-delay: 0s"
                />
                <text
                  x="31"
                  y="39"
                  text-anchor="middle"
                  fill="white"
                  font-family="Arial, sans-serif"
                  font-size="8"
                  font-weight="bold"
                >
                  S
                </text>

                <!-- C -->
                <rect
                  x="40"
                  y="30"
                  width="12"
                  height="12"
                  rx="2"
                  fill="#1d4ed8"
                  class="tile-animation"
                  style="animation-delay: 0.2s"
                />
                <text
                  x="46"
                  y="39"
                  text-anchor="middle"
                  fill="white"
                  font-family="Arial, sans-serif"
                  font-size="8"
                  font-weight="bold"
                >
                  C
                </text>

                <!-- R -->
                <rect
                  x="55"
                  y="30"
                  width="12"
                  height="12"
                  rx="2"
                  fill="#3b82f6"
                  class="tile-animation"
                  style="animation-delay: 0.4s"
                />
                <text
                  x="61"
                  y="39"
                  text-anchor="middle"
                  fill="white"
                  font-family="Arial, sans-serif"
                  font-size="8"
                  font-weight="bold"
                >
                  R
                </text>

                <!-- A -->
                <rect
                  x="25"
                  y="45"
                  width="12"
                  height="12"
                  rx="2"
                  fill="#1d4ed8"
                  class="tile-animation"
                  style="animation-delay: 0.6s"
                />
                <text
                  x="31"
                  y="54"
                  text-anchor="middle"
                  fill="white"
                  font-family="Arial, sans-serif"
                  font-size="8"
                  font-weight="bold"
                >
                  A
                </text>

                <!-- B -->
                <rect
                  x="40"
                  y="45"
                  width="12"
                  height="12"
                  rx="2"
                  fill="#3b82f6"
                  class="tile-animation"
                  style="animation-delay: 0.8s"
                />
                <text
                  x="46"
                  y="54"
                  text-anchor="middle"
                  fill="white"
                  font-family="Arial, sans-serif"
                  font-size="8"
                  font-weight="bold"
                >
                  B
                </text>

                <!-- S -->
                <rect
                  x="55"
                  y="45"
                  width="12"
                  height="12"
                  rx="2"
                  fill="#1d4ed8"
                  class="tile-animation"
                  style="animation-delay: 1s"
                />
                <text
                  x="61"
                  y="54"
                  text-anchor="middle"
                  fill="white"
                  font-family="Arial, sans-serif"
                  font-size="8"
                  font-weight="bold"
                >
                  S
                </text>

                <!-- T -->
                <rect
                  x="25"
                  y="60"
                  width="12"
                  height="12"
                  rx="2"
                  fill="#3b82f6"
                  class="tile-animation"
                  style="animation-delay: 1.2s"
                />
                <text
                  x="31"
                  y="69"
                  text-anchor="middle"
                  fill="white"
                  font-family="Arial, sans-serif"
                  font-size="8"
                  font-weight="bold"
                >
                  T
                </text>

                <!-- E -->
                <rect
                  x="40"
                  y="60"
                  width="12"
                  height="12"
                  rx="2"
                  fill="#1d4ed8"
                  class="tile-animation"
                  style="animation-delay: 1.4s"
                />
                <text
                  x="46"
                  y="69"
                  text-anchor="middle"
                  fill="white"
                  font-family="Arial, sans-serif"
                  font-size="8"
                  font-weight="bold"
                >
                  E
                </text>

                <!-- R -->
                <rect
                  x="55"
                  y="60"
                  width="12"
                  height="12"
                  rx="2"
                  fill="#3b82f6"
                  class="tile-animation"
                  style="animation-delay: 1.6s"
                />
                <text
                  x="61"
                  y="69"
                  text-anchor="middle"
                  fill="white"
                  font-family="Arial, sans-serif"
                  font-size="8"
                  font-weight="bold"
                >
                  R
                </text>
              </g>
            </svg>
          </div>
        </div>
      </div>

      <!-- Loading message -->
      <div class="space-y-4">
        <h2 class="text-2xl font-bold text-primary-800 mb-2">
          Server startet...
        </h2>

        <p class="text-primary-600 text-lg">
          {{ loadingMessage }}
        </p>

        <!-- Progress bar -->
        <div class="w-full bg-primary-200 rounded-full h-2 overflow-hidden">
          <div
            class="h-full bg-gradient-to-r from-primary-500 to-primary-600 rounded-full transition-all duration-1000 ease-out"
            :style="{ width: progressWidth + '%' }"
          ></div>
        </div>

        <!-- Animated dots -->
        <div class="flex justify-center space-x-2">
          <div
            class="w-2 h-2 bg-primary-500 rounded-full animate-bounce"
            style="animation-delay: 0s"
          ></div>
          <div
            class="w-2 h-2 bg-primary-500 rounded-full animate-bounce"
            style="animation-delay: 0.2s"
          ></div>
          <div
            class="w-2 h-2 bg-primary-500 rounded-full animate-bounce"
            style="animation-delay: 0.4s"
          ></div>
        </div>

        <!-- Time estimate -->
        <p class="text-sm text-primary-500">
          Geschätzte Wartezeit: {{ estimatedTime }}s
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';

const props = defineProps<{
  show: boolean;
}>();

const emit = defineEmits<{
  timeout: [];
}>();

// Loading state
const progressWidth = ref(0);
const estimatedTime = ref(50);
const loadingMessage = ref('Server wird gestartet...');

// Messages to cycle through
const messages = [
  'Server wird gestartet...',
  'Buchstaben werden geladen...',
  'Wörter werden vorbereitet...',
  'Spieler werden verbunden...',
  'Fast fertig...',
  'Letzte Vorbereitungen...',
];

let messageIndex = 0;
let progressInterval: NodeJS.Timeout | null = null;
let messageInterval: NodeJS.Timeout | null = null;
let timeoutTimer: NodeJS.Timeout | null = null;

const startLoading = () => {
  if (!props.show) return;

  // Reset progress
  progressWidth.value = 0;
  messageIndex = 0;
  loadingMessage.value = messages[0] as string;

  // Start progress animation (50 seconds total)
  progressInterval = setInterval(() => {
    if (progressWidth.value < 100) {
      progressWidth.value += 2; // 2% every second
    }
  }, 1000);

  // Cycle through messages every 8 seconds
  messageInterval = setInterval(() => {
    messageIndex = (messageIndex + 1) % messages.length;
    loadingMessage.value = messages[messageIndex] as string;
  }, 8000);

  // Timeout after 60 seconds (safety margin)
  timeoutTimer = setTimeout(() => {
    emit('timeout');
  }, 60000);
};

const stopLoading = () => {
  if (progressInterval) {
    clearInterval(progressInterval);
    progressInterval = null;
  }
  if (messageInterval) {
    clearInterval(messageInterval);
    messageInterval = null;
  }
  if (timeoutTimer) {
    clearTimeout(timeoutTimer);
    timeoutTimer = null;
  }
};

onMounted(() => {
  if (props.show) {
    startLoading();
  }
});

onUnmounted(() => {
  stopLoading();
});

// Watch for show prop changes
import { watch } from 'vue';
watch(
  () => props.show,
  newShow => {
    if (newShow) {
      startLoading();
    } else {
      stopLoading();
    }
  }
);
</script>

<style scoped>
@keyframes tile-bounce {
  0%,
  20%,
  50%,
  80%,
  100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-8px);
  }
  60% {
    transform: translateY(-4px);
  }
}

.tile-animation {
  animation: tile-bounce 2s ease-in-out infinite;
}

.letter-tiles {
  animation: rotate 20s linear infinite;
}

@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

/* Custom gradient background */
.bg-gradient-to-br {
  background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
}
</style>
