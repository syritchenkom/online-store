import { Router } from 'express';
import userController from './user.controller';
import authMiddleware from '../../../middleware/auth.middleware';
import checkRoleMiddleware from '../../../middleware/checkRole.middleware';

const router = Router();

// GET /api/v1/users/ - Get all users. Requires ADMIN role.
router.get(
    '/', 
    authMiddleware, 
    checkRoleMiddleware('ADMIN'), 
    userController.getAll
);

// DELETE /api/v1/users/:id - Delete a user by ID. Requires ADMIN role.
router.delete(
    '/:id', 
    authMiddleware, 
    checkRoleMiddleware('ADMIN'), 
    userController.deleteOne
);

// PATCH /api/v1/users/:id/role - Update a user's role. Requires ADMIN role.
router.patch(
    '/:id/role',
    authMiddleware,
    checkRoleMiddleware('ADMIN'),
    userController.updateRole
);

export default router;