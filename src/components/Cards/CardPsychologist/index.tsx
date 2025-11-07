import { Clock, Lock, Unlock, Trash2 } from "lucide-react";

interface Professional {
    id: string;
    name: string;
    color: string;
    bio: string;
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
        <div className={`bg-[var(--color-surface)] rounded-xl shadow-sm border border-[var(--color-border)] p-6 flex flex-col justify-between h-full transition-opacity ${isBlocked ? 'opacity-70' : ''}`}>
            <div className="flex items-start gap-4">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-[var(--color-text-primary)]">{professional.name}</h3>
                        {isBlocked && (
                        <span className="px-2 py-1 text-xs font-medium bg-[var(--color-danger)] text-white rounded-md">
                            Bloqueado
                        </span>
                        )}
                    </div>
                    <p className="text-sm text-[var(--color-text-secondary)] mb-1">{specialty}</p>
                    {bio && (
                        <p className="text-xs text-[var(--color-text-secondary)] mb-1 line-clamp-2">{bio}</p>
                    )}
                    <p className="text-xs text-[var(--color-text-secondary)]">{appointmentsToday} consultas hoje</p>
                </div>
            </div>

            <div className="flex justify-end items-center gap-2 mt-4">
                <button
                    onClick={() => onEdit(professional.id)}
                    className="px-3 py-1.5 text-xs font-medium text-[var(--color-primary)] bg-[rgba(125,212,220,0.25)] border border-[rgba(125,212,220,0.6)] hover:bg-[rgba(61,176,197,0.3)] rounded-md transition-colors flex items-center gap-1"
                >
                    <Clock className="w-3 h-3" />
                    Agenda
                </button>
                
                <button
                    onClick={() => onToggleBlock(professional.id)}
                    className={`px-3 py-1.5 text-xs font-medium text-white rounded-md transition-colors flex items-center gap-1 ${
                        isBlocked 
                        ? 'bg-[var(--color-text-secondary)] hover:bg-[var(--color-text-primary)]' 
                        : 'bg-[var(--color-primary)] hover:bg-[var(--color-primary-light)]'
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
                    className="p-1.5 text-white bg-[var(--color-danger)] hover:bg-red-600 rounded-md transition-colors"
                >
                    <Trash2 className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
}
