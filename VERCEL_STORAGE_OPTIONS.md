# Vercel Storage Optionen - Kostenlose Alternativen

## Problem: In-Memory Speicher bei Serverless Functions

Bei Vercel Functions (serverless) läuft jede Function in einer eigenen Instanz. Der in-memory Speicher (`gameRooms` Map) existiert nur im RAM einer Instanz. Wenn verschiedene Requests auf verschiedene Instanzen gehen, sehen sie nicht die gleichen Daten.

### Beispiel-Problem:
```
Spieler A → Function Instanz 1 → sieht Spiel "ABC123"
Spieler B → Function Instanz 2 → sieht Spiel "ABC123" NICHT (andere Instanz!)
```

## Lösung: Externer Speicher

Ein externer Speicher wird von allen Function-Instanzen geteilt.

## Kostenlose Optionen

### 1. Vercel KV (Empfohlen für Vercel) ⭐

**Vorteile:**
- Nahtlose Integration mit Vercel
- Sehr einfach zu verwenden
- Schnell (Edge-Netzwerk)

**Kostenlos:**
- 30.000 Reads/Tag
- 1.000 Writes/Tag
- 256 MB Storage

**Setup:**
1. In Vercel Dashboard: Storage → Create → KV
2. Environment Variable `KV_REST_API_URL` wird automatisch gesetzt
3. Code-Beispiel siehe unten

**Dokumentation:** https://vercel.com/docs/storage/vercel-kv

---

### 2. Upstash Redis

**Vorteile:**
- Redis-kompatibel (Standard-Tool)
- Sehr schnell
- Gute Dokumentation

**Kostenlos:**
- 10.000 Commands/Tag
- 256 MB Storage

**Setup:**
1. Account auf https://upstash.com/ erstellen
2. Redis Database erstellen
3. Connection String als Environment Variable setzen

**Dokumentation:** https://docs.upstash.com/redis

---

### 3. Supabase

**Vorteile:**
- PostgreSQL (SQL-Datenbank)
- Sehr flexibel
- Viele Features (Auth, Storage, etc.)

**Kostenlos:**
- 500 MB Datenbank
- 2 GB Bandwidth/Monat

**Setup:**
1. Account auf https://supabase.com/ erstellen
2. Projekt erstellen
3. Connection String als Environment Variable setzen

**Dokumentation:** https://supabase.com/docs

---

### 4. MongoDB Atlas

**Vorteile:**
- NoSQL-Datenbank
- Sehr flexibel
- Gute Dokumentation

**Kostenlos:**
- 512 MB Storage
- Shared Cluster

**Setup:**
1. Account auf https://www.mongodb.com/cloud/atlas erstellen
2. Free Cluster erstellen
3. Connection String als Environment Variable setzen

**Dokumentation:** https://docs.atlas.mongodb.com/

---

### 5. PlanetScale

**Vorteile:**
- MySQL-kompatibel
- Serverless
- Branching (wie Git)

**Kostenlos:**
- 1 Branch
- 1 GB Storage
- 1 Billion Rows Read/Monat

**Setup:**
1. Account auf https://planetscale.com/ erstellen
2. Database erstellen
3. Connection String als Environment Variable setzen

**Dokumentation:** https://docs.planetscale.com/

---

## Code-Beispiel: Vercel KV Integration

### Installation:
```bash
npm install @vercel/kv
```

### gameData.js anpassen:
```javascript
import { kv } from '@vercel/kv';

// Statt Map verwenden wir KV
async function getGameRoom(gameCode) {
  return await kv.get(`game:${gameCode}`);
}

async function setGameRoom(gameCode, gameRoom) {
  await kv.set(`game:${gameCode}`, gameRoom, { ex: 3600 }); // 1 Stunde TTL
}

async function deleteGameRoom(gameCode) {
  await kv.del(`game:${gameCode}`);
}
```

---

## Empfehlung

Für dieses Projekt: **Vercel KV**
- Einfachste Integration
- Perfekt für Vercel
- Kostenlos für kleine/mittlere Projekte
- Schnell genug für Echtzeit-Spiele

Falls mehr Features benötigt werden: **Supabase** oder **MongoDB Atlas**
