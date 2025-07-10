import { makeAutoObservable } from "mobx"

export interface IType {
    id: number;
    name: string;
}

export interface IBrand {
    id: number;
    name: string;
}

export interface IDevice {
    id: number;
    name: string;
    price: number;
    rating: number;
    img: string;
    // Важливо додати brandId та typeId для зв'язків та фільтрації
    brandId: number;
    typeId: number;
}

// Інтерфейс для характеристик пристрою, який можна використовувати в усьому додатку
export interface IDeviceInfo {
  id: number;
  title: string;
  description: string;
}

// Розширений інтерфейс для сторінки одного пристрою, що включає характеристики
export interface IFullDevice extends IDevice {
  info: IDeviceInfo[];
}

export function createDeviceStore() {
    const store = {
        _types: [] as IType[],
        _brands: [] as IBrand[],
        _devices: [] as IDevice[],
        _selectedType: null as IType | null,
        _selectedBrand: null as IBrand | null,
        _page: 1,
        _totalCount: 0,
        _limit: 3, // Встановіть бажаний ліміт за замовчуванням

        setTypes(types: IType[]){
            this._types = types;
        },

        setBrands(brands: IBrand[]){
            this._brands = brands;
        },
        
        setDevices(devices: IDevice[]){
            this._devices = devices;
        },

        setSelectedType(type: IType | null){
            this.setPage(1); // Скидаємо сторінку при зміні фільтра
            this._selectedType = type;
        },

        setSelectedBrand(brand: IBrand | null) {
            this.setPage(1); // Скидаємо сторінку при зміні фільтра
            this._selectedBrand = brand;
        },

        setPage(page: number) {
            this._page = page;
        },

        setTotalCount(count: number) {
            this._totalCount = count;
        },

        // Getters
        get types(): IType[]{
            return this._types;
        },

        get brands(): IBrand[]{
            return this._brands;
        },
        
        get devices(): IDevice[]{
            return this._devices;
        },

        get selectedType(): IType | null {
            return this._selectedType;
        },

        get selectedBrand(): IBrand | null {
            return this._selectedBrand;
        },

        get totalCount(): number {
            return this._totalCount;
        },

        get page(): number {
            return this._page;
        },
        
        get limit(): number {
            return this._limit;
        }
    };

    makeAutoObservable(store);
    return store;
}