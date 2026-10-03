import { Fingerling, BlogArticle, SiteSettings, OrderInquiry, Sale, AdminUser, WhyChooseUsItem } from '../types';

export const defaultWhyChooseUs: WhyChooseUsItem[] = [
  {
    id: "wcu-1",
    title: "100% Pure Clarias batrachus Strain",
    description: "Selective genetic broodstock conditioning guarantees disease resistance, fast meat conversion, and authentic native taste.",
    icon: "Fish",
    highlight: "Lab Certified"
  },
  {
    id: "wcu-2",
    title: "Continuous Oxygenated Recirculation",
    description: "Advanced bio-filtration and monitored flow systems provide steady 7.5+ mg/L dissolved oxygen for zero-stress fingerling growth.",
    icon: "Droplets",
    highlight: "98% Water Purity"
  },
  {
    id: "wcu-3",
    title: "High Survival Rate (95%+)",
    description: "Pre-conditioned for transport with salinity buffering and anti-stress acclimation before dispatch across Panay and beyond.",
    icon: "ShieldCheck",
    highlight: "Field Tested"
  },
  {
    id: "wcu-4",
    title: "Volume Tiered Pricing & Farmer Support",
    description: "Transparent volume discounts tailored for both small-scale backyard fishponds and commercial aquaculture enterprises.",
    icon: "TrendingUp",
    highlight: "Direct Farm Rate"
  }
];

export const defaultSiteSettings: SiteSettings = {
  id: "6a761e8b766d388f5d359488",
  farm_name: "Mesina Farms",
  hero_title: "Aquaculture Bio-Precision",
  hero_subtitle: "Scientifically bred, sustainably raised premium catfish fingerlings. From hatchery to harvest — engineered for vitality.",
  address: "Brgy. Cabugao, Ivisan, Capiz, Philippines",
  phone: "+63 962 527 9820",
  email: "support@mesina.farm",
  lat: 11.535766,
  lng: 122.652221,
  hero_image_url: "https://media.base44.com/images/public/6a761d1d3d52f761433ccbdd/8578c9fb0_generated_18cb20b1.png",
  hero_images: [
    "https://media.base44.com/images/public/6a761d1d3d52f761433ccbdd/8578c9fb0_generated_18cb20b1.png",
    "https://base44.app/api/apps/6a761d1d3d52f761433ccbdd/files/mp/public/6a761d1d3d52f761433ccbdd/05615daa2_fishpon.jpg",
    "https://base44.app/api/apps/6a761d1d3d52f761433ccbdd/files/mp/public/6a761d1d3d52f761433ccbdd/6667e565e_fingerlings.jpg",
    "https://media.base44.com/images/public/6a761d1d3d52f761433ccbdd/019d7bdf3_generated_95e4fe92.png"
  ],
  logo_url: "https://media.base44.com/images/public/6a761d1d3d52f761433ccbdd/b90195dea_ChatGPTImageJul112026at01_54_57PM.png",
  about_image_url: "https://base44.app/api/apps/6a761d1d3d52f761433ccbdd/files/mp/public/6a761d1d3d52f761433ccbdd/05615daa2_fishpon.jpg",
  about_images: [
    "https://base44.app/api/apps/6a761d1d3d52f761433ccbdd/files/mp/public/6a761d1d3d52f761433ccbdd/05615daa2_fishpon.jpg",
    "https://media.base44.com/images/public/6a761d1d3d52f761433ccbdd/8578c9fb0_generated_18cb20b1.png",
    "https://base44.app/api/apps/6a761d1d3d52f761433ccbdd/files/mp/public/6a761d1d3d52f761433ccbdd/6667e565e_fingerlings.jpg",
    "https://media.base44.com/images/public/6a761d1d3d52f761433ccbdd/019d7bdf3_generated_95e4fe92.png",
    "https://base44.app/api/apps/6a761d1d3d52f761433ccbdd/files/mp/public/6a761d1d3d52f761433ccbdd/1ba83e32a_juvie.jpg"
  ],
  schedule: "Mon - Fri: 7:00 AM - 5:00 PM\nSaturday: By Appointment\nSunday: Closed (Farm Maintenance)",
  apple_maps_url: "https://maps.apple.com/?daddr=11.535766,122.652221",
  hero_badge: "Clarias batrachus Hatchery & Grower",
  hero_primary_btn_text: "View Catalog",
  hero_secondary_btn_text: "Place Order Inquiry",
  why_choose_us: defaultWhyChooseUs,
  smtp: {
    host: "smtp.mailgun.org",
    port: 587,
    secure: false,
    username: "notifications@mesina.farm",
    password: "smtp_password_secret",
    from_name: "Mesina Farms System",
    from_email: "notifications@mesina.farm"
  },
  zitadel: {
    enabled: false,
    issuer_url: "https://auth.mesina.farm",
    client_id: "278192039128392109@mesina_farms",
    client_secret: "zitadel_sec_99a8b7c6",
    scopes: "openid profile email urn:zitadel:iam:org:project:roles",
    redirect_uri: window.location.origin + "/connect/admin"
  },
  stats: [
    { label: "Fingerling Stages", value: "4+" },
    { label: "Water Quality", value: "98%" },
    { label: "Survival Rate", value: "95%" },
    { label: "Annual Output", value: "500K+" }
  ],
  about_kicker: "About Mesina Farms",
  about_title: "The Science of Living Inventory",
  about_paragraph_1: "At Mesina Farms, we transform traditional catfish aquaculture into a high-performance biological science. Our Clarias batrachus are raised in pristine, oxygen-rich environments with continuous water quality monitoring.",
  about_paragraph_2: "From delicate starter fingerlings to robust jumbo stockers, every growth stage is managed with precision to ensure optimal health, rapid growth, and exceptional survival rates.",
  about_features: [
    "Pristine Water Systems",
    "Bio-Secure Facilities",
    "Pure Clarias batrachus",
    "Data-Driven Growth"
  ],
  calc_kicker: "Instant Quote",
  calc_title: "Calculate Your Order",
  calc_subtitle: "Select a fingerling stage and quantity to instantly see volume-based tier pricing and your total cost.",
  visit_title: "Visit Our Hatchery",
  visit_description: "Visit Mesina Farms in Ivisan, Capiz for fingerling inspections, logistics pickup, and technical consultations.",
  location_page_title: "Hatchery Location",
  location_page_subtitle: "Visit Mesina Farms in Ivisan, Capiz for fingerling inspections, logistics pickup, and technical consultations.",
  footer_bio: "Premium Clarias batrachus catfish hatchery and grower. Scientifically bred, sustainably raised fingerlings for aquaculture excellence.",
  footer_highlights: [
    "Pure Clarias batrachus Strain",
    "High FCR & Survival Rates",
    "Oxygen-Rich Hatchery Flow",
    "Tiered Volume Pricing"
  ],
  footer_copyright: "Mesina Farms. All rights reserved."
};

export const defaultFingerlings: Fingerling[] = [
  {
    id: "6a761e8bdb8dd58c561a10cf",
    name: "Starter Fingerlings",
    scientific_name: "Clarias batrachus",
    category: "Clarias batrachus",
    size_label: "2-3 cm",
    stock_count: 50000,
    low_stock_threshold: 5000,
    sort_order: 1,
    description: "Newly hatched Clarias batrachus fingerlings, ideal for starting your own grow-out ponds. Highest quality, disease-free stock with proven genetics.",
    image_url: "https://media.base44.com/images/public/6a761d1d3d52f761433ccbdd/7bcb46f1c_generated_dc7ba010.png",
    images: [
      "https://media.base44.com/images/public/6a761d1d3d52f761433ccbdd/7bcb46f1c_generated_dc7ba010.png",
      "https://media.base44.com/images/public/6a761d1d3d52f761433ccbdd/8578c9fb0_generated_18cb20b1.png",
      "https://base44.app/api/apps/6a761d1d3d52f761433ccbdd/files/mp/public/6a761d1d3d52f761433ccbdd/6667e565e_fingerlings.jpg"
    ],
    price_tiers: [
      { min_qty: 1, max_qty: 499, price_per_unit: 3.5, description: "Standard Backyard Pack (1 - 499 pcs)" },
      { min_qty: 500, max_qty: 4999, price_per_unit: 2.8, description: "Small Grow-Out Discount (500 - 4,999 pcs)" },
      { min_qty: 5000, max_qty: null, price_per_unit: 2.2, description: "Commercial Bulk Wholesale (5,000+ pcs)" }
    ]
  },
  {
    id: "6a761e8bdb8dd58c561a10d0",
    name: "Standard Grow-out",
    scientific_name: "Clarias batrachus",
    category: "Clarias batrachus",
    size_label: "5-8 cm",
    stock_count: 18000,
    low_stock_threshold: 2000,
    sort_order: 2,
    description: "Healthy juvenile Clarias batrachus ready for grow-out phase. Acclimated to pond conditions with robust immune systems and rapid growth potential.",
    image_url: "https://base44.app/api/apps/6a761d1d3d52f761433ccbdd/files/mp/public/6a761d1d3d52f761433ccbdd/6667e565e_fingerlings.jpg",
    images: [
      "https://base44.app/api/apps/6a761d1d3d52f761433ccbdd/files/mp/public/6a761d1d3d52f761433ccbdd/6667e565e_fingerlings.jpg",
      "https://base44.app/api/apps/6a761d1d3d52f761433ccbdd/files/mp/public/6a761d1d3d52f761433ccbdd/1ba83e32a_juvie.jpg",
      "https://media.base44.com/images/public/6a761d1d3d52f761433ccbdd/019d7bdf3_generated_95e4fe92.png"
    ],
    price_tiers: [
      { min_qty: 1, max_qty: 499, price_per_unit: 5.5, description: "Retail / Small Tank Starter (1 - 499 pcs)" },
      { min_qty: 500, max_qty: 2999, price_per_unit: 4.5, description: "Mid-tier Volume Rate (500 - 2,999 pcs)" },
      { min_qty: 3000, max_qty: null, price_per_unit: 3.8, description: "High-Volume Commercial Pond (3,000+ pcs)" }
    ]
  },
  {
    id: "6a761e8bdb8dd58c561a10d1",
    name: "Advance Stocker",
    scientific_name: "Clarias batrachus",
    category: "Clarias batrachus",
    size_label: "10-15 cm",
    stock_count: 7500,
    low_stock_threshold: 1000,
    sort_order: 3,
    description: "Premium-grade Clarias batrachus at advanced growth stage. Excellent feed conversion ratio and rapid weight gain. Ready for final grow-out.",
    image_url: "https://media.base44.com/images/public/6a761d1d3d52f761433ccbdd/b00b4c562_generated_fb0c10ce.png",
    images: [
      "https://media.base44.com/images/public/6a761d1d3d52f761433ccbdd/b00b4c562_generated_fb0c10ce.png",
      "https://base44.app/api/apps/6a761d1d3d52f761433ccbdd/files/mp/public/6a761d1d3d52f761433ccbdd/1ba83e32a_juvie.jpg",
      "https://media.base44.com/images/public/6a761d1d3d52f761433ccbdd/8578c9fb0_generated_18cb20b1.png"
    ],
    price_tiers: [
      { min_qty: 1, max_qty: 299, price_per_unit: 12.0, description: "Standard Rate (1 - 299 pcs)" },
      { min_qty: 300, max_qty: 1999, price_per_unit: 10.0, description: "Fast-Track Harvest Tier (300 - 1,999 pcs)" },
      { min_qty: 2000, max_qty: null, price_per_unit: 8.5, description: "Enterprise Stocking Tier (2,000+ pcs)" }
    ]
  },
  {
    id: "6a761e8bdb8dd58c561a10d2",
    name: "Jumbo Stocker",
    scientific_name: "Clarias batrachus",
    category: "Clarias batrachus",
    size_label: "20-25 cm",
    stock_count: 1200,
    low_stock_threshold: 200,
    sort_order: 4,
    description: "Top-tier Clarias batrachus at jumbo size. Ideal for immediate harvest preparation or as premium breeding stock with exceptional genetics.",
    image_url: "https://base44.app/api/apps/6a761d1d3d52f761433ccbdd/files/mp/public/6a761d1d3d52f761433ccbdd/1ba83e32a_juvie.jpg",
    images: [
      "https://base44.app/api/apps/6a761d1d3d52f761433ccbdd/1ba83e32a_juvie.jpg",
      "https://base44.app/api/apps/6a761d1d3d52f761433ccbdd/files/mp/public/6a761d1d3d52f761433ccbdd/05615daa2_fishpon.jpg",
      "https://media.base44.com/images/public/6a761d1d3d52f761433ccbdd/b00b4c562_generated_fb0c10ce.png"
    ],
    price_tiers: [
      { min_qty: 1, max_qty: 99, price_per_unit: 35.0, description: "Selected Breeder / Table Size (1 - 99 pcs)" },
      { min_qty: 100, max_qty: 499, price_per_unit: 30.0, description: "Batch Restock Discount (100 - 499 pcs)" },
      { min_qty: 500, max_qty: null, price_per_unit: 25.0, description: "Commercial Harvest Supply (500+ pcs)" }
    ]
  }
];

export const defaultArticles: BlogArticle[] = [
  {
    id: "6a761e8b2f63ade9591752cf",
    title: "Essential Water Quality Parameters for Clarias batrachus",
    excerpt: "Understanding temperature, pH, and dissolved oxygen is critical for healthy catfish. Learn the optimal ranges and how to maintain them.",
    category: "Water Quality",
    author: "Mesina Farms Aquaculture Team",
    published_date: "2026-07-15",
    read_time: "5 min read",
    image_url: "https://media.base44.com/images/public/6a761d1d3d52f761433ccbdd/aa6a39100_generated_c37d0ca2.png",
    images: [
      "https://media.base44.com/images/public/6a761d1d3d52f761433ccbdd/aa6a39100_generated_c37d0ca2.png",
      "https://media.base44.com/images/public/6a761d1d3d52f761433ccbdd/8578c9fb0_generated_18cb20b1.png",
      "https://base44.app/api/apps/6a761d1d3d52f761433ccbdd/files/mp/public/6a761d1d3d52f761433ccbdd/05615daa2_fishpon.jpg"
    ],
    video_url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    video_type: "youtube",
    status: "active",
    featured: true,
    content: `## Why Water Quality Matters

Water quality is the foundation of successful Clarias batrachus aquaculture. Poor water conditions lead to stress, disease, and mortality.

### Key Parameters

**Temperature:** 24-30°C is optimal. Below 24°C slows metabolism; above 32°C causes stress.

**pH:** 6.5-9.0 is ideal. Acidic water below 6.5 affects nutrient absorption.

**Dissolved Oxygen:** Above 5 mg/L is required. Below 3 mg/L risks mass mortality.

### Monitoring Tips

- Test water daily during the first month of stocking
- Use aerators during hot weather and dawn hours
- Perform partial water changes weekly (15-20%)
- Monitor ammonia and nitrite levels with liquid test kits regularly`
  },
  {
    id: "6a761e8b2f63ade9591752d0",
    title: "Setting Up Your Catfish Hatchery Tank System",
    excerpt: "A complete guide to designing and building an efficient Clarias batrachus hatchery from tank selection to filtration.",
    category: "Hatchery Setup",
    author: "Mesina Farms Technical Staff",
    published_date: "2026-07-20",
    read_time: "7 min read",
    image_url: "https://media.base44.com/images/public/6a761d1d3d52f761433ccbdd/019d7bdf3_generated_95e4fe92.png",
    images: [
      "https://media.base44.com/images/public/6a761d1d3d52f761433ccbdd/019d7bdf3_generated_95e4fe92.png",
      "https://base44.app/api/apps/6a761d1d3d52f761433ccbdd/files/mp/public/6a761d1d3d52f761433ccbdd/6667e565e_fingerlings.jpg"
    ],
    status: "active",
    featured: false,
    content: `## Planning Your Hatchery

A well-designed hatchery system is essential for raising healthy Clarias batrachus fingerlings with minimal mortality.

### Tank Selection

Choose tanks made from food-grade HDPE or smooth cement. Circular tanks are preferred for better water circulation and natural self-cleaning waste vortex.

### Filtration System

Install a multi-stage biofilter. Mechanical brush filters remove suspended solids, while volcanic cinder or moving bed bio-media (MBBR) neutralize toxic ammonia into harmless nitrates.

### Aeration

Proper continuous aeration maintains dissolved oxygen at peak saturation. Use regenerative blowers with ceramic air stones for uniform micro-bubble distribution.`
  },
  {
    id: "6a761e8b2f63ade9591752d1",
    title: "Fingerling Care: First 30 Days After Stocking",
    excerpt: "The critical first month determines survival rates. Follow this step-by-step guide to ensure your fingerlings thrive.",
    category: "Fingerling Care",
    author: "Mesina Farms Biologists",
    published_date: "2026-07-25",
    read_time: "6 min read",
    image_url: "https://media.base44.com/images/public/6a761d1d3d52f761433ccbdd/a09c7d64d_generated_719509ff.png",
    images: [
      "https://media.base44.com/images/public/6a761d1d3d52f761433ccbdd/a09c7d64d_generated_719509ff.png",
      "https://base44.app/api/apps/6a761d1d3d52f761433ccbdd/files/mp/public/6a761d1d3d52f761433ccbdd/1ba83e32a_juvie.jpg"
    ],
    status: "active",
    featured: false,
    content: `## The Critical First Month

The first 30 days after stocking represent 85% of total aquaculture risk. Careful acclimation and high-protein nutrition are decisive.

### Day 1-7: Acclimation

Gradually float the oxygenated bags in pond water for 25 minutes. Slowly mix pond water into the bags before gently releasing the fingerlings.

### Day 8-14: Micro-Feeding

Begin feeding extruded 42% protein starter crumble. Feed small amounts 4-5 times daily to ensure all sizes eat without polluting the pond bed.

### Day 15-21: Health Monitoring

Watch for signs of fungal patches or erratic spiraling. Maintain salt concentration at 1-2 ppt to protect fish slime coats.

### Day 22-30: Grading & Sorting

Separate fast growers (shooters) from smaller fingerlings to prevent cannibalism and guarantee uniform harvest batch weights.`
  }
];

export const defaultOrderInquiries: OrderInquiry[] = [
  {
    id: "ord-1",
    customer_name: "Ramon Santos",
    email: "ramon.santos@aquacapiz.com",
    phone: "+63 917 123 4567",
    fingerling_name: "Starter Fingerlings",
    quantity: 10000,
    message: "Requesting delivery to Roxas City pond facility by end of week.",
    status: "confirmed",
    contact_status: "contacted",
    contacted_by: "Super Administrator (super)",
    contacted_date: "2026-08-05T11:00:00Z",
    contact_notes: "Confirmed delivery schedule and transport bags via phone.",
    created_date: "2026-08-05T10:30:00Z"
  },
  {
    id: "ord-2",
    customer_name: "Maria Cruz",
    email: "m.cruz@visayasfarms.ph",
    phone: "+63 920 987 6543",
    fingerling_name: "Standard Grow-out",
    quantity: 5000,
    message: "Inquiring about bulk discount and transport aeration bags.",
    status: "pending",
    contact_status: "not_contacted",
    created_date: "2026-08-06T14:15:00Z"
  }
];

export const defaultSales: Sale[] = [
  {
    id: "sale-1",
    customer_name: "Ramon Santos",
    fingerling_name: "Starter Fingerlings",
    quantity: 10000,
    total_amount: 22000,
    sale_date: "2026-08-05"
  },
  {
    id: "sale-2",
    customer_name: "Panay Fishponds Inc.",
    fingerling_name: "Advance Stocker",
    quantity: 3000,
    total_amount: 25500,
    sale_date: "2026-08-03"
  }
];

export const defaultAdminUsers: AdminUser[] = [
  {
    id: "user-super",
    username: "super",
    password: "abc123!",
    name: "Super Administrator",
    role: "super_admin",
    permissions: [
      "hero",
      "about",
      "why_choose_us",
      "catalog",
      "articles",
      "inquiries",
      "location",
      "settings",
      "smtp_zitadel",
      "visitors"
    ],
    created_at: "2026-01-01T00:00:00Z"
  },
  {
    id: "user-moderator",
    username: "moderator",
    password: "modpass123!",
    name: "Company Website Moderator",
    role: "moderator",
    permissions: [
      "catalog",
      "articles",
      "inquiries",
      "why_choose_us"
    ],
    created_at: "2026-03-01T00:00:00Z"
  }
];
