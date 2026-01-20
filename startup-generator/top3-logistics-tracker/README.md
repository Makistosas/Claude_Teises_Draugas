# 🚚 KROVINYS.LT - Krovinių Sekimo ir Pranešimų Sistema

## Tikslas: €3,000/mėn pasyvių pajamų

---

## 📋 TURINYS

1. [Produkto aprašymas](#produkto-aprašymas)
2. [Architektūra](#architektūra)
3. [Reikalavimai](#reikalavimai)
4. [Diegimas](#diegimas)
5. [Konfigūracija](#konfigūracija)
6. [Testavimas](#testavimas)
7. [Pardavimų strategija](#pardavimų-strategija)

---

## 🎯 PRODUKTO APRAŠYMAS

### Kas tai?
Web platforma logistikos įmonėms, leidžianti sekti krovinius ir automatiškai informuoti klientus apie krovinio būseną.

### Kam parduodame?
- Smulkios/vidutinės logistikos įmonės (5-50 vilkikų)
- Ekspedijavimo įmonės
- Sandėliavimo ir distribucijos centrai

### Problema (kodėl skaudi)
1. Klientai nuolat skambina/rašo "kur mano krovinys?"
2. Dispečeriai praleidžia 2-3 val./dieną atsakinėdami
3. Nėra automatinio informavimo - viskas rankiniu būdu
4. CMR ir važtaraščiai kuriami Word/Excel
5. Nėra aiškios krovinio istorijos

### Sprendimas
- Realaus laiko krovinio sekimas
- Automatiniai SMS/el. pašto pranešimai klientams
- CMR ir važtaraščių generavimas
- Dashboard dispečeriui
- Klientų portalas (matyt savo krovinius)

### Monetizacija
| Planas | Kaina | Funkcijos |
|--------|-------|-----------|
| Starter | €49/mėn | 10 vilkikų, SMS pranešimai |
| Growth | €99/mėn | 30 vilkikų, klientų portalas |
| Enterprise | €199/mėn | 50+ vilkikų, API, GPS integracija |

### Kelias iki €3,000/mėn
- 25 x Starter (€49) = €1,225
- 15 x Growth (€99) = €1,485
- 2 x Enterprise (€199) = €398
- **Viso: €3,108/mėn** (42 mokantys klientai)

---

## 🏗️ ARCHITEKTŪRA

```
┌─────────────────────────────────────────────────────────────┐
│                        KROVINYS.LT                          │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────┐     ┌─────────────┐     ┌─────────────┐   │
│  │   NGINX     │────▶│   FASTAPI   │────▶│  POSTGRES   │   │
│  │   (proxy)   │     │  (backend)  │     │    (DB)     │   │
│  └─────────────┘     └─────────────┘     └─────────────┘   │
│         │                   │                               │
│  ┌─────────────┐     ┌─────────────┐     ┌─────────────┐   │
│  │    REACT    │     │   CELERY    │     │    REDIS    │   │
│  │  (frontend) │     │  (workers)  │     │   (cache)   │   │
│  └─────────────┘     └─────────────┘     └─────────────┘   │
│                             │                               │
│              ┌──────────────┼──────────────┐               │
│              │              │              │               │
│       ┌──────┴──┐    ┌──────┴──┐    ┌─────┴─────┐         │
│       │   SMS   │    │  EMAIL  │    │    GPS    │         │
│       │ (Tele2) │    │  (SMTP) │    │(Trackers) │         │
│       └─────────┘    └─────────┘    └───────────┘         │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Pagrindiniai komponentai:
1. **FastAPI Backend** - API ir verslo logika
2. **React Frontend** - dispečerio dashboard
3. **Klientų portalas** - klientai mato savo krovinius
4. **PostgreSQL** - duomenų bazė
5. **Redis** - cache ir Celery
6. **SMS Gateway** - Tele2 arba SMS.lt
7. **GPS integracija** - Teltonika/kt.

---

## ⚙️ REIKALAVIMAI

### Prieš diegimą jums reikia:

| # | Kas | Kur gauti | Kaina |
|---|-----|-----------|-------|
| 1 | Serveris (VPS) | Hetzner | €10-20/mėn |
| 2 | Domenas | Hostinger | €10-15/metams |
| 3 | Paysera sąskaita | paysera.lt | Nemokama |
| 4 | SMTP (Brevo) | brevo.com | Free tier |
| 5 | SMS Gateway | sms.lt arba Tele2 | ~€0.03/SMS |

---

## 🚀 DIEGIMAS

### Viena komanda:

```bash
# Prisijunkite prie serverio
ssh root@JUSU_SERVERIO_IP

# Paleiskite diegimą
curl -sSL https://raw.githubusercontent.com/Makistosas/Claude_Teises_Draugas/main/startup-generator/top3-logistics-tracker/install.sh | bash
```

---

## 📝 KONFIGŪRACIJA (.env)

```env
# ========================================
# KROVINYS.LT KONFIGŪRACIJA
# ========================================

# --- PAGRINDINIAI ---
DOMAIN=krovinys.lt
SECRET_KEY=sugeneruokite-ilga-atsitiktine-eilute

# --- DUOMENŲ BAZĖ ---
POSTGRES_USER=krovinys
POSTGRES_PASSWORD=stiprus-slaptazodis
POSTGRES_DB=krovinys_db

# --- PAYSERA ---
PAYSERA_PROJECT_ID=123456
PAYSERA_SIGN_PASSWORD=jusu_sign_password

# --- EL. PAŠTAS ---
SMTP_HOST=smtp-relay.brevo.com
SMTP_PORT=587
SMTP_USER=jusu_email
SMTP_PASSWORD=jusu_smtp_key
EMAIL_FROM=info@krovinys.lt

# --- SMS GATEWAY ---
# SMS.lt: https://www.sms.lt/
SMS_PROVIDER=smslt
SMS_API_KEY=jusu_sms_api_key
SMS_SENDER=KROVINYS

# --- GPS INTEGRACIJA (OPTIONAL) ---
# Teltonika: https://teltonika-gps.com/
GPS_PROVIDER=teltonika
GPS_API_KEY=jusu_gps_api_key

# --- ADMIN ---
ADMIN_EMAIL=jusu@email.lt
ADMIN_PASSWORD=admin-slaptazodis
```

---

## ✅ TESTAVIMAS

### 10 testavimo scenarijų:

| # | Testas | Veiksmas | Tikėtinas rezultatas |
|---|--------|----------|---------------------|
| 1 | Registracija | Užsiregistruokite | Gaunate patvirtinimo laišką |
| 2 | Vilkiko pridėjimas | Pridėkite vilkiką | Vilkikas matomas sąraše |
| 3 | Vairuotojo pridėjimas | Pridėkite vairuotoją | Vairuotojas priskirtas vilkikui |
| 4 | Krovinio sukūrimas | Sukurkite krovinį | Krovinys su unikaliu numeriu |
| 5 | Statuso atnaujinimas | Pakeiskite statusą | Klientas gauna SMS |
| 6 | CMR generavimas | Sugeneruokite CMR | PDF dokumentas atsisiųstas |
| 7 | Klientų portalas | Klientas jungiasi | Mato savo krovinius |
| 8 | GPS atnaujinimas | Atnaujinamas GPS | Lokacija matoma žemėlapyje |
| 9 | Ataskaita | Generuokite ataskaitą | PDF su statistika |
| 10 | Prenumerata | Nupirkite Growth | Mokėjimas veikia |

---

## 💰 PARDAVIMŲ STRATEGIJA

### Pirmi 7 klientai per 30 dienų:

#### Savaitė 1-2: Tiesioginis kontaktavimas
```
1. Sudarykite sąrašą 50 logistikos įmonių Lietuvoje
   - Google: "logistikos įmonės Lietuva"
   - rekvizitai.lt kategorija "Krovinių pervežimas"

2. Skambinkite dispečeriams/vadovams:

   SKAMBUČIO SCENARIJUS:
   "Laba diena, [vardas]. Kalba [jūsų vardas] iš Krovinys.lt.

   Turiu klausimą - kiek laiko per dieną praleidžiate atsakinėdami
   klientams 'kur mano krovinys'?

   [Klausotės]

   Sukūriau sistemą, kuri automatiškai siunčia SMS klientams kai
   krovinio statusas pasikeičia. Dispečeriai sutaupo 2-3 val./dieną.

   Gal galėčiau parodyti 10 min demo?"

3. Tikslas: 3-5 demo per savaitę
```

#### Savaitė 2-3: Logistikos bendruomenės
```
1. Prisijunkite prie grupių:
   - "Lietuvos vežėjai" (Facebook)
   - "Transportas ir logistika" (LinkedIn)
   - LINAVA nariai

2. Dalinkitės vertingu turiniu:
   - "Kaip sumažinti klientų skambučius 70%"
   - "CMR pildymo klaidos ir kaip jų išvengti"
   - "GPS sekimo sistemos palyginimas"

3. Renginiuose:
   - Transport Week Vilnius
   - LINAVA renginiai
```

#### Savaitė 3-4: Partnerystės
```
1. Susisiekite su:
   - GPS įrangos tiekėjais (jie parduoda vežėjams)
   - Degalinių tinklais (partnerystės su vežėjais)
   - Draudimo bendrovėmis

2. Affiliate programa: 15-20% komisiniai
```

### Nuolatiniai kanalai:
- Google Ads "krovinių sekimas" (€50-100/mėn)
- LinkedIn Ads logistikos vadovams (€100/mėn)
- SEO: "krovinių sekimo sistema", "CMR generatorius"

---

## 🤖 AUTOMATIZAVIMO LYGIS

### Kas veikia automatiškai:

| Procesas | Automatizuota? |
|----------|----------------|
| Vartotojų registracija | ✅ 100% |
| Krovinio sukūrimas | ✅ 100% |
| SMS pranešimai | ✅ 100% |
| El. pašto pranešimai | ✅ 100% |
| GPS atnaujinimas | ✅ 100% |
| CMR generavimas | ✅ 100% |
| Mokėjimai | ✅ 100% |
| Ataskaitų generavimas | ✅ 100% |

### Kas reikalauja jūsų dėmesio:

| Užduotis | Dažnumas | Laikas |
|----------|----------|--------|
| Support | 3-5x/dieną | 30-60 min |
| Statistikos | 1x/dieną | 10 min |
| Marketingas | 2-3x/savaitę | 2 val |
| Naujos funkcijos | 2x/mėn | 4-8 val |

---

## 📁 FAILŲ STRUKTŪRA

```
top3-logistics-tracker/
├── docker-compose.yml
├── .env.example
├── install.sh
├── README.md
│
├── backend/
│   ├── Dockerfile
│   ├── requirements.txt
│   └── app/
│       ├── main.py
│       ├── models.py          # Company, Truck, Driver, Shipment, Location
│       ├── schemas.py
│       └── api/
│           ├── auth.py
│           ├── companies.py
│           ├── trucks.py
│           ├── drivers.py
│           ├── shipments.py
│           ├── tracking.py
│           └── documents.py
│
└── frontend/
    ├── Dockerfile
    └── src/
        └── pages/
            ├── Dashboard.js     # Dispečerio dashboard
            ├── Shipments.js     # Krovinių valdymas
            ├── Tracking.js      # GPS žemėlapis
            ├── Fleet.js         # Vilkikai ir vairuotojai
            └── Documents.js     # CMR, važtaraščiai
```

---

## 🔑 PAGRINDINIAI ENDPOINTS

```
# Autentifikacija
POST /api/auth/register
POST /api/auth/login

# Vilkikai
GET  /api/trucks
POST /api/trucks
PUT  /api/trucks/{id}/location

# Vairuotojai
GET  /api/drivers
POST /api/drivers

# Kroviniai
GET  /api/shipments
POST /api/shipments
PUT  /api/shipments/{id}/status
GET  /api/shipments/{id}/tracking

# Dokumentai
POST /api/documents/cmr/{shipment_id}
POST /api/documents/waybill/{shipment_id}

# Klientų portalas
GET  /api/portal/shipments (su kliento tokenu)
GET  /api/portal/tracking/{tracking_number}
```

---

## 📱 SMS PRANEŠIMŲ ŠABLONAI

```
# Krovinys pakrautas
"KROVINYS.LT: Jūsų krovinys #{tracking_number} pakrautas ir išvyko iš {origin}. Numatomas pristatymas: {eta}"

# Krovinys pakeliui
"KROVINYS.LT: Krovinys #{tracking_number} šiuo metu {location}. Liko ~{distance_km}km"

# Krovinys pristatytas
"KROVINYS.LT: Krovinys #{tracking_number} pristatytas į {destination}. Ačiū, kad pasirinkote mus!"

# Vėlavimas
"KROVINYS.LT: Krovinys #{tracking_number} vėluoja. Naujas numatomas laikas: {new_eta}. Atsiprašome už nepatogumus."
```

---

## 🗺️ GPS INTEGRACIJA

### Palaikomi GPS įrenginiai:
- Teltonika FMB/FMC serija
- Ruptela FM-Eco4
- Queclink GV-serija
- Universali API (bet kuris HTTP/MQTT įrenginys)

### Duomenų srautas:
```
GPS įrenginys → Serveris → Duomenų bazė → Dashboard
                    ↓
              SMS/Email klientui
```

---

## ❓ D.U.K.

**K: Ar veikia be GPS įrenginių?**
A: Taip, galite atnaujinti lokaciją rankiniu būdu arba per mobiliąją programėlę.

**K: Kiek kainuoja SMS?**
A: SMS.lt kainuoja ~€0.03/SMS. Su 50 krovinių/mėn ir 3 SMS/krovinį = ~€4.50/mėn.

**K: Ar galiu generuoti CMR skirtingomis kalbomis?**
A: Taip, palaikomos LT, EN, RU, PL, DE kalbos.

**K: Ar klientai gali patys sekti krovinius?**
A: Taip, Growth ir Enterprise planuose klientai gauna prieigą prie portalo.

---

## 🆘 PAGALBA

Jei kilo problemų:
1. Logai: `docker compose logs -f`
2. Restart: `docker compose restart`
3. Full restart: `docker compose down && docker compose up -d`
