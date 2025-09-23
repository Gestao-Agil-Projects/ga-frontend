import { Link, useLocation } from "react-router-dom";
import { User, X } from 'lucide-react';
import { useState } from 'react';

interface MobileMenuProps {
    isOpen: boolean;
    onClose: () => void;
    onLoginClick: () => void;
}

const navigationLinks = [
    {
        to: "/",
        label: "Profissionais"
    },
    {
        to: "/about", 
        label: "Sobre"
    },
    {
        to: "/contact",
        label: "Contato"
    }
];

export default function MobileMenu({ isOpen, onClose, onLoginClick }: MobileMenuProps) {
    const location = useLocation();

    const isActive = (path: string) => {
        return location.pathname === path;
    };

    const getLinkClasses = (path: string) => {
        const baseClasses = "block px-4 py-3 text-base font-medium transition-colors";
        const activeClasses = isActive(path) 
            ? "text-primary bg-gray-100" 
            : "text-gray-700 hover:text-primary hover:bg-gray-50";
        
        return `${baseClasses} ${activeClasses}`;
    };

    if (!isOpen) return null;

    return (
        <>
            <div 
                className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
                onClick={onClose}
            />
            
            <div className="fixed top-0 right-0 h-full w-80 bg-white shadow-xl z-50 lg:hidden transform transition-transform duration-300 ease-in-out">
                <div className="flex justify-between items-center p-4 border-b">
                    <h2 className="text-lg font-semibold text-gray-800">
                        Menu
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <nav className="py-4">
                    {navigationLinks.map((link) => (
                        <Link 
                            key={link.to}
                            to={link.to} 
                            className={getLinkClasses(link.to)}
                            onClick={onClose}
                        >
                            {link.label}
                        </Link>
                    ))}
                </nav>

                <div className="p-4 border-t">
                    <button 
                        onClick={() => {
                            onLoginClick();
                            onClose();
                        }}
                        className="w-full border border-gray-300 bg-white text-black flex flex-row items-center justify-center gap-2 transition-colors px-4 py-3 rounded-md text-sm font-medium hover:bg-gray-50"
                    >
                        <User className="w-4 h-4" />
                        <span>Login</span>
                    </button>
                </div>
            </div>
        </>
    );
}