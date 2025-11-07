import { apiProfessional } from "../../config/api";
import type { ICreateScheduleProps, IPatientSchedule } from "./types";

export const scheduleService = {
    async postCreateSchedule(data: ICreateScheduleProps, token: string) {
        try {
            const response = await apiProfessional(token).post("/api/schedule/", data);
            return {
                status: response.status,
                data: response.data,
            };
        } catch (error: any) {
            throw error;
        }
    },

    async postCreateAdminSchedule(data: ICreateScheduleProps, token: string) {
        try {
            const response = await apiProfessional(token).post("/api/admin/schedule/", data);
            return {
                status: response.status,
                data: response.data,
            };
        } catch (error: any) {
            throw error;
        }
    },

    async getSchedulesByDate(date: string, token: string, professionalId?: string) {
        try {
            let url = `/api/admin/schedule/?date=${date}`;
            if (professionalId) {
                url += `&professional_id=${professionalId}`;
            }
            const response = await apiProfessional(token).get(url);
            return {
                status: response.status,
                data: response.data,
            };
        } catch (error: any) {
            throw error;
        }
    },

    async getAvailableSlots(professionalId: string, date: string, token: string) {
        try {
            const response = await apiProfessional(token).get(
                `/api/admin/availability/?professional_id=${professionalId}&date=${date}`
            );
            return {
                status: response.status,
                data: response.data,
            };
        } catch (error: any) {
            throw error;
        }
    },

    async getPatientSchedules(token: string, limit: number = 50, offset: number = 0): Promise<{ status: number; data: IPatientSchedule[] | any }> {
        try {
            const response = await apiProfessional(token).get(`/api/schedule/?limit=${limit}&offset=${offset}`);
            return {
                status: response.status,
                data: response.data,
            };
        } catch (error: any) {
            throw error;
        }
    }
};

