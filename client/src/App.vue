<template>
  <div
    id="app"
    class="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50"
  >
    <!-- Header -->
    <header class="bg-white shadow-sm border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <div class="flex items-center">
            <h1 class="text-2xl font-bold text-primary-600 font-display">Scrabster Pro</h1>
            <span class="ml-2 text-sm text-gray-500 font-sans">
              Multiplayer Wortspiel
            </span>
          </div>
          <div v-if="currentUser" class="flex items-center space-x-4">
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
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Login Screen -->
      <LoginScreen v-if="!currentUser" @login="handleLogin" />

      <!-- Lobby -->
      <Lobby
        v-else-if="currentView === 'lobby'"
        :gameApi="gameApi"
        :currentUser="currentUser"
        @createGame="handleCreateGame"
        @joinGame="handleJoinGame"
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
    </main>

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
import GameApiService from './services/gameApi.js';
import LoginScreen from './components/LoginScreen.vue';
import Lobby from './components/Lobby.vue';
import GameScreen from './components/GameScreen.vue';
import GameOverScreen from './components/GameOverScreen.vue';
import InstructionsPage from './components/InstructionsPage.vue';
import ImprintPage from './components/ImprintPage.vue';

// Reactive state
const currentUser = ref(null);
const currentView = ref('lobby');
const gameData = ref(null);
const gameResult = ref(null);
const gameApi = ref(null);
const toasts = ref([]);

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
};

const handleJoinGame = data => {
  currentView.value = 'game';
  gameData.value = data;
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
};

const showImprint = () => {
  currentView.value = 'imprint';
};

const handleBackToGame = () => {
  currentView.value = 'lobby';
};

const disconnect = () => {
  if (gameApi.value) {
    gameApi.value.disconnect();
  }
  currentUser.value = null;
  currentView.value = 'lobby';
  gameData.value = null;
  gameResult.value = null;
};

// Lifecycle
onMounted(() => {
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
