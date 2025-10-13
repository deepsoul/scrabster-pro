const express = require('express');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(
  cors({
    origin: (origin, callback) => {
      // In Entwicklung: localhost Ports erlauben
      if (process.env.NODE_ENV !== 'production') {
        if (!origin || origin.startsWith('http://localhost:')) {
          return callback(null, true);
        }
      }

      // In Produktion: Vercel und Render Domains erlauben
      const allowedOrigins = [
        'https://scrabster-pro.vercel.app',
        'https://scrabster-pro-git-hybrid-deployment-boris-horns-projects.vercel.app',
        'https://scrabster-pro-git-develop-boris-horns-projects.vercel.app',
        'https://scrabster-pro.onrender.com',
      ];

      // Wildcard für alle Vercel Preview URLs
      if (
        origin &&
        (origin.includes('vercel.app') ||
          origin.includes('scrabster-pro') ||
          allowedOrigins.includes(origin))
      ) {
        return callback(null, true);
      }

      // Fallback: Origin erlauben wenn nicht gesetzt (z.B. Postman)
      if (!origin) {
        return callback(null, true);
      }

      callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
  })
);
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
