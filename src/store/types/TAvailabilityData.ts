export type TAvailabilityData = {
    id: string;
    start_time: string;
    end_time: string;
    professional_id: string;
    status: "available" | "unavailable" | "scheduled";
    created_at: string;
    updated_at: string;
};

export type TCreateAvailabilityData = {
    start_time: string;
    end_time: string;
    professional_id: string;
};

export type TUpdateAvailabilityData = {
    start_time?: string;
    end_time?: string;
    status?: "available" | "unavailable" | "scheduled";
};

