export interface PriceTier {
  min_qty: number;
  max_qty: number | null;
  price_per_unit: number;
}

export interface Fingerling {
  id: string;
  name: string;
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
  featured?: boolean;
}

export interface StatItem {
  label: string;
  value: string;
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
  logo_url: string;
  about_image_url: string;
  about_images?: string[];
  schedule?: string;

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
