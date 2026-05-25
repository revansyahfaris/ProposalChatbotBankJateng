# Brainstorming Desain Website Bank Jateng

## Konsep Desain Terpilih: Modern Minimalist dengan Sentuhan Budaya Lokal

### Design Movement
**Contemporary Banking Minimalism dengan Elemen Budaya Jawa**
Menggabungkan kesederhanaan modern dengan identitas visual yang kuat, menciptakan kepercayaan melalui kejelasan dan kemudahan penggunaan, sambil menghormati warisan budaya Bank Jateng.

### Core Principles
1. **Clarity Over Complexity** - Setiap elemen visual memiliki tujuan; tidak ada dekorasi yang tidak perlu
2. **Accessibility & Trust** - Interface yang intuitif membuat pengguna merasa aman dan percaya diri
3. **Progressive Disclosure** - Informasi penting ditampilkan terlebih dahulu; detail tersembunyi dengan elegan
4. **Cultural Authenticity** - Warna dan motif mencerminkan identitas lokal tanpa terasa kuno

### Color Philosophy
- **Primary Red (#A41E34)** - Warna utama Bank Jateng yang berani, melambangkan kepercayaan, energi, dan otoritas finansial
- **Dark Navy (#1A2B4A)** - Untuk admin/dashboard, menciptakan profesionalisme dan stabilitas
- **Warm Gold (#D4AF37)** - Aksen premium, digunakan pada elemen penting dan hover states
- **Clean White (#FFFFFF)** - Background utama untuk readability maksimal
- **Soft Gray (#F5F5F5, #E8E8E8)** - Untuk subtle divisions dan secondary backgrounds
- **Dark Text (#2C2C2C)** - Untuk kontras optimal dan readability

**Emotional Intent:** Kombinasi merah dan emas menciptakan kesan premium namun accessible; navy untuk profesionalisme; white dan gray untuk clarity dan focus.

### Layout Paradigm
- **Asymmetric Card-Based Layout** - Bukan grid centered, tapi menggunakan card-based system dengan spacing yang breathing
- **Vertical Rhythm** - Spacing konsisten (8px, 16px, 24px, 32px) menciptakan harmoni visual
- **Floating Elements** - Card dan form elements memiliki subtle shadow, terasa "floating" di atas background
- **Hero Section dengan Diagonal Accent** - Menggunakan SVG divider dengan angle untuk visual interest

### Signature Elements
1. **Rounded Card Containers** - Border radius 12-16px untuk modern feel, bukan sharp corners
2. **Gradient Accents** - Subtle gradient dari red ke gold pada tombol dan hover states
3. **Icon System** - Lucide React icons dengan weight konsisten, 24px default size
4. **Micro-interactions** - Button scale on hover (0.98), smooth transitions 200ms

### Interaction Philosophy
- **Responsive Feedback** - Setiap klik memberikan visual feedback (scale, color change)
- **Smooth Transitions** - Semua state changes menggunakan ease-out cubic-bezier(0.23, 1, 0.32, 1)
- **Hover States** - Background color change + slight scale up untuk interactivity
- **Loading States** - Spinner dengan warna brand, bukan generic

### Animation
- **Button Interactions:** Scale 0.97 on active, 200ms ease-out
- **Card Entrance:** Fade in + slide up 200ms, staggered by 50ms
- **Form Validation:** Subtle shake on error (10px horizontal), 300ms duration
- **Dropdown/Modal:** Fade in 150ms, scale from 0.95 to 1
- **Hover Effects:** Color transition 150ms, icon rotation on relevant elements
- **Loading Spinner:** Continuous rotation, 1.5s per rotation

### Typography System
- **Display Font:** "Poppins" Bold/SemiBold (24px-32px) untuk headings
- **Body Font:** "Inter" Regular (14px-16px) untuk body text
- **Accent Font:** "Poppins" Medium untuk labels dan CTAs
- **Hierarchy:** H1 (32px) → H2 (24px) → H3 (18px) → Body (16px) → Caption (12px)
- **Line Height:** 1.6 untuk body, 1.2 untuk headings

---

## Implementasi Desain
- Header: Merah dengan logo putih, user profile di kanan (untuk authenticated pages)
- Forms: White background, red borders on focus, gold accent on labels
- Buttons: Red background dengan white text, gold gradient on hover
- Cards: White dengan subtle shadow, rounded corners, red accent border top
- Dashboard: Navy header, white content area, red accent untuk selected items
- Responsive: Mobile-first approach, breakpoints di 640px, 1024px, 1280px
