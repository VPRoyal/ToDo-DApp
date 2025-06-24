// src/components/layout/Sidebar.tsx
import React from 'react';
import { 
  HomeIcon, 
  ViewColumnsIcon, 
  ChartBarIcon, 
  CogIcon 
} from '@heroicons/react/24/outline';

interface SidebarItem {
  id: string;
  name: string;
  icon: React.ComponentType<any>;
  count?: number;
}

const sidebarItems: SidebarItem[] = [
  { id: 'dashboard', name: 'Dashboard', icon: HomeIcon },
  { id: 'board', name: 'Board View', icon: ViewColumnsIcon },
  { id: 'analytics', name: 'Analytics', icon: ChartBarIcon },
  { id: 'settings', name: 'Settings', icon: CogIcon },
];

const Sidebar: React.FC = () => {
  const [active, setActive] = React.useState('dashboard');

  return (
    <div className="w-64 bg-white h-screen fixed left-0 top-16 border-r border-gray-200">
      <div className="p-4">
        <nav className="space-y-1">
          {sidebarItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActive(item.id)}
              className={`
                w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg
                ${active === item.id 
                  ? 'bg-blue-50 text-blue-600' 
                  : 'text-gray-700 hover:bg-gray-50'}
              `}
            >
              <item.icon className="mr-3 h-5 w-5" />
              <span className="flex-1 text-left">{item.name}</span>
              {item.count && (
                <span className="ml-3 inline-block py-0.5 px-2 text-xs rounded-full bg-blue-100 text-blue-600">
                  {item.count}
                </span>
              )}
            </button>
          ))}
        </nav>
      </div>

      {/* User Profile Section */}
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
        <div className="flex items-center">
          <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
          <div className="ml-3">
            <p className="text-sm font-medium text-gray-700">Connected Wallet</p>
            <p className="text-xs text-gray-500 truncate">
              {/* Add wallet address here */}
              0x1234...5678
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;