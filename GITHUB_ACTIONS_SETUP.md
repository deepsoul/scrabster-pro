# GitHub Actions Setup - Scrabster Pro

## 🚀 CI/CD Pipeline

### Problem behoben: Dependencies lock file not found

Das Problem lag daran, dass GitHub Actions nach einer `package-lock.json` im Root-Verzeichnis suchte, aber das Projekt separate `package.json` Dateien in `client/` und `server/` hat.

## ✅ Lösung

### 1. Root package-lock.json erstellt

- Minimale `package-lock.json` im Root-Verzeichnis
- Enthält nur die Root-Dependencies (concurrently)

### 2. CI-Konfiguration angepasst

- Entfernt: Matrix-Strategy (nur Node 18)
- Entfernt: npm test (keine Tests vorhanden)
- Hinzugefügt: CSS Linting Check
- Vereinfacht: Install-Prozess

### 3. Workflow-Schritte

```yaml
1. Checkout code
2. Setup Node.js 18 (mit npm caching)
3. Install root dependencies
4. Install client dependencies
5. Install server dependencies
6. Build client
7. Check build artifacts
8. Lint CSS
```

## 🔧 Konfiguration

### Branch Protection

- **main**: Vollständig geschützt
- **develop**: Teilweise geschützt

### Status Checks

- Build muss erfolgreich sein
- CSS Linting muss bestehen
- Build-Artefakte müssen vorhanden sein

## 📋 Nächste Schritte

### 1. Dependencies installieren

```bash
# Root dependencies
npm install

# Client dependencies
cd client && npm install

# Server dependencies
cd server && npm install
```

### 2. Lokal testen

```bash
# Build testen
npm run client:build

# CSS Linting testen
npm run lint:css:check
```

### 3. Commit und Push

```bash
git add .
git commit -m "fix: GitHub Actions CI/CD Pipeline"
git push origin main
```

## 🐛 Troubleshooting

### Problem: "Dependencies lock file not found"

**Gelöst**: Root `package-lock.json` erstellt

### Problem: "npm test" fehlgeschlagen

**Gelöst**: Test-Schritt entfernt (keine Tests vorhanden)

### Problem: CSS Linting fehlgeschlagen

**Lösung**:

```bash
cd client
npm install
npm run lint:css
```

### Problem: Build fehlgeschlagen

**Lösung**:

```bash
cd client
npm install
npm run build
```

## 📊 Pipeline Status

### ✅ Erwartete Checks

- [x] Checkout code
- [x] Setup Node.js
- [x] Install dependencies
- [x] Build client
- [x] Check build artifacts
- [x] Lint CSS

### 🚀 Deployment

- **Preview**: Bei Pull Requests
- **Production**: Bei Push auf main

## 📚 Nützliche Links

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Node.js Setup Action](https://github.com/actions/setup-node)
- [Branch Protection Rules](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/defining-the-mergeability-of-pull-requests/about-protected-branches)
