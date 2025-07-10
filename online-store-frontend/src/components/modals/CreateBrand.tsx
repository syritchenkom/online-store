import React, { useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { createBrand } from "../../http/deviceAPI";

interface CreateBrandProps {
  // Змінено назву інтерфейсу на CreateBrandProps
  show: boolean;
  onHide: () => void;
}

const CreateBrand: React.FC<CreateBrandProps> = ({ show, onHide }) => {
  const [value, setValue] = useState(""); // Додано стан для поля вводу

  const addBrand = async () => {
    try {
      await createBrand({ name: value });
      setValue(""); // Очищуємо поле після успішного додавання
      onHide(); // Закриваємо модальне вікно
    } catch (e: any) {
      alert(e.response?.data?.message || "Помилка при додаванні бренду");
    }
  };

  return (
    <Modal show={show} onHide={onHide} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Додати бренд
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Control
            value={value}
            onChange={(e) => setValue(e.target.value)}
            type="text"
            placeholder="Введіть назву бренду"
          />
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="outline-danger" onClick={onHide}>
          Закрити
        </Button>
        <Button variant="outline-success" onClick={addBrand}>
          Додати
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default CreateBrand;
