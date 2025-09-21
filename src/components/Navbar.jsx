import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { AlignRight, X, LogOut, User, Clock } from 'lucide-react';

function Navbar() {
  const { currentUser, userRole, signOut } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="glass-dark neon-shadow sticky top-0 z-40 border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <Clock className="h-8 w-8 text-sky-300" />
              <span className="ml-2 text-xl font-bold text-white drop-shadow">QueueMaster</span>
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-6">
            {!currentUser ? (
              <>
                <Link to="/login" className="text-slate-200 hover:text-sky-300 transition-colors">
                  Log In
                </Link>
                <Link to="/signup" className="glass-dark glass-border text-white px-4 py-2 rounded-md transition-transform-shadow glass-hover">
                  Sign Up
                </Link>
              </>
            ) : (
              <>
                {userRole === 'business' ? (
                  <Link to="/business" className="text-slate-200 hover:text-sky-300 transition-colors">
                    Dashboard
                  </Link>
                ) : (
                  <Link to="/user" className="text-slate-200 hover:text-sky-300 transition-colors">
                    My Queues
                  </Link>
                )}
                <div className="relative group">
                  <button className="flex items-center text-slate-200 hover:text-sky-300 transition-colors">
                    <User className="h-5 w-5 mr-1" />
                    <span>{currentUser.displayName || currentUser.email}</span>
                  </button>
                  <div className="absolute right-0 w-56 mt-2 glass-dark rounded-md shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 border border-white/10">
                    <button 
                      onClick={handleSignOut}
                      className="flex items-center w-full text-left px-4 py-2 text-slate-200 hover:text-white hover:bg-white/10"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Sign Out
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMenu}
              className="p-2 rounded-md text-slate-200 hover:text-sky-300 focus:outline-none"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <AlignRight className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden glass-dark border-t border-white/10 shadow-inner">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {!currentUser ? (
              <>
                <Link 
                  to="/login" 
                  className="block px-3 py-2 rounded-md text-base font-medium text-slate-200 hover:text-white hover:bg-white/10"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Log In
                </Link>
                <Link 
                  to="/signup" 
                  className="block px-3 py-2 rounded-md text-base font-medium glass-dark text-white hover:bg-white/20"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign Up
                </Link>
              </>
            ) : (
              <>
                {userRole === 'business' ? (
                  <Link 
                    to="/business" 
                    className="block px-3 py-2 rounded-md text-base font-medium text-slate-200 hover:text-white hover:bg-white/10"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                ) : (
                  <Link 
                    to="/user" 
                    className="block px-3 py-2 rounded-md text-base font-medium text-slate-200 hover:text-white hover:bg-white/10"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    My Queues
                  </Link>
                )}
                <button 
                  onClick={() => {
                    handleSignOut();
                    setIsMenuOpen(false);
                  }}
                  className="flex items-center w-full px-3 py-2 rounded-md text-base font-medium text-slate-200 hover:text-white hover:bg-white/10"
                >
                  <LogOut className="h-5 w-5 mr-2" />
                  Sign Out
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;