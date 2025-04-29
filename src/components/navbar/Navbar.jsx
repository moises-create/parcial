import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  // Manejo de autenticación
  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  // Efecto de scroll
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Verificar si estamos en la ruta /canvas/:canvaId
  const isCanvasPage = /^\/canvas\/[^/]+$/.test(location.pathname);
  if (isCanvasPage) return null;

  // Manejo de logout
  const handleLogout = async () => {
    try {
      const auth = getAuth();
      await signOut(auth);
      navigate("/login");
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  // Verificar si el enlace está activo
  const isActive = (path) => location.pathname === path;

  return (
    <nav
      className={`fixed w-full z-50 transition-all duration-300 ${
        scrolled ? "bg-white shadow-md" : "bg-white/90 backdrop-blur-sm"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link
              to="/"
              className="text-gray-900 text-xl font-bold flex items-center"
            >
              <svg
                className="h-6 w-6 mr-2 text-indigo-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
              SketchFlow
            </Link>
          </div>

          {/* Desktop menu */}
          <div className="hidden md:flex items-center space-x-6">
            <Link
              to="/"
              className={`px-3 py-2 text-sm font-medium ${
                isActive("/")
                  ? "text-indigo-600 border-b-2 border-indigo-600"
                  : "text-gray-700 hover:text-gray-900"
              }`}
            >
              Inicio
            </Link>

            {user && (
              <Link
                to="/canvas"
                className={`px-3 py-2 text-sm font-medium ${
                  isActive("/canvas")
                    ? "text-indigo-600 border-b-2 border-indigo-600"
                    : "text-gray-700 hover:text-gray-900"
                }`}
              >
                Mis Proyectos
              </Link>
            )}

            {user ? (
              <div className="flex items-center space-x-4">
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-indigo-600 transition-colors"
                >
                  Cerrar Sesión
                </button>
                <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-medium">
                  {user.email?.charAt(0).toUpperCase()}
                </div>
              </div>
            ) : (
              <Link
                to="/login"
                className="px-4 py-2 text-sm font-medium text-indigo-600 hover:text-indigo-800 transition-colors"
              >
                Iniciar Sesión
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-700 hover:text-indigo-600 p-2 rounded-md transition-colors"
              aria-label="Toggle menu"
            >
              {isOpen ? (
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={`md:hidden ${
          isOpen ? "block" : "hidden"
        } bg-white shadow-lg`}
      >
        <div className="px-2 pt-2 pb-3 space-y-1">
          <Link
            to="/"
            onClick={() => setIsOpen(false)}
            className={`block px-3 py-2 rounded-md text-base font-medium ${
              isActive("/")
                ? "bg-indigo-50 text-indigo-600"
                : "text-gray-700 hover:bg-gray-50"
            }`}
          >
            Inicio
          </Link>

          {user && (
            <Link
              to="/canvas"
              onClick={() => setIsOpen(false)}
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                isActive("/canvas")
                  ? "bg-indigo-50 text-indigo-600"
                  : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              Mis Proyectos
            </Link>
          )}

          {user ? (
            <div className="pt-4 pb-3 border-t border-gray-200">
              <div className="flex items-center px-5">
                <div className="flex-shrink-0">
                  <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-medium">
                    {user.email?.charAt(0).toUpperCase()}
                  </div>
                </div>
                <div className="ml-3">
                  <div className="text-base font-medium text-gray-800">
                    {user.email}
                  </div>
                </div>
              </div>
              <div className="mt-3 px-2 space-y-1">
                <button
                  onClick={() => {
                    handleLogout();
                    setIsOpen(false);
                  }}
                  className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100"
                >
                  Cerrar Sesión
                </button>
              </div>
            </div>
          ) : (
            <div className="pt-4 pb-3 border-t border-gray-200">
              <Link
                to="/login"
                onClick={() => setIsOpen(false)}
                className="block w-full px-4 py-2 text-center text-base font-medium text-indigo-600 hover:bg-indigo-50 rounded-md"
              >
                Iniciar Sesión
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
