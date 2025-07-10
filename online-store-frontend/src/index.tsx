import React, { createContext } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { createUserStore } from "./store/UserStore"; // PL: Importujemy funkcję-konstruktor
import { createDeviceStore } from "./store/DeviceStore"; // PL: Importujemy funkcję-konstruktor
import { createBasketStore } from "./store/BasketStore";

// PL: Definiujemy interfejs dla wartości kontekstu
export interface IAppContext {
  user: ReturnType<typeof createUserStore>; // PL: Typ dla instancji UserStore
  device: ReturnType<typeof createDeviceStore>; // PL: Typ dla instancji DeviceStore
  basket: ReturnType<typeof createBasketStore>; // PL: Typ dla instancji BasketStore
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
        user: createUserStore(), // PL: Wywołujemy funkcję do tworzenia instancji
        device: createDeviceStore(), // PL: Wywołujemy funkcję do tworzenia instancji
        basket: createBasketStore(), // PL: Wywołujemy funkcję do tworzenia instancji
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
