import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight, Box, Database, Film, Award } from 'lucide-react';
import { IFFIRegistrationPopup } from '../components/IFFIRegistrationPopup';

export function Landing() {
  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-black to-slate-950"></div>

      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-900/20 via-transparent to-transparent"></div>

      <IFFIRegistrationPopup />

      <div className="relative">
        <div className="bg-gradient-to-r from-amber-500/20 via-orange-500/20 to-amber-500/20 border-b border-amber-500/30 backdrop-blur-xl">
          <div className="max-w-7xl mx-auto px-6 py-3">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-2 text-center">
              <div className="flex items-center gap-2">
                <Film className="w-5 h-5 text-amber-400" />
                <Award className="w-4 h-4 text-amber-400" />
              </div>
              <p className="text-sm md:text-base">
                <span className="font-bold text-amber-400">Officially Launching at 56th IFFI Goa 2025</span>
                <span className="text-amber-200 ml-2">- International Film Festival of India</span>
              </p>
            </div>
          </div>
        </div>

        <nav className="border-b border-white/5 backdrop-blur-xl bg-black/30">
          <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                <Sparkles className="w-6 h-6" />
              </div>
              <span className="text-xl font-bold">IndicSubtitleNet</span>
            </div>

            <Link
              to="/dashboard"
              className="px-6 py-2.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 transition-all duration-300 font-medium backdrop-blur-sm"
            >
              Access Console
            </Link>
          </div>
        </nav>

        <section className="max-w-7xl mx-auto px-6 pt-20 pb-32">
          <div className="text-center space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm">
              <Sparkles className="w-4 h-4 text-blue-400" />
              <span className="text-sm text-gray-300">AI-Powered Subtitle Generation</span>
            </div>

            <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight">
              <span className="bg-gradient-to-r from-white via-blue-100 to-cyan-200 bg-clip-text text-transparent">
                Transform Your Content
              </span>
              <br />
              <span className="text-gray-400">With Precision AI</span>
            </h1>

            <p className="text-xl md:text-2xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
              Professional AI-powered subtitle generation and editing platform.
              Transform your content with precision and speed across <span className="text-blue-400 font-semibold">95+ languages</span>.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
              <Link
                to="/dashboard"
                className="group px-8 py-4 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 font-semibold text-lg transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-blue-500/25"
              >
                Launch Console
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                to="/dashboard/explore"
                className="px-8 py-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 font-semibold text-lg transition-all duration-300 backdrop-blur-sm inline-flex items-center justify-center"
              >
                Explore
              </Link>
            </div>
          </div>

          <div className="mt-32">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm mb-4">
                <span className="text-sm text-gray-400">Proof of Concept</span>
              </div>
              <h2 className="text-4xl font-bold text-white mb-3">In Partnership With</h2>
              <div className="flex justify-center mt-8 mb-8">
                <div className="px-10 py-6 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
                  <svg className="h-10" viewBox="0 0 272 92" xmlns="http://www.w3.org/2000/svg">
                    <path d="M115.75 47.18c0 12.77-9.99 22.18-22.25 22.18s-22.25-9.41-22.25-22.18C71.25 34.32 81.24 25 93.5 25s22.25 9.32 22.25 22.18zm-9.74 0c0-7.98-5.79-13.44-12.51-13.44S80.99 39.2 80.99 47.18c0 7.9 5.79 13.44 12.51 13.44s12.51-5.55 12.51-13.44z" fill="#EA4335"/>
                    <path d="M163.75 47.18c0 12.77-9.99 22.18-22.25 22.18s-22.25-9.41-22.25-22.18c0-12.85 9.99-22.18 22.25-22.18s22.25 9.32 22.25 22.18zm-9.74 0c0-7.98-5.79-13.44-12.51-13.44s-12.51 5.46-12.51 13.44c0 7.9 5.79 13.44 12.51 13.44s12.51-5.55 12.51-13.44z" fill="#FBBC05"/>
                    <path d="M209.75 26.34v39.82c0 16.38-9.66 23.07-21.08 23.07-10.75 0-17.22-7.19-19.66-13.07l8.48-3.53c1.51 3.61 5.21 7.87 11.17 7.87 7.31 0 11.84-4.51 11.84-13v-3.19h-.34c-2.18 2.69-6.38 5.04-11.68 5.04-11.09 0-21.25-9.66-21.25-22.09 0-12.52 10.16-22.26 21.25-22.26 5.29 0 9.49 2.35 11.68 4.96h.34v-3.61h9.25zm-8.56 20.92c0-7.81-5.21-13.52-11.84-13.52-6.72 0-12.35 5.71-12.35 13.52 0 7.73 5.63 13.36 12.35 13.36 6.63 0 11.84-5.63 11.84-13.36z" fill="#4285F4"/>
                    <path d="M225 3v65h-9.5V3h9.5z" fill="#34A853"/>
                    <path d="M262.02 54.48l7.56 5.04c-2.44 3.61-8.32 9.83-18.48 9.83-12.6 0-22.01-9.74-22.01-22.18 0-13.19 9.49-22.18 20.92-22.18 11.51 0 17.14 9.16 18.98 14.11l1.01 2.52-29.65 12.28c2.27 4.45 5.8 6.72 10.75 6.72 4.96 0 8.4-2.44 10.92-6.14zm-23.27-7.98l19.82-8.23c-1.09-2.77-4.37-4.7-8.23-4.7-4.95 0-11.84 4.37-11.59 12.93z" fill="#EA4335"/>
                    <path d="M35.29 41.41V32H67c.31 1.64.47 3.58.47 5.68 0 7.06-1.93 15.79-8.15 22.01-6.05 6.3-13.78 9.66-24.02 9.66C16.32 69.35.36 53.89.36 34.91.36 15.93 16.32.47 35.3.47c10.5 0 17.98 4.12 23.6 9.49l-6.64 6.64c-4.03-3.78-9.49-6.72-16.97-6.72-13.86 0-24.7 11.17-24.7 25.03 0 13.86 10.84 25.03 24.7 25.03 8.99 0 14.11-3.61 17.39-6.89 2.66-2.66 4.41-6.46 5.1-11.65l-22.49.01z" fill="#4285F4"/>
                  </svg>
                </div>
              </div>
              <p className="text-gray-400 text-lg">Exploring next-generation AI models and training datasets</p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="rounded-2xl bg-gradient-to-br from-white/[0.07] to-white/[0.02] border border-white/10 p-8 backdrop-blur-xl">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 flex items-center justify-center border border-blue-400/20">
                    <Box className="w-6 h-6 text-blue-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-white">AI Models</h3>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/5 hover:border-blue-400/30 transition-all group">
                    <span className="text-gray-300 group-hover:text-white transition-colors">ISN-ASR</span>
                    <span className="text-xs px-2 py-1 rounded-full bg-blue-500/20 text-blue-400 border border-blue-400/20">v2.1</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/5 hover:border-blue-400/30 transition-all group">
                    <span className="text-gray-300 group-hover:text-white transition-colors">ISN-MT</span>
                    <span className="text-xs px-2 py-1 rounded-full bg-blue-500/20 text-blue-400 border border-blue-400/20">v1.8</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/5 hover:border-blue-400/30 transition-all group">
                    <span className="text-gray-300 group-hover:text-white transition-colors">ISN-QA</span>
                    <span className="text-xs px-2 py-1 rounded-full bg-blue-500/20 text-blue-400 border border-blue-400/20">v3.0</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/5 hover:border-blue-400/30 transition-all group">
                    <span className="text-gray-300 group-hover:text-white transition-colors">ISN-ContextNet</span>
                    <span className="text-xs px-2 py-1 rounded-full bg-blue-500/20 text-blue-400 border border-blue-400/20">v1.5</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/5 hover:border-blue-400/30 transition-all group">
                    <span className="text-gray-300 group-hover:text-white transition-colors">ISN-Lexicon</span>
                    <span className="text-xs px-2 py-1 rounded-full bg-blue-500/20 text-blue-400 border border-blue-400/20">v2.3</span>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl bg-gradient-to-br from-white/[0.07] to-white/[0.02] border border-white/10 p-8 backdrop-blur-xl">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 flex items-center justify-center border border-cyan-400/20">
                    <Database className="w-6 h-6 text-cyan-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-white">Training Datasets</h3>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/5 hover:border-cyan-400/30 transition-all group">
                    <span className="text-gray-300 group-hover:text-white transition-colors">IndicSpeech Corpus</span>
                    <span className="text-xs px-2 py-1 rounded-full bg-cyan-500/20 text-cyan-400 border border-cyan-400/20">2.4 TB</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/5 hover:border-cyan-400/30 transition-all group">
                    <span className="text-gray-300 group-hover:text-white transition-colors">CineLing Dataset</span>
                    <span className="text-xs px-2 py-1 rounded-full bg-cyan-500/20 text-cyan-400 border border-cyan-400/20">180 GB</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/5 hover:border-cyan-400/30 transition-all group">
                    <span className="text-gray-300 group-hover:text-white transition-colors">EduLing Dataset</span>
                    <span className="text-xs px-2 py-1 rounded-full bg-cyan-500/20 text-cyan-400 border border-cyan-400/20">520 GB</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/5 hover:border-cyan-400/30 transition-all group">
                    <span className="text-gray-300 group-hover:text-white transition-colors">CivicLing Dataset</span>
                    <span className="text-xs px-2 py-1 rounded-full bg-cyan-500/20 text-cyan-400 border border-cyan-400/20">95 GB</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/5 hover:border-cyan-400/30 transition-all group">
                    <span className="text-gray-300 group-hover:text-white transition-colors">AsiaLing Corpus</span>
                    <span className="text-xs px-2 py-1 rounded-full bg-cyan-500/20 text-cyan-400 border border-cyan-400/20">1.8 TB</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <footer className="border-t border-white/5 backdrop-blur-xl bg-black/30">
          <div className="max-w-7xl mx-auto px-6 py-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                  <Sparkles className="w-5 h-5" />
                </div>
                <span className="font-semibold">IndicSubtitleNet</span>
              </div>

              <p className="text-gray-500 text-sm">
                Model & Dataset Management System for AI Subtitles
              </p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
