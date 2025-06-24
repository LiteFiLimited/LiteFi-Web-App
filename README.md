# LiteFi Web App

A modern, responsive web application for LiteFi - a financial service platform offering auto loans, high-yield investments, and other financial solutions.

## Project Overview

LiteFi Web App is a comprehensive financial service platform focused on providing users with a fast track to financial freedom. The web app includes the following sections:

* Authentication (Sign Up, Login)
* Dashboard
* Profile Management
* Loan Services
* Investment Management
* Wallet


## Technologies Used

* Frontend Framework: Next.js 15.2.4
* UI Library: React 19
* Language: TypeScript
* Styling: Tailwind CSS
* UI Components:
    * Radix UI components
    * Shadcn UI
* Form Handling: React Hook Form with Zod validation
* Date Handling: date-fns
* Icons: Lucide React
* Charts: Recharts
* Notifications: Sonner
* Font: Outfit (Google Fonts)

## Getting Started

### Prerequisites

* Node.js 18.x or higher
* npm or pnpm

### Installation

1. Clone the repository:
```bash
git clone https://github.com/LiteFiLimited/LiteFi-Web-App.git
cd LiteFi-Web-App
```

2. Install dependencies:
```bash
npm install
# or
pnpm install
```

3. Add the required images to the `public/assets/images/` directory.

### Development

Run the development server:
```bash
npm run dev
# or
pnpm dev
```

Open http://localhost:3000 in your browser to see the result.

## Project Structure

```
LiteFi-Web-App/
├── app/                    # Next.js app directory
│   ├── auth/               # Authentication pages
│   │   ├── login/          # Login page
│   │   └── sign-up/        # Sign-up page
│   ├── dashboard/          # Dashboard pages
│   ├── profile/            # Profile management
│   ├── loans/              # Loan services
│   ├── investments/        # Investment management
│   ├── wallet/             # Wallet functionality
│   ├── components/         # React components
│   │   └── ui/             # UI components (buttons, inputs, etc.)
│   ├── globals.css         # Global styles
│   ├── layout.tsx          # Root layout
│   └── page.tsx            # Main page component
├── lib/                    # Utility functions and libraries
├── hooks/                  # Custom React hooks
├── public/                 # Public static files
│   └── assets/             # Public assets
│       └── images/         # Source image files (place your images here)
├── next.config.mjs         # Next.js configuration
├── package.json            # Project dependencies and scripts
├── postcss.config.js       # PostCSS configuration
├── tailwind.config.ts      # Tailwind CSS configuration
└── tsconfig.json           # TypeScript configuration
```

## Design Guidelines

* No border radius on components by default (set to 0px)
* Modern and clean UI with Outfit font family
* Fully responsive across all devices
* LiteFi brand colors maintained throughout
* Consistent greyish background (#f8f8f8)
* Separate containers for image and form on sign-up/login pages

## Static Export Deployment

This application is configured to be deployed as a static export. To build for static export:

1. Ensure all API routes have `export const dynamic = 'force-static'` at the top of the file
2. Run `npm run build` to generate the static files in the `out` directory
3. Deploy the contents of the `out` directory to your hosting service

For more details, see [Static Export Deployment Guide](docs/static-export-deployment.md)
