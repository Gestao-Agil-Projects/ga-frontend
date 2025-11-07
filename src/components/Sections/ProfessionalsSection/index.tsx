import { useState } from "react";
import { CardProfessionalHome } from "../../Cards/CardProfessionalHome";
import { Search, Filter } from "lucide-react";

export function ProfessionalsSection() {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedSpecialty, setSelectedSpecialty] = useState("all");

    // Dados mockados - depois você pode buscar da API
    const professionals = [
        {
            id: "1",
            name: "Dra. Ana Silva",
            specialty: "Psicologia Clínica e Terapia Cognitiva",
            bio: "Especialista em ansiedade, depressão e melhoramento pessoal. Atendimento humanizado e acolhedor.",
            availableSlots: ["09:00", "10:00", "14:00", "+2"],
            imageUrl: ""
        },
        {
            id: "2",
            name: "Dr. Carlos Mendes",
            specialty: "Psicologia Organizacional",
            bio: "Focado no desenvolvimento de carreira, intensa e gestão de equipes. Experiência em grandes empresas.",
            availableSlots: ["08:00", "09:00", "10:00", "+1"],
            imageUrl: ""
        },
        {
            id: "3",
            name: "Dra. Mariana Costa",
            specialty: "Psicologia Infantil e Adolescente",
            bio: "Trabalho com crianças, adolescentes e suas famílias e questões. Utilizo técnicas lúdicas e adaptadas para cada faixa etária.",
            availableSlots: ["14:00", "15:00", "16:00", "+3"],
            imageUrl: ""
        },
        {
            id: "4",
            name: "Dr. João Santos",
            specialty: "Avaliação e reabilitação neuropsicológica",
            bio: "Avaliação e reabilitação neuropsicológica. Especialista em distúrbios cognitivos e neurológicos.",
            availableSlots: ["08:00", "09:00", "11:00", "+1"],
            imageUrl: ""
        },
        {
            id: "5",
            name: "Dra. Lucia Oliveira",
            specialty: "Terapia de Casal e Família",
            bio: "Especialista em terapia sistêmica familiar e de casal. Foco na comunicação e resolução de conflitos.",
            availableSlots: ["10:00", "11:00", "15:00", "+2"],
            imageUrl: ""
        },
        {
            id: "6",
            name: "Dr. Pedro Almeida",
            specialty: "Psicologia do Esporte",
            bio: "Psicólogo especializado em performance esportiva, motivação e preparação mental para atletas.",
            availableSlots: ["07:00", "08:00", "16:00", "+1"],
            imageUrl: ""
        }
    ];

    const handleSchedule = (professionalId: string) => {
        console.log("Agendar consulta com:", professionalId);
        // Aqui você pode abrir um modal de agendamento
    };

    return (
        <section className="bg-[#EBEBEB] py-16 px-4">
            <div className="max-w-6xl mx-auto">
                {/* Título da seção */}
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-semibold text-[#018DAE] mb-4">
                        Nossos Profissionais
                    </h2>
                    <p className="text-[#545454] text-lg max-w-2xl mx-auto">
                        Conecte-se com psicólogos especializados e qualificados. Encontre o profissional ideal para suas necessidades.
                    </p>
                </div>

                {/* Barra de busca e filtro */}
                <div className="flex flex-col md:flex-row gap-4 mb-8">
                    <div className="flex-1 relative">
                        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#545454] w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Buscar por nome ou especialização..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 rounded-lg border border-[#D9D9D9] focus:outline-none focus:ring-2 focus:ring-[#018DAE] focus:border-transparent"
                        />
                    </div>
                    <div className="relative md:w-64">
                        <Filter className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#545454] w-5 h-5" />
                        <select
                            value={selectedSpecialty}
                            onChange={(e) => setSelectedSpecialty(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 rounded-lg border border-[#D9D9D9] focus:outline-none focus:ring-2 focus:ring-[#018DAE] focus:border-transparent appearance-none cursor-pointer"
                        >
                            <option value="all">Todas as especializações</option>
                            <option value="clinica">Psicologia Clínica</option>
                            <option value="organizacional">Psicologia Organizacional</option>
                            <option value="infantil">Psicologia Infantil</option>
                            <option value="neuropsicologia">Neuropsicologia</option>
                            <option value="casal">Terapia de Casal</option>
                            <option value="esporte">Psicologia do Esporte</option>
                        </select>
                    </div>
                </div>

                {/* Grid de profissionais */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {professionals.map((professional) => (
                        <CardProfessionalHome
                            key={professional.id}
                            name={professional.name}
                            specialty={professional.specialty}
                            bio={professional.bio}
                            availableSlots={professional.availableSlots}
                            imageUrl={professional.imageUrl}
                            onSchedule={() => handleSchedule(professional.id)}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}
