# 📋 Implementeringskrav - Tournament Manager

## 🎯 Projektöversikt
En fullstack-webbapplikation för turneringshantering med modern React-frontend och ASP.NET Core REST API. Applikationen implementerar JWT-baserad autentisering, rollbaserad auktorisering och ett cyberpunk-designat användargränssnitt.

## 📁 Projektstruktur

```
TournamentFullstack-React/
├── api/                          # ASP.NET Core REST API
│   ├── Controllers/              
│   │   ├── AuthController.cs     # JWT login/register
│   │   ├── TournamentsController.cs
│   │   └── GamesController.cs
│   ├── Models/
│   │   ├── User.cs               # Användarmodell
│   │   ├── Role.cs               # Rollmodell
│   │   ├── UserRole.cs           # Junction table
│   │   ├── Tournament.cs
│   │   └── Game.cs
│   ├── Services/
│   │   ├── AuthService.cs        # JWT-generation, password hashing
│   │   ├── TournamentService.cs
│   │   └── GameService.cs
│   ├── Data/
│   │   └── TournamentContext.cs  # EF Core DbContext med migrations
│   ├── DTOs/
│   │   ├── RegisterDTO.cs
│   │   ├── LoginDTO.cs
│   │   └── LoginResponseDTO.cs
│   └── Program.cs                # JWT-setup, CORS, middleware
├── frontendVite/                 # React + Vite-frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── Auth/
│   │   │   │   ├── LoginForm.jsx
│   │   │   │   └── RegisterForm.jsx
│   │   │   ├── Tournament/
│   │   │   │   ├── TournamentsList.jsx
│   │   │   │   ├── TournamentDetails.jsx
│   │   │   │   ├── TournamentForm.jsx
│   │   │   │   └── TournamentEditForm.jsx
│   │   │   ├── Games/
│   │   │   │   ├── GamesList.jsx
│   │   │   │   └── GameForm.jsx
│   │   │   └── Common/
│   │   │       ├── Header.jsx
│   │   │       └── ErrorBanner.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx   # Global auth-state
│   │   ├── hooks/
│   │   │   ├── useAuth.js        # Custom hook för auth
│   │   │   ├── useTournaments.js # Custom hook för turneringar
│   │   │   └── useGames.js       # Custom hook för spel
│   │   ├── services/
│   │   │   └── apiClient.js      # Centraliserad API-kommunikation
│   │   ├── App.jsx               # Huvudapp-logik
│   │   ├── main.jsx              # React entry-point
│   │   └── index.css             # All styling (Cyberpunk-tema)
│   ├── index.html                # HTML-entry
│   ├── vite.config.js
│   └── package.json
└── README.md
```

## 🛠️ Teknikstack

### Backend
- **Framework**: ASP.NET Core 10.0
- **Språk**: C#
- **Databas**: SQL Server 2019+
- **ORM**: Entity Framework Core 8.0
- **Autentisering**: JWT (HS256)
- **Password hashing**: SHA256
- **API-stil**: REST med CORS

### Frontend
- **Framework**: React 18+
- **Build tool**: Vite 8.0
- **Språk**: JavaScript (ES6+)
- **State management**: React Context API + useReducer
- **HTTP-klient**: Fetch API
- **Styling**: CSS3 (Cyberpunk tema, Grid, Flexbox)
- **Tema**: Animerad cyberpunk design med scan-line effekter

---

## 📝 IMPLEMENTERINGSDETALJER & ÄNDRINGSHISTORIK

### Frontend-migrering: Vanilla JS → React + Vite ✅

#### Motivation
- Gamla vanilla JavaScript-frontend var svår att underhålla och skalera
- React erbjuder komponent-baserad arkitektur och bättre state-management
- Vite ger snabbare development-workflow än gamla http-server

#### Implementering
1. **React-komponenter** skapades för varje UI-del
   - Komponenter är små, fokuserade och återanvändbara
   - Props och state håller data-flöde tydligt
   - Hooks (useState, useEffect, useCallback) hanterar komplexlogik

2. **Context API** för global auth-state
   - AuthContext.jsx centraliserar login, register, logout
   - Gäst-läge implementerat som separat state
   - Token automatiskt sparad i localStorage och skickas med API-anrop

3. **Custom hooks** för logik-återanvändning
   - useAuth.js för åtkomst till auth-context
   - useTournaments.js för CRUD-operationer på turneringar
   - useGames.js för CRUD-operationer på spel

4. **Vite development server**
   - Hot Module Replacement för omedelbar feedback
   - Production-build med minifiering och code-splitting
   - CSS in JS istället för separata filer

### JWT-autentisering med Säkerhet ✅

#### Implementering
1. **Password hashing (SHA256)**
   - Lösenord hashas med SHA256 på servern innan lagring
   - Base64-encoded för databaskompabilitet
   - Lösenord kan aldrig rekonstrueras från hash

2. **JWT-token generation**
   - Claims: sub (user ID), username, email, role (kan vara flera)
   - 24-timmars expiration via `DateTime.UtcNow.AddHours(24)`
   - Signerad med HMAC-SHA256 + symmetrisk nyckel
   - 5-sekunders clock skew tolerance för server-tid-variabilitet

3. **Frontend token-hantering**
   - Token lagras i localStorage som `tournament_jwt_token`
   - Roles lagras separat för snabb åtkomst
   - Token skickas automatiskt i Authorization-header på varje API-anrop
   - Automatisk logout vid 401-respons (token expirerat)

4. **API-level säkerhet**
   - [Authorize] på protected endpoints kräver giltigt token
   - [Authorize(Roles="Admin,User")] gränsar åtkomst baserat på roll
   - Owner-baserad auktorisering: Användare kan bara radera egna spel

### Rollbaserad auktorisering (RBAC) ✅

#### Rollstruktur
- **Admin**: Kan skapa, redigera, ta bort vilken turnering/spel som helst
- **User**: Kan skapa turneringar och spel, redigera/radera egna spel
- **Guest**: Läs-bara åtkomst (ingen inloggning krävs)

#### Implementering
1. **Databas-design**
   - Users-tabell: Id, Username (unique), Email (unique), PasswordHash
   - Roles-tabell: Id, Name (seeded med "Admin" och "User")
   - UserRoles junction-tabell: Många-till-många relation

2. **API-endpoints**
   - GET /api/tournaments: Öppen för alla (inklusive gäster)
   - POST /api/tournaments: [Authorize(Roles="Admin,User")]
   - DELETE /api/tournaments/{id}: [Authorize(Roles="Admin")]
   - DELETE /api/tournaments/{id}/games/{gid}: Admin ELLER spelägare

3. **Frontend-implementering**
   - Knappar döljda med `{!isGuest && <button>...</button>}`
   - Redigerings-UI inte tillgängligt för gäster
   - Felmeddelanden vid försökt unauthorized-operation

### Guest-läge ✅

#### Funktionalitet
- Ingen inloggning krävs
- Kan se alla turneringar och spel
- Ingen möjlighet att skapa, redigera eller ta bort
- Knapparna är helt dolda (inte bara disabled)
- "Gäst-läge" visas i header istället för användarnamn

#### Implementering
- `loginAsGuest()` i AuthContext sätter isGuest=true, utan token
- GET-endpoints tillåter unauthenticerade requests
- POST/PUT/DELETE-endpoints kräver [Authorize] och blockerar gäster

### Cyberpunk UI-tema ✅

#### Design-elements
- **Färgpalett**: 
  - Primary: Cyan (#00D9FF)
  - Secondary: Hot Pink (#FF006E)
  - Accent: Purple (#8338EC)
  - Background: Dark gradient (#050812 → #0a0e27)

- **Typography**: 
  - Body: Poppins (modern sans-serif)
  - Headers: Space Grotesk (geometric, futuristic)
  - Code: JetBrains Mono (monospace)

- **Effekter**:
  - Glasmorphism: backdrop-filter blur på kort och formulär
  - Glow-effekter: text-shadow och box-shadow med neon-färger
  - Smooth transitions: 0.3s cubic-bezier för hover-effekter
  - Animated scan-line: Horisontell linje som scannar från topp till botten

#### CSS-arkitektur
- CSS-variabler för tema-värden (enkel tema-switching)
- Grid och Flexbox för responsive layout
- Media queries för mobile-anpassning (768px breakpoint)
- Animationer för dynamiska effekter (utan blinkande som orsakar eye strain)

### Förbättringar från tidigare version ✅

#### Problema från gamla versionen → Lösningar
1. **Vanilla JS komplexitet** → React komponenter (renare, mer maintainable)
2. **Ingen state-management** → Context API med centraliserad logic
3. **Hårdkodade API-anrop** → Centraliserad apiClient.js service
4. **Ingen autentisering** → Fullständig JWT-implementation
5. **Ingen auktorisering** → Rollbaserad åtkomst kontroll
6. **Medeltida tema** → Modern cyberpunk design
7. **Ingen animations** → Scan-line effect och smooth transitions
8. **Lokal frontend-server** → Vite dev server med HMR

### Database-design ✅

#### Schema
```
Users (Id, Username, Email, PasswordHash, CreatedAt)
├─ Roles (Id, Name) seeded: Admin, User
│  └─ UserRoles (UserId, RoleId) - Many-to-many
├─ Tournaments (Id, Title, Description, Date, MaxPlayers, CreatedByUserId)
│  └─ Games (Id, TournamentId, Title, Time, CreatedByUserId)
```

#### Features
- Auto-migrations vid startup via `db.Database.Migrate()`
- CreatedByUserId för ownership-tracking
- Cascade delete policies för data-integritet
- Composite keys och foreign keys korrekt konfigurerade

---

## ✅ Implementerad Funktionalitet

### Backend ✅
- [x] ASP.NET Core 10.0 REST API
- [x] SQL Server-anslutning (MARCUSLAPTOP\SQLEXPRESS)
- [x] Entity Framework Core 8.0 med migrations
- [x] JWT-autentisering med SHA256 password hashing
- [x] Rollbaserad auktorisering (Admin/User/Guest)
- [x] Owner-baserad auktorisering (användare kan radera egna spel)
- [x] CORS aktiverat för React-frontend
- [x] Alla CRUD-endpoints för turneringar och spel
- [x] Deskriptiv error-handling
- [x] Rate limiting
- [x] Auto-migrations på startup
- [x] Validering av inputs

### Frontend ✅
- [x] React 18+ med Vite
- [x] Login/Register formulär
- [x] Guest-läge (läs-bara åtkomst)
- [x] JWT-token hantering och automatisk logout
- [x] Två-kolumns layout (sidebar + detaljer)
- [x] Turnerings-lista med spel-antal
- [x] Skapa/Redigera/Ta bort turneringar
- [x] Skapa/Redigera/Ta bort spel med tid-väljare
- [x] In-line spel-redigering
- [x] Rollbaserad UI (knappar dolda för gäster/icke-ägare)
- [x] Cyberpunk-tema med CSS-variabler
- [x] Glasmorphism effekter
- [x] Animated scan-line från topp till botten
- [x] Responsive design (desktop/tablet/mobil)
- [x] Loading states
- [x] Error banners
- [x] Automatisk uppdatering av UI vid ändringar

### Architecture ✅
- [x] Separation of concerns (API, UI, Auth-logic)
- [x] Custom hooks för logik-återanvändning
- [x] Context API för global state
- [x] Centraliserad API-kommunikation
- [x] Error-handling på alla nivåer
- [x] Secure token-storage och transmission
- [x] Testbar komponent-struktur

### Dokumentation ✅
- [x] README.md (setup, API docs, features)
- [x] IMPLEMENTATION.md (denna fil)
- [x] SAMMANFATTNING.md (lärandemål-mapping)
- [x] Inline-kommentarer i kod

---

## 🚀 Setup-instruktioner

### Förutsättningar
- .NET 10.0 SDK
- SQL Server (MARCUSLAPTOP\SQLEXPRESS)
- Node.js 16+
- Modern webbläsare

### Backend Setup (Terminal 1)
```powershell
cd api
dotnet run
```
API startar på **http://localhost:5050**
- Database migrations körs automatiskt
- JWT-konfiguration sätts upp
- Rate limiting aktiveras

### Frontend Setup (Terminal 2)
```powershell
cd frontendVite
npm install     # Endast första gången
npm run dev
```
Frontend startar på **http://localhost:5173**
- Hot Module Replacement aktiveras automatiskt
- CSS-ändringar reflekteras omedelbar

### Production Build
```powershell
cd frontendVite
npm run build   # Skapar dist/-mapp
```

### Test av Funktionalitet
1. **Registrera ny användare** på login-sidan
2. **Logga in** med användaruppgifter
3. **Skapa turnering** via "+ Ny"-knapp
4. **Skapa spel** i turneringen
5. **Redigera/Ta bort** spel inline
6. **Logga in som gäst** för läs-bara åtkomst
7. **Verifiera** att gäster inte kan redigera/ta bort

---

## 📊 Checklista

### Backend-testing
- [x] API kompileras utan fel och varningar
- [x] Database migrations körs vid startup
- [x] Alla endpoints svarar med korrekt HTTP-status
- [x] JWT-tokens genereras och valideras
- [x] Lösenord hasheras korrekt
- [x] Rollbaserad auktorisering fungerar
- [x] Owner-baserad auktorisering fungerar
- [x] CORS tillåter React-frontend
- [x] Rate limiting aktiveras
- [x] Error-responses är deskriptiva

### Frontend-testing
- [x] Login/register formulär fungerar
- [x] JWT-token sparas och skickas
- [x] Automatisk logout vid token-expiration
- [x] Guest-läge funkar utan inloggning
- [x] Turneringar visas i sidebar
- [x] CRUD för turneringar fungerar
- [x] CRUD för spel fungerar
- [x] In-line spel-redigering fungerar
- [x] Knappars är dolda för gäster
- [x] Knappars är dolda för icke-ägare
- [x] Cyberpunk-tema visas korrekt
- [x] Scan-line animation körs
- [x] Responsive design fungerar på mobil
- [x] Loading-states visas
- [x] Error-banners visas vid fel
- [x] Ingen turnering vald vid login
- [x] Gäst-läge visar "Gäst"-badge

### Security-testing
- [x] Lösenord accepteras inte i plaintext
- [x] JWT-tokens kan inte manipuleras
- [x] Gäster kan inte skapa/redigera/ta bort
- [x] Användare kan inte ta bort andras spel
- [x] Admin kan ta bort vilken turnering som helst
- [x] Expired tokens triggerar logout
- [x] Unauthorized-requests returnerar 401

---

## ✅ Status: FÄRDIGT & PRODUCTION-READY

**All funktionalitet implementerad och testad.**

Projektet är en **fullstack webbapplikation** som demonstrerar:
- Moderna React-patterns
- Säker JWT-autentisering
- Rollbaserad auktorisering
- Responsive och vacker UI
- Best practices för webbutveckling

