# Local Development Fix - Scrabster Pro

## 🐛 Problem

```
Failed to resolve dependency: @rollup/rollup-linux-x64-gnu, present in 'optimizeDeps.include'
Loading PostCSS Plugin failed: Cannot find module 'tailwindcss'
```

## ✅ Lösung

### 1. Dependencies installieren

```bash
# Im Root-Verzeichnis
npm install

# Im Client-Verzeichnis
cd client
npm install

# Im Server-Verzeichnis
cd ../server
npm install
```

### 2. Vite-Konfiguration bereinigt

```javascript
// client/vite.config.js
export default defineConfig({
  plugins: [vue()],
  server: {
    port: 5173,
    proxy: {
      '/socket.io': {
        target: 'http://localhost:3000',
        ws: true,
      },
    },
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    rollupOptions: {
      external: [],
    },
  },
  define: {
    __VUE_OPTIONS_API__: true,
    __VUE_PROD_DEVTOOLS__: false,
  },
  // optimizeDeps entfernt - nicht mehr benötigt
});
```

## 🚀 Lokale Entwicklung starten

### 1. Alle Dependencies installieren

```bash
# Root-Dependencies
npm install

# Client-Dependencies
cd client && npm install && cd ..

# Server-Dependencies
cd server && npm install && cd ..
```

### 2. Entwicklungsserver starten

```bash
# Option 1: Beide gleichzeitig
npm run dev

# Option 2: Getrennt starten
# Terminal 1 - Server
npm run server:dev

# Terminal 2 - Client
npm run client:dev
```

### 3. URLs

- **Frontend**: http://localhost:5173
- **Backend**: http://localhost:3000

## 🔧 Was wurde geändert?

### 1. Vite-Konfiguration bereinigt

```javascript
// Vorher (problematisch)
export default defineConfig({
  // ... andere Konfiguration
  optimizeDeps: {
    include: ['@rollup/rollup-linux-x64-gnu'],  // ← Verursachte Fehler
  },
});

// Nachher (sauber)
export default defineConfig({
  // ... andere Konfiguration
  // optimizeDeps entfernt
});
```

### 2. Dependencies-Installation

```bash
# Alle Dependencies installieren
npm install
cd client && npm install
cd ../server && npm install
```

## 🐛 Weitere Troubleshooting

### Problem: Immer noch Rollup-Fehler

**Lösung**:

```bash
# Client-Dependencies neu installieren
cd client
rm -rf node_modules package-lock.json
npm install
```

### Problem: Tailwind CSS nicht gefunden

**Lösung**:

```bash
# Client-Dependencies prüfen
cd client
npm list tailwindcss
npm install tailwindcss@latest
```

### Problem: PostCSS-Fehler

**Lösung**:

```bash
# PostCSS-Dependencies prüfen
cd client
npm list postcss
npm install postcss@latest autoprefixer@latest
```

### Problem: Socket.IO-Verbindung

**Lösung**:

```bash
# Server starten
cd server
npm run dev

# Client starten (in anderem Terminal)
cd client
npm run dev
```

## 📊 Erwartete Ausgabe

### ✅ Erfolgreicher Start:

```
> scrabster-pro@1.0.0 client:dev
> cd client && npm run dev

> scrabster-pro-client@1.0.0 dev
> vite

  VITE v5.0.0  ready in 500 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
  ➜  press h to show help
```

### ✅ Server-Start:

```
> scrabster-pro@1.0.0 server:dev
> cd server && npm run dev

> scrabster-pro-server@1.0.0 dev
> nodemon server.js

[nodemon] 2.0.22
[nodemon] to restart at any time, enter `rs`
[nodemon] watching path(s): *.*
[nodemon] watching extensions: js
[nodemon] starting `node server.js`
Server läuft auf Port 3000
Socket.IO Server gestartet
```

## 🎮 Spiel testen

### 1. Browser öffnen

- Gehe zu http://localhost:5173

### 2. Spiel starten

- Username eingeben
- Spiel erstellen oder beitreten
- Wörter eingeben oder Sprache verwenden

### 3. Multiplayer testen

- Mehrere Browser-Tabs öffnen
- Verschiedene Usernames verwenden
- Gleichen Game Code verwenden

## 📚 Nützliche Links

- [Vite Development Server](https://vitejs.dev/guide/development.html)
- [Vue 3 Development](https://vuejs.org/guide/quick-start.html)
- [Socket.IO Client](https://socket.io/docs/v4/client-api/)
- [Tailwind CSS](https://tailwindcss.com/docs/installation)
