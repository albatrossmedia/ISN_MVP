import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import {
  Sparkles,
  PlayCircle,
  Key,
  CheckCircle,
  ArrowRight,
  X
} from 'lucide-react';
import { useOnboarding } from '../../contexts/OnboardingContext';
import { useAuth } from '../../contexts/AuthContext';

interface WelcomeWizardProps {
  isOpen: boolean;
  onClose: () => void;
}

export const WelcomeWizard: React.FC<WelcomeWizardProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const { completeStep, skipOnboarding } = useOnboarding();
  const { user, isClientUser } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);

  const clientSteps = [
    {
      title: 'Welcome to IndicSubtitleNet! 🎉',
      description: 'Your AI-powered subtitle generation platform',
      content: (
        <div className="space-y-4">
          <p className="text-gray-300">
            Generate high-quality subtitles in multiple Indian languages with our advanced AI models.
          </p>
          <div className="grid grid-cols-1 gap-3">
            <div className="flex items-start gap-3 p-3 bg-blue-500/10 rounded-lg border border-blue-400/20">
              <PlayCircle className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-semibold text-blue-400">Run Workflows</h4>
                <p className="text-xs text-gray-400 mt-1">
                  Upload videos and generate subtitles in minutes
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-cyan-500/10 rounded-lg border border-cyan-400/20">
              <Key className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-semibold text-cyan-400">API Integration</h4>
                <p className="text-xs text-gray-400 mt-1">
                  Generate API keys for programmatic access
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-green-500/10 rounded-lg border border-green-400/20">
              <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-semibold text-green-400">Quality Assured</h4>
                <p className="text-xs text-gray-400 mt-1">
                  High accuracy with contextual translations
                </p>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: 'Explore Demo Workflows',
      description: 'See what you can build',
      content: (
        <div className="space-y-4">
          <p className="text-gray-300">
            Try our interactive demos to understand how subtitle generation works.
          </p>
          <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
            <h4 className="text-sm font-semibold text-white mb-2">Available Demos:</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                Quick Start: English to Hindi (Beginner)
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                Multi-Language Support (Intermediate)
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-green-400" />
                Context-Aware Translation (Advanced)
              </li>
            </ul>
          </div>
          <Button
            variant="secondary"
            className="w-full"
            onClick={() => {
              navigate('/client/demo');
              completeStep('demo_workflow');
              onClose();
            }}
          >
            <PlayCircle className="w-4 h-4 mr-2" />
            View Demos
          </Button>
        </div>
      ),
    },
    {
      title: 'Generate Your API Key',
      description: 'Integrate with your applications',
      content: (
        <div className="space-y-4">
          <p className="text-gray-300">
            Create API keys to integrate subtitle generation into your own applications.
          </p>
          <div className="bg-yellow-500/10 border border-yellow-400/20 rounded-lg p-4">
            <h4 className="text-sm font-semibold text-yellow-400 mb-2">Security Tip</h4>
            <p className="text-xs text-gray-300">
              Keep your API keys secure. Never expose them in client-side code or public repositories.
            </p>
          </div>
          <Button
            variant="secondary"
            className="w-full"
            onClick={() => {
              navigate('/client/api-keys');
              completeStep('api_key_setup');
              onClose();
            }}
          >
            <Key className="w-4 h-4 mr-2" />
            Generate API Key
          </Button>
        </div>
      ),
    },
    {
      title: 'Ready to Get Started!',
      description: 'You\'re all set',
      content: (
        <div className="space-y-4">
          <div className="text-center py-6">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">You're All Set!</h3>
            <p className="text-gray-300 mb-6">
              Start creating amazing subtitles or explore more features.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Button
              variant="secondary"
              onClick={() => {
                navigate('/client/demo');
                completeStep('complete');
                onClose();
              }}
            >
              Explore Demos
            </Button>
            <Button
              variant="primary"
              onClick={() => {
                navigate('/client/workflows/new');
                completeStep('complete');
                onClose();
              }}
            >
              <PlayCircle className="w-4 h-4 mr-2" />
              Start Workflow
            </Button>
          </div>
        </div>
      ),
    },
  ];

  const adminSteps = [
    {
      title: 'Welcome, Administrator! 🎯',
      description: 'Master the platform',
      content: (
        <div className="space-y-4">
          <p className="text-gray-300">
            You have full access to manage models, datasets, users, and monitor system health.
          </p>
          <div className="space-y-2">
            <div className="p-3 bg-blue-500/10 rounded-lg border border-blue-400/20">
              <h4 className="text-sm font-semibold text-blue-400">System Management</h4>
              <p className="text-xs text-gray-400 mt-1">
                Monitor performance, manage resources, and configure workflows
              </p>
            </div>
            <div className="p-3 bg-cyan-500/10 rounded-lg border border-cyan-400/20">
              <h4 className="text-sm font-semibold text-cyan-400">User Administration</h4>
              <p className="text-xs text-gray-400 mt-1">
                Manage users, roles, and API keys across your organization
              </p>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: 'Manage Your Organization',
      description: 'Control access and quotas',
      content: (
        <div className="space-y-4">
          <p className="text-gray-300">
            Set quotas, manage billing, and monitor usage across your organization.
          </p>
          <Button
            variant="secondary"
            className="w-full"
            onClick={() => {
              navigate('/dashboard/organizations');
              completeStep('profile_setup');
              onClose();
            }}
          >
            Go to Organizations
          </Button>
        </div>
      ),
    },
    {
      title: 'Ready to Manage!',
      description: 'Access all admin features',
      content: (
        <div className="space-y-4 text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-xl font-bold text-white">You're Ready!</h3>
          <p className="text-gray-300">
            Start managing your platform from the admin console.
          </p>
          <Button
            variant="primary"
            className="w-full"
            onClick={() => {
              navigate('/dashboard');
              completeStep('complete');
              onClose();
            }}
          >
            Go to Dashboard
          </Button>
        </div>
      ),
    },
  ];

  const steps = isClientUser ? clientSteps : adminSteps;
  const step = steps[currentStep];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkip = async () => {
    await skipOnboarding();
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title=""
      size="lg"
    >
      <div className="relative">
        <button
          onClick={handleSkip}
          className="absolute top-0 right-0 text-gray-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="mb-6">
          <div className="flex items-center justify-center mb-4">
            <Sparkles className="w-12 h-12 text-blue-400" />
          </div>
          <h2 className="text-2xl font-bold text-white text-center mb-2">
            {step.title}
          </h2>
          <p className="text-gray-400 text-center">{step.description}</p>
        </div>

        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`flex-1 h-1.5 rounded-full mx-1 transition-colors ${
                  index <= currentStep ? 'bg-blue-500' : 'bg-slate-700'
                }`}
              />
            ))}
          </div>
          <p className="text-xs text-gray-500 text-center">
            Step {currentStep + 1} of {steps.length}
          </p>
        </div>

        <div className="mb-6">{step.content}</div>

        <div className="flex items-center justify-between gap-3">
          {currentStep > 0 && (
            <Button variant="secondary" onClick={handleBack} className="flex-1">
              Back
            </Button>
          )}
          {currentStep < steps.length - 1 ? (
            <Button variant="primary" onClick={handleNext} className="flex-1">
              Next
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <Button
              variant="primary"
              onClick={() => {
                completeStep('complete');
                onClose();
              }}
              className="flex-1"
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              Finish
            </Button>
          )}
        </div>

        <button
          onClick={handleSkip}
          className="w-full text-center text-sm text-gray-400 hover:text-gray-300 mt-4 transition-colors"
        >
          Skip tutorial
        </button>
      </div>
    </Modal>
  );
};
