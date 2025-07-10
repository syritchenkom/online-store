import React, { useContext, useEffect, useState } from "react";
// import logo from "./logo.svg";
import "./App.css";
import { AppRouter } from "./components/AppRouter";
import { BrowserRouter } from "react-router-dom";
import NavBar from "./components/NavBar";
import { observer } from "mobx-react-lite";
import { Context } from "./index";
import { check } from "./http/userAPI";
import { Spinner } from "react-bootstrap";

const App = observer(() => {
  const contextValue = useContext(Context);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Перевіряємо, чи існує контекст, перш ніж його використовувати
    if (!contextValue) {
      setLoading(false); // Зупиняємо завантаження, якщо контексту немає
      return;
    }
    const { user } = contextValue;

    check()
      .then((data) => {
        user.setUser(data);
        user.setIsAuth(true);
      })
      .catch((error) => {
        // Це очікувана поведінка, якщо користувач не авторизований (немає токена або він недійсний)
        console.log("Authentication check failed, user is not logged in.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [contextValue]); // Додаємо contextValue в залежності, щоб уникнути stale closure

  if (!contextValue) {
    // Критична помилка, якщо додаток не обгорнутий в Provider
    return <div>Error: App is not wrapped in Context.Provider</div>;
  }

  if (loading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ height: "100vh" }}
      >
        <Spinner animation="border" />
      </div>
    );
  }

  return (
    <BrowserRouter>
      <NavBar />
      <AppRouter />
    </BrowserRouter>
    // <div className="App">
    //   <header className="App-header">
    //     <img src={logo} className="App-logo" alt="logo" />
    //     <p>
    //       Edit <code>src/App.tsx</code> and save to reload.
    //     </p>
    //     <a
    //       className="App-link"
    //       href="https://reactjs.org"
    //       target="_blank"
    //       rel="noopener noreferrer"
    //     >
    //       Learn React
    //     </a>
    //   </header>
    // </div>
  );
});

export default App;
