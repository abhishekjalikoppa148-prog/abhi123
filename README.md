# 🎂 CelebrationCraft — Birthday Website SaaS Platform

[![Next.js](https://img.shields.io/badge/Next.js-16.3.1-black?logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2.8-blue?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?logo=supabase&logoColor=white)](https://supabase.com/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-v4-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-Proprietary-red)](#)

A premium, full-featured commercial SaaS platform that lets anyone craft stunning, personalized birthday experience websites with AI-generated wishes, background music, interactive photo galleries, 3D interactive cakes, countdown timers, memory timelines, and custom links. Powered by **Supabase PostgreSQL, Supabase Auth, and Supabase Storage**.

---

## 🏛️ Central Architecture & Deployment Flow

```text
                             ┌──────────────────────────────────┐
                             │        GitHub Repository         │
                             │ https://github.com/.../repo.git  │
                             └────────────────┬─────────────────┘
                                              │
                    ┌─────────────────────────┼─────────────────────────┐
                    │                         │                         │
                    ↓                         ↓                         ↓
          ┌───────────────────┐     ┌───────────────────┐     ┌───────────────────┐
          │    Antigravity    │     │     Windsurf      │     │      VS Code      │
          │    IDE / Agent    │     │    Cascade IDE    │     │   Desktop / Web   │
          └─────────┬─────────┘     └─────────┬─────────┘     └─────────┬─────────┘
                    │                         │                         │
                    └─────────────────────────┼─────────────────────────┘
                                              ↓
                                        git push origin main
                                              │
                                              ↓
                                      ┌───────────────┐
                                      │    GitHub     │
                                      └───────┬───────┘
                                              │
                                              ↓ (Automatic CI / CD Deploy)
                                      ┌───────────────┐
                                      │    Vercel     │
                                      └───────┬───────┘
                                              │
                     ┌────────────────────────┼────────────────────────┐
                     │                        │                        │
                     ▼                        ▼                        ▼
              ┌──────────────┐         ┌──────────────┐         ┌──────────────┐
              │ Supabase DB  │         │Supabase Auth │         │   Supabase   │
              │ (PostgreSQL) │         │(Cookie / SSR)│         │   Storage    │
              └──────────────┘         └──────────────┘         └──────────────┘
                     │
                     ├─────────────────► OpenAI API (Message Generation)
                     ├─────────────────► Razorpay (Order Creation & Webhooks)
                     └─────────────────► Resend (Transactional Emails)
```

> [!IMPORTANT]
> **Environment Isolation Rule:**
> GitHub stores source code, components, API routes, database schemas, and documentation. **Secrets (`.env.local`, Supabase keys, Razorpay secrets, OpenAI tokens) are NEVER committed to GitHub.** Each environment maintains its own isolated `.env.local` or Vercel Environment Variables.

---

## ✨ Features & Capabilities

### 🎨 Creative Builder Experience
- **Interactive Multi-Step Builder:** Live split-screen real-time preview of birthday websites.
- **8+ Designer Themes:** Pink Gold luxury theme, Neon Cyberpunk, Pastel Bloom, Sunset Glow, Starry Night, Golden Elegance, Minimal Monochrome, and Retro Arcade.
- **AI Birthday Wish Generator:** Personalized wishes tailored by tone (emotional, funny, romantic, inspirational, friendship) powered by OpenAI GPT-3.5.
- **Interactive 3D Cake & Candle Blowing:** Blow interactive candles with confetti explosions and sound effects.
- **Surprise Gift Box Opening:** Animated 3D gift box with personalized reveal messages.
- **Dynamic Background Music Player:** Floating music visualizer with audio tracks and mute controls.
- **Photo Gallery & Memory Timeline:** Drag-and-drop memory timeline with dates, milestones, and captions.
- **Real-time Birthday Countdown:** Timezone-aware countdown clock for the birthday date.
- **Instant QR Code & Social Sharing:** One-click WhatsApp, Instagram, X/Twitter, and QR code sharing.

### 💼 Business & Monetization
- **Tiered Pricing Plans:** Free (3 websites/day), Premium (₹499), and Ultimate (₹999) with automated limit enforcement.
- **Razorpay Secure Checkout:** UPI (GPay, PhonePe, Paytm, Cred), Credit/Debit cards, and Netbanking support.
- **Automated Webhooks & Verification:** SHA-256 HMAC signature verification with idempotency.
- **Invoices & Billing History:** Downloadable invoice generation with order tracking.
- **Visitor Analytics:** Live visitor counter, device breakdowns, and conversion funnel analytics.
- **Role-Based Admin Portal:** Complete user management, revenue stats, website monitoring, and system metrics.

### 🔒 Enterprise Security & Row Level Security
- **Server-Side Authentication:** Secure HTTP-only JWT session cookies (`cc_session`) with bcrypt password hashing (12 salt rounds) & Supabase Auth.
- **Row Level Security (RLS):** Supabase PostgreSQL RLS policies ensuring users only access their own websites, media, orders, and analytics.
- **IDOR Protection:** Strict ownership verification on all resource modification APIs.
- **Rate Limiting:** Sliding-window rate limiter protecting auth, AI generation, and payment endpoints.
- **Input Sanitization:** Deep recursive XSS and SQL injection sanitization.
- **Security Headers:** Automatic `X-Content-Type-Options`, `X-Frame-Options`, `X-XSS-Protection`, and `Referrer-Policy`.

---

## 🛠️ Tech Stack

| Layer | Technologies |
| :--- | :--- |
| **Framework** | [Next.js 16 (App Router & Turbopack)](https://nextjs.org/) |
| **Language** | [TypeScript 5](https://www.typescriptlang.org/) |
| **UI Library** | [React 19](https://react.dev/) |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com/) with Luxury Glassmorphism Design System |
| **Icons & FX** | [Lucide React](https://lucide.dev/), [Canvas Confetti](https://www.npmjs.com/package/canvas-confetti) |
| **Database** | [Supabase PostgreSQL](https://supabase.com/) via `@supabase/supabase-js` with Row Level Security |
| **Authentication** | Supabase Auth + JWT + `bcryptjs` + HTTP-only cookies |
| **Storage** | [Supabase Storage](https://supabase.com/storage) (`website-media` & `profile-images` buckets) |
| **Payments** | [Razorpay SDK](https://razorpay.com/) (Orders, Verification, Webhooks) |
| **AI Engine** | [OpenAI API](https://platform.openai.com/) (GPT-3.5 Turbo) |
| **Email Delivery** | [Resend](https://resend.com/) API |
| **Deployment** | [Vercel](https://vercel.com/) |

---

## 🚀 Getting Started

### 1. Prerequisites
- **Node.js**: v18.18.0 or higher (v20+ recommended)
- **npm**: v9+ (or yarn / pnpm)
- **Supabase Project**: Free tier or self-hosted Supabase instance
- **Git**: 2.30+

### 2. Clone the Repository
```bash
git clone https://github.com/YOUR_USERNAME/celebrationcraft.git
cd celebrationcraft
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Configure Environment Variables
Copy the `.env.example` template to `.env.local`:
```bash
cp .env.example .env.local
```

Edit `.env.local` with your Supabase credentials:
```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-anon-key
SUPABASE_SECRET_KEY=your-service-role-secret-key

# Auth & Security
JWT_SECRET=your_super_secret_jwt_key_min_32_chars
AUTH_SECRET=your_auth_secret

# OpenAI (For AI birthday wishes)
OPENAI_API_KEY=sk-...
OPENAI_MODEL=gpt-3.5-turbo

# Razorpay (For payments)
RAZORPAY_KEY_ID=rzp_test_...
RAZORPAY_KEY_SECRET=your_secret
RAZORPAY_WEBHOOK_SECRET=your_webhook_secret

# Email
RESEND_API_KEY=re_...
EMAIL_FROM=noreply@celebrationcraft.com

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 5. Apply Database Schema & Migrations
In the [Supabase Dashboard](https://supabase.com/dashboard) -> **SQL Editor**, execute the migration file:
`supabase/migrations/001_initial_schema.sql`

Or seed test accounts with:
```bash
node scripts/seed-supabase.mjs
```
Default seeded accounts:
- **Demo User:** `test@example.com` / `Password@123`
- **Admin User:** `admin@celebrationcraft.com` / `Admin@123`

### 6. Run the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🧪 Testing & Verification

Run the automated API test suite:
```bash
# Start dev server first:
npm run dev

# Run automated test suite:
node scripts/test-all-apis.mjs
```

Typecheck and production build verification:
```bash
npm run build
```

---

## 📡 API Reference Overview

| Endpoint | Method | Description | Auth Required |
| :--- | :--- | :--- | :---: |
| `/api/auth/signup` | `POST` | Register a new user | ❌ |
| `/api/auth/login` | `POST` | Authenticate and issue HttpOnly JWT session | ❌ |
| `/api/auth/me` | `GET`, `PUT`, `DELETE` | Get, update, or delete authenticated user profile | ✅ |
| `/api/auth/logout` | `POST` | Clear session cookie | ✅ |
| `/api/auth/forgot-password` | `POST` | Request password reset email | ❌ |
| `/api/auth/reset-password` | `POST` | Reset password using verified token | ❌ |
| `/api/websites` | `GET`, `POST` | List and create birthday websites | ✅ |
| `/api/websites/[id]` | `GET`, `PATCH`, `DELETE` | Retrieve, update, or delete a website | Optional / ✅ |
| `/api/websites/duplicate` | `POST` | Duplicate an existing birthday website | ✅ |
| `/api/websites/versions` | `GET`, `POST` | Snapshot and view website version history | ✅ |
| `/api/upload` | `POST` | Upload media to Supabase Storage | ✅ |
| `/api/ai/generate` | `POST` | Generate AI birthday wish with OpenAI | ✅ |
| `/api/ai/credits` | `GET`, `POST` | Check and deduct AI usage credits | ✅ |
| `/api/payment/create-order` | `POST` | Create Razorpay order | ✅ |
| `/api/payment/verify` | `POST` | Verify Razorpay payment signature & activate plan | ✅ |
| `/api/payment/webhook` | `POST` | Razorpay webhook endpoint (HMAC SHA-256) | ❌ (Header signature) |
| `/api/analytics/track` | `POST` | Record page view and interaction metrics | ❌ |
| `/api/analytics/website` | `GET` | Fetch visitor analytics breakdown | Optional |
| `/api/analytics/funnel` | `GET`, `POST` | Track and analyze conversion funnels | Optional |
| `/api/admin/stats` | `GET` | Retrieve platform revenue and activity metrics | ✅ (Admin only) |
| `/api/admin/users` | `GET` | View registered user list | ✅ (Admin only) |
| `/api/admin/websites` | `GET` | View all platform websites | ✅ (Admin only) |
| `/api/admin/orders` | `GET` | View all customer orders | ✅ (Admin only) |
| `/api/coupons` | `POST`, `PUT` | Validate and apply discount coupons | Optional |
| `/api/referrals` | `GET`, `POST` | Referral code management and credit rewards | Optional |
| `/api/cron/check-expiration` | `GET`, `POST` | Process subscription expirations & grace periods | Optional (Cron key) |

---

## 🚢 Deploying to Vercel

1. Push your code to GitHub:
   ```bash
   git push origin main
   ```
2. In the [Vercel Dashboard](https://vercel.com/), click **"Add New Project"** and import `celebrationcraft`.
3. Configure the **Environment Variables** in Vercel project settings:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
   - `SUPABASE_SECRET_KEY`
   - `JWT_SECRET`, `AUTH_SECRET`
   - `OPENAI_API_KEY`
   - `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`, `RAZORPAY_WEBHOOK_SECRET`
   - `RESEND_API_KEY`, `EMAIL_FROM`
   - `NEXT_PUBLIC_APP_URL` (e.g., `https://celebrationcraft.com`)
4. Click **Deploy**. Vercel will automatically build and deploy every push to `main`.

---

## 📄 License

Proprietary Software. All rights reserved © 2026 CelebrationCraft.
