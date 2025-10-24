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
        <div className="bg-gradient-to-br from-[#eaf0f6] to-[#f3f6f9] flex flex-col items-center justify-center py-24 px-4">
            <div className="max-w-5xl mx-auto w-full">
                <div className="text-center mb-12">
                    <h1 className="text-5xl md:text-6xl font-bold text-[#2F7CD1] mb-6 leading-tight">
                        Sua mente em paz, nossa prioridade
                    </h1>
                    <p className="text-lg md:text-xl text-[#6B7280] mb-8 max-w-3xl mx-auto leading-relaxed">
                        Encontre o psicólogo ideal para sua jornada de bem-estar mental. Profissionais qualificados prontos para te acompanhar.
                    </p>

                    <div className="flex items-center justify-center gap-4">
                        <button
                            onClick={handleViewProfessionals}
                            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-md shadow-md"
                            aria-label="Ver Profissionais"
                        >
                            <Users className="w-5 h-5" />
                            <span>Ver Profissionais</span>
                        </button>
                        <button
                            onClick={() => navigate('/professionals')}
                            className="inline-flex items-center gap-2 bg-white border border-slate-200 text-gray-700 px-5 py-3 rounded-md hover:shadow-sm"
                            aria-label="Agendar Consulta"
                        >
                            <Calendar className="w-5 h-5" />
                            <span>Agendar Consulta</span>
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
                    <CardHome 
                        title="Cuidado Personalizado" 
                        description="Cada profissional oferece abordagens específicas para suas necessidades únicas."
                        icon={<Heart className="w-8 h-8" />} 
                    />
                    <CardHome 
                        title="Profissionais Verificados" 
                        description="Todos os psicólogos são registrados no CRP e possuem especializações comprovadas."
                        icon={<Shield className="w-8 h-8" />} 
                    />
                    <CardHome 
                        title="Agendamento Fácil" 
                        description="Sistema simples e rápido para marcar sua consulta no horário mais conveniente."
                        icon={<Calendar className="w-8 h-8" />} 
                    />
                </div>
            </div>
        </div>
    );
}