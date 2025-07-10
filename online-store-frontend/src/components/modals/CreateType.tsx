import React, { useState } from "react";
import { Button, Modal, Form } from "react-bootstrap";
import { createType } from "../../http/deviceAPI";

interface CreateTypeProps {
  show: boolean;
  onHide: () => void;
}

const CreateType: React.FC<CreateTypeProps> = ({ show, onHide }) => {
  const [value, setValue] = useState("");

  const addType = async () => {
    try {
      await createType({ name: value });
      setValue(""); // Очищуємо поле після успішного додавання
      onHide(); // Закриваємо модальне вікно
    } catch (e: any) {
      alert(e.response?.data?.message || "Помилка при додаванні типу");
    }
  };

  return (
    <Modal show={show} onHide={onHide} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">Додати тип</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Control
            value={value}
            onChange={(e) => setValue(e.target.value)}
            type="text"
            placeholder="Введіть назву типу"
          />
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="outline-danger" onClick={onHide}>
          Закрити
        </Button>
        <Button variant="outline-success" onClick={addType}>
          Додати
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default CreateType;
