import { useState } from 'react';
import { Eye, EyeOff, Mail, Lock, ArrowRight, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useLocation } from 'wouter';
import { authService } from '@/services/authService';

/**
 * Login User Page
 * Design: Modern Minimalist with Bank Jateng branding
 * Features: Email/Password login, Google/Apple OAuth, Sign up link, Forgot password
 */
export default function LoginUser() {
  const [, setLocation] = useLocation();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Simple email validation
  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    // Validation
    if (!email.trim()) {
      setError('Email harus diisi');
      return;
    }
    if (!isValidEmail(email)) {
      setError('Format email tidak valid');
      return;
    }
    if (!password) {
      setError('Kata sandi harus diisi');
      return;
    }
    if (password.length < 6) {
      setError('Kata sandi minimal 6 karakter');
      return;
    }

    setLoading(true);

    try {
      const response = await authService.login({email, password});

      if (response.token) {
        setSuccessMessage('Login berhasil! Mengalihkan...');

        setTimeout(() => {
          setLocation('/dashboard-user');
        }, 1500);
      } else {
        setError(response.message || 'Login gagal. Periksa email dan kata sandi Anda.');
      } 
    } catch (err) {
    setError('Terjadi kesalahan saat menghubungi server. Silakan coba lagi nanti.');
    } finally { 
    setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError('');
    // TODO: Implement actual Google OAuth integration
    // For now, show a demo notification
    setTimeout(() => {
      setLoading(false);
      const handleGoogleLogin = async () => {
          setError('Login Google belum tersedia. Gunakan email dan kata sandi.');
        };

        const handleAppleLogin = async () => {
          setError('Login Apple belum tersedia. Gunakan email dan kata sandi.');
        };
    }, 1500);
  };

  const handleAppleLogin = async () => {
    setLoading(true);
    setError('');
    // TODO: Implement actual Apple OAuth integration
    setTimeout(() => {
      setLoading(false);
      localStorage.setItem('userEmail', 'user@icloud.com');
      localStorage.setItem('userName', 'Apple User');
      setSuccessMessage('Login Apple berhasil! Mengalihkan...');
      setTimeout(() => {
        setLocation('/dashboard-user');
      }, 1500);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-gray-50 to-white flex flex-col">
      {/* Header with Bank Logo */}
      <div className="header-bank fixed top-0 left-0 right-0 z-50 bg-linear-to-r from-blue-600 to-blue-700 py-6 shadow-md">
        <div className="container mx-auto flex items-center justify-center px-4">
          <img src="/images/logo-light.png" alt="Bank Jateng" className="h-12 w-auto" />
        </div>
      </div>

      {/* Main Content */}
      <div className="pt-28 flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          {/* Login Card */}
          <div className="bg-white rounded-3xl shadow-xl p-8 border-t-4 border-primary">
            {/* Header */}
            <div className="text-center mb-8">
              <h2 className="text-3xl font-display font-bold text-gray-900 mb-2">Masuk Akun</h2>
              <p className="text-gray-600">Kelola keuangan Anda dengan aman</p>
            </div>

            {/* Success Message */}
            {successMessage && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0" />
                <p className="text-sm text-green-700">{successMessage}</p>
              </div>
            )}

            {/* OAuth Buttons */}
            <div className="space-y-3 mb-8">
              <button
                onClick={handleGoogleLogin}
                disabled={loading}
                className="w-full flex items-center justify-center gap-3 px-4 py-3 border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed group"
              >
                <img src="/images/auth-image-5.png" alt="Google" className="w-5 h-5" />
                <span className="flex-1">Lanjutkan dengan Google</span>
                <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>

              <button
                onClick={handleAppleLogin}
                disabled={loading}
                className="w-full flex items-center justify-center gap-3 px-4 py-3 border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed group"
              >
                <img src="/images/auth-image-6.png" alt="Apple" className="w-5 h-5" />
                <span className="flex-1">Lanjutkan dengan Apple ID</span>
                <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
            </div>

            {/* Divider */}
            <div className="relative mb-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-3 bg-white text-gray-500 font-medium">Atau</span>
              </div>
            </div>

            {/* Login Form */}
            <form onSubmit={handleLogin} className="space-y-6">
              {/* Email Field */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Alamat Email
                </label>
                <div className="relative">
                  <Input
                    type="email"
                    placeholder="nama@example.com"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setError('');
                    }}
                    className="input-field px-4 py-3 rounded-lg border-2"
                    disabled={loading}
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Kata Sandi
                  </label>
                  <button
                    type="button"
                    onClick={() => setLocation('/forgot-password')}
                    className="text-sm text-primary hover:text-primary/80 font-medium transition-colors"
                  >
                    Lupa kata sandi?
                  </button>
                </div>
                <div className="relative">
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Masukkan kata sandi Anda"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setError('');
                    }}
                    className="input-field px-4 pr-12 py-3 rounded-lg border-2"
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3.5 text-gray-500 hover:text-gray-700 transition-colors"
                    disabled={loading}
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Remember Me */}
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-2 border-gray-300 cursor-pointer"
                  disabled={loading}
                />
                <span className="text-sm text-gray-700">Ingat saya di perangkat ini</span>
              </label>

              {/* Error Message */}
              {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
                  <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              )}

              {/* Login Button */}
              <Button
                type="submit"
                disabled={loading}
                className="btn-primary w-full py-3 text-lg font-semibold rounded-lg flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Sedang Masuk...
                  </>
                ) : (
                  <>
                    Masuk
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </Button>
            </form>

            {/* Sign Up Link */}
            <p className="text-center mt-8 text-gray-600">
              Belum memiliki akun?{' '}
              <button
                onClick={() => setLocation('/signup')}
                className="text-primary font-semibold hover:text-primary/80 transition-colors"
              >
                Daftar sekarang
              </button>
            </p>
          </div>

          {/* Security Banner */}
          <div className="mt-6 bg-linear-to-r from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200">
            <div className="flex items-start gap-3">
              <Lock className="w-5 h-5 text-primary shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-gray-900 text-sm mb-1">Keamanan Terjamin</p>
                <p className="text-xs text-gray-700">
                  Kami menggunakan enkripsi tingkat bank untuk melindungi data Anda
                </p>
              </div>
            </div>
          </div>

          {/* Links */}
          <div className="mt-6 text-center space-y-2 text-xs text-gray-600">
            <p>
              <button className="hover:underline">Kebijakan Privasi</button>
              {' • '}
              <button className="hover:underline">Syarat & Ketentuan</button>
              {' • '}
              <button className="hover:underline">Hubungi Kami</button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
