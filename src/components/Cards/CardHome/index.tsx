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
            <div className="bg-GRAY2 w-[42px] h-[42px] mb-6 flex items-center justify-center rounded-[8.75px]">
                <div className="text-BLUE">
                    {icon}
                </div>
            </div>
            
            <h3 className="text-lg font-bold text-BLUE mb-4">
                {title}
            </h3>
            
            <p className="text-sm text-black leading-relaxed">
                {description}
            </p>
        </div>
    );
}