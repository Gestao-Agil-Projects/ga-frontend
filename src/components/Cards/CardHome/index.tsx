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
        <div className="bg-white rounded-lg shadow-sm border p-6 flex flex-col items-center justify-center">
            <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="text-sm w-6 h-6 font-medium text-primary">
                    {icon}
                </span>
            </div>
            <div className="">
                <p className="mb-4 text-center text-sm font-medium text-gray-700">
                    {title}
                </p>
                <h3 className="h-20 w-52 text-center text-sm font-medium text-gray-700">
                    {description}
                </h3>
            </div>
        </div>
    );
}