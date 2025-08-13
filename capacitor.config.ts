import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.creditwise.app',
  appName: 'CreditWise',
  webDir: 'dist', // This won't be used since we're using server.url
  server: {
    url: 'https://creditwise-omega.vercel.app',
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: "#000000",
      showSpinner: false,
      androidSplashResourceName: "splash",
      androidScaleType: "CENTER_CROP"
    },
    StatusBar: {
      backgroundColor: "#000000",
      style: "DARK"
    },
    App: {
      launchUrl: "https://creditwise-omega.vercel.app"
    }
  },
  android: {
    allowMixedContent: true,
    captureInput: true,
    webContentsDebuggingEnabled: true
  }
};

export default config;
