const Router = require('express')
const router = new Router()
const brandController = require('../controllers/brandController')

// EN: Import middleware for authentication and role checking.
// PL: Importuj middleware do uwierzytelniania i sprawdzania ról.
const authMiddleware = require('../middleware/authMiddleware')
const checkRoleMiddleware = require('../middleware/checkRoleMiddleware')

// EN: Create a new brand. Requires authentication and ADMIN role.
// PL: Utwórz nową markę. Wymaga uwierzytelnienia i roli ADMIN.
router.post('/', authMiddleware, checkRoleMiddleware('ADMIN'), brandController.create)

// EN: Get all brands. Publicly accessible.
// PL: Pobierz wszystkie marki. Dostępne publicznie.
router.get('/', brandController.getAll)

// EN: Delete a brand by ID. Requires authentication and ADMIN role.
// PL: Usuń markę po ID. Wymaga uwierzytelnienia i roli ADMIN.
router.delete('/:id', authMiddleware, checkRoleMiddleware('ADMIN'), brandController.delete)
module.exports = router