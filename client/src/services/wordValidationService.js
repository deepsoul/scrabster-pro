// Wort-Validierungs-Service für deutsche Wörter
class WordValidationService {
  constructor() {
    this.cache = new Map(); // Cache für bereits validierte Wörter
    this.apiUrl = 'https://api.dictionaryapi.dev/api/v2/entries/de'; // Kostenlose API
    this.isEnabled = true; // Kann deaktiviert werden falls API nicht verfügbar
    
    // Lokale Wortliste für häufige deutsche Wörter als Fallback
    this.commonGermanWords = new Set([
      'haus', 'auto', 'hund', 'katze', 'baum', 'wasser', 'feuer', 'erde', 'luft',
      'mensch', 'kind', 'frau', 'mann', 'mutter', 'vater', 'sohn', 'tochter',
      'freund', 'liebe', 'zeit', 'tag', 'nacht', 'jahr', 'monat', 'woche',
      'schule', 'arbeit', 'spiel', 'buch', 'musik', 'film', 'computer', 'telefon',
      'essen', 'trinken', 'schlafen', 'gehen', 'laufen', 'fahren', 'fliegen',
      'rot', 'blau', 'grün', 'gelb', 'schwarz', 'weiß', 'groß', 'klein', 'neu', 'alt',
      'gut', 'schlecht', 'schön', 'hässlich', 'schnell', 'langsam', 'teuer', 'billig',
      'stadt', 'land', 'berg', 'see', 'fluss', 'wald', 'wiese', 'strand',
      'wetter', 'sonne', 'regen', 'schnee', 'wind', 'wolke', 'himmel',
      'frühling', 'sommer', 'herbst', 'winter', 'morgen', 'abend', 'mitternacht',
      'montag', 'dienstag', 'mittwoch', 'donnerstag', 'freitag', 'samstag', 'sonntag',
      'januar', 'februar', 'märz', 'april', 'mai', 'juni', 'juli', 'august',
      'september', 'oktober', 'november', 'dezember',
      'eins', 'zwei', 'drei', 'vier', 'fünf', 'sechs', 'sieben', 'acht', 'neun', 'zehn',
      'hundert', 'tausend', 'million', 'milliarde',
      'und', 'oder', 'aber', 'weil', 'wenn', 'dann', 'auch', 'nur', 'nicht', 'kein',
      'ich', 'du', 'er', 'sie', 'es', 'wir', 'ihr', 'sie', 'mein', 'dein', 'sein',
      'haben', 'sein', 'werden', 'können', 'müssen', 'sollen', 'wollen', 'dürfen',
      'machen', 'kommen', 'gehen', 'sehen', 'hören', 'sprechen', 'denken', 'wissen',
      'lachen', 'weinen', 'singen', 'tanzen', 'spielen', 'arbeiten', 'lernen',
      'tisch', 'stuhl', 'bett', 'fenster', 'tür', 'wand', 'decke', 'boden',
      'kleidung', 'hemd', 'hose', 'schuh', 'hut', 'handschuh', 'schal',
      'nahrung', 'brot', 'fleisch', 'fisch', 'gemüse', 'obst', 'milch', 'wasser',
      'kuchen', 'eis', 'schokolade', 'bonbon', 'zucker', 'salz', 'pfeffer',
      'krank', 'gesund', 'arzt', 'krankenhaus', 'medizin', 'tablette', 'spritze',
      'sport', 'fußball', 'tennis', 'schwimmen', 'radfahren', 'laufen', 'springen',
      'reise', 'urlaub', 'hotel', 'restaurant', 'museum', 'theater', 'kino',
      'geld', 'euro', 'dollar', 'cent', 'kaufen', 'verkaufen', 'preis', 'kosten',
      'lack', 'roller', 'fahrrad', 'motorrad', 'bus', 'zug', 'flugzeug', 'schiff',
      'straße', 'weg', 'brücke', 'tunnel', 'park', 'platz', 'garten', 'hof'
    ]);
  }

  // Service aktivieren/deaktivieren
  setEnabled(enabled) {
    this.isEnabled = enabled;
  }

  // Wort validieren
  async validateWord(word) {
    if (!this.isEnabled) {
      return { isValid: true, reason: 'Validation disabled' };
    }

    const cleanWord = word.trim().toLowerCase();

    // Mindestlänge prüfen
    if (cleanWord.length < 2) {
      return {
        isValid: false,
        reason: 'Wort zu kurz (mindestens 2 Buchstaben)',
      };
    }

    // Nur Buchstaben erlauben
    if (!/^[a-zäöüß]+$/i.test(cleanWord)) {
      return { isValid: false, reason: 'Nur Buchstaben erlaubt' };
    }

    // Cache prüfen
    if (this.cache.has(cleanWord)) {
      return this.cache.get(cleanWord);
    }

    // Zuerst lokale Wortliste prüfen
    if (this.commonGermanWords.has(cleanWord)) {
      const result = {
        isValid: true,
        reason: 'Gültiges deutsches Wort',
        word: cleanWord,
        source: 'local'
      };
      this.cache.set(cleanWord, result);
      return result;
    }

    try {
      // API-Aufruf
      const response = await fetch(
        `${this.apiUrl}/${encodeURIComponent(cleanWord)}`
      );

      if (response.ok) {
        const data = await response.json();
        const result = {
          isValid: true,
          reason: 'Gültiges deutsches Wort',
          word: cleanWord,
          definitions: data[0]?.meanings || [],
          source: 'api'
        };
        this.cache.set(cleanWord, result);
        return result;
      } else if (response.status === 404) {
        // Wort nicht in API gefunden - als "unsicher" markieren, aber erlauben
        const result = {
          isValid: false,
          reason: 'Wort nicht im Wörterbuch gefunden (kann trotzdem gesendet werden)',
          word: cleanWord,
          source: 'api_not_found'
        };
        this.cache.set(cleanWord, result);
        return result;
      } else {
        // API-Fehler - Wort als gültig annehmen
        const result = {
          isValid: true,
          reason: 'API-Fehler - Wort akzeptiert',
          word: cleanWord,
          source: 'api_error'
        };
        this.cache.set(cleanWord, result);
        return result;
      }
    } catch (error) {
      console.warn('Wort-Validierung fehlgeschlagen:', error);
      // Bei Netzwerk-Fehlern Wort als gültig annehmen
      const result = {
        isValid: true,
        reason: 'Netzwerk-Fehler - Wort akzeptiert',
        word: cleanWord,
        source: 'network_error'
      };
      this.cache.set(cleanWord, result);
      return result;
    }
  }

  // Mehrere Wörter validieren
  async validateWords(words) {
    const results = [];
    for (const word of words) {
      const result = await this.validateWord(word);
      results.push({ word, ...result });
    }
    return results;
  }

  // Cache leeren
  clearCache() {
    this.cache.clear();
  }

  // Cache-Statistiken
  getCacheStats() {
    return {
      size: this.cache.size,
      entries: Array.from(this.cache.entries()),
    };
  }
}

// Singleton-Instanz
const wordValidationService = new WordValidationService();

export default wordValidationService;
