import { Router } from 'express';
import { createDevice, getAllDevices, getOneDevice, updateDevice, deleteDevice } from './device.controller';
import checkRoleMiddleware from '../../../middleware/checkRole.middleware';
import authMiddleware from '../../../middleware/auth.middleware';

const router = Router();

// EN: POST /api/device/ - Create a new device. Requires ADMIN role.
// PL: POST /api/device/ - Utwórz nowe urządzenie. Wymaga roli ADMIN.
router.post(
    '/',
    authMiddleware,
    checkRoleMiddleware('ADMIN'),
    createDevice
);

// EN: GET /api/device/ - Get all devices. Publicly accessible.
// PL: GET /api/device/ - Pobierz wszystkie urządzenia. Dostępne publicznie.
router.get('/', getAllDevices);

// EN: GET /api/device/:id - Get a single device. Publicly accessible.
// PL: GET /api/device/:id - Pobierz jedno urządzenie. Dostępne publicznie.
router.get('/:id', getOneDevice);

// EN: PUT /api/device/:id - Update a device. Requires ADMIN role.
// PL: PUT /api/device/:id - Zaktualizuj urządzenie. Wymaga roli ADMIN.
router.put('/:id', authMiddleware, checkRoleMiddleware('ADMIN'), updateDevice);

// EN: DELETE /api/device/:id - Delete a device. Requires ADMIN role.
// PL: DELETE /api/device/:id - Usuń urządzenie. Wymaga roli ADMIN.
router.delete('/:id', authMiddleware, checkRoleMiddleware('ADMIN'), deleteDevice);

export default router;
