import { makeAutoObservable } from "mobx";
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
            // EN: Correctly calculate the total number of items by summing their quantities.
            // PL: Poprawnie oblicz całkowitą liczbę przedmiotów, sumując ich ilości.
            return this._items.reduce((sum, item) => sum + item.quantity, 0);
        },

        get totalPrice(): number {
            // EN: Correctly calculate the total price by multiplying the price of each item by its quantity.
            // PL: Poprawnie oblicz całkowitą cenę, mnożąc cenę każdego przedmiotu przez jego ilość.
            return this._items.reduce((sum, item) => sum + (item.device.price * item.quantity), 0);
        },
        clearBasket() {
            this._items = []; // PL: Czyścimy koszyk
        }
        
    };

    makeAutoObservable(store);
    return store;
}