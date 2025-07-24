import React, { useContext, useState } from "react";
import { Button, Dropdown, Form, Modal, Row, Col } from "react-bootstrap";
import { Context } from "../../index"; // Припускаємо, що Context знаходиться на два рівні вище
import { observer } from "mobx-react-lite"; // Імпортуємо observer
import { createDevice } from "../../http/deviceAPI";

interface CreateDeviceProps {
  show: boolean;
  onHide: () => void;
}

const CreateDevice: React.FC<CreateDeviceProps> = observer(
  ({ show, onHide }) => {
    const contextValue = useContext(Context);

    if (!contextValue) {
      // Цей випадок не повинен траплятися, якщо AppRouter завжди рендериться всередині Provider
      return null;
    }
    const { device } = contextValue;

    const [name, setName] = useState("");
    const [price, setPrice] = useState(0);
    const [file, setFile] = useState<File | null>(null);
    const [info, setInfo] = useState<
      { title: string; description: string; number: number }[]
    >([]);

    const addInfo = () => {
      setInfo([...info, { title: "", description: "", number: Date.now() }]); // Використовуємо Date.now() як унікальний ключ
    };

    const removeInfo = (number: number) => {
      setInfo(info.filter((i) => i.number !== number));
    };

    const changeInfo = (
      key: "title" | "description",
      value: string,
      number: number
    ) => {
      setInfo(
        info.map((i) => (i.number === number ? { ...i, [key]: value } : i))
      );
    };

    const selectFile = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
        setFile(e.target.files[0]);
      }
    };

    const addDevice = async () => {
      try {
        const formData = new FormData();
        // Валідація перед відправкою
        if (
          name &&
          price > 0 &&
          file &&
          device.selectedBrand &&
          device.selectedType
        ) {
          formData.append("name", name);
          formData.append("price", String(price));
          formData.append("img", file);
          formData.append("brandId", String(device.selectedBrand.id));
          formData.append("typeId", String(device.selectedType.id));
          formData.append("info", JSON.stringify(info));

          await createDevice(formData);

          // Очищуємо форму та закриваємо модальне вікно
          setName("");
          setPrice(0);
          setFile(null);
          setInfo([]);
          device.setSelectedType(null);
          device.setSelectedBrand(null);
          onHide();
        } else {
          alert("Будь ласка, заповніть усі поля та виберіть тип/бренд.");
        }
      } catch (e: any) {
        alert(e.response?.data?.message || "Помилка при додаванні пристрою");
      }
    };

    return (
      <Modal show={show} onHide={onHide} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Додати Пристрій
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Dropdown className="mt-2 mb-2">
              <Dropdown.Toggle>
                {device.selectedType?.name || "Виберіть тип"}
              </Dropdown.Toggle>
              <Dropdown.Menu>
                {device.types.map((type) => (
                  <Dropdown.Item
                    onClick={() => device.setSelectedType(type)}
                    key={type.id}
                  >
                    {type.name}
                  </Dropdown.Item>
                ))}
              </Dropdown.Menu>
            </Dropdown>

            <Dropdown className="mt-2 mb-2">
              <Dropdown.Toggle>
                {device.selectedBrand?.name || "Виберіть бренд"}
              </Dropdown.Toggle>
              <Dropdown.Menu>
                {device.brands.map((brand) => (
                  <Dropdown.Item
                    onClick={() => device.setSelectedBrand(brand)}
                    key={brand.id}
                  >
                    {brand.name}
                  </Dropdown.Item>
                ))}
              </Dropdown.Menu>
            </Dropdown>

            <Form.Control
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-3"
              placeholder="Введіть назву пристрою"
            />
            <Form.Control
              value={price === 0 ? "" : price} // Відображаємо порожній рядок, якщо ціна 0
              onChange={(e) => setPrice(Number(e.target.value))}
              className="mt-3"
              placeholder="Введіть вартість пристрою"
              type="number"
            />
            <Form.Control className="mt-3" type="file" onChange={selectFile} />
            <hr />
            <Button variant={"outline-dark"} onClick={addInfo}>
              Додати нову характеристику
            </Button>
            {info.map((i) => (
              <Row className="mt-4" key={i.number}>
                <Col md={4}>
                  <Form.Control
                    value={i.title}
                    onChange={(e) =>
                      changeInfo("title", e.target.value, i.number)
                    }
                    placeholder="Введіть назву характеристики"
                  />
                </Col>
                <Col md={4}>
                  <Form.Control
                    value={i.description}
                    onChange={(e) =>
                      changeInfo("description", e.target.value, i.number)
                    }
                    placeholder="Введіть опис характеристики"
                  />
                </Col>
                <Col md={4}>
                  <Button
                    onClick={() => removeInfo(i.number)}
                    variant={"outline-danger"}
                  >
                    Видалити
                  </Button>
                </Col>
              </Row>
            ))}
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-danger" onClick={onHide}>
            Закрити
          </Button>
          <Button variant="outline-success" onClick={addDevice}>
            Додати
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }
);

export default CreateDevice;
