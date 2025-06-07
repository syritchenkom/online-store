const Router = require('express')
const router = new Router()
const userController = require('../controllers/userController')
const authMiddleware = require('../middleware/authMiddleware')
const checkRoleMiddleware = require('../middleware/checkRoleMiddleware')

router.post('/registration', userController.registration)

router.post('/login', userController.login)

router.get('/auth', authMiddleware, userController.check)

// DELETE /api/user/:id - Delete a user by ID. Requires ADMIN role.
// PL: DELETE /api/user/:id - Usuwanie użytkownika po ID. Wymaga roli ADMIN.
router.delete('/:id', authMiddleware, checkRoleMiddleware('ADMIN'), userController.deleteUser)


module.exports = router