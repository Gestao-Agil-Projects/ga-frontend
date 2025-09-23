import { User } from "lucide-react";
import { useState } from "react";
import Modal from "react-modal";
import TabBar from "../../TabBar";
import Input from "../../Inputs/Input";
import ButtonClose from "../../Buttons/ButtonClose";
import ButtonPrimary from "../../Buttons/ButtonPrimary";

Modal.setAppElement("#root");

interface ModalLoginProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function ModalLogin({ isOpen, onClose }: ModalLoginProps) {
    const [activeTab, setActiveTab] = useState<string>("login");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [fullName, setFullName] = useState("");
    const [phone, setPhone] = useState("");

    const loginTabs = [
        { id: "login", label: "Entrar" },
        { id: "register", label: "Criar Conta" }
    ];

    const formComplete = () => {
        if (activeTab === "login") {
            return email.trim() !== "" && password.trim() !== "";
        } else {
            return fullName.trim() !== "" && email.trim() !== "" && password.trim() !== "";
        }
    };

    const handleLogin = () => {
        onClose();
    };
    
    const handleRegister = () => {
        onClose();
    };

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onClose}
            className="modal-content"
            overlayClassName="modal-overlay"
            contentLabel="Modal de Login"
        >
            <div className="bg-gray-50 rounded-lg shadow-xl w-[380px] lg:w-[500px] mx-4">
                <div className="flex justify-between items-center px-6 py-4">
                    <div className="flex flex-row items-center gap-2">
                        <User className="w-5 h-5 text-primary" />
                        <h2 className="text-lg font-semibold text-gray-800">
                            Acesse sua conta
                        </h2>
                    </div>
                    
                    <ButtonClose onClose={onClose} />
                </div>

                <div className="px-6 pb-6">
                    <p className="text-gray-500 mb-6 text-sm">
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
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="seu@email.com"
                                    label="Email"
                                />
                                <Input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Sua senha"
                                    label="Senha"
                                />
                            </>
                        ) : (
                            <>
                                <Input
                                    type="text"
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    placeholder="Seu nome completo"
                                    label="Nome Completo"
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
                                <Input
                                    type="tel"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    placeholder="(11) 99999-9999"
                                    label="Telefone"
                                />
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
                        onClick={activeTab === "login" ? handleLogin : handleRegister}
                        disabled={!formComplete()}
                    >
                        {activeTab === "login" ? "Entrar" : "Criar Conta"}
                    </ButtonPrimary>

                    {activeTab === "register" && (
                        <p className="text-xs text-gray-500 mt-4 text-center">
                            Ao criar uma conta, você concorda com nossos{' '}
                            <a href="#" className="text-blue-600 hover:underline">termos de uso</a>
                            {' '}e{' '}
                            <a href="#" className="text-blue-600 hover:underline">política de privacidade</a>.
                        </p>
                    )}
                </div>
            </div>
        </Modal>
    );
}
