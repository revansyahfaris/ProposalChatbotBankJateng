import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { ChevronRight, ArrowRight, Shield, Zap, Users, Lock, CreditCard, TrendingUp, Smartphone, Globe } from "lucide-react";

/**
 * Home Page - Landing Page
 * Design: Modern Hero Landing Page with Bank Jateng branding
 * Features: Hero section, features showcase, testimonials, CTA buttons
 */
export default function Home() {
  const [, setLocation] = useLocation();

  const features = [
    {
      icon: <Shield className="w-8 h-8 text-primary" />,
      title: "Keamanan Terjamin",
      description: "Enkripsi tingkat bank dengan teknologi terkini untuk melindungi data Anda",
    },
    {
      icon: <Zap className="w-8 h-8 text-primary" />,
      title: "Transaksi Cepat",
      description: "Proses transfer instan dengan teknologi real-time untuk kemudahan Anda",
    },
    {
      icon: <Users className="w-8 h-8 text-primary" />,
      title: "Layanan Pelanggan 24/7",
      description: "Tim dukungan siap membantu Anda kapan saja melalui berbagai channel",
    },
    {
      icon: <CreditCard className="w-8 h-8 text-primary" />,
      title: "Berbagai Produk",
      description: "Akses lengkap ke tabungan, investasi, kredit, dan produk keuangan lainnya",
    },
    {
      icon: <TrendingUp className="w-8 h-8 text-primary" />,
      title: "Pertumbuhan Investasi",
      description: "Kelola portofolio investasi dengan tools analisis profesional kami",
    },
    {
      icon: <Smartphone className="w-8 h-8 text-primary" />,
      title: "Mobile Banking Canggih",
      description: "Kelola semua kebutuhan keuangan Anda dari smartphone dengan mudah",
    },
  ];

  const testimonials = [
    {
      name: "Budi Hartono",
      role: "Entrepreneur",
      image: "👨‍💼",
      text: "Bank Jateng membuat pengelolaan keuangan bisnis saya menjadi lebih efisien dan aman.",
    },
    {
      name: "Siti Nurhaliza",
      role: "Investor",
      image: "👩‍💼",
      text: "Platform investasi mereka sangat mudah digunakan dengan return yang kompetitif.",
    },
    {
      name: "Ahmad Wijaya",
      role: "Profesional",
      image: "👨‍💻",
      text: "Dukungan customer service yang responsif dan fitur-fitur yang selalu diperbarui.",
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white border-b border-gray-100">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src="/images/logo-light.png" alt="Bank Jateng" className="h-10 w-auto" />

          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setLocation('/login')}
              className="px-6 py-2 text-gray-700 font-medium hover:text-primary transition-colors"
            >
              Masuk
            </button>
            <Button 
              onClick={() => setLocation('/signup')}
              className="btn-primary px-6 py-2 rounded-lg"
            >
              Daftar
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-24">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="flex flex-col gap-6">
            <div>
              <h1 className="text-5xl md:text-6xl font-display font-bold text-gray-900 mb-4 leading-tight">
                Transformasi Digital <span className="text-primary">Keuangan Anda</span>
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed">
                Kelola semua kebutuhan finansial Anda dengan mudah, aman, dan cepat. Bergabunglah dengan jutaan pengguna yang telah mempercayai Bank Jateng.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button 
                onClick={() => setLocation('/signup')}
                className="btn-primary px-8 py-3 text-lg rounded-lg flex items-center justify-center gap-2 group"
              >
                Mulai Sekarang
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button 
                onClick={() => setLocation('/login')}
                variant="outline"
                className="px-8 py-3 text-lg rounded-lg border-2 border-gray-300 hover:bg-gray-50 flex items-center justify-center gap-2"
              >
                Pelajari Selengkapnya
                <ChevronRight className="w-5 h-5" />
              </Button>
            </div>

            {/* Trust Badges */}
            <div className="flex flex-wrap gap-6 pt-4">
              <div className="flex items-center gap-2">
                <Lock className="w-5 h-5 text-primary" />
                <span className="text-sm font-medium text-gray-700">Tersertifikasi Aman</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-primary" />
                <span className="text-sm font-medium text-gray-700">5 Juta+ Pengguna</span>
              </div>
            </div>
          </div>

          {/* Right Image/Illustration */}
          <div className="hidden md:flex justify-center">
            <div className="bg-linear-to-br from-primary/10 to-blue-50 rounded-3xl p-12 w-full aspect-square flex items-center justify-center">
              <div className="text-center">
                <div className="text-8xl mb-4">🏦</div>
                <p className="text-gray-600 font-medium">Bank Jateng Digital</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-gray-50 py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-display font-bold text-gray-900 mb-4">
              Keunggulan Bank Jateng
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Kami menyediakan solusi keuangan terdepan dengan teknologi dan layanan terbaik
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="bg-white rounded-2xl p-8 hover:shadow-lg transition-shadow duration-300 border border-gray-100"
              >
                <div className="mb-4 inline-block p-3 bg-primary/10 rounded-lg">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-display font-bold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-display font-bold text-gray-900 mb-4">
              Kepuasan Pelanggan
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Dengarkan pengalaman pengguna kami yang telah merasakan manfaat Bank Jateng
            </p>
          </div>

          {/* Testimonials Grid */}
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div 
                key={index}
                className="bg-white rounded-2xl p-8 border border-gray-100 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-2xl">
                    {testimonial.image}
                  </div>
                  <div>
                    <p className="font-display font-bold text-gray-900">{testimonial.name}</p>
                    <p className="text-sm text-gray-600">{testimonial.role}</p>
                  </div>
                </div>
                <p className="text-gray-600 italic">"{testimonial.text}"</p>
                <div className="flex gap-1 mt-4">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-yellow-400">★</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-linear-to-r from-primary to-blue-700 text-white py-24">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-display font-bold mb-6">
            Siap Memulai Perjalanan Finansial Anda?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Buat akun sekarang dan dapatkan bonus serta berbagai keuntungan eksklusif untuk member baru
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              onClick={() => setLocation('/signup')}
              className="bg-white text-primary hover:bg-gray-100 px-8 py-3 text-lg rounded-lg font-semibold"
            >
              Buat Akun Sekarang
            </Button>
            <Button 
              onClick={() => setLocation('/login')}
              variant="outline"
              className="border-2 border-white text-white hover:bg-white/10 px-8 py-3 text-lg rounded-lg font-semibold"
            >
              Saya Sudah Punya Akun
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            <div>
              <p className="font-display font-bold text-white mb-4">Bank Jateng</p>
              <p className="text-sm">Solusi keuangan digital terpercaya untuk masa depan yang lebih baik.</p>
            </div>
            <div>
              <p className="font-semibold text-white mb-4">Produk</p>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition">Tabungan</a></li>
                <li><a href="#" className="hover:text-white transition">Investasi</a></li>
                <li><a href="#" className="hover:text-white transition">Kredit</a></li>
              </ul>
            </div>
            <div>
              <p className="font-semibold text-white mb-4">Perusahaan</p>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition">Tentang Kami</a></li>
                <li><a href="#" className="hover:text-white transition">Blog</a></li>
                <li><a href="#" className="hover:text-white transition">Karir</a></li>
              </ul>
            </div>
            <div>
              <p className="font-semibold text-white mb-4">Legal</p>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition">Privasi</a></li>
                <li><a href="#" className="hover:text-white transition">Syarat & Ketentuan</a></li>
                <li><a href="#" className="hover:text-white transition">Hubungi Kami</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-sm">
            <p>&copy; 2024 PT Bank Jateng. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
