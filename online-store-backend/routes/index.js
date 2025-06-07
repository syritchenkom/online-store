// EN: Import the Express Router.
// PL: Importuj router Express.
const Router = require('express');
const router = new Router();

// EN: Import individual router files for different entities/modules of your application.
// PL: Importuj poszczególne pliki routerów dla różnych encji/modułów Twojej aplikacji.
const deviceRouter = require('./deviceRouter');
const userRouter = require('./userRouter');
const typeRouter = require('./typeRouter');
const brandRouter = require('./brandRouter');
const basketRouter = require('./basketRouter');
const ratingRouter = require('./ratingRouter'); // Your ratingRouter

// EN: Import checkRoleMiddleware if you plan to define admin-only routes directly in index.js,
// EN: or if another sub-router (e.g., brandRouter for admin actions) needs it.
// PL: Importuj checkRoleMiddleware, jeśli planujesz definiować trasy tylko dla administratorów bezpośrednio w index.js,
// PL: lub jeśli inny pod-router (np. brandRouter dla akcji administratora) go potrzebuje.
const checkRoleMiddleware = require('../middleware/checkRoleMiddleware');


// EN: Use each specific router for its corresponding base path.
// PL: Użyj każdego specyficznego routera dla jego odpowiedniej ścieżki bazowej.
// EN: Requests to /api/user will be handled by userRouter, /api/type by typeRouter, etc.
// PL: Żądania do /api/user będą obsługiwane przez userRouter, /api/type przez typeRouter itd.
router.use('/user', userRouter);
router.use('/type', typeRouter);
router.use('/brand', brandRouter);
router.use('/device', deviceRouter);
router.use('/basket', basketRouter);
router.use('/rating', ratingRouter); // Registering your ratingRouter

// EN: Example of an admin-only route directly in the main router (optional).
// PL: Przykład trasy tylko dla administratorów bezpośrednio w głównym routerze (opcjonalnie).
// EN: This route requires authentication and the 'ADMIN' role.
// PL: Ta trasa wymaga uwierzytelnienia i roli 'ADMIN'.
// router.post('/admin-status', authMiddleware, checkRoleMiddleware('ADMIN'), (req, res) => {
//     res.json({ message: "You have admin privileges!" });
// });


// EN: Export the main router. This is the router that your main app.js will use.
// PL: Eksportuj główny router. To jest router, którego będzie używał Twój główny plik app.js.
module.exports = router;