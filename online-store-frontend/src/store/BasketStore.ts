import {  makeAutoObservable } from "mobx";
import {IBasketItem} from "../http/basketAPI";

export function createBasketStore() {
    const store = {
        _items: [] as IBasketItem[], // PL: Inicjalizujemy tablicę do przechowywania produktów w koszyku

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
            return this._items.length; // PL: Zwracamy liczbę produktów w koszyku
        },

        get totalPrice(): number {
            return this._items.reduce((sum, item) => {
                return sum + item.device.price;
            }, 0);
        },
        clearBasket() {
            this._items = []; // PL: Czyścimy koszyk
        }
        
    };

    makeAutoObservable(store);
    return store;
}