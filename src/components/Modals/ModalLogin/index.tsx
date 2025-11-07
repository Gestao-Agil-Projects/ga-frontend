import { User } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Modal from "react-modal";
import TabBar from "../../TabBar";
import Input from "../../Inputs/Input";
import ButtonClose from "../../Buttons/ButtonClose";
import ButtonPrimary from "../../Buttons/ButtonPrimary";
import { createUserStore } from "../../../store/createUserStore";
import { userService } from "../../../services/User/user.service";
import { userStore } from "../../../store/userStore";
import { formatCPF, cleanCPF } from "../../../utils/formatCpf";
import { formatPhone, cleanPhone } from "../../../utils/formatPhone";
import { useToast } from "../../../contexts/ToastContext";
import { EnvConfig } from "../../../config/env.config";

Modal.setAppElement("#root");

interface ModalLoginProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function ModalLogin({ isOpen, onClose }: ModalLoginProps) {
    const navigate = useNavigate();
    const { 
        email, 
        setEmail, 
        cpf, 
        setCpf, 
        password, 
        setPassword, 
        full_name, 
        setFullName, 
        phone, 
        setPhone,
        birth_date,
        setBirthDate
    } = createUserStore();
    const { user, setUser, setUserAccountData } = userStore();
    const { showToast } = useToast();
    const [emailLogin, setEmailLogin] = useState("");
    const [passwordLogin, setPasswordLogin] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPasswordFields, setShowPasswordFields] = useState(false);
    const [currentUserData, setCurrentUserData] = useState<any>(null);
    
    const [activeTab, setActiveTab] = useState<string>("login");
    const [isLoading, setIsLoading] = useState(false);

    const loginTabs = [
        { id: "login", label: "Entrar" },
        { id: "register", label: "Criar Conta" }
    ];

    const formComplete = () => {
        if (activeTab === "login") {
            return emailLogin.trim() !== "" && passwordLogin.trim() !== "";
        } else {
            return full_name.trim() !== "" && email.trim() !== "" && password.trim() !== "" && cpf.trim() !== "";
        }
    };

    const clearForm = () => {
        setEmail("");
        setPassword("");
        setFullName("");
        setPhone("");
        setCpf("");
        setBirthDate("");
        setEmailLogin("");
        setPasswordLogin("");
        setNewPassword("");
        setConfirmPassword("");
        setShowPasswordFields(false);
        setCurrentUserData(null);
    };

    const handleChangePassword = async (userData: any) => {
        if (!newPassword || !confirmPassword) {
            showToast("Erro!", "Preencha todos os campos.", "error");
            return;
        }

        if (newPassword !== confirmPassword) {
            showToast("Erro!", "As senhas não coincidem.", "error");
            return;
        }

        if (newPassword.length < 6) {
            showToast("Erro!", "A senha deve ter pelo menos 6 caracteres.", "error");
            return;
        }

        setIsLoading(true);
        try {
            const patchResponse = await userService.updateCurrentUser(
                {
                    password: newPassword,
                    is_first_access: false
                },
                userData.access_token
            );

            if (patchResponse.status !== 200) {
                throw new Error('Erro ao alterar senha');
            }

            // Atualizar o userAccountData no store
            const updatedUserData = {
                ...userData,
                is_first_access: false
            };
            setUserAccountData(updatedUserData);

            showToast(
                "Sucesso!",
                "Senha alterada com sucesso!",
                "success"
            );

            // Fechar modal e limpar formulário
            clearForm();
            onClose();
            
            // Continuar com o fluxo normal após fechar o modal
            if (userData?.is_superuser) {
                navigate("/dashboard");
            } else {
                navigate("/user");
            }
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

    const handleContinueWithTemporaryPassword = async (userData: any) => {
        setIsLoading(true);
        try {
            // Fazer PATCH request para setar is_first_access como false
            const patchResponse = await userService.updateCurrentUser(
                {
                    is_first_access: false
                },
                userData.access_token
            );

            if (patchResponse.status !== 200) {
                throw new Error('Erro ao atualizar status de primeiro acesso');
            }

            // Atualizar o userAccountData no store
            const updatedUserData = {
                ...userData,
                is_first_access: false
            };
            setUserAccountData(updatedUserData);

            showToast(
                "Sucesso!",
                "Login realizado com sucesso! Bem-vindo ao Calm Mind.",
                "success"
            );
            
            // Fechar modal e limpar formulário
            clearForm();
            onClose();
            
            // Redirecionar após fechar o modal
            if (userData?.is_superuser) {
                navigate("/dashboard");
            } else {
                navigate("/user");
            }
        } catch (error: any) {
            showToast(
                "Erro!",
                "Erro ao finalizar primeiro acesso. Tente novamente.",
                "error"
            );
        } finally {
            setIsLoading(false);
        }
    };

    const handleCreateUser = async () => {
        if (!formComplete()) return;
        
        setIsLoading(true);
        try {
            const userData = {
                email: email.trim(),
                password: password.trim(),
                full_name: full_name.trim(),
                cpf: cleanCPF(cpf),
                phone: cleanPhone(phone),
                birth_date: birth_date || "1990-01-01",
                frequency: "as_needed",
                role: "patient",
                is_active: true,
                is_superuser: false,
                is_verified: false
            };

            console.log("📤 Dados sendo enviados:", userData);

            const response = await userService.createPatient(userData, "");

            if (response && response.status === 201) {
                const userData = {
                    ...response.data,
                    is_active: true,
                    is_superuser: false,
                    is_verified: false
                };
                setUser(userData);
                console.log("user", user);
                console.log("✅ Usuário criado:", response.data);

                try {
                    const loginData = {
                        grant_type: "password",
                        username: email.trim(),
                        password: password.trim(),
                        scope: "string",
                        client_id: "string",
                        client_secret: "string"
                    };

                    console.log("🔐 Dados de login:", loginData);

                    const loginResponse = await userService.postLogin(loginData);
                    
                    if (loginResponse.status === 200) {
                        setUserAccountData(loginResponse.data);

                        showToast(
                            "Sucesso!",
                            "Conta criada e login realizado com sucesso! Bem-vindo ao Calm Mind.",
                            "success"
                        );
                    }
                } catch (loginError: any) {
                    showToast(
                        "Sucesso!",
                        "Conta criada com sucesso! Faça login para continuar.",
                        "success"
                    );
                }

                clearForm();
                onClose();
            }

        } catch (error: any) {
            showToast(
                "Erro!",
                error.message || "Erro ao criar conta. Tente novamente.",
                "error"
            );
            onClose();
            clearForm();

        } finally {
            setIsLoading(false);
        }
    };

    const handleLogin = async () => {
        setIsLoading(true);
        try {
            if (emailLogin === EnvConfig.ADMIN_EMAIL && passwordLogin === EnvConfig.ADMIN_PASSWORD) {

                const loginData = {
                    grant_type: "password",
                    username: emailLogin,
                    password: passwordLogin,
                    scope: "string",
                    client_id: "string",
                    client_secret: "string"
                };

                try {
                    const response = await userService.postLogin(loginData);
                    
                    if (response.status === 200) {
                        // Fazer chamada para /api/users/me para obter dados completos do admin
                        try {
                            console.log('Fazendo chamada para /api/users/me com token do admin:', response.data.access_token);
                            const userMeResponse = await userService.getCurrentUser(response.data.access_token);
                            
                            console.log('Resposta do /api/users/me para admin:', userMeResponse.status);
                            
                            if (userMeResponse.status === 200) {
                                const userMeData = userMeResponse.data;
                                console.log('Dados do admin obtidos:', userMeData);
                                console.log('is_first_access do admin:', userMeData.is_first_access);
                                const adminData = {
                                    ...response.data,
                                    ...userMeData
                                };
                                
                                setUserAccountData(adminData);
                                setCurrentUserData(adminData);
                                
                                // Verificar se é primeiro acesso do admin
                                if (adminData.is_first_access === true) {
                                    console.log('Primeiro acesso do admin detectado - exibindo campos de senha');
                                    setShowPasswordFields(true);
                                    showToast(
                                        "Bem-vindo!",
                                        "Este é seu primeiro acesso. Defina uma nova senha para sua conta.",
                                        "info"
                                    );
                                    // NÃO fechar o modal nem redirecionar - admin deve alterar senha primeiro
                                    return;
                                }
                                
                                // Só executa se NÃO for primeiro acesso
                                showToast(
                                    "Sucesso!",
                                    "Login de administrador realizado com sucesso!",
                                    "success"
                                );
                                
                                clearForm();
                                onClose();
                                navigate("/dashboard");
                                return;
                            } else {
                                throw new Error('Erro ao obter dados do admin');
                            }
                        } catch (adminMeError: any) {
                            console.error('Erro ao obter dados do admin:', adminMeError);
                            showToast(
                                "Erro!",
                                "Erro ao obter dados do administrador. Tente novamente.",
                                "error"
                            );
                            return;
                        }
                    }
                } catch (adminLoginError: any) {
                    showToast(
                        "Erro!",
                        "Erro ao fazer login de administrador. Verifique as credenciais.",
                        "error"
                    );
                    return;
                }
            }

            const loginData = {
                grant_type: "password",
                username: emailLogin,
                password: passwordLogin,
                scope: "string",
                client_id: "string",
                client_secret: "string"
            };

            const response = await userService.postLogin(loginData);
            
            if (response.status === 200) {
                // Fazer chamada para /api/users/me para obter dados completos do usuário
                try {
                    console.log('Fazendo chamada para /api/users/me com token:', response.data.access_token);
                    const userMeResponse = await userService.getCurrentUser(response.data.access_token);
                    
                    console.log('Resposta do /api/users/me:', userMeResponse.status);
                    
                    if (userMeResponse.status === 200) {
                        const userMeData = userMeResponse.data;
                        console.log('Dados do usuário obtidos:', userMeData);
                        console.log('is_first_access do backend:', userMeData.is_first_access);
                        const userData = {
                            ...response.data,
                            ...userMeData
                        };
                        
                        console.log('userData final:', userData);
                        setUserAccountData(userData);
                        setCurrentUserData(userData);
                        
                        // Verificar se é primeiro acesso
                        console.log('Verificando is_first_access:', userData.is_first_access, typeof userData.is_first_access);
                        if (userData.is_first_access === true) {
                            console.log('Primeiro acesso detectado - exibindo campos de senha');
                            setShowPasswordFields(true);
                            showToast(
                                "Bem-vindo!",
                                "Este é seu primeiro acesso. Defina uma nova senha para sua conta.",
                                "info"
                            );
                            // NÃO fechar o modal nem redirecionar - usuário deve alterar senha primeiro
                            return; // IMPORTANTE: return aqui para não continuar
                        }
                        
                        // Só executa se NÃO for primeiro acesso
                        console.log('Não é primeiro acesso - redirecionando');
                        showToast(
                            "Sucesso!",
                            "Login realizado com sucesso! Bem-vindo ao Calm Mind.",
                            "success"
                        );
                        clearForm();
                        onClose();
                        
                        // Verificar is_superuser para redirecionamento
                        if (userData.is_superuser) {
                            navigate("/dashboard");
                        } else {
                            navigate("/user");
                        }
                    } else {
                        throw new Error('Erro ao obter dados do usuário');
                    }
                } catch (userMeError) {
                    console.error('Erro ao obter dados do usuário:', userMeError);
                    
                    // Se o erro for de parsing JSON, pode ser que a URL esteja errada
                    if (userMeError instanceof SyntaxError) {
                        showToast(
                            "Erro!",
                            "Erro de conexão com o servidor. Verifique se o backend está rodando.",
                            "error"
                        );
                    } else {
                        showToast(
                            "Erro!",
                            "Erro ao obter dados do usuário. Tente novamente.",
                            "error"
                        );
                    }
                }
            }

            onClose();
        } catch (error: any) {
            showToast(
                "Erro!",
                "Erro ao fazer login. Tente novamente.",
                "error"
            );
        } finally {
            setIsLoading(false);
        }
    };

    const handleCPFChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const formatted = formatCPF(e.target.value);
        setCpf(formatted);
    };

    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const formatted = formatPhone(e.target.value);
        setPhone(formatted);
    };

    return (
        <>
            <Modal
                isOpen={isOpen}
                onRequestClose={onClose}
                className="modal-content"
                overlayClassName="modal-overlay"
                contentLabel="Modal de Login"
            >
                <div className="bg-[#f5f1eb] rounded-lg shadow-xl w-[380px] lg:w-[500px] mx-4">
                    <div className="flex justify-between items-center px-6 py-4">
                        <div className="flex flex-row items-center gap-2">
                            <User className="w-5 h-5 text-primary" />
                            <h2 className="text-lg font-semibold text-neutral-18">
                                Acesse sua conta
                            </h2>
                        </div>
                        
                        <ButtonClose onClose={onClose} />
                    </div>

                    <div className="px-6 pb-6">
                        <p className="text-neutral-19 mb-6 text-sm">
                            Faça login ou crie uma conta para confirmar seu agendamento
                        </p>

                        <TabBar 
                            tabs={loginTabs}
                            activeTab={activeTab}
                            setActiveTab={setActiveTab}
                        />

                        <div className="space-y-4">
                            {activeTab === "login" ? (
                                <>
                                    <Input
                                        type="email"
                                        value={emailLogin}
                                        onChange={(text) => setEmailLogin(text.target.value)}
                                        placeholder="seu@email.com"
                                        label="Email"
                                    />
                                    <Input
                                        type="password"
                                        value={passwordLogin}
                                        onChange={(text) => setPasswordLogin(text.target.value)}
                                        placeholder="Sua senha"
                                        label="Senha"
                                    />
                                    
                                    {/* Campos de alteração de senha para primeiro acesso */}
                                    {showPasswordFields && (
                                        <>
                                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
                                                <div className="flex items-center gap-2 mb-3">
                                                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                                    <span className="text-sm font-medium text-blue-800">Primeiro Acesso</span>
                                                </div>
                                                <p className="text-sm text-blue-700 mb-4">
                                                    Defina uma nova senha para sua conta ou continue com a senha temporária.
                                                </p>
                                                
                                                <Input
                                                    type="password"
                                                    value={newPassword}
                                                    onChange={(text) => setNewPassword(text.target.value)}
                                                    placeholder="Nova senha"
                                                    label="Nova Senha"
                                                />
                                                <div className="mt-2">
                                                    <Input
                                                        type="password"
                                                        value={confirmPassword}
                                                        onChange={(text) => setConfirmPassword(text.target.value)}
                                                        placeholder="Repita a nova senha"
                                                        label="Repita a Nova Senha"
                                                    />
                                                </div>
                                                
                                                
                                                <div className="gap-2 mt-4">
                                                    <ButtonPrimary
                                                        onClick={() => handleChangePassword(currentUserData)}
                                                        disabled={isLoading}
                                                    >
                                                    {isLoading ? "Alterando..." : "Alterar Senha"}
                                                    </ButtonPrimary>

                                                    <ButtonPrimary
                                                        onClick={() => handleContinueWithTemporaryPassword(currentUserData)}
                                                        disabled={isLoading}
                                                    >
                                                        Continuar com Senha Provisória
                                                    </ButtonPrimary>
                                                </div>
                                            </div>
                                        </>
                                    )}
                                </>
                            ) : (
                                <>
                                    <Input
                                        type="text"
                                        value={full_name}
                                        onChange={(e) => setFullName(e.target.value)}
                                        placeholder="Seu nome completo"
                                        label="Nome Completo"
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
                                    <Input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="seu@email.com"
                                        label="Email"
                                        required
                                    />
                                    <div className="flex flex-row justify-between gap-4">
                                        <Input
                                            type="tel"
                                            value={phone}
                                            onChange={handlePhoneChange}
                                            placeholder="+00 (00) 00000-0000"
                                            label="Telefone"
                                        />
                                        <Input
                                            type="text"
                                            value={birth_date}
                                            onChange={(e) => setBirthDate(e.target.value)}
                                            placeholder="00/00/0000"
                                            label="Data de Nascimento"
                                            required
                                            inputDate
                                        />
                                    </div>
                                    <Input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="Mínimo 6 caracteres"
                                        label="Senha"
                                        required
                                    />
                                </>
                            )}
                        </div>

                        <ButtonPrimary 
                            onClick={activeTab === "login" ? handleLogin : handleCreateUser}
                            disabled={!formComplete() || isLoading}
                        >
                            {isLoading ? "Processando..." : (activeTab === "login" ? "Entrar" : "Criar Conta")}
                        </ButtonPrimary>

                        {activeTab === "register" && (
                            <p className="text-xs text-neutral-19 mt-4 text-center">
                                Ao criar uma conta, você concorda com nossos{" "}
                                <a href="#" className="text-neutral-20 hover:underline">termos de uso</a>
                                {" "}e{" "}
                                <a href="#" className="text-neutral-20 hover:underline">política de privacidade</a>.
                            </p>
                        )}
                    </div>
                </div>
            </Modal>
        </>
    );
}
