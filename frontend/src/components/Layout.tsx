import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BookOpen, PenTool, LogOut, Menu, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import BookIcon from './icons/BookIcon';
import UserAvatar from './ui/UserAvatar';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-3">
              <div className="inline-flex items-center justify-center w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full shadow-lg">
                <BookIcon size={20} className="text-white" />
              </div>
              <span className="text-2xl font-bold text-gray-900">LireLibre</span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <Link
                to="/stories"
                className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
              >
                Histoires
              </Link>
              {isAuthenticated && (
                <Link
                  to="/write"
                  className="flex items-center space-x-1 text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                >
                  <PenTool className="h-4 w-4" />
                  <span>Écrire</span>
                </Link>
              )}
            </nav>

            {/* User Actions */}
            <div className="hidden md:flex items-center space-x-4">
              {isAuthenticated ? (
                <div className="flex items-center space-x-4">
                  {/* User Profile Button */}
                  <Link
                    to="/profile"
                    className="flex items-center space-x-3 hover:bg-gray-50 px-3 py-2 rounded-lg transition-colors duration-200"
                  >
                    <UserAvatar user={user} size="sm" />
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-gray-900">{user?.username}</span>
                      <span className="text-xs text-gray-500">Voir le profil</span>
                    </div>
                  </Link>
                  
                  {/* Logout Button */}
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-2 text-gray-600 hover:text-red-600 hover:bg-red-50 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Déconnexion</span>
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-3">
                  <Link
                    to="/login"
                    className="text-gray-600 hover:text-gray-900 px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
                  >
                    Connexion
                  </Link>
                  <Link
                    to="/register"
                    className="bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 px-6 py-2 rounded-lg text-sm font-medium shadow-sm transition-all duration-200 transform hover:scale-105"
                  >
                    Inscription
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-gray-600 hover:text-gray-900"
              >
                {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
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
      <footer className="bg-gray-50 border-t">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <BookOpen className="h-6 w-6 text-primary" />
                <span className="text-lg font-semibold">LireLibre</span>
              </div>
              <p className="text-gray-600 text-sm">
                Plateforme collaborative pour la lecture et l'écriture d'histoires.
                Rejoignez notre communauté d'auteurs et de lecteurs passionnés.
              </p>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
                Navigation
              </h3>
              <ul className="space-y-2">
                <li><Link to="/stories" className="text-gray-600 hover:text-gray-900 text-sm">Histoires</Link></li>
                <li><Link to="/write" className="text-gray-600 hover:text-gray-900 text-sm">Écrire</Link></li>
                <li><Link to="/profile" className="text-gray-600 hover:text-gray-900 text-sm">Profil</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
                Support
              </h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-600 hover:text-gray-900 text-sm">Centre d'aide</a></li>
                <li><a href="#" className="text-gray-600 hover:text-gray-900 text-sm">Conditions d'utilisation</a></li>
                <li><a href="#" className="text-gray-600 hover:text-gray-900 text-sm">Politique de confidentialité</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-200">
            <p className="text-center text-gray-600 text-sm">
              © 2025 LireLibre. Tous droits réservés.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
