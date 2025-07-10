import { makeAutoObservable } from "mobx"

// Бажано визначити інтерфейс для об'єкта користувача, якщо він має структуру
export interface IUser {
    id?: number;
    email?: string;
    role?: string;
}

export function createUserStore() {
    const store = {
        // За замовчуванням користувач не авторизований.
        // Стан зміниться на true після успішної перевірки токена (check) при завантаженні додатку.
        _isAuth: false as boolean,
        _user: {} as IUser, // Або {} as any, якщо структура користувача невідома/дуже динамічна

        setIsAuth(bool: boolean): void {
            this._isAuth = bool;
        },

        setUser(user: IUser): void { // Або any
            this._user = user;
        },

        get isAuth(): boolean {
            return this._isAuth;
        },

        get user(): IUser { // Або any
            return this._user;
        }
    };

    makeAutoObservable(store);
    return store;
}