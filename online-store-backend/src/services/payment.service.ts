import axios from 'axios';
import { Order } from '../db/models/Order';
import { User } from '../db/models/User';
import ApiError from '../utils/ApiError';

// EN: Interfaces for PayU API responses to ensure type safety.
// PL: Interfejsy dla odpowiedzi API PayU w celu zapewnienia bezpieczeństwa typów.
interface PayUAuthResponse {
    access_token: string;
    token_type: string;
    expires_in: number;
    grant_type: string;
}

interface PayUOrderResponse {
    status: {
        statusCode: string;
    };
    redirectUri: string;
    orderId: string;
    extOrderId: string;
}

class PaymentService {
    // EN: Use a base URL to construct other URLs, making it more robust.
    // PL: Użyj bazowego adresu URL do konstruowania innych adresów URL, co czyni go bardziej niezawodnym.
    private payuBaseUrl = process.env.PAYU_API_URL?.replace(/\/api\/v2_1$/, '');
    private payuApiUrl = `${this.payuBaseUrl}/api/v2_1`;
    private clientId = process.env.PAYU_CLIENT_ID;
    private clientSecret = process.env.PAYU_CLIENT_SECRET;
    private posId = process.env.PAYU_POS_ID;
    // EN: Ensure API_URL is set in your .env file for this to work correctly.
    // PL: Upewnij się, że API_URL jest ustawione w pliku .env, aby to działało poprawnie.
    private notifyUrl = `${process.env.API_URL}/api/v1/payments/payu-notify`; // We will create this endpoint later

    private async getAuthToken(): Promise<string> {
        if (!this.payuBaseUrl || !this.clientId || !this.clientSecret) {
            throw ApiError.internal('PayU configuration is missing.');
        }

        const authUrl = `${this.payuBaseUrl}/pl/standard/user/oauth/authorize`;

        try {
            const { data } = await axios.post<PayUAuthResponse>(
                authUrl,
                new URLSearchParams({
                    grant_type: 'client_credentials',
                    client_id: this.clientId,
                    client_secret: this.clientSecret,
                }),
                { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
            );
            return data.access_token;
        } catch (error: any) {
            console.error('PayU Auth Error:', error.response?.data);
            throw ApiError.internal('Failed to authenticate with PayU.');
        }
    }

    public async createPayUOrder(order: Order, user: User, clientIp: string): Promise<{ redirectUri: string, orderId: string }> {
        if (!this.payuApiUrl || !this.posId) {
            throw ApiError.internal('PayU configuration is missing.');
        }

        const token = await this.getAuthToken();

        const orderPayload = {
            notifyUrl: this.notifyUrl,
            continueUrl: `${process.env.FRONTEND_URL}/order/success`, // Redirect after payment
            customerIp: clientIp.replace('::ffff:', ''),
            merchantPosId: this.posId,
            description: `Order #${order.id} from Online Store`,
            currencyCode: 'PLN',
            totalAmount: (order.totalAmount * 100).toString(), // Amount in cents
            extOrderId: order.id.toString(), // Use our internal order ID
            buyer: {
                email: user.email,
                firstName: order.firstName,
                lastName: order.lastName || user.email.split('@')[0],
            },
            products: order.orderDetails?.map(detail => ({
                name: detail.device?.name || 'Unknown Device',
                unitPrice: (detail.price * 100).toString(),
                quantity: detail.quantity.toString(),
            })) ?? [],
        };

        try {
            // Explicitly type the config to include Node.js specific options like maxRedirects
            const isPayuSuccessStatus = (status: number) => status === 302 || status === 201;
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                maxRedirects: 0, // Important to get the redirect URI
                
                validateStatus: isPayuSuccessStatus // 302 is expected for redirects
            };

            const { data } = await axios.post<PayUOrderResponse>(
                `${this.payuApiUrl}/orders`,
                orderPayload,
                config
            );

            if (!data.redirectUri || !data.orderId) {
                throw new Error('PayU response is missing redirectUri or orderId');
            }

            return { redirectUri: data.redirectUri, orderId: data.orderId };

        } catch (error: any) {
            console.error('PayU Create Order Error:', error.response?.data);
            throw ApiError.internal('Failed to create payment order with PayU.');
        }
    }
}

export default new PaymentService();