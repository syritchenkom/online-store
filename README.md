# Full-Stack Online Store

A complete e-commerce platform built with React (TypeScript) for the frontend and Node.js (Express, PostgreSQL, Sequelize) for the backend.

---

## ✨ Features

- **User Authentication**: Secure user registration and login using JWT.
- **Product Catalog**: Browse products by type and brand.
- **Pagination**: Efficiently navigate through product lists.
- **Shopping Cart**: Add, view, and manage items in the basket.
- **Product Ratings**: Authenticated users can rate products.
- **Admin Panel**:
  - Create, update, and delete product types.
  - Create, update, and delete product brands.
  - Create, update, and delete devices (products).

---

## 🛠️ Tech Stack

| Frontend                                                              | Backend                                                                        | Database     |
| --------------------------------------------------------------------- | ------------------------------------------------------------------------------ | ------------ |
| React                                         | Node.js                                                 | PostgreSQL |
| TypeScript                         | Express.js                                           |              |
| React Router                              | Sequelize (ORM)                                      |              |
| MobX / MobX-React-Lite  | JWT (jsonwebtoken)                                          |              |
| Axios                                      | Bcrypt (Password Hashing)              |              |
| React-Bootstrap                 | Dotenv                                 |              |
|                                                                       | CORS                                     |              |
|                                                                       | express-fileupload         |              |

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or newer recommended)
- PostgreSQL
- `yarn` or `npm` package manager

### 1. Backend Setup

First, set up the server which will provide the API and connect to the database.

```bash
# 1. Navigate to the backend directory
cd online-store-backend

# 2. Install dependencies
npm install
# or
yarn install

# 3. Create a .env file in the root of the backend directory
#    Copy the contents of .env.example (if it exists) or use the structure below
touch .env

# 4. Add your environment variables to the .env file
#    See the "Environment Variables" section below for an example

# 5. Start the development server
npm run dev
```
The backend server will be running on the port specified in your `.env` file (e.g., `http://localhost:5000`).

### 2. Frontend Setup

Next, set up the client-side React application.

```bash
# 1. Navigate to the frontend directory from the project root
cd online-store-frontend

# 2. Install dependencies
npm install
# or
yarn install

# 3. Create a .env file in the root of the frontend directory
touch .env

# 4. Add the API URL to your .env file
#    REACT_APP_API_URL=http://localhost:5000/

# 5. Start the development server
npm start
```
The frontend application will be available at `http://localhost:3000`.

---

## 🔑 Environment Variables

For the application to run correctly, you need to configure environment variables.

### Backend (`online-store-backend/.env`)

Create a `.env` file in the backend's root directory with the following variables:

```env
# Server port
PORT=5000

# Database connection details
DB_HOST=localhost
DB_PORT=5432
DB_USER=your_postgres_user
DB_PASSWORD=your_postgres_password
DB_NAME=online_store_db

# JWT Secret Key for signing tokens
SECRET_KEY=your_super_secret_key_123
```

### Frontend (`online-store-frontend/.env`)

Create a `.env` file in the frontend's root directory:

```env
# The URL of your running backend server
REACT_APP_API_URL=http://localhost:5000
```

---

## 🤝 Contributing

Contributions are welcome! Please feel free to open an issue or submit a pull request if you have a way to improve this project.

---

## 📄 License

This project can be used under the MIT License. Consider adding a `LICENSE` file to the repository.
