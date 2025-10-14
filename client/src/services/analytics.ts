import type { DifficultyLevel } from '@/types';

// Google Analytics Service
class AnalyticsService {
  private readonly gaId: string = 'G-L4337T86WQ';
  private isEnabled: boolean = false;
  private isLoaded: boolean = false;

  // Initialize Google Analytics
  init(): void {
    // Check if analytics is enabled
    const consent = localStorage.getItem('scrabster-analytics-consent');
    this.isEnabled = consent === 'true';

    if (this.isEnabled) {
      this.loadGoogleAnalytics();
    }
  }

  // Load Google Analytics script
  private loadGoogleAnalytics(): void {
    if (this.isLoaded) return;

    // Load gtag script
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${this.gaId}`;
    document.head.appendChild(script);

    // Initialize gtag
    (window as any).dataLayer = (window as any).dataLayer || [];
    function gtag(...args: any[]): void {
      (window as any).dataLayer.push(args);
    }
    (window as any).gtag = gtag;
    gtag('js', new Date());
    gtag('config', this.gaId, {
      anonymize_ip: true,
      cookie_flags: 'SameSite=None;Secure',
    });

    this.isLoaded = true;
    console.log('Google Analytics loaded');
  }

  // Enable analytics
  enable(): void {
    this.isEnabled = true;
    localStorage.setItem('scrabster-analytics-consent', 'true');
    this.loadGoogleAnalytics();
  }

  // Disable analytics
  disable(): void {
    this.isEnabled = false;
    localStorage.setItem('scrabster-analytics-consent', 'false');

    // Clear existing data
    if ((window as any).gtag) {
      (window as any).gtag('config', this.gaId, {
        send_page_view: false,
      });
    }
  }

  // Track page view
  trackPageView(pagePath: string): void {
    if (!this.isEnabled || !(window as any).gtag) return;

    (window as any).gtag('config', this.gaId, {
      page_path: pagePath,
    });
  }

  // Track custom event
  trackEvent(eventName: string, parameters: Record<string, any> = {}): void {
    if (!this.isEnabled || !(window as any).gtag) return;

    (window as any).gtag('event', eventName, parameters);
  }

  // Track game events
  trackGameCreated(difficulty: DifficultyLevel): void {
    this.trackEvent('game_created', {
      game_difficulty: difficulty,
      event_category: 'game',
    });
  }

  trackGameJoined(): void {
    this.trackEvent('game_joined', {
      event_category: 'game',
    });
  }

  trackGameStarted(difficulty: DifficultyLevel, playerCount: number): void {
    this.trackEvent('game_started', {
      game_difficulty: difficulty,
      player_count: playerCount,
      event_category: 'game',
    });
  }

  trackWordSubmitted(wordLength: number, score: number): void {
    this.trackEvent('word_submitted', {
      word_length: wordLength,
      score: score,
      event_category: 'gameplay',
    });
  }

  trackGameFinished(finalScore: number, gameDuration: number): void {
    this.trackEvent('game_finished', {
      final_score: finalScore,
      game_duration: gameDuration,
      event_category: 'game',
    });
  }

  trackInstructionsViewed(): void {
    this.trackEvent('instructions_viewed', {
      event_category: 'navigation',
    });
  }

  trackImprintViewed(): void {
    this.trackEvent('imprint_viewed', {
      event_category: 'navigation',
    });
  }

  // Check if analytics is enabled
  isAnalyticsEnabled(): boolean {
    return this.isEnabled;
  }
}

// Create singleton instance
const analytics = new AnalyticsService();

export default analytics;
