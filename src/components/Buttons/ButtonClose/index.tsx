import { X } from "lucide-react";

interface ButtonCloseProps {
    onClose: () => void;
}

export default function ButtonClose({ onClose }: ButtonCloseProps) {
    return (
        <button
            onClick={onClose}
            className="text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors"
        >
            <X className="w-5 h-5" />
        </button>
    );
}