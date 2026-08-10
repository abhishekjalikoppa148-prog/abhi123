# Birthday SaaS Platform - Deployment Guide

## Prerequisites

- Node.js 18+ 
- MySQL 8.0+
- npm or yarn
- Vercel account (for deployment)

## Environment Variables

Create a `.env.local` file with the following variables:

```env
# Database
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=birthday_saas

# Razorpay (Payment Gateway)
RAZORPAY_KEY_ID=your_key_id
RAZORPAY_KEY_SECRET=your_key_secret

# Application
NEXT_PUBLIC_APP_URL=https://your-domain.com
ALLOWED_ORIGINS=https://your-domain.com
```

## Database Setup

1. Create MySQL database:
```sql
CREATE DATABASE birthday_saas;
```

2. Run the schema:
```bash
mysql -u root -p birthday_saas < schema.sql
```

## Installation

1. Install dependencies:
```bash
npm install
```

2. Run development server:
```bash
npm run dev
```

## Production Build

1. Build the application:
```bash
npm run build
```

2. Start production server:
```bash
npm start
```

## Deployment to Vercel

1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

## Key Features Implemented

- ✅ MySQL database integration
- ✅ Multi-step builder with live preview
- ✅ AI personalization API
- ✅ File upload system
- ✅ Razorpay payment integration
- ✅ Plan limits and expiration
- ✅ Admin dashboard
- ✅ Analytics tracking
- ✅ Profile settings & order history
- ✅ Security hardening
- ✅ Social sharing & QR codes
- ✅ Mobile optimization

## Security Notes

- All API routes include input validation
- Rate limiting implemented
- SQL injection prevention
- XSS protection
- CSRF token support
- Secure headers via middleware

## Performance Optimization

- Image optimization via Next.js Image
- Code splitting
- Lazy loading
- CSS animations optimized
- Mobile-first responsive design

## Monitoring

- Analytics tracking for visitor insights
- Admin dashboard for revenue monitoring
- Error logging in place
- Performance metrics available

## Support

For issues or questions, refer to the code documentation or contact the development team.
