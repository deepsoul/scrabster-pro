// Game Types
export interface Player {
  id: string;
  username: string;
  words: string[];
  score: number;
  scrabsters?: number;
}

export interface GameData {
  id: string;
  code: string;
  gameCode: string; // Add gameCode property
  difficulty: 'easy' | 'medium' | 'hard';
  letters: string[];
  timeLeft: number;
  players: Player[];
  playerId: string;
  gameState: 'waiting' | 'playing' | 'finished';
  isHost: boolean;
}

export interface GameResult {
  reason: 'time' | 'scrabster' | 'manual';
  winners: Player[];
  isDraw: boolean;
  players: Player[];
}

// Word Validation Types
export interface WordValidation {
  isValid: boolean;
  reason?: string;
  word: string;
  source: 'api' | 'local' | 'letter_check' | 'offline';
}

// Dialog Types
export interface DialogOptions {
  title?: string;
  message: string;
  type?: 'info' | 'success' | 'warning' | 'error';
  showCloseButton?: boolean;
  showCancelButton?: boolean;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
}

// Analytics Types
export interface AnalyticsEvent {
  event_name: string;
  event_category: string;
  event_label?: string;
  value?: number;
  custom_parameters?: Record<string, any>;
}

// Sound Service Types
export type SoundType = 'wordSubmit' | 'scrabster' | 'winner';

// Word Badges Types
export type BadgeType = 'letters' | 'points';
export type DifficultyLevel = 'easy' | 'medium' | 'hard';

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// WebSocket Event Types
export interface WebSocketEvent {
  type: string;
  data: any;
}

// Training Mode Types
export interface TrainingStats {
  totalScore: number;
  wordCount: number;
  averageScore: number;
  bestWordScore: number;
  scrabsterCount: number;
}

// Speech Recognition Types
export interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
}

export interface SpeechRecognitionErrorEvent extends Event {
  error: string;
}

// Component Props Types
export interface GameScreenProps {
  gameData: GameData;
  gameApi: any; // Will be typed when we migrate gameApi
}

export interface TrainingModeProps {
  difficulty: DifficultyLevel;
}

export interface LobbyProps {
  gameApi: any; // Will be typed when we migrate gameApi
  currentUser: string;
}
