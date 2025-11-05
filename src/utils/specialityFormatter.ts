export const formatSpecialities = (specialities: Array<{ id: string; title: string }> | undefined | null): string => {
    if (!specialities || specialities.length === 0) {
        return "Especialidade não definida";
    }
    
    const specialityTitles = specialities.map(s => {
        return s.title.charAt(0).toUpperCase() + s.title.slice(1).toLowerCase();
    });
    
    
    if (specialityTitles.length === 1) {
        const result = `Especialidade: ${specialityTitles[0]}`;
        return result;
    } else {
        const result = `Especialidades: ${specialityTitles.join(", ")}`;

        return result;
    }
};
