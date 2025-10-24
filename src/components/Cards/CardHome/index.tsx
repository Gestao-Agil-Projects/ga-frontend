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
            <div className="mb-5 flex items-center justify-center w-12 h-12 rounded-full bg-primary-50 text-primary">
                {icon}
            </div>

            <h3 className="text-lg font-semibold text-primary mb-3">
                {title}
            </h3>

            <p className="text-sm text-neutral-19 leading-relaxed">
                {description}
            </p>
        </div>
    );
}