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
        <div className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center text-center h-full">
            <div className="mb-5 flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-br from-primary-100 to-primary-400 text-white">
                {icon}
            </div>

            <h3 className="text-lg font-semibold text-primary-400 mb-3">
                {title}
            </h3>

            <p className="text-sm text-neutral-19 leading-relaxed">
                {description}
            </p>
        </div>
    );
}