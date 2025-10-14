const express = require('express');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
// CORS - Erweiterte Konfiguration
app.use(
  cors({
    origin: (origin, callback) => {
      // Debug: Log incoming origin
      console.log('CORS Origin:', origin);
      // In Entwicklung: localhost erlauben
      if (process.env.NODE_ENV !== 'production') {
        return callback(null, true);
      }

      // In Produktion: Custom Domain und Render Domains erlauben (Updated)
      const allowedOrigins = [
        'https://scrabster-pro.de',
        'https://www.scrabster-pro.de',
        'https://scrabster-pro.vercel.app',
        'https://scrabster-pro-git-hybrid-deployment-boris-horns-projects.vercel.app',
        'https://scrabster-pro-git-develop-boris-horns-projects.vercel.app',
        'https://scrabster-pro.onrender.com',
      ];

      // Wildcard für alle Vercel Preview URLs und scrabster-pro Domains
      if (
        origin &&
        (origin.includes('vercel.app') ||
          origin.includes('scrabster-pro') ||
          origin.includes('scrabster-pro.de') ||
          origin.includes('www.scrabster-pro.de') ||
          allowedOrigins.includes(origin))
      ) {
        // Explizit die Origin zurückgeben für korrekte CORS-Header
        console.log('CORS Allowed Origin:', origin);
        return callback(null, origin);
      }

      // Fallback: Origin erlauben wenn nicht gesetzt (z.B. Postman)
      if (!origin) {
        return callback(null, true);
      }

      callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
    exposedHeaders: ['Content-Length', 'X-Foo', 'X-Bar'],
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
  })
);

// Explizite CORS-Header für alle Requests
app.use((req, res, next) => {
  const origin = req.headers.origin;
  console.log('Request Origin:', origin);
  
  if (origin && (
    origin.includes('scrabster-pro.de') ||
    origin.includes('vercel.app') ||
    origin.includes('scrabster-pro')
  )) {
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
