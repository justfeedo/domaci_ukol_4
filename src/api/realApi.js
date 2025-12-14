// real api implementace - vola skutecny backend pres http

import { API_BASE_URL, MOCK_AUTH_USER_ID } from '../config';

// wrapper pro fetch s error handlingem
const apiFetch = async (endpoint, options = {}) => {
    const url = `${API_BASE_URL}${endpoint}`;

    const defaultOptions = {
        headers: {
            'Content-Type': 'application/json',
            // mock auth - v realnem projektu by byl JWT token
            'X-User-Id': MOCK_AUTH_USER_ID,
        },
    };

    const config = {
        ...defaultOptions,
        ...options,
        headers: {
            ...defaultOptions.headers,
            ...options.headers,
        },
    };

    try {
        const response = await fetch(url, config);

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
};

// real api metody

export const listShoppingLists = async (archived = false) => {
    const response = await apiFetch(`/shoppingList/list?archived=${archived}`);
    return { status: 200, data: response.dtoOut?.itemList || response.dtoOut || [] };
};

export const getShoppingList = async (id) => {
    const response = await apiFetch(`/shoppingList/get?id=${id}`);
    return { status: 200, data: response.dtoOut };
};

export const createShoppingList = async (name) => {
    const response = await apiFetch('/shoppingList/create', {
        method: 'POST',
        body: JSON.stringify({ name }),
    });
    return { status: 200, data: response.dtoOut };
};

export const updateShoppingList = async (id, name) => {
    const response = await apiFetch('/shoppingList/update', {
        method: 'PUT',
        body: JSON.stringify({ id, name }),
    });
    return { status: 200, data: response.dtoOut };
};

export const deleteShoppingList = async (id) => {
    const response = await apiFetch(`/shoppingList/delete?id=${id}`, {
        method: 'DELETE',
    });
    return { status: 200, data: response.dtoOut };
};

export const archiveShoppingList = async (id, archived) => {
    const response = await apiFetch('/shoppingList/archive', {
        method: 'PATCH',
        body: JSON.stringify({ id, archived }),
    });
    return { status: 200, data: response.dtoOut };
};

export const addItem = async (listId, name) => {
    const response = await apiFetch('/shoppingList/addItem', {
        method: 'POST',
        body: JSON.stringify({ shoppingListId: listId, name }),
    });
    return { status: 200, data: response.dtoOut };
};

export const removeItem = async (listId, itemId) => {
    const response = await apiFetch(
        `/shoppingList/removeItem?shoppingListId=${listId}&itemId=${itemId}`,
        {
            method: 'DELETE',
        }
    );
    return { status: 200, data: response.dtoOut };
};

export const toggleItem = async (listId, itemId, resolved) => {
    const response = await apiFetch('/shoppingList/resolveItem', {
        method: 'PATCH',
        body: JSON.stringify({ shoppingListId: listId, itemId, resolved }),
    });
    return { status: 200, data: response.dtoOut };
};

export const addMember = async (listId, userId) => {
    const response = await apiFetch('/shoppingList/addMember', {
        method: 'POST',
        body: JSON.stringify({ shoppingListId: listId, userId }),
    });
    return { status: 200, data: response.dtoOut };
};

export const removeMember = async (listId, userId) => {
    const response = await apiFetch(
        `/shoppingList/removeMember?shoppingListId=${listId}&userId=${userId}`,
        {
            method: 'DELETE',
        }
    );
    return { status: 200, data: response.dtoOut };
};
