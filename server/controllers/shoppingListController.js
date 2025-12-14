// controller pro shopping listy
// obsahuje logiku pro vsechny endpointy
// pouziva mongodb (mongoose) pro persistenci dat

const ShoppingList = require('../models/ShoppingList');

// vytvoreni shopping listu - POST /shoppingList/create
const createShoppingList = async (req, res, next) => {
  try {
    const { name } = req.body;
    const ownerId = req.user.id;

    // vytvorime novy seznam v mongodb
    const newList = await ShoppingList.create({
      name,
      ownerId,
      members: [ownerId],  // owner je automaticky prvnim clenem
      items: [],
      archived: false
    });

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
const getShoppingList = async (req, res, next) => {
  try {
    const { id } = req.query;

    // najdeme seznam v mongodb
    const list = await ShoppingList.findById(id);

    if (!list) {
      return res.status(404).json({
        status: 404,
        message: 'Shopping list not found'
      });
    }

    // zkontrolujeme pristup (owner nebo member)
    if (!list.hasAccess(req.user.id)) {
      return res.status(403).json({
        status: 403,
        message: 'Access denied'
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

// seznam shopping listu - GET /shoppingList/list?archived=false
const listShoppingLists = async (req, res, next) => {
  try {
    const archived = req.query.archived === 'true';
    const userId = req.user.id;

    // najdeme vsechny seznamy kde je uzivatel owner nebo member
    const lists = await ShoppingList.find({
      $and: [
        { archived },
        {
          $or: [
            { ownerId: userId },
            { members: userId }
          ]
        }
      ]
    }).sort({ createdAt: -1 });  // nejnovejsi prvni

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
const updateShoppingList = async (req, res, next) => {
  try {
    const { id, name } = req.body;

    // najdeme seznam
    const list = await ShoppingList.findById(id);

    if (!list) {
      return res.status(404).json({
        status: 404,
        message: 'Shopping list not found'
      });
    }

    // pouze owner muze updatovat
    if (!list.isOwner(req.user.id)) {
      return res.status(403).json({
        status: 403,
        message: 'Only owner can update shopping list'
      });
    }

    // updatneme nazev
    list.name = name;
    await list.save();

    res.status(200).json({
      status: 200,
      dtoOut: list,
      dtoIn: { id, name }
    });
  } catch (error) {
    next(error);
  }
};

// smazani shopping listu - DELETE /shoppingList/delete?id=...
const deleteShoppingList = async (req, res, next) => {
  try {
    const { id } = req.query;

    // najdeme seznam
    const list = await ShoppingList.findById(id);

    if (!list) {
      return res.status(404).json({
        status: 404,
        message: 'Shopping list not found'
      });
    }

    // pouze owner muze smazat
    if (!list.isOwner(req.user.id)) {
      return res.status(403).json({
        status: 403,
        message: 'Only owner can delete shopping list'
      });
    }

    //smazeme z databaze
    await ShoppingList.findByIdAndDelete(id);

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
const archiveShoppingList = async (req, res, next) => {
  try {
    const { id, archived } = req.body;

    // najdeme seznam
    const list = await ShoppingList.findById(id);

    if (!list) {
      return res.status(404).json({
        status: 404,
        message: 'Shopping list not found'
      });
    }

    // pouze owner muze archivovat
    if (!list.isOwner(req.user.id)) {
      return res.status(403).json({
        status: 403,
        message: 'Only owner can archive shopping list'
      });
    }

    // nastavime archived flag
    list.archived = archived;
    await list.save();

    res.status(200).json({
      status: 200,
      dtoOut: list,
      dtoIn: { id, archived }
    });
  } catch (error) {
    next(error);
  }
};

// pridani clena - POST /shoppingList/addMember
const addMember = async (req, res, next) => {
  try {
    const { shoppingListId, userId } = req.body;

    // najdeme seznam
    const list = await ShoppingList.findById(shoppingListId);

    if (!list) {
      return res.status(404).json({
        status: 404,
        message: 'Shopping list not found'
      });
    }

    // pouze owner muze pridavat cleny
    if (!list.isOwner(req.user.id)) {
      return res.status(403).json({
        status: 403,
        message: 'Only owner can add members'
      });
    }

    // zkontrolujeme, jestli uz neni clenem
    if (list.isMember(userId)) {
      return res.status(400).json({
        status: 400,
        message: 'User is already a member'
      });
    }

    // pridame clena pouzitim $addToSet (prida pouze pokud tam jeste neni)
    await ShoppingList.findByIdAndUpdate(
      shoppingListId,
      { $addToSet: { members: userId } }
    );

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
const removeMember = async (req, res, next) => {
  try {
    const { shoppingListId, userId } = req.query;

    // najdeme seznam
    const list = await ShoppingList.findById(shoppingListId);

    if (!list) {
      return res.status(404).json({
        status: 404,
        message: 'Shopping list not found'
      });
    }

    // pouze owner muze odebirat cleny
    if (!list.isOwner(req.user.id)) {
      return res.status(403).json({
        status: 403,
        message: 'Only owner can remove members'
      });
    }

    // zkontrolujeme, jestli je clenem
    if (!list.isMember(userId)) {
      return res.status(404).json({
        status: 404,
        message: 'User is not a member'
      });
    }

    // odebereme clena pouzitim $pull
    await ShoppingList.findByIdAndUpdate(
      shoppingListId,
      { $pull: { members: userId } }
    );

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
const leaveMember = async (req, res, next) => {
  try {
    const { shoppingListId } = req.body;
    const userId = req.user.id;

    // najdeme seznam
    const list = await ShoppingList.findById(shoppingListId);

    if (!list) {
      return res.status(404).json({
        status: 404,
        message: 'Shopping list not found'
      });
    }

    // zkontrolujeme, jestli je clenem
    if (!list.isMember(userId)) {
      return res.status(404).json({
        status: 404,
        message: 'You are not a member of this list'
      });
    }

    // odebereme sebe sama
    await ShoppingList.findByIdAndUpdate(
      shoppingListId,
      { $pull: { members: userId } }
    );

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
const addItem = async (req, res, next) => {
  try {
    const { shoppingListId, name } = req.body;

    // najdeme seznam
    const list = await ShoppingList.findById(shoppingListId);

    if (!list) {
      return res.status(404).json({
        status: 404,
        message: 'Shopping list not found'
      });
    }

    // zkontrolujeme pristup
    if (!list.hasAccess(req.user.id)) {
      return res.status(403).json({
        status: 403,
        message: 'Access denied'
      });
    }

    // vytvorime novou polozku
    const newItem = {
      name,
      resolved: false
    };

    // pridame polozku
    list.items.push(newItem);
    await list.save();

    // vratime nove pridanou polozku (posledni v array)
    const addedItem = list.items[list.items.length - 1];

    res.status(200).json({
      status: 200,
      dtoOut: addedItem,
      dtoIn: { shoppingListId, name }
    });
  } catch (error) {
    next(error);
  }
};

// odebrani polozky - DELETE /shoppingList/removeItem?shoppingListId=...&itemId=...
const removeItem = async (req, res, next) => {
  try {
    const { shoppingListId, itemId } = req.query;

    // najdeme seznam
    const list = await ShoppingList.findById(shoppingListId);

    if (!list) {
      return res.status(404).json({
        status: 404,
        message: 'Shopping list not found'
      });
    }

    // zkontrolujeme pristup
    if (!list.hasAccess(req.user.id)) {
      return res.status(403).json({
        status: 403,
        message: 'Access denied'
      });
    }

    // odebereme polozku pouzitim $pull na subdocument
    await ShoppingList.findByIdAndUpdate(
      shoppingListId,
      { $pull: { items: { _id: itemId } } }
    );

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
const resolveItem = async (req, res, next) => {
  try {
    const { shoppingListId, itemId, resolved } = req.body;

    // najdeme seznam
    const list = await ShoppingList.findById(shoppingListId);

    if (!list) {
      return res.status(404).json({
        status: 404,
        message: 'Shopping list not found'
      });
    }

    // zkontrolujeme pristup
    if (!list.hasAccess(req.user.id)) {
      return res.status(403).json({
        status: 403,
        message: 'Access denied'
      });
    }

    // najdeme polozku
    const item = list.items.id(itemId);

    if (!item) {
      return res.status(404).json({
        status: 404,
        message: 'Item not found'
      });
    }

    // updatneme resolved status
    item.resolved = resolved;
    await list.save();

    res.status(200).json({
      status: 200,
      dtoOut: item,
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
