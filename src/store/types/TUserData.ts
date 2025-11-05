export type TUserData = {
    id: string;
    email: string;
    is_active: boolean;
    is_superuser: boolean;
    is_verified: boolean;
    is_first_access?: boolean;
}