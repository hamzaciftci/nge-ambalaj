# NGE Ambalaj - VPS Deployment Kılavuzu

Bu kılavuz, projeyi sh.com.tr veya herhangi bir VPS/dedicated sunucuda deploy etmek için hazırlanmıştır.

## Gereksinimler

- Ubuntu 22.04+ veya benzeri Linux dağıtımı
- Docker ve Docker Compose
- Nginx (reverse proxy için)
- SSL sertifikası (Let's Encrypt)

---

## Adım 1: Sunucu Kurulumu

SSH ile sunucuya bağlanın:

```bash
ssh root@sunucu-ip-adresi
```

### Docker Kurulumu

```bash
# Güncellemeler
apt update && apt upgrade -y

# Docker kurulumu
curl -fsSL https://get.docker.com | sh

# Docker Compose kurulumu
apt install docker-compose-plugin -y

# Docker'ı başlat
systemctl enable docker
systemctl start docker
```

### Nginx Kurulumu

```bash
apt install nginx -y
systemctl enable nginx
```

---

## Adım 2: Projeyi Sunucuya Yükleyin

### Seçenek A: Git ile

```bash
cd /opt
git clone https://github.com/hamzaciftci/nge-ambalaj.git
cd nge-ambalaj
```

### Seçenek B: SCP/SFTP ile

Lokal makinenizden:
```bash
scp -r ./nge-ambalaj root@sunucu-ip:/opt/
```

---

## Adım 3: Environment Variables

```bash
cd /opt/nge-ambalaj

# .env dosyası oluştur
cat > .env << 'EOF'
# Neon PostgreSQL (mevcut veritabanınız)
STORAGE_POSTGRES_PRISMA_URL="postgresql://neondb_owner:npg_7ylWhZbJ9AxB@ep-twilight-block-agsh91n3-pooler.c-2.eu-central-1.aws.neon.tech/neondb?connect_timeout=15&sslmode=require"
STORAGE_DATABASE_URL_UNPOOLED="postgresql://neondb_owner:npg_7ylWhZbJ9AxB@ep-twilight-block-agsh91n3.c-2.eu-central-1.aws.neon.tech/neondb?sslmode=require"

# Site URL (kendi domain'iniz)
NEXT_PUBLIC_SITE_URL="https://sh.com.tr"

# Blob Storage (opsiyonel - Vercel Blob kullanmaya devam edebilirsiniz)
BLOB_READ_WRITE_TOKEN="vercel_blob_rw_xxxxx"
EOF
```

---

## Adım 4: Docker ile Build ve Run

```bash
cd /opt/nge-ambalaj

# Build
docker compose build

# Başlat
docker compose up -d

# Logları kontrol et
docker compose logs -f
```

---

## Adım 5: Nginx Reverse Proxy

```bash
# Nginx config dosyası oluştur
cat > /etc/nginx/sites-available/nge-ambalaj << 'EOF'
server {
    listen 80;
    server_name sh.com.tr www.sh.com.tr;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 86400;
    }
}
EOF

# Symlink oluştur
ln -s /etc/nginx/sites-available/nge-ambalaj /etc/nginx/sites-enabled/

# Default config'i kaldır (opsiyonel)
rm /etc/nginx/sites-enabled/default

# Nginx'i test et ve yeniden başlat
nginx -t
systemctl reload nginx
```

---

## Adım 6: SSL Sertifikası (Let's Encrypt)

```bash
# Certbot kurulumu
apt install certbot python3-certbot-nginx -y

# SSL sertifikası al
certbot --nginx -d sh.com.tr -d www.sh.com.tr

# Otomatik yenileme (cron job otomatik eklenir)
certbot renew --dry-run
```

---

## Yönetim Komutları

```bash
# Durumu kontrol et
docker compose ps

# Logları görüntüle
docker compose logs -f

# Yeniden başlat
docker compose restart

# Durdur
docker compose down

# Güncelleme için (git pull sonrası)
docker compose build --no-cache
docker compose up -d
```

---

## Veritabanı Seçenekleri

### Seçenek 1: Neon'u Kullanmaya Devam Et (Önerilen)
- Mevcut Neon veritabanınız Avrupa'da (eu-central-1)
- Latency düşük olacaktır
- Ek kurulum gerekmez

### Seçenek 2: Yerel PostgreSQL
Docker Compose dosyasındaki `db` servisini aktif edip kullanabilirsiniz.

```bash
# docker-compose.yml içinde db servisini uncomment edin
# Sonra:
docker compose up -d

# Prisma migration'ları çalıştırın
docker compose exec app npx prisma db push
```

---

## Sorun Giderme

### Container başlamıyor
```bash
docker compose logs app
```

### Port 3000 kullanımda
```bash
lsof -i :3000
kill -9 <PID>
```

### Nginx 502 Bad Gateway
```bash
# Container çalışıyor mu kontrol et
docker compose ps

# Container'ı yeniden başlat
docker compose restart
```

---

## Güvenlik Önerileri

1. **Firewall aktif et:**
```bash
ufw allow ssh
ufw allow http
ufw allow https
ufw enable
```

2. **SSH key authentication kullan** (password yerine)

3. **Fail2ban kur:**
```bash
apt install fail2ban -y
systemctl enable fail2ban
```

4. **Düzenli güncelleme:**
```bash
apt update && apt upgrade -y
```
