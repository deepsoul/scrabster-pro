# Vercel API Migration - api/ nach client/api/

## Was wurde gemacht

1. ✅ `api/` Ordner nach `client/api/` verschoben
2. ✅ `@upstash/redis` in `client/package.json` installiert
3. ✅ `vercel.json` vereinfacht für Root Directory = `client`

## Vercel Dashboard Settings

### Root Directory
**MUSS auf `client` gesetzt sein** (nicht leer!)

### Build Command
```
npm install && npm run build
```

### Output Directory
```
dist
```

### Install Command
```
npm install
```

### Framework
```
Vite
```

## Struktur

```
client/
├── api/              # ← API Functions (neu hier)
│   ├── game/
│   │   ├── create.js
│   │   ├── join.js
│   │   └── ...
│   └── shared/
│       ├── gameData.js
│       └── redisClient.js
├── src/
├── dist/
└── package.json      # ← Enthält jetzt @upstash/redis
```

## Environment Variables

**Settings → Environment Variables:**
- `KV_REST_API_URL` = `https://stirred-herring-24466.upstash.io`
- `KV_REST_API_TOKEN` = `AV-SAAIncDI0YWE5NmM4YWE2ZmI0ODkyYjdmOGNhNTAwY2U0NTg1M3AyMjQ0NjY`

**Für alle Environments:** Production, Preview, Development

## Deployment

1. **Änderungen committen:**
   ```bash
   git add .
   git commit -m "refactor: Move api/ to client/api/ for Vercel compatibility"
   git push origin vercel-functions-migration
   ```

2. **Vercel Dashboard Settings anpassen:**
   - Root Directory = `client`
   - Build Command = `npm install && npm run build`
   - Output Directory = `dist`

3. **Neues Deployment triggern**

4. **Testen:**
   - Frontend: `https://your-preview-url.vercel.app/`
   - API: `https://your-preview-url.vercel.app/api/game/create`

## Vorteile dieser Struktur

- ✅ Root Directory kann auf `client` gesetzt werden
- ✅ Vercel erkennt `client/api/` automatisch als Functions
- ✅ Alle Dependencies in einem `package.json`
- ✅ Einfacheres Deployment

## Troubleshooting

### ❌ API gibt 404
**Prüfe:**
- Root Directory = `client` (nicht leer!)
- Functions existieren in `client/api/game/`
- `@upstash/redis` ist in `client/package.json`

### ❌ Frontend gibt 404
**Prüfe:**
- Build Command = `npm install && npm run build`
- Output Directory = `dist`
- Build-Logs zeigen erfolgreichen Build

### ❌ "Cannot find module '@upstash/redis'"
**Lösung:**
- `cd client && npm install @upstash/redis`
- Prüfe, ob es in `client/package.json` ist
