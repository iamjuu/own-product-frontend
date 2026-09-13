import React, { useState, useEffect } from 'react';
import { ShieldCheck, Lock, Mail, ArrowRight, AlertCircle, KeyRound, RefreshCw, ArrowLeft, Sparkles } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { usePlatform } from '../../context/PlatformContext';

export const Login = () => {
  const { login, verifyOtp, resendOtp, error: authError } = useAuth();
  const { appearance } = usePlatform();
  const [email, setEmail] = useState('masteradmin@marketplace.com');
  const [password, setPassword] = useState('MasterAdmin123!');
  const [activeEmail, setActiveEmail] = useState('');
  const [debugOtp, setDebugOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // OTP Step State
  const [isOtpStep, setIsOtpStep] = useState(false);
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
      const code = result.debugOtp || '123456';
      setActiveEmail(result.email || loginEmail);
      setDebugOtp(code);
      setOtp(code);
      console.log(`%c🔐 [2FA OTP VERIFICATION CODE for ${result.email || loginEmail}]: ${code}`, 'color: #6339f4; font-size: 14px; font-weight: bold;');
      setIsOtpStep(true);
      setResendCooldown(60);
    } else if (!result.success) {
      setError(result.error);
    }
    setIsLoading(false);
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    const codeToVerify = otp || debugOtp || '123456';
    if (!codeToVerify || codeToVerify.length < 6) {
      setError('Please enter a valid 6-digit OTP code.');
      return;
    }

    setIsLoading(true);
    setError(null);
    const result = await verifyOtp(activeEmail || email, codeToVerify);
    if (!result.success) {
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
      const code = result.debugOtp || '123456';
      setDebugOtp(code);
      setOtp(code);
      console.log(`%c🔄 [NEW 2FA OTP CODE]: ${code}`, 'color: #6339f4; font-size: 14px; font-weight: bold;');
      setResendSuccess(true);
      setResendCooldown(60);
      setTimeout(() => setResendSuccess(false), 5000);
    } else {
      setError(result.error);
    }
  };

  const handleFillMasterAdmin = () => {
    setEmail('masteradmin@marketplace.com');
    setPassword('MasterAdmin123!');
    setIsOtpStep(false);
    setError(null);
  };

  const handleFillAdmin = () => {
    setEmail('admin@marketplace.com');
    setPassword('Admin123!');
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
              A new OTP code has been generated! (Check terminal console)
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
                  ⚡ Check your terminal or browser console for the verification OTP.
                </p>
              </div>

              {debugOtp && (
                <div className="p-3 rounded-2xl bg-[#ece8ff]/80 border border-[#6339f4]/30 text-center space-y-1.5 shadow-sm">
                  <div className="flex items-center justify-center space-x-1.5 text-xs text-[#6339f4] font-bold">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Your Verification OTP:</span>
                    <span className="font-mono text-sm font-black tracking-widest bg-white px-2.5 py-0.5 rounded-lg border border-[#6339f4]/30 text-[#6339f4]">
                      {debugOtp}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setOtp(debugOtp)}
                    className="text-[11px] text-[#6339f4] hover:text-[#5327ec] font-bold underline cursor-pointer"
                  >
                    Click to auto-fill code ({debugOtp})
                  </button>
                </div>
              )}

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
                    placeholder="123456"
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
                  onClick={() => setIsOtpStep(false)}
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
            </div>
          </div>
        </div>

        <p className="text-center text-[11px] text-[#8a87a6] mt-6 font-bold">
          Protected Platform Console • Supporting <code className="text-[#6339f4] font-black">MASTER_ADMIN</code> & <code className="text-purple-600 font-black">ADMIN</code>
        </p>
      </div>
    </div>
  );
};
