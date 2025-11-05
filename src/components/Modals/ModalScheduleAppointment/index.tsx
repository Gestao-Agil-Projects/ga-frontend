import { useState, useEffect, useRef } from "react";
import Modal from "react-modal";
import { Calendar, Clock, User, ChevronDown } from "lucide-react";
import ButtonClose from "../../Buttons/ButtonClose";
import ButtonPrimary from "../../Buttons/ButtonPrimary";
import DatePicker from "../../Calendar";
import { professionalService } from "../../../services/Professional/professional.service";
import { availabilityService } from "../../../services/Availability/availability.service";
import { scheduleService } from "../../../services/Schedule/schedule.service";
import { userStore } from "../../../store/userStore";
import { useToast } from "../../../contexts/ToastContext";
import type { TProfessionalData } from "../../../store/types/TProfessionalData";
import type { UserData } from "../../../services/User/user.service";
import { formatSpecialities } from "../../../utils/specialityFormatter";

Modal.setAppElement("#root");

interface ModalScheduleAppointmentProps {
    isOpen: boolean;
    onClose: () => void;
    patient: UserData | null;
}

interface AvailableSlot {
    id: string;
    availability_id: string; // ID da disponibilidade original
    start_time: string;
    end_time: string;
    professional_id: string;
    status: string;
}

export function ModalScheduleAppointment({ isOpen, onClose, patient }: ModalScheduleAppointmentProps) {
    const { userAccountData } = userStore();
    const { showToast } = useToast();

    const [professionals, setProfessionals] = useState<TProfessionalData[]>([]);
    const [selectedProfessional, setSelectedProfessional] = useState<string>("");
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [showCalendar, setShowCalendar] = useState(false);
    const [availableSlots, setAvailableSlots] = useState<AvailableSlot[]>([]);
    const [selectedSlot, setSelectedSlot] = useState<string>("");
    const [selectedSpecialty, setSelectedSpecialty] = useState<string>("");
    const [isLoadingProfessionals, setIsLoadingProfessionals] = useState(false);
    const [isLoadingSlots, setIsLoadingSlots] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (isOpen && userAccountData?.access_token) {
            fetchProfessionals();
        } else if (!isOpen) {
            // Limpar estado quando o modal fechar
            setProfessionals([]);
            setSelectedProfessional("");
            setSelectedDate(null);
            setAvailableSlots([]);
            setSelectedSlot("");
        }
    }, [isOpen, userAccountData?.access_token]);

    useEffect(() => {
        if (selectedProfessional && selectedDate && userAccountData?.access_token) {
            fetchAvailableSlots();
        } else {
            setAvailableSlots([]);
            setSelectedSlot("");
        }
    }, [selectedProfessional, selectedDate, userAccountData?.access_token]);

    // Fechar dropdown quando clicar fora
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        };

        if (isDropdownOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isDropdownOpen]);

    const fetchProfessionals = async () => {
        if (!userAccountData?.access_token) return;

        setIsLoadingProfessionals(true);
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
                // Extrair os dados do professional
                const professionalsData: TProfessionalData[] = rawData.map((item: any) => {
                    // Se a estrutura já é direta, retorna como está
                    if (item.full_name || (item.id && !item.professional)) {
                        return item;
                    }
                    // Se tem a propriedade professional, extrai os dados
                    if (item.professional) {
                        return {
                            ...item.professional,
                            is_enabled: item.professional.is_enabled !== false
                        };
                    }
                    return item;
                });
                
                console.log("[DEBUG] Profissionais carregados:", professionalsData);
                setProfessionals(professionalsData);
            }
        } catch (error: any) {
            console.error("[DEBUG] Erro ao carregar profissionais:", error);
            showToast("Erro!", "Erro ao carregar profissionais.", "error");
        } finally {
            setIsLoadingProfessionals(false);
        }
    };

    const fetchAvailableSlots = async () => {
        if (!selectedProfessional || !selectedDate || !userAccountData?.access_token) return;

        setIsLoadingSlots(true);
        try {
            // 1. Buscar disponibilidades do psicólogo (por dia da semana)
            const availabilityResponse = await availabilityService.getAvailabilitiesByProfessional(
                selectedProfessional,
                userAccountData.access_token
            );

            if (availabilityResponse.status !== 200) {
                setAvailableSlots([]);
                return;
            }

            // 2. Formatar a data selecionada para comparação (YYYY-MM-DD)
            const selectedDateStr = selectedDate.toISOString().split('T')[0];
            
            // 3. Filtrar disponibilidades para a data selecionada
            const allSlots = Array.isArray(availabilityResponse.data) ? availabilityResponse.data : [];
            const dateSlots = allSlots.filter((slot: any) => {
                // Verificar se o slot é para a data selecionada, está disponível e não está agendado
                if (slot.start_time && slot.start_time.includes("T")) {
                    const slotDate = new Date(slot.start_time);
                    const slotDateStr = slotDate.toISOString().split('T')[0];
                    // Verificar se é para a data selecionada, status é "available" e patient_id é null (não agendado)
                    return slotDateStr === selectedDateStr 
                        && slot.status === "available" 
                        && (slot.patient_id === null || slot.patient_id === undefined);
                }
                return false;
            });

            if (dateSlots.length === 0) {
                setAvailableSlots([]);
                return;
            }

            // 4. Criar slots de 30 minutos dentro dos intervalos disponíveis
            const availableTimeSlots: AvailableSlot[] = [];
            
            dateSlots.forEach((slot: any) => {
                // Extrair horário de início e fim da disponibilidade (ISO datetime strings)
                const slotStart = new Date(slot.start_time);
                const slotEnd = new Date(slot.end_time);

                // Gerar slots de 1 hora dentro do intervalo disponível
                const currentTime = new Date(slotStart);
                while (currentTime < slotEnd) {
                    const slotTime = new Date(currentTime);
                    const nextTime = new Date(currentTime);
                    nextTime.setHours(nextTime.getHours() + 1); // Incrementar 1 hora

                    // Verificar se o próximo horário não ultrapassa o fim da disponibilidade
                    if (nextTime > slotEnd) {
                        break;
                    }

                    // Criar um ID único para este slot de horário
                    const slotId = `${slot.id}_${slotTime.getUTCHours()}${slotTime.getUTCMinutes().toString().padStart(2, "0")}`;
                    
                    availableTimeSlots.push({
                        id: slotId,
                        availability_id: slot.id, // ID da disponibilidade original
                        start_time: slotTime.toISOString(),
                        end_time: nextTime.toISOString(),
                        professional_id: slot.professional_id,
                        status: "available"
                    });

                    currentTime.setHours(currentTime.getHours() + 1); // Incrementar 1 hora
                }
            });

            // Ordenar slots por horário
            availableTimeSlots.sort((a, b) => {
                const timeA = new Date(a.start_time).getTime();
                const timeB = new Date(b.start_time).getTime();
                return timeA - timeB;
            });

            setAvailableSlots(availableTimeSlots);
        } catch (error: any) {
            showToast("Erro!", "Erro ao carregar horários disponíveis.", "error");
            setAvailableSlots([]);
        } finally {
            setIsLoadingSlots(false);
        }
    };

    const handleDateSelect = (date: Date) => {
        setSelectedDate(date);
        setShowCalendar(false);
        setSelectedSlot("");
    };

    const formatTimeSlot = (slot: AvailableSlot) => {
        const startDate = new Date(slot.start_time);
        const endDate = new Date(slot.end_time);
        
        const startTime = `${startDate.getUTCHours().toString().padStart(2, "0")}:${startDate.getUTCMinutes().toString().padStart(2, "0")}`;
        const endTime = `${endDate.getUTCHours().toString().padStart(2, "0")}:${endDate.getUTCMinutes().toString().padStart(2, "0")}`;
        
        return `${startTime} - ${endTime}`;
    };

    const handleSubmit = async () => {
        if (!patient || !selectedProfessional || !selectedDate || !selectedSlot || !userAccountData?.access_token) {
            showToast("Erro!", "Por favor, preencha todos os campos.", "error");
            return;
        }

        // Verificar se há especialidade selecionada
        const selectedProfessionalData = professionals.find(p => p.id === selectedProfessional);
        if (!selectedProfessionalData || !selectedProfessionalData.specialities || selectedProfessionalData.specialities.length === 0) {
            showToast("Erro!", "O profissional selecionado não possui especialidades cadastradas.", "error");
            return;
        }

        // Se não há especialidade selecionada, usar a primeira
        const specialtyId = selectedSpecialty || selectedProfessionalData.specialities[0].id;

        setIsLoading(true);
        try {
            // Buscar o slot selecionado
            const slot = availableSlots.find(s => s.id === selectedSlot);
            if (!slot) {
                throw new Error("Horário não encontrado");
            }

            // Usar o datetime do slot (já está configurado corretamente)
            const appointmentDate = new Date(slot.start_time);

            const response = await scheduleService.postCreateAdminSchedule(
                {
                    patient_id: patient.id,
                    professional_id: selectedProfessional,
                    specialty_id: specialtyId,
                    date: appointmentDate.toISOString(),
                    availability_id: slot.availability_id,
                    email: patient.email
                },
                userAccountData.access_token
            );

            if (response.status === 200 || response.status === 201) {
                showToast("Sucesso!", "Consulta agendada com sucesso!", "success");
                handleClose();
            }
        } catch (error: any) {
            // Extrair mensagem de erro de forma segura
            let errorMessage = "Erro ao agendar consulta. Tente novamente.";
            
            if (error.response?.data?.detail) {
                if (Array.isArray(error.response.data.detail)) {
                    // Se for array de erros de validação, pegar a primeira mensagem
                    const firstError = error.response.data.detail[0];
                    errorMessage = firstError?.msg || errorMessage;
                } else if (typeof error.response.data.detail === 'string') {
                    errorMessage = error.response.data.detail;
                }
            }
            
            showToast("Erro!", errorMessage, "error");
        } finally {
            setIsLoading(false);
        }
    };

    const handleClose = () => {
        setSelectedProfessional("");
        setSelectedDate(null);
        setShowCalendar(false);
        setAvailableSlots([]);
        setSelectedSlot("");
        setSelectedSpecialty("");
        setIsDropdownOpen(false);
        onClose();
    };

    const selectedProfessionalData = professionals.find(p => p.id === selectedProfessional);

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={handleClose}
            className="fixed inset-0 flex items-center justify-center z-50"
            overlayClassName="fixed inset-0 bg-black bg-opacity-50"
            contentLabel="Modal de Agendamento"
        >
            <div className="bg-white rounded-lg shadow-xl w-[380px] lg:w-[600px] mx-4 max-h-[90vh] flex flex-col">
                <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
                    <div className="flex flex-row items-center gap-2">
                        <Calendar className="w-5 h-5 text-primary" />
                        <h2 className="text-lg font-semibold text-gray-900">
                            Agendar Consulta
                        </h2>
                    </div>
                    <ButtonClose onClick={handleClose} />
                </div>

                <div className="px-6 pb-6 flex-1 overflow-y-auto">
                    {patient && (
                        <div className="mb-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <User className="w-4 h-4 text-gray-600" />
                                    <span className="text-sm font-medium text-gray-900">
                                        {patient.full_name} ({patient.email})
                                    </span>
                                </div>
                                <button
                                    type="button"
                                    className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                                >
                                    Visualizar
                                </button>
                            </div>
                        </div>
                    )}

                    <div className="space-y-4">
                        {/* Seleção de Psicólogo */}
                        <div className="relative" ref={dropdownRef}>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Selecione o Psicólogo
                            </label>
                            {isLoadingProfessionals ? (
                                <div className="text-sm text-gray-600">Carregando profissionais...</div>
                            ) : (
                                <>
                                    <button
                                        type="button"
                                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                        className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-lg text-left flex items-center justify-between hover:bg-gray-200 transition-colors"
                                    >
                                        <span className={selectedProfessional ? "text-gray-900 font-medium" : "text-gray-500"}>
                                            {selectedProfessional 
                                                ? (() => {
                                                    const selected = professionals.find(p => p.id === selectedProfessional);
                                                    return selected 
                                                        ? `${selected.full_name} - ${formatSpecialities(selected.specialities)}`
                                                        : "Selecione um psicólogo";
                                                })()
                                                : "Selecione um psicólogo"
                                            }
                                        </span>
                                        <ChevronDown 
                                            className={`w-4 h-4 text-gray-500 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}
                                        />
                                    </button>
                                    
                                    {isDropdownOpen && (
                                        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-auto">
                                            {professionals.length > 0 ? (
                                                professionals.map((professional) => {
                                                    const specialtiesText = formatSpecialities(professional.specialities);
                                                    const isSelected = selectedProfessional === professional.id;
                                                    return (
                                                        <button
                                                            key={professional.id}
                                                            type="button"
                                                            onClick={() => {
                                                                setSelectedProfessional(professional.id);
                                                                setSelectedSlot("");
                                                                setSelectedSpecialty("");
                                                                setIsDropdownOpen(false);
                                                            }}
                                                            className={`w-full px-4 py-3 text-left flex items-center justify-between hover:bg-gray-50 transition-colors ${
                                                                isSelected 
                                                                    ? "bg-blue-50 text-gray-900" 
                                                                    : "text-gray-700"
                                                            }`}
                                                        >
                                                            <span className="text-sm font-medium">
                                                                {professional.full_name} - {specialtiesText}
                                                            </span>
                                                            {isSelected && (
                                                                <svg 
                                                                    className="w-5 h-5 text-blue-600" 
                                                                    fill="currentColor" 
                                                                    viewBox="0 0 20 20"
                                                                >
                                                                    <path 
                                                                        fillRule="evenodd" 
                                                                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" 
                                                                        clipRule="evenodd" 
                                                                    />
                                                                </svg>
                                                            )}
                                                        </button>
                                                    );
                                                })
                                            ) : (
                                                <div className="px-4 py-3 text-sm text-gray-500 text-center">
                                                    Nenhum psicólogo cadastrado
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </>
                            )}
                        </div>

                        {/* Seleção de Data */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Selecione a Data
                            </label>
                            <div className="relative">
                                <button
                                    type="button"
                                    onClick={() => setShowCalendar(!showCalendar)}
                                    className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-lg text-left flex items-center justify-between hover:bg-gray-200 transition-colors"
                                >
                                    <span className={selectedDate ? "text-gray-900 font-medium" : "text-gray-500"}>
                                        {selectedDate
                                            ? selectedDate.toLocaleDateString('pt-BR')
                                            : "Selecione uma data"}
                                    </span>
                                    <Calendar className="w-4 h-4 text-gray-500" />
                                </button>
                                {showCalendar && (
                                    <div className="absolute z-10 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg">
                                        <DatePicker
                                            value={selectedDate ? selectedDate.toISOString().split('T')[0] : ""}
                                            onDateSelect={handleDateSelect}
                                            isOpen={showCalendar}
                                            onClose={() => setShowCalendar(false)}
                                        />
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Seleção de Especialidade (se houver múltiplas) */}
                        {selectedProfessionalData && selectedProfessionalData.specialities && selectedProfessionalData.specialities.length > 1 && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Selecione a Especialidade
                                </label>
                                <select
                                    value={selectedSpecialty}
                                    onChange={(e) => setSelectedSpecialty(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                                >
                                    <option value="">Selecione uma especialidade</option>
                                    {selectedProfessionalData.specialities.map((specialty) => (
                                        <option key={specialty.id} value={specialty.id}>
                                            {specialty.title}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        )}

                        {/* Horários Disponíveis */}
                        {selectedProfessional && selectedDate && (
                            <div>
                                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                                    <Clock className="w-4 h-4" />
                                    Horários Disponíveis
                                </label>
                                {isLoadingSlots ? (
                                    <div className="text-sm text-gray-600">Carregando horários...</div>
                                ) : availableSlots.length === 0 ? (
                                    <div className="text-sm text-gray-600 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                                        {selectedProfessionalData 
                                            ? `O profissional ${selectedProfessionalData.full_name} não possui horários disponíveis para ${selectedDate.toLocaleDateString('pt-BR', { weekday: 'long' })} (${selectedDate.toLocaleDateString('pt-BR')}) ou todos os horários já estão agendados.`
                                            : "Nenhum horário disponível para esta data."
                                        }
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-2 gap-2">
                                        {availableSlots.map((slot) => (
                                            <button
                                                key={slot.id}
                                                type="button"
                                                onClick={() => setSelectedSlot(slot.id)}
                                                className={`px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                                                    selectedSlot === slot.id
                                                        ? "bg-primary text-white"
                                                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                                }`}
                                            >
                                                {formatTimeSlot(slot)}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                <div className="px-6 py-4 border-t border-gray-200 bg-white flex gap-3 justify-end">
                    <button
                        onClick={handleClose}
                        className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                    >
                        Cancelar
                    </button>
                    <ButtonPrimary
                        onClick={handleSubmit}
                        disabled={isLoading || !selectedProfessional || !selectedDate || !selectedSlot}
                        className="flex-1"
                    >
                        {isLoading ? "Agendando..." : "Continuar"}
                    </ButtonPrimary>
                </div>
            </div>
        </Modal>
    );
}

