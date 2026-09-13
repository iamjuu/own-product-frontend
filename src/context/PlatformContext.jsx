import React, { createContext, useContext, useState, useEffect } from 'react';
import ApiClient from '../api/client';

const PlatformContext = createContext(null);

export const PlatformProvider = ({ children }) => {
  const [appearance, setAppearance] = useState({
    platformName: 'HyperLocal Marketplace',
    tagline: 'Your city\'s fastest multi-vendor marketplace.',
    logoUrl: 'https://images.unsplash.com/photo-1516876437184-593fda40c7ce?w=128&auto=format&fit=crop&q=80',
    primaryThemeColor: '#4f46e5',
    secondaryThemeColor: '#06b6d4',
  });

  const [settings, setSettings] = useState({
    openingTime: '07:00 AM',
    closingTime: '10:00 PM',
    timezone: 'Asia/Kolkata',
    acceptOrdersGlobally: true,
    baseDeliveryFee: 30,
    freeDeliveryThreshold: 499,
  });

  const [loading, setLoading] = useState(true);

  const fetchPlatformConfig = async () => {
    try {
      const [appRes, setRes] = useState ? await Promise.all([
        ApiClient.get('/public/appearance').catch(() => ({ data: appearance })),
        ApiClient.get('/public/settings').catch(() => ({ data: settings })),
      ]) : [];

      if (appRes?.data) setAppearance(appRes.data);
      if (setRes?.data) setSettings(setRes.data);
    } catch (err) {
      console.error('Error loading platform config:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlatformConfig();
  }, []);

  return (
    <PlatformContext.Provider
      value={{
        appearance,
        setAppearance,
        settings,
        setSettings,
        reloadPlatformConfig: fetchPlatformConfig,
        loading,
      }}
    >
      {children}
    </PlatformContext.Provider>
  );
};

export const usePlatform = () => {
  const context = useContext(PlatformContext);
  if (!context) {
    throw new Error('usePlatform must be used within a PlatformProvider');
  }
  return context;
};
