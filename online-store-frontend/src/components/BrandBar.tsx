import { observer } from "mobx-react-lite";
import React, { useContext } from "react";
import { Context } from "..";
import { Card } from "react-bootstrap";

const BrandBar = observer(() => {
  const contextValue = useContext(Context);

  if (!contextValue) {
    // This should not happen if TypeBar is always rendered within Context.Provider
    // You can return null, a loading indicator, or throw an error.
    return null;
  }
  const { device } = contextValue;
  return (
    // <Row className="d-flex">
    <div className="d-flex flex-wrap gap-2 mb-3">
      {device?.brands.map((brand) => (
        <Card
          style={{ cursor: "pointer" }}
          key={brand.id}
          className="p-3"
          onClick={() => device.setSelectedBrand(brand)}
          border={brand.id === device.selectedBrand?.id ? "danger" : "light"}
        >
          {brand.name}
        </Card>
      ))}
    </div>
  );
});

export default BrandBar;
