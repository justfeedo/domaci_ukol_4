import React, { useState } from 'react';
import { MOCK_USERS } from '../data/mockData';
import { getUserName, getAvailableUsers } from '../utils/helpers';
import '../styles/MembersList.css';

/**
 * MembersList - Komponenta pro zobrazení a správu členů seznamu
 * 
 * Props:
 * - ownerId: ID vlastníka seznamu
 * - members: pole ID členů
 * - currentUserId: ID aktuálně přihlášeného uživatele
 * - isOwner: boolean - zda je aktuální uživatel vlastník
 * - onAddMember: callback pro přidání člena
 * - onRemoveMember: callback pro odebrání člena
 * - onLeaveList: callback pro odchod ze seznamu
 */
function MembersList({ ownerId, members, currentUserId, isOwner, onAddMember, onRemoveMember, onLeaveList }) {
  const [selectedUserId, setSelectedUserId] = useState('');

  const availableUsers = getAvailableUsers(MOCK_USERS, members);

  const handleAddMember = (e) => {
    e.preventDefault();
    if (selectedUserId) {
      onAddMember(selectedUserId);
      setSelectedUserId('');
    }
  };

  const canLeave = !isOwner && members.includes(currentUserId);

  return (
    <div className="members-list">
      {/* Aktuální členové seznamu */}
      <div className="members-section card">
        <h2>Členové seznamu</h2>
        <ul className="members-list-ul">
          {members.map((memberId) => (
            <li key={memberId} className="member-item">
              <div className="member-info">
                <span className="member-name">{getUserName(memberId, MOCK_USERS)}</span>
                {memberId === ownerId && <span className="badge-owner">Vlastník</span>}
              </div>
              {isOwner && memberId !== ownerId && (
                <button
                  onClick={() => {
                    if (window.confirm(`Opravdu chcete odebrat člena "${getUserName(memberId, MOCK_USERS)}"?`)) {
                      onRemoveMember(memberId);
                    }
                  }}
                  className="btn-remove"
                >
                  Odebrat
                </button>
              )}
            </li>
          ))}
        </ul>

        {/* Tlačítko pro opuštění seznamu  */}
        {canLeave && (
          <div className="leave-section">
            <button onClick={onLeaveList} className="btn btn--danger btn--full-width">
              Opustit seznam
            </button>
          </div>
        )}
      </div>

      {/* Formulář pro přidání člena*/}
      {isOwner && (
        <div className="add-member-section card">
          <h2>Přidat člena</h2>
          {availableUsers.length > 0 ? (
            <form onSubmit={handleAddMember} className="add-member-form">
              <select
                value={selectedUserId}
                onChange={(e) => setSelectedUserId(e.target.value)}
                className="form-control"
              >
                <option value="">-- Vyberte uživatele --</option>
                {availableUsers.map((userId) => (
                  <option key={userId} value={userId}>
                    {getUserName(userId, MOCK_USERS)}
                  </option>
                ))}
              </select>
              <button
                type="submit"
                className="btn btn--primary"
                disabled={!selectedUserId}
              >
                Přidat člena
              </button>
            </form>
          ) : (
            <div className="empty-state">Všichni uživatelé jsou již členy</div>
          )}
        </div>
      )}
    </div>
  );
}

export default MembersList;
