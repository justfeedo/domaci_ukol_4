/**
 * Utility funkce pro aplikaci
 */

/**
 * Generuje unikátní ID pro nové položky
 */
export const generateId = (prefix = 'item') => {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Získá jméno uživatele z ID
 */
export const getUserName = (userId, users) => {
  return users[userId] || userId;
};

/**
 * Filtruje položky podle aktuálního filtru
 */
export const filterItems = (items, filter) => {
  switch (filter) {
    case 'UNRESOLVED':
      return items.filter((item) => !item.resolved);
    case 'RESOLVED':
      return items.filter((item) => item.resolved);
    case 'ALL':
    default:
      return items;
  }
};

/**
 * Vrátí uživatele, kteří nejsou členy seznamu
 */
export const getAvailableUsers = (allUsers, currentMembers) => {
  return Object.keys(allUsers).filter((userId) => !currentMembers.includes(userId));
};

/**
 * Validace názvu položky
 */
export const validateItemName = (name) => {
  return name && name.trim().length > 0;
};
