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

    async getPatientProfessionals(token: string, limit: number = 50, offset: number = 0): Promise<{ status: number; data: any }> {
        try {
            const response = await apiProfessional(token).get(`/api/professionals/?limit=${limit}&offset=${offset}`);
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
            const response = await apiProfessional(token).post("/api/admin/professionals/", professionalData);
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
            const response = await apiProfessional(token).patch(`/api/admin/professionals/${id}/toggle-status`, 
                { is_enabled: isEnabled }
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
