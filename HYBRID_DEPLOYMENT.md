# Hybrid Deployment: Frontend (Vercel) + Backend (Render)

## Übersicht

Diese Lösung kombiniert die Stärken beider Plattformen:

- **Frontend auf Vercel** - Schnelle CDN-Verteilung und schöne URLs
- **Backend auf Render** - Zuverlässige API-Server ohne serverless Limits

## Architektur

```
┌─────────────────┐    API Calls    ┌─────────────────┐
│   Frontend      │ ──────────────► │   Backend       │
│   (Vercel)      │                 │   (Render)      │
│                 │                 │                 │
│ scrabster-pro.  │                 │ scrabster-pro.  │
│ vercel.app      │                 │ onrender.com    │
└─────────────────┘                 └─────────────────┘
```

## Vorteile

### ✅ **Vercel für Frontend:**

- **Schöne URLs** - `scrabster-pro.vercel.app` statt `scrabster-pro.onrender.com`
- **Globale CDN** - Schnelle Ladezeiten weltweit
- **Automatische HTTPS** - Sicherheit out-of-the-box
- **Optimierte Assets** - Automatische Kompression und Caching

### ✅ **Render für Backend:**

- **Keine Cold Starts** - Server läuft kontinuierlich
- **Keine Function-Limits** - Unbegrenzte API-Aufrufe
- **Persistente Verbindungen** - Bessere Performance für Echtzeit-Features
- **Einfaches Debugging** - Standard Node.js-Logs

## Konfiguration

### Frontend (Vercel)

- **Repository:** `deepsoul/scrabster-pro`
- **Branch:** `hybrid-deployment`
- **Build Command:** `cd client && npm install && npm run build`
- **Output Directory:** `client/dist`
- **Custom Domain:** `scrabster-pro.vercel.app`

### Backend (Render)

- **Repository:** `deepsoul/scrabster-pro`
- **Branch:** `render-deployment`
- **Build Command:** `cd client && npm install && npm run build && cd ../server && npm install`
- **Start Command:** `cd server && npm start`
- **URL:** `https://scrabster-pro.onrender.com`

## API-Konfiguration

### Client-seitig (`gameApi.js`)

```javascript
this.baseUrl = import.meta.env.PROD
  ? 'https://scrabster-pro.onrender.com' // Render-Backend
  : 'http://localhost:3000'; // Lokaler Server
```

### Server-seitig (`server.js`)

```javascript
origin: process.env.NODE_ENV === 'production'
  ? [
      'https://scrabster-pro.vercel.app', // Vercel-Frontend
      'https://scrabster-pro-git-develop-...', // Vercel-Preview
      'https://scrabster-pro.onrender.com', // Render-Frontend
    ]
  : 'http://localhost:5173';
```

## Deployment-Workflow

### 1. Backend auf Render deployen

```bash
git checkout render-deployment
git push origin render-deployment
# Render deployt automatisch
```

### 2. Frontend auf Vercel deployen

```bash
git checkout hybrid-deployment
git push origin hybrid-deployment
# Vercel deployt automatisch
```

### 3. Custom Domain einrichten

- In Vercel Dashboard: Custom Domain `scrabster-pro.vercel.app`
- DNS-Einstellungen entsprechend konfigurieren

## Monitoring

### Vercel Dashboard

- Frontend-Performance
- Build-Logs
- Domain-Management

### Render Dashboard

- Backend-Logs
- Server-Performance
- API-Health

## Kosten

### Vercel (Frontend)

- **Kostenlos:** 100GB Bandwidth/Monat
- **Pro:** $20/Monat für mehr Bandwidth

### Render (Backend)

- **Kostenlos:** 750 Stunden/Monat
- **Starter:** $7/Monat für 24/7 Betrieb

## Skalierung

### Frontend-Skalierung

- Automatisch über Vercel CDN
- Globale Edge-Locations
- Keine manuellen Eingriffe nötig

### Backend-Skalierung

- Render Auto-Scaling
- Load Balancing verfügbar
- Database-Integration möglich

## Sicherheit

### CORS-Konfiguration

- Nur erlaubte Domains können API aufrufen
- Credentials-Support für Authentifizierung

### HTTPS

- Automatisch auf beiden Plattformen
- SSL-Zertifikate automatisch verwaltet

## Entwicklung

### Lokale Entwicklung

```bash
npm run dev
# Frontend: http://localhost:5173
# Backend:  http://localhost:3000
```

### Produktions-Test

- Frontend: `https://scrabster-pro.vercel.app`
- Backend: `https://scrabster-pro.onrender.com`

## Troubleshooting

### CORS-Fehler

- Prüfen ob Vercel-Domain in Render-CORS-Liste steht
- Browser-Cache leeren

### API-Verbindung

- Prüfen ob Render-Backend läuft
- Network-Tab im Browser prüfen

### Build-Fehler

- Vercel: Client-Build-Logs prüfen
- Render: Server-Build-Logs prüfen
