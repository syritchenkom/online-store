import AdminPage from "./pages/AdminPage";
import { Auth } from "./pages/Auth";
import { Basket } from "./pages/Basket";
import CheckoutPage from "./pages/CheckoutPage";
import { DevicePage } from "./pages/DevicePage";
import { Shop } from "./pages/Shop";
import {
  ADMIN_ROUTE,
  BASKET_ROUTE,
  CHECKOUT_ROUTE,
  DEVICE_ROUTE,
  LOGIN_ROUTE,
  REGISTRATION_ROUTE,
  SHOP_ROUTE,
} from "./utils/consts";

export const authRoutes = [
  {
    path: ADMIN_ROUTE,
    Component: AdminPage,
  },
  {
    path: BASKET_ROUTE,
    Component: Basket,
  },
  {
    path: CHECKOUT_ROUTE,
    Component: CheckoutPage,
  },
];

export const publicRoutes = [
  {
    path: SHOP_ROUTE,
    Component: Shop,
  },
  {
    path: LOGIN_ROUTE,
    Component: Auth,
  },
  {
    path: REGISTRATION_ROUTE,
    Component: Auth,
  },
  {
    path: DEVICE_ROUTE + "/:id",
    Component: DevicePage,
  },
];
