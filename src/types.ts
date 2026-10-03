export interface PriceTier {
  min_qty: number;
  max_qty: number | null;
  price_per_unit: number;
  description?: string;
}

export interface Fingerling {
  id: string;
  name: string;
  scientific_name?: string;
  category?: string; // e.g., 'Clarias batrachus', 'Tilapia', 'Pangasius', 'Other'
  description: string;
  size_label: string;
  stock_count: number;
  low_stock_threshold: number;
  sort_order: number;
  image_url: string;
  images?: string[];
  price_tiers: PriceTier[];
  created_date?: string;
  updated_date?: string;
}

export interface BlogArticle {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  author: string;
  published_date: string;
  read_time: string;
  image_url: string;
  images?: string[];
  video_url?: string;
  video_type?: 'upload' | 'youtube' | 'facebook' | 'tiktok' | 'other';
  status: 'active' | 'inactive' | 'archived';
  featured?: boolean;
}

export interface StatItem {
  label: string;
  value: string;
}

export interface WhyChooseUsItem {
  id: string;
  title: string;
  description: string;
  icon: string;
  highlight?: string;
}

export interface SmtpConfig {
  host: string;
  port: number;
  secure: boolean;
  username: string;
  password: string;
  from_name: string;
  from_email: string;
}

export interface ZitadelConfig {
  enabled: boolean;
  issuer_url: string;
  client_id: string;
  client_secret: string;
  scopes: string;
  redirect_uri: string;
}

export interface SiteSettings {
  id: string;
  farm_name: string;
  hero_title: string;
  hero_subtitle: string;
  hero_badge?: string;
  hero_primary_btn_text?: string;
  hero_secondary_btn_text?: string;
  address: string;
  phone: string;
  email: string;
  lat: number;
  lng: number;
  hero_image_url: string;
  hero_images?: string[];
  logo_url: string;
  about_image_url: string;
  about_images?: string[];
  schedule?: string;
  apple_maps_url?: string;

  // Why Choose Us
  why_choose_us?: WhyChooseUsItem[];

  // SMTP & Zitadel Integrations
  smtp?: SmtpConfig;
  zitadel?: ZitadelConfig;

  // Front-End Content Customization
  stats?: StatItem[];
  about_kicker?: string;
  about_title?: string;
  about_paragraph_1?: string;
  about_paragraph_2?: string;
  about_features?: string[];
  calc_kicker?: string;
  calc_title?: string;
  calc_subtitle?: string;
  visit_title?: string;
  visit_description?: string;
  location_page_title?: string;
  location_page_subtitle?: string;
  footer_bio?: string;
  footer_highlights?: string[];
  footer_copyright?: string;
}

export interface OrderInquiry {
  id: string;
  customer_name: string;
  email: string;
  phone: string;
  fingerling_name: string;
  quantity: number | null;
  message: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  contact_status?: 'not_contacted' | 'contacted' | 'follow_up';
  contacted_by?: string;
  contacted_date?: string;
  contact_notes?: string;
  created_date: string;
}

export interface Sale {
  id: string;
  customer_name: string;
  fingerling_name: string;
  quantity: number;
  total_amount: number;
  sale_date: string;
}

export type PermissionModule =
  | 'hero'
  | 'about'
  | 'why_choose_us'
  | 'catalog'
  | 'articles'
  | 'inquiries'
  | 'location'
  | 'settings'
  | 'smtp_zitadel'
  | 'visitors';

export interface AdminUser {
  id: string;
  username: string;
  password: string;
  name: string;
  role: 'super_admin' | 'moderator';
  permissions: PermissionModule[];
  created_at: string;
}

export interface VisitorLog {
  id: string;
  ip: string;
  city: string;
  region: string;
  country: string;
  country_code: string;
  device: string;
  page: string;
  timestamp: string;
}

export type LanguageCode =
  | 'en'
  | 'fil'
  | 'ceb'
  | 'hil'
  | 'krj'
  | 'pam'
  | 'ilo'
  | 'bik'
  | 'war';

export interface LanguageOption {
  code: LanguageCode;
  name: string;
  nativeName: string;
  region: string;
}
