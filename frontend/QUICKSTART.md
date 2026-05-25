# 🚀 Quick Start Guide - Bank Jateng Web App

## Persiapan Awal

### 1. Install Dependencies
```bash
pnpm install
```

### 2. Setup Environment Variables
```bash
cp .env.example .env.local
```

Edit `.env.local` dan isi dengan konfigurasi Anda:
```env
VITE_API_BASE_URL=http://localhost:3000/api
VITE_GOOGLE_CLIENT_ID=your_google_client_id
```

### 3. Start Development Server
```bash
pnpm dev
```

Server akan berjalan di `http://localhost:5173`

---

## 📖 Halaman-Halaman Utama

### Home Page (`/`)
- Landing page dengan hero section
- Showcase fitur-fitur utama
- CTA untuk sign up dan login

**Testing:**
- Klik "Mulai Sekarang" untuk pergi ke signup
- Klik "Pelajari Selengkapnya" untuk melihat features

### Login User (`/login`)
- Email & password login
- Google OAuth (placeholder)
- Apple OAuth (placeholder)
- Remember me option

**Testing:**
- Coba kirim form kosong (validasi)
- Masukkan email invalid (validasi)
- Masukkan email valid + password valid (simulasi login sukses)

### Sign Up (`/signup`)
- Multi-field registration form
- Password strength indicator
- Real-time validation
- Terms & privacy agreement

**Testing:**
- Lihat password strength meter saat mengetik
- Coba submit dengan data kosong (error validation)
- Submit dengan data lengkap (success message)

### Dashboard User (`/dashboard-user`)
- Account overview dengan multiple cards
- Transaction history
- Quick action buttons
- Virtual chatbot assistant

**Testing:**
- Klik eye icon untuk hide/show balance
- Scroll transaction list
- Buka chatbot dengan floating button
- Ketik pesan untuk chatbot

### Create Account (`/create-account`)
- Pilih tipe rekening
- Input account details
- Success screen

**Testing:**
- Pilih tipe rekening
- Coba submit dengan balance dibawah minimum
- Submit successful untuk melihat success screen

### Login Admin (`/login-admin`)
- Admin login dengan 2FA
- Enhanced security features
- Dark theme

**Testing:**
- Masukkan credentials
- Kode 2FA akan di-request
- Submit kode untuk complete login

---

## 🛠️ Development Workflow

### Menambah Fitur Baru

1. **Create Component**
```tsx
// client/src/components/NewComponent.tsx
import { Button } from '@/components/ui/button';

export default function NewComponent() {
  return <div>Hello</div>;
}
```

2. **Import & Use**
```tsx
import NewComponent from '@/components/NewComponent';

export default function HomePage() {
  return <NewComponent />;
}
```

3. **Style dengan Tailwind**
```tsx
<div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-all">
  <h2 className="text-3xl font-display font-bold text-gray-900">Title</h2>
</div>
```

### Menambah Form Validation

```tsx
const validateForm = () => {
  const errors: Record<string, string> = {};
  
  if (!email.trim()) {
    errors.email = 'Email harus diisi';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = 'Format email tidak valid';
  }
  
  setErrors(errors);
  return Object.keys(errors).length === 0;
};
```

### Menggunakan Services

```tsx
import { authService } from '@/services/authService';
import { apiService } from '@/services/apiService';

// Authentication
const response = await authService.login({ email, password });
if (response.success) {
  setLocation('/dashboard-user');
}

// Get Data
const accounts = await apiService.getAccounts();
const transactions = await apiService.getTransactions(accountId);

// Submit Data
const result = await apiService.transfer({
  fromAccountId: '123',
  toAccountNumber: '456',
  amount: 500000
});
```

---

## 🎨 Design System

### Colors
```css
/* Primary */
--primary: #2563EB; /* Blue-600 */
--primary-dark: #1E40AF; /* Blue-700 */

/* Neutral */
--gray-50: #F9FAFB;
--gray-900: #111827;

/* Status */
--success: #10B981; /* Green */
--warning: #F59E0B; /* Amber */
--error: #EF4444; /* Red */
--info: #3B82F6; /* Blue */
```

### Components

**Button Variants**
```tsx
<Button>Default Button</Button>
<Button variant="outline">Outline Button</Button>
<Button className="btn-primary">Primary Button</Button>
```

**Card**
```tsx
<div className="bg-white rounded-2xl shadow-lg p-8">
  <h3 className="text-2xl font-display text-gray-900 mb-4">Title</h3>
  <p className="text-gray-600">Content</p>
</div>
```

**Form Field**
```tsx
<div>
  <label className="block text-sm font-semibold text-gray-700 mb-2">
    Label
  </label>
  <Input 
    type="email"
    placeholder="Email"
    className="py-3 rounded-lg border-2"
  />
</div>
```

---

## 📝 Naming Conventions

### Files & Folders
- Components: `PascalCase` → `ProfileCard.tsx`
- Pages: `PascalCase` → `HomePage.tsx`
- Utilities: `camelCase` → `formatCurrency.ts`
- Hooks: `camelCase` prefix dengan `use` → `useAuth.ts`

### Variables & Functions
- Constants: `UPPER_SNAKE_CASE` → `MAX_RETRIES`
- Variables: `camelCase` → `userName`
- Functions: `camelCase` → `formatCurrency()`
- React Components: `PascalCase` → `HomePage`

### CSS Classes
- Use Tailwind utilities
- Custom classes: `kebab-case` → `.card-header`
- State: prefix dengan `is-` or `has-` → `.is-loading`

---

## 🐛 Debugging Tips

### Chrome DevTools
1. Open DevTools (F12)
2. Go to React DevTools tab
3. Inspect components and state

### Console Logging
```tsx
console.log('Value:', value);
console.warn('Warning:', message);
console.error('Error:', error);
```

### Debugging Forms
```tsx
console.log('Form Data:', formData);
console.log('Errors:', errors);
console.log('Loading:', loading);
```

### Network Tab
- Check API calls
- Verify request/response
- Check status codes

---

## 📱 Testing Scenarios

### User Journey 1: Sign Up → Login → Dashboard
1. Go to `/signup`
2. Fill form with valid data
3. Click "Buat Akun"
4. See success message
5. Redirected to `/login`
6. Enter credentials
7. See dashboard

### User Journey 2: Create Account
1. Go to `/dashboard-user`
2. Click "Tambah Rekening"
3. Select account type
4. Fill form
5. Click "Buat Rekening"
6. See success screen

### User Journey 3: Chat with Chatbot
1. Go to `/dashboard-user`
2. Click floating chat button
3. Click "Cek Saldo" quick action
4. See bot response
5. Type custom message
6. Get response

---

## 🚢 Building for Production

### Build
```bash
pnpm build
```

### Preview
```bash
pnpm preview
```

### Deploy
```bash
# Build akan generate di dist/
# Deploy dist/ folder ke hosting
pnpm build && pnpm preview
```

---

## 🔗 Useful Links

- [React Documentation](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [Wouter Router](https://github.com/molefrog/wouter)
- [shadcn/ui](https://ui.shadcn.com)
- [TypeScript](https://www.typescriptlang.org)

---

## ❓ Troubleshooting

### Port 5173 already in use
```bash
# Kill process on port 5173
# Windows
netstat -ano | findstr :5173
taskkill /PID <PID> /F

# macOS/Linux
lsof -ti :5173 | xargs kill -9
```

### Module not found error
- Check import path is correct
- Make sure file exists at that path
- Clear node_modules and reinstall: `pnpm install`

### Style not applying
- Check Tailwind class syntax
- Make sure tailwind.config.ts is configured
- Rebuild with `pnpm build`

---

**Happy Coding! 🎉**
