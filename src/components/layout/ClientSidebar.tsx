import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Play,
  BookOpen,
  Key,
  History,
  CreditCard,
  Menu,
  X,
  Sparkles,
} from 'lucide-react';

interface ClientSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const navigation = [
  { name: 'Dashboard', href: '/client', icon: LayoutDashboard },
  { name: 'Run Workflow', href: '/client/workflows/new', icon: Play },
  { name: 'Demo Workflows', href: '/client/demo', icon: BookOpen },
  { name: 'Workflow History', href: '/client/history', icon: History },
  { name: 'API Keys', href: '/client/api-keys', icon: Key },
  { name: 'Usage & Billing', href: '/client/billing', icon: CreditCard },
];

export const ClientSidebar: React.FC<ClientSidebarProps> = ({ isOpen, onClose }) => {
  return (
    <>
      <div
        className={`fixed inset-0 bg-slate-900 bg-opacity-50 z-20 lg:hidden transition-opacity ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      <aside
        className={`
          fixed top-0 left-0 z-30 h-full w-64 bg-black/40 backdrop-blur-xl border-r border-white/10
          transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0 lg:static
        `}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-6 border-b border-white/10">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">
                Client Portal
              </span>
            </div>
            <button
              onClick={onClose}
              className="lg:hidden text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {navigation.map((item) => (
              <NavLink
                key={item.name}
                to={item.href}
                end={item.href === '/client'}
                onClick={() => onClose()}
                className={({ isActive }) =>
                  `flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-300 ${
                    isActive
                      ? 'bg-gradient-to-r from-blue-500/20 to-cyan-500/20 text-white border border-blue-400/30'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <item.icon className="w-5 h-5" />
                    <span className="font-medium">{item.name}</span>
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          <div className="p-4 border-t border-white/10">
            <div className="p-4 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-lg border border-blue-400/20">
              <p className="text-xs font-semibold text-blue-400 mb-1">Need Help?</p>
              <p className="text-xs text-gray-300 mb-3">
                Check our documentation or contact support
              </p>
              <a
                href="/docs"
                className="text-xs text-blue-400 hover:text-blue-300 font-medium"
              >
                View Documentation →
              </a>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
