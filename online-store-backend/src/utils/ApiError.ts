// EN: Define a custom error class that extends the built-in Error class.
// PL: Zdefiniuj własną klasę błędu, która rozszerza wbudowaną klasę Error.
class ApiError extends Error {
    // EN: Public property to store the HTTP status code.
    // PL: Publiczna właściwość do przechowywania kodu statusu HTTP.
    public status: number;

    // EN: The constructor initializes the error with an HTTP status code and a message.
    // PL: Konstruktor inicjalizuje błąd kodem statusu HTTP i wiadomością.
    constructor(status: number, message: string) {
        super(message); // EN: Call the parent Error class constructor with the message.
                        // PL: Wywołaj konstruktor nadrzędnej klasy Error z wiadomością.
        this.status = status;
    }

    // EN: Static method for a 400 Bad Request error.
    // PL: Statyczna metoda dla błędu 400 Bad Request.
    static badRequest(message: string): ApiError {
        return new ApiError(400, message);
    }

    // EN: Static method for a 401 Unauthorized error.
    // PL: Statyczna metoda dla błędu 401 Unauthorized.
    static unauthorized(message: string = 'Not authorized'): ApiError {
        return new ApiError(401, message);
    }

    // EN: Static method for a 403 Forbidden error.
    // PL: Statyczna metoda dla błędu 403 Forbidden.
    static forbidden(message: string): ApiError {
        return new ApiError(403, message);
    }

    // EN: Static method for a 404 Not Found error.
    // PL: Statyczna metoda dla błędu 404 Not Found.
    static notFound(message: string): ApiError {
        return new ApiError(404, message);
    }

    // EN: Static method for a 500 Internal Server Error.
    // PL: Statyczna metoda dla błędu 500 Internal Server Error.
    static internal(message: string = 'Internal server error'): ApiError {
        return new ApiError(500, message);
    }
}

export default ApiError;