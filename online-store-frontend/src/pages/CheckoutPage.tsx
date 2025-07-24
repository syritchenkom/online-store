import React, { useContext } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  ListGroup,
  Image,
  Alert,
} from "react-bootstrap";
import { observer } from "mobx-react-lite";
import { Context } from "..";
import { OrderForm } from "../components/OrderForm";
import { Navigate } from "react-router-dom";
import { SHOP_ROUTE } from "../utils/consts";

const CheckoutPage = observer(() => {
  const context = useContext(Context);

  if (!context) {
    return (
      <Alert variant="danger">Application context is not available.</Alert>
    );
  }
  const { basket, user } = context;

  // If the user is not authenticated or the basket is empty, redirect them to the shop.
  // This prevents accessing the checkout page directly without items.
  if (!user.isAuth || basket.items.length === 0) {
    return <Navigate to={SHOP_ROUTE} />;
  }

  return (
    <Container className="mt-4">
      <h1>Szczegóły zamówienia</h1>
      <Row>
        {/* Order Summary Column */}
        <Col md={7} lg={8}>
          <Card>
            <Card.Header as="h5">Podsumowanie koszyka</Card.Header>
            <ListGroup variant="flush">
              {basket.items.map((item) => (
                <ListGroup.Item
                  key={item.id}
                  className="d-flex justify-content-between align-items-center"
                >
                  <div className="d-flex align-items-center">
                    <Image
                      src={process.env.REACT_APP_API_URL + item.device.img}
                      style={{ width: "60px", marginRight: "15px" }}
                      alt={item.device.name}
                      rounded
                    />
                    <div>
                      <div className="fw-bold">{item.device.name}</div>
                      <div className="text-muted">
                        {item.quantity} x {item.device.price.toFixed(2)} zł
                      </div>
                    </div>
                  </div>
                  <div className="fw-bold">
                    {(item.quantity * item.device.price).toFixed(2)} zł
                  </div>
                </ListGroup.Item>
              ))}
              <ListGroup.Item className="d-flex justify-content-between fw-bold fs-5">
                <span>Suma całkowita</span>
                <span>{basket.totalPrice.toFixed(2)} zł</span>
              </ListGroup.Item>
            </ListGroup>
          </Card>
        </Col>

        {/* Order Form Column */}
        <Col md={5} lg={4} className="mt-4 mt-md-0">
          <OrderForm />
        </Col>
      </Row>
    </Container>
  );
});

export default CheckoutPage;
