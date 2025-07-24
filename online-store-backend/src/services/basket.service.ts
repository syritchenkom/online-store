import { Basket } from '../db/models/Basket';
import { BasketDevice } from '../db/models/BasketDevice';
import { Device } from '../db/models/Device';
import ApiError from '../utils/ApiError';

// EN: All manual interfaces are now redundant. The model classes provide full type safety.
// PL: Wszystkie ręczne interfejsy są teraz zbędne. Klasy modeli zapewniają pełne bezpieczeństwo typów.

class BasketService {
    public async addItem(userId: number, deviceId: number): Promise<BasketDevice> {
        if (!deviceId) {
            throw ApiError.badRequest('Device ID not provided');
        }

        // EN: No more casting! `basket` is automatically typed as `Basket | null`.
        // PL: Koniec z rzutowaniem! `basket` jest automatycznie typowany jako `Basket | null`.
        const basket = await Basket.findOne({ where: { userId } });
        if (!basket) {
            throw ApiError.notFound('User basket not found');
        }

        // EN: We can check if the device is already in the basket to provide a better error message.
        // PL: Możemy sprawdzić, czy urządzenie jest już w koszyku, aby dostarczyć lepszy komunikat o błędzie.
        const existingItem = await BasketDevice.findOne({ where: { basketId: basket.id, deviceId } });
        if (existingItem) {
            throw ApiError.badRequest('This device is already in the basket');
        }

        const device = await Device.findByPk(deviceId);
        if (!device) {
            throw ApiError.notFound('Device with the specified ID does not exist');
        }

        const basketItem = await BasketDevice.create({ basketId: basket.id, deviceId, quantity: 1 });

        // EN: Re-fetch the item to include the associated Device details in the response.
        // PL: Pobierz ponownie przedmiot, aby dołączyć szczegóły powiązanego urządzenia w odpowiedzi.
        const fullBasketItem = await BasketDevice.findOne({
            where: { id: basketItem.id },
            include: [{ model: Device, attributes: ['id', 'name', 'price', 'img'] }]
        });

        // This is an unlikely scenario, but it's good practice to handle it.
        if (!fullBasketItem) throw ApiError.internal('Could not retrieve item after adding it.');

        return fullBasketItem;
    }

    public async getItems(userId: number): Promise<Basket> {
        const basket = await Basket.findOne({
            where: { userId },
            include: [{
                model: BasketDevice,
                as: 'basketDevices',
                include: [{
                    model: Device,
                    attributes: ['id', 'name', 'price', 'img']
                }]
            }]
        });

        if (!basket) {
            throw ApiError.notFound('User basket not found');
        }

        return basket;
    }

    public async removeItem(userId: number, deviceId: number): Promise<{ message: string }> {
        if (!deviceId) {
            throw ApiError.badRequest('Device ID not provided');
        }

        const basket = await Basket.findOne({ where: { userId } });
        if (!basket) {
            throw ApiError.notFound('User basket not found');
        }

        const deletedCount = await BasketDevice.destroy({
            where: { basketId: basket.id, deviceId: deviceId },
            limit: 1
        });

        if (deletedCount === 0) {
            throw ApiError.notFound('Device with the specified ID not found in the user\'s basket');
        }

        return { message: 'Item successfully removed from basket' };
    }
}

export default new BasketService();