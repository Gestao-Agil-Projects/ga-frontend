import { Header } from "../../components/Header";
import { userStore } from "../../store/userStore";
import { LogOut, User as UserIcon, Mail, Calendar, Phone } from "lucide-react";

export function User() {
  const { user, userAccountData, setUser, setUserAccountData } = userStore();

  const handleLogout = () => {
    setUser(null);
    setUserAccountData(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                <UserIcon className="w-8 h-8 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {user?.full_name || 'Usuário'}
                </h1>
                <p className="text-gray-600">Bem-vindo ao Calm Mind</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 px-4 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Sair</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Informações Pessoais
              </h2>
              
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Mail className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="text-gray-900">{user?.email || 'Não informado'}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Phone className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Telefone</p>
                    <p className="text-gray-900">{user?.phone || 'Não informado'}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Calendar className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Data de Nascimento</p>
                    <p className="text-gray-900">
                      {user?.birth_date ? new Date(user.birth_date).toLocaleDateString('pt-BR') : 'Não informado'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Status da Conta
              </h2>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-600">Conta Ativa</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    user?.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {user?.is_active ? 'Ativa' : 'Inativa'}
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-600">Email Verificado</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    user?.is_verified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {user?.is_verified ? 'Verificado' : 'Pendente'}
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-600">Tipo de Usuário</span>
                  <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {user?.role === 'patient' ? 'Paciente' : user?.role || 'Usuário'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Próximos Passos
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
                <h3 className="font-medium text-gray-900 mb-2">Agendar Consulta</h3>
                <p className="text-sm text-gray-600">Encontre um profissional e agende sua consulta</p>
              </button>
              <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
                <h3 className="font-medium text-gray-900 mb-2">Histórico de Consultas</h3>
                <p className="text-sm text-gray-600">Visualize suas consultas anteriores</p>
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
