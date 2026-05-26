import { useState } from 'react';
import { Eye, EyeOff, Mail, Lock, User, IdCard, CheckCircle2, AlertCircle, Loader2, ArrowRight, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { useLocation } from 'wouter';
import { authService } from '@/services/authService';

/**
 * Sign Up User Page
 * Design: Modern Minimalist with Bank Jateng branding
 * Features: Multi-field form, password validation, privacy agreement, progress indicator
 */
export default function SignupUser() {
  const [, setLocation] = useLocation();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreePrivacy, setAgreePrivacy] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const [formData, setFormData] = useState({
    fullName: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    nik: '',
    phone: '',
  });

  // Password strength indicator
  const getPasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^a-zA-Z0-9]/.test(password)) strength++;
    return strength;
  };

  const passwordStrength = getPasswordStrength(formData.password);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Nama lengkap harus diisi';
    } else if (formData.fullName.length < 3) {
      newErrors.fullName = 'Nama minimal 3 karakter';
    }

    if (!formData.username.trim()) {
      newErrors.username = 'Username harus diisi';
    } else if (formData.username.length < 3) {
      newErrors.username = 'Username minimal 3 karakter';
    } else if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) {
      newErrors.username = 'Username hanya boleh alfabet, angka, dan underscore';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email harus diisi';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Format email tidak valid';
    }

    if (!formData.password) {
      newErrors.password = 'Password harus diisi';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password minimal 8 karakter';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Password tidak cocok';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Nomor telepon harus diisi';
    } else if (!/^(\+62|0)[0-9]{9,12}$/.test(formData.phone.replace(/\D/g, '+'))) {
      newErrors.phone = 'Format nomor telepon tidak valid';
    }

    if (!formData.nik.trim()) {
      newErrors.nik = 'NIK harus diisi';
    } else if (!/^\d{16}$/.test(formData.nik.replace(/\D/g, ''))) {
      newErrors.nik = 'NIK harus 16 digit';
    }

    if (!agreePrivacy) {
      newErrors.privacy = 'Anda harus menyetujui kebijakan privasi';
    }

    if (!agreeTerms) {
      newErrors.terms = 'Anda harus menyetujui syarat dan ketentuan';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      setLoading(true);
      setErrors({});

      try {
        const payload: any = {
          fullName: formData.fullName,
          full_name: formData.fullName,
          username: formData.username, 
          email: formData.email,
          password: formData.password,
          phone: formData.phone,
          nik: formData.nik,
          identity_number: formData.nik,
        };

        const response = await authService.signup(payload);

        if (response.user || response.message === 'User berhasil didaftarkan') {
          setSuccessMessage('Akun berhasil dibuat! Mengalihkan ke login...');

          setTimeout(() => {
            setLocation('/login');
          }, 1500);
        } else {
          setErrors({
            email: response.message || 'Gagal mendaftarkan akun. Silakan periksa kembali.'
          });
      }
    } catch (err) {
        setErrors({
          email: 'Terjadi kesalahan saat mendaftarkan akun. Silakan coba lagi.'
        });
      } finally {
        setLoading(false);
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
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
        <div className="w-full max-w-2xl">
          {/* Signup Card */}
          <div className="bg-white rounded-3xl shadow-xl p-8 border-t-4 border-primary">
            {/* Header */}
            <div className="text-center mb-8">
              <h2 className="text-3xl font-display font-bold text-gray-900 mb-2">Buat Akun Baru</h2>
              <p className="text-gray-600">Bergabunglah dengan jutaan pengguna Bank Jateng</p>
            </div>

            {/* Success Message */}
            {successMessage && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0" />
                <p className="text-sm text-green-700">{successMessage}</p>
              </div>
            )}

            {/* Signup Form */}
            <form onSubmit={handleSignup} className="space-y-5">
              <div className="grid md:grid-cols-2 gap-5">
                {/* Full Name */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Nama Lengkap
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input
                      type="text"
                      name="fullName"
                      placeholder="nama lengkap anda"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      disabled={loading}
                      className={`pl-9 py-3 rounded-lg border-2 placeholder:text-gray-400 ${
                        errors.fullName ? 'border-red-500' : ''
                      }`}
                    />
                  </div>
                  {errors.fullName && (
                    <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> {errors.fullName}
                    </p>
                  )}
                </div>

                {/* Username */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Username
                  </label>
                  <Input
                    type="text"
                    name="username"
                    placeholder="nama pengguna"
                    value={formData.username}
                    onChange={handleInputChange}
                    disabled={loading}
                    className={`input-field py-3 rounded-lg border-2 placeholder:text-gray-400 ${
                      errors.username ? 'border-red-500' : ''
                    }`}
                  />
                  {errors.username && (
                    <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> {errors.username}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-5">
                {/* Email */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Email
                  </label>
                  <div className="relative">
                    <Input
                      type="email"
                      name="email"
                      placeholder="nama@example.com"
                      value={formData.email}
                      onChange={handleInputChange}
                      disabled={loading}
                      className={`input-field px-4 py-3 rounded-lg border-2 placeholder:text-gray-400 ${
                        errors.email ? 'border-red-500' : ''
                      }`}
                    />
                  </div>
                  {errors.email && (
                    <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> {errors.email}
                    </p>
                  )}
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Nomor Telepon
                  </label>
                  <Input
                    type="tel"
                    name="phone"
                    placeholder="+62-- ---- ----"
                    value={formData.phone}
                    onChange={handleInputChange}
                    disabled={loading}
                    className={`input-field py-3 rounded-lg border-2 placeholder:text-gray-400 ${
                      errors.phone ? 'border-red-500' : ''
                    }`}
                  />
                  {errors.phone && (
                    <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> {errors.phone}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-5">
                {/* NIK */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Nomor Identitas (NIK)
                  </label>
                  <div className="relative">
                    <Input
                      type="text"
                      name="nik"
                      placeholder="16 digit NIK Anda"
                      value={formData.nik}
                      onChange={handleInputChange}
                      disabled={loading}
                      className={`input-field px-4 py-3 rounded-lg border-2 placeholder:text-gray-400 ${
                        errors.nik ? 'border-red-500' : ''
                      }`}
                    />
                  </div>
                  {errors.nik && (
                    <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> {errors.nik}
                    </p>
                  )}
                </div>

                {/* Password */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      placeholder="Minimal 8 karakter"
                      value={formData.password}
                      onChange={handleInputChange}
                      disabled={loading}
                      className={`input-field px-4 pr-12 py-3 rounded-lg border-2 placeholder:text-gray-400 ${
                        errors.password ? 'border-red-500' : ''
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      disabled={loading}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> {errors.password}
                    </p>
                  )}
                  {/* Password Strength Indicator */}
                  {formData.password && (
                    <div className="mt-2">
                      <div className="flex gap-1">
                        {[...Array(4)].map((_, i) => (
                          <div
                            key={i}
                            className={`h-1 flex-1 rounded-full ${
                              i < passwordStrength ? 'bg-primary' : 'bg-gray-200'
                            }`}
                          />
                        ))}
                      </div>
                      <p className="text-xs text-gray-600 mt-1">
                        Kekuatan: {passwordStrength === 0 ? 'Lemah' : passwordStrength === 1 ? 'Sedang' : passwordStrength === 2 ? 'Baik' : passwordStrength === 3 ? 'Sangat Baik' : 'Sempurna'}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Ulangi Password
                </label>
                <div className="relative">
                  <Input
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    placeholder="Ulangi password Anda"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    disabled={loading}
                    className={`input-field px-4 pr-12 py-3 rounded-lg border-2 placeholder:text-gray-400 ${
                      errors.confirmPassword ? 'border-red-500' : ''
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    disabled={loading}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> {errors.confirmPassword}
                  </p>
                )}
                {formData.confirmPassword && formData.password === formData.confirmPassword && (
                  <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                    <Check className="w-3 h-3" /> Password cocok
                  </p>
                )}
              </div>

              {/* Privacy & Terms */}
              <div className="space-y-3 pt-4 border-t border-gray-200">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={agreePrivacy}
                    onChange={(e) => {
                      setAgreePrivacy(e.target.checked);
                      if (e.target.checked) {
                        setErrors((prev) => ({
                          ...prev,
                          privacy: '',
                        }));
                      }
                    }}
                    disabled={loading}
                    className="w-5 h-5 rounded border-2 border-gray-300 cursor-pointer mt-0.5"
                  />
                  <span className="text-sm text-gray-700">
                    Saya setuju dengan{' '}
                    <button className="text-primary font-semibold hover:underline">
                      Kebijakan Privasi
                    </button>
                  </span>
                </label>

                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={agreeTerms}
                    onChange={(e) => {
                      setAgreeTerms(e.target.checked);
                      if (e.target.checked) {
                        setErrors((prev) => ({
                          ...prev,
                          terms: '',
                        }));
                      }
                    }}
                    disabled={loading}
                    className="w-5 h-5 rounded border-2 border-gray-300 cursor-pointer mt-0.5"
                  />
                  <span className="text-sm text-gray-700">
                    Saya setuju dengan{' '}
                    <button className="text-primary font-semibold hover:underline">
                      Syarat & Ketentuan
                    </button>
                  </span>
                </label>

                {errors.privacy && (
                  <p className="text-xs text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> {errors.privacy}
                  </p>
                )}
                {errors.terms && (
                  <p className="text-xs text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> {errors.terms}
                  </p>
                )}
              </div>

              {/* Signup Button */}
              <Button
                type="submit"
                disabled={loading}
                className="btn-primary w-full py-3 text-lg font-semibold rounded-lg flex items-center justify-center gap-2 mt-6"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Membuat Akun...
                  </>
                ) : (
                  <>
                    Buat Akun
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </Button>
            </form>

            {/* Login Link */}
            <p className="text-center mt-6 text-gray-600">
              Sudah punya akun?{' '}
              <button
                onClick={() => setLocation('/login')}
                className="text-primary font-semibold hover:text-primary/80 transition-colors"
              >
                Masuk di sini
              </button>
            </p>
          </div>

          {/* Security Banner */}
          <div className="mt-6 bg-linear-to-r from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200">
            <p className="text-xs text-gray-700">
              🔒 Data Anda dilindungi dengan enkripsi tingkat bank dan keamanan berlapis untuk kenyamanan Anda.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
