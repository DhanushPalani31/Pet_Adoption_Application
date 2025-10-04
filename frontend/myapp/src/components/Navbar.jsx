import { useState } from 'react';
import { Menu, X, Heart, MessageCircle, User, LogOut, Home, PawPrint } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Navbar = ({ onNavigate }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    onNavigate('home');
    setIsOpen(false);
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <button
              onClick={() => onNavigate('home')}
              className="flex items-center space-x-2 text-2xl font-bold text-emerald-600"
            >
              <PawPrint className="w-8 h-8" />
              <span>PetAdopt</span>
            </button>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <button
              onClick={() => onNavigate('home')}
              className="flex items-center space-x-1 px-3 py-2 rounded-lg hover:bg-gray-100 transition"
            >
              <Home className="w-5 h-5" />
              <span>Home</span>
            </button>

            {user ? (
              <>
                {user.role === 'shelter' && (
                  <button
                    onClick={() => onNavigate('my-pets')}
                    className="flex items-center space-x-1 px-3 py-2 rounded-lg hover:bg-gray-100 transition"
                  >
                    <PawPrint className="w-5 h-5" />
                    <span>My Pets</span>
                  </button>
                )}

                <button
                  onClick={() => onNavigate('applications')}
                  className="flex items-center space-x-1 px-3 py-2 rounded-lg hover:bg-gray-100 transition"
                >
                  <MessageCircle className="w-5 h-5" />
                  <span>Applications</span>
                </button>

                <button
                  onClick={() => onNavigate('favorites')}
                  className="flex items-center space-x-1 px-3 py-2 rounded-lg hover:bg-gray-100 transition"
                >
                  <Heart className="w-5 h-5" />
                  <span>Favorites</span>
                </button>

                <button
                  onClick={() => onNavigate('messages')}
                  className="flex items-center space-x-1 px-3 py-2 rounded-lg hover:bg-gray-100 transition"
                >
                  <MessageCircle className="w-5 h-5" />
                  <span>Messages</span>
                </button>

                <button
                  onClick={() => onNavigate('profile')}
                  className="flex items-center space-x-1 px-3 py-2 rounded-lg hover:bg-gray-100 transition"
                >
                  <User className="w-5 h-5" />
                  <span>{user.name}</span>
                </button>

                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => onNavigate('login')}
                  className="px-4 py-2 text-emerald-600 hover:bg-gray-100 rounded-lg transition"
                >
                  Login
                </button>
                <button
                  onClick={() => onNavigate('register')}
                  className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition"
                >
                  Sign Up
                </button>
              </>
            )}
          </div>

          <div className="md:hidden flex items-center">
            <button onClick={() => setIsOpen(!isOpen)} className="text-gray-700">
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden bg-white border-t">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <button
              onClick={() => {
                onNavigate('home');
                setIsOpen(false);
              }}
              className="block w-full text-left px-3 py-2 rounded-lg hover:bg-gray-100"
            >
              Home
            </button>

            {user ? (
              <>
                {user.role === 'shelter' && (
                  <button
                    onClick={() => {
                      onNavigate('my-pets');
                      setIsOpen(false);
                    }}
                    className="block w-full text-left px-3 py-2 rounded-lg hover:bg-gray-100"
                  >
                    My Pets
                  </button>
                )}

                <button
                  onClick={() => {
                    onNavigate('applications');
                    setIsOpen(false);
                  }}
                  className="block w-full text-left px-3 py-2 rounded-lg hover:bg-gray-100"
                >
                  Applications
                </button>

                <button
                  onClick={() => {
                    onNavigate('favorites');
                    setIsOpen(false);
                  }}
                  className="block w-full text-left px-3 py-2 rounded-lg hover:bg-gray-100"
                >
                  Favorites
                </button>

                <button
                  onClick={() => {
                    onNavigate('messages');
                    setIsOpen(false);
                  }}
                  className="block w-full text-left px-3 py-2 rounded-lg hover:bg-gray-100"
                >
                  Messages
                </button>

                <button
                  onClick={() => {
                    onNavigate('profile');
                    setIsOpen(false);
                  }}
                  className="block w-full text-left px-3 py-2 rounded-lg hover:bg-gray-100"
                >
                  Profile
                </button>

                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-3 py-2 text-red-500 rounded-lg hover:bg-gray-100"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => {
                    onNavigate('login');
                    setIsOpen(false);
                  }}
                  className="block w-full text-left px-3 py-2 rounded-lg hover:bg-gray-100"
                >
                  Login
                </button>
                <button
                  onClick={() => {
                    onNavigate('register');
                    setIsOpen(false);
                  }}
                  className="block w-full text-left px-3 py-2 rounded-lg hover:bg-gray-100"
                >
                  Sign Up
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;