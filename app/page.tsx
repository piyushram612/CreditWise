"use client";

import React, { useState } from 'react';
import { useAuth } from '@/app/hooks/useAuth';
import { useTheme } from '@/app/hooks/useTheme';
import { getSupabaseClient } from '@/app/utils/supabase';
import type { UserOwnedCard } from '@/app/types';

// Layout Components
import { Sidebar } from '@/app/components/layout/Sidebar';
import { MobileHeader } from '@/app/components/layout/MobileHeader';
import { AuthModal } from '@/app/components/layout/AuthModal';

// View Components
import { DashboardView } from '@/app/components/dasboard/DashboardView';
import { MyCardsView } from '@/app/components/cards/MyCardsView';

// Placeholder components for views not yet refactored
import { SpendOptimizerView } from '@/app/components/optimizer/SpendOptimizerView';
import { AICardAdvisorView } from '@/app/components/advisor/AICardAdvisorView';
import { SettingsView } from '@/app/components/settings/SettingsView';

// Modal Components (these will need to be created)
import { CardFormModal } from '@/app/components/cards/CardFormModal';
import { ConfirmDeleteModal } from '@/app/components/cards/ConfirmDeleteModal';

export default function App() {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  
  const [activeView, setActiveView] = useState('dashboard');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isCardFormModalOpen, setIsCardFormModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [cardToEdit, setCardToEdit] = useState<UserOwnedCard | null>(null);
  const [cardToDelete, setCardToDelete] = useState<UserOwnedCard | null>(null);
  const [key, setKey] = useState(0);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleCardSaved = () => setKey(prevKey => prevKey + 1);
  const handleCardDeleted = () => setKey(prevKey => prevKey + 1);

  const handleAddCardClick = () => {
    setCardToEdit(null);
    setIsCardFormModalOpen(true);
  };

  const handleEditCardClick = (card: UserOwnedCard) => {
    setCardToEdit(card);
    setIsCardFormModalOpen(true);
  };

  const handleDeleteCardClick = (card: UserOwnedCard) => {
    setCardToDelete(card);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!cardToDelete) return;
    const supabase = getSupabaseClient();
    await supabase.from('user_owned_cards').delete().eq('id', cardToDelete.id);
    handleCardDeleted();
    setIsDeleteModalOpen(false);
    setCardToDelete(null);
  };

  const renderView = () => {
    if (!user && !['dashboard', 'settings'].includes(activeView)) {
      return (
        <div className="flex flex-col items-center justify-center h-full text-center p-4">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">
            Please log in to continue
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            This feature is available for registered users.
          </p>
          <button 
            onClick={() => setIsAuthModalOpen(true)} 
            className="bg-blue-500 text-white font-semibold px-6 py-3 rounded-lg shadow hover:bg-blue-600 transition-all duration-200"
          >
            Login / Sign Up
          </button>
        </div>
      );
    }

    switch (activeView) {
      case 'dashboard': 
        return (
          <DashboardView 
            key={key} 
            user={user} 
            setActiveView={setActiveView} 
            onAddCardClick={handleAddCardClick} 
          />
        );
      case 'my-cards': 
        return user ? (
          <MyCardsView 
            key={key}
            refreshKey={key}
            user={user} 
            onAddCardClick={handleAddCardClick} 
            onEditCard={handleEditCardClick} 
            onDeleteCard={handleDeleteCardClick} 
          />
        ) : null;
      case 'optimizer': 
        return <SpendOptimizerView />;
      case 'advisor': 
        return <AICardAdvisorView />;
      case 'settings': 
        return <SettingsView />;
      default: 
        return (
          <DashboardView 
            key={key} 
            user={user} 
            setActiveView={setActiveView} 
            onAddCardClick={handleAddCardClick} 
          />
        );
    }
  };

  return (
    <>
      {/* Global Styles for Number Inputs */}
      <style jsx global>{`
        /* Hide spinner buttons on Chrome, Safari, Edge, Opera */
        input[type=number]::-webkit-inner-spin-button,
        input[type=number]::-webkit-outer-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
        /* Hide spinner buttons on Firefox */
        input[type=number] {
          -moz-appearance: textfield;
        }
      `}</style>

      <div className="flex h-screen bg-gray-100 dark:bg-gray-900 font-sans text-gray-900 dark:text-gray-100 overflow-hidden">
        {/* Mobile Sidebar Overlay */}
        {isSidebarOpen && (
          <div 
            onClick={() => setIsSidebarOpen(false)} 
            className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
          ></div>
        )}

        {/* Sidebar */}
        <div className={`fixed top-0 left-0 h-full z-30 transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}>
          <Sidebar 
            activeView={activeView} 
            setActiveView={setActiveView} 
            user={user}
            onAuthClick={() => setIsAuthModalOpen(true)}
            supabase={getSupabaseClient()} 
            theme={theme} 
            toggleTheme={toggleTheme}
            onLinkClick={() => setIsSidebarOpen(false)}
          />
        </div>

        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Mobile Header */}
          <MobileHeader onMenuClick={() => setIsSidebarOpen(true)} />

          <main className="flex-1 p-4 sm:p-6 md:p-8 overflow-y-auto">
            {renderView()}
          </main>
        </div>

        {/* Modals */}
        <AuthModal 
          isOpen={isAuthModalOpen} 
          onClose={() => setIsAuthModalOpen(false)} 
          supabase={getSupabaseClient()} 
        />

        {user && (
          <>
            <CardFormModal 
              isOpen={isCardFormModalOpen} 
              onClose={() => setIsCardFormModalOpen(false)} 
              user={user} 
              onCardSaved={handleCardSaved} 
              existingCard={cardToEdit} 
            />
            <ConfirmDeleteModal 
              isOpen={isDeleteModalOpen} 
              onClose={() => setIsDeleteModalOpen(false)} 
              onConfirm={confirmDelete} 
              cardName={cardToDelete?.card_name || ''} 
            />
          </>
        )}
      </div>
    </>
  );
}
=======
import { createClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';
import AuthComponent from './components/auth/AuthComponent';
import { redirect } from 'next/navigation';

export default async function Home() {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const { data: { session } } = await supabase.auth.getSession();

  if (session) {
    redirect('/dashboard');
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
      <div className="max-w-md w-full p-8 space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold">CreditWise</h1>
          <p className="mt-2 text-gray-400">Optimize your credit card rewards effortlessly.</p>
        </div>
        <AuthComponent />
      </div>
    </div>
  );
}