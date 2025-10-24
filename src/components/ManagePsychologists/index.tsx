import { useState, useEffect } from "react";
import { Plus, Tag } from "lucide-react";
import { CardPsychologist } from "../Cards/CardPsychologist";
import ModalCreateSpeciality from "../Modals/ModalCreateSpeciality";
import ModalCreateProfessional from "../Modals/ModalCreateProfessional";
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

            {/* Seção de Especialidades */}
            <div className="mt-12">
                <div className="bg-white rounded-lg border border-[#D0E0F0] p-6">
                    {/* Header */}
                    <div className="flex items-center gap-3 mb-4">
                        <div className="h-6 w-6 bg-[#E0F2F7] rounded flex items-center justify-center">
                            <Tag className="w-3 h-3 text-[#4285F4]" />
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold text-[#343A40]">Gerenciar Tags de Especialização</h2>
                            <p className="text-sm text-[#343A40]">
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
                            className="flex-1 px-3 py-2 bg-[#F8F9FA] border-0 rounded text-sm focus:outline-none focus:ring-2 focus:ring-[#4285F4]"
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    handleAddSpeciality();
                                }
                            }}
                        />
                        <button
                            onClick={handleAddSpeciality}
                            disabled={!newSpecialityTitle.trim()}
                            className="px-3 py-2 bg-[#4285F4] text-white rounded text-sm font-medium flex items-center gap-1 hover:bg-[#3367D6] transition-colors disabled:bg-[#ADB5BD] disabled:cursor-not-allowed"
                        >
                            <Plus className="w-3 h-3" />
                            Adicionar
                        </button>
                    </div>

                    {/* Tags cadastradas */}
                    <div>
                        <h3 className="text-base font-semibold text-[#343A40] mb-3">
                            Tags Cadastradas ({specialities.length})
                        </h3>
                        
                        <div className="bg-white border border-[#D0E0F0] rounded-lg p-3">
                            <div className="flex flex-wrap gap-2">
                                {specialities.map((speciality) => (
                                    <div key={speciality.id}>
                                        {editingSpecialityId === speciality.id ? (
                                            <div className="flex items-center gap-1 bg-[#E0F2F7] border-0 rounded-full px-3 py-1">
                                                <input
                                                    type="text"
                                                    value={editingSpecialityTitle}
                                                    onChange={(e) => setEditingSpecialityTitle(e.target.value)}
                                                    className="flex-1 px-1 py-0.5 rounded text-sm focus:outline-none bg-transparent text-[#343A40]"
                                                    autoFocus
                                                    onKeyDown={(e) => {
                                                        if (e.key === 'Enter') handleSaveEditSpeciality();
                                                        if (e.key === 'Escape') handleCancelEditSpeciality();
                                                    }}
                                                />
                                                <button
                                                    onClick={handleSaveEditSpeciality}
                                                    className="px-2 py-0.5 bg-[#E9ECEF] text-[#343A40] rounded text-xs hover:bg-[#D1D5DB]"
                                                    title="Salvar"
                                                >
                                                    Salvar
                                                </button>
                                                <button
                                                    onClick={handleCancelEditSpeciality}
                                                    className="px-2 py-0.5 bg-[#E9ECEF] text-[#343A40] rounded text-xs hover:bg-[#D1D5DB]"
                                                    title="Cancelar"
                                                >
                                                    Cancelar
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-1 bg-white border border-[#D0E0F0] rounded-full px-3 py-1">
                                                <span className="text-[#4285F4] text-sm">
                                                    {speciality.title}
                                                </span>
                                                <button
                                                    onClick={() => handleEditSpeciality(speciality)}
                                                    className="p-0.5 text-[#4285F4] hover:text-[#3367D6]"
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
                }}
                editingProfessional={editingProfessional}
            />
        </div>
    );
}
