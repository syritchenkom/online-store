import React, { useContext, useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import { Context } from "..";
import {
  Col,
  Container,
  ListGroup,
  Row,
  Spinner,
  Image,
  Button,
  Card,
  Alert,
} from "react-bootstrap";
import { fetchBasket, removeFromBasket } from "../http/basketAPI";
import { useNavigate } from "react-router-dom";
import { CHECKOUT_ROUTE } from "../utils/consts";

export const Basket = observer(() => {
  const context = useContext(Context);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [orderSuccess, setOrderSuccess] = useState(false);

  // EN: Guard against the component being rendered outside of a context provider.
  // PL: Zabezpieczenie przed renderowaniem komponentu poza dostawcą kontekstu.
  if (!context) {
    return <div>Error: Component not wrapped in Context.Provider</div>;
  }
  const { basket, user } = context;

  if (!user.isAuth) {
    return <div>Proszę się zalogować, aby zobaczyć koszyk.</div>;
  }

  useEffect(() => {
    if (user.isAuth) {
      setLoading(true);
      fetchBasket()
        .then((data) => {
          basket.setItems(data.basketDevices || []);
        })
        .catch((e) => console.error("Failed to fetch basket", e))
        .finally(() => setLoading(false));
    }
  }, [basket, user.isAuth]);

  const handleRemove = (deviceId: number) => {
    setLoading(true);
    removeFromBasket(deviceId)
      .then(() => fetchBasket())
      .then((data) => basket.setItems(data.basketDevices || []))
      .catch((e) =>
        alert(e.response?.data?.message || "Failed to update basket")
      )
      .finally(() => setLoading(false));
  };

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

  if (!orderSuccess && basket.items.length === 0) {
    return (
      <Container
        className="d-flex justify-content-center align-items-center"
        style={{ height: "80vh" }}
      >
        <h2>Twój koszyk jest pusty</h2>
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      <h1>Twój koszyk</h1>
      {orderSuccess ? (
        <Alert variant="success">
          <h4>Dziękujemy za zamówienie!</h4>
          <p>
            Twoje zamówienie zostało pomyślnie złożone. Otrzymasz powiadomienie
            e-mail z dalszymi szczegółami.
          </p>
        </Alert>
      ) : (
        <Row>
          <Col md={8}>
            <ListGroup>
              {basket.items.map((item) => (
                <ListGroup.Item
                  key={item.id}
                  className="d-flex justify-content-between align-items-center"
                >
                  <div className="d-flex align-items-center">
                    <Image
                      src={process.env.REACT_APP_API_URL + item.device.img}
                      style={{ width: "100px", marginRight: "20px" }}
                      alt={item.device.name}
                    />
                    <div>
                      <h5>{item.device.name}</h5>
                      <p className="mb-0">
                        {item.device.price} zł x {item.quantity}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="outline-danger"
                    size="sm"
                    onClick={() => handleRemove(item.device.id)}
                  >
                    Usuń
                  </Button>
                </ListGroup.Item>
              ))}
            </ListGroup>
          </Col>
          <Col md={4} className="mt-4 mt-md-0">
            <Card>
              <Card.Header>Podsumowanie</Card.Header>
              <Card.Body>
                <Card.Title>Suma całkowita: {basket.totalPrice} zł</Card.Title>
                <Card.Text>Liczba produktów: {basket.totalCount}</Card.Text>
                <Button
                  variant="primary"
                  className="w-100"
                  onClick={() => navigate(CHECKOUT_ROUTE)}
                >
                  Przejdź do kasy
                </Button>
              </Card.Body>
            </Card>
          </Col>
          {/* The OrderForm will now handle the checkout process */}
          {/* <Col md={4} className="mt-4 mt-md-0">
            <OrderForm />
          </Col> */}
        </Row>
      )}
    </Container>
  );
});
