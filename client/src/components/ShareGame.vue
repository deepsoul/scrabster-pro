<template>
  <!-- Share Modal -->
  <div
    v-if="showModal"
    class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
    @click="closeModal"
  >
    <div
      class="bg-white rounded-xl shadow-2xl max-w-md w-full"
      @click.stop
    >
      <!-- Header -->
      <div class="p-6 border-b border-gray-200">
        <div class="flex items-center justify-between">
          <div class="flex items-center">
            <div
              class="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-4"
            >
              <span class="text-2xl">📤</span>
            </div>
            <div>
              <h2 class="text-xl font-bold text-gray-900 font-display">
                Spiel teilen
              </h2>
              <p class="text-sm text-gray-600 font-sans">
                Lade Freunde zum Mitspielen ein
              </p>
            </div>
          </div>
          <button
            @click="closeModal"
            class="text-gray-400 hover:text-gray-600 transition-colors duration-200"
          >
            <span class="text-2xl">×</span>
          </button>
        </div>
      </div>

      <!-- Content -->
      <div class="p-6 space-y-6">
        <!-- Game Code Display -->
        <div class="bg-gray-50 rounded-lg p-4">
          <div class="text-center">
            <div class="text-sm text-gray-600 font-sans mb-2">
              Spiel-Code
            </div>
            <div
              class="text-3xl font-bold text-primary-600 font-mono font-display mb-2"
            >
              {{ gameCode }}
            </div>
            <button
              @click="copyGameCode"
              class="text-sm text-primary-600 hover:text-primary-800 font-sans underline"
            >
              Code kopieren
            </button>
          </div>
        </div>

        <!-- Share Options -->
        <div class="space-y-4">
          <h3 class="text-lg font-semibold text-gray-900 font-display">
            Teilen über:
          </h3>

          <!-- WhatsApp -->
          <button
            @click="shareWhatsApp"
            class="w-full flex items-center p-4 bg-green-50 hover:bg-green-100 rounded-lg transition-colors duration-200 group"
          >
            <div class="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mr-4 group-hover:bg-green-600 transition-colors duration-200">
              <span class="text-2xl text-white">📱</span>
            </div>
            <div class="flex-1 text-left">
              <div class="font-semibold text-gray-900 font-display">
                WhatsApp
              </div>
              <div class="text-sm text-gray-600 font-sans">
                Teile den Link direkt in WhatsApp
              </div>
            </div>
            <div class="text-gray-400 group-hover:text-gray-600">
              →
            </div>
          </button>

          <!-- Email -->
          <button
            @click="shareEmail"
            class="w-full flex items-center p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors duration-200 group"
          >
            <div class="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mr-4 group-hover:bg-blue-600 transition-colors duration-200">
              <span class="text-2xl text-white">✉️</span>
            </div>
            <div class="flex-1 text-left">
              <div class="font-semibold text-gray-900 font-display">
                E-Mail
              </div>
              <div class="text-sm text-gray-600 font-sans">
                Sende eine Einladung per E-Mail
              </div>
            </div>
            <div class="text-gray-400 group-hover:text-gray-600">
              →
            </div>
          </button>

          <!-- Copy Link -->
          <button
            @click="copyLink"
            class="w-full flex items-center p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors duration-200 group"
          >
            <div class="w-12 h-12 bg-gray-500 rounded-full flex items-center justify-center mr-4 group-hover:bg-gray-600 transition-colors duration-200">
              <span class="text-2xl text-white">🔗</span>
            </div>
            <div class="flex-1 text-left">
              <div class="font-semibold text-gray-900 font-display">
                Link kopieren
              </div>
              <div class="text-sm text-gray-600 font-sans">
                Kopiere den direkten Spiel-Link
              </div>
            </div>
            <div class="text-gray-400 group-hover:text-gray-600">
              →
            </div>
          </button>
        </div>

        <!-- Share Message Preview -->
        <div class="bg-gray-50 rounded-lg p-4">
          <h4 class="font-semibold text-gray-900 font-display mb-2">
            Nachricht:
          </h4>
          <div class="text-sm text-gray-700 font-sans bg-white p-3 rounded border">
            {{ shareMessage }}
          </div>
        </div>
      </div>

      <!-- Actions -->
      <div class="p-6 border-t border-gray-200">
        <button
          @click="closeModal"
          class="w-full btn-primary py-3 font-sans"
        >
          Fertig
        </button>
      </div>
    </div>
  </div>

  <!-- Toast Notification -->
  <div
    v-if="showToast"
    class="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 transition-all duration-300"
  >
    <div class="flex items-center">
      <span class="text-lg mr-2">✓</span>
      <span class="font-sans">{{ toastMessage }}</span>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';

const props = defineProps({
  gameCode: {
    type: String,
    required: true,
  },
  difficulty: {
    type: String,
    default: 'medium',
  },
  showModal: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['close']);

// State
const showToast = ref(false);
const toastMessage = ref('');

// Computed
const gameUrl = computed(() => {
  return `${window.location.origin}${window.location.pathname}`;
});

const shareMessage = computed(() => {
  const difficultyText = {
    easy: 'Leicht',
    medium: 'Mittel',
    hard: 'Schwer',
  }[props.difficulty] || 'Mittel';

  return `🎮 Komm mit mir Scrabster Pro spielen!\n\n` +
    `Spiel-Code: ${props.gameCode}\n` +
    `Schwierigkeit: ${difficultyText}\n\n` +
    `Klicke hier zum Mitspielen: ${gameUrl.value}`;
});

// Methods
const closeModal = () => {
  emit('close');
};

const copyGameCode = async () => {
  try {
    await navigator.clipboard.writeText(props.gameCode);
    showToastMessage('Spiel-Code kopiert!');
  } catch (error) {
    console.error('Failed to copy game code:', error);
    showToastMessage('Fehler beim Kopieren');
  }
};

const copyLink = async () => {
  try {
    await navigator.clipboard.writeText(gameUrl.value);
    showToastMessage('Link kopiert!');
  } catch (error) {
    console.error('Failed to copy link:', error);
    showToastMessage('Fehler beim Kopieren');
  }
};

const shareWhatsApp = () => {
  const message = encodeURIComponent(shareMessage.value);
  const whatsappUrl = `https://wa.me/?text=${message}`;
  
  window.open(whatsappUrl, '_blank');
  
  // Track analytics
  if (window.analytics) {
    window.analytics.trackEvent('game_shared', {
      method: 'whatsapp',
      game_code: props.gameCode,
      difficulty: props.difficulty,
      event_category: 'sharing',
    });
  }
  
  showToastMessage('WhatsApp geöffnet!');
};

const shareEmail = () => {
  const subject = encodeURIComponent('🎮 Komm mit mir Scrabster Pro spielen!');
  const body = encodeURIComponent(shareMessage.value);
  const emailUrl = `mailto:?subject=${subject}&body=${body}`;
  
  window.location.href = emailUrl;
  
  // Track analytics
  if (window.analytics) {
    window.analytics.trackEvent('game_shared', {
      method: 'email',
      game_code: props.gameCode,
      difficulty: props.difficulty,
      event_category: 'sharing',
    });
  }
  
  showToastMessage('E-Mail-Client geöffnet!');
};

const showToastMessage = (message) => {
  toastMessage.value = message;
  showToast.value = true;
  
  setTimeout(() => {
    showToast.value = false;
  }, 3000);
};

// Watch for modal changes
watch(() => props.showModal, (newValue) => {
  if (newValue) {
    // Track analytics when modal opens
    if (window.analytics) {
      window.analytics.trackEvent('share_modal_opened', {
        game_code: props.gameCode,
        difficulty: props.difficulty,
        event_category: 'sharing',
      });
    }
  }
});
</script>

<style scoped>
/* Additional styles if needed */
</style>
