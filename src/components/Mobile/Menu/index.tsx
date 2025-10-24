import { Link, useLocation, useNavigate } from "react-router-dom";
import { User, X } from "lucide-react";
import { userStore } from "../../../store/userStore";

interface MobileMenuProps {
    isOpen: boolean;
    onClose: () => void;
    onLoginClick: () => void;
}

const navigationLinks = [
    {
        to: "/professionals",
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
    const navigate = useNavigate();
    const { userAccountData, setUser, setUserAccountData } = userStore();

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

    const handleUserClick = () => {
        if (isLoggedIn) {
            navigate('/user');
        } else {
            onLoginClick();
        }
        onClose();
    };

    const handleLogout = () => {
        setUser(null);
        setUserAccountData(null);
        onClose();
    };

    const isLoggedIn = userAccountData?.access_token;

    if (!isOpen) return null;

    return (
        <>
            <div 
                className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
                onClick={onClose}
            />
            
            <div className="fixed top-0 right-0 h-full w-80 bg-white shadow-xl z-50 lg:hidden transform transition-transform duration-300 ease-in-out">
                <div className="flex justify-between items-center p-4 border-b">
                    <h2 className="text-lg font-semibold text-neutral-18">
                        Menu
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-neutral-12 transition-colors"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <nav className="py-4">
                        {navigationLinks.map((link) => {
                            if (link.to === '/professionals') {
                                return (
                                    <button
                                        key={link.to}
                                        onClick={() => {
                                                    if (location.pathname === '/') {
                                                        const el = document.getElementById('professionals-section');
                                                        if (el) {
                                                            const headerHeight = document.querySelector('header')?.clientHeight ?? 0;
                                                            const top = window.scrollY + el.getBoundingClientRect().top - headerHeight - 12;
                                                            window.scrollTo({ top, behavior: 'smooth' });
                                                        }
                                                        onClose();
                                                    } else {
                                                        navigate('/professionals');
                                                        onClose();
                                                    }
                                                }}
                                        className={getLinkClasses(link.to)}
                                    >
                                        {link.label}
                                    </button>
                                );
                            }

                            return (
                                <Link 
                                    key={link.to}
                                    to={link.to} 
                                    className={getLinkClasses(link.to)}
                                    onClick={onClose}
                                >
                                    {link.label}
                                </Link>
                            );
                        })}
                </nav>

                <div className="p-4 border-t space-y-3">
                    {isLoggedIn ? (
                        <>
                            <button 
                                onClick={() => {
                                    navigate('/user');
                                    onClose();
                                }}
                                className="w-full border border-neutral-10 bg-white text-black flex flex-row items-center justify-center gap-2 transition-colors px-4 py-3 rounded-md text-sm font-medium hover:bg-neutral-11"
                            >
                                <User className="w-4 h-4" />
                                <span>Meu Perfil</span>
                            </button>
                            
                            <button 
                                onClick={handleLogout}
                                className="w-full border border-neutral-25 bg-white text-error-11 flex flex-row items-center justify-center gap-2 transition-colors px-4 py-3 rounded-md text-sm font-medium hover:bg-neutral-24"
                            >
                                <span>Sair</span>
                            </button>
                        </>
                    ) : (
                        <button 
                            onClick={handleUserClick}
                            className="w-full border border-neutral-10 bg-white text-black flex flex-row items-center justify-center gap-2 transition-colors px-4 py-3 rounded-md text-sm font-medium hover:bg-neutral-11"
                        >
                            <User className="w-4 h-4" />
                            <span>Login</span>
                        </button>
                    )}
                </div>
            </div>
        </>
    );
}
