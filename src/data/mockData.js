// Výchozí seznam nákupních seznamů
export const INITIAL_SHOPPING_LISTS = [
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

// Pro zpětnou kompatibilitu
export const INITIAL_SHOPPING_LIST = INITIAL_SHOPPING_LISTS[0];

export const MOCK_USERS = {
  'user-001': 'Filip Héda',
  'user-002': 'Hvězdička Patrik',
  'user-003': 'Test User',
  'user-004': 'Petr Pavel',
  'user-005': 'Tvůj Pes',
};

// demo
export const CURRENT_USER_ID = 'user-001';

export const FILTER_OPTIONS = {
  ALL: 'ALL',
  UNRESOLVED: 'UNRESOLVED',
  RESOLVED: 'RESOLVED',
};
