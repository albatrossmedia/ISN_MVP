import React, { useState } from 'react';
import { HelpCircle } from 'lucide-react';
import { useOnboarding } from '../../contexts/OnboardingContext';

interface HelpTooltipProps {
  content: string;
  placement?: 'top' | 'bottom' | 'left' | 'right';
  className?: string;
}

export const HelpTooltip: React.FC<HelpTooltipProps> = ({
  content,
  placement = 'top',
  className = '',
}) => {
  const { preferences } = useOnboarding();
  const [isVisible, setIsVisible] = useState(false);

  if (!preferences?.show_tooltips) {
    return null;
  }

  const getTooltipPosition = () => {
    switch (placement) {
      case 'bottom':
        return 'top-full mt-2 left-1/2 -translate-x-1/2';
      case 'left':
        return 'right-full mr-2 top-1/2 -translate-y-1/2';
      case 'right':
        return 'left-full ml-2 top-1/2 -translate-y-1/2';
      default:
        return 'bottom-full mb-2 left-1/2 -translate-x-1/2';
    }
  };

  const getArrowPosition = () => {
    switch (placement) {
      case 'bottom':
        return 'bottom-full left-1/2 -translate-x-1/2 border-b-slate-800';
      case 'left':
        return 'left-full top-1/2 -translate-y-1/2 border-l-slate-800';
      case 'right':
        return 'right-full top-1/2 -translate-y-1/2 border-r-slate-800';
      default:
        return 'top-full left-1/2 -translate-x-1/2 border-t-slate-800';
    }
  };

  return (
    <div className={`relative inline-block ${className}`}>
      <button
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        onClick={() => setIsVisible(!isVisible)}
        className="text-gray-400 hover:text-blue-400 transition-colors"
      >
        <HelpCircle className="w-4 h-4" />
      </button>

      {isVisible && (
        <div
          className={`absolute z-50 ${getTooltipPosition()} pointer-events-none animate-in fade-in-0 zoom-in-95`}
        >
          <div className="relative bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 shadow-xl max-w-xs">
            <p className="text-xs text-gray-300 leading-relaxed">{content}</p>
            <div
              className={`absolute w-0 h-0 border-4 border-transparent ${getArrowPosition()}`}
            />
          </div>
        </div>
      )}
    </div>
  );
};
