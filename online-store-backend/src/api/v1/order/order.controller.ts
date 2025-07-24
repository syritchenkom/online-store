import { Request, Response, NextFunction } from 'express';
import orderService from '../../../services/order.service';
import ApiError from '../../../utils/ApiError';
import { User } from '../../../db/models/User';

class OrderController {
    public async create(req: Request, res: Response, next: NextFunction) {
        try {
            if (!req.user || typeof req.user === 'string') {
                return next(ApiError.unauthorized());
            }
            const user = await User.findByPk(req.user.id);
            if (!user) {
                return next(ApiError.unauthorized('User not found'));
            }

            const { notes, firstName, lastName, paymentMethod } = req.body;

            if (!firstName || !paymentMethod) return next(ApiError.badRequest('Wymagane jest podanie imienia i metody płatności.'));
            
             // The req.ip can be undefined. We provide a fallback to satisfy the type requirement.
            // In a production environment behind a proxy, ensure 'trust proxy' is set in Express for accurate IP.
            const clientIp = req.ip ?? '127.0.0.1';

            const result = await orderService.createOrder(user, { notes, firstName, lastName, paymentMethod }, clientIp);
            return res.status(201).json(result);
        } catch (e) {
            next(e);
        }
    }
}

export default new OrderController();