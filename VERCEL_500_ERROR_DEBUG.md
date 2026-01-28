# Vercel 500 Error Debugging

## Problem
API-Endpunkte geben 500-Fehler zurück.

## Mögliche Ursachen

### 1. Environment Variables fehlen
**Prüfe:** Vercel Dashboard → Settings → Environment Variables
- `KV_REST_API_URL` muss gesetzt sein
- `KV_REST_API_TOKEN` muss gesetzt sein

**Für alle Environments:** Production, Preview, Development

### 2. @upstash/redis nicht installiert
**Prüfe:** Build-Logs
- Suche nach: `@upstash/redis`
- Sollte installiert werden

**Lösung:** 
- `client/package.json` muss `@upstash/redis` enthalten
- Build Command muss `npm install` ausführen

### 3. Module nicht gefunden
**Prüfe:** Function-Logs in Vercel Dashboard
- Suche nach: `Cannot find module`
- Prüfe, ob alle require() Statements korrekt sind

### 4. Redis-Verbindungsfehler
**Prüfe:** Function-Logs
- Suche nach: `Redis get error` oder `Redis set error`
- Prüfe Redis-Credentials

## Debugging-Schritte

### Schritt 1: Health Check Endpoint testen

Ich habe einen `/api/health` Endpoint erstellt:

```
GET https://your-preview-url.vercel.app/api/health
```

Dieser zeigt:
- Environment Variables Status
- Redis-Verfügbarkeit
- Module-Status

### Schritt 2: Function-Logs prüfen

1. **Vercel Dashboard → Functions**
2. **Wähle `/api/game/create`**
3. **Öffne "Logs"**
4. **Suche nach:**
   - `Create game error:`
   - `Error stack:`
   - `Error message:`
   - `Redis:`

### Schritt 3: Environment Variables prüfen

**Vercel Dashboard → Settings → Environment Variables:**

Stelle sicher, dass gesetzt sind:
- `KV_REST_API_URL` = `https://stirred-herring-24466.upstash.io`
- `KV_REST_API_TOKEN` = `AV-SAAIncDI0YWE5NmM4YWE2ZmI0ODkyYjdmOGNhNTAwY2U0NTg1M3AyMjQ0NjY`

**Wichtig:** Für alle Environments (Production, Preview, Development)

### Schritt 4: Build-Logs prüfen

**Vercel Dashboard → Deployments → [Neuestes] → Build Logs:**

Suche nach:
- `@upstash/redis` wird installiert
- Keine Fehler bei npm install
- Build erfolgreich

## Häufige Fehler

### ❌ "Cannot find module '@upstash/redis'"
**Ursache:** Package nicht installiert
**Lösung:** 
- Prüfe `client/package.json` - muss `@upstash/redis` enthalten
- Install Command muss `npm install` sein

### ❌ "Redis: Using in-memory fallback"
**Ursache:** Environment Variables fehlen
**Lösung:** 
- Setze `KV_REST_API_URL` und `KV_REST_API_TOKEN` in Vercel Dashboard
- Für alle Environments

### ❌ "Cannot read property 'get' of undefined"
**Ursache:** Module nicht richtig geladen
**Lösung:** 
- Prüfe require() Statements
- Prüfe, ob alle Module existieren

## Verbesserte Error-Logs

Ich habe das Error-Logging verbessert:
- Zeigt jetzt `error.message` und `error.stack`
- In Development wird der Stack-Trace angezeigt

## Nächste Schritte

1. **Health Check testen:**
   ```
   GET /api/health
   ```

2. **Function-Logs prüfen** (siehe oben)

3. **Environment Variables setzen** (siehe oben)

4. **Neues Deployment triggern**

5. **Erneut testen**

## Was ich gemacht habe

1. ✅ Error-Logging verbessert in `create.js`
2. ✅ Health Check Endpoint erstellt: `/api/health`
3. ✅ Dokumentation erstellt

Bitte teste zuerst den `/api/health` Endpoint und prüfe die Function-Logs in Vercel Dashboard!
