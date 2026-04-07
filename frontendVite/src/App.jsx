import { useState, useEffect } from 'react';
import { useAuth } from './hooks/useAuth';
import { useTournaments } from './hooks/useTournaments';
import { ErrorBanner } from './components/Common/ErrorBanner';
import { Header } from './components/Common/Header';
import { LoginForm } from './components/Auth/LoginForm';
import { TournamentsList } from './components/Tournament/TournamentsList';
import { TournamentDetails } from './components/Tournament/TournamentDetails';
import { TournamentForm } from './components/Tournament/TournamentForm';
import './index.css';

function App() {
  const { isLoggedIn, isLoading: authLoading, login, error: authError } = useAuth();
  const [errorMessage, setErrorMessage] = useState('');
  const [selectedTournament, setSelectedTournament] = useState(null);
  const [showTournamentForm, setShowTournamentForm] = useState(false);

  const {
    tournaments,
    isLoading: tournamentsLoading,
    error: tournamentsError,
    loadTournaments,
    createTournament,
    updateTournament,
    deleteTournament
  } = useTournaments();

  // Load tournaments when logged in
  useEffect(() => {
    if (isLoggedIn) {
      loadTournaments();
    }
  }, [isLoggedIn, loadTournaments]);

  // Update error message
  useEffect(() => {
    if (authError) {
      setErrorMessage(authError);
    } else if (tournamentsError) {
      setErrorMessage(tournamentsError);
    }
  }, [authError, tournamentsError]);

  const handleLogin = async (credentials) => {
    try {
      await login(credentials.username, credentials.password);
    } catch (err) {
      console.error('Login error:', err);
    }
  };

  const handleTournamentCreate = async (data) => {
    try {
      await createTournament(data);
      setShowTournamentForm(false);
      setErrorMessage('');
    } catch (err) {
      setErrorMessage(err.message);
    }
  };

  const handleTournamentUpdate = async (id, data) => {
    try {
      await updateTournament(id, data);
      setSelectedTournament(prev => ({ ...prev, ...data }));
      setErrorMessage('');
    } catch (err) {
      setErrorMessage(err.message);
    }
  };

  const handleTournamentDelete = async (id) => {
    try {
      await deleteTournament(id);
      setSelectedTournament(null);
      setErrorMessage('');
    } catch (err) {
      setErrorMessage(err.message);
    }
  };

  if (authLoading) {
    return (
      <div className="section-container">
        <div className="login-form">
          <p className="loading">Laddar...</p>
        </div>
      </div>
    );
  }

  if (!isLoggedIn) {
    return (
      <div className="section-container">
        <ErrorBanner
          message={errorMessage}
          onClose={() => setErrorMessage('')}
        />
        <div className="login-form">
          <h1>Tournament Manager</h1>
          <p>Logga in för att komma igång</p>
          <LoginForm onSubmit={handleLogin} error={authError} />
        </div>
      </div>
    );
  }

  return (
    <>
      <ErrorBanner
        message={errorMessage}
        onClose={() => setErrorMessage('')}
      />
      <Header />

      <div className="app-layout">
        <TournamentsList
          tournaments={tournaments}
          selectedId={selectedTournament?.id}
          onSelect={setSelectedTournament}
          onAddClick={() => setShowTournamentForm(!showTournamentForm)}
          isLoading={tournamentsLoading}
        />

        <div style={{ flex: 1 }}>
          {showTournamentForm ? (
            <TournamentForm
              onSubmit={handleTournamentCreate}
              onCancel={() => setShowTournamentForm(false)}
              error={tournamentsError}
            />
          ) : selectedTournament ? (
            <TournamentDetails
              tournament={selectedTournament}
              onUpdate={handleTournamentUpdate}
              onDelete={handleTournamentDelete}
              onGameCreated={() => loadTournaments()}
              onGameUpdated={() => loadTournaments()}
              onGameDeleted={() => loadTournaments()}
            />
          ) : (
            <div className="no-selection">
              <p>Välj en turnering från listan för att se och hantera spel</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default App;
