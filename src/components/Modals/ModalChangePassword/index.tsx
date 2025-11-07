import { useState } from "react";
import Modal from "react-modal";
import { Lock, Eye, EyeOff } from "lucide-react";
import ButtonClose from "../../Buttons/ButtonClose";
import ButtonPrimary from "../../Buttons/ButtonPrimary";
import Input from "../../Inputs/Input";
import { userStore } from "../../../store/userStore";
import { useToast } from "../../../contexts/ToastContext";
import { userService } from "../../../services/User/user.service";

Modal.setAppElement("#root");

interface ModalChangePasswordProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export function ModalChangePassword({ isOpen, onClose, onSuccess }: ModalChangePasswordProps) {
    const { userAccountData } = userStore();
    const { showToast } = useToast();
    
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleClose = () => {
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        onClose();
    };

    const validatePassword = (password: string): string[] => {
        const errors: string[] = [];
        
        if (password.length < 6) {
            errors.push("A senha deve ter pelo menos 6 caracteres");
        }
        
        if (!/(?=.*[a-z])/.test(password)) {
            errors.push("A senha deve conter pelo menos uma letra minúscula");
        }
        
        if (!/(?=.*[A-Z])/.test(password)) {
            errors.push("A senha deve conter pelo menos uma letra maiúscula");
        }
        
        if (!/(?=.*\d)/.test(password)) {
            errors.push("A senha deve conter pelo menos um número");
        }
        
        return errors;
    };

    const handleSubmit = async () => {
        if (!currentPassword.trim() || !newPassword.trim() || !confirmPassword.trim()) {
            showToast(
                "Erro!",
                "Por favor, preencha todos os campos.",
                "error"
            );
            return;
        }

        if (newPassword !== confirmPassword) {
            showToast(
                "Erro!",
                "As senhas não coincidem.",
                "error"
            );
            return;
        }

        const passwordErrors = validatePassword(newPassword);
        if (passwordErrors.length > 0) {
            showToast(
                "Erro!",
                passwordErrors.join(". "),
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
            // Fazer PATCH para /api/users/me com nova senha e is_first_access: false
            const response = await userService.updateCurrentUser(
                {
                    password: newPassword,
                    is_first_access: false
                },
                userAccountData.access_token
            );

            if (response.status !== 200) {
                throw new Error('Erro ao alterar senha');
            }

            showToast(
                "Sucesso!",
                "Senha alterada com sucesso!",
                "success"
            );
            handleClose();
            onSuccess();
        } catch (error: any) {
            showToast(
                "Erro!",
                "Erro ao alterar senha. Tente novamente.",
                "error"
            );
        } finally {
            setIsLoading(false);
        }
    };

    const isFormValid = currentPassword.trim() && 
                       newPassword.trim() && 
                       confirmPassword.trim() && 
                       newPassword === confirmPassword &&
                       validatePassword(newPassword).length === 0;

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={handleClose}
            className="modal-content"
            overlayClassName="modal-overlay"
            contentLabel="Modal de Alterar Senha"
        >
            <div className="bg-[#f5f1eb] rounded-lg shadow-xl w-[380px] lg:w-[500px] mx-4">
                <div className="flex justify-between items-center px-6 py-4">
                    <div className="flex flex-row items-center gap-2">
                        <Lock className="w-5 h-5 text-primary" />
                        <h2 className="text-lg font-semibold text-neutral-18">
                            Alterar Senha
                        </h2>
                    </div>
                    
                    <ButtonClose onClose={handleClose} />
                </div>

                <div className="px-6 pb-6">
                    <p className="text-neutral-19 mb-6 text-sm">
                        Para sua segurança, altere sua senha padrão no primeiro acesso
                    </p>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Senha Atual *
                            </label>
                            <div className="relative">
                                <Input
                                    type={showCurrentPassword ? "text" : "password"}
                                    value={currentPassword}
                                    onChange={(e) => setCurrentPassword(e.target.value)}
                                    placeholder="Digite sua senha atual"
                                    label=""
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Nova Senha *
                            </label>
                            <div className="relative">
                                <Input
                                    type={showNewPassword ? "text" : "password"}
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    placeholder="Digite sua nova senha"
                                    label=""
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowNewPassword(!showNewPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Confirmar Nova Senha *
                            </label>
                            <div className="relative">
                                <Input
                                    type={showConfirmPassword ? "text" : "password"}
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder="Confirme sua nova senha"
                                    label=""
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>

                        {/* Requisitos da senha */}
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                            <h4 className="text-sm font-medium text-blue-800 mb-2">Requisitos da senha:</h4>
                            <ul className="text-xs text-blue-600 space-y-1">
                                <li>• Pelo menos 6 caracteres</li>
                                <li>• Pelo menos uma letra minúscula</li>
                                <li>• Pelo menos uma letra maiúscula</li>
                                <li>• Pelo menos um número</li>
                            </ul>
                        </div>
                    </div>

                    <div className="mt-6 flex gap-3">
                        <button
                            onClick={handleClose}
                            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            Cancelar
                        </button>
                        <ButtonPrimary 
                            onClick={handleSubmit}
                            disabled={!isFormValid || isLoading || !userAccountData?.access_token}
                        >
                            {isLoading ? "Alterando..." : "Alterar Senha"}
                        </ButtonPrimary>
                    </div>
                </div>
            </div>
        </Modal>
    );
}
