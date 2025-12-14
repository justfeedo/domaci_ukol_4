// loading spinner - zobrazuje loading animaci

import React from 'react';
import '../styles/LoadingSpinner.css';

function LoadingSpinner({ message = 'Načítání...' }) {
    return (
        <div className="loading-spinner-container">
            <div className="loading-spinner"></div>
            {message && <p className="loading-message">{message}</p>}
        </div>
    );
}

export default LoadingSpinner;
