export interface ICreateScheduleProps {
    availability_id: string;
    email?: string;
}

export interface IScheduleData {
    id: string;
    availability_id: string;
    patient_id: string;
    professional_id: string;
    specialty_id?: string;
    date: string;
    status: "scheduled" | "completed" | "cancelled";
    created_at: string;
    updated_at: string;
}

export interface IAvailabilitySlot {
    id: string;
    start_time: string;
    end_time: string;
    professional_id: string;
    weekday?: string;
    is_active: boolean;
}

export interface IPatientSchedule {
    id: string;
    status: "scheduled" | "taken" | "completed" | "cancelled";
    start_time: string;
    end_time: string;
    professional_id: string;
    patient_id: string;
    specialty_id?: string | null;
}

