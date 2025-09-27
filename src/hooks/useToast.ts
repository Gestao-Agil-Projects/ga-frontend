import { useState } from "react";

interface ToastState {
    isVisible: boolean;
    title: string;
    message: string;
    type: "success" | "error" | "warning" | "info";
}

export const useToast = () => {
    const [toast, setToast] = useState<ToastState>({
        isVisible: false,
        title: "",
        message: "",
        type: "success"
    });

    const showToast = (title: string, message: string, type: "success" | "error" | "warning" | "info" = "success") => {
        setToast({
            isVisible: true,
            title,
            message,
            type
        });
    };

    const hideToast = () => {
        setToast(prev => ({
            ...prev,
            isVisible: false
        }));
    };

    return {
        toast,
        showToast,
        hideToast
    };
};