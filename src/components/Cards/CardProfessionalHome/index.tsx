import { Calendar } from "lucide-react";

interface CardProfessionalHomeProps {
    name: string;
    specialty: string;
    bio: string;
    availableSlots: string[];
    imageUrl?: string;
    onSchedule: () => void;
}

export function CardProfessionalHome({ 
    name, 
    specialty, 
    bio,
    availableSlots,
    imageUrl,
    onSchedule
}: CardProfessionalHomeProps) {
    return (
        <div className="bg-white rounded-lg shadow-md p-6 flex flex-col h-full">
            {/* Header com foto e info */}
            <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-[#79D4DD] flex items-center justify-center flex-shrink-0 overflow-hidden">
                    {imageUrl ? (
                        <img src={imageUrl} alt={name} className="w-full h-full object-cover" />
                    ) : (
                        <span className="text-white font-semibold text-lg">
                            {name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                        </span>
                    )}
                </div>
                <div className="flex-1">
                    <h3 className="font-semibold text-[#000] text-base mb-1">
                        {name}
                    </h3>
                    <p className="text-sm text-[#545454] mb-2">
                        {specialty}
                    </p>
                </div>
            </div>

            {/* Bio */}
            <p className="text-sm text-[#000] leading-relaxed mb-4 flex-1">
                {bio}
            </p>

            {/* Horários disponíveis */}
            <div className="mb-4">
                <p className="text-xs font-semibold text-[#000] mb-2">
                    Horários disponíveis:
                </p>
                <div className="flex flex-wrap gap-2">
                    {availableSlots.map((slot, index) => (
                        <span 
                            key={index}
                            className="px-3 py-1 bg-[#79D4DD] text-white text-xs font-medium rounded-full"
                        >
                            {slot}
                        </span>
                    ))}
                </div>
            </div>

            {/* Botão agendar */}
            <button
                onClick={onSchedule}
                className="w-full bg-[#018DAE] hover:bg-[#01BDA3] text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
                <Calendar className="w-4 h-4" />
                Agendar Consulta
            </button>
        </div>
    );
}
