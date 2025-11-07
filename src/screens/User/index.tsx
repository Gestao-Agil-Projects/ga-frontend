import { useEffect, useState } from "react";
import { Header } from "../../components/Header";
import { userStore } from "../../store/userStore";
import { Calendar, User as UserIcon, Edit, Lock, Shield, Save, X } from "lucide-react";
import { userService } from "../../services/User/user.service";
import type { UserData } from "../../services/User/user.service";
import { formatDateForDisplay, formatDateForAPI, getDateFromValue } from "../../utils/dateFormatters";
import { formatFrequency } from "../../utils/formatFrequency";
import { ModalChangePassword } from "../../components/Modals/ModalChangePassword";
import { useToast } from "../../contexts/ToastContext";
import Input from "../../components/Inputs/Input";
import ButtonPrimary from "../../components/Buttons/ButtonPrimary";
import { cleanPhone } from "../../utils/formatPhone";
import { ModalScheduleAppointment } from "../../components/Modals/ModalScheduleAppointment";
import { scheduleService } from "../../services/Schedule/schedule.service";
import { professionalService } from "../../services/Professional/professional.service";
import type { IPatientSchedule } from "../../services/Schedule/types";

export function User() {
  const { userAccountData, currentUserData, setCurrentUserData } = userStore();
  const { showToast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] = useState(false);
  const [isEditingPassword, setIsEditingPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSavingPassword, setIsSavingPassword] = useState(false);
  const [isEditingPersonal, setIsEditingPersonal] = useState(false);
  const [isSavingPersonal, setIsSavingPersonal] = useState(false);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [personalForm, setPersonalForm] = useState({
    full_name: "",
    email: "",
    phone: "",
    birth_date: "",
    frequency: "",
    bio: ""
  });
  const [patientSchedules, setPatientSchedules] = useState<IPatientSchedule[]>([]);
  const [isLoadingSchedules, setIsLoadingSchedules] = useState(false);
  const [professionalsMap, setProfessionalsMap] = useState<Record<string, any>>({});
  const [isLoadingProfessionals, setIsLoadingProfessionals] = useState(false);
  const user = currentUserData || null;

  const passwordsMismatch = Boolean(
    newPassword &&
    confirmPassword &&
    newPassword !== confirmPassword
  );

useEffect(() => {
    fetchUserData();
  }, []);

  useEffect(() => {
    if (user && !isEditingPersonal) {
      setPersonalForm({
        full_name: user.full_name || "",
        email: user.email || "",
        phone: formatPhoneNumber(user.phone) || "",
        birth_date: formatBirthDateForInput(user.birth_date),
        frequency: user.frequency || "",
        bio: user.bio || ""
      });
    }
  }, [user, isEditingPersonal]);

  useEffect(() => {
    if (userAccountData?.access_token) {
      fetchPatientProfessionals();
      fetchPatientSchedules();
    }
  }, [userAccountData?.access_token]);

  const fetchUserData = async () => {
    if (!userAccountData?.access_token) return;

    setIsLoading(true);
    try {
      const response = await userService.getCurrentUser(userAccountData.access_token);
      if (response.status === 200) {
        setCurrentUserData(response.data);
      }
    } catch (error: any) {
      console.error("Erro ao buscar dados do usuário:", error);
      showToast(
        "Erro!",
        "Erro ao carregar dados do usuário. Tente novamente.",
        "error"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const getInitials = (name: string | undefined | null): string => {
    if (!name) return "JS";
    const names = name.trim().split(" ");
    if (names.length >= 2) {
      return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
    }
    return name.charAt(0).toUpperCase();
  };

  const formatBirthDateForInput = (dateString: string | undefined | null): string => {
    if (!dateString) return "";
    const onlyDate = dateString.split("T")[0];
    if (!onlyDate) return "";

    if (onlyDate.includes("-")) {
      const parts = onlyDate.split("-");
      if (parts.length === 3 && parts[0].length === 4) {
        const [year, month, day] = parts;
        return `${day.padStart(2, "0")}-${month.padStart(2, "0")}-${year}`;
      }
      if (parts.length === 3 && parts[2].length === 4) {
        return `${parts[0].padStart(2, "0")}-${parts[1].padStart(2, "0")}-${parts[2]}`;
      }
    }

    if (onlyDate.includes("/")) {
      const parts = onlyDate.split("/");
      if (parts.length === 3 && parts[2].length === 4) {
        return `${parts[0].padStart(2, "0")}-${parts[1].padStart(2, "0")}-${parts[2]}`;
      }
    }

    return onlyDate;
  };

  const formatPhoneNumber = (phone: string | undefined | null): string => {
    if (!phone) return "(11) 99999-9999";
    // Se o telefone já está formatado, retorna como está
    if (phone.includes("(") || phone.includes(")") || phone.includes("-")) {
      return phone;
    }
    // Remove o código do país (55) se presente e formata
    let cleanPhone = phone.replace(/\D/g, "");
    if (cleanPhone.startsWith("55") && cleanPhone.length >= 12) {
      cleanPhone = cleanPhone.substring(2);
    }
    // Formata o telefone brasileiro (11) 99999-9999
    if (cleanPhone.length === 11) {
      return `(${cleanPhone.substring(0, 2)}) ${cleanPhone.substring(2, 7)}-${cleanPhone.substring(7)}`;
    } else if (cleanPhone.length === 10) {
      return `(${cleanPhone.substring(0, 2)}) ${cleanPhone.substring(2, 6)}-${cleanPhone.substring(6)}`;
    }
    return phone;
  };

  const fetchPatientProfessionals = async () => {
    if (!userAccountData?.access_token) return;

    setIsLoadingProfessionals(true);
    try {
      const response = await professionalService.getPatientProfessionals(userAccountData.access_token);
      if (response.status === 200) {
        const rawData = Array.isArray(response.data)
          ? response.data
          : response.data?.results || [];

        const formattedProfessionals = rawData.map((item: any) => {
          if (item?.professional) {
            return {
              ...item.professional,
              is_enabled: item.professional.is_enabled ?? item.is_enabled ?? true,
              is_blocked: item.is_blocked ?? false
            };
          }
          return item;
        });

        const map: Record<string, any> = {};
        formattedProfessionals.forEach((prof: any) => {
          if (prof?.id) {
            map[prof.id] = prof;
          }
        });
        setProfessionalsMap(map);
      }
    } catch (error: any) {
      console.error("Erro ao buscar profissionais:", error);
      showToast("Erro!", "Erro ao carregar profissionais.", "error");
    } finally {
      setIsLoadingProfessionals(false);
    }
  };

  const fetchPatientSchedules = async () => {
    if (!userAccountData?.access_token) return;

    setIsLoadingSchedules(true);
    try {
      const response = await scheduleService.getPatientSchedules(userAccountData.access_token);
      if (response.status === 200) {
        const rawData = Array.isArray(response.data)
          ? response.data
          : response.data?.results || [];
        setPatientSchedules(rawData);
      }
    } catch (error: any) {
      console.error("Erro ao buscar consultas do paciente:", error);
      showToast("Erro!", "Erro ao carregar suas consultas.", "error");
    } finally {
      setIsLoadingSchedules(false);
    }
  };

  const capitalize = (value: string): string => {
    if (!value) return value;
    return value.charAt(0).toUpperCase() + value.slice(1);
  };

  const formatScheduleDate = (isoString: string): string => {
    if (!isoString) return "";
    const formatter = new Intl.DateTimeFormat("pt-BR", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
      timeZone: "UTC",
    });
    const formatted = formatter.format(new Date(isoString));
    return capitalize(formatted);
  };

  const formatScheduleTime = (isoString: string): string => {
    if (!isoString) return "";
    return new Intl.DateTimeFormat("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
      timeZone: "UTC",
    }).format(new Date(isoString));
  };

  const statusBadgeConfig: Record<string, { label: string; className: string }> = {
    taken: { label: "Confirmada", className: "bg-green-100 text-green-800" },
    scheduled: { label: "Agendada", className: "bg-blue-100 text-blue-800" },
    completed: { label: "Concluída", className: "bg-gray-200 text-gray-700" },
    cancelled: { label: "Cancelada", className: "bg-red-100 text-red-700" },
    default: { label: "Pendente", className: "bg-yellow-100 text-yellow-800" },
  };

  const getStatusConfig = (status: string | undefined) => {
    if (!status) return statusBadgeConfig.default;
    return statusBadgeConfig[status] || { label: capitalize(status), className: "bg-gray-100 text-gray-600" };
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

  const handleSavePassword = async () => {
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

    setIsSavingPassword(true);
    try {
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
      
      // Reset form
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setIsEditingPassword(false);
      fetchUserData();
    } catch (error: any) {
      showToast(
        "Erro!",
        error.response?.data?.detail || "Erro ao alterar senha. Tente novamente.",
        "error"
      );
    } finally {
      setIsSavingPassword(false);
    }
  };

  const handleCancelPassword = () => {
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setIsEditingPassword(false);
  };

  const handleStartEditPersonal = () => {
    if (!user) return;
    setPersonalForm({
      full_name: user.full_name || "",
      email: user.email || "",
      phone: formatPhoneNumber(user.phone) || "",
      birth_date: formatBirthDateForInput(user.birth_date),
      frequency: user.frequency || "",
      bio: user.bio || ""
    });
    setIsEditingPersonal(true);
  };

  const handleCancelPersonal = () => {
    setIsEditingPersonal(false);
    if (user) {
      setPersonalForm({
        full_name: user.full_name || "",
        email: user.email || "",
        phone: formatPhoneNumber(user.phone) || "",
        birth_date: formatBirthDateForInput(user.birth_date),
        frequency: user.frequency || "",
        bio: user.bio || ""
      });
    }
  };

  const handlePersonalFieldChange = (field: string, value: string) => {
    if (field === "phone") {
      setPersonalForm((prev) => ({
        ...prev,
        phone: value ? formatPhoneNumber(value) : ""
      }));
      return;
    }
    if (field === "birth_date") {
      const numbers = value.replace(/\D/g, "").slice(0, 8);
      let formatted = numbers;
      if (numbers.length > 4) {
        formatted = `${numbers.slice(0, 2)}-${numbers.slice(2, 4)}-${numbers.slice(4, 8)}`;
      } else if (numbers.length > 2) {
        formatted = `${numbers.slice(0, 2)}-${numbers.slice(2)}`;
      }
      setPersonalForm((prev) => ({
        ...prev,
        birth_date: formatted
      }));
      return;
    }
    setPersonalForm((prev) => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSavePersonal = async () => {
    if (!userAccountData?.access_token) {
      showToast("Erro!", "Token de autenticação não encontrado.", "error");
      return;
    }

    if (!personalForm.full_name.trim() || !personalForm.email.trim()) {
      showToast("Erro!", "Preencha pelo menos nome completo e e-mail.", "error");
      return;
    }

    setIsSavingPersonal(true);
    try {
      const payload: any = {
        full_name: personalForm.full_name.trim(),
        email: personalForm.email.trim(),
        phone: cleanPhone(personalForm.phone),
        frequency: personalForm.frequency || null,
        bio: personalForm.bio || null
      };

      if (personalForm.birth_date) {
        let birthDateValue: Date | null = null;
        if (personalForm.birth_date.includes("/")) {
          const [day, month, year] = personalForm.birth_date.split("/");
          if (day && month && year) {
            birthDateValue = new Date(`${year}-${month}-${day}`);
          }
        } else if (personalForm.birth_date.includes("-")) {
          const parts = personalForm.birth_date.split("-");
          if (parts.length === 3) {
            if (parts[0].length === 4) {
              birthDateValue = new Date(`${parts[0]}-${parts[1]}-${parts[2]}`);
            } else {
              const [day, month, year] = parts;
              if (day && month && year) {
                birthDateValue = new Date(`${year}-${month}-${day}`);
              }
            }
          }
        } else {
          const parsed = new Date(personalForm.birth_date);
          if (!isNaN(parsed.getTime())) {
            birthDateValue = parsed;
          }
        }

        if (birthDateValue && !isNaN(birthDateValue.getTime())) {
          payload.birth_date = formatDateForAPI(birthDateValue);
        }
      }

      const response = await userService.updateCurrentUser(payload, userAccountData.access_token);
      if (response.status === 200) {
        showToast("Sucesso!", "Dados atualizados com sucesso!", "success");
        await fetchUserData();
        setIsEditingPersonal(false);
      }
    } catch (error: any) {
      const detail =
        error.response?.data?.detail ||
        "Erro ao atualizar dados pessoais. Tente novamente.";
      showToast("Erro!", detail, "error");
    } finally {
      setIsSavingPersonal(false);
    }
  };

  const frequencyOptions = [
    { value: "", label: "Selecione" },
    { value: "weekly", label: "Semanal" },
    { value: "biweekly", label: "Quinzenal" },
    { value: "monthly", label: "Mensal" },
    { value: "as_needed", label: "Conforme necessidade" }
  ];

  const isLoadingConsultations = isLoadingSchedules || isLoadingProfessionals;
  const now = new Date();
  const sortedSchedules = [...patientSchedules].sort(
    (a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime()
  );
  const upcomingSchedulesList = sortedSchedules.filter(
    (schedule) => new Date(schedule.start_time).getTime() >= now.getTime()
  );
  const upcomingSchedulesDisplayed = upcomingSchedulesList.slice(0, 3);

  const patientForModal: UserData | null = user
    ? {
        id: user.id,
        full_name: user.full_name || "Paciente",
        email: user.email || "",
        phone: user.phone || "",
        cpf: "",
        birth_date: user.birth_date || "",
        image_url: user.image_url ?? undefined,
        bio: user.bio ?? undefined,
        frequency: user.frequency ?? undefined,
        role: (user.role as UserData["role"]) || "patient",
        is_superuser: user.is_superuser,
        created_at: user.created_at || new Date().toISOString(),
        consultations_count: undefined,
        last_consultation: undefined,
        next_consultation: undefined,
        psychologist_name: undefined,
      }
    : null;


  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div>
                <h1 className="text-3xl font-bold text-blue-600 mb-1">
                  Minha Área
                </h1>
                <p className="text-gray-600">
                  Gerencie suas consultas e mantenha seus dados atualizados
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="flex items-center space-x-2">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-sm font-bold text-blue-600">
                    {getInitials(user?.full_name)}
                  </span>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">
                    {user?.full_name || "João Silva"}
                  </p>
                  <p className="text-sm text-gray-500">
                    {user?.email || "joao@email.com"}
                  </p>
                </div>
              </div>

              

            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-2">
                <Calendar className="w-5 h-5 text-blue-600" />
                <h2 className="text-xl font-semibold text-gray-900">
                  Próximas Consultas
                </h2>
                </div>
                <button
                  onClick={() => setIsScheduleModalOpen(true)}
                  disabled={!userAccountData?.access_token}
                  className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  Agendar Consulta
                </button>
              </div>
              <p className="text-gray-600 mb-6">
                Suas consultas agendadas nos próximos dias
              </p>

              <div className="space-y-4">
                {isLoadingConsultations ? (
                  <div className="border rounded-lg p-4 bg-gray-50 text-gray-500 text-sm">
                    Carregando consultas...
                  </div>
                ) : upcomingSchedulesDisplayed.length > 0 ? (
                  upcomingSchedulesDisplayed.map((schedule) => {
                    const professional = professionalsMap[schedule.professional_id];
                    const speciality =
                      professional?.specialities?.[0]?.title ||
                      professional?.specialties?.[0]?.title ||
                      professional?.bio ||
                      "";
                    const statusConfig = getStatusConfig(schedule.status);
                    return (
                      <div key={schedule.id} className="border rounded-lg p-4">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                      <UserIcon className="w-6 h-6 text-gray-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                              <h3 className="font-semibold text-gray-900">
                                {professional?.full_name || "Profissional"}
                              </h3>
                              <span
                                className={`px-2 py-1 text-xs font-medium rounded-full ${statusConfig.className}`}
                              >
                                {statusConfig.label}
                        </span>
                      </div>
                            {speciality && (
                              <p className="text-sm text-gray-600">{speciality}</p>
                            )}
                      <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                              <span>{formatScheduleDate(schedule.start_time)}</span>
                              <span className="flex items-center space-x-1">

                                <span>
                                  {`${formatScheduleTime(schedule.start_time)} - ${formatScheduleTime(schedule.end_time)}`}
                                </span>
                              </span>
                      </div>

                    </div>
                  </div>
                </div>
                    );
                  })
                ) : (
                  <div className="border rounded-lg p-4 bg-gray-50 text-gray-500 text-sm">
                    Você ainda não possui consultas agendadas.
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="lg:col-span-1 space-y-6">
            {/* Card Dados Pessoais */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <UserIcon className="w-5 h-5 text-gray-700" strokeWidth={1.5} />
                  <h2 className="text-lg font-bold text-gray-900">
                    Dados Pessoais
                  </h2>
                </div>
                {!isEditingPersonal ? (
                  <button 
                    className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                    onClick={handleStartEditPersonal}
                  >
                    <Edit className="w-4 h-4 text-gray-600" strokeWidth={1.5} />
                  </button>
                ) : (
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={handleSavePersonal}
                      disabled={isSavingPersonal}
                      className="p-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Save className="w-4 h-4" strokeWidth={1.5} />
                    </button>
                    <button
                      onClick={handleCancelPersonal}
                      disabled={isSavingPersonal}
                      className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <X className="w-4 h-4 text-gray-600" strokeWidth={1.5} />
                </button>
                  </div>
                )}
              </div>
              <p className="text-sm text-gray-500 mb-6">
                Mantenha suas informações atualizadas
              </p>

              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <p className="text-gray-500">Carregando...</p>
                </div>
              ) : (
                <>
                  <div className="flex flex-col items-center mb-6">
                    <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-2xl font-bold text-blue-600">
                        {getInitials(user?.full_name)}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {!isEditingPersonal ? (
                      <>
                  <div>
                          <p className="text-sm font-semibold text-gray-700 mb-1">Nome Completo</p>
                          <p className="text-sm font-medium text-gray-900">
                            {user?.full_name || "João Silva"}
                    </p>
                  </div>

                        <div>
                          <p className="text-sm font-semibold text-gray-700 mb-1">E-mail</p>
                          <p className="text-sm font-medium text-gray-900">
                            {user?.email || "joao@email.com"}
                          </p>
                </div>

                  <div>
                          <p className="text-sm font-semibold text-gray-700 mb-1">Telefone</p>
                          <p className="text-sm font-medium text-gray-900">
                            {formatPhoneNumber(user?.phone)}
                    </p>
                  </div>

                        <div>
                          <p className="text-sm font-semibold text-gray-700 mb-1">Data de Nascimento</p>
                          <p className="text-sm font-medium text-gray-900">
                            {user?.birth_date ? formatDateForDisplay(getDateFromValue(user.birth_date)) : "14/05/1990"}
                          </p>
                </div>

                        <div className="border-t border-gray-200 my-4"></div>

                  <div>
                          <p className="text-sm font-semibold text-gray-700 mb-1">Frequência Preferida</p>
                          <p className="text-sm font-medium text-gray-900">
                            {formatFrequency(user?.frequency)}
                          </p>
                </div>

                        {user?.bio && (
                  <div>
                            <p className="text-sm font-semibold text-gray-700 mb-2">Observações</p>
                            <p className="text-sm text-gray-700 whitespace-pre-line leading-relaxed">
                              {user.bio}
                            </p>
                          </div>
                        )}
                      </>
                    ) : (
                      <>
                        <Input
                          type="text"
                          value={personalForm.full_name}
                          onChange={(e) => handlePersonalFieldChange("full_name", e.target.value)}
                          placeholder="Digite seu nome completo"
                          label="Nome Completo"
                          className="w-full px-4 py-2 bg-gray-100 border border-gray-200 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-0 focus:border-gray-200"
                        />
                        <Input
                          type="email"
                          value={personalForm.email}
                          onChange={(e) => handlePersonalFieldChange("email", e.target.value)}
                          placeholder="Digite seu e-mail"
                          label="E-mail"
                          className="w-full px-4 py-2 bg-gray-100 border border-gray-200 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-0 focus:border-gray-200"
                        />
                        <Input
                          type="text"
                          value={personalForm.phone}
                          onChange={(e) => handlePersonalFieldChange("phone", e.target.value)}
                          placeholder="Digite seu telefone"
                          label="Telefone"
                          className="w-full px-4 py-2 bg-gray-100 border border-gray-200 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-0 focus:border-gray-200"
                        />
                        <Input
                          type="text"
                          value={personalForm.birth_date}
                          onChange={(e) => handlePersonalFieldChange("birth_date", e.target.value)}
                          placeholder="Digite sua data de nascimento"
                          label="Data de Nascimento"
                          className="w-full px-4 py-2 bg-gray-100 border border-gray-200 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-0 focus:border-gray-200"
                        />
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Frequência Preferida
                          </label>
                          <select
                            value={personalForm.frequency}
                            onChange={(e) => handlePersonalFieldChange("frequency", e.target.value)}
                            className="w-full px-4 py-2 bg-gray-100 border border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:ring-0 focus:border-gray-200 text-sm"
                          >
                            {frequencyOptions.map((option) => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Observações
                          </label>
                          <textarea
                            value={personalForm.bio}
                            onChange={(e) => handlePersonalFieldChange("bio", e.target.value)}
                            placeholder="Adicione observações sobre você"
                            className="w-full min-h-[100px] px-4 py-2 bg-gray-100 border border-gray-200 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-0 focus:border-gray-200"
                          />
                        </div>
                      </>
                    )}
                  </div>
                </>
              )}
            </div>

            {/* Card Segurança */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-2 gap-2">
                <div className="flex items-center space-x-2">
                  <Shield className="w-5 h-5 text-blue-400" strokeWidth={1.5} />
                  <h2 className="text-lg font-bold text-gray-900">
                    Segurança
                  </h2>
                </div>
                {!isEditingPassword && (
                  <button
                    onClick={() => setIsEditingPassword(true)}
                    className="w-full bg-gray-100 hover:bg-gray-200 text-black py-2 px-4 rounded-md transition-colors text-sm"
                    >
                    <span className="text-sm font-medium text-gray-700">Alterar Senha</span>
                  </button>

                )}
              </div>
              <p className="text-sm text-gray-500 mb-6">
                Gerencie a segurança da sua conta
              </p>

              {!isEditingPassword ? (
                <>
                  {/* Campo de Senha */}
                  <div className="bg-gray-100 rounded-lg border border-gray-200 p-4 mb-4">
                <div className="flex items-center space-x-3">
                      <Lock className="w-5 h-5 text-gray-700 flex-shrink-0" strokeWidth={1.5} />
                      <div className="flex items-center space-x-2 flex-1">
                        <span className="text-sm text-gray-900">Senha</span>
                        <span className="text-sm text-gray-700">••••••••</span>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  {/* Dicas de Senha Segura */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                    <div className="flex items-start space-x-3">
                      <Lock className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" strokeWidth={1.5} />
                      <div className="flex-1">
                        <p className="text-sm font-bold text-blue-900 mb-2">
                          Dicas para uma senha segura:
                        </p>
                        <ul className="text-sm text-blue-800 space-y-1">
                          <li>• Use pelo menos 6 caracteres</li>
                          <li>• Combine letras maiúsculas e minúsculas</li>
                          <li>• Inclua números e caracteres especiais</li>
                          <li>• Evite informações pessoais óbvias</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Campos de Senha */}
                  <div className="space-y-4">
                    {/* Senha Atual */}
                    <Input
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="Digite sua senha atual"
                      label="Senha Atual"
                    />

                    {/* Separador */}
                    <div className="border-t border-gray-200"></div>

                    {/* Nova Senha */}
                    <Input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Digite sua nova senha"
                      label="Nova Senha"
                    />

                    {/* Confirmar Nova Senha */}
                    <div>
                      <Input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Confirme sua nova senha"
                        label="Confirmar Nova Senha"
                      />
                      {passwordsMismatch && (
                        <p className="mt-2 text-sm text-red-500">
                          As senhas não coincidem
                        </p>
                      )}
                </div>
              </div>

                  {/* Botões de Ação */}
                  <div className="flex items-center space-x-3 mt-6">
                    <ButtonPrimary
                      onClick={handleSavePassword}
                      disabled={isSavingPassword || !currentPassword || !newPassword || !confirmPassword || passwordsMismatch}
                    >
                      <span>Alterar Senha</span>
                    </ButtonPrimary>
                    <button
                      onClick={handleCancelPassword}
                      disabled={isSavingPassword}
                      className="w-full mt-6 bg-gray-100 hover:bg-gray-200 text-black py-2 px-4 rounded-md transition-colors text-sm"
                    >
                      <span>Cancelar</span>
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </main>

      <ModalChangePassword
        isOpen={isChangePasswordModalOpen}
        onClose={() => setIsChangePasswordModalOpen(false)}
        onSuccess={() => {
          setIsChangePasswordModalOpen(false);
          fetchUserData();
        }}
      />

      <ModalScheduleAppointment
        isOpen={isScheduleModalOpen}
        onClose={() => {
          setIsScheduleModalOpen(false);
          fetchPatientSchedules();
        }}
        patient={patientForModal}
        mode="patient"
      />
    </div>
  );
}
