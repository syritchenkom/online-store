require('dotenv').config(); 

const express = require('express');
const sequelize = require('./db');
const models = require('./models/models'); // Припускаємо, що моделі знаходяться тут
const cors = require('cors');
const fileUpload = require('express-fileupload'); // EN: Middleware for handling file uploads. PL: Middleware do obsługi przesyłania plików.
const path = require('path');
const app = express();

// EN: Use CORS middleware to allow cross-origin requests.
// PL: Użyj middleware CORS, aby zezwolić na żądania z innych domen.
app.use(cors());
// EN: Middleware for parsing JSON request bodies.
// PL: Middleware do parsowania ciał żądań JSON.
app.use(express.json({limit: '50mb'})); // Increased limit for larger payloads

// EN: Middleware for serving static files (e.g., images).
// PL: Middleware do serwowania plików statycznych (np. obrazów).
app.use(express.static(path.resolve(__dirname, 'static')));

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
        await sequelize.authenticate(); // EN: Check database connection. PL: Sprawdź połączenie z bazą danych.
        await sequelize.sync(); // EN: Sync database models. PL: Synchronizuj modele bazy danych.
        app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
    } catch (e) {
        console.log(e);
    }
};

start();