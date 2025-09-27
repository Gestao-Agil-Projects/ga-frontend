import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, User, } from "lucide-react";
import ModalLogin from "../Modals/ModalLogin";
import { useState } from "react";
import MobileMenu from "../Mobile/Menu";
import { userStore } from "../../store/userStore";

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

export function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { userAccountData } = userStore();

  const handleOpenMobileMenu = () => {
    setIsMobileMenuOpen(true);
  };

  const handleCloseMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleUserButtonClick = () => {
    if (isLoggedIn) {
      navigate('/user');
    } else {
      handleOpenModal();
    }
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const linkClasses = (path: string) => {
    const className = "text-gray-600 hover:text-primary transition-colors px-3 py-2 rounded-md text-sm font-medium";
    const activeClasses = isActive(path)
      ? "text-primary bg-gray-100" 
      : "text-gray-700 hover:text-primary hover:bg-gray-100";
    
    return `${className} ${activeClasses}`;
  };

  const isLoggedIn = userAccountData?.access_token;

  return (
    <>
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link to="/">
                <h1 className="text-primary">
                  Calm Mind
                </h1>
              </Link>
            </div>
            
            <nav className="hidden md:flex items-center space-x-8">
              {navigationLinks.map((link) => (
                <Link 
                  key={link.to}
                  to={link.to} 
                  className={linkClasses(link.to)}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            <div className="hidden lg:flex space-x-4 items-center">
              <button 
                onClick={handleUserButtonClick}
                className="border border-neutral-10 bg-neutral-09 text-black flex flex-row items-center gap-2 transition-colors px-3 py-2 rounded-md text-sm font-medium hover:bg-neutral-11"
              >
                <User className="w-4 h-4" />
                <span>{isLoggedIn ? 'Usuário' : 'Login'}</span>
              </button>
            </div>

            <div className="lg:hidden">
              <button
                onClick={handleOpenMobileMenu}
                className="text-neutral-12 hover:text-primary transition-colors p-2"
              >
                <Menu className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <MobileMenu 
        isOpen={isMobileMenuOpen}
        onClose={handleCloseMobileMenu}
        onLoginClick={handleOpenModal}
      />

      <ModalLogin
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </>
  );
}
