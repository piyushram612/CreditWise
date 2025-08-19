import React from 'react';
import type { SidebarProps } from '@/app/types';
import { 
  DashboardIcon, 
  CreditCardIcon, 
  SparklesIcon, 
  ChatBubbleIcon, 
  UserCircleIcon, 
  SettingsIcon,
  SunIcon,
  MoonIcon,
  CreditWiseIcon
} from '@/app/components/shared/Icons';

export function Sidebar({ 
  activeView, 
  setActiveView, 
  user, 
  onAuthClick, 
  supabase, 
  theme, 
  toggleTheme, 
  onLinkClick 
}: SidebarProps) {
  const navItems = [
    { name: 'Dashboard', icon: <DashboardIcon />, view: 'dashboard' },
    { name: 'My Cards', icon: <CreditCardIcon />, view: 'my-cards' },
    { name: 'Spend Optimizer', icon: <SparklesIcon />, view: 'optimizer' },
    { name: 'AI Card Advisor', icon: <ChatBubbleIcon />, view: 'advisor' },
    { name: 'Settings', icon: <SettingsIcon />, view: 'settings' },
  ];

  const handleLogout = async () => {
    await supabase.auth.signOut();
    onLinkClick(); // Close sidebar on logout
  };

  return (
    <aside className="w-64 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200 p-4 flex flex-col h-full">
      <div className="flex items-center mb-8 shrink-0">
        <CreditWiseIcon className="w-8 h-8 text-[#1e5f8b]" />
        <h1 className="text-xl font-bold ml-2 text-[#1e5f8b] dark:text-blue-400">CreditWise</h1>
      </div>

      <nav className="flex-grow overflow-y-auto">
        <ul>
          {navItems.map(item => (
            <li key={item.name} className="mb-2">
              <a
                href="#"
                onClick={(e) => { 
                  e.preventDefault(); 
                  setActiveView(item.view); 
                  onLinkClick(); 
                }}
                className={`flex items-center p-3 rounded-lg transition-colors duration-200 ${
                  activeView === item.view 
                    ? 'bg-blue-500 text-white shadow' 
                    : 'hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                {item.icon}
                <span className="ml-4">{item.name}</span>
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <div className="mt-auto shrink-0">
        {user ? (
          <div className="text-sm">
            <p className="truncate px-3" title={user.email || 'User'}>
              {user.email}
            </p>
            <button 
              onClick={handleLogout} 
              className="w-full text-left mt-2 p-3 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200 font-semibold"
            >
              Logout
            </button>
          </div>
        ) : (
          <a 
            href="#" 
            onClick={(e) => { 
              e.preventDefault(); 
              onAuthClick(); 
              onLinkClick(); 
            }} 
            className="flex items-center p-3 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
          >
            <UserCircleIcon />
            <span className="ml-4">Login / Sign Up</span>
          </a>
        )}
        
        <button 
          onClick={toggleTheme} 
          className="w-full flex items-center mt-4 p-3 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
        >
          {theme === 'light' ? <MoonIcon /> : <SunIcon />}
          <span className="ml-4">Toggle Theme</span>
        </button>
      </div>
    </aside>
  );
}