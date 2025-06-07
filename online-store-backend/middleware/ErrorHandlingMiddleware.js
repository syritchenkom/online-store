const  ApiError = require('../error/ApiError')

// module.exports = function (err, req, res, next) {
//     if (err instanceof ApiError) {
//         return res.status(err.status).json({message: err.message})
//     }
//     // return res.status(500).json({message: 'Unexpected error'})
//     return next(ApiError.internal(err.message))

// }

// EN: Error handling middleware function.
// PL: Funkcja middleware do obsługi błędów.
// This middleware should be placed at the very end of your Express application's middleware chain.
// To middleware powinno być umieszczone na samym końcu łańcucha middleware w aplikacji Express.
module.exports = function (err, req, res, next) {
    // EN: Log the full error details to the server console for debugging purposes.
    // PL: Loguj pełne szczegóły błędu do konsoli serwera w celach debugowania.
    console.error(err);

    // EN: Check if the error is an instance of our custom ApiError.
    // PL: Sprawdź, czy błąd jest instancją naszego niestandardowego ApiError.
    if (err instanceof ApiError) {
        // EN: If it's an ApiError, send back the specific status and message defined in the error.
        // PL: Jeśli jest to ApiError, odeślij z powrotem konkretny status i wiadomość zdefiniowane w błędzie.
        return res.status(err.status).json({ message: err.message });
    }

    // EN: Handle any other unexpected errors (e.g., internal server errors, database errors).
    // PL: Obsłuż inne nieoczekiwane błędy (np. wewnętrzne błędy serwera, błędy bazy danych).
    // EN: In production mode, we want to hide sensitive error details from the client.
    // PL: W trybie produkcyjnym chcemy ukryć wrażliwe szczegóły błędu przed klientem.
    if (process.env.NODE_ENV === 'production') {
        // EN: For production, return a generic "Internal server error" message.
        // PL: Dla produkcji, zwróć ogólną wiadomość "Wewnętrzny błąd serwera".
        return res.status(500).json({ message: 'Internal server error' });
    } else {
        // EN: In development mode, return the original error message for easier debugging.
        // PL: W trybie deweloperskim, zwróć oryginalną wiadomość błędu dla łatwiejszego debugowania.
        // EN: Use 'Unknown server error' as a fallback if err.message is undefined.
        // PL: Użyj 'Unknown server error' jako wartości zastępczej, jeśli err.message jest niezdefiniowane.
        return res.status(500).json({ message: err.message || 'Unknown server error' });
    }
};