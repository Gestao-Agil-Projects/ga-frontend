import type { TUserData } from "../types/TUserData";

export type TUserDto = {
    user: TUserData | null;
    setUser: (user: TUserData | null) => void;
    userAccountData: TUserAccountData | null;
    setUserAccountData: (userAccountData: TUserAccountData | null) => void;
}

export type TUserAccountData = {
    access_token: string;
    token_type?: string;
    is_admin?: boolean;
    is_superuser?: boolean;
    role?: string;
    email?: string;
}
