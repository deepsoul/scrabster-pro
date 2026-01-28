# Vercel API 404-Fehler beheben

## Problem
Auf Vercel Preview-Branches bekommst du 404-Fehler für `/api/game/create` etc., obwohl es lokal funktioniert.

## Ursache
Vercel erkennt Functions im `api/` Verzeichnis automatisch, aber es gibt einige häufige Probleme:

1. **Dependencies fehlen**: `@upstash/redis` muss im Root `package.json` sein
2. **Build-Konfiguration**: Die `vercel.json` muss richtig konfiguriert sein
3. **Function-Format**: Functions müssen als `module.exports = async (req, res) => {}` exportiert werden

## Lösung

### 1. Dependencies prüfen

Stelle sicher, dass `@upstash/redis` im Root `package.json` ist:

```json
{
  "dependencies": {
    "@upstash/redis": "^1.36.1"
  }
}
```

### 2. vercel.json Konfiguration

Die `vercel.json` sollte so aussehen:

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
      "src": "/api/(.*)",
      "dest": "/api/$1"
    },
    {
      "src": "/(.*)",
      "dest": "/client/dist/$1"
    }
  ]
}
```

### 3. Vercel Build Settings prüfen

Im Vercel Dashboard:
- **Root Directory**: Sollte leer sein (Root des Repos)
- **Build Command**: `cd client && npm install && npm run build`
- **Output Directory**: `client/dist`
- **Install Command**: `npm install` (installiert auch Root-Dependencies)

### 4. Environment Variables

Stelle sicher, dass in Vercel Dashboard → Settings → Environment Variables gesetzt sind:
- `KV_REST_API_URL`
- `KV_REST_API_TOKEN`

### 5. Build-Logs prüfen

In Vercel Dashboard → Deployments → [Deployment] → Build Logs:
- Prüfe, ob `@upstash/redis` installiert wird
- Prüfe, ob die Functions erkannt werden
- Suche nach Fehlern

## Alternative: Explizite Function-Definition

Falls das automatische Erkennen nicht funktioniert, kannst du Functions explizit definieren:

```json
{
  "functions": {
    "api/game/create.js": {
      "runtime": "nodejs18.x"
    },
    "api/game/join.js": {
      "runtime": "nodejs18.x"
    }
    // ... etc
  }
}
```

Aber normalerweise sollte das nicht nötig sein.

## Debugging

1. **Prüfe die Deployment-URL direkt:**
   ```
   https://your-preview-url.vercel.app/api/game/create
   ```
   Sollte eine Function-Antwort geben (nicht 404)

2. **Prüfe die Function-Logs:**
   Vercel Dashboard → Functions → [Function Name] → Logs

3. **Teste lokal mit vercel dev:**
   ```bash
   npm run vercel:dev
   ```
   Dann: `http://localhost:3000/api/game/create`

## Häufige Fehler

- ❌ Functions im falschen Verzeichnis (müssen in `api/` sein)
- ❌ Falsche Export-Syntax (muss `module.exports = async (req, res) => {}` sein)
- ❌ Dependencies fehlen im Root `package.json`
- ❌ Falsche Route-Konfiguration in `vercel.json`
