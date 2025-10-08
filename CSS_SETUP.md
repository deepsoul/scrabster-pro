# CSS Setup & Linting - Scrabster Pro

## 🎨 CSS-Konfiguration

### Tailwind CSS

Das Projekt verwendet Tailwind CSS für das Styling. Die Konfiguration ist in `tailwind.config.js` definiert.

### Stylelint

Stylelint wird für CSS-Linting verwendet und ist so konfiguriert, dass es Tailwind CSS Direktiven erkennt.

## 🔧 VS Code Konfiguration

### Empfohlene Extensions

Installiere die folgenden VS Code Extensions für die beste Entwicklungserfahrung:

```json
{
  "recommendations": [
    "bradlc.vscode-tailwindcss",
    "stylelint.vscode-stylelint",
    "Vue.volar",
    "Vue.vscode-typescript-vue-plugin",
    "esbenp.prettier-vscode"
  ]
}
```

### VS Code Settings

Die `.vscode/settings.json` Datei konfiguriert:

- CSS-Validierung für Tailwind CSS
- Tailwind CSS IntelliSense
- Custom CSS Data für Tailwind Direktiven

## 📝 CSS Linting

### Scripts

```bash
# CSS Linting mit Auto-Fix
npm run lint:css

# CSS Linting ohne Auto-Fix (nur prüfen)
npm run lint:css:check
```

### Konfiguration

Die Stylelint-Konfiguration in `.stylelintrc.json`:

- Erkennt Tailwind CSS Direktiven (`@tailwind`, `@apply`, `@layer`)
- Ignoriert unbekannte At-Rules für Tailwind
- Unterstützt Vue-Dateien

## 🎯 Tailwind CSS Direktiven

### Unterstützte Direktiven

- `@tailwind` - Tailwind Styles einbinden
- `@apply` - Utility Classes inline verwenden
- `@layer` - Styles in Buckets organisieren
- `@responsive` - Responsive Varianten generieren
- `@screen` - Media Queries mit Breakpoint-Namen
- `@variants` - Varianten für eigene Utilities

### Beispiel

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer components {
  .btn-primary {
    @apply bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded;
  }
}
```

## 🐛 Troubleshooting

### Problem: "Unknown at rule @tailwindcss"

**Lösung**:

1. Installiere die "Tailwind CSS IntelliSense" Extension
2. Stelle sicher, dass `.vscode/settings.json` geladen ist
3. Restart VS Code

### Problem: Stylelint findet keine Tailwind Direktiven

**Lösung**:

1. Installiere die Stylelint Dependencies: `npm install`
2. Prüfe die `.stylelintrc.json` Konfiguration
3. Führe `npm run lint:css` aus

### Problem: IntelliSense funktioniert nicht

**Lösung**:

1. Installiere "Tailwind CSS IntelliSense" Extension
2. Prüfe die `tailwind.config.js` Datei
3. Stelle sicher, dass CSS-Dateien als "tailwindcss" erkannt werden

## 📚 Nützliche Links

- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Stylelint Documentation](https://stylelint.io/)
- [VS Code Tailwind CSS Extension](https://marketplace.visualstudio.com/items?itemName=bradlc.vscode-tailwindcss)
- [Stylelint VS Code Extension](https://marketplace.visualstudio.com/items?itemName=stylelint.vscode-stylelint)
