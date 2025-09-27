import { create } from "zustand";
import type { TUserAccountData, TUserDto } from "./dtos/user.dto";
import type { TUserData } from "./types/TUserData";

export const userStore = create<TUserDto>((set) => ({
    user: null,
    setUser: (userData: TUserData | null) =>
        set({ user: userData }),

    userAccountData: null,
    setUserAccountData: (userAccountData: TUserAccountData | null) =>
        set({ userAccountData: userAccountData }),
}));
