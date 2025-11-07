import { useState, useEffect } from "react";
import { Search, UserPlus, Shield, Mail, Phone, FileText, Calendar, Clock, Trash2, Edit, Calendar as CalendarIcon, User } from "lucide-react";
import { userStore } from "../../store/userStore";
import { userManagementStore } from "../../store/userManagementStore";
import { userService, type UserData } from "../../services/User/user.service";
import { ModalCreateUser } from "../Modals/ModalCreateUser";
import { ModalScheduleAppointment } from "../Modals/ModalScheduleAppointment";
import { useToast } from "../../contexts/ToastContext";

export function ManageUsers() {
    const { userAccountData } = userStore();
    const { users, setUsers, removeUser } = userManagementStore();
    const { showToast } = useToast();
    
    const [filteredUsers, setFilteredUsers] = useState<UserData[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [activeFilter, setActiveFilter] = useState<'all' | 'patients' | 'admins'>('all');
    const [isLoading, setIsLoading] = useState(false);
    const [isCreateUserModalOpen, setIsCreateUserModalOpen] = useState(false);
    const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
    const [selectedPatient, setSelectedPatient] = useState<UserData | null>(null);

    useEffect(() => {
        if (userAccountData?.access_token) {
            fetchUsers();
        }
    }, [userAccountData?.access_token]);

    useEffect(() => {
        filterUsers();
    }, [users, searchTerm, activeFilter]);

    const fetchUsers = async () => {
        if (!userAccountData?.access_token) return;
        
        setIsLoading(true);
        try {
            const response = await userService.getAllUsers(userAccountData.access_token);
            if (response.status === 200) {
                setUsers(response.data);
            }
        } catch (error: any) {
            showToast(
                "Erro!",
                "Erro ao carregar usuários.",
                "error"
            );
        } finally {
            setIsLoading(false);
        }
    };

    const filterUsers = () => {
        let filtered = users;

        // Filtrar por tipo
        if (activeFilter === 'patients') {
            filtered = filtered.filter(user => !user.is_superuser);
        } else if (activeFilter === 'admins') {
            filtered = filtered.filter(user => user.is_superuser);
        }

        // Filtrar por busca
        if (searchTerm.trim()) {
            filtered = filtered.filter(user => 
                user.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.email.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        setFilteredUsers(filtered);
    };

    const getRolePillClasses = (is_superuser: boolean) => {
        return is_superuser
            ? 'bg-[rgba(1,141,174,0.18)] text-[var(--color-primary)] border border-[var(--color-primary)]'
            : 'bg-[rgba(125,212,220,0.25)] text-[var(--color-text-secondary)] border border-[rgba(125,212,220,0.6)]';
    };

    const getRoleLabel = (is_superuser: boolean) => {
        return is_superuser ? 'Admin' : 'Paciente';
    };

    const getFrequencyLabel = (frequency?: string) => {
        switch (frequency) {
            case 'weekly': return 'Semanal';
            case 'biweekly': return 'Quinzenal';
            case 'monthly': return 'Mensal';
            default: return 'Conforme necessário';
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('pt-BR');
    };

    const handleCreateUser = () => {
        setIsCreateUserModalOpen(true);
    };

    const handleEditUser = () => {
        // TODO: Implementar modal de edição de usuário
        showToast(
            "Info!",
            "Funcionalidade de edição de usuário será implementada em breve.",
            "info"
        );
    };

    const handleDeleteUser = async (id: string) => {
        if (!userAccountData?.access_token) return;

        if (!confirm("Tem certeza que deseja excluir este usuário?")) {
            return;
        }

        setIsLoading(true);
        try {
            const response = await userService.deleteUser(id, userAccountData.access_token);

            if (response.status === 200 || response.status === 204) {
                removeUser(id);
                showToast(
                    "Sucesso!",
                    "Usuário excluído com sucesso!",
                    "success"
                );
            }
        } catch (error: any) {
            showToast(
                "Erro!",
                error.response?.data?.detail || "Erro ao excluir usuário.",
                "error"
            );
        } finally {
            setIsLoading(false);
        }
    };

    const handleScheduleAppointment = (patient: UserData) => {
        setSelectedPatient(patient);
        setIsScheduleModalOpen(true);
    };

    return (
        <div className="space-y-6 text-[var(--color-text-primary)]">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-[var(--color-primary)]">Gerenciar Usuários</h1>
                    <p className="text-sm text-[var(--color-text-secondary)] mt-1">
                        Visualize e gerencie pacientes e administrativos
                    </p>
                </div>
                
                <button 
                    onClick={handleCreateUser}
                    className="px-4 py-2 bg-[var(--color-primary)] text-white text-sm font-medium rounded-lg hover:bg-[var(--color-primary-light)] transition-colors flex items-center gap-2 shadow-sm"
                >
                    <UserPlus className="w-4 h-4" />
                    Novo Usuário
                </button>
            </div>

            {/* Search and Filters */}
            <div className="bg-[var(--color-surface)] rounded-xl shadow-sm border border-[var(--color-border)] p-6">
                <div className="flex flex-col lg:flex-row gap-4 mb-6">
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[var(--color-text-secondary)]/70" />
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Buscar usuário por nome ou e-mail..."
                            className="w-full pl-10 pr-4 py-2 border border-[var(--color-border)] rounded-lg bg-[var(--color-surface)] text-[var(--color-text-primary)] placeholder:text-[var(--color-text-secondary)]/70 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent"
                        />
                    </div>
                </div>

                {/* Filter Tabs */}
                <div className="flex gap-2">
                    <button
                        onClick={() => setActiveFilter('all')}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                            activeFilter === 'all' 
                                ? 'bg-[rgba(1,141,174,0.18)] text-[var(--color-primary)] border border-[var(--color-primary)]' 
                                : 'bg-[var(--color-background)] text-[var(--color-text-secondary)] hover:bg-[rgba(125,212,220,0.25)]'
                        }`}
                    >
                        Todos ({users.length})
                    </button>
                    <button
                        onClick={() => setActiveFilter('patients')}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                            activeFilter === 'patients' 
                                ? 'bg-[rgba(1,141,174,0.18)] text-[var(--color-primary)] border border-[var(--color-primary)]' 
                                : 'bg-[var(--color-background)] text-[var(--color-text-secondary)] hover:bg-[rgba(125,212,220,0.25)]'
                        }`}
                    >
                        Pacientes ({users.filter(u => !u.is_superuser).length})
                    </button>
                    <button
                        onClick={() => setActiveFilter('admins')}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                            activeFilter === 'admins' 
                                ? 'bg-[rgba(1,141,174,0.18)] text-[var(--color-primary)] border border-[var(--color-primary)]' 
                                : 'bg-[var(--color-background)] text-[var(--color-text-secondary)] hover:bg-[rgba(125,212,220,0.25)]'
                        }`}
                    >
                        Administrativos ({users.filter(u => u.is_superuser).length})
                    </button>
                </div>
            </div>

            {/* Users Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {isLoading ? (
                    <div className="col-span-2 text-center py-8">
                        <div className="text-[var(--color-text-secondary)]">Carregando usuários...</div>
                    </div>
                ) : filteredUsers.length === 0 ? (
                    <div className="col-span-2 text-center py-8">
                        <div className="text-[var(--color-text-secondary)]">Nenhum usuário encontrado</div>
                    </div>
                ) : (
                    filteredUsers.map((user) => (
                        <div key={user.id} className={`rounded-xl shadow-sm border p-6 ${
                            user.is_superuser 
                                ? 'bg-gradient-to-br from-[rgba(1,141,174,0.09)] to-[rgba(125,212,220,0.25)] border-[var(--color-primary-lighter)]' 
                                : 'bg-[var(--color-surface)] border-[var(--color-border)]'
                        }`}>
                            {/* User Header */}
                            <div className="flex items-start gap-4 mb-4">
                                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                                    user.is_superuser 
                                        ? 'bg-[rgba(1,141,174,0.15)]' 
                                        : 'bg-[rgba(125,212,220,0.25)]'
                                }`}>
                                    {user.is_superuser ? (
                                        <Shield className="w-6 h-6 text-[var(--color-primary)]" />
                                    ) : (
                                        <User className="w-6 h-6 text-[var(--color-text-secondary)]" />
                                    )}
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                        <h3 className="font-semibold text-[var(--color-text-primary)]">{user.full_name}</h3>
                                        <span className={`px-2 py-1 text-xs font-medium rounded-full flex items-center gap-1 ${getRolePillClasses(user.is_superuser || false)}`}>
                                            {user.is_superuser && <Shield className="w-3 h-3" />}
                                            {getRoleLabel(user.is_superuser || false)}
                                        </span>
                                    </div>
                                    
                                    {/* Contact Info */}
                                    <div className={`space-y-1 text-sm ${
                                        user.is_superuser ? 'text-[var(--color-text-primary)]' : 'text-[var(--color-text-secondary)]'
                                    }`}>
                                        {user.email && (
                                            <div className="flex items-center gap-2">
                                                <Mail className={`w-3 h-3 ${user.is_superuser ? 'text-[var(--color-primary)]' : 'text-[var(--color-text-secondary)]/70'}`} />
                                                <span>{user.email}</span>
                                            </div>
                                        )}

                                        {user.phone && (
                                            <div className="flex items-center gap-2">
                                                <Phone className={`w-3 h-3 ${user.is_superuser ? 'text-[var(--color-primary)]' : 'text-[var(--color-text-secondary)]/70'}`} />
                                                <span>{user.phone}</span>
                                            </div>
                                        )}

                                        {user.cpf && (
                                            <div className="flex items-center gap-2">
                                                <FileText className={`w-3 h-3 ${user.is_superuser ? 'text-[var(--color-primary)]' : 'text-[var(--color-text-secondary)]/70'}`} />
                                                <span>{user.cpf}</span>
                                            </div>
                                        )}
                                        {user.created_at && (
                                            <div className="flex items-center gap-2">
                                                <Calendar className={`w-3 h-3 ${user.is_superuser ? 'text-[var(--color-primary)]' : 'text-[var(--color-text-secondary)]/70'}`} />
                                                <span>Cadastrado em {formatDate(user.created_at)}</span>
                                            </div>
                                        )}

                                        
                                    </div>
                                </div>
                            </div>

                            {/* Patient Specific Info */}
                            {!user.is_superuser && user.consultations_count !== undefined && (
                                <div className="mb-4">
                                    <a href="#" className="text-[var(--color-primary)] hover:text-[var(--color-primary-light)] text-sm font-medium">
                                        {user.consultations_count} consultas realizadas
                                    </a>
                                </div>
                            )}

                            {/* Action Buttons */}
                            <div className="flex gap-2 mb-4">
                                {!user.is_superuser && (
                                <button 
                                    onClick={() => handleScheduleAppointment(user)}
                                    className="px-3 py-1.5 bg-[var(--color-primary)] text-white text-xs font-medium rounded hover:bg-[var(--color-primary-light)] transition-colors flex items-center gap-1"
                                >
                                    <CalendarIcon className="w-3 h-3" />
                                    Agendar
                                </button>
                                )}
                                <button 
                                    onClick={handleEditUser}
                                    className={`px-3 py-1.5 text-xs font-medium rounded transition-colors flex items-center gap-1 ${
                                        user.is_superuser 
                                            ? 'bg-[rgba(1,141,174,0.18)] text-[var(--color-primary)] hover:bg-[rgba(61,176,197,0.3)]' 
                                            : 'bg-[var(--color-background)] text-[var(--color-text-secondary)] hover:bg-[rgba(125,212,220,0.25)]'
                                    }`}
                                >
                                    <Edit className="w-3 h-3" />
                                    Editar
                                </button>
                                <button 
                                    onClick={() => handleDeleteUser(user.id)}
                                    className="p-1.5 text-[var(--color-danger)] hover:text-red-700 transition-colors"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>

                            {/* Next Consultation (Patients only) */}
                            {user.role === 'patient' && user.next_consultation && (
                                <div className="bg-[var(--color-background)] rounded-lg p-3">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Clock className="w-4 h-4 text-[var(--color-text-secondary)]" />
                                        <span className="text-sm font-medium text-[var(--color-text-primary)]">Próxima Consulta Sugerida</span>
                                    </div>
                                    <div className="space-y-1 text-sm text-[var(--color-text-secondary)]">
                                        <div>Frequência: {getFrequencyLabel(user.frequency)}</div>
                                        {user.last_consultation && (
                                            <div>Última consulta: {user.last_consultation}</div>
                                        )}
                                        <div>
                                            Próxima sugerida: <span className="font-semibold">{user.next_consultation}</span>
                                        </div>
                                        {user.psychologist_name && (
                                            <div>Com: {user.psychologist_name}</div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>

            <ModalCreateUser 
                isOpen={isCreateUserModalOpen}
                onClose={() => {
                    setIsCreateUserModalOpen(false);
                    // Recarregar dados após fechar o modal
                    fetchUsers();
                }}
                userType="patient"
            />

            <ModalScheduleAppointment
                isOpen={isScheduleModalOpen}
                onClose={() => {
                    setIsScheduleModalOpen(false);
                    setSelectedPatient(null);
                    // Recarregar dados após fechar o modal
                    fetchUsers();
                }}
                patient={selectedPatient}
            />
        </div>
    );
}
