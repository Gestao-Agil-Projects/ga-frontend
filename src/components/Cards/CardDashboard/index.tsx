import { type ReactNode } from "react";

interface CardDashboardProps {
    title: string;
    value: string | number;
    icon: ReactNode;
    color: string;
}

export function CardDashboard({ title, value, icon, color }: CardDashboardProps) {
    return (
        <div className="bg-[var(--color-surface)] rounded-xl shadow-sm border border-[var(--color-border)] p-4 flex-1">
            <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-[var(--color-text-secondary)]">{title}</h3>
                <div className={`${color}`}>
                    {icon}
                </div>
            </div>
            <div className={`text-2xl font-semibold ${color}`}>
                {value}
            </div>
        </div>
    );
}
