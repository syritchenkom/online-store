# Online Store - Frontend

This is the frontend part of the full-stack Online Store application, built with React and TypeScript. It provides the user interface for browsing products, managing the shopping cart, and user authentication.

---

## ✨ Features

- **User Authentication**: Secure user registration and login.
- **Product Catalog**: Browse products with filtering by type and brand.
- **Pagination**: Efficiently navigate through long lists of products.
- **Shopping Cart**: Add, view, and manage items in the basket.
- **Product Ratings**: Authenticated users can rate products.
- **Admin Panel**: A dedicated interface for administrators to manage types, brands, and devices.

---

## 🛠️ Tech Stack

| Category          | Technology                                                            |
| ----------------- | --------------------------------------------------------------------- |
| Core              | React, TypeScript                                                     |
| Routing           | React Router DOM                                                      |
| State Management  | MobX, MobX-React-Lite                                                 |
| API Communication | Axios                                                                 |
| UI Components     | React-Bootstrap                                                       |
| Build Tool        | Create React App                                                      |

---

## 🚀 Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

- Node.js (v16 or newer recommended)
- `yarn` or `npm` package manager
- A running instance of the backend server.

### Installation & Setup

1.  **Navigate to the frontend directory**:
    (You should already be in the `online-store-frontend` directory)

2.  **Install dependencies**:
    ```bash
    npm install
    # or
    yarn install
    ```

3.  **Create an environment file**:
    Create a `.env` file in the root of this directory.
    ```bash
    touch .env
    ```

4.  **Configure Environment Variables**:
    Add the following line to your `.env` file, pointing to your running backend server.
    ```env
    # The URL of your running backend server
    REACT_APP_API_URL=http://localhost:5001
    ```
    *Note: The port (`5001`) should match the port your backend is running on.*

5.  **Start the development server**:
    ```bash
    npm start
    # or
    yarn start
    ```

The application will open automatically in your browser at `http://localhost:3000`.

---

## 📁 Project Structure

A brief overview of the key directories:

-   `src/components`: Reusable components used across multiple pages (e.g., NavBar, Modals).
-   `src/pages`: Top-level page components (e.g., Shop, Basket, DevicePage).
-   `src/store`: MobX state management stores (e.g., UserStore, DeviceStore, BasketStore).
-   `src/http`: API request functions (e.g., userAPI, deviceAPI).
-   `src/utils`: Constants and utility functions.
-   `src/assets`: Static assets like images and icons.
