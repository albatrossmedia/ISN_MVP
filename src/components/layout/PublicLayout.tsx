import { Link } from 'react-router-dom';
import { Sparkles } from 'lucide-react';

interface PublicLayoutProps {
  children: React.ReactNode;
}

export const PublicLayout = ({ children }: PublicLayoutProps) => {
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-black to-slate-950"></div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-900/20 via-transparent to-transparent"></div>

      <div className="relative">
        <nav className="border-b border-white/5 backdrop-blur-xl bg-black/30 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <Link to="/" className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                  <Sparkles className="w-6 h-6" />
                </div>
                <span className="text-xl font-bold">IndicSubtitleNet</span>
              </Link>

              <div className="hidden md:flex items-center gap-6">
                <Link to="/models" className="text-gray-300 hover:text-white transition-colors">
                  Models
                </Link>
                <Link to="/datasets" className="text-gray-300 hover:text-white transition-colors">
                  Datasets
                </Link>
                <Link to="/news" className="text-gray-300 hover:text-white transition-colors">
                  News
                </Link>
                <Link to="/pricing" className="text-gray-300 hover:text-white transition-colors">
                  Pricing
                </Link>
                <Link to="/about" className="text-gray-300 hover:text-white transition-colors">
                  About
                </Link>
                <Link to="/contact" className="text-gray-300 hover:text-white transition-colors">
                  Contact
                </Link>
              </div>

              <div className="flex items-center gap-3">
                <Link
                  to="/login"
                  className="px-4 py-2 rounded-lg text-gray-300 hover:text-white transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/dashboard"
                  className="px-6 py-2.5 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 transition-all duration-300 font-medium"
                >
                  Get Started
                </Link>
              </div>
            </div>
          </div>
        </nav>

        <main>{children}</main>

        <footer className="border-t border-white/5 backdrop-blur-xl bg-black/30 mt-20">
          <div className="max-w-7xl mx-auto px-6 py-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                  <Sparkles className="w-5 h-5" />
                </div>
                <span className="font-semibold">IndicSubtitleNet</span>
              </div>
              <p className="text-gray-500 text-sm">
                AI-Powered Subtitle Generation Platform
              </p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};
