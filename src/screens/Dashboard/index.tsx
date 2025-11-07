import { useState } from "react";
import { Users, Calendar, Settings, User, UserPlus, Shield } from "lucide-react";
import { Header } from "../../components/Header";
import { AppointmentManagement } from "../../components/AppointmentManagement";
import { ManagePsychologists } from "../../components/ManagePsychologists";
import { ManageUsers } from "../../components/ManageUsers";
import { CardDashboard } from "../../components/Cards/CardDashboard";
import TabBar from "../../components/TabBar";

export function Dashboard() {
  const [activeTab, setActiveTab] = useState<string>("agenda");

  const dashboardTabs = [
    { id: "agenda", label: "Agenda Geral", icon: <Calendar className="w-4 h-4" /> },
    { id: "psicologos", label: "Gerenciar Psicólogos", icon: <Users className="w-4 h-4" /> },
    { id: "usuarios", label: "Visualizar Usuários", icon: <User className="w-4 h-4" /> }
  ];

  return (
    <div className="min-h-screen bg-[var(--color-background)] text-[var(--color-text-primary)]">
      <Header />
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-[var(--color-primary)] mb-2">Dashboard Administrativo</h1>
              <p className="text-sm text-[var(--color-text-secondary)]">Gerencie psicólogos e agendamentos</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <CardDashboard
            title="Total de Usuários"
            value="4"
            icon={<User className="w-4 h-4" />}
            color="text-[var(--color-primary)]"
          />
          <CardDashboard
            title="Pacientes"
            value="3"
            icon={<UserPlus className="w-4 h-4" />}
            color="text-[var(--color-primary-light)]"
          />
          <CardDashboard
            title="Administrativos"
            value="1"
            icon={<Shield className="w-4 h-4" />}
            color="text-[var(--color-primary-lighter)]"
          />
          <CardDashboard
            title="Consultas Hoje"
            value="7"
            icon={<Calendar className="w-4 h-4" />}
            color="text-[var(--color-primary)]"
          />
        </div>

        <TabBar 
          tabs={dashboardTabs}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          className="mb-6"
          activeTabClassName="text-[var(--color-primary)] font-semibold"
          inactiveTabClassName="text-[var(--color-text-secondary)] hover:text-[var(--color-primary)]"
          indicatorClassName="bg-[var(--color-surface)] shadow-sm border border-[var(--color-primary-lighter)]"
        />

        {activeTab === "agenda" ? (
          <AppointmentManagement />
        ) : activeTab === "psicologos" ? (
          <ManagePsychologists />
        ) : (
          <ManageUsers />
        )}
      </main>
    </div>
  );
}
