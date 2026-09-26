import React, { useState, useEffect } from 'react';
import {
  MapPin,
  Bell,
  Volume2,
  CheckCircle2,
  ShieldCheck,
  Sparkles,
  Navigation,
  AlertCircle,
  ArrowRight,
  X,
  Compass,
  Check,
  ChevronRight
} from 'lucide-react';
import { unlockAudioContext, playOrderChime } from '../../utils/soundAlert';

export const InitialPermissionsModal = ({
  isOpen = true,
  onClose,
  isSignup = false,
  userRole = 'CUSTOMER',
}) => {
  const [locationStatus, setLocationStatus] = useState('pending'); // 'pending' | 'requesting' | 'granted' | 'denied' | 'unsupported'
  const [notificationStatus, setNotificationStatus] = useState('pending'); // 'pending' | 'granted' | 'denied' | 'unsupported'
  const [audioStatus, setAudioStatus] = useState('pending'); // 'pending' | 'granted'
  const [detectedAddress, setDetectedAddress] = useState('');
  const [locationCoords, setLocationCoords] = useState(null);
  const [isEnablingAll, setIsEnablingAll] = useState(false);

  // Initialize current permission states
  useEffect(() => {
    // 1. Notifications initial check
    if (typeof window !== 'undefined' && 'Notification' in window) {
      if (Notification.permission === 'granted') {
        setNotificationStatus('granted');
      } else if (Notification.permission === 'denied') {
        setNotificationStatus('denied');
      }
    } else {
      setNotificationStatus('unsupported');
    }

    // 2. Location initial check via Permissions API (if available)
    if (typeof navigator !== 'undefined' && navigator.permissions && navigator.permissions.query) {
      navigator.permissions
        .query({ name: 'geolocation' })
        .then((perm) => {
          if (perm.state === 'granted') {
            setLocationStatus('granted');
            // Try reading cached address if available
            try {
              const saved = JSON.parse(localStorage.getItem('user_coords') || '{}');
              if (saved.address) setDetectedAddress(saved.address);
            } catch (e) {}
          } else if (perm.state === 'denied') {
            setLocationStatus('denied');
          }
        })
        .catch(() => {});
    }

    // 3. Check if location coords are already saved in localStorage
    try {
      const savedCoords = JSON.parse(localStorage.getItem('user_coords') || 'null');
      if (savedCoords && savedCoords.lat && savedCoords.lng) {
        setLocationCoords(savedCoords);
        if (savedCoords.address) setDetectedAddress(savedCoords.address);
        setLocationStatus('granted');
      }
    } catch (e) {}
  }, []);

  // Request Location
  const requestLocation = () => {
    return new Promise((resolve) => {
      if (!('geolocation' in navigator)) {
        setLocationStatus('unsupported');
        resolve(null);
        return;
      }

      setLocationStatus('requesting');

      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const lat = Number(pos.coords.latitude.toFixed(6));
          const lng = Number(pos.coords.longitude.toFixed(6));
          const coordsObj = { lat, lng };
          setLocationCoords(coordsObj);

          let displayAddr = `${lat}, ${lng}`;
          try {
            const res = await fetch(
              `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`
            );
            const data = await res.json();
            if (data && data.address) {
              const road = data.address.road || data.address.suburb || data.display_name?.split(',')[0] || '';
              const city = data.address.city || data.address.town || data.address.state_district || 'Bengaluru';
              displayAddr = road ? `${road}, ${city}` : city;
            }
          } catch (e) {
            // Keep default coordinate string
          }

          setDetectedAddress(displayAddr);
          setLocationStatus('granted');

          localStorage.setItem(
            'user_coords',
            JSON.stringify({ lat, lng, address: displayAddr })
          );

          if (typeof window !== 'undefined') {
            window.dispatchEvent(
              new CustomEvent('app_location_updated', {
                detail: { lat, lng, address: displayAddr },
              })
            );
          }

          resolve({ lat, lng, address: displayAddr });
        },
        (err) => {
          console.warn('Geolocation permission error:', err.message);
          setLocationStatus('denied');
          resolve(null);
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    });
  };

  // Request Notifications
  const requestNotifications = async () => {
    if (!('Notification' in window)) {
      setNotificationStatus('unsupported');
      return 'unsupported';
    }

    try {
      const permission = await Notification.requestPermission();
      setNotificationStatus(permission);

      if (permission === 'granted') {
        try {
          new Notification('Local Run Notifications Enabled 🎉', {
            body: 'You will now receive live alerts for order preparation and arrival!',
            icon: '/favicon.ico',
          });
        } catch (e) {}
      }
      return permission;
    } catch (e) {
      setNotificationStatus('denied');
      return 'denied';
    }
  };

  // Request Audio / Sound
  const requestAudio = async () => {
    try {
      await unlockAudioContext();
      playOrderChime();
      setAudioStatus('granted');
      return true;
    } catch (e) {
      return false;
    }
  };

  // Enable All Permissions at Once
  const handleEnableAll = async () => {
    setIsEnablingAll(true);
    await requestAudio();
    await requestNotifications();
    await requestLocation();
    setIsEnablingAll(false);
  };

  // Close & Save Configured Flag
  const handleFinish = () => {
    localStorage.setItem('app_permissions_configured', 'true');
    sessionStorage.removeItem('pending_permissions_setup');
    onClose?.();
  };

  const isRider = userRole === 'DELIVERY_PARTNER' || userRole === 'delivery_boy';

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Top Header Banner with Brand Gradient */}
        <div className="bg-gradient-to-br from-[#181C2E] via-[#21263F] to-[#121422] text-white p-6 relative overflow-hidden">
          <div className="absolute -top-12 -right-12 w-44 h-44 rounded-full bg-[#FF7622]/20 blur-2xl pointer-events-none"></div>
          <div className="absolute -bottom-8 -left-8 w-36 h-36 rounded-full bg-[#6339f4]/25 blur-2xl pointer-events-none"></div>

          <div className="relative z-10 space-y-2">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider bg-orange-500/20 text-[#FFA767] border border-orange-500/30">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{isSignup ? 'Welcome • Quick Setup' : 'App Permissions'}</span>
              </span>
              <button
                onClick={handleFinish}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white flex items-center justify-center transition-all"
                title="Skip for now"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <h2 className="text-xl font-black tracking-tight text-white">
              {isRider
                ? 'Enable Location & Dispatch Alerts'
                : 'Turn On Location & Live Updates'}
            </h2>
            <p className="text-xs text-slate-300 leading-relaxed">
              {isRider
                ? 'Required for continuous delivery alarms, turn-by-turn navigation, and live GPS streaming to customers.'
                : 'Enable GPS and instant notifications for real-time street tracking, doorstep delivery, and order alerts.'}
            </p>
          </div>
        </div>

        {/* Permissions Checklist Cards */}
        <div className="p-6 overflow-y-auto space-y-3.5 flex-1">
          {/* 1. Precise GPS Location */}
          <div
            className={`p-4 rounded-2xl border transition-all ${
              locationStatus === 'granted'
                ? 'bg-emerald-50/60 border-emerald-200'
                : locationStatus === 'denied'
                ? 'bg-rose-50/50 border-rose-200'
                : 'bg-slate-50 border-slate-200 hover:border-orange-300'
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start space-x-3">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                    locationStatus === 'granted'
                      ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/30'
                      : 'bg-orange-500/10 text-[#FF7622]'
                  }`}
                >
                  <MapPin className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <h4 className="text-xs font-black text-slate-900">
                      Precise GPS Location
                    </h4>
                    {locationStatus === 'granted' && (
                      <span className="inline-flex items-center text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                        <Check className="w-3 h-3 mr-0.5" /> Granted
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-600 leading-tight">
                    {isRider
                      ? 'Broadcasts your live bike location to customer radar and kitchen.'
                      : 'Pinpoints doorstep delivery and shows nearest kitchen inventory.'}
                  </p>
                  {detectedAddress && (
                    <p className="text-[11px] font-bold text-emerald-800 bg-emerald-100/70 p-1.5 rounded-lg font-mono">
                      📍 {detectedAddress}
                    </p>
                  )}
                  {locationStatus === 'denied' && (
                    <p className="text-[10px] font-bold text-rose-600 flex items-center space-x-1">
                      <AlertCircle className="w-3 h-3" />
                      <span>Permission blocked. Please allow location in browser bar.</span>
                    </p>
                  )}
                </div>
              </div>

              {locationStatus !== 'granted' && (
                <button
                  type="button"
                  onClick={requestLocation}
                  disabled={locationStatus === 'requesting'}
                  className="px-3 py-1.5 rounded-xl bg-[#FF7622] hover:bg-[#E56314] text-white text-xs font-bold shrink-0 transition-all shadow-xs disabled:opacity-50"
                >
                  {locationStatus === 'requesting' ? 'Detecting...' : 'Allow GPS'}
                </button>
              )}
            </div>
          </div>

          {/* 2. Order Push Notifications */}
          <div
            className={`p-4 rounded-2xl border transition-all ${
              notificationStatus === 'granted'
                ? 'bg-emerald-50/60 border-emerald-200'
                : notificationStatus === 'denied'
                ? 'bg-rose-50/50 border-rose-200'
                : 'bg-slate-50 border-slate-200 hover:border-purple-300'
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start space-x-3">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                    notificationStatus === 'granted'
                      ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/30'
                      : 'bg-purple-500/10 text-[#6339f4]'
                  }`}
                >
                  <Bell className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <h4 className="text-xs font-black text-slate-900">
                      Instant Push Notifications
                    </h4>
                    {notificationStatus === 'granted' && (
                      <span className="inline-flex items-center text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                        <Check className="w-3 h-3 mr-0.5" /> Enabled
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-600 leading-tight">
                    {isRider
                      ? 'Instant push alert sound when new high-paying orders are broadcast.'
                      : 'Receive alerts when your order is accepted, prepped, and arriving.'}
                  </p>
                  {notificationStatus === 'denied' && (
                    <p className="text-[10px] font-bold text-rose-600 flex items-center space-x-1">
                      <AlertCircle className="w-3 h-3" />
                      <span>Notifications blocked. Enable in your browser settings.</span>
                    </p>
                  )}
                </div>
              </div>

              {notificationStatus !== 'granted' && (
                <button
                  type="button"
                  onClick={requestNotifications}
                  className="px-3 py-1.5 rounded-xl bg-[#6339f4] hover:bg-[#5229db] text-white text-xs font-bold shrink-0 transition-all shadow-xs"
                >
                  Allow Alerts
                </button>
              )}
            </div>
          </div>

          {/* 3. Audio & Alarm Sound Engine */}
          <div
            className={`p-4 rounded-2xl border transition-all ${
              audioStatus === 'granted'
                ? 'bg-emerald-50/60 border-emerald-200'
                : 'bg-slate-50 border-slate-200 hover:border-amber-300'
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start space-x-3">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                    audioStatus === 'granted'
                      ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/30'
                      : 'bg-amber-500/10 text-amber-600'
                  }`}
                >
                  <Volume2 className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <h4 className="text-xs font-black text-slate-900">
                      Audio Engine & Order Alarms
                    </h4>
                    {audioStatus === 'granted' && (
                      <span className="inline-flex items-center text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                        <Check className="w-3 h-3 mr-0.5" /> Unlocked
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-600 leading-tight">
                    {isRider
                      ? 'Unlocks browser autoplay so loud ticket sirens sound without mute.'
                      : 'Unlocks pleasant arrival pings and melodic status alerts.'}
                  </p>
                </div>
              </div>

              {audioStatus !== 'granted' && (
                <button
                  type="button"
                  onClick={requestAudio}
                  className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs shrink-0 transition-all shadow-xs"
                >
                  Enable Audio
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="p-5 bg-slate-50 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            type="button"
            onClick={handleFinish}
            className="text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors order-2 sm:order-1"
          >
            I'll Configure Later
          </button>

          <div className="flex items-center space-x-2.5 w-full sm:w-auto order-1 sm:order-2">
            {locationStatus !== 'granted' || notificationStatus !== 'granted' || audioStatus !== 'granted' ? (
              <button
                type="button"
                onClick={handleEnableAll}
                disabled={isEnablingAll}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#FF7622] to-[#FFA767] hover:from-[#E56314] hover:to-[#FF9544] text-white font-extrabold text-xs shadow-md shadow-orange-500/25 transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{isEnablingAll ? 'Enabling...' : 'Enable All Permissions'}</span>
              </button>
            ) : null}

            <button
              type="button"
              onClick={handleFinish}
              className={`w-full sm:w-auto px-6 py-2.5 rounded-xl font-extrabold text-xs transition-all flex items-center justify-center space-x-1.5 ${
                locationStatus === 'granted'
                  ? 'bg-slate-900 hover:bg-slate-800 text-white shadow-md'
                  : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-100'
              }`}
            >
              <span>Continue</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
