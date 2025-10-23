import { Lock } from "lucide-react";

import { timeSlots } from "../../data/timeSlots";
import { mockAppointments } from "../../data/appointments";

// Mock data temporário - será substituído por dados reais
const professionals = [
    { id: "1", name: "DRA. ANA SILVA", color: "bg-blue-500" },
    { id: "2", name: "DR. CARLOS MENDES", color: "bg-gray-500" },
    { id: "3", name: "DRA. MARIANA COSTA", color: "bg-green-500" }
];

interface ScheduleGridProps {
  selectedProfessional: string;
  onSlotClick: (professionalId: string, time: string) => void;
}

export function ScheduleGrid({ selectedProfessional, onSlotClick }: ScheduleGridProps) {
  const getAppointmentForSlot = (professionalId: string, time: string) => {
    return mockAppointments.find(
      apt => apt.professionalId === professionalId && apt.time === time
    );
  };

  const getSlotSpan = (duration: number) => {
    return duration / 30;
  };

  const shouldRenderSlot = (professionalId: string, timeIndex: number) => {
    for (let i = 0; i < timeIndex; i++) {
      const prevTime = timeSlots[i];
      const prevAppointment = getAppointmentForSlot(professionalId, prevTime);
      if (prevAppointment) {
        const span = getSlotSpan(prevAppointment.duration);
        if (i + span > timeIndex) {
          return false;
        }
      }
    }
    return true;
  };

  const filteredProfessionals = selectedProfessional === "all" 
    ? professionals 
    : professionals.filter(p => p.id === selectedProfessional);

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
                    <div className="text-xs font-semibold text-gray-900">{professional.name}</div>
                  </div>
                </div>
              </td>
              
              {timeSlots.map((time, timeIndex) => {
                const appointment = getAppointmentForSlot(professional.id, time);
                const shouldRender = shouldRenderSlot(professional.id, timeIndex);
                
                if (!shouldRender) {
                  return null;
                }
                
                if (appointment) {
                  const span = getSlotSpan(appointment.duration);
                  return (
                    <td 
                      key={time}
                      colSpan={span}
                      className="relative p-0 border-r last:border-r-0 cursor-pointer"
                      onClick={() => onSlotClick(professional.id, time)}
                    >
                      <div className={`w-full h-12 flex items-center justify-center text-white text-xs font-medium shadow-sm transition-all hover:shadow-md ${
                        appointment.status === 'confirmed' 
                          ? 'bg-green-400 hover:bg-green-500' 
                          : appointment.status === 'blocked'
                          ? 'bg-gray-400 hover:bg-gray-500'
                          : 'bg-blue-500 hover:bg-blue-600'
                      }`}>
                        <div className="flex items-center justify-center w-full px-2">
                          <span className="truncate font-medium text-xs">{appointment.patientName}</span>
                          {appointment.status === 'confirmed' && (
                            <div className="w-1.5 h-1.5 bg-white rounded-full opacity-90 ml-1 flex-shrink-0" />
                          )}
                        </div>
                      </div>
                    </td>
                  );
                }
                
                return (
                  <td 
                    key={time}
                    className="w-12 h-12 border-r last:border-r-0 cursor-pointer hover:bg-blue-50 transition-colors"
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
