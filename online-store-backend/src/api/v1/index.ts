import { Router } from 'express';

// EN: Import individual router files for different entities/modules of your application.
// PL: Importuj poszczególne pliki routerów dla różnych encji/modułów Twojej aplikacji.
import authRouter from './auth/auth.routes';
import userRouter from './user/user.routes';
import typeRouter from './type/type.routes';
import brandRouter from './brand/brand.routes';
import deviceRouter from './device/device.routes';
import basketRouter from './basket/basket.routes';
import ratingRouter from './rating/rating.routes';
import orderRouter from './order/order.routes';

// EN: Use each specific router for its corresponding base path.
// PL: Użyj każdego specyficznego routera dla jego odpowiedniej ścieżki bazowej.
// EN: This main router will handle all API requests and route them to the appropriate handlers.
const router = Router();
// EN: Requests to /api/user will be handled by userRouter, /api/type by typeRouter, etc.
// PL: Żądania do /api/user będą obsługiwane przez userRouter, /api/type przez typeRouter itd.
router.use('/auth', authRouter);
router.use('/users', userRouter);
router.use('/types', typeRouter);
router.use('/brands', brandRouter);
router.use('/devices', deviceRouter);
router.use('/basket', basketRouter);
router.use('/ratings', ratingRouter);
router.use('/orders', orderRouter);

export default router;