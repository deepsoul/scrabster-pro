# Vercel Deployment Checklist - API Functions 404 Fix

## Problem
API-Endpunkte geben 404 auf Vercel Preview-Branches, funktionieren aber lokal.

## Checklist

### ✅ 1. Dependencies im Root package.json
- [x] `@upstash/redis` ist im Root `package.json` (bereits vorhanden)

### ✅ 2. vercel.json Konfiguration
- [x] `vercel.json` verwendet einfache Routes (bereits angepasst)
- [x] Routes zeigen auf `/api/$1` für alle API-Requests

### ⚠️ 3. Vercel Dashboard Settings (WICHTIG!)

**Root Directory:**
- Sollte **LEER** sein (nicht `client` oder `server`)
- Vercel muss das Root-Verzeichnis sehen, um `api/` zu erkennen

**Build Command:**
```
cd client && npm install && npm run build
```

**Output Directory:**
```
client/dist
```

**Install Command:**
```
npm install
```
**WICHTIG:** Dies installiert auch Root-Dependencies (`@upstash/redis`)

### ⚠️ 4. Environment Variables in Vercel

Im Vercel Dashboard → Settings → Environment Variables:
- [ ] `KV_REST_API_URL` = `https://stirred-herring-24466.upstash.io`
- [ ] `KV_REST_API_TOKEN` = `AV-SAAIncDI0YWE5NmM4YWE2ZmI0ODkyYjdmOGNhNTAwY2U0NTg1M3AyMjQ0NjY`

**Für alle Environments:** Production, Preview, Development

### ⚠️ 5. Build-Logs prüfen

Nach dem nächsten Deployment:
1. Gehe zu Vercel Dashboard → Deployments
2. Öffne das neueste Deployment
3. Prüfe "Build Logs"
4. Suche nach:
   - `@upstash/redis` wird installiert
   - `api/` Verzeichnis wird erkannt
   - Keine Fehler bei Function-Deployment

### ⚠️ 6. Function-Logs prüfen

1. Gehe zu Vercel Dashboard → Functions
2. Prüfe, ob `/api/game/create` etc. aufgelistet sind
3. Öffne eine Function → Logs
4. Teste die Function direkt in Vercel

## Häufige Probleme

### Problem: "Cannot find module '@upstash/redis'"
**Lösung:** 
- Install Command muss `npm install` sein (nicht nur `cd client && npm install`)
- Root `package.json` muss `@upstash/redis` enthalten

### Problem: Functions werden nicht erkannt
**Lösung:**
- Root Directory muss leer sein
- Functions müssen in `api/` Verzeichnis sein
- Functions müssen `module.exports = async (req, res) => {}` exportieren

### Problem: 404 auf API-Routes
**Lösung:**
- Prüfe Routes in `vercel.json`
- Prüfe, ob Functions in Vercel Dashboard sichtbar sind
- Prüfe Build-Logs auf Fehler

## Testen

Nach dem Deployment:

1. **Direkte Function-URL testen:**
   ```
   https://your-preview-url.vercel.app/api/game/create
   ```
   Sollte eine JSON-Antwort geben (nicht 404)

2. **Mit POST-Request testen:**
   ```bash
   curl -X POST https://your-preview-url.vercel.app/api/game/create \
     -H "Content-Type: application/json" \
     -d '{"username":"test","difficulty":"easy"}'
   ```

3. **Frontend testen:**
   - Öffne die Preview-URL
   - Versuche ein Spiel zu erstellen
   - Prüfe Browser-Console auf Fehler

## Nächste Schritte

1. **Vercel Dashboard Settings prüfen** (siehe oben)
2. **Environment Variables setzen** (siehe oben)
3. **Neues Deployment triggern** (Push zu Branch)
4. **Build-Logs prüfen**
5. **Functions testen**
