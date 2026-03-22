# ⚔️ Tournament Manager

En fullstack-webbapplikation för att hantera turneringar och spel med JWT-baserad autentisering.

## 🎯 Vad gör applikationen?

Tournament Manager låter dig:
- **Skapa turneringar** med titel, beskrivning, datum och max antal spelare
- **Organisera spel** under turneringar med specifika tider
- **Redigera och ta bort** turneringar och spel
- **Logga in säkert** via JWT-autentisering
- **Tracking** av antal spel per turnering

## 🚀 Hur kör man projektet?

### Förutsättningar
- .NET 10.0 SDK
- SQL Server (MARCUSLAPTOP\SQLEXPRESS med databas TournamentDB)
- Node.js (för webserver)
- Modern webbläsare

### Starta Backend (Terminal 1)
```powershell
cd api
dotnet run
```
API börjar på **http://localhost:5050**

### Starta Frontend (Terminal 2)
```powershell
cd frontend
npx http-server -p 8000
```
Webbläsare: **http://localhost:8000**

### Logga In
- **Användarnamn:** testuser
- **Lösenord:** password123

## 📡 API Endpoints

### Autentisering
```
POST   /api/auth/login              Logga in och få JWT-token
```

### Turneringar
```
GET    /api/tournaments             Hämta alla turneringar
POST   /api/tournaments             Skapa ny turnering
PUT    /api/tournaments/{id}        Uppdatera turnering
DELETE /api/tournaments/{id}        Ta bort turnering
```

### Spel
```
GET    /api/tournaments/{id}/games           Hämta spel för turnering
POST   /api/tournaments/{id}/games           Skapa spel
PUT    /api/tournaments/{id}/games/{gid}    Uppdatera spel
DELETE /api/tournaments/{id}/games/{gid}    Ta bort spel
```

## 🔗 Hur pratar Frontend med API:et?

Frontend använder **Fetch API** med JWT-autentisering:

1. **Login** → Backend returnerar JWT-token
2. **Spara token** → localStorage på klienten
3. **API-anrop** → Token skickas i `Authorization: Bearer <token>` header
4. **Automatisk logout** → Vid 401-respons från server

### Exempel API-anrop:
```javascript
// Login
const response = await fetch('http://localhost:5050/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
});
const { token } = await response.json();
localStorage.setItem('tournament_jwt_token', token);

// Autentiserad request
const games = await fetch('http://localhost:5050/api/tournaments/1/games', {
    headers: { 'Authorization': `Bearer ${token}` }
});
```

## 🛠️ Teknikstack

| Layer | Teknik |
|-------|--------|
| **Backend** | ASP.NET Core 10.0, C#, Entity Framework |
| **Frontend** | HTML5, CSS3, Vanilla JavaScript (ES6+) |
| **Database** | SQL Server 2019+, Entity Framework Migrations |
| **API** | REST, CORS enabled |
| **Auth** | JWT (HS256) |

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
