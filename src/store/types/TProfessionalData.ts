import type { TSpecialityData } from "./TSpecialityData";

export interface TProfessionalData {
    id: string;
    full_name: string;
    email: string;
    phone: string;
    bio: string;
    is_enabled: boolean;
    specialities: TSpecialityData[];
    created_at: string;
    updated_at: string;
}
