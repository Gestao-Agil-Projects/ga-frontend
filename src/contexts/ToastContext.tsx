import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";
import Toast from "../components/Toast";

interface ToastData {
    isVisible: boolean;
    title: string;
    message: string;
    type: "success" | "error" | "warning" | "info";
}

interface ToastContextType {
    showToast: (title: string, message: string, type?: "success" | "error" | "warning" | "info") => void;
    hideToast: () => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

interface ToastProviderProps {
    children: ReactNode;
}

export function ToastProvider({ children }: ToastProviderProps) {
    const [toast, setToast] = useState<ToastData>({
        isVisible: false,
        title: "",
        message: "",
        type: "success"
    });

    const showToast = (title: string, message: string, type: "success" | "error" | "warning" | "info" = "success"): void => {
        setToast({
            isVisible: true,
            title,
            message,
            type
        });
    };

    const hideToast = (): void => {
        setToast(prev => ({
            ...prev,
            isVisible: false
        }));
    };

    return (
        <ToastContext.Provider value={{ showToast, hideToast }}>
            {children}
            <Toast
                isVisible={toast.isVisible}
                onClose={hideToast}
                title={toast.title}
                message={toast.message}
                type={toast.type}
                duration={4000}
            />
        </ToastContext.Provider>
    );
}

export function useToast(): ToastContextType {
    const context = useContext(ToastContext);
    if (context === undefined) {
        throw new Error("useToast must be used within a ToastProvider");
    }
    return context;
}
