# 📚 Tournament Manager - Lärandemål Sammanfattning

En komprehensiv fullstack-webbapplikation som demonstrerar grundläggande och avancerade koncept inom webbutveckling, säkerhet och systemintegration.

---

## 1️⃣ RESTful API-Design och Arkitektur

Tournament Manager bygger ett **helt eget ASP.NET Core REST API** som är grunden för hela applikationen. APIet är designat enligt RESTful-principer, vilket innebär att det använder HTTP-metoder (GET, POST, PUT, DELETE) för att representera CRUD-operationer på resurser.

**Hur det tillämpas:**
- **Endpoints** för turneringar och spel följer RESTful-konvention: `/api/tournaments/{id}/games` representerar spel som tillhör en specifik turnering
- **HTTP-metoder** används korrekt: GET för att hämta data, POST för att skapa, PUT för uppdateringar, DELETE för borttagning
- **Statuskoder** returneras lämpligt: 200 OK för lyckade operationer, 201 Created för nya resurser, 401 Unauthorized för autentiseringsproblem, 403 Forbidden för otillräckliga rättigheter
- **Strukturerad error-hantering** gör att API:et returnerar meningsfulla felmeddelanden som frontend kan använda för att informera användaren

APIet är också **versionerat för framtida expansion** och designat för att kunna skalas upp med fler funktioner utan att behöva refaktorera grundstrukturen.

---

## 2️⃣ JSON-Format och HTTP-Protokoll

Kommunikationen mellan frontend och backend sker **helt över HTTP med JSON-format**, vilket är standarden för moderna webbtillämpningar.

**Hur det tillämpas:**
- **JSON-utbyte:** API:et skickar och tar emot alla data i JSON-format. En login-request innehåller användaruppgifter i JSON, och API:et returnerar en JWT-token (också i JSON)
- **Request/Response-cyklus:** Frontend skickar strukturerad JSON-data (t.ex. `{"username": "user", "password": "pass"}`), backend validerar och bearbetar datan, och returnerar JSON-svar (t.ex. `{"token": "eyJ...", "username": "user", "roles": ["User"]}`)
- **HTTP-headers:** Authorization-headern innehåller JWT-tokenet i formatet `Authorization: Bearer <token>`, vilket är HTTP-standarden för autentisering
- **Content-Type-hantering:** Alla requests specificerar `Content-Type: application/json` så att både server och klient vet hur data ska tolkas

Detta gör applikationen **interoperabel** – samma API kan användas av web-frontend, mobilappar eller tredjepartsintegreringar.

---

## 3️⃣ HTML och CSS Grundläggande

Tournament Manager använder **React för att generera HTML dynamiskt** och **CSS3 för avancerad styling**, vilket visar hur moderna webbapplikationer bygger användargränssnitt.

**Hur det tillämpas:**
- **HTML-struktur:** React-komponenter (JSX) renderar semantisk HTML med rätt element-hierarki. Varje turnering visas som ett kort (`<div className="tournament-card">`), varje spel som sitt kort, med struktur för huvud, innehål och åtgärder
- **CSS3-teknik:** 
  - **CSS-variabler** för tema-management (--primary-color, --accent-color) möjliggör enkel tema-switching
  - **Flexbox och Grid** för responsiv layout som anpassar sig till olika skärmstorlekar
  - **Gradient och blur-effekter** för modern design (cyberpunk-tema)
  - **Animations och transitions** för smidig användarupplevelse (scan-line animering)
  - **Media queries** för responsivitet på mobila enheter
- **Tillgänglighet:** HTML-elementen använder semantiska tags och ARIA-attribut där relevant, så att skärmläsare och assistiva teknologier kan tolka sidan

Användargränssnittet är **stilrent och intuitivt** – komponenter är visuellt distinkta, feedback-mekanismer är tydliga (t.ex. hover-effekter på knappar).

---

## 4️⃣ JavaScript-Koncept och Programmeringslogik

Tournament Manager är **helt byggt på JavaScript** (React är JavaScript), vilket visar hur JavaScript kan användas för komplexa webbapplikationer med moderna programmeringsmönster.

**Hur det tillämpas:**
- **State-management:** React-komponenter använder `useState`-hook för att hålla koll på applikationstillstånd (vilken turnering är vald, visar formuläret, är användaren inloggad)
- **Props och komponent-hierarki:** Data passeras från föräldrakomponenter till barn-komponenter via props, vilket möjliggör dataflöde och återanvändbara komponenter
- **Hooks:** Custom hooks (t.ex. `useAuth`, `useTournaments`) kapslar in logik för autentisering och datahämtning, vilket håller komponenter rena och fokuserade
- **Asynkron programmering:** `async/await` används för alla API-anrop, vilket gör att UI inte fryser när data hämtas från servern. Användaren kan fortfarande interagera med sidan medan data laddas
- **Event-hantering:** Click-handlers, form-submission och input-ändringar binds till JavaScript-funktioner som uppdaterar state och trigger re-renders
- **Logik för villkorlig rendering:** Komponenter visas/döljs baserat på användarens roll (`{!isGuest && <button>Redigera</button>}`) – endast admin kan se redigerings-alternativ för turneringar

Detta visar hur JavaScript kan gå långt bortom att bara manipulera DOM – det är en fullständig applikationslogik-plattform.

---

## 5️⃣ Frontend-Implementation i Fullstack-Context

Tournament Manager är ett **modernt React-baserat frontend** byggt med Vite som utvecklingsserver och build-tool. Det visar hur man bygger en produktion-ready webbapplikation.

**Hur det tillämpas:**
- **React-komponenter:** Applikationen är uppdelad i logiska komponenter (Header, LoginForm, TournamentsList, GamesList, TournamentDetails) som var och en är ansvarig för sin egen UI-del
- **Component-lifecycle:** useEffect-hooks hanterar sida-effekter som datahämtning, rendering-skallaringar och cleanup
- **Build-optimering:** Vite paketerar applikationen för produktion med minifiering, code-splitting och asset-hashing för optimal load-performance
- **Development-experience:** Hot module replacement (HMR) från Vite möjliggör att se ändringar omedelbar utan page-refresh
- **Modulär arkitektur:** Separation av concerns – services-mappen hanterar API-kommunikation, hooks-mappen hanterar stateful-logik, components-mappen fokuserar på UI

Frontend är inte bara "ett formulär som anropar ett API" – det är en **fullt funktionell webbapplikation** med eget state-management, error-handling, loading-states och user-feedback.

---

## 6️⃣ API-Kommunikation och Felsökning

Tournament Manager visar hur man **anropar, använder och felsöker moderna APIs** från en webbapplikation.

**Hur det tillämpas:**
- **Fetch API:** Alla API-anrop görs via JavaScript `fetch()`, vilket är standarden för HTTP-kommunikation i webbläsare
- **apiClient-abstraction:** En centraliserad `apiClient.js`-service hanterar alla API-anrop, vilket gör det enkelt att lägga till globalt logik (t.ex. automatisk JWT-token-insertion i headers, enhetlig error-hantering)
- **Error-handling:** API-fel fångas och presenteras användarvänligt. T.ex. om en användare försöker ta bort ett spel de inte äger får de ett meningsfull felmeddelande istället för att se en teknisk serverfel
- **Request/Response-inspektion:** Utvecklare kan öppna Browser DevTools (Network-tab) för att se exakt vilka HTTP-requests som skickas, vilka headers som inkluderas, och vilken data som skickas/mottas
- **Timeout och retry-logik:** Applikationen hanterar långsamma nätverk och temporära serverfel gracefully
- **Loading-states:** Medan data laddas från servern visar UI en loading-indikator, så användaren vet att något händer

Denna implementation visar **production-grade API-hantering** – inte bara "anrop APIet och visa svaret", utan robust hantering av nätverks-variabilitet och användarfeedback.

---

## 7️⃣ Säkerhet: Autentisering och Auktorisering

Tournament Manager implementerar **professionella säkerhetslösningar** som är grundläggande för modern webbutveckling.

**Autentisering (Who are you?):**
- **JWT-tokens:** När en användare loggar in returnerar APIet en JWT-token (JSON Web Token) som är en signerad, krypterad representation av användarens identitet. Denna token lagras på klienten
- **Token-lagring:** JWT-tokenet lagras i `localStorage`, vilket möjliggör att användaren förblir inloggad även efter page-refresh
- **Password-hashing:** Lösenord lagras aldrig i plaintext på servern. Istället hashas de med SHA256, vilket är en envägsfunktion – servern kan verifiera lösenord utan att kunna dekryptera dem
- **Token-expiration:** JWT-tokens är tidsbegränsade (24 timmar), vilket minskar risken om en token blir stulen
- **Secure transmission:** All kommunikation är över HTTPS i produktion (HTTP lokalt för development)

**Auktorisering (What can you do?):**
- **Rollbaserad åtkomst:** Användare kan ha olika roller (Admin, User, Guest) som bestämmer vad de får göra
- **API-level enforcement:** Backend validerar att användaren har rätt roll innan operationen tillåts. T.ex. kan bara Admin-användare ta bort turneringar
- **UI-level indication:** Frontend döljer alternativ som användaren inte får använda (t.ex. "Redigera"-knapp är dold för gäster), vilket minskar förvirring
- **Owner-based permissions:** En användare kan bara ändra sina egna spel – en annan användares spel kan inte ändras eller raderas, även om de är inloggade
- **Guest-mode:** En speciell användartyp som inte behöver logga in kan läsa all data men inte göra ändringar

Denna implementering visar **flera lager av säkerhet** – det är inte tillräckligt att bara dölja knappar i UI (som kan manipuleras), säkerheten måste också finnas på servern.

---

## 8️⃣ Responsiv Design för Olika Enheter

Tournament Manager är **designat för att fungera på alla enheter** – från stora desktop-skärmar till små mobila telefoner.

**Hur det tillämpas:**
- **Flexible layout:** CSS använder Flexbox och Grid med flexibla enheter (procent, `minmax()`) istället för fasta pixelstorlekar. En kort kan vara 300px på desktop men automatiskt anpassas på mobil
- **Media queries:** CSS-regler ändras vid olika skärmbredder. T.ex. på mobil staplas komponenter vertikalt istället för horisontellt
- **Viewport-meta-tag:** HTML-headern innehåller `<meta name="viewport">` som talar om för webbläsare hur sidan ska skalas på mobila enheter
- **Touch-friendly:** Knappar och interaktiva element är stora nog för fingrars precision (inte bara för mus)
- **Performance:** Bilder och resurser optimeras för mobila nätverk med begränsad bandbredd
- **Test på flera devices:** Applikationen testas på både stort skärmar och små telefoner för att säkerställa konsistent användarupplevelse

Resultatet är att en användare kan logga in från sin telefon på vägen, se sina turneringar, och registrera ett speltillfälle – utan att upplevelsen är bruten eller omöjlig att använda.

---

## 9️⃣ Fullstack-Integration och Systemarkitektur

Tournament Manager är ett **komplett system från databas till webbläsare** som visar hur moderna webbtillämpningar hänger samman.

**Arkitekturens lager:**

1. **Database-lager:** SQL Server lagrar all persistent data (användare, roller, turneringar, spel). Entity Framework Core hanterar schema-ändringar via migrations, så databasen kan uppdateras utan manuell SQL
   
2. **API-lager:** ASP.NET Core exponerar databasen via REST-endpoints. Alla HTTP-förfrågningar valideras, autentiseras och auktoriseras innan data returneras

3. **Frontend-lager:** React presenterar data från API:et i ett vänligt UI. Användaren interagerar med gränssnittet, som skickar ändringar tillbaka till API:et

4. **Security-layer:** JWT-tokens flödar genom hela systemet – genereras av API:et, lagras på klienten, och skickas med varje request för verifiering

**Data-flöde exempel:**
1. Användare fyller i loginformulär och klickar "Logga in"
2. React skickar username/password till API:et över HTTP POST
3. API:et letar upp användaren i databasen, verifierar lösenordet, genererar en JWT-token
4. Frontend lagrar tokenet lokalt och hämtar listan av turneringar
5. API:et validerar tokenet, kontrollerar användarens roll, och returnerar turneringar
6. React renderar turneringslistan i webbläsaren
7. Användaren klickar på en turnering och ser spel för den turneringen
8. Detta trigger API-anrop, som returnerar spel, som renderas i UI

Denna **end-to-end integration** visar att webbutveckling inte bara handlar om att skriva kod i isolering – det handlar om att förstå hur alla delar samverkar för att skapa en fungerade applikation.

**Skalbarhet och underhållbarhet:**
- **Separation of concerns:** Databaskoden, API-logiken, och UI-koden är separerade, så ändringar på ett ställe påverkar inte resten
- **Error-handling på alla nivåer:** Om databasen är nere hanterar API:et det och returnerar ett felmeddelande; om API:et är nere visar frontend ett snyggt felmeddelande
- **Testbarhet:** Med ett väl-designat API kan funktionalitet testas utan UI, och UI-komponenter kan testas utan verklig API

---

## 🎓 Vad du har lärt dig

Genom att bygga Tournament Manager har du:

✅ Förstått hur modern webbutveckling fungerar från databas till webbläsare
✅ Implementerat en produktionslik arkitektur med separation of concerns
✅ Lätit säkerhet genomsyra hela systemet – inte bara UI-trickery
✅ Använt bransch-standard teknik (React, REST API, JWT, Entity Framework)
✅ Skaparen en applikation som är **användarvänlig**, **säker** och **skalbar**

Tournament Manager är inte bara ett skolprojekt – det är en **verklig, funktionell webbapplikation** som demonstrerar yrkesmässiga webbutvecklingsprinciper.
