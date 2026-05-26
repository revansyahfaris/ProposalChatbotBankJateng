import { useState } from 'react';
import { ArrowLeft, Check, AlertCircle, Loader2, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useLocation } from 'wouter';
import { authService } from '@/services/authService';

/**
 * Create Account Page
 * Design: Modern with account type selection and form
 * Features: Multi-step account creation with benefits showcase
 */
export default function CreateAccount() {
  const [, setLocation] = useLocation();
  const [step, setStep] = useState<'select' | 'form' | 'success'>('select');
  const [selectedType, setSelectedType] = useState<string>('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [createdAccountNumber, setCreatedAccountNumber] = useState('');

  const [formData, setFormData] = useState({
    accountName: '',
    accountType: '',
    initialBalance: '',
    currency: 'IDR',
  });

  const accountTypes = [
    {
      id: 'bima',
      name: 'BIMA Standard',
      description: 'Rekening tabungan dengan bunga kompetitif',
      icon: '💳',
      benefits: ['Bunga 3% per tahun', 'Bebas biaya administrasi', 'Limit transfer Rp 50 juta/hari'],
      minBalance: 0,
    },
    {
      id: 'bima-platinum',
      name: 'BIMA Platinum',
      description: 'Rekening premium dengan benefit eksklusif',
      icon: '✨',
      benefits: ['Bunga 5% per tahun', 'Limit transfer Rp 500 juta/hari', 'Akses priority banking'],
      minBalance: 10000000,
    },
    {
      id: 'bima-gold',
      name: 'BIMA Gold',
      description: 'Rekening bisnis untuk UMKM',
      icon: '🏆',
      benefits: ['Bunga 4% per tahun', 'Limit transfer Rp 200 juta/hari', 'Konsultasi bisnis gratis'],
      minBalance: 5000000,
    },
  ];

  const formatCurrency = (value: string) => {
    if (!value) return '';
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(Number(value));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.accountName.trim()) {
      newErrors.accountName = 'Nama rekening harus diisi';
    } else if (formData.accountName.length < 3) {
      newErrors.accountName = 'Nama rekening minimal 3 karakter';
    }

    if (!formData.accountType) {
      newErrors.accountType = 'Jenis rekening harus dipilih';
    }

    if (!formData.initialBalance) {
      newErrors.initialBalance = 'Saldo awal harus diisi';
    } else if (isNaN(Number(formData.initialBalance))) {
      newErrors.initialBalance = 'Saldo awal harus berupa angka';
    } else {
      const selectedAccountType = accountTypes.find((t) => t.id === formData.accountType);
      if (
        selectedAccountType &&
        Number(formData.initialBalance) < selectedAccountType.minBalance
      ) {
        newErrors.initialBalance = `Saldo minimum untuk tipe ini adalah ${formatCurrency(selectedAccountType.minBalance.toString())}`;
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSelectType = (typeId: string) => {
    setSelectedType(typeId);
    setFormData((prev) => ({
      ...prev,
      accountType: typeId,
    }));
    setStep('form');
  };

  const handleBack = () => {
    if (step === 'form') {
      setStep('select');
    } else if (step === 'select') {
      setLocation('/dashboard-user');
    } else if (step === 'success') {
      setLocation('/dashboard-user');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
        const API = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';
        const res = await fetch(`${API}/user/accounts`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authService.getToken()}`
            },
            body: JSON.stringify({
                account_type: formData.accountType,
                initial_balance: Number(formData.initialBalance)
            })
        });

        if (!res.ok) {
            const err = await res.json();
            setErrors({ submit: err.message || 'Gagal membuat rekening' });
            return;
        }

        const data = await res.json();
        setCreatedAccountNumber(data.account.account_number); // simpan nomor rekening
        setStep('success');

    } catch {
        setErrors({ submit: 'Gagal menghubungi server' });
    } finally {
        setLoading(false);
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

  const selectedAccountInfo = accountTypes.find((t) => t.id === formData.accountType);

  return (
    <div className="min-h-screen bg-linear-to-b from-gray-50 to-white">
      {/* Header */}
      <div className="header-bank sticky top-0 z-10 bg-linear-to-r from-blue-600 to-blue-700 py-6 shadow-md">
        <div className="container mx-auto flex items-center justify-center px-4">
          <div className="flex items-center gap-3">
            <img src="/images/logo-light.png" alt="Bank Jateng" className="h-12 w-auto" />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        {/* Back Button */}
        {step !== 'success' && (
          <button
            onClick={handleBack}
            className="flex items-center gap-2 text-primary font-semibold mb-8 hover:gap-3 transition-all group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            Kembali
          </button>
        )}

        {step === 'select' && (
          <>
            {/* Title */}
            <div className="mb-12">
              <h2 className="text-4xl font-display text-gray-900 mb-3">Buat Rekening Baru</h2>
              <p className="text-gray-600 text-lg">
                Pilih jenis rekening yang sesuai dengan kebutuhan Anda
              </p>
            </div>

            {/* Account Type Selection */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {accountTypes.map((type) => (
                <button
                  key={type.id}
                  onClick={() => handleSelectType(type.id)}
                  className="bg-white rounded-2xl shadow-lg p-8 text-left hover:shadow-xl hover:border-primary transition-all duration-200 border-2 border-transparent group"
                >
                  <div className="text-6xl mb-4 group-hover:scale-110 transition-transform inline-block">
                    {type.icon}
                  </div>
                  <h3 className="text-2xl font-display text-gray-900 mb-2">{type.name}</h3>
                  <p className="text-gray-600 text-sm mb-6">{type.description}</p>

                  {/* Benefits */}
                  <div className="space-y-3 mb-6 pb-6 border-b border-gray-200">
                    {type.benefits.map((benefit, idx) => (
                      <div key={idx} className="flex items-start gap-2">
                        <Check className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                        <span className="text-gray-700 text-sm">{benefit}</span>
                      </div>
                    ))}
                  </div>

                  {/* Min Balance */}
                  {type.minBalance > 0 && (
                    <p className="text-xs text-gray-600 bg-gray-50 px-3 py-2 rounded-lg">
                      💡 Saldo minimum: {formatCurrency(type.minBalance.toString())}
                    </p>
                  )}

                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <div className="flex items-center gap-2 text-primary font-semibold">
                      Pilih <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </>
        )}

        {step === 'form' && (
          <>
            {/* Form Title */}
            <div className="mb-8">
              <h2 className="text-3xl font-display text-gray-900 mb-2">
                Buat {selectedAccountInfo?.name}
              </h2>
              <p className="text-gray-600">Lengkapi data berikut untuk melanjutkan</p>
            </div>

            {/* Form Card */}
            <div className="bg-white rounded-3xl shadow-lg p-8 border-t-4 border-primary max-w-2xl">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Account Name */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Nama Rekening
                  </label>
                  <Input
                    type="text"
                    name="accountName"
                    placeholder="Contoh: Rekening Tabungan Utama"
                    value={formData.accountName}
                    onChange={handleInputChange}
                    disabled={loading}
                    className={`py-3 rounded-lg border-2 ${
                      errors.accountName ? 'border-red-500' : ''
                    }`}
                  />
                  {errors.accountName && (
                    <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> {errors.accountName}
                    </p>
                  )}
                </div>

                {/* Initial Balance */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Saldo Awal
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">
                      Rp
                    </span>
                    <Input
                      type="number"
                      name="initialBalance"
                      placeholder="Masukkan saldo awal"
                      value={formData.initialBalance}
                      onChange={handleInputChange}
                      disabled={loading}
                      className="pl-12 py-3 rounded-lg border-2"
                    />
                  </div>
                  {formData.initialBalance && (
                    <p className="text-sm text-primary font-semibold mt-2">
                      ≈ {formatCurrency(formData.initialBalance)}
                    </p>
                  )}
                  {errors.initialBalance && (
                    <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> {errors.initialBalance}
                    </p>
                  )}
                </div>

                {/* Account Type Info */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm text-gray-700">
                    <span className="font-semibold">Tipe Rekening:</span> {selectedAccountInfo?.name}
                  </p>
                  <p className="text-sm text-gray-600 mt-2 mb-3">
                    {selectedAccountInfo?.description}
                  </p>
                  <div className="space-y-2">
                    {selectedAccountInfo?.benefits.map((benefit, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-sm text-gray-700">
                        <Check className="w-4 h-4 text-primary" />
                        {benefit}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Terms Agreement */}
                <label className="flex items-start gap-3 cursor-pointer bg-gray-50 p-4 rounded-lg">
                  <input
                    type="checkbox"
                    className="w-5 h-5 rounded border-2 border-gray-300 cursor-pointer mt-0.5"
                    disabled={loading}
                  />
                  <span className="text-sm text-gray-700">
                    Saya memahami dan setuju dengan syarat & ketentuan pembuatan rekening baru serta kebijakan privasi Bank Jateng
                  </span>
                </label>

                {/* Buttons */}
                <div className="flex gap-4 pt-6">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleBack}
                    disabled={loading}
                    className="flex-1 py-3 border-2 rounded-lg"
                  >
                    Batal
                  </Button>
                  <Button
                    type="submit"
                    disabled={loading}
                    className="btn-primary flex-1 py-3 text-lg rounded-lg flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Memproses...
                      </>
                    ) : (
                      <>
                        Buat Rekening
                        <ArrowRight className="w-5 h-5" />
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </div>
          </>
        )}

        {step === 'success' && (
          <>
            {/* Success Message */}
            <div className="max-w-2xl mx-auto text-center py-12">
              <div className="bg-white rounded-3xl shadow-lg p-12">
                <div className="text-7xl mb-6 animate-bounce">✅</div>
                <h2 className="text-4xl font-display text-gray-900 mb-4">Rekening Berhasil Dibuat!</h2>
                <p className="text-gray-600 text-lg mb-8">
                  Selamat! Rekening {selectedAccountInfo?.name} Anda telah berhasil dibuat. Anda akan dialihkan ke dashboard dalam beberapa detik.
                </p>

                {/* Success Details */}
                <div className="bg-green-50 border-2 border-green-200 rounded-lg p-6 mb-8 text-left">
                  <h3 className="font-semibold text-gray-900 mb-4">Informasi Rekening Anda:</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-700">Nama Rekening:</span>
                      <span className="font-semibold text-gray-900">{formData.accountName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-700">Tipe Rekening:</span>
                      <span className="font-semibold text-gray-900">{selectedAccountInfo?.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-700">Saldo Awal:</span>
                      <span className="font-semibold text-gray-900">
                        {formatCurrency(formData.initialBalance)}
                      </span>
                    </div>
                    <div className="flex justify-between pt-3 border-t border-green-200">
                      <span className="text-gray-700">Nomor Rekening:</span>
                      <span className="font-mono font-semibold text-gray-900">{createdAccountNumber}</span>
                    </div>
                  </div>
                </div>

                <Button
                  onClick={() => setLocation('/dashboard-user')}
                  className="btn-primary px-8 py-3 text-lg rounded-lg"
                >
                  Ke Dashboard
                </Button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
