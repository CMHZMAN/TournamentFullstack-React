# 🔧 FIX - UPPDATERING AV SPEL & SPEL-ANTAL

## 🐛 PROBLEM

1. **Spel-uppdatering fungerade inte** - PUT-anrop fungerade men frontend skickade fel data
2. **Spel-antal uppdaterades inte** - När spel lades till/uppdaterades uppdaterades inte antalet i turneringskortet

## ✅ LÖSNING

### Frontend: `games.js`

**Problem:** Vi skickade `tournamentId` även vid uppdateringar, vilket inte behövs.

**Fix:**
```javascript
// Innan: Skickade tournamentId alltid
const gameData = {
    title,
    time: gameTime.toISOString(),
    tournamentId: selectedTournamentId
};

// Efter: Skickar bara tournamentId för nya spel
const gameData = {
    title,
    time: gameTime.toISOString()
};

// Endast för nya spel:
if (!editingGameId) {
    gameData.tournamentId = selectedTournamentId;
}
```

### Spel-antal uppdateras nu

**Efter spel läggs till eller uppdateras:**
```javascript
// Reload tournaments to update counts
const tournament = tournamentsData.find(t => t.id === selectedTournamentId);
if (tournament) {
    await loadTournaments();
}
```

Detta uppdaterar:
- ✅ Spel-listan
- ✅ Spel-antalet i turneringskortet (vänstersidan)
- ✅ Spel-antalet i detaljer-vyn (högersidan)

## 🚀 NÄSTA STEG

1. **Bygg projektet:**
```powershell
cd api
dotnet build
```

2. **Starta API:et på nytt:**
```powershell
dotnet run
```

3. **Testa:**
   - Skapa ett spel → Antalet ska uppdateras på kortet
   - Redigera ett spel → Antalet ska förblir samma, men spel-detaljer uppdateras
   - Ta bort ett spel → Antalet ska minska

## 📊 ÄNDRADE FILER

| Fil | Ändring |
|-----|---------|
| `frontend/js/games.js` | Fixad PUT-data och lagt till reload av turneringar |

---

**Status:** ✅ FIXAD
**Nästa:** Build och test!
