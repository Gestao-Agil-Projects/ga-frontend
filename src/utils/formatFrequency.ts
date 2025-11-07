/**
 * Formata a frequência retornada pela API para exibição em português
 * @param frequency - Frequência retornada pela API (monthly, weekly, biweekly, etc.)
 * @returns String formatada em português
 */
export const formatFrequency = (frequency: string | undefined | null): string => {
    if (!frequency) {
        return "Conforme necessidade";
    }

    const frequencyMap: Record<string, string> = {
        "monthly": "Mensal",
        "weekly": "Semanal",
        "biweekly": "Quinzenal",
        "as_needed": "Conforme necessidade",
        "daily": "Diária",
    };

    return frequencyMap[frequency.toLowerCase()] || "Conforme necessidade";
};

