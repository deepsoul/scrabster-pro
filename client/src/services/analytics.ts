// Google Analytics Service
class AnalyticsService {
  constructor() {
    this.gaId = 'G-L4337T86WQ';
    this.isEnabled = false;
    this.isLoaded = false;
  }

  // Initialize Google Analytics
  init() {
    // Check if analytics is enabled
    const consent = localStorage.getItem('scrabster-analytics-consent');
    this.isEnabled = consent === 'true';

    if (this.isEnabled) {
      this.loadGoogleAnalytics();
    }
  }

  // Load Google Analytics script
  loadGoogleAnalytics() {
    if (this.isLoaded) return;

    // Load gtag script
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${this.gaId}`;
    document.head.appendChild(script);

    // Initialize gtag
    window.dataLayer = window.dataLayer || [];
    function gtag() {
      dataLayer.push(arguments);
    }
    window.gtag = gtag;
    gtag('js', new Date());
    gtag('config', this.gaId, {
      anonymize_ip: true,
      cookie_flags: 'SameSite=None;Secure',
    });

    this.isLoaded = true;
    console.log('Google Analytics loaded');
  }

  // Enable analytics
  enable() {
    this.isEnabled = true;
    localStorage.setItem('scrabster-analytics-consent', 'true');
    this.loadGoogleAnalytics();
  }

  // Disable analytics
  disable() {
    this.isEnabled = false;
    localStorage.setItem('scrabster-analytics-consent', 'false');

    // Clear existing data
    if (window.gtag) {
      gtag('config', this.gaId, {
        send_page_view: false,
      });
    }
  }

  // Track page view
  trackPageView(pagePath) {
    if (!this.isEnabled || !window.gtag) return;

    gtag('config', this.gaId, {
      page_path: pagePath,
    });
  }

  // Track custom event
  trackEvent(eventName, parameters = {}) {
    if (!this.isEnabled || !window.gtag) return;

    gtag('event', eventName, parameters);
  }

  // Track game events
  trackGameCreated(difficulty) {
    this.trackEvent('game_created', {
      game_difficulty: difficulty,
      event_category: 'game',
    });
  }

  trackGameJoined() {
    this.trackEvent('game_joined', {
      event_category: 'game',
    });
  }

  trackGameStarted(difficulty, playerCount) {
    this.trackEvent('game_started', {
      game_difficulty: difficulty,
      player_count: playerCount,
      event_category: 'game',
    });
  }

  trackWordSubmitted(wordLength, score) {
    this.trackEvent('word_submitted', {
      word_length: wordLength,
      score: score,
      event_category: 'gameplay',
    });
  }

  trackGameFinished(finalScore, gameDuration) {
    this.trackEvent('game_finished', {
      final_score: finalScore,
      game_duration: gameDuration,
      event_category: 'game',
    });
  }

  trackInstructionsViewed() {
    this.trackEvent('instructions_viewed', {
      event_category: 'navigation',
    });
  }

  trackImprintViewed() {
    this.trackEvent('imprint_viewed', {
      event_category: 'navigation',
    });
  }

  // Check if analytics is enabled
  isAnalyticsEnabled() {
    return this.isEnabled;
  }
}

// Create singleton instance
const analytics = new AnalyticsService();

export default analytics;
