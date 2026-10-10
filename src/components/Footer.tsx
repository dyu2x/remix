import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Fish } from 'lucide-react';
import { SiteSettings } from '../types';
import { ImageWithFallback } from './ImageWithFallback';
import { HotlineChatBadges } from './HotlineChatBadges';

interface FooterProps {
  settings: SiteSettings;
}

export const Footer: React.FC<FooterProps> = ({ settings }) => {
  return (
    <footer className="bg-card/60 border-t border-border/50 pt-16 pb-12 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand Info */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full overflow-hidden ring-2 ring-primary/30">
                <ImageWithFallback
                  src={settings.logo_url}
                  alt={settings.farm_name}
                  className="w-full h-full object-contain p-0.5"
                  fittingType="contain"
                />
              </div>
              <span className="font-heading font-bold text-xl tracking-tight text-foreground">
                {settings.farm_name.includes(' ') ? (
                  <>
                    {settings.farm_name.substring(0, settings.farm_name.lastIndexOf(' '))} <span className="text-primary">{settings.farm_name.split(' ').pop()}</span>
                  </>
                ) : (
                  <span className="text-primary">{settings.farm_name}</span>
                )}
              </span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {settings.footer_bio || "Premium Clarias batrachus catfish hatchery and grower. Scientifically bred, sustainably raised fingerlings for aquaculture excellence."}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-sm uppercase tracking-wider mb-4 text-foreground">
              Navigation
            </h4>
            <ul className="space-y-2.5 text-sm text-muted-foreground">
              <li>
                <Link to="/" className="hover:text-primary transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/catalog" className="hover:text-primary transition-colors">
                  Fingerling Catalog
                </Link>
              </li>
              <li>
                <Link to="/fish-care" className="hover:text-primary transition-colors">
                  Fish Care & Guides
                </Link>
              </li>
              <li>
                <Link to="/location" className="hover:text-primary transition-colors">
                  Farm Location
                </Link>
              </li>
              <li>
                <Link to="/order-inquiry" className="hover:text-primary transition-colors">
                  Order Inquiry
                </Link>
              </li>
            </ul>
          </div>

          {/* Bio-Care & Hatchery */}
          <div>
            <h4 className="font-semibold text-sm uppercase tracking-wider mb-4 text-foreground">
              Aquaculture Tech
            </h4>
            <ul className="space-y-2.5 text-sm text-muted-foreground">
              {(settings.footer_highlights && settings.footer_highlights.length > 0
                ? settings.footer_highlights
                : [
                    'Pure Clarias batrachus Strain',
                    'High FCR & Survival Rates',
                    'Oxygen-Rich Hatchery Flow',
                    'Tiered Volume Pricing'
                  ]
              ).map((highlight, idx) => (
                <li key={idx} className="flex items-center gap-2">
                  <Fish className="w-4 h-4 text-primary shrink-0" />
                  <span>{highlight}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h4 className="font-semibold text-sm uppercase tracking-wider mb-4 text-foreground">
              Farm Contact
            </h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                <div>
                  <span>{settings.address}</span>
                  {settings.location_2 && settings.location_2.enabled && (
                    <div className="text-[11px] text-muted-foreground mt-1">
                      <b className="text-foreground">Location 2:</b> {settings.location_2.address}
                    </div>
                  )}
                </div>
              </li>
              <li className="flex items-center gap-3 flex-wrap">
                <Phone className="w-4 h-4 text-primary shrink-0" />
                <a href={`tel:${settings.phone}`} className="hover:text-primary transition-colors font-semibold">
                  {settings.phone}
                </a>
                <HotlineChatBadges phone={settings.phone} variant="inline" />
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-primary shrink-0" />
                <a href={`mailto:${settings.email}`} className="hover:text-primary transition-colors">
                  {settings.email}
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-8 border-t border-border/40 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} {settings.farm_name}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};
