import { useState, useEffect } from 'react';
import { LogOut, Bell, Settings, Search, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useLocation } from 'wouter';

/**
 * Dashboard Admin Page
 * Design: Professional with Navy header
 * Features: Customer list table, admin controls, search functionality
 */

const generateRandomCustomers = () => {
  const firstNames = ['Muhammad', 'Ahmad', 'Budi', 'Siti', 'Rini', 'Andi', 'Rina', 'Fajar', 'Handoko', 'Lestari', 'Bambang', 'Dewi', 'Hendra', 'Mega', 'Wulan'];
  const lastNames = ['Wijaya', 'Santoso', 'Rahman', 'Nurdin', 'Kusuma', 'Hartono', 'Suryanto', 'Purnama', 'Setiawan', 'Prasetyo', 'Irawan', 'Muhamad', 'Adnyani', 'Gunawan', 'Hermawan'];
  
  const customers = [];
  for (let i = 0; i < 5; i++) {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const accountNumber = String(8888 + i);
    
    customers.push({
      id: i + 1,
      name: `${firstName} ${lastName}`,
      accountNumber: accountNumber,
      registrationDate: `${String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')}/${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}/2026`,
    });
  }
  return customers;
};

export default function DashboardAdmin() {
  const [, setLocation] = useLocation();
  const [searchTerm, setSearchTerm] = useState('');
  const [adminName, setAdminName] = useState('Admin');
  const [adminEmail, setAdminEmail] = useState('admin@bankjateng.co.id');

  useEffect(() => {
    const savedName = localStorage.getItem('adminName');
    const savedEmail = localStorage.getItem('adminEmail');
    if (savedName) setAdminName(savedName);
    if (savedEmail) setAdminEmail(savedEmail);
  }, []);

  const [customers] = useState(generateRandomCustomers());

  const filteredCustomers = customers.filter((customer) =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.accountNumber.includes(searchTerm)
  );

  return (
    <div className="min-h-screen bg-linear-to-b from-gray-50 to-white">
      {/* Header */}
      <div className="header-admin sticky top-0 z-10 bg-linear-to-r from-slate-700 to-slate-800">
        <div className="container flex items-center justify-between py-4">
          <div className="flex items-center gap-3">
            <img src="/images/logo-light.png" alt="Bank Jateng" className="h-12 w-auto" />
          </div>

          {/* Admin Profile Section */}
          <div className="flex items-center gap-4">
            <button 
              onClick={() => alert('Anda memiliki 3 notifikasi baru')}
              className="p-2 hover:bg-white/10 rounded-full transition-colors group"
              title="Notifikasi"
            >
              <Bell className="w-6 h-6 text-white" />
              <span className="absolute -bottom-8 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">Notifikasi (3)</span>
            </button>
            <button 
              onClick={() => alert('Buka halaman pengaturan')}
              className="p-2 hover:bg-white/10 rounded-full transition-colors group"
              title="Pengaturan"
            >
              <Settings className="w-6 h-6 text-white" />
              <span className="absolute -bottom-8 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">Pengaturan</span>
            </button>

            <div className="flex items-center gap-3 bg-white rounded-full px-4 py-2">
              <div className="flex flex-col items-end">
                <p className="font-semibold text-gray-900">{adminName}</p>
                <p className="text-xs text-gray-600">{adminEmail}</p>
              </div>
              <div className="w-10 h-10 bg-linear-to-br from-slate-800 to-slate-600 rounded-full flex items-center justify-center text-white font-bold">
                {adminName.split(' ').map(n => n[0]).join('').toUpperCase()}
              </div>
              <ChevronDown className="w-4 h-4 text-gray-600" />
            </div>

            <button
              onClick={() => {
                localStorage.removeItem('adminName');
                localStorage.removeItem('adminEmail');
                setLocation('/login-admin');
              }}
              className="p-2 hover:bg-white/10 rounded-full transition-colors"
            >
              <LogOut className="w-6 h-6 text-white" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container py-12">
        {/* Dashboard Header */}
        <div className="mb-8">
          <h2 className="text-3xl font-display text-gray-900 mb-2">Dashboard</h2>
          <p className="text-gray-600">Kelola data nasabah Bank Jateng</p>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative">
            <Search className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Cari berdasarkan nama nasabah atau nomor rekening..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field pl-12 w-full"
            />
          </div>
        </div>

        {/* Table Card */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden border-t-4 border-slate-800">
          {/* Table Header */}
          <div className="bg-linear-to-r from-slate-800 to-slate-700 text-white">
            <div className="grid grid-cols-12 gap-4 px-8 py-4 font-semibold">
              <div className="col-span-1">No</div>
              <div className="col-span-4">Nasabah</div>
              <div className="col-span-4">Rekening</div>
              <div className="col-span-3">Waktu didaftarkan</div>
            </div>
          </div>

          {/* Table Body */}
          <div className="divide-y divide-gray-200">
            {filteredCustomers.length > 0 ? (
              filteredCustomers.map((customer, index) => (
                <div
                  key={customer.id}
                  className="grid grid-cols-12 gap-4 px-8 py-4 hover:bg-gray-50 transition-colors duration-200 items-center"
                >
                  <div className="col-span-1 font-medium text-gray-900">{index + 1}</div>
                  <div className="col-span-4 text-gray-900">{customer.name}</div>
                  <div className="col-span-4 font-mono text-gray-700">
                    **** **** **** {customer.accountNumber}
                  </div>
                  <div className="col-span-3 text-gray-600">{customer.registrationDate}</div>
                </div>
              ))
            ) : (
              <div className="col-span-12 px-8 py-12 text-center">
                <p className="text-gray-600">Tidak ada data nasabah yang ditemukan</p>
              </div>
            )}
          </div>

          {/* Table Footer */}
          <div className="bg-gray-50 px-8 py-4 border-t border-gray-200 flex items-center justify-between">
            <p className="text-sm text-gray-600">
              Menampilkan {filteredCustomers.length} dari {customers.length} nasabah
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="rounded-lg"
                disabled
              >
                Sebelumnya
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="rounded-lg"
              >
                Selanjutnya
              </Button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-slate-800">
            <p className="text-gray-600 text-sm font-medium mb-2">Total Nasabah</p>
            <p className="text-4xl font-display text-gray-900">{customers.length}</p>
            <p className="text-xs text-gray-500 mt-2">Meningkat 12% dari bulan lalu</p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-primary">
            <p className="text-gray-600 text-sm font-medium mb-2">Total Saldo</p>
            <p className="text-4xl font-display text-gray-900">Rp 2.5T</p>
            <p className="text-xs text-gray-500 mt-2">Aset Bank Jateng</p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-yellow-400">
            <p className="text-gray-600 text-sm font-medium mb-2">Transaksi Hari Ini</p>
            <p className="text-4xl font-display text-gray-900">1,234</p>
            <p className="text-xs text-gray-500 mt-2">Dalam 24 jam terakhir</p>
          </div>
        </div>
      </div>
    </div>
  );
}
