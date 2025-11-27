# Inventagious Frontend

A modern, feature-rich Next.js frontend application for the Inventagious crowdfunding platform, featuring Solana blockchain integration, wallet authentication, comprehensive SEO optimization, and a beautiful user experience.

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Environment Setup](#environment-setup)
- [Running the Project](#running-the-project)
- [Project Structure](#project-structure)
- [Pages & Routes](#pages--routes)
- [Authentication](#authentication)
- [Wallet Integration](#wallet-integration)
- [Solana Smart Contract Integration](#solana-smart-contract-integration)
- [API Integration](#api-integration)
- [SEO Implementation](#seo-implementation)
- [Testing](#testing)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)

## 🎯 Overview

The Inventagious Frontend is a cutting-edge web application built with Next.js 16 and React 19. It provides a seamless experience for inventors, innovators, and investors to discover, fund, and manage crowdfunding projects on the Solana blockchain. The platform features wallet-based authentication, real-time blockchain interactions, comprehensive SEO optimization, and a responsive, modern UI.

## ✨ Features

### Core Functionality
- **Home Page**: Beautiful landing page with hero section, featured projects, and platform information
- **Project Discovery**: Browse, search, and filter projects by category, status, and funding goals
- **Campaign Management**: Create and manage crowdfunding campaigns with Solana blockchain integration
- **Deal Management**: Private funding deals with escrow functionality
- **User Profiles**: Complete user profile management with wallet integration
- **Search & Filter**: Advanced search and filtering capabilities
- **Category Browsing**: Explore projects by category

### Blockchain & Wallet Integration
- **Wallet Authentication**: Connect with Phantom, Solflare, Backpack, Glow, and other Solana wallets
- **Wallet Standard API**: Modern wallet detection and connection using Wallet Standard API
- **Smart Contract Integration**: Direct interaction with Solana smart contracts (Campaign, Deal Escrow, Treasury)
- **Transaction Signing**: Secure transaction signing through user wallets
- **On-Chain Operations**: Contribute to campaigns, create deals, and manage escrow accounts
- **Real-Time Updates**: Live blockchain data synchronization

### User Experience
- **Responsive Design**: Mobile-first responsive layout for all devices
- **Modern UI**: Beautiful, intuitive interface with Tailwind CSS
- **Loading States**: Comprehensive loading and error states
- **Form Validation**: Client-side validation for all forms
- **Image Optimization**: Next.js Image component with automatic optimization
- **Accessibility**: WCAG-compliant accessibility features

### SEO & Performance
- **Comprehensive SEO**: Meta tags, Open Graph, Twitter Cards, structured data (JSON-LD)
- **Sitemap Generation**: Dynamic sitemap.xml generation
- **Robots.txt**: Search engine crawler configuration
- **Performance Optimization**: Image optimization, font preloading, compression
- **Analytics Integration**: Ready for Google Analytics and other analytics tools
- **Social Sharing**: Optimized social media sharing with proper meta tags

### Content Management
- **Help Center**: Comprehensive help documentation and guides
- **About Page**: Platform information and mission
- **Contact Page**: Contact form and information
- **Guarantee Page**: Platform guarantees and trust information
- **Pricing Page**: Platform pricing information

## 🛠 Tech Stack

- **Framework**: Next.js 16.0.4 (App Router)
- **React**: React 19.2.0
- **Language**: TypeScript 5.x
- **Styling**: Tailwind CSS 4.x
- **Blockchain**: 
  - Solana Web3.js 1.98.4
  - Anchor 0.32.1
  - Wallet Adapter React 0.15.39
- **Testing**: Jest, React Testing Library
- **Code Quality**: ESLint
- **Build Tool**: Webpack (configured for Solana dependencies)
- **Package Manager**: npm/yarn (with workspace configuration via .npmrc)

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js**: v18.x or higher ([Download](https://nodejs.org/))
- **npm** or **yarn**: Package manager
- **Git**: Version control
- **Solana Wallet**: Phantom, Solflare, or another Solana wallet extension
- **Backend API**: The Inventagious backend API should be running (see [Backend README](../backend/README.md))
- **Solana Validator** (optional): For local development (see [Local Validator Setup](../QUICK_START_LOCAL_VALIDATOR.md))

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/konstantinos193/inventagious.git
cd inventagious/frontend
```

### 2. Install Dependencies

Using npm:
```bash
npm install
```

Or using yarn:
```bash
yarn install
```

**Note:** The project includes an `.npmrc` file to prevent React dependency hoisting in monorepo setups. This ensures the frontend uses its own React 19 installation and avoids version conflicts.

### 3. Environment Setup

Create a `.env` file in the `frontend` directory:

```bash
cp .env.example .env  # If you have an example file
# Or create a new .env file
```

See [Environment Setup](#environment-setup) section for detailed configuration.

## ⚙️ Environment Setup

Create a `.env` file in the `frontend` directory with the following variables:

### Required Variables

```env
# Backend API Configuration
# SECURITY: This is server-side only and should NEVER be exposed to the client
# This is used by Next.js rewrites to proxy requests from '/api' to the backend
BACKEND_URL=http://localhost:3001

# Public API URL (exposed to browser)
# SECURITY: MUST be set to '/api' to use Next.js proxy (hides backend identity)
# DO NOT set this to a direct backend URL (e.g., 'http://localhost:3001')
# Leaving unset defaults to '/api' (proxy) - this is the recommended setting
NEXT_PUBLIC_API_URL=/api

# Solana RPC Configuration
# For local development: http://localhost:8899
# For devnet: https://api.devnet.solana.com
# For mainnet: https://api.mainnet-beta.solana.com
NEXT_PUBLIC_SOLANA_RPC_URL=http://localhost:8899

# Environment
NODE_ENV=development
```

### Configuration Details

#### Backend URL (`BACKEND_URL`)
- **Purpose**: Server-side configuration for Next.js API rewrites
- **Security**: Never exposed to the client browser
- **Default**: `http://localhost:3001`
- **Production**: Set to your production backend URL

#### Public API URL (`NEXT_PUBLIC_API_URL`)
- **Purpose**: Client-side API endpoint
- **Security**: Should always be `/api` to use the proxy (hides backend identity)
- **Default**: `/api` (uses Next.js proxy)
- **Warning**: Never set this to a direct backend URL in production

#### Solana RPC URL (`NEXT_PUBLIC_SOLANA_RPC_URL`)
- **Purpose**: Solana network RPC endpoint
- **Local Development**: `http://localhost:8899` (requires local validator)
- **Devnet**: `https://api.devnet.solana.com`
- **Mainnet**: `https://api.mainnet-beta.solana.com`
- **Custom RPC**: Use your own RPC provider URL for better performance

### API Proxy Configuration

The frontend uses Next.js rewrites to proxy API requests. This provides:

1. **Security**: Backend URL is hidden from the client
2. **CORS**: No CORS issues since requests come from the same origin
3. **Flexibility**: Easy to switch between environments

All API requests should be made to `/api/*`, which will be automatically proxied to `BACKEND_URL/*`.

### Network Switching Scripts

The frontend includes scripts to easily switch between networks:

**Switch to Devnet:**
```bash
./switch-to-devnet.ps1  # Windows PowerShell
```

**Switch to Local:**
```bash
./switch-to-local.ps1  # Windows PowerShell
```

## 🏃 Running the Project

### Development Mode

Start the development server:

```bash
npm run dev
# or
yarn dev
```

The frontend will start on `http://localhost:3000` (port 3000).

**Note**: Make sure the backend API is running on `http://localhost:3001` (or update `BACKEND_URL` in your `.env` file).

### Production Build

1. Build the project:
```bash
npm run build
# or
yarn build
```

**Build Configuration:**
- Uses webpack for Solana/Anchor dependency handling
- Memory optimization: 4GB heap size for standard builds (`--max-old-space-size=4096`)
- Production builds: 6GB heap size (`build:prod` script with `--max-old-space-size=6144`)
- Optimized chunk splitting and parallel processing limits to prevent memory issues
- Node.js polyfills configured for browser compatibility

2. Start the production server:
```bash
npm run start
# or
yarn start
```

**Note:** If you encounter build lock errors, remove the `.next` directory:
```bash
# Windows PowerShell
Remove-Item -Recurse -Force .next

# Linux/Mac
rm -rf .next
```

### Port Configuration

The frontend runs on port **3000** by default. To change the port:

**Development:**
```bash
# Edit package.json scripts
"dev": "next dev -p YOUR_PORT --turbo"
```

**Production:**
```bash
# Edit package.json scripts
"start": "next start -p YOUR_PORT"
```

Or use environment variable:
```bash
PORT=3000 npm run dev
```

## 📁 Project Structure

```
frontend/
├── app/                      # Next.js App Router pages
│   ├── layout.tsx            # Root layout with providers
│   ├── page.tsx              # Home page
│   ├── globals.css           # Global styles
│   ├── sitemap.ts            # Dynamic sitemap generation
│   ├── robots.ts             # Robots.txt generation
│   ├── manifest.ts           # PWA manifest
│   ├── about/                # About page
│   │   ├── page.tsx
│   │   └── pricing/
│   │       └── page.tsx
│   ├── campaigns/            # Campaign pages
│   │   ├── page.tsx          # Campaigns listing
│   │   ├── create/
│   │   │   └── page.tsx      # Create campaign
│   │   └── [slug]/
│   │       ├── page.tsx      # Campaign detail
│   │       └── not-found.tsx
│   ├── category/             # Category pages
│   │   ├── page.tsx
│   │   └── [id]/
│   │       ├── page.tsx
│   │       └── not-found.tsx
│   ├── contact/              # Contact page
│   │   └── page.tsx
│   ├── deals/                # Deal pages
│   │   ├── page.tsx          # Deals listing
│   │   ├── create/
│   │   │   └── page.tsx      # Create deal
│   │   └── [id]/
│   │       ├── page.tsx      # Deal detail
│   │       └── not-found.tsx
│   ├── explore/              # Explore page
│   │   └── page.tsx
│   ├── guarantee/            # Guarantee page
│   │   └── page.tsx
│   ├── help/                 # Help center
│   │   ├── page.tsx
│   │   ├── categories/
│   │   │   └── page.tsx
│   │   ├── start-project/
│   │   │   └── page.tsx
│   │   └── tips/
│   │       └── page.tsx
│   ├── private/              # Private user area
│   │   └── page.tsx
│   ├── projects/             # Project pages
│   │   ├── page.tsx          # Projects listing
│   │   ├── create/
│   │   │   └── page.tsx      # Create project
│   │   ├── featured/
│   │   │   └── page.tsx      # Featured projects
│   │   └── [id]/
│   │       ├── page.tsx      # Project detail
│   │       └── not-found.tsx
│   └── search/               # Search page
│       └── page.tsx
├── components/               # React components
│   ├── auth/                 # Authentication components
│   │   ├── AuthProvider/     # Auth context provider
│   │   ├── WalletProvider/   # Wallet context provider
│   │   ├── WalletConnect/    # Wallet connection UI
│   │   └── WalletAuthInitializer.tsx
│   ├── analytics/            # Analytics components
│   │   └── AnalyticsInitializer.tsx
│   ├── private/              # Private/dashboard components
│   │   ├── CreateCampaignForm/
│   │   ├── CreateDealForm/
│   │   ├── CreateProjectForm/
│   │   └── DealCard/
│   ├── public/               # Public-facing components
│   │   ├── AboutPage/        # About page sections
│   │   ├── CampaignsList/    # Campaign listing components
│   │   ├── Category/         # Category components
│   │   ├── Contact/          # Contact page components
│   │   ├── DealsList/        # Deal listing components
│   │   ├── DonateButton/     # Donation button
│   │   ├── Explore/          # Explore page components
│   │   ├── FeaturedProjects/ # Featured projects
│   │   ├── Features/         # Features showcase
│   │   ├── Guarantee/        # Guarantee page components
│   │   ├── Help/             # Help center components
│   │   ├── Hero/             # Landing page hero
│   │   ├── HowItWorks/       # How it works section
│   │   ├── Pricing/          # Pricing page components
│   │   ├── PrivateFunding/   # Private funding components
│   │   ├── ProjectCard/      # Project card component
│   │   ├── ProjectDetail/    # Project detail components
│   │   ├── ProjectsList/     # Project listing components
│   │   ├── Search/           # Search components
│   │   └── TrustSafety/      # Trust & safety components
│   ├── shared/               # Shared components
│   │   ├── Header/           # Navigation header
│   │   ├── Footer/           # Site footer
│   │   ├── Logo/             # Logo component
│   │   ├── DatePicker/       # Date picker component
│   │   ├── BrowserWindow/    # Browser window component
│   │   ├── Decorations/      # Decorative components
│   │   └── ImageSlideshow/   # Image slideshow
│   └── solana/               # Solana-specific components
│       └── ProgramIdsInitializer.tsx
├── hooks/                    # Custom React hooks
│   ├── useWallet.ts          # Wallet management hook
│   └── useWalletAuth.ts      # Wallet authentication hook
├── lib/                      # Utility libraries
│   ├── api/                  # API client and endpoints
│   │   ├── client.ts         # Base API client
│   │   ├── auth.ts           # Authentication API
│   │   ├── projects.ts       # Projects API
│   │   ├── deals.ts          # Deals API
│   │   ├── profile.ts        # Profile API
│   │   ├── help.ts           # Help API
│   │   ├── solana.ts         # Solana API
│   │   └── proxy-validator.ts
│   ├── solana/               # Solana integration
│   │   ├── anchor-client.ts  # Anchor client setup
│   │   ├── connection.ts     # Solana connection
│   │   ├── program-ids.ts    # Program ID management
│   │   ├── pda.ts            # PDA derivation utilities
│   │   ├── campaign.ts       # Campaign program interactions
│   │   ├── deal.ts           # Deal escrow interactions
│   │   ├── price.ts          # SOL price utilities
│   │   ├── idl-loader.ts     # IDL loading utilities
│   │   ├── hooks/            # Solana React hooks
│   │   │   ├── useCampaign.ts
│   │   │   └── useDeal.ts
│   │   └── idls/             # IDL JSON files
│   ├── seo/                  # SEO utilities
│   │   ├── config.ts         # SEO configuration
│   │   ├── structured-data.tsx
│   │   ├── metadata-utils.ts
│   │   ├── analytics.tsx
│   │   ├── head-components.tsx
│   │   └── title-utils.ts
│   ├── analytics/            # Analytics utilities
│   │   ├── analytics.service.ts
│   │   └── analytics-hook.ts
│   ├── wallet/               # Wallet utilities
│   │   └── wallet-standard.ts
│   ├── utils/                # General utilities
│   │   └── imageUtils.ts
│   └── categories.tsx         # Category definitions
├── public/                   # Static assets
│   ├── favicon.png
│   ├── robots.txt
│   ├── browserconfig.xml
│   ├── logos/                # Logo files
│   ├── banners/              # Banner images
│   ├── icons/                # Icon files
│   └── idl/                  # IDL files (optional)
├── middleware.ts             # Next.js middleware (if needed)
├── next.config.ts            # Next.js configuration
├── package.json
├── tsconfig.json
└── README.md
```

## 📄 Pages & Routes

### Public Pages

- `/` - Home page with hero, featured projects, and platform information
- `/about` - About page with platform information
- `/about/pricing` - Pricing information
- `/contact` - Contact page with contact form
- `/guarantee` - Platform guarantees and trust information
- `/help` - Help center main page
- `/help/categories` - Help categories
- `/help/start-project` - Guide for starting a project
- `/help/tips` - Fundraising tips

### Project & Campaign Pages

- `/projects` - All projects listing
- `/projects/featured` - Featured projects
- `/projects/create` - Create a new project
- `/projects/[id]` - Project detail page
- `/campaigns` - All campaigns listing
- `/campaigns/create` - Create a new campaign
- `/campaigns/[slug]` - Campaign detail page

### Deal Pages

- `/deals` - All deals listing
- `/deals/create` - Create a new deal
- `/deals/[id]` - Deal detail page

### Discovery Pages

- `/explore` - Explore projects and campaigns
- `/search` - Search projects, campaigns, and deals
- `/category` - Browse by category
- `/category/[id]` - Category detail page

### Private Pages

- `/private` - Private user dashboard (requires authentication)

## 🔐 Authentication

### Wallet-Based Authentication

The frontend uses Solana wallet-based authentication:

1. User connects their wallet (Phantom, Solflare, etc.)
2. User signs an authentication message
3. Backend verifies the signature and issues a JWT token
4. Token is stored and used for authenticated requests

### Authentication Flow

```
1. User clicks "Connect Wallet"
   ↓
2. Wallet extension opens (Phantom, Solflare, etc.)
   ↓
3. User approves connection
   ↓
4. Frontend requests message signature
   ↓
5. User signs authentication message
   ↓
6. Frontend sends signature to backend
   ↓
7. Backend verifies signature and returns JWT token
   ↓
8. Token stored in cookies/localStorage
   ↓
9. User is authenticated
```

### Authentication Context

The `AuthProvider` provides:
- Current user information
- Authentication state
- Login/logout functions
- Token management

### Protected Routes

Routes can be protected using:
- `AuthProvider` context to check authentication
- Server-side middleware (if implemented)
- Backend API authentication checks

## 💼 Wallet Integration

### Supported Wallets

The frontend supports:
- **Phantom** (via Wallet Standard or direct)
- **Solflare** (via Wallet Standard or direct)
- **Backpack** (via Wallet Standard or direct)
- **Glow** (via Wallet Standard or direct)
- **Any wallet supporting Wallet Standard API**

### Wallet Detection

The frontend uses the **Wallet Standard API** for modern wallet detection, with fallback to direct wallet detection for compatibility.

### Wallet Hooks

#### `useWallet()`

Main wallet management hook:

```typescript
import { useWallet } from '@/hooks/useWallet';

function MyComponent() {
  const { 
    publicKey,        // Current wallet public key
    connected,        // Connection status
    connect,          // Connect function
    disconnect,       // Disconnect function
    signTransaction,  // Sign transaction function
    signMessage       // Sign message function
  } = useWallet();
  
  // Use wallet...
}
```

#### `useWalletAuth()`

Automatic wallet authentication hook:

```typescript
import { useWalletAuth } from '@/hooks/useWalletAuth';

function MyComponent() {
  const { authenticateWallet, handleDisconnect } = useWalletAuth();
  
  // Automatically authenticates when wallet connects
}
```

### Wallet Connection Component

Use the `WalletConnect` component for wallet connection UI:

```typescript
import WalletConnect from '@/components/auth/WalletConnect';

<WalletConnect />
```

## ⛓ Solana Smart Contract Integration

### Overview

The frontend integrates directly with Solana smart contracts using Anchor. Users sign transactions in their browser wallet, and the frontend sends transaction signatures to the backend for verification and state synchronization.

### Smart Contract Programs

The frontend interacts with three main programs:

1. **Campaign Program**: Crowdfunding campaign management
2. **Deal Escrow Program**: Private funding deals with escrow
3. **Treasury Program**: Platform treasury management

### Campaign Operations

#### Contributing to a Campaign

```typescript
import { useCampaign } from '@/lib/solana/hooks/useCampaign';

function ContributeButton({ projectId, campaignPda }) {
  const { contribute, isLoading } = useCampaign();
  
  const handleContribute = async () => {
    try {
      await contribute(projectId, campaignPda, 1.0); // 1 SOL
      alert('Contribution successful!');
    } catch (error) {
      alert(`Error: ${error.message}`);
    }
  };
  
  return (
    <button onClick={handleContribute} disabled={isLoading}>
      {isLoading ? 'Processing...' : 'Contribute'}
    </button>
  );
}
```

#### Publishing a Campaign

```typescript
import { useCampaign } from '@/lib/solana/hooks/useCampaign';

function PublishButton({ projectId, fundingGoal, deadline }) {
  const { initializeCampaign, isLoading } = useCampaign();
  
  const handlePublish = async () => {
    try {
      const { signature, campaignPda } = await initializeCampaign(
        projectId,
        fundingGoal,
        deadline
      );
      console.log('Campaign initialized:', campaignPda);
    } catch (error) {
      alert(`Error: ${error.message}`);
    }
  };
  
  return (
    <button onClick={handlePublish} disabled={isLoading}>
      {isLoading ? 'Publishing...' : 'Publish Campaign'}
    </button>
  );
}
```

### Deal Operations

```typescript
import { useDeal } from '@/lib/solana/hooks/useDeal';

function DealButton({ dealId }) {
  const { createDeal, acceptDeal, isLoading } = useDeal();
  
  // Use deal operations...
}
```

### Transaction Flow

1. User initiates action (contribute, create deal, etc.)
2. Frontend builds transaction using Anchor
3. User signs transaction in wallet
4. Transaction sent to Solana network
5. Wait for confirmation
6. Frontend sends signature to backend API
7. Backend verifies transaction and syncs database
8. UI updates with new data

### IDL Loading

The frontend loads IDL (Interface Definition Language) files from:
1. **Static Files** (recommended): `public/idl/` directory
2. **From Chain** (fallback): Fetches IDL from deployed program

### Program IDs

Program IDs are fetched from the backend at runtime via `/api/solana/program-ids`. The backend is the single source of truth for program IDs.

## 🔌 API Integration

### Making API Requests

All API requests should use the `/api` prefix, which is automatically proxied to the backend:

```typescript
// ✅ Correct - uses proxy
const response = await fetch('/api/projects');

// ❌ Incorrect - direct backend URL
const response = await fetch('http://localhost:3001/projects');
```

### API Client

Use the centralized API client:

```typescript
import { apiClient } from '@/lib/api/client';

// GET request
const projects = await apiClient.get('/projects');

// POST request
const newProject = await apiClient.post('/projects', {
  name: 'My Project',
  description: 'Project description'
});

// With authentication
const profile = await apiClient.get('/profile');
```

### API Modules

The project includes organized API modules:

```typescript
import { authApi } from '@/lib/api/auth';
import { projectsApi } from '@/lib/api/projects';
import { dealsApi } from '@/lib/api/deals';
import { profileApi } from '@/lib/api/profile';
import { helpApi } from '@/lib/api/help';
import { solanaApi } from '@/lib/api/solana';

// Use specific APIs
const projects = await projectsApi.getAll();
const profile = await profileApi.get();
const deals = await dealsApi.getAll();
```

### Error Handling

The API client includes comprehensive error handling:

```typescript
try {
  const data = await projectsApi.getById(id);
} catch (error) {
  if (error.status === 401) {
    // Handle unauthorized
  } else if (error.status === 404) {
    // Handle not found
  } else {
    // Handle other errors
  }
}
```

## 🔍 SEO Implementation

### Features

The frontend includes comprehensive SEO optimization:

- ✅ **Meta Tags**: Title, description, keywords, canonical URLs
- ✅ **Open Graph**: Complete OG tags for social sharing
- ✅ **Twitter Cards**: Optimized Twitter card support
- ✅ **Structured Data**: JSON-LD schemas (Organization, Website, SoftwareApplication, FinancialProduct)
- ✅ **Sitemap**: Dynamic sitemap.xml generation
- ✅ **Robots.txt**: Search engine crawler configuration
- ✅ **Performance**: Image optimization, font preloading, compression

### Using SEO Utilities

```typescript
import { generatePageMetadata } from '@/lib/seo';

export const metadata = generatePageMetadata({
  title: 'Page Title',
  description: 'Page description with keywords',
  url: '/page-url',
  keywords: ['additional', 'keywords'],
});
```

For project/article pages:

```typescript
import { generateArticleMetadata } from '@/lib/seo';

export const metadata = generateArticleMetadata({
  title: 'Project Name',
  description: 'Project description',
  publishedTime: '2024-01-01T00:00:00Z',
  url: '/projects/project-slug',
  tags: ['web3', 'innovation'],
});
```

See [SEO_IMPLEMENTATION.md](./SEO_IMPLEMENTATION.md) for complete SEO documentation.

## 🧪 Testing

### Unit Tests

Run unit tests:

```bash
npm test
# or
yarn test
```

### Watch Mode

Run tests in watch mode:

```bash
npm run test:watch
# or
yarn test:watch
```

### Coverage

Generate test coverage:

```bash
npm run test:cov
# or
yarn test:cov
```

### Test Structure

Tests are organized alongside components:

```
components/
├── MyComponent/
│   ├── MyComponent.tsx
│   └── MyComponent.test.tsx
```

## 🔧 Troubleshooting

### Common Issues

#### Port Already in Use

**Error**: `Port 3000 is already in use`

**Solutions**:
1. Kill the process using port 3000:
   ```bash
   # Windows
   netstat -ano | findstr :3000
   taskkill /PID <PID> /F
   
   # Linux/Mac
   lsof -ti:3000 | xargs kill -9
   ```
2. Change the port in `package.json` scripts

#### Backend Connection Issues

**Error**: `Failed to fetch` or CORS errors

**Solutions**:
1. Verify backend is running on `http://localhost:3001`
2. Check `BACKEND_URL` in `.env` file
3. Ensure `NEXT_PUBLIC_API_URL` is set to `/api`
4. Check backend CORS configuration

#### Wallet Connection Issues

**Error**: Wallet not connecting or signing fails

**Solutions**:
1. Ensure wallet extension is installed and unlocked
2. Check wallet network matches `NEXT_PUBLIC_SOLANA_RPC_URL`
3. Verify wallet supports message signing
4. Check browser console for detailed errors
5. Try a different wallet (Phantom, Solflare, etc.)

#### Solana RPC Issues

**Error**: RPC connection failures or slow responses

**Solutions**:
1. Verify RPC URL is correct in `.env`
2. Check if local validator is running (for local development)
3. Try switching to a different RPC endpoint
4. Check network connectivity
5. Consider using a custom RPC provider for better performance

#### Build Errors

**Error**: TypeScript or build errors

**Solutions**:
1. Run `npm install` to ensure all dependencies are installed
2. Check TypeScript version compatibility
3. Verify `tsconfig.json` settings
4. Clear `.next` folder: `rm -rf .next`
5. Clear `node_modules` and reinstall: `rm -rf node_modules && npm install`

#### Transaction Failures

**Error**: Solana transactions failing

**Solutions**:
1. Check wallet has sufficient SOL balance
2. Verify program IDs are correct (check backend)
3. Ensure network matches (devnet vs mainnet)
4. Check transaction logs in browser console
5. Verify IDL files are up to date

#### API Proxy Not Working

**Error**: API requests fail or return 404

**Solutions**:
1. Verify `next.config.ts` rewrites configuration
2. Check `BACKEND_URL` environment variable
3. Ensure backend is running and accessible
4. Check Next.js server logs for proxy errors

### Getting Help

If you encounter issues not covered here:

1. Check the [Issues](https://github.com/konstantinos193/inventagious/issues) page
2. Review the documentation files:
   - `SEO_IMPLEMENTATION.md`
   - `FRONTEND_SMART_CONTRACT_INTEGRATION.md`
   - `WALLET_INTEGRATION_COMPLETE.md`
   - `COMPONENT_STRUCTURE.md`
3. Check Next.js and React documentation
4. Open a new issue with detailed error information

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Run tests (`npm test`)
5. Run linter (`npm run lint`)
6. Commit your changes (`git commit -m 'Add amazing feature'`)
7. Push to the branch (`git push origin feature/amazing-feature`)
8. Open a Pull Request

### Code Style

- Follow TypeScript best practices
- Use ESLint (run `npm run lint`)
- Write tests for new features
- Update documentation as needed
- Follow the existing component structure

### Component Structure

When creating new components:

1. Place in appropriate directory (`components/public/`, `components/private/`, or `components/shared/`)
2. Create TypeScript types/interfaces
3. Add proper error handling
4. Include loading states
5. Make responsive (mobile-first)
6. Support SEO (add metadata if it's a page)
7. Add tests

### File Organization

- **Small, Focused Files**: Each component in its own file with a single responsibility
- **Index Exports**: Each component folder has an `index.ts` for clean imports
- **Feature-Based Grouping**: Components grouped by feature (public, private, shared, auth)
- **Reusable Components**: Shared components in the `shared/` directory
- **API Separation**: API logic separated into dedicated files in `lib/api/`

## 📄 License

This project is licensed under the ISC License.

## 🔗 Related Documentation

- [Backend API README](../backend/README.md)
- [Admin Panel README](../admin/README.md)
- [SEO Implementation Guide](./SEO_IMPLEMENTATION.md)
- [Frontend Smart Contract Integration](./FRONTEND_SMART_CONTRACT_INTEGRATION.md)
- [Wallet Integration Complete](./WALLET_INTEGRATION_COMPLETE.md)
- [Component Structure](./COMPONENT_STRUCTURE.md)
- [Proxy Security](./PROXY_SECURITY.md)

## 📞 Support

For support and questions:
- Open an issue on GitHub
- Check the documentation files
- Review the code comments

---

**Built with ❤️ for the Inventagious platform**
