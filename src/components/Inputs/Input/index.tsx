interface InputProps {
    type: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    placeholder: string;
    label?: string;
    required?: boolean;
    className?: string;
}

export default function Input({ 
    type, 
    value, 
    onChange, 
    placeholder, 
    label,
    required = false,
    className = "w-full px-4 py-1 border border-gray-300 rounded-lg focus:outline-none bg-white placeholder:text-sm"
}: InputProps) {
    return (
        <div>
            {label && (
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    {label}
                    {required && <span className="text-gray-700 ml-1">*</span>}
                </label>
            )}
            <input
                type={type}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className={className}
            />
        </div>
    );
}
