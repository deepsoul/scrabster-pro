const express = require('express');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
// CORS - Temporär alle Origins erlauben für Debugging
app.use(
  cors({
    origin: true, // Alle Origins erlauben
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'X-Requested-With',
      'Accept',
      'Origin',
    ],
    exposedHeaders: ['Content-Length', 'X-Foo', 'X-Bar'],
    optionsSuccessStatus: 200,
  })
);

// Debug: CORS-Header für alle Requests loggen
app.use((req, res, next) => {
  const origin = req.headers.origin;
  console.log('Request Origin:', origin);
  console.log('Response Headers before:', res.getHeaders());
  
  // Explizit CORS-Header setzen
  if (origin) {
    res.header('Access-Control-Allow-Origin', origin);
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept, Origin');
    console.log('CORS Headers set for:', origin);
  }
  
  next();
});

// Entfernt - doppelte CORS-Middleware verursacht Konflikte
app.use(express.json());

// Import API routes
const gameApi = require('./api/game');

// Use API routes
app.use('/api', gameApi);

// Serve static files from client dist
app.use(express.static(path.join(__dirname, '../client/dist')));

// Fallback für SPA
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/dist/index.html'));
});

// Server starten (sowohl lokal als auch in Produktion)
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});
