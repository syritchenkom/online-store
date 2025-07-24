import React, { useState, useContext } from "react";
import { Button, Form, Alert, Spinner } from "react-bootstrap";
import { createOrder } from "../http/orderAPI";
import { Context } from "..";

type PaymentMethod =
  | "przelew"
  | "gpay"
  | "blik"
  | "kartaOnline"
  | "payuLater"
  | "cash"
  | "cardOnDelivery";

export const OrderForm: React.FC = () => {
  const context = useContext(Context);
  if (!context)
    throw new Error("OrderForm must be used within a Context.Provider");
  const { basket } = context;

  const [notes, setNotes] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("przelew");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName.trim()) {
      alert("Imię jest wymagane");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const response = await createOrder({
        notes,
        firstName,
        lastName,
        paymentMethod,
      });

      if (response.redirectUri) {
        // If there's a payment URL, redirect the user to it.
        window.location.href = response.redirectUri;
      } else {
        // If no redirect (e.g., cash on delivery), show success message.
        setSuccess(true);
        basket.clearBasket();
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <Alert variant="success">
        <h4>Dziękujemy za zamówienie!</h4>
        <p>
          Twoje zamówienie zostało pomyślnie złożone. Otrzymasz powiadomienie
          e-mail z dalszymi szczegółami.
        </p>
      </Alert>
    );
  }

  return (
    <Form onSubmit={handleSubmit} className="p-4 border rounded">
      <h4 className="mb-3">Szczegóły zamówienia</h4>
      <Form.Group className="mb-3">
        <Form.Label className="font-semibold">Notatki dla dostawcy</Form.Label>
        <Form.Control
          as="textarea"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="np. 3 piętro, kod do klatki"
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label className="font-semibold">
          Imię<span className="text-danger">*</span>
        </Form.Label>
        <Form.Control
          type="text"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          required
        />
        <Form.Label className="mt-2 font-semibold">Nazwisko</Form.Label>
        <Form.Control
          type="text"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <h5 className="font-bold">Metoda płatności</h5>

        <div className="border rounded p-3 mt-2">
          <h6>ZAPŁAĆ ONLINE</h6>
          {[
            { label: "Przelew online", value: "przelew" },
            { label: "Google Pay", value: "gpay" },
            { label: "BLIK", value: "blik" },
            { label: "Karta", value: "kartaOnline" },
            { label: "PayU Płacę później", value: "payuLater" },
          ].map(({ label, value }) => (
            <Form.Check
              key={value}
              type="radio"
              id={`payment-${value}`}
              label={label}
              name="payment"
              value={value}
              checked={paymentMethod === value}
              onChange={() => setPaymentMethod(value as PaymentMethod)}
            />
          ))}
        </div>

        <div className="border rounded p-3 mt-3">
          <h6>ZAPŁAĆ PRZY ODBIORZE</h6>
          {[
            { label: "Gotówka", value: "cash" },
            { label: "Karta (Przy odbiorze)", value: "cardOnDelivery" },
          ].map(({ label, value }) => (
            <Form.Check
              key={value}
              type="radio"
              id={`payment-${value}`}
              label={label}
              name="payment"
              value={value}
              checked={paymentMethod === value}
              onChange={() => setPaymentMethod(value as PaymentMethod)}
            />
          ))}
        </div>
      </Form.Group>

      <div className="d-grid">
        <Button
          type="submit"
          variant="success"
          disabled={loading || basket.items.length === 0}
        >
          {loading ? (
            <Spinner
              as="span"
              animation="border"
              size="sm"
              role="status"
              aria-hidden="true"
            />
          ) : (
            `Złóż zamówienie (${basket.totalPrice} zł)`
          )}
        </Button>
      </div>

      {error && (
        <Alert variant="danger" className="mt-3">
          {error}
        </Alert>
      )}
    </Form>
  );
};
