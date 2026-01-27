# Vercel Root Directory Fix - Frontend 404 beheben

## Problem
Nach dem Löschen des Root Directory-Werts (von "client" auf leer) bekommst du eine 404 für die gesamte Seite.

## Ursache
Wenn Root Directory leer ist, muss Vercel wissen:
1. Wo das Frontend gebaut wird (`client/dist`)
2. Wie die Routes konfiguriert sind

## Lösung

### 1. Vercel Dashboard Settings

**Root Directory:** LEER (✓ bereits gemacht)

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

### 2. vercel.json wurde angepasst

Ich habe die `vercel.json` angepasst:
- Explizite Route für `/index.html` hinzugefügt
- `rewrites` hinzugefügt als Fallback
- Alle API-Routes bleiben explizit definiert

### 3. Deployment

Nach den Änderungen:

```bash
git add vercel.json
git commit -m "Fix frontend routes when root directory is empty"
git push origin vercel-functions-migration
```

## Alternative: Root Directory auf "client" lassen

Falls das Problem weiterhin besteht, kannst du:

### Option A: Root Directory = "client" + API-Functions anders strukturieren

1. **Root Directory:** `client`
2. **API-Functions** in `client/api/` verschieben
3. Oder: Separate Vercel-Projekte (Frontend + Backend)

### Option B: Root Directory leer + Build-Einstellungen anpassen

**Root Directory:** LEER

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
npm install && cd client && npm install
```

## Testen

Nach dem Deployment:

1. **Frontend:** `https://your-preview-url.vercel.app/`
   - Sollte die App laden (nicht 404)

2. **API:** `https://your-preview-url.vercel.app/api/game/create`
   - Sollte eine JSON-Antwort geben (nicht 404)

## Debugging

Falls es immer noch nicht funktioniert:

1. **Build-Logs prüfen:**
   - Vercel Dashboard → Deployments → [Neuestes] → Build Logs
   - Prüfe, ob `client/dist` erstellt wird
   - Prüfe, ob `api/` Functions erkannt werden

2. **Function-Logs prüfen:**
   - Vercel Dashboard → Functions
   - Prüfe, ob API-Functions aufgelistet sind

3. **File-Structure prüfen:**
   - Nach dem Build sollte `client/dist/` existieren
   - `api/` sollte im Root existieren

## Empfehlung

**Für jetzt:** Root Directory LEER lassen + Build-Einstellungen wie oben

**Falls das nicht funktioniert:** Root Directory = `client` + API-Functions in `client/api/` verschieben
