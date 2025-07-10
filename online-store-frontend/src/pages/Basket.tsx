import React, { useContext, useEffect, useMemo, useState } from "react";
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
} from "react-bootstrap";
import { addToBasket, fetchBasket, removeFromBasket } from "../http/basketAPI";
import { IDevice } from "../store/DeviceStore";

// EN: A new interface for displaying grouped items in the basket.
// PL: Nowy interfejs do wyświetlania zgrupowanych przedmiotów w koszyku.
interface GroupedBasketItem {
  device: IDevice;
  quantity: number;
}

export const Basket = observer(() => {
  const context = useContext(Context);
  const [loading, setLoading] = useState(true);

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
          basket.setItems(data.basket_devices || []);
        })
        .catch((e) => console.error("Failed to fetch basket", e))
        .finally(() => setLoading(false));
    }
  }, [basket, user.isAuth]);

  // EN: Group items by device ID to display quantity. useMemo will prevent recalculation on every render.
  // PL: Grupuj przedmioty według ID urządzenia, aby wyświetlić ilość. useMemo zapobiegnie ponownemu obliczaniu przy każdym renderowaniu.
  const groupedItems = useMemo(() => {
    const groups: { [key: number]: GroupedBasketItem } = {};
    for (const item of basket.items) {
      if (!groups[item.device.id]) {
        groups[item.device.id] = {
          device: item.device,
          quantity: 0,
        };
      }
      groups[item.device.id].quantity++;
    }
    return Object.values(groups);
  }, [basket.items]);

  // EN: A generic handler for basket actions to reduce code duplication.
  // PL: Ogólny handler do obsługi akcji koszyka w celu zmniejszenia duplikacji kodu.
  const handleAction = (action: Promise<any>) => {
    setLoading(true);
    action
      .then(() => fetchBasket())
      .then((data) => basket.setItems(data.basket_devices || []))
      .catch((e) =>
        alert(e.response?.data?.message || "Failed to update basket")
      )
      .finally(() => setLoading(false));
  };

  const handleDecrease = (deviceId: number) => {
    handleAction(removeFromBasket(deviceId));
  };

  const handleIncrease = (deviceId: number) => {
    handleAction(addToBasket(deviceId));
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

  if (groupedItems.length === 0) {
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
      <Row>
        <Col md={8}>
          <ListGroup>
            {groupedItems.map(({ device, quantity }) => (
              <ListGroup.Item
                key={device.id}
                className="d-flex justify-content-between align-items-center"
              >
                <div className="d-flex align-items-center">
                  <Image
                    src={process.env.REACT_APP_API_URL + device.img}
                    style={{ width: "100px", marginRight: "20px" }}
                    alt={device.name}
                  />
                  <div>
                    <h5>{device.name}</h5>
                    <p className="mb-0">{device.price} zł</p>
                  </div>
                </div>
                <div className="d-flex align-items-center">
                  <Button
                    variant="outline-secondary"
                    onClick={() => handleDecrease(device.id)}
                  >
                    -
                  </Button>
                  <span className="mx-3">{quantity}</span>
                  <Button
                    variant="outline-secondary"
                    onClick={() => handleIncrease(device.id)}
                  >
                    +
                  </Button>
                </div>
              </ListGroup.Item>
            ))}
          </ListGroup>
        </Col>
        <Col md={4}>
          <Card>
            <Card.Header>Podsumowanie</Card.Header>
            <Card.Body>
              <Card.Title>Suma całkowita: {basket.totalPrice} zł</Card.Title>
              <Card.Text>Liczba produktów: {basket.totalCount}</Card.Text>
              <Button variant="primary" className="w-100">
                Złóż zamówienie
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
});
