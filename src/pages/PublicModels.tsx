import { PublicLayout } from '../components/layout/PublicLayout';
import { Box, Cpu, Globe, Gauge, CheckCircle } from 'lucide-react';
import { Badge } from '../components/ui/Badge';

const models = [
  {
    name: 'ISN-ASR',
    version: 'v2.1',
    category: 'Speech Recognition',
    description: 'High-accuracy automatic speech recognition optimized for Indian languages',
    features: ['95+ languages', 'Real-time processing', 'Noise reduction', 'Speaker diarization'],
    accuracy: '96.5%',
    languages: ['Hindi', 'Tamil', 'Telugu', 'Malayalam', 'Kannada', 'Bengali', 'English'],
    status: 'production',
  },
  {
    name: 'ISN-MT',
    version: 'v1.8',
    category: 'Machine Translation',
    description: 'Neural machine translation with cultural context understanding',
    features: ['Contextual translation', 'Idiom handling', 'Domain adaptation', 'Style preservation'],
    accuracy: '94.2%',
    languages: ['All Indian languages', 'English', 'Spanish', 'French'],
    status: 'production',
  },
  {
    name: 'ISN-ContextNet',
    version: 'v1.5',
    category: 'Contextualization',
    description: 'AI-powered context enhancement for cinematic and professional content',
    features: ['Scene awareness', 'Character tracking', 'Tone adjustment', 'Cultural adaptation'],
    accuracy: '92.8%',
    languages: ['Multilingual'],
    status: 'production',
  },
  {
    name: 'ISN-QA',
    version: 'v3.0',
    category: 'Quality Assurance',
    description: 'Automated quality scoring and error detection for subtitles',
    features: ['WER/BLEU scoring', 'Timing validation', 'Grammar checking', 'Consistency analysis'],
    accuracy: '98.1%',
    languages: ['Universal'],
    status: 'production',
  },
  {
    name: 'ISN-Lexicon',
    version: 'v2.3',
    category: 'Terminology',
    description: 'Domain-specific terminology and named entity recognition',
    features: ['Medical terms', 'Legal vocabulary', 'Technical jargon', 'Cultural references'],
    accuracy: '97.3%',
    languages: ['20+ languages'],
    status: 'production',
  },
  {
    name: 'Whisper Large V3',
    version: 'v3.0',
    category: 'Speech Recognition',
    description: 'OpenAI Whisper for multilingual speech recognition',
    features: ['99 languages', 'Robust to noise', 'Timestamps', 'Language detection'],
    accuracy: '95.8%',
    languages: ['99 languages'],
    status: 'production',
  },
];

export const PublicModels = () => {
  return (
    <PublicLayout>
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm mb-6">
            <Box className="w-4 h-4 text-blue-400" />
            <span className="text-sm text-gray-300">AI Models</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-4">
            <span className="bg-gradient-to-r from-white via-blue-100 to-cyan-200 bg-clip-text text-transparent">
              State-of-the-Art AI Models
            </span>
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Our proprietary models combined with industry-leading AI for unmatched accuracy
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {models.map((model) => (
            <div
              key={model.name}
              className="rounded-2xl bg-gradient-to-br from-white/[0.07] to-white/[0.02] border border-white/10 p-6 backdrop-blur-xl hover:border-blue-400/30 transition-all group"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 flex items-center justify-center border border-blue-400/20 group-hover:scale-110 transition-transform">
                  <Cpu className="w-6 h-6 text-blue-400" />
                </div>
                <Badge variant="primary">{model.version}</Badge>
              </div>

              <h3 className="text-xl font-bold text-white mb-2">{model.name}</h3>
              <p className="text-sm text-gray-400 mb-4">{model.category}</p>
              <p className="text-gray-300 mb-6 leading-relaxed">{model.description}</p>

              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-400">Accuracy</span>
                    <span className="text-sm font-semibold text-green-400">{model.accuracy}</span>
                  </div>
                  <div className="w-full bg-gray-800 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full"
                      style={{ width: model.accuracy }}
                    />
                  </div>
                </div>

                <div>
                  <p className="text-sm text-gray-400 mb-2">Key Features</p>
                  <div className="space-y-1">
                    {model.features.map((feature) => (
                      <div key={feature} className="flex items-center text-sm text-gray-300">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                        {feature}
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-sm text-gray-400 mb-2">Languages</p>
                  <div className="flex flex-wrap gap-1">
                    {model.languages.slice(0, 3).map((lang) => (
                      <span
                        key={lang}
                        className="px-2 py-1 rounded-md text-xs bg-white/5 text-gray-300 border border-white/10"
                      >
                        {lang}
                      </span>
                    ))}
                    {model.languages.length > 3 && (
                      <span className="px-2 py-1 rounded-md text-xs bg-white/5 text-gray-300 border border-white/10">
                        +{model.languages.length - 3} more
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center p-8 rounded-2xl bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-400/20">
          <Globe className="w-12 h-12 text-blue-400 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-white mb-3">
            Need a Custom Model?
          </h3>
          <p className="text-gray-300 mb-6">
            Enterprise customers can train custom models on proprietary datasets
          </p>
        </div>
      </section>
    </PublicLayout>
  );
};
