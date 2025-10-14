import type { SoundType } from '@/types';

// Sound Service für Spiel-Effekte
class SoundService {
  private sounds: Map<string, HTMLAudioElement> = new Map();
  private enabled: boolean = true;
  private volume: number = 0.7;

  // Sound aktivieren/deaktivieren
  setEnabled(enabled: boolean): void {
    this.enabled = enabled;
  }

  // Lautstärke setzen
  setVolume(volume: number): void {
    this.volume = Math.max(0, Math.min(1, volume));
  }

  // Sound laden
  loadSound(name: string, url: string): void {
    if (typeof Audio !== 'undefined') {
      const audio = new Audio(url);
      audio.volume = this.volume;
      this.sounds.set(name, audio);
    }
  }

  // Sound abspielen
  playSound(name: string): void {
    if (!this.enabled) return;

    const sound = this.sounds.get(name);
    if (sound) {
      // Sound zurückspulen und abspielen
      sound.currentTime = 0;
      sound.play().catch((error: Error) => {
        console.log('Sound konnte nicht abgespielt werden:', error);
      });
    }
  }

  // Scrabster-Sound (temporär mit Web Audio API)
  playScrabsterSound(): void {
    if (!this.enabled) return;

    try {
      // Web Audio API für Scrabster-Sound
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      const audioContext = new AudioContext();

      // Erstelle einen kurzen, aufsteigenden Ton
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      // Ton-Frequenz (aufsteigend)
      oscillator.frequency.setValueAtTime(440, audioContext.currentTime); // A4
      oscillator.frequency.exponentialRampToValueAtTime(
        880,
        audioContext.currentTime + 0.2
      ); // A5

      // Lautstärke
      gainNode.gain.setValueAtTime(0, audioContext.currentTime);
      gainNode.gain.linearRampToValueAtTime(
        this.volume * 0.3,
        audioContext.currentTime + 0.05
      );
      gainNode.gain.exponentialRampToValueAtTime(
        0.001,
        audioContext.currentTime + 0.3
      );

      // Ton abspielen
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.3);
    } catch (error) {
      console.log('Scrabster-Sound konnte nicht abgespielt werden:', error);
    }
  }

  // Gewinner-Sound (temporär mit Web Audio API)
  playWinnerSound(): void {
    if (!this.enabled) return;

    try {
      // Web Audio API für Gewinner-Sound
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      const audioContext = new AudioContext();

      // Erstelle einen triumphalen Ton
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      // Ton-Frequenz (triumphal)
      oscillator.frequency.setValueAtTime(523.25, audioContext.currentTime); // C5
      oscillator.frequency.setValueAtTime(
        659.25,
        audioContext.currentTime + 0.1
      ); // E5
      oscillator.frequency.setValueAtTime(
        783.99,
        audioContext.currentTime + 0.2
      ); // G5

      // Lautstärke
      gainNode.gain.setValueAtTime(0, audioContext.currentTime);
      gainNode.gain.linearRampToValueAtTime(
        this.volume * 0.4,
        audioContext.currentTime + 0.05
      );
      gainNode.gain.exponentialRampToValueAtTime(
        0.001,
        audioContext.currentTime + 0.5
      );

      // Ton abspielen
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.5);
    } catch (error) {
      console.log('Gewinner-Sound konnte nicht abgespielt werden:', error);
    }
  }

  // Wort-Submit-Sound (kurzer Klick)
  playWordSubmitSound(): void {
    if (!this.enabled) return;

    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      const audioContext = new AudioContext();

      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
      gainNode.gain.setValueAtTime(0, audioContext.currentTime);
      gainNode.gain.linearRampToValueAtTime(
        this.volume * 0.1,
        audioContext.currentTime + 0.01
      );
      gainNode.gain.exponentialRampToValueAtTime(
        0.001,
        audioContext.currentTime + 0.1
      );

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.1);
    } catch (error) {
      console.log('Wort-Submit-Sound konnte nicht abgespielt werden:', error);
    }
  }
}

// Singleton-Instanz
const soundService = new SoundService();

export default soundService;
