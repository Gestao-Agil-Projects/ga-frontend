// Utilitário para formatação de especialidades
export const formatSpecialities = (specialities: Array<{ id: string; title: string }> | undefined | null): string => {
    if (!specialities || specialities.length === 0) {
        return "Especialidade não definida";
    }
    
    // Capitalizar primeira letra de cada especialidade
    const specialityTitles = specialities.map(s => 
        s.title.charAt(0).toUpperCase() + s.title.slice(1).toLowerCase()
    );
    
    if (specialityTitles.length === 1) {
        return `Especialidade: ${specialityTitles[0]}`;
    } else {
        return `Especialidades: ${specialityTitles.join(", ")}`;
    }
};

// Exemplos de uso:
// formatSpecialities([]) → "Especialidade não definida"
// formatSpecialities([{id: "1", title: "terapia de casal"}]) → "Especialidade: Terapia de casal"
// formatSpecialities([{id: "1", title: "terapia de casal"}, {id: "2", title: "neuropsicologia"}]) → "Especialidades: Terapia de casal, Neuropsicologia"
