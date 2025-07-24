import { Sequelize } from 'sequelize-typescript';
import path from 'path';
import 'dotenv/config'; // Ensure environment variables are loaded
import {models} from './db/models'; // Import models from the models directory

const sequelize = new Sequelize({
    database: process.env.DB_NAME,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    dialect: 'postgres',
    // EN: Tell sequelize-typescript where to find the models.
    // PL: Wskaż sequelize-typescript, gdzie znaleźć modele.
    models,
    // EN: Optional: disable logging of every SQL query for a cleaner console.
    // PL: Opcjonalnie: wyłącz logowanie każdego zapytania SQL, aby konsola była czystsza.
    logging: false,
});

export default sequelize;