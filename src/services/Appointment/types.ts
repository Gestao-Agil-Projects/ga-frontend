export interface CreateAppointmentDTO {
  patient_id: string;
  professional_id: string;
  appointment_date: string; // ISO string format
  status: 'scheduled' | 'confirmed' | 'cancelled';
}

export interface UpdateAppointmentDTO {
  id: string;
  status: 'scheduled' | 'confirmed' | 'cancelled';
}

export interface AppointmentResponse {
  id: string;
  patient_id: string;
  professional_id: string;
  appointment_date: string;
  status: 'scheduled' | 'confirmed' | 'cancelled';
  created_at: string;
  updated_at: string;
}

export interface AvailableTimeSlot {
  time: string;
  is_available: boolean;
}