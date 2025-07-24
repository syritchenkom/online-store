import { Request, Response, NextFunction } from 'express';
import userService from '../../../services/user.service';
import ApiError from '../../../utils/ApiError';

interface UpdateRoleRequestBody {
    role?: string;
}

class UserController {
    async getAll(req: Request, res: Response, next: NextFunction) {
        try {
            const users = await userService.getAll();
            return res.json(users);
        } catch (e) {
            next(e);
        }
    }

    async deleteOne(req: Request<{id: string}>, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            if (!id) {
                return next(ApiError.badRequest('Nie podano ID użytkownika.'));
            }
            const requestingUserId = req.user?.id;
            if (Number(id) === requestingUserId) {
                return next(ApiError.badRequest('Nie możesz usunąć własnego konta.'));
            }
            const result = await userService.delete(Number(id));
            return res.json(result);
        } catch (e) {
            next(e);
        }
    }

    async updateRole(req: Request<{ id: string }, {}, UpdateRoleRequestBody>, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const { role } = req.body;
            if (!role) {
                return next(ApiError.badRequest('Nie podano nowej roli.'));
            }
            const updatedUser = await userService.updateRole(Number(id), role);
            return res.json(updatedUser);
        } catch (e) {
            next(e);
        }
    }
}

export default new UserController();
