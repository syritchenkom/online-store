import React, { createContext } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { createUserStore } from "./store/UserStore"; // Імпортуємо функцію-конструктор
import { createDeviceStore } from "./store/DeviceStore"; // Імпортуємо функцію-конструктор
import { createBasketStore } from "./store/BasketStore";

// Визначаємо інтерфейс для значення контексту
export interface IAppContext {
  user: ReturnType<typeof createUserStore>; // Тип для екземпляра UserStore
  device: ReturnType<typeof createDeviceStore>; // Тип для екземпляра DeviceStore
  basket: ReturnType<typeof createBasketStore>; // Тип для екземпляра BasketStore
}

export const Context = createContext<IAppContext | null>(null);

console.log("process.env.REACT_APP_API_URL", process.env.REACT_APP_API_URL);

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <Context.Provider
      value={{
        user: createUserStore(), // Викликаємо функцію для створення екземпляра
        device: createDeviceStore(), // Викликаємо функцію для створення екземпляра
        basket: createBasketStore(), // Викликаємо функцію для створення екземпляра
      }}
    >
      <App />
    </Context.Provider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
