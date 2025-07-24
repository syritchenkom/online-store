import { Request, Response, NextFunction } from 'express';
import userService from '../../../services/user.service';
import ApiError from '../../../utils/ApiError';

// EN: Interfaces for request bodies to ensure type safety.
// PL: Interfejsy dla ciał żądań w celu zapewnienia bezpieczeństwa typów.
interface RegistrationRequestBody {
    email?: string;
    password?: string;
}

interface LoginRequestBody {
    email?: string;
    password?: string;
}

class AuthController {
    async registration(req: Request<{}, {}, RegistrationRequestBody>, res: Response, next: NextFunction) {
        try {
            const { email, password } = req.body;
            if (!email || !password) {
                return next(ApiError.badRequest('Niepoprawny email lub hasło'));
            }
            const userData = await userService.registration(email, password);
            return res.json(userData);
        } catch (e) {
            next(e);
        }
    }

    async login(req: Request<{}, {}, LoginRequestBody>, res: Response, next: NextFunction) {
        try {
            const { email, password } = req.body;
            if (!email || !password) {
                return next(ApiError.badRequest('Należy podać adres e-mail oraz hasło'));
            }
            const userData = await userService.login(email, password);
            return res.json(userData);
        } catch (e) {
            next(e);
        }
    }

    async check(req: Request, res: Response, next: NextFunction) {
        if (!req.user || typeof req.user === 'string') {
            return next(ApiError.unauthorized());
        }
        const token = await userService.check(req.user.id, req.user.email, req.user.role);
        return res.json(token);
    }
}

export default new AuthController();