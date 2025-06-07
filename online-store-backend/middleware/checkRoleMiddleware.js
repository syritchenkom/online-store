// EN: Import the custom ApiError class for consistent error handling.
// PL: Importuj niestandardową klasę ApiError dla spójnej obsługi błędów.
const ApiError = require('../error/ApiError');

// EN: This function returns a middleware. It takes 'role' as an argument,
// PL: Ta funkcja zwraca middleware. Przyjmuje 'role' jako argument,
// EN: which is the minimum required role to access the route.
// PL: który jest minimalną wymaganą rolą do dostępu do routingu.
module.exports = function (role) {
    return function (req, res, next) {
        // EN: OPTIONS method requests do not require role checking.
        // PL: Żądania metodą OPTIONS nie wymagają sprawdzania ról.
        if (req.method === 'OPTIONS') {
            next();
        }
        try {
            // EN: The user data should have been attached by the authMiddleware (req.user).
            // PL: Dane użytkownika powinny być dołączone przez authMiddleware (req.user).
            // EN: If req.user is not present, it means authMiddleware didn't run or failed.
            // PL: Jeśli req.user nie jest obecne, oznacza to, że authMiddleware nie zadziałało lub zawiodło.
            if (!req.user || !req.user.role) {
                // EN: Log the state of req.user for debugging
                // PL: Zaloguj stan req.user do debugowania
                console.error('checkRoleMiddleware: req.user or req.user.role is missing/undefined. req.user:', req.user);
                return next(ApiError.unauthorized('Brak danych użytkownika lub zdefiniowanej roli.'));
            }

            // EN: Check if the user's role matches the required role.
            // PL: Sprawdź, czy rola użytkownika odpowiada wymaganej roli.
            if (req.user.role !== role) {
                // EN: If the role does not match, return a Forbidden error.
                // PL: Jeśli rola nie pasuje, zwróć błąd Forbidden.
                console.warn(`checkRoleMiddleware: Role mismatch. Expected: ${role}, Got: ${req.user.role}, UserID: ${req.user.id}`);
                return next(ApiError.forbidden('Odmowa dostępu: Niewystarczające uprawnienia.'));
            }
            next(); // EN: Proceed to the next middleware or route handler.
                    // PL: Przejdź do następnego middleware lub handlera routingu.
        } catch (e) {
            // EN: Catch any unexpected errors during role checking.
            // PL: Wyłap wszelkie nieoczekiwane błędy podczas sprawdzania ról.
            console.error("Błąd w checkRoleMiddleware:", e);
            return next(ApiError.forbidden('Odmowa dostępu z powodu błędu podczas sprawdzania roli.'));
        }
    };
};