const {Brand} = require('../models/models');
const ApiError = require('../error/ApiError');


class BrandController {
    async create(req, res, next) {
        try {
            const { name } = req.body;
            if (!name) {
                return next(ApiError.badRequest('Brand name not specified'));
            }
            const brand = await Brand.create({ name });
            return res.json(brand);
        } catch (error) {
            if (error.name === 'SequelizeUniqueConstraintError') {
                return next(ApiError.badRequest(error.errors[0].message));
            }
            next(ApiError.internal(error.message));
        }
    }
    async getAll(req, res, next) {
        try {
            const brands = await Brand.findAll();
            return res.json(brands);
        } catch (error) {
            next(ApiError.internal(error.message));
        }

    }
    // async login(req, res) {
    //     // Here you would typically check the credentials against the database
    //     // For now, let's just return a success message
    //     return res.json({ message: 'User logged in successfully', email });
    // }
    async delete(req, res, next) {
        try {
            const { id } = req.params;
            const result = await Brand.destroy({ where: { id } });
            if(result === 0) {
                return next(ApiError.badRequest(`Brand with id ${id}} not found`));
            }
            return res.json({ message: 'Brand deleted successfully' });
        } catch (error) {
            next(ApiError.internal(error.message));
        }
    
    }
}

module.exports = new BrandController()
