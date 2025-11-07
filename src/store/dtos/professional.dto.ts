export interface ProfessionalDto {
    id: string;
    full_name: string;
    email: string;
    phone: string;
    bio: string;
    is_enabled: boolean;
    specialities: SpecialityDto[];
    created_at: string;
    updated_at: string;
}

export interface SpecialityDto {
    id: string;
    title: string;
}
