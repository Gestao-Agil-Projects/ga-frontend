import { create } from "zustand";
import type { TProfessionalData } from "./types/TProfessionalData";

interface ProfessionalStore {
    professionals: TProfessionalData[];
    setProfessionals: (professionals: TProfessionalData[]) => void;
    addProfessional: (professional: TProfessionalData) => void;
    updateProfessional: (id: string, professional: TProfessionalData) => void;
    removeProfessional: (id: string) => void;
    toggleProfessionalStatus: (id: string) => void;
}

export const professionalStore = create<ProfessionalStore>((set) => ({
    professionals: [],
    
    setProfessionals: (professionals) => {
        console.log('Setting professionals in store:', professionals);
        set({ professionals });
    },
    
    addProfessional: (professional) =>
        set((state) => ({
            professionals: [...state.professionals, professional],
        })),
    
    updateProfessional: (id, professional) =>
        set((state) => ({
            professionals: state.professionals.map((p) =>
                p.id === id ? professional : p
            ),
        })),
    
    removeProfessional: (id) =>
        set((state) => ({
            professionals: state.professionals.filter((p) => p.id !== id),
        })),
    
    toggleProfessionalStatus: (id) =>
        set((state) => ({
            professionals: state.professionals.map((p) =>
                p.id === id ? { ...p, is_enabled: !p.is_enabled } : p
            ),
        })),
}));
