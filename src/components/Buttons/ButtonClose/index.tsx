import { X } from "lucide-react";

interface ButtonCloseProps {
    onClose: () => void;
}

export default function ButtonClose({ onClose }: ButtonCloseProps) {
    return (
        <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
        >
            <X className="w-5 h-5" />
        </button>
    );
}