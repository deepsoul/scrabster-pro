# Vercel CLI SSL-Zertifikatsfehler beheben

## Problem
```
Error: request to https://vercel.com/.well-known/openid-configuration failed, 
reason: self-signed certificate in certificate chain
```

Dieser Fehler tritt auf, wenn:
- Ein Corporate Proxy/Firewall selbst-signierte Zertifikate verwendet
- Die Vercel CLI die SSL-Verbindung nicht validieren kann

## Lösungen

### Option 1: SSL-Validierung temporär deaktivieren (Nur für Entwicklung!)

**Warnung:** Dies ist unsicher und sollte nur für lokale Entwicklung verwendet werden!

```bash
# Für eine einzelne Session:
NODE_TLS_REJECT_UNAUTHORIZED=0 npx vercel dev

# Oder dauerhaft in .env.local (nicht empfohlen):
echo "NODE_TLS_REJECT_UNAUTHORIZED=0" >> .env.local
```

### Option 2: Corporate CA-Zertifikat installieren

Falls du in einem Unternehmensnetzwerk bist:

1. Frage deinen IT-Admin nach dem Corporate CA-Zertifikat
2. Speichere es als `corporate-ca.crt`
3. Setze die Environment Variable:
   ```bash
   export NODE_EXTRA_CA_CERTS=/path/to/corporate-ca.crt
   npx vercel dev
   ```

### Option 3: Ohne `vercel dev` testen (Empfohlen!)

Du kannst die App auch ohne `vercel dev` lokal testen:

#### A) Mit dem normalen Express-Server (wie vorher):
```bash
npm run dev
```
Dies startet den Express-Server auf `localhost:3000` und das Frontend auf `localhost:5173`.

**Hinweis:** Der Express-Server verwendet noch die alte in-memory Map, nicht Redis.

#### B) Direkt auf Vercel deployen und dort testen:

1. Committe deine Änderungen:
   ```bash
   git add .
   git commit -m "Add Upstash Redis integration"
   git push origin vercel-functions-migration
   ```

2. Deploye auf Vercel:
   - Im Vercel Dashboard: Deployments → New Deployment
   - Oder: Vercel erkennt automatisch den Push und deployed

3. Teste direkt auf der Vercel-URL

### Option 4: Vercel Login über Browser

Manchmal funktioniert der Login über den Browser besser:

```bash
npx vercel login
```

Dies öffnet einen Browser, wo du dich anmelden kannst.

## Empfehlung

**Für lokale Entwicklung:**
- Verwende `npm run dev` (Express-Server) für schnelle Tests
- Oder Option 1 (NODE_TLS_REJECT_UNAUTHORIZED=0) nur wenn nötig

**Für Produktion:**
- Deploye direkt auf Vercel
- Die Environment Variables werden automatisch gesetzt
- Redis funktioniert dann automatisch

## Testen ohne Vercel CLI

Die Redis-Integration funktioniert auch ohne `vercel dev`:

1. **Lokal mit Fallback:** Ohne `.env.local` verwendet die App automatisch in-memory Fallback
2. **Mit Redis lokal:** Mit `.env.local` (bereits erstellt) verwendet die App Redis
3. **In Produktion:** Vercel setzt die Environment Variables automatisch

## Alternative: Lokaler Test mit Express-Server

Falls du die Redis-Integration lokal testen möchtest, kannst du auch einen kleinen Test-Server erstellen, der die Vercel Functions simuliert. Aber für die meisten Fälle reicht es, direkt auf Vercel zu deployen und dort zu testen.
