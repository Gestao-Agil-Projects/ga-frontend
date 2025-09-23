interface ButtonPrimaryProps {
    onClick: () => void;
    children: React.ReactNode;
    disabled?: boolean;
    className?: string;
}

export default function ButtonPrimary({ 
    onClick, 
    children, 
    disabled = false,
    className = "w-full mt-6 bg-primary hover:bg-blue-400 text-white py-2 px-4 rounded-md transition-colors text-sm"
}: ButtonPrimaryProps) {
    return (
        <button
            onClick={onClick}
            className={`${className} ${
                disabled 
                    ? "bg-blue-200 cursor-not-allowed opacity-60"
                    : "bg-primary"
            }`}
        >
            {children}
        </button>
    );
}