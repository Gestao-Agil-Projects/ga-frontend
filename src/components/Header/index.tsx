import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, User, LogOut } from "lucide-react";
import ModalLogin from "../Modals/ModalLogin";
import { useState } from "react";
import MobileMenu from "../Mobile/Menu";
import { userStore } from "../../store/userStore";

const navigationLinks = [
  {
    to: "/",
    label: "Início"
  },
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
  const { user, userAccountData, setUser, setUserAccountData } = userStore();

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

  const handleLogout = () => {
    setUser(null);
    setUserAccountData(null);
    navigate('/');
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const linkClasses = (path: string) => {
    const baseClasses = "text-gray-600 hover:text-primary transition-colors px-3 py-2 rounded-md text-sm font-medium";
    const activeClasses = isActive(path)
      ? "text-primary" 
      : "text-gray-700 hover:text-primary";
    
    return `${baseClasses} ${activeClasses}`;
  };

  const isLoggedIn = userAccountData?.access_token;

  return (
    <>
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link to="/" className="text-2xl text-blue-600">
                Calm Mind
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
              {isLoggedIn ? (
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <User className="w-5 h-5 text-blue-600" />
                    <button 
                      onClick={handleUserButtonClick}
                      className="text-gray-700 hover:text-blue-600 font-medium"
                    >
                      {user?.full_name || userAccountData?.email || 'João Silva'}
                    </button>
                  </div>
                  <button 
                    onClick={handleLogout}
                    className="flex items-center space-x-2 px-3 py-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-md text-sm font-medium transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sair</span>
                  </button>
                </div>
              ) : (
                <button 
                  onClick={handleOpenModal}
                  className="bg-gray-100 text-gray-700 hover:bg-gray-200 flex items-center gap-2 transition-colors px-4 py-2 rounded-md text-sm font-medium"
                >
                  <User className="w-4 h-4" />
                  <span>Login</span>
                </button>
              )}
            </div>

            <div className="lg:hidden">
              <button
                onClick={handleOpenMobileMenu}
                className="text-gray-600 hover:text-primary transition-colors p-2"
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
