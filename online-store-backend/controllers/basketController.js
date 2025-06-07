const { BasketDevice, Device, Basket } = require('../models/models');
const ApiError = require('../error/ApiError');

class BasketController {
    async addItemToBasket(req, res, next) {
        try {
            // EN: Get deviceId from request body. userId can be taken from authenticated user (req.user.id)
            // PL: Pobierz deviceId z ciała żądania. userId można pobrać z uwierzytelnionego użytkownika (req.user.id)
            const { deviceId } = req.body;
            const userId = req.user.id; // EN: Assuming authMiddleware provides req.user // PL: Zakładając, że authMiddleware dostarcza req.user

            if (!deviceId) {
                return next(ApiError.badRequest('Nie podano ID urządzenia'));
            }

            // EN: Find the user's basket
            // PL: Znajdź koszyk użytkownika
            const basket = await Basket.findOne({ where: { userId } });
            if (!basket) {
                // EN: This case should ideally not happen if a basket is created upon registration
                // PL: Ten przypadek idealnie nie powinien mieć miejsca, jeśli koszyk jest tworzony podczas rejestracji
                return next(ApiError.internal('Koszyk użytkownika nie został znaleziony'));
            }

            // EN: Check if the device exists
            // PL: Sprawdź, czy urządzenie istnieje
            const device = await Device.findByPk(deviceId);
            if (!device) {
                return next(ApiError.badRequest('Urządzenie o podanym ID nie istnieje'));
            }

            // EN: Add item to basket
            // PL: Dodaj przedmiot do koszyka
            const basketItem = await BasketDevice.create({ basketId: basket.id, deviceId });

            return res.json(basketItem);
        } catch (e) {
            console.error('Błąd podczas dodawania przedmiotu do koszyka:', e);
            next(ApiError.internal('Wystąpił błąd podczas dodawania przedmiotu do koszyka'));
        }
    }

    async getBasketItems(req, res, next) {
        try {
            const userId = req.user.id; // EN: Assuming authMiddleware provides req.user // PL: Zakładając, że authMiddleware dostarcza req.user

            const basket = await Basket.findOne({
                where: { userId },
                include: [{
                    model: BasketDevice,
                    include: [{
                        model: Device, // EN: Include device details // PL: Dołącz szczegóły urządzenia
                        attributes: ['id', 'name', 'price', 'img'] // EN: Select specific attributes // PL: Wybierz określone atrybuty
                    }]
                }]
            });

            if (!basket) {
                return next(ApiError.internal('Koszyk użytkownika nie został znaleziony'));
            }

            return res.json(basket);
        } catch (e) {
            console.error('Błąd podczas pobierania przedmiotów z koszyka:', e);
            return next(ApiError.internal('An error occurred while retrieving basket items'));
        }
    }

    async removeItemFromBasket(req, res, next) {
        try {
            // EN: Get deviceId from request parameters and userId from authenticated user.
            // PL: Pobierz deviceId z parametrów żądania i userId z uwierzytelnionego użytkownika.
            const { deviceId } = req.params;
            const userId = req.user.id; // EN: Assuming authMiddleware provides req.user // PL: Zakładając, że authMiddleware dostarcza req.user
    
            // EN: Validate deviceId presence.
            // PL: Sprawdz obecność deviceId.
            if (!deviceId) {
                return next(ApiError.badRequest('Nie podano ID urządzenia do usunięcia'));
            }

            // EN: Find the user's basket.
            // PL: Znajdź koszyk użytkownika.
            const basket = await Basket.findOne({ where: { userId } });
            if (!basket) {
                return next(ApiError.internal('Koszyk użytkownika nie został znaleziony'));
            }

            // EN: Find and delete the specific BasketDevice entry.
            // PL: Znajdź i usuń konkretny wpis BasketDevice.
            const deletedCount = await BasketDevice.destroy({
                where: { basketId: basket.id, deviceId: deviceId }
            });

            if (deletedCount === 0) {
                return next(ApiError.notFound('Przedmiot o podanym ID urządzenia nie został znaleziony w koszyku użytkownika'));
            }
            return res.json({ message: 'Przedmiot został pomyślnie usunięty z koszyka' }); // EN: Success message. PL: Wiadomość o sukcesie.
        } catch (e) {
            console.error('Błąd podczas usuwania przedmiotu z koszyka:', e); // EN: Log the error. PL: Zaloguj błąd.
            next(ApiError.internal('Wystąpił błąd podczas usuwania przedmiotu z koszyka')); // EN: Generic internal error message. PL: Ogólna wiadomość o błędzie wewnętrznym.
        }
    }
}

module.exports = new BasketController();
