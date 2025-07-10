const {Type} = require('../models/models')
const ApiError = require('../error/ApiError')

class TypeController {
    async create(req, res, next) {
      try {
        const { name } = req.body;
        if (!name || name.trim() === '') {
          return next(ApiError.badRequest('Nazwa typu nie może być pusta'));
        }
        const type = await Type.create({ name });
        return res.json(type);
      } catch (e) {
        if (e.name === 'SequelizeUniqueConstraintError') {
          return next(ApiError.badRequest(`Typ o nazwie "${req.body.name}" już istnieje.`));
        }
        next(ApiError.internal('Wystąpił błąd podczas tworzenia typu'));
      }
    }
    
    async getAll(req, res, next) {
        try {
            const types = await Type.findAll({
                order: [['name', 'ASC']] // Sortowanie typów alfabetycznie
            });
            return res.json(types);
        } catch (e) {
            next(ApiError.internal('Wystąpił błąd podczas pobierania listy typów'));
        }
    }

    async delete(req, res, next) {
        try {
            const { id } = req.params;
            if (!id) {
                return next(ApiError.badRequest('Nie podano ID typu do usunięcia'));
            }
            const type = await Type.findByPk(id);
            if (!type) {
                return next(ApiError.notFound('Typ o podanym ID nie został znaleziony'));
            }
            await type.destroy();
            return res.json({ message: 'Typ został pomyślnie usunięty' });
        } catch (e) {
            next(ApiError.internal('Wystąpił błąd podczas usuwania typu'));
        }
    }
}

module.exports = new TypeController()
