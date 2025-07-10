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

  // PL: Zabezpieczenie przed renderowaniem komponentu poza dostawcą kontekstu
  if (!contextValue) {
    return <div>Error: Component is not wrapped in Context.Provider</div>;
  }
  const { user, basket } = contextValue;

  // PL: 1. Inicjalizujemy stan jako null, aby wyraźnie odróżnić "jeszcze nie załadowano" od "załadowano, ale pusto"
  const [device, setDevice] = useState<IFullDevice | null>(null);
  const [ratingHover, setRatingHover] = useState(0);
  const [loading, setLoading] = useState(true);
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    // PL: 2. Sprawdzamy, czy 'id' jest w URL, w przeciwnym razie żądanie nie ma sensu
    if (id && !isNaN(Number(id))) {
      setLoading(true);
      // PL: 3. Konwertujemy 'id' (który jest stringiem) na liczbę dla żądania API
      fetchOneDevice(Number(id))
        .then((data) => setDevice(data)) // PL: Teraz rzutowanie typu nie jest potrzebne, ponieważ jest spójne
        .catch((e) => console.error("Failed to fetch device:", e)) // PL: Dodajemy obsługę błędów
        .finally(() => setLoading(false)); // PL: Zatrzymujemy ładowanie w każdym przypadku
    } else {
      // PL: Jeśli id jest nieobecne lub nie jest liczbą, zatrzymujemy ładowanie
      // PL: i ustawiamy device na null, aby pokazać "Urządzenie nie znaleziono"
      setLoading(false);
      setDevice(null);
    }
    // PL: 4. Dodajemy 'id' do tablicy zależności, aby komponent aktualizował się, jeśli id w URL się zmieni
  }, [id]);

  // PL: 5. Pokazujemy spinner, dopóki dane się ładują
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

  // PL: 6. Pokazujemy komunikat, jeśli urządzenie nie zostało znalezione po załadowaniu
  if (!device) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ height: "100vh" }}
      >
        Nie znaleziono urządzenia
      </div>
    );
  }

  const handleRateDevice = async (rate: number) => {
    if (!user.isAuth) {
      alert("Aby wystawić ocenę, proszę się zalogować.");
      navigate(LOGIN_ROUTE);
      return;
    }
    if (device) {
      try {
        const response = await setDeviceRating(device.id, rate);
        // PL: Aktualizujemy ocenę urządzenia na stronie, aby użytkownik od razu widział wynik
        setDevice((prevDevice) =>
          prevDevice ? { ...prevDevice, rating: response.newRating } : null
        );
        alert("Dziękujemy za Twoją ocenę!");
      } catch (e: any) {
        alert(e.response?.data?.message || "Nie udało się wystawić oceny.");
        console.error("Failed to set rating:", e);
      }
    }
  };

  const handleAddToBasket = () => {
    if (device) {
      addToBasket(device.id)
        .then(async () => {
          alert(`Urządzenie "${device.name}" dodane do koszyka!`);
          // EN: After adding, we re-fetch the basket to update the state and the counter in the NavBar.
          // PL: Po dodaniu, ponownie pobieramy koszyk, aby zaktualizować stan i licznik w NavBar.

          const data = await fetchBasket();
          basket.setItems(data.basket_devices || []);
        })
        .catch((e) => {
          alert(
            e.response?.data?.message ||
              "Nie udało się dodać produktu do koszyka."
          );
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
                <h5>Oceń produkt:</h5>
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
            <h3>Od: {device.price} zł</h3>
            <Button variant={"outline-dark"} onClick={handleAddToBasket}>
              Dodaj do koszyka
            </Button>
          </Card>
        </Col>
      </Row>
      <Row className="d-flex flex-column m-3">
        <h1>Charakterystyka</h1>
        {device.info.map((info, index) => (
          <Row
            key={info.id}
            className="mt-2 p-2"
            style={{
              background: index % 2 === 0 ? "lightgray" : "transparent",
              padding: 10,
            }}
          >
            {info.title}: {info.description}
          </Row>
        ))}
      </Row>
    </Container>
  );
});
