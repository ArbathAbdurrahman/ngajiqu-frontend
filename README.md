# NgajiQu - Sistem Manajemen TPQ Digital

NgajiQu adalah aplikasi web modern untuk mengelola kegiatan Taman Pendidikan Al-Qur'an (TPQ) dengan fitur administrasi santri, pencatatan kemajuan ngaji, dan manajemen kelas yang komprehensif.

## 🌟 Fitur Utama

### 📚 Manajemen Kelas
- Buat dan kelola kelas TPQ dengan sistem slug yang SEO-friendly
- Akses publik untuk orang tua/wali santri melihat perkembangan
- Dashboard khusus untuk pengajar dan admin

### 👥 Administrasi Santri
- Pendaftaran santri baru dengan data lengkap
- Pencarian santri berdasarkan nama
- Tracking progress individual setiap santri
- Sistem kartu ngaji digital

### 📊 Pencatatan Kemajuan
- Kartu ngaji digital untuk setiap santri
- Pencatatan bab, halaman, dan tanggal ngaji
- Catatan progress dan evaluasi
- Riwayat lengkap aktivitas belajar

### 📋 Manajemen Aktivitas
- Jadwal kegiatan kelas
- Pengumuman dan informasi penting
- Timeline aktivitas harian

### 🔐 Sistem Autentikasi
- Registrasi dan login pengajar/admin
- Sistem JWT token untuk keamanan
- Profile management untuk pengguna

## 🛠️ Teknologi yang Digunakan

- **Frontend:** Next.js 15 dengan App Router
- **Styling:** Tailwind CSS
- **UI Components:** RSuite
- **State Management:** Zustand
- **Authentication:** JWT dengan cookies
- **TypeScript:** Full type safety
- **Icons:** Lucide React

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm atau yarn

### Installation

1. Clone repository:
```bash
git clone https://github.com/Ariyalex/NgajiQu.git
cd ngajiqu
```

2. Install dependencies:
```bash
npm install
# atau
yarn install
```

3. Setup environment variables:
```bash
cp .env.example .env.local
```

Edit file `.env.local` dan isi variabel yang diperlukan:
```env
NEXT_PUBLIC_API_URL=your_api_url_here
```

4. Jalankan development server:
```bash
npm run dev
# atau
yarn dev
```

5. Buka [http://localhost:3000](http://localhost:3000) di browser

## 📁 Struktur Project

```
src/
├── app/                    # Next.js App Router pages
│   ├── (auth)/            # Auth pages (login, register)
│   ├── dashboard/         # Dashboard untuk pengajar/admin
│   ├── [kelas]/           # Public pages untuk kelas
│   └── globals.css        # Global styles
├── components/            # Reusable components
│   ├── auth_ui/           # Authentication components
│   ├── dashboard_ui/      # Dashboard-specific components
│   ├── global_ui/         # Shared UI components
│   ├── home_ui/           # Homepage components
│   ├── kartu_santri/      # Kartu ngaji components
│   ├── kelas_ui/          # Kelas management components
│   └── public_ui/         # Public view components
├── hooks/                 # Custom React hooks
├── store/                 # Zustand state management
│   ├── auth_store.tsx     # Authentication state
│   ├── kelas_store.tsx    # Kelas management state
│   ├── santri_store.tsx   # Santri data state
│   └── overlay_status.tsx # UI overlay state
└── middleware.ts          # Auth middleware
```

## 🎯 Cara Penggunaan

### Untuk Admin/Pengajar:

1. **Registrasi Account**
   - Daftar dengan email dan username
   - Login setelah registrasi berhasil

2. **Buat Kelas Baru**
   - Masuk ke dashboard
   - Tambah kelas dengan nama dan deskripsi
   - Sistem akan generate slug otomatis

3. **Kelola Santri**
   - Tambah santri baru ke kelas
   - Gunakan fitur pencarian untuk mencari santri
   - Input kartu ngaji untuk tracking progress

4. **Pantau Aktivitas**
   - Buat jadwal dan aktivitas kelas
   - Monitor progress semua santri
   - Export data jika diperlukan

### Untuk Orang Tua/Wali:

1. **Akses Public View**
   - Kunjungi `[domain]/[slug-kelas]`
   - Lihat daftar santri dan aktivitas kelas

2. **Monitor Progress Anak**
   - Klik nama santri untuk detail
   - Lihat riwayat kartu ngaji
   - Pantau perkembangan belajar

## 🔧 Development

### Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint

# Type checking
npm run type-check   # Check TypeScript types
```

### Code Style
- ESLint dengan konfigurasi Next.js
- Prettier untuk formatting
- TypeScript strict mode
- Conventional commits

## 🚀 Deployment

### Vercel (Recommended)
1. Push ke GitHub repository
2. Connect repository di Vercel
3. Set environment variables
4. Deploy otomatis

### Manual Deployment
```bash
npm run build
npm run start
```

## 📝 API Integration

NgajiQu terintegrasi dengan backend API untuk:
- Authentication (login, register, refresh token)
- CRUD operations untuk kelas, santri, dan kartu
- File upload untuk profile images
- Real-time data synchronization

## 🛡️ Security Features

- JWT authentication dengan refresh tokens
- CSRF protection
- Input validation dan sanitization
- Secure headers dan cookies
- Protected routes dengan middleware

##  Troubleshooting

### Common Issues:

1. **Hydration Errors**
   - Pastikan client-side rendering untuk komponen yang menggunakan localStorage

2. **API Connection**
   - Periksa environment variable `NEXT_PUBLIC_API_URL`
   - Pastikan backend server berjalan

3. **Authentication Issues**
   - Clear browser cookies dan localStorage
   - Check token expiration

---

**NgajiQu** - Digitalisasi TPQ untuk Pendidikan Al-Qur'an yang Lebih Baik
