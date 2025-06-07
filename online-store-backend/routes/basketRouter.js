const Router = require('express')
const router = new Router()
const basketController = require('../controllers/basketController')
const authMiddleware = require('../middleware/authMiddleware'); // EN: Protect basket routes // PL: Chroń trasy koszyka

// EN: Add item to basket
// PL: Dodaj przedmiot do koszyka
router.post('/item', authMiddleware, basketController.addItemToBasket);

// EN: Get all items from the user's basket
// PL: Pobierz wszystkie przedmioty z koszyka użytkownika
router.get('/', authMiddleware, basketController.getBasketItems);

// DELETE /api/basket/:deviceId - Remove item from basket by device ID. Requires authentication.
// PL: DELETE /api/basket/:deviceId - Usuń przedmiot z koszyka po ID urządzenia. Wymaga uwierzytelnienia.
router.delete('/:deviceId', authMiddleware, basketController.removeItemFromBasket);





module.exports = router