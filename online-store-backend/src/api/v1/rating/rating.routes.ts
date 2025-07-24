import { Router } from 'express';
import ratingController from './rating.controller';
import authMiddleware from '../../../middleware/auth.middleware';

const router = Router();

// EN: Set or update a rating for a device.
// PL: Ustaw lub zaktualizuj ocenę dla urządzenia.
// EN: This route requires authentication.
// PL: Ta trasa wymaga uwierzytelnienia.
router.post('/', authMiddleware, ratingController.setRating);

// EN: Get all ratings for a specific device.
// PL: Pobierz wszystkie oceny dla określonego urządzenia.
// EN: This route typically doesn't require authentication, as anyone can view ratings.
// PL: Ta trasa zazwyczaj nie wymaga uwierzytelnienia, ponieważ każdy może przeglądać oceny.
router.get('/:deviceId', ratingController.getDeviceRatings);

export default router;