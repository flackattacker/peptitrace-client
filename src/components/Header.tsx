import React from 'react';
import { Button } from './ui/button';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { LogOut, User } from 'lucide-react';
import { ThemeToggle } from './ui/theme-toggle';
import logo from '../assets/brand/logo.png';

const Header: React.FC = () => {
  const { logout, user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  console.log('Header: Rendering with site name check');

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-36 items-center">
        <div className="mr-4 flex items-center">
          <a className="flex items-center" href="/">
            <img
              src={logo}
              alt="PeptiTrace"
              className="h-32 w-auto"
            />
          </a>
        </div>
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none">
            {/* Search or other content */}
          </div>
          <nav className="flex items-center space-x-2">
            <ThemeToggle />
            {isAuthenticated ? (
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="sm" onClick={() => navigate('/profile')}>
                  <User className="h-4 w-4 mr-2" />
                  {user?.email}
                </Button>
                <Button variant="outline" size="sm" onClick={handleLogout}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="sm" onClick={() => navigate('/login')}>
                  Login
                </Button>
                <Button variant="outline" size="sm" onClick={() => navigate('/register')}>
                  Register
                </Button>
              </div>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;