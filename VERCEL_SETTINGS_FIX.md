# Vercel Settings Fix - Root Directory Fehler

## Fehler
```
The specified Root Directory "dist" does not exist. Please update your Project Settings.
```

## Problem
Das Root Directory ist im Vercel Dashboard auf `dist` gesetzt, sollte aber `client` sein.

## Lösung: Vercel Dashboard Settings

### Schritt 1: Settings → General

**Root Directory:**
```
client
```
(NICHT `dist` - das ist das Output Directory!)

**Build Command:**
```
npm install && npm run build
```

**Output Directory:**
```
dist
```
(Das ist das Verzeichnis, wo Vite das Frontend baut)

**Install Command:**
```
npm install
```

**Framework Preset:**
```
Vite
```

### Schritt 2: Settings → Environment Variables

Stelle sicher, dass diese gesetzt sind:
- `KV_REST_API_URL` = `https://stirred-herring-24466.upstash.io`
- `KV_REST_API_TOKEN` = `AV-SAAIncDI0YWE5NmM4YWE2ZmI0ODkyYjdmOGNhNTAwY2U0NTg1M3AyMjQ0NjY`

**Für alle Environments:** Production, Preview, Development

### Schritt 3: Deployment

Nach den Änderungen:
1. Gehe zu **Deployments**
2. Klicke auf **"Redeploy"** beim neuesten Deployment
3. Oder: Warte auf den nächsten Git Push

## Wichtig: Unterschied Root Directory vs Output Directory

- **Root Directory** = `client` (wo Vercel das Projekt findet)
- **Output Directory** = `dist` (wo das gebaute Frontend liegt)

## Struktur

```
scrabster-pro/          ← Repository Root
└── client/             ← Root Directory für Vercel
    ├── api/            ← API Functions (werden automatisch erkannt)
    ├── src/            ← Frontend Source
    ├── dist/           ← Output Directory (wird beim Build erstellt)
    └── package.json    ← Enthält @upstash/redis
```

## Nach dem Fix

Nachdem du Root Directory auf `client` gesetzt hast:
- ✅ Vercel findet das Projekt
- ✅ Vercel erkennt `client/api/` als Functions
- ✅ Vercel baut das Frontend nach `client/dist/`
- ✅ Vercel serviert `client/dist/` als statische Dateien

## Testen

Nach erfolgreichem Deployment:
- Frontend: `https://your-preview-url.vercel.app/`
- API: `https://your-preview-url.vercel.app/api/game/create`
