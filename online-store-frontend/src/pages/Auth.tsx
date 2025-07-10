import React, { useContext, useState } from "react";
import { Button, Card, Container, Form, Row } from "react-bootstrap";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { LOGIN_ROUTE, REGISTRATION_ROUTE, SHOP_ROUTE } from "../utils/consts";
import { login, registration } from "../http/userAPI";
import { Context } from "../index";
import { observer } from "mobx-react-lite";

export const Auth = observer(() => {
  const contextValue = useContext(Context);
  const navigate = useNavigate();
  const location = useLocation();
  const isLogin = location.pathname === LOGIN_ROUTE;
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  // PL: Sprawdzenie, czy kontekst istnieje
  if (!contextValue) {
    // PL: Ten przypadek nie powinien się zdarzyć, jeśli Auth jest zawsze renderowany wewnątrz Provider
    return null; // PL: Lub można zwrócić komponent ładowania/błędu
  }
  const { user } = contextValue;

  const click = async () => {
    try {
      let data;
      if (isLogin) {
        data = await login(email, password);
      } else {
        data = await registration(email, password);
      }
      user.setUser(data); // PL: Poprawiamy błąd logiczny: przekazujemy dane z serwera
      user.setIsAuth(true);
      navigate(SHOP_ROUTE); // PL: Przekierowujemy na stronę główną
    } catch (e: any) {
      // PL: Obsługa błędów, na przykład wyświetlanie komunikatu z odpowiedzi serwera
      if (e.response && e.response.data && e.response.data.message) {
        alert(e.response.data.message);
      } else {
        alert("Wystąpił nieznany błąd");
      }
    }
  };

  return (
    <Container
      className="d-flex justify-content-center align-items-center"
      style={{ height: window.innerHeight - 54 }}
    >
      <Card style={{ width: 600 }} className="p-5">
        <h2 className="m-auto">{isLogin ? "Autoryzacja" : "Rejestracja"}</h2>
        <Form className="d-flex flex-column">
          <Form.Control
            className="mt-3"
            placeholder="Wpisz tutaj swój e-mail"
            value={email}
            autoComplete="email"
            onChange={(e) => setEmail(e.target.value)}
          />
          <Form.Control
            className="mt-3"
            placeholder="Wpisz tutaj swoje hasło..."
            value={password}
            autoComplete={isLogin ? "current-password" : "new-password"}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
          />
          <Row className="d-flex justify-content-between mt-3 pl-3 pr-3">
            {isLogin ? (
              <div>
                Nie masz konta?{" "}
                <NavLink to={REGISTRATION_ROUTE}>Zarejestruj się!</NavLink>
              </div>
            ) : (
              <div>
                Masz już konto? <NavLink to={LOGIN_ROUTE}>Zaloguj się!</NavLink>
              </div>
            )}
            <Button variant={"outline-success"} onClick={click}>
              {isLogin ? "Zaloguj" : "Zarejestruj"}
            </Button>
          </Row>
        </Form>
      </Card>
    </Container>
  );
});
