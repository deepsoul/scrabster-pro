<template>
  <div class="max-w-4xl mx-auto px-4 py-8">
    <!-- Header -->
    <div class="text-center mb-12">
      <h1 class="text-4xl font-bold text-gray-900 mb-4 font-display">📄 Impressum</h1>
      <p class="text-xl text-gray-600 font-sans">Rechtliche Informationen</p>
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

    <!-- Impressum Content -->
    <div class="space-y-8">
      <!-- Angaben nach § 5 TMG -->
      <div class="bg-white rounded-xl shadow-lg p-8 border border-gray-200">
         <h2 class="text-2xl font-bold text-gray-900 mb-6 font-display">
           Angaben nach § 5 TMG
         </h2>

        <div class="space-y-4">
          <div>
            <h3 class="text-lg font-semibold text-gray-800 mb-2">Anbieter</h3>
            <p class="text-gray-700">
              Scrabster Pro
              <br />
              Ein Multiplayer-Wortspiel
            </p>
          </div>

          <div>
            <h3 class="text-lg font-semibold text-gray-800 mb-2">Entwickler</h3>
            <p class="text-gray-700">
              Boris Horn
              <br />
              Software-Entwickler
            </p>
          </div>

          <div>
            <h3 class="text-lg font-semibold text-gray-800 mb-2">Kontakt</h3>
            <p class="text-gray-700">
              E-Mail:
              <a
                href="mailto:info@scrabster-pro.com"
                class="text-primary-600 hover:text-primary-800"
              >
                info@scrabster-pro.com
              </a>
              <br />
              Website:
              <a
                href="https://scrabster-pro.vercel.app"
                class="text-primary-600 hover:text-primary-800"
              >
                scrabster-pro.vercel.app
              </a>
            </p>
          </div>
        </div>
      </div>

      <!-- Haftungsausschluss -->
      <div class="bg-white rounded-xl shadow-lg p-8 border border-gray-200">
         <h2 class="text-2xl font-bold text-gray-900 mb-6 font-display">
           Haftungsausschluss
         </h2>

        <div class="space-y-6">
          <div>
            <h3 class="text-lg font-semibold text-gray-800 mb-3">
              Haftung für Inhalte
            </h3>
            <p class="text-gray-700 leading-relaxed">
              Als Diensteanbieter sind wir gemäß § 7 Abs.1 TMG für eigene
              Inhalte auf diesen Seiten nach den allgemeinen Gesetzen
              verantwortlich. Nach §§ 8 bis 10 TMG sind wir als Diensteanbieter
              jedoch nicht unter der Verpflichtung, übermittelte oder
              gespeicherte fremde Informationen zu überwachen oder nach
              Umständen zu forschen, die auf eine rechtswidrige Tätigkeit
              hinweisen.
            </p>
          </div>

          <div>
            <h3 class="text-lg font-semibold text-gray-800 mb-3">
              Haftung für Links
            </h3>
            <p class="text-gray-700 leading-relaxed">
              Unser Angebot enthält Links zu externen Websites Dritter, auf
              deren Inhalte wir keinen Einfluss haben. Deshalb können wir für
              diese fremden Inhalte auch keine Gewähr übernehmen. Für die
              Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter
              oder Betreiber der Seiten verantwortlich.
            </p>
          </div>

          <div>
            <h3 class="text-lg font-semibold text-gray-800 mb-3">
              Urheberrecht
            </h3>
            <p class="text-gray-700 leading-relaxed">
              Die durch die Seitenbetreiber erstellten Inhalte und Werke auf
              diesen Seiten unterliegen dem deutschen Urheberrecht. Die
              Vervielfältigung, Bearbeitung, Verbreitung und jede Art der
              Verwertung außerhalb der Grenzen des Urheberrechtes bedürfen der
              schriftlichen Zustimmung des jeweiligen Autors bzw. Erstellers.
            </p>
          </div>
        </div>
      </div>

      <!-- Datenschutz -->
      <div class="bg-white rounded-xl shadow-lg p-8 border border-gray-200">
        <h2 class="text-2xl font-bold text-gray-900 mb-6 font-display">Datenschutz</h2>

        <div class="space-y-6">
          <div>
            <h3 class="text-lg font-semibold text-gray-800 mb-3">
              Datenerhebung und -verwendung
            </h3>
            <p class="text-gray-700 leading-relaxed">
              Diese Anwendung erhebt und verarbeitet nur die für die
              Spielteilnahme notwendigen Daten. Benutzernamen und Spielstände
              werden temporär gespeichert und nach Beendigung des Spiels
              gelöscht.
            </p>
          </div>

          <div>
            <h3 class="text-lg font-semibold text-gray-800 mb-3">
              Cookies und Tracking
            </h3>
            <p class="text-gray-700 leading-relaxed">
              Diese Anwendung verwendet keine Cookies oder
              Tracking-Technologien. Alle Daten werden lokal im Browser
              gespeichert und nicht an Dritte übertragen.
            </p>
          </div>

          <div>
            <h3 class="text-lg font-semibold text-gray-800 mb-3">
              Sprach-Eingabe
            </h3>
            <p class="text-gray-700 leading-relaxed">
              Die Sprach-Eingabe-Funktion verwendet die Web Speech API des
              Browsers. Die Audio-Daten werden nicht an unsere Server
              übertragen, sondern lokal im Browser verarbeitet.
            </p>
          </div>
        </div>
      </div>

      <!-- Technische Informationen -->
      <div class="bg-white rounded-xl shadow-lg p-8 border border-gray-200">
         <h2 class="text-2xl font-bold text-gray-900 mb-6 font-display">
           Technische Informationen
         </h2>

        <div class="space-y-4">
          <div>
            <h3 class="text-lg font-semibold text-gray-800 mb-2">
              Technologie
            </h3>
            <p class="text-gray-700">
              Frontend: Vue.js 3, Vite, Tailwind CSS
              <br />
              Backend: Node.js, Express.js
              <br />
              Hosting: Vercel (Frontend), Render (Backend)
            </p>
          </div>

          <div>
            <h3 class="text-lg font-semibold text-gray-800 mb-2">
              Browser-Unterstützung
            </h3>
            <p class="text-gray-700">
              Chrome, Firefox, Safari, Edge (aktuelle Versionen)
              <br />
              Mobile Browser werden unterstützt
            </p>
          </div>

          <div>
            <h3 class="text-lg font-semibold text-gray-800 mb-2">
              Open Source
            </h3>
            <p class="text-gray-700">
              Diese Anwendung ist Open Source und auf GitHub verfügbar.
              <br />
              Repository:
              <a
                href="https://github.com/deepsoul/scrabster-pro"
                class="text-primary-600 hover:text-primary-800"
              >
                github.com/deepsoul/scrabster-pro
              </a>
            </p>
          </div>
        </div>
      </div>

      <!-- Spielregeln -->
      <div class="bg-white rounded-xl shadow-lg p-8 border border-gray-200">
         <h2 class="text-2xl font-bold text-gray-900 mb-6 font-display">
           Spielregeln & Nutzungsbedingungen
         </h2>

        <div class="space-y-4">
          <div>
            <h3 class="text-lg font-semibold text-gray-800 mb-2">Nutzung</h3>
            <p class="text-gray-700">
              Diese Anwendung ist kostenlos und für den privaten Gebrauch
              bestimmt. Eine kommerzielle Nutzung ist nicht gestattet.
            </p>
          </div>

          <div>
            <h3 class="text-lg font-semibold text-gray-800 mb-2">Verhalten</h3>
            <p class="text-gray-700">
              Benutzer verpflichten sich, respektvoll miteinander umzugehen und
              keine unangemessenen Inhalte zu verwenden.
            </p>
          </div>

          <div>
            <h3 class="text-lg font-semibold text-gray-800 mb-2">
              Verfügbarkeit
            </h3>
            <p class="text-gray-700">
              Wir bemühen uns um eine hohe Verfügbarkeit, können aber keine
              Garantie für eine unterbrechungsfreie Nutzung geben.
            </p>
          </div>
        </div>
      </div>

      <!-- Kontakt -->
      <div class="bg-white rounded-xl shadow-lg p-8 border border-gray-200">
        <h2 class="text-2xl font-bold text-gray-900 mb-6 font-display">Kontakt & Support</h2>

        <div class="space-y-4">
          <div>
            <h3 class="text-lg font-semibold text-gray-800 mb-2">Support</h3>
            <p class="text-gray-700">
              Bei Fragen oder Problemen wenden Sie sich gerne an uns:
              <br />
              E-Mail:
              <a
                href="mailto:support@scrabster-pro.com"
                class="text-primary-600 hover:text-primary-800"
              >
                support@scrabster-pro.com
              </a>
            </p>
          </div>

          <div>
            <h3 class="text-lg font-semibold text-gray-800 mb-2">Feedback</h3>
            <p class="text-gray-700">
              Wir freuen uns über Ihr Feedback und Ihre Vorschläge zur
              Verbesserung der Anwendung.
            </p>
          </div>

          <div>
            <h3 class="text-lg font-semibold text-gray-800 mb-2">
              Bug-Reports
            </h3>
            <p class="text-gray-700">
              Fehler können über GitHub Issues gemeldet werden:
              <br />
              <a
                href="https://github.com/deepsoul/scrabster-pro/issues"
                class="text-primary-600 hover:text-primary-800"
              >
                github.com/deepsoul/scrabster-pro/issues
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <div class="text-center mt-12 pt-8 border-t border-gray-200">
      <p class="text-gray-600">
        Stand: {{ currentDate }} | Scrabster Pro v1.0.0
      </p>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

defineEmits(['backToGame']);

const currentDate = computed(() => {
  return new Date().toLocaleDateString('de-DE', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
});
</script>

<style scoped>
/* Zusätzliche Styles für bessere Darstellung */
a {
  @apply transition-colors duration-200;
}
</style>
