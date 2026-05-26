import { useState } from 'react';
import { Eye, EyeOff, Lock, User, AlertCircle, CheckCircle2, Loader2, ArrowRight, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useLocation } from 'wouter';
import { authService } from '@/services/authService';

/**
 * Login Admin Page
 * Design: Professional with enhanced security features
 * Features: Email/Password login with 2FA support, admin-specific styling
 */
export default function LoginAdmin() {
  const [, setLocation] = useLocation();
  const [showPassword, setShowPassword] = useState(false);
  const [show2FAField, setShow2FAField] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [twoFACode, setTwoFACode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

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

    setLoading(true);
    
    try {
      const response = await authService.login({email, password});
      
      console.log('Full response:', response);
      console.log('User role:', response.user?.role);

      if (response.token) {
        if (response.user?.role === 'admin') {

          setSuccessMessage('Login berhasil! Mengalihkan ke dashboard...');

          setTimeout(() => {
            setLocation('/dashboard-admin');
          }, 1500);
        } else {
          authService.logout();
          setError('Akses ditolak. Hanya admin yang dapat masuk.');
        }
      } else {
        setError('Login gagal. Periksa kembali email dan kata sandi Anda.');
      }
    } catch (err) {
      setError('Terjadi kesalahan saat mencoba login. Silakan coba lagi nanti.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 to-slate-800 flex flex-col">
      {/* Header with Admin Styling */}
      <div className="header-admin fixed top-0 left-0 right-0 z-50 bg-linear-to-r from-slate-800 to-slate-900 py-8 shadow-xl">
        <div className="container mx-auto flex flex-col items-center justify-center px-4">
          <img src="/images/logo-light.png" alt="Bank Jateng" className="h-12 w-auto mb-3" />
          <p className="text-center text-sm text-slate-300 font-medium">Admin Portal</p>
          <p className="text-center text-xs text-slate-400 mt-1">Akses Terbatas untuk Admin</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="pt-42 flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          {/* Login Card */}
          <div className="bg-white rounded-3xl shadow-2xl p-8 border-t-4 border-slate-700">
            {/* Header */}
            <div className="text-center mb-8">
              <h2 className="text-3xl font-display font-bold text-gray-900">Admin Login</h2>
              <p className="text-gray-600 text-sm mt-2">Masukkan kredensial admin Anda</p>
            </div>

            {/* Success Message */}
            {successMessage && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0" />
                <p className="text-sm text-green-700">{successMessage}</p>
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleLogin} className="space-y-6">
              {/* Email Field */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Email Admin
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    type="email"
                    placeholder="admin@bankjateng.co.id"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setError('');
                    }}
                    disabled={loading}
                    className="pl-9 py-3 rounded-lg border-2 placeholder:text-gray-400"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Kata Sandi
                </label>
                <div className="relative">
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Masukkan kata sandi"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setError('');
                    }}
                    disabled={loading}
                    className="pl-9 py-3 rounded-lg border-2 placeholder:text-gray-400"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={loading}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* 2FA Code Field */}
              {show2FAField && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Kode Verifikasi Dua Faktor
                  </label>
                  <Input
                    type="text"
                    placeholder="Masukkan kode 6 digit"
                    value={twoFACode}
                    onChange={(e) => {
                      setTwoFACode(e.target.value.replace(/\D/g, '').slice(0, 6));
                      setError('');
                    }}
                    maxLength={6}
                    disabled={loading}
                    className="input-field py-3 rounded-lg border-2 text-center text-2xl tracking-widest"
                  />
                  <p className="text-xs text-gray-600 mt-2">
                    Kode telah dikirim ke email Anda. Berlaku selama 10 menit.
                  </p>
                </div>
              )}

              {/* Error Message */}
              {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
                  <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              )}

              {/* Security Info */}
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <Shield className="w-5 h-5 text-slate-600 mt-0.5 shrink-0" />
                  <div className="text-xs text-slate-700">
                    <p className="font-semibold mb-1">Keamanan Portal Admin:</p>
                    <ul className="space-y-1">
                      <li>✓ Autentikasi dua faktor diperlukan</li>
                      <li>✓ Semua aktivitas dilog dan dipantau</li>
                      <li>✓ Koneksi terenkripsi SSL/TLS</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Login Button */}
              <Button
                type="submit"
                disabled={loading}
                className="bg-slate-700 hover:bg-slate-800 text-white w-full py-3 text-lg font-semibold rounded-lg flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Sedang Memproses...
                  </>
                ) : show2FAField ? (
                  <>
                    Verifikasi
                    <ArrowRight className="w-5 h-5" />
                  </>
                ) : (
                  <>
                    Masuk Sebagai Admin
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </Button>
            </form>

            {/* Footer */}
            <p className="text-center mt-6 text-gray-600 text-xs">
              <button className="hover:underline">Lupa kata sandi?</button>
              {' • '}
              <button className="hover:underline">Hubungi Support</button>
            </p>
          </div>

          {/* Security Banner */}
          <div className="mt-6 bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 text-white text-center">
            <p className="text-xs">
              🔒 Portal ini hanya untuk penggunaan Admin Bank Jateng yang resmi. Akses tidak sah akan dilaporkan.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
