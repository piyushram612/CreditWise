// FILE: app/components/dashboard/Sidebar.tsx
import { User } from '@supabase/supabase-js';
import { LogoIcon, BotIcon, SettingsIcon, SlidersHorizontalIcon, LogOutIcon } from '@/components/icons';

interface SidebarProps {
  user: User | null;
  onLogout: () => void;
  activeView: string;
  setActiveView: (view: string) => void;
}

const NavItem = ({ icon, label, isActive, onClick }: any) => (
    <button onClick={onClick} className={`flex items-center w-full px-4 py-3 rounded-lg transition-colors ${isActive ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:bg-gray-700 hover:text-white'}`}>
        {icon}
        <span className="ml-4 text-sm font-medium">{label}</span>
    </button>
);

export default function Sidebar({ user, onLogout, activeView, setActiveView }: SidebarProps) {
    return (
        <div className="w-64 bg-gray-800/50 border-r border-gray-800 p-4 flex flex-col">
            <div className="flex items-center mb-8">
                <LogoIcon className="h-8 w-8 text-indigo-500" />
                <h1 className="ml-2 text-xl font-bold text-white">CreditWise</h1>
            </div>
            <nav className="flex-1 space-y-2">
                <NavItem icon={<SlidersHorizontalIcon className="h-5 w-5" />} label="Spend Optimizer" isActive={activeView === 'optimizer'} onClick={() => setActiveView('optimizer')} />
                <NavItem icon={<BotIcon className="h-5 w-5" />} label="AI Card Advisor" isActive={activeView === 'chat'} onClick={() => setActiveView('chat')} />
                <NavItem icon={<SettingsIcon className="h-5 w-5" />} label="Settings" isActive={activeView === 'settings'} onClick={() => setActiveView('settings')} />
            </nav>
            <div className="mt-auto">
                <div className="p-4 rounded-lg bg-gray-700/50 mb-2">
                    <p className="text-sm font-medium text-white">{user?.email}</p>
                    <p className="text-xs text-gray-400">Welcome back!</p>
                </div>
                <button onClick={onLogout} className="flex items-center w-full px-4 py-3 rounded-lg text-gray-400 hover:bg-red-800/50 hover:text-white transition-colors">
                    <LogOutIcon className="h-5 w-5" />
                    <span className="ml-4 text-sm font-medium">Log Out</span>
                </button>
            </div>
        </div>
    );
}