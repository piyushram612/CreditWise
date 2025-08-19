import React from 'react';
import { CreditWiseLogo, CreditWiseIcon } from './Icons';

// This is a demo component showing different ways to use your CreditWise logo
export function LogoDemo() {
  return (
    <div className="p-8 space-y-8">
      <h2 className="text-2xl font-bold mb-4">CreditWise Logo Usage Examples</h2>
      
      {/* Full logo with text - large */}
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Full Logo - Large</h3>
        <CreditWiseLogo className="w-48 h-48" showText={true} />
      </div>
      
      {/* Full logo with text - medium */}
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Full Logo - Medium</h3>
        <CreditWiseLogo className="w-32 h-32" showText={true} />
      </div>
      
      {/* Icon only - various sizes */}
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Icon Only - Various Sizes</h3>
        <div className="flex items-center space-x-4">
          <CreditWiseIcon className="w-6 h-6 text-[#1e5f8b]" />
          <CreditWiseIcon className="w-8 h-8 text-[#1e5f8b]" />
          <CreditWiseIcon className="w-12 h-12 text-[#1e5f8b]" />
          <CreditWiseIcon className="w-16 h-16 text-[#1e5f8b]" />
        </div>
      </div>
      
      {/* Icon with different colors */}
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Icon - Different Colors</h3>
        <div className="flex items-center space-x-4">
          <CreditWiseIcon className="w-12 h-12 text-[#1e5f8b]" />
          <CreditWiseIcon className="w-12 h-12 text-blue-600" />
          <CreditWiseIcon className="w-12 h-12 text-gray-600" />
          <CreditWiseIcon className="w-12 h-12 text-green-600" />
        </div>
      </div>
      
      {/* Logo without text */}
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Logo Without Text</h3>
        <CreditWiseLogo className="w-24 h-24" showText={false} />
      </div>
    </div>
  );
}