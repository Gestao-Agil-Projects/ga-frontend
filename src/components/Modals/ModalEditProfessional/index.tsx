import { useState, useEffect } from "react";
import Modal from "react-modal";
import { Edit, Clock, Plus, X } from "lucide-react";
import ButtonClose from "../../Buttons/ButtonClose";
import ButtonPrimary from "../../Buttons/ButtonPrimary";
import Input from "../../Inputs/Input";
import { SpecialityDropdown } from "../../Dropdown/SpecialityDropdown";
import { createProfessionalStore } from "../../../store/createProfessionalStore";
import { professionalStore } from "../../../store/professionalStore";
import { specialityStore } from "../../../store/specialityStore";
import { availabilityStore } from "../../../store/availabilityStore";
import { professionalService } from "../../../services/Professional/professional.service";
import { specialityService } from "../../../services/Speciality/speciality.service";
import { availabilityService } from "../../../services/Availability/availability.service";
import { userStore } from "../../../store/userStore";
import { useToast } from "../../../contexts/ToastContext";
import type { TProfessionalData } from "../../../store/types/TProfessionalData";
import type { TUpdateProfessionalData } from "../../../store/types/TUpdateProfessionalData";
import type { TAvailabilityData } from "../../../store/types/TAvailabilityData";

Modal.setAppElement("#root");

interface ModalEditProfessionalProps {
    isOpen: boolean;
    onClose: () => void;
    professional: TProfessionalData | null;
}

interface DaySchedule {
    day: string;
    label: string;
    enabled: boolean;
    timeSlots: { start: string; end: string }[];
}

const DAYS = [
    { value: "monday", label: "Segunda-feira" },
    { value: "tuesday", label: "Terça-feira" },
    { value: "wednesday", label: "Quarta-feira" },
    { value: "thursday", label: "Quinta-feira" },
    { value: "friday", label: "Sexta-feira" },
    { value: "saturday", label: "Sábado" },
    { value: "sunday", label: "Domingo" },
];

const TIME_OPTIONS = Array.from({ length: 17 }, (_, i) => {
    const hour = i + 6;
    return `${hour.toString().padStart(2, "0")}:00`;
});

export default function ModalEditProfessional({
    isOpen,
    onClose,
    professional
}: ModalEditProfessionalProps) {
    const {
        full_name,
        email,
        phone,
        bio,
        is_enabled,
        specialities,
        setFullName,
        setEmail,
        setPhone,
        setBio,
        setIsEnabled,
        setSpecialities,
        clearForm
    } = createProfessionalStore();

    const { updateProfessional } = professionalStore();
    const { specialities: availableSpecialities, setSpecialities: setAvailableSpecialities } = specialityStore();
    const { availabilities, setAvailabilities } = availabilityStore();
    const { userAccountData } = userStore();
    const { showToast } = useToast();

    const [activeTab, setActiveTab] = useState<"info" | "schedule">("info");
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingSpecialities, setIsLoadingSpecialities] = useState(false);
    const [isLoadingSchedule, setIsLoadingSchedule] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [schedule, setSchedule] = useState<DaySchedule[]>(
        DAYS.map(day => ({
            day: day.value,
            label: day.label,
            enabled: false,
            timeSlots: [{ start: "09:00", end: "17:00" }]
        }))
    );

    useEffect(() => {
        if (isOpen && professional && userAccountData?.access_token) {
            setFullName(professional.full_name || "");
            setEmail(professional.email || "");
            setPhone(professional.phone || "");
            setBio(professional.bio || "");
            setIsEnabled(professional.is_enabled !== false);
            // Verificar se specialities existe e é um array antes de usar map
            if (professional.specialities && Array.isArray(professional.specialities)) {
                setSpecialities(professional.specialities.map(s => s.id));
            } else {
                setSpecialities([]);
            }
            fetchSpecialities();
            fetchAvailabilities();
        }
    }, [isOpen, professional, userAccountData?.access_token]);

    useEffect(() => {
        if (!isOpen) {
            clearForm();
            setActiveTab("info");
            setSchedule(DAYS.map(day => ({
                day: day.value,
                label: day.label,
                enabled: false,
                timeSlots: [{ start: "09:00", end: "17:00" }]
            })));
        }
    }, [isOpen]);

    const fetchSpecialities = async () => {
        if (!userAccountData?.access_token) return;
        
        setIsLoadingSpecialities(true);
        try {
            const response = await specialityService.getSpecialities(userAccountData.access_token);
            if (response.status === 200) {
                setAvailableSpecialities(response.data);
            }
        } catch (error: any) {
            showToast("Erro!", "Erro ao carregar especialidades.", "error");
        } finally {
            setIsLoadingSpecialities(false);
        }
    };

    const fetchAvailabilities = async () => {
        if (!professional || !userAccountData?.access_token) return;
        
        setIsLoadingSchedule(true);
        try {
            const response = await availabilityService.getAvailabilitiesByProfessional(
                professional.id,
                userAccountData.access_token
            );
            
            if (response.status === 200) {
                setAvailabilities(response.data);
                // Processar disponibilidades para o schedule
                processAvailabilitiesToSchedule(response.data);
            }
        } catch (error: any) {
            showToast("Erro!", "Erro ao carregar horários.", "error");
        } finally {
            setIsLoadingSchedule(false);
        }
    };

    const processAvailabilitiesToSchedule = (availabilities: TAvailabilityData[]) => {
        const newSchedule = DAYS.map(day => ({
            day: day.value,
            label: day.label,
            enabled: false,
            timeSlots: [] as { start: string; end: string }[]
        }));

        availabilities.forEach(availability => {
            const startDate = new Date(availability.start_time);
            const endDate = new Date(availability.end_time);
            const dayIndex = startDate.getDay() === 0 ? 6 : startDate.getDay() - 1; // Segunda = 0
            
            if (dayIndex >= 0 && dayIndex < newSchedule.length) {
                const daySchedule = newSchedule[dayIndex];
                daySchedule.enabled = true;
                daySchedule.timeSlots.push({
                    start: `${startDate.getHours().toString().padStart(2, "0")}:${startDate.getMinutes().toString().padStart(2, "0")}`,
                    end: `${endDate.getHours().toString().padStart(2, "0")}:${endDate.getMinutes().toString().padStart(2, "0")}`
                });
            }
        });

        setSchedule(newSchedule);
    };

    const handleSpecialityToggle = (specialityId: string) => {
        const newSpecialities = specialities.includes(specialityId)
            ? specialities.filter((id: string) => id !== specialityId)
            : [...specialities, specialityId];
        setSpecialities(newSpecialities);
    };

    const handleDayToggle = (dayIndex: number) => {
        const newSchedule = [...schedule];
        newSchedule[dayIndex].enabled = !newSchedule[dayIndex].enabled;
        if (newSchedule[dayIndex].enabled && newSchedule[dayIndex].timeSlots.length === 0) {
            newSchedule[dayIndex].timeSlots.push({ start: "09:00", end: "17:00" });
        }
        setSchedule(newSchedule);
    };

    const handleAddTimeSlot = (dayIndex: number) => {
        const newSchedule = [...schedule];
        newSchedule[dayIndex].timeSlots.push({ start: "09:00", end: "17:00" });
        setSchedule(newSchedule);
    };

    const handleRemoveTimeSlot = (dayIndex: number, slotIndex: number) => {
        const newSchedule = [...schedule];
        newSchedule[dayIndex].timeSlots.splice(slotIndex, 1);
        setSchedule(newSchedule);
    };

    const handleTimeChange = (dayIndex: number, slotIndex: number, field: "start" | "end", value: string) => {
        const newSchedule = [...schedule];
        newSchedule[dayIndex].timeSlots[slotIndex][field] = value;
        setSchedule(newSchedule);
    };

    // Função para converter weekday do formato do frontend para o formato da API
    const getWeekdayForAPI = (dayValue: string): string => {
        const weekdayMap: { [key: string]: string } = {
            "monday": "MONDAY",
            "tuesday": "TUESDAY",
            "wednesday": "WEDNESDAY",
            "thursday": "THURSDAY",
            "friday": "FRIDAY",
            "saturday": "SATURDAY",
            "sunday": "SUNDAY"
        };
        return weekdayMap[dayValue] || dayValue.toUpperCase();
    };

    const handleSaveSchedule = async () => {
        if (!professional || !userAccountData?.access_token) return;

        setIsLoading(true);
        let successCount = 0;
        let updatedCount = 0;
        let errorCount = 0;

        try {
            // Primeiro, buscar disponibilidades existentes para verificar duplicatas
            const existingResponse = await availabilityService.getAvailabilitiesByProfessional(
                professional.id,
                userAccountData.access_token
            );
            
            // Tratar resposta da API (pode ser array direto ou objeto com results)
            let existingAvailabilities: any[] = [];
            if (existingResponse.status === 200) {
                if (Array.isArray(existingResponse.data)) {
                    existingAvailabilities = existingResponse.data;
                } else if (existingResponse.data?.results && Array.isArray(existingResponse.data.results)) {
                    existingAvailabilities = existingResponse.data.results;
                }
            }

            // Processar cada dia habilitado - APENAS UMA CHAMADA POR DIA
            for (const daySchedule of schedule) {
                if (!daySchedule.enabled || daySchedule.timeSlots.length === 0) continue;

                const weekday = getWeekdayForAPI(daySchedule.day);
                
                // DEBUG: Log o que está no schedule para este dia
                console.log(`[DEBUG] Processando ${daySchedule.day} (${weekday}):`, {
                    enabled: daySchedule.enabled,
                    timeSlots: daySchedule.timeSlots,
                    timeSlotsCount: daySchedule.timeSlots.length
                });
                
                // Remover timeSlots duplicados e inválidos, manter apenas o ÚLTIMO válido (o mais recente)
                let lastValidTimeSlot: { start: string; end: string } | null = null;
                const seenTimeSlots = new Set<string>();
                const validTimeSlots: { start: string; end: string }[] = [];
                
                for (const timeSlot of daySchedule.timeSlots) {
                    // DEBUG: Log cada timeSlot sendo processado
                    console.log(`[DEBUG] Processando timeSlot:`, timeSlot);
                    // Validar se o horário de fim é maior que o de início
                    const [startHour, startMinute] = timeSlot.start.split(":").map(Number);
                    const [endHour, endMinute] = timeSlot.end.split(":").map(Number);
                    
                    if (endHour < startHour || (endHour === startHour && endMinute <= startMinute)) {
                        continue; // Pular horários inválidos
                    }

                    // Validar se o intervalo não excede 2 horas (limite da API)
                    const startMinutes = startHour * 60 + startMinute;
                    const endMinutes = endHour * 60 + endMinute;
                    const durationMinutes = endMinutes - startMinutes;
                    
                    if (durationMinutes > 120) { // 2 horas = 120 minutos
                        continue; // Pular horários que excedem 2 horas (já avisamos antes)
                    }

                    // Criar chave única para o horário
                    const timeKey = `${timeSlot.start}-${timeSlot.end}`;
                    
                    // Se já vimos este horário, pular (evitar duplicatas)
                    if (seenTimeSlots.has(timeKey)) {
                        continue;
                    }
                    
                    seenTimeSlots.add(timeKey);
                    
                    // Adicionar à lista de horários válidos
                    validTimeSlots.push(timeSlot);
                    lastValidTimeSlot = timeSlot; // Manter o último válido
                    console.log(`[DEBUG] Horário válido adicionado para ${daySchedule.day}:`, timeSlot);
                }

                // Se não há horário válido, pular este dia
                if (!lastValidTimeSlot) {
                    console.log(`[DEBUG] Nenhum horário válido encontrado para ${daySchedule.day}`);
                    continue;
                }
                
                console.log(`[DEBUG] Total de horários válidos encontrados para ${daySchedule.day}:`, validTimeSlots.length);
                console.log(`[DEBUG] Horário final a ser processado para ${daySchedule.day} (último válido):`, lastValidTimeSlot);
                
                // Usar o último horário válido (o mais recente digitado pelo usuário)
                const firstValidTimeSlot = lastValidTimeSlot;

                // Extrair horários da disponibilidade existente para comparar
                const extractTimeFromAvailability = (av: any) => {
                    let avStart = "";
                    let avEnd = "";
                    
                    if (av.start_time) {
                        if (av.start_time.includes("T")) {
                            const avStartDate = new Date(av.start_time);
                            avStart = `${avStartDate.getHours().toString().padStart(2, "0")}:${avStartDate.getMinutes().toString().padStart(2, "0")}`;
                        } else {
                            avStart = av.start_time.slice(0, 5);
                        }
                    }
                    
                    if (av.end_time) {
                        if (av.end_time.includes("T")) {
                            const avEndDate = new Date(av.end_time);
                            avEnd = `${avEndDate.getHours().toString().padStart(2, "0")}:${avEndDate.getMinutes().toString().padStart(2, "0")}`;
                        } else {
                            avEnd = av.end_time.slice(0, 5);
                        }
                    }
                    
                    return { avStart, avEnd };
                };

                // Verificar se já existe disponibilidade para este weekday E horário específico
                const existingAvailability = existingAvailabilities.find((av: any) => {
                    // Tentar múltiplas formas de comparação de weekday
                    const avWeekday = av.weekday?.toUpperCase();
                    const avDayOfWeek = av.day_of_week?.toString();
                    const targetDayOfWeek = getDayOfWeekNumber(daySchedule.day).toString();
                    
                    // Verificar se é o mesmo weekday
                    let isSameWeekday = false;
                    if (avWeekday && avWeekday === weekday) {
                        isSameWeekday = true;
                    } else if (avDayOfWeek && avDayOfWeek === targetDayOfWeek) {
                        isSameWeekday = true;
                    } else {
                        const weekdayVariations = [
                            weekday,
                            weekday.toLowerCase(),
                            weekday.toUpperCase(),
                        ];
                        if (avWeekday && weekdayVariations.includes(avWeekday)) {
                            isSameWeekday = true;
                        }
                    }
                    
                    if (!isSameWeekday) return false;
                    
                    // Se é o mesmo weekday, verificar se é o mesmo horário
                    const { avStart, avEnd } = extractTimeFromAvailability(av);
                    return avStart === firstValidTimeSlot.start && avEnd === firstValidTimeSlot.end;
                });

                // FAZER APENAS UMA CHAMADA POR DIA
                try {
                    if (existingAvailability) {
                        // Atualizar disponibilidade existente para este weekday
                        const response = await availabilityService.putUpdateAvailability(
                            existingAvailability.id,
                            {
                                weekday: weekday,
                                start_time: firstValidTimeSlot.start, // Formato HH:MM
                                end_time: firstValidTimeSlot.end, // Formato HH:MM
                                is_active: true
                            },
                            userAccountData.access_token
                        );

                        if (response.status === 200) {
                            updatedCount++;
                        }
                    } else {
                        // Criar nova disponibilidade para este weekday
                        // A API espera datetime completo, não apenas HH:MM
                        // Construir datetime baseado na próxima ocorrência do weekday
                        const today = new Date();
                        const dayNumber = getDayOfWeekNumber(daySchedule.day);
                        const currentDay = today.getDay() === 0 ? 7 : today.getDay();
                        const daysUntilDay = dayNumber >= currentDay 
                            ? dayNumber - currentDay 
                            : 7 - currentDay + dayNumber;
                        
                        const targetDate = new Date(today);
                        targetDate.setDate(today.getDate() + daysUntilDay);
                        targetDate.setHours(0, 0, 0, 0);

                        const [startHour, startMinute] = firstValidTimeSlot.start.split(":").map(Number);
                        const [endHour, endMinute] = firstValidTimeSlot.end.split(":").map(Number);

                        const startDateTime = new Date(targetDate);
                        startDateTime.setHours(startHour, startMinute, 0, 0);

                        const endDateTime = new Date(targetDate);
                        endDateTime.setHours(endHour, endMinute, 0, 0);

                        try {
                            const response = await availabilityService.postCreateAvailability(
                                {
                                    professional_id: professional.id,
                                    weekday: weekday,
                                    start_time: startDateTime.toISOString(), // Datetime completo
                                    end_time: endDateTime.toISOString(), // Datetime completo
                                    is_active: true
                                },
                                userAccountData.access_token
                            );

                            if (response.status === 200 || response.status === 201) {
                                successCount++;
                            }
                        } catch (createError: any) {
                            // Se der 409 (Conflict), significa que já existe disponibilidade conflitante
                            if (createError.response?.status === 409) {
                                // Buscar a disponibilidade conflitante com o mesmo horário específico
                                const conflictAvailability = existingAvailabilities.find((av: any) => {
                                    // Verificar weekday
                                    const avWeekday = av.weekday?.toUpperCase();
                                    const avDayOfWeek = av.day_of_week?.toString();
                                    const targetDayOfWeek = getDayOfWeekNumber(daySchedule.day).toString();
                                    
                                    const isSameWeekday = avWeekday === weekday || avDayOfWeek === targetDayOfWeek;
                                    if (!isSameWeekday) return false;
                                    
                                    // Verificar se é o mesmo horário específico
                                    const { avStart, avEnd } = extractTimeFromAvailability(av);
                                    return avStart === firstValidTimeSlot.start && avEnd === firstValidTimeSlot.end;
                                });
                                
                                if (conflictAvailability) {
                                    // Se encontrou conflito com o mesmo horário, atualizar
                                    try {
                                        const updateResponse = await availabilityService.putUpdateAvailability(
                                            conflictAvailability.id,
                                            {
                                                weekday: weekday,
                                                start_time: firstValidTimeSlot.start, // HH:MM para update
                                                end_time: firstValidTimeSlot.end, // HH:MM para update
                                                is_active: true
                                            },
                                            userAccountData.access_token
                                        );
                                        
                                        if (updateResponse.status === 200) {
                                            updatedCount++;
                                        }
                                    } catch (updateError) {
                                        errorCount++;
                                        console.error("Erro ao atualizar disponibilidade conflitante:", updateError);
                                    }
                                } else {
                                    // Se não encontrou na lista inicial, pode ser conflito de sobreposição
                                    // Nesse caso, não fazer nada (já existe disponibilidade conflitante)
                                    showToast(
                                        "Aviso!",
                                        `Não foi possível criar o horário ${firstValidTimeSlot.start} - ${firstValidTimeSlot.end} para ${daySchedule.day}. Já existe um horário conflitante.`,
                                        "warning"
                                    );
                                    errorCount++;
                                }
                            } else {
                                // Qualquer outro erro (422, 400, etc) - tratar como erro
                                errorCount++;
                                console.error("Erro ao criar disponibilidade:", {
                                    weekday,
                                    start_time: startDateTime.toISOString(),
                                    end_time: endDateTime.toISOString(),
                                    error: createError.response?.data
                                });
                            }
                        }
                    }
                } catch (error: any) {
                    errorCount++;
                    console.error("Erro ao processar disponibilidade:", {
                        weekday,
                        start_time: firstValidTimeSlot.start,
                        end_time: firstValidTimeSlot.end,
                        error: error.response?.data
                    });
                }
            }

            const totalProcessed = successCount + updatedCount;
            
            if (totalProcessed > 0 && errorCount === 0) {
                showToast(
                    "Sucesso!",
                    `${successCount > 0 ? `${successCount} nova(s) disponibilidade(s) criada(s).` : ''}${updatedCount > 0 ? ` ${updatedCount} atualizada(s).` : ''} Horários salvos com sucesso!`,
                    "success"
                );
            } else if (errorCount > 0) {
                showToast(
                    "Aviso!",
                    `${totalProcessed} horário(s) processado(s), mas ${errorCount} erro(s) ocorreram. Verifique os dados e tente novamente.`,
                    "warning"
                );
            }

            await fetchAvailabilities();
        } catch (error: any) {
            showToast(
                "Erro!",
                error.response?.data?.detail || "Erro ao salvar horários. Tente novamente.",
                "error"
            );
        } finally {
            setIsLoading(false);
        }
    };

    const getDayOfWeekNumber = (dayValue: string): number => {
        const dayMap: { [key: string]: number } = {
            "monday": 1,
            "tuesday": 2,
            "wednesday": 3,
            "thursday": 4,
            "friday": 5,
            "saturday": 6,
            "sunday": 0
        };
        return dayMap[dayValue] ?? 0;
    };

    const handleSaveInfo = async () => {
        if (!professional || !userAccountData?.access_token) return;

        if (!full_name.trim() || !email.trim() || !phone.trim()) {
            showToast("Erro!", "Por favor, preencha todos os campos obrigatórios.", "error");
            return;
        }

        setIsLoading(true);
        try {
            const updateData: TUpdateProfessionalData = {
                full_name: full_name.trim(),
                email: email.trim(),
                phone: phone.trim(),
                bio: bio.trim(),
                is_enabled,
                specialities
            };

            const response = await professionalService.putUpdateProfessional(
                professional.id,
                updateData,
                userAccountData.access_token
            );

            if (response.status === 200) {
                updateProfessional(professional.id, response.data);
                showToast("Sucesso!", "Profissional atualizado com sucesso!", "success");
                handleClose();
            }
        } catch (error: any) {
            showToast("Erro!", error.response?.data?.detail || "Erro ao atualizar profissional.", "error");
        } finally {
            setIsLoading(false);
        }
    };

    const handleClose = () => {
        clearForm();
        setActiveTab("info");
        onClose();
    };

    const filteredSpecialities = searchTerm.trim()
        ? availableSpecialities.filter(speciality =>
            speciality.title.toLowerCase().includes(searchTerm.toLowerCase()))
        : [];

    const handleSpecialitySelect = (specialityId: string) => {
        if (!specialities.includes(specialityId)) {
            setSpecialities([...specialities, specialityId]);
        }
        setSearchTerm("");
    };

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={handleClose}
            className="modal-content"
            overlayClassName="modal-overlay"
            contentLabel="Modal de Editar Profissional"
        >
            <div className="bg-neutral-09 rounded-lg shadow-xl w-[380px] lg:w-[700px] mx-4 max-h-[90vh] flex flex-col">
                <div className="flex justify-between items-center px-6 py-4 border-b">
                    <div className="flex flex-row items-center gap-2">
                        <Edit className="w-5 h-5 text-primary" />
                        <h2 className="text-lg font-semibold text-neutral-18">
                            Editar Profissional
                        </h2>
                    </div>
                    <ButtonClose onClose={handleClose} />
                </div>

                {/* Tabs */}
                <div className="flex border-b px-6">
                    <button
                        onClick={() => setActiveTab("info")}
                        className={`px-4 py-3 font-medium text-sm transition-colors ${
                            activeTab === "info"
                                ? "text-primary border-b-2 border-primary"
                                : "text-neutral-19 hover:text-primary"
                        }`}
                    >
                        Informações Básicas
                    </button>
                    <button
                        onClick={() => setActiveTab("schedule")}
                        className={`px-4 py-3 font-medium text-sm transition-colors flex items-center gap-2 ${
                            activeTab === "schedule"
                                ? "text-primary border-b-2 border-primary"
                                : "text-neutral-19 hover:text-primary"
                        }`}
                    >
                        <Clock className="w-4 h-4" />
                        Agenda
                    </button>
                </div>

                <div className="px-6 pb-6 flex-1 overflow-y-auto">
                    {activeTab === "info" ? (
                        <div className="space-y-4 mt-4">
                            <Input
                                type="text"
                                value={full_name}
                                onChange={(e) => setFullName(e.target.value)}
                                placeholder="Ex: Dr. João Silva"
                                label="Nome Completo"
                                required
                            />

                            <Input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Ex: joao.silva@email.com"
                                label="E-mail"
                                required
                            />

                            <Input
                                type="tel"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                placeholder="Ex: 11999999999"
                                label="Telefone"
                                required
                            />

                            <Input
                                type="text"
                                value={bio}
                                onChange={(e) => setBio(e.target.value)}
                                placeholder="Ex: Biografia do profissional"
                                label="Biografia"
                            />

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Buscar Especialidades
                                </label>
                                <Input
                                    type="text"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    placeholder="Buscar especialidades..."
                                    label=""
                                />
                            </div>

                            {specialities.length > 0 && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Especialidades Selecionadas
                                    </label>
                                    <div className="flex flex-wrap gap-2">
                                        {specialities.map(specialityId => {
                                            const speciality = availableSpecialities.find(s => s.id === specialityId);
                                            return speciality ? (
                                                <div key={specialityId} className="flex items-center gap-2 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                                                    <span>{speciality.title}</span>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleSpecialityToggle(specialityId)}
                                                        className="text-blue-600 hover:text-blue-800"
                                                    >
                                                        <X className="w-3 h-3" />
                                                    </button>
                                                </div>
                                            ) : null;
                                        })}
                                    </div>
                                </div>
                            )}

                            <div className="mt-6">
                                <ButtonPrimary
                                    onClick={handleSaveInfo}
                                    disabled={!full_name.trim() || !email.trim() || !phone.trim() || isLoading}
                                >
                                    {isLoading ? "Atualizando..." : "Atualizar Informações"}
                                </ButtonPrimary>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-4 mt-4">
                            <div className="flex items-center gap-2 mb-4">
                                <Clock className="w-5 h-5 text-primary" />
                                <h3 className="text-lg font-semibold text-gray-900">Configurar Horários de Trabalho</h3>
                            </div>

                            {isLoadingSchedule ? (
                                <div className="text-center py-8">
                                    <div className="text-gray-600">Carregando horários...</div>
                                </div>
                            ) : (
                                <>
                                    {schedule.map((daySchedule, dayIndex) => (
                                        <div key={daySchedule.day} className="border rounded-lg p-4">
                                            <div className="flex items-center gap-3 mb-3">
                                                <input
                                                    type="checkbox"
                                                    checked={daySchedule.enabled}
                                                    onChange={() => handleDayToggle(dayIndex)}
                                                    className="w-4 h-4 text-primary rounded focus:ring-primary"
                                                />
                                                <label className="font-medium text-gray-900 cursor-pointer" onClick={() => handleDayToggle(dayIndex)}>
                                                    {daySchedule.label}
                                                </label>
                                            </div>

                                            {daySchedule.enabled && (
                                                <div className="ml-7 space-y-3">
                                                    {daySchedule.timeSlots.map((timeSlot, slotIndex) => (
                                                        <div key={slotIndex} className="flex items-center gap-2">
                                                            <select
                                                                value={timeSlot.start}
                                                                onChange={(e) => handleTimeChange(dayIndex, slotIndex, "start", e.target.value)}
                                                                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                                                            >
                                                                {TIME_OPTIONS.map(time => (
                                                                    <option key={time} value={time}>{time}</option>
                                                                ))}
                                                            </select>
                                                            <span className="text-gray-600">até</span>
                                                            <select
                                                                value={timeSlot.end}
                                                                onChange={(e) => handleTimeChange(dayIndex, slotIndex, "end", e.target.value)}
                                                                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                                                            >
                                                                {TIME_OPTIONS.map(time => (
                                                                    <option key={time} value={time}>{time}</option>
                                                                ))}
                                                            </select>
                                                            <div className="px-3 py-2 bg-blue-100 text-blue-800 rounded-lg text-sm font-medium">
                                                                {timeSlot.start} - {timeSlot.end}
                                                            </div>
                                                            {daySchedule.timeSlots.length > 1 && (
                                                                <button
                                                                    onClick={() => handleRemoveTimeSlot(dayIndex, slotIndex)}
                                                                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                                >
                                                                    <X className="w-4 h-4" />
                                                                </button>
                                                            )}
                                                        </div>
                                                    ))}
                                                    <button
                                                        onClick={() => handleAddTimeSlot(dayIndex)}
                                                        className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                                                    >
                                                        <Plus className="w-4 h-4" />
                                                        Horário
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    ))}

                                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
                                        <h4 className="font-semibold text-blue-900 mb-2">Dicas</h4>
                                        <ul className="text-sm text-blue-800 space-y-1">
                                            <li>• Marque os dias em que o profissional atende</li>
                                            <li>• Configure múltiplos horários por dia (manhã e tarde)</li>
                                            <li>• Use "+ Horário" para adicionar novos períodos de atendimento</li>
                                            <li>• Os horários disponíveis vão de 06:00 às 22:00</li>
                                        </ul>
                                    </div>

                                    <div className="mt-6 flex gap-3">
                                        <button
                                            onClick={handleClose}
                                            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                                        >
                                            Cancelar
                                        </button>
                                        <ButtonPrimary
                                            onClick={handleSaveSchedule}
                                            disabled={isLoading}
                                            className="flex-1"
                                        >
                                            {isLoading ? "Salvando..." : "Atualizar Horários"}
                                        </ButtonPrimary>
                                    </div>
                                </>
                            )}
                        </div>
                    )}
                </div>
            </div>

            <SpecialityDropdown
                isVisible={searchTerm.trim().length > 0}
                position={{ top: 0, left: 0, width: 0 }}
                isLoadingSpecialities={isLoadingSpecialities}
                filteredSpecialities={filteredSpecialities}
                specialities={specialities}
                handleSpecialitySelect={handleSpecialitySelect}
                showEditButtons={false}
            />
        </Modal>
    );
}

