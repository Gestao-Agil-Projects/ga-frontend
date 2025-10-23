import { apiProfessional } from "../../config/api";
import type { TProfessionalData } from "../../store/types/TProfessionalData";
import type { TCreateProfessionalData } from "../../store/types/TCreateProfessionalData";
import type { TUpdateProfessionalData } from "../../store/types/TUpdateProfessionalData";

export const professionalService = {
    async getProfessionals(token: string): Promise<{ status: number; data: TProfessionalData[] }> {
        try {
            const response = await apiProfessional(token).get("/api/admin/professionals/");
            return {
                status: response.status,
                data: response.data,
            };
        } catch (error: any) {
            throw error;
        }
    },

    async postCreateProfessional(
        professionalData: TCreateProfessionalData,
        token: string
    ): Promise<{ status: number; data: TProfessionalData }> {
        try {
            const response = await apiProfessional().post("/api/admin/professionals/", professionalData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });
            return {
                status: response.status,
                data: response.data,
            };
        } catch (error: any) {
            throw error;
        }
    },

    async putUpdateProfessional(
        id: string,
        professionalData: TUpdateProfessionalData,
        token: string
    ): Promise<{ status: number; data: TProfessionalData }> {
        try {
            const response = await apiProfessional(token).put(`/api/admin/professionals/${id}`, professionalData);
            return {
                status: response.status,
                data: response.data,
            };
        } catch (error: any) {
            throw error;
        }
    },

    async toggleProfessionalStatus(
        id: string,
        isEnabled: boolean,
        token: string
    ): Promise<{ status: number; data: TProfessionalData }> {
        try {
            const response = await apiProfessional().patch(`/api/admin/professionals/${id}/toggle-status`, 
                { is_enabled: isEnabled }, 
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );
            return {
                status: response.status,
                data: response.data,
            };
        } catch (error: any) {
            throw error;
        }
    },

    async deleteProfessional(
        id: string,
        token: string
    ): Promise<{ status: number; data?: any }> {
        try {
            const response = await apiProfessional(token).delete(`/api/admin/professionals/${id}`);
            return {
                status: response.status,
                data: response.data,
            };
        } catch (error: any) {
            throw error;
        }
    },
};
