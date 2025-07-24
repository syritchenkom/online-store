import { Request, Response, NextFunction } from 'express';
import basketService from '../../../services/basket.service';
import ApiError from '../../../utils/ApiError';

// EN: Custom request type for authenticated routes.
interface AddItemToBasketRequestBody {
    deviceId: number;
}

// EN: Add a device to the user's basket.
// PL: Dodaj urządzenie do koszyka użytkownika.
export const addItemToBasket = async (req: Request<{}, {}, AddItemToBasketRequestBody>, res: Response, next: NextFunction) => {
    try {
        const { deviceId } = req.body;
         // EN: Since authMiddleware runs before this, req.user should exist. We add a check for type safety.
        // PL: Ponieważ authMiddleware działa przed tym, req.user powinno istnieć. Dodajemy sprawdzenie dla bezpieczeństwa typów.
        if (!req.user || typeof req.user === 'string') return next(ApiError.unauthorized());
        const userId = req.user.id;

        const newItem = await basketService.addItem(userId, deviceId); 
        return res.json(newItem);
    } catch (e) {
       next(e)
    }
};

// EN: Get all items from the user's basket.
// PL: Pobierz wszystkie przedmioty z koszyka użytkownika.
export const getBasketItems = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!req.user || typeof req.user === 'string') return next(ApiError.unauthorized());
        const userId = req.user.id;
        const basket = await basketService.getItems(userId);
        return res.json(basket);
    } catch (e) {
       next(e);
    }
};

// EN: Remove a device from the user's basket.
// PL: Usuń urządzenie z koszyka użytkownika.
export const removeItemFromBasket = async (req: Request<{ deviceId: string }>, res: Response, next: NextFunction) => {
    try {
        const { deviceId } = req.params;
        if (!req.user || typeof req.user === 'string') return next(ApiError.unauthorized());
        const userId = req.user.id;

        const result = await basketService.removeItem(userId, Number(deviceId));
        return res.json(result);
    } catch (e) {
        next(e);
    }
};
