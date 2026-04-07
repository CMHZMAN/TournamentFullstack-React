import { useAuth } from '../../hooks/useAuth';

export function Header() {
    const { currentUser, logout } = useAuth();

    return (
        <header className="header">
            <div className="header-content">
                <h1>Tournament Manager</h1>
                <div className="user-info">
                    <span>{currentUser && `Inloggad som: ${currentUser.username}`}</span>
                    <button
                        id="logout-btn"
                        className="btn btn-secondary"
                        onClick={logout}
                    >
                        Logga ut
                    </button>
                </div>
            </div>
        </header>
    );
}
