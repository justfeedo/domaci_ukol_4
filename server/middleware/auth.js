
const authenticate = (req, res, next) => {
  // Pro úkol používáme jednoduchou autentizaci přes header
  // V reálu by se tady kontrolovaly JWT tokeny
  const userId = req.headers['x-user-id'];

  if (!userId) {
    return res.status(401).json({
      status: 401,
      error: {
        code: 'UNAUTHORIZED',
        message: 'Authentication required',
        paramMap: {}
      }
    });
  }


  req.user = { id: userId };
  next();
};


const authorize = (requiredProfiles) => {
  return async (req, res, next) => {
    try {
      const userId = req.user.id;

      // Zkusíme najít shoppingListId kdekoliv - v params, query nebo body
      const shoppingListId = req.params.shoppingListId ||
        req.query.shoppingListId ||
        req.query.id ||
        req.body.shoppingListId ||
        req.body.id;

      // Pokud není shoppingListId, jen ověříme že je uživatel přihlášený
      // To je pro endpointy jako listShoppingLists, které nepracují s konkrétním seznamem
      if (!shoppingListId) {
        // Uživatel už je autentizovaný, takže mu to povolíme
        req.userProfile = 'Member'; // Defaultní profil pro listování
        return next();
      }


      const userProfile = await getUserProfile(userId, shoppingListId);

      if (!userProfile) {
        return res.status(403).json({
          status: 403,
          error: {
            code: 'FORBIDDEN',
            message: 'Access denied. User does not have required permissions.',
            paramMap: {}
          }
        });
      }


      if (!requiredProfiles.includes(userProfile)) {
        return res.status(403).json({
          status: 403,
          error: {
            code: 'FORBIDDEN',
            message: `Access denied. Required profile: ${requiredProfiles.join(' or ')}`,
            paramMap: {}
          }
        });
      }

      req.userProfile = userProfile;
      next();
    } catch (error) {
      next(error);
    }
  };
};

/**
 * Funkce pro získání profilu uživatele (mock)
 * V produkci by se tady dotazovala databáze
 */
async function getUserProfile(userId, shoppingListId) {
  // zjednodušená mock implementace
  return 'Owner'; // nebo 'Member'
}

module.exports = {
  authenticate,
  authorize
};

