// Redis Client für Upstash Redis
// Fallback auf in-memory Map für lokale Entwicklung

let redis = null;
let useRedis = false;
const fallbackMap = new Map();

// Initialisiere Redis (nur wenn Environment Variables vorhanden sind)
function initRedis() {
  if (redis) return redis; // Bereits initialisiert

  const redisUrl = process.env.UPSTASH_REDIS_REST_URL;
  const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (redisUrl && redisToken) {
    try {
      // @upstash/redis ist ESM-only, daher verwenden wir require mit try-catch
      // In Produktion wird das Package verfügbar sein
      const { Redis } = require('@upstash/redis');
      redis = new Redis({
        url: redisUrl,
        token: redisToken,
      });
      useRedis = true;
      console.log('Redis: Using Upstash Redis');
      return redis;
    } catch (error) {
      console.log('Redis: Package not found, using in-memory fallback');
      console.log('Install @upstash/redis for production: npm install @upstash/redis');
    }
  } else {
    console.log('Redis: Using in-memory fallback (no Redis credentials found)');
  }
  return null;
}

// Redis Helper Functions
async function get(key) {
  const redisInstance = initRedis();
  if (useRedis && redisInstance) {
    try {
      const value = await redisInstance.get(key);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      console.error('Redis get error:', error);
      return fallbackMap.get(key) || null;
    }
  }
  return fallbackMap.get(key) || null;
}

async function set(key, value, options = {}) {
  const redisInstance = initRedis();
  if (useRedis && redisInstance) {
    try {
      const serialized = JSON.stringify(value);
      if (options.ex) {
        // TTL in Sekunden
        await redisInstance.setex(key, options.ex, serialized);
      } else {
        await redisInstance.set(key, serialized);
      }
      return;
    } catch (error) {
      console.error('Redis set error:', error);
      // Fallback zu in-memory
      fallbackMap.set(key, value);
    }
  } else {
    fallbackMap.set(key, value);
  }
}

async function del(key) {
  const redisInstance = initRedis();
  if (useRedis && redisInstance) {
    try {
      await redisInstance.del(key);
      return;
    } catch (error) {
      console.error('Redis del error:', error);
    }
  }
  fallbackMap.delete(key);
}

async function exists(key) {
  const redisInstance = initRedis();
  if (useRedis && redisInstance) {
    try {
      const result = await redisInstance.exists(key);
      return result === 1;
    } catch (error) {
      console.error('Redis exists error:', error);
      return fallbackMap.has(key);
    }
  }
  return fallbackMap.has(key);
}

// Helper: Konvertiere players Array zu Map für interne Verarbeitung
function playersArrayToMap(players) {
  const map = new Map();
  if (Array.isArray(players)) {
    players.forEach(player => {
      map.set(player.id, player);
    });
  }
  return map;
}

// Helper: Konvertiere players Map zu Array für JSON-Serialisierung
function playersMapToArray(players) {
  if (players instanceof Map) {
    return Array.from(players.values());
  }
  return Array.isArray(players) ? players : [];
}

// Game-specific helpers
async function getGameRoom(gameCode) {
  const gameRoom = await get(`game:${gameCode}`);
  if (gameRoom && gameRoom.players) {
    // Konvertiere players Array zu Map für interne Verarbeitung
    gameRoom.players = playersArrayToMap(gameRoom.players);
  }
  return gameRoom;
}

async function setGameRoom(gameCode, gameRoom) {
  // Erstelle Kopie für Serialisierung
  const serializable = { ...gameRoom };
  // Konvertiere players Map zu Array für JSON
  if (gameRoom.players instanceof Map) {
    serializable.players = playersMapToArray(gameRoom.players);
  }
  // TTL: 1 Stunde (3600 Sekunden)
  await set(`game:${gameCode}`, serializable, { ex: 3600 });
}

async function deleteGameRoom(gameCode) {
  await del(`game:${gameCode}`);
}

async function getPlayerConnection(playerId) {
  return await get(`player:${playerId}`);
}

async function setPlayerConnection(playerId, gameCode) {
  // TTL: 1 Stunde
  await set(`player:${playerId}`, gameCode, { ex: 3600 });
}

async function deletePlayerConnection(playerId) {
  await del(`player:${playerId}`);
}

module.exports = {
  get,
  set,
  del,
  exists,
  getGameRoom,
  setGameRoom,
  deleteGameRoom,
  getPlayerConnection,
  setPlayerConnection,
  deletePlayerConnection,
  useRedis,
};
