export interface ICreateAvailabilityProps {
    professional_id: string;
    weekday: string; // "MONDAY", "TUESDAY", etc.
    start_time: string; // "09:00" format
    end_time: string; // "18:00" format
    is_active?: boolean;
}

export interface IUpdateAvailabilityProps {
    weekday?: string;
    start_time?: string; // "09:00" format
    end_time?: string; // "18:00" format
    is_active?: boolean;
}

