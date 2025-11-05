import { create } from "zustand";
import type { TAvailabilityData } from "./types/TAvailabilityData";

interface AvailabilityStore {
    availabilities: TAvailabilityData[];
    setAvailabilities: (availabilities: TAvailabilityData[]) => void;
    addAvailability: (availability: TAvailabilityData) => void;
    updateAvailability: (id: string, availability: TAvailabilityData) => void;
    removeAvailability: (id: string) => void;
    clearAvailabilities: () => void;
}

export const availabilityStore = create<AvailabilityStore>((set) => ({
    availabilities: [],
    
    setAvailabilities: (availabilities) => set({ availabilities }),
    
    addAvailability: (availability) =>
        set((state) => ({
            availabilities: [...state.availabilities, availability],
        })),
    
    updateAvailability: (id, availability) =>
        set((state) => ({
            availabilities: state.availabilities.map((a) =>
                a.id === id ? availability : a
            ),
        })),
    
    removeAvailability: (id) =>
        set((state) => ({
            availabilities: state.availabilities.filter((a) => a.id !== id),
        })),
    
    clearAvailabilities: () => set({ availabilities: [] }),
}));

