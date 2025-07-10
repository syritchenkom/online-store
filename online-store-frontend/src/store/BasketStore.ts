import {  makeAutoObservable } from "mobx";
import {IBasketItem} from "../http/basketAPI";

export function createBasketStore() {
    const store = {
        _items: [] as IBasketItem[], // Ініціалізуємо масив для зберігання товарів у кошику

        setItems(items: IBasketItem[]) {
            this._items = items;
        },

        addItem(item: IBasketItem) {
            this._items.push(item);
        },

        removeItem(itemId: number) {
            this._items = this._items.filter(item => item.id !== itemId);
        },

        get items(): IBasketItem[] {
            return this._items;
        },

        get totalCount(): number {
            return this._items.length; // Повертаємо кількість товарів у кошику
        },

        get totalPrice(): number {
            return this._items.reduce((sum, item) => {
                return sum + item.device.price;
            }, 0);
        },
        clearBasket() {
            this._items = []; // Очищаємо кошик
        }
        
    };

    makeAutoObservable(store);
    return store;
}