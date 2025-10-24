import { AxiosResponse } from "axios";
import { apiUser } from "../../config/api";
import { AppointmentResponse, CreateAppointmentDTO, UpdateAppointmentDTO, AvailableTimeSlot } from "./types";

export const appointmentService = {
  // Get available time slots for a professional on a specific date
  async getAvailableTimeSlots(
    professionalId: string,
    date: string,
    token: string
  ): Promise<AxiosResponse<AvailableTimeSlot[]>> {
    return apiUser(token).get(`/api/appointments/available-slots/${professionalId}`, {
      params: { date }
    });
  },

  // Create a new appointment
  async createAppointment(
    data: CreateAppointmentDTO,
    token: string
  ): Promise<AxiosResponse<AppointmentResponse>> {
    return apiUser(token).post("/api/appointments", data);
  },

  // Update an appointment status
  async updateAppointmentStatus(
    data: UpdateAppointmentDTO,
    token: string
  ): Promise<AxiosResponse<AppointmentResponse>> {
    return apiUser(token).patch(`/api/appointments/${data.id}`, {
      status: data.status
    });
  },

  // Get all appointments for a patient
  async getPatientAppointments(
    patientId: string,
    token: string
  ): Promise<AxiosResponse<AppointmentResponse[]>> {
    return apiUser(token).get(`/api/appointments/patient/${patientId}`);
  },

  // Get all appointments for a professional
  async getProfessionalAppointments(
    professionalId: string,
    token: string
  ): Promise<AxiosResponse<AppointmentResponse[]>> {
    return apiUser(token).get(`/api/appointments/professional/${professionalId}`);
  }
};