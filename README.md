# Web AI Assistant with Email Integration - AI Assistant Platform

 **Proiect Cloud Computing** 

---

## 📋 Cuprins

1. [Introducere](#introducere)
2. [Tehnologii folosite](#tehnologii-folosite)
3. [Arhitectura aplicației](#arhitectura-aplicatiei)
4. [Cerințe îndeplinite](#cerinte-indeplinite)
5. [Instrucțiuni de instalare](#instructiuni-de-instalare)
6. [Configurare variabile de mediu](#configurare-variabile-de-mediu)
7. [Rulare locală](#rulare-locala)
8. [Deploy pe Vercel](#deploy-pe-vercel)
9. [Structura proiectului](#structura-proiectului)
10. [API Endpoints](#api-endpoints)

---

## Introducere

**Web AI Assistant with Email Integration** este o aplicație web full-stack care demonstrează integrarea mai multor servicii cloud. Platforma oferă:

- **Autentificare securizată** cu persistență la refresh prin JWT
- **Asistent AI** bazat pe OpenAI GPT-3.5 cu stocare conversații
- **Serviciu email** prin Gmail SMTP (Nodemailer)
- **Bază de date cloud** MongoDB Atlas pentru persistența datelor

Aplicația este publicată pe **Vercel** și poate fi accesată la: 

---

## Tehnologii folosite

### Frontend
| Tehnologie | Versiune | Scop |
|---|---|---|
| **Next.js** | 14.2 | Framework React full-stack cu App Router |
| **TypeScript** | 5.x | Tipare statice pentru siguranță cod |
| **React** | 18.x | Biblioteca UI |

### Backend / API
| Tehnologie | Versiune | Scop |
|---|---|---|
| **Next.js API Routes** | 14.2 | Endpoint-uri REST server-side |
| **NextAuth.js** | 4.x | Autentificare JWT + sesiuni persistente |
| **bcryptjs** | 2.4 | Hash parole |

### Servicii Cloud

#### ☁️ Serviciu Cloud #1 - Email SMTP (Nodemailer + Gmail)
- **Provider**: Google Gmail cu App Passwords
- **Library**: `nodemailer`
- **Utilizare**: Email de bun venit la înregistrare + confirmare mesaje

#### ☁️ Serviciu Cloud #2 - OpenAI GPT-3.5
- **Provider**: OpenAI Platform
- **Library**: `openai` (SDK oficial)
- **Model**: `gpt-3.5-turbo`
- **Utilizare**: Asistent AI conversațional cu memorie

#### ☁️ Serviciu Cloud #3 - MongoDB Atlas (bază de date)
- **Provider**: MongoDB Atlas (Free Tier M0)
- **Library**: `mongoose`
- **Utilizare**: Utilizatori, sesiuni, istoric conversații

### Deployment
| Platformă | Scop |
|---|---|
| **Vercel** | Hosting aplicație Next.js (gratuit) |
| **MongoDB Atlas** | Bază de date cloud (Free Tier) |
| **GitHub** | Cod sursă + CI/CD automat cu Vercel |

---

## Arhitectura aplicației

```
Browser (Client)
        │
        ▼
   Next.js App (Vercel)
   ┌─────────────────────┐
   │  /app               │
   │  ├── page.tsx       │  ← Landing page
   │  ├── login/         │  ← Autentificare
   │  ├── register/      │  ← Înregistrare
   │  └── dashboard/     │  ← Zona protejată
   │      ├── page.tsx   │  ← Overview
   │      ├── chat/      │  ← AI Chat
   │      └── email/     │  ← Trimitere email
   │                     │
   │  /api               │
   │  ├── auth/          │  ← NextAuth + Register
   │  ├── chat/          │  ← OpenAI integration
   │  ├── contact/       │  ← Email service
   │  └── user/          │  ← Profil utilizator
   └─────────────────────┘
        │         │
        ▼         ▼
   OpenAI     Gmail SMTP
   GPT-3.5    (Nodemailer)
        │
        ▼
   MongoDB Atlas
   (Users + ChatHistory)
```

---

## Cerințe îndeplinite

| Cerință | Status | Detalii |
|---|---|---|
| Minim 2 servicii cloud | ✅ | OpenAI GPT-3.5 + Gmail SMTP |
| Autentificare + persistență refresh | ✅ | NextAuth JWT cu maxAge 30 zile |
| Cod sursă pe GitHub | ✅ | Repository public |
| Introducere & tehnologii | ✅ | Acest README |
| Video workflow YouTube | ✅ | Link:  |
| Capturi ecran aplicație | ✅ | Folder `printscreens` |
| Publicare Vercel | ✅ | Link:  |

---

## Instrucțiuni de instalare

### Prerechizite
- Node.js 18+ ([descarcă](https://nodejs.org/en/download/))
- Git ([descarcă](https://git-scm.com/downloads))
- Cont MongoDB Atlas ([creare](https://account.mongodb.com/account/login))
- Cont OpenAI ([creare](https://platform.openai.com/login))
- Gmail cu App Passwords activat

### Clonare repository

```bash
git clone https://github.com/[username]/simpre-2026.git
cd simpre-2026
npm install
```

---

## Configurare variabile de mediu

Completează `.env.local`:

```env
# MongoDB Atlas
MONGODB_URI=mongodb+srv://<user>:<password>@cluster0.xxxxx.mongodb.net/simpre2026

# NextAuth
NEXTAUTH_SECRET=string_random_minim_32_caractere
NEXTAUTH_URL=http://localhost:3000

# OpenAI
OPENAI_API_KEY=sk-proj-...

# Gmail SMTP
EMAIL_USER=adresa_ta@gmail.com
EMAIL_PASS=parola_aplicatie_16_caractere
```

### Cum obții fiecare cheie

**MongoDB URI:**
1. Loghează-te pe [cloud.mongodb.com](https://cloud.mongodb.com)
2. Cluster → Connect → Drivers → copiază URI

**NextAuth Secret:**
```bash
openssl rand -base64 32
```

**OpenAI API Key:**
1. [platform.openai.com/api-keys](https://platform.openai.com/api-keys)
2. Create new secret key

**Gmail App Password:**
1. [myaccount.google.com](https://myaccount.google.com) → Security
2. Activează 2-Step Verification
3. App passwords → Mail → Other → copiază parola de 16 caractere

---

## Rulare locală

```bash
npm run dev
```

Aplicația rulează pe [http://localhost:3000](http://localhost:3000).

**Flux testare:**
1. Accesează `http://localhost:3000`
2. Creează un cont nou (`/register`)
3. Verifică emailul de bun venit
4. Autentifică-te (`/login`)
5. Testează AI Chat (`/dashboard/chat`)
6. Trimite un email de test (`/dashboard/email`)
7. Dă refresh - sesiunea persistă

---

## Deploy pe Vercel

1. Push cod pe GitHub:
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/[username]/simpre-2026.git
git push -u origin main
```

2. Accesează [vercel.com](https://vercel.com) → New Project
3. Importă repository-ul de pe GitHub
4. Adaugă variabilele de mediu din `.env.local` în Vercel Dashboard
5. Deploy!

---

## Structura proiectului

```
simpre-2026/
├── app/
│   ├── api/
│   │   ├── auth/
│   │   │   ├── [...nextauth]/route.ts   # NextAuth config
│   │   │   └── register/route.ts        # Înregistrare + email bun venit
│   │   ├── chat/route.ts                # OpenAI GPT integration
│   │   ├── contact/route.ts             # Email SMTP service
│   │   └── user/route.ts               # Profil utilizator
│   ├── components/
│   │   └── SessionProvider.tsx          # NextAuth provider
│   ├── dashboard/
│   │   ├── chat/page.tsx               # Pagina AI Chat
│   │   ├── email/page.tsx              # Pagina Email
│   │   ├── DashboardClient.tsx         # Sidebar + navigare
│   │   ├── layout.tsx                  # Layout protejat
│   │   └── page.tsx                    # Dashboard overview
│   ├── login/page.tsx                   # Pagina login
│   ├── register/page.tsx                # Pagina înregistrare
│   ├── globals.css                      # Stiluri globale
│   ├── layout.tsx                       # Layout root
│   └── page.tsx                         # Landing page
├── lib/
│   └── mongodb.ts                       # Conexiune MongoDB cu caching
├── models/
│   └── User.ts                          # Schema Mongoose User
├── .env.example                         # Template variabile mediu
├── .gitignore
├── next.config.js
├── package.json
├── README.md
└── tsconfig.json
```

---

## API Endpoints

| Method | Endpoint | Auth | Descriere |
|---|---|---|---|
| `POST` | `/api/auth/register` | ❌ | Înregistrare utilizator + email bun venit |
| `POST` | `/api/auth/signin` | ❌ | Login (NextAuth) |
| `GET` | `/api/auth/session` | ❌ | Sesiune curentă (NextAuth) |
| `GET` | `/api/chat` | ✅ | Preia istoricul conversațiilor |
| `POST` | `/api/chat` | ✅ | Trimite mesaj la OpenAI + salvează în DB |
| `POST` | `/api/contact` | ✅ | Trimite email via SMTP |
| `GET` | `/api/user` | ✅ | Profil utilizator curent |

---

## 📸 Capturi ecran

> Adaugă capturi de ecran în `/docs/screenshots/` și referințiază-le aici.

- `landing.png` - Landing page
- `register.png` - Pagina de înregistrare
- `login.png` - Pagina de autentificare
- `dashboard.png` - Dashboard principal
- `chat.png` - AI Chat în acțiune
- `email.png` - Serviciu email

---

## 🎥 Video Demo

> YouTube link (Nelistat): 

---

