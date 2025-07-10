import React, { useContext, useEffect } from "react";
import { Col, Container, Row } from "react-bootstrap";
import TypeBar from "../components/TypeBar";
import BrandBar from "../components/BrandBar";
import DeviceList from "../components/DeviceList";
import { observer } from "mobx-react-lite";
import { Context } from "../index";
import { fetchBrands, fetchDevices, fetchTypes } from "../http/deviceAPI";
import Pages from "../components/Pages";

export const Shop = observer(() => {
  const contextValue = useContext(Context);

  // Перевірка, чи існує контекст, щоб уникнути помилок під час рендеру
  if (!contextValue) {
    return <div>Error: Shop component is not wrapped in Context.Provider</div>;
  }
  const { device } = contextValue;

  useEffect(() => {
    // Завантажуємо типи та бренди один раз при монтуванні компонента
    fetchTypes().then((data) => device.setTypes(data));
    fetchBrands().then((data) => device.setBrands(data));
  }, []); // Порожній масив залежностей гарантує, що це виконається лише один раз

  useEffect(() => {
    // Цей ефект завантажує пристрої при першому рендері та при зміні фільтрів/сторінки
    fetchDevices(
      device.selectedType?.id ?? null, // Перетворюємо undefined на null
      device.selectedBrand?.id ?? null, // Перетворюємо undefined на null
      device.page,
      device.limit // Використовуємо ліміт зі стору
    ).then((data) => {
      device.setDevices(data.rows);
      device.setTotalCount(data.count);
    });
  }, [device.page, device.selectedType, device.selectedBrand]);

  return (
    <Container>
      <Row className="mt-2">
        <Col md={3}>
          <TypeBar />
        </Col>
        <Col md={9}>
          <BrandBar />
          <DeviceList />
          <Pages />
        </Col>
      </Row>
    </Container>
  );
});
