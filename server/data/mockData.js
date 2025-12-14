// server-side mock data storage - in-memory databaze ktera zije behem server session

// vychozi seznam nakupnich seznamu (server-side copy)
const INITIAL_SHOPPING_LISTS = [
    {
        id: 'list-001',
        name: 'Týdenní nákup',
        ownerId: 'user-001',
        members: ['user-001', 'user-002', 'user-003'],
        items: [
            { id: 'item-001', name: 'Mléko', resolved: false },
            { id: 'item-002', name: 'Chléb', resolved: true },
            { id: 'item-003', name: 'Máslo', resolved: false },
            { id: 'item-004', name: 'Sýr', resolved: false },
            { id: 'item-005', name: 'Vajíčka', resolved: false },
        ],
        archived: false,
    },
    {
        id: 'list-002',
        name: 'Narozeninová oslava',
        ownerId: 'user-001',
        members: ['user-001', 'user-004'],
        items: [
            { id: 'item-006', name: 'Koláč', resolved: true },
            { id: 'item-007', name: 'Svíčky', resolved: true },
            { id: 'item-008', name: 'Džus', resolved: false },
        ],
        archived: false,
    },
    {
        id: 'list-003',
        name: 'Vánoční nákup',
        ownerId: 'user-002',
        members: ['user-002', 'user-001'],
        items: [
            { id: 'item-009', name: 'Dárky', resolved: false },
            { id: 'item-010', name: 'Stromeček', resolved: true },
        ],
        archived: false,
    },
    {
        id: 'list-004',
        name: 'Starý seznam',
        ownerId: 'user-001',
        members: ['user-001'],
        items: [
            { id: 'item-011', name: 'Položka 1', resolved: true },
            { id: 'item-012', name: 'Položka 2', resolved: true },
        ],
        archived: true,
    },
];

// in-memory database
let database = {
    shoppingLists: JSON.parse(JSON.stringify(INITIAL_SHOPPING_LISTS)), // deep copy
};

// helper pro generovani id
let idCounter = Date.now();
const generateId = (prefix = 'id') => {
    idCounter++;
    return `${prefix}-${idCounter}`;
};

// ziskani vsech shopping listu (s optional filterovanim)
function getAllLists(archived = null) {
    if (archived === null) {
        return database.shoppingLists;
    }
    return database.shoppingLists.filter((list) => list.archived === archived);
}

// ziskani shopping listu podle id
function getListById(id) {
    return database.shoppingLists.find((list) => list.id === id);
}

// vytvoreni noveho shopping listu
function createList(name, ownerId) {
    const newList = {
        id: generateId('list'),
        name,
        ownerId,
        members: [ownerId],
        items: [],
        archived: false,
    };
    database.shoppingLists.push(newList);
    return newList;
}

// update shopping listu
function updateList(id, updates) {
    const index = database.shoppingLists.findIndex((list) => list.id === id);
    if (index === -1) return null;

    database.shoppingLists[index] = {
        ...database.shoppingLists[index],
        ...updates,
    };
    return database.shoppingLists[index];
}

// smazani shopping listu
function deleteList(id) {
    const index = database.shoppingLists.findIndex((list) => list.id === id);
    if (index === -1) return false;

    database.shoppingLists.splice(index, 1);
    return true;
}

// pridani polozky do shopping listu
function addItemToList(listId, name) {
    const list = getListById(listId);
    if (!list) return null;

    const newItem = {
        id: generateId('item'),
        name,
        resolved: false,
    };

    list.items.push(newItem);
    return newItem;
}

// odebrani polozky ze shopping listu
function removeItemFromList(listId, itemId) {
    const list = getListById(listId);
    if (!list) return false;

    const index = list.items.findIndex((item) => item.id === itemId);
    if (index === -1) return false;

    list.items.splice(index, 1);
    return true;
}

// update polozky ve shopping listu
function updateItemInList(listId, itemId, updates) {
    const list = getListById(listId);
    if (!list) return null;

    const index = list.items.findIndex((item) => item.id === itemId);
    if (index === -1) return null;

    list.items[index] = {
        ...list.items[index],
        ...updates,
    };
    return list.items[index];
}

// pridani clena do shopping listu
function addMemberToList(listId, userId) {
    const list = getListById(listId);
    if (!list) return false;

    if (list.members.includes(userId)) {
        return false; // uz je clenem
    }

    list.members.push(userId);
    return true;
}

// odebrani clena ze shopping listu
function removeMemberFromList(listId, userId) {
    const list = getListById(listId);
    if (!list) return false;

    const index = list.members.indexOf(userId);
    if (index === -1) return false;

    list.members.splice(index, 1);
    return true;
}

// reset databaze do puvodni ho stavu
function resetDatabase() {
    database.shoppingLists = JSON.parse(JSON.stringify(INITIAL_SHOPPING_LISTS));
}

module.exports = {
    getAllLists,
    getListById,
    createList,
    updateList,
    deleteList,
    addItemToList,
    removeItemFromList,
    updateItemInList,
    addMemberToList,
    removeMemberFromList,
    resetDatabase,
};
