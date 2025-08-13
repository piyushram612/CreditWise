'use client';

import { Capacitor } from '@capacitor/core';
import { App } from '@capacitor/app';
import { StatusBar, Style } from '@capacitor/status-bar';
import { SplashScreen } from '@capacitor/splash-screen';
import { Haptics, ImpactStyle } from '@capacitor/haptics';

export const isNativeApp = () => Capacitor.isNativePlatform();

export const initializeApp = async () => {
  if (!isNativeApp()) return;

  try {
    // Hide splash screen after app loads
    await SplashScreen.hide();

    // Set status bar style
    await StatusBar.setStyle({ style: Style.Dark });
    await StatusBar.setBackgroundColor({ color: '#000000' });

    // Handle app state changes
    App.addListener('appStateChange', ({ isActive }) => {
      console.log('App state changed. Is active?', isActive);
    });

    // Handle back button on Android
    App.addListener('backButton', ({ canGoBack }) => {
      if (!canGoBack) {
        App.exitApp();
      } else {
        window.history.back();
      }
    });

  } catch (error) {
    console.error('Error initializing native app:', error);
  }
};

// Utility functions for native features
export const hapticFeedback = async (style: ImpactStyle = ImpactStyle.Medium) => {
  if (isNativeApp()) {
    try {
      await Haptics.impact({ style });
    } catch (error) {
      console.error('Haptic feedback error:', error);
    }
  }
};

export const exitApp = () => {
  if (isNativeApp()) {
    App.exitApp();
  }
};