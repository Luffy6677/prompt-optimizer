# AI Prompt Optimizer

A subscription-based SaaS application that optimizes AI prompts using Deepseek-V3, featuring secure payments via Stripe and authentication through Supabase.

## Overview

AI Prompt Optimizer helps users improve their AI prompts across multiple dimensions - clarity, specificity, effectiveness, and creativity. Built with React and Node.js, it offers a modern interface with real-time optimization and comprehensive analysis.

## Key Features

- **AI-Powered Optimization** - Deepseek-V3 model for intelligent prompt enhancement
- **Multiple Strategies** - Comprehensive, clarity, specificity, and creativity optimization modes
- **Subscription Tiers** - Personal ($1.99/mo) and Professional ($9.99/mo) plans
- **User Authentication** - Secure login/registration via Supabase
- **Payment Processing** - Stripe integration for subscriptions and billing
- **Favorites System** - Save and manage optimized prompts
- **Usage Tracking** - Monthly optimization limits based on subscription
- **Customer Portal** - Self-service subscription management

## Tech Stack

- **Frontend**: React 18, Vite, Tailwind CSS, Framer Motion
- **Backend**: Node.js, Express
- **AI**: Deepseek-V3 API
- **Auth**: Supabase
- **Payments**: Stripe
- **Deployment**: Vercel

## Quick Start

### Prerequisites

- Node.js 20.x or higher
- npm 8.x or higher
- API keys for Deepseek, Supabase, and Stripe

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Luffy6677/prompt-optimizer.git
   cd prompt-optimizer
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp env.example .env
   ```

4. Configure your `.env` file with required API keys:
   ```env
   PORT=3001
   
   # AI Service
   DEEPSEEK_API_KEY=your_deepseek_api_key
   
   # Authentication
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   
   # Payments
   VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_key
   STRIPE_SECRET_KEY=sk_test_your_key
   STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
   ```

5. Start the development servers:
   ```bash
   # Backend server
   npm run server
   
   # Frontend dev server (in another terminal)
   npm run dev
   ```

6. Visit `http://localhost:3000`

## Configuration Guides

- [Deepseek API Setup](./DEEPSEEK_SETUP.md)
- [Supabase Authentication Setup](./SUPABASE_SETUP.md)
- [Stripe Payment Setup](./STRIPE_SETUP.md)
- [Production Deployment](./PRODUCTION_SETUP.md)
- [Vercel Deployment](./VERCEL_DEPLOYMENT.md)

## API Endpoints

### Optimization
```http
POST /api/optimize
{
  "prompt": "Your prompt to optimize",
  "strategy": "comprehensive"
}
```

### Subscription Management
```http
GET /api/subscription/:userId
POST /api/create-checkout-session
POST /api/create-portal-session
POST /api/webhook
```

## Project Structure

```
prompt-optimizer/
├── src/                  # Frontend React app
│   ├── components/       # UI components
│   ├── contexts/         # React contexts
│   └── services/         # API services
├── api/                  # Backend API routes
├── server/               # Express server
└── public/               # Static assets
```

## Available Scripts

- `npm run dev` - Start frontend development server
- `npm run server` - Start backend server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm start` - Run production server

## Documentation

For detailed documentation, click the "Documentation" button in the app navigation or see:
- [Quick Reference Guide](./DOCUMENTATION.md)
- [English Documentation Setup](./ENGLISH_DOCUMENTATION_SETUP.md)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - see [LICENSE](LICENSE) for details.

## Support

- Create an [Issue](https://github.com/Luffy6677/prompt-optimizer/issues)
- Email: contact@promptoptimizer.com

---

**Optimize your AI prompts for better results!** 🚀