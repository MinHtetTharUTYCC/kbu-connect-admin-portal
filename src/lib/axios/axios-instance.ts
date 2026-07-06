import axios, { type AxiosError, type AxiosRequestConfig } from 'axios';
import { useAuthStore } from '@/stores/auth-store';
import { baseUrl } from '../constants/app.config';
import { retrySkipApiRoutes } from '../constants/routes';

let isRefreshing = false;
let refreshSubscribers: (() => void)[] = [];

const onRefreshed = () => {
    refreshSubscribers.forEach((callback) => {
        callback();
    });
    refreshSubscribers = [];
};

const subscribeToRefresh = (callback: () => void) => {
    refreshSubscribers.push(callback);
};

const axiosInstance = axios.create({
    baseURL: baseUrl,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json'
    }
});

axiosInstance.interceptors.request.use(
    (config) => {
        if (config.data instanceof FormData) {
            delete config.headers['Content-Type'];
        }

        const accessToken = useAuthStore.getState().accessToken;

        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        }

        return config;
    },
    (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
    (response) => response.data.data,
    async (error: AxiosError) => {
        const err = error?.response?.data as {
            statusCode: number;
            timestamp: string;
            message: string;
            errors?: Record<string, string>;
        };

        const originalRequest = error.config as AxiosRequestConfig & {
            _retry?: boolean;
        };

        const isAuthRoute = retrySkipApiRoutes.some((path) => originalRequest.url?.includes(path));

        if (isAuthRoute) {
            return Promise.reject(err ?? error);
        } else if (error.response) {
            console.error('API error:', {
                url: originalRequest.url,
                method: originalRequest.method,
                status: error.response?.status,
                responseData: err
            });

            if (error?.response?.status === 401 && !originalRequest._retry) {
                originalRequest._retry = true;

                if (isRefreshing) {
                    return new Promise((resolve) => {
                        subscribeToRefresh(() => {
                            resolve(axiosInstance(originalRequest));
                        });
                    });
                }

                isRefreshing = true;

                try {
                    const data = await axiosInstance.post<unknown, { access_token: string }>('/auth/refresh');

                    console.log('Token refreshed successfully', data);

                    onRefreshed();

                    if (data?.access_token) {
                        useAuthStore.getState().setToken(data.access_token);
                    }

                    return axiosInstance(originalRequest);
                } catch {
                    if (typeof window !== 'undefined') {
                        window.location.href = '/login';
                    }
                } finally {
                    isRefreshing = false;
                }
            }
        }
        return Promise.reject(err ?? error);
    }
);

export const axiosInstanceFn = <T>(config: AxiosRequestConfig): Promise<T> => {
    return axiosInstance(config);
};

export default axiosInstanceFn;
