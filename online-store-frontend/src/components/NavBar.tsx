import React, { useContext } from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { observer } from "mobx-react-lite";
import { Context } from "../index"; // Імпортуємо Context
import { Button, Badge } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import {
  ADMIN_ROUTE,
  BASKET_ROUTE,
  LOGIN_ROUTE,
  SHOP_ROUTE,
} from "../utils/consts"; // Додано ADMIN_ROUTE
import { useNavigate } from "react-router-dom"; // Змінено useHistory на useNavigate

const NavBar = observer(() => {
  const contextValue = useContext(Context);

  if (!contextValue) {
    // Цей випадок не повинен траплятися, якщо NavBar завжди рендериться всередині Provider
    return null; // Або можна повернути компонент завантаження/помилки
  }
  const { user, basket } = contextValue;
  const navigate = useNavigate(); // Змінено history на navigate

  const logOut = () => {
    user.setUser({}); // Скидаємо дані користувача
    user.setIsAuth(false); // Встановлюємо, що користувач не авторизований
    localStorage.removeItem("token"); // Найважливіше: видаляємо токен зі сховища
    navigate(LOGIN_ROUTE); // Опціонально, але рекомендовано: перенаправляємо на сторінку входу
  };

  // Приклад використання:
  // return <div>{user.isAuth ? "Авторизований" : "Гість"}</div>;
  return (
    <Navbar bg="dark" data-bs-theme="dark">
      <Container>
        {/* <Navbar.Brand href="#home">Navbar</Navbar.Brand> */}
        <NavLink style={{ color: "white" }} to={SHOP_ROUTE}>
          Go to shops
        </NavLink>
        {user.isAuth ? (
          <Nav
            className="ms-auto d-flex align-items-center"
            style={{ color: "white" }}
          >
            <Navbar.Text className="me-3">{user.user.email}</Navbar.Text>
            <Button
              variant="outline-light"
              className="me-2"
              onClick={() => navigate(BASKET_ROUTE)}
            >
              Кошик
              {/* Показуємо кількість товарів, якщо вона більша за 0 */}
              {basket.items.length > 0 && (
                <Badge bg="danger" className="ms-2">
                  {basket.items.length}
                </Badge>
              )}
            </Button>
            {/* Кнопка адмін-панелі з'являється тільки для адміністратора */}
            {user.user.role === "ADMIN" && (
              <Button
                variant={"outline-light"}
                onClick={() => navigate(ADMIN_ROUTE)}
                className="me-2" // Додаємо відступ справа для кнопки виходу
              >
                Admin panel
              </Button>
            )}
            <Button variant={"outline-light"} onClick={logOut}>
              Вийти
            </Button>
          </Nav>
        ) : (
          <Nav className="ms-auto" style={{ color: "white" }}>
            <Button
              variant={"outline-light"} // Змінено ml-auto на ms-auto для Bootstrap 5
              onClick={() => navigate(LOGIN_ROUTE)}
            >
              Authorization
            </Button>
          </Nav>
        )}
      </Container>
    </Navbar>
  );
});
export default NavBar;
