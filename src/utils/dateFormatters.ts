import { 
    format, 
    parse, 
    isValid
} from "date-fns";

export const getDateFromValue = (dateString: string): Date | null => {
    if (!dateString) return null;
    try {
        return parse(dateString, "yyyy-MM-dd", new Date());
    } catch {
        return null;
    }
};

export const formatDateForDisplay = (date: Date | null): string => {
    if (!date || !isValid(date)) return "";
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
};

export const formatDateForAPI = (date: Date | null): string => {
    if (!date || !isValid(date)) return "";
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    return `${year}-${month}-${day}`;
};

export const formatDateWithLocale = (date: Date, formatString: string): string => {
    return format(date, formatString);
};

export const isValidDate = (date: Date | null): boolean => {
    return date !== null && isValid(date);
};
