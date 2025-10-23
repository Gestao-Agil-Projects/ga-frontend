import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import { CardPsychologist } from "../Cards/CardPsychologist";
import ModalCreateSpeciality from "../Modals/ModalCreateSpeciality";
import ModalCreateProfessional from "../Modals/ModalCreateProfessional";
import { professionalStore } from "../../store/professionalStore";
import { professionalService } from "../../services/Professional/professional.service";
import { userStore } from "../../store/userStore";
import { useToast } from "../../contexts/ToastContext";
import { formatSpecialities } from "../../utils/specialityFormatter";
import type { TProfessionalData } from "../../store/types/TProfessionalData";

export function ManagePsychologists() {
    const { professionals, setProfessionals } = professionalStore();
    const { userAccountData } = userStore();
    const { showToast } = useToast();
    
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isProfessionalModalOpen, setIsProfessionalModalOpen] = useState(false);
    const [editingProfessional, setEditingProfessional] = useState<TProfessionalData | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (userAccountData?.access_token) {
            fetchProfessionals();
        }
    }, [userAccountData?.access_token]);

    const fetchProfessionals = async () => {
        if (!userAccountData?.access_token) return;
        
        setIsLoading(true);
        try {
            const response = await professionalService.getProfessionals(userAccountData.access_token);
            if (response.status === 200) {
                setProfessionals(response.data);
            }
        } catch (error: any) {
            showToast(
                "Erro!",
                "Erro ao carregar profissionais.",
                "error"
            );
        } finally {
            setIsLoading(false);
        }
    };

    const handleEdit = (id: string) => {
        const professional = professionals.find(p => p.id === id);
        if (professional) {
            setEditingProfessional(professional);
            setIsProfessionalModalOpen(true);
        }
    };

    const handleNewPsychologist = () => {
        setEditingProfessional(null);
        setIsProfessionalModalOpen(true);
    };

    const handleCreateSpeciality = () => {
        setIsModalOpen(true);
    };

    const handleToggleBlock = async (id: string) => {
        const professional = professionals.find(p => p.id === id);
        if (!professional || !userAccountData?.access_token) return;

        setIsLoading(true);
        try {
            const response = await professionalService.toggleProfessionalStatus(
                id,
                !professional.is_enabled,
                userAccountData.access_token
            );

            if (response.status === 200) {
                // Atualizar a lista de profissionais
                const updatedProfessionals = professionals.map(p => 
                    p.id === id ? { ...p, is_enabled: !professional.is_enabled } : p
                );
                setProfessionals(updatedProfessionals);

                showToast(
                    "Sucesso!",
                    `Profissional ${!professional.is_enabled ? 'desbloqueado' : 'bloqueado'} com sucesso!`,
                    "success"
                );
            }
        } catch (error: any) {
            showToast(
                "Erro!",
                error.response?.data?.detail || "Erro ao alterar status do profissional.",
                "error"
            );
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!userAccountData?.access_token) return;

        if (!confirm("Tem certeza que deseja excluir este profissional?")) {
            return;
        }

        setIsLoading(true);
        try {
            const response = await professionalService.deleteProfessional(id, userAccountData.access_token);

            if (response.status === 200 || response.status === 204) {
                const updatedProfessionals = professionals.filter(p => p.id !== id);
                setProfessionals(updatedProfessionals);

                showToast(
                    "Sucesso!",
                    "Profissional excluído com sucesso!",
                    "success"
                );
            }
        } catch (error: any) {
            showToast(
                "Erro!",
                error.response?.data?.detail || "Erro ao excluir profissional.",
                "error"
            );
        } finally {
            setIsLoading(false);
        }
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
                
                <div className="flex gap-3">
                    <button
                        onClick={handleCreateSpeciality}
                        className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                    >
                        Especialidades
                    </button>
                    
                    <button
                        onClick={handleNewPsychologist}
                        className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                    >
                        <Plus className="w-4 h-4" />
                        Novo Psicólogo
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {isLoading ? (
                    <div className="col-span-2 text-center py-8">
                        <div className="text-gray-600">Carregando profissionais...</div>
                    </div>
                ) : professionals.length === 0 ? (
                    <div className="col-span-2 text-center py-8">
                        <div className="text-gray-600">Nenhum profissional encontrado</div>
                    </div>
                ) : (
                    professionals.map(professional => (
                        <CardPsychologist
                            key={professional.id}
                            professional={{
                                id: professional.id,
                                name: professional.full_name,
                                color: (professional.is_enabled !== false) ? "bg-blue-500" : "bg-red-500"
                            }}
                            appointmentsToday={0} // TODO: Implementar contagem de consultas
                            specialty={formatSpecialities(professional.specialities)}
                            bio={professional.bio}
                            isBlocked={professional.is_enabled === false}
                            onEdit={handleEdit}
                            onToggleBlock={handleToggleBlock}
                            onDelete={handleDelete}
                        />
                    ))
                )}
            </div>

            <ModalCreateSpeciality 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />

            <ModalCreateProfessional 
                isOpen={isProfessionalModalOpen}
                onClose={() => {
                    setIsProfessionalModalOpen(false);
                    setEditingProfessional(null);
                }}
                editingProfessional={editingProfessional}
            />
        </div>
    );
}
