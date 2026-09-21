# Knoz Store - كنوز ستور

<div dir="rtl">

## متجر كنوز - منصة تجارة إلكترونية متكاملة

</div>

**Knoz Store** is a full-featured e-commerce platform built with Next.js, designed for selling customizable products with full Arabic (RTL) support. It provides a complete storefront, shopping cart, checkout flow, and a powerful admin dashboard.

**كنوز ستور** هو منصة تجارة إلكترونية متكاملة مبنية باستخدام Next.js، مصمم لبيع المنتجات القابلة للتخصيص مع دعم كامل للغة العربية (RTL). يوفر واجهة متجر كاملة، وسلة مشتريات، وعملية دفع، ولوحة تحكم إدارية قوية.

---

## Features - المميزات

### Storefront - واجهة المتجر
- Responsive product catalog with category filtering
- Product detail pages with image galleries
- Featured products and badges
- Full Arabic (RTL) layout support
- Dynamic theming system

### Product Customization - تخصيص المنتجات
- Add personalized names to products
- Select themes for custom designs
- Choose from a sticker library
- Image upload support
- Custom notes and special instructions

### Shopping Cart & Checkout - سلة المشتريات والدفع
- Persistent cart with real-time updates
- Multi-step checkout flow
- Order confirmation with tracking
- Delivery fee calculation
- Governorate and area selection

### Admin Dashboard - لوحة التحكم الإدارية
- Product management (CRUD operations)
- Category management
- Order tracking and status updates
- Customer management
- Theme and sticker management
- Site content management (CMS)
- Settings configuration

### Technical Features - مميزات تقنية
- Server-side rendering (SSR) with Next.js 16
- Full RTL (Right-to-Left) support
- Type-safe development with TypeScript
- Form validation with React Hook Form + Zod
- Supabase for authentication and database
- Responsive design with Tailwind CSS 4

---

## Tech Stack - التقنيات المستخدمة

| Technology | Version | Purpose |
|------------|---------|---------|
| Next.js | 16.3.5 | React framework with App Router |
| React | 19.2.8 | UI library |
| TypeScript | 5.x | Type-safe development |
| Tailwind CSS | 4.x | Utility-first CSS framework |
| Supabase | 2.116.0 | Backend-as-a-Service (Auth, DB, Storage) |
| React Hook Form | 7.88.0 | Form state management |
| Zod | 4.6.5 | Schema validation |
| Lucide React | 1.47.0 | Icon library |
| date-fns | 4.4.0 | Date formatting utilities |
| clsx + tailwind-merge | - | Conditional class merging |

---

## Prerequisites - المتطلبات المسبقة

Before you begin, ensure you have the following installed:

- **Node.js** 20.9+ (recommended: latest LTS)
- **npm** (comes with Node.js)
- A **Supabase** account and project ([supabase.com](https://supabase.com))

---

## Installation - التثبيت

### 1. Clone the repository

```bash
git clone https://github.com/your-username/knoz-store.git
cd knoz-store
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Copy the example environment file and fill in your values:

```bash
cp .env.example .env.local
```

Edit `.env.local` with your configuration (see [Environment Variables](#environment-variables---متغيرات البيئة) below).

### 4. Set up the database

In your Supabase dashboard, go to the SQL Editor and run the following files in order:

1. **Schema** — Run `database/schema.sql` to create all tables
2. **Seed data** — Run `database/seed.sql` to populate initial data

### 5. Start the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Project Structure - هيكل المشروع

```
knoz-store/
├── database/
│   ├── schema.sql          # Database schema (tables, indexes)
│   └── seed.sql            # Seed data for initial setup
├── public/                 # Static assets (SVGs, robots.txt)
├── src/
│   ├── app/
│   │   ├── (storefront)/   # Customer-facing routes
│   │   │   ├── account/    # User account pages
│   │   │   ├── cart/       # Shopping cart
│   │   │   ├── checkout/   # Checkout flow
│   │   │   ├── order-confirmation/
│   │   │   ├── shop/       # Product catalog
│   │   │   └── page.tsx    # Homepage
│   │   ├── admin/          # Admin dashboard routes
│   │   │   ├── categories/
│   │   │   ├── content/
│   │   │   ├── customers/
│   │   │   ├── login/
│   │   │   ├── orders/
│   │   │   ├── products/
│   │   │   ├── settings/
│   │   │   ├── stickers/
│   │   │   └── themes/
│   │   ├── layout.tsx      # Root layout (RTL, fonts)
│   │   ├── globals.css     # Global styles (Tailwind)
│   │   ├── sitemap.ts      # Dynamic sitemap generation
│   │   ├── error.tsx       # Error boundary
│   │   ├── loading.tsx     # Global loading state
│   │   └── not-found.tsx   # 404 page
│   ├── components/
│   │   ├── admin/          # Admin dashboard components
│   │   ├── shared/         # Shared/reusable components
│   │   ├── storefront/     # Storefront components
│   │   └── ui/             # Base UI components
│   ├── hooks/
│   │   ├── useCart.ts      # Cart state management
│   │   ├── useDebounce.ts  # Debounce utility hook
│   │   └── useSearch.ts    # Search functionality
│   ├── lib/
│   │   ├── supabase/
│   │   │   ├── client.ts   # Browser Supabase client
│   │   │   └── server.ts   # Server-side Supabase client
│   │   └── utils.ts        # Utility functions
│   ├── services/           # Data fetching & business logic
│   │   ├── categories.ts
│   │   ├── orders.ts
│   │   ├── products.ts
│   │   ├── server-categories.ts
│   │   ├── server-orders.ts
│   │   ├── server-products.ts
│   │   ├── stickers.ts
│   │   └── themes.ts
│   ├── types/
│   │   └── index.ts        # TypeScript type definitions
│   └── proxy.ts            # Proxy configuration
├── .env.example            # Environment variable template
├── .gitignore
├── next.config.ts          # Next.js configuration
├── postcss.config.mjs      # PostCSS config (Tailwind)
├── tsconfig.json           # TypeScript configuration
├── eslint.config.mjs       # ESLint configuration
└── package.json
```

---

## Admin Dashboard - لوحة التحكم الإدارية

Access the admin dashboard at:

**URL:** `http://localhost:3000/admin/login`

**Default Credentials:**
| Field | Value |
|-------|-------|
| Email | `admin@knozstore.com` |
| Password | Set via `ADMIN_PASSWORD` in `.env.local` |

The admin dashboard provides access to:
- **Products** — Add, edit, delete products with customization options
- **Categories** — Organize products into categories
- **Orders** — View and update order statuses (new, reviewing, preparing, ready_to_ship, shipped, delivered, cancelled)
- **Customers** — View customer information
- **Themes** — Manage product customization themes
- **Stickers** — Manage sticker library
- **Content** — CMS for site content
- **Settings** — Configure store settings

---

## Database Tables - جداول قاعدة البيانات

The Supabase database includes the following tables:

| Table | Description |
|-------|-------------|
| `users` | Admin and customer accounts with role-based access |
| `customers` | Customer profiles with contact and address info |
| `categories` | Product categories with slugs and sort order |
| `products` | Products with pricing, SKU, stock, and customization flags |
| `product_images` | Multiple images per product with primary flag |
| `themes` | Customization themes for products |
| `stickers` | Sticker options for product customization |
| `product_themes` | Many-to-many: products ↔ themes |
| `product_stickers` | Many-to-many: products ↔ stickers |
| `orders` | Customer orders with status tracking |
| `order_items` | Individual items within an order |
| `cart_items` | Persistent cart for logged-in users |
| `site_content` | CMS key-value content store |
| `settings` | Application settings key-value store |

---

## NPM Scripts - أوامر npm

| Command | Description |
|---------|-------------|
| `npm run dev` | Start the Next.js development server |
| `npm run build` | Build the production bundle |
| `npm run start` | Start the production server |
| `npm run lint` | Run ESLint to check code quality |

---

## Environment Variables - متغيرات البيئة

Create a `.env.local` file in the project root:

```env
# Supabase - from your Supabase project settings
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Admin - credentials for admin login
ADMIN_EMAIL=admin@knozstore.com
ADMIN_PASSWORD=your_secure_password

# Site - general site configuration
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_SITE_NAME=Knoz Store
NEXT_PUBLIC_CURRENCY=جنيه
```

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes | Supabase anonymous/public key |
| `SUPABASE_SERVICE_ROLE_KEY` | Yes | Supabase service role key (server-side only) |
| `ADMIN_EMAIL` | Yes | Admin login email |
| `ADMIN_PASSWORD` | Yes | Admin login password |
| `NEXT_PUBLIC_SITE_URL` | Yes | Site base URL |
| `NEXT_PUBLIC_SITE_NAME` | Yes | Display name for the site |
| `NEXT_PUBLIC_CURRENCY` | Yes | Currency symbol displayed in the store |

---

## Deployment - النشر

### Vercel (Recommended)

The easiest way to deploy is using [Vercel](https://vercel.com):

1. Push your code to a Git repository (GitHub, GitLab, Bitbucket)
2. Import the project on [vercel.com/new](https://vercel.com/new)
3. Configure the environment variables in the Vercel dashboard
4. Deploy — Vercel will auto-detect Next.js and configure the build

### Other Platforms

This is a standard Next.js application and can be deployed to any platform that supports Node.js 20.9+:

```bash
npm run build
npm run start
```

---

## License - الترخيص

This project is private and proprietary. All rights reserved.
