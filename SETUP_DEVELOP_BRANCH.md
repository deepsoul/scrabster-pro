# Setup Develop Branch - Anleitung

## 🎯 Ziel

Erstelle einen `develop` Branch und konfiguriere Branch Protection für `main`.

## 📋 Schritt-für-Schritt Anleitung

### 1. Develop Branch erstellen

#### Option A: Über GitHub Web Interface

1. Gehe zu [GitHub Repository](https://github.com/deepsoul/scrabster-pro)
2. Klicke auf "Branch: main" (oben links)
3. Gib "develop" in das Suchfeld ein
4. Klicke "Create branch: develop from main"

#### Option B: Über Git Command Line

```bash
# Repository klonen (falls noch nicht geschehen)
git clone https://github.com/deepsoul/scrabster-pro.git
cd scrabster-pro

# Develop Branch erstellen
git checkout -b develop
git push -u origin develop
```

### 2. Branch Protection einrichten

#### Main Branch schützen

1. Gehe zu **Settings** → **Branches**
2. Klicke **Add rule** neben "Branch protection rules"
3. Gib "main" als Branch name pattern ein
4. Aktiviere folgende Optionen:
   - ✅ **Require a pull request before merging**
     - ✅ Require approvals: 1
     - ✅ Dismiss stale PR approvals when new commits are pushed
   - ✅ **Require status checks to pass before merging**
     - ✅ Require branches to be up to date before merging
   - ✅ **Require conversation resolution before merging**
   - ✅ **Restrict pushes that create files**
   - ❌ **Allow force pushes**
   - ❌ **Allow deletions**

#### Develop Branch konfigurieren

1. Klicke **Add rule** für einen weiteren Branch
2. Gib "develop" als Branch name pattern ein
3. Aktiviere folgende Optionen:
   - ✅ **Require status checks to pass before merging**
   - ✅ **Require branches to be up to date before merging**
   - ✅ **Restrict pushes that create files**
   - ✅ **Allow force pushes** (für schnelle Fixes)
   - ❌ **Allow deletions**

### 3. GitHub Actions aktivieren

#### CI/CD Pipeline einrichten

1. Gehe zu **Actions** Tab
2. Klicke **Set up a workflow yourself**
3. Benenne die Datei `ci.yml`
4. Kopiere den Inhalt aus `.github/workflows/ci.yml`
5. Committe die Datei

### 4. Branch-Strategie dokumentieren

#### README aktualisieren

Füge folgende Sektion zur README.md hinzu:

```markdown
## 🌳 Branch-Strategie

- **main**: Produktionsreifer Code (geschützt)
- **develop**: Entwicklungsintegration
- **feature/\***: Feature-Entwicklung
- **hotfix/\***: Kritische Bugfixes

Siehe [Git Workflow](GIT_WORKFLOW.md) für Details.
```

### 5. Erste Feature-Entwicklung

#### Feature Branch erstellen

```bash
# Von develop aus
git checkout develop
git pull origin develop
git checkout -b feature/example-feature

# Entwicklung...
git add .
git commit -m "feat: example feature added"
git push origin feature/example-feature
```

#### Pull Request erstellen

1. Gehe zu GitHub Repository
2. Klicke **Compare & pull request**
3. Wähle `feature/example-feature` → `develop`
4. Fülle PR-Template aus
5. Request Review von Teammitgliedern

## 🔧 Konfiguration prüfen

### Branch Protection Status

- [ ] Main Branch ist geschützt
- [ ] Develop Branch ist konfiguriert
- [ ] CI/CD Pipeline läuft
- [ ] PR-Templates sind aktiv

### Test-Workflow

1. Erstelle Feature Branch
2. Mache kleine Änderung
3. Erstelle Pull Request
4. Prüfe, ob Checks laufen
5. Merge nach Review

## 📚 Nützliche Links

- [GitHub Branch Protection](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/defining-the-mergeability-of-pull-requests/about-protected-branches)
- [GitHub Actions](https://docs.github.com/en/actions)
- [Pull Request Templates](https://docs.github.com/en/communities/using-templates-to-encourage-useful-issues-and-pull-requests)

## 🆘 Troubleshooting

### Problem: Branch Protection verhindert Push

**Lösung**: Verwende Pull Requests für alle Änderungen

### Problem: CI/CD läuft nicht

**Lösung**: Prüfe GitHub Actions Tab und Workflow-Dateien

### Problem: PR kann nicht gemergt werden

**Lösung**: Prüfe, ob alle Checks grün sind und Reviews vorhanden sind
