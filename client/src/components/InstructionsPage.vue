<template>
  <div class="max-w-4xl mx-auto px-4 py-8">
    <!-- Header -->
    <div class="text-center mb-12">
      <h1 class="text-4xl font-bold text-gray-900 mb-4 font-display">
        🎮 Scrabster Pro
      </h1>
      <p class="text-xl text-gray-600 font-sans">
        Das ultimative Multiplayer-Wortspiel
      </p>
    </div>

    <!-- Navigation -->
    <div class="flex justify-center mb-8">
      <button
        @click="$emit('backToGame')"
        class="btn-primary px-6 py-3 text-lg"
      >
        ← Zurück zum Spiel
      </button>
    </div>

    <!-- Instructions Content -->
    <div class="space-y-8">
      <!-- Ziel des Spiels -->
      <div class="bg-white rounded-xl shadow-lg p-8 border border-gray-200">
        <div class="flex items-center mb-6">
          <div
            class="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mr-4"
          >
            <span class="text-2xl">🎯</span>
          </div>
          <h2 class="text-2xl font-bold text-gray-900 font-display">
            Ziel des Spiels
          </h2>
        </div>
        <p class="text-lg text-gray-700 leading-relaxed">
          Bilde so viele Wörter wie möglich aus den verfügbaren Buchstaben und
          sammle dabei Punkte. Der Spieler mit den meisten Punkten gewinnt!
        </p>
      </div>

      <!-- Spielablauf -->
      <div class="bg-white rounded-xl shadow-lg p-8 border border-gray-200">
        <div class="flex items-center mb-6">
          <div
            class="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-4"
          >
            <span class="text-2xl">🚀</span>
          </div>
          <h2 class="text-2xl font-bold text-gray-900 font-display">
            Spielablauf
          </h2>
        </div>

        <div class="grid md:grid-cols-2 gap-6">
          <div class="space-y-4">
            <div class="flex items-start">
              <div
                class="w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3 mt-1"
              >
                1
              </div>
              <div>
                <h3 class="font-semibold text-gray-900">Spiel erstellen</h3>
                <p class="text-gray-600">
                  Wähle einen Benutzernamen und Schwierigkeitsgrad
                </p>
              </div>
            </div>

            <div class="flex items-start">
              <div
                class="w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3 mt-1"
              >
                2
              </div>
              <div>
                <h3 class="font-semibold text-gray-900">Spieler einladen</h3>
                <p class="text-gray-600">
                  Teile den Spiel-Code mit anderen Spielern
                </p>
              </div>
            </div>

            <div class="flex items-start">
              <div
                class="w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3 mt-1"
              >
                3
              </div>
              <div>
                <h3 class="font-semibold text-gray-900">Spiel starten</h3>
                <p class="text-gray-600">
                  Der Host startet das Spiel, wenn mindestens 2 Spieler da sind
                </p>
              </div>
            </div>
          </div>

          <div class="space-y-4">
            <div class="flex items-start">
              <div
                class="w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3 mt-1"
              >
                4
              </div>
              <div>
                <h3 class="font-semibold text-gray-900">Wörter bilden</h3>
                <p class="text-gray-600">
                  Bilde Wörter aus den verfügbaren Buchstaben
                </p>
              </div>
            </div>

            <div class="flex items-start">
              <div
                class="w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3 mt-1"
              >
                5
              </div>
              <div>
                <h3 class="font-semibold text-gray-900">Punkte sammeln</h3>
                <p class="text-gray-600">
                  Sammle Punkte basierend auf verwendeten Buchstaben
                </p>
              </div>
            </div>

            <div class="flex items-start">
              <div
                class="w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3 mt-1"
              >
                6
              </div>
              <div>
                <h3 class="font-semibold text-gray-900">Gewinner ermitteln</h3>
                <p class="text-gray-600">
                  Nach Ablauf der Zeit gewinnt der Spieler mit den meisten
                  Punkten
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Schwierigkeitsgrade -->
      <div class="bg-white rounded-xl shadow-lg p-8 border border-gray-200">
        <div class="flex items-center mb-6">
          <div
            class="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mr-4"
          >
            <span class="text-2xl">⚡</span>
          </div>
          <h2 class="text-2xl font-bold text-gray-900 font-display">
            Schwierigkeitsgrade
          </h2>
        </div>

        <div class="grid md:grid-cols-3 gap-6">
          <div class="text-center p-6 bg-green-50 rounded-lg">
            <div class="text-3xl mb-2">🟢</div>
            <h3 class="text-xl font-bold text-green-700 mb-2">Leicht</h3>
            <p class="text-green-600 font-semibold mb-2">12 Buchstaben</p>
            <p class="text-green-600 font-semibold mb-2">120 Sekunden</p>
            <p class="text-gray-600 text-sm">Perfekt für Anfänger</p>
          </div>

          <div class="text-center p-6 bg-yellow-50 rounded-lg">
            <div class="text-3xl mb-2">🟡</div>
            <h3 class="text-xl font-bold text-yellow-700 mb-2">Mittel</h3>
            <p class="text-yellow-600 font-semibold mb-2">10 Buchstaben</p>
            <p class="text-yellow-600 font-semibold mb-2">90 Sekunden</p>
            <p class="text-gray-600 text-sm">Ausgewogene Herausforderung</p>
          </div>

          <div class="text-center p-6 bg-red-50 rounded-lg">
            <div class="text-3xl mb-2">🔴</div>
            <h3 class="text-xl font-bold text-red-700 mb-2">Schwer</h3>
            <p class="text-red-600 font-semibold mb-2">8 Buchstaben</p>
            <p class="text-red-600 font-semibold mb-2">60 Sekunden</p>
            <p class="text-gray-600 text-sm">Für Wortspiel-Experten</p>
          </div>
        </div>
      </div>

      <!-- Punktevergabe -->
      <div class="bg-white rounded-xl shadow-lg p-8 border border-gray-200">
        <div class="flex items-center mb-6">
          <div
            class="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mr-4"
          >
            <span class="text-2xl">⭐</span>
          </div>
          <h2 class="text-2xl font-bold text-gray-900 font-display">
            Punktevergabe
          </h2>
        </div>

        <div class="space-y-4">
          <div class="flex items-center p-4 bg-gray-50 rounded-lg">
            <div
              class="w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-4"
            >
              ✓
            </div>
            <div>
              <h3 class="font-semibold text-gray-900">
                Buchstaben-basierte Punkte
              </h3>
              <p class="text-gray-600">
                Du bekommst so viele Punkte, wie Buchstaben du aus der
                verfügbaren Liste verwendest
              </p>
            </div>
          </div>

          <div class="flex items-center p-4 bg-gray-50 rounded-lg">
            <div
              class="w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-4"
            >
              ✓
            </div>
            <div>
              <h3 class="font-semibold text-gray-900">
                Mindestens 1 Punkt pro Wort
              </h3>
              <p class="text-gray-600">
                Auch kurze Wörter bringen mindestens 1 Punkt
              </p>
            </div>
          </div>

          <div class="flex items-center p-4 bg-gray-50 rounded-lg">
            <div
              class="w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-4"
            >
              ✓
            </div>
            <div>
              <h3 class="font-semibold text-gray-900">Scrabster-Bonus</h3>
              <p class="text-gray-600">
                Verwendest du alle verfügbaren Buchstaben in einem Wort,
                bekommst du +2 Bonus-Punkte
              </p>
            </div>
          </div>
        </div>

        <div class="mt-6 p-4 bg-primary-50 rounded-lg">
          <h4 class="font-semibold text-primary-900 mb-2">Beispiel:</h4>
          <p class="text-primary-800">
            Verfügbare Buchstaben:
            <span class="font-mono bg-white px-2 py-1 rounded">
              A, A, B, C, D, E
            </span>
            <br />
            Wort "ABBA" verwendet: A, B, B, A =
            <span class="font-bold text-primary-600">4 Punkte</span>
            <br />
            Wort "CAT" verwendet: C, A, T =
            <span class="font-bold text-primary-600">2 Punkte</span>
            (T nicht verfügbar)
          </p>
        </div>
      </div>

      <!-- Tipps & Tricks -->
      <div class="bg-white rounded-xl shadow-lg p-8 border border-gray-200">
        <div class="flex items-center mb-6">
          <div
            class="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4"
          >
            <span class="text-2xl">💡</span>
          </div>
          <h2 class="text-2xl font-bold text-gray-900 font-display">
            Tipps & Tricks
          </h2>
        </div>

        <div class="grid md:grid-cols-2 gap-6">
          <div class="space-y-4">
            <div class="flex items-start">
              <div
                class="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-sm font-bold mr-3 mt-1"
              >
                💡
              </div>
              <div>
                <h3 class="font-semibold text-gray-900">
                  Häufige Buchstaben nutzen
                </h3>
                <p class="text-gray-600">
                  Verwende Buchstaben, die mehrfach vorhanden sind, um mehr
                  Punkte zu sammeln
                </p>
              </div>
            </div>

            <div class="flex items-start">
              <div
                class="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-sm font-bold mr-3 mt-1"
              >
                💡
              </div>
              <div>
                <h3 class="font-semibold text-gray-900">
                  Lange Wörter bevorzugen
                </h3>
                <p class="text-gray-600">
                  Längere Wörter bringen mehr Punkte, da sie mehr Buchstaben
                  verwenden
                </p>
              </div>
            </div>
          </div>

          <div class="space-y-4">
            <div class="flex items-start">
              <div
                class="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-sm font-bold mr-3 mt-1"
              >
                💡
              </div>
              <div>
                <h3 class="font-semibold text-gray-900">Strategisch planen</h3>
                <p class="text-gray-600">
                  Überlege, welche Buchstaben du für spätere Wörter aufheben
                  möchtest
                </p>
              </div>
            </div>

            <div class="flex items-start">
              <div
                class="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-sm font-bold mr-3 mt-1"
              >
                💡
              </div>
              <div>
                <h3 class="font-semibold text-gray-900">Scrabster anstreben</h3>
                <p class="text-gray-600">
                  Versuche, alle Buchstaben in einem Wort zu verwenden für den
                  Bonus
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Features -->
      <div class="bg-white rounded-xl shadow-lg p-8 border border-gray-200">
        <div class="flex items-center mb-6">
          <div
            class="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mr-4"
          >
            <span class="text-2xl">🎨</span>
          </div>
          <h2 class="text-2xl font-bold text-gray-900 font-display">
            Features
          </h2>
        </div>

        <div class="grid md:grid-cols-2 gap-6">
          <div class="space-y-3">
            <div class="flex items-center">
              <span class="text-green-500 mr-3">✓</span>
              <span class="text-gray-700">Echtzeit-Multiplayer</span>
            </div>
            <div class="flex items-center">
              <span class="text-green-500 mr-3">✓</span>
              <span class="text-gray-700">Sprach-Eingabe</span>
            </div>
            <div class="flex items-center">
              <span class="text-green-500 mr-3">✓</span>
              <span class="text-gray-700">Responsive Design</span>
            </div>
            <div class="flex items-center">
              <span class="text-green-500 mr-3">✓</span>
              <span class="text-gray-700">Live-Punkte-Anzeige</span>
            </div>
          </div>

          <div class="space-y-3">
            <div class="flex items-center">
              <span class="text-green-500 mr-3">✓</span>
              <span class="text-gray-700">Häufigkeits-Anzeige</span>
            </div>
            <div class="flex items-center">
              <span class="text-green-500 mr-3">✓</span>
              <span class="text-gray-700">Automatische Timer</span>
            </div>
            <div class="flex items-center">
              <span class="text-green-500 mr-3">✓</span>
              <span class="text-gray-700">Gewinner-Ermittlung</span>
            </div>
            <div class="flex items-center">
              <span class="text-green-500 mr-3">✓</span>
              <span class="text-gray-700">Mobile-optimiert</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <div class="text-center mt-12 pt-8 border-t border-gray-200">
      <p class="text-gray-600">Viel Spaß beim Spielen! 🎮</p>
    </div>
  </div>
</template>

<script setup>
defineEmits(['backToGame']);
</script>

<style scoped>
/* Zusätzliche Styles für bessere Darstellung */
.letter-tile {
  @apply w-12 h-12 bg-primary-100 text-primary-800 rounded-lg flex items-center justify-center font-bold text-lg shadow-sm;
}

.letter-tile.highlighted {
  @apply bg-primary-500 text-white transform scale-110;
}
</style>
