import { useState, useEffect } from "react";
import { getDateFromValue, formatDateForDisplay, formatDateForAPI } from "../../../utils/dateFormatters";
import { parseInputDate } from "../../../utils/dateInputParser";

interface UseDateProps {
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onDateChange?: (date: Date | null) => void;
}

export const useDate = ({ value, onChange, onDateChange }: UseDateProps) => {
    const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
    const [inputValue, setInputValue] = useState("");

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const inputStr = e.target.value;
        setInputValue(inputStr);
        
        const apiDate = parseInputDate(inputStr);
        if (apiDate && apiDate.includes("-")) {
            const syntheticEvent = {
                target: {
                    value: apiDate
                }
            } as React.ChangeEvent<HTMLInputElement>;
            onChange(syntheticEvent);
        }
    };

    const handleDateSelect = (selectedDate: Date) => {
        const safeDate = new Date(selectedDate);
        safeDate.setHours(12, 0, 0, 0);

        const apiDate = formatDateForAPI(safeDate);
        const displayDate = formatDateForDisplay(safeDate);
        
        setInputValue(displayDate);
        
        if (onDateChange) {
            onDateChange(safeDate);
        }
        
        const syntheticEvent = {
            target: {
                value: apiDate
            }
        } as React.ChangeEvent<HTMLInputElement>;
        
        onChange(syntheticEvent);
        setIsDatePickerOpen(false);
    };

    const toggleDatePicker = () => {
        setIsDatePickerOpen(!isDatePickerOpen);
    };

    const closeDatePicker = () => {
        setIsDatePickerOpen(false);
    };

    useEffect(() => {
        if (value) {
            setInputValue(formatDateForDisplay(getDateFromValue(value)));
        } else {
            setInputValue("");
        }
    }, [value]);

    return {
        isDatePickerOpen,
        inputValue,
        handleInputChange,
        handleDateSelect,
        toggleDatePicker,
        closeDatePicker
    };
};
