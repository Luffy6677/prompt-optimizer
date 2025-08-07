# AI Prompt Optimizer

A powerful SaaS application that helps users optimize their AI prompts using advanced language models for better results.

## Features

- **AI-Powered Optimization** - Uses Deepseek-V3 model to analyze and improve prompts
- **Multiple Strategies** - Choose from Comprehensive, Clarity, Specificity, or Creativity optimization
- **Detailed Analysis** - Get scoring metrics and alternative suggestions
- **Subscription Plans** - Personal ($1.99/month) and Professional ($9.99/month) tiers
- **User Dashboard** - Save favorites and track usage
- **Secure Payments** - Integrated Stripe payment processing

## Tech Stack

- **Frontend**: React 18, Vite, Tailwind CSS, Framer Motion
- **Backend**: Node.js, Express, Vercel Functions
- **AI**: Deepseek API
- **Auth**: Supabase
- **Payments**: Stripe

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Deepseek API key
- Supabase account
- Stripe account

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd <project-directory>
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
```bash
cp .env.example .env
```

Edit `.env` and add your keys:
```
DEEPSEEK_API_KEY=your_deepseek_api_key
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
```

4. Run development server
```bash
npm run dev
```

### Build for Production

```bash
npm run build
```

## Deployment

This project is configured for Vercel deployment:

1. Push to GitHub
2. Connect repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

## Project Structure

```
├── src/              # React source files
├── api/              # Vercel serverless functions
├── public/           # Static assets
├── dist/             # Production build output
└── package.json      # Project configuration
```

## License

[Add your license here]

## Support

[Add support contact information]