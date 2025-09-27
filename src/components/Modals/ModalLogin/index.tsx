import { User } from "lucide-react";
import { useState } from "react";
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

Modal.setAppElement("#root");

interface ModalLoginProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function ModalLogin({ isOpen, onClose }: ModalLoginProps) {
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
    const { user, setUser, userAccountData, setUserAccountData } = userStore();
    const { showToast } = useToast();
    const [emailLogin, setEmailLogin] = useState("");
    const [passwordLogin, setPasswordLogin] = useState("");
    
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

            const response = await userService.postCreateUser(userData);

            if (response.status === 201) {
                setUser(response.data);
                console.log("user", user);
                console.log("✅ Usuário criado:", response.data);

                // Realizar login automático após cadastro bem-sucedido
                try {
                    const loginData = {
                        username: email.trim(), // Usar o email do cadastro
                        password: password.trim(), // Usar a senha do cadastro
                    };

                    console.log("🔐 Dados de login:", loginData);

                    const loginResponse = await userService.postLogin(loginData);
                    
                    if (loginResponse.status === 200) {
                        setUserAccountData(loginResponse.data);
                        console.log("userAccountData", userAccountData);
                        console.log("✅ Login realizado com sucesso:", loginResponse.data);
                        
                        showToast(
                            "Sucesso!",
                            "Conta criada e login realizado com sucesso! Bem-vindo ao Calm Mind.",
                            "success"
                        );
                    }
                } catch (loginError: any) {
                    console.error("❌ Erro no login automático:", loginError);
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
            console.error("❌ Erro no cadastro:", error);
            
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
            const loginData = {
                grant_type: "password",
                username: emailLogin,
                password: passwordLogin,
                scope: "string",
                client_id: "string",
                client_secret: "string"
            };

            console.log("🔐 Dados de login:", loginData);

            const response = await userService.postLogin(loginData);
            
            if (response.status === 200) {
                showToast(
                    "Sucesso!",
                    "Login realizado com sucesso! Bem-vindo ao Calm Mind.",
                    "success"
                );
                clearForm();
                setUserAccountData(response.data);
                console.log("userAccountData", userAccountData);
                console.log("✅ Login realizado:", response.data);
            }

            onClose();
        } catch (error: any) {
            console.error("❌ Erro no login:", error);
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
                <div className="bg-neutral-09 rounded-lg shadow-xl w-[380px] lg:w-[500px] mx-4">
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
