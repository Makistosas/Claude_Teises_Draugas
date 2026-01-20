# 👥 ONBOARD.LT - HR Darbuotojų Onboarding Automatizacija

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
Web platforma, automatizuojanti naujo darbuotojo "įvedimo" procesą - nuo dokumentų pasirašymo iki mokymų užbaigimo.

### Kam parduodame?
- Lietuvos įmonės su 20-200 darbuotojų
- Aktyviai samdančios įmonės (IT, gamyba, paslaugos)
- HR vadovai ir personalo specialistai

### Problema (kodėl skaudi)
1. Naujo darbuotojo "onboarding" užtrunka 2-4 valandas HR laiko
2. Dokumentų pasirašymas - popierius arba chaotiški el. laiškai
3. Mokymai nestruktūrizuoti, dažnai pamiršti
4. Naujas darbuotojas jaučiasi paliktas vienas
5. Nėra aiškaus proceso - kiekvienas vadovas daro savaip

### Sprendimas
- Automatiniai checklistai naujam darbuotojui
- Elektroninis dokumentų pasirašymas (darbo sutartis, NDA, kt.)
- Mokymų moduliai su progreso sekimu
- Automatiniai el. laiškai ir priminimai
- Dashboard HR ir vadovams

### Monetizacija
| Planas | Kaina | Funkcijos |
|--------|-------|-----------|
| Starter | €49/mėn | 5 onboardingai/mėn, baziniai checklistai |
| Growth | €99/mėn | 20 onboardingų, el. parašas, mokymai |
| Enterprise | €199/mėn | Neribota, API, custom workflow |

### Kelias iki €3,000/mėn
- 20 x Starter (€49) = €980
- 15 x Growth (€99) = €1,485
- 3 x Enterprise (€199) = €597
- **Viso: €3,062/mėn** (38 mokantys klientai)

---

## 🏗️ ARCHITEKTŪRA

```
┌─────────────────────────────────────────────────────────────┐
│                        ONBOARD.LT                           │
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
│                      ┌──────┴──────┐                       │
│               ┌──────┴──┐    ┌─────┴─────┐                 │
│               │ DOCUSIGN│    │   SMTP    │                 │
│               │(e-parašas)│   │(el.paštas)│                 │
│               └─────────┘    └───────────┘                 │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Pagrindiniai komponentai:
1. **FastAPI Backend** - API ir verslo logika
2. **React Frontend** - vartotojo sąsaja
3. **PostgreSQL** - duomenų bazė
4. **Redis** - cache ir Celery broker
5. **Celery** - background tasks
6. **DocuSign/Dokobit** - el. parašo integracija
7. **SMTP** - el. laiškų siuntimas

---

## ⚙️ REIKALAVIMAI

### Prieš diegimą jums reikia:

| # | Kas | Kur gauti | Kaina |
|---|-----|-----------|-------|
| 1 | Serveris (VPS) | Hetzner | €10-20/mėn |
| 2 | Domenas | Hostinger | €10-15/metams |
| 3 | Paysera sąskaita | paysera.lt | Nemokama |
| 4 | SMTP (Brevo) | brevo.com | Free tier |
| 5 | Dokobit (el. parašas) | dokobit.lt | Nuo €0.50/parašas |

---

## 🚀 DIEGIMAS

### Viena komanda:

```bash
# Prisijunkite prie serverio
ssh root@JUSU_SERVERIO_IP

# Paleiskite diegimą
curl -sSL https://raw.githubusercontent.com/Makistosas/Claude_Teises_Draugas/main/startup-generator/top2-hr-onboarding/install.sh | bash
```

---

## 📝 KONFIGŪRACIJA (.env)

```env
# ========================================
# ONBOARD.LT KONFIGŪRACIJA
# ========================================

# --- PAGRINDINIAI ---
DOMAIN=onboard.lt
SECRET_KEY=sugeneruokite-ilga-atsitiktine-eilute

# --- DUOMENŲ BAZĖ ---
POSTGRES_USER=onboard
POSTGRES_PASSWORD=stiprus-slaptazodis
POSTGRES_DB=onboard_db

# --- PAYSERA ---
PAYSERA_PROJECT_ID=123456
PAYSERA_SIGN_PASSWORD=jusu_sign_password

# --- EL. PAŠTAS ---
SMTP_HOST=smtp-relay.brevo.com
SMTP_PORT=587
SMTP_USER=jusu_email
SMTP_PASSWORD=jusu_smtp_key
EMAIL_FROM=info@onboard.lt

# --- DOKOBIT (EL. PARAŠAS) ---
DOKOBIT_ACCESS_TOKEN=jusu_dokobit_token

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
| 2 | Įmonės kūrimas | Sukurkite įmonę | Įmonė matoma dashboard |
| 3 | Onboarding šablono kūrimas | Sukurkite checklistą | Šablonas išsaugotas |
| 4 | Naujo darbuotojo pridėjimas | Pridėkite darbuotoją | Darbuotojas gauna kvietimą |
| 5 | Darbuotojo prisijungimas | Darbuotojas jungiasi | Mato savo checklistą |
| 6 | Užduoties pažymėjimas | Pažymi užduotį | Progresas atnaujintas |
| 7 | Dokumento pasirašymas | Pasirašo dokumentą | El. parašas veikia |
| 8 | Mokymų užbaigimas | Baigia mokymą | Sertifikatas generuojamas |
| 9 | HR ataskaita | Generuoja ataskaitą | PDF su statistika |
| 10 | Prenumeratos pirkimas | Perka Growth | Mokėjimas veikia |

---

## 💰 PARDAVIMŲ STRATEGIJA

### Pirmi 7 klientai per 30 dienų:

#### Savaitė 1-2: LinkedIn kampanija
```
1. Optimizuokite LinkedIn profilį (HR/People Operations focus)

2. Rašykite HR vadovams tiesiogiai:

   ŽINUTĖS ŠABLONAS:
   "Sveiki [Vardas],

   Pamačiau, kad [Įmonės pavadinimas] aktyviai plečiasi - sveikinu!

   Sukūriau įrankį, kuris automatizuoja naujo darbuotojo "onboarding" procesą:
   - Dokumentų el. pasirašymas
   - Automatiniai checklistai
   - Mokymų sekimas

   HR sutaupo 2-3 val. kiekvienam naujam darbuotojui.

   Gal galėčiau parodyti 15 min demo?

   [Jūsų vardas]"

3. Siųskite 10-15 žinučių per dieną
4. Tikslas: 2-3 demo per savaitę
```

#### Savaitė 2-3: HR grupės ir bendruomenės
```
1. Prisijunkite prie grupių:
   - "HR Lietuva" (LinkedIn)
   - "Personalo specialistai" (Facebook)
   - "Žmogiškųjų išteklių profesionalai"

2. Dalinkitės vertingu turiniu:
   - "5 klaidos, kurias daro įmonės naujo darbuotojo pirmą dieną"
   - "Onboarding checklist šablonas (nemokamai)"
   - "Kaip sumažinti naujo darbuotojo išėjimą per pirmus 3 mėn."

3. Po 1-2 savaičių aktyvumo - subtili reklama
```

#### Savaitė 3-4: Partnerystės
```
1. Susisiekite su:
   - Buhalterijos paslaugų įmonėmis
   - HR konsultantais
   - Įdarbinimo agentūromis

2. Pasiūlykite affiliate programą (20% komisiniai)

3. Dalyvaukite HR renginiuose Lietuvoje
```

### Nuolatiniai kanalai:
- LinkedIn Ads (€100-200/mėn)
- Google Ads "hr software lietuva" (€50-100/mėn)
- SEO straipsniai ("onboarding procesas", "darbuotojo adaptacija")

---

## 🤖 AUTOMATIZAVIMO LYGIS

### Kas veikia automatiškai:

| Procesas | Automatizuota? |
|----------|----------------|
| Vartotojų registracija | ✅ 100% |
| Onboarding pradžia | ✅ 100% |
| El. laiškų siuntimas | ✅ 100% |
| Dokumento siuntimas pasirašyti | ✅ 100% |
| Progreso sekimas | ✅ 100% |
| Priminimai | ✅ 100% |
| Mokėjimai | ✅ 100% |
| Ataskaitų generavimas | ✅ 100% |

### Kas reikalauja jūsų dėmesio:

| Užduotis | Dažnumas | Laikas |
|----------|----------|--------|
| Support el. laiškai | 2-5x/dieną | 30-60 min |
| Statistikų peržiūra | 1x/dieną | 10 min |
| Marketingas | 3-4x/savaitę | 2-3 val |
| Produkto atnaujinimai | 1-2x/mėn | 2-4 val |

---

## 📁 FAILŲ STRUKTŪRA

```
top2-hr-onboarding/
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
│       ├── models.py          # User, Company, Employee, Task, Document
│       ├── schemas.py
│       └── api/
│           ├── auth.py
│           ├── companies.py
│           ├── employees.py
│           ├── onboarding.py
│           ├── documents.py
│           └── training.py
│
└── frontend/
    ├── Dockerfile
    └── src/
        └── pages/
            ├── Dashboard.js
            ├── Employees.js
            ├── Onboarding.js
            ├── Templates.js
            └── Training.js
```

---

## 🔑 PAGRINDINIAI ENDPOINTS

```
# Autentifikacija
POST /api/auth/register
POST /api/auth/login

# Įmonės
GET  /api/companies
POST /api/companies

# Darbuotojai
GET  /api/employees
POST /api/employees
GET  /api/employees/{id}/onboarding

# Onboarding
GET  /api/onboarding/templates
POST /api/onboarding/templates
POST /api/onboarding/start/{employee_id}
PUT  /api/onboarding/tasks/{task_id}/complete

# Dokumentai
POST /api/documents/send-for-signature
GET  /api/documents/{id}/status

# Mokymai
GET  /api/training/modules
POST /api/training/complete/{module_id}
```

---

## ❓ D.U.K.

**K: Ar el. parašas teisėtas Lietuvoje?**
A: Taip, Dokobit atitinka eIDAS reglamentą ir yra pripažįstamas Lietuvoje.

**K: Ar galiu integruoti su esamomis HR sistemomis?**
A: Enterprise plane teikiame API prieigą integracijoms.

**K: Kiek kainuoja el. parašas?**
A: Dokobit kainuoja ~€0.50 už parašą. Su 20 darbuotojų/mėn - ~€10/mėn.

---

## 🆘 PAGALBA

Jei kilo problemų:
1. Logai: `docker compose logs -f`
2. Restart: `docker compose restart`
3. Full restart: `docker compose down && docker compose up -d`
