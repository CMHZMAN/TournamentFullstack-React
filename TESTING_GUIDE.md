# 🧪 TESTING GUIDE - JWT-Autentisering

## ✅ STEG-FÖR-STEG TESTING

### FÖRBEREDELSE

#### 1. Stäng alla tidigare instanser
```powershell
Stop-Process -Name dotnet -Force -ErrorAction SilentlyContinue
```

#### 2. Starta Backend
```powershell
cd C:\Users\Marcus\source\repos\TournamentFullstack\api
dotnet run
```

Vänta tills du ser:
```
Now listening on: http://localhost:5050
Application started. Press Ctrl+C to shut down.
```

#### 3. Öppna nytt PowerShell-fönster för Frontend
```powershell
cd C:\Users\Marcus\source\repos\TournamentFullstack\frontend
npx http-server -p 8000
```

Vänta tills du ser:
```
Starting up http-server, serving ./
Available on:
  http://127.0.0.1:8000
```

#### 4. Öppna Webbläsare
```
http://localhost:8000
```

---

## 🧪 TEST 1: LOGIN FLOW

### Test 1.1: Giltiga credentials
**Steg:**
1. Skriv användarnamn: `testuser`
2. Skriv lösenord: `password123`
3. Klicka "Logga in"

**Förväntat resultat:**
- ✅ Login-formulär försvinner
- ✅ App-sektion visas
- ✅ Du ser "Inloggad som: testuser"
- ✅ INGEN felmeddelande

**Verifiera token sparades:**
1. Öppna DevTools (F12)
2. Gå till **Application** → **localStorage**
3. Du ska se:
   - `tournament_jwt_token: eyJ...` (JWT-token)
   - `current_user: {"username":"testuser"...}`

---

### Test 1.2: Ogiltiga credentials
**Steg:**
1. Skriv användarnamn: `testuser`
2. Skriv lösenord: `fel123`
3. Klicka "Logga in"

**Förväntat resultat:**
- ✅ Felmeddelande: "Inloggning misslyckades" eller "Invalid or expired token"
- ✅ Login-formulär stannar kvar
- ✅ Du förblir på login-sida

---

### Test 1.3: Tomt användarnamn
**Steg:**
1. Lämna användarnamn tomt
2. Skriv lösenord: `password123`
3. Klicka "Logga in"

**Förväntat resultat:**
- ✅ Felmeddelande: "Användarnamn och lösenord är obligatoriska"
- ✅ Login-formulär visas fortfarande

---

## 🧪 TEST 2: TURNERINGAR (CRUD)

**Förutsättning:** Du är inloggad

### Test 2.1: Skapa Turnering
**Steg:**
1. Klicka "Lägg till turnering" (eller motsvarande knapp)
2. Fyll i:
   - **Titel:** "Test Tournament 1"
   - **Beskrivning:** "En test-turnering"
   - **Max spelare:** 16
   - **Datum:** Fram i tid (t.ex. nästa vecka kl 14:00)
3. Klicka "Lägg till turnering"

**Förväntat resultat:**
- ✅ Formulär försvinner
- ✅ Turnering visas i listan på vänster sida
- ✅ Turneringens namn syns
- ✅ Spel-antal visar "0 spel"
- ✅ INGEN felmeddelande

---

### Test 2.2: Välja Turnering
**Steg:**
1. Klicka på turneringen "Test Tournament 1" i vänster kolumn

**Förväntat resultat:**
- ✅ Turneringen markeras som aktiv (färg/bakgrund)
- ✅ Detaljer visas på höger sida:
  - Titel: "Test Tournament 1"
  - Beskrivning: "En test-turnering"
  - Max spelare: 16
  - Datum: Ditt valda datum
  - Spel: 0

---

### Test 2.3: Redigera Turnering
**Steg:**
1. Se till att turnering är vald
2. Klicka "Redigera" knapp
3. Ändra:
   - **Titel:** "Test Tournament 1 - UPPDATERAD"
   - **Max spelare:** 20
4. Klicka "Uppdatera turnering" (eller motsvarande)

**Förväntat resultat:**
- ✅ Turneringen uppdateras i listan
- ✅ Nya värden visas i detaljer
- ✅ Titel är nu "Test Tournament 1 - UPPDATERAD"
- ✅ Max spelare är nu 20

---

## 🧪 TEST 3: SPEL (CRUD)

**Förutsättning:** Du är inloggad och en turnering är vald

### Test 3.1: Skapa Spel
**Steg:**
1. Klicka "Lägg till spel"
2. Fyll i:
   - **Titel:** "Match 1"
   - **Tid:** Fram i tid (t.ex. samma dag som turnering, kl 15:00)
3. Klicka "Lägg till spel"

**Förväntat resultat:**
- ✅ Spel-formulär försvinner
- ✅ Spelet visas i spel-listan
- ✅ "Match 1" syns med sitt datum/tid
- ✅ Turneringens spel-antal uppdateras från "0 spel" till "1 spel"
- ✅ INGEN felmeddelande

---

### Test 3.2: Redigera Spel
**Steg:**
1. Klicka "Redigera" på spelet
2. Ändra:
   - **Titel:** "Match 1 - UPPDATERAD"
   - **Tid:** Samma eller annan tid
3. Klicka "Uppdatera spel"

**Förväntat resultat:**
- ✅ Spelet uppdateras i listan
- ✅ Titel är nu "Match 1 - UPPDATERAD"
- ✅ Ny tid visas

---

### Test 3.3: Ta Bort Spel
**Steg:**
1. Klicka "Ta bort" på spelet

**Förväntat resultat:**
- ✅ Bekräftelsedialog visas: "Är du säker på att du vill ta bort detta spel?"
- ✅ Klicka "OK" / "Ja"

**Efter bekräftelse:**
- ✅ Spelet försvinner från listan
- ✅ Spel-antal uppdateras tillbaka till "0 spel"
- ✅ INGEN felmeddelande

---

## 🧪 TEST 4: LOGOUT

**Steg:**
1. Klicka "Logga ut" knapp (övre högra hörnet)

**Förväntat resultat:**
- ✅ App-sektion döljs
- ✅ Login-sektion visas igen
- ✅ Formulär är tomt
- ✅ Du kan logga in igen

**Verifiera token togs bort:**
1. DevTools → **Application** → **localStorage**
2. `tournament_jwt_token` är BORTA
3. `current_user` är BORTA

---

## 🧪 TEST 5: TOKEN EXPIRATION (Advanced)

**Förutsättning:** Du är inloggad

### Test 5.1: Manuell Token-borttagning
**Steg:**
1. DevTools → **Application** → **localStorage**
2. Klicka på `tournament_jwt_token`
3. Radera värdet (eller högerklicka Delete)
4. Försök skapa ny turnering eller göra något API-anrop

**Förväntat resultat:**
- ✅ Du får felmeddelande: "Din session har gått ut. Vänligen logga in igen."
- ✅ Login-sektion visas igen
- ✅ Du måste logga in på nytt

---

## 🧪 TEST 6: API-ENDPOINTS (Manual Testing)

### Test 6.1: POST /api/auth/login

**PowerShell:**
```powershell
$response = Invoke-WebRequest -Uri "http://localhost:5050/api/auth/login" `
  -Method POST `
  -ContentType "application/json" `
  -Body @{username="testuser"; password="password123"} | ConvertFrom-Json

$token = $response.token
Write-Host "Token: $token"
Write-Host "Username: $response.username"
```

**Förväntat resultat:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "username": "testuser",
  "message": "Inloggning lyckades"
}
```

---

### Test 6.2: GET /api/tournaments (Med Token)

**PowerShell:**
```powershell
$token = "DIN_TOKEN_HÄR"  # Från test 6.1

$response = Invoke-WebRequest -Uri "http://localhost:5050/api/tournaments" `
  -Method GET `
  -Headers @{Authorization="Bearer $token"} | ConvertFrom-Json

$response | ConvertTo-Json
```

**Förväntat resultat:**
```json
[
  {
    "id": 1,
    "title": "Test Tournament 1",
    "description": "...",
    "maxPlayers": 16,
    "date": "2026-03-27T14:00:00Z",
    "games": []
  }
]
```

---

### Test 6.3: GET /api/tournaments (Utan Token)

**PowerShell:**
```powershell
$response = Invoke-WebRequest -Uri "http://localhost:5050/api/tournaments" `
  -Method GET
```

**Förväntat resultat:**
- ❌ **Fel:** 401 Unauthorized
- ❌ Felmeddelande: "Invalid or expired token"

---

## ✅ SLUTCHECKLISTA

- [ ] Login med giltiga credentials fungerar
- [ ] Login med ogiltiga credentials visar fel
- [ ] Token sparas i localStorage
- [ ] Kan skapa turnering
- [ ] Kan se turnering i lista
- [ ] Kan redigera turnering
- [ ] Kan ta bort turnering
- [ ] Kan skapa spel under turnering
- [ ] Kan redigera spel
- [ ] Kan ta bort spel
- [ ] Spel-antal uppdateras
- [ ] Logout fungerar
- [ ] Token raderas vid logout
- [ ] API-endpoints svarar korrekt
- [ ] 401-errors hanteras rätt

---

## 🐛 FELSÖKNING

### Problem: "Token expired or invalid" vid alla API-anrop
**Lösning:**
1. Logga ut och logga in på nytt
2. Kontrollera att token sparas i localStorage
3. Se DevTools Console för detaljerade felmeddelanden

### Problem: "Cannot POST /api/auth/login"
**Lösning:**
1. Kontrollera att Backend API körs (`dotnet run`)
2. Kontrollera att URL är `http://localhost:5050`
3. Verifiera att AuthController finns

### Problem: "CORS error"
**Lösning:**
1. Kontrollera att CORS är aktiverat i Program.cs
2. Verifiera att frontend-URL är tillåten
3. Starta om backend-API

---

## 📞 DEBUG-COMMANDS

### Visa alla localStorage-värden
```javascript
// I DevTools Console
console.log(localStorage);
```

### Visa JWT-token-innehål
```javascript
// I DevTools Console
const token = localStorage.getItem('tournament_jwt_token');
const parts = token.split('.');
const payload = JSON.parse(atob(parts[1]));
console.log(payload);
```

### Kontrollera API-status
```powershell
Invoke-WebRequest -Uri "http://localhost:5050/api/auth/login" -Method GET
```

---

**Lycka till med testningen!** ✅

