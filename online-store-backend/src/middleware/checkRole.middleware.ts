import { Request, Response, NextFunction, RequestHandler } from 'express';
import ApiError from '../utils/ApiError';

// EN: This function returns a middleware. It takes 'role' as an argument,
// PL: Ta funkcja zwraca middleware. Przyjmuje 'role' jako argument,
// EN: which is the minimum required role to access the route.
// PL: który jest minimalną wymaganą rolą do dostępu do routingu.
export default function checkRoleMiddleware(role: string): RequestHandler {
    return function (req: Request, res: Response, next: NextFunction) {
        // EN: OPTIONS method requests do not require role checking.
        // PL: Żądania metodą OPTIONS nie wymagają sprawdzania ról.
        if (req.method === 'OPTIONS') {
            return next();
        }
        try {
            // EN: The user data (including role) should have been attached by auth.middleware.
            // PL: Dane użytkownika (w tym rola) powinny być dołączone przez auth.middleware.
            if (!req.user || typeof req.user === 'string' || !req.user.role) {
                console.error('checkRoleMiddleware: req.user or req.user.role is missing/undefined. req.user:', req.user);
                // Using a more appropriate 403 Forbidden status here
                return next(ApiError.forbidden('User data or role is missing.'));
            }

            // EN: Check if the user's role matches the required role.
            // PL: Sprawdź, czy rola użytkownika odpowiada wymaganej roli.
            if (req.user.role !== role) {
                // EN: If the role does not match, return a Forbidden error.
                // PL: Jeśli rola nie pasuje, zwróć błąd Forbidden.
                return next(ApiError.forbidden('Access denied: Insufficient permissions.'));
            }

            next(); // EN: Proceed to the next middleware or route handler.
                    // PL: Przejdź do następnego middleware lub handlera routingu.
        } catch (e) {
            // EN: Catch any unexpected errors during role checking.
            // PL: Wyłap wszelkie nieoczekiwane błędy podczas sprawdzania ról.
            return next(ApiError.forbidden('Access denied due to an error during role check.'));
        }
    };
}