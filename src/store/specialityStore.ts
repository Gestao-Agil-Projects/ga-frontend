import { create } from "zustand";
import type { TSpecialityData } from "./types/TSpecialityData";

export const specialityStore = create<{
    specialities: TSpecialityData[];
    setSpecialities: (specialities: TSpecialityData[]) => void;
    addSpeciality: (speciality: TSpecialityData) => void;
    updateSpeciality: (id: string, updatedSpeciality: TSpecialityData) => void;
    removeSpeciality: (id: string) => void;
}>((set) => ({
    specialities: [],
    
    setSpecialities: (specialities: TSpecialityData[]) => set({ specialities }),
    
    addSpeciality: (speciality: TSpecialityData) => set((state) => ({
        specialities: [...state.specialities, speciality]
    })),
    
    updateSpeciality: (id: string, updatedSpeciality: TSpecialityData) => set((state) => ({
        specialities: state.specialities.map(speciality => 
            speciality.id === id ? updatedSpeciality : speciality
        )
    })),
    
    removeSpeciality: (id: string) => set((state) => ({
        specialities: state.specialities.filter(speciality => speciality.id !== id)
    })),
}));
