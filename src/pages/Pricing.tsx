import { Link } from 'react-router-dom';
import { PublicLayout } from '../components/layout/PublicLayout';
import { Check, Zap, Star, Building } from 'lucide-react';

const plans = [
  {
    name: 'Free Tier',
    price: '$0',
    period: 'forever',
    description: 'Perfect for testing and personal projects',
    features: [
      '100 minutes/month processing',
      'All ISN models included',
      '10 languages supported',
      'Community support',
      'SRT output format',
      'Basic quality metrics',
    ],
    limitations: [
      'No commercial use',
      'Standard processing speed',
    ],
    cta: 'Get Started',
    highlighted: false,
  },
  {
    name: 'Pro',
    price: '$49',
    period: 'per month',
    description: 'For professionals and growing businesses',
    features: [
      '1,000 minutes/month',
      'All models (ISN, Whisper, Google)',
      '95+ languages',
      'Email support (24h response)',
      'All subtitle formats',
      'Advanced quality metrics',
      'API access',
      'Batch processing',
      'Priority processing',
      'Review workflow',
    ],
    limitations: [],
    cta: 'Start Pro Trial',
    highlighted: true,
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    period: 'contact sales',
    description: 'For large organizations with custom needs',
    features: [
      'Unlimited processing',
      'Custom model training',
      'Dedicated infrastructure',
      'Priority support 24/7',
      'SLA guarantees',
      'Custom integrations',
      'On-premise deployment',
      'Team collaboration',
      'Advanced analytics',
      'Account manager',
      'Custom datasets',
      'White-label options',
    ],
    limitations: [],
    cta: 'Contact Sales',
    highlighted: false,
  },
];

const payAsYouGo = [
  { model: 'ISN-ASR', price: '$0.10', unit: 'per minute' },
  { model: 'ISN-MT', price: '$0.08', unit: 'per minute' },
  { model: 'Whisper Large', price: '$0.08', unit: 'per minute' },
  { model: 'Google Speech-to-Text', price: '$0.15', unit: 'per minute' },
  { model: 'Google NMT', price: '$0.12', unit: 'per minute' },
  { model: 'Gemini Context', price: '$0.20', unit: 'per minute' },
];

export const Pricing = () => {
  return (
    <PublicLayout>
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold mb-4">
            <span className="bg-gradient-to-r from-white via-blue-100 to-cyan-200 bg-clip-text text-transparent">
              Simple, Transparent Pricing
            </span>
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Choose the plan that fits your needs. No hidden fees, no surprises.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-20">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`rounded-2xl border p-8 backdrop-blur-xl transition-all ${
                plan.highlighted
                  ? 'bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border-blue-400/50 scale-105'
                  : 'bg-gradient-to-br from-white/[0.07] to-white/[0.02] border-white/10 hover:border-white/20'
              }`}
            >
              {plan.highlighted && (
                <div className="flex justify-center mb-4">
                  <span className="px-3 py-1 rounded-full bg-blue-500 text-white text-xs font-semibold">
                    MOST POPULAR
                  </span>
                </div>
              )}

              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                <div className="mb-2">
                  <span className="text-5xl font-bold text-white">{plan.price}</span>
                  <span className="text-gray-400 ml-2">/ {plan.period}</span>
                </div>
                <p className="text-gray-400">{plan.description}</p>
              </div>

              <Link
                to="/dashboard"
                className={`block w-full text-center py-3 rounded-lg font-semibold mb-6 transition-all ${
                  plan.highlighted
                    ? 'bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white'
                    : 'bg-white/10 hover:bg-white/20 text-white'
                }`}
              >
                {plan.cta}
              </Link>

              <div className="space-y-3 mb-6">
                {plan.features.map((feature) => (
                  <div key={feature} className="flex items-start">
                    <Check className="w-5 h-5 text-green-400 mr-3 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-300 text-sm">{feature}</span>
                  </div>
                ))}
              </div>

              {plan.limitations.length > 0 && (
                <div className="pt-6 border-t border-white/10">
                  <p className="text-xs text-gray-500 mb-2">Limitations:</p>
                  {plan.limitations.map((limitation) => (
                    <p key={limitation} className="text-xs text-gray-500">
                      • {limitation}
                    </p>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Pay-As-You-Go Pricing</h2>
            <p className="text-gray-400">Individual model pricing for maximum flexibility</p>
          </div>

          <div className="max-w-3xl mx-auto rounded-2xl bg-gradient-to-br from-white/[0.07] to-white/[0.02] border border-white/10 backdrop-blur-xl overflow-hidden">
            <div className="divide-y divide-white/10">
              {payAsYouGo.map((item) => (
                <div key={item.model} className="flex items-center justify-between p-6">
                  <span className="text-white font-medium">{item.model}</span>
                  <span className="text-gray-400">
                    <span className="text-2xl font-bold text-white mr-1">{item.price}</span>
                    {item.unit}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="rounded-2xl bg-gradient-to-br from-white/[0.07] to-white/[0.02] border border-white/10 p-6 backdrop-blur-xl text-center">
            <Zap className="w-12 h-12 text-blue-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Volume Discounts</h3>
            <p className="text-gray-300 text-sm">
              Process 10,000+ minutes/month? Contact us for custom volume pricing.
            </p>
          </div>

          <div className="rounded-2xl bg-gradient-to-br from-white/[0.07] to-white/[0.02] border border-white/10 p-6 backdrop-blur-xl text-center">
            <Star className="w-12 h-12 text-cyan-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Academic & Non-Profit</h3>
            <p className="text-gray-300 text-sm">
              Special pricing for educational institutions and non-profit organizations.
            </p>
          </div>

          <div className="rounded-2xl bg-gradient-to-br from-white/[0.07] to-white/[0.02] border border-white/10 p-6 backdrop-blur-xl text-center">
            <Building className="w-12 h-12 text-blue-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Enterprise Solutions</h3>
            <p className="text-gray-300 text-sm">
              Custom contracts with flexible terms, dedicated support, and SLAs.
            </p>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
};
