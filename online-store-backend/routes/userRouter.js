const Router = require('express')
const router = new Router()
const userController = require('../controllers/userController')
const authMiddleware = require('../middleware/authMiddleware')
const checkRoleMiddleware = require('../middleware/checkRoleMiddleware')

router.post('/registration', userController.registration)

router.post('/login', userController.login)

router.get('/auth', authMiddleware, userController.check)

// GET /api/user/ - Get all users. Requires ADMIN role.
// PL: GET /api/user/ - Pobierz wszystkich użytkowników. Wymaga roli ADMIN.
router.get('/', authMiddleware, checkRoleMiddleware('ADMIN'), userController.getAllUsers);

// DELETE /api/user/:id - Delete a user by ID. Requires ADMIN role.
// PL: DELETE /api/user/:id - Usuwanie użytkownika po ID. Wymaga roli ADMIN.
router.delete('/:id', authMiddleware, checkRoleMiddleware('ADMIN'), userController.deleteUser)

// PATCH /api/user/:id/role - Update a user's role. Requires ADMIN role.
// PL: PATCH /api/user/:id/role - Aktualizacja roli użytkownika. Wymaga roli ADMIN.
router.patch(
    '/:id/role',
    authMiddleware,
    checkRoleMiddleware('ADMIN'),
    userController.updateRole
);

module.exports = router