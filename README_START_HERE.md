# 🎲 Tournament Manager - Fullstack Application

[![Status](https://img.shields.io/badge/Status-Ready%20for%20Local%20Run-brightgreen)]()
[![Setup](https://img.shields.io/badge/Setup-Complete-blue)]()
[![Build](https://img.shields.io/badge/Build-Passing-success)]()

En medeltida-inspirerad fullstack-webbapplikation för att hantera turneringar och spel med **JWT-baserad autentisering**.

---

## 🚀 Snabbstart (1 minut)

### 📋 Förutsättningar
- .NET 10.0 SDK
- SQL Server (MARCUSALPTOP\SQLEXPRESS)
- Modern webbläsare
- Node.js (för webbserver)

### 🎯 Starta Applikationen

**Terminal 1 - Backend:**
```powershell
cd api
dotnet run
```

**Terminal 2 - Frontend:**
```powershell
cd frontend
npx http-server -p 8000
```

**Webbläsare:**
```
http://localhost:8000
```

**Logga In:**
- Användarnamn: `testuser`
- Lösenord: `password123`

---

## 📚 Dokumentation

Välj det du behöver:

### **🟢 Börjar Från Början?**
👉 **Läs:** [`STARTGUIDE.md`](STARTGUIDE.md)
- Steg-för-steg startinstruktioner
- Felsökning
- Detaljerade instruktioner

### **⚡ Snabb Referens?**
👉 **Läs:** [`QUICKREF.md`](QUICKREF.md)
- Snabbreferens för kommandon
- API-endpoints
- Vigtig information

### **✅ Verifiera Setup?**
👉 **Läs:** [`SETUP_CHECKLIST.md`](SETUP_CHECKLIST.md)
- Detaljerad checklista
- Verifiering av all konfiguration
- Status-rapport

### **📋 Vad Är Gjort?**
👉 **Läs:** [`CHANGES_SUMMARY.md`](CHANGES_SUMMARY.md)
- Sammanfattning av ändringar
- Före/efter jämförelse
- Tekniska detaljer

### **💡 Implementeringskrav?**
👉 **Läs:** [`IMPLEMENTATION.md`](IMPLEMENTATION.md)
- Fullständiga krav per komponent
- Projektstruktur
- Framtida förbättringar

### **📖 Full Dokumentation?**
👉 **Läs:** [`README.md`](README.md)
- Komplett dokumentation
- API-referens med curl-exempel
- Säkerhetsinformation

### **🔍 Kodgranskning?**
👉 **Läs:** [`CODE_REVIEW.md`](CODE_REVIEW.md)
- 20 identifierade problem
- Allvarlighetsgrader
- Rekommendationer för fixes

---

## 🎯 Vad Gör Applikationen?

**Tournament Manager** låter dig:
- ✅ **Skapa turneringar** med titel, beskrivning, datum och maximal antal spelare
- ✅ **Organisera spel** under turneringar med specifika tider
- ✅ **Hantera data** - Redigera och ta bort turneringar och spel
- ✅ **Logga in säkert** - JWT-baserad autentisering
- ✅ **Se statistik** - Antal spel per turnering

---

## 🏗️ Arkitektur

```
📁 TournamentFullstack
├── 📁 api/                     ← ASP.NET Core 10.0 REST API
│   ├── Controllers/            ← API-endpoints (Auth, Tournaments, Games)
│   ├── Services/               ← Business-logik
│   ├── Models/                 ← Tournament, Game
│   ├── Data/                   ← Entity Framework DbContext
│   ├── Program.cs              ← Startup med JWT-konfiguration
│   └── appsettings.json        ← Databaskonfiguration
│
├── 📁 frontend/                ← HTML/CSS/JavaScript
│   ├── index.html              ← Huvudsida (Login + App)
│   ├── css/
│   │   └── styles.css          ← Medeltida tema
│   └── js/
│       ├── api-client.js       ← Fetch API-wrapper
│       ├── auth.js             ← JWT-autentisering
│       ├── tournaments.js      ← Tournament CRUD
│       ├── games.js            ← Game CRUD
│       └── app.js              ← Huvudapp-logik
│
├── 📁 Dokumentation
│   ├── STARTGUIDE.md           ← Start här!
│   ├── QUICKREF.md             ← Snabbreferens
│   ├── SETUP_CHECKLIST.md      ← Checklista
│   ├── CHANGES_SUMMARY.md      ← Vad som ändrats
│   ├── IMPLEMENTATION.md       ← Krav och planering
│   ├── CODE_REVIEW.md          ← Kodgranskning
│   └── README.md               ← Full dokumentation
```

---

## 🛠️ Teknologier

| Komponent | Teknik |
|-----------|--------|
| **Backend** | ASP.NET Core 10.0, C# |
| **Frontend** | HTML5, CSS3, Vanilla JavaScript |
| **Database** | SQL Server, Entity Framework Core 8.0 |
| **API** | REST, CORS |
| **Autentisering** | JWT (JSON Web Tokens) |
| **Styling** | Medeltida D&D-tema |

---

## 📡 API-Endpoints

### Autentisering
```http
POST /api/auth/login
```
Logga in och få JWT-token

### Turneringar
```http
GET    /api/tournaments         # Hämta alla
POST   /api/tournaments         # Skapa
PUT    /api/tournaments/{id}    # Uppdatera
DELETE /api/tournaments/{id}    # Ta bort
```

### Spel
```http
GET    /api/tournaments/{id}/games       # Hämta alla för turnering
POST   /api/tournaments/{id}/games       # Skapa under turnering
PUT    /api/tournaments/{id}/games/{gid} # Uppdatera
DELETE /api/tournaments/{id}/games/{gid} # Ta bort
```

Se [`README.md`](README.md) eller [`QUICKREF.md`](QUICKREF.md) för detaljerade exempel.

---

## 🔐 Säkerhet

### JWT-Autentisering
- ✅ Server-genererade tokens
- ✅ HS256 signing
- ✅ 24-timmars giltighet
- ✅ Token-validering på alla skyddade endpoints

### Databas
- ✅ Windows Integrated Security
- ✅ Encrypted connections
- ✅ Entity Framework migrations

### Frontend
- ✅ XSS-protection (HTML-escaping)
- ✅ CORS-aktiverat
- ✅ Token i localStorage

---

## ✅ Status

| Komponent | Status |
|-----------|--------|
| Backend API | ✅ Kompilerat och testat |
| Frontend UI | ✅ Responsive design |
| Database | ✅ Konfigurerad för MARCUSALPTOP\SQLEXPRESS |
| JWT-Autentisering | ✅ Implementerad |
| CRUD-Operationer | ✅ Alla implementerade |
| Dokumentation | ✅ Komplett |
| Lokal körning | ✅ Klart! |

---

## 🚀 Nästa Steg

### 1. **Läs Startguide** (5 min)
```
→ STARTGUIDE.md
```

### 2. **Starta Backend** (Terminal 1)
```powershell
cd api
dotnet run
```

### 3. **Starta Frontend** (Terminal 2)
```powershell
cd frontend
python -m http.server 8000
```

### 4. **Öppna Webbläsare**
```
http://localhost:8000
```

### 5. **Testa Applikationen**
- Logga in
- Skapa turnering
- Lägg till spel
- Redigera/ta bort data

---

## 🐛 Problem?

### Snabb Felsökning
Se [`STARTGUIDE.md`](STARTGUIDE.md) - Felsökning sektion

### Detaljerad Analys
Se [`CODE_REVIEW.md`](CODE_REVIEW.md) - 20 problem med lösningar

---

## 📊 Projektinformation

| Egenskap | Värde |
|----------|-------|
| **Språk** | C#, JavaScript |
| **Framework** | ASP.NET Core 10.0 |
| **Database** | SQL Server 2019+ |
| **API-port** | 5050 |
| **Frontend-port** | 8000 |
| **Tema** | Medeltida D&D |
| **Status** | ✅ Produktionsklar för lokal körning |

---

## 📝 Licens

Skolprojekt - Fri att använda och modifiera

---

## 👨‍💻 Skapad Av

**Marcus Hertzman** - 2026

---

## 🎉 Lycka Till!

Du är nu redo att köra Tournament Manager! ⚔️🎲

**Frågor?**
1. Se [`STARTGUIDE.md`](STARTGUIDE.md)
2. Se [`CODE_REVIEW.md`](CODE_REVIEW.md)
3. Kontrollera DevTools Console (F12)

---

**Version:** 1.0.0  
**Senast uppdaterad:** 2026-03-20  
**Status:** ✅ KLART FÖR KÖRNING

