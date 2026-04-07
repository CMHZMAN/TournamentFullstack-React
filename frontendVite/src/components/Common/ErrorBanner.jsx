import { useEffect } from 'react';

export function ErrorBanner({ message, onClose }) {
    useEffect(() => {
        if (message) {
            const timer = setTimeout(onClose, 8000);
            return () => clearTimeout(timer);
        }
    }, [message, onClose]);

    if (!message) return null;

    return (
        <div className="error-banner">
            <div className="error-banner-content">
                <span>{message}</span>
                <button className="error-banner-close" onClick={onClose}>✕</button>
            </div>
        </div>
    );
}
