import React, { useContext } from "react";
import { Routes, Route, Navigate } from "react-router-dom"; // Змінено імпорти
import { authRoutes, publicRoutes } from "../routes";
import { SHOP_ROUTE } from "../utils/consts";
import { observer } from "mobx-react-lite";
// import { useAppContext } from "../hooks/useAppContext";
import { Context } from "../index"; // Імпортуємо Context

export const AppRouter = observer(() => {
  const contextValue = useContext(Context);
  console.log("contextValue", contextValue);

  if (!contextValue) {
    // Цей випадок не повинен траплятися, якщо AppRouter завжди рендериться всередині Provider
    // Можна повернути null, компонент завантаження або кинути помилку,
    // залежно від бажаної поведінки.
    return null;
  }
  const { user } = contextValue;
  console.log("user", user);

  return (
    <Routes>
      {user.isAuth &&
        authRoutes.map(({ path, Component }) => (
          <Route key={path} path={path} element={<Component />} /> // Змінено component на element
        ))}
      {publicRoutes.map(({ path, Component }) => (
        <Route key={path} path={path} element={<Component />} /> // Змінено component на element
      ))}
      <Route path="*" element={<Navigate to={SHOP_ROUTE} replace />} />
      {/* Замінено Redirect на Navigate для "не знайдено" */}
    </Routes>
  );
});
