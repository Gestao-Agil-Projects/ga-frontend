export interface ProfessionalServiceResponse<T> {
    status: number;
    data: T;
}

export interface ProfessionalListResponse {
    status: number;
    data: Array<{
        id: string;
        full_name: string;
        email: string;
        phone: string;
        bio: string;
        is_enabled: boolean;
        specialities: Array<{
            id: string;
            title: string;
        }>;
        created_at: string;
        updated_at: string;
    }>;
}
