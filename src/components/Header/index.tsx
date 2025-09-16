import { Link, useLocation } from "react-router-dom";

export function Header() {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <header className="bg-white shadow-md border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/" className="text-xl font-bold text-gray-900">
              GA Frontend
            </Link>
          </div>
          
          <nav className="flex space-x-8">
            <Link
              to="/about"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive("/about")
                  ? "bg-primary text-white"
                  : "text-gray-700 hover:text-primary hover:bg-gray-100"
              }`}
            >
              Sobre
            </Link>
            <Link
              to="/contact"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive("/contact")
                  ? "bg-primary text-white"
                  : "text-gray-700 hover:text-primary hover:bg-gray-100"
              }`}
            >
              Contato
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
