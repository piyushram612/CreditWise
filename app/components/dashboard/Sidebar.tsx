'use client';
import React from 'react';
import { User } from '@supabase/supabase-js';
import { LogoIcon, BotIcon, SettingsIcon, SlidersHorizontalIcon, LogOutIcon, StarIcon } from '../icons';

interface NavItemProps {
    icon: React.ReactNode;
    label: string;
    isActive: boolean;
    onClick: () => void;
}

const NavItem = ({ icon, label, isActive, onClick }: NavItemProps) => (
    <button
        onClick={onClick}
        className={`flex items-center w-full px-4 py-3 rounded-xl transition-all duration-200 text-left border cursor-pointer ${isActive
            ? 'border-blue-500/30 bg-blue-500/10 text-white font-semibold'
            : 'border-transparent text-[#82889A] hover:bg-gray-800/20 hover:text-white font-medium'
            }`}
    >
        {icon}
        <span className="ml-4 text-sm font-semibold tracking-wide">{label}</span>
    </button>
);

interface SidebarProps {
    user: User | null;
    onLogout: () => void;
    activeView: string;
    setActiveView: (view: string) => void;
    onClose?: () => void;
    userFullName?: string;
    userAvatarUrl?: string | null;
    onProfileClick?: () => void;
}

export default function Sidebar({ 
    user, 
    onLogout, 
    activeView, 
    setActiveView,
    onClose,
    userFullName,
    userAvatarUrl,
    onProfileClick
}: SidebarProps) {
    return (
        <div className="w-64 bg-[#0A0D14]/90 border-r border-[#1E2538] p-5 flex flex-col shrink-0 h-full">
            <div className="flex items-center justify-between mb-8 px-1">
                <div className="flex items-center gap-3">
                    <LogoIcon className="h-8 w-8 text-blue-500 shrink-0" />
                    <div>
                        <h1 className="text-base font-bold text-white leading-none tracking-tight">CreditWise</h1>
                        <span className="text-[10px] font-bold text-gray-500 tracking-widest uppercase"> Every Rupee, Maximized</span>
                    </div>
                </div>
                {onClose && (
                    <button 
                        onClick={onClose} 
                        className="md:hidden p-1.5 text-gray-400 hover:text-white transition-colors bg-gray-800/20 border border-[#1E2538] rounded-lg cursor-pointer"
                        title="Close Menu"
                    >
                        <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                )}
            </div>

            <nav className="flex-1 space-y-2">
                <NavItem icon={<SlidersHorizontalIcon className="h-5 w-5" />} label="Spend Optimizer" isActive={activeView === 'optimizer'} onClick={() => setActiveView('optimizer')} />
                <NavItem icon={<StarIcon className="h-5 w-5" />} label="Smart Tips" isActive={activeView === 'tips'} onClick={() => setActiveView('tips')} />
                <NavItem icon={<BotIcon className="h-5 w-5" />} label="AI Card Advisor" isActive={activeView === 'chat'} onClick={() => setActiveView('chat')} />
                <NavItem icon={<SettingsIcon className="h-5 w-5" />} label="Settings" isActive={activeView === 'settings'} onClick={() => setActiveView('settings')} />
            </nav>

            <div className="mt-auto pt-4 border-t border-[#1E2538]/60 space-y-3">
                {user && (
                    <div 
                        onClick={onProfileClick}
                        className="flex items-center gap-3 p-3 rounded-xl bg-gray-800/10 border border-gray-800/20 hover:border-blue-500/30 transition-all cursor-pointer truncate group"
                        title="Edit Profile"
                    >
                        {userAvatarUrl ? (
                            /* eslint-disable-next-line @next/next/no-img-element */
                            <img src={userAvatarUrl} alt="Avatar" className="w-9 h-9 rounded-full object-cover border border-gray-700/50 group-hover:border-blue-500/50 transition-colors shrink-0" />
                        ) : (
                            <div className="w-9 h-9 rounded-full bg-blue-600/10 border border-blue-500/25 flex items-center justify-center text-xs font-bold text-blue-400 shrink-0">
                                {(userFullName || user.email || 'GU').slice(0, 2).toUpperCase()}
                            </div>
                        )}
                        <div className="truncate flex-1">
                            <p className="text-xs font-bold text-white truncate group-hover:text-blue-400 transition-colors">{userFullName || 'Guest User'}</p>
                            <p className="text-[9px] text-gray-500 font-semibold mt-0.5 truncate">{user.email}</p>
                        </div>
                    </div>
                )}
                <button onClick={onLogout} className="flex items-center w-full px-4 py-3 rounded-xl border border-transparent text-[#82889A] hover:bg-red-950/20 hover:text-red-400 hover:border-red-900/30 transition-all duration-200 font-semibold text-sm cursor-pointer">
                    <LogOutIcon className="h-5 w-5" />
                    <span className="ml-4 tracking-wide">Logout</span>
                </button>
            </div>
        </div>
    );
}