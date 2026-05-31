import { useState, useEffect } from "react";
import { ShoppingCart, User, Menu, X, ChevronDown } from "lucide-react";
import { useAuth } from "../../contexts/authContext.jsx";
import { useBooking } from "../../contexts/bookingContext.jsx";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  const { user, isAuthenticated, logout } = useAuth();
  const { currentBooking } = useBooking();

  const currentPath = window.location.pathname;

  useEffect(() => {
    setCartCount(currentBooking ? 1 : 0);
  }, [currentBooking]);

  const handleLogout = () => {
    logout();
    window.location.href = "/";
  };

  const navLinks = [
    { path: "/", label: "Home" },
    { path: "/services", label: "Services" },
    { path: "/about", label: "About" },
    { path: "/contact", label: "Contact" },
  ];

  return (
    <nav className="bg-white shadow-sm fixed top-0 left-0 right-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <a href="/" className="text-2xl font-bold text-indigo-600">
              UrbanPro
            </a>
          </div>

          {/* Center Navigation */}
          <div className="hidden md:flex items-center justify-center flex-1">
            <div className="flex space-x-8">
              {navLinks.map((link) => (
                <a
                  key={link.path}
                  href={link.path}
                  className={`text-sm font-medium transition-colors duration-200 ${currentPath === link.path ? "text-indigo-600" : "text-gray-600 hover:text-indigo-600"}`}>
                  {link.label}
                </a>
              ))}
            </div>
          </div>

          {/* Right Section */}
          <div className="hidden md:flex items-center space-x-6">
            {isAuthenticated && (
              <a href="/cart" className="relative text-gray-600 hover:text-indigo-600 transition-colors">
                <ShoppingCart className="h-6 w-6" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-indigo-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">{cartCount}</span>
                )}
              </a>
            )}

            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center space-x-2 bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 hover:bg-gray-100 transition-colors">
                  <User className="h-5 w-5 text-gray-600" />
                  <span className="text-sm font-medium text-gray-700 max-w-[120px] truncate">{user?.name}</span>
                  <ChevronDown className="h-4 w-4 text-gray-500" />
                </button>

                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 border border-gray-100 animate-fadeIn">
                    <a href="/dashboard" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                      Dashboard
                    </a>
                    <button onClick={handleLogout} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <a href="/login" className="text-sm font-medium text-gray-600 hover:text-indigo-600">
                  Login
                </a>
                <a href="/register" className="text-sm font-medium text-white bg-indigo-600 px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors">
                  Sign Up
                </a>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            {isAuthenticated && (
              <a href="/cart" className="relative text-gray-600 hover:text-indigo-600 transition-colors mr-4">
                <ShoppingCart className="h-6 w-6" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-indigo-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">{cartCount}</span>
                )}
              </a>
            )}
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-gray-600 hover:text-indigo-600 focus:outline-none">
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navLinks.map((link) => (
              <a
                key={link.path}
                href={link.path}
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  currentPath === link.path ? "text-indigo-600 bg-indigo-50" : "text-gray-600 hover:text-indigo-600 hover:bg-gray-50"
                }`}>
                {link.label}
              </a>
            ))}

            <div className="border-t border-gray-200 pt-4 pb-3">
              {isAuthenticated ? (
                <>
                  <div className="flex items-center px-3">
                    <div className="flex-shrink-0">
                      <User className="h-8 w-8 text-gray-400" />
                    </div>
                    <div className="ml-3">
                      <div className="text-base font-medium text-gray-800">{user?.name}</div>
                    </div>
                  </div>
                  <div className="mt-3 space-y-1">
                    <a href="/dashboard" className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-indigo-600 hover:bg-gray-50">
                      Dashboard
                    </a>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-indigo-600 hover:bg-gray-50">
                      Logout
                    </button>
                  </div>
                </>
              ) : (
                <div className="space-y-1 px-3">
                  <a href="/login" className="block py-2 rounded-md text-base font-medium text-gray-600 hover:text-indigo-600 hover:bg-gray-50">
                    Login
                  </a>
                  <a href="/register" className="block py-2 rounded-md text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700">
                    Sign Up
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Header;
