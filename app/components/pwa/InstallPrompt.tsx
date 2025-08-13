'use client';

import { useState, useEffect } from 'react';
import { isNativeApp } from '@/app/utils/capacitor';

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showInstallButton, setShowInstallButton] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // Detect iOS
    const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    setIsIOS(iOS);

    // Check if already installed (standalone mode)
    const standalone = window.matchMedia('(display-mode: standalone)').matches || 
                      (window.navigator as { standalone?: boolean }).standalone === true;
    setIsStandalone(standalone);

    // Android install prompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShowInstallButton(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Show iOS prompt if not already installed
    if (iOS && !standalone) {
      // Check if user has dismissed the prompt recently
      const dismissed = localStorage.getItem('ios-install-dismissed');
      const dismissedTime = dismissed ? parseInt(dismissed) : 0;
      const oneDayAgo = Date.now() - (24 * 60 * 60 * 1000);
      
      if (dismissedTime < oneDayAgo) {
        setShowInstallButton(true);
      }
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      // Android
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      
      if (outcome === 'accepted') {
        setDeferredPrompt(null);
        setShowInstallButton(false);
      }
    }
    // For iOS, the instructions are shown in the prompt itself
  };

  const handleDismiss = () => {
    setShowInstallButton(false);
    if (isIOS) {
      localStorage.setItem('ios-install-dismissed', Date.now().toString());
    }
  };

  if (!showInstallButton || isStandalone || isNativeApp()) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 bg-black text-white p-4 rounded-lg shadow-lg z-50 md:left-auto md:right-4 md:max-w-sm">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="font-semibold mb-1">Install CreditWise</h3>
          {isIOS ? (
            <div className="text-sm text-gray-300">
              <p className="mb-2">Add to your home screen for the best experience:</p>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-blue-400">1.</span>
                <span>Tap the Share button</span>
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z"/>
                </svg>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-blue-400">2.</span>
                <span>Select &quot;Add to Home Screen&quot;</span>
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd"/>
                </svg>
              </div>
            </div>
          ) : (
            <p className="text-sm text-gray-300">Add to your home screen for quick access</p>
          )}
        </div>
        <div className="flex flex-col gap-2 ml-4">
          <button
            onClick={handleDismiss}
            className="px-3 py-1 text-sm text-gray-300 hover:text-white"
          >
            Later
          </button>
          {!isIOS && (
            <button
              onClick={handleInstallClick}
              className="px-4 py-2 bg-white text-black rounded text-sm font-medium hover:bg-gray-100"
            >
              Install
            </button>
          )}
        </div>
      </div>
    </div>
  );
}