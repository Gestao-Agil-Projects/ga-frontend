import { useState } from "react";
import { Filter, ChevronLeft, ChevronRight, X } from "lucide-react";
import Modal from "react-modal";
import DatePicker from "../Calendar";
import { ScheduleGrid } from "../ScheduledGrid";
import TabBar from "../TabBar";
import { professionals } from "../../data/professionals";
import { mockAppointments } from "../../data/appointments";

export function AppointmentManagement() {
  const [selectedProfessional, setSelectedProfessional] = useState<string>("all");
  const [currentDate, setCurrentDate] = useState(new Date(2025, 8, 27));
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<any>(null);
  const [showAppointmentModal, setShowAppointmentModal] = useState(false);
  const [showUnblockModal, setShowUnblockModal] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("agenda");

  const dashboardTabs = [
    { id: "agenda", label: "Agenda Geral" },
    { id: "psicologos", label: "Gerenciar Psicólogos" }
  ];

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
      if (appointment.status === "blocked") {
        setShowUnblockModal(true);
      } else {
        setShowAppointmentModal(true);
      }
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
      <TabBar 
        tabs={dashboardTabs}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        className="mb-6"
      />

      {activeTab === "agenda" ? (
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-4 border-b bg-gray-50">
            <p className="text-gray-600 text-xs mb-4">
              Clique nos horários para agendar ou bloquear. Duplo clique para ver detalhes dos agendamentos.
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
      ) : (
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <p className="text-sm text-gray-600 mb-4">
            Crie, edite ou bloqueie profissionais
          </p>
        </div>
      )}

      <Modal
        isOpen={showAppointmentModal}
        onRequestClose={() => setShowAppointmentModal(false)}
        className="fixed inset-0 flex items-center justify-center p-4 z-50"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50"
      >
        {selectedAppointment && (
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="text-base font-semibold">Detalhes do Agendamento</h2>
              <button
                onClick={() => setShowAppointmentModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <div className="p-4 space-y-3">
              <div className="text-xs text-gray-600 bg-gray-50 p-2 rounded-lg">
                {selectedAppointment.time} - {professionals.find(p => p.id === selectedAppointment.professionalId)?.name}
              </div>
              
              <div className="space-y-3">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-gray-700 text-sm">Paciente</span>
                    <span className="text-xs text-green-600 font-medium">Status</span>
                  </div>
                  <div className="text-gray-900 font-medium text-sm">{selectedAppointment.patientName}</div>
                  <div className="text-xs text-green-600 font-medium inline-flex items-center gap-1">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                    Confirmado
                  </div>
                </div>
                
                {selectedAppointment.phone && (
                  <div>
                    <div className="flex items-center gap-1 mb-1">
                      <span className="text-xs">📞</span>
                      <span className="font-medium text-gray-700 text-xs">Telefone</span>
                    </div>
                    <div className="text-gray-900 text-sm">{selectedAppointment.phone}</div>
                  </div>
                )}
                
                {selectedAppointment.email && (
                  <div>
                    <div className="flex items-center gap-1 mb-1">
                      <span className="text-xs">✉️</span>
                      <span className="font-medium text-gray-700 text-xs">Email</span>
                    </div>
                    <div className="text-gray-900 text-sm">{selectedAppointment.email}</div>
                  </div>
                )}
                
                <div>
                  <span className="font-medium text-gray-700 text-xs">Duração</span>
                  <div className="text-gray-900 text-sm">{selectedAppointment.duration} minutos</div>
                </div>
              </div>
              
              <div className="flex gap-2 pt-3">
                <button
                  onClick={handleCancelAppointment}
                  className="flex-1 bg-red-500 text-white py-2 px-3 rounded-lg hover:bg-red-600 font-medium transition-colors text-xs"
                >
                  Cancelar Agendamento
                </button>
                <button
                  onClick={() => setShowAppointmentModal(false)}
                  className="flex-1 bg-blue-500 text-white py-2 px-3 rounded-lg hover:bg-blue-600 font-medium transition-colors text-xs"
                >
                  OK
                </button>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
}
