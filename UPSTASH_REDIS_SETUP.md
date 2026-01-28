# Upstash Redis Setup für Vercel Functions

## Wichtig: Vercel KV ist nicht mehr verfügbar!

Vercel KV wurde im Dezember 2024 eingestellt. Wir verwenden jetzt **Upstash Redis** als Alternative.

## Setup-Schritte

### 1. Upstash Redis über Vercel Marketplace installieren

1. Gehe zu deinem Vercel Dashboard
2. Wähle dein Projekt aus
3. Gehe zu **Integrations** → **Browse Marketplace**
4. Suche nach **"Upstash"**
5. Klicke auf **"Install"** bei **Upstash Redis**
6. Wähle eine Option:
   - **Create New Upstash Account**: Vercel verwaltet dein Upstash-Konto
   - **Link Existing Upstash Account**: Verbinde ein bestehendes Konto

### 2. Database konfigurieren

Nach der Installation:
- Wähle einen **Database-Namen**
- Wähle eine **Region** (z.B. `eu-central-1` für Deutschland)
- Wähle den **Free Plan** (10.000 Commands/Tag, 256 MB Storage)

### 3. Environment Variables

Vercel setzt automatisch folgende Environment Variables:
- `UPSTASH_REDIS_REST_URL` oder `KV_REST_API_URL`
- `UPSTASH_REDIS_REST_TOKEN` oder `KV_REST_API_TOKEN`

**Hinweis:** Je nach Upstash-Konfiguration können die Variablen entweder `UPSTASH_*` oder `KV_*` heißen. Der Code unterstützt beide Varianten automatisch.

Diese sind automatisch in allen Vercel Functions verfügbar.

### 4. Package installieren

Das `@upstash/redis` Package muss installiert werden:

```bash
npm install @upstash/redis
```

**Wichtig:** Installiere es im Root-Verzeichnis (nicht in `client/` oder `server/`), da die Vercel Functions im Root laufen.

### 5. Lokale Entwicklung

Für lokale Entwicklung mit `vercel dev`:

1. Erstelle eine `.env.local` Datei im Root-Verzeichnis
2. Kopiere die Environment Variables aus dem Vercel Dashboard:
   ```
   KV_REST_API_URL=https://...
   KV_REST_API_TOKEN=...
   ```
   
   Oder falls vorhanden:
   ```
   UPSTASH_REDIS_REST_URL=https://...
   UPSTASH_REDIS_REST_TOKEN=...
   ```

**Oder:** Ohne Redis funktioniert die App auch lokal mit in-memory Fallback (siehe `api/shared/redisClient.js`).

## Kostenloser Plan

- **10.000 Commands/Tag** (Reads + Writes)
- **256 MB Storage**
- **Unbegrenzte Databases**

Für kleine/mittlere Projekte völlig ausreichend!

## Code-Integration

Die Integration ist bereits implementiert in:
- `api/shared/redisClient.js` - Redis Client mit Fallback
- Alle API-Functions verwenden jetzt Redis statt in-memory Map

## Fallback-Verhalten

Wenn Redis nicht verfügbar ist (z.B. lokal ohne `.env.local`), verwendet die App automatisch einen in-memory Fallback. Das funktioniert für Tests, aber **nicht für Produktion** mit mehreren Function-Instanzen.

## Troubleshooting

### "Package @upstash/redis not found"
- Führe `npm install @upstash/redis` im Root-Verzeichnis aus

### "Redis credentials not found"
- Prüfe, ob die Environment Variables im Vercel Dashboard gesetzt sind
- Für lokale Entwicklung: Erstelle `.env.local` mit den Credentials

### "Redis get/set error"
- Prüfe die Upstash Console auf Fehler
- Prüfe, ob das tägliche Limit erreicht wurde (10.000 Commands)

## Weitere Informationen

- [Upstash Redis Dokumentation](https://docs.upstash.com/redis)
- [Vercel Upstash Integration](https://vercel.com/integrations/upstash)
- [Upstash Console](https://console.upstash.com/)
