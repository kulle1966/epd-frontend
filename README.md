# 🏗️ EPD Frontend - Azure Static Web App

Ein benutzerfreundliches Frontend für die EPD (Environmental Product Declaration) Extractor API.

## 🚀 Features

- 📱 **Responsive Design** - Funktioniert auf allen Geräten
- 🔄 **Drag & Drop Upload** - Einfaches Hochladen von EPD-PDFs
- ⚡ **Live Progress** - Echtzeit-Fortschrittsanzeige
- 📊 **Detaillierte Ergebnisse** - CO2-Fußabdruck und Materialdaten
- 🛡️ **Fehlerbehandlung** - Benutzerfreundliche Fehlermeldungen
- 🔗 **API Integration** - Direkte Verbindung zu Azure Functions

## 🏛️ Architektur

```
Frontend (Static Web App) → Azure Functions API → Azure OpenAI
```

- **Frontend:** Azure Static Web Apps
- **API:** Azure Functions (`epd-extractor-api-2025.azurewebsites.net`)
- **AI:** Azure OpenAI für EPD-Datenextraktion

## 📁 Projekt-Struktur

```
epd-frontend/
├── index.html                 # Hauptanwendung
├── api-tests/                 # Bruno API Test Collection
│   ├── bruno.json            # Collection Konfiguration
│   ├── Health Check.bru      # API Health Test
│   ├── Extract EPD - *.bru   # EPD Extraktions-Tests
│   └── environments/         # Test-Umgebungen
├── staticwebapp.config.json   # Azure SWA Konfiguration
├── .env                       # Umgebungsvariablen
├── DEPLOYMENT_ANLEITUNG.md     # Deployment-Anleitung
└── README.md                  # Diese Datei
```

## 🧪 API Testing mit Bruno

Das Repository enthält eine vollständige Bruno API Test Collection unter `api-tests/`.

### Bruno Installation
```bash
# Via Winget
winget install Bruno.Bruno

# Via Chocolatey
choco install bruno
```

### Tests ausführen
1. Bruno öffnen
2. "Open Collection" → `api-tests/` Ordner wählen
3. Tests ausführen:
   - **Health Check** - API-Status prüfen
   - **Extract EPD - Concrete** - Concrete EPD testen
   - **Extract EPD - Door Handle** - Door Handle EPD testen
   - **CORS Preflight Check** - CORS-Validierung

### Verfügbare Test-Environments
- **Production:** `https://epd-extractor-api-2025.azurewebsites.net`

## 🔧 Konfiguration

### API Endpoint
Das Frontend verbindet sich automatisch mit:
```
https://epd-extractor-api-2025.azurewebsites.net
```

### Azure Static Web App Konfiguration
- **Build location:** `/`
- **App location:** `/`
- **Output location:** `/`

## 🚀 Deployment

### GitHub Integration
1. Repository zu GitHub pushen
2. Azure Static Web App erstellen
3. GitHub Repository verknüpfen
4. Automatisches Deployment aktiviert

### Manuelle Deployment
1. ZIP-Archiv erstellen
2. Über Azure Portal hochladen

## 🧪 Lokales Testen

```bash
# Python Server
python -m http.server 8080

# Oder direkt im Browser öffnen
file:///path/to/index.html
```

## 📊 Unterstützte EPD-Formate

- ✅ **Concrete EPDs** - Beton und Zement
- ✅ **Steel EPDs** - Stahl und Metalle  
- ✅ **Door/Window EPDs** - Türen und Fenster
- ✅ **Building Material EPDs** - Verschiedene Baumaterialien

## 🎯 Erwartete Ergebnisse

- **CO2-Fußabdruck:** kg CO2-eq pro kg Material
- **Material-Dichte:** kg/m³ oder spezifische Einheiten
- **GWP-Werte:** A1-A3 Lebenszyklusphasen
- **Produktinformationen:** Name, Hersteller, Standards

## 🔍 API Endpunkte

- `GET /api/health` - API Gesundheitsprüfung
- `POST /api/extract` - EPD-Datenextraktion

## 📞 Support

Bei Problemen prüfen Sie:
1. Azure Functions API Status
2. CORS-Konfiguration  
3. Browser-Entwicklerkonsole
4. Azure Portal Logs

## 📄 Lizenz

Dieses Projekt ist für Demonstrationszwecke erstellt.

---

**Erstellt für:** Matelio KI Showcase  
**API Version:** 1.2.0  
**Frontend Version:** 1.0.0