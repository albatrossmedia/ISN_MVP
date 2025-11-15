import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, AlertCircle } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { FileUploader } from '../components/ui/FileUploader';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { workflowsApi } from '../lib/api';
import type { WorkflowRequest } from '../types/workflow';
import toast from 'react-hot-toast';

const languages = [
  { value: 'en', label: 'English' },
  { value: 'hi', label: 'Hindi' },
  { value: 'ta', label: 'Tamil' },
  { value: 'te', label: 'Telugu' },
  { value: 'ml', label: 'Malayalam' },
  { value: 'kn', label: 'Kannada' },
  { value: 'bn', label: 'Bengali' },
  { value: 'mr', label: 'Marathi' },
  { value: 'gu', label: 'Gujarati' },
  { value: 'pa', label: 'Punjabi' },
];

const models = {
  asr: [
    { value: 'whisper-large-v3', label: 'Whisper Large V3' },
    { value: 'google-stt', label: 'Google Speech-to-Text' },
    { value: 'isn-asr', label: 'ISN ASR' },
  ],
  mt: [
    { value: 'google-nmt', label: 'Google Neural MT' },
    { value: 'mbart', label: 'mBART' },
    { value: 'isn-mt', label: 'ISN MT' },
  ],
  context: [
    { value: 'gemini-pro', label: 'Gemini Pro' },
    { value: 'gpt-4', label: 'GPT-4' },
    { value: 'isn-context', label: 'ISN Context' },
  ],
  qa: [
    { value: 'isn-qa', label: 'ISN QA' },
    { value: 'custom-qa', label: 'Custom QA' },
  ],
};

export const WorkflowRunner = () => {
  const navigate = useNavigate();
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [config, setConfig] = useState({
    sourceLanguage: 'en',
    targetLanguages: ['hi'],
    asrModel: 'whisper-large-v3',
    mtModel: 'google-nmt',
    contextModel: 'gemini-pro',
    qaModel: 'isn-qa',
    streaming: false,
    qualityThreshold: 0.8,
  });

  const handleFileSelect = (selectedFile: File) => {
    setFile(selectedFile);
    setError('');
  };

  const handleTargetLanguageToggle = (lang: string) => {
    setConfig((prev) => ({
      ...prev,
      targetLanguages: prev.targetLanguages.includes(lang)
        ? prev.targetLanguages.filter((l) => l !== lang)
        : [...prev.targetLanguages, lang],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!file) {
      setError('Please select a file to upload');
      return;
    }

    if (config.targetLanguages.length === 0) {
      setError('Please select at least one target language');
      return;
    }

    setLoading(true);

    try {
      const workflowRequest: WorkflowRequest = {
        input: {
          video_path: file.name,
          source_language: config.sourceLanguage,
          target_languages: config.targetLanguages,
        },
        models: {
          asr: config.asrModel,
          mt: config.mtModel,
          context: config.contextModel,
          qa: config.qaModel,
        },
        config: {
          streaming: config.streaming,
          quality_threshold: config.qualityThreshold,
        },
      };

      const response = await workflowsApi.run(workflowRequest);
      toast.success('Workflow started successfully!');
      navigate(`/dashboard/workflows/${response.job_id}`);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to start workflow';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Create Subtitle Workflow
        </h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Upload your media file and configure the subtitle generation workflow
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Media Upload
          </h2>
          <FileUploader onFileSelect={handleFileSelect} />
        </Card>

        <Card>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Language Configuration
          </h2>

          <div className="space-y-4">
            <Select
              label="Source Language"
              value={config.sourceLanguage}
              onChange={(e) => setConfig({ ...config, sourceLanguage: e.target.value })}
              options={languages}
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Target Languages
              </label>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                {languages.map((lang) => (
                  <button
                    key={lang.value}
                    type="button"
                    onClick={() => handleTargetLanguageToggle(lang.value)}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      config.targetLanguages.includes(lang.value)
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                    }`}
                  >
                    {lang.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </Card>

        <Card>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Model Selection
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              label="ASR Model"
              value={config.asrModel}
              onChange={(e) => setConfig({ ...config, asrModel: e.target.value })}
              options={models.asr}
            />

            <Select
              label="Translation Model"
              value={config.mtModel}
              onChange={(e) => setConfig({ ...config, mtModel: e.target.value })}
              options={models.mt}
            />

            <Select
              label="Context Model"
              value={config.contextModel}
              onChange={(e) => setConfig({ ...config, contextModel: e.target.value })}
              options={models.context}
            />

            <Select
              label="QA Model"
              value={config.qaModel}
              onChange={(e) => setConfig({ ...config, qaModel: e.target.value })}
              options={models.qa}
            />
          </div>
        </Card>

        <Card>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Advanced Settings
          </h2>

          <div className="space-y-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="streaming"
                checked={config.streaming}
                onChange={(e) => setConfig({ ...config, streaming: e.target.checked })}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label
                htmlFor="streaming"
                className="ml-2 text-sm text-gray-700 dark:text-gray-300"
              >
                Enable streaming mode for real-time processing
              </label>
            </div>

            <Input
              type="number"
              label="Quality Threshold"
              value={config.qualityThreshold}
              onChange={(e) =>
                setConfig({ ...config, qualityThreshold: parseFloat(e.target.value) })
              }
              min="0"
              max="1"
              step="0.1"
              helpText="Minimum quality score for accepting results (0-1)"
            />
          </div>
        </Card>

        {error && (
          <div className="flex items-center p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 mr-3" />
            <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
          </div>
        )}

        <div className="flex justify-end space-x-3">
          <Button type="button" variant="secondary" onClick={() => navigate('/dashboard/jobs')}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" disabled={loading || !file}>
            {loading ? (
              <>
                <LoadingSpinner size="sm" className="mr-2" />
                Starting Workflow...
              </>
            ) : (
              <>
                <Play className="h-4 w-4 mr-2" />
                Start Workflow
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};
