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
  discovery_endpoint?: string;
  client_id: string;
  client_secret: string;
  scopes: string;
  redirect_uri: string;
  post_logout_redirect_uri?: string;
}

export type ChatWidgetIconType =
  | 'message-circle'
  | 'message-square'
  | 'messages-square'
  | 'headset'
  | 'fish'
  | 'life-buoy'
  | 'send'
  | 'help-circle'
  | 'sparkles'
  | 'custom';

export type ChatWidgetShapeType =
  | 'circle'
  | 'squircle'
  | 'rounded'
  | 'chat-bubble'
  | 'teardrop';

export interface DensityRatioStage {
  stage_id: 'fry' | 'fingerling' | 'juvenile' | 'growout';
  stage_name: string;
  size_range: string;
  avg_weight_grams: number;
  recommended_per_m3: number; // base density for semi-intensive (fish / m³)
  min_per_m3: number;
  max_per_m3: number;
  feed_rate_percent: number; // % of body weight daily
}

export interface SystemMultiplier {
  system_id: 'extensive' | 'semi_intensive' | 'ras_biofloc';
  name: string;
  multiplier: number; // e.g. 0.6 for backyard, 1.0 for standard concrete, 1.8 for RAS
  description: string;
  aeration_req: string;
}

export interface FishTankRatioSettings {
  enabled: boolean;
  title: string;
  subtitle: string;
  stages: DensityRatioStage[];
  systems: SystemMultiplier[];
  water_depth_min_cm: number;
  water_depth_max_cm: number;
  guidance_notes?: string;
}

export interface FarmLocation {
  id: string;
  name: string;
  badge?: string;
  address: string;
  phone?: string;
  email?: string;
  schedule?: string;
  lat: number;
  lng: number;
  google_maps_url?: string;
  apple_maps_url?: string;
  mapquest_url?: string;
  enabled: boolean;
  description?: string;
}

export interface CustomHolidayOrClosure {
  id: string;
  date: string; // YYYY-MM-DD
  title: string;
  type: 'holiday' | 'maintenance' | 'special_hours' | 'closed';
  status: 'closed' | 'by_appointment' | 'special_hours' | 'regular_hours';
  time_of_operation?: string; // e.g. "7:00 AM – 12:00 PM", "Closed All Day", "8:00 AM – 3:00 PM"
  hours_note?: string;
  notes?: string;
}

export interface FarmCalendarConfig {
  enabled: boolean;
  operational_status?: 'operational' | 'non_operational' | 'by_appointment' | 'maintenance';
  status_message?: string;
  non_operational_reason?: string;
  resumption_date?: string;
  reopen_date?: string;
  title?: string;
  subtitle?: string;
  closed_on_sundays: boolean;
  sunday_hours?: string;
  saturdays_by_appointment: boolean;
  saturday_hours?: string;
  weekday_hours?: string;
  holiday_default_status: 'closed' | 'by_appointment' | 'special_hours' | 'regular_hours';
  holiday_default_hours?: string;
  custom_closures: CustomHolidayOrClosure[];
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
  hero_interval_seconds?: number; // Timeframe between hero pictures in seconds (e.g., 180 for 3 minutes)
  hero_transition_duration_seconds?: number; // Transition animation speed in seconds (e.g., 1.5)
  hero_transition_effect?: 'random' | 'fade' | 'zoom-in' | 'zoom-out' | 'slide-left' | 'slide-right' | 'slide-up' | 'blur-fade';
  logo_url: string;
  about_image_url: string;
  about_images?: string[];
  schedule?: string;
  apple_maps_url?: string;
  mapquest_url?: string;

  // Additional Location (Location 2)
  location_2?: FarmLocation;

  // Farm Operational Calendar & Philippine Holidays
  farm_calendar?: FarmCalendarConfig;

  // Why Choose Us
  why_choose_us?: WhyChooseUsItem[];

  // Live Chat Support Widget Customization
  chat_widget_enabled?: boolean;
  chat_widget_icon?: ChatWidgetIconType;
  chat_widget_shape?: ChatWidgetShapeType;
  chat_widget_custom_icon_url?: string;

  // Fish to Tank Ratio Calculator Guide Settings
  tank_calculator?: FishTankRatioSettings;

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
  | 'visitors'
  | 'chat_support'
  | 'tank_calculator';

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
