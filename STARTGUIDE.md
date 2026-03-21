# 🚀 Startguide - Tournament Manager

## 📋 Förutsättningar

Innan du startar, kontrollera att du har:

✅ **.NET 10.0 SDK** eller senare
- Kontrollera: `dotnet --version`

✅ **SQL Server** igång
- Instans: `MARCUSALPTOP\SQLEXPRESS`
- Databas: `TournamentDB`
- Kontrollera i SQL Server Management Studio

✅ **Modern webbläsare** (Chrome, Edge, Firefox, Safari)

## 🎯 Steg-för-steg Startguide

### STEG 1: Öppna två PowerShell-fönster

**Fönster 1** - För Backend API
**Fönster 2** - För Frontend webbserver

---

### STEG 2: Starta Backend API

I **Fönster 1** (Backend):

```powershell
cd C:\Users\Marcus\source\repos\TournamentFullstack\api
dotnet run
```

**Vänta tills du ser:**
```
Now listening on: http://localhost:5050
Application started.
```

✅ API:et är nu igång!

---

### STEG 3: Starta Frontend Webbserver

I **Fönster 2** (Frontend):

```powershell
cd C:\Users\Marcus\source\repos\TournamentFullstack\frontend
python -m http.server 8000
```

**Du ska se:**
```
Serving HTTP on 0.0.0.0 port 8000 (http://0.0.0.0:8000/) ...
```

✅ Webbserver är nu igång!

---

### STEG 4: Öppna Webbläsaren

1. Öppna din webbläsare
2. Gå till: **http://localhost:8000**
3. Du ska se Tournament Manager login-sida

---

## 🔐 Logga In

Du kan logga in med vilket username och lösenord som helst (minst 2 resp. 3 tecken):

**Exempel:**
- **Användarnamn:** testuser
- **Lösenord:** password123

Eller:
- **Användarnamn:** marcus
- **Lösenord:** 12345

---

## ✅ Testa Applikationen

Efter inloggning kan du testa:

### 1️⃣ Skapa en turnering
- Klicka "Lägg till turnering"
- Fyll i formulär (titel, beskrivning, maximal spelare, datum)
- Klicka "Lägg till turnering"

### 2️⃣ Välj turneringen
- Klicka på turneringen i vänster kolumn
- Du ska se turnering-detaljer på höger sida

### 3️⃣ Lägg till spel
- Klicka "Lägg till spel"
- Fyll i titel och tid
- Klicka "Lägg till spel"

### 4️⃣ Redigera och ta bort
- Klicka "Redigera" för att uppdatera
- Klicka "Ta bort" för att radera (bekräfta)

### 5️⃣ Logga ut
- Klicka "Logga ut" i övre högra hörnet

---

## 🔍 Felsökning

### ❌ Problem: "API:et är inte tillgängligt"

**Lösning:**
1. Kontrollera att API körs i Fönster 1
2. Kontrollera att terminalen visar `Now listening on: http://localhost:5050`
3. Prova öppna http://localhost:5050/api/auth/login i webbläsaren (ska visa ett JSON-felmeddelande)

---

### ❌ Problem: "Kan inte ansluta till databasen"

**Lösning:**
1. Öppna **SQL Server Management Studio**
2. Kontrollera att `MARCUSALPTOP\SQLEXPRESS` är tillgänglig
3. Kontrollera att databas `TournamentDB` finns
4. Om du behöver skapa databasen:
   ```sql
   CREATE DATABASE TournamentDB;
   ```

Eller, Entity Framework kommer automatiskt att skapa databasen och köra migrations när du startar API:et.

---

### ❌ Problem: "Python inte installerat"

Alternativ för att starta webbserver:

**Med Node.js + http-server:**
```powershell
cd frontend
npx http-server -p 8000
```

**Eller öppna direkt i VS Code:**
1. Installera "Live Server" extension i VS Code
2. Högerklicka på `frontend/index.html`
3. Välj "Open with Live Server"

---

### ❌ Problem: "Login fungerar inte"

**Lösning:**
1. Öppna DevTools (F12 eller Ctrl+Shift+I)
2. Gå till **Console**-fliken
3. Se vilka felmeddelanden som visas
4. Kontrollera att:
   - Användarnamn är minst 2 tecken
   - Lösenord är minst 3 tecken
   - API:et körs på port 5050

---

### ❌ Problem: "Spel-antal visar '...' istället för siffror"

**Lösning:**
1. Vänta några sekunder (data laddar asynkront)
2. Uppdatera sidan (F5)
3. Kontrollera DevTools Console för felmeddelanden

---

## 📊 Kontrollera att Allt Fungerar

### Testa API med cURL

Du kan testa API:et direkt med PowerShell:

```powershell
# 1. Logga in och få token
$loginResponse = Invoke-WebRequest -Uri "http://localhost:5050/api/auth/login" `
  -Method POST `
  -ContentType "application/json" `
  -Body @{username="testuser"; password="password123"} | ConvertFrom-Json

$token = $loginResponse.token

# 2. Hämta alla turneringar
Invoke-WebRequest -Uri "http://localhost:5050/api/tournaments" `
  -Method GET `
  -Headers @{Authorization="Bearer $token"} | ConvertFrom-Json
```

---

## 🛑 Stänga Av Applikationen

### Stäng Backend (Fönster 1)
```powershell
Ctrl+C
```

### Stäng Frontend (Fönster 2)
```powershell
Ctrl+C
```

Välj Y för att bekräfta.

---

## 📱 Endpoints Du Kan Testa

| Metod | Endpoint | Beskrivning |
|-------|----------|-------------|
| POST | `/api/auth/login` | Logga in |
| GET | `/api/tournaments` | Hämta alla turneringar |
| POST | `/api/tournaments` | Skapa turnering |
| PUT | `/api/tournaments/{id}` | Uppdatera turnering |
| DELETE | `/api/tournaments/{id}` | Ta bort turnering |
| GET | `/api/tournaments/{id}/games` | Hämta spel |
| POST | `/api/tournaments/{id}/games` | Skapa spel |
| PUT | `/api/tournaments/{id}/games/{gid}` | Uppdatera spel |
| DELETE | `/api/tournaments/{id}/games/{gid}` | Ta bort spel |

---

## 🎓 Struktur för Skolprojektet

```
📁 TournamentFullstack
├── 📁 api/                     ← ASP.NET Core REST API
│   ├── Controllers/            ← API-endpoints
│   ├── Services/               ← Business-logik
│   ├── Models/                 ← Datamodeller
│   ├── Data/                   ← Entity Framework
│   └── Program.cs              ← Startup
│
├── 📁 frontend/                ← HTML/CSS/JavaScript
│   ├── index.html              ← Huvudsida
│   ├── css/
│   │   └── styles.css          ← Styling
│   └── js/
│       ├── api-client.js       ← API-anrop
│       ├── auth.js             ← Login/Logout
│       ├── tournaments.js      ← Turnering-logik
│       ├── games.js            ← Spel-logik
│       └── app.js              ← Huvudapp
│
├── README.md                   ← Dokumentation
├── CODE_REVIEW.md              ← Kodgranskning
└── IMPLEMENTATION.md           ← Detta dokument

```

---

## ✅ Checklista

- [ ] .NET 10.0 SDK installerad
- [ ] SQL Server igång och databas skapad
- [ ] Backend-API startat och körs på :5050
- [ ] Frontend-webbserver startat på :8000
- [ ] Kan logga in med användarnamn/lösenord
- [ ] Kan skapa turnering
- [ ] Kan se turneringar i listan
- [ ] Kan skapa spel under turnering
- [ ] Kan redigera och ta bort data
- [ ] Kan logga ut

---

## 🎉 Du är redo!

Lycka till med Tournament Manager! ⚔️🎲

För mer information, se **README.md** eller **CODE_REVIEW.md**

