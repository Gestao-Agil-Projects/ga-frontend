export const formatPhone = (value: string): string => {
    const numbers = value.replace(/\D/g, "");
    
    const limitedNumbers = numbers.slice(0, 13);
    
    if (limitedNumbers.length <= 2) {
        return `+${limitedNumbers}`;
    } else if (limitedNumbers.length <= 4) {
        return `+${limitedNumbers.slice(0, 2)} (${limitedNumbers.slice(2)})`;
    } else if (limitedNumbers.length <= 9) {
        return `+${limitedNumbers.slice(0, 2)} (${limitedNumbers.slice(2, 4)}) ${limitedNumbers.slice(4)}`;
    } else {
        return `+${limitedNumbers.slice(0, 2)} (${limitedNumbers.slice(2, 4)}) ${limitedNumbers.slice(4, 9)}-${limitedNumbers.slice(9, 13)}`;
    }
};

export const cleanPhone = (value: string): string => {
    return value.replace(/\D/g, "");
};

export const validatePhone = (phone: string): boolean => {
    const cleanPhoneNumber = cleanPhone(phone);
    return cleanPhoneNumber.length >= 10 && cleanPhoneNumber.length <= 13;
};