import { Heart, Shield, Calendar, Users } from "lucide-react";
import { CardHome } from "../../Cards/CardHome";
import { useNavigate } from "react-router-dom";

export function InitialSection() {
    const navigate = useNavigate();

    const handleViewProfessionals = () => {
        const el = document.getElementById('professionals-section');
        if (el) {
            const headerHeight = document.querySelector('header')?.clientHeight ?? 0;
            const top = window.scrollY + el.getBoundingClientRect().top - headerHeight - 12;
            window.scrollTo({ top, behavior: 'smooth' });
        } else {
            navigate('/professionals');
        }
    };

    return (
    <div className="bg-gradient-to-b from-primary-600 to-primary-400 flex flex-col items-center justify-center py-28 px-4">
            <div className="max-w-6xl mx-auto w-full">
                <div className="text-center mb-14">
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-6 leading-tight">
                        Sua mente em paz, nossa prioridade
                    </h1>
                    <p className="text-base md:text-lg text-white/90 mb-8 max-w-3xl mx-auto leading-relaxed">
                        Encontre o psicólogo ideal para sua jornada de bem-estar mental. Profissionais qualificados prontos para te acompanhar.
                    </p>

                    <div className="flex items-center justify-center gap-4">
                        <button
                            onClick={handleViewProfessionals}
                            className="inline-flex items-center gap-3 bg-white text-primary-700 px-6 py-3 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-primary-300"
                            aria-label="Ver Profissionais"
                        >
                            <Users className="w-5 h-5" />
                            <span className="font-medium">Ver Profissionais</span>
                        </button>
                        <button
                            onClick={() => navigate('/professionals')}
                            className="inline-flex items-center gap-3 bg-transparent border border-white text-white px-5 py-3 rounded-lg hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/40"
                            aria-label="Agendar Consulta"
                        >
                            <Calendar className="w-5 h-5" />
                            <span className="font-medium">Agendar Consulta</span>
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-10">
                    <CardHome 
                        title="Cuidado Personalizado" 
                        description="Cada profissional oferece abordagens específicas para suas necessidades únicas."
                        icon={<Heart className="w-6 h-6" />} 
                    />
                    <CardHome 
                        title="Profissionais Verificados" 
                        description="Todos os psicólogos são registrados no CRP e possuem especializações comprovadas."
                        icon={<Shield className="w-6 h-6" />} 
                    />
                    <CardHome 
                        title="Agendamento Fácil" 
                        description="Sistema simples e rápido para marcar sua consulta no horário mais conveniente."
                        icon={<Calendar className="w-6 h-6" />} 
                    />
                </div>
            </div>
        </div>
    );
}