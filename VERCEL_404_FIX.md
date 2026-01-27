# Vercel API 404 Fix - Detaillierte Anleitung

## Problem
API-Endpunkte geben 404 auf Vercel, obwohl sie lokal funktionieren.

## Lösung: Explizite Routes in vercel.json

Ich habe die `vercel.json` angepasst, um alle API-Routes explizit zu definieren. Das ist notwendig, weil:

1. Vercel erkennt Functions im `api/` Verzeichnis automatisch
2. Aber die generische Route `/api/(.*)` kann mit dem Frontend-Routing kollidieren
3. Explizite Routes stellen sicher, dass API-Requests richtig geroutet werden

## Was wurde geändert

Die `vercel.json` definiert jetzt explizit alle API-Routes:

```json
{
  "routes": [
    { "src": "/api/game/create", "dest": "/api/game/create.js" },
    { "src": "/api/game/join", "dest": "/api/game/join.js" },
    // ... etc
    { "src": "/(.*)", "dest": "/client/dist/$1" }
  ]
}
```

**Wichtig:** Die API-Routes müssen VOR dem Frontend-Routing (`/(.*)`) stehen!

## Vercel Dashboard Settings (KRITISCH!)

### 1. Root Directory
- **MUSS LEER SEIN** (nicht `client` oder `server`)
- Vercel muss das Root-Verzeichnis sehen, um `api/` zu erkennen

### 2. Build Command
```
cd client && npm install && npm run build
```

### 3. Output Directory
```
client/dist
```

### 4. Install Command
```
npm install
```
**WICHTIG:** Dies installiert Root-Dependencies (`@upstash/redis`)

## Environment Variables

Im Vercel Dashboard → Settings → Environment Variables:

Für **alle Environments** (Production, Preview, Development):
- `KV_REST_API_URL` = `https://stirred-herring-24466.upstash.io`
- `KV_REST_API_TOKEN` = `AV-SAAIncDI0YWE5NmM4YWE2ZmI0ODkyYjdmOGNhNTAwY2U0NTg1M3AyMjQ0NjY`

## Deployment-Schritte

1. **Änderungen committen:**
   ```bash
   git add vercel.json
   git commit -m "Fix Vercel API routes - explicit definitions"
   git push origin vercel-functions-migration
   ```

2. **Vercel Dashboard prüfen:**
   - Settings → General → Root Directory = **LEER**
   - Settings → General → Install Command = `npm install`
   - Settings → Environment Variables → Alle gesetzt

3. **Neues Deployment triggern:**
   - Vercel deployed automatisch bei Git Push
   - Oder: Deployments → Redeploy

4. **Build-Logs prüfen:**
   - Deployments → [Neuestes] → Build Logs
   - Suche nach: `@upstash/redis` wird installiert
   - Suche nach: `api/` Functions werden erkannt

5. **Functions prüfen:**
   - Deployments → [Neuestes] → Functions
   - Prüfe, ob `/api/game/create` etc. aufgelistet sind

## Testen

Nach dem Deployment:

1. **Direkte Function-URL:**
   ```
   https://your-preview-url.vercel.app/api/game/create
   ```
   Sollte eine JSON-Antwort geben (nicht 404)

2. **Mit curl testen:**
   ```bash
   curl -X POST https://your-preview-url.vercel.app/api/game/create \
     -H "Content-Type: application/json" \
     -d '{"username":"test","difficulty":"easy"}'
   ```

3. **Frontend testen:**
   - Öffne Preview-URL
   - Versuche ein Spiel zu erstellen
   - Prüfe Browser-Console

## Häufige Fehler

### ❌ "404 Not Found" für alle API-Routes
**Ursache:** Root Directory ist auf `client` gesetzt
**Lösung:** Root Directory auf LEER setzen

### ❌ "Cannot find module '@upstash/redis'"
**Ursache:** Install Command installiert nur client-Dependencies
**Lösung:** Install Command = `npm install` (nicht `cd client && npm install`)

### ❌ Functions werden nicht erkannt
**Ursache:** `api/` Verzeichnis wird nicht gesehen
**Lösung:** Root Directory muss leer sein

### ❌ Routes funktionieren nicht
**Ursache:** Routes-Reihenfolge falsch
**Lösung:** API-Routes müssen VOR `/(.*)` stehen

## Debugging

Falls es immer noch nicht funktioniert:

1. **Prüfe Function-Logs:**
   - Vercel Dashboard → Functions → [Function Name] → Logs
   - Suche nach Fehlern

2. **Prüfe Build-Logs:**
   - Deployments → [Deployment] → Build Logs
   - Suche nach Warnings/Errors

3. **Teste lokal mit vercel dev:**
   ```bash
   npm run vercel:dev
   ```
   Dann: `http://localhost:3000/api/game/create`

4. **Prüfe Function-Export:**
   - Functions müssen `module.exports = async (req, res) => {}` exportieren
   - Prüfe `api/game/create.js` etc.
