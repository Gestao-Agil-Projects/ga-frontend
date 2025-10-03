import { useState } from "react";
import { Plus } from "lucide-react";
import { CardPsychologists } from "../CardPsychologists";
import { professionals } from "../../data/professionals";

export function ManagePsychologists() {
    const [blockedProfessionals, setBlockedProfessionals] = useState<Set<string>>(new Set(["3"]));

    const professionalData = {
        "1": { specialty: "Psicologia Clínica", appointmentsToday: 4 },
        "2": { specialty: "Psicologia Organizacional", appointmentsToday: 3 },
        "3": { specialty: "Psicologia Infantil", appointmentsToday: 0 }
    };

    const handleEdit = (id: string) => {
        console.log("Editar profissional:", id);
    };

    const handleToggleBlock = (id: string) => {
        setBlockedProfessionals(prev => {
            const newSet = new Set(prev);
            if (newSet.has(id)) {
                newSet.delete(id);
            } else {
                newSet.add(id);
            }
            return newSet;
        });
    };

    const handleDelete = (id: string) => {
        console.log("Deletar profissional:", id);
    };

    const handleNewPsychologist = () => {
        console.log("Novo psicólogo");
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Gerenciar Psicólogos</h1>
                    <p className="text-sm text-gray-600 mt-1">
                        Crie, edite ou bloqueie profissionais
                    </p>
                </div>
                
                <button
                    onClick={handleNewPsychologist}
                    className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                >
                    <Plus className="w-4 h-4" />
                    Novo Psicólogo
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {professionals.map(professional => (
                    <CardPsychologists
                        key={professional.id}
                        professional={professional}
                        appointmentsToday={professionalData[professional.id as keyof typeof professionalData]?.appointmentsToday || 0}
                        specialty={professionalData[professional.id as keyof typeof professionalData]?.specialty || "Especialidade não definida"}
                        isBlocked={blockedProfessionals.has(professional.id)}
                        onEdit={handleEdit}
                        onToggleBlock={handleToggleBlock}
                        onDelete={handleDelete}
                    />
                ))}
            </div>
        </div>
    );
}
