# 📋 Implementeringskrav - Tournament Manager

## 🎯 Projektöversikt
Vi ska skapa en webbsida som anropar en befintlig API som finns under mappen `/api`. 
APIet är kopplat till en databas och hanterar turneringar och spel där en Tournament kan innehålla ett eller flera Games.

## 📁 Projektstruktur

```
TournamentFullstack/
├── api/                          # ASP.NET Core REST API
│   ├── Controllers/              # API-kontroller
│   ├── Models/                   # Datamodeller (Tournament, Game)
│   ├── Services/                 # Business logik
│   ├── Data/                      # Entity Framework DbContext
│   ├── Migrations/               # Database migrations
│   ├── appsettings.json          # Konfiguration
│   ├── Program.cs                # Startup-konfiguration
│   └── TournamentAPI.csproj      # Projektfil
└── frontend/                      # HTML/CSS/JavaScript webbsida
    ├── index.html                # Huvudsida
    ├── css/
    │   └── styles.css            # Styling (medeltida tema)
    └── js/
        ├── api-client.js         # API-kommunikation
        ├── auth.js               # Autentisering
        ├── tournaments.js        # Turnering-logik
        ├── games.js              # Spel-logik
        └── app.js                # Huvudapp-logik
```

## 🛠️ Teknikstack

### Backend
- **Framework**: ASP.NET Core 10.0
- **Språk**: C#
- **Databas**: SQL Server (MARCUSALPTOP\SQLEXPRESS)
- **ORM**: Entity Framework Core 8.0
- **API-stil**: REST med CORS

### Frontend
- **HTML5**: Semantisk struktur
- **CSS3**: Responsive design
- **JavaScript (ES6+)**: Asynkron logik med Fetch API
- **Tema**: Medeltida D&D-inspirerat

## 📋 Krav

### 1. ✅ Backend Setup
- [x] ASP.NET Core API konfigurerat
- [x] SQL Server-anslutning konfigurerad för `MARCUSALPTOP\SQLEXPRESS`
- [x] Database: `TournamentDB`
- [x] Entity Framework migrations
- [x] CORS-aktiverat för frontend
- [x] Port: 5050

### 2. ✅ Tournament-hantering (CRUD)
- [x] **GET** /api/tournaments - Hämta alla turneringar
- [x] **GET** /api/tournaments/{id} - Hämta en turnering
- [x] **POST** /api/tournaments - Skapa turnering
- [x] **PUT** /api/tournaments/{id} - Uppdatera turnering
- [x] **DELETE** /api/tournaments/{id} - Ta bort turnering (och dess spel)

**Turnering-objekt:**
```json
{
  "id": 1,
  "title": "String (max 100 tecken)",
  "description": "String (max 500 tecken)",
  "maxPlayers": 1-1000,
  "date": "ISO 8601 datetime",
  "games": []
}
```

**Validering:**
- Titel är obligatorisk
- Datum måste vara i framtiden
- MaxPlayers måste vara mellan 1-1000

### 3. ✅ Game-hantering (CRUD)
- [x] **GET** /api/tournaments/{tournamentId}/games - Hämta spel för turnering
- [x] **GET** /api/tournaments/{tournamentId}/games/{id} - Hämta ett spel
- [x] **POST** /api/tournaments/{tournamentId}/games - Skapa spel
- [x] **PUT** /api/tournaments/{tournamentId}/games/{id} - Uppdatera spel
- [x] **DELETE** /api/tournaments/{tournamentId}/games/{id} - Ta bort spel

**Spel-objekt:**
```json
{
  "id": 1,
  "title": "String (max 100 tecken)",
  "time": "ISO 8601 datetime",
  "tournamentId": 1
}
```

**Validering:**
- Titel är obligatorisk
- Datum/tid måste vara i framtiden
- TournamentId måste existera

### 4. ✅ Frontend - HTML/CSS/JavaScript

#### 4.1 Användarinterface
- [x] Login-sida (före autentisering)
- [x] Två-kolumns layout (turneringar vänster, detaljer höger)
- [x] Medeltida tema med:
  - Mörk bakgrund
  - Gyllena accenter
  - Cinzel-typsnitt för rubriker
  - Crimson Text-typsnitt för brödtext
- [x] Responsive design
- [x] Error-banner för felmeddelanden

#### 4.2 Turnering-funktionalitet
- [x] Visa lista över turneringar
- [x] Visa antal spel per turnering
- [x] Skapa ny turnering via formulär
- [x] Redigera befintlig turnering
- [x] Ta bort turnering (med bekräftelsedialog)
- [x] Datumvalidering på klientside
- [x] Visa turnering-detaljer när vald

#### 4.3 Spel-funktionalitet
- [x] Visa spel för vald turnering
- [x] Skapa nytt spel via formulär
- [x] Redigera befintligt spel
- [x] Ta bort spel (med bekräftelsedialog)
- [x] Datumvalidering på klientside
- [x] Spel-lista uppdateras automatiskt

#### 4.4 Formulär
- [x] Dynamisk formärering
- [ ] Client-side validering (FÖRBÄTTRING)
- [ ] Loading-states under API-anrop (FÖRBÄTTRING)
- [ ] Fördisabled buttons under submit (FÖRBÄTTRING)

### 5. ✅ Autentisering & JWT

#### 5.1 Frontend
- [x] Login-formulär
- [x] Spara JWT-token i localStorage
- [x] Skicka token i Authorization-header för alla API-anrop
- [x] Automatisk logout vid 401-svar
- [x] Visa inloggad användare

#### 5.2 Backend
- [ ] POST /api/auth/login - Autentisering (BEHÖVER IMPLEMENTERAS)
- [ ] JWT-token-generering
- [ ] Token-validering på alla API-anrop med [Authorize]

**TODO för JWT:**
En enkel auth-endpoint behövs på backend som returnerar en giltig JWT-token.
För skolprojekt kan vi acceptera valfritt användarnamn/lösenord.

### 6. ✅ Error-hantering
- [x] Server-side validering
- [x] HTTP-statuskoder korrekt
- [x] Error-banner i frontend
- [x] Konsol-loggning för debugging
- [x] Connection-error för databas

### 7. ✅ Dokumentation

#### 7.1 README.md
- [x] Vad är applikationen?
- [x] Funktionalitet
- [x] Teknikstack
- [x] Installations- och setup-guide
- [x] API-dokumentation med curl-exempel
- [x] Konfiguration
- [x] Användningsguide
- [x] Felsökning
- [x] Säkerhetsinformation

#### 7.2 Inline-dokumentation
- [x] JSDoc-kommentarer i JavaScript
- [x] XML-dokumentation i C#
- [x] README-filer i nyckelmap

## 🚀 Setup-instruktioner (För lokalkörning)

### Förutsättningar
- .NET 10.0 SDK
- SQL Server (MARCUSALPTOP\SQLEXPRESS med databas TournamentDB)
- Modern webbläsare

### Backend-setup
1. Öppna PowerShell i mappen `api/`
2. Kör: `dotnet restore`
3. Kör: `dotnet run`
4. API börjar på http://localhost:5050

### Frontend-setup
1. Öppna `frontend/index.html` i webbläsare
2. Eller använd en lokal webbserver:
   ```powershell
   cd frontend
   python -m http.server 8000
   # Besök http://localhost:8000
   ```

## 📊 Checklista för Slutförande

### Backend
- [x] API kompileras utan fel
- [x] Databaskonfiguration korrekt
- [x] Alla CRUD-endpoints implementerade
- [x] Server-side validering
- [ ] JWT autentisering slutfört
- [x] CORS aktiverat
- [x] Rate limiting
- [x] Error handling

### Frontend
- [x] Logga in
- [x] Se turneringar
- [x] Skapa turnering
- [x] Redigera turnering
- [x] Ta bort turnering
- [x] Se spel
- [x] Skapa spel
- [x] Redigera spel
- [x] Ta bort spel
- [ ] Validering med felmeddelanden
- [ ] Loading states
- [ ] Improved error messages

### Dokumentation
- [x] README.md komplett
- [x] API-dokumentation
- [x] Setup-guide
- [x] Kodkommentarer

## 🐛 Kända Problem (Se CODE_REVIEW.md)

1. **KRITISKT**: JWT-tokens är mock-tokens från klient, inte från server
2. **HÖG PRIORITET**: Race conditions i tournament-selection
3. **HÖG PRIORITET**: Ingen loading-states under API-anrop
4. **MEDEL PRIORITET**: CORS för permissiv
5. **MEDEL PRIORITET**: Ingen konflikt-hantering för concurrent edits

Se `CODE_REVIEW.md` för detaljerad analys av alla 20 problem som hittades.

## 📝 Noteringar för Utveckling

### För fortsatt utveckling:
- Implementera AuthController för JWT
- Lägg till [Authorize]-attribut på kontroller
- Implementera proper input-validering med error-feedback
- Lägg till loading-states för användarupplevelse
- Implementera CSRF-skydd
- Lägg till pagination för stora datamängder

### Miljöer
- **Development**: http://localhost:5050 med localhost CORS
- **Lokal test**: MARCUSALPTOP\SQLEXPRESS database

## ✅ Status

**NÄSTAN KLART** - Projektet är nästan fullt funktionellt lokalt.

Nästa steg:
1. Implementera JWT auth-endpoint på backend
2. Testa login-funktionaliteten
3. Kör igenom alla CRUD-operationer
4. Se CODE_REVIEW.md för förbättringspotential

