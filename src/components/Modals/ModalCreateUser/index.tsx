import { useState } from "react";
import Modal from "react-modal";
import { UserPlus } from "lucide-react";
import ButtonClose from "../../Buttons/ButtonClose";
import ButtonPrimary from "../../Buttons/ButtonPrimary";
import Input from "../../Inputs/Input";
import { userService } from "../../../services/User/user.service";
import { userManagementStore } from "../../../store/userManagementStore";
import { userStore } from "../../../store/userStore";
import { useToast } from "../../../contexts/ToastContext";
import { formatCPF, cleanCPF } from "../../../utils/formatCpf";
import { formatPhone, cleanPhone } from "../../../utils/formatPhone";

Modal.setAppElement("#root");

interface ModalCreateUserProps {
    isOpen: boolean;
    onClose: () => void;
    userType: 'patient' | 'admin';
}

export function ModalCreateUser({ isOpen, onClose, userType }: ModalCreateUserProps) {
    const { addUser } = userManagementStore();
    const { userAccountData } = userStore();
    const { showToast } = useToast();

    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [cpf, setCpf] = useState("");
    const [birthDate, setBirthDate] = useState("");
    const [bio, setBio] = useState("");
    const [frequency, setFrequency] = useState("as_needed");
    const [isLoading, setIsLoading] = useState(false);
    const [selectedUserType, setSelectedUserType] = useState<'patient' | 'admin'>(userType);


    const handleClose = () => {
        setFullName("");
        setEmail("");
        setPhone("");
        setCpf("");
        setBirthDate("");
        setBio("");
        setFrequency("as_needed");
        onClose();
    };

    const handleCPFChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const formatted = formatCPF(e.target.value);
        setCpf(formatted);
    };

    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const formatted = formatPhone(e.target.value);
        setPhone(formatted);
    };

    const handleSubmit = async () => {
        if (!fullName.trim() || !email.trim() || !phone.trim() || !cpf.trim() || !birthDate.trim()) {
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
            // Converter data do formato DD/MM/YYYY para YYYY-MM-DD
            const formatDateForAPI = (dateStr: string) => {
                if (!dateStr) return '';
                const parts = dateStr.split('/');
                if (parts.length === 3) {
                    return `${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`;
                }
                return dateStr;
            };

            const userData = {
                full_name: fullName.trim(),
                email: email.trim(),
                phone: cleanPhone(phone),
                cpf: cleanCPF(cpf),
                birth_date: formatDateForAPI(birthDate.trim()),
                bio: bio.trim(),
                ...(selectedUserType === 'patient' && { frequency })
            };

            console.log('Dados sendo enviados:', userData);

            // Sempre criar como paciente primeiro
            const response = await userService.createPatient(userData, userAccountData.access_token);

            if (response.status === 201 || response.status === 200) {
                // Se for admin, fazer PATCH para definir is_superuser = true
                if (selectedUserType === 'admin') {
                    try {
                        console.log('Atualizando usuário para admin:', response.data.id);
                        await userService.updateUserToAdmin(response.data.id, userAccountData.access_token);
                        console.log('Usuário atualizado para admin com sucesso');
                    } catch (adminError) {
                        console.error('Erro ao atualizar para admin:', adminError);
                        showToast(
                            "Aviso!",
                            "Usuário criado, mas erro ao definir como administrador. Você pode editar manualmente.",
                            "warning"
                        );
                    }
                }
                
                addUser(response.data);
                showToast(
                    "Sucesso!",
                    `${selectedUserType === 'patient' ? 'Paciente' : 'Administrador'} criado com sucesso!`,
                    "success"
                );
                handleClose();
            }
        } catch (error: any) {
            console.error('Erro ao criar usuário:', error);
            
            let errorMessage = `Erro ao criar ${selectedUserType === 'patient' ? 'paciente' : 'administrador'}.`;
            
            if (error.response?.status === 422) {
                // Erro de validação - mostrar detalhes
                const validationErrors = error.response?.data?.detail;
                if (Array.isArray(validationErrors)) {
                    errorMessage = `Erro de validação: ${validationErrors.map((err: any) => err.msg).join(', ')}`;
                } else if (typeof validationErrors === 'string') {
                    errorMessage = validationErrors;
                } else {
                    errorMessage = 'Dados inválidos. Verifique os campos preenchidos.';
                }
            } else if (error.response?.data?.detail) {
                errorMessage = error.response.data.detail;
            }
            
            showToast(
                "Erro!",
                errorMessage,
                "error"
            );
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={handleClose}
            className="modal-content"
            overlayClassName="modal-overlay"
            contentLabel="Modal de Criar Usuário"
        >
            <div className="bg-[#f5f1eb] rounded-lg shadow-xl w-[380px] lg:w-[500px] mx-4">
                <div className="flex justify-between items-center px-6 py-4">
                    <div className="flex flex-row items-center gap-2">
                        <UserPlus className="w-5 h-5 text-primary" />
                        <h2 className="text-lg font-semibold text-neutral-18">
                            Cadastrar Novo Usuário
                        </h2>
                    </div>
                    
                    <ButtonClose onClose={handleClose} />
                </div>

                <div className="px-6 pb-6">
                    <p className="text-neutral-19 mb-6 text-sm">
                        Preencha as informações do novo usuário
                    </p>

                    <div className="space-y-4">
                        {/* Tipo de Usuário */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Tipo de Usuário
                            </label>
                            <select
                                value={selectedUserType}
                                onChange={(e) => setSelectedUserType(e.target.value as 'patient' | 'admin')}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="patient">Paciente</option>
                                <option value="admin">Administrativo</option>
                            </select>
                        </div>

                        <Input
                            type="text"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            placeholder="Nome completo do usuário"
                            label="Nome Completo"
                            required
                        />

                        <Input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="email@exemplo.com"
                            label="E-mail"
                            required
                        />

                        <Input
                            type="text"
                            value={cpf}
                            onChange={handleCPFChange}
                            placeholder="000.000.000-00"
                            label="CPF"
                            required
                        />

                        <div className="flex gap-4">
                            <div className="flex-1">
                                <Input
                                    type="tel"
                                    value={phone}
                                    onChange={handlePhoneChange}
                                    placeholder="(11) 99999-9999"
                                    label="Telefone"
                                    required
                                />
                            </div>
                            <div className="flex-1">
                                <Input
                                    type="text"
                                    value={birthDate}
                                    onChange={(e) => setBirthDate(e.target.value)}
                                    placeholder="dd/mm/aaaa"
                                    label="Data de Nascimento"
                                    required
                                    inputDate
                                />
                            </div>
                        </div>

                        <Input
                            type="text"
                            value={bio}
                            onChange={(e) => setBio(e.target.value)}
                            placeholder="Biografia do usuário (opcional)"
                            label="Biografia"
                        />

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Frequência de Consultas
                            </label>
                            <select
                                value={frequency}
                                onChange={(e) => setFrequency(e.target.value)}
                                disabled={selectedUserType === 'admin'}
                                className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                                    selectedUserType === 'admin' 
                                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                                        : 'bg-white text-gray-900'
                                }`}
                            >
                                <option value="as_needed">Conforme necessário</option>
                                <option value="weekly">Semanal</option>
                                <option value="biweekly">Quinzenal</option>
                                <option value="monthly">Mensal</option>
                            </select>
                            
                        </div>

                    </div>

                    <div className="">
                        <ButtonPrimary 
                            onClick={handleSubmit}
                            disabled={!fullName.trim() || !email.trim() || !phone.trim() || !cpf.trim() || !birthDate.trim() || isLoading || !userAccountData?.access_token}
                        >
                            {isLoading ? "Criando..." : "Criar Usuário"}
                        </ButtonPrimary>
                    </div>
                </div>
            </div>
        </Modal>
    );
}
