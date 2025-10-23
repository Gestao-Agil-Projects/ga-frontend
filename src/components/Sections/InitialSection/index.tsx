import { User } from "lucide-react";
import { CardHome } from "../../Cards/CardHome";

export function InitialSection() {
    return (
        <div className="bg-[#DBE1E7] flex flex-col items-center justify-center py-10">
            <div>
                <h1 className="text-center text-4xl md:text-6xl text-primary mb-6">
                    Sua mente em paz, nossa prioridade
                </h1>
                <div className="px-96">
                    <p className="text-center text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
                        Encontre o psicólogo ideal para sua jornada de bem-estar mental. Profissionais qualificados prontos para te acompanhar.
                    </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 px-10">
                    <CardHome 
                        title="Cuidado Personalizado" 
                        description="Cada profissional oferece abordagens específicas para suas necessidades únicas."
                        icon={<User className="w-4 h-4" />} 
                    />
                    <CardHome 
                        title="Cuidado Personalizado" 
                        description="Cada profissional oferece abordagens específicas para suas necessidades únicas."
                        icon={<User className="w-4 h-4" />} 
                    />
                    <CardHome 
                        title="Cuidado Personalizado" 
                        description="Cada profissional oferece abordagens específicas para suas necessidades únicas."
                        icon={<User className="w-4 h-4" />} 
                    />
                    
                </div>
            </div>
            
        </div>
    );
}