import { apiSpeciality } from "../../config/api";
import type { ICreateSpecialityProps } from "./types";

export const specialityService = {
    async postCreateSpeciality(data: ICreateSpecialityProps, token: string) {
        try {
            const response = await apiSpeciality(token).post("/api/admin/speciality/", data);
            return response;
        } catch (error: any) {
            throw error;
        }
    },

    async getSpecialities(token: string, limit: number = 10, offset: number = 0) {
        try {
            const response = await apiSpeciality(token).get(`/api/admin/speciality/?limit=${limit}&offset=${offset}`);
            return response;
        } catch (error: any) {
            throw error;
        }
    },

    async putUpdateSpeciality(id: string, data: ICreateSpecialityProps, token: string) {
        try {
            const response = await apiSpeciality(token).put(`/api/admin/speciality/?speciality_id=${id}`, data);
            return response;
        } catch (error: any) {
            throw error;
        }
    },

    async deleteSpeciality(id: string, token: string) {
        try {
            const response = await apiSpeciality(token).delete(`/api/admin/speciality/?speciality_id=${id}`);
            return response;
        } catch (error: any) {
            throw error;
        }
    }
};
