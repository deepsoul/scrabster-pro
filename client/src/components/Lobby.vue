<template>
  <div class="max-w-4xl mx-auto">
    <div class="text-center mb-8">
      <h1 class="text-4xl font-bold text-gray-900 mb-4">Spiel-Lobby</h1>
      <p class="text-lg text-gray-600">
        Erstelle ein neues Spiel oder trete einem bestehenden bei
      </p>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- Create Game -->
      <div class="bg-white rounded-xl shadow-lg p-8 border border-gray-200">
        <div class="text-center mb-6">
          <div
            class="mx-auto h-16 w-16 bg-primary-500 rounded-full flex items-center justify-center mb-4"
          >
            <svg
              class="h-8 w-8 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
          </div>
          <h2 class="text-2xl font-bold text-gray-900">
            Neues Spiel erstellen
          </h2>
          <p class="text-gray-600 mt-2">
            Erstelle ein Spiel und lade Freunde ein
          </p>
        </div>

        <form @submit.prevent="createGame" class="space-y-6">
          <div>
            <label
              for="difficulty"
              class="block text-sm font-medium text-gray-700 mb-2"
            >
              Schwierigkeitsstufe
            </label>
            <select
              id="difficulty"
              v-model="selectedDifficulty"
              class="input-field"
            >
              <option value="easy">Leicht (9 Buchstaben, 120s)</option>
              <option value="medium">Mittel (8 Buchstaben, 90s)</option>
              <option value="hard">Schwer (7 Buchstaben, 60s)</option>
            </select>
          </div>

          <button
            type="submit"
            :disabled="isCreating"
            class="w-full btn-primary text-lg py-4 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span v-if="isCreating" class="flex items-center justify-center">
              <svg
                class="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  class="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  stroke-width="4"
                ></circle>
                <path
                  class="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Erstelle Spiel...
            </span>
            <span v-else>Spiel erstellen</span>
          </button>
        </form>
      </div>

      <!-- Training Mode -->
      <div class="bg-white rounded-xl shadow-lg p-8 border border-gray-200">
        <div class="text-center mb-6">
          <div
            class="mx-auto h-16 w-16 bg-green-500 rounded-full flex items-center justify-center mb-4"
          >
            <svg
              class="h-8 w-8 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
              />
            </svg>
          </div>
          <h2 class="text-2xl font-bold text-gray-900">Trainingsmodus</h2>
          <p class="text-gray-600 mt-2">Übe alleine ohne Spielpartner</p>
        </div>

        <form @submit.prevent="startTraining" class="space-y-6">
          <div>
            <label
              for="trainingDifficulty"
              class="block text-sm font-medium text-gray-700 mb-2"
            >
              Schwierigkeitsstufe
            </label>
            <select
              id="trainingDifficulty"
              v-model="selectedTrainingDifficulty"
              class="input-field"
            >
              <option value="easy">Leicht (9 Buchstaben, 120s)</option>
              <option value="medium">Mittel (8 Buchstaben, 90s)</option>
              <option value="hard">Schwer (7 Buchstaben, 60s)</option>
            </select>
          </div>

          <button
            type="submit"
            class="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-4 px-6 rounded-lg transition-colors duration-200 text-lg"
          >
            <span class="flex items-center justify-center">
              Training starten
            </span>
          </button>
        </form>
      </div>

      <!-- Join Game -->
      <div class="bg-white rounded-xl shadow-lg p-8 border border-gray-200">
        <div class="text-center mb-6">
          <div
            class="mx-auto h-16 w-16 bg-secondary-500 rounded-full flex items-center justify-center mb-4"
          >
            <svg
              class="h-8 w-8 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
              />
            </svg>
          </div>
          <h2 class="text-2xl font-bold text-gray-900">Spiel beitreten</h2>
          <p class="text-gray-600 mt-2">Gib den Spiel-Code ein</p>
        </div>

        <form @submit.prevent="joinGame" class="space-y-6">
          <div>
            <label
              for="gameCode"
              class="block text-sm font-medium text-gray-700 mb-2"
            >
              Spiel-Code
            </label>
            <input
              id="gameCode"
              v-model="gameCode"
              type="text"
              placeholder="z.B. ABC123"
              class="input-field text-center text-lg font-mono tracking-wider"
              maxlength="6"
              @input="gameCode = gameCode.toUpperCase()"
            />
          </div>

          <button
            type="submit"
            :disabled="!gameCode.trim() || isJoining"
            class="w-full btn-secondary text-lg py-4 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span v-if="isJoining" class="flex items-center justify-center">
              <svg
                class="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  class="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  stroke-width="4"
                ></circle>
                <path
                  class="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Beitreten...
            </span>
            <span v-else>Spiel beitreten</span>
          </button>
        </form>
      </div>
    </div>

    <!-- Game Code Display (when game is created) -->
    <div
      v-if="createdGameCode"
      class="mt-8 bg-primary-50 rounded-xl p-6 border border-primary-200"
    >
      <div class="text-center">
        <h3 class="text-xl font-bold text-primary-800 mb-2">Spiel erstellt!</h3>
        <p class="text-primary-600 mb-4">
          Teile diesen Code mit deinen Freunden:
        </p>
        <div
          class="bg-white rounded-lg p-4 border-2 border-primary-300 border-dashed"
        >
          <span
            class="text-3xl font-bold text-primary-600 font-mono tracking-wider"
          >
            {{ createdGameCode }}
          </span>
        </div>
        <p class="text-sm text-primary-500 mt-2 mb-4">
          Warte auf Spieler oder starte das Spiel alleine
        </p>

        <!-- Share Buttons -->
        <div class="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            @click="openShareModal"
            class="btn-success py-2 px-4 flex items-center justify-center"
          >
            <span class="mr-2">📤</span>
            Spiel teilen
          </button>
          <button
            @click="copyGameCode"
            class="btn-secondary py-2 px-4 flex items-center justify-center"
          >
            <span class="mr-2">📋</span>
            Code kopieren
          </button>
        </div>
      </div>
    </div>

    <!-- Quick Tips -->
    <div class="mt-8 bg-gray-50 rounded-xl p-6">
      <h3 class="text-lg font-semibold text-gray-900 mb-4">
        💡 Tipps für besseres Spielen
      </h3>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
        <div class="flex items-start">
          <span class="text-primary-500 mr-2">🎤</span>
          <span>Nutze die Spracheingabe für schnellere Wort-Eingabe</span>
        </div>
        <div class="flex items-start">
          <span class="text-primary-500 mr-2">🎯</span>
          <span>Ziel ist es, WENIGE Wörter zu bilden, nicht viele!</span>
        </div>
        <div class="flex items-start">
          <span class="text-primary-500 mr-2">⚡</span>
          <span>Ein "Scrabster" (alle Buchstaben) gewinnt sofort</span>
        </div>
        <div class="flex items-start">
          <span class="text-primary-500 mr-2">🧠</span>
          <span>Überlege dir Strategien für kurze, präzise Wörter</span>
        </div>
      </div>
    </div>

    <!-- Share Game Modal -->
    <ShareGame
      :gameCode="createdGameCode"
      :difficulty="selectedDifficulty"
      :showModal="showShareModal"
      @close="closeShareModal"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import ShareGame from './ShareGame.vue';
import type { DifficultyLevel } from '@/types';
import type GameApiService from '@/services/gameApi';

// Define props with proper typing
const props = defineProps<{
  gameApi: GameApiService | null;
  currentUser: string | null;
}>();

// Define emits with proper typing
const emit = defineEmits<{
  createGame: [gameData: any];
  joinGame: [gameData: any];
  startTraining: [trainingData: { difficulty: DifficultyLevel }];
}>();

const selectedDifficulty = ref<DifficultyLevel>('medium');
const selectedTrainingDifficulty = ref<DifficultyLevel>('medium');
const gameCode = ref<string>('');
const isCreating = ref<boolean>(false);
const isJoining = ref<boolean>(false);
const createdGameCode = ref<string>('');

// Share modal state
const showShareModal = ref<boolean>(false);

const createGame = async (): Promise<void> => {
  isCreating.value = true;

  try {
    const gameData = {
      username: props.currentUser || 'Spieler',
      difficulty: selectedDifficulty.value,
    };

    // Send to server via API
    if (props.gameApi) {
      const result = await props.gameApi.createGame(
        gameData.username,
        gameData.difficulty
      );
      createdGameCode.value = result.gameCode;
      emit('createGame', result);
    } else {
      // Fallback for testing
      const fallbackData = {
        ...gameData,
        gameCode: generateGameCode(),
      };
      createdGameCode.value = fallbackData.gameCode;
      emit('createGame', fallbackData);
    }
  } catch (error) {
    console.error('Error creating game:', error);
  } finally {
    isCreating.value = false;
  }
};

const joinGame = async (): Promise<void> => {
  if (!gameCode.value.trim()) return;

  isJoining.value = true;

  try {
    const gameCodeValue = gameCode.value.trim().toUpperCase();

    // Send to server via API
    if (props.gameApi) {
      const result = await props.gameApi.joinGame(
        gameCodeValue,
        props.currentUser || 'Spieler'
      );
      emit('joinGame', result);
    } else {
      // Fallback for testing
      const fallbackData = {
        gameCode: gameCodeValue,
      };
      emit('joinGame', fallbackData);
    }
  } catch (error) {
    console.error('Error joining game:', error);
  } finally {
    isJoining.value = false;
  }
};

// Share modal methods
const openShareModal = (): void => {
  showShareModal.value = true;
};

const closeShareModal = (): void => {
  showShareModal.value = false;
};

// Copy game code
const copyGameCode = async (): Promise<void> => {
  try {
    await navigator.clipboard.writeText(createdGameCode.value);
    // Track analytics
    if (window.analytics) {
      window.analytics.trackEvent('game_code_copied', {
        game_code: createdGameCode.value,
        difficulty: selectedDifficulty.value,
        event_category: 'sharing',
      });
    }
    window.showDialog({
      title: 'Erfolg',
      message: 'Spiel-Code kopiert!',
      type: 'success',
    });
  } catch (error) {
    console.error('Failed to copy game code:', error);
    window.showDialog({
      title: 'Fehler',
      message: 'Fehler beim Kopieren',
      type: 'error',
    });
  }
};

const startTraining = (): void => {
  const trainingData = {
    difficulty: selectedTrainingDifficulty.value,
  };
  emit('startTraining', trainingData);
};

const generateGameCode = (): string => {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
};
</script>
