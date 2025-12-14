// controller pro shopping listy
// obsahuje logiku pro vsechny endpointy
// pouziva in-memory data store pro persistenci behem session

const db = require('../data/mockData');

// vytvoreni shopping listu - POST /shoppingList/create
const createShoppingList = (req, res, next) => {
  try {
    const { name } = req.body;
    const ownerId = req.user.id;

    const newList = db.createList(name, ownerId);

    res.status(200).json({
      status: 200,
      dtoOut: newList,
      dtoIn: { name }
    });
  } catch (error) {
    next(error);
  }
};

// ziskani shopping listu - GET /shoppingList/get?id=...
const getShoppingList = (req, res, next) => {
  try {
    const { id } = req.query;

    const list = db.getListById(id);

    if (!list) {
      return res.status(404).json({
        status: 404,
        message: 'Shopping list not found'
      });
    }

    res.status(200).json({
      status: 200,
      dtoOut: list,
      dtoIn: { id }
    });
  } catch (error) {
    next(error);
  }
};

// seznam shopping listu - GET /shoppingList/list?archived=false&pageInfo.pageIndex=0&pageInfo.pageSize=10
const listShoppingLists = (req, res, next) => {
  try {
    const archived = req.query.archived === 'true';

    const lists = db.getAllLists(archived);

    res.status(200).json({
      status: 200,
      dtoOut: {
        itemList: lists,
        pageInfo: {
          pageIndex: 0,
          pageSize: lists.length,
          total: lists.length
        }
      },
      dtoIn: { archived }
    });
  } catch (error) {
    next(error);
  }
};

// aktualizace shopping listu - PUT /shoppingList/update
const updateShoppingList = (req, res, next) => {
  try {
    const { id, name } = req.body;

    const updatedList = db.updateList(id, { name });

    if (!updatedList) {
      return res.status(404).json({
        status: 404,
        message: 'Shopping list not found'
      });
    }

    res.status(200).json({
      status: 200,
      dtoOut: updatedList,
      dtoIn: { id, name }
    });
  } catch (error) {
    next(error);
  }
};

// smazani shopping listu - DELETE /shoppingList/delete?id=...
const deleteShoppingList = (req, res, next) => {
  try {
    const { id } = req.query;

    const deleted = db.deleteList(id);

    if (!deleted) {
      return res.status(404).json({
        status: 404,
        message: 'Shopping list not found'
      });
    }

    res.status(200).json({
      status: 200,
      dtoOut: {
        id,
        deleted: true
      },
      dtoIn: { id }
    });
  } catch (error) {
    next(error);
  }
};

// archivace shopping listu - PATCH /shoppingList/archive
const archiveShoppingList = (req, res, next) => {
  try {
    const { id, archived } = req.body;

    const updatedList = db.updateList(id, { archived });

    if (!updatedList) {
      return res.status(404).json({
        status: 404,
        message: 'Shopping list not found'
      });
    }

    res.status(200).json({
      status: 200,
      dtoOut: updatedList,
      dtoIn: { id, archived }
    });
  } catch (error) {
    next(error);
  }
};

// pridani clena - POST /shoppingList/addMember
const addMember = (req, res, next) => {
  try {
    const { shoppingListId, userId } = req.body;

    const added = db.addMemberToList(shoppingListId, userId);

    if (!added) {
      return res.status(400).json({
        status: 400,
        message: 'Failed to add member (already exists or list not found)'
      });
    }

    res.status(200).json({
      status: 200,
      dtoOut: {
        shoppingListId,
        userId,
        addedAt: new Date().toISOString()
      },
      dtoIn: { shoppingListId, userId }
    });
  } catch (error) {
    next(error);
  }
};

// odebrani clena - DELETE /shoppingList/removeMember?shoppingListId=...&userId=...
const removeMember = (req, res, next) => {
  try {
    const { shoppingListId, userId } = req.query;

    const removed = db.removeMemberFromList(shoppingListId, userId);

    if (!removed) {
      return res.status(404).json({
        status: 404,
        message: 'Member not found or list not found'
      });
    }

    res.status(200).json({
      status: 200,
      dtoOut: {
        shoppingListId,
        userId,
        removedAt: new Date().toISOString()
      },
      dtoIn: { shoppingListId, userId }
    });
  } catch (error) {
    next(error);
  }
};

// opusteni seznamu - POST /shoppingList/leave
const leaveMember = (req, res, next) => {
  try {
    const { shoppingListId } = req.body;
    const userId = req.user.id;

    const removed = db.removeMemberFromList(shoppingListId, userId);

    if (!removed) {
      return res.status(404).json({
        status: 404,
        message: 'You are not a member or list not found'
      });
    }

    res.status(200).json({
      status: 200,
      dtoOut: {
        shoppingListId,
        userId,
        leftAt: new Date().toISOString()
      },
      dtoIn: { shoppingListId }
    });
  } catch (error) {
    next(error);
  }
};

// pridani polozky - POST /shoppingList/addItem
const addItem = (req, res, next) => {
  try {
    const { shoppingListId, name } = req.body;

    const newItem = db.addItemToList(shoppingListId, name);

    if (!newItem) {
      return res.status(404).json({
        status: 404,
        message: 'Shopping list not found'
      });
    }

    res.status(200).json({
      status: 200,
      dtoOut: newItem,
      dtoIn: { shoppingListId, name }
    });
  } catch (error) {
    next(error);
  }
};

// odebrani polozky - DELETE /shoppingList/removeItem?shoppingListId=...&itemId=...
const removeItem = (req, res, next) => {
  try {
    const { shoppingListId, itemId } = req.query;

    const removed = db.removeItemFromList(shoppingListId, itemId);

    if (!removed) {
      return res.status(404).json({
        status: 404,
        message: 'Item not found or list not found'
      });
    }

    res.status(200).json({
      status: 200,
      dtoOut: {
        shoppingListId,
        itemId,
        removedAt: new Date().toISOString()
      },
      dtoIn: { shoppingListId, itemId }
    });
  } catch (error) {
    next(error);
  }
};

// oznaceni polozky jako vyresene - PATCH /shoppingList/resolveItem
const resolveItem = (req, res, next) => {
  try {
    const { shoppingListId, itemId, resolved } = req.body;

    const updatedItem = db.updateItemInList(shoppingListId, itemId, { resolved });

    if (!updatedItem) {
      return res.status(404).json({
        status: 404,
        message: 'Item not found or list not found'
      });
    }

    res.status(200).json({
      status: 200,
      dtoOut: updatedItem,
      dtoIn: { shoppingListId, itemId, resolved }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createShoppingList,
  getShoppingList,
  listShoppingLists,
  updateShoppingList,
  deleteShoppingList,
  archiveShoppingList,
  addMember,
  removeMember,
  leaveMember,
  addItem,
  removeItem,
  resolveItem
};
