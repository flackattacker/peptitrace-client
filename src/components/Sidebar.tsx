import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Home, PlusCircle, Users, User, Search, Database, BookOpen, Shield, Compass, Pill, BarChart3 } from 'lucide-react';

const Sidebar = () => {
  const { isAuthenticated, user } = useAuth();

  const baseNavigation = [
    { name: 'Home', to: '/', icon: Home },
    { name: 'Peptides', to: '/peptides', icon: Search },
    { name: 'Submit Experience', to: '/submit', icon: PlusCircle },
    { name: 'Community', to: '/community', icon: Users },
    { name: 'Explore', to: '/explore', icon: Compass },
    { name: 'Privacy', to: '/privacy', icon: Shield },
  ];

  const protectedNavigation = [
    { name: 'Profile', to: '/profile', icon: User },
  ];

  const moderatorNavigation = [
    { name: 'Research Hub', to: '/research', icon: BarChart3 },
  ];

  const navigation = [
    ...baseNavigation,
    ...(isAuthenticated ? protectedNavigation : []),
    ...(isAuthenticated && user?.role === 'moderator' ? moderatorNavigation : []),
  ];

  return (
    <aside className="w-64 bg-white border-r border-gray-200">
      <div className="h-full overflow-y-auto">
        <div className="p-4">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Navigation</h2>
          <nav className="space-y-1">
            {navigation.map((item) => (
              <NavLink
                key={item.name}
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center px-4 py-2 text-sm font-medium rounded-md ${
                    isActive
                      ? 'bg-gray-100 text-gray-900'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`
                }
              >
                <item.icon className="mr-3 h-5 w-5" />
                {item.name}
              </NavLink>
            ))}
          </nav>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;