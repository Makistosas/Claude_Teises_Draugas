#!/bin/bash

# ============================================================
# SASKAITA.LT - AUTOMATINIS DIEGIMO SKRIPTAS
# ============================================================
#
# Naudojimas:
# curl -sSL https://raw.githubusercontent.com/Makistosas/Claude_Teises_Draugas/main/startup-generator/top1-invoice-automation/install.sh | bash
#
# Arba:
# chmod +x install.sh && ./install.sh
#
# ============================================================

set -e

# Spalvos
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Funkcijos
print_header() {
    echo ""
    echo -e "${BLUE}============================================================${NC}"
    echo -e "${BLUE}$1${NC}"
    echo -e "${BLUE}============================================================${NC}"
    echo ""
}

print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

# Pradžia
clear
print_header "🧾 SASKAITA.LT - AUTOMATINIS DIEGIMAS"

echo "Šis skriptas automatiškai įdiegs Saskaita.lt sistemą."
echo ""
echo "Reikalavimai:"
echo "  - Ubuntu 20.04+ arba Debian 11+"
echo "  - Root prieiga"
echo "  - Interneto ryšys"
echo ""

# Patikrinti ar root
if [ "$EUID" -ne 0 ]; then
    print_error "Paleiskite su root teisėmis: sudo ./install.sh"
    exit 1
fi

print_success "Root prieiga patvirtinta"

# ============================================================
# 1. SISTEMOS ATNAUJINIMAS
# ============================================================
print_header "1/7 - Sistemos atnaujinimas"

apt update && apt upgrade -y
print_success "Sistema atnaujinta"

# ============================================================
# 2. DOCKER DIEGIMAS
# ============================================================
print_header "2/7 - Docker diegimas"

if command -v docker &> /dev/null; then
    print_warning "Docker jau įdiegtas, praleidžiama..."
else
    curl -fsSL https://get.docker.com | bash
    print_success "Docker įdiegtas"
fi

# Docker Compose
if command -v docker compose &> /dev/null; then
    print_warning "Docker Compose jau įdiegtas"
else
    apt install docker-compose-plugin -y
    print_success "Docker Compose įdiegtas"
fi

# ============================================================
# 3. PROJEKTO KLNONAVIMAS
# ============================================================
print_header "3/7 - Projekto atsisiuntimas"

INSTALL_DIR="/opt/saskaita"

if [ -d "$INSTALL_DIR" ]; then
    print_warning "Katalogas $INSTALL_DIR jau egzistuoja"
    read -p "Ištrinti ir įdiegti iš naujo? (y/n): " confirm
    if [ "$confirm" = "y" ]; then
        rm -rf $INSTALL_DIR
    else
        print_error "Diegimas nutrauktas"
        exit 1
    fi
fi

git clone https://github.com/Makistosas/Claude_Teises_Draugas.git $INSTALL_DIR
cd $INSTALL_DIR/startup-generator/top1-invoice-automation

print_success "Projektas atsisiųstas į $INSTALL_DIR"

# ============================================================
# 4. KONFIGŪRACIJA
# ============================================================
print_header "4/7 - Konfigūracija"

# Kopijuoti .env
cp .env.example .env

echo ""
echo "Dabar reikia sukonfigūruoti sistemą."
echo "Atsakykite į klausimus:"
echo ""

# Domenas
read -p "Įveskite savo domeną (pvz., saskaita.lt): " DOMAIN
sed -i "s/DOMAIN=saskaita.lt/DOMAIN=$DOMAIN/" .env

# Secret key
SECRET_KEY=$(openssl rand -hex 32)
sed -i "s/SECRET_KEY=PAKEISKITE_I_ATSITIKTINI_ILGA_TEKSTA_32_SIMBOLIAI/SECRET_KEY=$SECRET_KEY/" .env

# Postgres password
POSTGRES_PASSWORD=$(openssl rand -base64 24 | tr -d '/+=' | head -c 24)
sed -i "s/POSTGRES_PASSWORD=PAKEISKITE_I_STIPRU_SLAPTAZODI/POSTGRES_PASSWORD=$POSTGRES_PASSWORD/" .env

# Admin email
read -p "Įveskite admin el. paštą: " ADMIN_EMAIL
sed -i "s/ADMIN_EMAIL=jusu_email@gmail.com/ADMIN_EMAIL=$ADMIN_EMAIL/" .env

# Admin password
read -s -p "Įveskite admin slaptažodį: " ADMIN_PASSWORD
echo ""
sed -i "s/ADMIN_PASSWORD=ADMIN_SLAPTAZODIS_123/ADMIN_PASSWORD=$ADMIN_PASSWORD/" .env

# SMTP
echo ""
echo "SMTP konfigūracija (el. pašto siuntimui):"
read -p "SMTP Host (pvz., smtp-relay.brevo.com): " SMTP_HOST
read -p "SMTP User (el. paštas): " SMTP_USER
read -s -p "SMTP Password (API raktas): " SMTP_PASSWORD
echo ""

sed -i "s/SMTP_HOST=smtp-relay.brevo.com/SMTP_HOST=$SMTP_HOST/" .env
sed -i "s/SMTP_USER=jusu_email@gmail.com/SMTP_USER=$SMTP_USER/" .env
sed -i "s/SMTP_PASSWORD=xkeysib-xxxxxxxxxx/SMTP_PASSWORD=$SMTP_PASSWORD/" .env
sed -i "s/EMAIL_FROM=info@saskaita.lt/EMAIL_FROM=info@$DOMAIN/" .env

# Paysera
echo ""
echo "Paysera konfigūracija (galite palikti tuščia ir užpildyti vėliau):"
read -p "Paysera Project ID: " PAYSERA_PROJECT_ID
read -p "Paysera Sign Password: " PAYSERA_SIGN_PASSWORD

if [ ! -z "$PAYSERA_PROJECT_ID" ]; then
    sed -i "s/PAYSERA_PROJECT_ID=123456/PAYSERA_PROJECT_ID=$PAYSERA_PROJECT_ID/" .env
fi
if [ ! -z "$PAYSERA_SIGN_PASSWORD" ]; then
    sed -i "s/PAYSERA_SIGN_PASSWORD=jusu_paysera_sign_password/PAYSERA_SIGN_PASSWORD=$PAYSERA_SIGN_PASSWORD/" .env
fi

print_success "Konfigūracija išsaugota"

# ============================================================
# 5. SSL SERTIFIKATAS
# ============================================================
print_header "5/7 - SSL sertifikato generavimas"

# Sukurti nginx pradini konfiga be SSL
mkdir -p nginx certbot/conf certbot/www

# Laikinas nginx config
cat > nginx/nginx.conf << 'NGINX_TEMP'
events {
    worker_connections 1024;
}

http {
    server {
        listen 80;
        server_name _;

        location /.well-known/acme-challenge/ {
            root /var/www/certbot;
        }

        location / {
            return 301 https://$host$request_uri;
        }
    }
}
NGINX_TEMP

# Paleisti nginx laikinai
docker compose up -d nginx

# Gauti SSL
docker compose run --rm certbot certonly \
    --webroot \
    --webroot-path=/var/www/certbot \
    --email $ADMIN_EMAIL \
    --agree-tos \
    --no-eff-email \
    -d $DOMAIN \
    -d www.$DOMAIN || {
        print_warning "SSL generavimas nepavyko. Tęsiame be SSL (galėsite pridėti vėliau)"
    }

print_success "SSL konfigūracija baigta"

# ============================================================
# 6. PILNO NGINX KONFIGŪRACIJOS SUKŪRIMAS
# ============================================================
print_header "6/7 - Nginx konfigūracija"

cat > nginx/nginx.conf << NGINX_FULL
events {
    worker_connections 1024;
}

http {
    include       /etc/nginx/mime.types;
    default_type  application/octet-stream;

    # Logging
    access_log /var/log/nginx/access.log;
    error_log /var/log/nginx/error.log;

    # Gzip
    gzip on;
    gzip_types text/plain text/css application/json application/javascript;

    # Rate limiting
    limit_req_zone \$binary_remote_addr zone=api:10m rate=10r/s;

    # HTTP -> HTTPS redirect
    server {
        listen 80;
        server_name $DOMAIN www.$DOMAIN;

        location /.well-known/acme-challenge/ {
            root /var/www/certbot;
        }

        location / {
            return 301 https://\$host\$request_uri;
        }
    }

    # HTTPS server
    server {
        listen 443 ssl http2;
        server_name $DOMAIN www.$DOMAIN;

        # SSL
        ssl_certificate /etc/letsencrypt/live/$DOMAIN/fullchain.pem;
        ssl_certificate_key /etc/letsencrypt/live/$DOMAIN/privkey.pem;
        ssl_protocols TLSv1.2 TLSv1.3;
        ssl_ciphers HIGH:!aNULL:!MD5;

        # Security headers
        add_header X-Frame-Options "SAMEORIGIN" always;
        add_header X-Content-Type-Options "nosniff" always;
        add_header X-XSS-Protection "1; mode=block" always;

        # Frontend (React)
        location / {
            root /usr/share/nginx/html;
            index index.html;
            try_files \$uri \$uri/ /index.html;
        }

        # API (FastAPI)
        location /api {
            limit_req zone=api burst=20 nodelay;

            proxy_pass http://backend:8000;
            proxy_http_version 1.1;
            proxy_set_header Upgrade \$http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host \$host;
            proxy_set_header X-Real-IP \$remote_addr;
            proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto \$scheme;
            proxy_cache_bypass \$http_upgrade;
        }

        # Static files
        location /static {
            alias /usr/share/nginx/html/static;
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
    }
}
NGINX_FULL

print_success "Nginx sukonfigūruotas"

# ============================================================
# 7. PALEIDIMAS
# ============================================================
print_header "7/7 - Sistemos paleidimas"

# Sustabdyti laikiną nginx
docker compose down

# Paleisti viską
docker compose up -d

# Palaukti kol pakils
echo "Laukiama kol sistema pasikels..."
sleep 30

# Patikrinti
if docker compose ps | grep -q "healthy\|running"; then
    print_success "Sistema paleista sėkmingai!"
else
    print_error "Kažkas nepavyko. Patikrinkite logus: docker compose logs -f"
fi

# ============================================================
# PABAIGA
# ============================================================
print_header "✅ DIEGIMAS BAIGTAS!"

echo ""
echo "Jūsų Saskaita.lt sistema įdiegta!"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📍 Adresas:     https://$DOMAIN"
echo "👤 Admin:       $ADMIN_EMAIL"
echo "🔑 Slaptažodis: (kurį nurodėte)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Naudingos komandos:"
echo "  Peržiūrėti logus:     cd $INSTALL_DIR/startup-generator/top1-invoice-automation && docker compose logs -f"
echo "  Perkrauti sistemą:    docker compose restart"
echo "  Sustabdyti:           docker compose down"
echo "  Paleisti:             docker compose up -d"
echo ""
echo "Konfigūracijos failas: $INSTALL_DIR/startup-generator/top1-invoice-automation/.env"
echo ""
print_success "Sėkmės su Saskaita.lt! 🚀"
