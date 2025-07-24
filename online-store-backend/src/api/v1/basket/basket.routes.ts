
import { Router } from 'express';
import {
    addItemToBasket,
    getBasketItems,
    removeItemFromBasket
} from './basket.controller';
import authMiddleware from '../../../middleware/auth.middleware';

const router = Router();

// EN: Add item to basket
// PL: Dodaj przedmiot do koszyka
router.post('/', authMiddleware, addItemToBasket);

// EN: Get all items from the user's basket
// PL: Pobierz wszystkie przedmioty z koszyka użytkownika
router.get('/', authMiddleware, getBasketItems);

// EN: Remove an item from the basket by its device ID.
// PL: Usuń przedmiot z koszyka po jego ID urządzenia.
router.delete('/:deviceId', authMiddleware, removeItemFromBasket);

export default router;