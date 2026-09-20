'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowRight, ShieldCheck, Lock, Mail, Building, AlertCircle, KeyRound, CheckCircle2, RefreshCw } from 'lucide-react';

export default function SignUpPage() {
  const router = useRouter();
  const [step, setStep] = useState<'form' | 'verify'>('form');
  const [businessName, setBusinessName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';

  const handleInitiateSignUp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!email.trim() || !password.trim()) {
      setErrorMsg('Please complete all required fields.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${apiBase}/api/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim(),
          password: password,
          business_name: businessName.trim() || 'My Business'
        })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.detail || 'Could not initiate registration.');
      }

      if (data.status === 'otp_sent') {
        setSuccessMsg(data.message || `Verification code sent to ${email}. Please check your email inbox.`);
        setStep('verify');
      } else if (data.access_token) {
        localStorage.setItem('bf_user_email', email);
        if (businessName.trim()) localStorage.setItem('bf_business_name', businessName);
        localStorage.setItem('bf_auth_token', data.access_token);
        window.location.href = '/onboarding';
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Could not send verification email. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMsg('');

    if (!otpCode.trim() || otpCode.trim().length < 6) {
      setErrorMsg('Please enter the valid 6-digit verification code.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${apiBase}/api/auth/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim(),
          code: otpCode.trim()
        })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.detail || 'Invalid verification code.');
      }

      localStorage.setItem('bf_user_email', email);
      if (businessName.trim()) {
        localStorage.setItem('bf_business_name', businessName);
      }
      localStorage.setItem('bf_auth_token', data.access_token || `jwt-token-${Date.now()}`);
      
      window.location.href = '/onboarding';
    } catch (err: any) {
      setErrorMsg(err.message || 'Invalid 6-digit verification code. Please check your email and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setErrorMsg('');
    setSuccessMsg('');
    setLoading(true);
    try {
      const res = await fetch(`${apiBase}/api/auth/resend-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() })
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.detail || 'Could not resend verification code.');
      }
      setSuccessMsg('A new 6-digit verification code has been sent to your email.');
    } catch (err: any) {
      setErrorMsg(err.message || 'Could not resend verification code.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F6FA] flex flex-col justify-center py-12 px-6 font-sans text-slate-900">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link href="/" className="inline-flex items-center justify-center gap-2 mb-2">
          <span className="font-bold text-3xl tracking-tight text-slate-900">
            f<span className="bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent font-extrabold">o</span>resight<span className="text-[#2563EB]">AI</span>
          </span>
        </Link>
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Create your Business Account</h2>
        <p className="text-xs text-slate-500 mt-1">Start monitoring risks and opportunities personalized to your company.</p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white p-8 border border-slate-200/80 rounded-2xl shadow-sm">
          {errorMsg && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-700 text-xs p-3.5 rounded-xl flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              {errorMsg}
            </div>
          )}

          {successMsg && (
            <div className="mb-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs p-3.5 rounded-xl flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              {successMsg}
            </div>
          )}

          {step === 'form' ? (
            <form onSubmit={handleInitiateSignUp} action="#" className="space-y-5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Company / Business Name</label>
                <div className="relative">
                  <Building className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    required
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    className="w-full text-xs border border-slate-200 rounded-xl p-3 pl-10 bg-slate-50 text-slate-900 focus:outline-none focus:border-[#2563EB]"
                    placeholder="e.g. IKEA / Levi's / Acme Apparel"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Work Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full text-xs border border-slate-200 rounded-xl p-3 pl-10 bg-slate-50 text-slate-900 focus:outline-none focus:border-[#2563EB]"
                    placeholder="name@company.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Create Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full text-xs border border-slate-200 rounded-xl p-3 pl-10 bg-slate-50 text-slate-900 focus:outline-none focus:border-[#2563EB]"
                    placeholder="At least 8 characters"
                  />
                </div>
              </div>

              <button
                type="submit"
                onClick={(e) => { e.preventDefault(); handleInitiateSignUp(e); }}
                disabled={loading}
                className="w-full bg-[#2563EB] hover:bg-blue-700 text-white font-semibold py-3 rounded-xl text-xs flex items-center justify-center gap-2 shadow-md shadow-blue-500/20 transition-all cursor-pointer"
              >
                {loading ? "Sending Verification Code..." : "Send Verification Code"}
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOTP} action="#" className="space-y-5">
              <div className="text-center p-4 bg-blue-50/60 border border-blue-100 rounded-xl mb-3">
                <KeyRound className="w-6 h-6 text-blue-600 mx-auto mb-1" />
                <h3 className="font-bold text-xs text-slate-900">Check Your Email Inbox</h3>
                <p className="text-[11px] text-slate-500 mt-1">We sent a 6-digit security verification code to <strong>{email}</strong>.</p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5 text-center">Enter 6-Digit Security Code</label>
                <input
                  type="text"
                  maxLength={6}
                  required
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value.replace(/[^0-9]/g, ''))}
                  className="w-full text-center tracking-[0.5em] font-mono text-lg font-bold border border-slate-300 rounded-xl p-3 bg-slate-50 text-slate-900 focus:outline-none focus:border-[#2563EB]"
                  placeholder="000000"
                />
              </div>

              <button
                type="submit"
                onClick={(e) => { e.preventDefault(); handleVerifyOTP(e); }}
                disabled={loading}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 rounded-xl text-xs flex items-center justify-center gap-2 shadow-md shadow-emerald-500/20 transition-all cursor-pointer"
              >
                {loading ? "Verifying Account..." : "Verify Code & Start Onboarding"}
                <CheckCircle2 className="w-4 h-4" />
              </button>

              <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setStep('form')}
                  className="hover:text-slate-800 underline cursor-pointer"
                >
                  Change Email
                </button>
                <button
                  type="button"
                  onClick={handleResendOTP}
                  disabled={loading}
                  className="text-blue-600 hover:text-blue-800 font-semibold inline-flex items-center gap-1 cursor-pointer"
                >
                  <RefreshCw className="w-3 h-3" />
                  Resend Code
                </button>
              </div>
            </form>
          )}

          <div className="mt-6 pt-6 border-t border-slate-100 text-center text-xs text-slate-500">
            Already have an account?{' '}
            <Link href="/login" className="font-semibold text-blue-600 hover:underline">
              Sign In
            </Link>
          </div>
        </div>

        <div className="mt-6 text-center text-xs text-slate-400 flex items-center justify-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-slate-500" />
          Multi-Tenant Data Privacy Guaranteed
        </div>
      </div>
    </div>
  );
}
