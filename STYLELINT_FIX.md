# Stylelint Fix - Scrabster Pro

## 🐛 Problem

```
you should use the "customSyntax" option when linting something other than CSS
Unknown word currentUser  CssSyntaxError
Unexpected quotes around "Inter"         font-family-name-quotes
Expected modern color-function notation  color-function-notation
Expected "0.1" to be "10%"               alpha-value-notation
```

## ✅ Lösung

### 1. Stylelint-Konfiguration erweitert

```json
{
  "extends": ["stylelint-config-standard", "stylelint-config-tailwindcss"],
  "customSyntax": "postcss-html", // ← Für Vue-Dateien
  "rules": {
    "font-family-name-quotes": "always-where-required",
    "color-function-notation": "modern",
    "alpha-value-notation": "number"
  }
}
```

### 2. PostCSS-HTML Dependency hinzugefügt

```json
{
  "devDependencies": {
    "postcss-html": "^1.5.0" // ← Für Vue-Syntax
  }
}
```

### 3. CSS-Probleme behoben

```css
/* Vorher */
font-family: 'Inter', system-ui, sans-serif;
text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
background: rgba(255, 255, 255, 0.1);

/* Nachher */
font-family: Inter, system-ui, sans-serif;
text-shadow: 0 2px 4px rgb(0 0 0 / 10%);
background: rgb(255 255 255 / 10%);
```

## 🔧 Was wurde geändert?

### 1. Stylelint-Konfiguration (.stylelintrc.json)

```json
{
  "extends": ["stylelint-config-standard", "stylelint-config-tailwindcss"],
  "customSyntax": "postcss-html", // ← Neu: Für Vue-Dateien
  "rules": {
    "at-rule-no-unknown": [
      true,
      {
        "ignoreAtRules": [
          "tailwind",
          "apply",
          "layer",
          "responsive",
          "screen",
          "variants"
        ]
      }
    ],
    "declaration-block-trailing-semicolon": null,
    "no-descending-specificity": null,
    "function-no-unknown": [
      true,
      {
        "ignoreFunctions": ["theme", "screen"]
      }
    ],
    "font-family-name-quotes": "always-where-required", // ← Neu
    "color-function-notation": "modern", // ← Neu
    "alpha-value-notation": "number" // ← Neu
  }
}
```

### 2. Client package.json erweitert

```json
{
  "devDependencies": {
    "@vitejs/plugin-vue": "^4.5.0",
    "vite": "^5.0.0",
    "tailwindcss": "^3.3.6",
    "autoprefixer": "^10.4.16",
    "postcss": "^8.4.32",
    "postcss-html": "^1.5.0", // ← Neu: Für Vue-Syntax
    "stylelint": "^15.11.0",
    "stylelint-config-standard": "^34.0.0",
    "stylelint-config-tailwindcss": "^0.0.7"
  }
}
```

### 3. CSS-Styles modernisiert (style.css)

```css
/* Font-Family ohne Anführungszeichen */
html {
  font-family: Inter, system-ui, sans-serif; // ← Geändert
}

/* Moderne Farb-Notation */
.text-shadow {
  text-shadow: 0 2px 4px rgb(0 0 0 / 10%); // ← Geändert
}

.glass {
  backdrop-filter: blur(10px);
  background: rgb(255 255 255 / 10%); // ← Geändert
}
```

## 🚀 Nächste Schritte

### 1. Dependencies installieren

```bash
cd client
npm install
```

### 2. Linting testen

```bash
# Linting mit Fix
npm run lint:css

# Linting prüfen
npm run lint:css:check
```

### 3. Commit und Push

```bash
git add .
git commit -m "fix: Stylelint configuration for Vue files and CSS rules"
git push origin main
```

### 4. GitHub Actions prüfen

- Gehe zu GitHub → Actions
- Prüfe, ob der Linting-Schritt jetzt erfolgreich läuft

## 🐛 Weitere Troubleshooting

### Problem: Immer noch Vue-Syntax-Fehler

**Lösung**:

```json
// .stylelintrc.json
{
  "customSyntax": "postcss-html",
  "overrides": [
    {
      "files": ["*.vue"],
      "customSyntax": "postcss-html"
    }
  ]
}
```

### Problem: CSS-Regeln zu streng

**Lösung**:

```json
// .stylelintrc.json
{
  "rules": {
    "font-family-name-quotes": null,
    "color-function-notation": null,
    "alpha-value-notation": null
  }
}
```

### Problem: Tailwind-Directives nicht erkannt

**Lösung**:

```json
// .stylelintrc.json
{
  "rules": {
    "at-rule-no-unknown": [
      true,
      {
        "ignoreAtRules": [
          "tailwind",
          "apply",
          "layer",
          "responsive",
          "screen",
          "variants",
          "theme",
          "screen"
        ]
      }
    ]
  }
}
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
9. Build client
10. Check build artifacts
11. **Lint CSS** ✅ (jetzt erfolgreich)

### ⏱️ Geschätzte Zeit:

- **Mit Stylelint-Fix**: ~3-4 Minuten
- **Ohne Stylelint-Fix**: Fehler

## 📚 Nützliche Links

- [Stylelint Vue Support](https://stylelint.io/user-guide/usage/css-in-js)
- [PostCSS HTML](https://github.com/ota-meshi/postcss-html)
- [Stylelint Rules](https://stylelint.io/user-guide/rules)
- [Modern CSS Color Functions](https://developer.mozilla.org/en-US/docs/Web/CSS/color_value)
