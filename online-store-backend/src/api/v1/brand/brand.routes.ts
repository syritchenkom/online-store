import { Router } from 'express';
import { createBrand, getAllBrands, deleteBrand, updateBrand } from './brand.controller';

// EN: Import middleware for authentication and role checking.
// PL: Importuj middleware do uwierzytelniania i sprawdzania ról.
import authMiddleware from '../../../middleware/auth.middleware';
import checkRole from '../../../middleware/checkRole.middleware';

const router = Router();

// EN: Create a new brand. Requires authentication and ADMIN role.
// PL: Utwórz nową markę. Wymaga uwierzytelnienia i roli ADMIN.
router.post('/', authMiddleware, checkRole('ADMIN'), createBrand);

// EN: Get all brands. Publicly accessible.
// PL: Pobierz wszystkie marki. Dostępne publicznie.
router.get('/', getAllBrands);

// EN: Delete a brand by ID. Requires authentication and ADMIN role.
// PL: Usuń markę po ID. Wymaga uwierzytelnienia i roli ADMIN.
router.delete('/:id', authMiddleware, checkRole('ADMIN'), deleteBrand);

// EN: Update a brand by ID. Requires authentication and ADMIN role.
// PL: Zaktualizuj markę po ID. Wymaga uwierzytelnienia i roli ADMIN.
router.put('/:id', authMiddleware, checkRole('ADMIN'), updateBrand);


export default router;