import { Brand } from '../db/models/Brand';
import ApiError from '../utils/ApiError';

class BrandService {
    public async create(name: string): Promise<Brand> {
        if (!name || name.trim() === '') {
            throw ApiError.badRequest('Brand name not specified');
        }
        try {
            const brand = await Brand.create({ name });
            return brand;
        } catch (error: any) {
            if (error.name === 'SequelizeUniqueConstraintError') {
                throw ApiError.badRequest(`Brand with name "${name}" already exists.`);
            }
            // Re-throw other errors to be caught by the controller
            throw error;
        }
    }

    public async getAll(): Promise<Brand[]> {
        const brands = await Brand.findAll({ order: [['name', 'ASC']] });
        return brands;
    }

    public async delete(id: number): Promise<{ message: string }> {
        const result = await Brand.destroy({ where: { id } });
        if (result === 0) {
            throw ApiError.notFound(`Brand with id ${id} not found`);
        }
        return { message: 'Brand deleted successfully' };
    }

    public async update(id: number, name: string): Promise<Brand> {
        if (!name) {
            throw ApiError.badRequest('New brand name not specified');
        }
        try {
            const [numberOfAffectedRows, updatedBrands] = await Brand.update(
                { name },
                { where: { id }, returning: true }
            );

            if (numberOfAffectedRows === 0) {
                throw ApiError.notFound(`Brand with id ${id} not found`);
            }
            return updatedBrands[0];
        } catch (error: any) {
            if (error.name === 'SequelizeUniqueConstraintError') {
                throw ApiError.badRequest(`Brand with name "${name}" already exists.`);
            }
            throw error;
        }
    }
}

export default new BrandService();