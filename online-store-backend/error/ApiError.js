// EN: Define a custom error class that extends the built-in Error class.
// PL: Zdefiniuj własną klasę błędu, która rozszerza wbudowaną klasę Error.
class ApiError extends Error {
    // EN: The constructor initializes the error with an HTTP status code and a message.
    // PL: Konstruktor inicjalizuje błąd kodem statusu HTTP i wiadomością.
    constructor(status, message) {
        super(message); // EN: Call the parent Error class constructor with the message.
                        // PL: Wywołaj konstruktor nadrzędnej klasy Error z wiadomością.
        this.status = status; // EN: Store the HTTP status code (e.g., 400, 404, 500).
                              // PL: Zapisz kod statusu HTTP (np. 400, 404, 500).
        this.message = message; // EN: Store the error message.
                                // PL: Zapisz wiadomość błędu.
    }

    // EN: Static method for a 400 Bad Request error.
    // PL: Statyczna metoda dla błędu 400 Bad Request.
    static badRequest(message) {
        return new ApiError(400, message);
    }

    // EN: Static method for a 401 Unauthorized error (often used for authentication issues).
    // PL: Statyczna metoda dla błędu 401 Unauthorized (często używany dla problemów z uwierzytelnianiem).
    static unauthorized(message = 'Not authorized') {
        return new ApiError(401, message);
    }

    // EN: Static method for a 403 Forbidden error (often used for authorization issues).
    // PL: Statyczna metoda dla błędu 403 Forbidden (często używany dla problemów z autoryzacją).
    static forbidden(message) {
        return new ApiError(403, message);
    }

    // EN: Static method for a 404 Not Found error.
    // PL: Statyczna metoda dla błędu 404 Not Found.
    static notFound(message) {
        return new ApiError(404, message);
    }

    // EN: Static method for a 500 Internal Server Error.
    // PL: Statyczna metoda dla błędu 500 Internal Server Error.
    static internal(message = 'Internal server error') {
        return new ApiError(500, message);
    }
}

module.exports = ApiError;