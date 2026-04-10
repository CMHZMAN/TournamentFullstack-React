import { useAuth } from '../../hooks/useAuth';

export function Header() {
    const { currentUser, logout, isGuest } = useAuth();

    return (
        <header className="header">
            <div className="header-content">
                <h1>Tournament Manager</h1>
                <div className="user-info">
                    {isGuest ? (
                        <>
                            <span style={{ 
                                padding: '6px 12px', 
                                background: 'rgba(0, 217, 255, 0.15)', 
                                borderRadius: '6px',
                                fontSize: '13px',
                                border: '1px solid rgba(0, 217, 255, 0.3)'
                            }}>
                                👤 Gäst
                            </span>
                            <button
                                id="logout-btn"
                                className="btn btn-secondary"
                                onClick={logout}
                            >
                                Logga ut
                            </button>
                        </>
                    ) : (
                        <>
                            <span>{currentUser && `Inloggad som: ${currentUser.username}`}</span>
                            <button
                                id="logout-btn"
                                className="btn btn-secondary"
                                onClick={logout}
                            >
                                Logga ut
                            </button>
                        </>
                    )}
                </div>
            </div>
        </header>
    );
}
