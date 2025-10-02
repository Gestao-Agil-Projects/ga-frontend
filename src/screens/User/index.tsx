import { Header } from "../../components/Header";
import { userStore } from "../../store/userStore";
import { Calendar, User as UserIcon, Mail, Phone, Edit } from "lucide-react";

export function User() {
  const { user, userAccountData } = userStore();

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-2xl font-bold text-blue-600">
                  {user?.full_name ? user.full_name.charAt(0).toUpperCase() : 'JS'}
                </span>
              </div>
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
              <div className="flex items-center space-x-2 mb-2">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-sm font-bold text-blue-600">
                    {user?.full_name ? user.full_name.charAt(0).toUpperCase() : 'JS'}
                  </span>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">
                    {user?.full_name || 'João Silva'}
                  </p>
                  <p className="text-sm text-gray-500">
                    {user?.email || userAccountData?.email || 'joao@email.com'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-center space-x-2 mb-6">
                <Calendar className="w-5 h-5 text-blue-600" />
                <h2 className="text-xl font-semibold text-gray-900">
                  Próximas Consultas
                </h2>
              </div>
              <p className="text-gray-600 mb-6">
                Suas consultas agendadas nos próximos dias
              </p>

              <div className="space-y-4">
                <div className="border rounded-lg p-4">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                      <UserIcon className="w-6 h-6 text-gray-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-gray-900">Dra. Ana Silva</h3>
                        <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                          Confirmada
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">Ansiedade e Depressão</p>
                      <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                        <span>📅 terça-feira, 21 de janeiro de 2025</span>
                        <span>🕘 09:00</span>
                      </div>
                      <p className="text-sm text-gray-500 italic mt-1">Primeira consulta</p>
                      <div className="flex space-x-2 mt-3">
                        <button className="px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded hover:bg-gray-200">
                          Reagendar
                        </button>
                        <button className="px-3 py-1 bg-red-100 text-red-700 text-xs rounded hover:bg-red-200">
                          Cancelar
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border rounded-lg p-4">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                      <UserIcon className="w-6 h-6 text-gray-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-gray-900">Dr. Carlos Mendes</h3>
                        <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full">
                          Pendente
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">Terapia Cognitivo Comportamental</p>
                      <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                        <span>📅 terça-feira, 28 de janeiro de 2025</span>
                        <span>🕘 10:30</span>
                      </div>
                      <p className="text-sm text-gray-500 italic mt-1">Sessão de acompanhamento</p>
                      <div className="flex space-x-2 mt-3">
                        <button className="px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded hover:bg-gray-200">
                          Reagendar
                        </button>
                        <button className="px-3 py-1 bg-red-100 text-red-700 text-xs rounded hover:bg-red-200">
                          Cancelar
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border rounded-lg p-4">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                      <UserIcon className="w-6 h-6 text-gray-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-gray-900">Dra. Ana Silva</h3>
                        <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                          Confirmada
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">Ansiedade e Depressão</p>
                      <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                        <span>📅 terça-feira, 4 de fevereiro de 2025</span>
                        <span>🕘 14:00</span>
                      </div>
                      <div className="flex space-x-2 mt-3">
                        <button className="px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded hover:bg-gray-200">
                          Reagendar
                        </button>
                        <button className="px-3 py-1 bg-red-100 text-red-700 text-xs rounded hover:bg-red-200">
                          Cancelar
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-2">
                  <UserIcon className="w-5 h-5 text-blue-600" />
                  <h2 className="text-xl font-semibold text-gray-900">
                    Dados Pessoais
                  </h2>
                </div>
                <button className="text-blue-600 hover:text-blue-700">
                  <Edit className="w-4 h-4" />
                </button>
              </div>
              <p className="text-gray-600 mb-6">
                Mantenha suas informações atualizadas
              </p>

              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-sm font-bold text-blue-600">JS</span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Nome Completo</p>
                    <p className="font-medium text-gray-900">
                      {user?.full_name || 'João Silva'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Mail className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">E-mail</p>
                    <p className="text-gray-900">
                      {user?.email || userAccountData?.email || 'joao@email.com'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Phone className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Telefone</p>
                    <p className="text-gray-900">
                      {user?.phone || '(11) 99999-9999'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Calendar className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Data de Nascimento</p>
                    <p className="text-gray-900">
                      {user?.birth_date ? new Date(user.birth_date).toLocaleDateString('pt-BR') : '14/05/1990'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="w-5 h-5 flex items-center justify-center">
                    <span className="text-xs">💚</span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Frequência Preferida</p>
                    <p className="text-gray-900">Quinzenal</p>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t">
                  <p className="text-sm text-gray-500 mb-2">Observações</p>
                  <p className="text-sm text-gray-700">
                    Prefere sessões no período da manhã. Ansiedade relacionada ao trabalho.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
