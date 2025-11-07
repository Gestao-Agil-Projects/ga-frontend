import { useState, useEffect } from "react";
import { Plus, Tag } from "lucide-react";
import { CardPsychologist } from "../Cards/CardPsychologist";
import ModalCreateSpeciality from "../Modals/ModalCreateSpeciality";
import ModalCreateProfessional from "../Modals/ModalCreateProfessional";
import ModalEditProfessional from "../Modals/ModalEditProfessional";
import { professionalStore } from "../../store/professionalStore";
import { professionalService } from "../../services/Professional/professional.service";
import { specialityStore } from "../../store/specialityStore";
import { specialityService } from "../../services/Speciality/speciality.service";
import { userStore } from "../../store/userStore";
import { useToast } from "../../contexts/ToastContext";
import { formatSpecialities } from "../../utils/specialityFormatter";
import type { TProfessionalData } from "../../store/types/TProfessionalData";
import type { TSpecialityData } from "../../store/types/TSpecialityData";

export function ManagePsychologists() {
    const { professionals, setProfessionals } = professionalStore();
    const { specialities, setSpecialities, addSpeciality, updateSpeciality } = specialityStore();
    const { userAccountData } = userStore();
    const { showToast } = useToast();
    
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isProfessionalModalOpen, setIsProfessionalModalOpen] = useState(false);
    const [isEditProfessionalModalOpen, setIsEditProfessionalModalOpen] = useState(false);
    const [editingProfessional, setEditingProfessional] = useState<TProfessionalData | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    
    // Estados para especialidades
    const [newSpecialityTitle, setNewSpecialityTitle] = useState("");
    const [editingSpecialityId, setEditingSpecialityId] = useState<string | null>(null);
    const [editingSpecialityTitle, setEditingSpecialityTitle] = useState("");

    useEffect(() => {
        if (userAccountData?.access_token) {
            fetchProfessionals();
            fetchSpecialities();
        }
    }, [userAccountData?.access_token]);

    const fetchProfessionals = async () => {
        if (!userAccountData?.access_token) return;
        
        setIsLoading(true);
        try {
            const response = await professionalService.getProfessionals(userAccountData.access_token);
            if (response.status === 200) {
                // A API retorna um array de objetos com estrutura { professional: {...}, is_blocked: ... }
                // Precisamos extrair apenas os dados do professional e manter a estrutura
                const professionalsData = response.data.map((item: any) => {
                    // Se a estrutura já é direta, retorna como está
                    if (item.full_name || item.id) {
                        return item;
                    }
                    // Se tem a propriedade professional, extrai os dados
                    if (item.professional) {
                        return {
                            ...item.professional,
                            is_enabled: item.professional.is_enabled !== false,
                            is_blocked: item.is_blocked || false
                        };
                    }
                    return item;
                });
                setProfessionals(professionalsData);
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
            setIsEditProfessionalModalOpen(true);
        }
    };

    const handleNewPsychologist = () => {
        setEditingProfessional(null);
        setIsProfessionalModalOpen(true);
    };

    const fetchSpecialities = async () => {
        if (!userAccountData?.access_token) return;
        
        try {
            const response = await specialityService.getSpecialities(userAccountData.access_token);
            if (response.status === 200) {
                setSpecialities(response.data);
            }
        } catch (error: any) {
            showToast(
                "Erro!",
                "Erro ao carregar especialidades.",
                "error"
            );
        }
    };


    const handleAddSpeciality = async () => {
        if (!newSpecialityTitle.trim() || !userAccountData?.access_token) return;

        try {
            const specialityData = {
                title: newSpecialityTitle.trim()
            };

            const response = await specialityService.postCreateSpeciality(
                specialityData, 
                userAccountData.access_token
            );

            if (response.status === 201 || response.status === 200) {
                addSpeciality(response.data);
                setNewSpecialityTitle("");
                // Recarregar dados após criar especialidade
                fetchProfessionals();
                fetchSpecialities();
                showToast(
                    "Sucesso!",
                    "Especialidade criada com sucesso!",
                    "success"
                );
            }
        } catch (error: any) {
            showToast(
                "Erro!",
                error.response?.data?.detail || "Erro ao criar especialidade.",
                "error"
            );
        }
    };

    const handleEditSpeciality = (speciality: TSpecialityData) => {
        setEditingSpecialityId(speciality.id);
        setEditingSpecialityTitle(speciality.title);
    };

    const handleSaveEditSpeciality = async () => {
        if (!editingSpecialityTitle.trim() || !editingSpecialityId || !userAccountData?.access_token) return;

        try {
            const response = await specialityService.putUpdateSpeciality(
                editingSpecialityId,
                { title: editingSpecialityTitle.trim() },
                userAccountData.access_token
            );

            if (response.status === 200) {
                updateSpeciality(editingSpecialityId, response.data);
                setEditingSpecialityId(null);
                setEditingSpecialityTitle("");
                // Recarregar dados após editar especialidade
                fetchProfessionals();
                fetchSpecialities();
                showToast(
                    "Sucesso!",
                    "Especialidade atualizada com sucesso!",
                    "success"
                );
            }
        } catch (error: any) {
            showToast(
                "Erro!",
                error.response?.data?.detail || "Erro ao atualizar especialidade.",
                "error"
            );
        }
    };

    const handleCancelEditSpeciality = () => {
        setEditingSpecialityId(null);
        setEditingSpecialityTitle("");
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
        <div className="space-y-6 text-[var(--color-text-primary)]">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-semibold text-[var(--color-primary)]">Gerenciar Psicólogos</h1>
                    <p className="text-sm text-[var(--color-text-secondary)] mt-1">
                        Crie, edite ou bloqueie profissionais
                    </p>
                </div>
                
                <div className="flex gap-3">
                    <button
                        onClick={handleNewPsychologist}
                        className="px-4 py-2 rounded-lg bg-[var(--color-primary)] text-white text-sm font-medium transition-colors hover:bg-[var(--color-primary-light)] flex items-center gap-2"
                    >
                        <Plus className="w-4 h-4" />
                        Novo Psicólogo
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {isLoading ? (
                    <div className="col-span-2 text-center py-8">
                        <div className="text-[var(--color-text-secondary)]">Carregando profissionais...</div>
                    </div>
                ) : professionals.length === 0 ? (
                    <div className="col-span-2 text-center py-8">
                        <div className="text-[var(--color-text-secondary)]">Nenhum profissional encontrado</div>
                    </div>
                ) : (
                    professionals
                        .filter(professional => professional && professional.id)
                        .map(professional => (
                            <CardPsychologist
                                key={professional.id}
                                professional={{
                                    id: professional.id,
                                    name: professional.full_name || "Nome não informado",
                                    bio: professional.bio || "",
                                    color: (professional.is_enabled !== false) ? "bg-blue-500" : "bg-red-500"
                                }}
                                appointmentsToday={0} // TODO: Implementar contagem de consultas
                                specialty={formatSpecialities(professional.specialities || [])}
                                bio={professional.bio || ""}
                                isBlocked={professional.is_enabled === false}
                                onEdit={handleEdit}
                                onToggleBlock={handleToggleBlock}
                                onDelete={handleDelete}
                            />
                        ))
                )}
            </div>

            {/* Seção de Especialidades */}
            <div className="mt-12">
                <div className="bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)] p-6">
                    {/* Header */}
                    <div className="flex items-center gap-3 mb-4">
                        <div className="h-8 w-8 bg-[rgba(125,212,220,0.3)] rounded-lg flex items-center justify-center">
                            <Tag className="w-4 h-4 text-[var(--color-primary)]" />
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold text-[var(--color-primary)]">Gerenciar Tags de Especialização</h2>
                            <p className="text-sm text-[var(--color-text-secondary)]">
                                Adicione, edite ou remova as tags de especialização que aparecerão nos filtros e cadastros
                            </p>
                        </div>
                    </div>

                    {/* Input para nova especialidade */}
                    <div className="flex gap-2 mb-6">
                        <input
                            type="text"
                            value={newSpecialityTitle}
                            onChange={(e) => setNewSpecialityTitle(e.target.value)}
                            placeholder="Digite uma nova especialização..."
                            className="flex-1 px-3 py-2 bg-[var(--color-background)] border border-transparent rounded-lg text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-lighter)]"
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    handleAddSpeciality();
                                }
                            }}
                        />
                        <button
                            onClick={handleAddSpeciality}
                            disabled={!newSpecialityTitle.trim()}
                            className="px-3 py-2 bg-[var(--color-primary)] text-white rounded-lg text-sm font-medium flex items-center gap-1 transition-colors hover:bg-[var(--color-primary-light)] disabled:bg-[rgba(125,212,220,0.6)] disabled:cursor-not-allowed"
                        >
                            <Plus className="w-3 h-3" />
                            Adicionar
                        </button>
                    </div>

                    {/* Tags cadastradas */}
                    <div>
                        <h3 className="text-base font-semibold text-[var(--color-primary)] mb-3">
                            Tags Cadastradas ({specialities.length})
                        </h3>
                        
                        <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg p-3">
                            <div className="flex flex-wrap gap-2">
                                {specialities.map((speciality) => (
                                    <div key={speciality.id}>
                                        {editingSpecialityId === speciality.id ? (
                                            <div className="flex items-center gap-2 bg-[rgba(125,212,220,0.25)] border border-[rgba(125,212,220,0.6)] rounded-full px-3 py-1">
                                                <input
                                                    type="text"
                                                    value={editingSpecialityTitle}
                                                    onChange={(e) => setEditingSpecialityTitle(e.target.value)}
                                                    className="flex-1 px-1 py-0.5 rounded text-sm focus:outline-none bg-transparent text-[var(--color-primary)]"
                                                    autoFocus
                                                    onKeyDown={(e) => {
                                                        if (e.key === 'Enter') handleSaveEditSpeciality();
                                                        if (e.key === 'Escape') handleCancelEditSpeciality();
                                                    }}
                                                />
                                                <button
                                                    onClick={handleSaveEditSpeciality}
                                                    className="px-2 py-0.5 bg-[var(--color-surface)] text-[var(--color-primary)] border border-[var(--color-primary)] rounded text-xs hover:bg-[var(--color-primary)] hover:text-white transition-colors"
                                                    title="Salvar"
                                                >
                                                    Salvar
                                                </button>
                                                <button
                                                    onClick={handleCancelEditSpeciality}
                                                    className="px-2 py-0.5 bg-[var(--color-surface)] text-[var(--color-text-secondary)] border border-[rgba(125,212,220,0.6)] rounded text-xs hover:bg-[rgba(125,212,220,0.4)] transition-colors"
                                                    title="Cancelar"
                                                >
                                                    Cancelar
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-2 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-full px-3 py-1">
                                                <span className="text-[var(--color-primary)] text-sm">
                                                    {speciality.title}
                                                </span>
                                                <button
                                                    onClick={() => handleEditSpeciality(speciality)}
                                                    className="p-0.5 text-[var(--color-primary)] hover:text-[var(--color-primary-light)]"
                                                    title="Editar"
                                                >
                                                    <Tag className="w-3 h-3" />
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
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
                    // Recarregar dados após fechar o modal
                    fetchProfessionals();
                    fetchSpecialities();
                }}
                editingProfessional={editingProfessional}
            />

            <ModalEditProfessional
                isOpen={isEditProfessionalModalOpen}
                onClose={() => {
                    setIsEditProfessionalModalOpen(false);
                    setEditingProfessional(null);
                    // Recarregar dados após fechar o modal
                    fetchProfessionals();
                    fetchSpecialities();
                }}
                professional={editingProfessional}
            />
        </div>
    );
}
