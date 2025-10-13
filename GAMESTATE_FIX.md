# GameState Fix - Scrabster Pro

## 🐛 Problem

```
Connected to server, but gameState is null and not created
```

## ✅ Lösung

### 1. Socket-Events in App.vue hinzugefügt

```javascript
// App.vue - Socket-Listener erweitert
socket.value.on('gameCreated', data => {
  console.log('Game created:', data);
  gameData.value = {
    ...gameData.value,
    ...data,
    gameState: 'waiting',
  };
});

socket.value.on('gameJoined', data => {
  console.log('Game joined:', data);
  gameData.value = {
    ...gameData.value,
    ...data,
    gameState: 'waiting',
  };
});
```

### 2. Lobby-Komponente mit Socket erweitert

```vue
<!-- App.vue - Socket an Lobby weitergeben -->
<Lobby
  v-else-if="currentView === 'lobby'"
  :socket="socket"
  @createGame="handleCreateGame"
  @joinGame="handleJoinGame"
/>
```

```javascript
// Lobby.vue - Socket-Props hinzugefügt
const props = defineProps({
  socket: Object,
});

// Socket-Events senden
const createGame = async () => {
  // ... gameData erstellen

  // Send to server
  if (props.socket) {
    props.socket.emit('createGame', gameData);
  }

  emit('createGame', gameData);
};
```

### 3. GameData-Initialisierung korrigiert

```javascript
// App.vue - Parameter-Namen korrigiert
const handleCreateGame = data => {
  // ← data statt gameData
  currentView.value = 'game';
  gameData.value = data; // ← Korrekte Zuweisung
};

const handleJoinGame = data => {
  // ← data statt gameData
  currentView.value = 'game';
  gameData.value = data; // ← Korrekte Zuweisung
};
```

## 🔧 Was wurde geändert?

### 1. App.vue erweitert

```javascript
// Socket-Listener für Game-Events
socket.value.on('gameCreated', data => {
  console.log('Game created:', data);
  gameData.value = {
    ...gameData.value,
    ...data,
    gameState: 'waiting',
  };
});

socket.value.on('gameJoined', data => {
  console.log('Game joined:', data);
  gameData.value = {
    ...gameData.value,
    ...data,
    gameState: 'waiting',
  };
});
```

### 2. Lobby.vue erweitert

```javascript
// Props für Socket hinzugefügt
const props = defineProps({
  socket: Object,
});

// Socket-Events in createGame
const createGame = async () => {
  const gameData = {
    difficulty: selectedDifficulty.value,
    gameCode: generateGameCode(),
  };

  // Send to server
  if (props.socket) {
    props.socket.emit('createGame', gameData);
  }

  emit('createGame', gameData);
};

// Socket-Events in joinGame
const joinGame = async () => {
  const gameData = {
    gameCode: gameCode.value.trim().toUpperCase(),
  };

  // Send to server
  if (props.socket) {
    props.socket.emit('joinGame', gameData);
  }

  emit('joinGame', gameData);
};
```

### 3. Parameter-Namen korrigiert

```javascript
// Vorher (problematisch)
const handleCreateGame = gameData => {
  currentView.value = 'game';
  gameData.value = gameData; // ← Überschreibt die Variable
};

// Nachher (korrekt)
const handleCreateGame = data => {
  currentView.value = 'game';
  gameData.value = data; // ← Korrekte Zuweisung
};
```

## 🚀 Nächste Schritte

### 1. Lokal testen

```bash
# Server starten
npm run server:dev

# Client starten (in anderem Terminal)
npm run client:dev
```

### 2. Browser testen

- Gehe zu http://localhost:5173
- Username eingeben
- Spiel erstellen oder beitreten
- Prüfe Browser-Konsole für Logs

### 3. Debug-Informationen

```javascript
// In Browser-Konsole prüfen
console.log('gameData:', gameData.value);
console.log('gameState:', gameData.value?.gameState);
console.log('Socket connected:', socket.value?.connected);
```

### 4. Commit und Push

```bash
git add .
git commit -m "fix: Add socket events for gameState initialization"
git push origin main
```

## 🐛 Weitere Troubleshooting

### Problem: Immer noch null gameState

**Lösung**:

```javascript
// Debug-Logs hinzufügen
socket.value.on('gameCreated', data => {
  console.log('Game created event received:', data);
  gameData.value = {
    ...gameData.value,
    ...data,
    gameState: 'waiting',
  };
  console.log('Updated gameData:', gameData.value);
});
```

### Problem: Socket-Events werden nicht gesendet

**Lösung**:

```javascript
// Socket-Verbindung prüfen
console.log('Socket connected:', props.socket?.connected);
console.log('Socket ID:', props.socket?.id);

// Event senden
if (props.socket && props.socket.connected) {
  props.socket.emit('createGame', gameData);
} else {
  console.error('Socket not connected');
}
```

### Problem: Server antwortet nicht

**Lösung**:

```javascript
// Server-Listener prüfen
socket.value.on('gameCreated', data => {
  console.log('Server response:', data);
});

// Error-Handling
socket.value.on('error', error => {
  console.error('Socket error:', error);
});
```

## 📊 Erwartete Verhalten

### ✅ Erfolgreicher Ablauf:

1. **Login**: Username eingeben
2. **Lobby**: Spiel erstellen oder beitreten
3. **Socket-Events**: Server sendet gameCreated/gameJoined
4. **GameData**: gameData wird mit gameState initialisiert
5. **GameScreen**: Zeigt Loading-State, dann Game-Content

### ⏱️ Timing:

- **Socket-Connection**: ~1-2 Sekunden
- **Game-Creation**: ~1-2 Sekunden
- **GameState-Update**: Sofort nach Server-Response

## 📚 Nützliche Links

- [Socket.IO Client Events](https://socket.io/docs/v4/client-api/)
- [Vue 3 Props](https://vuejs.org/guide/components/props.html)
- [Vue 3 Event Handling](https://vuejs.org/guide/components/events.html)
- [JavaScript Object Spread](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax)
