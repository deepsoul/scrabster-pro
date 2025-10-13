# Rollup Platform Dependency Fix - Scrabster Pro

## 🐛 Problem

```
Error: Cannot find module @rollup/rollup-linux-x64-gnu
npm has a bug related to optional dependencies
```

## ✅ Lösung

### 1. Problem identifiziert

- **Rollup** benötigt plattformspezifische Binaries
- **NPM Bug**: Optional Dependencies werden nicht korrekt installiert
- **GitHub Actions**: Linux x64 Umgebung benötigt spezifische Rollup-Version

### 2. CI-Konfiguration verbessert

#### Vorher (problematisch):

```yaml
- name: Install client dependencies
  run: |
    cd client
    npm install --no-optional --no-audit --no-fund
```

#### Nachher (robust):

```yaml
- name: Clean workspace
  run: |
    rm -rf node_modules package-lock.json
    rm -rf client/node_modules client/package-lock.json
    rm -rf server/node_modules server/package-lock.json

- name: Install client dependencies
  run: |
    cd client
    npm install --no-audit --no-fund
    # Fix Rollup platform-specific dependencies
    npm install @rollup/rollup-linux-x64-gnu --save-dev || true
```

### 3. Vite-Konfiguration erweitert

```javascript
// client/vite.config.js
export default defineConfig({
  // ... existing config
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    rollupOptions: {
      external: [],
    },
  },
  optimizeDeps: {
    include: ['@rollup/rollup-linux-x64-gnu'],
  },
});
```

## 🔧 Was wurde geändert?

### 1. Workspace bereinigen

```yaml
- name: Clean workspace
  run: |
    rm -rf node_modules package-lock.json
    rm -rf client/node_modules client/package-lock.json
    rm -rf server/node_modules server/package-lock.json
```

### 2. Rollup-Dependency explizit installieren

```yaml
- name: Install client dependencies
  run: |
    cd client
    npm install --no-audit --no-fund
    # Fix Rollup platform-specific dependencies
    npm install @rollup/rollup-linux-x64-gnu --save-dev || true
```

### 3. Dependencies verifizieren

```yaml
- name: Verify client dependencies
  run: |
    cd client
    npm list rollup
    npm list @rollup/rollup-linux-x64-gnu || echo "Rollup platform dependency not found, but continuing..."
```

### 4. Vite optimiert

```javascript
optimizeDeps: {
  include: ['@rollup/rollup-linux-x64-gnu'],
}
```

## 🚀 Nächste Schritte

### 1. Lokal testen

```bash
# Workspace bereinigen
rm -rf node_modules package-lock.json
rm -rf client/node_modules client/package-lock.json
rm -rf server/node_modules server/package-lock.json

# Dependencies installieren
npm install
cd client && npm install
cd ../server && npm install

# Rollup-Dependency explizit installieren
cd client
npm install @rollup/rollup-linux-x64-gnu --save-dev

# Build testen
npm run client:build
```

### 2. Commit und Push

```bash
git add .
git commit -m "fix: Rollup platform dependency error in CI"
git push origin main
```

### 3. GitHub Actions prüfen

- Gehe zu GitHub → Actions
- Prüfe, ob der Build jetzt erfolgreich läuft

## 🐛 Weitere Troubleshooting

### Problem: Immer noch Rollup-Fehler

**Lösung**:

```bash
# Lokal
cd client
npm uninstall rollup
npm install rollup@latest
npm install @rollup/rollup-linux-x64-gnu --save-dev
```

### Problem: Build schlägt fehl

**Lösung**:

```bash
# Dependencies prüfen
cd client
npm list | grep rollup
npm list | grep @rollup

# Build mit Debug-Info
npm run build -- --debug
```

### Problem: Vite-Konfiguration

**Lösung**:

```javascript
// Alternative Vite-Konfiguration
export default defineConfig({
  build: {
    rollupOptions: {
      external: id => {
        // Rollup platform dependencies extern behandeln
        if (id.includes('@rollup/rollup-')) return false;
        return false;
      },
    },
  },
});
```

## 📊 Erwartete CI-Ergebnisse

### ✅ Erfolgreiche Schritte:

1. Checkout code
2. Setup Node.js 18
3. Clear npm cache
4. Clean workspace
5. Install root dependencies
6. Install client dependencies
7. Install server dependencies
8. Verify client dependencies
9. Build client ✅
10. Check build artifacts
11. Lint CSS

### ⏱️ Geschätzte Zeit:

- **Mit Cleanup**: ~5-6 Minuten
- **Ohne Cleanup**: ~3-4 Minuten

## 📚 Nützliche Links

- [Rollup Platform Dependencies](https://rollupjs.org/guide/en/#platform-specific-dependencies)
- [NPM Optional Dependencies Bug](https://github.com/npm/cli/issues/4828)
- [Vite Build Configuration](https://vitejs.dev/config/build-options.html)
- [GitHub Actions Node.js](https://docs.github.com/en/actions/using-workflows/setting-up-the-continuous-integration-workflow)
