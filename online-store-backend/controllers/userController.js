const ApiError = require('../error/ApiError')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { User, Basket } = require('../models/models')

const BCRYPT_SALT_ROUNDS = 10; // EN: Recommended salt rounds for bcrypt. // PL: Zalecana liczba rund dla bcrypt.

// EN: Function to generate JWT
// PL: Funkcja do generowania JWT
const generateJwt = (id, email, role) => {

    console.log('Generating JWT with role:', role);
    // EN: Never include password or its hash in the token payload for security reasons.
    // PL: Ze względów bezpieczeństwa nigdy nie dołączaj hasła ani jego skrótu do ładunku tokena.

    return jwt.sign(
        { id, email, role },
        process.env.SECRET_KEY,
        { expiresIn: '24h' }
    );
}

class UserController {
    async registration(req, res, next) {
        try {
            const { email, password, role } = req.body; // EN: `role` can be undefined if not sent by the client. // PL: `role` może być niezdefiniowane, jeśli nie zostało wysłane przez klienta.
    
            if (!email || !password) {
                return next(ApiError.badRequest('Niepoprawny email lub hasło'))
            }
            const candidate = await User.findOne({ where: { email } })
            if (candidate) {
                return next(ApiError.badRequest('Użytkownik o tym adresie email już istnieje'))
            }

            if (!process.env.SECRET_KEY) {
                // EN: Log critical error if SECRET_KEY is missing and return a generic internal server error.
                // PL: Zaloguj błąd krytyczny, jeśli brakuje SECRET_KEY i zwróć ogólny wewnętrzny błąd serwera.
                console.error('KRYTYCZNE: Zmienna SECRET_KEY nie jest zdefiniowana w zmiennych środowiskowych!');
                return next(ApiError.internal('Wewnętrzny błąd serwera. Proszę spróbować później.'));
            }

            // EN: Hash the password using bcrypt with a recommended number of salt rounds.
            // PL: Zahaszuj hasło używając bcrypt z zalecaną liczbą rund soli.
            const hashPassword = await bcrypt.hash(password, BCRYPT_SALT_ROUNDS)
            const user = await User.create({ email, role, password: hashPassword });

            // EN: Check if user creation was successful and if the user object has an ID.
            // PL: Sprawdź, czy tworzenie użytkownika powiodło się i czy obiekt użytkownika ma ID.
            if (!user || !user.id) {
                console.error('Tworzenie użytkownika nie powiodło się lub nie zwrócono ID.');
                return next(ApiError.internal('Nie udało się utworzyć użytkownika.'));
            }
            // EN: Create a basket for the new user. Consider if this is a critical step, if so, database transactions might be needed for atomicity.
            // PL: Utwórz koszyk dla nowego użytkownika. Rozważ, czy jest to krok krytyczny, jeśli tak, transakcje bazodanowe mogą być potrzebne dla zapewnienia atomowości.
            const basket = await Basket.create({ userId: user.id });
            // EN: If basket creation fails, log a warning. Decide if this should be a critical error.
            // PL: Jeśli tworzenie koszyka nie powiedzie się, zaloguj ostrzeżenie. Zdecyduj, czy powinien to być błąd krytyczny.
            if (!basket) {
                console.warn(`Koszyk dla użytkownika ${user.id} nie został utworzony.`);
            }
            // EN: Generate JWT token for the newly registered user.
            // PL: Wygeneruj token JWT dla nowo zarejestrowanego użytkownika.
            const token = generateJwt(user.id, user.email, user.role);

            return res.json({ token })
        } catch (e) {
            // EN: Logging the error on the server for diagnostics.
            // PL: Logowanie błędu na serwerze w celach diagnostycznych.
            console.error('Błąd podczas rejestracji:', e);
            // EN: Pass the error to the centralized Express error handler.
            // PL: Przekaż błąd do scentralizowanego mechanizmu obsługi błędów Express.
            // EN: You can pass a specific ApiError or the original error:
            // PL: Możesz przekazać konkretny ApiError lub oryginalny błąd:
            // return next(ApiError.internal('Wystąpił błąd podczas próby rejestracji.'));
            // EN: Recommended if your error handler can handle different types of errors.
            // PL: Zalecane, jeśli Twój mechanizm obsługi błędów potrafi obsługiwać różne typy błędów.
            return next(e);
        }
    }

    async login(req, res, next) {
        try {
            const { email, password } = req.body;
            if (!email || !password) {
                // PL: Należy podać email oraz hasło
                return next(ApiError.badRequest('Należy podać adres e-mail oraz hasło'));
            }

            const user = await User.findOne({ where: { email } });
            if (!user) {
                // EN: For security, it's better not to specify what is wrong (email or password).
                // PL: Ze względów bezpieczeństwa lepiej nie precyzować, co jest nie tak (e-mail czy hasło).
                return next(ApiError.unauthorized('Nieprawidłowy adres e-mail lub hasło'));
            }

            const isPasswordCorrect = await bcrypt.compare(password, user.password);
            if (!isPasswordCorrect) {
                // PL: Nieprawidłowy email lub hasło
                return next(ApiError.unauthorized('Nieprawidłowy adres e-mail lub hasło'));
            }

            if (!process.env.SECRET_KEY) {
                console.error('KRYTYCZNE: Zmienna SECRET_KEY nie jest zdefiniowana w zmiennych środowiskowych podczas logowania!');
                return next(ApiError.internal('Wewnętrzny błąd serwera.')); // PL: Wewnętrzny błąd serwera.
            }

            const token = generateJwt(user.id, user.email, user.role);
            return res.json({ token });
        } catch (e) {
            console.error('Błąd logowania:', e);
            next(ApiError.internal('Wystąpił błąd podczas próby logowania.'));
            // PL: Wystąpił błąd podczas próby logowania.
        }
    }

    async check(req, res, next) {
        // EN: Assumes auth middleware adds `req.user`. Generates a new token.
        // PL: Zakłada, że oprogramowanie pośredniczące do uwierzytelniania dodaje `req.user`. Generuje nowy token.
        // EN: This typically happens after an authentication middleware has verified the user.
        const token = generateJwt(req.user.id, req.user.email, req.user.role);
        return res.json({token})
    }

    async deleteUser(req, res, next) {
        try {
            const { id } = req.params; // EN: Get user ID from request parameters. PL: Pobierz ID użytkownika z parametrów żądania.
            if (!id) {
                return next(ApiError.badRequest('Nie podano ID użytkownika do usunięcia')); // PL: Nie podano ID użytkownika do usunięcia
            }

            const user = await User.findByPk(id);
            if (!user) {
                return next(ApiError.notFound('Użytkownik o podanym ID nie istnieje')); // PL: Użytkownik o podanym ID nie istnieje
            }

            await user.destroy(); // EN: Delete the user from the database. PL: Usuń użytkownika z bazy danych.
            return res.json({ message: 'Użytkownik został pomyślnie usunięty' }); // PL: Użytkownik został pomyślnie usunięty
        } catch (error) {
            console.error('Błąd podczas usuwania użytkownika:', error);
            next(ApiError.internal('Wystąpił błąd podczas próby usunięcia użytkownika')); // PL: Wystąpił błąd podczas próby usunięcia użytkownika
        }
    }
}

module.exports = new UserController()
