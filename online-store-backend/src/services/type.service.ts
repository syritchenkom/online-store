import { InferCreationAttributes } from 'sequelize';
import { Type } from '../db/models/Type';
import ApiError from '../utils/ApiError';

// EN: The IType interface is no longer needed. The `Type` class is the type!
// PL: Interfejs IType nie jest już potrzebny. Klasa `Type` jest teraz typem!

class TypeService {
    public async create(name: string): Promise<Type> {
        if (!name || name.trim() === '') {
            throw ApiError.badRequest('Nazwa typu nie może być pusta');
        }
        try {
            const type = await Type.create({ name });
            return type;
        } catch (e: any) {
            if (e.name === 'SequelizeUniqueConstraintError') {
                throw ApiError.badRequest(`Typ o nazwie "${name}" już istnieje.`);
            }
            // Re-throw other errors to be caught by the controller
            throw e;
        }
    }

    public async getAll(): Promise<Type[]> {
        const types = await Type.findAll({ order: [['name', 'ASC']] });
        return types;
    }

    public async delete(id: number): Promise<{ message: string }> {
        const type = await Type.findByPk(id);
        if (!type) {
            throw ApiError.notFound('Typ o podanym ID nie został znaleziony');
        }
        await type.destroy();
        return { message: 'Typ został pomyślnie usunięty' };
    }
}

export default new TypeService();