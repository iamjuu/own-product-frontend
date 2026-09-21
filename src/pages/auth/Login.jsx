import React, { useState, useEffect, useRef } from 'react';
import { 
  ChevronLeft, 
  Eye, 
  EyeOff, 
  Mail, 
  Lock, 
  User as UserIcon, 
  KeyRound, 
  RefreshCw, 
  CheckCircle2, 
  Sparkles,
  Utensils,
  ChefHat,
  Bike,
  ShieldCheck,
  ArrowRight,
  Store,
  Clock,
  ArrowLeft
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const Login = ({ onBackToHome }) => {
  const { login, register, verifyOtp, resendOtp, error: authError } = useAuth();

  // Screen states: 'login' | 'signup' | 'verification' | 'forgot_password' | 'onboarding' (mobile only)
  const [activeTab, setActiveTab] = useState('login'); // 'login' | 'signup' | 'verification' | 'forgot_password'
  
  // Mobile onboarding check
  const [showMobileOnboarding, setShowMobileOnboarding] = useState(() => {
    if (typeof window !== 'undefined') {
      if (sessionStorage.getItem('pending_otp_email')) return false;
      if (sessionStorage.getItem('has_seen_onboarding')) return false;
    }
    return true;
  });
  const [slideIndex, setSlideIndex] = useState(0);

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Signup fields
  const [name, setName] = useState('');
  const [retypePassword, setRetypePassword] = useState('');
  const [showRetypePassword, setShowRetypePassword] = useState(false);

  // OTP Verification state
  const savedPendingEmail = typeof window !== 'undefined' ? sessionStorage.getItem('pending_otp_email') || '' : '';
  const [otpEmail, setOtpEmail] = useState(savedPendingEmail);
  const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', '']);
  const inputRefs = [useRef(null), useRef(null), useRef(null), useRef(null), useRef(null), useRef(null)];
  const [resendCooldown, setResendCooldown] = useState(60);
  const [resendSuccess, setResendSuccess] = useState(false);
  const [currentDebugOtp, setCurrentDebugOtp] = useState('');

  // UI state
  const [isLoading, setIsLoading] = useState(false);
  const [localError, setLocalError] = useState(null);

  // Sync if pending OTP in session
  useEffect(() => {
    if (savedPendingEmail) {
      setActiveTab('verification');
    }
  }, [savedPendingEmail]);

  // OTP countdown timer
  useEffect(() => {
    let timer;
    if (activeTab === 'verification' && resendCooldown > 0) {
      timer = setInterval(() => {
        setResendCooldown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [activeTab, resendCooldown]);

  // Mobile Onboarding slides
  const onboardingSlides = [
    {
      title: 'All your favorites',
      description: 'Get farm vegetables, fresh chicken, seafood & grocery delivered in under 15 minutes',
      icon: (
        <div className="relative w-40 h-40 mx-auto flex items-center justify-center">
          <div className="w-32 h-32 rounded-full bg-gradient-to-tr from-[#FF7622] to-[#FFA767] flex items-center justify-center shadow-2xl text-white">
            <Utensils className="w-14 h-14 drop-shadow-md" />
          </div>
        </div>
      ),
    },
    {
      title: 'Order from choosen chef',
      description: 'Handpicked certified halal chicken, fish and premium grade beef tenderloins',
      icon: (
        <div className="relative w-40 h-40 mx-auto flex items-center justify-center">
          <div className="w-32 h-32 rounded-full bg-gradient-to-tr from-[#FF7622] to-[#FFA767] flex items-center justify-center shadow-2xl text-white">
            <ChefHat className="w-14 h-14 drop-shadow-md" />
          </div>
        </div>
      ),
    },
    {
      title: 'Free delivery offers',
      description: 'Instant radar dispatch from nearest neighborhood hub with doorstep OTP verification',
      icon: (
        <div className="relative w-40 h-40 mx-auto flex items-center justify-center">
          <div className="w-32 h-32 rounded-full bg-gradient-to-tr from-[#FF7622] to-[#FFA767] flex items-center justify-center shadow-2xl text-white">
            <Bike className="w-14 h-14 drop-shadow-md" />
          </div>
        </div>
      ),
    },
  ];

  const handleNextSlide = () => {
    if (slideIndex < onboardingSlides.length - 1) {
      setSlideIndex(slideIndex + 1);
    } else {
      sessionStorage.setItem('has_seen_onboarding', 'true');
      setShowMobileOnboarding(false);
      setActiveTab('login');
    }
  };

  const handleSkipOnboarding = () => {
    sessionStorage.setItem('has_seen_onboarding', 'true');
    setShowMobileOnboarding(false);
    setActiveTab('login');
  };

  // Login submit
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLocalError(null);
    setIsLoading(true);

    const loginEmail = email.trim();
    const result = await login(loginEmail, password);

    if (result.requiresOtp) {
      const target = result.email || loginEmail;
      setOtpEmail(target);
      if (result.debugOtp) setCurrentDebugOtp(String(result.debugOtp));
      sessionStorage.setItem('pending_otp_email', target);
      setOtpDigits(['', '', '', '', '', '']);

      console.log('====================================================');
      console.log(`🔐 [LOGIN OTP CODE for ${target}]:`, result.debugOtp);
      console.log('====================================================');

      setActiveTab('verification');
      setResendCooldown(60);
    } else if (!result.success) {
      setLocalError(result.error || 'Invalid email or password credentials.');
    }

    setIsLoading(false);
  };

  // Signup submit
  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    setLocalError(null);

    if (password !== retypePassword) {
      setLocalError('Passwords do not match. Please verify your password.');
      return;
    }

    setIsLoading(true);
    const signupEmail = email.trim();
    const result = await register(name.trim(), signupEmail, password);

    if (result.requiresOtp) {
      const target = result.email || signupEmail;
      setOtpEmail(target);
      if (result.debugOtp) setCurrentDebugOtp(String(result.debugOtp));
      sessionStorage.setItem('pending_otp_email', target);
      setOtpDigits(['', '', '', '', '', '']);

      console.log('====================================================');
      console.log(`🔐 [REGISTRATION OTP CODE for ${target}]:`, result.debugOtp);
      console.log('====================================================');

      setActiveTab('verification');
      setResendCooldown(60);
    } else if (!result.success) {
      setLocalError(result.error || 'Failed to create account.');
    }

    setIsLoading(false);
  };

  // Verify OTP
  const handleVerifyOtp = async (codeToVerify) => {
    const fullCode = codeToVerify || otpDigits.join('');
    if (fullCode.length < 6) {
      setLocalError('Invalid OTP');
      return;
    }

    setLocalError(null);
    setIsLoading(true);

    const result = await verifyOtp(otpEmail || email, fullCode);
    if (result.success) {
      sessionStorage.removeItem('pending_otp_email');
    } else {
      setLocalError('Invalid OTP');
    }
    setIsLoading(false);
  };

  // OTP typing
  const handleDigitChange = (index, value) => {
    setLocalError(null);
    const cleanVal = value.replace(/\D/g, '');

    if (!cleanVal) {
      const updated = [...otpDigits];
      updated[index] = '';
      setOtpDigits(updated);
      return;
    }

    if (cleanVal.length > 1) {
      const chars = cleanVal.slice(0, 6).split('');
      const updated = [...otpDigits];
      chars.forEach((c, i) => {
        if (i < 6) updated[i] = c;
      });
      setOtpDigits(updated);
      const nextFocus = Math.min(chars.length, 5);
      inputRefs[nextFocus]?.current?.focus();
      if (chars.length === 6) {
        handleVerifyOtp(updated.join(''));
      }
      return;
    }

    const updated = [...otpDigits];
    updated[index] = cleanVal[cleanVal.length - 1];
    setOtpDigits(updated);

    if (index < 5) {
      inputRefs[index + 1]?.current?.focus();
    } else if (updated.join('').length === 6) {
      handleVerifyOtp(updated.join(''));
    }
  };

  const handleDigitKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      inputRefs[index - 1]?.current?.focus();
    }
  };

  // Resend OTP
  const handleResendOtp = async () => {
    if (resendCooldown > 0) return;
    setLocalError(null);
    setResendSuccess(false);

    const result = await resendOtp(otpEmail || email);
    if (result.success) {
      if (result.debugOtp) setCurrentDebugOtp(String(result.debugOtp));
      console.log('====================================================');
      console.log(`🔄 [RESENT OTP CODE for ${otpEmail || email}]:`, result.debugOtp);
      console.log('====================================================');
      setResendSuccess(true);
      setResendCooldown(60);
      setTimeout(() => setResendSuccess(false), 5000);
    } else {
      setLocalError(result.error || 'Failed to resend code');
    }
  };

  return (
    <div className="min-h-screen bg-[#FBFBFB] font-sans selection:bg-[#FF7622]/20 flex flex-col justify-between">
      
      {/* =============================================================
          1. DESKTOP WEB AUTH VIEW (Visible on md: and above)
          Full 2-Column Split-Screen layout with fresh grocery branding
         ============================================================= */}
      <div className="hidden md:flex min-h-screen">
        {/* Left Side: Brand Visuals, Fresh Food & Testimonials */}
        <div className="w-1/2 bg-gradient-to-br from-[#181C2E] via-[#21263F] to-[#121422] text-white p-12 lg:p-16 flex flex-col justify-between relative overflow-hidden">
          {/* Subtle Ambient Glow */}
          <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-[#FF7622]/15 blur-3xl pointer-events-none"></div>
          <div className="absolute -bottom-24 -right-24 w-96 h-96 rounded-full bg-[#FFA767]/10 blur-3xl pointer-events-none"></div>

          {/* Top Brand Logo */}
          <div className="relative z-10 flex items-center justify-between">
            <div 
              onClick={onBackToHome}
              className="flex items-center space-x-2.5 cursor-pointer group"
            >
              <div className="w-10 h-10 rounded-xl bg-[#FF7622] text-white flex items-center justify-center shadow-lg shadow-[#FF7622]/30 group-hover:scale-105 transition-transform">
                <Utensils className="w-5 h-5" />
              </div>
              <span className="text-2xl font-black text-white tracking-tight">
                Local Run<span className="text-[#FF7622]">.</span>
              </span>
            </div>

            <button
              onClick={onBackToHome}
              className="text-xs font-bold text-slate-300 hover:text-white flex items-center space-x-1.5 transition-colors bg-white/10 hover:bg-white/15 px-3.5 py-2 rounded-xl"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Storefront</span>
            </button>
          </div>

          {/* Center Showcase */}
          <div className="relative z-10 space-y-8 my-auto py-8 max-w-lg">
            <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-[#FF7622]/20 border border-[#FF7622]/40 text-[#FF7622] text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>15-Min Express Hyperlocal Grocery</span>
            </div>

            <h2 className="text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
              Fresh vegetables, chicken, seafood & pantry essentials.
            </h2>

            <p className="text-sm text-slate-300 leading-relaxed">
              Order farm-fresh Roma tomatoes, fresh tender chicken breast, Atlantic salmon fillets, halal beef mince, and organic honey with doorstep OTP protection.
            </p>

            {/* 5 Categories Pills */}
            <div className="flex flex-wrap gap-2 pt-2">
              {['🥬 Organic Vegetables', '🍗 Farm Fresh Chicken', '🐟 Wild Seafood', '🥩 Halal Prime Beef', '🍯 Grocery Pantry'].map((badge, idx) => (
                <span 
                  key={idx} 
                  className="px-3 py-1 rounded-full text-xs font-semibold bg-white/10 text-slate-200 border border-white/10"
                >
                  {badge}
                </span>
              ))}
            </div>

            {/* Quote Card */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/15 space-y-2">
              <p className="text-xs text-slate-200 italic">
                "Local Run delivers our weekly chicken, broccoli, and fresh salmon faster than any local store. The OTP verification ensures zero wrong drops!"
              </p>
              <div className="flex items-center justify-between text-[11px] text-slate-400 font-bold">
                <span className="text-white">Ayesha Khan — Bangalore</span>
                <span className="text-amber-400">★★★★★ 5.0 Rating</span>
              </div>
            </div>
          </div>

          {/* Bottom Security Highlights */}
          <div className="relative z-10 flex items-center space-x-6 text-xs text-slate-400">
            <div className="flex items-center space-x-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>100% Halal & Farm Verified</span>
            </div>
            <span>•</span>
            <div className="flex items-center space-x-1.5">
              <Clock className="w-4 h-4 text-[#FF7622]" />
              <span>15-Minute Live Radar ETA</span>
            </div>
          </div>
        </div>

        {/* Right Side: Modern Desktop Auth Form Container */}
        <div className="w-1/2 bg-white p-12 lg:p-16 flex flex-col justify-between overflow-y-auto">
          <div className="max-w-md w-full mx-auto my-auto space-y-6">
            
            {/* Top Switcher Tabs (Sign In / Sign Up) */}
            <div className="flex items-center space-x-3 bg-[#F0F5FA] p-1.5 rounded-2xl">
              <button
                type="button"
                onClick={() => {
                  setLocalError(null);
                  setActiveTab('login');
                }}
                className={`flex-1 py-3 rounded-xl text-xs font-black transition-all ${
                  activeTab === 'login'
                    ? 'bg-white text-[#181C2E] shadow-sm'
                    : 'text-slate-500 hover:text-[#181C2E]'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => {
                  setLocalError(null);
                  setActiveTab('signup');
                }}
                className={`flex-1 py-3 rounded-xl text-xs font-black transition-all ${
                  activeTab === 'signup'
                    ? 'bg-white text-[#181C2E] shadow-sm'
                    : 'text-slate-500 hover:text-[#181C2E]'
                }`}
              >
                Create Account
              </button>
            </div>

            {/* Header Info */}
            <div>
              <h1 className="text-2xl font-black text-[#181C2E] tracking-tight">
                {activeTab === 'login' && 'Welcome Back to Local Run'}
                {activeTab === 'signup' && 'Join Local Run Marketplace'}
                {activeTab === 'verification' && 'Enter 6-Digit OTP Code'}
                {activeTab === 'forgot_password' && 'Reset Account Password'}
              </h1>
              <p className="text-xs text-slate-500 mt-1">
                {activeTab === 'login' && 'Sign in to access your cart, addresses, and track active deliveries.'}
                {activeTab === 'signup' && 'Sign up in 30 seconds to enjoy free delivery on your first 3 grocery orders.'}
                {activeTab === 'verification' && `We sent a security code to ${otpEmail || email}`}
                {activeTab === 'forgot_password' && 'Enter your registered email address to receive password instructions.'}
              </p>
            </div>

            {/* Resend success notice */}
            {resendSuccess && (
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-700 text-center">
                A new code was sent! Check your browser DevTools Console.
              </div>
            )}

            {/* -------------------------------------------------------------
                DESKTOP VIEW: SIGN IN
               ------------------------------------------------------------- */}
            {activeTab === 'login' && (
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold tracking-wider text-slate-600 uppercase">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="user@marketplace.com"
                    className="w-full px-4 py-3.5 rounded-xl bg-[#F0F5FA] border border-transparent text-[#181C2E] text-xs font-bold placeholder:text-[#A0A5BA] focus:outline-none focus:bg-white focus:border-[#FF7622] transition-all"
                  />
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] font-bold tracking-wider text-slate-600 uppercase">
                      Password
                    </label>
                    <button
                      type="button"
                      onClick={() => setActiveTab('forgot_password')}
                      className="text-xs font-semibold text-[#FF7622] hover:underline"
                    >
                      Forgot?
                    </button>
                  </div>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full pl-4 pr-11 py-3.5 rounded-xl bg-[#F0F5FA] border border-transparent text-[#181C2E] text-xs font-bold placeholder:text-[#A0A5BA] focus:outline-none focus:bg-white focus:border-[#FF7622] transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-3.5 text-[#A0A5BA] hover:text-[#181C2E]"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <label className="flex items-center space-x-2 text-xs text-slate-600 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-4 h-4 rounded border-slate-300 text-[#FF7622] focus:ring-[#FF7622] accent-[#FF7622]"
                    />
                    <span>Remember my session</span>
                  </label>
                </div>

                {/* Error message text only, without background */}
                {(localError || authError) && (
                  <p className="text-xs font-bold text-rose-500 pt-1 text-center animate-in fade-in">
                    {localError || authError}
                  </p>
                )}

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-4 rounded-xl bg-[#FF7622] hover:bg-[#E56314] active:scale-[0.99] text-white font-black text-xs uppercase tracking-wider shadow-lg shadow-[#FF7622]/25 transition-all disabled:opacity-50"
                >
                  {isLoading ? 'SIGNING IN...' : 'SIGN IN TO LOCAL RUN'}
                </button>

                {/* Quick test credentials reminder */}
                <div className="p-3.5 rounded-2xl bg-orange-50/80 border border-orange-200/80 text-[11px] space-y-2">
                  <p className="font-bold text-[#FF7622] flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    Quick One-Click Test Logins:
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setEmail('master@gmail.com');
                        setPassword('123');
                        setLocalError(null);
                      }}
                      className="p-2.5 rounded-xl bg-white border border-orange-200 hover:border-[#FF7622] text-left transition-all group shadow-2xs hover:shadow-sm"
                    >
                      <span className="block font-black text-[#181C2E] group-hover:text-[#FF7622] text-xs">👑 Master Admin</span>
                      <span className="block text-slate-500 font-mono text-[10px] mt-0.5">master@gmail.com</span>
                      <span className="block text-[#FF7622] font-mono text-[10px] font-bold">pass: 123</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setEmail('admin@gmail.com');
                        setPassword('123');
                        setLocalError(null);
                      }}
                      className="p-2.5 rounded-xl bg-white border border-orange-200 hover:border-[#FF7622] text-left transition-all group shadow-2xs hover:shadow-sm"
                    >
                      <span className="block font-black text-[#181C2E] group-hover:text-[#FF7622] text-xs">⚙️ Operations Admin</span>
                      <span className="block text-slate-500 font-mono text-[10px] mt-0.5">admin@gmail.com</span>
                      <span className="block text-[#FF7622] font-mono text-[10px] font-bold">pass: 123</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setEmail('user@marketplace.com');
                        setPassword('User123!');
                        setLocalError(null);
                      }}
                      className="p-2.5 rounded-xl bg-white border border-orange-200 hover:border-[#FF7622] text-left transition-all group shadow-2xs hover:shadow-sm"
                    >
                      <span className="block font-black text-[#181C2E] group-hover:text-[#FF7622] text-xs">🛍️ Customer User</span>
                      <span className="block text-slate-500 font-mono text-[10px] mt-0.5">user@marketplace</span>
                      <span className="block text-[#FF7622] font-mono text-[10px] font-bold">pass: User123!</span>
                    </button>
                  </div>
                </div>
              </form>
            )}

            {/* -------------------------------------------------------------
                DESKTOP VIEW: SIGN UP
               ------------------------------------------------------------- */}
            {activeTab === 'signup' && (
              <form onSubmit={handleSignupSubmit} className="space-y-3.5">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold tracking-wider text-slate-600 uppercase">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ayesha Khan"
                    className="w-full px-4 py-3 rounded-xl bg-[#F0F5FA] border border-transparent text-[#181C2E] text-xs font-bold placeholder:text-[#A0A5BA] focus:outline-none focus:bg-white focus:border-[#FF7622] transition-all"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold tracking-wider text-slate-600 uppercase">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="ayesha@gmail.com"
                    className="w-full px-4 py-3 rounded-xl bg-[#F0F5FA] border border-transparent text-[#181C2E] text-xs font-bold placeholder:text-[#A0A5BA] focus:outline-none focus:bg-white focus:border-[#FF7622] transition-all"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold tracking-wider text-slate-600 uppercase">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full pl-4 pr-11 py-3 rounded-xl bg-[#F0F5FA] border border-transparent text-[#181C2E] text-xs font-bold placeholder:text-[#A0A5BA] focus:outline-none focus:bg-white focus:border-[#FF7622] transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-3 text-[#A0A5BA] hover:text-[#181C2E]"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold tracking-wider text-slate-600 uppercase">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <input
                      type={showRetypePassword ? 'text' : 'password'}
                      required
                      value={retypePassword}
                      onChange={(e) => setRetypePassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full pl-4 pr-11 py-3 rounded-xl bg-[#F0F5FA] border border-transparent text-[#181C2E] text-xs font-bold placeholder:text-[#A0A5BA] focus:outline-none focus:bg-white focus:border-[#FF7622] transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowRetypePassword(!showRetypePassword)}
                      className="absolute right-3.5 top-3 text-[#A0A5BA] hover:text-[#181C2E]"
                    >
                      {showRetypePassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Error message text only, without background */}
                {(localError || authError) && (
                  <p className="text-xs font-bold text-rose-500 pt-1 text-center animate-in fade-in">
                    {localError || authError}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-4 rounded-xl bg-[#FF7622] hover:bg-[#E56314] active:scale-[0.99] text-white font-black text-xs uppercase tracking-wider shadow-lg shadow-[#FF7622]/25 transition-all disabled:opacity-50"
                >
                  {isLoading ? 'CREATING ACCOUNT...' : 'REGISTER ACCOUNT'}
                </button>
              </form>
            )}

            {/* -------------------------------------------------------------
                DESKTOP VIEW: OTP VERIFICATION
               ------------------------------------------------------------- */}
            {activeTab === 'verification' && (
              <div className="space-y-5">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-700 uppercase tracking-wider text-[11px]">
                      Verification Code
                    </span>
                    <button
                      type="button"
                      disabled={resendCooldown > 0}
                      onClick={handleResendOtp}
                      className="font-bold text-xs text-slate-500 hover:text-[#FF7622] disabled:opacity-60 transition-colors"
                    >
                      {resendCooldown > 0 ? (
                        <span>Resend in <strong className="text-[#FF7622]">{resendCooldown}s</strong></span>
                      ) : (
                        <span className="text-[#FF7622] underline">Resend code</span>
                      )}
                    </button>
                  </div>

                  <div className="grid grid-cols-6 gap-2 w-full">
                    {otpDigits.map((digit, idx) => (
                      <input
                        key={idx}
                        ref={inputRefs[idx]}
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        maxLength={6}
                        value={digit}
                        autoFocus={idx === 0}
                        onChange={(e) => handleDigitChange(idx, e.target.value)}
                        onKeyDown={(e) => handleDigitKeyDown(idx, e)}
                        className={`w-full min-w-0 h-13 rounded-2xl text-center text-xl font-black transition-all outline-none ${
                          digit
                            ? 'bg-white border-2 border-[#FF7622] text-[#181C2E] shadow-sm'
                            : 'bg-[#F0F5FA] border-2 border-transparent text-[#181C2E] focus:border-[#FF7622] focus:bg-white'
                        }`}
                      />
                    ))}
                  </div>

                  {/* Plain text error without background, as user requested */}
                  {(localError || authError) && (
                    <p className="text-xs font-bold text-rose-500 text-center pt-1 animate-in fade-in">
                      Invalid OTP
                    </p>
                  )}

                  {currentDebugOtp && (
                    <button
                      type="button"
                      onClick={() => {
                        const chars = currentDebugOtp.split('').slice(0, 6);
                        setOtpDigits(chars);
                        handleVerifyOtp(currentDebugOtp);
                      }}
                      className="w-full p-2.5 rounded-xl bg-orange-50 hover:bg-orange-100 border border-orange-200 text-xs text-[#FF7622] font-bold text-center cursor-pointer transition-colors shadow-2xs"
                    >
                      ⚡ One-Click Verify Code: <span className="font-mono text-sm tracking-widest underline ml-1 text-[#181C2E] font-black">{currentDebugOtp}</span>
                    </button>
                  )}

                  <p className="text-[11px] text-slate-400 text-center pt-1 font-medium">
                    ⚡ Verification code is also printed in your DevTools Console and server terminal.
                  </p>
                </div>

                <button
                  type="button"
                  disabled={isLoading || otpDigits.join('').length < 6}
                  onClick={() => handleVerifyOtp()}
                  className="w-full py-4 rounded-xl bg-[#FF7622] hover:bg-[#E56314] active:scale-[0.99] text-white font-black text-xs uppercase tracking-wider shadow-lg shadow-[#FF7622]/25 transition-all disabled:opacity-50"
                >
                  {isLoading ? 'VERIFYING...' : 'CONFIRM & SIGN IN'}
                </button>
              </div>
            )}

            {/* -------------------------------------------------------------
                DESKTOP VIEW: FORGOT PASSWORD
               ------------------------------------------------------------- */}
            {activeTab === 'forgot_password' && (
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold tracking-wider text-slate-600 uppercase">
                    Your Registered Email
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="user@marketplace.com"
                    className="w-full px-4 py-3.5 rounded-xl bg-[#F0F5FA] border border-transparent text-[#181C2E] text-xs font-bold placeholder:text-[#A0A5BA] focus:outline-none focus:bg-white focus:border-[#FF7622] transition-all"
                  />
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setResendSuccess(true);
                    setTimeout(() => setActiveTab('login'), 2000);
                  }}
                  className="w-full py-4 rounded-xl bg-[#FF7622] hover:bg-[#E56314] active:scale-[0.99] text-white font-black text-xs uppercase tracking-wider shadow-lg shadow-[#FF7622]/25 transition-all"
                >
                  SEND RECOVERY CODE
                </button>

                <div className="text-center pt-2">
                  <button
                    type="button"
                    onClick={() => setActiveTab('login')}
                    className="text-xs font-bold text-slate-500 hover:text-[#FF7622]"
                  >
                    Back to Sign In
                  </button>
                </div>
              </div>
            )}

          </div>

          <div className="text-center text-xs text-slate-400 max-w-md mx-auto pt-6">
            <p>© 2026 Local Run Marketplace. All rights reserved.</p>
          </div>
        </div>
      </div>

      {/* =============================================================
          2. MOBILE AUTH VIEW (Visible ONLY on < md)
          Figma Mobile Design (Dark top header + White curved sheet)
         ============================================================= */}
      <div className="block md:hidden min-h-screen bg-[#121223] flex flex-col justify-between">
        {showMobileOnboarding ? (
          /* Mobile Onboarding Screen */
          <div className="min-h-screen bg-white flex flex-col justify-between p-6 font-sans">
            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center space-x-2">
                <span className="w-8 h-8 rounded-full bg-[#FF7622] flex items-center justify-center text-white font-black text-sm">
                  L
                </span>
                <span className="font-extrabold text-[#181C2E] text-base tracking-tight">Local Run</span>
              </div>
              <button
                onClick={handleSkipOnboarding}
                className="text-sm font-semibold text-[#646982] hover:text-[#FF7622] py-1 px-3"
              >
                Skip
              </button>
            </div>

            <div className="my-auto py-8 text-center space-y-6">
              {onboardingSlides[slideIndex].icon}
              <div className="space-y-2 px-2">
                <h2 className="text-2xl font-black text-[#181C2E]">
                  {onboardingSlides[slideIndex].title}
                </h2>
                <p className="text-xs text-[#646982] leading-relaxed max-w-xs mx-auto">
                  {onboardingSlides[slideIndex].description}
                </p>
              </div>

              <div className="flex justify-center items-center space-x-2 pt-2">
                {onboardingSlides.map((_, idx) => (
                  <span
                    key={idx}
                    className={`transition-all rounded-full h-2.5 ${
                      idx === slideIndex ? 'w-6 bg-[#FF7622]' : 'w-2.5 bg-slate-200'
                    }`}
                  />
                ))}
              </div>
            </div>

            <div className="pb-4 space-y-3">
              <button
                onClick={handleNextSlide}
                className="w-full py-4 rounded-2xl bg-[#FF7622] text-white font-extrabold text-xs tracking-wider uppercase shadow-xl shadow-[#FF7622]/30"
              >
                {slideIndex === onboardingSlides.length - 1 ? 'GET STARTED' : 'NEXT'}
              </button>
            </div>
          </div>
        ) : (
          /* Mobile Form with Dark Header & Curved White Sheet */
          <>
            {/* Top Dark Header */}
            <div className="pt-8 pb-8 px-6">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => {
                    setLocalError(null);
                    if (activeTab === 'verification' || activeTab === 'signup' || activeTab === 'forgot_password') {
                      setActiveTab('login');
                    } else if (onBackToHome) {
                      onBackToHome();
                    }
                  }}
                  className="w-10 h-10 rounded-full bg-white/10 text-white flex items-center justify-center"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>

                <div>
                  <h1 className="text-2xl font-black text-white">
                    {activeTab === 'login' && 'Log In'}
                    {activeTab === 'signup' && 'Sign Up'}
                    {activeTab === 'verification' && 'Verification'}
                    {activeTab === 'forgot_password' && 'Forgot Password'}
                  </h1>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {activeTab === 'login' && 'Please sign in to your existing account'}
                    {activeTab === 'signup' && 'Please sign up to get started'}
                    {activeTab === 'verification' && `We sent a code to ${otpEmail || email}`}
                    {activeTab === 'forgot_password' && 'Enter your email for code'}
                  </p>
                </div>
              </div>
            </div>

            {/* White Curved Bottom Sheet */}
            <div className="flex-1 bg-white rounded-t-[32px] p-6 flex flex-col justify-between shadow-2xl">
              <div>
                {/* Form Error text only without background */}
                {(localError || authError) && activeTab !== 'verification' && (
                  <p className="mb-3 text-xs font-bold text-rose-500 text-center animate-in fade-in">
                    {localError || authError}
                  </p>
                )}

                {/* Mobile View: Log In */}
                {activeTab === 'login' && (
                  <form onSubmit={handleLoginSubmit} className="space-y-4">
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-[#32343E] uppercase tracking-wider">
                        EMAIL
                      </label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="user@marketplace.com"
                        className="w-full px-4 py-3.5 rounded-xl bg-[#F0F5FA] border border-transparent text-[#181C2E] text-xs font-bold placeholder:text-[#A0A5BA] focus:outline-none focus:border-[#FF7622]"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-[#32343E] uppercase tracking-wider">
                        PASSWORD
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword ? 'text' : 'password'}
                          required
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="••••••••••••"
                          className="w-full pl-4 pr-11 py-3.5 rounded-xl bg-[#F0F5FA] border border-transparent text-[#181C2E] text-xs font-bold placeholder:text-[#A0A5BA] focus:outline-none focus:border-[#FF7622]"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3.5 top-3.5 text-[#A0A5BA]"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <label className="flex items-center space-x-2 text-xs text-[#646982]">
                        <input
                          type="checkbox"
                          checked={rememberMe}
                          onChange={(e) => setRememberMe(e.target.checked)}
                          className="w-4 h-4 rounded text-[#FF7622] accent-[#FF7622]"
                        />
                        <span>Remember me</span>
                      </label>
                      <button
                        type="button"
                        onClick={() => setActiveTab('forgot_password')}
                        className="text-xs font-semibold text-[#FF7622]"
                      >
                        Forgot Password
                      </button>
                    </div>

                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full py-4 rounded-xl bg-[#FF7622] hover:bg-[#E56314] text-white font-black text-xs uppercase tracking-wider shadow-lg shadow-[#FF7622]/30"
                    >
                      {isLoading ? 'SIGNING IN...' : 'LOG IN'}
                    </button>

                    <div className="text-center pt-2">
                      <span className="text-xs text-[#646982]">Don't have an account? </span>
                      <button
                        type="button"
                        onClick={() => setActiveTab('signup')}
                        className="text-xs font-black text-[#FF7622] uppercase"
                      >
                        SIGN UP
                      </button>
                    </div>
                  </form>
                )}

                {/* Mobile View: Sign Up */}
                {activeTab === 'signup' && (
                  <form onSubmit={handleSignupSubmit} className="space-y-3">
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-[#32343E] uppercase tracking-wider">
                        NAME
                      </label>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="John Doe"
                        className="w-full px-4 py-3 rounded-xl bg-[#F0F5FA] border border-transparent text-[#181C2E] text-xs font-bold focus:border-[#FF7622]"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-[#32343E] uppercase tracking-wider">
                        EMAIL
                      </label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="example@gmail.com"
                        className="w-full px-4 py-3 rounded-xl bg-[#F0F5FA] border border-transparent text-[#181C2E] text-xs font-bold focus:border-[#FF7622]"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-[#32343E] uppercase tracking-wider">
                        PASSWORD
                      </label>
                      <input
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••••••"
                        className="w-full px-4 py-3 rounded-xl bg-[#F0F5FA] border border-transparent text-[#181C2E] text-xs font-bold focus:border-[#FF7622]"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-[#32343E] uppercase tracking-wider">
                        RE-TYPE PASSWORD
                      </label>
                      <input
                        type="password"
                        required
                        value={retypePassword}
                        onChange={(e) => setRetypePassword(e.target.value)}
                        placeholder="••••••••••••"
                        className="w-full px-4 py-3 rounded-xl bg-[#F0F5FA] border border-transparent text-[#181C2E] text-xs font-bold focus:border-[#FF7622]"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full py-4 rounded-xl bg-[#FF7622] text-white font-black text-xs uppercase tracking-wider shadow-lg shadow-[#FF7622]/30"
                    >
                      {isLoading ? 'CREATING...' : 'SIGN UP'}
                    </button>

                    <div className="text-center pt-1">
                      <span className="text-xs text-[#646982]">Already have an account? </span>
                      <button
                        type="button"
                        onClick={() => setActiveTab('login')}
                        className="text-xs font-black text-[#FF7622] uppercase"
                      >
                        LOG IN
                      </button>
                    </div>
                  </form>
                )}

                {/* Mobile View: Verification OTP */}
                {activeTab === 'verification' && (
                  <div className="space-y-5">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-[#32343E] uppercase tracking-wider text-[11px]">
                          CODE
                        </span>
                        <button
                          type="button"
                          disabled={resendCooldown > 0}
                          onClick={handleResendOtp}
                          className="font-bold text-xs text-[#646982]"
                        >
                          {resendCooldown > 0 ? (
                            <span>Resend in <span className="text-[#FF7622] font-black">{resendCooldown}s</span></span>
                          ) : (
                            <span className="text-[#FF7622] underline">Resend code</span>
                          )}
                        </button>
                      </div>

                      <div className="grid grid-cols-6 gap-2 w-full">
                        {otpDigits.map((digit, idx) => (
                          <input
                            key={idx}
                            ref={inputRefs[idx]}
                            type="text"
                            inputMode="numeric"
                            pattern="[0-9]*"
                            maxLength={6}
                            value={digit}
                            autoFocus={idx === 0}
                            onChange={(e) => handleDigitChange(idx, e.target.value)}
                            onKeyDown={(e) => handleDigitKeyDown(idx, e)}
                            className={`w-full min-w-0 h-13 rounded-2xl text-center text-xl font-black transition-all outline-none ${
                              digit
                                ? 'bg-white border-2 border-[#FF7622] text-[#181C2E] shadow-sm'
                                : 'bg-[#F0F5FA] border-2 border-transparent text-[#181C2E] focus:border-[#FF7622] focus:bg-white'
                            }`}
                          />
                        ))}
                      </div>

                      {/* Plain text Invalid OTP error */}
                      {(localError || authError) && (
                        <p className="text-xs font-bold text-rose-500 text-center pt-1 animate-in fade-in">
                          Invalid OTP
                        </p>
                      )}

                      {currentDebugOtp && (
                        <button
                          type="button"
                          onClick={() => {
                            const chars = currentDebugOtp.split('').slice(0, 6);
                            setOtpDigits(chars);
                            handleVerifyOtp(currentDebugOtp);
                          }}
                          className="w-full p-2.5 rounded-xl bg-orange-50 hover:bg-orange-100 border border-orange-200 text-xs text-[#FF7622] font-bold text-center cursor-pointer transition-colors"
                        >
                          ⚡ Tap to Auto-Fill Code: <span className="font-mono text-sm tracking-widest underline ml-1 text-[#181C2E] font-black">{currentDebugOtp}</span>
                        </button>
                      )}

                      <p className="text-[11px] text-slate-400 text-center pt-1 font-medium">
                        ⚡ Check your browser DevTools Console for the OTP code.
                      </p>
                    </div>

                    <button
                      type="button"
                      disabled={isLoading || otpDigits.join('').length < 6}
                      onClick={() => handleVerifyOtp()}
                      className="w-full py-4 rounded-xl bg-[#FF7622] text-white font-black text-xs uppercase tracking-wider shadow-lg shadow-[#FF7622]/30"
                    >
                      {isLoading ? 'VERIFYING...' : 'VERIFY'}
                    </button>
                  </div>
                )}
              </div>

              <div className="pt-4 text-center">
                <p className="text-[10px] text-slate-400 font-medium">
                  Local Run Marketplace Platform
                </p>
              </div>
            </div>
          </>
        )}
      </div>

    </div>
  );
};
