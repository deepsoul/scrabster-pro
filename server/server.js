const express = require('express');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(
  cors({
    origin:
      process.env.NODE_ENV === 'production'
        ? [
            'https://scrabster-pro.vercel.app',
            'https://scrabster-pro.vercel.app/',
          ]
        : 'http://localhost:5173',
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

// Nur in lokaler Entwicklung den Server starten
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  });
}
