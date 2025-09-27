export const formatCPF = (value: string): string => {
    const numbers = value.replace(/\D/g, "");
    
    const limitedNumbers = numbers.slice(0, 11);
    
    return limitedNumbers
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
};

export const cleanCPF = (value: string): string => {
    return value.replace(/\D/g, "");
};

export const validateCPF = (cpf: string): boolean => {
    const cleanCpf = cleanCPF(cpf);
    
    if (cleanCpf.length !== 11) return false;
    
    if (/^(\d)\1{10}$/.test(cleanCpf)) return false;
    
    let sum = 0;
    for (let i = 0; i < 9; i++) {
        sum += parseInt(cleanCpf.charAt(i)) * (10 - i);
    }
    let remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(cleanCpf.charAt(9))) return false;
    
    sum = 0;
    for (let i = 0; i < 10; i++) {
        sum += parseInt(cleanCpf.charAt(i)) * (11 - i);
    }
    remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(cleanCpf.charAt(10))) return false;
    
    return true;
};