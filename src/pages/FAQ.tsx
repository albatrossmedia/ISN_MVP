import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ChevronDown, ChevronUp } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
}

const faqs: FAQItem[] = [
  {
    question: 'What is IndicSubtitleNet?',
    answer: 'IndicSubtitleNet is an AI-powered subtitle generation platform that supports 95+ languages, with a special focus on Indian languages. It uses advanced speech recognition, machine translation, and quality assurance models to create accurate subtitles automatically.',
  },
  {
    question: 'Which languages are supported?',
    answer: 'We support 95+ languages including all major Indian languages (Hindi, Tamil, Telugu, Malayalam, Kannada, Bengali, Marathi, Gujarati, Punjabi, etc.) and international languages (English, Spanish, French, German, Chinese, Japanese, Korean, Arabic, and many more).',
  },
  {
    question: 'How accurate are the subtitles?',
    answer: 'Our AI models achieve 95%+ accuracy for major languages. Accuracy varies based on audio quality, speaker clarity, and language. We provide quality scores (WER, BLEU, COMET) for each job and offer human review options for critical content.',
  },
  {
    question: 'What file formats are supported?',
    answer: 'We support all major video formats (MP4, AVI, MOV, MKV, WebM) and audio formats (MP3, WAV, AAC, FLAC, OGG). Output subtitles are available in SRT, VTT, ASS, and SSA formats.',
  },
  {
    question: 'How long does subtitle generation take?',
    answer: 'Processing time depends on video length and selected models. Typically: 1 hour of video takes 5-15 minutes. Real-time streaming mode is available for live events. You can monitor progress in real-time through our Job Monitor.',
  },
  {
    question: 'Can I edit the generated subtitles?',
    answer: 'Yes! Our platform includes a built-in subtitle editor with waveform visualization, timing adjustment tools, and keyboard shortcuts. You can also queue jobs for human review through our Review Operations workflow.',
  },
  {
    question: 'How much does it cost?',
    answer: 'Pricing is based on processing time and selected models. ISN models start at $0.10/minute, Google models at $0.15/minute, and Whisper at $0.08/minute. Volume discounts are available. Check our Pricing page for detailed information.',
  },
  {
    question: 'What AI models do you use?',
    answer: 'We offer multiple model options: ISN-ASR (our proprietary speech recognition), Whisper (OpenAI), Google Speech-to-Text for ASR, Google NMT, mBART, ISN-MT for translation, and Gemini Pro, GPT-4, ISN-Context for contextualization.',
  },
  {
    question: 'Is my data secure?',
    answer: 'Yes. We use enterprise-grade encryption (AES-256), secure data transfer (TLS 1.3), and comply with GDPR. Files are automatically deleted after processing unless you opt to keep them. We never share or use your content for training without explicit consent.',
  },
  {
    question: 'Can I use this for commercial projects?',
    answer: 'Yes, commercial use is allowed. Different license tiers are available based on your needs. Enterprise plans include custom models, dedicated infrastructure, and priority support.',
  },
  {
    question: 'Do you offer bulk processing?',
    answer: 'Yes! You can submit multiple files simultaneously. Our platform automatically queues and processes jobs efficiently. Enterprise customers get dedicated processing pipelines for large-scale operations.',
  },
  {
    question: 'Can I train custom models?',
    answer: 'Yes, enterprise customers can train custom models using their own datasets. Our Training Operations dashboard allows you to configure hyperparameters, monitor training progress, and deploy custom models.',
  },
  {
    question: 'What quality assurance features are included?',
    answer: 'We provide automated quality checks (WER, BLEU, COMET scores), subtitle quality index (SQI), real-time QA during processing, and comparison tools to benchmark against other providers.',
  },
  {
    question: 'Is there an API available?',
    answer: 'Yes, we provide a comprehensive REST API with webhooks for automation. Documentation includes code examples in Python, JavaScript, and cURL. API access is included in Pro and Enterprise plans.',
  },
  {
    question: 'What support options are available?',
    answer: 'Free tier: Community support. Pro: Email support (24h response). Enterprise: Priority support with dedicated account manager, SLA guarantees, and direct engineering access.',
  },
  {
    question: 'Can I cancel my subscription anytime?',
    answer: 'Yes, you can cancel anytime. No long-term contracts required for standard plans. Enterprise plans have flexible terms. Unused credits can be refunded or transferred.',
  },
];

export const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-black to-slate-950"></div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-900/20 via-transparent to-transparent"></div>

      <div className="relative">
        <nav className="border-b border-white/5 backdrop-blur-xl bg-black/30">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <Link to="/" className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                  <Sparkles className="w-6 h-6" />
                </div>
                <span className="text-xl font-bold">IndicSubtitleNet</span>
              </Link>

              <div className="hidden md:flex items-center gap-6">
                <Link to="/models" className="text-gray-300 hover:text-white transition-colors">
                  Models
                </Link>
                <Link to="/datasets" className="text-gray-300 hover:text-white transition-colors">
                  Datasets
                </Link>
                <Link to="/pricing" className="text-gray-300 hover:text-white transition-colors">
                  Pricing
                </Link>
                <Link to="/faq" className="text-white font-medium">
                  FAQ
                </Link>
                <Link to="/about" className="text-gray-300 hover:text-white transition-colors">
                  About
                </Link>
                <Link to="/contact" className="text-gray-300 hover:text-white transition-colors">
                  Contact
                </Link>
              </div>

              <div className="flex items-center gap-3">
                <Link
                  to="/login"
                  className="px-4 py-2 rounded-lg text-gray-300 hover:text-white transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/dashboard"
                  className="px-6 py-2.5 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 transition-all duration-300 font-medium"
                >
                  Get Started
                </Link>
              </div>
            </div>
          </div>
        </nav>

        <section className="max-w-4xl mx-auto px-6 py-20">
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-6xl font-bold mb-4">
              <span className="bg-gradient-to-r from-white via-blue-100 to-cyan-200 bg-clip-text text-transparent">
                Frequently Asked Questions
              </span>
            </h1>
            <p className="text-xl text-gray-400">
              Everything you need to know about IndicSubtitleNet
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="rounded-xl bg-white/5 border border-white/10 backdrop-blur-xl overflow-hidden transition-all duration-300 hover:border-white/20"
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full px-6 py-5 flex items-center justify-between text-left"
                >
                  <span className="text-lg font-semibold text-white pr-8">
                    {faq.question}
                  </span>
                  {openIndex === index ? (
                    <ChevronUp className="w-5 h-5 text-blue-400 flex-shrink-0" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />
                  )}
                </button>
                {openIndex === index && (
                  <div className="px-6 pb-5">
                    <p className="text-gray-300 leading-relaxed">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="mt-16 text-center p-8 rounded-2xl bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-400/20">
            <h3 className="text-2xl font-bold text-white mb-3">
              Still have questions?
            </h3>
            <p className="text-gray-300 mb-6">
              Our team is here to help. Reach out anytime.
            </p>
            <Link
              to="/contact"
              className="inline-flex px-8 py-3 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 transition-all duration-300 font-medium"
            >
              Contact Support
            </Link>
          </div>
        </section>

        <footer className="border-t border-white/5 backdrop-blur-xl bg-black/30 mt-20">
          <div className="max-w-7xl mx-auto px-6 py-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                  <Sparkles className="w-5 h-5" />
                </div>
                <span className="font-semibold">IndicSubtitleNet</span>
              </div>
              <p className="text-gray-500 text-sm">
                AI-Powered Subtitle Generation Platform
              </p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};
