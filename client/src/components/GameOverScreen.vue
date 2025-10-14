<template>
  <div class="max-w-4xl mx-auto">
    <div class="bg-white rounded-xl shadow-2xl p-8 border border-gray-200">
      <!-- Header -->
      <div class="text-center mb-8">
        <div v-if="gameResult.reason === 'scrabster'" class="mb-6">
          <div
            class="mx-auto h-20 w-20 bg-yellow-500 rounded-full flex items-center justify-center mb-4"
          >
            <span class="text-3xl">⚡</span>
          </div>
          <h1 class="text-4xl font-bold text-yellow-600 mb-2">SCRABSTER!</h1>
          <p class="text-xl text-gray-600">
            {{ gameResult.winners[0].username }} hat alle Buchstaben verwendet!
          </p>
          <div class="mt-4 bg-yellow-100 rounded-lg p-4">
            <span class="text-2xl font-bold text-yellow-800 font-mono">
              "{{ gameResult.scrabsterWord }}"
            </span>
          </div>
        </div>

        <div v-else class="mb-6">
          <div
            class="mx-auto h-20 w-20 bg-primary-500 rounded-full flex items-center justify-center mb-4"
          >
            <span class="text-3xl">🏆</span>
          </div>
          <h1 class="text-4xl font-bold text-primary-600 mb-2">
            Spiel beendet!
          </h1>
          <p class="text-xl text-gray-600">Zeit ist abgelaufen</p>
        </div>
      </div>

      <!-- Winners -->
      <div class="mb-8">
        <h2 class="text-2xl font-bold text-gray-900 mb-6 text-center">
          {{ gameResult.winners.length === 1 ? 'Gewinner' : 'Gewinner' }}
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div
            v-for="(winner, index) in gameResult.winners"
            :key="winner.id"
            class="bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-xl p-6 text-center text-white shadow-lg"
          >
            <div class="text-4xl mb-2">
              {{ index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉' }}
            </div>
            <div class="text-2xl font-bold mb-2">{{ winner.username }}</div>
            <div class="text-lg">{{ winner.words.length }} Wörter</div>
            <div class="text-xl font-bold text-yellow-200">
              {{ winner.score }} Punkte
            </div>
            <div
              v-if="gameResult.reason === 'scrabster'"
              class="text-sm mt-2 bg-yellow-600 rounded px-2 py-1"
            >
              +2 Bonus für Scrabster!
            </div>
          </div>
        </div>
      </div>

      <!-- All Players Results -->
      <div class="mb-8">
        <h2 class="text-2xl font-bold text-gray-900 mb-6 text-center">
          Alle Spieler
        </h2>
        <div class="space-y-3">
          <div
            v-for="(player, index) in sortedPlayers"
            :key="player.id"
            class="flex items-center justify-between p-4 rounded-lg border-2"
            :class="
              gameResult.winners.some(w => w.id === player.id)
                ? 'border-yellow-400 bg-yellow-50'
                : 'border-gray-200 bg-gray-50'
            "
          >
            <div class="flex items-center space-x-4">
              <div class="text-2xl">
                {{
                  index + 1 === 1
                    ? '🥇'
                    : index + 1 === 2
                    ? '🥈'
                    : index + 1 === 3
                    ? '🥉'
                    : `${index + 1}.`
                }}
              </div>
              <div>
                <div class="font-semibold text-gray-900">
                  {{ player.username }}
                </div>
                <div class="text-sm text-gray-600">
                  {{ player.words.length }} Wörter
                  <span
                    v-if="
                      gameResult.reason === 'scrabster' &&
                      gameResult.winners.some(w => w.id === player.id)
                    "
                    class="text-yellow-600 font-bold"
                  >
                    (+2 Scrabster Bonus)
                  </span>
                </div>
                <div class="text-xs text-gray-500">
                  {{ player.score }} Punkte
                </div>
              </div>
            </div>
            <div class="text-right">
              <div class="text-2xl font-bold text-primary-600">
                {{ player.score }}
              </div>
              <div class="text-xs text-gray-500">Punkte</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Word Lists -->
      <div class="mb-8">
        <h2 class="text-2xl font-bold text-gray-900 mb-6 text-center">
          Alle gefundenen Wörter
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div
            v-for="player in gameResult.players"
            :key="player.id"
            class="bg-gray-50 rounded-lg p-4"
          >
            <h3 class="font-semibold text-gray-900 mb-3">
              {{ player.username }}
            </h3>
            <div v-if="player.words.length === 0" class="text-gray-500 text-sm">
              Keine Wörter gefunden
            </div>
            <div v-else class="grid grid-cols-2 gap-1">
              <div
                v-for="word in player.words"
                :key="word"
                class="bg-white rounded px-2 py-1 text-sm text-center border"
              >
                {{ word }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Game Statistics -->
      <div class="mb-8 bg-gray-50 rounded-lg p-6">
        <h2 class="text-xl font-bold text-gray-900 mb-4 text-center">
          Spielstatistiken
        </h2>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <div class="text-2xl font-bold text-primary-600">
              {{ gameResult.players.length }}
            </div>
            <div class="text-sm text-gray-600">Spieler</div>
          </div>
          <div>
            <div class="text-2xl font-bold text-primary-600">
              {{ totalWords }}
            </div>
            <div class="text-sm text-gray-600">Wörter gesamt</div>
          </div>
          <div>
            <div class="text-2xl font-bold text-primary-600">
              {{ averageWords }}
            </div>
            <div class="text-sm text-gray-600">Ø pro Spieler</div>
          </div>
          <div>
            <div class="text-2xl font-bold text-primary-600">
              {{ longestWord }}
            </div>
            <div class="text-sm text-gray-600">Längstes Wort</div>
          </div>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="flex flex-col sm:flex-row gap-4 justify-center">
        <button @click="playAgain" class="btn-success text-lg py-4 px-8">
          Nochmal spielen
        </button>
        <button @click="backToLobby" class="btn-primary text-lg py-4 px-8">
          Zur Lobby
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  gameResult: Object,
});

const emit = defineEmits(['playAgain', 'backToLobby']);

// Computed properties
const sortedPlayers = computed(() => {
  return [...props.gameResult.players].sort(
    (a, b) => b.score - a.score // Nach Punkten sortieren (höchste zuerst)
  );
});

const totalWords = computed(() => {
  return props.gameResult.players.reduce(
    (total, player) => total + player.words.length,
    0
  );
});

const averageWords = computed(() => {
  if (props.gameResult.players.length === 0) return 0;
  return (
    Math.round((totalWords.value / props.gameResult.players.length) * 10) / 10
  );
});

const longestWord = computed(() => {
  let longest = 0;
  props.gameResult.players.forEach(player => {
    player.words.forEach(word => {
      if (word.length > longest) {
        longest = word.length;
      }
    });
  });
  return longest;
});

// Methods
const playAgain = () => {
  emit('playAgain');
};

const backToLobby = () => {
  emit('backToLobby');
};
</script>
