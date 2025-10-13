<template>
  <div
    class="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8"
  >
    <div class="max-w-md w-full space-y-8">
      <div class="text-center">
        <div
          class="mx-auto h-20 w-20 bg-primary-500 rounded-full flex items-center justify-center mb-6"
        >
          <span class="text-3xl font-bold text-white">S</span>
        </div>
        <h2 class="text-3xl font-bold text-gray-900">
          Willkommen bei Scrabster Pro
        </h2>
        <p class="mt-2 text-sm text-gray-600">
          Ein Echtzeit-Multiplayer-Wortspiel
        </p>
      </div>

      <form @submit.prevent="handleLogin" class="mt-8 space-y-6">
        <div>
          <label for="username" class="sr-only">Benutzername</label>
          <input
            id="username"
            v-model="username"
            name="username"
            type="text"
            required
            class="input-field text-center text-lg"
            placeholder="Gib deinen Benutzernamen ein"
            maxlength="20"
          />
        </div>

        <div>
          <button
            type="submit"
            :disabled="!username.trim()"
            class="group relative w-full btn-primary text-lg py-4 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span class="absolute left-0 inset-y-0 flex items-center pl-3">
              <svg
                class="h-5 w-5 text-primary-500 group-hover:text-primary-400"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fill-rule="evenodd"
                  d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                  clip-rule="evenodd"
                />
              </svg>
            </span>
            Spiel starten
          </button>
        </div>
      </form>

      <!-- Game Rules -->
      <div
        class="mt-8 bg-white rounded-lg p-6 shadow-sm border border-gray-200"
      >
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Spielregeln</h3>
        <ul class="space-y-2 text-sm text-gray-600">
          <li class="flex items-start">
            <span class="text-primary-500 mr-2">•</span>
            Bilde Wörter aus den vorgegebenen Buchstaben
          </li>
          <li class="flex items-start">
            <span class="text-primary-500 mr-2">•</span>
            Ziel: Wenigste Wörter bilden (nicht die meisten!)
          </li>
          <li class="flex items-start">
            <span class="text-primary-500 mr-2">•</span>
            "Scrabster": Alle Buchstaben verwenden = Sofort-Sieg!
          </li>
          <li class="flex items-start">
            <span class="text-primary-500 mr-2">•</span>
            Nutze die Spracheingabe für bessere Performance
          </li>
        </ul>
      </div>

      <!-- Difficulty Levels -->
      <div
        class="mt-6 bg-white rounded-lg p-6 shadow-sm border border-gray-200"
      >
        <h3 class="text-lg font-semibold text-gray-900 mb-4">
          Schwierigkeitsstufen
        </h3>
        <div class="grid grid-cols-1 gap-4">
          <div
            class="flex items-center justify-between p-3 bg-green-50 rounded-lg"
          >
            <div>
              <span class="font-medium text-green-800">Leicht</span>
              <p class="text-sm text-green-600">9 Buchstaben, 120 Sekunden</p>
            </div>
            <span class="text-green-600 font-bold">🟢</span>
          </div>
          <div
            class="flex items-center justify-between p-3 bg-yellow-50 rounded-lg"
          >
            <div>
              <span class="font-medium text-yellow-800">Mittel</span>
              <p class="text-sm text-yellow-600">8 Buchstaben, 90 Sekunden</p>
            </div>
            <span class="text-yellow-600 font-bold">🟡</span>
          </div>
          <div
            class="flex items-center justify-between p-3 bg-red-50 rounded-lg"
          >
            <div>
              <span class="font-medium text-red-800">Schwer</span>
              <p class="text-sm text-red-600">7 Buchstaben, 60 Sekunden</p>
            </div>
            <span class="text-red-600 font-bold">🔴</span>
          </div>
        </div>
      </div>

      <!-- Footer Links -->
      <div class="mt-8 text-center">
        <button
          @click="handleShowImprint"
          class="text-sm text-gray-500 hover:text-gray-700 px-3 py-1 rounded-md hover:bg-gray-100 transition-colors duration-200"
        >
          📄 Impressum
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const emit = defineEmits(['login', 'showImprint']);

const username = ref('');

const handleLogin = () => {
  if (username.value.trim()) {
    // Save username to localStorage
    localStorage.setItem('scrabster-username', username.value.trim());
    emit('login', username.value.trim());
  }
};

const handleShowImprint = () => {
  emit('showImprint');
};
</script>
