const { Rating, Device, User } = require('../models/models');
const ApiError = require('../error/ApiError');
const sequelize = require('../db');

class RatingController {
    async setRating(req, res, next) {
        // EN: We use a transaction to ensure that all operations are either successful or none are.
        // PL: Używamy transakcji, aby zagwarantować, że wszystkie operacje zakończą się sukcesem, albo żadna z nich nie zostanie wykonana.
        const t = await sequelize.transaction();
        try {
            const { deviceId, rate } = req.body;
            // EN: We take the user ID from the token (provided by authMiddleware).
            // PL: Pobieramy ID użytkownika z tokena (dostarczonego przez authMiddleware).
            const userId = req.user.id;

            if (!rate || !deviceId) {
                await t.rollback();
                return next(ApiError.badRequest('Nie podano ID urządzenia lub oceny'));
            }

            if (rate < 1 || rate > 5) {
                await t.rollback();
                return next(ApiError.badRequest('Ocena musi być liczbą od 1 do 5'));
            }

            // EN: Create or update the rating for this user and device within the transaction.
            // PL: Tworzymy lub aktualizujemy ocenę dla tego użytkownika i urządzenia w ramach transakcji.
            await Rating.upsert({
                userId,
                deviceId,
                rate
            }, { transaction: t });

            // EN: Recalculate the average rating for the device.
            // PL: Przeliczamy średnią ocenę dla urządzenia.
            const averageResult = await Rating.findOne({
                where: { deviceId },
                attributes: [[sequelize.fn('AVG', sequelize.col('rate')), 'avgRating']],
                transaction: t,
                raw: true
            });

            // EN: Calculate the raw average and then round it to one decimal place.
            // PL: Oblicz surową średnią, a następnie zaokrąglij ją do jednego miejsca po przecinku.
            const rawAvg = averageResult.avgRating ? parseFloat(averageResult.avgRating) : 0;
            const newAverageRating = Math.round(rawAvg * 10) / 10;

            // EN: Update the rating field in the Device model.
            // PL: Aktualizujemy pole oceny w modelu Device.
            await Device.update({ rating: newAverageRating }, { where: { id: deviceId }, transaction: t });

            // EN: Commit the transaction, applying all changes.
            // PL: Zatwierdzamy transakcję, stosując wszystkie zmiany.
            await t.commit();

            return res.json({ message: 'Ocena została zapisana.', newRating: newAverageRating });
        } catch (e) {
            // EN: Rollback all changes in case of an error.
            // PL: Wycofujemy wszystkie zmiany w przypadku błędu.
            await t.rollback();
            console.error('Błąd podczas ustawiania oceny:', e);
            if (e.name === 'SequelizeForeignKeyConstraintError') {
                 return next(ApiError.badRequest('Nieprawidłowe ID urządzenia lub użytkownika'));
            }
            next(ApiError.internal('Wystąpił błąd podczas ustawiania oceny'));
        }
    }

    async getDeviceRatings(req, res, next) {
        try {
            const { deviceId } = req.params;
            if (!deviceId) {
                return next(ApiError.badRequest('Nie podano ID urządzenia'));
            }

            const ratings = await Rating.findAll({
                where: { deviceId },
                include: [{ model: User, attributes: ['id', 'email'] }],
                attributes: ['id', 'rate', 'createdAt']
            });

            return res.json(ratings);

        } catch (e) {
            console.error('Błąd podczas pobierania ocen urządzenia:', e);
            next(ApiError.internal('Wystąpił błąd podczas pobierania ocen urządzenia'));
        }
    }
}

module.exports = new RatingController();
