import { useState, useEffect, useRef } from "react";
import Modal from "react-modal";
import { UserPlus, X } from "lucide-react";
import ButtonClose from "../../Buttons/ButtonClose";
import ButtonPrimary from "../../Buttons/ButtonPrimary";
import Input from "../../Inputs/Input";
import { SpecialityDropdown } from "../../Dropdown/SpecialityDropdown";
import { createProfessionalStore } from "../../../store/createProfessionalStore";
import { professionalStore } from "../../../store/professionalStore";
import { specialityStore } from "../../../store/specialityStore";
import { professionalService } from "../../../services/Professional/professional.service";
import { specialityService } from "../../../services/Speciality/speciality.service";
import { userStore } from "../../../store/userStore";
import { useToast } from "../../../contexts/ToastContext";
import type { TProfessionalData } from "../../../store/types/TProfessionalData";
import type { TUpdateProfessionalData } from "../../../store/types/TUpdateProfessionalData";

Modal.setAppElement("#root");

interface ModalCreateProfessionalProps {
    isOpen: boolean;
    onClose: () => void;
    editingProfessional?: TProfessionalData | null;
}

export default function ModalCreateProfessional({ 
    isOpen, 
    onClose, 
    editingProfessional = null 
}: ModalCreateProfessionalProps) {
    const { 
        full_name, 
        email, 
        phone, 
        bio, 
        is_enabled, 
        specialities,
        setFullName,
        setEmail,
        setPhone,
        setBio,
        setIsEnabled,
        setSpecialities,
        clearForm 
    } = createProfessionalStore();
    
    const { addProfessional, updateProfessional } = professionalStore();
    const { specialities: availableSpecialities, setSpecialities: setAvailableSpecialities } = specialityStore();
    const { userAccountData } = userStore();
    const { showToast } = useToast();
    
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingSpecialities, setIsLoadingSpecialities] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
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

    useEffect(() => {
        if (editingProfessional) {
            setFullName(editingProfessional.full_name);
            setEmail(editingProfessional.email);
            setPhone(editingProfessional.phone);
            setBio(editingProfessional.bio);
            setIsEnabled(editingProfessional.is_enabled);
            setSpecialities(editingProfessional.specialities.map(s => s.id));
        } else {
            clearForm();
        }
    }, [editingProfessional, setFullName, setEmail, setPhone, setBio, setIsEnabled, setSpecialities, clearForm]);

    const fetchSpecialities = async () => {
        if (!userAccountData?.access_token) return;
        
        setIsLoadingSpecialities(true);
        try {
            const response = await specialityService.getSpecialities(userAccountData.access_token);
            if (response.status === 200) {
                setAvailableSpecialities(response.data);
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

    const handleSubmit = async () => {
        if (!full_name.trim() || !email.trim() || !phone.trim()) {
            showToast(
                "Erro!",
                "Por favor, preencha todos os campos obrigatórios.",
                "error"
            );
            return;
        }

        if (!userAccountData?.access_token) {
            showToast(
                "Erro!",
                "Token de autenticação não encontrado.",
                "error"
            );
            return;
        }

        setIsLoading(true);
        try {
            if (editingProfessional) {
                const updateData: TUpdateProfessionalData = {
                    full_name: full_name.trim(),
                    email: email.trim(),
                    phone: phone.trim(),
                    bio: bio.trim(),
                    is_enabled,
                    specialities
                };

                const response = await professionalService.putUpdateProfessional(
                    editingProfessional.id,
                    updateData,
                    userAccountData.access_token
                );

                if (response.status === 200) {
                    updateProfessional(editingProfessional.id, response.data);
                    showToast(
                        "Sucesso!",
                        "Profissional atualizado com sucesso!",
                        "success"
                    );
                    handleClose();
                }
            } else {
                const createData = {
                    full_name: full_name.trim(),
                    email: email.trim(),
                    phone: phone.trim(),
                    bio: bio.trim(),
                    is_enabled,
                    specialities
                };

                const response = await professionalService.postCreateProfessional(
                    createData,
                    userAccountData.access_token
                );

                if (response.status === 201 || response.status === 200) {
                    addProfessional(response.data);
                    showToast(
                        "Sucesso!",
                        "Profissional criado com sucesso!",
                        "success"
                    );
                    handleClose();
                }
            }
        } catch (error: any) {
            showToast(
                "Erro!",
                error.response?.data?.detail || "Erro ao salvar profissional. Tente novamente.",
                "error"
            );
        } finally {
            setIsLoading(false);
        }
    };

    const handleSpecialityToggle = (specialityId: string) => {
        const newSpecialities = specialities.includes(specialityId)
            ? specialities.filter((id: string) => id !== specialityId)
            : [...specialities, specialityId];
        setSpecialities(newSpecialities);
    };

    const filteredSpecialities = searchTerm.trim() 
        ? availableSpecialities.filter(speciality =>
            speciality.title.toLowerCase().includes(searchTerm.toLowerCase()))
        : [];

    const handleSpecialitySelect = (specialityId: string) => {
        if (!specialities.includes(specialityId)) {
            setSpecialities([...specialities, specialityId]);
        }
        setSearchTerm("");
    };

    const handleClose = () => {
        clearForm();
        setSearchTerm("");
        onClose();
    };

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={handleClose}
            className="modal-content"
            overlayClassName="modal-overlay"
            contentLabel="Modal de Gerenciar Profissional"
        >
            <div className="bg-neutral-09 rounded-card shadow-card w-full max-w-[600px] mx-4 max-h-[90vh] flex flex-col">
                <div className="flex justify-between items-center px-6 py-4">
                    <div className="flex flex-row items-center gap-2">
                        <UserPlus className="w-5 h-5 text-primary" />
                        <h2 className="text-lg font-semibold text-neutral-18">
                            {editingProfessional ? "Editar Profissional" : "Novo Profissional"}
                        </h2>
                    </div>
                    
                    <ButtonClose onClose={handleClose} />
                </div>

                <div className="px-6 pb-6 flex-1 overflow-y-auto">
                    <div className="space-y-4">
                        {editingProfessional ? (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Nome Completo
                                    <span className="text-gray-700 ml-1">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={full_name}
                                    className="w-full px-4 py-1 border border-neutral-10 rounded-lg focus:outline-none bg-gray-100 placeholder:text-sm cursor-not-allowed"
                                    placeholder="Ex: Dr. João Silva"
                                    disabled
                                />
                            </div>
                        ) : (
                            <Input
                                type="text"
                                value={full_name}
                                onChange={(e) => setFullName(e.target.value)}
                                placeholder="Ex: Dr. João Silva"
                                label="Nome Completo"
                                required
                            />
                        )}

                        <Input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Ex: joao.silva@email.com"
                            label="E-mail"
                            required
                        />

                        <Input
                            type="tel"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="Ex: 11999999999"
                            label="Telefone"
                            required
                        />

                        <Input
                            type="text"
                            value={bio}
                            onChange={(e) => setBio(e.target.value)}
                            placeholder="Ex: Dr. João Silva"
                            label="Biografia"
                            required
                        />

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Buscar Especialidades
                            </label>
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

                        {specialities.length > 0 && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Especialidades Selecionadas
                                </label>
                                <div className="flex flex-wrap gap-2">
                                    {specialities.map(specialityId => {
                                        const speciality = availableSpecialities.find(s => s.id === specialityId);
                                        return speciality ? (
                                            <div key={specialityId} className="flex items-center gap-2 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                                                <span>{speciality.title}</span>
                                                <button
                                                    type="button"
                                                    onClick={() => handleSpecialityToggle(specialityId)}
                                                    className="text-blue-600 hover:text-blue-800"
                                                >
                                                    <X className="w-3 h-3" />
                                                </button>
                                            </div>
                                        ) : null;
                                    })}
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="mt-6">
                        <ButtonPrimary 
                            onClick={handleSubmit}
                            disabled={!full_name.trim() || !email.trim() || !phone.trim() || isLoading || !userAccountData?.access_token}
                        >
                            {isLoading 
                                ? (editingProfessional ? "Atualizando..." : "Criando...") 
                                : (editingProfessional ? "Atualizar Profissional" : "Criar Profissional")
                            }
                        </ButtonPrimary>
                    </div>
                </div>
            </div>
            
            <SpecialityDropdown
                isVisible={searchTerm.trim().length > 0}
                position={dropdownPosition}
                isLoadingSpecialities={isLoadingSpecialities}
                filteredSpecialities={filteredSpecialities}
                specialities={specialities}
                handleSpecialitySelect={handleSpecialitySelect}
                showEditButtons={false}
            />
        </Modal>
    );
}