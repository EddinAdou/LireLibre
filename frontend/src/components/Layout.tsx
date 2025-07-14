import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BookOpen, PenTool, LogOut, Menu, Users, Mail, Moon, Sun } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import UserAvatar from './ui/UserAvatar';
import LiveStats from './ui/LiveStats';
import ReadingAnimation from './ui/ReadingAnimation';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isAuthenticated, logout } = useAuth();
  const { isDarkMode, toggleDarkMode } = useTheme();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDarkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-blue-50 via-white to-purple-50'}`}>
      {/* Header */}
      <header className={`backdrop-blur-sm shadow-sm border-b sticky top-0 z-50 transition-colors duration-300 ${isDarkMode ? 'bg-gray-800/95 border-gray-700' : 'bg-white/95 border-gray-200'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-3 group">
              <BookOpen className={`h-8 w-8 transition-all duration-300 group-hover:scale-110 ${isDarkMode ? 'text-blue-400 group-hover:text-blue-300' : 'text-primary group-hover:text-blue-600'}`} />
              <span className={`text-2xl font-bold transition-colors duration-300 ${isDarkMode ? 'text-white group-hover:text-blue-300' : 'text-gray-900 group-hover:text-blue-600'}`}>
                LireLibre
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-2">
              <Link
                to="/search"
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 hover:scale-105 ${isDarkMode ? 'text-gray-300 hover:text-green-400 hover:bg-green-900/20' : 'text-gray-600 hover:text-green-600 hover:bg-green-50'}`}
              >
                🔍 Rechercher
              </Link>
              <Link
                to="/stories"
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 hover:scale-105 ${isDarkMode ? 'text-gray-300 hover:text-blue-400 hover:bg-blue-900/20' : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'}`}
              >
                📚 Mes Histoires
              </Link>
              {isAuthenticated && (
                <Link
                  to="/write"
                  className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 hover:scale-105 ${isDarkMode ? 'text-gray-300 hover:text-purple-400 hover:bg-purple-900/20' : 'text-gray-600 hover:text-purple-600 hover:bg-purple-50'}`}
                >
                  <PenTool className="h-4 w-4" />
                  <span>Écrire</span>
                </Link>
              )}
            </nav>

            {/* User Actions */}
            <div className="hidden md:flex items-center space-x-4">
              {/* Theme Toggle Button */}
              <button
                onClick={toggleDarkMode}
                className={`p-2 rounded-lg transition-all duration-200 hover:scale-105 ${isDarkMode ? 'text-gray-300 hover:text-yellow-400 hover:bg-yellow-900/20' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'}`}
                title={isDarkMode ? 'Mode clair' : 'Mode sombre'}
              >
                {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </button>
              {isAuthenticated ? (
                <div className="flex items-center space-x-4">
                  {/* User Profile Button */}
                  <Link
                    to="/profile"
                    className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors duration-200 ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}`}
                  >
                    <UserAvatar user={user} size="sm" />
                    <div className="flex flex-col">
                      <span className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{user?.username}</span>
                      <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Voir le profil</span>
                    </div>
                  </Link>
                  
                  {/* Logout Button */}
                  <button
                    onClick={handleLogout}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${isDarkMode ? 'text-gray-300 hover:text-red-400 hover:bg-red-900/20' : 'text-gray-600 hover:text-red-600 hover:bg-red-50'}`}
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Déconnexion</span>
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Link
                    to="/login"
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${isDarkMode ? 'text-gray-300 hover:text-blue-400 hover:bg-blue-900/20' : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'}`}
                  >
                    🔑 Connexion
                  </Link>
                  <Link
                    to="/register"
                    className="bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 px-6 py-2 rounded-xl text-sm font-medium shadow-lg transition-all duration-200 transform hover:scale-105 hover:shadow-xl"
                  >
                    ✨ Inscription
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-gray-600 hover:text-gray-900 p-2 rounded-lg transition-all duration-200 hover:bg-gray-100"
              >
                <Menu className={`h-6 w-6 transition-transform duration-300 ${isMobileMenuOpen ? 'rotate-90' : 'rotate-0'}`} />
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMobileMenuOpen && (
            <div className="md:hidden py-4 border-t">
              <div className="flex flex-col space-y-2">
                <Link
                  to="/stories"
                  className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-base font-medium"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Histoires
                </Link>
                {isAuthenticated && (
                  <Link
                    to="/write"
                    className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-base font-medium"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <PenTool className="h-4 w-4" />
                    <span>Écrire</span>
                  </Link>
                )}
                <div className="border-t pt-2">
                  {isAuthenticated ? (
                    <>
                      <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg mb-3">
                        <UserAvatar user={user} size="md" />
                        <div className="flex flex-col">
                          <span className="text-sm font-medium text-gray-900">{user?.username}</span>
                          <span className="text-xs text-gray-500">Utilisateur connecté</span>
                        </div>
                      </div>
                      <Link
                        to="/profile"
                        className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 px-3 py-2 rounded-lg text-base font-medium transition-colors duration-200"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <span>Mon Profil</span>
                      </Link>
                      <button
                        onClick={() => {
                          handleLogout();
                          setIsMobileMenuOpen(false);
                        }}
                        className="flex items-center space-x-2 text-red-600 hover:text-red-700 hover:bg-red-50 px-3 py-2 rounded-lg text-base font-medium w-full text-left transition-colors duration-200"
                      >
                        <LogOut className="h-4 w-4" />
                        <span>Déconnexion</span>
                      </button>
                    </>
                  ) : (
                    <>
                      <Link
                        to="/login"
                        className="block text-gray-600 hover:text-gray-900 hover:bg-gray-50 px-3 py-3 rounded-lg text-base font-medium transition-colors duration-200"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        Connexion
                      </Link>
                      <Link
                        to="/register"
                        className="block bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 px-3 py-3 rounded-lg text-base font-medium mt-2 text-center transition-all duration-200"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        Inscription
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-blue-900 text-white relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-20 h-20 bg-blue-500 rounded-full animate-pulse"></div>
          <div className="absolute top-32 right-20 w-16 h-16 bg-purple-500 rounded-full animate-pulse delay-1000"></div>
          <div className="absolute bottom-20 left-1/3 w-12 h-12 bg-cyan-500 rounded-full animate-pulse delay-2000"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Brand Section */}
            <div className="md:col-span-2">
              <div className="flex items-center space-x-4 mb-6">
                <div className="flex items-center space-x-3">
                  <BookOpen className="h-8 w-8 text-blue-400" />
                  <span className="text-2xl font-bold text-white">LireLibre</span>
                </div>
                <ReadingAnimation />
              </div>
              <p className="text-gray-300 text-lg leading-relaxed mb-6 max-w-md">
                Plateforme collaborative pour la lecture et l'écriture d'histoires.
                Rejoignez notre communauté d'auteurs et de lecteurs passionnés.
              </p>
              <LiveStats />
            </div>

            {/* Navigation Links */}
            <div>
              <h3 className="text-lg font-bold text-white mb-6 relative">
                Navigation
                <div className="absolute bottom-0 left-0 w-8 h-0.5 bg-blue-400 rounded-full"></div>
              </h3>
              <ul className="space-y-3">
                <li>
                  <Link 
                    to="/stories" 
                    className="text-gray-300 hover:text-blue-400 transition-colors duration-200 flex items-center space-x-2 group"
                  >
                    <BookOpen className="h-4 w-4 group-hover:scale-110 transition-transform duration-200" />
                    <span>Découvrir les histoires</span>
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/write" 
                    className="text-gray-300 hover:text-purple-400 transition-colors duration-200 flex items-center space-x-2 group"
                  >
                    <PenTool className="h-4 w-4 group-hover:scale-110 transition-transform duration-200" />
                    <span>Écrire une histoire</span>
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/profile" 
                    className="text-gray-300 hover:text-green-400 transition-colors duration-200 flex items-center space-x-2 group"
                  >
                    <Users className="h-4 w-4 group-hover:scale-110 transition-transform duration-200" />
                    <span>Mon profil</span>
                  </Link>
                </li>
              </ul>
            </div>

            {/* Support & Contact */}
            <div>
              <h3 className="text-lg font-bold text-white mb-6 relative">
                Support
                <div className="absolute bottom-0 left-0 w-8 h-0.5 bg-purple-400 rounded-full"></div>
              </h3>
              <ul className="space-y-3">
                <li>
                  <a 
                    href="#" 
                    className="text-gray-300 hover:text-blue-400 transition-colors duration-200 flex items-center space-x-2 group"
                  >
                    <Mail className="h-4 w-4 group-hover:scale-110 transition-transform duration-200" />
                    <span>Centre d'aide</span>
                  </a>
                </li>
                <li>
                  <a 
                    href="#" 
                    className="text-gray-300 hover:text-purple-400 transition-colors duration-200 block hover:translate-x-1 transition-transform duration-200"
                  >
                    Conditions d'utilisation
                  </a>
                </li>
                <li>
                  <a 
                    href="#" 
                    className="text-gray-300 hover:text-green-400 transition-colors duration-200 block hover:translate-x-1 transition-transform duration-200"
                  >
                    Politique de confidentialité
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="mt-12 pt-8 border-t border-gray-700">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="flex items-center space-x-4 mb-4 md:mb-0">
                <p className="text-gray-400 text-sm">
                  © 2025 LireLibre. Tous droits réservés.
                </p>
                <div className="hidden md:block w-px h-4 bg-gray-600"></div>
                <p className="text-gray-500 text-xs">
                  Fait avec ❤️ pour les passionnés de lecture
                </p>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2 text-sm text-gray-400">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span>Tous systèmes opérationnels</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
