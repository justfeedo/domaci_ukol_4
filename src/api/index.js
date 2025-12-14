// api client - automaticky prepina mezi mock a real api podle configu

import { USE_MOCK_DATA } from '../config';
import * as mockApi from './mockApi';
import * as realApi from './realApi';

// vyber spravne api implementace
const api = USE_MOCK_DATA ? mockApi : realApi;

// export vsech api metod
export const {
    listShoppingLists,
    getShoppingList,
    createShoppingList,
    updateShoppingList,
    deleteShoppingList,
    archiveShoppingList,
    addItem,
    removeItem,
    toggleItem,
    addMember,
    removeMember,
} = api;

// log aby bylo videt ktery mode pouzivame
console.log(`🔧 API Mode: ${USE_MOCK_DATA ? 'MOCK (Client-Side)' : 'REAL (Server)'}`);
