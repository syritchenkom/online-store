const Router = require('express');
const router = new Router();
const deviceController = require('../controllers/deviceController');
const authMiddleware = require('../middleware/authMiddleware'); // Припустимо, він існує
const checkRoleMiddleware = require('../middleware/checkRoleMiddleware');

// POST /api/device/ - Створення нового пристрою
// Спочатку authMiddleware для перевірки токена, потім checkRoleMiddleware('ADMIN') для перевірки ролі
router.post(
    '/',
    authMiddleware,
    checkRoleMiddleware('ADMIN'), // Передаємо 'ADMIN' як необхідну роль
    deviceController.create
);

// GET /api/device/ - Отримання всіх пристроїв
router.get('/', deviceController.getAll);

// GET /api/device/:id - Отримання одного пристрою
router.get('/:id', deviceController.getOne);

// TODO: Додати маршрути для оновлення (PUT) та видалення (DELETE) пристроїв, також захищені checkRoleMiddleware('ADMIN')

module.exports = router;
