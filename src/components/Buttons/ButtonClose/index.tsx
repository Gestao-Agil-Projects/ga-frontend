import { X } from "lucide-react";

interface ButtonCloseProps {
    onClose: () => void;
}

export default function ButtonClose({ onClose }: ButtonCloseProps) {
    return (
        <button
            onClick={onClose}
            className="text-neutral-13 hover:text-neutral-12 transition-colors"
        >
            <X className="w-5 h-5" />
        </button>
    );
}