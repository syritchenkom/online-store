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

  // Перевірка, чи існує контекст
  if (!contextValue) {
    // Цей випадок не повинен траплятися, якщо Auth завжди рендериться всередині Provider
    return null; // Або можна повернути компонент завантаження/помилки
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
      user.setUser(data); // Виправляємо логічну помилку: передаємо дані з сервера
      user.setIsAuth(true);
      navigate(SHOP_ROUTE); // Перенаправляємо на головну сторінку
    } catch (e: any) {
      // Обробка помилок, наприклад, виведення повідомлення з відповіді сервера
      if (e.response && e.response.data && e.response.data.message) {
        alert(e.response.data.message);
      } else {
        alert("Виникла невідома помилка");
      }
    }
  };

  return (
    <Container
      className="d-flex justify-content-center align-items-center"
      style={{ height: window.innerHeight - 54 }}
    >
      <Card style={{ width: 600 }} className="p-5">
        <h2 className="m-auto">{isLogin ? "Authorization" : "Registration"}</h2>
        <Form className="d-flex flex-column">
          <Form.Control
            className="mt-3"
            placeholder="Write here your e-mail"
            value={email}
            autoComplete="email"
            onChange={(e) => setEmail(e.target.value)}
          />
          <Form.Control
            className="mt-3"
            placeholder="Write here your password..."
            value={password}
            autoComplete={isLogin ? "current-password" : "new-password"}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
          />
          <Row className="d-flex justify-content-between mt-3 pl-3 pr-3">
            {isLogin ? (
              <div>
                Not have account?
                <NavLink to={REGISTRATION_ROUTE}>Registration please!</NavLink>
              </div>
            ) : (
              <div>
                Already have account?
                <NavLink to={LOGIN_ROUTE}>Login please!</NavLink>
              </div>
            )}
            <Button variant={"outline-success"} onClick={click}>
              {isLogin ? "Login" : "Registration"}
            </Button>
          </Row>
        </Form>
      </Card>
    </Container>
  );
});
