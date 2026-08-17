# CelebrationCraft — Deployment Guide (Supabase + Vercel)

## Prerequisites

- **Node.js**: 18+ (Node 20 recommended)
- **Supabase Account**: Free or Pro tier at [supabase.com](https://supabase.com)
- **Vercel Account**: [vercel.com](https://vercel.com)
- **GitHub Account**: For automated CI/CD deployments

---

## 1. Supabase Setup

### A. Create Project
1. Log in to [Supabase](https://app.supabase.com) and click **"New Project"**.
2. Name your project (e.g., `celebrationcraft-prod`), choose a region close to your primary audience, and set a database password.

### B. Run Schema Migration
1. Go to the **SQL Editor** in the Supabase Dashboard.
2. Open the file `supabase/migrations/001_initial_schema.sql` from this repository.
3. Paste the contents into the SQL Editor and click **Run**.
4. This will create:
   - 20+ PostgreSQL tables (`users`, `birthday_websites`, `photo_memories`, `orders`, `payments`, `invoices`, `website_analytics`, `funnel_events`, `website_versions`, `coupons`, `coupon_usages`, `ai_usage`, etc.)
   - Row Level Security (RLS) policies
   - Auto-updating `updated_at` triggers
   - Storage buckets (`website-media` and `profile-images`)
   - Default seeded admin user and sample plans

### C. Retrieve API Credentials
1. Go to **Project Settings** -> **API**.
2. Copy:
   - **Project URL** -> `NEXT_PUBLIC_SUPABASE_URL`
   - **Project API Keys (anon / public)** -> `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
   - **Project API Keys (service_role / secret)** -> `SUPABASE_SECRET_KEY`

---

## 2. Environment Variables

Create a `.env.local` file for local development or configure them in Vercel:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-anon-key
SUPABASE_SECRET_KEY=your-service-role-secret-key

# Authentication
JWT_SECRET=your-secure-random-jwt-secret-min-32-chars
AUTH_SECRET=your-auth-secret

# OpenAI (AI Birthday Wishes)
OPENAI_API_KEY=sk-...
OPENAI_MODEL=gpt-3.5-turbo

# Razorpay (Payment Processing)
RAZORPAY_KEY_ID=rzp_live_...
RAZORPAY_KEY_SECRET=your_razorpay_secret
RAZORPAY_WEBHOOK_SECRET=your_razorpay_webhook_secret

# Email Delivery (Resend)
RESEND_API_KEY=re_...
EMAIL_FROM=noreply@celebrationcraft.com

# App URL
NEXT_PUBLIC_APP_URL=https://your-domain.com
```

---

## 3. Local Development

```bash
# Install dependencies
npm install

# Run dev server
npm run dev
```

---

## 4. Production Build Verification

```bash
# Build the application
npm run build

# Start production server locally
npm start
```

---

## 5. Deployment to Vercel

1. Push your latest code to your GitHub repository:
   ```bash
   git push origin main
   ```
2. In the [Vercel Dashboard](https://vercel.com), click **"Add New Project"**.
3. Import your GitHub repository.
4. Add all environment variables listed above in the Vercel **Environment Variables** panel.
5. Click **Deploy**. Vercel will automatically build and deploy.

---

## 6. Serverless Compatibility

CelebrationCraft uses `@supabase/supabase-js` communicating over secure, stateless HTTPS API endpoints. This architecture avoids long-lived persistent TCP connection pools inside serverless/edge functions, ensuring seamless horizontal scaling on Vercel without connection exhaustion.

---

## 7. Storage Verification

Uploaded birthday images, videos, and media are stored in the Supabase Storage bucket `website-media`.
Public URLs are generated automatically and linked to corresponding `photo_memories` records.

---

## Support & Operations

For operational questions or troubleshooting, check the Supabase and Vercel dashboard logs.
