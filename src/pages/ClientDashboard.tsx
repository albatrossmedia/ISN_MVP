import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import {
  Play,
  Key,
  History,
  BookOpen,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { useOnboarding } from '../contexts/OnboardingContext';
import { WelcomeWizard } from '../components/onboarding/WelcomeWizard';
import { QuickStartChecklist } from '../components/onboarding/QuickStartChecklist';
import { FeatureAnnouncement } from '../components/onboarding/FeatureAnnouncement';
import toast from 'react-hot-toast';

export const ClientDashboard: React.FC = () => {
  const { user } = useAuth();
  const { onboarding, startOnboarding } = useOnboarding();
  const [showWelcomeWizard, setShowWelcomeWizard] = useState(false);
  const [stats, setStats] = useState({
    apiKeysCount: 0,
    workflowsRun: 0,
    minutesUsed: 0,
    quotaMinutes: 100,
    successRate: 0,
  });
  const [recentWorkflows, setRecentWorkflows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, [user]);

  useEffect(() => {
    if (onboarding && !onboarding.is_completed && !onboarding.skipped) {
      setShowWelcomeWizard(true);
    }
  }, [onboarding]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      const [apiKeysRes, workflowsRes, orgRes] = await Promise.all([
        supabase
          .from('api_keys')
          .select('id')
          .eq('user_id', user?.id || '')
          .eq('is_active', true),
        supabase
          .from('user_workflow_history')
          .select('*')
          .eq('user_id', user?.id || '')
          .order('created_at', { ascending: false })
          .limit(5),
        supabase
          .from('organizations')
          .select('quota_minutes, used_minutes')
          .eq('id', user?.role?.organization_id || '')
          .single(),
      ]);

      const workflows = workflowsRes.data || [];
      const completedWorkflows = workflows.filter(w => w.status === 'completed');
      const successRate = workflows.length > 0
        ? (completedWorkflows.length / workflows.length) * 100
        : 0;

      setStats({
        apiKeysCount: apiKeysRes.data?.length || 0,
        workflowsRun: workflows.length,
        minutesUsed: orgRes.data?.used_minutes || 0,
        quotaMinutes: orgRes.data?.quota_minutes || 100,
        successRate: Math.round(successRate),
      });

      setRecentWorkflows(workflows);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const quotaPercentage = (stats.minutesUsed / stats.quotaMinutes) * 100;

  return (
    <div className="space-y-8">
      <WelcomeWizard
        isOpen={showWelcomeWizard}
        onClose={() => setShowWelcomeWizard(false)}
      />

      <div>
        <h1 className="text-4xl font-bold text-white mb-2">
          Welcome back, {user?.email?.split('@')[0]}!
        </h1>
        <p className="text-gray-400">
          Here's an overview of your subtitle generation activity
        </p>
      </div>

      <FeatureAnnouncement />

      <QuickStartChecklist />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6 bg-gradient-to-br from-blue-500/10 to-transparent border-blue-400/20">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center">
              <Play className="w-6 h-6 text-blue-400" />
            </div>
            <Badge variant="info">This Month</Badge>
          </div>
          <p className="text-sm text-gray-400 mb-1">Workflows Run</p>
          <p className="text-3xl font-bold text-white">{stats.workflowsRun}</p>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-green-500/10 to-transparent border-green-400/20">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-400" />
            </div>
            <Badge variant="success">Success</Badge>
          </div>
          <p className="text-sm text-gray-400 mb-1">Success Rate</p>
          <p className="text-3xl font-bold text-white">{stats.successRate}%</p>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-cyan-500/10 to-transparent border-cyan-400/20">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-cyan-500/20 flex items-center justify-center">
              <Clock className="w-6 h-6 text-cyan-400" />
            </div>
            <Badge variant="primary">Quota</Badge>
          </div>
          <p className="text-sm text-gray-400 mb-1">Minutes Used</p>
          <p className="text-3xl font-bold text-white">
            {stats.minutesUsed}
            <span className="text-lg text-gray-400">/{stats.quotaMinutes}</span>
          </p>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-purple-500/10 to-transparent border-purple-400/20">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center">
              <Key className="w-6 h-6 text-purple-400" />
            </div>
            <Badge variant="secondary">Active</Badge>
          </div>
          <p className="text-sm text-gray-400 mb-1">API Keys</p>
          <p className="text-3xl font-bold text-white">{stats.apiKeysCount}</p>
        </Card>
      </div>

      <Card className="p-6">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold text-white">Monthly Quota</h3>
            <span className="text-sm text-gray-400">
              {Math.round(quotaPercentage)}% used
            </span>
          </div>
          <div className="h-3 bg-slate-700 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all ${
                quotaPercentage > 90
                  ? 'bg-red-500'
                  : quotaPercentage > 70
                  ? 'bg-yellow-500'
                  : 'bg-green-500'
              }`}
              style={{ width: `${Math.min(quotaPercentage, 100)}%` }}
            />
          </div>
        </div>

        {quotaPercentage > 80 && (
          <div className="flex items-start gap-3 p-4 bg-yellow-500/10 border border-yellow-400/20 rounded-lg">
            <AlertCircle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h4 className="text-sm font-semibold text-yellow-400 mb-1">
                Quota Warning
              </h4>
              <p className="text-sm text-gray-300">
                You've used {Math.round(quotaPercentage)}% of your monthly quota. Consider upgrading your plan to avoid service interruption.
              </p>
            </div>
          </div>
        )}
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h2 className="text-xl font-semibold text-white mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <Link to="/client/workflows/new">
              <Button variant="primary" className="w-full justify-start">
                <Play className="w-5 h-5 mr-3" />
                Run New Workflow
              </Button>
            </Link>
            <Link to="/client/demo">
              <Button variant="secondary" className="w-full justify-start">
                <BookOpen className="w-5 h-5 mr-3" />
                View Demo Workflows
              </Button>
            </Link>
            <Link to="/client/api-keys">
              <Button variant="secondary" className="w-full justify-start">
                <Key className="w-5 h-5 mr-3" />
                Manage API Keys
              </Button>
            </Link>
            <Link to="/client/history">
              <Button variant="secondary" className="w-full justify-start">
                <History className="w-5 h-5 mr-3" />
                View Workflow History
              </Button>
            </Link>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold text-white mb-4">Recent Workflows</h2>
          {recentWorkflows.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <Play className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No workflows yet</p>
              <Link to="/client/workflows/new">
                <Button size="sm" className="mt-3">
                  Run Your First Workflow
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {recentWorkflows.map((workflow) => (
                <div
                  key={workflow.id}
                  className="flex items-center justify-between p-3 bg-slate-800 rounded-lg border border-slate-700 hover:border-slate-600 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">
                      {workflow.input_file || 'Workflow'}
                    </p>
                    <p className="text-xs text-gray-400">
                      {new Date(workflow.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <Badge
                    variant={
                      workflow.status === 'completed'
                        ? 'success'
                        : workflow.status === 'failed'
                        ? 'danger'
                        : workflow.status === 'running'
                        ? 'info'
                        : 'warning'
                    }
                  >
                    {workflow.status}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};
