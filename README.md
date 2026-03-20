# ⚔️ Tournament Manager - Fullstack Application

En medeltida-inspirerad fullstack-webbapplikation för att hantera turneringar och spel med JWT-baserad autentisering.

## 📋 Innehålsförteckning

- [Vad är Tournament Manager?](#vad-är-tournament-manager)
- [Funktionalitet](#funktionalitet)
- [Teknikstack](#teknikstack)
- [Krav](#krav)
- [Installation & Setup](#installation--setup)
- [Användning](#användning)
- [API-dokumentation](#api-dokumentation)
- [Arkitektur](#arkitektur)
- [Felsökning](#felsökning)

## 🎯 Vad är Tournament Manager?

**Tournament Manager** är en fullstack-webbapplikation designad för att hantera turneringar och spel på ett enkelt och elegant sätt. Applikationen är inspirerad av medeltida D&D-teman med mörk bakgrund, gyllena accenter och eleganta serif-typsnitt.

Applikationen gör det möjligt för användare att:
- ✅ **Skapa och hantera turneringar** - Lägg till datum, beskrivning och max antal spelare
- ✅ **Organisera spel** - Lägg till spel under turneringar med specifika tider
- ✅ **Redigera och ta bort** - Uppdatera eller ta bort turneringar och spel när som helst
- ✅ **Logga in säkert** - JWT-baserad autentisering för säker åtkomst
- ✅ **Se statistik** - Visa antal spel per turnering i realtid

Applikationen består av:
- **Backend**: ASP.NET Core 10.0 REST API
- **Frontend**: Modern HTML/CSS/JavaScript med medeltida tema
- **Databas**: Entity Framework Core med SQL Server

## ✨ Funktionalitet

### Autentisering & Säkerhet
- ✅ JWT-baserad autentisering
- ✅ Token-baserad auktorisering på alla API-anrop
- ✅ Automatisk logout vid utgånget token
- ✅ CORS-aktiverat för frontend-kommunikation

### Turneringar - CRUD operationer
- ✅ **Hämta** alla turneringar från databasen
- ✅ **Skapa** nya turneringar med titel, beskrivning, datum och maxantal spelare
- ✅ **Uppdatera** befintliga turneringar
- ✅ **Ta bort** turneringar (och alla associerade spel)
- ✅ Visa antal spel per turnering
- ✅ Datumvalidering - Endast framtida datum accepteras

### Spel - CRUD operationer
- ✅ **Hämta** spel för en specifik turnering
- ✅ **Skapa** nya spel under en turnering
- ✅ **Uppdatera** befintliga spel
- ✅ **Ta bort** spel från en turnering
- ✅ Datumvalidering - Endast framtida datum accepteras

### Använrgränssnitt
- ✅ **Two-column layout** - Turneringar på vänster, detaljer på höger
- ✅ **Medeltida tema** - Mörk bakgrund, gyllena accenter, Cinzel-typsnitt
- ✅ **Error handling** - Tydliga felmeddelanden i error-banner
- ✅ **Responsive design** - Fungerar på desktop och mobil

## 🛠️ Teknikstack

### Backend
- **Framework**: ASP.NET Core 10.0
- **Language**: C#
- **Databas**: SQL Server
- **ORM**: Entity Framework Core 8.0
- **Autentisering**: JWT (JSON Web Tokens)
- **Kommunikation**: REST API med CORS

### Frontend
- **HTML5**: Semantisk struktur
- **CSS3**: Modern responsive design med medeltida tema
- **JavaScript (ES6+)**: Client-side logik
- **Fetch API**: Asynkron API-kommunikation
- **Typsnitt**: Cinzel (rubriker), Crimson Text (brödtext)

### Utvecklingsverktyg
- **Version Control**: Git
- **IDE**: Visual Studio Community 2026
- **Runtime**: .NET 10.0
- **Terminal**: PowerShell

## 📋 Krav

### Server-krav
- **.NET 10.0 SDK** eller senare
- **SQL Server** 2019 eller senare (eller SQL Server Express/LocalDB)
- **Port 5050** för API-servern (kan konfigureras)

### Klient-krav
- Modern webbläsare med stöd för:
  - ES6+ JavaScript
  - Fetch API
  - LocalStorage
  - CSS Grid & Flexbox

## 🚀 Installation & Setup

### Förutsättningar
- Git installerat
- .NET 10.0 SDK eller senare
- SQL Server igång och tillgänglig

### Steg-för-steg Guide

#### 1. Klona Repository
```bash
git clone https://github.com/quizzly2k/TournamentFullstack.git
cd TournamentFullstack
```

#### 2. Konfigurera Backend

**Gå till API-mappen:**
```bash
cd api
```

**Uppdatera databasanslutningen** i `appsettings.json`:
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost;Database=TournamentDb;User Id=sa;Password=YourPassword123!;Encrypt=false;TrustServerCertificate=true;"
  }
}
```

Eller för **LocalDB**:
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=(localdb)\\mssqllocaldb;Database=TournamentDb;Trusted_Connection=true;"
  }
}
```

**Installera NuGet-paket och kör API:t:**
```bash
dotnet restore
dotnet run
```

API:t kommer att starta på: `http://localhost:5050`

#### 3. Öppna Frontend

Öppna `frontend/index.html` i en webbläsare eller serva det via en lokal server:

```bash
# Med Python 3
cd ../frontend
python -m http.server 8000

# Sedan öppna: http://localhost:8000
```

## 📡 API-dokumentation

### Base URL
```
http://localhost:5050/api
```

### Autentisering
Alla API-anrop kräver en JWT-token i `Authorization`-headern:
```
Authorization: Bearer <your_jwt_token>
```

### Authentication Endpoints

#### Logga In
```http
POST /auth/login
Content-Type: application/json

{
  "username": "testuser",
  "password": "password123"
}
```

**Response (200 OK):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "username": "testuser"
}
```

---

### Tournament Endpoints

#### Hämta alla turneringar
```http
GET /tournaments
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
[
  {
    "id": 1,
    "title": "Dragon Slayers Championship",
    "description": "En episk turnering för hjältar",
    "maxPlayers": 16,
    "date": "2024-12-25T14:00:00Z",
    "gameCount": 5
  }
]
```

#### Skapa ny turnering
```http
POST /tournaments
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Dragon Slayers Championship",
  "description": "En episk turnering för hjältar",
  "maxPlayers": 16,
  "date": "2024-12-25T14:00:00Z"
}
```

**Response (201 Created):**
```json
{
  "id": 1,
  "title": "Dragon Slayers Championship",
  "description": "En episk turnering för hjältar",
  "maxPlayers": 16,
  "date": "2024-12-25T14:00:00Z"
}
```

#### Uppdatera turnering
```http
PUT /tournaments/{id}
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Updated Title",
  "description": "Updated description",
  "maxPlayers": 20,
  "date": "2024-12-25T14:00:00Z"
}
```

**Response (200 OK):** Uppdaterad turnering-objekt

#### Ta bort turnering
```http
DELETE /tournaments/{id}
Authorization: Bearer <token>
```

**Response (204 No Content)**

---

### Game Endpoints

#### Hämta spel för en turnering
```http
GET /tournaments/{tournamentId}/games
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
[
  {
    "id": 1,
    "title": "Dungeon Level 1",
    "time": "2024-12-25T14:00:00Z",
    "tournamentId": 1
  }
]
```

#### Skapa nytt spel
```http
POST /tournaments/{tournamentId}/games
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Dungeon Level 1",
  "time": "2024-12-25T14:00:00Z"
}
```

**Response (201 Created):**
```json
{
  "id": 1,
  "title": "Dungeon Level 1",
  "time": "2024-12-25T14:00:00Z",
  "tournamentId": 1
}
```

#### Uppdatera spel
```http
PUT /tournaments/{tournamentId}/games/{gameId}
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Updated Game Title",
  "time": "2024-12-25T15:00:00Z"
}
```

**Response (200 OK):** Uppdaterad spel-objekt

#### Ta bort spel
```http
DELETE /tournaments/{tournamentId}/games/{gameId}
Authorization: Bearer <token>
```

**Response (204 No Content)**

---

### Error Responses

#### 401 Unauthorized
```json
{
  "error": "Invalid or expired token"
}
```

#### 404 Not Found
```json
{
  "error": "Tournament not found"
}
```

#### 400 Bad Request
```json
{
  "error": "Validation error - Date must be in the future"
}
```

---

## 🏗️ Arkitektur

### Frontend-struktur
```
frontend/
├── index.html           # Huvudsida
├── css/
│   └── styles.css       # Medeltida tema & styling
└── js/
    ├── api-client.js    # API-kommunikation
    ├── auth.js          # Autentisering & login
    ├── tournaments.js   # Turnering CRUD-logik
    ├── games.js         # Spel CRUD-logik
    └── app.js           # Huvudapplikations-logik
```

### Backend-struktur
```
api/
├── Controllers/         # API endpoints
├── Models/             # Data-modeller
├── Services/           # Business logic
├── Data/              # EF Core DbContext
├── DTOs/              # Data Transfer Objects
├── Migrations/        # Database migrations
└── Program.cs         # App-konfiguration
```

---

## 🔧 Felsökning

### Problem: "API:et är inte tillgängligt"
**Lösning:**
1. Kontrollera att API:et körs: `dotnet run` i `api/`-mappen
2. Verifiera att port 5050 är ledig
3. Kontrollera firewall-inställningar

### Problem: "Databasanslutning misslyckades"
**Lösning:**
1. Kontrollera SQL Server är igång
2. Uppdatera `appsettings.json` med rätt connection string
3. Kör: `dotnet ef database update`

### Problem: "3 prickar istället för spel-antal"
**Lösning:**
1. Vänta på att spelen laddar
2. Uppdatera sidan (Ctrl+F5)
3. Kontrollera att API:et returnerar spel korrekt

### Problem: "Login fungerar inte"
**Lösning:**
1. Kontrollera användarnamn/lösenord är korrekt
2. Verifiera att API:et är igång
3. Se error-banner på sidan för detaljerat felmeddelande
4. Öppna DevTools (F12) > Console för API-fel

---

## 📝 Licens

Detta projekt är licensierat under MIT License.

---

## 👨‍💻 Utvecklare

Skapat av: **Tomas Hertzman**

---

## 🎮 Framtida Förbättringar (Roadmap)

- [ ] Lägg till player-hantering
- [ ] Implementera match-resultat
- [ ] Lägg till ranking/poängsystem
- [ ] Dark mode toggle
- [ ] Exportera data till CSV/PDF
- [ ] Real-time notifications med WebSockets
- [ ] Mobil-app

---

Lycka till med Tournament Manager! ⚔️🎲

Navigera till `frontend/index.html` i din webbläsare eller använd en lokal webbserver:

**Med Python:**
```bash
cd frontend
python -m http.server 8000
# Besök http://localhost:8000
```

**Med Live Server (VS Code):**
1. Installera "Live Server" extension
2. Högerklicka på `frontend/index.html` → "Open with Live Server"

## ⚙️ Konfiguration

### API-konfiguration (Frontend)

Redigera `frontend/js/api-client.js`:
```javascript
const API_CONFIG = {
    BASE_URL: 'http://localhost:5000/api',
    TOKEN_KEY: 'tournament_jwt_token'
};
```

### Databaskonfiguration (Backend)

Redigera `api/appsettings.json`:
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost;Database=TournamentDB;Trusted_Connection=true;"
  }
}
```

## 📚 API-dokumentation

### Tournaments Endpoints

#### GET `/api/tournaments`
Hämta alla turneringar

**Svar:**
```json
[
  {
    "id": 1,
    "title": "Spring Championship",
    "description": "Open tournament",
    "maxPlayers": 16,
    "date": "2026-03-02T12:00:00Z",
    "games": [...]
  }
]
```

#### POST `/api/tournaments`
Skapa ny turnering

**Request Body:**
```json
{
  "title": "Summer Tournament",
  "description": "Private tournament",
  "maxPlayers": 10,
  "date": "2026-06-15T18:00:00Z"
}
```

#### PUT `/api/tournaments/{id}`
Uppdatera turnering

#### DELETE `/api/tournaments/{id}`
Ta bort turnering

### Games Endpoints

#### GET `/api/tournaments/{tournamentId}/games`
Hämta alla spel i en turnering

#### POST `/api/tournaments/{tournamentId}/games`
Skapa nytt spel

**Request Body:**
```json
{
  "title": "Qualifying Match 1",
  "time": "2026-03-02T13:00:00Z",
  "tournamentId": 1
}
```

#### PUT `/api/tournaments/{tournamentId}/games/{id}`
Uppdatera spel

#### DELETE `/api/tournaments/{tournamentId}/games/{id}`
Ta bort spel

## 🎮 Användning

### Login
1. Öppna applikationen i webbläsaren
2. Ange användarnamn och lösenord
3. Klicka "Logga in"

### Hantera Turneringar
1. Klicka på "Turneringar" fliken
2. Fyll i formuläret och klicka "Lägg till turnering"
3. Se alla turneringar i listan
4. Använd "Redigera" eller "Ta bort" för att modifiera

### Hantera Spel
1. Klicka på "Spel" fliken
2. Välj en turnering från dropdown-menyn
3. Formuläret för att lägga till spel visas
4. Fyll i och klicka "Lägg till spel"
5. Se alla spel för turneringen

## 🏗️ Arkitektur

### Backend-struktur
```
api/
├── Controllers/
│   ├── TournamentsController.cs
│   └── GamesController.cs
├── Models/
│   ├── Tournament.cs
│   └── Game.cs
├── Services/
│   ├── TournamentService.cs
│   ├── GameService.cs
│   └── RateLimitingService.cs
└── Data/
    └── TournamentContext.cs
```

### Frontend-struktur
```
frontend/
├── index.html
├── css/
│   └── styles.css
└── js/
    ├── app.js
    ├── auth.js
    ├── api-client.js
    ├── tournaments.js
    └── games.js
```

## 🔒 Säkerhet

### JWT-tokens
- Tokens lagras i `localStorage`
- Tokens skickas i `Authorization`-headern
- Utgångna tokens resulterar i automatisk logout

### Input Validation
- Server-side validering på alla inputs
- HTML-escaping för att förhindra XSS-attacker
- Rate limiting för att förhindra abuse

## 👨‍💻 Autor

Tomas Hertzman

---

**Version**: 1.0.0
