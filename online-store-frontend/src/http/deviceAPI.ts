import { $authHost, $host } from "./index";
import { IType, IBrand, IDevice, IFullDevice } from "../store/DeviceStore";

// Типи для об'єктів, що створюються (Data Transfer Objects)
type CreateTypeDto = Pick<IType, 'name'>;
type CreateBrandDto = Pick<IBrand, 'name'>;

// Тип для відповіді від сервера при запиті списку пристроїв
interface IDevicesResponse {
  count: number;
  rows: IDevice[];
}

export const createType = async (type: CreateTypeDto): Promise<IType> => {
  const {data} = await $authHost.post("api/type", type);
  return data;
}

export const fetchTypes = async (): Promise<IType[]> => {
    const {data} = await $host.get("api/type");
    return data;
}

export const deleteType = async (id: number): Promise<{ message: string }> => {
  const { data } = await $authHost.delete(`api/type/${id}`);
  return data;
};

export const createBrand = async (brand: CreateBrandDto): Promise<IBrand> => {
  const {data} = await $authHost.post("api/brand", brand);
  return data;
}

export const fetchBrands = async (): Promise<IBrand[]> => {
    const {data} = await $host.get("api/brand");
    return data;
}

export const createDevice = async (device: FormData): Promise<IDevice> => {
  const {data} = await $authHost.post("api/device", device);
  return data;
}

export const fetchDevices = async (
    typeId: number | null, 
    brandId: number | null, 
    page: number, 
    limit: number = 9
): Promise<IDevicesResponse> => {
    const {data} = await $host.get("api/device", {
        params: {
            typeId,
            brandId,
            page,
            limit
        }
    });
    return data;
}

export const fetchOneDevice = async (id: number): Promise<IFullDevice> => {
    const {data} = await $host.get("api/device/" + id);
    return data;
}

export const setDeviceRating = async (deviceId: number, rate: number): Promise<{ message: string, newRating: number }> => {
    const { data } = await $authHost.post('api/rating', { deviceId, rate });
    return data;
};
