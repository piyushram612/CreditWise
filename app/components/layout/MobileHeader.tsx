import React from 'react';
import { Bars3Icon, CreditWiseIcon } from '@/app/components/shared/Icons';

interface MobileHeaderProps {
  onMenuClick: () => void;
}

export function MobileHeader({ onMenuClick }: MobileHeaderProps) {
  return (
    <header className="md:hidden flex items-center justify-between p-4 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shrink-0">
      <button 
        onClick={onMenuClick} 
        className="text-gray-600 dark:text-gray-300"
      >
        <Bars3Icon />
      </button>
      
      <div className="flex items-center">
        <CreditWiseIcon className="w-7 h-7 text-[#1e5f8b]" />
        <h1 className="text-lg font-bold ml-2 text-[#1e5f8b] dark:text-blue-400">CreditWise</h1>
      </div>
      
      <div className="w-6"></div> {/* Spacer */}
    </header>
  );
}