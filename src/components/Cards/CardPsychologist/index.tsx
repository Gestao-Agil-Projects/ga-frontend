import { Edit, Lock, Unlock, Trash2 } from "lucide-react";

interface Professional {
    id: string;
    name: string;
    color: string;
}

interface CardPsychologistsProps {
    professional: Professional;
    appointmentsToday: number;
    specialty: string;
    bio?: string;
    isBlocked: boolean;
    onEdit: (id: string) => void;
    onToggleBlock: (id: string) => void;
    onDelete: (id: string) => void;
}

export function CardPsychologist({ 
    professional, 
    appointmentsToday, 
    specialty, 
    bio,
    isBlocked,
    onEdit,
    onToggleBlock,
    onDelete
}: CardPsychologistsProps) {
    return (
        <div className={`bg-white rounded-lg shadow-sm border p-6 flex flex-col justify-between h-full ${isBlocked ? 'opacity-60' : ''}`}>
            <div className="flex items-start gap-4">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-gray-900">{professional.name}</h3>
                        {isBlocked && (
                        <span className="px-2 py-1 text-xs font-medium bg-red-400 text-white rounded-md">
                            Bloqueado
                        </span>
                        )}
                    </div>
                    <p className="text-sm text-gray-600 mb-1">{specialty}</p>
                    {bio && (
                        <p className="text-xs text-gray-500 mb-1 line-clamp-2">{bio}</p>
                    )}
                    <p className="text-xs text-gray-500">{appointmentsToday} consultas hoje</p>
                </div>
            </div>

            <div className="flex justify-end items-center gap-2 mt-4">
                <button
                    onClick={() => onEdit(professional.id)}
                    className="px-3 py-1.5 text-xs font-medium text-gray-700 bg-gray-100 border border-gray-200 hover:bg-gray-200 rounded-md transition-colors flex items-center gap-1"
                >
                    <Edit className="w-3 h-3" />
                    Editar
                </button>
                
                <button
                    onClick={() => onToggleBlock(professional.id)}
                    className={`px-3 py-1.5 text-xs font-medium text-white rounded-md transition-colors flex items-center gap-1 ${
                        isBlocked 
                        ? 'bg-blue-500 hover:bg-blue-600' 
                        : 'bg-blue-600 hover:bg-blue-700'
                    }`}
                >
                    {isBlocked ? (
                        <>
                            <Unlock className="w-3 h-3" />
                            Desbloquear
                        </>
                    ) : (
                        <>
                            <Lock className="w-3 h-3" />
                            Bloquear
                        </>
                    )}
                </button>
                
                <button
                    onClick={() => onDelete(professional.id)}
                    className="p-1.5 text-white bg-red-500 hover:bg-red-600 rounded-md transition-colors"
                >
                    <Trash2 className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
}
