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
  const {data} = await $authHost.post("api/v1/types", type);
  return data;
}

export const fetchTypes = async (): Promise<IType[]> => {
    const {data} = await $host.get("api/v1/types");
    return data;
}

export const deleteType = async (id: number): Promise<{ message: string }> => {
  const { data } = await $authHost.delete(`api/v1/types/${id}`);
  return data;
};

export const createBrand = async (brand: CreateBrandDto): Promise<IBrand> => {
  const {data} = await $authHost.post("api/v1/brands", brand);
  return data;
}

export const fetchBrands = async (): Promise<IBrand[]> => {
    const {data} = await $host.get("api/v1/brands");
    return data;
}

export const createDevice = async (device: FormData): Promise<IDevice> => {
  const {data} = await $authHost.post("api/v1/devices", device);
  return data;
}

export const fetchDevices = async (
    typeId: number | null, 
    brandId: number | null, 
    page: number, 
    limit: number = 9
): Promise<IDevicesResponse> => {
    const {data} = await $host.get("api/v1/devices", {
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
    const {data} = await $host.get("api/v1/devices/" + id);
    return data;
}

export const setDeviceRating = async (deviceId: number, rate: number): Promise<{ message: string, newRating: number }> => {
    const { data } = await $authHost.post('api/v1/ratings', { deviceId, rate });
    return data;
};
