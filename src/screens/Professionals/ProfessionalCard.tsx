import { useState } from 'react';
import type { Professional } from './mockProfessionals';
import { Calendar } from 'lucide-react';
import ModalAppointment from '../../components/Modals/ModalAppointment';
import ModalLogin from '../../components/Modals/ModalLogin';
import { userStore } from '../../store/userStore';

export default function ProfessionalCard({ professional }: { professional: Professional }) {
  const { userAccountData } = userStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

  const handleScheduleClick = () => {
    // Se o usuário não estiver logado, abrir o modal de login
    if (!userAccountData) {
      setShowLoginModal(true);
      return;
    }
    
    // Usuário está logado: abrir modal de agendamento
    setIsModalOpen(true);
  };

  return (
  <article className="bg-white rounded-lg shadow-md border border-gray-100 p-6 flex flex-col h-full">
      <header className="flex items-start gap-4">
        <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">
          {professional.avatarUrl ? (
            <img src={professional.avatarUrl} alt={professional.name} className="w-full h-full object-cover" />
          ) : (
            <span className="text-gray-500 font-semibold">{professional.name.split(' ').map(n => n[0]).slice(0,2).join('')}</span>
          )}
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-gray-800 text-lg">{professional.name}</h3>
          <p className="text-sm text-gray-500">{professional.title}</p>
        </div>
      </header>

      <p className="text-sm text-gray-600 mt-4 line-clamp-4 flex-1">{professional.bio}</p>

      <div className="mt-4">
        <div className="flex flex-wrap gap-2 mb-3">
          {professional.specialties.slice(0,3).map((s, i) => (
            <span key={i} className="text-xs bg-gray-50 text-gray-700 px-3 py-1 rounded-full border border-gray-100">{s}</span>
          ))}
          {professional.specialties.length > 3 && (
            <span className="text-xs bg-gray-100 text-gray-600 px-3 py-1 rounded-full border border-gray-200">+{professional.specialties.length - 3}</span>
          )}
        </div>

        <p className="text-sm text-gray-500 mb-2">Horários disponíveis:</p>
        <div className="flex flex-wrap gap-2">
          {professional.times.slice(0,4).map((t, idx) => (
            <span key={idx} className="text-xs bg-primary-50 text-primary-600 px-3 py-1 rounded-full border border-primary-50">{t}</span>
          ))}
          {professional.times.length > 4 && (
            <span className="text-xs bg-gray-100 text-gray-600 px-3 py-1 rounded-full border border-gray-200">+{professional.times.length - 4}</span>
          )}
        </div>
      </div>

      <div className="mt-6">
        <button 
          className="w-full inline-flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg py-3 px-4 font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-primary-300" 
          type="button" 
          aria-label={`Agendar consulta com ${professional.name}`}
          onClick={handleScheduleClick}
        >
          <Calendar className="w-4 h-4" />
          <span>Agendar Consulta</span>
        </button>
      </div>

      {/* Modal de Login (quando usuário não autenticado) */}
      <ModalLogin
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
      />

      {/* Modal de Agendamento (quando usuário autenticado) */}
      <ModalAppointment
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        professionalName={professional.name}
        specialty={professional.specialties[0]}
      />
    </article>
  );
}
