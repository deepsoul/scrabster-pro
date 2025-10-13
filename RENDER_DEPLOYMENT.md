# Render.com Deployment

## Warum Render.com?

Vercel hatte Probleme mit den serverless Functions (404-Fehler). Render.com bietet bessere Unterstützung für traditionelle Express-Server und ist einfacher zu konfigurieren.

## Render.com Setup

### 1. Repository vorbereiten

```bash
# Neuen Branch erstellen
git checkout -b render-deployment

# Änderungen committen
git add .
git commit -m "Add Render.com deployment configuration"
git push origin render-deployment
```

### 2. Render.com Service erstellen

1. Gehe zu [Render Dashboard](https://dashboard.render.com/)
2. Klicke auf "New +" → "Web Service"
3. Verbinde dein GitHub Repository
4. Wähle den `render-deployment` Branch

### 3. Service-Konfiguration

**Name:** `scrabster-pro`

**Environment:** `Node`

**Build Command:**
```bash
cd client && npm install && npm run build && cd ../server && npm install
```

**Start Command:**
```bash
cd server && npm start
```

**Environment Variables:**
- `NODE_ENV` = `production`
- `PORT` = `10000` (wird automatisch von Render gesetzt)

### 4. Automatische Konfiguration

Die `render.yaml` Datei wird automatisch erkannt und konfiguriert den Service:

```yaml
services:
  - type: web
    name: scrabster-pro
    env: node
    plan: free
    buildCommand: |
      cd client && npm install && npm run build
      cd ../server && npm install
    startCommand: cd server && npm start
    envVars:
      - key: NODE_ENV
        value: production
      - key: PORT
        value: 10000
```

## Vorteile von Render.com

### ✅ **Einfache Konfiguration**
- Keine komplexen serverless Function-Konfigurationen
- Traditioneller Express-Server funktioniert out-of-the-box
- Automatische HTTPS und Domain

### ✅ **Bessere Performance**
- Keine Cold Starts wie bei Vercel
- Persistente Verbindungen möglich
- Geteilter Speicher zwischen Requests

### ✅ **Einfacheres Debugging**
- Standard Node.js-Logs
- Keine serverless-spezifischen Probleme
- Einfache Umgebungsvariablen

### ✅ **Kosten**
- Kostenloser Plan verfügbar
- Keine Function-Aufruf-Limits
- 750 Stunden/Monat kostenlos

## Deployment-URL

Nach dem Deployment ist die App verfügbar unter:
`https://scrabster-pro.onrender.com`

## Lokale Entwicklung

Die lokale Entwicklung bleibt unverändert:

```bash
npm run dev
```

- Client: `http://localhost:5173`
- Server: `http://localhost:3000`

## API-Endpunkte

Alle API-Endpunkte funktionieren wie gewohnt:

- `POST /api/game/create` - Spiel erstellen
- `POST /api/game/join` - Spiel beitreten
- `POST /api/game/start` - Spiel starten
- `POST /api/game/submit-word` - Wort einreichen
- `GET /api/game/status/:gameCode` - Spielstatus abrufen
- `POST /api/game/leave` - Spiel verlassen

## Monitoring

Render.com bietet integriertes Monitoring:
- Logs in Echtzeit
- Performance-Metriken
- Automatische Deployments bei Git-Pushes

## Skalierung

Für höhere Lasten:
- Upgrade auf bezahlten Plan
- Horizontal Scaling möglich
- Load Balancing verfügbar
