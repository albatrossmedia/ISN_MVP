import { CheckCircle, Circle, Loader, XCircle } from 'lucide-react';
import type { StageStatus } from '../../types/workflow';

interface ProgressTrackerProps {
  stages: StageStatus[];
  className?: string;
}

const stageNames: Record<string, string> = {
  asr: 'Speech Recognition',
  mt: 'Translation',
  context: 'Contextualization',
  align: 'Alignment',
  qa: 'Quality Assurance',
};

export const ProgressTracker = ({ stages, className = '' }: ProgressTrackerProps) => {
  const getStageIcon = (stage: StageStatus) => {
    switch (stage.status) {
      case 'completed':
        return <CheckCircle className="h-6 w-6 text-green-500" />;
      case 'running':
        return <Loader className="h-6 w-6 text-blue-500 animate-spin" />;
      case 'failed':
        return <XCircle className="h-6 w-6 text-red-500" />;
      default:
        return <Circle className="h-6 w-6 text-gray-300" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500';
      case 'running':
        return 'bg-blue-500';
      case 'failed':
        return 'bg-red-500';
      default:
        return 'bg-gray-300';
    }
  };

  return (
    <div className={`${className}`}>
      <div className="relative">
        {stages.map((stage, index) => (
          <div key={stage.stage} className="relative pb-8 last:pb-0">
            {index < stages.length - 1 && (
              <div
                className={`absolute left-3 top-8 bottom-0 w-0.5 ${
                  stage.status === 'completed' ? 'bg-green-500' : 'bg-gray-300'
                }`}
              />
            )}

            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">{getStageIcon(stage)}</div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {stageNames[stage.stage] || stage.stage}
                  </p>
                  <span
                    className={`text-xs font-medium px-2 py-1 rounded-full ${
                      stage.status === 'completed'
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        : stage.status === 'running'
                        ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                        : stage.status === 'failed'
                        ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                        : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
                    }`}
                  >
                    {stage.status}
                  </span>
                </div>

                {stage.status === 'running' && (
                  <div className="mt-2">
                    <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400 mb-1">
                      <span>Progress</span>
                      <span>{stage.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all duration-300 ${getStatusColor(
                          stage.status
                        )}`}
                        style={{ width: `${stage.progress}%` }}
                      />
                    </div>
                  </div>
                )}

                {stage.error && (
                  <p className="mt-1 text-xs text-red-600 dark:text-red-400">{stage.error}</p>
                )}

                {stage.completed_at && (
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-500">
                    Completed at {new Date(stage.completed_at).toLocaleTimeString()}
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
