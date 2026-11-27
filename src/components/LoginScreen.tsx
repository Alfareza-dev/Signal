'use client';

import React, { useState } from 'react';
import { Eye, EyeOff, Mail, Sparkles } from 'lucide-react';
import { SiggyMascot } from './SiggyMascot';

interface LoginScreenProps {
  onLogin: (name: string, email: string) => void;
}

export function LoginScreen({ onLogin }: LoginScreenProps) {
  const [email, setEmail] = useState('researcher@signal.local');
  const [password, setPassword] = useState('signal-demo-2026');
  const [showPassword, setShowPassword] = useState(false);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin('UX Researcher', email.trim() || 'researcher@signal.local');
  };

  const handleQuickDemoLogin = () => {
    onLogin('UX Researcher', 'researcher@signal.local');
  };

  return (
    <div className="min-h-screen w-screen flex items-center justify-center bg-[#FDE6E4] p-4 sm:p-8 relative overflow-hidden">
      {/* Subtle Pastel Background Blobs */}
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-[#FFF0EA] rounded-full blur-3xl opacity-80 pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-[#FF7B7B]/15 rounded-full blur-3xl pointer-events-none" />

      {/* Centered Split-Card Container */}
      <div className="relative z-10 w-full max-w-[960px] bg-white rounded-3xl shadow-[0_20px_60px_rgba(45,33,58,0.08)] border border-[#F2E4E0] p-4 sm:p-5 grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 items-stretch animate-fade-slide">
        {/* Left Column: Soft Peach Panel + Wordmark + Siggy 3D Mascot */}
        <div className="rounded-2xl bg-[#FFF0EA] p-6 sm:p-8 flex flex-col justify-between overflow-hidden min-h-[360px]">
          <div className="flex items-center gap-1">
            <span className="text-xl font-extrabold tracking-tight text-[#2D213A]">
              Signal
            </span>
            <span className="text-xl font-extrabold text-[#FF7B7B]">.</span>
          </div>

          <div className="my-2 flex items-center justify-center">
            <SiggyMascot variant="hero" />
          </div>
        </div>

        {/* Right Column: Clean Login Form + Quick Role Switcher */}
        <div className="px-4 sm:px-8 py-6 sm:py-8 flex flex-col justify-center">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-[#2D213A]">Login</h1>
            <p className="text-xs text-[#7A6B84] mt-1">
              Masuk ke Signal Research Workspace
            </p>
          </div>

          <form onSubmit={handleFormSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#2D213A] mb-1.5">
                Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#7A6B84] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="researcher@signal.local"
                  className="w-full bg-white border border-[#E9B949] rounded-xl pl-10 pr-3.5 py-2.5 text-sm text-[#2D213A] placeholder:text-[#B5A7BE] focus:outline-none focus:border-[#E9B949] focus:ring-2 focus:ring-[#E9B949]/25 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#2D213A] mb-1.5">
                Password
              </label>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label="Toggle password visibility"
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#7A6B84] hover:text-[#2D213A] cursor-pointer"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-white border border-[#F2E4E0] rounded-xl pl-10 pr-3.5 py-2.5 text-sm text-[#2D213A] placeholder:text-[#B5A7BE] focus:outline-none focus:border-[#E9B949] focus:ring-2 focus:ring-[#E9B949]/25 transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-2xl bg-[#FF7B7B] hover:bg-[#F26666] border-b-4 border-[#DF5656] active:border-b-0 active:translate-y-1 text-white text-sm font-bold shadow-xs transition-all cursor-pointer mt-1"
            >
              Masuk ke Workspace
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-5">
            <div className="h-px flex-1 bg-[#F2E4E0]" />
            <span className="text-[11px] font-medium text-[#7A6B84] whitespace-nowrap">
              Atau 1-Klik
            </span>
            <div className="h-px flex-1 bg-[#F2E4E0]" />
          </div>

          <button
            type="button"
            onClick={handleQuickDemoLogin}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl bg-[#FFF7F5] hover:bg-[#FFF0EA] border border-[#F2E4E0] hover:border-[#FF7B7B]/60 text-xs font-bold text-[#2D213A] transition-all cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-[#FF7B7B]" />
            <span>Masuk Cepat (Demo)</span>
          </button>
        </div>
      </div>
    </div>
  );
}
