import React, { useContext, useEffect, useState } from "react";
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
    // PL: Sprawdzamy, czy kontekst istnieje, zanim go użyjemy
    if (!contextValue) {
      setLoading(false); // PL: Zatrzymujemy ładowanie, jeśli nie ma kontekstu
      return;
    }
    const { user } = contextValue;

    check()
      .then((data) => {
        user.setUser(data);
        user.setIsAuth(true);
      })
      .catch((error) => {
        // PL: To jest oczekiwane zachowanie, jeśli użytkownik nie jest autoryzowany (brak tokenu lub jest on nieprawidłowy)
        console.log(
          "Sprawdzanie autentykacji nie powiodło się, użytkownik nie jest zalogowany."
        );
      })
      .finally(() => {
        setLoading(false);
      });
  }, [contextValue]); // PL: Dodajemy contextValue do zależności, aby uniknąć stale closure

  if (!contextValue) {
    // PL: Błąd krytyczny, jeśli aplikacja nie jest opakowana w Provider
    return <div>Błąd: Aplikacja nie jest opakowana w Context.Provider</div>;
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
  );
});

export default App;
