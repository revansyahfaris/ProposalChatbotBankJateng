import { useState, useRef, useEffect } from 'react';
import { Send, MessageSquare, X, Loader2, Menu } from 'lucide-react';
import { apiService } from '@/services/apiService';

interface ChatMessage {
  id: string;
  type: 'user' | 'bot';
  message: string;
  timestamp: Date;
}

export default function ManusDialogChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      type: 'bot',
      message: 'Halo! 👋 Saya adalah Asisten Virtual Bank Jateng. Siap membantu Anda 24/7!',
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const quickActions = [
    { label: 'Cek Saldo', action: 'Bagaimana cara cek saldo saya?' },
    { label: 'Transfer', action: 'Saya ingin melakukan transfer' },
    { label: 'Lihat Promosi', action: 'Ada promosi apa bulan ini?' },
    { label: 'Hubungi Support', action: 'Saya ingin berbicara dengan customer service' },
  ];

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    // Add user message
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      message: inputValue,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      // Try to get response from API
      const response = await apiService.sendChatMessage(inputValue);

      const botMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        message: response.message || getDefaultResponse(inputValue),
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      // Fallback to default responses if API fails
      const botMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        message: getDefaultResponse(inputValue),
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const getDefaultResponse = (userInput: string): string => {
    const input = userInput.toLowerCase();

    if (
      input.includes('saldo') ||
      input.includes('balance') ||
      input.includes('cek')
    ) {
      return 'Untuk melihat saldo akun Anda, silakan klik tombol "Lihat Saldo" di dashboard. Jika ingin bantuan lebih lanjut, hubungi kami di 1500-100.';
    }

    if (
      input.includes('transfer') ||
      input.includes('kirim uang') ||
      input.includes('mengirim')
    ) {
      return 'Anda bisa melakukan transfer melalui dashboard dengan klik tombol "Transfer". Pilih rekening tujuan, masukkan nominal, dan konfirmasi. Apakah ada yang ingin saya jelaskan lebih detail?';
    }

    if (input.includes('promo') || input.includes('promosi')) {
      return 'Saat ini kami memiliki promosi menarik! 🎉 Dapatkan cashback hingga 100rb untuk setiap transaksi. Lihat detail di aplikasi mobile atau website kami. Ada yang ingin tahu lebih lanjut?';
    }

    if (
      input.includes('bantuan') ||
      input.includes('help') ||
      input.includes('support')
    ) {
      return 'Tentu! Saya siap membantu. Anda bisa bertanya tentang:\n- Cara menggunakan fitur\n- Transaksi\n- Keamanan akun\n- Promosi\n\nApa yang bisa saya bantu?';
    }

    if (
      input.includes('terima kasih') ||
      input.includes('thanks') ||
      input.includes('makasih')
    ) {
      return 'Sama-sama! 😊 Senang bisa membantu. Jika ada pertanyaan lain, jangan ragu untuk tanya!';
    }

    if (input.includes('halo') || input.includes('hi') || input.includes('hello')) {
      return 'Halo! 👋 Ada yang bisa saya bantu hari ini?';
    }

    if (input.includes('contact') || input.includes('hubungi')) {
      return 'Untuk menghubungi customer service kami:\n📞 Telepon: 1500-100\n📧 Email: support@bankjateng.co.id\n🏢 Datang langsung ke cabang terdekat\n\nTim kami siap melayani 24/7!';
    }

    return 'Terima kasih atas pertanyaannya! Untuk informasi lebih detail, silakan hubungi customer service kami di 1500-100 atau kunjungi website kami. Adakah yang bisa saya bantu lagi?';
  };

  const handleQuickAction = (action: string) => {
    setInputValue(action);
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      message: action,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    setTimeout(() => {
      const botMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        message: getDefaultResponse(action),
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMessage]);
      setIsLoading(false);
    }, 500);
  };

  return (
    <>
      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-96 max-h-150 bg-white rounded-2xl shadow-2xl flex flex-col border border-gray-200 z-50 animate-in fade-in slide-in-from-bottom-5 duration-300">
          {/* Header */}
          <div className="bg-linear-to-r from-blue-600 to-blue-700 text-white rounded-t-2xl p-4 flex items-center justify-between">
            <div>
              <h3 className="font-display font-bold flex items-center gap-2">
                <MessageSquare className="w-5 h-5" />
                Asisten Virtual Bank Jateng
              </h3>
              <p className="text-xs text-blue-100">Siap membantu Anda</p>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 hover:bg-white/20 rounded-lg transition-colors"
              title="Tutup chat"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-200`}
              >
                <div
                  className={`max-w-xs px-4 py-3 rounded-lg text-sm ${
                    msg.type === 'user'
                      ? 'bg-blue-600 text-white rounded-br-none'
                      : 'bg-gray-300 text-gray-900 rounded-bl-none'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.message}</p>
                  <span className="text-xs opacity-70 mt-1 block">
                    {msg.timestamp.toLocaleTimeString('id-ID', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start animate-in fade-in">
                <div className="bg-gray-300 text-gray-900 px-4 py-3 rounded-lg rounded-bl-none flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="text-sm">Sedang diproses...</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Actions */}
          {messages.length <= 2 && (
            <div className="border-t border-gray-200 p-3 bg-white">
              <p className="text-xs font-semibold text-gray-600 mb-2 px-1">Cepat & Mudah:</p>
              <div className="grid grid-cols-2 gap-2">
                {quickActions.map((action, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleQuickAction(action.action)}
                    className="text-xs bg-blue-50 text-blue-600 hover:bg-blue-100 px-3 py-2 rounded-lg transition-colors font-medium border border-blue-200"
                    disabled={isLoading}
                  >
                    {action.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input Area */}
          <div className="border-t border-gray-200 p-4 bg-white rounded-b-2xl">
            <div className="flex gap-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                placeholder="Ketik pertanyaan Anda..."
                className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 disabled:bg-gray-100"
                disabled={isLoading}
              />
              <button
                onClick={handleSendMessage}
                disabled={isLoading || !inputValue.trim()}
                className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                title="Kirim pesan"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-2">💡 Tekan Enter untuk mengirim</p>
          </div>
        </div>
      )}

      {/* Floating Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 w-14 h-14 bg-linear-to-r from-blue-600 to-blue-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 flex items-center justify-center group z-40 animate-in fade-in"
          title="Buka chat dengan asisten"
        >
          <MessageSquare className="w-7 h-7" />
          <span className="absolute -top-12 right-0 bg-gray-900 text-white text-xs px-3 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
            Chat dengan Asisten
          </span>
        </button>
      )}
    </>
  );
}
