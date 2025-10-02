export interface Appointment {
    id: string;
    professionalId: string;
    patientName: string;
    time: string;
    duration: number;
    status: "confirmed" | "blocked" | "available";
    phone?: string;
    email?: string;
    description?: string;
}

export const mockAppointments: Appointment[] = [
    {
        id: "1",
        professionalId: "1",
        patientName: "João Silva",
        time: "08:00",
        duration: 90,
        status: "confirmed",
        phone: "(11) 99999-9999",
        email: "joao@email.com",
        description: "Consulta de rotina"
    },
    {
        id: "2",
        professionalId: "2",
        patientName: "Lucas Ferreira",
        time: "09:00",
        duration: 90,
        status: "confirmed",
        phone: "(11) 88888-8888",
        email: "lucas@email.com"
    },
    {
        id: "3",
        professionalId: "1",
        patientName: "Pedro Costa",
        time: "14:00",
        duration: 90,
        status: "confirmed",
        phone: "(11) 77777-7777",
        email: "pedro@email.com"
    }
];