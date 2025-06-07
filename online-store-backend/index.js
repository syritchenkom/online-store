require('dotenv').config(); 

const express = require('express');
const fileUpload = require('express-fileupload'); // EN: Middleware for handling file uploads. PL: Middleware do obsługi przesyłania plików.
const app = express();

// EN: Middleware for parsing JSON request bodies.
// PL: Middleware do parsowania ciał żądań JSON.
app.use(express.json({limit: '50mb'})); // Increased limit for larger payloads

// EN: Middleware for handling file uploads.
// PL: Middleware do obsługi przesyłania plików.
app.use(fileUpload({}));

// EN: Import your main router.
// PL: Importuj swój główny router.
const mainRouter = require('./routes/index');

// EN: Import your error handling middleware.
// PL: Importuj swoje middleware do obsługi błędów.
const errorHandler = require('./middleware/ErrorHandlingMiddleware');

// EN: Use the main router to handle all API routes.
// PL: Użyj głównego routera do obsługi wszystkich tras API.
// EN: All routes defined in routes/index.js will be prefixed with /api.
// PL: Wszystkie trasy zdefiniowane w routes/index.js będą miały prefiks /api.
app.use('/api', mainRouter);

// EN: Error handling middleware MUST be the LAST middleware registered.
// PL: Middleware obsługi błędów MUSI być OSTATNIM zarejestrowanym middleware.
app.use(errorHandler);

const PORT = process.env.PORT || 5001;

const start = async () => {
    try {
        // EN: Database connection or synchronization can be done here.
        // PL: Tutaj można nawiązać połączenie z bazą danych lub przeprowadzić synchronizację.
        // EN: You might have sequelize.authenticate() or sequelize.sync() here.
        // PL: Tutaj możesz mieć sequelize.authenticate() lub sequelize.sync().
        app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
    } catch (e) {
        console.log(e);
    }
};

start();