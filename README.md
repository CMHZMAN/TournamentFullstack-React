# ⚔️ Tournament Manager

En fullstack-webbapplikation för att hantera turneringar och spel med JWT-baserad autentisering och roll-baserad auktorisering.

## 🎯 Vad gör applikationen?

Tournament Manager låter dig:
- **Skapa turneringar** med titel, beskrivning, datum och max antal spelare
- **Organisera spel** under turneringar med specifika tider
- **Redigera och ta bort** turneringar och spel (baserat på roller)
- **Logga in säkert** via JWT-autentisering med SHA256 password hashing
- **Gäst-läge** för att utforska turneringar och spel utan inloggning (läs-bara)
- **Roll-baserad åtkomst**:
  - **Admin**: Fullständig kontroll
  - **User**: Kan skapa turneringar, redigera egna spel
  - **Guest**: Läs-bara åtkomst
- **Animerad cyberpunk UI** med scan-line effekter

## 🚀 Hur kör man projektet?

### Förutsättningar
- .NET 10.0 SDK
- SQL Server (Koppling till databasinstans med databas TournamentDB)
- Node.js 16+ (för Vite development server)
- Modern webbläsare

### Starta Backend (Terminal 1)
```powershell
cd api
dotnet run
```
API börjar på **http://localhost:5050**

### Starta Frontend (Terminal 2)
```powershell
cd frontendVite
npm install  # Endast första gången
npm run dev
```
Webbläsare: **http://localhost:5173**

### Testning av Gäst-Läge
- Klicka på **"Gäst-läge"** knappen på login-sidan för skrivskyddad åtkomst
- Alla spel och turneringar är synliga men inga redigerings-/borttagningsalternativ

### Testanvändare
Du kan registrera en egen användare eller logga in med:
- **Användarnamn:** testuser
- **Lösenord:** password123

## 📡 API Endpoints

### Autentisering
```
POST   /api/auth/register           Registrera ny användare
POST   /api/auth/login              Logga in och få JWT-token
```

### Turneringar
```
GET    /api/tournaments             Hämta alla turneringar (öppen)
POST   /api/tournaments             Skapa ny turnering [Auth: Admin, User]
PUT    /api/tournaments/{id}        Uppdatera turnering [Auth: Admin]
DELETE /api/tournaments/{id}        Ta bort turnering [Auth: Admin]
```

### Spel
```
GET    /api/tournaments/{id}/games                 Hämta spel för turnering (öppen)
POST   /api/tournaments/{id}/games                 Skapa spel [Auth: Admin, User]
PUT    /api/tournaments/{id}/games/{gid}          Uppdatera spel [Auth: Admin, User]
DELETE /api/tournaments/{id}/games/{gid}          Ta bort spel [Auth: Admin, eller ägare]
```

**Notering**: GET-endpoints är öppna för gäster. Write-operationer kräver autentisering.

## 🔗 Hur pratar Frontend med API:et?

Frontend använder **Fetch API** med JWT-autentisering:

1. **Login** → Backend returnerar JWT-token + användarroller
2. **Spara token** → localStorage på klienten
3. **API-anrop** → Token skickas i `Authorization: Bearer <token>` header
4. **Automatisk logout** → Vid 401-respons från server

### JWT Token Struktur
Token innehåller:
- `sub`: User ID
- `username`: Användarnamn
- `email`: E-postadress
- `role`: Roll (kan finnas flera claims)
- `exp`: Utgångstid (24 timmar från utfärdande)

### Exempel API-anrop:
```javascript
// Registrering
const response = await fetch('http://localhost:5050/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ 
        username: 'myuser',
        email: 'user@example.com',
        password: 'securepass123' 
    })
});
const { token, username, roles } = await response.json();
localStorage.setItem('tournament_jwt_token', token);
localStorage.setItem('user_roles', JSON.stringify(roles));

// Login
const loginRes = await fetch('http://localhost:5050/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
});
const { token } = await loginRes.json();

// Autentiserad request
const games = await fetch('http://localhost:5050/api/tournaments/1/games', {
    headers: { 'Authorization': `Bearer ${token}` }
});
```

## 🛠️ Teknikstack

| Layer | Teknik |
|-------|--------|
| **Backend** | ASP.NET Core 10.0, C#, Entity Framework Core 8 |
| **Frontend** | React 18, Vite, JavaScript (ES6+) |
| **Styling** | CSS3 (Cyberpunk tema, animations) |
| **Database** | SQL Server 2019+, Entity Framework Migrations |
| **API** | REST, CORS enabled |
| **Auth** | JWT (HS256), SHA256 password hashing |
| **Build** | Vite (dev server + production build) |

## 🎨 UI Features

- **Cyberpunk tema**: Cyan (#00D9FF), Purple (#8338EC), neon glow effects
- **Animated scan-line**: Kontinuerlig animering som scannar genom sidan
- **Glasmorphism**: Frosted glass bakgrund på kort och formulär
- **Responsiv design**: Fungerar på desktop, tablet och mobil
- **Smooth transitions**: Hover-effekter och animerade UI-element

## 📁 Projektstruktur

```
TournamentFullstack-React/
├── api/                          # Backend (ASP.NET Core)
│   ├── Controllers/
│   ├── Models/
│   ├── Services/
│   ├── Data/
│   └── Program.cs
├── frontendVite/                 # Frontend (React + Vite)
│   ├── src/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── context/
│   │   ├── services/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
└── README.md
```

## 🔐 Säkerhet

- ✅ SHA256 password hashing (inte plaintext)
- ✅ JWT tokens med 24-timmars expiration
- ✅ CORS aktiverat för frontend-domain
- ✅ Role-baserad auktorisering på API
- ✅ Automatisk logout vid token-expiration
- ✅ Owner-baserad auktorisering (användare kan bara ändra sina egna spel)

## 🚀 Production Deployment

### Build Frontend
```powershell
cd frontendVite
npm run build  # Skapar dist/-mapp
```

### Publicera Backend
```powershell
cd api
dotnet publish -c Release
```

Deploy `dist/` från frontend-build till static file hosting (t.ex. Azure Blob Storage, GitHub Pages, etc.)

## 📝 Ytterligare Dokumentation

Se **IMPLEMENTATION.md** för:
- Detaljerad implementeringshistorik
- Alla ändringar och fixes
- Fullständig checklista
- Tekniska detaljer

---

**Status:** ✅ Production Ready  
**Version:** 1.0.0  
**Skapad:** 2026-03-20

---
Just nu finns det ingen medlemshantering och det borde också läggas till funktion att kunna hantera administratörer.
---

Vad som gick bra: Det har varit en kul uppgift att koppla föregående projekt och sedan kunnat utveckla in till ett mer komplett fullstack.
Det har varit kul att se utvecklingen av min struktur och clean code. 

---

Vad som var svårt: Det tuffaste har varit att försöka sluta gå för "Overkill" :)
