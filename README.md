# NG Ambalaj

Endüstriyel ambalaj ürünleri ve çemberleme makineleri için kurumsal web sitesi ve yönetim paneli.

## Özellikler

- **Kurumsal Web Sitesi**: Ürün katalog sayfaları, hakkımızda, iletişim
- **Admin Paneli**: Tam CRUD işlemleri ile ürün ve kategori yönetimi
- **Çoklu Dil Desteği**: Türkçe ve İngilizce
- **Responsive Tasarım**: Mobil uyumlu arayüz
- **Veritabanı Yönetimi**: PostgreSQL + Prisma ORM
- **Oturum Tabanlı Kimlik Doğrulama**: Admin girişi için güvenli session yönetimi

## Teknolojiler

- **Framework**: Next.js 14 (App Router)
- **Dil**: TypeScript
- **Veritabanı**: PostgreSQL (Neon/Vercel Postgres)
- **ORM**: Prisma
- **Styling**: Tailwind CSS
- **UI Kütüphanesi**: shadcn/ui
- **Animasyonlar**: Framer Motion
- **i18n**: react-i18next

## Kurulum

### Gereksinimler

- Node.js 18+
- PostgreSQL veritabanı

### Adımlar

1. Repoyu klonlayın:
```bash
git clone https://github.com/hamzaciftci/nge-ambalaj.git
cd nge-ambalaj
```

2. Bağımlılıkları yükleyin:
```bash
npm install
```

3. `.env` dosyasını oluşturun:
```bash
cp .env.example .env
```

4. `.env` dosyasını düzenleyin ve veritabanı bağlantı bilgilerinizi ekleyin:
```env
DATABASE_URL="postgresql://user:password@host:5432/database"
ADMIN_EMAIL="admin@ngambalaj.com"
ADMIN_PASSWORD="your_secure_password"
SESSION_SECRET="your_random_secret_key"
```

5. Veritabanı şemasını oluşturun:
```bash
npx prisma db push
```

6. Örnek verileri yükleyin:
```bash
npm run db:seed
```

7. Geliştirme sunucusunu başlatın:
```bash
npm run dev
```

Uygulama http://localhost:3000 adresinde çalışacaktır.

## Proje Yapısı

```
src/
├── app/
│   ├── (public)/          # Herkese açık sayfalar
│   │   ├── page.tsx       # Ana sayfa
│   │   ├── hakkimizda/    # Hakkımızda
│   │   ├── iletisim/      # İletişim
│   │   └── urunler/       # Ürün sayfaları
│   ├── admin/             # Admin paneli
│   │   ├── categories/    # Kategori yönetimi
│   │   ├── subcategories/ # Alt kategori yönetimi
│   │   ├── products/      # Ürün yönetimi
│   │   ├── messages/      # İletişim mesajları
│   │   └── settings/      # Site ayarları
│   └── api/               # API rotaları
├── components/
│   ├── admin/             # Admin bileşenleri
│   ├── public/            # Public bileşenler
│   └── ui/                # shadcn/ui bileşenleri
├── i18n/                  # Çeviri dosyaları
├── lib/                   # Yardımcı fonksiyonlar
└── prisma/                # Veritabanı şeması
```

## Admin Paneli

Admin paneline `/admin` adresinden erişebilirsiniz.

**Varsayılan giriş bilgileri** (seed sonrası):
- Email: `.env` dosyasındaki `ADMIN_EMAIL`
- Şifre: `.env` dosyasındaki `ADMIN_PASSWORD`

### Admin Özellikleri

- Kategori ekleme, düzenleme, silme
- Alt kategori yönetimi
- Ürün ekleme (çoklu görsel destekli)
- İletişim form mesajlarını görüntüleme
- Site ayarları (telefon, email, adres, sosyal medya)

## Deployment

### Vercel

1. Vercel hesabınıza giriş yapın
2. Yeni proje oluşturun ve GitHub reposunu bağlayın
3. Environment variables ekleyin
4. Vercel Postgres veya Neon veritabanı oluşturun
5. Deploy edin

### Veritabanı Migrasyonu

Production ortamında:
```bash
npx prisma migrate deploy
npm run db:seed
```

## Lisans

Bu proje özel kullanım içindir.
