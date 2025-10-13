<template>
  <!-- Cookie Disclaimer Overlay -->
  <div
    v-if="showDisclaimer"
    class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
  >
    <div
      class="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
    >
      <!-- Header -->
      <div class="p-6 border-b border-gray-200">
        <div class="flex items-center">
          <div
            class="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4"
          >
            <span class="text-2xl">🍪</span>
          </div>
          <div>
            <h2 class="text-2xl font-bold text-gray-900 font-display">
              Cookie-Einstellungen
            </h2>
            <p class="text-gray-600 font-sans">
              Wir verwenden Cookies, um Ihre Erfahrung zu verbessern
            </p>
          </div>
        </div>
      </div>

      <!-- Content -->
      <div class="p-6 space-y-6">
        <!-- Essential Cookies -->
        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-lg font-semibold text-gray-900 font-display">
                Notwendige Cookies
              </h3>
              <p class="text-sm text-gray-600 font-sans">
                Diese Cookies sind für die Grundfunktionen der Website
                erforderlich
              </p>
            </div>
            <div class="flex items-center">
              <span class="text-sm text-gray-500 font-sans mr-2">
                Immer aktiv
              </span>
              <div
                class="w-12 h-6 bg-gray-300 rounded-full flex items-center justify-end px-1"
              >
                <div class="w-5 h-5 bg-white rounded-full shadow-sm"></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Analytics Cookies -->
        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <div class="flex-1">
              <h3 class="text-lg font-semibold text-gray-900 font-display">
                Analyse-Cookies
              </h3>
              <p class="text-sm text-gray-600 font-sans">
                Google Analytics hilft uns zu verstehen, wie Sie unsere Website
                nutzen
              </p>
              <div class="mt-2 text-xs text-gray-500 font-sans">
                <span class="font-semibold">Anbieter:</span>
                Google Analytics
                <br />
                <span class="font-semibold">Zweck:</span>
                Website-Analyse und Verbesserung
                <br />
                <span class="font-semibold">Speicherdauer:</span>
                2 Jahre
              </div>
            </div>
            <div class="flex items-center">
              <button
                @click="toggleAnalytics"
                :class="[
                  'w-12 h-6 rounded-full flex items-center transition-colors duration-200',
                  analyticsEnabled ? 'bg-primary-600' : 'bg-gray-300',
                ]"
              >
                <div
                  :class="[
                    'w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-200',
                    analyticsEnabled ? 'translate-x-6' : 'translate-x-0',
                  ]"
                ></div>
              </button>
            </div>
          </div>
        </div>

        <!-- Marketing Cookies -->
        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <div class="flex-1">
              <h3 class="text-lg font-semibold text-gray-900 font-display">
                Marketing-Cookies
              </h3>
              <p class="text-sm text-gray-600 font-sans">
                Diese Cookies werden derzeit nicht verwendet
              </p>
              <div class="mt-2 text-xs text-gray-500 font-sans">
                <span class="font-semibold">Status:</span>
                Deaktiviert
              </div>
            </div>
            <div class="flex items-center">
              <span class="text-sm text-gray-500 font-sans mr-2">
                Deaktiviert
              </span>
              <div
                class="w-12 h-6 bg-gray-300 rounded-full flex items-center justify-start px-1"
              >
                <div class="w-5 h-5 bg-white rounded-full shadow-sm"></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Privacy Notice -->
        <div class="bg-gray-50 rounded-lg p-4">
          <h4 class="font-semibold text-gray-900 font-display mb-2">
            Datenschutz-Hinweis
          </h4>
          <p class="text-sm text-gray-600 font-sans leading-relaxed">
            Ihre Privatsphäre ist uns wichtig. Sie können Ihre
            Cookie-Einstellungen jederzeit in den
            <button
              @click="openSettings"
              class="text-primary-600 hover:text-primary-800 underline"
            >
              Cookie-Einstellungen
            </button>
            ändern. Weitere Informationen finden Sie in unserem
            <button
              @click="openImprint"
              class="text-primary-600 hover:text-primary-800 underline"
            >
              Impressum
            </button>
            .
          </p>
        </div>
      </div>

      <!-- Actions -->
      <div class="p-6 border-t border-gray-200 flex flex-col sm:flex-row gap-3">
        <button @click="acceptAll" class="flex-1 btn-primary py-3 font-sans">
          Alle akzeptieren
        </button>
        <button
          @click="saveSettings"
          class="flex-1 btn-secondary py-3 font-sans"
        >
          Auswahl speichern
        </button>
        <button @click="rejectAll" class="flex-1 btn-danger py-3 font-sans">
          Nur notwendige
        </button>
      </div>
    </div>
  </div>

  <!-- Cookie Settings Button (when disclaimer is hidden) -->
  <button
    v-if="!showDisclaimer && showSettingsButton"
    @click="openSettings"
    class="fixed bottom-4 right-4 bg-white shadow-lg rounded-full p-3 text-gray-600 hover:text-gray-800 transition-colors duration-200 z-40"
    title="Cookie-Einstellungen"
  >
    <span class="text-xl">🍪</span>
  </button>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const emit = defineEmits(['analyticsChanged', 'settingsOpened', 'openImprint']);

// State
const showDisclaimer = ref(false);
const showSettingsButton = ref(false);
const analyticsEnabled = ref(false);

// Cookie management
const COOKIE_CONSENT_KEY = 'scrabster-cookie-consent';
const ANALYTICS_CONSENT_KEY = 'scrabster-analytics-consent';

// Load saved preferences
onMounted(() => {
  const consent = localStorage.getItem(COOKIE_CONSENT_KEY);
  const analytics = localStorage.getItem(ANALYTICS_CONSENT_KEY);

  if (!consent) {
    // First visit - show disclaimer
    showDisclaimer.value = true;
  } else {
    // Returning user - show settings button
    showSettingsButton.value = true;
    analyticsEnabled.value = analytics === 'true';
  }
});

// Toggle analytics
const toggleAnalytics = () => {
  analyticsEnabled.value = !analyticsEnabled.value;
};

// Accept all cookies
const acceptAll = () => {
  analyticsEnabled.value = true;
  saveSettings();
};

// Reject all non-essential cookies
const rejectAll = () => {
  analyticsEnabled.value = false;
  saveSettings();
};

// Save current settings
const saveSettings = () => {
  localStorage.setItem(COOKIE_CONSENT_KEY, 'true');
  localStorage.setItem(
    ANALYTICS_CONSENT_KEY,
    analyticsEnabled.value.toString()
  );

  showDisclaimer.value = false;
  showSettingsButton.value = true;

  // Emit analytics change
  emit('analyticsChanged', analyticsEnabled.value);
};

// Open settings
const openSettings = () => {
  showDisclaimer.value = true;
  emit('settingsOpened');
};

// Open imprint
const openImprint = () => {
  // This will be handled by the parent component
  emit('openImprint');
};
</script>

<style scoped>
.btn-secondary {
  @apply bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors duration-200;
}
</style>
