import { Router } from 'express';
import typeController from './type.controller';
import checkRoleMiddleware from '../../../middleware/checkRole.middleware';
import authMiddleware from '../../../middleware/auth.middleware';

const router = Router();

// EN: Create a new type. Requires authentication and ADMIN role.
// PL: Utwórz nowy typ. Wymaga uwierzytelnienia i roli ADMIN.
// The authMiddleware must run BEFORE checkRoleMiddleware to attach user data to the request.
// PL: authMiddleware musi zostać uruchomiony PRZED checkRoleMiddleware, aby dołączyć dane użytkownika do żądania.
router.post('/', authMiddleware, checkRoleMiddleware('ADMIN'), typeController.create);

// EN: Get all types. Publicly accessible.
// PL: Pobierz wszystkie typy. Dostępne publicznie.
router.get('/', typeController.getAll);

// EN: Delete a type by ID. Requires authentication and ADMIN role.
// PL: Usuń typ po ID. Wymaga uwierzytelnienia i roli ADMIN.
router.delete('/:id', authMiddleware, checkRoleMiddleware('ADMIN'), typeController.delete);


export default router;