import React, { useEffect, useState } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import {
  Play,
  Clock,
  BarChart3,
  CheckCircle,
  ChevronRight,
  Video
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';

interface DemoWorkflow {
  id: string;
  name: string;
  description: string;
  category: string;
  difficulty: string;
  duration_seconds: number;
  config: any;
  stages: any[];
  metrics: any;
  is_active: boolean;
}

export const DemoWorkflows: React.FC = () => {
  const [workflows, setWorkflows] = useState<DemoWorkflow[]>([]);
  const [selectedWorkflow, setSelectedWorkflow] = useState<DemoWorkflow | null>(null);
  const [loading, setLoading] = useState(true);
  const [playingDemo, setPlayingDemo] = useState<string | null>(null);
  const [demoProgress, setDemoProgress] = useState(0);

  useEffect(() => {
    fetchDemoWorkflows();
  }, []);

  const fetchDemoWorkflows = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('demo_workflows')
        .select('*')
        .eq('is_active', true)
        .order('sort_order', { ascending: true });

      if (error) throw error;
      setWorkflows(data || []);
    } catch (error) {
      console.error('Error fetching demo workflows:', error);
      toast.error('Failed to load demo workflows');
    } finally {
      setLoading(false);
    }
  };

  const playDemo = (workflow: DemoWorkflow) => {
    setPlayingDemo(workflow.id);
    setSelectedWorkflow(workflow);
    setDemoProgress(0);

    let progress = 0;
    const interval = setInterval(() => {
      progress += 1;
      setDemoProgress(progress);

      if (progress >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          setPlayingDemo(null);
          toast.success('Demo completed!');
        }, 500);
      }
    }, workflow.duration_seconds * 10);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner':
        return 'success';
      case 'intermediate':
        return 'warning';
      case 'advanced':
        return 'danger';
      default:
        return 'secondary';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Demo Workflows</h1>
        <p className="text-gray-400">
          Explore our pre-built workflows to see what's possible
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          {workflows.map((workflow) => (
            <Card
              key={workflow.id}
              className="p-6 hover:border-blue-400/30 transition-colors cursor-pointer"
              onClick={() => setSelectedWorkflow(workflow)}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-semibold text-white">
                      {workflow.name}
                    </h3>
                    <Badge variant={getDifficultyColor(workflow.difficulty)}>
                      {workflow.difficulty}
                    </Badge>
                  </div>
                  <p className="text-gray-400">{workflow.description}</p>
                </div>
              </div>

              <div className="flex items-center gap-6 text-sm text-gray-400 mb-4">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  {Math.round(workflow.duration_seconds / 60)} min
                </div>
                <div className="flex items-center gap-2">
                  <BarChart3 className="w-4 h-4" />
                  {workflow.stages.length} stages
                </div>
              </div>

              {workflow.metrics && (
                <div className="flex gap-4 mb-4">
                  {workflow.metrics.wer && (
                    <div className="text-sm">
                      <span className="text-gray-400">WER:</span>
                      <span className="text-white ml-1 font-medium">
                        {(workflow.metrics.wer * 100).toFixed(1)}%
                      </span>
                    </div>
                  )}
                  {workflow.metrics.bleu && (
                    <div className="text-sm">
                      <span className="text-gray-400">BLEU:</span>
                      <span className="text-white ml-1 font-medium">
                        {(workflow.metrics.bleu * 100).toFixed(1)}%
                      </span>
                    </div>
                  )}
                  {workflow.metrics.quality_score && (
                    <div className="text-sm">
                      <span className="text-gray-400">Quality:</span>
                      <span className="text-white ml-1 font-medium">
                        {(workflow.metrics.quality_score * 100).toFixed(0)}%
                      </span>
                    </div>
                  )}
                </div>
              )}

              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  playDemo(workflow);
                }}
                disabled={playingDemo === workflow.id}
                className="w-full sm:w-auto"
              >
                {playingDemo === workflow.id ? (
                  <>
                    <LoadingSpinner size="sm" className="mr-2" />
                    Running Demo...
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 mr-2" />
                    Run Demo
                  </>
                )}
              </Button>
            </Card>
          ))}
        </div>

        <div className="lg:col-span-1">
          {selectedWorkflow ? (
            <Card className="p-6 sticky top-6">
              <h3 className="text-lg font-semibold text-white mb-4">
                Workflow Details
              </h3>

              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-400 mb-2">Configuration</h4>
                  <div className="space-y-2 text-sm">
                    {selectedWorkflow.config.source_language && (
                      <div className="flex justify-between">
                        <span className="text-gray-400">Source:</span>
                        <span className="text-white font-medium">
                          {selectedWorkflow.config.source_language.toUpperCase()}
                        </span>
                      </div>
                    )}
                    {selectedWorkflow.config.target_languages && (
                      <div className="flex justify-between">
                        <span className="text-gray-400">Targets:</span>
                        <span className="text-white font-medium">
                          {selectedWorkflow.config.target_languages.join(', ').toUpperCase()}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-400 mb-2">Pipeline Stages</h4>
                  <div className="space-y-2">
                    {selectedWorkflow.stages.map((stage, index) => (
                      <div
                        key={index}
                        className="flex items-start gap-3 p-3 bg-slate-800 rounded-lg border border-slate-700"
                      >
                        <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                          <span className="text-xs font-semibold text-blue-400">
                            {index + 1}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-white">
                            {stage.name}
                          </p>
                          {stage.description && (
                            <p className="text-xs text-gray-400 mt-1">
                              {stage.description}
                            </p>
                          )}
                          {stage.duration && (
                            <p className="text-xs text-gray-500 mt-1">
                              ~{stage.duration}s
                            </p>
                          )}
                        </div>
                        {stage.status === 'completed' && (
                          <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {playingDemo === selectedWorkflow.id && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-400 mb-2">Progress</h4>
                    <div className="space-y-2">
                      <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-blue-500 transition-all duration-300"
                          style={{ width: `${demoProgress}%` }}
                        />
                      </div>
                      <p className="text-xs text-gray-400 text-center">
                        {demoProgress}% Complete
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </Card>
          ) : (
            <Card className="p-6 text-center">
              <Video className="w-12 h-12 text-gray-500 mx-auto mb-3" />
              <p className="text-gray-400 text-sm">
                Select a workflow to view details
              </p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};
