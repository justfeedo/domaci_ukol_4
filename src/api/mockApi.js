// mock api implementace - simuluje backend na klientu v pameti

import { INITIAL_SHOPPING_LISTS, CURRENT_USER_ID } from '../data/mockData';
import { generateId } from '../utils/helpers';
import { MOCK_API_DELAY } from '../config';

// in-memory databaze (simuluje server)
let mockDatabase = {
    shoppingLists: [...INITIAL_SHOPPING_LISTS],
};

// simulace network delay
const delay = (ms = MOCK_API_DELAY) => new Promise((resolve) => setTimeout(resolve, ms));

// formatovani response jako z API
const createResponse = (data, status = 200) => ({
    status,
    data,
});

// mock api metody

export const listShoppingLists = async (archived = false) => {
    await delay();

    const lists = mockDatabase.shoppingLists.filter((list) => {
        // filtrovani podle archived statusu
        if (archived) return true;
        return !list.archived;
    });

    return createResponse(lists);
};

export const getShoppingList = async (id) => {
    await delay();

    const list = mockDatabase.shoppingLists.find((l) => l.id === id);

    if (!list) {
        throw new Error('Shopping list not found');
    }

    return createResponse(list);
};

export const createShoppingList = async (name) => {
    await delay();

    const newList = {
        id: generateId('list'),
        name,
        ownerId: CURRENT_USER_ID,
        members: [CURRENT_USER_ID],
        items: [],
        archived: false,
    };

    mockDatabase.shoppingLists.push(newList);

    return createResponse(newList);
};

export const updateShoppingList = async (id, name) => {
    await delay();

    const listIndex = mockDatabase.shoppingLists.findIndex((l) => l.id === id);

    if (listIndex === -1) {
        throw new Error('Shopping list not found');
    }

    mockDatabase.shoppingLists[listIndex] = {
        ...mockDatabase.shoppingLists[listIndex],
        name,
    };

    return createResponse(mockDatabase.shoppingLists[listIndex]);
};

export const deleteShoppingList = async (id) => {
    await delay();

    const listIndex = mockDatabase.shoppingLists.findIndex((l) => l.id === id);

    if (listIndex === -1) {
        throw new Error('Shopping list not found');
    }

    mockDatabase.shoppingLists.splice(listIndex, 1);

    return createResponse({ id, deleted: true });
};

export const archiveShoppingList = async (id, archived) => {
    await delay();

    const listIndex = mockDatabase.shoppingLists.findIndex((l) => l.id === id);

    if (listIndex === -1) {
        throw new Error('Shopping list not found');
    }

    mockDatabase.shoppingLists[listIndex] = {
        ...mockDatabase.shoppingLists[listIndex],
        archived,
    };

    return createResponse(mockDatabase.shoppingLists[listIndex]);
};

export const addItem = async (listId, name) => {
    await delay();

    const listIndex = mockDatabase.shoppingLists.findIndex((l) => l.id === listId);

    if (listIndex === -1) {
        throw new Error('Shopping list not found');
    }

    const newItem = {
        id: generateId('item'),
        name,
        resolved: false,
    };

    mockDatabase.shoppingLists[listIndex].items.push(newItem);

    return createResponse(newItem);
};

export const removeItem = async (listId, itemId) => {
    await delay();

    const listIndex = mockDatabase.shoppingLists.findIndex((l) => l.id === listId);

    if (listIndex === -1) {
        throw new Error('Shopping list not found');
    }

    const list = mockDatabase.shoppingLists[listIndex];
    const itemIndex = list.items.findIndex((i) => i.id === itemId);

    if (itemIndex === -1) {
        throw new Error('Item not found');
    }

    list.items.splice(itemIndex, 1);

    return createResponse({ itemId, deleted: true });
};

export const toggleItem = async (listId, itemId, resolved) => {
    await delay();

    const listIndex = mockDatabase.shoppingLists.findIndex((l) => l.id === listId);

    if (listIndex === -1) {
        throw new Error('Shopping list not found');
    }

    const list = mockDatabase.shoppingLists[listIndex];
    const itemIndex = list.items.findIndex((i) => i.id === itemId);

    if (itemIndex === -1) {
        throw new Error('Item not found');
    }

    list.items[itemIndex] = {
        ...list.items[itemIndex],
        resolved,
    };

    return createResponse(list.items[itemIndex]);
};

export const addMember = async (listId, userId) => {
    await delay();

    const listIndex = mockDatabase.shoppingLists.findIndex((l) => l.id === listId);

    if (listIndex === -1) {
        throw new Error('Shopping list not found');
    }

    const list = mockDatabase.shoppingLists[listIndex];

    if (list.members.includes(userId)) {
        throw new Error('User is already a member');
    }

    list.members.push(userId);

    return createResponse({ userId, added: true });
};

export const removeMember = async (listId, userId) => {
    await delay();

    const listIndex = mockDatabase.shoppingLists.findIndex((l) => l.id === listId);

    if (listIndex === -1) {
        throw new Error('Shopping list not found');
    }

    const list = mockDatabase.shoppingLists[listIndex];
    const memberIndex = list.members.indexOf(userId);

    if (memberIndex === -1) {
        throw new Error('User is not a member');
    }

    list.members.splice(memberIndex, 1);

    return createResponse({ userId, removed: true });
};

// reset mock databaze do puvodni ho stavu (uzitecne pro testovani)
export const resetMockDatabase = () => {
    mockDatabase.shoppingLists = [...INITIAL_SHOPPING_LISTS];
};
