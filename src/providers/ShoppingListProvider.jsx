// shopping list provider - context provider pro globalni state management
// nevizualni komponenta co handluje data fetching, loading a error stavy

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import * as api from '../api';
import { CURRENT_USER_ID } from '../data/mockData';

// vytvoreni contextu
const ShoppingListContext = createContext(null);

// loading stavy
export const LoadingState = {
    PENDING: 'pending',
    READY: 'ready',
    ERROR: 'error',
};

// provider komponenta
export function ShoppingListProvider({ children }) {
    const [lists, setLists] = useState([]);
    const [loadingState, setLoadingState] = useState(LoadingState.PENDING);
    const [error, setError] = useState(null);
    const [showArchived, setShowArchived] = useState(false);

    // nacteni shopping listu z api
    const loadLists = useCallback(async (includeArchived = false) => {
        try {
            setLoadingState(LoadingState.PENDING);
            setError(null);

            const response = await api.listShoppingLists(includeArchived);
            setLists(response.data);
            setLoadingState(LoadingState.READY);
        } catch (err) {
            console.error('Failed to load shopping lists:', err);
            setError(err.message || 'Failed to load shopping lists');
            setLoadingState(LoadingState.ERROR);
        }
    }, []);

    // pocatecni nacteni
    useEffect(() => {
        loadLists(showArchived);
    }, [loadLists, showArchived]);

    // ziskani jednoho seznamu podle id
    const getList = useCallback((id) => {
        return lists.find((list) => list.id === id);
    }, [lists]);

    // vytvoreni noveho seznamu
    const createList = useCallback(async (name) => {
        try {
            setLoadingState(LoadingState.PENDING);
            setError(null);

            const response = await api.createShoppingList(name);
            const newList = response.data;

            setLists((prevLists) => [...prevLists, newList]);
            setLoadingState(LoadingState.READY);

            return newList;
        } catch (err) {
            console.error('Failed to create shopping list:', err);
            setError(err.message || 'Failed to create shopping list');
            setLoadingState(LoadingState.ERROR);
            throw err;
        }
    }, []);

    // update nazvu seznamu
    const updateListName = useCallback(async (id, name) => {
        try {
            setLoadingState(LoadingState.PENDING);
            setError(null);

            const response = await api.updateShoppingList(id, name);
            const updatedList = response.data;

            setLists((prevLists) =>
                prevLists.map((list) =>
                    list.id === id ? { ...list, name: updatedList.name || name } : list
                )
            );
            setLoadingState(LoadingState.READY);
        } catch (err) {
            console.error('Failed to update shopping list:', err);
            setError(err.message || 'Failed to update shopping list');
            setLoadingState(LoadingState.ERROR);
            throw err;
        }
    }, []);

    // smazani seznamu
    const deleteList = useCallback(async (id) => {
        try {
            setLoadingState(LoadingState.PENDING);
            setError(null);

            await api.deleteShoppingList(id);

            setLists((prevLists) => prevLists.filter((list) => list.id !== id));
            setLoadingState(LoadingState.READY);
        } catch (err) {
            console.error('Failed to delete shopping list:', err);
            setError(err.message || 'Failed to delete shopping list');
            setLoadingState(LoadingState.ERROR);
            throw err;
        }
    }, []);

    // pridani polozky do seznamu
    const addItem = useCallback(async (listId, itemName) => {
        try {
            setError(null);

            const response = await api.addItem(listId, itemName);
            const newItem = response.data;

            setLists((prevLists) =>
                prevLists.map((list) =>
                    list.id === listId
                        ? { ...list, items: [...list.items, newItem] }
                        : list
                )
            );

            return newItem;
        } catch (err) {
            console.error('Failed to add item:', err);
            setError(err.message || 'Failed to add item');
            throw err;
        }
    }, []);

    // odebrani polozky ze seznamu
    const removeItem = useCallback(async (listId, itemId) => {
        try {
            setError(null);

            await api.removeItem(listId, itemId);

            setLists((prevLists) =>
                prevLists.map((list) =>
                    list.id === listId
                        ? { ...list, items: list.items.filter((item) => item.id !== itemId) }
                        : list
                )
            );
        } catch (err) {
            console.error('Failed to remove item:', err);
            setError(err.message || 'Failed to remove item');
            throw err;
        }
    }, []);

    // prepnuti resolved statusu polozky
    const toggleItem = useCallback(async (listId, itemId) => {
        try {
            setError(null);

            // najdeme aktualni polozku aby jsme zjistili jeji resolved stav
            const list = lists.find((l) => l.id === listId);
            const item = list?.items.find((i) => i.id === itemId);

            if (!item) {
                throw new Error('Item not found');
            }

            const newResolvedState = !item.resolved;
            await api.toggleItem(listId, itemId, newResolvedState);

            setLists((prevLists) =>
                prevLists.map((list) =>
                    list.id === listId
                        ? {
                            ...list,
                            items: list.items.map((item) =>
                                item.id === itemId
                                    ? { ...item, resolved: newResolvedState }
                                    : item
                            ),
                        }
                        : list
                )
            );
        } catch (err) {
            console.error('Failed to toggle item:', err);
            setError(err.message || 'Failed to toggle item');
            throw err;
        }
    }, [lists]);

    // pridani clena do seznamu
    const addMember = useCallback(async (listId, userId) => {
        try {
            setError(null);

            await api.addMember(listId, userId);

            setLists((prevLists) =>
                prevLists.map((list) =>
                    list.id === listId
                        ? { ...list, members: [...list.members, userId] }
                        : list
                )
            );
        } catch (err) {
            console.error('Failed to add member:', err);
            setError(err.message || 'Failed to add member');
            throw err;
        }
    }, []);

    // odebrani clena ze seznamu
    const removeMember = useCallback(async (listId, userId) => {
        try {
            setError(null);

            await api.removeMember(listId, userId);

            setLists((prevLists) =>
                prevLists.map((list) =>
                    list.id === listId
                        ? { ...list, members: list.members.filter((id) => id !== userId) }
                        : list
                )
            );
        } catch (err) {
            console.error('Failed to remove member:', err);
            setError(err.message || 'Failed to remove member');
            throw err;
        }
    }, []);

    // context value
    const value = {
        // state
        lists,
        loadingState,
        error,
        showArchived,
        currentUserId: CURRENT_USER_ID,

        // actions
        loadLists,
        getList,
        createList,
        updateListName,
        deleteList,
        addItem,
        removeItem,
        toggleItem,
        addMember,
        removeMember,
        setShowArchived,
    };

    return (
        <ShoppingListContext.Provider value={value}>
            {children}
        </ShoppingListContext.Provider>
    );
}

// custom hook pro pouziti shopping list contextu
export function useShoppingLists() {
    const context = useContext(ShoppingListContext);

    if (!context) {
        throw new Error('useShoppingLists must be used within ShoppingListProvider');
    }

    return context;
}
