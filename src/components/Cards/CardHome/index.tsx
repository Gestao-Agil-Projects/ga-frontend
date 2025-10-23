interface CardHomeProps {
    title: string;
    description: string;
    icon: React.ReactNode;
}

export function CardHome({ 
    title, 
    description, 
    icon 
}: CardHomeProps) {
    return (
        <div className="bg-white rounded-lg shadow-lg p-8 flex flex-col items-center text-center h-full">
            <div className="mb-6">
                <div className="text-[#4285F4]">
                    {icon}
                </div>
            </div>
            
            <h3 className="text-lg font-bold text-[#4285F4] mb-4">
                {title}
            </h3>
            
            <p className="text-sm text-[#5F6368] leading-relaxed">
                {description}
            </p>
        </div>
    );
}