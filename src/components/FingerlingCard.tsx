import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Minus,
  Plus,
  AlertTriangle,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  X,
  Camera
} from 'lucide-react';
import { Fingerling } from '../types';
import { ImageWithFallback } from './ImageWithFallback';

interface FingerlingCardProps {
  fingerling: Fingerling;
  index?: number;
}

export const FingerlingCard: React.FC<FingerlingCardProps> = ({ fingerling }) => {
  const [quantity, setQuantity] = useState<number>(1);
  const [activeImgIndex, setActiveImgIndex] = useState<number>(0);
  const [showLightbox, setShowLightbox] = useState<boolean>(false);

  const images = (fingerling.images && fingerling.images.length > 0)
    ? fingerling.images
    : [fingerling.image_url];
  const currentImage = images[activeImgIndex] || fingerling.image_url;

  const isLowStock = fingerling.stock_count <= fingerling.low_stock_threshold && fingerling.stock_count > 0;
  const isOutOfStock = fingerling.stock_count <= 0;

  const tiers = fingerling.price_tiers || [];

  const handlePrevImg = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveImgIndex(prev => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNextImg = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveImgIndex(prev => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const getTierInfo = () => {
    const qty = quantity || 0;
    if (qty <= 0 || tiers.length === 0) return null;
    const activeTier = tiers.find(t => qty >= t.min_qty && (!t.max_qty || qty <= t.max_qty));
    if (!activeTier) {
      // Fallback to highest tier if quantity exceeds all max_qty
      const highestTier = tiers[tiers.length - 1];
      return highestTier ? { price: Number(highestTier.price_per_unit), tier: highestTier } : null;
    }
    return { price: Number(activeTier.price_per_unit), tier: activeTier };
  };

  const currentTierInfo = getTierInfo();
  const unitPrice = currentTierInfo ? currentTierInfo.price : (tiers[0]?.price_per_unit || 0);
  const totalPrice = unitPrice * (quantity || 1);

  const handleQtyChange = (val: string) => {
    const num = parseInt(val, 10);
    if (isNaN(num) || num < 1) {
      setQuantity(1);
    } else {
      setQuantity(num);
    }
  };

  return (
    <>
      <div className="glass-card rounded-3xl overflow-hidden flex flex-col group hover:ring-2 hover:ring-primary/40 transition-all duration-300">
        {/* Card Image Header with Multiple Images Support */}
        <div className="relative aspect-[4/3] overflow-hidden bg-black/40">
          <ImageWithFallback
            src={currentImage}
            alt={`${fingerling.name} photo ${activeImgIndex + 1}`}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 cursor-pointer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />

          {/* Size Badge */}
          <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-xs font-semibold text-white pointer-events-none">
            {fingerling.size_label}
          </div>

          {/* Stock Badge & Photo Counter */}
          <div className="absolute top-3 right-3 flex items-center gap-1.5">
            {images.length > 1 && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-md border border-white/20 text-[11px] font-bold text-white shadow-md">
                <Camera className="w-3 h-3 text-primary" />
                {activeImgIndex + 1}/{images.length}
              </span>
            )}
            {isOutOfStock ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-destructive/90 text-destructive-foreground text-xs font-medium backdrop-blur-md">
                <AlertTriangle className="w-3 h-3" /> Out
              </span>
            ) : isLowStock ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-500/90 text-white text-xs font-medium backdrop-blur-md">
                <AlertTriangle className="w-3 h-3" /> Low Stock
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/90 text-white text-xs font-medium backdrop-blur-md">
                <CheckCircle2 className="w-3 h-3" /> {fingerling.stock_count.toLocaleString()} pcs
              </span>
            )}
          </div>

          {/* Multiple Image Controls */}
          {images.length > 1 && (
            <>
              <button
                type="button"
                onClick={handlePrevImg}
                aria-label="Previous photo"
                className="absolute left-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-black/60 text-white hover:bg-black/90 opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={handleNextImg}
                aria-label="Next photo"
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-black/60 text-white hover:bg-black/90 opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm"
              >
                <ChevronRight className="w-4 h-4" />
              </button>

              {/* Dots indicator */}
              <div className="absolute bottom-10 left-0 right-0 flex justify-center gap-1.5 z-10">
                {images.map((_, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveImgIndex(idx);
                    }}
                    className={`h-1.5 rounded-full transition-all ${
                      idx === activeImgIndex ? 'w-5 bg-primary' : 'w-1.5 bg-white/50 hover:bg-white'
                    }`}
                    aria-label={`Go to slide ${idx + 1}`}
                  />
                ))}
              </div>
            </>
          )}

          {/* Quick Zoom / Lightbox Trigger */}
          <button
            type="button"
            onClick={() => setShowLightbox(true)}
            aria-label="Zoom photo"
            className="absolute right-3 bottom-3 p-1.5 rounded-lg bg-black/60 text-white/80 hover:text-white hover:bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm"
            title="Inspect Photos"
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>

          {/* Name in Image Footer */}
          <div className="absolute bottom-3 left-4 right-10 pointer-events-none">
            <h3 className="text-xl font-bold text-white tracking-tight drop-shadow-md">{fingerling.name}</h3>
          </div>
        </div>

        {/* Card Body */}
        <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
          <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
            {fingerling.description}
          </p>

          {/* Multiple Image Mini Thumbnails if > 1 */}
          {images.length > 1 && (
            <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActiveImgIndex(idx)}
                  className={`w-10 h-10 rounded-xl overflow-hidden shrink-0 border-2 transition-all ${
                    idx === activeImgIndex ? 'border-primary scale-105 shadow-sm' : 'border-border/60 opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="thumb" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

          {/* Tier Price Breakdown */}
          {tiers.length > 0 && (
            <div className="space-y-2 bg-muted/40 p-3 rounded-2xl border border-border/40 text-xs">
              <div className="text-muted-foreground font-semibold uppercase tracking-wider text-[10px]">
                Volume Pricing Tiers
              </div>
              <div className="grid grid-cols-3 gap-1 text-center">
                {tiers.map((t, i) => {
                  const isActive = currentTierInfo?.tier === t;
                  return (
                    <div
                      key={i}
                      className={`py-1 px-1.5 rounded-lg transition-all ${
                        isActive
                          ? 'bg-primary text-primary-foreground font-bold shadow-sm'
                          : 'text-muted-foreground hover:bg-muted'
                      }`}
                    >
                      <div>{t.max_qty ? `${t.min_qty}-${t.max_qty}` : `${t.min_qty}+`}</div>
                      <div className="text-[11px]">₱{t.price_per_unit.toFixed(2)}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Interactive Quantity & Price Display */}
          <div className="pt-2 border-t border-border/40 space-y-3">
            <div className="flex items-center justify-between gap-3">
              <div className="text-xs text-muted-foreground font-medium">Quantity</div>
              <div className="flex items-center gap-1 bg-muted/60 p-1 rounded-xl border border-border/50">
                <button
                  type="button"
                  onClick={() => setQuantity(prev => Math.max(1, prev - 100))}
                  className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-background text-muted-foreground hover:text-foreground transition-colors"
                  title="-100"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <input
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={e => handleQtyChange(e.target.value)}
                  className="w-16 text-center text-xs font-bold bg-transparent focus:outline-none text-foreground"
                />
                <button
                  type="button"
                  onClick={() => setQuantity(prev => prev + 100)}
                  className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-background text-muted-foreground hover:text-foreground transition-colors"
                  title="+100"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="flex items-baseline justify-between">
              <div className="text-xs text-muted-foreground">Estimated Cost:</div>
              <div className="text-right">
                <span className="text-lg font-bold text-primary">₱{totalPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                <span className="text-[10px] text-muted-foreground block">₱{unitPrice.toFixed(2)} / pc</span>
              </div>
            </div>
          </div>

          {/* Inquire Action Button */}
          <div className="mt-auto pt-2">
            <Link
              to={`/order-inquiry?fingerling=${encodeURIComponent(fingerling.name)}&quantity=${quantity}`}
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground font-medium text-sm hover:bg-primary/90 transition-all group/btn shadow-md hover:shadow-primary/25"
            >
              <span>Inquire Now</span>
              <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>

      {/* LIGHTBOX MODAL */}
      {showLightbox && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fade-in">
          <div className="relative max-w-4xl w-full max-h-[90vh] flex flex-col items-center">
            <button
              onClick={() => setShowLightbox(false)}
              className="absolute -top-12 right-0 p-2 text-white/80 hover:text-white glass rounded-full"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="w-full aspect-[4/3] max-h-[70vh] rounded-3xl overflow-hidden border border-white/20 bg-black/60 relative">
              <img
                src={images[activeImgIndex]}
                alt={fingerling.name}
                className="w-full h-full object-contain"
              />

              {images.length > 1 && (
                <>
                  <button
                    onClick={handlePrevImg}
                    className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/60 text-white hover:bg-black/90 backdrop-blur-md"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button
                    onClick={handleNextImg}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/60 text-white hover:bg-black/90 backdrop-blur-md"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </>
              )}

              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white text-xs bg-black/60 backdrop-blur-md p-3 rounded-2xl border border-white/10">
                <span className="font-bold text-sm">{fingerling.name} ({fingerling.size_label})</span>
                <span>Photo {activeImgIndex + 1} of {images.length}</span>
              </div>
            </div>

            {/* Lightbox Thumbnails */}
            {images.length > 1 && (
              <div className="flex gap-2 mt-4 overflow-x-auto p-2 max-w-full">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImgIndex(idx)}
                    className={`w-14 h-14 rounded-xl overflow-hidden border-2 transition-all ${
                      idx === activeImgIndex ? 'border-primary ring-2 ring-primary/50 scale-105' : 'border-white/20 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};
