import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useShoppingLists, LoadingState } from '../providers/ShoppingListProvider';
import { MOCK_USERS } from '../data/mockData';
import AddListDialog from './AddListDialog';
import DeleteConfirmationDialog from './DeleteConfirmationDialog';
import LoadingSpinner from './LoadingSpinner';
import ErrorMessage from './ErrorMessage';
import '../styles/ShoppingListsOverview.css';

/**
 * ShoppingListsOverview - Route komponenta pro přehled nákupních seznamů
 * 
 * Route: /
 * Funkce:
 * - Zobrazení seznamů formou dlaždic
 * - Filtrování (ne-archivované, včetně archivovaných)
 * - Přidání nového seznamu (modální okno)
 * - Smazání seznamu (pouze pro vlastníky, s potvrzením)
 */
function ShoppingListsOverview() {
  const navigate = useNavigate();
  const {
    lists,
    loadingState,
    error,
    showArchived,
    setShowArchived,
    currentUserId,
    createList,
    deleteList,
    loadLists,
  } = useShoppingLists();

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [deleteListId, setDeleteListId] = useState(null);

  // Filtrování seznamů
  const filteredLists = showArchived
    ? lists
    : lists.filter((list) => !list.archived);

  // Handler pro přidání nového seznamu
  const handleAddList = async (listName) => {
    try {
      await createList(listName);
      setIsAddDialogOpen(false);
    } catch (err) {
      // Error is handled by provider
      console.error('Failed to add list:', err);
    }
  };

  // Handler pro smazání seznamu
  const handleDeleteList = async (listId) => {
    try {
      await deleteList(listId);
      setDeleteListId(null);
    } catch (err) {
      // Error is handled by provider
      console.error('Failed to delete list:', err);
      setDeleteListId(null);
    }
  };

  // Handler pro kliknutí na seznam (navigace na detail)
  const handleListClick = (listId) => {
    navigate(`/lists/${listId}`);
  };

  // Získání informací o seznamu pro zobrazení
  const getListInfo = (list) => {
    const totalItems = list.items.length;
    const resolvedItems = list.items.filter((item) => item.resolved).length;
    const percentage = totalItems > 0 ? Math.round((resolvedItems / totalItems) * 100) : 0;
    const isOwner = list.ownerId === currentUserId;
    const ownerName = MOCK_USERS[list.ownerId] || 'Neznámý uživatel';
    const memberCount = list.members.length;

    return {
      totalItems,
      resolvedItems,
      percentage,
      isOwner,
      ownerName,
      memberCount,
    };
  };

  // Show loading state
  if (loadingState === LoadingState.PENDING) {
    return (
      <div className="shopping-lists-overview">
        <LoadingSpinner message="Načítání nákupních seznamů..." />
      </div>
    );
  }

  // Show error state
  if (loadingState === LoadingState.ERROR) {
    return (
      <div className="shopping-lists-overview">
        <ErrorMessage
          message={error}
          onRetry={() => loadLists(showArchived)}
        />
      </div>
    );
  }

  return (
    <div className="shopping-lists-overview">
      {/* Header */}
      <header className="overview-header">
        <h1 className="overview-title">Nákupní seznamy</h1>
        <div className="header-actions">
          <label className="filter-checkbox">
            <input
              type="checkbox"
              checked={showArchived}
              onChange={(e) => setShowArchived(e.target.checked)}
            />
            <span>Zobrazit archivované</span>
          </label>
          <button
            className="btn btn--primary"
            onClick={() => setIsAddDialogOpen(true)}
          >
            + Přidat seznam
          </button>
        </div>
      </header>

      {/* Seznam dlaždic */}
      <div className="lists-grid">
        {filteredLists.length === 0 ? (
          <div className="empty-state">
            <p>Žádné nákupní seznamy</p>
            <button
              className="btn btn--primary"
              onClick={() => setIsAddDialogOpen(true)}
            >
              Vytvořit první seznam
            </button>
          </div>
        ) : (
          filteredLists.map((list) => {
            const info = getListInfo(list);
            return (
              <div
                key={list.id}
                className={`list-tile ${list.archived ? 'archived' : ''}`}
                onClick={() => handleListClick(list.id)}
              >
                <div className="tile-header">
                  <h2 className="tile-title">{list.name}</h2>
                  {list.archived && (
                    <span className="badge-archived">Archivováno</span>
                  )}
                  {info.isOwner && (
                    <span className="badge-owner">Vlastník</span>
                  )}
                </div>

                <div className="tile-content">
                  <div className="tile-stats">
                    <div className="stat-item">
                      <span className="stat-label">Položky:</span>
                      <span className="stat-value">
                        {info.resolvedItems}/{info.totalItems}
                      </span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-label">Členové:</span>
                      <span className="stat-value">{info.memberCount}</span>
                    </div>
                  </div>

                  {info.totalItems > 0 && (
                    <div className="progress-bar">
                      <div
                        className="progress-fill"
                        style={{ width: `${info.percentage}%` }}
                      />
                    </div>
                  )}

                  <div className="tile-footer">
                    <span className="tile-owner">Vlastník: {info.ownerName}</span>
                    {info.isOwner && (
                      <button
                        className="btn-delete"
                        onClick={(e) => {
                          e.stopPropagation();
                          setDeleteListId(list.id);
                        }}
                        title="Smazat seznam"
                      >
                        Smazat
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Dialog pro přidání seznamu */}
      {isAddDialogOpen && (
        <AddListDialog
          open={isAddDialogOpen}
          onOpenChange={setIsAddDialogOpen}
          onAddList={handleAddList}
        />
      )}

      {/* Dialog pro potvrzení smazání */}
      {deleteListId && (
        <DeleteConfirmationDialog
          open={!!deleteListId}
          onOpenChange={(open) => !open && setDeleteListId(null)}
          listName={lists.find((l) => l.id === deleteListId)?.name || ''}
          onConfirm={() => handleDeleteList(deleteListId)}
        />
      )}
    </div>
  );
}

export default ShoppingListsOverview;

