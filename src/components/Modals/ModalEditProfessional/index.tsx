import { useState, useEffect } from "react";
import Modal from "react-modal";
import { Clock, Plus, X } from "lucide-react";
import ButtonClose from "../../Buttons/ButtonClose";
import ButtonPrimary from "../../Buttons/ButtonPrimary";
import { availabilityStore } from "../../../store/availabilityStore";
import { availabilityService } from "../../../services/Availability/availability.service";
import { userStore } from "../../../store/userStore";
import { useToast } from "../../../contexts/ToastContext";
import type { TProfessionalData } from "../../../store/types/TProfessionalData";
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

const hasTimezoneInfo = (dateString: string): boolean => {
    if (!dateString) return false;
    return /([zZ]|[+-]\d{2}:?\d{2})$/.test(dateString);
};

const extractTimeFromISO = (dateString: string): string => {
    if (!dateString) return "";
    const match = dateString.match(/(\d{2}:\d{2})/);
    return match ? match[1] : "";
};

const WEEKDAY_TO_INDEX: Record<string, number> = {
    MONDAY: 0,
    TUESDAY: 1,
    WEDNESDAY: 2,
    THURSDAY: 3,
    FRIDAY: 4,
    SATURDAY: 5,
    SUNDAY: 6,
};

const getDayIndexFromAvailability = (availability: any): number | null => {
    if (availability?.weekday) {
        const index = WEEKDAY_TO_INDEX[availability.weekday.toString().toUpperCase()];
        if (typeof index === "number") {
            return index;
        }
    }

    if (availability?.day_of_week !== undefined && availability?.day_of_week !== null) {
        const dayNumber = Number(availability.day_of_week);
        if (!Number.isNaN(dayNumber)) {
            if (dayNumber === 0) return 6;
            if (dayNumber >= 1 && dayNumber <= 7) return dayNumber - 1;
        }
    }

    if (availability?.start_time) {
        const date = new Date(availability.start_time);
        if (!Number.isNaN(date.getTime())) {
            const useUTC = hasTimezoneInfo(availability.start_time);
            const day = useUTC ? date.getUTCDay() : date.getDay();
            if (day === 0) return 6;
            return day - 1;
        }
    }

    return null;
};

export default function ModalEditProfessional({
    isOpen,
    onClose,
    professional
}: ModalEditProfessionalProps) {
    const { setAvailabilities } = availabilityStore();
    const { userAccountData } = userStore();
    const { showToast } = useToast();

    const createInitialSchedule = (): DaySchedule[] =>
        DAYS.map(day => ({
            day: day.value,
            label: day.label,
            enabled: false,
            timeSlots: [{ start: "09:00", end: "17:00" }]
        }));

    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingSchedule, setIsLoadingSchedule] = useState(false);
    const [schedule, setSchedule] = useState<DaySchedule[]>(() => createInitialSchedule());

    useEffect(() => {
        if (isOpen && professional && userAccountData?.access_token) {
            setSchedule(createInitialSchedule());
            fetchAvailabilities();
        }
    }, [isOpen, professional, userAccountData?.access_token]);

    useEffect(() => {
        if (!isOpen) {
            setSchedule(createInitialSchedule());
        }
    }, [isOpen]);

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
            const dayIndex = getDayIndexFromAvailability(availability);
            if (dayIndex === null || dayIndex < 0 || dayIndex >= newSchedule.length) {
                return;
            }

            const startTime = extractTimeFromISO(availability.start_time);
            const endTime = extractTimeFromISO(availability.end_time);

            if (!startTime || !endTime) {
                return;
            }

            const daySchedule = newSchedule[dayIndex];
            daySchedule.enabled = true;

            const alreadyExists = daySchedule.timeSlots.some(
                timeSlot => timeSlot.start === startTime && timeSlot.end === endTime
            );

            if (!alreadyExists) {
                daySchedule.timeSlots.push({
                    start: startTime,
                    end: endTime
                });
            }
        });

        setSchedule(newSchedule);
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
                const weekdayLower = weekday.toLowerCase();
                const weekdayUpper = weekday.toUpperCase();
                const targetDayOfWeek = getDayOfWeekNumber(daySchedule.day).toString();

                const validTimeSlots: { start: string; end: string }[] = [];
                const seenTimeSlots = new Set<string>();
                console.log(`[DEBUG] Processando ${daySchedule.day} (${weekday}):`, daySchedule);
                console.log(`[DEBUG] Horários informados:`, daySchedule.timeSlots);

                for (const timeSlot of daySchedule.timeSlots) {
                    console.log(`[DEBUG] Processando timeSlot:`, timeSlot);
                    const [startHour, startMinute] = timeSlot.start.split(":").map(Number);
                    const [endHour, endMinute] = timeSlot.end.split(":").map(Number);

                    if (endHour < startHour || (endHour === startHour && endMinute <= startMinute)) {
                        console.log(`[DEBUG] Horário inválido (fim <= início) ignorado:`, timeSlot);
                        continue;
                    }

                    const startMinutes = startHour * 60 + startMinute;
                    const endMinutes = endHour * 60 + endMinute;
                    const durationMinutes = endMinutes - startMinutes;
                    console.log(`[DEBUG] Duração do horário ${timeSlot.start} - ${timeSlot.end}:`, durationMinutes, "minutos");

                    if (durationMinutes < 60 || durationMinutes > 120) {
                        console.log(`[DEBUG] Horário fora da duração permitida (60-120 min):`, timeSlot);
                        if (durationMinutes < 60) {
                            showToast(
                                "Aviso!",
                                `O horário ${timeSlot.start} - ${timeSlot.end} deve ter duração de pelo menos 1 hora.`,
                                "warning"
                            );
                        }
                        continue;
                    }

                    const timeKey = `${timeSlot.start}-${timeSlot.end}`;
                    if (seenTimeSlots.has(timeKey)) {
                        console.log(`[DEBUG] Horário duplicado ${timeKey} ignorado.`);
                        continue;
                    }

                    seenTimeSlots.add(timeKey);
                    validTimeSlots.push(timeSlot);
                    console.log(`[DEBUG] Horário válido adicionado para ${daySchedule.day}:`, timeSlot);
                }

                if (validTimeSlots.length === 0) {
                    console.log(`[DEBUG] Nenhum horário válido encontrado para ${daySchedule.day}. Pulando.`);
                    continue;
                }

                console.log(`[DEBUG] Total de horários válidos encontrados para ${daySchedule.day}:`, validTimeSlots.length);
 
                // Extrair horários da disponibilidade existente para comparar
                const extractTimeFromAvailability = (av: any) => {
                    const avStart = extractTimeFromISO(av.start_time);
                    const avEnd = extractTimeFromISO(av.end_time);
                    return { avStart, avEnd };
                };

                for (const timeSlot of validTimeSlots) {
                    const existingAvailability = existingAvailabilities.find((av: any) => {
                        const avWeekday = av.weekday?.toUpperCase();
                        const avDayOfWeek = av.day_of_week?.toString();

                        let isSameWeekday = false;
                        if (avWeekday && avWeekday === weekdayUpper) {
                            isSameWeekday = true;
                        } else if (avDayOfWeek && avDayOfWeek === targetDayOfWeek) {
                            isSameWeekday = true;
                        } else {
                            const weekdayVariations = [weekday, weekdayLower, weekdayUpper];
                            if (avWeekday && weekdayVariations.includes(avWeekday)) {
                                isSameWeekday = true;
                            }
                        }

                        if (!isSameWeekday) return false;

                        const { avStart, avEnd } = extractTimeFromAvailability(av);
                        return avStart === timeSlot.start && avEnd === timeSlot.end;
                    });

                    try {
                        if (existingAvailability) {
                            const response = await availabilityService.putUpdateAvailability(
                                existingAvailability.id,
                                {
                                    weekday: weekday,
                                    start_time: timeSlot.start,
                                    end_time: timeSlot.end,
                                    is_active: true,
                                },
                                userAccountData.access_token
                            );

                            if (response.status === 200) {
                                updatedCount++;
                                existingAvailabilities = existingAvailabilities.map((av: any) =>
                                    av.id === existingAvailability.id
                                        ? {
                                              ...av,
                                              ...response.data,
                                          }
                                        : av
                                );
                            }
                        } else {
                            const today = new Date();
                            const dayNumber = getDayOfWeekNumber(daySchedule.day);
                            const currentDay = today.getDay() === 0 ? 7 : today.getDay();
                            const daysUntilDay =
                                dayNumber >= currentDay ? dayNumber - currentDay : 7 - currentDay + dayNumber;

                            const targetDate = new Date(today);
                            targetDate.setDate(today.getDate() + daysUntilDay);
                            targetDate.setHours(0, 0, 0, 0);

                            const dateString = `${targetDate.getFullYear()}-${(targetDate.getMonth() + 1)
                                .toString()
                                .padStart(2, "0")}-${targetDate.getDate().toString().padStart(2, "0")}`;

                            const startDateTimeString = `${dateString}T${timeSlot.start}:00`;
                            const endDateTimeString = `${dateString}T${timeSlot.end}:00`;

                            try {
                                const response = await availabilityService.postCreateAvailability(
                                    {
                                        professional_id: professional.id,
                                        weekday: weekday,
                                        start_time: startDateTimeString,
                                        end_time: endDateTimeString,
                                        is_active: true,
                                    },
                                    userAccountData.access_token
                                );

                                if (response.status === 200 || response.status === 201) {
                                    successCount++;
                                    existingAvailabilities.push(response.data);
                                }
                            } catch (createError: any) {
                                if (createError.response?.status === 409) {
                                    const conflictAvailability = existingAvailabilities.find((av: any) => {
                                        const avWeekday = av.weekday?.toUpperCase();
                                        const avDayOfWeek = av.day_of_week?.toString();
                                        const targetDayOfWeek = getDayOfWeekNumber(daySchedule.day).toString();

                                        const isSameWeekday = avWeekday === weekday || avDayOfWeek === targetDayOfWeek;
                                        if (!isSameWeekday) return false;

                                        const { avStart, avEnd } = extractTimeFromAvailability(av);
                                        return avStart === timeSlot.start && avEnd === timeSlot.end;
                                    });

                                    if (conflictAvailability) {
                                        try {
                                            const updateResponse = await availabilityService.putUpdateAvailability(
                                                conflictAvailability.id,
                                                {
                                                    weekday: weekday,
                                                    start_time: timeSlot.start,
                                                    end_time: timeSlot.end,
                                                    is_active: true,
                                                },
                                                userAccountData.access_token
                                            );

                                            if (updateResponse.status === 200) {
                                                updatedCount++;
                                                existingAvailabilities = existingAvailabilities.map((av: any) =>
                                                    av.id === conflictAvailability.id
                                                        ? {
                                                              ...av,
                                                              ...updateResponse.data,
                                                          }
                                                        : av
                                                );
                                            }
                                        } catch (updateError) {
                                            errorCount++;
                                            console.error("Erro ao atualizar disponibilidade conflitante:", updateError);
                                        }
                                    } else {
                                        showToast(
                                            "Aviso!",
                                            `Não foi possível criar o horário ${timeSlot.start} - ${timeSlot.end} para ${daySchedule.day}. Já existe um horário conflitante.`,
                                            "warning"
                                        );
                                        errorCount++;
                                    }
                                } else {
                                    errorCount++;
                                    console.error("Erro ao criar disponibilidade:", {
                                        weekday: weekday,
                                        start_time: startDateTimeString,
                                        end_time: endDateTimeString,
                                        error: createError.response?.data,
                                    });
                                }
                            }
                        }
                    } catch (error: any) {
                        errorCount++;
                        console.error("Erro ao processar disponibilidade:", {
                            weekday: weekday,
                            start_time: timeSlot.start,
                            end_time: timeSlot.end,
                            error: error.response?.data,
                        });
                    }
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

    const handleClose = () => {
        setSchedule(createInitialSchedule());
        onClose();
    };

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={handleClose}
            className="modal-content"
            overlayClassName="modal-overlay"
            contentLabel="Modal de Agenda do Profissional"
        >
            <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl shadow-xl w-[360px] lg:w-[560px] mx-4 max-h-[90vh] flex flex-col text-[var(--color-text-primary)]">
                <div className="flex justify-between items-center px-6 py-4 border-b border-[var(--color-border)] bg-[rgba(125,212,220,0.18)]">
                    <div className="flex flex-row items-center gap-2">
                        <Clock className="w-5 h-5 text-[var(--color-primary)]" />
                        <h2 className="text-lg font-semibold text-[var(--color-primary)]">
                            Agenda do Profissional
                        </h2>
                    </div>
                    <ButtonClose onClose={handleClose} />
                </div>

                <div className="flex-1 overflow-y-auto px-6 pb-6 bg-[var(--color-surface)]">
                    <div className="flex items-center gap-2 mb-6 mt-4">
                        <Clock className="w-5 h-5 text-[var(--color-primary)]" />
                        <h3 className="text-lg font-semibold text-[var(--color-text-primary)]">Configurar Horários de Trabalho</h3>
                    </div>

                    {isLoadingSchedule ? (
                        <div className="text-center py-8">
                            <div className="text-[var(--color-text-secondary)]">Carregando horários...</div>
                        </div>
                    ) : (
                        <>
                            <div className="space-y-4">
                                {schedule.map((daySchedule, dayIndex) => {
                                    const isEnabled = daySchedule.enabled;
                                    return (
                                        <div
                                            key={daySchedule.day}
                                            className={`rounded-xl border transition-colors shadow-sm ${
                                                isEnabled
                                                    ? "border-[var(--color-primary)] bg-[rgba(125,212,220,0.18)]"
                                                    : "border-[var(--color-border)] bg-[var(--color-surface)]"
                                            }`}
                                        >
                                            <div className="flex items-center justify-between px-4 py-3">
                                                <div className="flex items-center gap-3">
                                                    <input
                                                        type="checkbox"
                                                        checked={isEnabled}
                                                        onChange={() => handleDayToggle(dayIndex)}
                                                        className="w-4 h-4 text-[var(--color-primary)] rounded focus:ring-[var(--color-primary)]"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => handleDayToggle(dayIndex)}
                                                        className="text-sm font-medium text-[var(--color-text-primary)] hover:text-[var(--color-primary)] transition-colors"
                                                    >
                                                        {daySchedule.label}
                                                    </button>
                                                </div>
                                                <span className="text-xs font-medium text-[var(--color-text-secondary)]">
                                                    {isEnabled
                                                        ? `${daySchedule.timeSlots.length} horário(s)`
                                                        : "Desativado"}
                                                </span>
                                            </div>

                                            {isEnabled && (
                                                <div className="px-4 pb-4 space-y-3">
                                                    {daySchedule.timeSlots.map((timeSlot, slotIndex) => (
                                                        <div
                                                            key={slotIndex}
                                                            className="flex flex-wrap items-center gap-3 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 shadow-sm"
                                                        >
                                                            <div className="flex items-center gap-2">
                                                                <label className="text-xs font-medium text-[var(--color-text-secondary)]">
                                                                    Início
                                                                </label>
                                                                <select
                                                                    value={timeSlot.start}
                                                                    onChange={(e) => handleTimeChange(dayIndex, slotIndex, "start", e.target.value)}
                                                                    className="px-3 py-2 border border-[var(--color-border)] rounded-lg bg-[var(--color-surface)] text-sm text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent"
                                                                >
                                                                    {TIME_OPTIONS.map((time) => (
                                                                        <option key={time} value={time}>
                                                                            {time}
                                                                        </option>
                                                                    ))}
                                                                </select>
                                                            </div>
                                                            <span className="text-[var(--color-text-secondary)] text-sm">até</span>
                                                            <div className="flex items-center gap-2">
                                                                <label className="text-xs font-medium text-[var(--color-text-secondary)]">
                                                                    Fim
                                                                </label>
                                                                <select
                                                                    value={timeSlot.end}
                                                                    onChange={(e) => handleTimeChange(dayIndex, slotIndex, "end", e.target.value)}
                                                                    className="px-3 py-2 border border-[var(--color-border)] rounded-lg bg-[var(--color-surface)] text-sm text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent"
                                                                >
                                                                    {TIME_OPTIONS.map((time) => (
                                                                        <option key={time} value={time}>
                                                                            {time}
                                                                        </option>
                                                                    ))}
                                                                </select>
                                                            </div>
                                                            <div className="px-3 py-2 bg-[rgba(1,141,174,0.15)] text-[var(--color-primary)] rounded-lg text-sm font-medium">
                                                                {timeSlot.start} - {timeSlot.end}
                                                            </div>
                                                            {daySchedule.timeSlots.length > 1 && (
                                                                <button
                                                                    onClick={() => handleRemoveTimeSlot(dayIndex, slotIndex)}
                                                                    className="ml-auto p-2 text-[var(--color-danger)] hover:bg-[var(--color-background)] rounded-lg transition-colors"
                                                                >
                                                                    <X className="w-4 h-4" />
                                                                </button>
                                                            )}
                                                        </div>
                                                    ))}
                                                    <button
                                                        onClick={() => handleAddTimeSlot(dayIndex)}
                                                        className="flex items-center gap-2 rounded-lg border border-dashed border-[var(--color-border)] px-4 py-2 text-sm text-[var(--color-text-secondary)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] transition-colors"
                                                    >
                                                        <Plus className="w-4 h-4" />
                                                        Adicionar horário
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>

                            <div className="bg-[rgba(1,141,174,0.12)] border border-[var(--color-border)] rounded-lg p-4 mt-4">
                                <h4 className="font-semibold text-[var(--color-primary)] mb-2">Dicas</h4>
                                <ul className="text-sm text-[var(--color-text-secondary)] space-y-1">
                                    <li>• Marque os dias em que o profissional atende</li>
                                    <li>• Configure múltiplos horários por dia (manhã e tarde)</li>
                                    <li>• Use "Adicionar horário" para novos períodos</li>
                                    <li>• Os horários disponíveis vão de 06:00 às 22:00</li>
                                </ul>
                            </div>

                            <div className="mt-6 flex gap-3 justify-end">
                                <button
                                    onClick={handleClose}
                                    className="w-full mt-6 py-2 px-4 rounded-md transition-colors text-sm border border-[var(--color-border)] bg-[var(--color-background)] text-[var(--color-text-secondary)] hover:bg-[rgba(125,212,220,0.25)]"
                                >
                                    <span>Cancelar</span>
                                </button>
                                <ButtonPrimary
                                    onClick={handleSaveSchedule}
                                    disabled={isLoading}
                                >
                                    {isLoading ? "Salvando..." : "Atualizar Horários"}
                                </ButtonPrimary>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </Modal>
    );
}

