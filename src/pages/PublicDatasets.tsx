import { PublicLayout } from '../components/layout/PublicLayout';
import { Database, HardDrive, Clock, Languages, FileAudio, Film } from 'lucide-react';
import { Badge } from '../components/ui/Badge';

const datasets = [
  {
    name: 'IndicSpeech Corpus',
    size: '2.4 TB',
    hours: '10,000+ hours',
    category: 'Speech Recognition',
    description: 'Comprehensive speech corpus covering all major Indian languages with diverse speakers and accents',
    languages: 22,
    speakers: '5,000+',
    domains: ['Conversational', 'News', 'Entertainment', 'Education'],
    format: ['WAV', 'MP3', 'FLAC'],
    status: 'production',
  },
  {
    name: 'CineLing Dataset',
    size: '180 GB',
    hours: '2,500+ hours',
    category: 'Entertainment',
    description: 'Movie and TV show dialogues with timestamps and translations for subtitle training',
    languages: 15,
    speakers: '1,200+',
    domains: ['Cinema', 'Web Series', 'Documentaries'],
    format: ['SRT', 'VTT', 'ASS'],
    status: 'production',
  },
  {
    name: 'EduLing Dataset',
    size: '520 GB',
    hours: '4,200+ hours',
    category: 'Education',
    description: 'Educational content including lectures, tutorials, and academic discussions',
    languages: 18,
    speakers: '2,000+',
    domains: ['Lectures', 'Tutorials', 'Academic', 'E-learning'],
    format: ['WAV', 'MP4', 'WebM'],
    status: 'production',
  },
  {
    name: 'CivicLing Dataset',
    size: '95 GB',
    hours: '1,800+ hours',
    category: 'Government',
    description: 'Government proceedings, public announcements, and civic communication',
    languages: 12,
    speakers: '800+',
    domains: ['Parliamentary', 'Public Service', 'Legal', 'Administrative'],
    format: ['WAV', 'MP3'],
    status: 'production',
  },
  {
    name: 'AsiaLing Corpus',
    size: '1.8 TB',
    hours: '8,500+ hours',
    category: 'Multilingual',
    description: 'Pan-Asian language corpus covering South, Southeast, and East Asian languages',
    languages: 35,
    speakers: '7,500+',
    domains: ['General', 'Business', 'Tourism', 'Technology'],
    format: ['WAV', 'FLAC', 'OGG'],
    status: 'production',
  },
  {
    name: 'TechTalk Dataset',
    size: '320 GB',
    hours: '3,100+ hours',
    category: 'Technology',
    description: 'Technical presentations, conferences, and developer discussions',
    languages: 8,
    speakers: '1,500+',
    domains: ['Conferences', 'Webinars', 'Podcasts', 'Tutorials'],
    format: ['MP3', 'M4A', 'WAV'],
    status: 'production',
  },
];

export const PublicDatasets = () => {
  return (
    <PublicLayout>
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm mb-6">
            <Database className="w-4 h-4 text-cyan-400" />
            <span className="text-sm text-gray-300">Training Datasets</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-4">
            <span className="bg-gradient-to-r from-white via-cyan-100 to-blue-200 bg-clip-text text-transparent">
              World-Class Training Data
            </span>
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Curated datasets spanning 95+ languages and diverse domains for robust AI training
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {datasets.map((dataset) => (
            <div
              key={dataset.name}
              className="rounded-2xl bg-gradient-to-br from-white/[0.07] to-white/[0.02] border border-white/10 p-6 backdrop-blur-xl hover:border-cyan-400/30 transition-all group"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 flex items-center justify-center border border-cyan-400/20 group-hover:scale-110 transition-transform">
                  <Database className="w-6 h-6 text-cyan-400" />
                </div>
                <Badge variant="success">{dataset.status}</Badge>
              </div>

              <h3 className="text-xl font-bold text-white mb-2">{dataset.name}</h3>
              <p className="text-sm text-gray-400 mb-4">{dataset.category}</p>
              <p className="text-gray-300 mb-6 leading-relaxed">{dataset.description}</p>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <HardDrive className="w-4 h-4 text-cyan-400" />
                    <div>
                      <p className="text-xs text-gray-400">Size</p>
                      <p className="text-sm font-semibold text-white">{dataset.size}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-cyan-400" />
                    <div>
                      <p className="text-xs text-gray-400">Duration</p>
                      <p className="text-sm font-semibold text-white">{dataset.hours}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Languages className="w-4 h-4 text-cyan-400" />
                    <div>
                      <p className="text-xs text-gray-400">Languages</p>
                      <p className="text-sm font-semibold text-white">{dataset.languages}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <FileAudio className="w-4 h-4 text-cyan-400" />
                    <div>
                      <p className="text-xs text-gray-400">Speakers</p>
                      <p className="text-sm font-semibold text-white">{dataset.speakers}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-gray-400 mb-2">Domains</p>
                  <div className="flex flex-wrap gap-1">
                    {dataset.domains.map((domain) => (
                      <span
                        key={domain}
                        className="px-2 py-1 rounded-md text-xs bg-cyan-500/10 text-cyan-300 border border-cyan-400/20"
                      >
                        {domain}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-sm text-gray-400 mb-2">Formats</p>
                  <div className="flex flex-wrap gap-1">
                    {dataset.format.map((fmt) => (
                      <span
                        key={fmt}
                        className="px-2 py-1 rounded-md text-xs bg-white/5 text-gray-300 border border-white/10"
                      >
                        {fmt}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center p-8 rounded-2xl bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-400/20">
          <Film className="w-12 h-12 text-cyan-400 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-white mb-3">
            Need Custom Dataset Curation?
          </h3>
          <p className="text-gray-300 mb-6">
            We can help you build and annotate custom datasets for your specific use case
          </p>
        </div>
      </section>
    </PublicLayout>
  );
};
