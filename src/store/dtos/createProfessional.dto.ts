export interface CreateProfessionalDto {
    full_name: string;
    email: string;
    phone: string;
    bio: string;
    is_enabled: boolean;
    specialities: string[];
}
