export const parseInputDate = (inputStr: string): string => {
    const numbers = inputStr.replace(/\D/g, "");
    
    if (numbers.length === 0) return "";
    
    let formatted = numbers;
    if (numbers.length >= 3) {
        formatted = numbers.slice(0, 2) + "/" + numbers.slice(2);
    }
    if (numbers.length >= 5) {
        formatted = numbers.slice(0, 2) + "/" + numbers.slice(2, 4) + "/" + numbers.slice(4, 8);
    }
    
    if (numbers.length === 8) {
        const day = numbers.slice(0, 2);
        const month = numbers.slice(2, 4);
        const year = numbers.slice(4, 8);
        
        if (parseInt(day) >= 1 && parseInt(day) <= 31 && 
            parseInt(month) >= 1 && parseInt(month) <= 12 && 
            parseInt(year) >= 1900 && parseInt(year) <= 2100) {
            return `${year}-${month}-${day}`;
        }
    }
    
    return formatted;
};

export const isValidDateString = (dateString: string): boolean => {
    const numbers = dateString.replace(/\D/g, "");
    if (numbers.length !== 8) return false;
    
    const day = parseInt(numbers.slice(0, 2));
    const month = parseInt(numbers.slice(2, 4));
    const year = parseInt(numbers.slice(4, 8));
    
    return day >= 1 && day <= 31 && 
        month >= 1 && month <= 12 && 
        year >= 1900 && year <= 2100;
};
