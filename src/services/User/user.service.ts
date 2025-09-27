import { apiUser } from "../../config/api";
import type { ICreateUserProps, ILoginProps } from "./types";

export const userService = {
    async postCreateUser(data: ICreateUserProps) {
        try {
            const response = await apiUser().post("/api/auth/register", data);
            return response;
        } catch (error: any) {

            if (error.response?.status === 400) {
                const responseData = error.response.data;
                
                if (responseData?.detail === "REGISTER_USER_ALREADY_EXISTS") {
                    throw new Error("Este email já está cadastrado. Tente fazer login ou use outro email.");
                }
            }
        }
    },

    async postLogin(data: ILoginProps) {
        try {
            console.log("🔍 Dados recebidos no postLogin:", data);
            
            const formData = new URLSearchParams();
            formData.append("grant_type", data.grant_type || "password");
            formData.append("username", data.username || "");
            formData.append("password", data.password || "");
            formData.append("scope", data.scope || "string");
            formData.append("client_id", data.client_id || "string");
            formData.append("client_secret", data.client_secret || "string");

            console.log("📤 FormData sendo enviado:", formData.toString());

            const response = await apiUser().post("/api/auth/jwt/login", formData, {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
            });
            return response;
        } catch (error: any) {
            throw error;
        }
    }
}
