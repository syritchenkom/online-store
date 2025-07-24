import 'dotenv/config';
import express from 'express';
import sequelize from './db';
import cors from 'cors';
import fileUpload from 'express-fileupload';
import fs from 'fs';
import path from 'path';
import mainApiRouter from './api/v1';
import errorHandler from './middleware/errorHandler.middleware';
import { seedAdmin } from './db/seed';

const app = express();

// EN: Use CORS middleware to allow cross-origin requests.
// PL: Użyj middleware CORS, aby zezwolić na żądania z innych domen.
app.use(cors());
// EN: Middleware for parsing JSON request bodies.
// PL: Middleware do parsowania ciał żądań JSON.
app.use(express.json({ limit: '50mb' })); // Increased limit for larger payloads

// EN: Ensure the static directory for file uploads exists.
// PL: Upewnij się, że katalog statyczny do przesyłania plików istnieje.
const staticDir = path.resolve(__dirname, '..', 'static');
if (!fs.existsSync(staticDir)) {
    fs.mkdirSync(staticDir, { recursive: true });
    console.log(`Created static directory at: ${staticDir}`);
}

// EN: Middleware for serving static files (e.g., images).
// PL: Middleware do serwowania plików statycznych (np. obrazów).
app.use(express.static(staticDir));

// EN: Middleware for handling file uploads.
// PL: Middleware do obsługi przesyłania plików.
app.use(fileUpload({}));

// EN: Use the main router to handle all API routes.
// PL: Użyj głównego routera do obsługi wszystkich tras API.
// Now all API routes will be prefixed with /api/v1
app.use('/api/v1', mainApiRouter);

// EN: Error handling middleware MUST be the LAST middleware registered.
// PL: Middleware obsługi błędów MUSI być OSTATNIM zarejestrowanym middleware.
app.use(errorHandler);

const PORT = process.env.PORT || 5001;

const start = async () => {
    try {
        await sequelize.authenticate(); // EN: Check database connection. PL: Sprawdź połączenie z bazą danych.
        // EN: Sync database models. It now knows about all models from the configuration in db.ts.
        // PL: Synchronizuj modele bazy danych. Teraz wie o wszystkich modelach z konfiguracji w db.ts.
        
        // WARNING: { force: true } will drop all tables and recreate them.
        // This is useful for development but DANGEROUS for production.
        // We should only use it when not in a production environment.
        if (process.env.NODE_ENV !== 'production') {
            // The { force: true } or { alter: true } option drops and recreates all tables on every server start.
            await sequelize.sync({ alter: true });
            console.log('Database synchronized with { alter: true }');
            // EN: Seed the database with an admin user if in development mode.
            await seedAdmin();
        } else {
            await sequelize.sync();
        }
        app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
    } catch (e) {
        console.log(e);
    }
};

start();