'use client';

import React, { useState } from 'react';
import {
  ArrowRight,
  Cpu,
  Lock,
  Mail,
  MessageSquareQuote,
  Radio,
  ShieldCheck,
  Sparkles,
  User,
} from 'lucide-react';

interface LoginScreenProps {
  onLogin: (name: string, email: string) => void;
}

export function LoginScreen({ onLogin }: LoginScreenProps) {
  const [name, setName] = useState('UX Researcher');
  const [email, setEmail] = useState('researcher@signal.local');
  const [password, setPassword] = useState('••••••••••••');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(
      name.trim() || 'UX Researcher',
      email.trim() || 'researcher@signal.local'
    );
  };

  return (
    <div className="min-h-screen w-screen flex flex-col lg:flex-row bg-white text-gray-900">
      {/* Left Side: Simple & Attractive Animated Discovery Showcase */}
      <div className="lg:w-1/2 bg-[#F8F9FA] border-b lg:border-b-0 lg:border-r border-[#E5E7EB] p-8 lg:p-14 flex flex-col justify-between relative overflow-hidden">
        {/* Subtle animated background glow */}
        <div className="absolute -top-24 -left-24 w-80 h-80 bg-blue-100/60 rounded-full blur-3xl animate-pulse pointer-events-none" />
        <div
          className="absolute -bottom-24 -right-24 w-80 h-80 bg-indigo-100/50 rounded-full blur-3xl animate-pulse pointer-events-none"
          style={{ animationDelay: '1.2s' }}
        />

        {/* Brand Header */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-blue-600 text-white flex items-center justify-center shadow-xs">
            <Radio className="w-5 h-5" />
          </div>
          <div>
            <span className="text-base font-semibold text-gray-900 block leading-tight">
              Signal
            </span>
            <span className="text-xs text-gray-500">
              Research Workspace · UXR Problem Discovery
            </span>
          </div>
        </div>

        {/* Center Animated Pipeline Illustration */}
        <div className="relative z-10 my-10 lg:my-0 max-w-md mx-auto w-full space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-[#E5E7EB] text-xs font-medium text-gray-600 shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            <span>Local-First · Low-AI Architecture</span>
          </div>

          <h2 className="text-2xl lg:text-3xl font-semibold text-gray-900 tracking-tight leading-snug">
            Ubah keluhan pengguna mentah menjadi{' '}
            <span className="text-blue-600">rumusan masalah</span> yang tajam.
          </h2>

          {/* Animated Floating Cards */}
          <div className="space-y-3 pt-2">
            {/* Step 1 Card */}
            <div className="p-3.5 rounded-xl bg-white border border-[#E5E7EB] shadow-xs flex items-center gap-3.5 transform transition-all duration-700 hover:-translate-y-0.5">
              <div className="w-9 h-9 rounded-lg bg-sky-50 border border-sky-200/70 flex items-center justify-center shrink-0">
                <MessageSquareQuote className="w-4 h-4 text-sky-600" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-semibold text-gray-900">
                    1. Triage & Coding Lokal
                  </span>
                  <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700">
                    0% AI
                  </span>
                </div>
                <p className="text-xs text-gray-500 truncate mt-0.5">
                  “Top-up minimarket potongannya Rp2.000 & antri lama...”
                </p>
              </div>
            </div>

            {/* Connector */}
            <div className="flex justify-center">
              <div className="w-px h-4 bg-gradient-to-b from-gray-300 to-blue-400 animate-pulse" />
            </div>

            {/* Step 2 Card */}
            <div
              className="p-3.5 rounded-xl bg-white border border-[#E5E7EB] shadow-xs flex items-center gap-3.5 transform transition-all duration-700 hover:-translate-y-0.5"
              style={{ animationDelay: '0.4s' }}
            >
              <div className="w-9 h-9 rounded-lg bg-purple-50 border border-purple-200/70 flex items-center justify-center shrink-0">
                <Cpu className="w-4 h-4 text-purple-600 animate-pulse" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-semibold text-gray-900">
                    2. Local Clustering (MiniLM)
                  </span>
                  <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
                    Gratis
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-0.5">
                  Mengelompokkan tema & menyaring noise sebelum AI.
                </p>
              </div>
            </div>

            {/* Connector */}
            <div className="flex justify-center">
              <div className="w-px h-4 bg-gradient-to-b from-blue-400 to-blue-600 animate-pulse" />
            </div>

            {/* Step 3 Card */}
            <div className="p-3.5 rounded-xl bg-white border border-blue-200 shadow-xs flex items-center gap-3.5 transform transition-all duration-700 hover:-translate-y-0.5">
              <div className="w-9 h-9 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center shrink-0">
                <Sparkles className="w-4 h-4 text-blue-600" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-semibold text-gray-900">
                    3. On-Demand Problem Brief
                  </span>
                  <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-blue-50 text-blue-700">
                    Cached
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-0.5">
                  Skor dampak, bukti kutipan & export Markdown (.md).
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <div className="relative z-10 flex items-center gap-2 text-xs text-gray-500">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Data riset tersimpan aman secara lokal di browser Anda.</span>
        </div>
      </div>

      {/* Right Side: Clean Login Form */}
      <div className="lg:w-1/2 flex items-center justify-center p-8 lg:p-16 bg-white">
        <div className="w-full max-w-sm space-y-6">
          <div>
            <h1 className="text-xl font-semibold text-gray-900">
              Masuk ke Signal
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Lanjutkan riset dan pemetaan masalah tim Anda.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">
                Nama Peneliti
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="UX Researcher"
                  className="w-full bg-white border border-[#E5E7EB] rounded-lg pl-9 pr-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/15"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">
                Email Workspace
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nama@perusahaan.com"
                  className="w-full bg-white border border-[#E5E7EB] rounded-lg pl-9 pr-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/15"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">
                Kata Sandi
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-white border border-[#E5E7EB] rounded-lg pl-9 pr-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/15"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium shadow-xs transition-colors cursor-pointer"
            >
              <span>Masuk ke Workspace</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="p-3.5 rounded-lg bg-[#F8F9FA] border border-[#E5E7EB] text-xs text-gray-500 leading-relaxed">
            <span className="font-semibold text-gray-700">Mode MVP Lokal:</span>{' '}
            Kredensial di atas sudah terisi otomatis untuk demo. Anda dapat
            langsung menekan tombol masuk.
          </div>
        </div>
      </div>
    </div>
  );
}
