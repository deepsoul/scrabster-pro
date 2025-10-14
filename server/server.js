const express = require('express');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
// CORS - Vereinfacht da Frontend und Backend auf gleicher Domain
app.use(
  cors({
    origin: (origin, callback) => {
      // In Entwicklung: localhost erlauben
      if (process.env.NODE_ENV !== 'production') {
        return callback(null, true);
      }

      // In Produktion: Nur scrabster-pro.de Domains erlauben
      const allowedOrigins = [
        'https://scrabster-pro.de',
        'https://www.scrabster-pro.de',
        'https://scrabster-pro.vercel.app', // Fallback für Vercel
      ];

      if (origin && allowedOrigins.includes(origin)) {
        console.log('CORS Allowed Origin:', origin);
        return callback(null, origin);
      }

      // Fallback: Origin erlauben wenn nicht gesetzt (z.B. Postman)
      if (!origin) {
        return callback(null, true);
      }

      console.log('CORS Blocked Origin:', origin);
      callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'X-Requested-With',
      'Accept',
      'Origin',
    ],
    optionsSuccessStatus: 200,
  })
);

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
