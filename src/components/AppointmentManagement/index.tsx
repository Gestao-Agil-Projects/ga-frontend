import { useState, useEffect } from "react";
import { Filter, ChevronLeft, ChevronRight } from "lucide-react";
import DatePicker from "../Calendar";
import { ScheduleGrid } from "../ScheduledGrid";
import { ModalAppointment } from "../Modals/ModalAppointment";
import { professionalService } from "../../services/Professional/professional.service";
import { scheduleService } from "../../services/Schedule/schedule.service";
import { availabilityService } from "../../services/Availability/availability.service";
import { userService } from "../../services/User/user.service";
import { userStore } from "../../store/userStore";
import { useToast } from "../../contexts/ToastContext";
import type { TProfessionalData } from "../../store/types/TProfessionalData";
import type { IScheduleData } from "../../services/Schedule/types";
import type { UserData } from "../../services/User/user.service";

export function AppointmentManagement() {
  const { userAccountData } = userStore();
  const { showToast } = useToast();
  
  const [professionals, setProfessionals] = useState<TProfessionalData[]>([]);
  const [schedules, setSchedules] = useState<IScheduleData[]>([]);
  const [availabilities, setAvailabilities] = useState<any[]>([]);
  const [patients, setPatients] = useState<UserData[]>([]);
  const [selectedProfessional, setSelectedProfessional] = useState<string>("all");
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<any>(null);
  const [showAppointmentModal, setShowAppointmentModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingSchedules, setIsLoadingSchedules] = useState(false);

  useEffect(() => {
    if (userAccountData?.access_token) {
      fetchProfessionals();
      fetchPatients();
    }
  }, [userAccountData?.access_token]);

  useEffect(() => {
    if (userAccountData?.access_token) {
      fetchSchedules();
      fetchAvailabilities();
    }
  }, [currentDate, selectedProfessional, userAccountData?.access_token, professionals]);

  const fetchProfessionals = async () => {
    if (!userAccountData?.access_token) return;

    setIsLoading(true);
    try {
      const response = await professionalService.getProfessionals(userAccountData.access_token);
      if (response.status === 200) {
        // Tratar resposta da API (pode ser array direto ou objeto com results)
        let rawData: any[] = [];
        if (Array.isArray(response.data)) {
          rawData = response.data;
        } else if (response.data?.results && Array.isArray(response.data.results)) {
          rawData = response.data.results;
        }
        
        // A API pode retornar estrutura aninhada: { professional: {...}, is_blocked: ... }
        const professionalsData: TProfessionalData[] = rawData.map((item: any) => {
          if (item.full_name || (item.id && !item.professional)) {
            return item;
          }
          if (item.professional) {
            return {
              ...item.professional,
              is_enabled: item.professional.is_enabled !== false
            };
          }
          return item;
        });
        
        setProfessionals(professionalsData);
      }
    } catch (error: any) {
      showToast("Erro!", "Erro ao carregar profissionais.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSchedules = async () => {
    if (!userAccountData?.access_token) return;

    setIsLoadingSchedules(true);
    try {
      const dateStr = currentDate.toISOString().split('T')[0];
      const professionalId = selectedProfessional === "all" ? undefined : selectedProfessional;
      
      // Como não temos GET em /api/admin/schedule/, vamos buscar de outra forma
      // Por enquanto, vamos usar as disponibilidades que já têm os agendamentos
      setSchedules([]);
    } catch (error: any) {
      console.error("Erro ao carregar agendamentos:", error);
    } finally {
      setIsLoadingSchedules(false);
    }
  };

  const fetchPatients = async () => {
    if (!userAccountData?.access_token) return;

    try {
      const response = await userService.getAllUsers(userAccountData.access_token);
      if (response.status === 200) {
        setPatients(response.data);
      }
    } catch (error: any) {
      console.error("Erro ao carregar pacientes:", error);
    }
  };

  const fetchAvailabilities = async () => {
    if (!userAccountData?.access_token || professionals.length === 0) return;

    try {
      const dateStr = currentDate.toISOString().split('T')[0];
      const allAvailabilities: any[] = [];

      const professionalsToFetch = selectedProfessional === "all" 
        ? professionals 
        : professionals.filter(p => p.id === selectedProfessional);

      for (const professional of professionalsToFetch) {
        try {
          const response = await availabilityService.getAvailabilitiesByProfessional(
            professional.id,
            userAccountData.access_token
          );

          if (response.status === 200) {
            const professionalAvailabilities = Array.isArray(response.data) 
              ? response.data 
              : (response.data?.results || []);
            
            // Filtrar apenas disponibilidades para a data selecionada
            const dateAvailabilities = professionalAvailabilities.filter((av: any) => {
              if (av.start_time && av.start_time.includes("T")) {
                const avDate = new Date(av.start_time);
                const avDateStr = avDate.toISOString().split('T')[0];
                return avDateStr === dateStr;
              }
              return false;
            });

            allAvailabilities.push(...dateAvailabilities);
          }
        } catch (error) {
          console.error(`Erro ao buscar disponibilidades do profissional ${professional.id}:`, error);
        }
      }

      setAvailabilities(allAvailabilities);
    } catch (error: any) {
      console.error("Erro ao carregar disponibilidades:", error);
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('pt-BR', {
      weekday: 'long',
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  };

  const formatDateForCalendar = (date: Date) => {
    return date.toISOString().split('T')[0]; 
  };

  const handleDateSelect = (selectedDate: Date) => {
    setCurrentDate(selectedDate);
    setShowCalendar(false);
  };

  const getAppointmentForSlot = (professionalId: string, time: string) => {
    const schedule = schedules.find(s => s.professional_id === professionalId);
    if (!schedule) return null;

    const scheduleDate = new Date(schedule.date);
    const scheduleTime = `${scheduleDate.getHours().toString().padStart(2, "0")}:${scheduleDate.getMinutes().toString().padStart(2, "0")}`;
    
    if (scheduleTime === time) {
      return {
        id: schedule.id,
        professionalId: schedule.professional_id,
        patientName: schedule.patient_id, // TODO: Buscar nome do paciente
        time: scheduleTime,
        duration: 30, // Default 30 minutos
        status: schedule.status === "scheduled" ? "confirmed" : schedule.status,
        date: schedule.date
      };
    }
    
    return null;
  };

  const handleSlotClick = (professionalId: string, time: string) => {
    const appointment = getAppointmentForSlot(professionalId, time);
    
    if (appointment) {
      setSelectedAppointment(appointment);
      setShowAppointmentModal(true);
    }
  };

  const navigateDate = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + (direction === 'next' ? 1 : -1));
    setCurrentDate(newDate);
  };

  const handleCancelAppointment = () => {
    setShowAppointmentModal(false);
    setSelectedAppointment(null);
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-4 border-b bg-white">
          <p className="text-gray-600 text-xs mb-4">
            Clique nos horários para agendar ou bloquear.
          </p>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Filter className="w-3 h-3 text-gray-500" />
              <select
                value={selectedProfessional}
                onChange={(e) => setSelectedProfessional(e.target.value)}
                className="border border-gray-300 rounded-md px-2 py-1 text-xs bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={isLoading}
              >
                <option value="all">Todos os profissionais</option>
                {professionals.map(professional => (
                  <option key={professional.id} value={professional.id}>
                    {professional.full_name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2 relative">
              <button 
                onClick={() => navigateDate('prev')}
                className="p-1 hover:bg-gray-100 rounded-md transition-colors"
              >
                <ChevronLeft className="w-3 h-3" />
              </button>
              
              <button
                onClick={() => setShowCalendar(!showCalendar)}
                className="px-3 py-1 bg-gray-100 rounded-md text-xs font-medium hover:bg-gray-200 min-w-[200px] transition-colors"
              >
                {formatDate(currentDate)}
              </button>
              
              <button 
                onClick={() => navigateDate('next')}
                className="p-1 hover:bg-gray-100 rounded-md transition-colors"
              >
                <ChevronRight className="w-3 h-3" />
              </button>

              {showCalendar && (
                <DatePicker
                  value={formatDateForCalendar(currentDate)}
                  onDateSelect={handleDateSelect}
                  isOpen={showCalendar}
                  onClose={() => setShowCalendar(false)}
                  className="right-0"
                />
              )}
            </div>
          </div>
        </div>

        <div className="p-4">
          {isLoadingSchedules ? (
            <div className="text-center py-8 text-gray-600">Carregando agendamentos...</div>
          ) : (
            <ScheduleGrid 
              professionals={professionals}
              schedules={schedules}
              availabilities={availabilities}
              patients={patients}
              selectedProfessional={selectedProfessional}
              currentDate={currentDate}
              onSlotClick={handleSlotClick}
            />
          )}
        </div>
      </div>

      <ModalAppointment
        isOpen={showAppointmentModal}
        onClose={() => setShowAppointmentModal(false)}
        onCancelAppointment={handleCancelAppointment}
        selectedAppointment={selectedAppointment}
      />
    </>
  );
}
