import { $authHost } from "./index";

interface OrderData {
    notes?: string;
    firstName: string;
    lastName?: string;
    paymentMethod: string;
}

interface CreateOrderResponse {
    order: any; // You can create a more specific IOrder interface later
    redirectUri?: string;
}

// This function will send a request to create an order from the current user's basket.
// The backend will handle all the logic of creating the order and clearing the basket.
export const createOrder = async (orderData: OrderData): Promise<CreateOrderResponse> => {
    // We don't need to send any body, the backend knows the user from the auth token.
    const { data } = await $authHost.post<CreateOrderResponse>('api/v1/orders', orderData);
    return data;
};