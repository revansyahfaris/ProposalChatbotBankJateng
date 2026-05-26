import { useState, useEffect } from 'react';
import { Eye, EyeOff, Plus, LogOut, Bell, Settings, Send, Download, ArrowUpRight, ArrowDownLeft, MoreVertical, MessageSquare, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLocation } from 'wouter';
import { authService } from '@/services/authService';

/**
 * Dashboard User Page
 * Design: Modern Dashboard with comprehensive banking features
 * Features: Account display, transactions, quick actions, notifications, chatbot
 */
export default function DashboardUser() {
  const [, setLocation] = useLocation();
  const [userName, setUserName] = useState('Memuat...');
  const [userEmail, setUserEmail] = useState('Memuat...');
  const [showBalance, setShowBalance] = useState(false);
  const [showChatbot, setShowChatbot] = useState(false);

  useEffect(() => {
    const verifyWithServer = async () => {
      const token = authService.getToken();
      if (!token) { setLocation('/login'); return; }

      const API = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3000/api';

      try {
        const res = await fetch(`${API}/user/dashboard`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!res.ok) {
          authService.logout();
          setLocation('/login');
          return;
        }

        const data = await res.json();

        // Set nama user
        const currentUser = authService.getCurrentUser();
        setUserName(currentUser?.full_name || currentUser?.username || 'Pengguna');
        setUserEmail(currentUser?.email || 'Email tidak tersedia');

        // Set rekening dari database
        setAccounts(data.daftar_rekening || []);
        setLoadingAccounts(false);

      } catch {
        setLocation('/login');
      }
    };

    verifyWithServer();
  }, [setLocation]);

  const [chatMessages, setChatMessages] = useState<Array<{ type: 'user' | 'bot'; message: string }>>([
    { type: 'bot', message: 'Halo! Saya adalah Asisten Virtual Bank Jateng. Ada yang bisa saya bantu? 😊' }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  
  const [accounts, setAccounts] = useState<any[]>([]);
  const [loadingAccounts, setLoadingAccounts] = useState(true);

  const [transactions] = useState([
    { id: 1, name: 'Transfer ke Budi', amount: -500000, date: '2024-01-15', type: 'transfer' },
    { id: 2, name: 'Gaji Bulan Januari', amount: 5000000, date: '2024-01-10', type: 'income' },
    { id: 3, name: 'Pembayaran Tagihan Listrik', amount: -250000, date: '2024-01-08', type: 'payment' },
    { id: 4, name: 'Belanja Online', amount: -1200000, date: '2024-01-05', type: 'shopping' },
  ]);

  const totalBalance = accounts.reduce((sum, acc) => sum + Number(acc.balance), 0);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(value);
  };

  const handleSendMessage = async () => {
    if (!chatInput.trim()) return;

    setChatMessages(prev => [...prev, { type: 'user', message: chatInput }]);
    setChatInput('');
    setChatLoading(true);

    // Simulate bot response
    setTimeout(() => {
      const responses = [
        'Baik, saya mencatat pertanyaan Anda. Apa yang ingin Anda ketahui lebih lanjut?',
        'Saya siap membantu! Apakah Anda ingin membuat transfer atau melihat riwayat transaksi?',
        'Untuk informasi lebih detail, silakan hubungi customer service kami di 1500-100 atau kunjungi cabang terdekat.',
        'Terima kasih telah menggunakan layanan Bank Jateng. Adakah yang bisa saya bantu lagi?',
      ];
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      setChatMessages(prev => [...prev, { type: 'bot', message: randomResponse }]);
      setChatLoading(false);
    }, 1000);
  };

  const handleQuickAction = (action: string) => {
    setChatMessages(prev => [...prev, { type: 'user', message: action }]);
    setChatLoading(true);
    setTimeout(() => {
      const responses: Record<string, string> = {
        'transfer': 'Untuk melakukan transfer, silakan tekan tombol Transfer di dashboard atau gunakan aplikasi mobile kami.',
        'saldo': `Saldo Anda saat ini adalah ${formatCurrency(totalBalance)}. Apakah ada yang bisa saya bantu?`,
        'promo': 'Kami memiliki promosi menarik bulan ini! Dapatkan cashback hingga 100rb untuk setiap transaksi. Info lebih lanjut bisa dilihat di aplikasi.',
      };
      const response = responses[action] || 'Maaf, saya tidak mengerti. Coba pertanyaan lain?';
      setChatMessages(prev => [...prev, { type: 'bot', message: response }]);
      setChatLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-linear-to-r from-blue-600 to-blue-700 shadow-lg">
        <div className="container mx-auto px-4 flex items-center justify-between py-4">
          <div className="flex items-center gap-3">
            <img src="/images/logo-light.png" alt="Bank Jateng" className="h-10 w-auto" />
          </div>

          {/* User Profile Section */}
          <div className="flex items-center gap-4">
            <button 
              onClick={() => handleQuickAction('saldo')}
              className="p-2 hover:bg-white/10 rounded-full transition-colors relative group"
              title="Notifikasi"
            >
              <Bell className="w-6 h-6 text-white" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              <span className="absolute -bottom-8 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">Notifikasi</span>
            </button>

            <button 
              onClick={() => handleQuickAction('transfer')}
              className="p-2 hover:bg-white/10 rounded-full transition-colors group"
              title="Pengaturan"
            >
              <Settings className="w-6 h-6 text-white" />
              <span className="absolute -bottom-8 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">Pengaturan</span>
            </button>

            <div className="flex items-center gap-3 bg-white rounded-full px-4 py-2 hover:shadow-lg transition-shadow">
              <div className="flex flex-col items-end">
                <p className="font-semibold text-gray-900 text-sm">{userName}</p>
                <p className="text-xs text-gray-600">{userEmail}</p>
              </div>
              <div className="w-9 h-9 bg-linear-to-br from-primary to-yellow-400 rounded-full flex items-center justify-center text-white font-bold text-sm">
                {userName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
              </div>
            </div>

            <button
              onClick={() => {
                authService.logout();
                setLocation('/login');
              }}
              className="p-2 hover:bg-white/10 rounded-full transition-colors group"
              title="Keluar"
            >
              <LogOut className="w-6 h-6 text-white" />
              <span className="absolute -bottom-8 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">Keluar</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Welcome Banner */}
        <div className="bg-linear-to-r from-blue-50 to-blue-100 rounded-2xl p-6 mb-8 border border-blue-200">
          <h1 className="text-3xl font-display font-bold text-gray-900">Selamat Datang Kembali, {userName}! 👋</h1>
          <p className="text-gray-700 mt-2">Kelola keuangan Anda dengan aman dan mudah bersama Bank Jateng</p>
        </div>

        {/* Balance Card */}
        <div className="bg-white rounded-3xl shadow-lg p-8 border-t-4 border-primary mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-display font-bold text-gray-900">Total Saldo</h2>
            <button
              onClick={() => setShowBalance(!showBalance)}
              className="p-3 hover:bg-gray-100 rounded-full transition-colors"
              title={showBalance ? 'Sembunyikan saldo' : 'Tampilkan saldo'}
            >
              {showBalance ? (
                <Eye className="w-6 h-6 text-primary" />
              ) : (
                <EyeOff className="w-6 h-6 text-primary" />
              )}
            </button>
          </div>

          <h3 className="text-6xl font-display font-bold text-gray-900 mb-8">
            {showBalance ? formatCurrency(totalBalance) : 'Rp••••••••••'}
          </h3>

          {/* Accounts Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
            {/* Account Cards */}
            {loadingAccounts ? (
              <div className="col-span-3 flex justify-center py-8">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : accounts.length === 0 ? (
              <div className="col-span-3 text-center py-8 text-gray-500">
                Belum ada rekening. Tambahkan rekening baru.
              </div>
            ) : (
              accounts.map((account) => (
                <div
                  key={account.id}
                  className="bg-linear-to-br from-red-900 to-red-700 rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 group min-h-56 flex flex-col justify-between"
                >
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <p className="text-sm font-medium text-red-100">{userName}</p>
                      <p className="text-xs text-red-200 mt-1">{account.account_type}</p>
                    </div>
                  </div>

                  <p className="text-3xl font-display font-bold mb-auto">
                    {showBalance ? formatCurrency(Number(account.balance)) : '••••••••'}
                  </p>

                  <div className="flex items-center justify-between mt-6 pt-4 border-t border-white/20">
                    <p className="font-mono text-sm tracking-widest">
                      **** **** **** {account.account_number?.slice(-4)}
                    </p>
                    <p className="text-xs font-display font-bold">{account.account_type}</p>
                  </div>
                </div>
              ))
            )}

            {/* Add New Account Button */}
            <button
              onClick={() => setLocation('/create-account')}
              className="border-2 border-dashed border-gray-300 rounded-2xl p-6 flex flex-col items-center justify-center hover:border-primary hover:bg-primary/5 transition-all duration-200 group min-h-56"
            >
              <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mb-3 group-hover:bg-primary/20 transition-colors">
                <Plus className="w-7 h-7 text-primary" />
              </div>
              <p className="font-semibold text-gray-900 text-center">Tambah Rekening</p>
              <p className="text-xs text-gray-600 mt-1 text-center">Buat rekening baru</p>
            </button>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <button 
            onClick={() => handleQuickAction('transfer')}
            className="bg-white rounded-2xl shadow-md p-6 hover:shadow-lg transition-all duration-200 text-center group hover:-translate-y-1"
          >
            <div className="text-5xl mb-3 group-hover:scale-110 transition-transform inline-block">💸</div>
            <p className="font-semibold text-gray-900 text-sm">Transfer</p>
            <p className="text-xs text-gray-600 mt-1">Kirim uang</p>
          </button>

          <button 
            onClick={() => {
              const element = document.querySelector('[class*="Transaksi Terbaru"]');
              element?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="bg-white rounded-2xl shadow-md p-6 hover:shadow-lg transition-all duration-200 text-center group hover:-translate-y-1"
          >
            <div className="text-5xl mb-3 group-hover:scale-110 transition-transform inline-block">📊</div>
            <p className="font-semibold text-gray-900 text-sm">Riwayat</p>
            <p className="text-xs text-gray-600 mt-1">Lihat transaksi</p>
          </button>

          <button 
            onClick={() => handleQuickAction('promo')}
            className="bg-white rounded-2xl shadow-md p-6 hover:shadow-lg transition-all duration-200 text-center group hover:-translate-y-1"
          >
            <div className="text-5xl mb-3 group-hover:scale-110 transition-transform inline-block">💰</div>
            <p className="font-semibold text-gray-900 text-sm">Investasi</p>
            <p className="text-xs text-gray-600 mt-1">Kelola portfolio</p>
          </button>

          <button 
            onClick={() => handleQuickAction('transfer')}
            className="bg-white rounded-2xl shadow-md p-6 hover:shadow-lg transition-all duration-200 text-center group hover:-translate-y-1"
          >
            <div className="text-5xl mb-3 group-hover:scale-110 transition-transform inline-block">📲</div>
            <p className="font-semibold text-gray-900 text-sm">Tagihan</p>
            <p className="text-xs text-gray-600 mt-1">Bayar tagihan</p>
          </button>
        </div>

        {/* Transactions Section */}
        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-display font-bold text-gray-900">Transaksi Terbaru</h2>
            <Button 
              variant="outline"
              className="text-sm border-primary text-primary hover:bg-primary/10"
            >
              Lihat Semua
            </Button>
          </div>

          <div className="space-y-4">
            {transactions.map((transaction) => (
              <div 
                key={transaction.id}
                className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg transition-colors group"
              >
                <div className="flex items-center gap-4 flex-1">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl
                    ${transaction.type === 'transfer' ? 'bg-blue-100' : ''}
                    ${transaction.type === 'income' ? 'bg-green-100' : ''}
                    ${transaction.type === 'payment' ? 'bg-yellow-100' : ''}
                    ${transaction.type === 'shopping' ? 'bg-pink-100' : ''}
                  `}>
                    {transaction.type === 'transfer' && '💸'}
                    {transaction.type === 'income' && '📥'}
                    {transaction.type === 'payment' && '📋'}
                    {transaction.type === 'shopping' && '🛍️'}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{transaction.name}</p>
                    <p className="text-sm text-gray-600">{transaction.date}</p>
                  </div>
                </div>
                <p className={`font-semibold text-lg
                  ${transaction.amount > 0 ? 'text-green-600' : 'text-gray-900'}
                `}>
                  {transaction.amount > 0 ? '+' : ''}{formatCurrency(transaction.amount)}
                </p>
                <button className="p-2 opacity-0 group-hover:opacity-100 hover:bg-gray-200 rounded-lg transition-all">
                  <MoreVertical className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Chatbot Modal */}
      {showChatbot && (
        <div className="fixed bottom-6 right-6 w-96 max-h-96 bg-white rounded-2xl shadow-2xl flex flex-col border border-gray-200 z-50">
          {/* Header */}
          <div className="bg-linear-to-r from-primary to-blue-700 text-white rounded-t-2xl p-4 flex items-center justify-between">
            <div>
              <h3 className="font-display font-bold">Asisten Virtual</h3>
              <p className="text-xs text-blue-100">Siap membantu 24/7</p>
            </div>
            <button 
              onClick={() => setShowChatbot(false)}
              className="p-1 hover:bg-white/20 rounded-lg transition-colors"
            >
              ✕
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
            {chatMessages.map((msg, idx) => (
              <div 
                key={idx}
                className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-xs px-4 py-2 rounded-lg
                  ${msg.type === 'user' 
                    ? 'bg-primary text-white rounded-br-none' 
                    : 'bg-gray-200 text-gray-900 rounded-bl-none'
                  }
                `}>
                  <p className="text-sm">{msg.message}</p>
                </div>
              </div>
            ))}
            {chatLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-200 text-gray-900 px-4 py-3 rounded-lg rounded-bl-none">
                  <Loader2 className="w-4 h-4 animate-spin" />
                </div>
              </div>
            )}
          </div>

          {/* Quick Actions */}
          {chatMessages.length === 1 && (
            <div className="border-t border-gray-200 p-3 bg-gray-50">
              <p className="text-xs font-semibold text-gray-600 mb-2">Quick Actions:</p>
              <div className="grid grid-cols-2 gap-2">
                <button 
                  onClick={() => handleQuickAction('saldo')}
                  className="text-xs bg-primary/10 text-primary hover:bg-primary/20 px-2 py-1 rounded transition-colors font-medium"
                >
                  Cek Saldo
                </button>
                <button 
                  onClick={() => handleQuickAction('transfer')}
                  className="text-xs bg-primary/10 text-primary hover:bg-primary/20 px-2 py-1 rounded transition-colors font-medium"
                >
                  Transfer
                </button>
                <button 
                  onClick={() => handleQuickAction('promo')}
                  className="text-xs bg-primary/10 text-primary hover:bg-primary/20 px-2 py-1 rounded transition-colors font-medium"
                >
                  Lihat Promo
                </button>
              </div>
            </div>
          )}

          {/* Input */}
          <div className="border-t border-gray-200 p-4 bg-white rounded-b-2xl">
            <div className="flex gap-2">
              <input 
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Ketik pesan..."
                className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary"
                disabled={chatLoading}
              />
              <button 
                onClick={handleSendMessage}
                disabled={chatLoading || !chatInput.trim()}
                className="bg-primary text-white p-2 rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Chatbot Button */}
      {!showChatbot && (
        <button 
          onClick={() => setShowChatbot(true)}
          className="fixed bottom-6 right-6 w-14 h-14 bg-primary text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 flex items-center justify-center group"
          title="Buka Chat"
        >
          <MessageSquare className="w-7 h-7" />
          <span className="absolute -top-10 right-0 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">Asisten Virtual</span>
        </button>
      )}
    </div>
  );
}
