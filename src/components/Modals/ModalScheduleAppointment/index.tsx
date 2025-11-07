import { useState, useEffect } from "react";
import Modal from "react-modal";
import { Calendar, Clock, User } from "lucide-react";
import ButtonClose from "../../Buttons/ButtonClose";
import ButtonPrimary from "../../Buttons/ButtonPrimary";
import Input from "../../Inputs/Input";
import { professionalService } from "../../../services/Professional/professional.service";
import { availabilityService } from "../../../services/Availability/availability.service";
import { scheduleService } from "../../../services/Schedule/schedule.service";
import { userStore } from "../../../store/userStore";
import { useToast } from "../../../contexts/ToastContext";
import type { TProfessionalData } from "../../../store/types/TProfessionalData";
import type { UserData } from "../../../services/User/user.service";
import { formatSpecialities } from "../../../utils/specialityFormatter";

Modal.setAppElement("#root");

type ModalScheduleMode = "admin" | "patient";

interface ModalScheduleAppointmentProps {
    isOpen: boolean;
    onClose: () => void;
    patient: UserData | null;
    mode?: ModalScheduleMode;
}

interface AvailableSlot {
    id: string;
    availability_id: string; // ID da disponibilidade original
    start_time: string;
    end_time: string;
    professional_id: string;
    status: string;
}

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
        minutes: useUTC ? date.getUTCMinutes() : date.getMinutes()
    };
};

const formatTimeLabel = (dateString: string): string => {
    const { hours, minutes } = getTimePartsFromISO(dateString);
    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;
};

export function ModalScheduleAppointment({
    isOpen,
    onClose,
    patient,
    mode = "admin"
}: ModalScheduleAppointmentProps) {
    const { userAccountData } = userStore();
    const { showToast } = useToast();

    const [professionals, setProfessionals] = useState<TProfessionalData[]>([]);
    const [selectedProfessional, setSelectedProfessional] = useState<string>("");
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [availableSlots, setAvailableSlots] = useState<AvailableSlot[]>([]);
    const [selectedSlot, setSelectedSlot] = useState<string>("");
    const [selectedSpecialty, setSelectedSpecialty] = useState<string>("");
    const [isLoadingProfessionals, setIsLoadingProfessionals] = useState(false);
    const [isLoadingSlots, setIsLoadingSlots] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

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

    const fetchProfessionals = async () => {
        if (!userAccountData?.access_token) return;

        setIsLoadingProfessionals(true);
        try {
            const response =
                mode === "patient"
                    ? await professionalService.getPatientProfessionals(userAccountData.access_token)
                    : await professionalService.getProfessionals(userAccountData.access_token);
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
            const availabilityResponse =
                mode === "patient"
                    ? await availabilityService.getPatientAvailabilitiesByProfessional(
                          selectedProfessional,
                          userAccountData.access_token
                      )
                    : await availabilityService.getAvailabilitiesByProfessional(
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
                if (slot.start_time && slot.start_time.includes("T")) {
                    const slotDateStr = slot.start_time.slice(0, 10);
                    // Verificar se é para a data selecionada, status é "available" e patient_id é null (não agendado)
                    if (mode === "patient") {
                        return slotDateStr === selectedDateStr &&
                            (slot.status === "available" || slot.status === "taken") &&
                            (slot.patient_id === null || slot.patient_id === undefined);
                    }
                    return slotDateStr === selectedDateStr &&
                        slot.status === "available" &&
                        (slot.patient_id === null || slot.patient_id === undefined);
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
                const useUTC = hasTimezoneInfo(slot.start_time);

                // Gerar slots de 1 hora dentro do intervalo disponível
                const currentTime = new Date(slotStart);
                while (currentTime < slotEnd) {
                    const slotTime = new Date(currentTime);
                    const nextTime = new Date(currentTime);
                    if (useUTC) {
                        nextTime.setUTCMinutes(nextTime.getUTCMinutes() + 60);
                    } else {
                        nextTime.setMinutes(nextTime.getMinutes() + 60);
                    }

                    // Verificar se o próximo horário não ultrapassa o fim da disponibilidade
                    if (nextTime > slotEnd) {
                        break;
                    }

                    // Criar um ID único para este slot de horário
                    const slotStartIso = slotTime.toISOString();
                    const slotEndIso = nextTime.toISOString();
                    const slotLabel = formatTimeLabel(slotStartIso);
                    const slotId = `${slot.id}_${slotLabel.replace(":", "")}`;

                    availableTimeSlots.push({
                        id: slotId,
                        availability_id: slot.id, // ID da disponibilidade original
                        start_time: slotStartIso,
                        end_time: slotEndIso,
                        professional_id: slot.professional_id,
                        status: "available"
                    });

                    if (useUTC) {
                        currentTime.setUTCMinutes(currentTime.getUTCMinutes() + 60);
                    } else {
                        currentTime.setMinutes(currentTime.getMinutes() + 60);
                    }
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

    const handleDateInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const isoValue = event.target.value;
        if (!isoValue) {
            setSelectedDate(null);
            setSelectedSlot("");
            return;
        }

        const parsed = new Date(isoValue);
        if (!isNaN(parsed.getTime())) {
            setSelectedDate(parsed);
            setSelectedSlot("");
        }
    };

    const handleDateSelect = (date: Date | null) => {
        if (!date) {
            setSelectedDate(null);
            setSelectedSlot("");
            return;
        }

        const normalized = new Date(date);
        normalized.setHours(12, 0, 0, 0);
        setSelectedDate(normalized);
        setSelectedSlot("");
    };

    const formatTimeSlot = (slot: AvailableSlot) => {
        const startTime = formatTimeLabel(slot.start_time);
        const endTime = formatTimeLabel(slot.end_time);

        return `${startTime} - ${endTime}`;
    };

    const handleSubmit = async () => {
        if (!selectedProfessional || !selectedDate || !selectedSlot || !userAccountData?.access_token) {
            showToast("Erro!", "Por favor, preencha todos os campos.", "error");
            return;
        }

        // Verificar se há especialidade selecionada
        const selectedProfessionalData = professionals.find(p => p.id === selectedProfessional);
        if (mode === "admin") {
            if (!patient) {
                showToast("Erro!", "Paciente não selecionado.", "error");
                return;
            }

            if (!selectedProfessionalData || !selectedProfessionalData.specialities || selectedProfessionalData.specialities.length === 0) {
                showToast("Erro!", "O profissional selecionado não possui especialidades cadastradas.", "error");
                return;
            }
        }

        // Se não há especialidade selecionada, usar a primeira
        const specialtyId = selectedProfessionalData?.specialities?.[0]?.id || "";

        setIsLoading(true);
        try {
            // Buscar o slot selecionado
            const slot = availableSlots.find(s => s.id === selectedSlot);
            if (!slot) {
                throw new Error("Horário não encontrado");
            }

            // Usar o datetime do slot (já está configurado corretamente)
            const appointmentDate = new Date(slot.start_time);

            let response;
            if (mode === "patient") {
                response = await scheduleService.postCreateSchedule(
                    {
                        availability_id: slot.availability_id
                    },
                    userAccountData.access_token
                );
            } else {
                if (!patient) {
                    throw new Error("Paciente não informado.");
                }
                response = await scheduleService.postCreateAdminSchedule(
                    {
                        patient_id: patient.id,
                        professional_id: selectedProfessional,
                        specialty_id: selectedSpecialty || specialtyId,
                        date: appointmentDate.toISOString(),
                        availability_id: slot.availability_id,
                        email: patient.email
                    },
                    userAccountData.access_token
                );
            }

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
    setAvailableSlots([]);
    setSelectedSlot("");
    setSelectedSpecialty("");
    onClose();
};

    const selectedProfessionalData = professionals.find(p => p.id === selectedProfessional);

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={handleClose}
            className="outline-none"
            overlayClassName="fixed inset-0 z-[1200] flex items-center justify-center bg-black/50"
            contentLabel="Modal de Agendamento"
        >
            <div className="relative z-[1300] bg-[#f5f1eb] rounded-lg shadow-xl w-[380px] lg:w-[600px] mx-4 max-h-[90vh] flex flex-col">
                <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
                    <div className="flex flex-row items-center gap-2">
                        <Calendar className="w-5 h-5 text-primary" />
                        <h2 className="text-lg font-semibold text-gray-900">
                            Agendar Consulta
                        </h2>
                    </div>
                    <ButtonClose onClose={handleClose} />
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
                                {mode === "admin" && (
                                    <button
                                        type="button"
                                        className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                                    >
                                        Visualizar
                                    </button>
                                )}
                            </div>
                        </div>
                    )}

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Selecione o Psicólogo
                            </label>
                            {isLoadingProfessionals ? (
                                <div className="text-sm text-gray-600">Carregando profissionais...</div>
                            ) : (
                                <select
                                    value={selectedProfessional}
                                    onChange={(e) => {
                                        setSelectedProfessional(e.target.value);
                                        setSelectedSlot("");
                                        setSelectedSpecialty("");
                                    }}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm text-gray-900"
                                >
                                    <option value="">Selecione um psicólogo</option>
                                    {professionals.map((professional) => (
                                        <option key={professional.id} value={professional.id}>
                                            {professional.full_name} - {formatSpecialities(professional.specialities)}
                                        </option>
                                    ))}
                                </select>
                            )}
                        </div>

                        <div className="relative">
                            <Input
                                type="text"
                                value={selectedDate ? selectedDate.toISOString().split("T")[0] : ""}
                                onChange={handleDateInputChange}
                                onDateChange={handleDateSelect}
                                placeholder="Selecione uma data"
                                label="Selecione a Data"
                                inputDate
                                calendarPosition="top"
                            />
                        </div>

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
                      className="w-full mt-6 bg-gray-100 hover:bg-gray-200 text-black py-2 px-4 rounded-md transition-colors text-sm"
                    >
                      <span>Cancelar</span>
                    </button>
                    <ButtonPrimary
                        onClick={handleSubmit}
                        disabled={isLoading || !selectedProfessional || !selectedDate || !selectedSlot}
                    >
                        {isLoading ? "Agendando..." : "Continuar"}
                    </ButtonPrimary>
                </div>
            </div>
        </Modal>
    );
}

