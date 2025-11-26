# Frontend Component Structure

This document outlines the organized component structure for the Inventagious frontend.

## Directory Structure

```
frontend/
├── app/                    # Next.js App Router pages
│   ├── layout.tsx          # Root layout
│   └── page.tsx            # Home page
├── components/             # React components
│   ├── shared/            # Shared components used across the app
│   │   ├── Header/        # Navigation header
│   │   │   ├── Header.tsx
│   │   │   └── index.ts
│   │   └── Footer/        # Site footer
│   │       ├── Footer.tsx
│   │       └── index.ts
│   ├── public/            # Public-facing components
│   │   ├── Hero/          # Landing page hero section
│   │   ├── Features/      # Features showcase
│   │   ├── ProjectCard/   # Project card component
│   │   └── FeaturedProjects/ # Featured projects section
│   ├── private/           # Private/dashboard components (to be created)
│   │   ├── Dashboard/     # User dashboard
│   │   ├── ProjectForm/  # Project creation/editing
│   │   └── InvestorTools/ # Investor-specific tools
│   └── auth/              # Authentication components (to be created)
│       ├── LoginForm/
│       ├── RegisterForm/
│       └── WalletConnect/
└── lib/                   # Utility libraries
    └── api/               # API client and endpoints
        ├── client.ts      # Base API client
        ├── auth.ts        # Authentication API
        ├── projects.ts    # Projects API
        └── profile.ts     # Profile API
```

## Component Organization Principles

1. **Small, Focused Files**: Each component is in its own file with a single responsibility
2. **Index Exports**: Each component folder has an `index.ts` for clean imports
3. **Feature-Based Grouping**: Components are grouped by feature (public, private, shared, auth)
4. **Reusable Components**: Shared components are in the `shared/` directory
5. **API Separation**: API logic is separated into dedicated files in `lib/api/`

## Import Examples

```typescript
// Clean imports using index files
import Header from '@/components/shared/Header';
import Hero from '@/components/public/Hero';
import ProjectCard from '@/components/public/ProjectCard';

// API imports
import { authApi } from '@/lib/api/auth';
import { projectsApi } from '@/lib/api/projects';
```

## Next Steps

- Create private layer components (dashboard, project management)
- Create authentication components (login, register, wallet connect)
- Create profile components (profile pages, video upload)
- Add Solana wallet integration components

