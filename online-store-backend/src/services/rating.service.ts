import sequelize from '../db';
import { Rating } from '../db/models/Rating';
import { Device } from '../db/models/Device';
import { User } from '../db/models/User';
import ApiError from '../utils/ApiError';

class RatingService {
    public async setRating(userId: number, deviceId: number, rate: number): Promise<{ message: string; newRating: number }> {
        if (!rate || !deviceId) {
            throw ApiError.badRequest('Nie podano ID urządzenia lub oceny');
        }

        if (rate < 1 || rate > 5) {
            throw ApiError.badRequest('Ocena musi być liczbą od 1 do 5');
        }

        // EN: We use a transaction to ensure that all operations are either successful or none are.
        // PL: Używamy transakcji, aby zagwarantować, że wszystkie operacje zakończą się sukcesem, albo żadna z nich nie zostanie wykonana.
        const transaction = await sequelize.transaction();
        try {
            // EN: Create or update the rating for this user and device within the transaction.
            // PL: Tworzymy lub aktualizujemy ocenę dla tego użytkownika i urządzenia w ramach transakcji.
            await Rating.upsert({
                userId,
                deviceId,
                rate
            }, { transaction });

            // EN: Recalculate the average rating for the device.
            // PL: Przeliczamy średnią ocenę dla urządzenia.
            const averageResult = await Rating.findOne({
                where: { deviceId },
                attributes: [[sequelize.fn('AVG', sequelize.col('rate')), 'avgRating']],
                transaction,
                raw: true
            }) as { avgRating: string | null } | null;

            const newAverageRating = averageResult?.avgRating ? parseFloat(parseFloat(averageResult.avgRating).toFixed(1)) : 0;

            await Device.update({ rating: newAverageRating }, { where: { id: deviceId }, transaction });

            await transaction.commit();

            return { message: 'Ocena została zapisana.', newRating: newAverageRating };
        } catch (e: any) {
            await transaction.rollback();
            if (e.name === 'SequelizeForeignKeyConstraintError') {
                 throw ApiError.badRequest('Nieprawidłowe ID urządzenia lub użytkownika');
            }
            throw ApiError.internal('Wystąpił błąd podczas ustawiania oceny');
        }
    }

    public async getDeviceRatings(deviceId: number): Promise<Rating[]> {
        return Rating.findAll({
            where: { deviceId },
            include: [{ model: User, attributes: ['id', 'email'] }], // Exclude password
            order: [['createdAt', 'DESC']]
        });
    }
}

export default new RatingService();