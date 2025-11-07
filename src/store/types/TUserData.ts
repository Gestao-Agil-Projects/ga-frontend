export type TUserData = {
    id: string;
    email: string;
    is_active: boolean;
    is_superuser: boolean;
    is_verified: boolean;
    is_first_access?: boolean;
    birth_date?: string;
    phone?: string;
    full_name?: string;
    image_url?: string | null;
    bio?: string | null;
    frequency?: string;
    role?: 'patient' | 'admin';
    created_at?: string;
}