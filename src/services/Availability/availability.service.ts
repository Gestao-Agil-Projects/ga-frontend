import { apiProfessional } from "../../config/api";
import type { ICreateAvailabilityProps, IUpdateAvailabilityProps } from "./types";

export const availabilityService = {
    async postCreateAvailability(data: ICreateAvailabilityProps, token: string) {
        try {
            const response = await apiProfessional(token).post("/api/admin/availability/", data);
            return {
                status: response.status,
                data: response.data,
            };
        } catch (error: any) {
            throw error;
        }
    },

    async getAvailabilitiesByProfessional(
        professionalId: string,
        token: string,
        limit: number = 50,
        offset: number = 0
    ) {
        try {
            const response = await apiProfessional(token).get(
                `/api/admin/availability/?professional_id=${professionalId}&limit=${limit}&offset=${offset}`
            );
            return {
                status: response.status,
                data: response.data,
            };
        } catch (error: any) {
            throw error;
        }
    },

    async getPatientAvailabilitiesByProfessional(
        professionalId: string,
        token: string,
        limit: number = 50,
        offset: number = 0
    ) {
        try {
            const response = await apiProfessional(token).get(
                `/api/availability/?professional_id=${professionalId}&limit=${limit}&offset=${offset}`
            );
            return {
                status: response.status,
                data: response.data,
            };
        } catch (error: any) {
            throw error;
        }
    },

    async putUpdateAvailability(id: string, data: IUpdateAvailabilityProps, token: string) {
        try {
            const response = await apiProfessional(token).put(`/api/admin/availability/${id}`, data);
            return {
                status: response.status,
                data: response.data,
            };
        } catch (error: any) {
            throw error;
        }
    },

    async deleteAvailability(id: string, token: string) {
        try {
            const response = await apiProfessional(token).delete(`/api/admin/availability/${id}`);
            return {
                status: response.status,
                data: response.data,
            };
        } catch (error: any) {
            throw error;
        }
    }
};

