import React, { useState, useEffect } from 'react';
import '../styles/Dialog.css';

/**
 * AddListDialog - Modální okno pro přidání nového nákupního seznamu
 * 
 * Props:
 * - open: boolean - zda je dialog otevřený
 * - onOpenChange: callback pro změnu stavu otevření
 * - onAddList: callback pro přidání seznamu (přijímá název seznamu)
 */
function AddListDialog({ open, onOpenChange, onAddList }) {
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (open) {
      setName('');
      setError('');
    }
  }, [open]);

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
      setError('Název seznamu nesmí být prázdný');
      return;
    }

    onAddList(name.trim());
    setName('');
    setError('');
  };

  const handleCancel = () => {
    setName('');
    setError('');
    onOpenChange(false);
  };

  if (!open) return null;

  return (
    <div className="dialog-overlay" onClick={handleCancel}>
      <div className="dialog-content" onClick={(e) => e.stopPropagation()}>
        <div className="dialog-header">
          <h2>Přidat nový seznam</h2>
        </div>

        <form onSubmit={handleSubmit} className="dialog-body">
          <div className="form-group">
            <label htmlFor="new-list-name" className="form-label">
              Název seznamu
            </label>
            <input
              id="new-list-name"
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setError('');
              }}
              className="form-control"
              placeholder="Např. Týdenní nákup"
              autoFocus
            />
            {error && <div className="error-message">{error}</div>}
          </div>

          <div className="dialog-footer">
            <button type="button" onClick={handleCancel} className="btn btn--secondary">
              Zrušit
            </button>
            <button type="submit" className="btn btn--primary">
              Vytvořit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddListDialog;

