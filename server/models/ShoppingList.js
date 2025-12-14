// shopping list mongoose model - definuje schema pro mongodb

const mongoose = require('mongoose');

// schema pro jednotlive polozky v seznamu
const itemSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'nazev polozky je povinny'],
        trim: true
    },
    resolved: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: false  // nepotrebujeme timestamps pro sub-documenty
});

// hlavni schema pro shopping list
const shoppingListSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'nazev seznamu je povinny'],
        trim: true,
        maxlength: [100, 'nazev musi byt kratsi nez 100 znaku']
    },
    ownerId: {
        type: String,
        required: [true, 'owner id je povinne'],
        index: true  // index pro rychlejsi vyhledavani
    },
    members: [{
        type: String,
        required: true
    }],
    items: [itemSchema],
    archived: {
        type: Boolean,
        default: false,
        index: true  // index pro filtrovani archived/active
    }
}, {
    timestamps: true  // automaticky prida createdAt a updatedAt
});

// compound index pro efektivni dotazy na seznamy uzivatele
shoppingListSchema.index({ ownerId: 1, archived: 1 });
shoppingListSchema.index({ members: 1, archived: 1 });

// metoda pro kontrolu, jestli je uzivatel owner
shoppingListSchema.methods.isOwner = function (userId) {
    return this.ownerId === userId;
};

// metoda pro kontrolu, jestli je uzivatel member
shoppingListSchema.methods.isMember = function (userId) {
    return this.members.includes(userId);
};

// metoda pro kontrolu, jestli ma uzivatel pristup (owner nebo member)
shoppingListSchema.methods.hasAccess = function (userId) {
    return this.isOwner(userId) || this.isMember(userId);
};

const ShoppingList = mongoose.model('ShoppingList', shoppingListSchema);

module.exports = ShoppingList;
