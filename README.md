# 🎂 CelebrationCraft — Birthday Website SaaS Platform

[![Next.js](https://img.shields.io/badge/Next.js-16.3.1-black?logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2.8-blue?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript)](https://www.typescriptlang.org/)
[![MySQL](https://img.shields.io/badge/MySQL-8.0+-4479A1?logo=mysql&logoColor=white)](https://www.mysql.com/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-v4-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-Proprietary-red)](#)

A premium, full-featured commercial SaaS platform that lets anyone craft stunning, personalized birthday experience websites with AI-generated wishes, background music, interactive photo galleries, 3D interactive cakes, countdown timers, memory timelines, and custom links.

---

## 🏛️ Central Architecture & Single Source of Truth

GitHub serves as the **single central source of truth** for CelebrationCraft across all development environments, IDEs, and hosting platforms.

```text
                             ┌──────────────────────────────────┐
                             │        GitHub Repository         │
                             │ https://github.com/.../repo.git │
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
                                              ↓
                                  🌍 Production SaaS Platform
```

> [!IMPORTANT]
> **Environment Isolation Rule:**
> GitHub stores source code, components, API routes, database schemas, and documentation. **Secrets (`.env.local`, API keys, DB passwords, Razorpay secrets, OpenAI tokens) are NEVER committed to GitHub.** Each environment maintains its own isolated `.env.local` or Vercel Environment Variables.

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

### 🔒 Enterprise Security
- **Server-Side Authentication:** Secure HTTP-only JWT session cookies (`cc_session`) with bcrypt password hashing (12 salt rounds).
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
| **Database** | [MySQL 8.0+](https://www.mysql.com/) via `mysql2` with connection pooling |
| **Authentication** | Custom JWT (`jsonwebtoken`) + `bcryptjs` + HTTP-only cookies |
| **Payments** | [Razorpay SDK](https://razorpay.com/) (Orders, Verification, Webhooks) |
| **AI Engine** | [OpenAI API](https://platform.openai.com/) (GPT-3.5 Turbo) |
| **Email Delivery** | [Resend](https://resend.com/) / [SendGrid](https://sendgrid.com/) API |
| **Storage** | AWS S3 / Cloudflare R2 object storage (`@aws-sdk/client-s3`) |
| **Deployment** | [Vercel](https://vercel.com/) |

---

## 🚀 Getting Started

### 1. Prerequisites
- **Node.js**: v18.18.0 or higher (v20+ recommended)
- **npm**: v9+ (or yarn / pnpm)
- **MySQL**: 8.0+ server running locally or hosted (PlanetScale, Aiven, AWS RDS, Railway)
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

Edit `.env.local` with your local credentials:
```env
# Database
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_local_password
DB_NAME=birthday_saas

# Auth & Security
AUTH_SECRET=your_super_secret_jwt_key_min_32_chars
JWT_SECRET=your_super_secret_jwt_key_min_32_chars

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

### 5. Initialize the Database
Run the automated schema and database setup script:
```bash
node scripts/init-db.mjs
```
This executes `schema.sql`, creating tables (`users`, `birthday_websites`, `photo_memories`, `orders`, `analytics`, `password_reset_tokens`, `ai_usage`, `coupons`), indexes, and seeding default test accounts:
- **Demo User:** `test@example.com` / `Password@123`
- **Admin User:** `admin@example.com` / `Password@123`

### 6. Run the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🧪 Testing & Verification

Run the full automated end-to-end API test suite (verifies Auth, CRUD, Limits, AI, Payments, and Admin):
```bash
# Start dev server first in terminal 1:
npm run dev

# Run automated test suite in terminal 2:
node scripts/test-all-apis.mjs
```

Typecheck and production build verification:
```bash
# TypeScript type check
npx tsc --noEmit

# Production build
npm run build
```

---

## 🔄 Universal Cross-IDE Git Workflow

To collaborate seamlessly across **Antigravity**, **Windsurf**, **VS Code**, and **multiple computers**, adhere to this single standard workflow:

### A. Daily Workflow Routine
1. **Always pull before starting work:**
   ```bash
   git pull origin main
   ```
2. **Make your code edits and verify:**
   ```bash
   git status
   npm run build
   ```
3. **Stage and commit with clear, descriptive messages:**
   ```bash
   git add .
   git commit -m "Add responsive layout for celebration countdown"
   ```
4. **Push your changes to GitHub:**
   ```bash
   git push origin main
   ```

### B. Setting Up on a New Machine / IDE
```bash
# 1. Clone the central repository
git clone https://github.com/YOUR_USERNAME/celebrationcraft.git
cd celebrationcraft

# 2. Install dependencies
npm install

# 3. Create your local secrets (from .env.example)
cp .env.example .env.local

# 4. Start coding
npm run dev
```

### C. Commit Message Guidelines
Use clear, imperative commit messages:
- ✅ `Add AI birthday message tone customization`
- ✅ `Fix Razorpay webhook signature verification`
- ✅ `Improve mobile responsiveness for photo gallery`
- ❌ `update`, `changes`, `fix`, `wip`

### D. Conflict Resolution
If another machine has pushed changes:
```bash
git pull --rebase origin main
# Resolve any conflict markers if prompted, then:
git add .
git rebase --continue
git push origin main
```

---

## 📡 API Reference Overview

| Endpoint | Method | Description | Auth Required |
| :--- | :--- | :--- | :---: |
| `/api/auth/signup` | `POST` | Register a new user | ❌ |
| `/api/auth/login` | `POST` | Authenticate and issue HttpOnly JWT session | ❌ |
| `/api/auth/me` | `GET` | Get current authenticated user profile | ✅ |
| `/api/auth/logout` | `POST` | Clear session cookie | ✅ |
| `/api/auth/forgot-password` | `POST` | Request password reset email | ❌ |
| `/api/auth/reset-password` | `POST` | Reset password using verified token | ❌ |
| `/api/websites` | `GET`, `POST` | List and create birthday websites | ✅ |
| `/api/websites/[id]` | `GET`, `PUT`, `DELETE` | Retrieve, update, or delete a website | Optional / ✅ |
| `/api/websites/duplicate` | `POST` | Duplicate an existing birthday website | ✅ |
| `/api/ai/generate` | `POST` | Generate AI birthday wish with OpenAI | ✅ |
| `/api/payment/create-order` | `POST` | Create Razorpay order | ✅ |
| `/api/payment/verify` | `POST` | Verify Razorpay payment signature & activate plan | ✅ |
| `/api/payment/webhook` | `POST` | Razorpay webhook endpoint (HMAC SHA-256) | ❌ (Header signature) |
| `/api/analytics/track` | `POST` | Record page view and interaction metrics | ❌ |
| `/api/admin/stats` | `GET` | Retrieve platform revenue and activity metrics | ✅ (Admin only) |
| `/api/cron/check-expiration` | `GET` | Process subscription expirations & grace periods | Optional (Cron key) |

---

## 🚢 Deploying to Vercel

1. Push your code to GitHub:
   ```bash
   git push origin main
   ```
2. In the [Vercel Dashboard](https://vercel.com/), click **"Add New Project"** and import `celebrationcraft`.
3. Configure the **Environment Variables** in Vercel project settings:
   - `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME` (pointing to your production MySQL)
   - `AUTH_SECRET`, `JWT_SECRET`
   - `OPENAI_API_KEY`
   - `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`, `RAZORPAY_WEBHOOK_SECRET`
   - `RESEND_API_KEY`, `EMAIL_FROM`
   - `NEXT_PUBLIC_APP_URL` (e.g., `https://celebrationcraft.com`)
4. Click **Deploy**. Vercel will automatically build and deploy every push to `main`.

---

## 🛡️ Security Policy

- **Never commit `.env` or `.env.local` files.**
- If any secret is accidentally exposed, revoke and rotate it immediately.
- Report security issues privately to `security@celebrationcraft.com`.

---

## 📄 License

Proprietary Software. All rights reserved © 2026 CelebrationCraft.
