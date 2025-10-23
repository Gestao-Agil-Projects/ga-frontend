import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { TUserAccountData, TUserDto } from "./dtos/user.dto";
import type { TUserData } from "./types/TUserData";

export const userStore = create<TUserDto>()(
    persist(
        (set) => ({
            user: null,
            setUser: (userData: TUserData | null) =>
                set({ user: userData }),

            userAccountData: null,
            setUserAccountData: (userAccountData: TUserAccountData | null) =>
                set({ userAccountData: userAccountData }),
        }),
        {
            name: "user-store",
            partialize: (state) => ({ 
                userAccountData: state.userAccountData 
            }),
        }
    )
);
