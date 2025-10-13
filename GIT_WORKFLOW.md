# Git Workflow für Scrabster Pro

## 🌳 Branch-Strategie

### Main Branch (`main`)

- **Zweck**: Produktionsreifer Code
- **Schutz**: Vollständig geschützt
- **Merges**: Nur über Pull Requests von `develop`
- **Status**: Immer deploybar

### Develop Branch (`develop`)

- **Zweck**: Integration aller Features
- **Schutz**: Teilweise geschützt
- **Merges**: Features werden hier integriert
- **Status**: Stabile Entwicklungsversion

### Feature Branches

- **Format**: `feature/feature-name`
- **Zweck**: Entwicklung neuer Features
- **Merges**: Nach `develop`
- **Beispiele**:
  - `feature/voice-input`
  - `feature/multiplayer-lobby`
  - `feature/score-system`

### Hotfix Branches

- **Format**: `hotfix/issue-description`
- **Zweck**: Kritische Bugfixes für Produktion
- **Merges**: Nach `main` und `develop`
- **Beispiele**:
  - `hotfix/login-bug`
  - `hotfix/security-patch`

## 🚀 Workflow

### 1. Feature-Entwicklung

```bash
# Neuen Feature-Branch erstellen
git checkout develop
git pull origin develop
git checkout -b feature/neue-funktion

# Entwicklung...
git add .
git commit -m "feat: neue Funktion hinzugefügt"

# Push und Pull Request erstellen
git push origin feature/neue-funktion
```

### 2. Pull Request Workflow

1. **Feature → Develop**: Für neue Features
2. **Develop → Main**: Für Releases
3. **Hotfix → Main**: Für kritische Fixes

### 3. Code Review

- Mindestens 1 Reviewer erforderlich
- Alle Tests müssen bestehen
- Code-Qualität prüfen

## 🔒 Branch Protection Rules

### Main Branch

- ✅ Require pull request reviews
- ✅ Require status checks
- ✅ Require up-to-date branches
- ❌ Allow force pushes
- ❌ Allow deletions

### Develop Branch

- ✅ Require status checks
- ✅ Require up-to-date branches
- ✅ Allow force pushes (für schnelle Fixes)
- ❌ Allow deletions

## 📋 Commit-Konventionen

### Format

```
type(scope): description

[optional body]

[optional footer]
```

### Types

- `feat`: Neue Funktion
- `fix`: Bugfix
- `docs`: Dokumentation
- `style`: Code-Formatierung
- `refactor`: Code-Refactoring
- `test`: Tests hinzufügen/ändern
- `chore`: Build-Tasks, Dependencies

### Beispiele

```
feat(voice): Spracheingabe für Wörter hinzugefügt
fix(game): Timer-Bug in Multiplayer behoben
docs(readme): Deployment-Anleitung aktualisiert
```

## 🧪 CI/CD Pipeline

### Automatische Checks

- **Build**: Frontend und Backend bauen
- **Tests**: Unit und Integration Tests
- **Linting**: Code-Qualität prüfen
- **Security**: Vulnerability Scan

### Deployment

- **Develop**: Preview-Deployment
- **Main**: Produktions-Deployment

## 📚 Nützliche Git-Befehle

### Branch-Management

```bash
# Alle Branches anzeigen
git branch -a

# Branch wechseln
git checkout branch-name

# Neuen Branch erstellen
git checkout -b new-branch

# Branch löschen (lokal)
git branch -d branch-name

# Branch löschen (remote)
git push origin --delete branch-name
```

### Merge-Strategien

```bash
# Merge ohne Fast-Forward
git merge --no-ff feature-branch

# Squash Merge
git merge --squash feature-branch

# Rebase vor Merge
git rebase develop
git checkout develop
git merge feature-branch
```

### Konflikt-Lösung

```bash
# Konflikte anzeigen
git status

# Konflikte lösen
# (Dateien manuell bearbeiten)

# Nach Lösung
git add .
git commit -m "resolve: merge conflicts"
```

## 🎯 Best Practices

### Do's ✅

- Kleine, fokussierte Commits
- Aussagekräftige Commit-Messages
- Regelmäßige Pushes
- Code Reviews durchführen
- Tests vor Merge

### Don'ts ❌

- Direkt in main/develop committen
- Große, unübersichtliche Commits
- Merge ohne Review
- Force Push auf geschützte Branches
- Commits ohne Tests

## 🆘 Troubleshooting

### Branch-Reset

```bash
# Branch auf Remote-Status zurücksetzen
git fetch origin
git reset --hard origin/branch-name
```

### Merge-Konflikte

```bash
# Merge abbrechen
git merge --abort

# Rebase abbrechen
git rebase --abort
```

### Verlorene Commits

```bash
# Reflog anzeigen
git reflog

# Commit wiederherstellen
git checkout commit-hash
git checkout -b recovered-branch
```
