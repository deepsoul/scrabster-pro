<template>
  <div
    id="app"
    class="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50"
  >
    <!-- Header -->
    <header class="bg-white shadow-sm border-b border-gray-200" role="banner">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <!-- Logo -->
          <div class="flex items-center space-x-3">
            <img
              src="/logo.svg"
              alt="Scrabster Pro Logo - Multiplayer Wortspiel mit Buchstaben-Tiles"
              class="h-10 w-10 flex-shrink-0"
              width="40"
              height="40"
            />
            <h1 class="text-2xl font-bold text-primary-600 font-display">
              Scrabster Pro
            </h1>
          </div>

          <!-- Desktop Navigation -->
          <div v-if="currentUser" class="hidden md:flex items-center space-x-4">
            <span class="text-sm text-gray-600">Hallo, {{ currentUser }}</span>
            <button
              @click="showInstructions"
              class="text-sm text-gray-500 hover:text-gray-700 px-3 py-1 rounded-md hover:bg-gray-100"
            >
              📖 Anleitung
            </button>
            <button
              @click="showImprint"
              class="text-sm text-gray-500 hover:text-gray-700 px-3 py-1 rounded-md hover:bg-gray-100"
            >
              📄 Impressum
            </button>
            <button
              @click="disconnect"
              class="text-sm text-gray-500 hover:text-gray-700 px-3 py-1 rounded-md hover:bg-gray-100"
            >
              Abmelden
            </button>
          </div>

          <!-- Mobile Burger Menu -->
          <div v-if="currentUser" class="md:hidden">
            <button
              @click="toggleMobileMenu"
              class="text-gray-500 hover:text-gray-700 focus:outline-none focus:text-gray-700"
              :class="{ 'text-gray-700': isMobileMenuOpen }"
            >
              <svg
                class="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  v-if="!isMobileMenuOpen"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
                <path
                  v-else
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>

        <!-- Mobile Menu Dropdown -->
        <div v-if="currentUser && isMobileMenuOpen" class="md:hidden">
          <div
            class="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-gray-50 border-t border-gray-200"
          >
            <div
              class="px-3 py-2 text-sm text-gray-600 border-b border-gray-200"
            >
              Hallo, {{ currentUser }}
            </div>
            <button
              @click="
                showInstructions();
                closeMobileMenu();
              "
              class="block w-full text-left px-3 py-2 text-sm text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md"
            >
              📖 Anleitung
            </button>
            <button
              @click="
                showImprint();
                closeMobileMenu();
              "
              class="block w-full text-left px-3 py-2 text-sm text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md"
            >
              📄 Impressum
            </button>
            <button
              @click="
                disconnect();
                closeMobileMenu();
              "
              class="block w-full text-left px-3 py-2 text-sm text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md"
            >
              Abmelden
            </button>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8" role="main">
      <!-- Login Screen -->
      <LoginScreen
        v-if="!currentUser"
        @login="handleLogin"
        @showImprint="showImprint"
      />

      <!-- Lobby -->
      <Lobby
        v-else-if="currentView === 'lobby'"
        :gameApi="gameApi"
        :currentUser="currentUser"
        @createGame="handleCreateGame"
        @joinGame="handleJoinGame"
        @startTraining="handleStartTraining"
      />

      <!-- Game Screen -->
      <GameScreen
        v-else-if="currentView === 'game'"
        :gameData="gameData"
        :gameApi="gameApi"
        @leaveGame="handleLeaveGame"
        @gameOver="handleGameOver"
      />

      <!-- Game Over Screen -->
      <GameOverScreen
        v-else-if="currentView === 'gameOver'"
        :gameResult="gameResult"
        @playAgain="handlePlayAgain"
        @backToLobby="handleBackToLobby"
      />

      <!-- Instructions Page -->
      <InstructionsPage
        v-else-if="currentView === 'instructions'"
        @backToGame="handleBackToGame"
      />

      <!-- Imprint Page -->
      <ImprintPage
        v-else-if="currentView === 'imprint'"
        @backToGame="handleBackToGame"
      />

      <!-- Training Mode -->
      <TrainingMode
        v-else-if="currentView === 'training'"
        :difficulty="trainingDifficulty"
        @backToLobby="handleBackToLobby"
      />
    </main>

    <!-- Cookie Disclaimer -->
    <CookieDisclaimer
      @analyticsChanged="handleAnalyticsChanged"
      @settingsOpened="handleSettingsOpened"
      @openImprint="showImprint"
    />

    <!-- Global Dialog -->
    <AppDialog
      :isVisible="dialog.isVisible"
      :title="dialog.title"
      :message="dialog.message"
      :type="dialog.type"
      :showCloseButton="dialog.showCloseButton"
      :showCancelButton="dialog.showCancelButton"
      :confirmText="dialog.confirmText"
      :cancelText="dialog.cancelText"
      @close="closeDialog"
      @confirm="handleDialogConfirm"
      @cancel="handleDialogCancel"
    />

    <!-- Render Spinup Loader -->
    <RenderSpinupLoader
      :show="showRenderSpinup"
      @timeout="handleRenderSpinupTimeout"
    />

    <!-- Toast Notifications -->
    <div class="fixed top-4 right-4 z-50 space-y-2">
      <div
        v-for="toast in toasts"
        :key="toast.id"
        :class="[
          'max-w-sm p-4 rounded-lg shadow-lg transition-all duration-300',
          toast.type === 'success'
            ? 'bg-green-500 text-white'
            : toast.type === 'error'
            ? 'bg-red-500 text-white'
            : toast.type === 'warning'
            ? 'bg-yellow-500 text-white'
            : 'bg-blue-500 text-white',
        ]"
      >
        <div class="flex items-center justify-between">
          <span class="text-sm font-medium">{{ toast.message }}</span>
          <button
            @click="removeToast(toast.id)"
            class="ml-2 text-white hover:text-gray-200"
          >
            ×
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import GameApiService from './services/gameApi';
import LoginScreen from './components/LoginScreen.vue';
import Lobby from './components/Lobby.vue';
import GameScreen from './components/GameScreen.vue';
import GameOverScreen from './components/GameOverScreen.vue';
import InstructionsPage from './components/InstructionsPage.vue';
import ImprintPage from './components/ImprintPage.vue';
import TrainingMode from './components/TrainingMode.vue';
import CookieDisclaimer from './components/CookieDisclaimer.vue';
import AppDialog from './components/AppDialog.vue';
import RenderSpinupLoader from './components/RenderSpinupLoader.vue';
import analytics from './services/analytics';

// Reactive state
const currentUser = ref(null);
const currentView = ref('lobby');
const gameData = ref(null);
const gameResult = ref(null);
const gameApi = ref(null);
const toasts = ref([]);
const isMobileMenuOpen = ref(false);
const trainingDifficulty = ref('medium');
const showRenderSpinup = ref(false);

// Dialog state
const dialog = ref({
  isVisible: false,
  title: 'Information',
  message: '',
  type: 'info',
  showCloseButton: true,
  showCancelButton: false,
  confirmText: 'OK',
  cancelText: 'Abbrechen',
  onConfirm: null,
  onCancel: null,
});

// Toast management
let toastId = 0;

const addToast = (message, type = 'info') => {
  const id = ++toastId;
  toasts.value.push({ id, message, type });
  setTimeout(() => removeToast(id), 5000);
};

const removeToast = id => {
  const index = toasts.value.findIndex(t => t.id === id);
  if (index > -1) {
    toasts.value.splice(index, 1);
  }
};

// Mobile menu management
const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value;
};

const closeMobileMenu = () => {
  isMobileMenuOpen.value = false;
};

// Game API connection
const connectGameApi = () => {
  gameApi.value = new GameApiService();

  gameApi.value.on('connect', () => {
    console.log('Connected to game API');
  });

  gameApi.value.on('disconnect', () => {
    console.log('Disconnected from game API');
    addToast('Verbindung zum Server verloren', 'error');
  });

  gameApi.value.on('gameError', data => {
    addToast(data.message, 'error');
  });

  gameApi.value.on('renderSpinup', handleRenderSpinup);

  gameApi.value.on('gameCreated', data => {
    console.log('Game created:', data);
    gameData.value = {
      ...gameData.value,
      ...data,
      gameState: 'waiting',
    };
  });

  gameApi.value.on('gameJoined', data => {
    console.log('Game joined:', data);
    gameData.value = {
      ...gameData.value,
      ...data,
      gameState: 'waiting',
    };
  });

  gameApi.value.on('playerJoined', data => {
    if (gameData.value) {
      gameData.value.players = data.players;
    }
  });

  gameApi.value.on('playerLeft', data => {
    if (gameData.value) {
      gameData.value.players = data.players;
    }
  });

  gameApi.value.on('gameStarted', data => {
    if (gameData.value) {
      gameData.value.gameState = 'playing';
      gameData.value.letters = data.letters;
      gameData.value.timeLeft = data.timeLeft;
      gameData.value.players = data.players;
    }
  });

  gameApi.value.on('gameStateUpdate', data => {
    if (gameData.value) {
      gameData.value.timeLeft = data.timeLeft;
      gameData.value.players = data.players;
      // Gewinner-Information aktualisieren
      if (data.winner !== undefined) {
        gameData.value.winner = data.winner;
      }
      if (data.isDraw !== undefined) {
        gameData.value.isDraw = data.isDraw;
      }
    }
  });

  gameApi.value.on('wordSubmitted', data => {
    if (gameData.value) {
      gameData.value.players = data.players;
    }
  });

  gameApi.value.on('gameOver', data => {
    gameResult.value = data;
    currentView.value = 'gameOver';
  });
};

// Event handlers
const handleLogin = username => {
  currentUser.value = username;
  currentView.value = 'lobby';
  connectGameApi();
};

const handleCreateGame = data => {
  currentView.value = 'game';
  gameData.value = data;
  analytics.trackGameCreated(data.difficulty);
};

const handleJoinGame = data => {
  currentView.value = 'game';
  gameData.value = data;
  analytics.trackGameJoined();
};

const handleLeaveGame = () => {
  if (gameApi.value) {
    gameApi.value.leaveGame();
  }
  currentView.value = 'lobby';
  gameData.value = null;
};

const handleGameOver = result => {
  gameResult.value = result;
  currentView.value = 'gameOver';
};

const handlePlayAgain = () => {
  currentView.value = 'lobby';
  gameResult.value = null;
  gameData.value = null;
};

const handleBackToLobby = () => {
  currentView.value = 'lobby';
  gameResult.value = null;
  gameData.value = null;
};

const showInstructions = () => {
  currentView.value = 'instructions';
  analytics.trackInstructionsViewed();
};

const showImprint = () => {
  currentView.value = 'imprint';
  analytics.trackImprintViewed(); // Debug log
};

const handleBackToGame = () => {
  currentView.value = 'lobby';
};

const handleStartTraining = data => {
  trainingDifficulty.value = data.difficulty;
  currentView.value = 'training';
  analytics.trackEvent('training_started', {
    difficulty: data.difficulty,
    event_category: 'training',
  });
};

// Analytics event handlers
const handleAnalyticsChanged = enabled => {
  if (enabled) {
    analytics.enable();
    analytics.trackEvent('analytics_enabled', {
      event_category: 'privacy',
    });
  } else {
    analytics.disable();
    analytics.trackEvent('analytics_disabled', {
      event_category: 'privacy',
    });
  }
};

const handleSettingsOpened = () => {
  analytics.trackEvent('cookie_settings_opened', {
    event_category: 'privacy',
  });
};

const disconnect = () => {
  if (gameApi.value) {
    gameApi.value.disconnect();
  }

  // Clear all user data
  currentUser.value = null;
  gameData.value = null;
  gameResult.value = null;

  // Clear stored user data from localStorage
  localStorage.removeItem('scrabster-username');

  // Return to start page (login screen)
  currentView.value = 'login';

  // Track logout event
  if (window.analytics) {
    window.analytics.trackEvent('user_logout', {
      event_category: 'authentication',
    });
  }
};

// Dialog functions
const showDialog = options => {
  dialog.value = {
    isVisible: true,
    title: options.title || 'Information',
    message: options.message || '',
    type: options.type || 'info',
    showCloseButton: options.showCloseButton !== false,
    showCancelButton: options.showCancelButton || false,
    confirmText: options.confirmText || 'OK',
    cancelText: options.cancelText || 'Abbrechen',
    onConfirm: options.onConfirm || null,
    onCancel: options.onCancel || null,
  };
};

const closeDialog = () => {
  dialog.value.isVisible = false;
  dialog.value.onConfirm = null;
  dialog.value.onCancel = null;
};

const handleDialogConfirm = () => {
  if (dialog.value.onConfirm) {
    dialog.value.onConfirm();
  }
};

const handleDialogCancel = () => {
  if (dialog.value.onCancel) {
    dialog.value.onCancel();
  }
};

// Global dialog function for easy access
window.showDialog = showDialog;

// Render Spinup handlers
const handleRenderSpinup = (data) => {
  showRenderSpinup.value = data.detected;
};

const handleRenderSpinupTimeout = () => {
  showRenderSpinup.value = false;
  addToast('Server-Verbindung konnte nicht hergestellt werden. Bitte versuchen Sie es erneut.', 'error');
};

// Lifecycle
onMounted(() => {
  // Initialize analytics
  analytics.init();

  // Check if user is already logged in (localStorage)
  const savedUser = localStorage.getItem('scrabster-username');
  if (savedUser) {
    currentUser.value = savedUser;
    connectGameApi();
  }
});

onUnmounted(() => {
  if (gameApi.value) {
    gameApi.value.disconnect();
  }
});
</script>
