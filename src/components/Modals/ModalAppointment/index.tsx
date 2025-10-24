import { useState, useEffect, FormEvent } from "react";
import Modal from "react-modal";
import { X, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { useToast } from "../../../hooks/useToast";
import { userStore } from "../../../store/userStore";
import { appointmentService } from "../../../services/Appointment/appointment.service";
import { AvailableTimeSlot } from "../../../services/Appointment/types";

interface ModalAppointmentProps {
    isOpen: boolean;
    onClose: () => void;
    professionalName: string;
    specialty: string;
    professionalId: string;
}

Modal.setAppElement("#root");

export default function ModalAppointment({
    isOpen,
    onClose,
    professionalName,
    specialty,
    professionalId
}: ModalAppointmentProps) {
    const { showToast } = useToast();
    const { userAccountData } = userStore();
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [selectedTime, setSelectedTime] = useState<string | null>(null);
    const [availableTimeSlots, setAvailableTimeSlots] = useState<AvailableTimeSlot[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Fetch available time slots when date is selected
    useEffect(() => {
        async function fetchAvailableSlots() {
            if (!selectedDate || !userAccountData?.access_token) return;

            try {
                setIsLoading(true);
                const formattedDate = selectedDate.toISOString().split('T')[0];
                const response = await appointmentService.getAvailableTimeSlots(
                    professionalId,
                    formattedDate,
                    userAccountData.access_token
                );
                setAvailableTimeSlots(response.data);
            } catch (error) {
                console.error('Error fetching available slots:', error);
                showToast('Erro', 'Não foi possível carregar os horários disponíveis', 'error');
            } finally {
                setIsLoading(false);
            }
        }

        fetchAvailableSlots();
    }, [selectedDate, professionalId, userAccountData?.access_token, showToast]);

    async function handleSubmit(event: FormEvent) {
        event.preventDefault();
        if (!selectedDate || !selectedTime || !userAccountData?.access_token) return;

        try {
            setIsSubmitting(true);
            const formattedDate = selectedDate.toISOString().split('T')[0];
            await appointmentService.createAppointment(
                {
                    userId: userAccountData.user.id,
                    professionalId,
                    appointmentDate: formattedDate,
                    appointmentTime: selectedTime,
                    status: 'SCHEDULED'
                },
                userAccountData.access_token
            );

            showToast('Sucesso', 'Consulta agendada com sucesso!', 'success');
            onClose();
        } catch (error) {
            console.error('Error creating appointment:', error);
            showToast('Erro', 'Não foi possível agendar a consulta', 'error');
        } finally {
            setIsSubmitting(false);
        }
    }

    const handlePreviousMonth = () => {
        setCurrentMonth(prevMonth => {
            const newMonth = new Date(prevMonth);
            newMonth.setMonth(newMonth.getMonth() - 1);
            return newMonth;
        });
    };

    const handleNextMonth = () => {
        setCurrentMonth(prevMonth => {
            const newMonth = new Date(prevMonth);
            newMonth.setMonth(newMonth.getMonth() + 1);
            return newMonth;
        });
    };

    const getCalendarDays = () => {
        const firstDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
        const lastDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);
        const days = [];

        // Add empty cells for days before the first day of the month
        for (let i = 0; i < firstDay.getDay(); i++) {
            days.push(null);
        }

        // Add the days of the month
        for (let i = 1; i <= lastDay.getDate(); i++) {
            days.push(new Date(currentMonth.getFullYear(), currentMonth.getMonth(), i));
        }

        return days;
    };

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onClose}
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-[420px] bg-white rounded-lg shadow-xl outline-none overflow-hidden font-['Open_Sans']"
            overlayClassName="fixed inset-0 bg-[#000]/60 z-50"
            contentLabel="Modal de Agendamento"
        >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#EBEBEB]">
                <div>
                    <button onClick={onClose} className="text-[#545454] hover:text-[#000] absolute top-4 right-6">
                        <X className="w-5 h-5" />
                    </button>
                    <h2 className="text-[15px] font-[700] text-[#000]">
                        Agendar Consulta
                    </h2>
                    <p className="text-[12px] font-[400] text-[#545454]">
                        Agendamento com {professionalName}
                        <br />• {specialty}
                    </p>
                </div>
            </div>

            <div className="p-6">
                <p className="text-[13px] font-[600] text-[#000] mb-4">
                    Escolha um dia disponível para sua consulta
                </p>

                {/* Calendar */}
                <div className="bg-white rounded-lg">
                    {/* Calendar Header */}
                    <div className="flex justify-between items-center mb-4">
                        <button
                            onClick={handlePreviousMonth}
                            className="p-1 hover:bg-[#EBEBEB] rounded"
                        >
                            <ChevronLeft className="w-5 h-5 text-[#545454]" />
                        </button>
                        <span className="text-[14px] font-[600] text-[#000]">
                            {currentMonth.toLocaleDateString('default', { month: 'long', year: 'numeric' })}
                        </span>
                        <button
                            onClick={handleNextMonth}
                            className="p-1 hover:bg-[#EBEBEB] rounded"
                        >
                            <ChevronRight className="w-5 h-5 text-[#545454]" />
                        </button>
                    </div>

                    {/* Calendar Grid */}
                    <div className="grid grid-cols-7 gap-1 mb-4">
                        {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((day) => (
                            <div
                                key={day}
                                className="text-center text-[12px] font-[600] text-[#545454] py-2"
                            >
                                {day}
                            </div>
                        ))}
                        {getCalendarDays().map((date, index) => (
                            <button
                                key={index}
                                onClick={() => date && setSelectedDate(date)}
                                disabled={!date || date < new Date()}
                                className={`
                                    text-center py-2 text-[13px] rounded-lg
                                    ${!date ? 'invisible' : ''}
                                    ${date && date < new Date() ? 'text-[#545454] opacity-50 cursor-not-allowed' : ''}
                                    ${date && date.toDateString() === selectedDate?.toDateString()
                                        ? 'bg-[#018DAE] text-white font-[600]'
                                        : date && date >= new Date()
                                            ? 'hover:bg-[#EBEBEB] text-[#000]'
                                            : ''
                                    }
                                `}
                            >
                                {date?.getDate()}
                            </button>
                        ))}
                    </div>

                    {/* Time Slots */}
                    {selectedDate && (
                        <div className="mt-6">
                            <p className="text-[13px] font-[600] text-[#000] mb-4">
                                Horários para {selectedDate.toLocaleDateString()}
                            </p>
                            {isLoading ? (
                                <div className="flex justify-center items-center py-8">
                                    <Loader2 className="w-6 h-6 text-[#018DAE] animate-spin" />
                                </div>
                            ) : (
                                <div className="grid grid-cols-3 gap-2">
                                    {availableTimeSlots.map((slot) => (
                                        <button
                                            key={slot.time}
                                            onClick={() => setSelectedTime(slot.time)}
                                            disabled={!slot.available}
                                            className={`
                                                py-2 px-4 rounded-lg text-[13px] font-[600]
                                                ${selectedTime === slot.time
                                                    ? 'bg-[#018DAE] text-white'
                                                    : slot.available
                                                        ? 'bg-[#EBEBEB] text-[#000] hover:bg-[#018DAE] hover:text-white'
                                                        : 'bg-[#EBEBEB] text-[#545454] opacity-50 cursor-not-allowed'
                                                }
                                            `}
                                        >
                                            {slot.time}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Confirm Button */}
                    {selectedDate && selectedTime && (
                        <button
                            onClick={handleSubmit}
                            disabled={isSubmitting}
                            className="w-full mt-6 py-3 px-4 bg-gradient-to-r from-[#79D3db] to-[#018DAE] text-white font-[700] text-[15px] rounded-lg shadow-sm transition-all hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2"
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    Agendando...
                                </>
                            ) : (
                                'Confirmar Agendamento'
                            )}
                        </button>
                    )}
                </div>
            </div>
        </Modal>
    );
}

