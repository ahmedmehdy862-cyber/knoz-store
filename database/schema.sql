-- Knoz Store Database Schema for Supabase

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Users table (admin accounts)
create table if not exists users (
  id uuid primary key default uuid_generate_v4(),
  email text unique not null,
  password_hash text not null,
  name text not null,
  role text not null default 'customer' check (role in ('admin', 'customer')),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Customers table
create table if not exists customers (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references users(id) on delete cascade,
  name text not null,
  phone text not null,
  email text,
  address text,
  governorate text,
  area text,
  created_at timestamptz default now()
);

-- Categories table
create table if not exists categories (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  slug text unique not null,
  description text,
  image_url text,
  is_active boolean default true,
  sort_order integer default 0,
  created_at timestamptz default now()
);

-- Products table
create table if not exists products (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  slug text unique not null,
  description text,
  price numeric(10,2) not null,
  old_price numeric(10,2),
  sku text,
  category_id uuid references categories(id) on delete set null,
  is_active boolean default true,
  is_featured boolean default false,
  badge text,
  customization_enabled boolean default false,
  allows_name boolean default false,
  allows_theme boolean default false,
  allows_sticker boolean default false,
  allows_image_upload boolean default false,
  allows_notes boolean default false,
  stock integer default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Product images table
create table if not exists product_images (
  id uuid primary key default uuid_generate_v4(),
  product_id uuid references products(id) on delete cascade,
  url text not null,
  alt_text text,
  sort_order integer default 0,
  is_primary boolean default false
);

-- Themes table
create table if not exists themes (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  slug text unique not null,
  description text,
  preview_url text,
  is_active boolean default true,
  sort_order integer default 0,
  created_at timestamptz default now()
);

-- Stickers table
create table if not exists stickers (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  slug text unique not null,
  description text,
  preview_url text,
  is_active boolean default true,
  sort_order integer default 0,
  created_at timestamptz default now()
);

-- Product-Themes junction table
create table if not exists product_themes (
  product_id uuid references products(id) on delete cascade,
  theme_id uuid references themes(id) on delete cascade,
  primary key (product_id, theme_id)
);

-- Product-Stickers junction table
create table if not exists product_stickers (
  product_id uuid references products(id) on delete cascade,
  sticker_id uuid references stickers(id) on delete cascade,
  primary key (product_id, sticker_id)
);

-- Orders table
create table if not exists orders (
  id uuid primary key default uuid_generate_v4(),
  order_number text unique not null,
  customer_id uuid references customers(id) on delete set null,
  status text not null default 'new' check (status in ('new', 'reviewing', 'preparing', 'ready_to_ship', 'shipped', 'delivered', 'cancelled')),
  subtotal numeric(10,2) not null,
  delivery_fee numeric(10,2) default 0,
  total numeric(10,2) not null,
  phone text not null,
  email text,
  governorate text,
  area text,
  address text,
  notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Order items table
create table if not exists order_items (
  id uuid primary key default uuid_generate_v4(),
  order_id uuid references orders(id) on delete cascade,
  product_id uuid references products(id) on delete set null,
  product_name text not null,
  product_price numeric(10,2) not null,
  quantity integer not null default 1,
  customization_name text,
  customization_theme text,
  customization_sticker text,
  customization_notes text,
  customization_image_url text
);

-- Cart items table (for logged-in users)
create table if not exists cart_items (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references users(id) on delete cascade,
  product_id uuid references products(id) on delete cascade,
  quantity integer not null default 1,
  customization jsonb default '{}',
  created_at timestamptz default now()
);

-- Site content table (CMS)
create table if not exists site_content (
  id uuid primary key default uuid_generate_v4(),
  key text unique not null,
  value jsonb not null default '{}',
  updated_at timestamptz default now()
);

-- Settings table
create table if not exists settings (
  id uuid primary key default uuid_generate_v4(),
  key text unique not null,
  value jsonb not null default '{}',
  updated_at timestamptz default now()
);

-- Create indexes
create index if not exists idx_products_category on products(category_id);
create index if not exists idx_products_slug on products(slug);
create index if not exists idx_products_active on products(is_active);
create index if not exists idx_products_featured on products(is_featured);
create index if not exists idx_orders_status on orders(status);
create index if not exists idx_orders_customer on orders(customer_id);
create index if not exists idx_order_items_order on order_items(order_id);
create index if not exists idx_categories_slug on categories(slug);
create index if not exists idx_cart_items_user on cart_items(user_id);
