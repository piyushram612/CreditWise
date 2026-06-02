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
        className={`flex items-center w-full px-4 py-3 rounded-xl transition-all duration-200 text-left border ${isActive
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
}

export default function Sidebar({ user, onLogout, activeView, setActiveView }: SidebarProps) {
    return (
        <div className="w-64 bg-[#0A0D14]/90 border-r border-[#1E2538] p-5 flex flex-col shrink-0">
            <div className="flex items-center gap-3 mb-8 px-1">
                <LogoIcon className="h-8 w-8 text-blue-500 shrink-0" />
                <div>
                    <h1 className="text-base font-bold text-white leading-none tracking-tight">CreditWise</h1>
                    <span className="text-[10px] font-bold text-gray-500 tracking-widest uppercase"> Every Rupee, Maximized</span>
                </div>
            </div>

            <nav className="flex-1 space-y-2">
                <NavItem icon={<SlidersHorizontalIcon className="h-5 w-5" />} label="Spend Optimizer" isActive={activeView === 'optimizer'} onClick={() => setActiveView('optimizer')} />
                <NavItem icon={<StarIcon className="h-5 w-5" />} label="Smart Tips" isActive={activeView === 'tips'} onClick={() => setActiveView('tips')} />
                <NavItem icon={<BotIcon className="h-5 w-5" />} label="AI Card Advisor" isActive={activeView === 'chat'} onClick={() => setActiveView('chat')} />
                <NavItem icon={<SettingsIcon className="h-5 w-5" />} label="Settings" isActive={activeView === 'settings'} onClick={() => setActiveView('settings')} />
            </nav>

            <div className="mt-auto pt-4 border-t border-[#1E2538]/60">
                {user && (
                    <div className="px-3 py-2 rounded-xl bg-gray-800/10 border border-gray-800/20 mb-3 truncate">
                        <p className="text-xs font-semibold text-white truncate" title={user.email || ''}>{user.email}</p>
                        <p className="text-[10px] text-gray-500 font-medium mt-0.5">Welcome back!</p>
                    </div>
                )}
                <button onClick={onLogout} className="flex items-center w-full px-4 py-3 rounded-xl border border-transparent text-[#82889A] hover:bg-red-950/20 hover:text-red-400 hover:border-red-900/30 transition-all duration-200 font-semibold text-sm">
                    <LogOutIcon className="h-5 w-5" />
                    <span className="ml-4 tracking-wide">Logout</span>
                </button>
            </div>
        </div>
    );
}