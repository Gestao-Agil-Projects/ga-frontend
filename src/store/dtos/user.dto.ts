import type { TUserData } from "../types/TUserData";

export type TUserDto = {
    user: TUserData | null;
    setUser: (user: TUserData | null) => void;
    userAccountData: TUserAccountData | null;
    setUserAccountData: (userAccountData: TUserAccountData | null) => void;
    currentUserData: TUserData | null;
    setCurrentUserData: (userData: TUserData | null) => void;
}

export type TUserAccountData = {
    access_token: string;
    is_admin: boolean;
    is_first_access?: boolean;
    is_superuser: boolean;
}
