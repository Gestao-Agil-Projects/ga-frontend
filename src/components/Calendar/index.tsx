import { useState, useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { 
    format, 
    startOfMonth, 
    endOfMonth, 
    eachDayOfInterval, 
    startOfWeek, 
    endOfWeek,
    isToday as isTodayDate,
    addMonths,
    subMonths
} from "date-fns";
import { ptBR } from "date-fns/locale";
import { getDateFromValue } from "../../utils/dateFormatters";

interface DatePickerProps {
    value: string;
    onDateSelect: (date: Date) => void;
    isOpen: boolean;
    onClose: () => void;
    className?: string;
}

export default function DatePicker({ 
    value, 
    onDateSelect, 
    isOpen, 
    onClose,
    className = ""
}: DatePickerProps) {
    const [currentDate, setCurrentDate] = useState(new Date());
    const datePickerRef = useRef<HTMLDivElement>(null);

    const navigateMonth = (direction: "prev" | "next") => {
        setCurrentDate(prev => {
            if (direction === "prev") {
                return subMonths(prev, 1);
            } else {
                return addMonths(prev, 1);
            }
        });
    };

    const getCalendarDays = () => {
        const monthStart = startOfMonth(currentDate);
        const monthEnd = endOfMonth(currentDate);
        const calendarStart = startOfWeek(monthStart, { weekStartsOn: 0 });
        const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 0 });

        return eachDayOfInterval({ start: calendarStart, end: calendarEnd });
    };

    const isSelected = (day: Date) => {
        const selectedDate = getDateFromValue(value);
        if (!selectedDate) return false;
        
        return day.getDate() === selectedDate.getDate() &&
            day.getMonth() === selectedDate.getMonth() &&
            day.getFullYear() === selectedDate.getFullYear();
    };

    const handleDateSelect = (selectedDate: Date) => {
        const safeDate = new Date(selectedDate);
        safeDate.setHours(12, 0, 0, 0);
        onDateSelect(safeDate);
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (datePickerRef.current && !datePickerRef.current.contains(event.target as Node)) {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div className={`absolute top-full left-0 z-50 mt-1 bg-white border border-neutral-17 rounded-lg shadow-lg p-3 w-64 ${className}`} ref={datePickerRef}>
            <div className="flex items-center justify-between mb-3">
                <button
                    onClick={() => navigateMonth("prev")}
                    className="p-1 hover:bg-neutral-16 rounded"
                >
                    <ChevronLeft className="w-4 h-4" />
                </button>
                
                <h3 className="text-xs font-semibold text-neutral-18">
                    {format(currentDate, "MMMM yyyy", { locale: ptBR })}
                </h3>
                
                <button
                    onClick={() => navigateMonth("next")}
                    className="p-1 hover:bg-neutral-16 rounded"
                >
                    <ChevronRight className="w-4 h-4" />
                </button>
            </div>

            <div className="grid grid-cols-7 gap-1 mb-2">
                {["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"].map(day => (
                    <div key={day} className="text-xs text-neutral-19 text-center py-1">
                        {day}
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-7 gap-1">
                {getCalendarDays().map((day, index) => {
                    const isCurrentMonth = day.getMonth() === currentDate.getMonth();
                    const isToday = isTodayDate(day);
                    const isSelectedDay = isSelected(day);
                    
                    return (
                        <button
                            key={index}
                            onClick={() => handleDateSelect(day)}
                            className={`
                                text-xs py-1 px-1 rounded transition-colors
                                ${!isCurrentMonth ? "text-gray-300" : "cursor-pointer"}
                                ${isToday ? "bg-neutral-10 text-neutral-20 font-semibold" : ""}
                                ${isSelectedDay ? "bg-neutral-21 text-white font-semibold" : ""}
                                ${isCurrentMonth && !isToday && !isSelectedDay ? "text-neutral-22 hover:bg-neutral-23 hover:text-neutral-20" : ""}
                            `}
                        >
                            {format(day, "d")}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
