# Vercel Deployment Guide für Scrabster Pro

## 🚀 Schnellstart

### 1. Repository mit Vercel verbinden

1. Gehe zu [vercel.com](https://vercel.com) und melde dich an
2. Klicke auf "New Project"
3. Verbinde dein GitHub Repository: `deepsoul/scrabster-pro`
4. Wähle das Repository aus

### 2. Projekt konfigurieren

**Wichtige Einstellungen:**

- **Framework Preset**: `Vite`
- **Root Directory**: `client` (wichtig!)
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

### 3. Environment Variables

Füge folgende Umgebungsvariablen hinzu:

```
NODE_ENV=production
```

### 4. Deploy

Klicke auf "Deploy" - Vercel wird automatisch:

- Das Frontend (Vue 3) bauen
- Das Backend (Node.js) als Serverless Function deployen
- Socket.IO für Echtzeit-Kommunikation einrichten

## 📁 Projektstruktur für Vercel

```
scrabster-pro/
├── client/                 # Frontend (Vue 3 + Vite)
│   ├── src/
│   ├── dist/              # Build Output
│   ├── package.json
│   └── vercel.json
├── server/                 # Backend (Node.js + Socket.IO)
│   ├── server.js
│   ├── package.json
│   └── vercel.json
├── vercel.json            # Hauptkonfiguration
└── package.json
```

## 🔧 Konfigurationsdateien

### Root vercel.json

```json
{
  "version": 2,
  "builds": [
    {
      "src": "client/package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "dist"
      }
    },
    {
      "src": "server/server.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "/server/server.js"
    },
    {
      "src": "/socket.io/(.*)",
      "dest": "/server/server.js"
    },
    {
      "src": "/(.*)",
      "dest": "/client/dist/$1"
    }
  ],
  "env": {
    "NODE_ENV": "production"
  },
  "functions": {
    "server/server.js": {
      "maxDuration": 30
    }
  }
}
```

## 🌐 URLs nach Deployment

Nach erfolgreichem Deployment erhältst du:

- **Frontend**: `https://your-project.vercel.app`
- **Backend API**: `https://your-project.vercel.app/api`
- **Socket.IO**: `https://your-project.vercel.app/socket.io`

## 🔄 Automatische Deployments

Vercel deployt automatisch bei:

- Push auf `main` Branch (Production)
- Push auf andere Branches (Preview)
- Pull Requests (Preview)

## 🐛 Troubleshooting

### Problem: Socket.IO Verbindung fehlschlägt

**Lösung**: Stelle sicher, dass die Socket.IO-Verbindung auf `window.location.origin` zeigt (bereits konfiguriert).

### Problem: Build Fehler

**Lösung**:

1. Überprüfe, dass `Root Directory` auf `client` gesetzt ist
2. Stelle sicher, dass alle Dependencies installiert sind
3. Prüfe die Build-Logs in Vercel Dashboard

### Problem: 404 Fehler für API Routes

**Lösung**: Überprüfe die `vercel.json` Routing-Konfiguration.

## 📊 Monitoring

- **Vercel Dashboard**: Überwache Deployments und Performance
- **Function Logs**: Prüfe Serverless Function Logs
- **Analytics**: Nutze Vercel Analytics für Frontend-Metriken

## 🔒 Sicherheit

- Environment Variables sind sicher in Vercel gespeichert
- HTTPS ist automatisch aktiviert
- CORS ist für Production konfiguriert

## 💡 Tipps

1. **Performance**: Vercel optimiert automatisch für Performance
2. **CDN**: Statische Assets werden über Vercel's CDN ausgeliefert
3. **Serverless**: Backend läuft als Serverless Function (kostenlos bis zu 100GB Bandwidth)
4. **WebSockets**: Socket.IO funktioniert mit Vercel's Serverless Functions

## 🆘 Support

Bei Problemen:

1. Prüfe die Vercel Build Logs
2. Teste lokal mit `npm run dev`
3. Überprüfe die Konfigurationsdateien
4. Kontaktiere Vercel Support bei technischen Problemen
