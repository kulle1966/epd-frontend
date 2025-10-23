# 🚀 EPD Frontend Deployment Anleitung

## Azure Static Web App über Portal erstellen

### Schritt 1: Azure Portal öffnen
- Gehen Sie zu: https://portal.azure.com
- Melden Sie sich mit Ihrem Azure-Account an

### Schritt 2: Static Web App erstellen
1. **Suchen Sie nach "Static Web Apps"** in der Suchleiste
2. **Klicken Sie auf "Erstellen"**
3. **Füllen Sie das Formular aus:**
   - **Subscription:** Ihre aktuelle Subscription
   - **Resource Group:** `epd-extractor-rg` (gleiche wie API)
   - **Name:** `epd-frontend-app`
   - **Plan type:** Free
   - **Region:** `West Europe` (gleiche wie API)
   - **Source:** `Other`

### Schritt 3: Deployment-Details
1. **Deployment details:**
   - **Source:** Other
   - **Location:** Lokale Dateien
2. **Klicken Sie "Review + create"**
3. **Klicken Sie "Create"**

### Schritt 4: Frontend-Dateien hochladen
1. **Warten Sie bis die Static Web App erstellt ist**
2. **Gehen Sie zur erstellten Ressource**
3. **Klicken Sie auf "Upload"** oder **"Manage deployment token"**
4. **Laden Sie die Datei hoch:** `epd-frontend-deploy.zip`

## Alternative: GitHub Deployment

### Voraussetzungen
- GitHub Repository mit Frontend-Dateien
- GitHub Account mit Azure verbinden

### Schritte
1. **Push Frontend zu GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Initial frontend"
   git push origin main
   ```

2. **Static Web App mit GitHub verbinden:**
   - Bei Static Web App Erstellung
   - Source: GitHub
   - Repository auswählen
   - Branch: main
   - Build Details:
     - App location: `/`
     - Output location: `/`

## 📁 Deployment-Dateien

- `index.html` - Hauptanwendung
- `staticwebapp.config.json` - Azure-Konfiguration
- `epd-frontend-deploy.zip` - Deployment-Archiv

## 🔗 Nach dem Deployment

Die Frontend-URL wird etwa so aussehen:
```
https://brave-field-[random].azurestaticapps.net
```

## 🧪 Frontend-Features

✅ **Drag & Drop PDF Upload**
✅ **Live-Fortschrittsanzeige**  
✅ **Responsive Design**
✅ **Detaillierte Ergebnisanzeige**
✅ **CO2-Berechnung pro kg Material**
✅ **Fehlerbehandlung**
✅ **Integration mit Azure Functions API**

## 🔧 Konfiguration

Die Frontend-App verbindet sich automatisch mit:
- **API Endpoint:** `https://epd-extractor-api-2025.azurewebsites.net`
- **Health Check:** `/api/health`
- **Extract Endpoint:** `/api/extract`

## 📞 Support

Bei Problemen prüfen Sie:
1. Azure Functions API Status
2. CORS-Konfiguration
3. Browser-Entwicklerkonsole für Fehler
4. Azure Portal Logs