import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { X, Sparkles, ChevronRight } from 'lucide-react';
import { Button } from '../ui/Button';
import { useOnboarding } from '../../contexts/OnboardingContext';

export const FeatureAnnouncement: React.FC = () => {
  const { announcements } = useOnboarding();
  const [dismissedIds, setDismissedIds] = useState<Set<string>>(new Set());

  const visibleAnnouncements = announcements.filter(
    (a) => !dismissedIds.has(a.id)
  );

  if (visibleAnnouncements.length === 0) {
    return null;
  }

  const announcement = visibleAnnouncements[0];

  const handleDismiss = (id: string) => {
    setDismissedIds(prev => new Set(prev).add(id));
    localStorage.setItem(`dismissed-announcement-${id}`, 'true');
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'new_feature':
        return 'from-blue-500/10 to-cyan-500/10 border-blue-400/20';
      case 'improvement':
        return 'from-green-500/10 to-emerald-500/10 border-green-400/20';
      case 'update':
        return 'from-purple-500/10 to-pink-500/10 border-purple-400/20';
      default:
        return 'from-slate-500/10 to-slate-600/10 border-slate-400/20';
    }
  };

  return (
    <div
      className={`relative rounded-xl bg-gradient-to-br ${getTypeColor(
        announcement.type
      )} border p-6 mb-6 overflow-hidden`}
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/5 to-transparent rounded-full blur-3xl" />

      <button
        onClick={() => handleDismiss(announcement.id)}
        className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors z-10"
      >
        <X className="w-5 h-5" />
      </button>

      <div className="relative flex items-start gap-4">
        <div className="flex-shrink-0">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start gap-2 mb-2">
            <h3 className="text-lg font-semibold text-white">
              {announcement.title}
            </h3>
            <span className="px-2 py-0.5 text-xs font-medium bg-blue-500/20 text-blue-400 rounded-full">
              NEW
            </span>
          </div>

          <p className="text-sm text-gray-300 mb-4 max-w-2xl">
            {announcement.description}
          </p>

          {announcement.action_url && announcement.action_label && (
            <Link to={announcement.action_url}>
              <Button size="sm" variant="secondary">
                {announcement.action_label}
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};
