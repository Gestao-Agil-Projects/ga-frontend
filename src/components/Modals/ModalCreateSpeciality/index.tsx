import { useState, useEffect, useRef } from "react";
import Modal from "react-modal";
import { Plus } from "lucide-react";
import ButtonClose from "../../Buttons/ButtonClose";
import ButtonPrimary from "../../Buttons/ButtonPrimary";
import Input from "../../Inputs/Input";
import { SpecialityDropdown } from "../../Dropdown/SpecialityDropdown";
import { createSpecialityStore } from "../../../store/createSpecialityStore";
import { specialityStore } from "../../../store/specialityStore";
import { specialityService } from "../../../services/Speciality/speciality.service";
import { userStore } from "../../../store/userStore";
import { useToast } from "../../../contexts/ToastContext";
import type { TSpecialityData } from "../../../store/types/TSpecialityData";

Modal.setAppElement("#root");

interface ModalCreateSpecialityProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function ModalCreateSpeciality({ isOpen, onClose }: ModalCreateSpecialityProps) {
    const { title, setTitle, clearForm } = createSpecialityStore();
    const { specialities, setSpecialities, addSpeciality, updateSpeciality } = specialityStore();
    const { userAccountData } = userStore();
    const { showToast } = useToast();
    
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingSpecialities, setIsLoadingSpecialities] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editingTitle, setEditingTitle] = useState("");
    const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, width: 0 });
    const inputRef = useRef<HTMLInputElement>(null);

    const updateDropdownPosition = () => {
        if (inputRef.current) {
            const rect = inputRef.current.getBoundingClientRect();
            setDropdownPosition({
                top: rect.bottom + window.scrollY,
                left: rect.left + window.scrollX,
                width: rect.width
            });
        }
    };

    useEffect(() => {
        if (isOpen && userAccountData?.access_token) {
            fetchSpecialities();
        }
    }, [isOpen, userAccountData?.access_token]);

    useEffect(() => {
        if (searchTerm.trim()) {
            updateDropdownPosition();
            const handleResize = () => updateDropdownPosition();
            window.addEventListener('resize', handleResize);
            return () => window.removeEventListener('resize', handleResize);
        }
    }, [searchTerm]);

    const fetchSpecialities = async () => {
        if (!userAccountData?.access_token) return;
        
        setIsLoadingSpecialities(true);
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
        } finally {
            setIsLoadingSpecialities(false);
        }
    };

    const handleCreateSpeciality = async () => {
        if (!title.trim()) {
            showToast(
                "Erro!",
                "Por favor, digite o nome da especialidade.",
                "error"
            );
            return;
        }

        setIsLoading(true);
        try {
            const specialityData = {
                title: capitalizeFirstLetter(title.trim())
            };

            const response = await specialityService.postCreateSpeciality(
                specialityData, 
                userAccountData?.access_token || ""
            );

            if (response.status === 201 || response.status === 200) {
                addSpeciality(response.data);

                showToast(
                    "Sucesso!",
                    "Especialidade criada com sucesso!",
                    "success"
                );

                clearForm();
                fetchSpecialities();
            }

        } catch (error: any) {
            showToast(
                "Erro!",
                error.response?.data?.detail || "Erro ao criar especialidade. Tente novamente.",
                "error"
            );
        } finally {
            setIsLoading(false);
        }
    };

    const handleEditSpeciality = (speciality: TSpecialityData) => {
        setEditingId(speciality.id);
        setEditingTitle(speciality.title);
    };

    const handleSaveEdit = async (id: string) => {
        if (!editingTitle.trim()) {
            showToast(
                "Erro!",
                "Por favor, digite o nome da especialidade.",
                "error"
            );
            return;
        }

        try {
            const response = await specialityService.putUpdateSpeciality(
                id,
                { title: capitalizeFirstLetter(editingTitle.trim()) },
                userAccountData?.access_token || ""
            );

            if (response.status === 200) {
                updateSpeciality(id, response.data);
                setEditingId(null);
                setEditingTitle("");
                
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

    const handleCancelEdit = () => {
        setEditingId(null);
        setEditingTitle("");
    };

    const capitalizeFirstLetter = (str: string) => {
        return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
    };

    const filteredSpecialities = searchTerm.trim() 
        ? specialities.filter(speciality =>
            speciality.title.toLowerCase().includes(searchTerm.toLowerCase()))
        : [];

    const handleClose = () => {
        clearForm();
        setSearchTerm("");
        setEditingId(null);
        setEditingTitle("");
        onClose();
    };

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={handleClose}
            className="modal-content"
            overlayClassName="modal-overlay"
            contentLabel="Modal de Gerenciar Especialidades"
        >
            <div className="bg-neutral-09 rounded-lg shadow-xl w-[380px] lg:w-[600px] mx-4 max-h-[90vh] flex flex-col">
                <div className="flex justify-between items-center px-6 py-4">
                    <div className="flex flex-row items-center gap-2">
                        <Plus className="w-5 h-5 text-primary" />
                        <h2 className="text-lg font-semibold text-neutral-18">
                            Gerenciar Especialidades
                        </h2>
                    </div>
                    
                    <ButtonClose onClose={handleClose} />
                </div>

                <div className="px-6 pb-6 flex-1 overflow-y-auto">
                    <div>
                        <div className="relative" ref={inputRef}>
                            <Input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Buscar especialidades..."
                                label=""
                            />
                        </div>
                    </div>

                    <div className="pt-6">
                        <h3 className="text-md font-medium text-neutral-18 mb-3">
                            Nova Especialidade
                        </h3>
                        <p className="text-neutral-19 mb-4 text-sm">
                            Crie uma nova especialidade para os psicólogos
                        </p>

                        <div className="space-y-4">
                            <Input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="Ex: Psicologia Clínica"
                                label="Nome da Especialidade"
                                required
                            />
                        </div>

                        <div className="mt-4">
                            <ButtonPrimary 
                                onClick={handleCreateSpeciality}
                                disabled={!title.trim() || isLoading || !userAccountData?.access_token}
                            >
                                {isLoading ? "Criando..." : "Criar Especialidade"}
                            </ButtonPrimary>
                        </div>
                    </div>
                </div>
            </div>

            <SpecialityDropdown
                isVisible={searchTerm.trim().length > 0}
                position={dropdownPosition}
                isLoadingSpecialities={isLoadingSpecialities}
                filteredSpecialities={filteredSpecialities}
                editingId={editingId}
                editingTitle={editingTitle}
                setEditingTitle={setEditingTitle}
                handleSaveEdit={handleSaveEdit}
                handleCancelEdit={handleCancelEdit}
                handleEditSpeciality={handleEditSpeciality}
                capitalizeFirstLetter={capitalizeFirstLetter}
                showEditButtons={true}
            />
        </Modal>
    );
}