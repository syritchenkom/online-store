import React, { useContext, useMemo } from "react";
import { Card, Col, Image } from "react-bootstrap";
import { observer } from "mobx-react-lite";
import star from "../assets/star.png";
import { IDevice } from "../store/DeviceStore";
import { useNavigate } from "react-router-dom";
import { DEVICE_ROUTE } from "../utils/consts";
import { Context } from "..";

interface DeviceItemProps {
  device: IDevice;
}

const DeviceItem: React.FC<DeviceItemProps> = observer(({ device }) => {
  const { device: deviceStore } = useContext(Context)!;
  const navigate = useNavigate();

  console.log("Device fields:", device.brandId);

  // useMemo допомагає уникнути повторного обчислення бренду при кожному рендері.
  // const brand = deviceStore.brands.find((b) => b.id === device.brandId);
  const brand = useMemo(() => {
    return deviceStore.brands.find((b) => b.id === device.brandId);
  }, [deviceStore.brands, device.brandId]);

  return (
    <Col
      md={3}
      className="mt-3"
      onClick={() => navigate(DEVICE_ROUTE + "/" + device.id)}
    >
      <Card style={{ width: 150, cursor: "pointer" }} border={"light"}>
        <Image
          width={150}
          height={150}
          src={process.env.REACT_APP_API_URL + device.img}
        />
        <div className="text-black-50 mt-1 d-flex justify-content-between align-items-center">
          <div>{brand?.name || "Nieznana marka"}</div>
          <div className="d-flex align-items-center">
            <div>{device.rating}</div>
            <Image width={18} height={18} src={star} className="ms-1" />
          </div>
        </div>
        <div className="fw-bold">{device.name}</div>
      </Card>
    </Col>
  );
});

export default DeviceItem;
