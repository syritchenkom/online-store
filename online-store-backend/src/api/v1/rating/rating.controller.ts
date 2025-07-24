import { Request, Response, NextFunction } from 'express';
import ratingService from '../../../services/rating.service';
import ApiError from '../../../utils/ApiError';

interface SetRatingBody {
    deviceId?: number;
    rate?: number;
}

class RatingController {    
    async setRating(req: Request, res: Response, next: NextFunction) {
        try {
            const { deviceId, rate } = req.body as SetRatingBody;
            if (!req.user || typeof req.user === 'string') return next(ApiError.unauthorized());
            const userId = req.user.id;

            // EN: Add validation in the controller before calling the service.
            // PL: Dodaj walidację w kontrolerze przed wywołaniem serwisu.
            if (deviceId === undefined || rate === undefined) {
                return next(ApiError.badRequest('Nie podano ID urządzenia lub oceny'));
            }

            const result = await ratingService.setRating(userId, deviceId, rate);
            return res.json(result);
        } catch (e) {
            next(e);
        }
    }

    async getDeviceRatings(req: Request<{ deviceId: string }>, res: Response, next: NextFunction) {
        try {
            const { deviceId } = req.params;
            if (!deviceId) {
                return next(ApiError.badRequest('Nie podano ID urządzenia'));
            }
            const ratings = await ratingService.getDeviceRatings(Number(deviceId));
            return res.json(ratings);
        } catch (e) {
            next(e);
        }
    }
}

export default new RatingController();
