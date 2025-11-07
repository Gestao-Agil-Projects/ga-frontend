import { create } from "zustand";
import type { TCreateSpecialityData } from "./types/TCreateSpecialityData";

export const createSpecialityStore = create<TCreateSpecialityData & {
    setTitle: (title: string) => void;
    clearForm: () => void;
}>((set) => ({
    title: "",
    
    setTitle: (title: string) => set({ title }),
    
    clearForm: () => set({ 
        title: ""
    }),
}));
