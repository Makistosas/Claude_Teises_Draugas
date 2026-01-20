# 🧾 SASKAITA.LT - Automatinis sąskaitų faktūrų generatorius

## Tikslas: €3,000/mėn pasyvių pajamų

---

## 📋 TURINYS

1. [Produkto aprašymas](#produkto-aprašymas)
2. [Architektūra](#architektūra)
3. [Reikalavimai](#reikalavimai-ką-turite-paruošti)
4. [Diegimas - viena komanda](#diegimas)
5. [Konfigūracija](#konfigūracija)
6. [Testavimas](#testavimas)
7. [Monitoringas](#monitoringas)
8. [Pardavimų strategija](#pardavimų-strategija)
9. [Automatizavimo lygis](#automatizavimo-lygis)

---

## 🎯 PRODUKTO APRAŠYMAS

### Kas tai?
Web aplikacija, leidžianti Lietuvos įmonėms per 30 sekundžių sukurti profesionalią sąskaitą faktūrą, nusiųsti ją el. paštu ir sekti apmokėjimą.

### Kam parduodame?
- Smulkios įmonės (MB, IĮ, UAB iki 10 žmonių)
- Freelanceriai
- Statybos rangovai
- Ūkininkai
- Paslaugų teikėjai

### Problema (kodėl skaudi)
1. Sąskaitos kuriamos Word/Excel - užtrunka 10-15 min
2. Numeracija chaotiška, painiojasi
3. PVM skaičiavimai klaidingi
4. Sąskaitos siunčiamos rankiniu būdu
5. Nėra apmokėjimo sekimo

### Sprendimas
- Sąskaita per 30 sekundžių
- Automatinis numeravimas (SF-2024-001, SF-2024-002...)
- PVM skaičiuojamas automatiškai
- PDF generavimas ir siuntimas el. paštu
- Apmokėjimų sekimas ir priminimai
- Dashboard su statistika

### Monetizacija
| Planas | Kaina | Funkcijos |
|--------|-------|-----------|
| Free | €0 | 5 sąskaitos/mėn, PDF |
| Starter | €19/mėn | 50 sąskaitų, el. paštas, priminimai |
| Pro | €39/mėn | Neribota, API, reports |
| Business | €79/mėn | Multi-user, bank integration |

### Kelias iki €3,000/mėn
- 50 x Starter (€19) = €950
- 40 x Pro (€39) = €1,560
- 6 x Business (€79) = €474
- **Viso: €2,984/mėn** (96 mokantys klientai)

---

## 🏗️ ARCHITEKTŪRA

```
┌─────────────────────────────────────────────────────────────┐
│                        SASKAITA.LT                          │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────┐     ┌─────────────┐     ┌─────────────┐   │
│  │   NGINX     │────▶│   FASTAPI   │────▶│  POSTGRES   │   │
│  │   (proxy)   │     │  (backend)  │     │    (DB)     │   │
│  └─────────────┘     └─────────────┘     └─────────────┘   │
│         │                   │                   │           │
│         │                   │                   │           │
│  ┌─────────────┐     ┌─────────────┐     ┌─────────────┐   │
│  │    REACT    │     │   CELERY    │     │    REDIS    │   │
│  │  (frontend) │     │  (workers)  │     │   (cache)   │   │
│  └─────────────┘     └─────────────┘     └─────────────┘   │
│                             │                               │
│                      ┌──────┴──────┐                       │
│                      │             │                       │
│               ┌──────┴──┐    ┌─────┴─────┐                 │
│               │ PAYSERA │    │   SMTP    │                 │
│               │(mokėjimai)│   │(el.paštas)│                 │
│               └─────────┘    └───────────┘                 │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Komponentai:
1. **NGINX** - reverse proxy, SSL, static failai
2. **FastAPI** - Python backend API
3. **React** - frontend SPA
4. **PostgreSQL** - duomenų bazė
5. **Redis** - cache ir Celery broker
6. **Celery** - background tasks (PDF, emails)
7. **Paysera** - mokėjimai (subscription)
8. **SMTP** - el. laiškų siuntimas

---

## ⚙️ REIKALAVIMAI (KĄ TURITE PARUOŠTI)

### Prieš diegimą jums reikia:

| # | Kas | Kur gauti | Apytikslė kaina |
|---|-----|-----------|-----------------|
| 1 | **Serveris (VPS)** | DigitalOcean, Hetzner | €5-20/mėn |
| 2 | **Domenas** | Hostinger, Vardai.lt | €10-15/metams |
| 3 | **Paysera verslo sąskaita** | paysera.lt | Nemokama |
| 4 | **SMTP el. paštas** | Mailgun, Brevo | Free tier |
| 5 | **SSL sertifikatas** | Let's Encrypt | Nemokama (automatiškai) |

### Konkretūs žingsniai:

#### 1. Serveris (rekomenduoju Hetzner)
```
1. Eikite į https://www.hetzner.com/cloud
2. Sukurkite paskyrą
3. Sukurkite naują serverį:
   - Location: Germany (artimiausias)
   - Image: Ubuntu 22.04
   - Type: CX21 (2 vCPU, 4GB RAM) - €5.85/mėn
4. Išsaugokite IP adresą ir root slaptažodį
```

#### 2. Domenas
```
1. Eikite į https://www.hostinger.lt/domenai
2. Ieškokite "saskaita.lt" arba panašaus
3. Nupirkite (€10-15/metams)
4. Nustatykite DNS:
   - A record: @ -> jūsų serverio IP
   - A record: www -> jūsų serverio IP
```

#### 3. Paysera verslo sąskaita
```
1. Eikite į https://www.paysera.lt
2. Sukurkite verslo sąskaitą
3. Aktyvuokite mokėjimų priėmimą
4. Gaukite API raktus (Settings -> API)
```

#### 4. SMTP (Brevo - buvęs Sendinblue)
```
1. Eikite į https://www.brevo.com
2. Sukurkite nemokamą paskyrą
3. Gaukite SMTP credentials (Settings -> SMTP)
4. Free tier: 300 el. laiškų/dieną
```

---

## 🚀 DIEGIMAS

### Viena komanda serveryje:

```bash
# 1. Prisijunkite prie serverio
ssh root@JUSU_SERVERIO_IP

# 2. Paleiskite diegimo skriptą (VIENA KOMANDA!)
curl -sSL https://raw.githubusercontent.com/Makistosas/Claude_Teises_Draugas/main/startup-generator/top1-invoice-automation/install.sh | bash
```

### Arba rankiniu būdu:

```bash
# 1. Prisijunkite prie serverio
ssh root@JUSU_SERVERIO_IP

# 2. Atnaujinkite sistemą
apt update && apt upgrade -y

# 3. Įdiekite Docker
curl -fsSL https://get.docker.com | bash

# 4. Įdiekite Docker Compose
apt install docker-compose-plugin -y

# 5. Klonuokite projektą
git clone https://github.com/Makistosas/Claude_Teises_Draugas.git /opt/saskaita
cd /opt/saskaita/startup-generator/top1-invoice-automation

# 6. Sukonfigūruokite .env failą
cp .env.example .env
nano .env  # Įrašykite savo duomenis

# 7. Paleiskite viską
docker compose up -d

# 8. Patikrinkite ar veikia
docker compose ps
```

---

## 📝 KONFIGŪRACIJA

### .env failo pavyzdys:

```env
# ========================================
# SASKAITA.LT KONFIGŪRACIJA
# ========================================

# --- PAGRINDINIAI ---
DOMAIN=saskaita.lt
SECRET_KEY=sugeneruokite-ilgą-atsitiktinę-eilutę-čia

# --- DUOMENŲ BAZĖ ---
POSTGRES_USER=saskaita
POSTGRES_PASSWORD=stiprus-slaptazodis-123
POSTGRES_DB=saskaita_db

# --- PAYSERA MOKĖJIMAI ---
PAYSERA_PROJECT_ID=123456
PAYSERA_SIGN_PASSWORD=jusu_sign_password
PAYSERA_TEST_MODE=false

# --- EL. PAŠTAS (SMTP) ---
SMTP_HOST=smtp-relay.brevo.com
SMTP_PORT=587
SMTP_USER=jusu-brevo-email
SMTP_PASSWORD=jusu-brevo-smtp-key
EMAIL_FROM=info@saskaita.lt

# --- ADMINISTRAVIMAS ---
ADMIN_EMAIL=jusu@email.lt
ADMIN_PASSWORD=admin-slaptazodis

# --- KAINODARA (centais) ---
PRICE_STARTER=1900
PRICE_PRO=3900
PRICE_BUSINESS=7900
```

### Ką įrašyti:

| Laukas | Paaiškinimas | Pavyzdys |
|--------|--------------|----------|
| DOMAIN | Jūsų domenas | saskaita.lt |
| SECRET_KEY | Atsitiktinė eilutė (32+ simboliai) | abc123xyz789... |
| POSTGRES_PASSWORD | Duomenų bazės slaptažodis | ManoSlaptas123! |
| PAYSERA_PROJECT_ID | Iš Paysera Settings | 123456 |
| PAYSERA_SIGN_PASSWORD | Iš Paysera API | xyzabc123 |
| SMTP_USER | Brevo el. paštas | jonas@gmail.com |
| SMTP_PASSWORD | Brevo SMTP raktas | xkeysib-abc123 |
| ADMIN_EMAIL | Jūsų admin el. paštas | jonas@gmail.com |
| ADMIN_PASSWORD | Admin slaptažodis | Admin123! |

---

## ✅ TESTAVIMAS

### 10 testavimo scenarijų:

| # | Testas | Veiksmas | Tikėtinas rezultatas |
|---|--------|----------|---------------------|
| 1 | Registracija | Užsiregistruokite su el. paštu | Gaunate patvirtinimo laišką |
| 2 | Prisijungimas | Prisijunkite su sukurta paskyra | Matote dashboard |
| 3 | Įmonės kūrimas | Sukurkite įmonę su rekvizitais | Įmonė išsaugota |
| 4 | Kliento pridėjimas | Pridėkite naują klientą | Klientas matomas sąraše |
| 5 | Sąskaitos kūrimas | Sukurkite sąskaitą su 2 eilutėmis | PVM paskaičiuotas teisingai |
| 6 | PDF generavimas | Atsisiųskite PDF | Profesionalus PDF failas |
| 7 | Siuntimas el. paštu | Išsiųskite sąskaitą klientui | Klientas gauna laišką |
| 8 | Pažymėjimas apmokėta | Pažymėkite sąskaitą kaip apmokėtą | Statusas pasikeičia |
| 9 | Prenumeratos pirkimas | Nupirkite Starter planą | Paysera mokėjimas veikia |
| 10 | Ataskaita | Sugeneruokite mėnesio ataskaitą | PDF su visomis sąskaitomis |

### Automatinis testavimas:

```bash
# Serveryje paleiskite:
docker compose exec backend pytest tests/ -v
```

---

## 📊 MONITORINGAS

### Kaip matyti, kad viskas veikia:

#### 1. Sveikatos patikrinimas (Health Check)
```bash
# Naršyklėje arba curl:
curl https://saskaita.lt/api/health

# Tikėtinas atsakymas:
{"status": "healthy", "database": "ok", "redis": "ok"}
```

#### 2. Docker logai
```bash
# Visi logai:
docker compose logs -f

# Tik backend:
docker compose logs -f backend

# Tik errors:
docker compose logs -f | grep ERROR
```

#### 3. Statistikos dashboard
```
https://saskaita.lt/admin

Prisijunkite su ADMIN_EMAIL ir ADMIN_PASSWORD
```

#### 4. Uptime monitoringas (nemokamas)
```
1. Eikite į https://uptimerobot.com
2. Sukurkite nemokamą paskyrą
3. Pridėkite monitorių:
   - Type: HTTPS
   - URL: https://saskaita.lt/api/health
   - Interval: 5 min
4. Gausite el. laišką jei sistema "nukris"
```

---

## 💰 PARDAVIMŲ STRATEGIJA

### Pirmi 7 klientai per 30 dienų:

#### Savaitė 1: Pasiruošimas (1-2 dienos)
```
1. Sukurkite Facebook puslapį "Saskaita.lt"
2. Sukurkite LinkedIn profilį/puslapį
3. Paruoškite 3 testimonialus (galite naudoti savo įmonę)
4. Sukurkite demo video (5 min) su Loom
```

#### Savaitė 1-2: Tiesioginiai kontaktai
```
Tikslas: 3 klientai

1. Parašykite 20 pažįstamų verslininkų

   ŽINUTĖS ŠABLONAS:
   "Sveiki [Vardas],

   Sukūriau įrankį, kuris leidžia išrašyti sąskaitas faktūras per 30 sek
   (vietoj 10-15 min Word'e).

   Pirmi 3 mėnesiai NEMOKAMAI jums kaip [draugui/kolegai/pažįstamam].

   Gal norėtumėte išbandyti? Štai demo: [nuoroda]

   [Jūsų vardas]"

2. Pasiūlykite 3 mėn. nemokamą PRO planą
3. Prašykite atsiliepimu mainais
```

#### Savaitė 2-3: Facebook grupės
```
Tikslas: 2 klientai

1. Prisijunkite prie grupių:
   - "Smulkus verslas Lietuvoje"
   - "Freelanceriai Lietuvoje"
   - "Buhalteriai Lietuvoje"
   - "Individualios veiklos" (IV)
   - "MB ir mažos įmonės"

2. NEREKLAMUOKITE tiesiogiai!

3. Strategija:
   a) Atsakinėkite į klausimus apie sąskaitas
   b) Po 5-10 naudingų komentarų, padarykite postą:

   "Sukūriau nemokamą įrankį sąskaitoms faktūroms kurti.
   Pats naudoju savo verslui ir pagalvojau - gal kam nors pravers.
   5 sąskaitos per mėnesį - visiškai nemokamai.
   [nuoroda]

   P.S. Jei turite pasiūlymų ką patobulinti - rašykite!"
```

#### Savaitė 3-4: LinkedIn
```
Tikslas: 2 klientai

1. Publikuokite post'ą:
   "Prieš mėnesį pradėjau kurti savo sąskaitas Word'e.
   Supratau, kad tai užima 15 min kiekvienai.

   Sukūriau paprastą įrankį - dabar sąskaita užtrunka 30 sek.

   Gal kam nors irgi pravers? [nuoroda]

   #smulkusverslas #saskaitos #lietuvosverslas"

2. Parašykite 10 MB/IĮ vadovams tiesiogiai
```

#### Nuolatinis kanalų valdymas:
```
1. Google Ads (€50/mėn budžetas)
   - Raktažodžiai: "sąskaitos faktūros programa", "nemokama sąskaitų programa"

2. SEO straipsniai (1 per savaitę):
   - "Kaip teisingai išrašyti sąskaitą faktūrą"
   - "PVM sąskaitos faktūros pavyzdys"
   - "Sąskaitų faktūrų numeracija"
```

---

## 🤖 AUTOMATIZAVIMO LYGIS

### Kas veikia automatiškai (be jūsų):

| Procesas | Automatizuota? | Aprašymas |
|----------|----------------|-----------|
| Vartotojų registracija | ✅ 100% | Self-service |
| Sąskaitų kūrimas | ✅ 100% | Vartotojas daro pats |
| PDF generavimas | ✅ 100% | Automatinis |
| El. laiškų siuntimas | ✅ 100% | Automatinis |
| Mokėjimų priėmimas | ✅ 100% | Paysera webhook |
| Prenumeratų valdymas | ✅ 100% | Automatinis |
| Priminimų siuntimas | ✅ 100% | Celery cron |
| SSL atnaujinimas | ✅ 100% | Let's Encrypt auto |
| DB backup | ✅ 100% | Cron job |

### Kas reikalauja jūsų dėmesio:

| Užduotis | Dažnumas | Laikas |
|----------|----------|--------|
| Atsakyti į support el. laiškus | 1-3x/dieną | 15-30 min/dieną |
| Patikrinti statistikas | 1x/dieną | 5 min |
| Atnaujinti sistemą | 1x/mėn | 30 min |
| Marketingas (posts, ads) | 2-3x/savaitę | 1-2 val/savaitę |

### Kaip dar labiau automatizuoti:

1. **Support chatbotas** - pridėkite Intercom/Crisp su FAQ
2. **Automatiniai atsakymai** - sukurkite el. laiškų šablonus
3. **Outsource marketingą** - samdykite VA (€200-300/mėn)

---

## 📁 FAILŲ STRUKTŪRA

```
top1-invoice-automation/
├── docker-compose.yml      # Viso projekto paleidimas
├── .env.example            # Konfigūracijos šablonas
├── install.sh              # Automatinis diegimas
├── README.md               # Šis failas
│
├── backend/                # Python FastAPI
│   ├── Dockerfile
│   ├── requirements.txt
│   ├── app/
│   │   ├── main.py
│   │   ├── models.py
│   │   ├── schemas.py
│   │   ├── api/
│   │   ├── services/
│   │   └── templates/
│   └── tests/
│
├── frontend/               # React aplikacija
│   ├── Dockerfile
│   ├── package.json
│   └── src/
│
└── nginx/                  # Reverse proxy
    ├── nginx.conf
    └── ssl/
```

---

## ❓ D.U.K.

**K: Ar tai legalu Lietuvoje?**
A: Taip, elektroninės sąskaitos faktūros yra legalios. Sistema atitinka VMI reikalavimus.

**K: Kas bus jei serveris "nukris"?**
A: UptimeRobot atsiųs jums pranešimą. Paprastai reikia tiesiog paleisti `docker compose up -d`.

**K: Kiek kainuos palaikyti?**
A: Serveris ~€10/mėn, domenas ~€15/metams, SMTP free tier. Viso: ~€12/mėn.

**K: Ar galiu pridėti naujų funkcijų?**
A: Taip, bet reikės programuotojo. Galite samdyti freelancerį (~€30-50/val).

---

## 🆘 PAGALBA

Jei kilo problemų:
1. Patikrinkite logus: `docker compose logs -f`
2. Perkraukite: `docker compose restart`
3. Pilnas restart: `docker compose down && docker compose up -d`
