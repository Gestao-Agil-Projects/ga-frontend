import { Calendar } from "lucide-react";
import { useDate } from "../hooks/useDate";
import DatePicker from "../../Calendar";

interface InputProps {
    type: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    placeholder: string;
    label?: string;
    required?: boolean;
    disabled?: boolean;
    className?: string;
    inputDate?: boolean;
    onDateChange?: (date: Date | null) => void;
    calendarPosition?: "top" | "bottom";
}

export default function Input({ 
    type, 
    value, 
    onChange, 
    placeholder, 
    label,
    required = false,
    disabled = false,
    className = "w-full px-4 py-1 border border-neutral-10 rounded-lg focus:outline-none bg-white placeholder:text-sm",
    inputDate = false,
    onDateChange,
    calendarPosition = "bottom"
}: InputProps) {
    const {
        isDatePickerOpen,
        inputValue,
        handleInputChange,
        handleDateSelect,
        toggleDatePicker,
        closeDatePicker
    } = useDate({ value, onChange, onDateChange });

    if (inputDate) {
        return (
            <div>
                {label && (
                    <label className="block text-sm font-medium text-neutral-22 mb-2">
                        {label}
                        {required && <span className="text-neutral-22 ml-1">*</span>}
                    </label>
                )}
                <div className="relative">
                    <input
                        type="text"
                        value={inputValue}
                        onChange={handleInputChange}
                        placeholder={placeholder}
                        className={`${className} pr-10`}
                        maxLength={10}
                        disabled={disabled}
                    />
                    <Calendar 
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-neutral-13 cursor-pointer"
                        onClick={toggleDatePicker}
                    />
                    
                    {isDatePickerOpen && (
                        <div className={`absolute left-0 ${calendarPosition === "top" ? "bottom-[calc(100%+8px)]" : "top-[calc(100%+8px)]"} z-50`}>
                            <DatePicker
                                value={value}
                                onDateSelect={handleDateSelect}
                                isOpen={isDatePickerOpen}
                                onClose={closeDatePicker}
                            />
                        </div>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div>
            {label && (
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    {label}
                    {required && <span className="text-gray-700 ml-1">*</span>}
                </label>
            )}
            <input
                type={type}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className={className}
                disabled={disabled}
            />
        </div>
    );
}
