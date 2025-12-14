import React, { useState, useEffect } from 'react';
import '../styles/Dialog.css';

/**
 * EditListNameDialog -pro editaci názvu seznamu
 * Props:
 * - open: boolean - zda je dialog otevřený
 * - onOpenChange: callback pro změnu stavu otevření
 * - currentName: aktuální název seznamu
 * - onUpdateName: callback pro uložení nového názvu
 */
function EditListNameDialog({ open, onOpenChange, currentName, onUpdateName }) {
  const [name, setName] = useState(currentName);
  const [error, setError] = useState('');

  useEffect(() => {
    setName(currentName);
  }, [currentName]);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onOpenChange(false);
      }
    };

    if (open) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [open, onOpenChange]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!name.trim()) {
      setError('Název nesmí být prázdný');
      return;
    }

    onUpdateName(name.trim());
    setError('');
  };

  const handleCancel = () => {
    setName(currentName);
    setError('');
    onOpenChange(false);
  };

  if (!open) return null;

  return (
    <div className="dialog-overlay" onClick={handleCancel}>
      <div className="dialog-content" onClick={(e) => e.stopPropagation()}>
        <div className="dialog-header">
          <h2>Upravit název seznamu</h2>
        </div>

        <form onSubmit={handleSubmit} className="dialog-body">
          <div className="form-group">
            <label htmlFor="list-name" className="form-label">
        Nový název seznamu
            </label>
            <input
              id="list-name"
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setError('');
              }}
              className="form-control"
              autoFocus
            />
            {error && <div className="error-message">{error}</div>}
          </div>

          <div className="dialog-footer">
            <button type="button" onClick={handleCancel} className="btn btn--secondary">
              Zrušit
            </button>
            <button type="submit" className="btn btn--primary">
              Uložit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditListNameDialog;
