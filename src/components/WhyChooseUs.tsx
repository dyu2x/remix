import React from 'react';
import {
  Fish,
  Droplets,
  ShieldCheck,
  TrendingUp,
  Award,
  Zap,
  HeartHandshake,
  Truck,
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import { WhyChooseUsItem } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface WhyChooseUsProps {
  items?: WhyChooseUsItem[];
  title?: string;
  subtitle?: string;
}

const ICON_MAP: Record<string, React.ElementType> = {
  Fish,
  Droplets,
  ShieldCheck,
  TrendingUp,
  Award,
  Zap,
  HeartHandshake,
  Truck
};

export const WhyChooseUs: React.FC<WhyChooseUsProps> = ({ items = [], title, subtitle }) => {
  const { t } = useLanguage();

  const sectionTitle = title || t.whyChooseUsTitle;
  const sectionSubtitle = subtitle || t.whyChooseUsSubtitle;

  const displayItems = items.length > 0 ? items : [
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

  return (
    <section className="py-20 relative bg-muted/20 border-t border-border/40 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass border border-primary/30 text-xs font-semibold text-primary">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Aquaculture Advantage</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-foreground">
            {sectionTitle}
          </h2>
          <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
            {sectionSubtitle}
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {displayItems.map((item, idx) => {
            const IconComp = ICON_MAP[item.icon] || Fish;
            return (
              <div
                key={item.id || idx}
                className="glass-card rounded-3xl p-6 sm:p-7 relative flex flex-col justify-between hover:ring-2 hover:ring-primary/40 hover:-translate-y-1.5 transition-all duration-300 group shadow-lg"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary group-hover:scale-110 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                      <IconComp className="w-6 h-6" />
                    </div>
                    {item.highlight && (
                      <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-accent/15 text-accent border border-accent/25">
                        {item.highlight}
                      </span>
                    )}
                  </div>

                  <h3 className="font-extrabold text-lg sm:text-xl text-foreground mb-3 leading-snug group-hover:text-primary transition-colors">
                    {item.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="pt-6 mt-4 border-t border-border/40 flex items-center gap-2 text-xs font-semibold text-primary">
                  <CheckCircle2 className="w-4 h-4 text-accent" />
                  <span>Mesina Hatchery Standard</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
