export function TournamentsList({ tournaments, selectedId, onSelect, onAddClick, isLoading }) {
    return (
        <aside className="tournaments-sidebar">
            <div className="sidebar-header">
                <h2>Turneringar</h2>
                <button
                    className="btn btn-primary btn-small"
                    onClick={onAddClick}
                    disabled={isLoading}
                >
                    + Ny
                </button>
            </div>

            <div className="tournaments-list-sidebar">
                {isLoading ? (
                    <p className="loading">Laddar turneringar...</p>
                ) : tournaments.length === 0 ? (
                    <p className="loading">Inga turneringar hittades</p>
                ) : (
                    tournaments.map(tournament => (
                        <button
                            key={tournament.id}
                            className={`tournament-card-sidebar ${selectedId === tournament.id ? 'active' : ''}`}
                            onClick={() => onSelect(tournament)}
                        >
                            <h3>{tournament.title}</h3>
                            <div className="tournament-card-sidebar-info">
                                <div>{tournament.description || 'Ingen beskrivning'}</div>
                                <div>{new Date(tournament.date).toLocaleDateString('sv-SE')}</div>
                                <div>{tournament.gameCount || 0} spel</div>
                            </div>
                        </button>
                    ))
                )}
            </div>
        </aside>
    );
}
