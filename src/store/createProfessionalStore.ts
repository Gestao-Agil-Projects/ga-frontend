import { create } from "zustand";

interface CreateProfessionalStore {
    full_name: string;
    email: string;
    phone: string;
    bio: string;
    is_enabled: boolean;
    specialities: string[];
    
    setFullName: (full_name: string) => void;
    setEmail: (email: string) => void;
    setPhone: (phone: string) => void;
    setBio: (bio: string) => void;
    setIsEnabled: (is_enabled: boolean) => void;
    setSpecialities: (specialities: string[]) => void;
    clearForm: () => void;
}

export const createProfessionalStore = create<CreateProfessionalStore>((set) => ({
    full_name: "",
    email: "",
    phone: "",
    bio: "",
    is_enabled: true,
    specialities: [],
    
    setFullName: (full_name) => set({ full_name }),
    setEmail: (email) => set({ email }),
    setPhone: (phone) => set({ phone }),
    setBio: (bio) => set({ bio }),
    setIsEnabled: (is_enabled) => set({ is_enabled }),
    setSpecialities: (specialities) => set({ specialities }),
    
    clearForm: () => set({
        full_name: "",
        email: "",
        phone: "",
        bio: "",
        is_enabled: true,
        specialities: [],
    }),
}));
