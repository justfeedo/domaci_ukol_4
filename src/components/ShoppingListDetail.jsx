import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useShoppingLists, LoadingState } from '../providers/ShoppingListProvider';
import ItemsList from './ItemsList';
import MembersList from './MembersList';
import EditListNameDialog from './EditListNameDialog';
import LoadingSpinner from './LoadingSpinner';
import ErrorMessage from './ErrorMessage';
import { MOCK_USERS } from '../data/mockData';

/**
 * ShoppingListDetail - Hlavní route komponenta pro detail nákupního seznamu
 * 
 * Route: /lists/:listId
 */
function ShoppingListDetail() {
  const { listId } = useParams();
  const navigate = useNavigate();

  const {
    getList,
    loadingState,
    error,
    currentUserId,
    updateListName,
    addItem,
    removeItem,
    toggleItem,
    addMember,
    removeMember,
    loadLists,
  } = useShoppingLists();

  // State
  const [filter, setFilter] = useState('ALL');
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('items');

  // Get the list from provider
  const list = getList(listId);

  // Pomocné proměnné
  const isOwner = list?.ownerId === currentUserId;
  const currentUserName = MOCK_USERS[currentUserId];

  // Handlers pro položky
  const handleAddItem = async (itemName) => {
    try {
      await addItem(listId, itemName);
    } catch (err) {
      console.error('Failed to add item:', err);
    }
  };

  const handleToggleItem = async (itemId) => {
    try {
      await toggleItem(listId, itemId);
    } catch (err) {
      console.error('Failed to toggle item:', err);
    }
  };

  const handleDeleteItem = async (itemId) => {
    try {
      await removeItem(listId, itemId);
    } catch (err) {
      console.error('Failed to delete item:', err);
    }
  };

  // Handlers pro členy
  const handleAddMember = async (userId) => {
    if (list && !list.members.includes(userId)) {
      try {
        await addMember(listId, userId);
      } catch (err) {
        console.error('Failed to add member:', err);
      }
    }
  };

  const handleRemoveMember = async (userId) => {
    try {
      await removeMember(listId, userId);
    } catch (err) {
      console.error('Failed to remove member:', err);
    }
  };

  const handleLeaveList = async () => {
    if (window.confirm('Opravdu chcete opustit tento seznam?')) {
      try {
        await removeMember(listId, currentUserId);
        alert('Opustili jste seznam');
        navigate('/');
      } catch (err) {
        console.error('Failed to leave list:', err);
      }
    }
  };

  // Handler pro editaci názvu
  const handleUpdateName = async (newName) => {
    try {
      await updateListName(listId, newName);
      setIsEditDialogOpen(false);
    } catch (err) {
      console.error('Failed to update name:', err);
    }
  };

  const handleBackClick = () => {
    navigate('/');
  };

  // Show loading state
  if (loadingState === LoadingState.PENDING) {
    return (
      <div className="shopping-list-detail">
        <LoadingSpinner message="Načítání seznamu..." />
      </div>
    );
  }

  // Show error state
  if (loadingState === LoadingState.ERROR) {
    return (
      <div className="shopping-list-detail">
        <ErrorMessage
          message={error}
          onRetry={() => loadLists(false)}
        />
      </div>
    );
  }

  // List not found
  if (!list) {
    return (
      <div className="shopping-list-detail">
        <ErrorMessage
          message="Nákupní seznam nebyl nalezen"
          onRetry={() => navigate('/')}
        />
      </div>
    );
  }

  return (
    <div className="shopping-list-detail">
      {/* Header */}
      <header className="detail-header">
        <button onClick={handleBackClick} className="btn-back">
          Zpět na přehled
        </button>
        <div className="header-content">
          <div className="list-title-section">
            <h1 className="list-title">{list.name}</h1>
            {isOwner && (
              <button
                onClick={() => setIsEditDialogOpen(true)}
                className="btn-icon"
                title="Upravit název"
              >
                Přejmenovat
              </button>
            )}
          </div>
          <div className="current-user">
            Přihlášen jako: <strong>{currentUserName}</strong>
            {isOwner && <span className="badge-owner">Vlastník</span>}
          </div>
        </div>
      </header>

      {/* Tab Navigation */}
      <nav className="tab-navigation">
        <button
          className={`tab-button ${activeTab === 'items' ? 'active' : ''}`}
          onClick={() => setActiveTab('items')}
        >
          Položky
        </button>
        <button
          className={`tab-button ${activeTab === 'members' ? 'active' : ''}`}
          onClick={() => setActiveTab('members')}
        >
          Členové
        </button>
      </nav>

      {/* Obsah */}
      <main className="detail-content">
        {activeTab === 'items' ? (
          <ItemsList
            items={list.items}
            filter={filter}
            isOwner={isOwner}
            onAddItem={handleAddItem}
            onToggleItem={handleToggleItem}
            onDeleteItem={handleDeleteItem}
            onFilterChange={setFilter}
          />
        ) : (
          <MembersList
            ownerId={list.ownerId}
            members={list.members}
            currentUserId={currentUserId}
            isOwner={isOwner}
            onAddMember={handleAddMember}
            onRemoveMember={handleRemoveMember}
            onLeaveList={handleLeaveList}
          />
        )}
      </main>

      {/* Dialog pro úpravu názvu */}
      {isEditDialogOpen && (
        <EditListNameDialog
          open={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          currentName={list.name}
          onUpdateName={handleUpdateName}
        />
      )}
    </div>
  );
}

export default ShoppingListDetail;
