// error message - zobrazuje chyby s retry buttonem

import React from 'react';
import '../styles/ErrorMessage.css';

function ErrorMessage({ message, onRetry }) {
    return (
        <div className="error-message-container">
            <div className="error-icon">⚠️</div>
            <h3 className="error-title">Něco se pokazilo</h3>
            <p className="error-text">{message || 'Nepodařilo se načíst data'}</p>
            {onRetry && (
                <button className="btn btn--primary" onClick={onRetry}>
                    Zkusit znovu
                </button>
            )}
        </div>
    );
}

export default ErrorMessage;
