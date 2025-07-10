import { $authHost, $host } from "./index";
import { jwtDecode } from "jwt-decode"; // Змінено імпорт для сумісності з jwt-decode v4+

// Інтерфейс для даних користувача, які ми отримуємо з JWT токена.
// Важливо, щоб поля (id, email, role) точно відповідали тим, що генерує ваш бекенд.
interface DecodedUser {
  id: number;
  email: string;
  role: string;
}

export const registration = async (email: string, password: string) => {
  const {data} = await $host.post("api/user/registration", { email, password});
  localStorage.setItem("token", data.token); // Зберігаємо токен після реєстрації
  return jwtDecode<DecodedUser>(data.token);
}

export const login = async (email: string, password: string) => {
    const {data} = await $host.post("api/user/login", { email, password});
    localStorage.setItem("token", data.token); // Зберігаємо токен після входу
    return jwtDecode<DecodedUser>(data.token);
}

export const check = async () => {
    // Для перевірки автентифікації використовуємо $authHost та GET запит
    // Припускаємо, що бекенд має ендпоінт /api/user/auth, який повертає дані користувача та/або оновлений токен
    const { data } = await $authHost.get("api/user/auth");
    // Якщо бекенд повертає новий токен (наприклад, для оновлення), його потрібно зберегти
    if (data.token) {
        localStorage.setItem("token", data.token);
    }
    return jwtDecode<DecodedUser>(data.token); // Повертаємо декодовані дані користувача
}
