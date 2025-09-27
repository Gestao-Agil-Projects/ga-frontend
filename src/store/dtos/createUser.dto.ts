export type TCreateUserDto = {
    email: string;
    setEmail: (email: string) => void;

	password: string;
	setPassword: (password: string) => void;

    is_active: boolean;
    setIsActive: (is_active: boolean) => void;

    is_superuser: boolean;
    setIsSuperuser: (is_superuser: boolean) => void;

    is_verified: boolean;
    setIsVerified: (is_verified: boolean) => void;

    full_name: string;
    setFullName: (full_name: string) => void;

    cpf: string;
    setCpf: (cpf: string) => void;

    birth_date: string;
    setBirthDate: (birth_date: string) => void;

    phone: string;
    setPhone: (phone: string) => void;

    frequency: string;
    setFrequency: (frequency: string) => void;

    role: string;
    setRole: (role: string) => void;
};
