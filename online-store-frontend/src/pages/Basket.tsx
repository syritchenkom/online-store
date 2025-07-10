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
    return <div>Please log in to view your basket.</div>;
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
  }, [basket, user.isAuth]); // Removed basket from dependencies to avoid re-fetching on item removal

  const handleRemove = (deviceId: number) => {
    removeFromBasket(deviceId)
      .then(() => {
        // EN: To correctly reflect the removal of a single item (even if there are duplicates),
        // PL: Aby poprawnie odzwierciedlić usunięcie jednego przedmiotu (nawet jeśli są duplikaty),
        // EN: we find the index of the first item with the matching deviceId and remove it.
        // PL: znajdujemy indeks pierwszego przedmiotu z pasującym deviceId i usuwamy go.
        const itemIndex = basket.items.findIndex(
          (item) => item.device.id === deviceId
        );
        if (itemIndex > -1) {
          const newItems = [...basket.items];
          newItems.splice(itemIndex, 1);
          basket.setItems(newItems);
        }
      })
      .catch((e) => console.error("Failed to remove item from basket", e));
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

  if (basket.items.length === 0) {
    return (
      <Container
        className="d-flex justify-content-center align-items-center"
        style={{ height: "80vh" }}
      >
        <h2>Ваш кошик порожній</h2>
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      <h1>Ваш кошик</h1>
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
                    <p>{item.device.price} $</p>
                  </div>
                </div>
                <Button
                  variant="outline-danger"
                  onClick={() => handleRemove(item.device.id)}
                >
                  Видалити
                </Button>
              </ListGroup.Item>
            ))}
          </ListGroup>
        </Col>
        <Col md={4}>
          <Card>
            <Card.Header>Підсумок</Card.Header>
            <Card.Body>
              <Card.Title>Загальна сума: {basket.totalPrice} $</Card.Title>
              <Card.Text>Кількість товарів: {basket.totalCount}</Card.Text>
              <Button variant="primary" className="w-100">
                Оформити замовлення
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
});
