import { Router } from 'express';
import authController from './auth.controller';
import authMiddleware from '../../../middleware/auth.middleware';

const router = Router();

// /api/v1/auth/registration
router.post('/registration', authController.registration);

// /api/v1/auth/login
router.post('/login', authController.login);

// /api/v1/auth/check
router.get('/check', authMiddleware, authController.check);


export default router;