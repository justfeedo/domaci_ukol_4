const { body, query } = require('express-validator');

/**
 * Validační pravidla pro shopping list endpointy
 */

// Vytvoření shopping listu
const validateCreateShoppingList = [
  body('name')
    .notEmpty()
    .withMessage('Name is required')
    .isString()
    .withMessage('Name must be a string')
    .trim()
    .isLength({ min: 1, max: 255 })
    .withMessage('Name must be between 1 and 255 characters')
];

// Získání shopping listu
const validateGetShoppingList = [
  query('id')
    .notEmpty()
    .withMessage('Shopping list id is required')
    .isString()
    .withMessage('Shopping list id must be a string')
];

// Seznam shopping listů
const validateListShoppingLists = [
  query('archived')
    .optional()
    .isBoolean()
    .withMessage('Archived must be a boolean')
    .toBoolean(),
  query('pageInfo')
    .optional()
    .isObject()
    .withMessage('PageInfo must be an object'),
  query('pageInfo.pageIndex')
    .optional()
    .isInt({ min: 0 })
    .withMessage('PageIndex must be a non-negative integer'),
  query('pageInfo.pageSize')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('PageSize must be between 1 and 100')
];

// Aktualizace shopping listu
const validateUpdateShoppingList = [
  body('id')
    .notEmpty()
    .withMessage('Shopping list id is required')
    .isString()
    .withMessage('Shopping list id must be a string'),
  body('name')
    .notEmpty()
    .withMessage('Name is required')
    .isString()
    .withMessage('Name must be a string')
    .trim()
    .isLength({ min: 1, max: 255 })
    .withMessage('Name must be between 1 and 255 characters')
];

// Smazání shopping listu
const validateDeleteShoppingList = [
  query('id')
    .notEmpty()
    .withMessage('Shopping list id is required')
    .isString()
    .withMessage('Shopping list id must be a string')
];

// Archivace shopping listu
const validateArchiveShoppingList = [
  body('id')
    .notEmpty()
    .withMessage('Shopping list id is required')
    .isString()
    .withMessage('Shopping list id must be a string'),
  body('archived')
    .notEmpty()
    .withMessage('Archived flag is required')
    .isBoolean()
    .withMessage('Archived must be a boolean')
    .toBoolean()
];

// Přidání člena
const validateAddMember = [
  body('shoppingListId')
    .notEmpty()
    .withMessage('Shopping list id is required')
    .isString()
    .withMessage('Shopping list id must be a string'),
  body('userId')
    .notEmpty()
    .withMessage('User id is required')
    .isString()
    .withMessage('User id must be a string')
];

// Odebrání člena
const validateRemoveMember = [
  query('shoppingListId')
    .notEmpty()
    .withMessage('Shopping list id is required')
    .isString()
    .withMessage('Shopping list id must be a string'),
  query('userId')
    .notEmpty()
    .withMessage('User id is required')
    .isString()
    .withMessage('User id must be a string')
];

// Opuštění seznamu
const validateLeaveMember = [
  body('shoppingListId')
    .notEmpty()
    .withMessage('Shopping list id is required')
    .isString()
    .withMessage('Shopping list id must be a string')
];

// Přidání položky
const validateAddItem = [
  body('shoppingListId')
    .notEmpty()
    .withMessage('Shopping list id is required')
    .isString()
    .withMessage('Shopping list id must be a string'),
  body('name')
    .notEmpty()
    .withMessage('Item name is required')
    .isString()
    .withMessage('Item name must be a string')
    .trim()
    .isLength({ min: 1, max: 255 })
    .withMessage('Item name must be between 1 and 255 characters'),
  body('description')
    .optional()
    .isString()
    .withMessage('Description must be a string')
    .trim(),
  body('quantity')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Quantity must be a positive integer')
    .toInt()
];

// Odebrání položky
const validateRemoveItem = [
  query('shoppingListId')
    .notEmpty()
    .withMessage('Shopping list id is required')
    .isString()
    .withMessage('Shopping list id must be a string'),
  query('itemId')
    .notEmpty()
    .withMessage('Item id is required')
    .isString()
    .withMessage('Item id must be a string')
];

// Označení položky jako vyřešené
const validateResolveItem = [
  body('shoppingListId')
    .notEmpty()
    .withMessage('Shopping list id is required')
    .isString()
    .withMessage('Shopping list id must be a string'),
  body('itemId')
    .notEmpty()
    .withMessage('Item id is required')
    .isString()
    .withMessage('Item id must be a string'),
  body('resolved')
    .notEmpty()
    .withMessage('Resolved flag is required')
    .isBoolean()
    .withMessage('Resolved must be a boolean')
    .toBoolean()
];

module.exports = {
  validateCreateShoppingList,
  validateGetShoppingList,
  validateListShoppingLists,
  validateUpdateShoppingList,
  validateDeleteShoppingList,
  validateArchiveShoppingList,
  validateAddMember,
  validateRemoveMember,
  validateLeaveMember,
  validateAddItem,
  validateRemoveItem,
  validateResolveItem
};

