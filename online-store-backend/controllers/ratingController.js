const { Rating, Device, User } = require('../models/models');
const ApiError = require('../error/ApiError');
const sequelize = require('../db'); // EN: For calculating average rating // PL: Do obliczania średniej oceny

class RatingController {
    async setRating(req, res, next) {
        try {
            const { deviceId, rate } = req.body;
            const userId = req.user.id; // EN: Assuming authMiddleware provides req.user // PL: Zakładając, że authMiddleware dostarcza req.user

            if (!deviceId || rate === undefined) {
                return next(ApiError.badRequest('Nie podano ID urządzenia lub oceny'));
            }

            if (rate < 1 || rate > 5) { // EN: Assuming a 1-5 rating scale // PL: Zakładając skalę ocen 1-5
                return next(ApiError.badRequest('Ocena musi być liczbą od 1 do 5'));
            }

            // EN: Check if device exists
            // PL: Sprawdź, czy urządzenie istnieje
            const device = await Device.findByPk(deviceId);
            if (!device) {
                return next(ApiError.notFound('Urządzenie nie zostało znalezione'));
            }

            // EN: Check if user has already rated this device, if so, update it. Otherwise, create it.
            // PL: Sprawdź, czy użytkownik już ocenił to urządzenie, jeśli tak, zaktualizuj. W przeciwnym razie utwórz.
            let rating = await Rating.findOne({ where: { userId, deviceId } });

            if (rating) {
                rating.rate = rate;
                await rating.save();
            } else {
                rating = await Rating.create({ userId, deviceId, rate });
            }

            // EN: After setting/updating a rating, recalculate the device's average rating
            // PL: Po ustawieniu/aktualizacji oceny, przelicz średnią ocenę urządzenia
            const averageRatingResult = await Rating.findOne({
                where: { deviceId },
                attributes: [[sequelize.fn('AVG', sequelize.col('rate')), 'averageRating']]
            });

            let averageRating = 0;
            if (averageRatingResult && averageRatingResult.dataValues.averageRating !== null) {
                averageRating = parseFloat(parseFloat(averageRatingResult.dataValues.averageRating).toFixed(1));
            }

            // EN: Update the device's rating
            // PL: Zaktualizuj ocenę urządzenia
            await Device.update({ rating: averageRating }, { where: { id: deviceId } });


            return res.json({ rating, averageDeviceRating: averageRating });
        } catch (e) {
            console.error('Błąd podczas ustawiania oceny:', e);
            // EN: Check for specific database errors if needed
            // PL: W razie potrzeby sprawdź określone błędy bazy danych
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
                // EN: Include User information if you want to display who left the rating.
                // PL: Dołącz informacje o użytkowniku, jeśli chcesz wyświetlić, kto zostawił ocenę.
                include: [{ model: User, attributes: ['id', 'email'] }], 
                attributes: ['id', 'rate', 'createdAt'] // EN: Select specific attributes from Rating model // PL: Wybierz określone atrybuty z modelu Rating
            });

            return res.json(ratings);

        } catch (e) {
            console.error('Błąd podczas pobierania ocen urządzenia:', e);
            next(ApiError.internal('Wystąpił błąd podczas pobierania ocen urządzenia'));
        }
    }
}

module.exports = new RatingController();
