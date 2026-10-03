import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { ImageWithFallback } from './ImageWithFallback';

interface HeroSlideshowProps {
  images: string[];
  alt?: string;
}

export const HeroSlideshow: React.FC<HeroSlideshowProps> = ({ images, alt = "Catfish hatchery" }) => {
  const activeImages = images && images.length > 0
    ? images
    : ["https://media.base44.com/images/public/6a761d1d3d52f761433ccbdd/8578c9fb0_generated_18cb20b1.png"];

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (activeImages.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % activeImages.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [activeImages.length]);

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex(prev => (prev - 1 + activeImages.length) % activeImages.length);
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex(prev => (prev + 1) % activeImages.length);
  };

  return (
    <div className="absolute inset-0 overflow-hidden select-none">
      {activeImages.map((img, idx) => (
        <div
          key={idx}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            idx === currentIndex ? 'opacity-100 z-0' : 'opacity-0 pointer-events-none'
          }`}
        >
          <ImageWithFallback
            src={img}
            alt={`${alt} slide ${idx + 1}`}
            className="w-full h-full object-cover"
            fittingType="fill"
          />
        </div>
      ))}

      {/* Gradients */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/85 via-background/65 to-background z-1" />
      <div className="absolute inset-0 bg-gradient-to-r from-background/70 to-transparent z-1" />

      {/* Slide Navigation Controls if multiple */}
      {activeImages.length > 1 && (
        <div className="absolute bottom-6 right-6 z-20 flex items-center gap-2">
          <button
            onClick={handlePrev}
            aria-label="Previous Hero Image"
            className="p-2 rounded-full glass hover:bg-primary hover:text-primary-foreground text-foreground transition-all shadow-md"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full glass text-xs font-semibold text-foreground">
            <span>{currentIndex + 1}</span>
            <span className="text-muted-foreground">/</span>
            <span>{activeImages.length}</span>
          </div>
          <button
            onClick={handleNext}
            aria-label="Next Hero Image"
            className="p-2 rounded-full glass hover:bg-primary hover:text-primary-foreground text-foreground transition-all shadow-md"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};
