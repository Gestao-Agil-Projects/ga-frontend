import { X, CheckCircle } from "lucide-react";
import { useEffect } from "react";

interface ToastProps {
    isVisible: boolean;
    onClose: () => void;
    title: string;
    message: string;
    type?: "success" | "error" | "warning" | "info";
    duration?: number;
}

export default function Toast({ 
    isVisible, 
    onClose, 
    title, 
    message, 
    type = "success",
    duration = 2000 
}: ToastProps) {
    useEffect(() => {
        if (isVisible) {
            const timer = setTimeout(() => {
                onClose();
            }, duration);

            return () => clearTimeout(timer);
        }
    }, [isVisible, duration, onClose]);

    if (!isVisible) return null;

    const getTypeStyles = () => {
        switch (type) {
            case "success":
                return {
                    borderColor: "border-success",
                    iconColor: "text-success",
                    iconBg: "bg-success-11",
                    accentColor: "bg-success"
                };
            case "error":
                return {
                    borderColor: "border-error",
                    iconColor: "text-error",
                    iconBg: "bg-neutral-24",
                    accentColor: "bg-error"
                };
            case "warning":
                return {
                    borderColor: "border-warning-70",
                    iconColor: "text-warning-70",
                    iconBg: "bg-warning-11",
                    accentColor: "bg-warning-70"
                };
            case "info":
                return {
                    borderColor: "border-neutral-26",
                    iconColor: "text-neutral-26",
                    iconBg: "bg-neutral-27",
                    accentColor: "bg-neutral-26"
                };
            default:
                return {
                    borderColor: "border-success",
                    iconColor: "text-success",
                    iconBg: "bg-success-11",
                    accentColor: "bg-success"
                };
        }
    };

    const getIcon = () => {
        switch (type) {
            case "success":
                return <CheckCircle className="w-5 h-5" />;
            case "error":
                return <X className="w-5 h-5" />;
            case "warning":
                return <X className="w-5 h-5" />;
            case "info":
                return <X className="w-5 h-5" />;
            default:
                return <CheckCircle className="w-5 h-5" />;
        }
    };

    const styles = getTypeStyles();

    return (
        <div className="fixed top-4 right-4 z-[9999] animate-in slide-in-from-right duration-300">
            <div className={`bg-white rounded-lg shadow-lg border-l-4 ${styles.borderColor} p-4 min-w-80 max-w-96`}>
                <div className="flex items-start">
                    <div className={`flex-shrink-0 w-8 h-8 rounded-full ${styles.iconBg} flex items-center justify-center mr-3`}>
                        <div className={styles.iconColor}>
                            {getIcon()}
                        </div>
                    </div>
                    
                    <div className="flex-1">
                        <h4 className="text-sm font-semibold text-neutral-28 mb-1">
                            {title}
                        </h4>
                        <p className="text-sm text-neutral-12">
                            {message}
                        </p>
                    </div>
                    
                    <button
                        onClick={onClose}
                        className="flex-shrink-0 ml-3 text-neutral-13 hover:text-neutral-12 transition-colors"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    );
}
