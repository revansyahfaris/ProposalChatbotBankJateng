# Component Documentation - Bank Jateng Web App

## 📦 Available Components

### UI Components (shadcn/ui)
Semua component dari shadcn/ui sudah tersedia di `client/src/components/ui/`:
- Button
- Input
- Checkbox
- Select
- Dialog
- Drawer
- Sheet
- Tabs
- Accordion
- Card
- Badge
- Alert
- Toast/Sonner
- Dan lebih banyak lagi

### Custom Components

#### 1. ManusDialogChatbot
Virtual chatbot assistant untuk customer support.

**Location:** `client/src/components/ManusDialogChatbot.tsx`

**Usage:**
```tsx
import ManusDialogChatbot from '@/components/ManusDialogChatbot';

export default function App() {
  return (
    <div>
      <YourContent />
      <ManusDialogChatbot />
    </div>
  );
}
```

**Props:** None (uses internal state)

**Features:**
- Floating chat button
- Chat window modal
- Message history
- Quick action buttons
- Loading states
- Responsive design

**Example Messages:**
- "Bagaimana cara cek saldo saya?"
- "Saya ingin melakukan transfer"
- "Ada promosi apa bulan ini?"

---

## 🎨 Page Components

### Home.tsx
Landing page utama dengan:
- Hero section
- Features showcase (6 items)
- Testimonials (3 items)
- CTA section
- Footer

**Routes:** `/`

**Key Features:**
- Navigation bar
- Responsive grid
- Icon + text combinations
- Call-to-action buttons

### LoginUser.tsx
User login page dengan:
- Email input
- Password input dengan show/hide toggle
- Google OAuth button
- Apple OAuth button
- Remember me checkbox
- Forgot password link
- Error/Success messages

**Routes:** `/login`, `/`

**Key Features:**
- Form validation
- Loading states
- OAuth integration placeholders
- Security banner

### SignupUser.tsx
User registration page dengan:
- Full Name input
- Username input
- Email input
- Phone input
- NIK input
- Password dengan strength indicator
- Confirm password
- Privacy & terms checkboxes

**Routes:** `/signup`

**Key Features:**
- Password strength meter (4 levels)
- Real-time validation
- Success notification
- Multi-step experience

### LoginAdmin.tsx
Admin login page dengan:
- Email input
- Password input
- Two-Factor Authentication (2FA)
- 2FA code input
- Security information

**Routes:** `/login-admin`

**Key Features:**
- Dark theme
- 2FA support
- Enhanced security
- Admin-specific styling

### DashboardUser.tsx
Main user dashboard dengan:
- Account cards
- Balance display
- Transaction history
- Quick action buttons
- Virtual chatbot
- Notification bell
- Settings menu
- Logout button

**Routes:** `/dashboard-user`

**Key Features:**
- Tabbed navigation
- Transaction filters
- Chatbot integration
- Real-time updates (simulated)

### CreateAccount.tsx
Account creation wizard dengan:
- Account type selection (3 options)
- Account name input
- Initial balance input
- Form validation
- Success screen

**Routes:** `/create-account`

**Key Features:**
- Multi-step process
- Type-specific benefits
- Minimum balance validation
- Success confirmation

### DashboardAdmin.tsx
Admin dashboard (placeholder untuk ekspansi)

**Routes:** `/dashboard-admin`

---

## 🔧 Service Layer

### authService.ts
Menangani authentication operations.

**Methods:**
```tsx
// Login methods
await authService.login({ email, password })
await authService.loginWithGoogle(googleToken)
await authService.loginWithApple(appleToken)
await authService.signup(signupData)

// Logout & token management
authService.logout()
authService.getToken() // Returns token or null
authService.getCurrentUser() // Returns user object or null
authService.isAuthenticated() // Returns boolean

// Password reset
await authService.requestPasswordReset(email)
await authService.resetPassword(token, newPassword)

// OTP verification
await authService.verifyEmailOTP(email, otp)
```

**Response Format:**
```tsx
interface AuthResponse {
  success: boolean;
  message: string;
  token?: string;
  user?: {
    id: string;
    email: string;
    fullName: string;
    username: string;
  };
}
```

### apiService.ts
Menangani semua API calls ke backend.

**Account Methods:**
```tsx
await apiService.getAccounts() // Get all accounts
await apiService.getAccount(accountId) // Get specific account
await apiService.createAccount(accountData) // Create new account
await apiService.updateAccount(accountId, updates)
await apiService.deleteAccount(accountId)
```

**Transaction Methods:**
```tsx
await apiService.getTransactions(accountId, filters)
await apiService.getTransaction(transactionId)
await apiService.transfer(transferData)
await apiService.payBill(paymentData)
```

**User Methods:**
```tsx
await apiService.getProfile()
await apiService.updateProfile(profileData)
await apiService.changePassword(oldPassword, newPassword)
await apiService.updateEmail(newEmail)
await apiService.updatePhone(newPhone)
```

**Chatbot Methods:**
```tsx
await apiService.sendChatMessage(message)
await apiService.getChatHistory(limit)
```

**Settings Methods:**
```tsx
await apiService.getSettings()
await apiService.updateSettings(settings)
await apiService.enable2FA()
await apiService.verify2FA(code)
await apiService.disable2FA(password)
```

**Notification Methods:**
```tsx
await apiService.getNotifications(limit)
await apiService.markNotificationAsRead(notificationId)
await apiService.deleteNotification(notificationId)
```

---

## 🎯 Common Patterns

### Form Handling Pattern
```tsx
const [formData, setFormData] = useState({
  email: '',
  password: '',
});
const [errors, setErrors] = useState<Record<string, string>>({});
const [loading, setLoading] = useState(false);

const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const { name, value } = e.target;
  setFormData(prev => ({ ...prev, [name]: value }));
  // Clear error on change
  if (errors[name]) {
    setErrors(prev => ({ ...prev, [name]: '' }));
  }
};

const validateForm = () => {
  const newErrors: Record<string, string> = {};
  
  if (!formData.email.trim()) {
    newErrors.email = 'Email harus diisi';
  } else if (!isValidEmail(formData.email)) {
    newErrors.email = 'Format email tidak valid';
  }
  
  if (!formData.password) {
    newErrors.password = 'Password harus diisi';
  } else if (formData.password.length < 6) {
    newErrors.password = 'Password minimal 6 karakter';
  }
  
  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!validateForm()) return;
  
  setLoading(true);
  try {
    const response = await authService.login(formData);
    if (response.success) {
      setLocation('/dashboard-user');
    } else {
      setErrors({ form: response.message });
    }
  } catch (error) {
    setErrors({ form: 'Terjadi kesalahan' });
  } finally {
    setLoading(false);
  }
};
```

### Async Data Fetching Pattern
```tsx
const [data, setData] = useState(null);
const [loading, setLoading] = useState(false);
const [error, setError] = useState('');

useEffect(() => {
  const fetchData = async () => {
    setLoading(true);
    setError('');
    try {
      const result = await apiService.getAccounts();
      setData(result);
    } catch (err) {
      setError('Gagal mengambil data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  fetchData();
}, []);
```

### Multi-Step Form Pattern
```tsx
const [step, setStep] = useState<'select' | 'form' | 'success'>('select');

const handleNext = () => setStep('form');
const handleBack = () => setStep('select');
const handleSubmit = () => setStep('success');

if (step === 'select') {
  return <SelectStep onNext={handleNext} />;
}

if (step === 'form') {
  return <FormStep onBack={handleBack} onSubmit={handleSubmit} />;
}

if (step === 'success') {
  return <SuccessStep />;
}
```

### Loading State Pattern
```tsx
<Button disabled={loading}>
  {loading ? (
    <>
      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
      Sedang Memproses...
    </>
  ) : (
    <>
      Simpan
      <ArrowRight className="w-4 h-4 ml-2" />
    </>
  )}
</Button>
```

---

## 🎨 Styling Patterns

### Card Component
```tsx
<div className="bg-white rounded-2xl shadow-lg p-8 border-t-4 border-primary hover:shadow-xl transition-shadow">
  <h2 className="text-2xl font-display font-bold text-gray-900">Title</h2>
  <p className="text-gray-600 mt-2">Description</p>
</div>
```

### Button Group
```tsx
<div className="flex flex-col sm:flex-row gap-4">
  <Button className="btn-primary flex-1">Primary</Button>
  <Button variant="outline" className="flex-1">Secondary</Button>
</div>
```

### Icon + Text
```tsx
<div className="flex items-center gap-3">
  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
    <Icon className="w-6 h-6 text-primary" />
  </div>
  <div>
    <p className="font-semibold text-gray-900">Title</p>
    <p className="text-sm text-gray-600">Description</p>
  </div>
</div>
```

### Responsive Grid
```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {items.map(item => (
    <div key={item.id} className="...">
      {/* Card content */}
    </div>
  ))}
</div>
```

### Error Message
```tsx
{error && (
  <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
    <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
    <p className="text-sm text-red-700">{error}</p>
  </div>
)}
```

### Success Message
```tsx
{success && (
  <div className="p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
    <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0" />
    <p className="text-sm text-green-700">{success}</p>
  </div>
)}
```

---

## 📚 Best Practices

### Do's ✅
- Use TypeScript for type safety
- Keep components small and focused
- Use services for API calls
- Handle loading and error states
- Validate user input
- Use meaningful variable names
- Add comments for complex logic
- Test on multiple devices

### Don'ts ❌
- Don't use inline styles
- Don't make components too large
- Don't make API calls in render
- Don't forget error handling
- Don't skip validation
- Don't use console.log in production
- Don't hardcode values
- Don't ignore accessibility

---

## 🔗 Integration Checklist

Before connecting to backend:
- [ ] Setup API base URL in `.env.local`
- [ ] Create API endpoints documentation
- [ ] Setup authentication flow
- [ ] Test API responses
- [ ] Handle different error codes
- [ ] Implement refresh token logic
- [ ] Setup error tracking
- [ ] Add request logging

---

**Last Updated:** 2024-01-15
**Version:** 2.0
