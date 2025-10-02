import { Header } from "../../components/Header";
import { AppointmentManagement } from "../../components/AppointmentManagement";

export function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <AppointmentManagement />
      </main>
    </div>
  );
}
