# Ano Safe Wallet

> ⚠️ **This project is currently under active development**

Another Safe (Gnosis Safe) wallet interface with a modern, user-friendly experience. Built with Next.js, React, and a visual flow-based transaction builder.

## Features

- 🔐 Safe (Gnosis Safe) multi-signature wallet management
- 📊 Visual flow-based transaction builder
- 📇 Address book for contact management
- 🌐 Multi-chain support with Web3-Onboard integration
- 🎨 Modern UI built with shadcn/ui components

## Tech Stack

- **Framework**: Next.js 15 with React 19
- **Blockchain**: viem, Web3-Onboard
- **UI**: shadcn/ui, Tailwind CSS, Radix UI
- **Monorepo**: Turborepo with pnpm workspaces

## Getting Started

### Prerequisites

- Node.js >= 20
- pnpm 10.4.1 or higher

### Installation

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build
```

The development server will start at `http://localhost:3000`.

## Development

### Project Structure

This is a monorepo with the following packages:

- `apps/web` - Main Next.js application
- `packages/ui` - Shared UI components (shadcn/ui)
- `packages/safe` - Safe wallet integration utilities
- `packages/types` - Shared TypeScript types

### Adding UI Components

To add new shadcn/ui components:

```bash
pnpm dlx shadcn@latest add button -c apps/web
```

This will place the UI components in the `packages/ui/src/components` directory.

### Using Components

Import components from the `ui` package:

```tsx
import { Button } from '@workspace/ui/components/button';
```
