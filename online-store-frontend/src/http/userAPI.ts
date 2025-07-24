import { $authHost, $host } from "./index";
import { jwtDecode } from "jwt-decode"; // Змінено імпорт для сумісності з jwt-decode v4+

// Інтерфейс для даних користувача, які ми отримуємо з JWT токена.
// Важливо, щоб поля (id, email, role) точно відповідали тим, що генерує ваш бекенд.
export interface IUser {
  id: number;
  email: string;
  role: string;
}

export const registration = async (email: string, password: string) => {
  const {data} = await $host.post("api/v1/auth/registration", { email, password});
  localStorage.setItem("token", data.token); // Зберігаємо токен після реєстрації
  return jwtDecode<IUser>(data.token);
}

export const fetchAllUsers = async (): Promise<IUser[]> => {
  const {data} = await $authHost.get("api/v1/users");
  return data;
}

export const deleteUser = async (id: number): Promise<{message: string}> => {
  const {data} = await $authHost.delete(`api/v1/users/${id}`);
  return data;
}

export const login = async (email: string, password: string) => {
    const {data} = await $host.post("api/v1/auth/login", { email, password});
    localStorage.setItem("token", data.token); // Зберігаємо токен після входу
    return jwtDecode<IUser>(data.token);
}

export const check = async () => {
    // The correct endpoint for checking authentication is /api/v1/auth/check
    const { data } = await $authHost.get("api/v1/auth/check");
   // Якщо бекенд повертає новий токен (наприклад, для оновлення), його потрібно зберегти
    if (data.token) {
        localStorage.setItem("token", data.token);
    }
    return jwtDecode<IUser>(data.token); // Повертаємо декодовані дані користувача
}
