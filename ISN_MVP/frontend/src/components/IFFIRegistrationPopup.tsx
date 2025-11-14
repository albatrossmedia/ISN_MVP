import { useState, useEffect } from 'react';
import { X, Film, Award, CheckCircle2, AlertCircle } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';
import toast from 'react-hot-toast';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

interface FormData {
  fullName: string;
  officialEmail: string;
  phoneNumber: string;
  businessType: string;
  state: string;
  country: string;
  notes: string;
}

interface FormErrors {
  [key: string]: string;
}

export function IFFIRegistrationPopup() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [registrationNumber, setRegistrationNumber] = useState('');
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    officialEmail: '',
    phoneNumber: '',
    businessType: '',
    state: '',
    country: '',
    notes: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});

  useEffect(() => {
    const hasSeenPopup = localStorage.getItem('iffi_popup_seen');
    const hasDismissed = localStorage.getItem('iffi_popup_dismissed');

    if (!hasSeenPopup && !hasDismissed) {
      const timer = setTimeout(() => {
        setIsOpen(true);
        localStorage.setItem('iffi_popup_seen', 'true');
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone: string): boolean => {
    const phoneRegex = /^[+]?[\d\s\-()]{10,}$/;
    return phoneRegex.test(phone);
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    } else if (formData.fullName.trim().length < 2) {
      newErrors.fullName = 'Name must be at least 2 characters';
    }

    if (!formData.officialEmail.trim()) {
      newErrors.officialEmail = 'Official email is required';
    } else if (!validateEmail(formData.officialEmail)) {
      newErrors.officialEmail = 'Please enter a valid email address';
    }

    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = 'Phone number is required';
    } else if (!validatePhone(formData.phoneNumber)) {
      newErrors.phoneNumber = 'Please enter a valid phone number';
    }

    if (!formData.businessType) {
      newErrors.businessType = 'Please select your business type';
    }

    if (!formData.state.trim()) {
      newErrors.state = 'State is required';
    }

    if (!formData.country.trim()) {
      newErrors.country = 'Country is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error('Please fix the errors in the form');
      return;
    }

    setIsSubmitting(true);

    try {
      const { data, error } = await supabase
        .from('early_registrations')
        .insert([
          {
            full_name: formData.fullName.trim(),
            official_email: formData.officialEmail.trim().toLowerCase(),
            phone_number: formData.phoneNumber.trim(),
            business_type: formData.businessType,
            state: formData.state.trim(),
            country: formData.country.trim(),
            notes: formData.notes.trim() || null,
          },
        ])
        .select('registration_number')
        .single();

      if (error) {
        if (error.code === '23505') {
          toast.error('This email is already registered');
          setErrors((prev) => ({ ...prev, officialEmail: 'Email already registered' }));
        } else {
          toast.error('Registration failed. Please try again.');
          console.error('Registration error:', error);
        }
        return;
      }

      setRegistrationNumber(data.registration_number);
      setIsSuccess(true);
      toast.success('Registration successful!');
      localStorage.setItem('iffi_registered', 'true');
    } catch (error) {
      console.error('Unexpected error:', error);
      toast.error('An unexpected error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    localStorage.setItem('iffi_popup_dismissed', 'true');
  };


  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl border border-amber-500/20 shadow-2xl shadow-amber-500/10">
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 transition-all duration-300 z-10"
          aria-label="Close popup"
        >
          <X className="w-5 h-5 text-gray-300" />
        </button>

        {!isSuccess ? (
          <div className="p-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg shadow-amber-500/30">
                <Film className="w-8 h-8 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Award className="w-5 h-5 text-amber-400" />
                  <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider">
                    Official Launch
                  </span>
                </div>
                <h2 className="text-2xl font-bold text-white">
                  56th IFFI Goa International Film Festival
                </h2>
              </div>
            </div>

            <div className="mb-6 p-4 rounded-xl bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20">
              <p className="text-amber-100 text-sm leading-relaxed">
                Be among the first to experience our revolutionary AI-powered subtitle generation platform.
                Register now for exclusive early access for OTT platforms, broadcasters, and post-production studios.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="fullName" className="block text-sm font-medium text-gray-300 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 rounded-lg bg-white/5 border ${
                    errors.fullName ? 'border-red-500' : 'border-white/10'
                  } text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 transition-all`}
                  placeholder="Enter your full name"
                />
                {errors.fullName && (
                  <p className="mt-1 text-sm text-red-400 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.fullName}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="officialEmail" className="block text-sm font-medium text-gray-300 mb-2">
                  Official Email *
                </label>
                <input
                  type="email"
                  id="officialEmail"
                  name="officialEmail"
                  value={formData.officialEmail}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 rounded-lg bg-white/5 border ${
                    errors.officialEmail ? 'border-red-500' : 'border-white/10'
                  } text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 transition-all`}
                  placeholder="you@company.com"
                />
                {errors.officialEmail && (
                  <p className="mt-1 text-sm text-red-400 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.officialEmail}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-300 mb-2">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  id="phoneNumber"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 rounded-lg bg-white/5 border ${
                    errors.phoneNumber ? 'border-red-500' : 'border-white/10'
                  } text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 transition-all`}
                  placeholder="+91 98765 43210"
                />
                {errors.phoneNumber && (
                  <p className="mt-1 text-sm text-red-400 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.phoneNumber}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="businessType" className="block text-sm font-medium text-gray-300 mb-2">
                  Business Type *
                </label>
                <select
                  id="businessType"
                  name="businessType"
                  value={formData.businessType}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 rounded-lg bg-white/5 border ${
                    errors.businessType ? 'border-red-500' : 'border-white/10'
                  } text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 transition-all`}
                >
                  <option value="" className="bg-slate-800">Select your business type</option>
                  <option value="OTT Platform" className="bg-slate-800">OTT Platform</option>
                  <option value="Broadcaster" className="bg-slate-800">Broadcaster</option>
                  <option value="Post Production Studio" className="bg-slate-800">Post Production Studio</option>
                  <option value="Other" className="bg-slate-800">Other</option>
                </select>
                {errors.businessType && (
                  <p className="mt-1 text-sm text-red-400 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.businessType}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="country" className="block text-sm font-medium text-gray-300 mb-2">
                    Country *
                  </label>
                  <input
                    type="text"
                    id="country"
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 rounded-lg bg-white/5 border ${
                      errors.country ? 'border-red-500' : 'border-white/10'
                    } text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 transition-all`}
                    placeholder="India"
                  />
                  {errors.country && (
                    <p className="mt-1 text-sm text-red-400 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.country}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="state" className="block text-sm font-medium text-gray-300 mb-2">
                    State/Region *
                  </label>
                  <input
                    type="text"
                    id="state"
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 rounded-lg bg-white/5 border ${
                      errors.state ? 'border-red-500' : 'border-white/10'
                    } text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 transition-all`}
                    placeholder="Maharashtra"
                  />
                  {errors.state && (
                    <p className="mt-1 text-sm text-red-400 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.state}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label htmlFor="notes" className="block text-sm font-medium text-gray-300 mb-2">
                  Additional Notes (Optional)
                </label>
                <textarea
                  id="notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 transition-all resize-none"
                  placeholder="Tell us more about your requirements or interests..."
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full px-6 py-4 rounded-lg bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-semibold text-lg transition-all duration-300 shadow-lg shadow-amber-500/30 hover:shadow-amber-500/50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Registering...
                  </>
                ) : (
                  'Register for Early Access'
                )}
              </button>

              <p className="text-xs text-gray-500 text-center">
                By registering, you agree to receive updates about our platform and IFFI Goa launch.
              </p>
            </form>
          </div>
        ) : (
          <div className="p-8 text-center">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-green-500/30">
              <CheckCircle2 className="w-10 h-10 text-white" />
            </div>

            <h3 className="text-3xl font-bold text-white mb-4">
              Registration Successful!
            </h3>

            <div className="mb-6 p-4 rounded-xl bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20">
              <p className="text-sm text-gray-400 mb-2">Your Registration Number</p>
              <p className="text-2xl font-bold text-amber-400 tracking-wider">
                {registrationNumber}
              </p>
            </div>

            <p className="text-gray-300 mb-8 leading-relaxed">
              Thank you for registering! We'll contact you soon with exclusive early access details
              and updates about the 56th IFFI Goa International Film Festival launch.
            </p>

            <button
              onClick={handleClose}
              className="px-8 py-3 rounded-lg bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-semibold transition-all duration-300 shadow-lg shadow-amber-500/30"
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
