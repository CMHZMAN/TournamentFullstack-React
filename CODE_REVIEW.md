# 🔍 Code Review: Tournament Fullstack Application

## Executive Summary
The application has a solid foundation but contains several critical bugs, security concerns, and error-handling gaps that could cause runtime failures or poor user experience. Below is a detailed analysis with severity levels.

---

## 🔴 CRITICAL ISSUES

### 1. **JWT Token Validation is Not Implemented**
**File:** `frontend/js/auth.js`
**Severity:** CRITICAL

**Problem:**
- The mock JWT token is being created on the client-side without validation
- No token expiration checking is implemented
- The token format is fake: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.${btoa(JSON.stringify(mockPayload))}.mock_signature`
- The backend will reject these fake tokens if it validates them

**Example:**
```javascript
// Current code - INSECURE
const mockToken = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.${btoa(JSON.stringify(mockPayload))}.mock_signature`;
apiClient.setToken(mockToken);
```

**Impact:** The app won't actually work with the backend API if it validates JWT tokens.

**Recommendation:**
- Implement a real authentication endpoint on the backend (e.g., `POST /api/auth/login`)
- The backend should return a valid JWT token after credentials are verified
- Store only valid tokens from the server

---

### 2. **XSS Vulnerability in Tournament Sidebar**
**File:** `frontend/js/tournaments.js`, line ~90
**Severity:** CRITICAL

**Problem:**
- HTML content is directly inserted into the DOM without proper escaping in one location
- `escapeHtml()` is called for title but not consistently everywhere

**Example:**
```javascript
// This line uses escapeHtml ✓
return `<h3>${escapeHtml(tournament.title)}</h3>
// But this could be vulnerable
<div>${escapeHtml(tournament.description || 'Ingen beskrivning')}</div>
```

**Impact:** User-supplied data could execute malicious scripts.

**Recommendation:**
- Ensure all dynamic content is escaped using `escapeHtml()`
- Consider using `textContent` instead of `innerHTML` where possible
- Use template literals with sanitized values

---

### 3. **Race Condition in Tournament Selection**
**File:** `frontend/js/tournaments.js`, line ~105
**Severity:** HIGH

**Problem:**
```javascript
async function selectTournament(tournamentId) {
    selectedTournamentId = tournamentId;
    const tournament = tournamentsData.find(t => t.id === tournamentId);
    
    if (!tournament) return; // Possible race condition here
    
    // ... later in showTournamentDetails
    loadGamesForTournament(tournament.id); // This is async but not awaited
}
```

**Impact:**
- If `tournamentsData` is being refreshed while selecting, the tournament could disappear
- `loadGamesForTournament()` is async but not awaited, causing race conditions with game loading

**Recommendation:**
- Await the games loading before showing the tournament
- Add null checks and error handling
- Lock the selection UI while loading

---

### 4. **No Error Boundary or Loading States During API Calls**
**File:** Multiple files (games.js, tournaments.js)
**Severity:** HIGH

**Problem:**
```javascript
async function handleTournamentFormSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    // ... no button disable, no loading indicator
    await apiClient.createTournament(tournamentData); // If this fails, user might click again
    // User could submit form multiple times
}
```

**Impact:**
- Users can submit forms multiple times during network latency
- Duplicate tournaments/games can be created
- No visual feedback that a request is in progress

**Recommendation:**
- Disable submit buttons during API calls
- Add loading indicators
- Implement request debouncing/throttling

---

### 5. **Insufficient Input Validation**
**File:** `frontend/js/tournaments.js`, `frontend/js/games.js`
**Severity:** HIGH

**Problem:**
```javascript
const maxPlayers = parseInt(formData.get('maxPlayers'));
// No validation for:
// - NaN values
// - Negative numbers
// - Extremely large values
// - Title/description max lengths

const title = formData.get('title');
// No check for empty strings after trim()
// No length validation
```

**Impact:**
- Invalid data can be sent to the API
- API might reject it, or worse, accept it
- Poor user experience with no validation feedback

**Recommendation:**
```javascript
function validateTournament(data) {
    if (!data.title?.trim()) throw new Error('Titel är obligatorisk');
    if (data.title.trim().length > 100) throw new Error('Titel är för lång');
    if (isNaN(data.maxPlayers) || data.maxPlayers < 1) throw new Error('Maximal spelare måste vara ett positivt tal');
    if (data.maxPlayers > 1000) throw new Error('Maximal spelare kan inte överstiga 1000');
    return true;
}
```

---

## 🟠 HIGH PRIORITY ISSUES

### 6. **Event Delegation Problem with Dynamically Added Elements**
**File:** `frontend/js/tournaments.js`, line ~105
**Severity:** HIGH

**Problem:**
```javascript
// In renderTournamentsSidebar:
return `<div ... onclick="selectTournament(${tournament.id})">
```

**Issue:**
- Using inline `onclick` on dynamically created elements is fragile
- `selectTournament()` relies on `event.currentTarget` being set correctly
- If called programmatically, `event` might be undefined

```javascript
async function selectTournament(tournamentId) {
    // ...
    event.currentTarget.classList.add('active'); // WILL FAIL if called without event!
}
```

**Recommendation:**
```javascript
// Use event delegation instead
document.getElementById('tournaments-list').addEventListener('click', (e) => {
    const card = e.target.closest('.tournament-card-sidebar');
    if (card) {
        const id = parseInt(card.dataset.tournamentId);
        selectTournament(id);
    }
});

// In template:
return `<div class="tournament-card-sidebar" data-tournament-id="${tournament.id}">...`;
```

---

### 7. **Missing Null/Undefined Checks in API Responses**
**File:** `frontend/js/api-client.js`
**Severity:** HIGH

**Problem:**
```javascript
async request(endpoint, options = {}) {
    // ...
    const data = await response.json().catch(() => ({})); // Returns empty object on parse error
    
    if (!response.ok) {
        throw new Error(data.error || `HTTP Error: ${response.status}`);
    }
    return data; // Could be empty, could be null, could be malformed
}
```

**Impact:**
- If the server returns invalid JSON, the error is silently caught
- The app might proceed with empty objects instead of proper error handling

**Recommendation:**
```javascript
async request(endpoint, options = {}) {
    // ...
    let data;
    try {
        const text = await response.text();
        data = text ? JSON.parse(text) : null;
    } catch (parseError) {
        console.error('JSON parse error:', parseError);
        throw new Error('Server response format is invalid');
    }
    
    if (!response.ok) {
        throw new Error(data?.error || `HTTP Error: ${response.status}`);
    }
    return data;
}
```

---

### 8. **CORS Configuration is Too Permissive**
**File:** `api/Program.cs`
**Severity:** MEDIUM-HIGH

**Problem:**
```csharp
policy.AllowAnyOrigin()
      .AllowAnyMethod()
      .AllowAnyHeader();
```

**Impact:**
- Any website can make requests to your API
- Security vulnerability in production
- Credentials can be leaked

**Recommendation:**
```csharp
policy.WithOrigins("http://localhost:3000", "https://yourdomain.com")
      .AllowAnyMethod()
      .AllowAnyHeader()
      .AllowCredentials(); // If using cookies
```

---

### 9. **No Conflict Resolution for Concurrent Edits**
**File:** `frontend/js/tournaments.js`, line ~305
**Severity:** MEDIUM-HIGH

**Problem:**
- If Tournament A is edited by User 1 while User 2 edits it, the last one wins
- No version control or optimistic locking
- No timestamp validation

**Impact:**
- Data loss on concurrent edits
- User edits can be overwritten without warning

**Recommendation:**
- Add `updatedAt` timestamp to models
- Check if data changed on server before updating
- Show conflict resolution UI

---

### 10. **Missing CSRF Protection**
**File:** All frontend files
**Severity:** MEDIUM

**Problem:**
- No CSRF tokens are being used
- API accepts requests without any CSRF protection tokens

**Impact:**
- Cross-Site Request Forgery attacks are possible
- A malicious site could perform actions on behalf of the user

**Recommendation:**
- Implement CSRF token generation on the server
- Include CSRF tokens in all POST/PUT/DELETE requests
- Validate tokens on the backend

---

## 🟡 MEDIUM PRIORITY ISSUES

### 11. **Token Expiration Not Handled**
**File:** `frontend/js/auth.js`, line ~45
**Severity:** MEDIUM

**Problem:**
```javascript
// Mock token with fake expiration
exp: Math.floor(Date.now() / 1000) + (3600 * 24) // 24 hours

// But it's never checked before making API calls
// The 401 handling is in the API client but doesn't refresh tokens
```

**Impact:**
- Token will "expire" but app won't know
- User must manually re-login
- No token refresh mechanism

**Recommendation:**
```javascript
class AuthManager {
    isTokenExpired() {
        const token = apiClient.getToken();
        if (!token) return true;
        
        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            const exp = payload.exp * 1000; // Convert to milliseconds
            return Date.now() > exp;
        } catch {
            return true;
        }
    }
    
    async refreshToken() {
        // Call backend to refresh token
    }
}
```

---

### 12. **Memory Leak: Global Variables and Event Listeners**
**File:** All JavaScript files
**Severity:** MEDIUM

**Problem:**
```javascript
// In tournaments.js
let tournamentsData = [];
let selectedTournamentId = null;
let editingTournamentId = null;

// In games.js
let gamesData = [];
let editingGameId = null;

// Multiple DOMContentLoaded listeners could be added without cleanup
document.addEventListener('DOMContentLoaded', () => {
    initTournaments();
});
```

**Impact:**
- Global variables accumulate in memory
- If files are hot-reloaded in development, listeners duplicate
- Potential memory leaks in SPAs

**Recommendation:**
```javascript
class TournamentManager {
    constructor() {
        this.tournamentsData = [];
        this.selectedTournamentId = null;
        this.editingTournamentId = null;
    }
    
    init() {
        this.setupEventListeners();
    }
    
    destroy() {
        // Clean up listeners
    }
}
```

---

### 13. **No Pagination or Lazy Loading**
**File:** `frontend/js/tournaments.js`
**Severity:** MEDIUM

**Problem:**
```javascript
async function loadTournaments() {
    tournamentsData = await apiClient.getTournaments(); // Loads ALL tournaments
    
    for (let tournament of tournamentsData) {
        const games = await apiClient.getGames(tournament.id); // N+1 query problem
        tournament.gameCount = games ? games.length : 0;
    }
}
```

**Impact:**
- If there are 1000 tournaments, all are loaded
- N+1 problem: 1 request for tournaments + 1 per tournament = 1001 requests
- Slow initial load
- UI freezes with large datasets

**Recommendation:**
- Add pagination: `/tournaments?page=1&pageSize=20`
- Add search/filter before loading all data
- Lazy load game counts only when needed

---

### 14. **No Loading State for Games in Sidebar**
**File:** `frontend/js/tournaments.js`, line ~60
**Severity:** MEDIUM

**Problem:**
```javascript
tournament.gameCount = games ? games.length : 0;
// But this is shown immediately in the sidebar
// Then reloaded when tournament is selected
// The count might show old data or "..." inconsistently
```

**Impact:**
- Sidebar shows incorrect game counts
- Confusing user experience
- No indicator that data is loading

**Recommendation:**
- Don't show game count in sidebar, only in details
- Or show loading indicator in the count

---

### 15. **No Confirmation Dialogs for Destructive Actions (Incomplete)**
**File:** `frontend/js/tournaments.js`, line ~325
**Severity:** MEDIUM

**Problem:**
```javascript
async function deleteCurrentTournament() {
    if (!confirm('Är du säker...')) { // Uses browser confirm (okay but not ideal)
        return;
    }
    // ...
}

// Games have confirmation too, but tournaments use browser confirm
// Inconsistent UX
```

**Impact:**
- Different deletion confirmation patterns
- Browser confirm is blocky and not themeable

**Recommendation:**
- Create custom confirmation modal
- Apply consistently everywhere

---

## 🟢 LOW PRIORITY ISSUES

### 16. **Console Logging for Production**
**File:** Multiple files
**Severity:** LOW

**Problem:**
```javascript
console.log('Game saved successfully');
console.error('Error loading tournaments:', error);
console.warn(`Could not load games...`);
```

**Impact:**
- Sensitive info might leak in console
- Confuses users
- Makes app look unpolished in dev tools

**Recommendation:**
```javascript
// Use a logging utility
const logger = {
    log: (msg) => process.env.NODE_ENV !== 'production' && console.log(msg),
    error: (msg) => console.error(`[ERROR] ${msg}`), // Always log errors
    warn: (msg) => console.warn(`[WARN] ${msg}`)
};
```

---

### 17. **Hardcoded API URL**
**File:** `frontend/js/api-client.js`
**Severity:** LOW

**Problem:**
```javascript
const API_CONFIG = {
    BASE_URL: 'http://localhost:5050/api', // Hardcoded
};
```

**Impact:**
- Can't easily switch between environments (dev, staging, prod)
- No way to deploy to different servers without code change

**Recommendation:**
```javascript
// In .env or .env.local
VITE_API_BASE_URL=http://localhost:5050/api

// In code
const API_CONFIG = {
    BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5050/api',
};
```

---

### 18. **Missing Date/Time Timezone Awareness**
**File:** `frontend/js/games.js`, line ~130
**Severity:** LOW

**Problem:**
```javascript
const gameTime = new Date(time);
const now = new Date();

if (gameTime <= now) {
    errorElement.textContent = 'Datum och tid måste vara i framtiden';
}

// User's local timezone might be different from server timezone
// Comparison might be incorrect
```

**Impact:**
- Timezone-related bugs
- User in NYC and server in Stockholm have different "now"

**Recommendation:**
- Use ISO 8601 format (already doing with `toISOString()`)
- Always store in UTC
- Handle timezone in display/validation properly

---

### 19. **Inconsistent Error Messages**
**File:** Multiple files
**Severity:** LOW

**Problem:**
```javascript
// Different error messages patterns:
errorElement.textContent = error.message || 'Inloggning misslyckades';
errorElement.textContent = `Fel: ${error.message}`;
errorElement.textContent = `Fel vid borttagning: ${error.message}`;
showErrorBanner(`Fel vid borttagning: ${error.message}`);
```

**Impact:**
- Inconsistent user experience
- Confusing error presentation

**Recommendation:**
```javascript
function formatError(error) {
    return `⚠️ ${error.message || 'Ett okänt fel uppstod'}`;
}

// Use everywhere:
errorElement.textContent = formatError(error);
```

---

### 20. **CSS Classes vs State Management**
**File:** Multiple HTML files
**Severity:** LOW

**Problem:**
```javascript
// Showing/hiding with class manipulation
noSelection.classList.add('hidden');
detailsView.classList.remove('hidden');

// This is manual state management
// Hard to track, easy to get out of sync
```

**Impact:**
- UI state can become inconsistent
- Hard to debug
- Fragile code

**Recommendation:**
- Use a simple state management pattern
- Or use a framework like Vue/React for larger apps

---

## 📊 Summary Table

| Issue | Severity | Category | File |
|-------|----------|----------|------|
| Mock JWT tokens | CRITICAL | Security | auth.js |
| XSS vulnerability | CRITICAL | Security | tournaments.js |
| Race conditions | HIGH | Logic | tournaments.js |
| No loading states | HIGH | UX | games.js, tournaments.js |
| Input validation | HIGH | Validation | tournaments.js, games.js |
| Event delegation | HIGH | Logic | tournaments.js |
| Missing null checks | HIGH | Robustness | api-client.js |
| CORS too permissive | MEDIUM | Security | Program.cs |
| Concurrent edits | MEDIUM | Data Integrity | tournaments.js |
| No CSRF protection | MEDIUM | Security | All |
| Token expiration | MEDIUM | Security | auth.js |
| Memory leaks | MEDIUM | Performance | All |
| No pagination | MEDIUM | Performance | tournaments.js |
| Game count sync | MEDIUM | UX | tournaments.js |
| Delete confirmation | MEDIUM | UX | tournaments.js |
| Console logging | LOW | Polish | Multiple |
| Hardcoded URLs | LOW | Deployment | api-client.js |
| Timezone issues | LOW | Logic | games.js |
| Error messages | LOW | UX | Multiple |
| State management | LOW | Architecture | Multiple |

---

## ✅ Positive Findings

1. ✅ Good separation of concerns (auth.js, tournaments.js, games.js, api-client.js)
2. ✅ HTML escaping function implemented and mostly used
3. ✅ Proper async/await handling in most places
4. ✅ Good error handling in API client (401 token refresh)
5. ✅ Form reset after successful operations
6. ✅ Confirmation dialogs for destructive operations
7. ✅ Clear code comments and JSDoc style
8. ✅ Responsive design considerations in CSS
9. ✅ Database migrations handled in Program.cs
10. ✅ Entity Framework used correctly

---

## 🎯 Recommended Fix Priority

**Fix immediately (Today):**
- [ ] Implement real JWT authentication (not mock tokens)
- [ ] Fix XSS vulnerability - review all DOM insertions
- [ ] Add input validation
- [ ] Disable submit buttons during API calls
- [ ] Fix event delegation in tournament selection

**Fix soon (This week):**
- [ ] Add error boundaries and proper error handling
- [ ] Implement token expiration checking
- [ ] Limit CORS to specific origins
- [ ] Add pagination for large datasets
- [ ] Fix race conditions in tournament selection

**Fix later (This sprint):**
- [ ] Implement CSRF protection
- [ ] Add loading states throughout
- [ ] Refactor global state to class-based management
- [ ] Add custom confirmation dialogs
- [ ] Implement conflict resolution for concurrent edits

---

