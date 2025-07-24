import { $authHost } from "./index";
import { IDevice } from "../store/DeviceStore";

// The structure of a basket item as returned from the backend
export interface IBasketItem {
    quantity: number;
    id: number;
    device: IDevice;
}

export interface IBasket {
    id: number;
    userId: number;
    basketDevices: IBasketItem[];
}

// The structure of the basket as returned from the backend
export const addToBasket = async (deviceId: number): Promise<IBasketItem> => {
    const { data } = await $authHost.post(`api/v1/basket`, { deviceId });
    return data;
}

export const fetchBasket = async (): Promise<IBasket> => {
    const { data } = await $authHost.get(`api/v1/basket`);
    return data;
}

export const removeFromBasket = async (deviceId: number): Promise<{ message: string }> => {
    const { data } = await $authHost.delete(`api/v1/basket/${deviceId}`);
    return data;
}