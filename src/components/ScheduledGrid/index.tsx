import { Lock } from "lucide-react";
import { timeSlots } from "../../data/timeSlots";
import type { TProfessionalData } from "../../store/types/TProfessionalData";
import type { IScheduleData } from "../../services/Schedule/types";
import type { UserData } from "../../services/User/user.service";

const hasTimezoneInfo = (dateString: string): boolean => {
  if (!dateString) return false;
  return /([zZ]|[+-]\d{2}:?\d{2})$/.test(dateString);
};

const getTimePartsFromISO = (dateString: string): { hours: number; minutes: number } => {
  if (!dateString) {
    return { hours: 0, minutes: 0 };
  }

  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) {
    return { hours: 0, minutes: 0 };
  }

  const useUTC = hasTimezoneInfo(dateString);

  return {
    hours: useUTC ? date.getUTCHours() : date.getHours(),
    minutes: useUTC ? date.getUTCMinutes() : date.getMinutes(),
  };
};

const getMinutesFromISO = (dateString: string): number => {
  const { hours, minutes } = getTimePartsFromISO(dateString);
  return hours * 60 + minutes;
};

const timeStringToMinutes = (time: string): number => {
  const [hour, minute] = time.split(":").map(Number);
  return hour * 60 + (minute || 0);
};

interface ScheduleGridProps {
  professionals: TProfessionalData[];
  schedules: IScheduleData[];
  availabilities: any[];
  patients: UserData[];
  selectedProfessional: string;
  currentDate: Date;
  onSlotClick: (professionalId: string, time: string) => void;
}

export function ScheduleGrid({ 
  professionals, 
  schedules, 
  availabilities,
  patients,
  selectedProfessional, 
  currentDate,
  onSlotClick 
}: ScheduleGridProps) {
  // Criar mapeamento de patient_id para nome do paciente
  const getPatientName = (patientId: string | null | undefined): string => {
    if (!patientId) return "Agendado";
    const patient = patients.find(p => p.id === patientId);
    return patient?.full_name || patientId;
  };
  // Verificar se um slot está dentro de uma disponibilidade
  const getAvailabilityForSlot = (professionalId: string, time: string) => {
    const timeMinutes = timeStringToMinutes(time);

    return availabilities.find((av: any) => {
      if (av.professional_id !== professionalId) return false;
      if (!av.start_time) return false;

      const avStartMinutes = getMinutesFromISO(av.start_time);
      const avEndMinutes = getMinutesFromISO(av.end_time);

      return timeMinutes >= avStartMinutes && timeMinutes <= avEndMinutes;
    });
  };

  // Verificar se um slot tem um agendamento
  const getAppointmentForSlot = (professionalId: string, time: string) => {
    const timeMinutes = timeStringToMinutes(time);

    const scheduledAvailabilities = availabilities.filter((av: any) => {
      if (av.professional_id !== professionalId) return false;
      if (!av.start_time) return false;
      if (!av.patient_id && av.status !== "taken") return false;

      const avStartMinutes = getMinutesFromISO(av.start_time);
      const avEndMinutes = getMinutesFromISO(av.end_time);

      return timeMinutes >= avStartMinutes && timeMinutes <= avEndMinutes;
    });

    if (scheduledAvailabilities.length === 0) return null;

    const availability = scheduledAvailabilities[0];
    const avStartMinutes = getMinutesFromISO(availability.start_time);
    const avEndMinutes = getMinutesFromISO(availability.end_time);
    const durationMinutes = avEndMinutes - avStartMinutes;

    const isFirstSlot = timeMinutes === avStartMinutes;

    let slotCount = 0;
    for (let i = 0; i < timeSlots.length; i++) {
      const slotMinutes = timeStringToMinutes(timeSlots[i]);
      if (slotMinutes >= avStartMinutes && slotMinutes <= avEndMinutes) {
        slotCount++;
      }
    }

    return isFirstSlot
      ? {
          id: availability.id,
          professionalId: availability.professional_id,
          patientName: getPatientName(availability.patient_id),
          time: time,
          duration: durationMinutes,
          slotCount: slotCount,
          status: "confirmed" as const,
          date: availability.start_time,
          availability_id: availability.id,
        }
      : null;
  };

  const getSlotSpan = (duration: number) => {
    // Cada slot é de 1 hora (60 minutos)
    // Se um agendamento é de 10:00 até 11:00 (60 minutos), deve ocupar 2 slots (10:00 e 11:00)
    // Para isso, precisamos contar quantos slots de início estão dentro da duração
    // Se duration = 60 minutos (1 hora), precisamos de 2 slots (10:00 e 11:00)
    // Então: duration / 60 + 1 = 60/60 + 1 = 2
    return Math.max(1, Math.floor(duration / 60) + 1);
  };

  const shouldRenderSlot = (professionalId: string, timeIndex: number) => {
    for (let i = 0; i < timeIndex; i++) {
      const prevTime = timeSlots[i];
      const prevAppointment = getAppointmentForSlot(professionalId, prevTime);
      const prevAvailability = getAvailabilityForSlot(professionalId, prevTime);

      if (prevAppointment) {
        const span = (prevAppointment as any).slotCount || getSlotSpan(prevAppointment.duration);
        if (i + span > timeIndex) {
          return false;
        }
      }

      if (prevAvailability) {
        const avStartMinutes = getMinutesFromISO(prevAvailability.start_time);
        const avEndMinutes = getMinutesFromISO(prevAvailability.end_time);

        let slotCount = 0;
        for (let j = 0; j < timeSlots.length; j++) {
          const slotMinutes = timeStringToMinutes(timeSlots[j]);
          if (slotMinutes >= avStartMinutes && slotMinutes <= avEndMinutes) {
            slotCount++;
          }
        }

        const span = Math.max(1, slotCount);

        if (i + span > timeIndex) {
          return false;
        }
      }
    }
    return true;
  };
  
  const getAvailabilitySpan = (availability: any) => {
    const avStartMinutes = getMinutesFromISO(availability.start_time);
    const avEndMinutes = getMinutesFromISO(availability.end_time);

    let slotCount = 0;
    for (let i = 0; i < timeSlots.length; i++) {
      const slotMinutes = timeStringToMinutes(timeSlots[i]);
      if (slotMinutes >= avStartMinutes && slotMinutes <= avEndMinutes) {
        slotCount++;
      }
    }

    return Math.max(1, slotCount);
  };

  const filteredProfessionals = selectedProfessional === "all" 
    ? professionals 
    : professionals.filter(p => p.id === selectedProfessional);
  
  if (filteredProfessionals.length === 0) {
    return (
      <div className="text-center py-8 text-gray-600">
        Nenhum profissional encontrado.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[1200px] border-collapse">
        <thead>
          <tr className="bg-gray-50 border-b">
            <th className="w-48 p-2 text-left text-xs font-medium text-gray-700 border-r">Profissional</th>
            {timeSlots.map(time => (
              <th key={time} className="w-12 p-1 text-center text-xs font-medium text-gray-600 border-r last:border-r-0">
                {time}
              </th>
            ))}
          </tr>
        </thead>
        
        <tbody>
          {filteredProfessionals.map(professional => (
            <tr key={professional.id} className="border-b last:border-b-0 hover:bg-gray-50">
              <td className="w-48 p-2 border-r bg-white">
                <div className="flex items-center gap-2">
                  <div>
                    <div className="text-xs font-semibold text-gray-900">{professional.full_name}</div>
                  </div>
                </div>
              </td>
              
              {timeSlots.map((time, timeIndex) => {
                const appointment = getAppointmentForSlot(professional.id, time);
                const availability = getAvailabilityForSlot(professional.id, time);
                const shouldRender = shouldRenderSlot(professional.id, timeIndex);
                
                if (!shouldRender) {
                  return null;
                }
                
                // Se tem agendamento, mostrar o agendamento
                if (appointment) {
                  // Usar slotCount diretamente se disponível, senão calcular pela duração
                  const span = (appointment as any).slotCount || getSlotSpan(appointment.duration);
                  return (
                    <td 
                      key={time}
                      colSpan={span}
                      className="relative p-0 border-r last:border-r-0 cursor-pointer"
                      onClick={() => onSlotClick(professional.id, time)}
                    >
                      <div className="w-full h-12 flex items-center justify-center text-white text-xs font-medium shadow-sm transition-all hover:shadow-md bg-blue-500 hover:bg-blue-600">
                        <div className="flex items-center justify-center w-full px-2">
                          <span className="truncate font-medium text-xs">{appointment.patientName}</span>
                          <div className="w-1.5 h-1.5 bg-white rounded-full opacity-90 ml-1 flex-shrink-0" />
                        </div>
                      </div>
                    </td>
                  );
                }
                
                // Se tem disponibilidade mas não está agendada, mostrar como disponível
                if (availability && !availability.patient_id && availability.status !== "taken") {
                  const avStartMinutes = getMinutesFromISO(availability.start_time);
                  const timeMinutes = timeStringToMinutes(time);

                  if (timeMinutes !== avStartMinutes) {
                    return null;
                  }

                  const span = getAvailabilitySpan(availability);
                  return (
                    <td 
                      key={time}
                      colSpan={span}
                      className="relative p-0 border-r last:border-r-0 cursor-pointer hover:bg-blue-100 transition-colors bg-blue-50"
                      onClick={() => onSlotClick(professional.id, time)}
                    >
                      <div className="w-full h-12 flex items-center justify-center">
                        {/* Slot disponível - sem ícone de cadeado */}
                      </div>
                    </td>
                  );
                }
                
                // Se não tem disponibilidade, mostrar como bloqueado
                return (
                  <td 
                    key={time}
                    className="w-12 h-12 border-r last:border-r-0 cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => onSlotClick(professional.id, time)}
                  >
                    <div className="h-full flex items-center justify-center">
                      <Lock className="w-3 h-3 text-gray-300" />
                    </div>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
