import { PublicLayout } from '../components/layout/PublicLayout';
import { Target, Users, Award, Zap, Globe, Shield } from 'lucide-react';

export const About = () => {
  return (
    <PublicLayout>
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold mb-4">
            <span className="bg-gradient-to-r from-white via-blue-100 to-cyan-200 bg-clip-text text-transparent">
              About IndicSubtitleNet
            </span>
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Democratizing multilingual content through AI-powered subtitle generation
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 mb-20">
          <div>
            <h2 className="text-3xl font-bold text-white mb-6">Our Mission</h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              IndicSubtitleNet was founded with a clear mission: to break down language barriers
              and make content accessible to everyone, regardless of their native language.
            </p>
            <p className="text-gray-300 leading-relaxed mb-4">
              We believe that language should never be a barrier to accessing information,
              entertainment, or education. Our AI-powered platform enables creators, businesses,
              and organizations to reach global audiences effortlessly.
            </p>
            <p className="text-gray-300 leading-relaxed">
              With a special focus on Indian languages and underrepresented linguistic communities,
              we're building technology that truly serves a multilingual world.
            </p>
          </div>

          <div className="rounded-2xl bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-400/20 p-8">
            <h3 className="text-2xl font-bold text-white mb-6">By the Numbers</h3>
            <div className="space-y-6">
              <div>
                <p className="text-4xl font-bold text-blue-400 mb-1">95+</p>
                <p className="text-gray-300">Languages Supported</p>
              </div>
              <div>
                <p className="text-4xl font-bold text-cyan-400 mb-1">5.2 TB</p>
                <p className="text-gray-300">Training Data</p>
              </div>
              <div>
                <p className="text-4xl font-bold text-blue-400 mb-1">96.5%</p>
                <p className="text-gray-300">Average Accuracy</p>
              </div>
              <div>
                <p className="text-4xl font-bold text-cyan-400 mb-1">10K+</p>
                <p className="text-gray-300">Hours Processed Daily</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-20">
          <h2 className="text-3xl font-bold text-white text-center mb-12">Our Values</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 flex items-center justify-center border border-blue-400/20 mx-auto mb-4">
                <Target className="w-8 h-8 text-blue-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Accuracy First</h3>
              <p className="text-gray-300">
                We're obsessed with precision. Every model is rigorously tested to ensure
                industry-leading accuracy.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 flex items-center justify-center border border-cyan-400/20 mx-auto mb-4">
                <Globe className="w-8 h-8 text-cyan-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Inclusivity</h3>
              <p className="text-gray-300">
                Supporting underrepresented languages and making technology accessible to all
                linguistic communities.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 flex items-center justify-center border border-blue-400/20 mx-auto mb-4">
                <Shield className="w-8 h-8 text-blue-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Privacy & Security</h3>
              <p className="text-gray-300">
                Your data is yours. We use enterprise-grade encryption and never share your
                content without permission.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 flex items-center justify-center border border-cyan-400/20 mx-auto mb-4">
                <Zap className="w-8 h-8 text-cyan-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Speed & Efficiency</h3>
              <p className="text-gray-300">
                Time is valuable. Our platform is optimized for fast processing without
                compromising quality.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 flex items-center justify-center border border-blue-400/20 mx-auto mb-4">
                <Users className="w-8 h-8 text-blue-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Community Driven</h3>
              <p className="text-gray-300">
                We actively collaborate with linguistic communities to improve our models and
                datasets.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 flex items-center justify-center border border-cyan-400/20 mx-auto mb-4">
                <Award className="w-8 h-8 text-cyan-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Excellence</h3>
              <p className="text-gray-300">
                We continuously push boundaries in AI research to deliver the best possible
                solutions.
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl bg-gradient-to-br from-white/[0.07] to-white/[0.02] border border-white/10 p-12 backdrop-blur-xl text-center">
          <h2 className="text-3xl font-bold text-white mb-6">Partnership with Google</h2>
          <p className="text-gray-300 leading-relaxed max-w-3xl mx-auto mb-8">
            As part of our Proof of Concept initiative, we're collaborating with Google to explore
            next-generation AI models and training methodologies. This partnership is officially
            launching at the 56th International Film Festival of India (IFFI) Goa 2025, marking a
            significant milestone in AI-powered subtitle technology.
          </p>
          <div className="inline-flex items-center gap-4">
            <Award className="w-8 h-8 text-amber-400" />
            <span className="text-amber-400 font-semibold">Launching at IFFI Goa 2025</span>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
};
