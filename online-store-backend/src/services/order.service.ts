import sequelize from '../db';
import { Basket } from '../db/models/Basket';
import { BasketDevice } from '../db/models/BasketDevice';
import { Device } from '../db/models/Device';
import { Order } from '../db/models/Order';
import { OrderDetail } from '../db/models/OrderDetail';
import ApiError from '../utils/ApiError';
import paymentService from './payment.service';
import { User } from '../db/models/User';

interface OrderCreationData {
    notes?: string;
    firstName: string;
    lastName?: string;
    paymentMethod: string;
}

interface CreateOrderResponse {
    order: Order;
    redirectUri?: string;
}

class OrderService {
    public async createOrder(user: User, orderData: OrderCreationData, clientIp: string): Promise<CreateOrderResponse> {
        // Step 1: Find the basket and items. No transaction yet.
        const basket = await Basket.findOne({
            where: { userId: user.id },
            include: [{
                model: BasketDevice,
                as: 'basketDevices',
                include: [{ model: Device }]
            }]
        });

        if (!basket || !basket.basketDevices || basket.basketDevices.length === 0) {
            throw ApiError.badRequest('Your basket is empty.');
        }

        // Step 2: Create the local order and details within a transaction.
        const transaction = await sequelize.transaction();
        let order: Order;
        try {
            const totalAmount = basket.basketDevices.reduce((sum, item) => {
                if (!item.device || typeof item.device.price !== 'number') {
                    // This check is important for data integrity.
                    throw new Error(`Price for device ID ${item.deviceId} is invalid.`);
                }
                return sum + (item.device.price * item.quantity);
            }, 0);

            order = await Order.create({
                userId: user.id,
                totalAmount,
                status: 'draft', // Start with a 'draft' status
                notes: orderData.notes,
                firstName: orderData.firstName,
                lastName: orderData.lastName,
                paymentMethod: orderData.paymentMethod,
            }, { transaction });

            const orderDetailsData = basket.basketDevices.map(item => {
                if (!item.device) {
                    throw new Error('A device in the basket is missing details.');
                }
                return {
                    orderId: order.id,
                    deviceId: item.deviceId,
                    quantity: item.quantity,
                    price: item.device.price,
                };
            });

            await OrderDetail.bulkCreate(orderDetailsData, { transaction });

            await transaction.commit();
        } catch (error) {
            await transaction.rollback();
            const e = error as Error;
            console.error(`Error creating local order for user ${user.id}:`, e.message);
            throw ApiError.internal(`An error occurred while preparing the order: ${e.message}`);
        }

        // Step 3: If it's an online payment, create the PayU order.
        // This happens *after* the local order is successfully created.
        try {
            let redirectUri: string | undefined;
            if (orderData.paymentMethod !== 'cash' && orderData.paymentMethod !== 'cardOnDelivery') {
                // We need to reload the order with its details for the payment payload.
                const fullOrder = await Order.findByPk(order.id, {
                    include: [{
                        model: OrderDetail,
                        as: 'orderDetails',
                        include: [{ model: Device, attributes: ['id', 'name', 'img'] }]
                    }]
                });
                if (!fullOrder) throw ApiError.internal('Could not retrieve the order after creation.');

                const payuResponse = await paymentService.createPayUOrder(fullOrder, user, clientIp);
                redirectUri = payuResponse.redirectUri;

                // Save the external PayU order ID and update status
                fullOrder.extOrderId = payuResponse.orderId;
                fullOrder.status = 'pending'; // Now it's a real pending order
                await fullOrder.save();

                // Now that payment is initiated, clear the basket.
                await BasketDevice.destroy({ where: { basketId: basket.id } });

                return { order: fullOrder, redirectUri };
            } else {
                // For cash on delivery, the order is complete from our side.
                order.status = 'completed'; // Or 'processing' if you have a shipping step
                await order.save();
                
                // EN: Clear the basket after the order is successfully processed.
                // PL: Wyczyść koszyk po pomyślnym przetworzeniu zamówienia.
                await BasketDevice.destroy({ where: { basketId: basket.id } });

                // EN: Reload the order to include details, ensuring a consistent response structure.
                // PL: Załaduj ponownie zamówienie, aby dołączyć szczegóły, zapewniając spójną strukturę odpowiedzi.
                const fullOrder = await Order.findByPk(order.id, {
                    include: [{
                        model: OrderDetail,
                        as: 'orderDetails',
                        include: [{ model: Device, attributes: ['id', 'name', 'img'] }]
                    }]
                });
                if (!fullOrder) throw ApiError.internal('Could not retrieve the order after creation.');
                return { order: fullOrder };
            }
        } catch (error) {
            // If payment initiation fails, the user's basket is NOT cleared,
            // and the order remains in 'draft' status.
            // This allows them to try again later.
            const e = error as Error;
            console.error(`Error initiating payment for order ${order.id}:`, e.message);
            throw ApiError.internal(`Failed to initiate payment. Please try again. The order has been saved as a draft.`);
        }
    }
}

export default new OrderService();