# Scrabster Pro

Ein Echtzeit-Multiplayer-Wortspiel, bei dem Spieler aus einer zufälligen Auswahl von Buchstaben Wörter bilden müssen. Das Ziel ist es, in einer vorgegebenen Zeit die wenigsten Wörter zu bilden. Ein Spieler, der ein Wort findet, das alle vorgegebenen Buchstaben verwendet ("Scrabster"), gewinnt die Runde sofort.

## Technologie-Stack

- **Frontend**: Vue 3 (Composition API), Vite, Tailwind CSS
- **Backend**: Node.js, Express.js, Socket.IO
- **Deployment**: Vercel (empfohlen) oder Render.com

## Features

- 🎮 Echtzeit-Multiplayer-Spiel
- 🎯 3 Schwierigkeitsstufen (Leicht/Mittel/Schwer)
- 🎤 Spracheingabe mit Web Speech API
- 📱 Responsive Design (Mobile-First)
- ⚡ Sofort-Sieg durch "Scrabster" (alle Buchstaben verwenden)

## Installation

### Automatische Installation (Empfohlen)

```bash
# Repository klonen
git clone https://github.com/deepsoul/scrabster-pro.git
cd scrabster-pro

# Setup-Script ausführen
./setup.sh
```

### Manuelle Installation

#### 1. Abhängigkeiten installieren

```bash
# Root dependencies
npm install

# Server dependencies
cd server
npm install
cd ..

# Client dependencies
cd client
npm install
cd ..
```

#### 2. Client für Produktion bauen

```bash
cd client
npm run build
cd ..
```

### Entwicklung starten

```bash
# Beide Server gleichzeitig starten (Backend + Frontend)
npm run dev

# Oder einzeln:
# Backend: npm run server:dev
# Frontend: npm run client:dev
```

### Produktion starten

```bash
npm start
```

### URLs

- **Entwicklung**: http://localhost:5173 (Frontend) + http://localhost:3000 (Backend)
- **Produktion**: http://localhost:3000

## Spielregeln

1. **Spielstart**: Ein Spieler erstellt ein Spiel und teilt den Code mit anderen
2. **Buchstaben**: Zufällige Auswahl aus gewichtetem deutschen Alphabet
3. **Wortbildung**: Nur die vorgegebenen Buchstaben verwenden
4. **Gewinn**: Wenigste Wörter oder "Scrabster" (alle Buchstaben)

## Schwierigkeitsstufen

- **Leicht**: 9 Buchstaben, 120 Sekunden
- **Mittel**: 8 Buchstaben, 90 Sekunden
- **Schwer**: 7 Buchstaben, 60 Sekunden

## 🌳 Branch-Strategie

- **main**: Produktionsreifer Code (geschützt)
- **develop**: Entwicklungsintegration
- **feature/\***: Feature-Entwicklung
- **hotfix/\***: Kritische Bugfixes

Siehe [Git Workflow](GIT_WORKFLOW.md) für Details.

## Deployment

### Vercel (Empfohlen für Frontend + Backend)

1. **Repository mit Vercel verbinden**:

   - Gehe zu [vercel.com](https://vercel.com)
   - Verbinde dein GitHub Repository: `deepsoul/scrabster-pro`

2. **Projekt konfigurieren**:

   - Framework Preset: `Vite`
   - Root Directory: `client`
   - Build Command: `npm run build`
   - Output Directory: `dist`

3. **Environment Variables**:

   ```
   NODE_ENV=production
   ```

4. **Deploy**: Das Projekt wird automatisch deployed
   - Frontend: `https://your-project.vercel.app`
   - Backend API: `https://your-project.vercel.app/api`

### Render.com (Alternative für Backend)

1. **Repository verbinden**:

   - Gehe zu [render.com](https://render.com)
   - Verbinde dein GitHub Repository

2. **Service erstellen**:

   - Wähle "Web Service"
   - Repository: `scrabster-pro`
   - Build Command: `cd server && npm install`
   - Start Command: `cd server && npm start`
   - Environment: `Node`

3. **Environment Variables**:

   ```
   NODE_ENV=production
   PORT=10000
   ```

4. **Deploy**: Der Service wird automatisch deployed

### Alternative: Docker

```bash
# Docker Image bauen
docker build -t scrabster-pro .

# Container starten
docker run -p 3000:3000 scrabster-pro
```

### Alternative: VPS/Server

```bash
# Server vorbereiten
git clone https://github.com/deepsoul/scrabster-pro.git
cd scrabster-pro
./setup.sh

# Mit PM2 für Produktion
npm install -g pm2
pm2 start server/server.js --name "scrabster-pro"
pm2 startup
pm2 save
```
