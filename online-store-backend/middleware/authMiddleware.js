// EN: Import the custom ApiError class for consistent error handling.
// PL: Importuj niestandardową klasę ApiError dla spójnej obsługi błędów.
const ApiError = require('../error/ApiError');
// EN: Import jsonwebtoken for token verification. Make sure you have it installed: npm i jsonwebtoken
// PL: Importuj jsonwebtoken do weryfikacji tokenów. Upewnij się, że masz go zainstalowany: npm i jsonwebtoken
const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
    // EN: Log entry into the middleware with method and path
    // PL: Zaloguj wejście do middleware z metodą i ścieżką
    console.log(`[AUTH_MIDDLEWARE_ENTRY] Method: ${req.method}, Pat h: ${req.path}, Headers: ${JSON.stringify(req.headers.authorization)}`);

    // EN: OPTIONS method requests do not require token authentication (pre-flight checks).
    // PL: Żądania metodą OPTIONS nie wymagają uwierzytelniania tokenem (sprawdzenia pre-flight).
    if (req.method === 'OPTIONS') {
        console.log('[AUTH_MIDDLEWARE_OPTIONS_PATH]');
        next();
        return; // EN: Explicitly return to prevent further execution for OPTIONS requests // PL: Jawnie zwróć, aby zapobiec dalszemu wykonywaniu dla żądań OPTIONS
    }

    try {
        // EN: Extract the token from the Authorization header. It's usually in the format "Bearer TOKEN".
        // PL: Wyodrębnij token z nagłówka Authorization. Zazwyczaj jest w formacie "Bearer TOKEN".
        const authorizationHeader = req.headers.authorization;
        if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
            console.log('[AUTH_MIDDLEWARE_ERROR] Invalid or missing Authorization header');
            // EN: If Authorization header is missing or not in Bearer format, return an Unauthorized error.
            // PL: Jeśli nagłówek Authorization отсутствует lub nie jest w formacie Bearer, zwróć błąd Unauthorized.
            return next(ApiError.unauthorized('Użytkownik nie jest autoryzowany (nieprawidłowy format nagłówka Authorization)'));
        }
        const token = authorizationHeader.split(' ')[1]; // Bearer TOKEN
        
        // EN: If no token is provided, return an Unauthorized error.
        // PL: Jeśli token nie jest dostarczony, zwróć błąd Unauthorized.
        if (!token) {
            console.log('[AUTH_MIDDLEWARE_ERROR] Token not found after split');
            return next(ApiError.unauthorized('Użytkownik nie jest autoryzowany (brak tokena).'));
        }
        console.log('[AUTH_MIDDLEWARE_TOKEN_EXTRACTED]', token ? 'Token present' : 'Token missing/empty');

        // EN: Verify the token using your secret key.
        // PL: Zweryfikuj token używając swojego tajnego klucza.
        // EN: Replace process.env.SECRET_KEY with your actual secret key.
        // PL: Zastąp process.env.SECRET_KEY swoim rzeczywistym tajnym kluczem.
        console.log('[AUTH_MIDDLEWARE_BEFORE_VERIFY] Verifying token...');
        const decoded = jwt.verify(token, process.env.SECRET_KEY);

        // EN: Log the decoded token to ensure it contains the role
        // PL: Zaloguj zdekodowany token, aby upewnić się, że zawiera rolę
        console.log('[AUTH_MIDDLEWARE_DECODED_JWT]', decoded);

        // EN: Crucial check: ensure the decoded object has the 'role' property.
        // PL: Kluczowa weryfikacja: upewnij się, że zdekodowany obiekt ma właściwość 'role'.
        if (!decoded || typeof decoded.role === 'undefined') {
            console.error('[AUTH_MIDDLEWARE_ERROR] Decoded token missing "role" or invalid. Decoded:', decoded);
            return next(ApiError.unauthorized('Użytkownik nie jest autoryzowany (niekompletne dane w tokenie).'));
        }

        // EN: Attach the decoded user data (e.g., user ID, email, role) to the request object.
        // PL: Dołącz zdekodowane dane użytkownika (np. ID użytkownika, email, rolę) do obiektu żądania.
        // EN: This makes user data accessible in subsequent middleware or route handlers.
        // PL: To sprawia, że dane użytkownika są dostępne w kolejnych middleware lub handlerach routingu.
        req.user = decoded;
        console.log('[AUTH_MIDDLEWARE_REQ_USER_SET]', req.user);
        next(); // EN: Proceed to the next middleware or route handler.
                // PL: Przejdź do następnego middleware lub handlera routingu.
        console.log('[AUTH_MIDDLEWARE_AFTER_NEXT_SUCCESS]');
    } catch (e) {
        // EN: Log error name along with message for better diagnostics
        // PL: Zaloguj nazwę błędu wraz z wiadomością dla lepszej diagnostyki
        console.error("[AUTH_MIDDLEWARE_CATCH_BLOCK] Błąd w authMiddleware:", e.message, "Name:", e.name);
        // EN: Catch any errors during token processing (e.g., invalid token, expired token).
        // PL: Wyłap wszelkie błędy podczas przetwarzania tokena (np. nieprawidłowy token, wygasły token).
        if (e.name === 'JsonWebTokenError') {
            return next(ApiError.unauthorized('Użytkownik nie jest autoryzowany (nieprawidłowy token).'));
        }
        if (e.name === 'TokenExpiredError') {
            return next(ApiError.unauthorized('Użytkownik nie jest autoryzowany (token wygasł).'));
        }
        return next(ApiError.unauthorized('Użytkownik nie jest autoryzowany (błąd przetwarzania tokena).'));
    }
};