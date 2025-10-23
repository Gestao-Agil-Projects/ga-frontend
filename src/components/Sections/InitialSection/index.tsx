import { Heart, Shield, Calendar, Users, Calendar as CalendarIcon } from "lucide-react";
import { CardHome } from "../../Cards/CardHome";

export function InitialSection() {
    return (
        <div className="bg-[#E9EEF4] flex flex-col items-center justify-center py-20 px-4">
            <div className="max-w-5xl mx-auto w-full">
                <div className="text-center mb-20">
                    <h1 className="text-5xl md:text-6xl font-bold text-[#4285F4] mb-8 leading-tight">
                        Sua mente em paz, nossa prioridade
                    </h1>
                    <p className="text-lg md:text-xl text-[#5F6368] mb-12 max-w-3xl mx-auto leading-relaxed">
                        Encontre o psicólogo ideal para sua jornada de bem-estar mental. Profissionais qualificados prontos para te acompanhar.
                    </p>
                    
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
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