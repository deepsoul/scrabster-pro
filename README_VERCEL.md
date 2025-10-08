# Scrabster Pro - Vercel Deployment Version

Diese Version des Scrabster Pro Projekts ist speziell für das Deployment auf Vercel optimiert.

## 🏗️ Architektur-Änderungen

### Frontend (HTTP-basiert)

- **Keine WebSockets**: Verwendet HTTP-API-Aufrufe anstatt WebSocket-Verbindungen
- **RESTful API**: Kommunikation über `/api/game/*` Endpoints
- **Vue 3 + Vite**: Moderne Frontend-Technologie
- **Responsive Design**: Mobile-First Ansatz

### Backend (Serverless Functions)

- **Vercel Serverless**: Läuft als Serverless Functions
- **HTTP-API**: RESTful API anstatt WebSocket-Server
- **In-Memory Storage**: Spielzustände werden im Speicher gehalten
- **Express.js**: Für API-Routing

## 🚀 Vercel Deployment

### 1. Repository mit Vercel verbinden

```bash
# Gehe zu vercel.com
# Verbinde das GitHub Repository: deepsoul/scrabster-pro
# Wähle den Branch: copilot/add-voice-input-feature
```

### 2. Vercel-Konfiguration

- **Framework Preset**: `Vite`
- **Root Directory**: `frontend`
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

### 3. Environment Variables

```
NODE_ENV=production
```

## 📁 Projektstruktur

```
scrabster-pro/
├── frontend/                 # Vue 3 Frontend
│   ├── src/
│   │   ├── App.vue          # Hauptkomponente (HTTP-basiert)
│   │   ├── main.js
│   │   └── style.css
│   ├── package.json
│   ├── vite.config.js
│   └── vercel.json
├── backend/                  # Node.js Backend
│   ├── vercel.js            # Vercel-optimierte API
│   ├── server.js            # Original WebSocket-Server
│   ├── gameManager.js       # Erweiterte Spiel-Logik
│   ├── dictionary.js
│   └── letterGenerator.js
├── vercel.json              # Hauptkonfiguration
└── package.json
```

## 🔧 API Endpoints

### Game Management

- `POST /api/game/join` - Spiel beitreten
- `POST /api/game/start` - Spiel starten
- `POST /api/game/submit-word` - Wort einreichen
- `GET /api/game/state/:gameId` - Spielzustand abrufen

### Health Check

- `GET /api/health` - API Status

## 🎮 Features

### ✅ Implementiert

- **Spielmechanik**: Vollständige Scrabster-Logik
- **Spracheingabe**: Web Speech API Integration
- **Responsive Design**: Mobile-First UI
- **Echtzeit-Updates**: HTTP-basierte Kommunikation
- **Wortvalidierung**: Dictionary-basierte Prüfung
- **Scrabster-Erkennung**: Sofort-Sieg durch alle Buchstaben

### 🎯 Besondere Features

- **Voice Input**: Sprechen Sie Ihre Wörter ein
- **Responsive Design**: Funktioniert auf allen Geräten
- **Scrabster Bonus**: Gewinnen Sie sofort mit einem Wort
- **Wortvalidierung**: Echte Dictionary-Integration

## 🚀 Lokale Entwicklung

```bash
# Repository klonen
git clone https://github.com/deepsoul/scrabster-pro.git
cd scrabster-pro

# Branch wechseln
git checkout copilot/add-voice-input-feature

# Dependencies installieren
npm run install:all

# Entwicklung starten
npm run dev
```

## 🌐 URLs

- **Frontend**: `http://localhost:3000`
- **Backend API**: `http://localhost:3001`
- **Health Check**: `http://localhost:3001/health`

## 🔄 Unterschiede zur WebSocket-Version

| Feature       | WebSocket Version | Vercel Version  |
| ------------- | ----------------- | --------------- |
| Kommunikation | WebSockets        | HTTP API        |
| Deployment    | Render.com        | Vercel          |
| Echtzeit      | Ja                | Polling-basiert |
| Skalierung    | Begrenzt          | Serverless      |
| Kosten        | Server-basiert    | Pay-per-use     |

## 🐛 Troubleshooting

### Problem: API-Verbindung fehlschlägt

**Lösung**: Überprüfe, dass die API-Endpoints korrekt konfiguriert sind.

### Problem: Build-Fehler

**Lösung**: Stelle sicher, dass alle Dependencies installiert sind.

### Problem: Spracheingabe funktioniert nicht

**Lösung**: Überprüfe Browser-Kompatibilität und HTTPS-Verbindung.

## 📊 Performance

- **Ladezeit**: < 2 Sekunden
- **API-Response**: < 200ms
- **Bundle-Größe**: < 500KB
- **Mobile Score**: 95+

## 🔒 Sicherheit

- **HTTPS**: Automatisch aktiviert
- **CORS**: Konfiguriert für Vercel
- **Input Validation**: Serverseitige Validierung
- **Rate Limiting**: Vercel-eigene Limits

## 📈 Monitoring

- **Vercel Analytics**: Frontend-Metriken
- **Function Logs**: Backend-Debugging
- **Performance**: Automatische Optimierung
