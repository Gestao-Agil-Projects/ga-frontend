import { useState } from "react";
import { Users, UserCheck, Calendar, UserX, Settings } from "lucide-react";
import { Header } from "../../components/Header";
import { AppointmentManagement } from "../../components/AppointmentManagement";
import { ManagePsychologists } from "../../components/ManagePsychologists";
import { CardDashboard } from "../../components/CardDashboard";
import TabBar from "../../components/TabBar";

export function Dashboard() {
  const [activeTab, setActiveTab] = useState<string>("agenda");

  const dashboardTabs = [
    { id: "agenda", label: "Agenda Geral" },
    { id: "psicologos", label: "Gerenciar Psicólogos" }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl text-blue-600 mb-2">Dashboard Administrativo</h1>
              <p className="text-gray-600 text-sm">Gerencie psicólogos e agendamentos</p>
            </div>
            <div className="flex items-center gap-2">
              <Settings className="w-4 h-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-900">Calm Mind Admin</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <CardDashboard
            title="Total de Psicólogos"
            value="3"
            icon={<Users className="w-4 h-4" />}
            color="text-blue-600"
          />
          <CardDashboard
            title="Profissionais Ativos"
            value="2"
            icon={<UserCheck className="w-4 h-4" />}
            color="text-green-600"
          />
          <CardDashboard
            title="Consultas Hoje"
            value="7"
            icon={<Calendar className="w-4 h-4" />}
            color="text-blue-600"
          />
          <CardDashboard
            title="Profissionais Bloqueados"
            value="1"
            icon={<UserX className="w-4 h-4" />}
            color="text-red-600"
          />
        </div>

        <TabBar 
          tabs={dashboardTabs}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          className="mb-6"
        />

        {activeTab === "agenda" ? (
          <AppointmentManagement />
        ) : (
          <ManagePsychologists />
        )}
      </main>
    </div>
  );
}
