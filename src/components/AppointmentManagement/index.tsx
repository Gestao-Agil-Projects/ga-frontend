import { useState } from "react";
import { Filter, ChevronLeft, ChevronRight } from "lucide-react";
import DatePicker from "../Calendar";
import { ScheduleGrid } from "../ScheduledGrid";
import { ModalAppointment } from "../Modals/ModalAppointment";
import { professionals } from "../../data/professionals";
import { mockAppointments } from "../../data/appointments";

export function AppointmentManagement() {
  const [selectedProfessional, setSelectedProfessional] = useState<string>("all");
  const [currentDate, setCurrentDate] = useState(new Date(2025, 8, 27));
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<any>(null);
  const [showAppointmentModal, setShowAppointmentModal] = useState(false);

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
    return mockAppointments.find(
      apt => apt.professionalId === professionalId && apt.time === time
    );
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
              >
                <option value="all">Todos os profissionais</option>
                {professionals.map(professional => (
                  <option key={professional.id} value={professional.id}>
                    {professional.name}
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
          <ScheduleGrid 
            selectedProfessional={selectedProfessional}
            onSlotClick={handleSlotClick}
          />
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
