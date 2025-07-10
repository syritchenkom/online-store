import React, { useContext, useEffect, useState } from "react";
import {
  Button,
  Card,
  Col,
  Container,
  Image,
  Row,
  Spinner,
} from "react-bootstrap";
import bigStar from "../assets/bigStar.png";
import { useNavigate, useParams } from "react-router-dom"; // Імпортуємо хук для роботи з параметрами URL
import { observer } from "mobx-react-lite"; // Імпортуємо observer
import { IFullDevice } from "../store/DeviceStore"; // Імпортуємо централізований тип
import { fetchOneDevice, setDeviceRating } from "../http/deviceAPI"; // Імпортуємо функцію API
import { addToBasket, fetchBasket } from "../http/basketAPI";
import { Context } from "..";
import { LOGIN_ROUTE } from "../utils/consts";

export const DevicePage = observer(() => {
  const contextValue = useContext(Context);
  const navigate = useNavigate();

  // Захист від випадку, коли компонент рендериться поза провайдером контексту
  if (!contextValue) {
    return <div>Error: Component is not wrapped in Context.Provider</div>;
  }
  const { user, basket } = contextValue;

  // 1. Ініціалізуємо стан як null, щоб чітко розрізняти "ще не завантажено" і "завантажено, але порожньо"
  const [device, setDevice] = useState<IFullDevice | null>(null);
  const [ratingHover, setRatingHover] = useState(0);
  const [loading, setLoading] = useState(true);
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    // 2. Перевіряємо, чи є 'id' в URL, інакше запит не має сенсу
    if (id && !isNaN(Number(id))) {
      setLoading(true);
      // 3. Перетворюємо 'id' (який є рядком) на число для API-запиту
      fetchOneDevice(Number(id))
        .then((data) => setDevice(data)) // Тепер приводити тип не потрібно, бо він узгоджений
        .catch((e) => console.error("Failed to fetch device:", e)) // Додаємо обробку помилок
        .finally(() => setLoading(false)); // Зупиняємо завантаження в будь-якому випадку
    } else {
      // Якщо id відсутній або не є числом, зупиняємо завантаження
      // і встановлюємо device в null, щоб показати "Пристрій не знайдено"
      setLoading(false);
      setDevice(null);
    }
    // 4. Додаємо 'id' в масив залежностей, щоб компонент оновлювався, якщо id в URL зміниться
  }, [id]);

  // 5. Показуємо спіннер, поки дані завантажуються
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

  // 6. Показуємо повідомлення, якщо пристрій не знайдено після завантаження
  if (!device) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ height: "100vh" }}
      >
        Пристрій не знайдено
      </div>
    );
  }

  const handleRateDevice = async (rate: number) => {
    if (!user.isAuth) {
      alert("Щоб поставити оцінку, будь ласка, авторизуйтесь.");
      navigate(LOGIN_ROUTE);
      return;
    }
    if (device) {
      try {
        const response = await setDeviceRating(device.id, rate);
        // Оновлюємо рейтинг пристрою на сторінці, щоб користувач одразу бачив результат
        setDevice((prevDevice) =>
          prevDevice ? { ...prevDevice, rating: response.newRating } : null
        );
        alert("Дякуємо за вашу оцінку!");
      } catch (e: any) {
        alert(e.response?.data?.message || "Не вдалося поставити оцінку.");
        console.error("Failed to set rating:", e);
      }
    }
  };

  const handleAddToBasket = () => {
    if (device) {
      addToBasket(device.id)
        .then(async () => {
          alert(`Device "${device.name}" added to basket.}`);
          // EN: After adding, we re-fetch the basket to update the state and the counter in the NavBar.
          // PL: Po dodaniu, ponownie pobieramy koszyk, aby zaktualizować stan i licznik w NavBar.

          const data = await fetchBasket();
          basket.setItems(data.basket_devices || []);
        })
        .catch((e) => {
          alert(e.response?.data?.message || "Failed to add device to basket.");
        });
    }
  };

  return (
    <Container className="mt-3">
      <Row>
        <Col md={4}>
          <Image
            fluid
            width={300}
            height={300}
            src={process.env.REACT_APP_API_URL + device.img}
          />
        </Col>
        <Col md={4}>
          <Row className="d-flex flex-column align-items-center text-center">
            <h2>{device.name}</h2>
            <div
              className="d-flex align-items-center justify-content-center"
              style={{
                background: `url(${bigStar}) no-repeat center center`,
                width: 240,
                height: 240,
                backgroundSize: "cover",
                fontSize: 64,
              }}
            >
              {device.rating}
            </div>
            {user.isAuth && (
              <div className="mt-3">
                <h5>Оцініть товар:</h5>
                <div
                  className="d-flex align-items-center justify-content-center"
                  onMouseLeave={() => setRatingHover(0)}
                >
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span
                      key={star}
                      className="display-4"
                      style={{
                        cursor: "pointer",
                        color: star <= ratingHover ? "#ffc107" : "#e4e5e9",
                      }}
                      onMouseEnter={() => setRatingHover(star)}
                      onClick={() => handleRateDevice(star)}
                    >
                      &#9733;
                    </span>
                  ))}
                </div>
              </div>
            )}
          </Row>
        </Col>
        <Col md={4}>
          <Card
            className="d-flex flex-column align-items-center justify-content-around"
            style={{
              width: 300,
              height: 300,
              fontSize: 32,
              border: "5px solid lightgray",
            }}
          >
            <h3>From: {device.price} $</h3>
            <Button variant={"outline-dark"} onClick={handleAddToBasket}>
              Add to basket
            </Button>
          </Card>
        </Col>
      </Row>
      <Row className="d-flex flex-column m-3">
        <h1>Characteristics</h1>
        {device.info.map(
          (
            info,
            index // Перебираємо характеристики з завантаженого пристрою
          ) => (
            <Row
              key={info.id} // Використовуємо унікальний id характеристики як ключ
              className="mt-2 p-2"
              style={{
                background: index % 2 === 0 ? "lightgray" : "transparent",
                padding: 10,
              }}
            >
              {info.title}: {info.description}
            </Row>
          )
        )}
      </Row>
    </Container>
  );
});
