import React, { useState } from 'react';
import { IPhoneMockup } from 'react-device-mockup';
import { Smartphone, Monitor, Sparkles, RefreshCw } from 'lucide-react';

export const DeviceMockupWrapper = ({ 
  children, 
  title = "Mobile Preview", 
  defaultMode = "iphone16",
  allowToggle = true 
}) => {
  const [deviceMode, setDeviceMode] = useState(defaultMode); // 'iphone16' | 'fullscreen'

  return (
    <div className="min-h-screen bg-[#0D0F17] flex flex-col items-center selection:bg-[#FF7622]/20">
      {/* Top Device Control Tab Bar */}
      {allowToggle && (
        <div className="w-full bg-[#12141F]/90 backdrop-blur-md border-b border-white/10 sticky top-0 z-50 px-4 py-2.5 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <span className="w-2 h-2 rounded-full bg-[#FF7622] animate-pulse"></span>
            <span className="text-xs font-black text-white tracking-wide">
              {title}
            </span>
            <span className="hidden sm:inline-block text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/10 text-slate-300">
              iPhone 16 • Dynamic Island
            </span>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="flex items-center bg-black/40 p-1 rounded-xl border border-white/10">
            <button
              onClick={() => setDeviceMode('iphone16')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                deviceMode === 'iphone16'
                  ? 'bg-[#FF7622] text-white shadow-md shadow-[#FF7622]/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>iPhone 16 Tab</span>
            </button>

            <button
              onClick={() => setDeviceMode('fullscreen')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                deviceMode === 'fullscreen'
                  ? 'bg-[#FF7622] text-white shadow-md shadow-[#FF7622]/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Monitor className="w-3.5 h-3.5" />
              <span>Full Screen</span>
            </button>
          </div>
        </div>
      )}

      {/* Content Rendering */}
      {deviceMode === 'iphone16' ? (
        <div className="flex-1 w-full flex flex-col items-center justify-center p-4 sm:p-8 overflow-y-auto">
          <div className="relative transform transition-all duration-300 drop-shadow-[0_25px_50px_rgba(0,0,0,0.8)]">
            <IPhoneMockup
              screenWidth={393}
              screenType="island"
              frameColor="#1E2028"
              hideStatusBar={false}
              transparentNavBar={true}
              containerStlye={{
                margin: '0 auto',
                borderRadius: '54px',
              }}
            >
              {/* iPhone 16 Screen Content Container */}
              <div className="w-full h-full overflow-y-auto overflow-x-hidden bg-transparent text-[#181C2E] select-text">
                {children}
              </div>
            </IPhoneMockup>
          </div>
        </div>
      ) : (
        <div className="w-full flex-1 bg-[#F8F9FD]">
          {children}
        </div>
      )}
    </div>
  );
};
