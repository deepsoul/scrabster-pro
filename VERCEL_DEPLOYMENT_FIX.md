# Vercel Deployment Fix - Commits werden nicht deployed

## Problem
Commits werden nicht mehr auf Vercel deployed, CI/CD zeigt "failure" Status.

## Mögliche Ursachen

### 1. Branch nicht in Vercel konfiguriert
Der Branch `vercel-functions-migration` muss in Vercel aktiviert sein.

**Lösung:**
- Vercel Dashboard → Settings → Git
- Prüfe, ob der Branch `vercel-functions-migration` in der Branch-Liste ist
- Falls nicht: Settings → Git → Production Branch = `main`
- Settings → Git → Preview Branches = Alle Branches aktivieren

### 2. Build-Fehler in Vercel
Die Build-Einstellungen passen nicht zur neuen Struktur.

**Lösung:**
- Vercel Dashboard → Settings → General
- **Root Directory:** LEER (nicht `client`)
- **Build Command:** `cd client && npm install && npm run build`
- **Output Directory:** `client/dist`
- **Install Command:** `npm install`

### 3. vercel.json Fehler
Die `vercel.json` könnte einen Syntax-Fehler haben.

**Prüfen:**
```bash
# JSON validieren
cat vercel.json | python -m json.tool
```

### 4. Dependencies fehlen
`@upstash/redis` muss im Root installiert werden.

**Lösung:**
- Install Command muss `npm install` sein (nicht nur `cd client && npm install`)

## Schritt-für-Schritt Fix

### Schritt 1: Vercel Dashboard prüfen

1. **Gehe zu Vercel Dashboard**
2. **Wähle dein Projekt**
3. **Settings → General:**
   - Root Directory: **LEER**
   - Build Command: `cd client && npm install && npm run build`
   - Output Directory: `client/dist`
   - Install Command: `npm install`

4. **Settings → Git:**
   - Production Branch: `main`
   - Preview Branches: **Alle Branches** aktivieren
   - Oder: Füge `vercel-functions-migration` explizit hinzu

### Schritt 2: Environment Variables prüfen

**Settings → Environment Variables:**
- `KV_REST_API_URL` = `https://stirred-herring-24466.upstash.io`
- `KV_REST_API_TOKEN` = `AV-SAAIncDI0YWE5NmM4YWE2ZmI0ODkyYjdmOGNhNTAwY2U0NTg1M3AyMjQ0NjY`

**Für alle Environments:** Production, Preview, Development

### Schritt 3: Manuelles Deployment triggern

1. **Vercel Dashboard → Deployments**
2. **"Redeploy"** klicken
3. **Oder:** "Deploy" → Branch `vercel-functions-migration` wählen

### Schritt 4: Build-Logs prüfen

1. **Deployments → [Neuestes Deployment] → Build Logs**
2. **Suche nach Fehlern:**
   - `@upstash/redis` wird installiert?
   - `api/` Functions werden erkannt?
   - Build erfolgreich?

## Häufige Fehler

### ❌ "Cannot find module '@upstash/redis'"
**Ursache:** Install Command installiert nur client-Dependencies
**Lösung:** Install Command = `npm install`

### ❌ "404 Not Found" für Frontend
**Ursache:** Root Directory falsch oder Output Directory falsch
**Lösung:** Root Directory = LEER, Output Directory = `client/dist`

### ❌ "404 Not Found" für API
**Ursache:** `api/` Verzeichnis wird nicht erkannt
**Lösung:** Root Directory = LEER (nicht `client`)

### ❌ "Build failed"
**Ursache:** Build Command oder Dependencies fehlen
**Lösung:** Prüfe Build-Logs für spezifische Fehler

## Alternative: Branch zu main mergen

Falls das Problem weiterhin besteht:

1. **Änderungen zu main mergen:**
   ```bash
   git checkout main
   git merge vercel-functions-migration
   git push origin main
   ```

2. **Vercel deployed automatisch** bei Push auf `main`

## Debugging

### Build-Logs prüfen
- Vercel Dashboard → Deployments → [Deployment] → Build Logs
- Suche nach Errors/Warnings

### Function-Logs prüfen
- Vercel Dashboard → Functions
- Prüfe, ob Functions aufgelistet sind

### Lokal testen
```bash
npm run vercel:dev
```
Dann: `http://localhost:3000` testen

## Nächste Schritte

1. **Vercel Dashboard Settings prüfen** (siehe oben)
2. **Environment Variables setzen** (siehe oben)
3. **Manuelles Deployment triggern**
4. **Build-Logs prüfen**
5. **Falls Fehler:** Spezifische Fehlermeldung aus Build-Logs analysieren
