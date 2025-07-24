import axios from "axios";

const $host = axios.create({
    baseURL: process.env.REACT_APP_API_URL,
});

const $authHost = axios.create({
    baseURL: process.env.REACT_APP_API_URL,
});

const authInterceptor = (config: any) => {
    config.headers.authorization = `Bearer ${localStorage.getItem("token")}`;
    return config;
};

$authHost.interceptors.request.use(authInterceptor);

// EN: Add a response interceptor to handle 401 errors globally.
// PL: Dodaj interceptor odpowiedzi, aby globalnie obsługiwać błędy 401.
$authHost.interceptors.response.use(
    (config) => {
        return config;
    },
    async (error) => {
        if (error.response.status === 401) {
            // In a real app, you would likely use a state management store (like MobX/Redux)
            // to log the user out and redirect them.
            console.log("Unauthorized, logging out.");
            localStorage.removeItem('token');
            window.location.href = '/login'; // Or your login route
        }
        return Promise.reject(error);
    }
);

export { $host, $authHost };
