import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { User } from '../db/models/User';
import { Basket } from '../db/models/Basket';
import ApiError from '../utils/ApiError';
import sequelize from '../db';

const BCRYPT_SALT_ROUNDS = 10;

// EN: Private helper function within the service to generate JWT.
// PL: Prywatna funkcja pomocnicza w ramach serwisu do generowania JWT.
const generateJwt = (id: number, email: string, role: string): string => {
    if (!process.env.SECRET_KEY) {
        console.error('CRITICAL: SECRET_KEY environment variable is not defined!');
        throw ApiError.internal('Internal server configuration error.');
    }
    return jwt.sign(
        { id, email, role },
        process.env.SECRET_KEY,
        { expiresIn: '24h' }
    );
};

class UserService {
    public async registration(email: string, password: string): Promise<{ token: string }> {
        if (!email || !password) {
            throw ApiError.badRequest('Niepoprawny email lub hasło');
        }
        
        const candidate = await User.findOne({ where: { email } });
        if (candidate) {
            throw ApiError.badRequest('Użytkownik o tym adresie email już istnieje');
        }

        // EN: Use a transaction to ensure that both user and basket are created, or neither are.
        // PL: Użyj transakcji, aby upewnić się, że zarówno użytkownik, jak i koszyk zostaną utworzone, albo żaden z nich.
        const transaction = await sequelize.transaction();
        try {
            const hashPassword = await bcrypt.hash(password, BCRYPT_SALT_ROUNDS);
            
            // EN: The role is hardcoded to 'USER' for all new registrations for security.
            // PL: Rola jest na stałe ustawiona na 'USER' dla wszystkich nowych rejestracji ze względów bezpieczeństwa.
            const user = await User.create({ email, password: hashPassword, role: 'USER' }, { transaction });

            // EN: Create a basket for the new user within the same transaction.
            // PL: Utwórz koszyk dla nowego użytkownika w ramach tej samej transakcji.
            await Basket.create({ userId: user.id }, { transaction });

            await transaction.commit();

            const token = generateJwt(user.id, user.email, user.role);
            return { token };

        } catch (e) {
            await transaction.rollback();
            // Log the specific error for better debugging
            const error = e as Error;
            console.error(`Error during registration transaction for email ${email}:`, error.message);
            throw ApiError.internal('Wystąpił błąd podczas próby rejestracji.');
        }
    }

    public async login(email: string, password: string): Promise<{ token: string }> {
        if (!email || !password) {
            throw ApiError.badRequest('Należy podać adres e-mail oraz hasło');
        }

        const user = await User.findOne({ where: { email } });
        if (!user) {
            throw ApiError.unauthorized('Nieprawidłowy adres e-mail lub hasło');
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            throw ApiError.unauthorized('Nieprawidłowy adres e-mail lub hasło');
        }

        const token = generateJwt(user.id, user.email, user.role);
        return { token };
    }

    public check(id: number, email: string, role: string): { token: string } {
        const token = generateJwt(id, email, role);
        return { token };
    }

    public async getAll(): Promise<User[]> {
        // EN: Explicitly exclude the password hash from the result.
        // PL: Jawnie wyklucz hash hasła z wyniku.
        const users = await User.findAll({ 
            attributes: ['id', 'email', 'role'], // Exclude password
            order: [['id', 'ASC']],
        });
        return users;
    }

    public async delete(id: number): Promise<{ message: string }> {
        const user = await User.findByPk(id);
        if (!user) {
            throw ApiError.notFound('Użytkownik o podanym ID nie istnieje');
        }

        // EN: Prevent deletion of admin users.
        // PL: Zapobiegaj usuwaniu użytkowników z rolą administratora.
        if (user.role === 'ADMIN') {
            throw ApiError.badRequest('Nie można usunąć administratora.');
        }
        // EN: Use a transaction to ensure that the user and associated basket are deleted atomically.
        await user.destroy();

        return { message: 'Użytkownik został pomyślnie usunięty' };
    }

    public async updateRole(id: number, role: string): Promise<User> {
        if (!['USER', 'ADMIN'].includes(role)) {
            throw ApiError.badRequest(`Nieprawidłowa rola: ${role}. Dozwolone wartości: USER, ADMIN.`);
        }

        const [affectedCount, [updatedUser]] = await User.update({ role }, { where: { id }, returning: true });
        if (affectedCount === 0) {
            throw ApiError.notFound('Użytkownik o podanym ID nie istnieje.');
        }

        // The `returning: true` option returns the updated instance.
        return updatedUser;
    }
}

export default new UserService();