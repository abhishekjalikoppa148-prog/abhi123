# CelebrationCraft - Birthday SaaS Platform

A premium, production-ready commercial SaaS platform for creating personalized birthday websites with music, photos, AI wishes, and custom domain links.

## Features

### Core Functionality
- **Multi-Step Builder** with live preview split-screen
- **AI Personalization** for birthday messages (OpenAI GPT integration)
- **Photo & Video Upload** system with drag-and-drop
- **Premium Templates** (8+ themes with customizable layouts)
- **Customization Engine** with colors, fonts, animations
- **Background Music** integration with visualizer
- **QR Code Generation** for easy sharing
- **Social Sharing** across all platforms
- **Birthday Countdown** with timezone support
- **Memory Timeline** with photo galleries
- **Interactive Candle Blowing** with sound effects
- **Surprise Gift Box** opening animation

### Business Features
- **Plan Limits System** (Basic, Premium, Ultimate)
- **Expiration Management** with auto-renewal
- **Payment Integration** with Razorpay
- **Order History** and invoice generation
- **Analytics Dashboard** with visitor insights and conversion funnel
- **Admin Portal** for full platform management
- **Transactional Email System** (Resend/SendGrid)

### Security & Performance
- **Security Hardening** with input validation
- **Rate Limiting** and CSRF protection
- **MySQL Database** integration with connection pooling
- **Mobile-First** responsive design
- **Modern Blue + White UI** with premium glassmorphism effects
- **SEO Optimized** with Open Graph and Twitter Cards
- **Server-side validation** for all critical operations

## Tech Stack

- **Frontend**: Next.js 16.3.0, React 19.2.8, TypeScript
- **Styling**: Tailwind CSS with custom blue/white theme, glassmorphism effects
- **Database**: MySQL 8.0+ with connection pooling
- **Payment**: Razorpay integration
- **AI**: OpenAI GPT-3.5 API for personalized messages
- **Email**: Resend/SendGrid for transactional emails
- **Authentication**: Custom implementation with localStorage fallback
- **Deployment**: Vercel-ready
- **Fonts**: Inter, Plus Jakarta Sans, Poppins

## Design System

### Color Palette
- **Primary Blue**: `#2563EB`
- **Dark Blue**: `#1E3A8A`
- **Light Blue**: `#EFF6FF`
- **White**: `#FFFFFF`
- **Background**: `#F8FAFC`
- **Text**: `#0F172A`
- **Secondary Text**: `#64748B`
- **Border**: `#E2E8F0`

### Design Principles
- Clean, modern, professional SaaS appearance
- White backgrounds with blue accents
- Blue gradient buttons and important CTAs
- Soft blue shadows and subtle borders
- Rounded cards with 16px–24px border radius
- Smooth hover animations
- Fully responsive on desktop, tablet, and mobile

## Getting Started

### Prerequisites
- Node.js 18+
- MySQL 8.0+
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
```bash
npm install
```

3. Set up environment variables (see `.env.example`):
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=birthday_saas
RAZORPAY_KEY_ID=your_key_id
RAZORPAY_KEY_SECRET=your_key_secret
OPENAI_API_KEY=your_openai_key
RESEND_API_KEY=your_resend_key
SENDGRID_API_KEY=your_sendgrid_key
EMAIL_FROM=noreply@celebrationcraft.com
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

4. Set up the database:
```bash
mysql -u root -p < schema.sql
```

5. Run development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000)

## Project Structure

```
birthday-saas/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   │   ├── auth/          # Authentication endpoints
│   │   ├── websites/      # Website CRUD operations
│   │   ├── upload/        # File upload handling
│   │   ├── ai/            # AI generation
│   │   ├── payment/       # Razorpay integration
│   │   ├── limits/        # Plan limit checks
│   │   └── analytics/     # Visitor tracking
│   ├── dashboard/         # User dashboard
│   ├── builder/           # Multi-step builder
│   ├── admin/             # Admin portal
│   ├── profile/           # User settings
│   ├── orders/            # Order history
│   └── birthday/          # Generated birthday pages
├── components/            # React components
│   ├── Navbar.tsx
│   ├── Footer.tsx
│   ├── ParticleBackground.tsx
│   ├── BuilderPreview.tsx
│   ├── SocialShareModal.tsx
│   └── templates/         # Template definitions
├── lib/                   # Utilities
│   ├── db.ts             # Database connection
│   ├── store.ts          # Client-side storage
│   ├── types.ts          # TypeScript types
│   ├── sample-data.ts    # Initial data
│   ├── utils.ts          # Helper functions
│   ├── limits.ts         # Plan limits logic
│   ├── security.ts       # Security utilities
│   ├── analytics.ts      # Analytics tracking
│   └── social-share.ts   # Social sharing
├── schema.sql            # Database schema
├── middleware.ts         # Security middleware
└── DEPLOYMENT.md         # Deployment guide
```

## Deployment

### Production Build

```bash
npm run build
npm start
```

### Vercel Deployment

1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions.

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/signup` - User registration

### Websites
- `GET /api/websites?userId={id}` - Get user websites
- `GET /api/websites?slug={slug}` - Get website by slug
- `POST /api/websites` - Create/update website
- `DELETE /api/websites?id={id}` - Delete website

### Features
- `POST /api/upload` - Upload files
- `POST /api/ai/generate` - Generate AI content
- `POST /api/payment/create-order` - Create payment order
- `POST /api/payment/verify` - Verify payment
- `POST /api/limits/check` - Check plan limits
- `POST /api/analytics/track` - Track visitor
- `GET /api/analytics/website?slug={slug}` - Get analytics

## Security Features

- Input sanitization and validation
- SQL injection prevention
- XSS protection
- CSRF token support
- Rate limiting
- Secure headers via middleware
- File upload validation

## License

Proprietary - All rights reserved

## Support

For deployment issues or feature requests, refer to the code documentation or contact the development team.
