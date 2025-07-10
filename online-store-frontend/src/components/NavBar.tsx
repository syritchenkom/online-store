import React, { useContext } from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { observer } from "mobx-react-lite";
import { Context } from "../index";
import { Button, Badge } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import {
  ADMIN_ROUTE,
  BASKET_ROUTE,
  LOGIN_ROUTE,
  SHOP_ROUTE,
} from "../utils/consts";
import { useNavigate } from "react-router-dom";

const NavBar = observer(() => {
  const contextValue = useContext(Context);

  if (!contextValue) {
    // PL: Ten przypadek nie powinien się zdarzyć, jeśli NavBar jest zawsze renderowany wewnątrz Provider
    return null; // PL: Lub można zwrócić komponent ładowania/błędu
  }
  const { user, basket } = contextValue;
  const navigate = useNavigate();

  const logOut = () => {
    user.setUser({}); // PL: Resetujemy dane użytkownika
    user.setIsAuth(false); // PL: Ustawiamy, że użytkownik nie jest autoryzowany
    localStorage.removeItem("token"); // PL: Najważniejsze: usuwamy token z magazynu
    navigate(LOGIN_ROUTE); // PL: Opcjonalnie, ale zalecane: przekierowujemy na stronę logowania
  };

  // PL: Przykład użycia:
  // return <div>{user.isAuth ? "Autoryzowany" : "Gość"}</div>;
  return (
    <Navbar bg="dark" data-bs-theme="dark">
      <Container>
        {/* <Navbar.Brand href="#home">Navbar</Navbar.Brand> */}
        <NavLink style={{ color: "white" }} to={SHOP_ROUTE}>
          Sklep
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
              Koszyk
              {/* PL: Pokazujemy liczbę produktów, jeśli jest większa od 0 */}
              {basket.items.length > 0 && (
                <Badge bg="danger" className="ms-2">
                  {basket.items.length}
                </Badge>
              )}
            </Button>
            {/* PL: Przycisk panelu admina pojawia się tylko dla administratora */}
            {user.user.role === "ADMIN" && (
              <Button
                variant={"outline-light"}
                onClick={() => navigate(ADMIN_ROUTE)}
                className="me-2" // PL: Dodajemy margines po prawej dla przycisku wyjścia
              >
                Panel admina
              </Button>
            )}
            <Button variant={"outline-light"} onClick={logOut}>
              Wyjdź
            </Button>
          </Nav>
        ) : (
          <Nav className="ms-auto" style={{ color: "white" }}>
            <Button
              variant={"outline-light"}
              onClick={() => navigate(LOGIN_ROUTE)}
            >
              Autoryzacja
            </Button>
          </Nav>
        )}
      </Container>
    </Navbar>
  );
});
export default NavBar;
