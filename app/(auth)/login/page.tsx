'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Lock, Mail, ArrowRight } from 'lucide-react';
import { useAuth } from '@/components/auth/AuthProvider';

export default function LoginPage() {
  const router = useRouter();
  const { login, refreshUser } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);

  const handleLoginSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsPending(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    if (!email || !password) {
      setError('Please enter both email and password');
      setIsPending(false);
      return;
    }

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Failed to sign in. Please try again.');
        setIsPending(false);
        return;
      }

      await refreshUser();
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Failed to sign in. Please try again.');
      setIsPending(false);
    }
  };

  const handleGoogleLogin = () => {
    // loginUser('abhishek@example.com');
    // router.push('/dashboard');
    alert('Google login not implemented yet.');
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 bg-gradient-to-b from-blue-50 to-white dark:from-[#0A0A0F] dark:to-[#12121A] transition-colors duration-300">
      <div className="w-full max-w-md space-y-8 p-8 rounded-3xl bg-white dark:bg-[#12121A] border border-blue-200 dark:border-[#27272A] shadow-lg dark:shadow-blue-500/10 backdrop-blur-xl transition-colors duration-300">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="relative w-16 h-16 rounded-2xl overflow-hidden shadow-lg shadow-blue-500/20 dark:shadow-blue-500/30 mx-auto mb-3 border border-blue-200 dark:border-[#27272A] bg-white dark:bg-[#1A1A24] p-1">
            <Image
              src="/logo.png"
              alt="Logo"
              width={64}
              height={64}
              className="w-full h-full object-contain rounded-xl"
            />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">Welcome Back 🎂</h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">Sign in to manage your birthday surprises.</p>
        </div>

        {/* Form */}
        <form onSubmit={handleLoginSubmit} className="space-y-5">
          {error && (
            <div className="p-3 rounded-xl bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 text-red-600 dark:text-red-400 text-xs font-semibold">
              {error}
            </div>
          )}

          {/* Email */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 dark:text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                name="email"
                required
                defaultValue="abhishek@example.com"
                placeholder="name@example.com"
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-white dark:bg-[#1A1A24] border border-blue-200 dark:border-[#27272A] text-slate-900 dark:text-white text-sm focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-500/20 transition-colors"
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 dark:text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                required
                defaultValue="password123"
                placeholder="••••••••"
                className="w-full pl-10 pr-11 py-3 rounded-xl bg-white dark:bg-[#1A1A24] border border-blue-200 dark:border-[#27272A] text-slate-900 dark:text-white text-sm focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-500/20 transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Remember me & Forgot Password */}
          <div className="flex items-center justify-between text-xs">
            <label className="flex items-center gap-2 cursor-pointer text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="rounded accent-blue-500"
              />
              <span>Remember me</span>
            </label>

            <Link href="/forgot-password" className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-semibold">
              Forgot Password?
            </Link>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isPending}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-extrabold text-sm shadow-lg shadow-blue-500/25 dark:shadow-blue-500/40 flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
          >
            <span>Login</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Social Login */}
        <div className="space-y-4">
          <div className="relative flex items-center justify-center">
            <div className="border-t border-blue-200 dark:border-[#27272A] w-full" />
            <span className="bg-white dark:bg-[#12121A] px-3 text-[11px] text-slate-500 dark:text-slate-400 font-semibold uppercase">Or</span>
          </div>

          <button
            type="button"
            onClick={handleGoogleLogin}
            className="w-full py-3 rounded-xl bg-white dark:bg-[#1A1A24] hover:bg-blue-50 dark:hover:bg-blue-500/10 border border-blue-200 dark:border-[#27272A] text-slate-700 dark:text-slate-200 text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
            </svg>
            <span>Continue with Google</span>
          </button>
        </div>

        {/* Footer link */}
        <div className="text-center text-xs text-slate-600 dark:text-slate-400">
          Don&apos;t have an account?{' '}
          <Link href="/signup" className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-bold">
            Create Account
          </Link>
        </div>

      </div>
    </div>
  );
}
