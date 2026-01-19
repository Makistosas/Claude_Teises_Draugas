# Teisės draugas

AI pagalbininkas, kai teisininkas per brangus, o tylėti per skaudu.

Modern legal-tech landing website for a Lithuanian AI legal assistant. Built with Next.js 14, TypeScript, and Tailwind CSS.

![Teisės draugas](./public/icon.svg)

---

## ✨ Features

- **Chat-first design** – Chatlio widget as the primary interaction
- **Structured intake templates** – Quick-start chips for common legal scenarios
- **Copy-to-clipboard** – Templates copied with metadata for Slack triage
- **Dark, premium UI** – Navy/graphite palette with glass panels
- **Fully responsive** – Mobile-first with desktop auto-open chat
- **Lithuanian UI** – Native Lithuanian copy throughout
- **SEO optimized** – Metadata, OpenGraph, sitemap, robots.txt
- **Local-first development** – No cloud dependencies for MVP testing

---

## 🚀 Local Development (Recommended for MVP Testing)

### Prerequisites

- **Node.js** 18.17 or later (check with `node -v`)
- **npm** 9 or later (comes with Node.js)

### Setup

```bash
# 1. Clone the repository
git clone <your-repo-url>
cd teises-draugas

# 2. Install dependencies
npm install

# 3. Create local environment file
cp .env.example .env.local

# 4. Edit .env.local and add your Chatlio configuration (see below)

# 5. Start the development server
npm run dev

# 6. Open http://localhost:3000
```

### Environment Variables

Create `.env.local` in the project root:

```env
# Option A: Widget ID only (simplest)
NEXT_PUBLIC_CHATLIO_WIDGET_ID="your-widget-id-here"

# Option B: Full embed code (if you prefer)
# NEXT_PUBLIC_CHATLIO_EMBED_CODE='<script>...your chatlio script...</script>'
```

**Where to find your Chatlio Widget ID:**
1. Log into [Chatlio](https://chatlio.com)
2. Go to your widget settings
3. Click "Install"
4. Find `data-widget-id` in the script – that's your Widget ID

---

## 🔌 Chatlio Integration

### How It Works

1. The `ChatlioEmbed` component loads the Chatlio widget script
2. On desktop: chat auto-opens after 1.2 seconds (unless user interacted)
3. On mobile: shows a large "Pradėti pokalbį" button instead
4. All messages go to your Slack channel via Chatlio's integration

### Chatlio on Localhost

Chatlio generally works on localhost. If you encounter issues:

**Option A: Allowlist localhost (if Chatlio supports)**
- Check Chatlio widget settings for domain restrictions
- Add `localhost` and `localhost:3000` to allowed domains

**Option B: Local domain alias**
```bash
# Add to /etc/hosts (macOS/Linux) or C:\Windows\System32\drivers\etc\hosts (Windows)
127.0.0.1 teises-draugas.local

# Then access the site at http://teises-draugas.local:3000
```

**Option C: Placeholder mode**
- If `NEXT_PUBLIC_CHATLIO_WIDGET_ID` is not set, the app shows a helpful placeholder with setup instructions

### Without Chatlio (Preview Mode)

The app works without Chatlio for design/layout preview. You'll see a placeholder panel explaining where to add the widget code.

---

## 📋 How Intake Chips Work

### Overview

Intake chips are quick-start buttons that help users create structured messages. Since Chatlio doesn't have a prefill API, we use a **copy-to-clipboard** approach.

### User Flow

1. User clicks an intake chip (e.g., "Pretenzija")
2. Structured template is copied to clipboard
3. Toast notification: "Šablonas nukopijuotas – įklijuok į chatą"
4. Chatlio widget opens
5. User pastes template (Ctrl+V / Cmd+V) and fills in details
6. Message sent to Slack with structured format

### Template Structure

Each template includes:
- **Header tag** `[TD:TYPE]` for Slack triage
- **Structured fields** with placeholders
- **Auto-generated metadata** footer (path, timestamp, session ID)

Example copied message:
```
[TD:PRETENZIJA]

=== PRETENZIJOS ŠABLONAS ===

1. KAS JŪS ESATE?
   □ Fizinis asmuo / □ Juridinis asmuo
   Vardas/Pavadinimas: _______________
   ...

— meta: path=/, ts=2025-01-15T10:30:00Z, sid=abc123
```

### Editing Templates

Templates are defined in `lib/templates.ts`. To add or modify:

```typescript
// lib/templates.ts
export const intakeTemplates: IntakeTemplate[] = [
  {
    id: 'my-template',           // Unique ID
    header: '[TD:MY_TYPE]',      // Slack triage header
    title: 'Mano šablonas',      // Display title (Lithuanian)
    description: 'Aprašymas',    // Short description
    icon: 'FileText',            // Lucide icon name
    template: `[TD:MY_TYPE]

=== ŠABLONO PAVADINIMAS ===

1. PIRMAS LAUKAS
   _______________

2. ANTRAS LAUKAS
   _______________
`,
  },
];
```

Available icons: `FileWarning`, `FileSignature`, `Scale`, `Receipt` (add more to `components/IntakeChips.tsx` icon mapping).

---

## 📁 Project Structure

```
teises-draugas/
├── app/
│   ├── layout.tsx          # Root layout with Inter font
│   ├── page.tsx            # Main landing page
│   ├── globals.css         # Tailwind + custom styles
│   ├── sitemap.ts          # Dynamic sitemap
│   ├── robots.ts           # Robots.txt
│   ├── privacy/
│   │   └── page.tsx        # Privacy policy (Lithuanian)
│   └── terms/
│       └── page.tsx        # Terms of service (Lithuanian)
├── components/
│   ├── ChatlioEmbed.tsx    # Chatlio widget loader
│   ├── Toast.tsx           # Toast notification system
│   ├── IntakeChips.tsx     # Quick-start template buttons
│   ├── Hero.tsx            # Hero section with chat panel
│   ├── HowItWorks.tsx      # 3-step process section
│   ├── Features.tsx        # What you can do section
│   ├── Examples.tsx        # Example outputs carousel
│   ├── Trust.tsx           # Privacy & security section
│   ├── FAQ.tsx             # Frequently asked questions
│   └── Footer.tsx          # Site footer
├── lib/
│   ├── utils.ts            # Utility functions
│   └── templates.ts        # Intake template definitions
├── public/
│   ├── icon.svg            # Favicon/app icon
│   └── site.webmanifest    # PWA manifest
├── .env.example            # Environment variable template
├── .env.local              # Local environment (git-ignored)
├── next.config.js          # Next.js configuration
├── tailwind.config.ts      # Tailwind configuration
├── tsconfig.json           # TypeScript configuration
└── package.json            # Dependencies
```

---

## 🧪 Testing Intake Templates End-to-End

1. **Start the dev server**: `npm run dev`
2. **Open browser console** (F12 → Console tab)
3. **Click an intake chip** – you should see:
   - Console log: `[TD:intake-chip-clicked] { templateId: "pretenzija" }`
   - Console log: `[TD:template-copied] { templateId: "pretenzija" }`
   - Toast: "Šablonas nukopijuotas – įklijuok į chatą"
4. **Check clipboard** – paste somewhere to verify the template
5. **If Chatlio is configured**, widget should open
6. **Paste into Chatlio** and send
7. **Check Slack** – message should appear with `[TD:PRETENZIJA]` header

---

## ✅ Confirming Messages Arrive in Slack

1. Configure Chatlio → Slack integration in Chatlio dashboard
2. Send a test message through the Chatlio widget
3. Check your Slack channel for the message
4. Messages with `[TD:...]` headers are from intake templates

Slack message format:
```
[TD:PRETENZIJA]
... user's filled template ...
— meta: path=/, ts=2025-01-15T10:30:00Z, sid=abc123
```

---

## 🛠 Common Local Issues & Fixes

### "Cannot find module" errors
```bash
rm -rf node_modules .next
npm install
npm run dev
```

### Chatlio not loading
- Check browser console for errors
- Verify `NEXT_PUBLIC_CHATLIO_WIDGET_ID` is set in `.env.local`
- Restart dev server after changing env vars

### Styles not updating
```bash
# Force rebuild
rm -rf .next
npm run dev
```

### Port 3000 already in use
```bash
# Use a different port
npm run dev -- -p 3001
```

---

## 🚢 Deploy to Vercel

When ready for production:

```bash
# 1. Push to GitHub
git push origin main

# 2. Go to vercel.com and import your repository

# 3. Add environment variables in Vercel dashboard:
#    - NEXT_PUBLIC_CHATLIO_WIDGET_ID=your-widget-id
#    - NEXT_PUBLIC_BASE_URL=https://your-domain.com

# 4. Deploy!
```

Or use Vercel CLI:
```bash
npm i -g vercel
vercel
```

---

## 📝 Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |

---

## 🔒 Security Notes

- No user registration or authentication
- No custom backend – all messages through Chatlio → Slack
- No sensitive data stored server-side
- Client-side session ID in localStorage (anonymous)
- HTTPS enforced in production

---

## 📄 License

Private project. All rights reserved.

---

## 🆘 Support

For issues or questions, check the Chatlio/Slack channel or contact the development team.
