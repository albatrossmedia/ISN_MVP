import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import {
  CheckCircle,
  Circle,
  PlayCircle,
  Key,
  BookOpen,
  ChevronDown,
  ChevronUp,
  X,
} from 'lucide-react';
import { useOnboarding } from '../../contexts/OnboardingContext';
import type { ChecklistItem } from '../../types/onboarding';

export const QuickStartChecklist: React.FC = () => {
  const navigate = useNavigate();
  const { onboarding, completeStep, preferences, updatePreferences } = useOnboarding();
  const [isExpanded, setIsExpanded] = useState(true);
  const [isVisible, setIsVisible] = useState(true);

  const checklistItems: ChecklistItem[] = [
    {
      id: 'demo_workflow',
      title: 'Try a Demo Workflow',
      description: 'See how subtitle generation works',
      completed: onboarding?.completed_steps.includes('demo_workflow') || false,
      action: () => {
        navigate('/client/demo');
        completeStep('demo_workflow');
      },
      icon: BookOpen,
    },
    {
      id: 'api_key_setup',
      title: 'Generate Your First API Key',
      description: 'Enable programmatic access',
      completed: onboarding?.completed_steps.includes('api_key_setup') || false,
      action: () => {
        navigate('/client/api-keys');
        completeStep('api_key_setup');
      },
      icon: Key,
    },
    {
      id: 'first_workflow',
      title: 'Run Your First Workflow',
      description: 'Upload a video and generate subtitles',
      completed: onboarding?.completed_steps.includes('first_workflow') || false,
      action: () => {
        navigate('/client/workflows/new');
        completeStep('first_workflow');
      },
      icon: PlayCircle,
    },
  ];

  const completedCount = checklistItems.filter(item => item.completed).length;
  const totalCount = checklistItems.length;
  const progress = (completedCount / totalCount) * 100;

  const handleDismiss = async () => {
    await updatePreferences({ show_welcome_message: false });
    setIsVisible(false);
  };

  if (!isVisible || onboarding?.is_completed || onboarding?.skipped) {
    return null;
  }

  if (!preferences?.show_welcome_message) {
    return null;
  }

  return (
    <Card className="p-6 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border-blue-400/20 relative">
      <button
        onClick={handleDismiss}
        className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
      >
        <X className="w-5 h-5" />
      </button>

      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h3 className="text-lg font-semibold text-white">Quick Start Guide</h3>
            <p className="text-sm text-gray-400">
              {completedCount} of {totalCount} completed
            </p>
          </div>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-gray-400 hover:text-white transition-colors"
          >
            {isExpanded ? (
              <ChevronUp className="w-5 h-5" />
            ) : (
              <ChevronDown className="w-5 h-5" />
            )}
          </button>
        </div>

        <div className="relative h-2 bg-slate-700 rounded-full overflow-hidden">
          <div
            className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-500 to-cyan-500 transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {isExpanded && (
        <div className="space-y-3">
          {checklistItems.map((item) => (
            <div
              key={item.id}
              className={`flex items-start gap-3 p-3 rounded-lg border transition-all ${
                item.completed
                  ? 'bg-green-500/10 border-green-400/20'
                  : 'bg-slate-800 border-slate-700 hover:border-slate-600'
              }`}
            >
              <div className="flex-shrink-0 mt-0.5">
                {item.completed ? (
                  <CheckCircle className="w-5 h-5 text-green-400" />
                ) : (
                  <Circle className="w-5 h-5 text-gray-500" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h4
                  className={`text-sm font-medium mb-1 ${
                    item.completed ? 'text-green-400 line-through' : 'text-white'
                  }`}
                >
                  {item.title}
                </h4>
                <p className="text-xs text-gray-400">{item.description}</p>
              </div>
              {!item.completed && (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={item.action}
                  className="flex-shrink-0"
                >
                  <item.icon className="w-4 h-4" />
                </Button>
              )}
            </div>
          ))}

          {completedCount === totalCount && (
            <div className="text-center py-4">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-3">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
              <h4 className="text-sm font-semibold text-white mb-1">
                Great job! You're all set! 🎉
              </h4>
              <p className="text-xs text-gray-400 mb-3">
                You've completed the quick start guide
              </p>
              <Button
                size="sm"
                variant="primary"
                onClick={() => navigate('/client/workflows/new')}
              >
                Start Creating
              </Button>
            </div>
          )}
        </div>
      )}
    </Card>
  );
};
