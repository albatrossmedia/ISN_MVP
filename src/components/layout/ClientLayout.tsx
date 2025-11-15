import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { ClientSidebar } from './ClientSidebar';
import { TopBar } from './TopBar';

export const ClientLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <ClientSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="lg:pl-64">
        <TopBar onMenuClick={() => setSidebarOpen(true)} />

        <main className="p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
