import axios, { AxiosError } from "axios";
import { EnvConfig } from "./env.config";

const createApiInstance = (
    authorization?: string | null,
    baseURL?: string | null,
    ContentHeader?: any,
) => {
    const containAuthentication = () => {
        const commonFields = {
            "Content-Type": "application/json",
        };
        if (authorization) {
            return {
                ...commonFields,
                Authorization: `Bearer ${authorization}`,
            };
        }

        return { ...commonFields };
    };

    const axiosInstance = axios.create({
        baseURL,
        headers: { ...containAuthentication(), ...ContentHeader },
    });

    axiosInstance.interceptors.request.use(
        async (config) => {
            console.log("🚀 Request:", {
                method: config.method?.toUpperCase(),
                url: config.url,
                data: config.data,
            });
            return config;
        },
        (error: AxiosError) => {
            console.error("❌ Request Error:", error);
            return Promise.reject(error);
        },
    );

    axiosInstance.interceptors.response.use(
        (response: any) => {
            console.log("✅ Response Success:", {
                status: response.status,
                data: response.data,
            });
            return response;
        },
        async (error: AxiosError) => {
            console.error("❌ Response Error:", {
                status: error.response?.status,
                statusText: error.response?.statusText,
                data: error.response?.data,
            });

            if (!error.response) {
                error.message = "Erro de conexão - verifique se o servidor está rodando";
            }

            return Promise.reject(error);
        },
    );

    return axiosInstance;
};

export const apiUser = (authorization?: string | null) =>
    createApiInstance(authorization, EnvConfig.BASE_URL_API, null);