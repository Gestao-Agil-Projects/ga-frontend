import { apiUser } from "../../config/api";

export interface CreatePatientData {
    email: string;
    cpf: string;
    birth_date: string;
    phone: string;
    full_name: string;
    image_url?: string;
    bio?: string;
    frequency?: string;
}

export interface CreateAdminData {
    email: string;
    cpf: string;
    birth_date: string;
    phone: string;
    full_name: string;
    image_url?: string;
    bio?: string;
}

export interface UserData {
    id: string;
    full_name: string;
    email: string;
    phone: string;
    cpf: string;
    birth_date: string;
    image_url?: string;
    bio?: string;
    frequency?: string;
    role: 'patient' | 'admin';
    is_superuser?: boolean;
    created_at: string;
    consultations_count?: number;
    last_consultation?: string;
    next_consultation?: string;
    psychologist_name?: string;
}

export const userService = {
    async postLogin(loginData: any): Promise<{ status: number; data: any }> {
        try {
            // Converter os dados para formato x-www-form-urlencoded
            const formData = new URLSearchParams();
            Object.keys(loginData).forEach(key => {
                formData.append(key, loginData[key]);
            });

            const response = await apiUser().post("/api/auth/jwt/login", formData, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            });
            return {
                status: response.status,
                data: response.data,
            };
        } catch (error: any) {
            throw error;
        }
    },

    async getPatients(token: string, skip: number = 0, limit: number = 100): Promise<{ status: number; data: UserData[] }> {
        try {
            const response = await apiUser(token).get(`/api/admin/users/patients?skip=${skip}&limit=${limit}`);
            return {
                status: response.status,
                data: response.data,
            };
        } catch (error: any) {
            throw error;
        }
    },

    async getAdmins(): Promise<{ status: number; data: UserData[] }> {
        try {
            // Endpoint de admins não existe no backend, retornar array vazio
            return {
                status: 200,
                data: [],
            };
        } catch (error: any) {
            throw error;
        }
    },

    async getAllUsers(token: string, skip: number = 0, limit: number = 100): Promise<{ status: number; data: UserData[] }> {
        try {
            // Buscar apenas pacientes, pois endpoint de admins não existe
            const patientsResponse = await apiUser(token).get(`/api/admin/users/?skip=${skip}&limit=${limit}`);
            const adminsResponse = await this.getAdmins();
            
            const allUsers = [
                ...(patientsResponse.data || []),
                ...(adminsResponse.data || [])
            ];
            
            return {
                status: 200,
                data: allUsers,
            };
        } catch (error: any) {
            throw error;
        }
    },

    async createPatient(patientData: CreatePatientData, token: string): Promise<{ status: number; data: UserData }> {
        try {
            const userData = {
                ...patientData,
                password: "123456" // Senha padrão
            };
            const response = await apiUser(token).post("/api/admin/users/register-patient", userData);
            return {
                status: response.status,
                data: response.data,
            };
        } catch (error: any) {
            throw error;
        }
    },

    async updateUserToAdmin(userId: string, token: string): Promise<{ status: number; data: UserData }> {
        try {
            const response = await apiUser(token).patch(`/api/users/${userId}`, {
                is_superuser: true
            });
            return {
                status: response.status,
                data: response.data,
            };
        } catch (error: any) {
            throw error;
        }
    },

    async updateUser(id: string, userData: Partial<CreatePatientData | CreateAdminData>, token: string): Promise<{ status: number; data: UserData }> {
        try {
            const response = await apiUser(token).put(`/api/admin/users/${id}`, userData);
            return {
                status: response.status,
                data: response.data,
            };
        } catch (error: any) {
            throw error;
        }
    },

    async deleteUser(id: string, token: string): Promise<{ status: number; data?: any }> {
        try {
            const response = await apiUser(token).delete(`/api/admin/users/${id}`);
            return {
                status: response.status,
                data: response.data,
            };
        } catch (error: any) {
            throw error;
        }
    },

};