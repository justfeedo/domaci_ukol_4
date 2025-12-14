import React, { useState } from 'react';
import { filterItems, validateItemName } from '../utils/helpers';
import '../styles/ItemsList.css';

/**
 * ItemsList - Komponenta pro zobrazení a správu položek nákupního seznamu
 * 
 * Props:
 * - items: pole položek
 * - filter: aktuální filtr (ALL, UNRESOLVED, RESOLVED)
 * - isOwner: boolean - zda je uživatel vlastník
 * - onAddItem: callback pro přidání položky
 * - onToggleItem: callback pro změnu stavu položky
 * - onDeleteItem: callback pro smazání položky
 * - onFilterChange: callback pro změnu filtru
 */
function ItemsList({ items, filter, isOwner, onAddItem, onToggleItem, onDeleteItem, onFilterChange }) {
  const [newItemName, setNewItemName] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateItemName(newItemName)) {
      setError('Název položky nesmí být prázdný');
      return;
    }

    onAddItem(newItemName.trim());
    setNewItemName('');
    setError('');
  };

  const filteredItems = filterItems(items, filter);
  const resolvedCount = items.filter((item) => item.resolved).length;
  const totalCount = items.length;
  const percentage = totalCount > 0 ? Math.round((resolvedCount / totalCount) * 100) : 0;

  return (
    <div className="items-list">
      {/* Formulář pro přidání položky */}
      <div className="add-item-section card">
        <h2>Přidat položku</h2>
        <form onSubmit={handleSubmit} className="add-item-form">
          <input
            type="text"
            value={newItemName}
            onChange={(e) => {
              setNewItemName(e.target.value);
              setError('');
            }}
            placeholder="Název položky..."
            className="form-control"
          />
          <button type="submit" className="btn btn--primary">
            Přidat
          </button>
        </form>
        {error && <div className="error-message">{error}</div>}
      </div>

      {/* Tlačítka filtrů */}
      <div className="filter-section">
        <div className="filter-buttons">
          <button
            onClick={() => onFilterChange('ALL')}
            className={`filter-btn ${filter === 'ALL' ? 'active' : ''}`}
          >
            Všechny
          </button>
          <button
            onClick={() => onFilterChange('UNRESOLVED')}
            className={`filter-btn ${filter === 'UNRESOLVED' ? 'active' : ''}`}
          >
            Nekoupené
          </button>
          <button
            onClick={() => onFilterChange('RESOLVED')}
            className={`filter-btn ${filter === 'RESOLVED' ? 'active' : ''}`}
          >
            Koupené
          </button>
        </div>
        <div className="items-stats">
          {resolvedCount} z {totalCount} položek koupeno ({percentage}%)
        </div>
      </div>

      {/* Seznam položek */}
      <div className="items-container card">
        <h2>Položky seznamu</h2>
        {filteredItems.length === 0 ? (
          <div className="empty-state">
            {filter === 'ALL' 
              ? 'Žádné položky v seznamu'
              : filter === 'UNRESOLVED'
              ? 'Všechny položky jsou koupené!'
              : 'Žádné koupené položky'
            }
          </div>
        ) : (
          <ul className="items-list-ul">
            {filteredItems.map((item) => (
              <li key={item.id} className={`item ${item.resolved ? 'resolved' : ''}`}>
                <label className="item-checkbox-label">
                  <input
                    type="checkbox"
                    checked={item.resolved}
                    onChange={() => onToggleItem(item.id)}
                    className="item-checkbox"
                  />
                  <span className="item-name">{item.name}</span>
                </label>
                <button
                  onClick={() => {
                    if (window.confirm(`Opravdu chcete smazat položku "${item.name}"?`)) {
                      onDeleteItem(item.id);
                    }
                  }}
                  className="btn-delete"
                  title="Smazat položku"
                >
                  Smazat
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default ItemsList;
