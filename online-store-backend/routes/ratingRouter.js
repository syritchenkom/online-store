// EN: Import the Express Router.
// PL: Importuj router Express.
const Router = require('express');
const router = new Router();

// EN: Import the rating controller to handle business logic.
// PL: Importuj kontroler ocen, aby obsługiwać logikę biznesową.
const ratingController = require('../controllers/ratingController');

// EN: Import authentication middleware. This ensures only logged-in users can interact.
// PL: Importuj middleware uwierzytelniania. To zapewnia, że tylko zalogowani użytkownicy mogą wchodzić w interakcje.
const authMiddleware = require('../middleware/authMiddleware');

// EN: Set or update a rating for a device.
// PL: Ustaw lub zaktualizuj ocenę dla urządzenia.
// EN: This route requires authentication.
// PL: Ta trasa wymaga uwierzytelnienia.
router.post('/', authMiddleware, ratingController.setRating);

// EN: Get all ratings for a specific device.
// PL: Pobierz wszystkie oceny dla określonego urządzenia.
// EN: This route typically doesn't require authentication, as anyone can view ratings.
// PL: Ta trasa zazwyczaj nie wymaga uwierzytelnienia, ponieważ każdy może przeglądać oceny.
router.get('/:deviceId', ratingController.getDeviceRatings);

// EN: Export the configured router. This router will be used in routes/index.js.
// PL: Eksportuj skonfigurowany router. Ten router będzie używany w routes/index.js.
module.exports = router;