import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Box, Mail, ArrowLeft, CheckCircle } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';

export const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // TODO: Add password reset logic here
    console.log('Password reset request for:', email);

    setTimeout(() => {
      setLoading(false);
      setEmailSent(true);
    }, 1500);
  };

  const handleResend = () => {
    setLoading(true);
    console.log('Resending email to:', email);

    setTimeout(() => {
      setLoading(false);
    }, 1500);
  };

  if (emailSent) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-green-900/20 via-slate-900 to-slate-900"></div>

        <div className="relative w-full max-w-md">
          <div className="absolute -top-4 -left-4 w-72 h-72 bg-green-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob"></div>
          <div className="absolute -bottom-4 -right-4 w-72 h-72 bg-cyan-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob animation-delay-2000"></div>

          <div className="relative bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-slate-700 p-8 shadow-2xl">
            <div className="flex flex-col items-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-cyan-500 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
                <CheckCircle className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-white mb-2">Check Your Email</h1>
              <p className="text-gray-400 text-center">
                We've sent a password reset link to
              </p>
              <p className="text-white font-semibold mt-1">{email}</p>
            </div>

            <div className="bg-slate-900/50 border border-slate-600 rounded-lg p-4 mb-6">
              <p className="text-sm text-gray-400 mb-2">
                Didn't receive the email? Check your spam folder or try resending it.
              </p>
              <button
                onClick={handleResend}
                disabled={loading}
                className="text-sm text-blue-400 hover:text-blue-300 font-semibold transition-colors disabled:opacity-50"
              >
                {loading ? 'Sending...' : 'Resend email'}
              </button>
            </div>

            <Link
              to="/login"
              className="flex items-center justify-center gap-2 w-full py-3 px-4 bg-white/5 border border-slate-600 text-white font-semibold rounded-lg hover:bg-white/10 transition-all"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Sign In
            </Link>

            <p className="mt-6 text-center text-xs text-gray-500">
              The password reset link will expire in 1 hour for security reasons.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-900/20 via-slate-900 to-slate-900"></div>

      <div className="relative w-full max-w-md">
        <div className="absolute -top-4 -left-4 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob"></div>
        <div className="absolute -bottom-4 -right-4 w-72 h-72 bg-cyan-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob animation-delay-2000"></div>

        <div className="relative bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-slate-700 p-8 shadow-2xl">
          <Link
            to="/login"
            className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">Back to Sign In</span>
          </Link>

          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
              <Box className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Reset Password</h1>
            <p className="text-gray-400 text-center">
              Enter your email address and we'll send you a link to reset your password
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  className="w-full pl-10 pr-4 py-3 bg-slate-900/50 border border-slate-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl hover:from-blue-600 hover:to-cyan-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Sending reset link...' : 'Send Reset Link'}
            </button>
          </form>

          <div className="mt-6 bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
            <p className="text-sm text-blue-300">
              <strong className="font-semibold">Note:</strong> If you don't receive an email within a few minutes,
              please check your spam folder or verify that you entered the correct email address.
            </p>
          </div>

          <p className="mt-8 text-center text-sm text-gray-400">
            Remember your password?{' '}
            <Link to="/login" className="text-blue-400 hover:text-blue-300 font-semibold transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
