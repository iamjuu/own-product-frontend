import React from 'react';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';

export const MasterAdminLayout = ({ currentRoute, onRouteChange, onRefresh, children }) => {
  return (
    <div className="flex h-screen w-screen bg-[#f0f2fb] text-[#181829] overflow-hidden font-sans">
      {/* Floating Purple Sidebar */}
      <Sidebar currentRoute={currentRoute} onRouteChange={onRouteChange} />

      {/* Main Content Pane */}
      <div className="flex-1 flex flex-col h-full min-w-0 overflow-hidden">
        {/* Top Header */}
        <Topbar currentRoute={currentRoute} onRefresh={onRefresh} />

        {/* Scrollable View Area */}
        <main className="flex-1 overflow-y-auto px-6 py-2 pb-8">
          <div className="max-w-[1400px] mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
};
