import { observer } from "mobx-react-lite";
import React, { useContext } from "react";
import { Context } from "..";
import DeviceItem from "./DeviceItem";
import { Row } from "react-bootstrap";

const DeviceList = observer(() => {
  const contextValue = useContext(Context);

  if (!contextValue) {
    // This should not happen if TypeBar is always rendered within Context.Provider
    // You can return null, a loading indicator, or throw an error.
    return null;
  }
  const { device } = contextValue;
  return (
    <Row>
      {device.devices.map((device) => (
        <DeviceItem key={device.id} device={device} />
      ))}
    </Row>
  );
});

export default DeviceList;
