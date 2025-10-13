# Vercel Deployment Fix

## Problem

Das Spiel funktionierte lokal, aber auf Vercel gab es 404-Fehler bei den API-Routen.

## Lösung

Vercel erwartet serverless Functions in einem spezifischen Format. Ich habe die API-Struktur angepasst:

### Neue API-Struktur

```
api/
├── shared/
│   └── gameData.js          # Geteilter Speicher und Hilfsfunktionen
└── game/
    ├── create.js            # POST /api/game/create
    ├── join.js              # POST /api/game/join
    ├── start.js             # POST /api/game/start
    ├── submit-word.js       # POST /api/game/submit-word
    ├── status/
    │   └── [gameCode].js    # GET /api/game/status/:gameCode
    └── leave.js             # POST /api/game/leave
```

### Vercel-Konfiguration

Die `vercel.json` wurde angepasst, um die API-Routen korrekt zu routen:

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
    }
  ],
  "routes": [
    {
      "src": "/api/game/create",
      "dest": "/api/game/create.js"
    },
    {
      "src": "/api/game/join",
      "dest": "/api/game/join.js"
    },
    {
      "src": "/api/game/start",
      "dest": "/api/game/start.js"
    },
    {
      "src": "/api/game/submit-word",
      "dest": "/api/game/submit-word.js"
    },
    {
      "src": "/api/game/status/([^/]+)",
      "dest": "/api/game/status/[gameCode].js?gameCode=$1"
    },
    {
      "src": "/api/game/leave",
      "dest": "/api/game/leave.js"
    },
    {
      "src": "/(.*)",
      "dest": "/client/dist/$1"
    }
  ],
  "env": {
    "NODE_ENV": "production"
  }
}
```

### Wichtige Änderungen

1. **Serverless Functions**: Jede API-Route ist jetzt eine separate Vercel Function
2. **Geteilter Speicher**: `api/shared/gameData.js` enthält den geteilten Speicher
3. **CORS-Konfiguration**: Alle Functions haben CORS-Header für Cross-Origin-Requests
4. **Routen-Mapping**: Vercel routet API-Requests zu den entsprechenden Functions

### Deployment

1. **Code committen und pushen**:

   ```bash
   git add .
   git commit -m "Fix Vercel deployment - convert to serverless functions"
   git push origin develop
   ```

2. **Vercel automatisch deployen**: Vercel erkennt Änderungen und deployed automatisch

3. **Testen**: Die API sollte jetzt unter `https://scrabster-pro.vercel.app/api/game/create` funktionieren

### Hinweise

- **Speicher**: Der geteilte Speicher funktioniert nur innerhalb einer Vercel-Instanz
- **Skalierung**: Für echte Produktion sollte Redis oder eine Datenbank verwendet werden
- **Cold Starts**: Serverless Functions können beim ersten Aufruf langsam sein

### API-Endpunkte

- `POST /api/game/create` - Spiel erstellen
- `POST /api/game/join` - Spiel beitreten
- `POST /api/game/start` - Spiel starten
- `POST /api/game/submit-word` - Wort einreichen
- `GET /api/game/status/:gameCode` - Spielstatus abrufen
- `POST /api/game/leave` - Spiel verlassen

Alle Endpunkte unterstützen CORS und geben JSON-Responses zurück.
