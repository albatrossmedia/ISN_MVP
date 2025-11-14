import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Box,
  Database,
  Zap,
  FileText,
  Users,
  Activity,
  Menu,
  X,
  BarChart3,
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Models', href: '/dashboard/models', icon: Box },
  { name: 'Model Performance', href: '/dashboard/model-performance', icon: BarChart3 },
  { name: 'Datasets', href: '/dashboard/datasets', icon: Database },
  { name: 'Dataset Performance', href: '/dashboard/dataset-performance', icon: BarChart3 },
  { name: 'Jobs', href: '/dashboard/jobs', icon: Zap },
  { name: 'Audit Logs', href: '/dashboard/audit-logs', icon: FileText },
  { name: 'Users & Access', href: '/dashboard/users', icon: Users },
  { name: 'System Health', href: '/dashboard/system-health', icon: Activity },
];

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
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
                <Box className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">
                IndicSubtitle
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
            <div className="text-xs text-gray-500 text-center">
              MDMS v1.0.0
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
