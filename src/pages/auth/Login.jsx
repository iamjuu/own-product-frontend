import React, { useState, useEffect } from 'react';
import { ShieldCheck, Lock, Mail, ArrowRight, AlertCircle, KeyRound, RefreshCw, ArrowLeft, Sparkles, Bike } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { usePlatform } from '../../context/PlatformContext';
import { DeliveryPartnerApplyModal } from '../../components/delivery/DeliveryPartnerApplyModal';

export const Login = () => {
  const { login, verifyOtp, resendOtp, error: authError } = useAuth();
  const { appearance } = usePlatform();
  const savedPendingEmail = typeof window !== 'undefined' ? sessionStorage.getItem('pending_otp_email') || '' : '';
  // const [email, setEmail] = useState('masteradmin@marketplace.com');
  // const [password, setPassword] = useState('MasterAdmin123!');
  const [email, setEmail] = useState('a@gmail.com');
  const [password, setPassword] = useState('123');
  const [activeEmail, setActiveEmail] = useState(savedPendingEmail);
  const [debugOtp, setDebugOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showApplyModal, setShowApplyModal] = useState(false);

  // OTP Step State (persists across page reloads if user is midway through OTP)
  const [isOtpStep, setIsOtpStep] = useState(!!savedPendingEmail);
  const [otp, setOtp] = useState('');
  const [resendCooldown, setResendCooldown] = useState(0);
  const [resendSuccess, setResendSuccess] = useState(false);

  useEffect(() => {
    let timer;
    if (resendCooldown > 0) {
      timer = setInterval(() => {
        setResendCooldown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [resendCooldown]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const loginEmail = email.trim();
    const result = await login(loginEmail, password);
    if (result.requiresOtp) {
      const target = result.email || loginEmail;
      setActiveEmail(target);
      sessionStorage.setItem('pending_otp_email', target);
      console.log('==============================================');
      console.log(`🔐 [2FA OTP VERIFICATION CODE for ${target}]:`, result.debugOtp);
      console.log('==============================================');
      setOtp('');
      setIsOtpStep(true);
      setResendCooldown(60);
    } else if (!result.success) {
      setError(result.error);
    }
    setIsLoading(false);
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!otp || otp.length < 6) {
      setError('Please enter a valid 6-digit OTP code.');
      return;
    }

    setIsLoading(true);
    setError(null);
    const result = await verifyOtp(activeEmail || email, otp);
    if (result.success) {
      sessionStorage.removeItem('pending_otp_email');
    } else {
      setError(result.error);
    }
    setIsLoading(false);
  };

  const handleResendOtp = async () => {
    if (resendCooldown > 0) return;
    setError(null);
    setResendSuccess(false);
    const result = await resendOtp(activeEmail || email);
    if (result.success) {
      console.log('==============================================');
      console.log(`🔄 [NEW 2FA OTP CODE for ${activeEmail || email}]:`, result.debugOtp);
      console.log('==============================================');
      setResendSuccess(true);
      setResendCooldown(60);
      setTimeout(() => setResendSuccess(false), 5000);
    } else {
      setError(result.error);
    }
  };

  const handleBackToLogin = () => {
    sessionStorage.removeItem('pending_otp_email');
    setIsOtpStep(false);
    setError(null);
    setOtp('');
  };

  const handleFillMasterAdmin = () => {
    sessionStorage.removeItem('pending_otp_email');
    setEmail('masteradmin@marketplace.com');
    setPassword('MasterAdmin123!');
    setIsOtpStep(false);
    setError(null);
  };

  const handleFillAdmin = () => {
    sessionStorage.removeItem('pending_otp_email');
    setEmail('a@gmail.com');
    setPassword('123');
    setIsOtpStep(false);
    setError(null);
  };

  const handleFillShopOwner = () => {
    sessionStorage.removeItem('pending_otp_email');
    setEmail('abc@marketplace.com');
    setPassword('ShopOwner123!');
    setIsOtpStep(false);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-[#f0f2fb] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Dynamic Background Glows */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-[#6339f4]/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-[#ece8ff] rounded-full blur-3xl pointer-events-none"></div>

      <div className="w-full max-w-md relative z-10">
        <div className="theme-card p-8 rounded-3xl shadow-2xl border border-slate-200/80 space-y-6">
          <div className="text-center space-y-2">
            <div className="inline-flex p-3 rounded-2xl bg-[#6339f4] text-white shadow-xl shadow-[#6339f4]/30 ring-4 ring-[#ece8ff] mb-2">
              {isOtpStep ? <KeyRound className="w-8 h-8 animate-pulse" /> : <ShieldCheck className="w-8 h-8" />}
            </div>
            <h1 className="text-2xl font-black tracking-tight text-[#181829]">
              {appearance?.platformName || 'Marketplace Console'}
            </h1>
            <p className="text-xs text-[#8a87a6] font-medium">
              {isOtpStep
                ? 'Two-Factor OTP Authentication Required'
                : appearance?.loginPageSubheading || 'Platform Governance & Operational Oversight'}
            </p>
          </div>

          {(error || authError) && (
            <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 flex items-center space-x-2 text-xs text-rose-700">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{error || authError}</span>
            </div>
          )}

          {resendSuccess && (
            <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-700 font-bold text-center">
              A new OTP code has been generated! (Check console)
            </div>
          )}

          {!isOtpStep ? (
            /* Step 1: Email & Password Form */
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#181829]">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#8a87a6] absolute left-3.5 top-3.5" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@marketplace.com"
                    className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-[#f0f2fb] border border-slate-200/80 text-[#181829] text-xs font-bold placeholder:text-[#8a87a6] focus:outline-none focus:border-[#6339f4]"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#181829]">Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#8a87a6] absolute left-3.5 top-3.5" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-[#f0f2fb] border border-slate-200/80 text-[#181829] text-xs font-bold placeholder:text-[#8a87a6] focus:outline-none focus:border-[#6339f4]"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-4 rounded-2xl bg-[#6339f4] hover:bg-[#5327ec] text-white text-xs font-black tracking-wide shadow-lg shadow-[#6339f4]/30 hover:shadow-[#6339f4]/40 flex items-center justify-center space-x-2 transition-all disabled:opacity-50"
              >
                <span>{isLoading ? 'Verifying Credentials...' : 'Sign In to Console'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          ) : (
            /* Step 2: 2FA OTP Form */
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div className="p-3.5 rounded-2xl bg-indigo-50 border border-indigo-100 text-center space-y-1">
                <p className="text-[11px] text-indigo-900 font-medium">
                  OTP sent to <span className="font-bold">{activeEmail || email}</span>
                </p>
                <p className="text-[11px] text-indigo-600 font-bold">
                  ⚡ Check your browser console or server terminal for the OTP code.
                </p>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#181829]">Enter 6-Digit OTP</label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-[#8a87a6] absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                    placeholder="Enter 6-digit OTP"
                    className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-[#f0f2fb] border border-slate-200/80 text-[#181829] text-center tracking-widest text-lg font-black placeholder:text-[#8a87a6] focus:outline-none focus:border-[#6339f4]"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading || otp.length !== 6}
                className="w-full py-3 px-4 rounded-2xl bg-[#6339f4] hover:bg-[#5327ec] text-white text-xs font-black tracking-wide shadow-lg shadow-[#6339f4]/30 hover:shadow-[#6339f4]/40 flex items-center justify-center space-x-2 transition-all disabled:opacity-50"
              >
                <span>{isLoading ? 'Verifying OTP...' : 'Verify OTP & Enter Console'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={handleBackToLogin}
                  className="inline-flex items-center space-x-1 text-xs text-[#8a87a6] hover:text-[#181829] font-bold"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back</span>
                </button>

                <button
                  type="button"
                  disabled={resendCooldown > 0}
                  onClick={handleResendOtp}
                  className="inline-flex items-center space-x-1 text-xs text-[#6339f4] hover:text-[#5327ec] font-bold disabled:opacity-50"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${resendCooldown > 0 ? 'animate-spin' : ''}`} />
                  <span>{resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Resend OTP'}</span>
                </button>
              </div>
            </form>
          )}

          {/* Quick Demo Fill Buttons */}
          <div className="pt-2 border-t border-slate-100 flex flex-col space-y-2 text-center">
            <span className="text-[11px] text-[#8a87a6] font-semibold">Quick Demo Logins:</span>
            <div className="flex justify-center space-x-3">
              <button
                type="button"
                onClick={handleFillMasterAdmin}
                className="text-[11px] px-3 py-1 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-[#6339f4] font-bold transition-all"
              >
                Master Admin
              </button>
              <button
                type="button"
                onClick={handleFillAdmin}
                className="text-[11px] px-3 py-1 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 font-bold transition-all"
              >
                Operations Admin (2FA)
              </button>
              <button
                type="button"
                onClick={handleFillShopOwner}
                className="text-[11px] px-3 py-1 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 font-bold transition-all"
              >
                Restaurant Owner
              </button>
            </div>
          </div>

          {/* Join Fleet / Apply as Delivery Partner */}
          <div className="pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setShowApplyModal(true)}
              className="w-full py-2.5 px-4 rounded-2xl bg-gradient-to-r from-emerald-500/10 via-emerald-500/20 to-emerald-500/10 hover:from-emerald-500/20 hover:to-emerald-500/30 text-emerald-700 border border-emerald-300/80 text-xs font-black flex items-center justify-center space-x-2 transition-all shadow-sm"
            >
              <Bike className="w-4 h-4 text-emerald-600" />
              <span>Want to Earn with Us? Apply as Delivery Partner</span>
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            </button>
          </div>
        </div>

        <p className="text-center text-[11px] text-[#8a87a6] mt-6 font-bold">
          Protected Platform Console • Supporting <code className="text-[#6339f4] font-black">MASTER_ADMIN</code>, <code className="text-purple-600 font-black">ADMIN</code> & <code className="text-amber-600 font-black">SHOP_OWNER</code>
        </p>
      </div>

      {/* Delivery Partner Application Wizard Modal */}
      <DeliveryPartnerApplyModal
        isOpen={showApplyModal}
        onClose={() => setShowApplyModal(false)}
      />
    </div>
  );
};
