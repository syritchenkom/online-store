import React, { useContext } from "react";
import { observer } from "mobx-react-lite";
import { Context } from "../index";
import { Pagination } from "react-bootstrap";

const Pages = observer(() => {
  const contextValue = useContext(Context);

  // Захист від випадку, коли компонент рендериться поза провайдером контексту
  if (!contextValue) {
    // Це може статися, якщо компонент використовується в непередбаченому місці.
    return null;
  }
  const { device } = contextValue;

  // Розраховуємо загальну кількість сторінок
  const pageCount = Math.ceil(device.totalCount / device.limit);
  const pages = [];

  // Створюємо масив з номерами сторінок
  for (let i = 0; i < pageCount; i++) {
    pages.push(i + 1);
  }

  // Немає сенсу показувати пагінацію, якщо сторінка всього одна (або менше)
  if (pageCount <= 1) {
    return null;
  }

  return (
    <Pagination className="mt-5">
      {pages.map((page) => (
        <Pagination.Item
          key={page}
          active={device.page === page}
          onClick={() => device.setPage(page)}
        >
          {page}
        </Pagination.Item>
      ))}
    </Pagination>
  );
});

export default Pages;
