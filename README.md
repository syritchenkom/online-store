# Online Store (Full-Stack Application)

This is a full-stack online store application, including both frontend and backend components.

## Project Structure

The project is organized into two main parts:

*   `online-store-frontend/`: Contains the React frontend application.
*   `online-store-backend/` : Contains the Node.js backend API.

## Frontend (online-store-frontend)

The frontend is built with React and TypeScript.

### Features

*   Browse products
*   Add products to basket
*   User authentication
*   Admin panel for managing store

### Technologies Used (Frontend)

*   React
*   TypeScript
*   React Router DOM (for routing)
*   Axios (for API requests)
*   MobX & MobX-React-Lite (for state management)
*   Create React App

### Getting Started (Frontend)

1.  Navigate to the frontend directory: `cd online-store-frontend`
2.  Install dependencies:
    ```bash
    npm install
    # or
    yarn install
    ```
3.  Start the development server:
    ```bash
    npm start
    # or
    yarn start
    ```
    The frontend will be available at `http://localhost:3000`.

## Backend (online-store-backend - *Backend*)

The backend provides the API for the online store, built with Node.js.

### Technologies & Libraries Used (Backend)

*   Node.js
*   Express.js
*   PostgreSQL (as the database, using `pg` driver)
*   Sequelize (as the ORM for PostgreSQL, with `pg-hstore` for HSTORE support)
*   jsonwebtoken (for JWT-based authentication)
*   bcrypt (for password hashing)
*   dotenv (for managing environment variables)
*   cors (for enabling Cross-Origin Resource Sharing)
*   express-fileupload (for handling file uploads)
*   uuid (for generating UUIDs)
*   Nodemon (for automatic server restarts during development - *optional, for development*)

### Getting Started (Backend)

1.  Navigate to the backend directory: `cd online-store-backend`
2.  Install dependencies:
    ```bash
    npm install
    # or
    yarn install
    ```
3.  Set up your environment variables (e.g., database connection string in a `.env` file).
4.  Start the development server (the command might vary based on your setup):
    ```bash
    npm run dev
    # or
    node index.js
    ```

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.
