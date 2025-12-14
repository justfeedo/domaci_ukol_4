const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('../middleware/auth');
const validate = require('../middleware/validation');
const {
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
} = require('../validators/shoppingListValidators');
const shoppingListController = require('../controllers/shoppingListController');

// Vytvoření shopping listu - kdokoliv může vytvořit, stane se owner
router.post(
  '/create',
  authenticate,
  validateCreateShoppingList,
  validate,
  shoppingListController.createShoppingList
);

// Získání shopping listu - Owner, Member
router.get(
  '/get',
  authenticate,
  validateGetShoppingList,
  validate,
  authorize(['Owner', 'Member']),
  shoppingListController.getShoppingList
);

// Seznam shopping listů - Owner, Member (auth neni potreba)
router.get(
  '/list',
  authenticate,
  validateListShoppingLists,
  validate,
  shoppingListController.listShoppingLists
);

// Aktualizace shopping listu - jen Owner
router.put(
  '/update',
  authenticate,
  validateUpdateShoppingList,
  validate,
  authorize(['Owner']),
  shoppingListController.updateShoppingList
);

// Smazání shopping listu - jen Owner
router.delete(
  '/delete',
  authenticate,
  validateDeleteShoppingList,
  validate,
  authorize(['Owner']),
  shoppingListController.deleteShoppingList
);

// Archivace shopping listu - jen Owner
router.patch(
  '/archive',
  authenticate,
  validateArchiveShoppingList,
  validate,
  authorize(['Owner']),
  shoppingListController.archiveShoppingList
);

// Přidání člena - jen Owner
router.post(
  '/addMember',
  authenticate,
  validateAddMember,
  validate,
  authorize(['Owner']),
  shoppingListController.addMember
);

// Odebrání člena - jen Owner
router.delete(
  '/removeMember',
  authenticate,
  validateRemoveMember,
  validate,
  authorize(['Owner']),
  shoppingListController.removeMember
);

// Opuštění seznamu - Member (může opustit sám sebe)
router.post(
  '/leave',
  authenticate,
  validateLeaveMember,
  validate,
  authorize(['Owner', 'Member']),
  shoppingListController.leaveMember
);

// Přidání položky - Owner, Member
router.post(
  '/addItem',
  authenticate,
  validateAddItem,
  validate,
  authorize(['Owner', 'Member']),
  shoppingListController.addItem
);

// Odebrání položky - Owner, Member
router.delete(
  '/removeItem',
  authenticate,
  validateRemoveItem,
  validate,
  authorize(['Owner', 'Member']),
  shoppingListController.removeItem
);

// Označení položky jako vyřešené - Owner, Member
router.patch(
  '/resolvettem',
  authenticate,
  validateResolveItem,
  validate,
  authorize(['Owner', 'Member']),
  shoppingListController.resolveItem
);

module.exports = router;

