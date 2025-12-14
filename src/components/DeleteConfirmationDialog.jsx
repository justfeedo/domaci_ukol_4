import React, { useEffect } from 'react';
import '../styles/Dialog.css';

/**
 * DeleteConfirmationDialog - Potvrzovací dialog pro smazání nákupního seznamu
 * 
 * Props:
 * - open: boolean - zda je dialog otevřený
 * - onOpenChange: callback pro změnu stavu otevření
 * - listName: název seznamu, který má být smazán
 * - onConfirm: callback pro potvrzení smazání
 */
function DeleteConfirmationDialog({ open, onOpenChange, listName, onConfirm }) {
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

  const handleConfirm = () => {
    onConfirm();
  };

  const handleCancel = () => {
    onOpenChange(false);
  };

  if (!open) return null;

  return (
    <div className="dialog-overlay" onClick={handleCancel}>
      <div className="dialog-content" onClick={(e) => e.stopPropagation()}>
        <div className="dialog-header">
          <h2>Smazat seznam</h2>
        </div>

        <div className="dialog-body">
          <p>
            Opravdu chcete smazat seznam <strong>"{listName}"</strong>?
          </p>
          <p className="warning-text">
            Tato akce je nevratná a všechny položky v seznamu budou odstraněny.
          </p>
        </div>

        <div className="dialog-footer">
          <button type="button" onClick={handleCancel} className="btn btn--secondary">
            Zrušit
          </button>
          <button type="button" onClick={handleConfirm} className="btn btn--danger">
            Smazat
          </button>
        </div>
      </div>
    </div>
  );
}

export default DeleteConfirmationDialog;

