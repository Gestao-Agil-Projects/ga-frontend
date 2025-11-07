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
    className = "w-full mt-6 text-white py-2 px-4 rounded-lg transition-colors text-sm bg-[var(--color-primary)] hover:bg-[var(--color-primary-light)]"
}: ButtonPrimaryProps) {
    return (
        <button
            onClick={onClick}
            className={`${className} ${
                disabled 
                    ? "bg-[var(--color-primary-lighter)] cursor-not-allowed opacity-70"
                    : "bg-[var(--color-primary)]"
            }`}
        >
            {children}
        </button>
    );
}