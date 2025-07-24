import { Request, Response, NextFunction } from 'express';
import typeService from '../../../services/type.service';
import ApiError from '../../../utils/ApiError';

class TypeController {
    async create(req: Request, res: Response, next: NextFunction) {
        try {
            const { name } = req.body;
            const newType = await typeService.create(name);
            return res.json(newType);
        } catch (e) {
            next(e); // Pass error to the central error handler
        }
    }

    async getAll(req: Request, res: Response, next: NextFunction) {
        try {
            const types = await typeService.getAll();
            return res.json(types);
        } catch (e) {
            next(e);
        }
    }

    async delete(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            if (!id || isNaN(Number(id))) {
                // Added a check to ensure id is a number
                return next(ApiError.badRequest('Nie podano poprawnego ID typu do usunięcia'));
            }
            const result = await typeService.delete(Number(id));
            return res.json(result);
        } catch (e) {
            next(e);
        }
    }
}

export default new TypeController();
