import { useState } from "react";
import { Eye, EyeOff, Mail, Lock, LogIn } from "lucide-react";
import Modal from "react-modal";
import { useNavigate } from "react-router-dom";
import { userService } from "../../../services/User/user.service";
import { useToast } from "../../../contexts/ToastContext";

Modal.setAppElement("#root");

interface ModalLoginProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ModalLogin({ isOpen, onClose }: ModalLoginProps) {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [emailLogin, setEmailLogin] = useState("");
  const [passwordLogin, setPasswordLogin] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    try {
      setIsLoading(true);
      const loginData = {
        grant_type: "password",
        username: emailLogin,
        password: passwordLogin,
        scope: "",
        client_id: "",
        client_secret: "",
      };

      const response = await userService.postLogin(loginData);
      if (response?.status === 200) {
        showToast("Sucesso!", "Login realizado com sucesso.", "success");
        onClose();
        navigate("/dashboard");
      } else {
        showToast("Erro", "Credenciais inválidas.", "error");
      }
    } catch (error) {
      showToast("Erro", "Falha ao conectar com o servidor.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-[420px] bg-white rounded-lg shadow-lg outline-none overflow-hidden font-['Open_Sans']"
      overlayClassName="fixed inset-0 bg-[#000]/60 z-50"
      contentLabel="Modal de Login"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-[#EBEBEB]">
        <div>
          <h2 className="text-[15px] font-['Open_Sans'] font-[700] text-[#000] flex items-center gap-2">
            <LogIn className="w-6 h-6 text-[#018DAE]" />
            Entrar no Sistema
          </h2>
          <p className="text-[12px] font-['Open_Sans'] font-[400] text-[#545454]">
            Entre com sua conta para acessar o Calm Mind
          </p>
        </div>
        <button
          onClick={onClose}
          className="text-[#545454] hover:text-[#000]"
          aria-label="Fechar"
        >
          ✕
        </button>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="space-y-5">
          <div>
            <h3 className="text-[17px] font-['Open_Sans'] font-[700] text-[#000] mb-1">Login</h3>
            <p className="text-[12px] font-['Open_Sans'] font-[400] text-[#545454]">
              Entre com suas credenciais para continuar
            </p>
          </div>

          {/* Form */}
          <div className="space-y-4">
            <div>
              <label className="block text-[13px] font-['Open_Sans'] font-[700] text-[#000] mb-2 flex items-center gap-2">
                <Mail className="w-5 h-5 text-[#545454]" />
                E-mail
              </label>
              <input
                type="email"
                value={emailLogin}
                onChange={(e) => setEmailLogin(e.target.value)}
                placeholder="seu@email.com"
                className="w-full px-4 py-3 bg-[#EBEBEB] text-[#000] rounded-lg font-['Open_Sans'] text-[16px] placeholder:text-[#545454] placeholder:text-[16px] focus:outline-none focus:ring-2 focus:ring-[#018DAE]/20 border border-[#EBEBEB]"
              />
            </div>

            <div>
              <label className="block text-[13px] font-['Open_Sans'] font-[700] text-[#000] mb-2 flex items-center gap-2">
                <Lock className="w-5 h-5 text-[#545454]" />
                Senha
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={passwordLogin}
                  onChange={(e) => setPasswordLogin(e.target.value)}
                  placeholder="Sua senha"
                  className="w-full px-4 py-3 bg-[#EBEBEB] text-[#000] rounded-lg font-['Open_Sans'] text-[16px] placeholder:text-[#545454] placeholder:text-[16px] pr-10 focus:outline-none focus:ring-2 focus:ring-[#018DAE]/20 border border-[#EBEBEB]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#545454] hover:text-[#000]"
                  aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button
              onClick={handleLogin}
              disabled={!emailLogin || !passwordLogin || isLoading}
              className="w-full py-3 px-4 bg-gradient-to-r from-[#79D3db] to-[#018DAE] text-white font-['Open_Sans'] font-[700] text-[15px] rounded-lg shadow-sm disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:opacity-90 mt-2"
            >
              {isLoading ? "Entrando..." : "Entrar"}
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
}