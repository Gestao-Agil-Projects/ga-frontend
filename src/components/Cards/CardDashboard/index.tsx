import { type ReactNode } from "react";

interface CardDashboardProps {
    title: string;
    value: string | number;
    icon: ReactNode;
    color: string;
}

export function CardDashboard({ title, value, icon, color }: CardDashboardProps) {
    return (
        <div className="bg-white rounded-lg shadow-sm border p-4 flex-1">
            <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-gray-700">{title}</h3>
                <div className={`${color}`}>
                    {icon}
                </div>
            </div>
            <div className={`text-2xl ${color}`}>
                {value}
            </div>
        </div>
    );
}
