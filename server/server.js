const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin:
      process.env.NODE_ENV === 'production' ? false : 'http://localhost:5173',
    methods: ['GET', 'POST'],
  },
});

const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from client dist
app.use(express.static(path.join(__dirname, '../client/dist')));

// Spiel-Räume verwalten
const gameRooms = new Map();

// Gewichtetes deutsches Alphabet (häufigere Buchstaben haben höhere Gewichtung)
const weightedAlphabet = [
  'E',
  'E',
  'E',
  'E',
  'E',
  'E',
  'E',
  'E',
  'E',
  'E',
  'E',
  'E',
  'E',
  'E',
  'E',
  'E',
  'E',
  'E',
  'E',
  'E', // E (20x)
  'N',
  'N',
  'N',
  'N',
  'N',
  'N',
  'N',
  'N',
  'N',
  'N',
  'N',
  'N',
  'N',
  'N',
  'N',
  'N',
  'N',
  'N',
  'N', // N (19x)
  'I',
  'I',
  'I',
  'I',
  'I',
  'I',
  'I',
  'I',
  'I',
  'I',
  'I',
  'I',
  'I',
  'I',
  'I',
  'I',
  'I',
  'I', // I (18x)
  'S',
  'S',
  'S',
  'S',
  'S',
  'S',
  'S',
  'S',
  'S',
  'S',
  'S',
  'S',
  'S',
  'S',
  'S',
  'S',
  'S', // S (17x)
  'R',
  'R',
  'R',
  'R',
  'R',
  'R',
  'R',
  'R',
  'R',
  'R',
  'R',
  'R',
  'R',
  'R',
  'R',
  'R', // R (16x)
  'A',
  'A',
  'A',
  'A',
  'A',
  'A',
  'A',
  'A',
  'A',
  'A',
  'A',
  'A',
  'A',
  'A',
  'A', // A (15x)
  'T',
  'T',
  'T',
  'T',
  'T',
  'T',
  'T',
  'T',
  'T',
  'T',
  'T',
  'T',
  'T',
  'T', // T (14x)
  'D',
  'D',
  'D',
  'D',
  'D',
  'D',
  'D',
  'D',
  'D',
  'D',
  'D',
  'D',
  'D', // D (13x)
  'H',
  'H',
  'H',
  'H',
  'H',
  'H',
  'H',
  'H',
  'H',
  'H',
  'H',
  'H', // H (12x)
  'U',
  'U',
  'U',
  'U',
  'U',
  'U',
  'U',
  'U',
  'U',
  'U',
  'U', // U (11x)
  'L',
  'L',
  'L',
  'L',
  'L',
  'L',
  'L',
  'L',
  'L',
  'L', // L (10x)
  'C',
  'C',
  'C',
  'C',
  'C',
  'C',
  'C',
  'C',
  'C', // C (9x)
  'G',
  'G',
  'G',
  'G',
  'G',
  'G',
  'G',
  'G', // G (8x)
  'M',
  'M',
  'M',
  'M',
  'M',
  'M',
  'M', // M (7x)
  'O',
  'O',
  'O',
  'O',
  'O',
  'O', // O (6x)
  'B',
  'B',
  'B',
  'B',
  'B', // B (5x)
  'W',
  'W',
  'W',
  'W', // W (4x)
  'F',
  'F',
  'F', // F (3x)
  'K',
  'K',
  'K', // K (3x)
  'Z',
  'Z',
  'Z', // Z (3x)
  'P',
  'P', // P (2x)
  'V',
  'V', // V (2x)
  'J',
  'J', // J (2x)
  'Y',
  'Y', // Y (2x)
  'X', // X (1x)
  'Q', // Q (1x)
];

// Schwierigkeitsstufen
const DIFFICULTY_LEVELS = {
  easy: {letters: 9, time: 120},
  medium: {letters: 8, time: 90},
  hard: {letters: 7, time: 60},
};

// Hilfsfunktionen
function generateGameCode() {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

function generateLetters(count) {
  const letters = [];
  for (let i = 0; i < count; i++) {
    const randomIndex = Math.floor(Math.random() * weightedAlphabet.length);
    letters.push(weightedAlphabet[randomIndex]);
  }
  return letters;
}

function validateWord(word, availableLetters) {
  const wordLetters = word.toUpperCase().split('');
  const availableLettersCopy = [...availableLetters];

  for (const letter of wordLetters) {
    const index = availableLettersCopy.indexOf(letter);
    if (index === -1) {
      return false; // Buchstabe nicht verfügbar
    }
    availableLettersCopy.splice(index, 1); // Buchstabe "verbrauchen"
  }

  return true;
}

function isScrabster(word, availableLetters) {
  const wordLetters = word.toUpperCase().split('');
  return (
    wordLetters.length === availableLetters.length &&
    validateWord(word, availableLetters)
  );
}

// Socket.IO Event Handlers
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Neues Spiel erstellen
  socket.on('createGame', (data) => {
    const {username, difficulty} = data;
    const gameCode = generateGameCode();
    const difficultyConfig = DIFFICULTY_LEVELS[difficulty];

    const gameRoom = {
      code: gameCode,
      difficulty: difficulty,
      letters: generateLetters(difficultyConfig.letters),
      timeLeft: difficultyConfig.time,
      players: new Map(),
      gameState: 'waiting', // waiting, playing, finished
      gameStartTime: null,
      intervalId: null,
    };

    gameRoom.players.set(socket.id, {
      id: socket.id,
      username: username,
      words: [],
      score: 0,
    });

    gameRooms.set(gameCode, gameRoom);
    socket.join(gameCode);

    socket.emit('gameCreated', {
      gameCode: gameCode,
      difficulty: difficulty,
      letters: gameRoom.letters,
      timeLeft: gameRoom.timeLeft,
    });

    console.log(`Game created: ${gameCode} by ${username}`);
  });

  // Spiel beitreten
  socket.on('joinGame', (data) => {
    const {gameCode, username} = data;
    const gameRoom = gameRooms.get(gameCode);

    if (!gameRoom) {
      socket.emit('gameError', {message: 'Spiel nicht gefunden'});
      return;
    }

    if (gameRoom.gameState !== 'waiting') {
      socket.emit('gameError', {message: 'Spiel bereits gestartet'});
      return;
    }

    if (gameRoom.players.size >= 8) {
      socket.emit('gameError', {message: 'Spiel ist voll'});
      return;
    }

    gameRoom.players.set(socket.id, {
      id: socket.id,
      username: username,
      words: [],
      score: 0,
    });

    socket.join(gameCode);
    socket.emit('gameJoined', {
      gameCode: gameCode,
      difficulty: gameRoom.difficulty,
      letters: gameRoom.letters,
      timeLeft: gameRoom.timeLeft,
      players: Array.from(gameRoom.players.values()),
    });

    // Alle Spieler im Raum über neuen Spieler informieren
    io.to(gameCode).emit('playerJoined', {
      players: Array.from(gameRoom.players.values()),
    });

    console.log(`${username} joined game ${gameCode}`);
  });

  // Spiel starten
  socket.on('startGame', (data) => {
    const {gameCode} = data;
    const gameRoom = gameRooms.get(gameCode);

    if (!gameRoom || gameRoom.players.get(socket.id) === undefined) {
      socket.emit('gameError', {message: 'Nicht autorisiert'});
      return;
    }

    if (gameRoom.players.size < 2) {
      socket.emit('gameError', {message: 'Mindestens 2 Spieler erforderlich'});
      return;
    }

    gameRoom.gameState = 'playing';
    gameRoom.gameStartTime = Date.now();

    // Timer starten
    gameRoom.intervalId = setInterval(() => {
      gameRoom.timeLeft--;

      if (gameRoom.timeLeft <= 0) {
        // Spiel beenden
        clearInterval(gameRoom.intervalId);
        gameRoom.gameState = 'finished';

        // Gewinner ermitteln (wenigste Wörter)
        const players = Array.from(gameRoom.players.values());
        const minWords = Math.min(...players.map((p) => p.words.length));
        const winners = players.filter((p) => p.words.length === minWords);

        io.to(gameCode).emit('gameOver', {
          winners: winners,
          players: players,
          reason: 'timeUp',
        });

        // Spiel nach 30 Sekunden löschen
        setTimeout(() => {
          gameRooms.delete(gameCode);
        }, 30000);
      } else {
        // Spielstatus aktualisieren
        io.to(gameCode).emit('gameStateUpdate', {
          timeLeft: gameRoom.timeLeft,
          players: Array.from(gameRoom.players.values()),
        });
      }
    }, 1000);

    io.to(gameCode).emit('gameStarted', {
      letters: gameRoom.letters,
      timeLeft: gameRoom.timeLeft,
      players: Array.from(gameRoom.players.values()),
    });

    console.log(`Game started: ${gameCode}`);
  });

  // Neues Wort einreichen
  socket.on('submitWord', (data) => {
    const {gameCode, word} = data;
    const gameRoom = gameRooms.get(gameCode);

    if (!gameRoom || gameRoom.gameState !== 'playing') {
      socket.emit('gameError', {message: 'Spiel nicht aktiv'});
      return;
    }

    const player = gameRoom.players.get(socket.id);
    if (!player) {
      socket.emit('gameError', {message: 'Spieler nicht gefunden'});
      return;
    }

    // Wort validieren
    if (!validateWord(word, gameRoom.letters)) {
      socket.emit('wordRejected', {
        word: word,
        message: 'Wort enthält ungültige Buchstaben',
      });
      return;
    }

    // Prüfen ob Wort bereits verwendet wurde
    if (player.words.includes(word.toUpperCase())) {
      socket.emit('wordRejected', {
        word: word,
        message: 'Wort bereits verwendet',
      });
      return;
    }

    // Wort hinzufügen
    player.words.push(word.toUpperCase());
    player.score = player.words.length;

    // Prüfen auf Scrabster (Sofort-Sieg)
    if (isScrabster(word, gameRoom.letters)) {
      player.score += 2; // Bonus für Scrabster
      gameRoom.gameState = 'finished';
      clearInterval(gameRoom.intervalId);

      io.to(gameCode).emit('gameOver', {
        winners: [player],
        players: Array.from(gameRoom.players.values()),
        reason: 'scrabster',
        scrabsterWord: word.toUpperCase(),
      });

      // Spiel nach 30 Sekunden löschen
      setTimeout(() => {
        gameRooms.delete(gameCode);
      }, 30000);

      console.log(`Scrabster! ${player.username} won with "${word}"`);
      return;
    }

    // Alle Spieler über neues Wort informieren
    io.to(gameCode).emit('wordSubmitted', {
      playerId: socket.id,
      playerName: player.username,
      word: word.toUpperCase(),
      players: Array.from(gameRoom.players.values()),
    });

    console.log(`${player.username} submitted word: ${word}`);
  });

  // Spieler verlässt das Spiel
  socket.on('leaveGame', (data) => {
    const {gameCode} = data;
    const gameRoom = gameRooms.get(gameCode);

    if (gameRoom) {
      gameRoom.players.delete(socket.id);
      socket.leave(gameCode);

      if (gameRoom.players.size === 0) {
        // Spiel löschen wenn keine Spieler mehr da sind
        if (gameRoom.intervalId) {
          clearInterval(gameRoom.intervalId);
        }
        gameRooms.delete(gameCode);
        console.log(`Game ${gameCode} deleted - no players left`);
      } else {
        // Andere Spieler informieren
        io.to(gameCode).emit('playerLeft', {
          players: Array.from(gameRoom.players.values()),
        });
      }
    }
  });

  // Verbindung trennen
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);

    // Spieler aus allen Spielen entfernen
    for (const [gameCode, gameRoom] of gameRooms.entries()) {
      if (gameRoom.players.has(socket.id)) {
        gameRoom.players.delete(socket.id);

        if (gameRoom.players.size === 0) {
          if (gameRoom.intervalId) {
            clearInterval(gameRoom.intervalId);
          }
          gameRooms.delete(gameCode);
          console.log(`Game ${gameCode} deleted - no players left`);
        } else {
          io.to(gameCode).emit('playerLeft', {
            players: Array.from(gameRoom.players.values()),
          });
        }
        break;
      }
    }
  });
});

// API Routes
app.get('/api/health', (req, res) => {
  res.json({status: 'OK', timestamp: new Date().toISOString()});
});

// Fallback für SPA
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/dist/index.html'));
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});
