import { create } from "zustand";
import type { TCreateUserDto } from "./dtos/createUser.dto";


export const createUserStore = create<TCreateUserDto>((set) => ({
    email: "",
    setEmail: (email: string) => set(() => ({ email })),

	password: "",
	setPassword: (password: string) => set(() => ({ password })),

    is_active: true,
    setIsActive: (is_active: boolean) => set(() => ({ is_active })),

    is_superuser: false,
    setIsSuperuser: (is_superuser: boolean) => set(() => ({ is_superuser })),

    is_verified: false,
    setIsVerified: (is_verified: boolean) => set(() => ({ is_verified })),

    full_name: "",
    setFullName: (full_name: string) => set(() => ({ full_name })),

    cpf: "",
    setCpf: (cpf: string) => set(() => ({ cpf })),
    
    birth_date: "",
    setBirthDate: (birth_date: string) => set(() => ({ birth_date })),

    phone: "",
    setPhone: (phone: string) => set(() => ({ phone })),

    frequency: "",
    setFrequency: (frequency: string) => set(() => ({ frequency })),

    role: "",
    setRole: (role: string) => set(() => ({ role })),
}));
