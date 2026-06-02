/* eslint-disable @next/next/no-img-element */
'use client';

import { useState, useCallback, useEffect } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { User } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';

import Sidebar from './Sidebar';
import CardList from './CardList';
import SpendOptimizer from './SpendOptimizer';
import AiCardAdvisor from './AiCardAdvisor';
import Settings from './Settings';
import { SmartTipsView } from '@/app/components/insights/SmartTipsView';
import type { Card } from '@/lib/types';
import type { Database } from '@/lib/database.types';

interface DashboardClientProps {
  user: User;
  initialUserCards: Card[];
  allMasterCards: Card[];
}
const DemoLimitModal = ({ onClose }: { onClose: () => void }) => {
  return (
    <div className="fixed inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <div className="bg-[#0E111A] border border-[#1E2538] p-6 rounded-2xl w-full max-w-sm shadow-2xl relative text-white text-center">
        <div className="w-16 h-16 bg-gradient-to-tr from-amber-500/20 to-rose-500/20 border border-amber-500/30 rounded-full flex items-center justify-center mx-auto mb-4 text-amber-400">
          <svg className="w-8 h-8 text-amber-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>
        <h3 className="text-lg font-bold text-white mb-2">Demo Trial Limit Reached</h3>
        <p className="text-xs text-[#82889A] mb-6 leading-relaxed">
          You have reached the maximum limit of 3 optimization trials allowed in demo mode. Please sign in or create an account to unlock unlimited access!
        </p>
        <div className="flex flex-col gap-2">
          <button 
            onClick={() => {
              onClose();
              window.location.href = '/';
            }} 
            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white text-sm font-bold shadow-lg shadow-blue-500/10 transition-all cursor-pointer"
          >
            Sign In / Create Account
          </button>
          <button 
            onClick={onClose} 
            className="w-full py-2.5 rounded-xl border border-[#1E2538] hover:bg-gray-800/40 text-gray-400 hover:text-white text-sm font-semibold transition-all cursor-pointer"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default function DashboardClient({ user, initialUserCards, allMasterCards }: DashboardClientProps) {
  const [cards, setCards] = useState(initialUserCards);
  const [showDemoLimitModal, setShowDemoLimitModal] = useState(false);
  const [activeView, setActiveView] = useState('optimizer');

  const isDemo = user.id === 'demo-guest-user-id';

  const checkDemoTrial = useCallback(() => {
    if (!isDemo) return true;
    const trials = parseInt(localStorage.getItem('cw_demo_trials') || '0', 10);
    if (trials >= 3) {
      setShowDemoLimitModal(true);
      return false;
    }
    localStorage.setItem('cw_demo_trials', String(trials + 1));
    return true;
  }, [isDemo]);
  const [isWalletCollapsed, setIsWalletCollapsed] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  // Profile and display name state management
  const [currentUser, setCurrentUser] = useState<User>(user);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const userMetadata = currentUser?.user_metadata || {};
  const userFullName = userMetadata.full_name || userMetadata.name || currentUser?.email || 'Guest User';
  const userAvatarUrl = userMetadata.avatar_url || userMetadata.picture || null;
  const [editingName, setEditingName] = useState(userFullName);

  // Sync edit name state when user metadata loads
  useEffect(() => {
    setEditingName(userFullName);
  }, [userFullName]);

  // Automatically collapse wallet panel on mobile/tablet on load to keep screen space clean
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const handleResize = () => {
        if (window.innerWidth < 1024) {
          setIsWalletCollapsed(true);
        }
      };
      handleResize();
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, []);
  
  const [showDemoBanner, setShowDemoBanner] = useState(isDemo);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingName.trim()) return;

    // Update local state first to immediately refresh UI elements
    const updatedUser = {
      ...currentUser,
      user_metadata: {
        ...userMetadata,
        full_name: editingName
      }
    };
    setCurrentUser(updatedUser as User);

    if (isDemo) {
      alert("Profile updated successfully (demo mode)!");
      setShowProfileModal(false);
      return;
    }

    try {
      const { error } = await supabase.auth.updateUser({
        data: { full_name: editingName }
      });
      if (error) {
        alert("Error saving profile: " + error.message);
      } else {
        alert("Profile updated successfully!");
      }
    } catch (err) {
    } finally {
      setShowProfileModal(false);
    }
  };

  const supabase = createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
  const router = useRouter();

  const handleCardUpdate = useCallback(async () => {
    if (isDemo) return;

    const { data, error } = await supabase
      .from('user_owned_cards')
      .select(`*, cards(*)`)
      .eq('user_id', user.id);

    if (error) {
    } else if (data) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const formattedCards: Card[] = (data as any[]).map((item) => ({
          id: item.id,
          user_id: item.user_id,
          card_id: item.card_id,
          credit_limit: item.credit_limit,
          used_amount: item.used_amount,
          card_name: item.card_name || item.cards?.card_name || null,
          issuer: item.issuer || item.cards?.issuer || null,
          benefits: item.benefits || null,
          fees: item.fees || null,
          network: item.cards?.network || null,
          annual_fee: item.cards?.annual_fee || null,
          reward_rates: item.cards?.reward_rates || null,
          card_type: item.cards?.card_type || null,
          joining_fee: item.cards?.joining_fee || null,
          fee_waiver: item.cards?.fee_waiver || null,
          welcome_benefits: item.cards?.welcome_benefits || null,
          milestone_benefits: item.cards?.milestone_benefits || null,
          lounge_access: item.cards?.lounge_access || null,
          other_benefits: item.cards?.other_benefits || null,
          suitability: item.cards?.suitability || null,
      }));

      setCards(formattedCards);
    }
  }, [supabase, user.id, isDemo]);

  const handleLogout = async () => {
    if (isDemo) {
      router.push('/');
      return;
    }
    await supabase.auth.signOut();
    router.push('/');
  };

  const renderActiveView = () => {
    switch (activeView) {
      case 'optimizer':
        return <SpendOptimizer cards={cards} onTrialAction={checkDemoTrial} />;
      case 'tips':
        return <SmartTipsView user={currentUser} cards={cards} />;
      case 'chat':
        return <AiCardAdvisor cards={cards} onTrialAction={checkDemoTrial} />;
      case 'settings':
        return <Settings />;
      default:
        return <SpendOptimizer cards={cards} onTrialAction={checkDemoTrial} />;
    }
  };

  return (
    <div className="flex h-screen bg-[#090B10] text-white overflow-hidden font-sans relative">
      {/* Collapsible Mobile Sidebar Drawer */}
      <div 
        className={`fixed inset-y-0 left-0 z-50 transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } flex`}
      >
        <Sidebar 
          user={currentUser} 
          onLogout={handleLogout}
          activeView={activeView}
          setActiveView={(view) => {
            setActiveView(view);
            setIsSidebarOpen(false); // Auto-close drawer on mobile navigation click
          }}
          onClose={() => setIsSidebarOpen(false)}
          userFullName={userFullName}
          userAvatarUrl={userAvatarUrl}
          onProfileClick={() => setShowProfileModal(true)}
        />
      </div>

      {/* Backdrop overlay for mobile sidebar drawer */}
      {isSidebarOpen && (
        <div 
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden transition-opacity duration-300"
        />
      )}

      <main className="flex-1 p-6 flex flex-col h-full overflow-hidden">
        {/* Main Content Header Utility Row */}
        <div className="flex justify-between items-center mb-6 shrink-0">
          <div className="flex items-center gap-3">
            {/* Hamburger Icon Menu Button - Visible on Mobile only */}
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="md:hidden p-2 text-gray-400 hover:text-white transition-colors bg-[#131622] border border-[#1E2538] rounded-xl cursor-pointer"
              title="Open Menu"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              </svg>
            </button>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight tracking-tight">
              {activeView === 'optimizer' ? 'Optimize Your Spend' : activeView === 'tips' ? 'Smart Tips & Hacks' : activeView === 'chat' ? 'AI Card Advisor' : 'Settings'}
            </h1>
          </div>
          <div className="flex items-center text-[#82889A]">
            {userAvatarUrl ? (
              <img 
                src={userAvatarUrl} 
                alt="Profile" 
                onClick={() => setShowProfileModal(true)}
                className="w-8 h-8 rounded-full border border-[#2A334B] hover:border-blue-500/50 object-cover cursor-pointer transition-colors shadow-sm"
                title={userFullName}
              />
            ) : (
              <div 
                onClick={() => setShowProfileModal(true)}
                className="w-8 h-8 rounded-full bg-[#1E2538] border border-[#2A334B] flex items-center justify-center text-xs font-bold text-blue-400 select-none shadow-sm cursor-pointer hover:border-blue-400/50 transition-colors" 
                title={userFullName}
              >
                {userFullName.slice(0, 2).toUpperCase()}
              </div>
            )}
          </div>
        </div>

        {showDemoBanner && (
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-3 rounded-xl shadow-md mb-6 flex justify-between items-center transition-all duration-200 shrink-0">
            <div className="flex items-center gap-2">
              <span className="bg-white/20 text-white text-xs font-semibold px-2 py-0.5 rounded uppercase select-none">Demo Mode</span>
              <p className="text-sm font-medium">You&apos;re in demo mode — sign up to save your cards.</p>
            </div>
            <button 
              onClick={() => setShowDemoBanner(false)}
              className="text-white/80 hover:text-white hover:bg-white/10 rounded-lg p-1 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}
        <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-3 gap-6 relative">
          <div className={`${isWalletCollapsed ? 'lg:col-span-3' : 'lg:col-span-2'} h-full overflow-y-auto pr-1 transition-all duration-300`}>
            {renderActiveView()}
          </div>
          {!isWalletCollapsed && (
            <div className="h-full overflow-y-auto pr-1 transition-all duration-300">
              <CardList 
                cards={cards}
                allCards={allMasterCards}
                onCardUpdate={handleCardUpdate}
                isDemo={isDemo}
                setCards={setCards}
                onCollapseToggle={() => setIsWalletCollapsed(true)}
              />
            </div>
          )}
        </div>

        {/* Floating Expand Wallet Button */}
        {isWalletCollapsed && (
          <button 
            onClick={() => setIsWalletCollapsed(false)}
            className="fixed right-0 top-1/2 -translate-y-1/2 bg-[#131622] border-l border-t border-b border-[#1E2538] hover:border-gray-600/40 text-blue-400 p-2.5 rounded-l-xl shadow-lg transition-all z-40 select-none hover:text-white cursor-pointer"
            title="Expand Wallet"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
          </button>
        )}
      </main>

      {/* Edit Profile Modal */}
      {showProfileModal && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#0E111A] border border-[#1E2538] p-6 rounded-2xl w-full max-w-sm shadow-2xl relative text-white">
            <div className="flex justify-between items-center mb-6 select-none">
              <h2 className="text-lg font-bold text-white tracking-wide">Edit Profile</h2>
              <button 
                onClick={() => setShowProfileModal(false)} 
                className="text-gray-400 hover:text-white text-xl p-1 leading-none transition-colors cursor-pointer"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-5">
              <div className="flex flex-col items-center gap-3 mb-4 select-none">
                {userAvatarUrl ? (
                  <img src={userAvatarUrl} alt="Avatar" className="w-16 h-16 rounded-full object-cover border-2 border-blue-500/20 shadow-sm" />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-[#1E2538] border-2 border-blue-500/20 flex items-center justify-center text-lg font-bold text-blue-400">
                    {userFullName.slice(0, 2).toUpperCase()}
                  </div>
                )}
                <p className="text-xs text-[#82889A]">{currentUser?.email}</p>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#82889A] tracking-wider uppercase mb-2">Display Name</label>
                <input 
                  type="text" 
                  value={editingName} 
                  onChange={(e) => setEditingName(e.target.value)} 
                  className="w-full bg-[#131622] border border-[#1E2538] text-white p-3 rounded-xl focus:border-blue-500/50 focus:outline-none focus:ring-1 focus:ring-blue-500/50 text-sm font-semibold transition-all duration-200" 
                  placeholder="Your Name" 
                  required
                />
              </div>

              <div className="flex justify-end space-x-3 pt-3 border-t border-[#1E2538] select-none">
                <button 
                  type="button" 
                  onClick={() => setShowProfileModal(false)} 
                  className="px-5 py-2.5 rounded-xl border border-[#1E2538] hover:bg-gray-800/40 text-gray-400 hover:text-white text-sm font-semibold transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white text-sm font-bold shadow-lg shadow-blue-500/10 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {showDemoLimitModal && <DemoLimitModal onClose={() => setShowDemoLimitModal(false)} />}
    </div>
  );
}
