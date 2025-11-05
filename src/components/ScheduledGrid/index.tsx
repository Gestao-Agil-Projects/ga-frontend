import { Lock } from "lucide-react";
import { timeSlots } from "../../data/timeSlots";
import type { TProfessionalData } from "../../store/types/TProfessionalData";
import type { IScheduleData } from "../../services/Schedule/types";
import type { UserData } from "../../services/User/user.service";

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
    const timeParts = time.split(":");
    const timeHour = parseInt(timeParts[0]);
    const timeMinute = parseInt(timeParts[1]);
    const timeMinutes = timeHour * 60 + timeMinute;

    return availabilities.find((av: any) => {
      if (av.professional_id !== professionalId) return false;
      if (!av.start_time || !av.start_time.includes("T")) return false;

      const avStart = new Date(av.start_time);
      const avEnd = new Date(av.end_time);
      const avStartMinutes = avStart.getUTCHours() * 60 + avStart.getUTCMinutes();
      const avEndMinutes = avEnd.getUTCHours() * 60 + avEnd.getUTCMinutes();

      // Verificar se o horário está dentro do intervalo (incluindo início e fim)
      // Se um agendamento é de 10:00 até 11:00, deve ocupar os slots 10:00 e 11:00
      // Então incluímos o slot final também (<= ao invés de <)
      return timeMinutes >= avStartMinutes && timeMinutes <= avEndMinutes;
    });
  };

  // Verificar se um slot tem um agendamento
  const getAppointmentForSlot = (professionalId: string, time: string) => {
    // Buscar todas as disponibilidades agendadas deste profissional
    const scheduledAvailabilities = availabilities.filter((av: any) => {
      if (av.professional_id !== professionalId) return false;
      if (!av.start_time || !av.start_time.includes("T")) return false;
      // Verificar se está agendada
      if (!av.patient_id && av.status !== "taken") return false;
      
      // Verificar se o horário está dentro do intervalo do agendamento
      const timeParts = time.split(":");
      const timeHour = parseInt(timeParts[0]);
      const timeMinute = parseInt(timeParts[1]);
      const timeMinutes = timeHour * 60 + timeMinute;
      
      const avStart = new Date(av.start_time);
      const avEnd = new Date(av.end_time);
      const avStartMinutes = avStart.getUTCHours() * 60 + avStart.getUTCMinutes();
      const avEndMinutes = avEnd.getUTCHours() * 60 + avEnd.getUTCMinutes();
      
      // O horário está dentro do intervalo (incluindo início e fim)
      // Se um agendamento é de 10:00 até 11:00, deve ocupar os slots 10:00 e 11:00
      return timeMinutes >= avStartMinutes && timeMinutes <= avEndMinutes;
    });

    if (scheduledAvailabilities.length === 0) return null;

    // Pegar a primeira disponibilidade agendada (deve haver apenas uma)
    const availability = scheduledAvailabilities[0];
    
    // Calcular duração real do agendamento
    const avStart = new Date(availability.start_time);
    const avEnd = new Date(availability.end_time);
    const avStartHour = avStart.getUTCHours();
    const avStartMin = avStart.getUTCMinutes();
    const avEndHour = avEnd.getUTCHours();
    const avEndMin = avEnd.getUTCMinutes();
    const avStartMinutes = avStartHour * 60 + avStartMin;
    const avEndMinutes = avEndHour * 60 + avEndMin;
    const durationMinutes = avEndMinutes - avStartMinutes;

    // Verificar se este é o primeiro slot do agendamento
    const timeParts = time.split(":");
    const timeHour = parseInt(timeParts[0]);
    const timeMinute = parseInt(timeParts[1]);
    const timeMinutes = timeHour * 60 + timeMinute;
    const isFirstSlot = timeMinutes === avStartMinutes;

    // Calcular quantos slots de 1 hora são necessários
    // Exemplo: 10:00 até 11:00 = deve ocupar 2 slots (10:00 e 11:00)
    // Para isso, precisamos contar quantos slots estão dentro do intervalo
    let slotCount = 0;
    for (let i = 0; i < timeSlots.length; i++) {
      const slotTime = timeSlots[i];
      const slotParts = slotTime.split(":");
      const slotHour = parseInt(slotParts[0]);
      const slotMinute = parseInt(slotParts[1]);
      const slotMinutes = slotHour * 60 + slotMinute;
      
      // Um agendamento de 10:00 até 11:00 deve ocupar os slots 10:00 e 11:00
      // Então verificamos se o slot está dentro do intervalo (incluindo início e fim)
      if (slotMinutes >= avStartMinutes && slotMinutes <= avEndMinutes) {
        slotCount++;
      }
    }

    return isFirstSlot ? {
      id: availability.id,
      professionalId: availability.professional_id,
      patientName: getPatientName(availability.patient_id),
      time: time,
      duration: durationMinutes, // Duração real em minutos
      slotCount: slotCount, // Número de slots necessários
      status: "confirmed" as const,
      date: availability.start_time,
      availability_id: availability.id
    } : null;
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
      
      // Verificar se já foi renderizado por um agendamento
      if (prevAppointment) {
        // Usar slotCount diretamente se disponível, senão calcular pela duração
        const span = (prevAppointment as any).slotCount || getSlotSpan(prevAppointment.duration);
        if (i + span > timeIndex) {
          return false;
        }
      }
      
      // Verificar se já foi renderizado por uma disponibilidade (disponível ou agendada)
      if (prevAvailability) {
        const avStart = new Date(prevAvailability.start_time);
        const avEnd = new Date(prevAvailability.end_time);
        const avStartMinutes = avStart.getUTCHours() * 60 + avStart.getUTCMinutes();
        const avEndMinutes = avEnd.getUTCHours() * 60 + avEnd.getUTCMinutes();
        
        // Contar quantos slots estão dentro do intervalo
        let slotCount = 0;
        for (let j = 0; j < timeSlots.length; j++) {
          const slotTime = timeSlots[j];
          const slotParts = slotTime.split(":");
          const slotHour = parseInt(slotParts[0]);
          const slotMinute = parseInt(slotParts[1]);
          const slotMinutes = slotHour * 60 + slotMinute;
          
          // Incluir o slot final também (<= ao invés de <)
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
    const avStart = new Date(availability.start_time);
    const avEnd = new Date(availability.end_time);
    const avStartMinutes = avStart.getUTCHours() * 60 + avStart.getUTCMinutes();
    const avEndMinutes = avEnd.getUTCHours() * 60 + avEnd.getUTCMinutes();
    
    // Contar quantos slots de 1 hora estão dentro do intervalo
    let slotCount = 0;
    for (let i = 0; i < timeSlots.length; i++) {
      const slotTime = timeSlots[i];
      const slotParts = slotTime.split(":");
      const slotHour = parseInt(slotParts[0]);
      const slotMinute = parseInt(slotParts[1]);
      const slotMinutes = slotHour * 60 + slotMinute;
      
      // Se o slot está dentro do intervalo (incluindo início e fim)
      // Exemplo: 10:00 até 11:00 deve contar os slots 10:00 e 11:00
      if (slotMinutes >= avStartMinutes && slotMinutes <= avEndMinutes) {
        slotCount++;
      }
    }
    
    return Math.max(1, slotCount); // Garantir pelo menos 1 slot
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
                  // Verificar se este é o primeiro slot da disponibilidade
                  const avStart = new Date(availability.start_time);
                  const avStartHour = avStart.getUTCHours();
                  const avStartMin = avStart.getUTCMinutes();
                  const avStartMinutes = avStartHour * 60 + avStartMin;
                  
                  const timeParts = time.split(":");
                  const timeHour = parseInt(timeParts[0]);
                  const timeMin = parseInt(timeParts[1]);
                  const timeMinutes = timeHour * 60 + timeMin;
                  
                  // Se não é o primeiro slot, não renderizar (já foi renderizado com colSpan)
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
