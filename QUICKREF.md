# ⚡ Snabbreferens - Tournament Manager

## 🚀 Snabbstart (30 sekunder)

### Terminal 1 - Starta Backend
```powershell
cd C:\Users\Marcus\source\repos\TournamentFullstack\api
dotnet run
```
⏳ Vänta tills du ser: `Now listening on: http://localhost:5050`

### Terminal 2 - Starta Frontend
```powershell
cd C:\Users\Marcus\source\repos\TournamentFullstack\frontend
python -m http.server 8000
```
⏳ Vänta tills du ser: `Serving HTTP on 0.0.0.0 port 8000`

### Webbläsare
```
http://localhost:8000
```

---

## 🔐 Logga In
- **Användarnamn:** (minst 2 tecken, t.ex. testuser)
- **Lösenord:** (minst 3 tecken, t.ex. password123)

---

## 📋 Vanliga Uppgifter

### Bygga Backend
```powershell
cd api
dotnet build
```

### Rensa och Bygga
```powershell
cd api
dotnet clean
dotnet build
```

### Uppdatera NuGet-paket
```powershell
cd api
dotnet restore
```

### Databas-migrering
```powershell
cd api
dotnet ef database update
```

---

## 🔗 Viktiga URLs

| Tjänst | URL |
|--------|-----|
| Frontend | http://localhost:8000 |
| Backend API | http://localhost:5050 |
| API Docs | http://localhost:5050/api/auth/login |

---

## 📡 API Endpoints

### Login
```
POST http://localhost:5050/api/auth/login
Content-Type: application/json

{
  "username": "testuser",
  "password": "password123"
}
```

### Tournaments
```
GET    http://localhost:5050/api/tournaments
POST   http://localhost:5050/api/tournaments
PUT    http://localhost:5050/api/tournaments/{id}
DELETE http://localhost:5050/api/tournaments/{id}
```

### Games
```
GET    http://localhost:5050/api/tournaments/{id}/games
POST   http://localhost:5050/api/tournaments/{id}/games
PUT    http://localhost:5050/api/tournaments/{id}/games/{gid}
DELETE http://localhost:5050/api/tournaments/{id}/games/{gid}
```

---

## 🛑 Stänga Av

**Terminal 1 (Backend):**
```powershell
Ctrl+C
Y (för att bekräfta)
```

**Terminal 2 (Frontend):**
```powershell
Ctrl+C
Y (för att bekräfta)
```

---

## 📂 Viktiga Filer

| Fil | Syfte |
|-----|-------|
| `api/Program.cs` | Backend-startup |
| `api/appsettings.json` | Databaskonfiguration |
| `api/Controllers/AuthController.cs` | Login-endpoint |
| `api/Controllers/TournamentsController.cs` | Turnering-API |
| `api/Controllers/GamesController.cs` | Spel-API |
| `frontend/index.html` | Huvudsida |
| `frontend/js/auth.js` | Login-logik |
| `frontend/js/api-client.js` | API-kommunikation |

---

## 🔧 Felsökning (Snabb)

| Problem | Lösning |
|---------|---------|
| "API inte tillgängligt" | Kontrollera att `dotnet run` körs i api/ |
| "Databas inte tillgänglig" | Kontrollera SQL Server är igång |
| "Python inte installerad" | Använd `npx http-server -p 8000` istället |
| "Login fungerar inte" | Öppna DevTools (F12) → Console för felmeddelanden |
| "Spel laddar inte" | Vänta några sekunder eller uppdatera sidan (F5) |

---

## 📊 Database

**Server:** MARCUSALPTOP\SQLEXPRESS
**Database:** TournamentDB

### Skapa databas (om den inte finns)
```sql
CREATE DATABASE TournamentDB;
```

### Kontrollera migrations
```powershell
cd api
dotnet ef migrations list
```

---

## 🎯 Típical Workflow

1. **Starta Backend**
   ```powershell
   cd api
   dotnet run
   ```

2. **Starta Frontend** (nytt terminal-fönster)
   ```powershell
   cd frontend
   python -m http.server 8000
   ```

3. **Öppna Webbläsare**
   ```
   http://localhost:8000
   ```

4. **Logga In**
   - Användarnamn: testuser
   - Lösenord: password123

5. **Testa Funktioner**
   - Skapa turnering
   - Lägg till spel
   - Redigera/ta bort data
   - Logga ut

---

## 💡 Tips

- Håll DevTools öppen (F12) under testning för att se API-anrop
- Använd Ctrl+Shift+I för att öppna DevTools snabbt
- Använd Network-fliken för att inspektera API-svar
- Använd Console-fliken för JavaScript-fel

---

## 📚 Mer Information

- **STARTGUIDE.md** - Detaljerad startguide
- **README.md** - Full dokumentation
- **CODE_REVIEW.md** - Kodgranskning
- **IMPLEMENTATION.md** - Implementeringskrav
- **SETUP_CHECKLIST.md** - Fullständig checklista

---

**Senast uppdaterad:** 2026-03-20

