// Health Check Endpoint für Debugging
export default async (req, res) => {
  try {
    // CORS Headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    if (req.method === 'OPTIONS') {
      return res.status(200).end();
    }

    const health = {
      status: 'ok',
      timestamp: new Date().toISOString(),
      environment: {
        NODE_ENV: process.env.NODE_ENV,
        hasRedisUrl: !!process.env.KV_REST_API_URL,
        hasRedisToken: !!process.env.KV_REST_API_TOKEN,
      },
      modules: {
        redisClient: 'loaded',
        gameData: 'loaded',
      }
    };

    // Test Redis connection
    try {
      const redisModule = await import('./shared/redisClient.js');
      health.redis = {
        available: true,
        usingRedis: redisModule.useRedis || false,
      };
    } catch (error) {
      health.redis = {
        available: false,
        error: error.message,
      };
    }

    return res.json(health);
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      error: error.message,
      stack: error.stack,
    });
  }
};
