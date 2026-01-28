# Vercel 404 Fix - Finale Lösung

## Problem
- `/api/game/create` gibt 404
- `/` (Frontend) gibt 404

## Ursache
Die `vercel.json` hatte zu viele explizite Routes, die mit der automatischen Function-Erkennung kollidierten.

## Lösung

### 1. Vereinfachte vercel.json

Die neue `vercel.json`:
- Verwendet `builds` nur für das Frontend
- Lässt Vercel Functions im `api/` Verzeichnis automatisch erkennen
- Verwendet einfache Routes ohne Konflikte

### 2. Vercel Dashboard Settings (KRITISCH!)

**Root Directory:** LEER (nicht `client`)

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

### 3. Environment Variables

**Settings → Environment Variables:**
- `KV_REST_API_URL` = `https://stirred-herring-24466.upstash.io`
- `KV_REST_API_TOKEN` = `AV-SAAIncDI0YWE5NmM4YWE2ZmI0ODkyYjdmOGNhNTAwY2U0NTg1M3AyMjQ0NjY`

**Für alle Environments:** Production, Preview, Development

## Deployment

1. **Änderungen committen:**
   ```bash
   git add vercel.json
   git commit -m "fix: Simplify vercel.json for automatic API function detection"
   git push origin vercel-functions-migration
   ```

2. **Vercel deployed automatisch** oder manuell triggern

3. **Testen:**
   - Frontend: `https://your-preview-url.vercel.app/`
   - API: `https://your-preview-url.vercel.app/api/game/create`

## Wie es funktioniert

1. **Frontend Build:**
   - `builds` baut das Frontend aus `client/`
   - Output: `client/dist/`

2. **API Functions:**
   - Vercel erkennt automatisch Functions im `api/` Verzeichnis
   - Route `/api/(.*)` leitet zu `/api/$1` weiter
   - Vercel findet die Functions automatisch

3. **Frontend Routing:**
   - Route `/(.*)` leitet alles andere zu `client/dist/$1` weiter
   - Vue Router handled Client-Side Routing

## Troubleshooting

### ❌ API gibt immer noch 404
**Prüfe:**
- Root Directory = LEER (nicht `client`)
- Functions existieren in `api/game/`
- Functions exportieren `module.exports = async (req, res) => {}`

### ❌ Frontend gibt 404
**Prüfe:**
- Build Command = `cd client && npm install && npm run build`
- Output Directory = `client/dist`
- Build-Logs zeigen erfolgreichen Build

### ❌ Beides gibt 404
**Prüfe:**
- Root Directory = LEER
- Install Command = `npm install`
- Build-Logs auf Fehler prüfen

## Nächste Schritte

1. ✅ `vercel.json` vereinfacht
2. ⚠️ Vercel Dashboard Settings prüfen (siehe oben)
3. ⚠️ Environment Variables setzen (siehe oben)
4. ⚠️ Deployment triggern
5. ⚠️ Testen
