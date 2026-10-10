import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Pause, Play, Sparkles } from 'lucide-react';
import { ImageWithFallback } from './ImageWithFallback';

export type HeroTransitionEffect =
  | 'random'
  | 'fade'
  | 'zoom-in'
  | 'zoom-out'
  | 'slide-left'
  | 'slide-right'
  | 'slide-up'
  | 'blur-fade'
  | 'diagonal-drift';

const EFFECT_POOL: Array<Exclude<HeroTransitionEffect, 'random'>> = [
  'zoom-in',
  'zoom-out',
  'slide-left',
  'slide-right',
  'slide-up',
  'blur-fade',
  'diagonal-drift',
  'fade',
];

interface HeroSlideshowProps {
  images: string[];
  alt?: string;
  intervalSeconds?: number; // Timeframe between hero pictures (default 180s = 3 minutes)
  transitionDurationSeconds?: number; // Transition speed (default 1.5s)
  transitionEffect?: HeroTransitionEffect; // Animation style (default 'random')
}

export const HeroSlideshow: React.FC<HeroSlideshowProps> = ({
  images,
  alt = 'Catfish hatchery',
  intervalSeconds = 180, // 3 minutes default
  transitionDurationSeconds = 1.5, // 1.5s slow transition
  transitionEffect = 'random',
}) => {
  const activeImages = images && images.length > 0
    ? images
    : ['https://media.base44.com/images/public/6a761d1d3d52f761433ccbdd/8578c9fb0_generated_18cb20b1.png'];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [prevIndex, setPrevIndex] = useState<number | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [activeEffect, setActiveEffect] = useState<Exclude<HeroTransitionEffect, 'random'>>('zoom-in');
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(0);

  const transitionTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const intervalTimerRef = useRef<NodeJS.Timeout | null>(null);
  const progressTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Pick a random effect different from current
  const getRandomEffect = useCallback((current: Exclude<HeroTransitionEffect, 'random'>) => {
    const candidates = EFFECT_POOL.filter(e => e !== current);
    return candidates[Math.floor(Math.random() * candidates.length)] || 'zoom-in';
  }, []);

  const triggerTransition = useCallback((nextIdx: number) => {
    if (activeImages.length <= 1) return;

    // Determine the transition effect for this change
    const chosenEffect = transitionEffect === 'random'
      ? getRandomEffect(activeEffect)
      : (transitionEffect as Exclude<HeroTransitionEffect, 'random'>);

    setActiveEffect(chosenEffect);
    setPrevIndex(currentIndex);
    setCurrentIndex(nextIdx);
    setIsTransitioning(true);
    setProgress(0);

    if (transitionTimeoutRef.current) clearTimeout(transitionTimeoutRef.current);
    transitionTimeoutRef.current = setTimeout(() => {
      setIsTransitioning(false);
      setPrevIndex(null);
    }, (transitionDurationSeconds || 1.5) * 1000);
  }, [activeImages.length, currentIndex, activeEffect, transitionEffect, transitionDurationSeconds, getRandomEffect]);

  const handleNext = useCallback(() => {
    const nextIdx = (currentIndex + 1) % activeImages.length;
    triggerTransition(nextIdx);
  }, [currentIndex, activeImages.length, triggerTransition]);

  const handlePrev = useCallback(() => {
    const prevIdx = (currentIndex - 1 + activeImages.length) % activeImages.length;
    triggerTransition(prevIdx);
  }, [currentIndex, activeImages.length, triggerTransition]);

  // Main automatic timeframe interval timer (e.g. 3 minutes = 180 seconds)
  useEffect(() => {
    if (activeImages.length <= 1 || isPaused) return;

    const intervalMs = Math.max(5000, (intervalSeconds || 180) * 1000);

    // Progress bar ticker (updates every 500ms)
    const progressIntervalMs = 500;
    const progressIncrement = (progressIntervalMs / intervalMs) * 100;

    progressTimerRef.current = setInterval(() => {
      setProgress(prev => Math.min(100, prev + progressIncrement));
    }, progressIntervalMs);

    intervalTimerRef.current = setTimeout(() => {
      handleNext();
    }, intervalMs);

    return () => {
      if (intervalTimerRef.current) clearTimeout(intervalTimerRef.current);
      if (progressTimerRef.current) clearInterval(progressTimerRef.current);
    };
  }, [activeImages.length, currentIndex, intervalSeconds, isPaused, handleNext]);

  // Clean up timeouts on unmount
  useEffect(() => {
    return () => {
      if (transitionTimeoutRef.current) clearTimeout(transitionTimeoutRef.current);
      if (intervalTimerRef.current) clearTimeout(intervalTimerRef.current);
      if (progressTimerRef.current) clearInterval(progressTimerRef.current);
    };
  }, []);

  // Compute transform and filter styles based on chosen transition effect
  const getSlideStyle = (idx: number): React.CSSProperties => {
    const isCurrent = idx === currentIndex;
    const isPrevious = idx === prevIndex && isTransitioning;
    const dur = transitionDurationSeconds || 1.5;

    const baseTransition = `opacity ${dur}s cubic-bezier(0.25, 1, 0.4, 1), transform ${dur}s cubic-bezier(0.25, 1, 0.4, 1), filter ${dur}s cubic-bezier(0.25, 1, 0.4, 1)`;

    if (isCurrent) {
      return {
        transition: baseTransition,
        opacity: 1,
        transform: 'translate3d(0, 0, 0) scale(1)',
        filter: 'blur(0px)',
        zIndex: 2,
      };
    }

    if (isPrevious) {
      let outgoingTransform = 'scale(1)';
      if (activeEffect === 'zoom-in') outgoingTransform = 'scale(1.08)';
      if (activeEffect === 'zoom-out') outgoingTransform = 'scale(0.94)';
      if (activeEffect === 'slide-left') outgoingTransform = 'translate3d(-6%, 0, 0)';
      if (activeEffect === 'slide-right') outgoingTransform = 'translate3d(6%, 0, 0)';
      if (activeEffect === 'slide-up') outgoingTransform = 'translate3d(0, -5%, 0)';
      if (activeEffect === 'diagonal-drift') outgoingTransform = 'translate3d(-3%, 3%, 0) scale(0.97)';

      return {
        transition: baseTransition,
        opacity: 0,
        transform: outgoingTransform,
        filter: activeEffect === 'blur-fade' ? 'blur(8px)' : 'blur(0px)',
        zIndex: 1,
        pointerEvents: 'none',
      };
    }

    // Inactive slides (pre-positioned for next animation)
    let incomingTransform = 'scale(1)';
    let incomingFilter = 'blur(0px)';
    if (activeEffect === 'zoom-in') incomingTransform = 'scale(1.12)';
    if (activeEffect === 'zoom-out') incomingTransform = 'scale(0.92)';
    if (activeEffect === 'slide-left') incomingTransform = 'translate3d(7%, 0, 0)';
    if (activeEffect === 'slide-right') incomingTransform = 'translate3d(-7%, 0, 0)';
    if (activeEffect === 'slide-up') incomingTransform = 'translate3d(0, 6%, 0)';
    if (activeEffect === 'blur-fade') incomingFilter = 'blur(10px)';
    if (activeEffect === 'diagonal-drift') incomingTransform = 'translate3d(3%, -3%, 0) scale(1.04)';

    return {
      transition: baseTransition,
      opacity: 0,
      transform: incomingTransform,
      filter: incomingFilter,
      zIndex: 0,
      pointerEvents: 'none',
    };
  };

  const getEffectDisplayName = (eff: string) => {
    switch (eff) {
      case 'zoom-in': return 'Cinematic Zoom In';
      case 'zoom-out': return 'Gentle Zoom Out';
      case 'slide-left': return 'Smooth Slide Left';
      case 'slide-right': return 'Smooth Slide Right';
      case 'slide-up': return 'Upward Drift';
      case 'blur-fade': return 'Soft Blur Fade';
      case 'diagonal-drift': return 'Diagonal Drift';
      default: return 'Smooth Cross-Fade';
    }
  };

  return (
    <div className="absolute inset-0 overflow-hidden select-none">
      {/* Slides with smooth 1.5s random transition */}
      {activeImages.map((img, idx) => (
        <div
          key={idx}
          style={getSlideStyle(idx)}
          className="absolute inset-0 will-change-transform will-change-opacity"
        >
          <ImageWithFallback
            src={img}
            alt={`${alt} slide ${idx + 1}`}
            className="w-full h-full object-cover"
            fittingType="fill"
          />
        </div>
      ))}

      {/* Atmospheric Gradients */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/85 via-background/65 to-background z-1" />
      <div className="absolute inset-0 bg-gradient-to-r from-background/70 to-transparent z-1" />

      {/* Slide Navigation & Timeframe Controls */}
      {activeImages.length > 1 && (
        <div className="absolute bottom-6 right-6 z-20 flex items-center gap-2">
          {/* Pause / Play Auto-cycle */}
          <button
            onClick={() => setIsPaused(!isPaused)}
            title={isPaused ? 'Resume 3-min Slideshow' : 'Pause Slideshow'}
            aria-label={isPaused ? 'Play' : 'Pause'}
            className="p-2 rounded-full glass hover:bg-primary/20 text-foreground transition-all shadow-md"
          >
            {isPaused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
          </button>

          {/* Previous Slide */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              handlePrev();
            }}
            aria-label="Previous Hero Image"
            title="Previous (triggers random transition)"
            className="p-2 rounded-full glass hover:bg-primary hover:text-primary-foreground text-foreground transition-all shadow-md active:scale-95"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {/* Current / Total Counter with Timeframe Progress */}
          <div className="relative overflow-hidden flex items-center gap-1.5 px-3 py-1.5 rounded-full glass text-xs font-semibold text-foreground shadow-md">
            {/* Subtle progress fill showing interval elapsed */}
            {!isPaused && (
              <div
                className="absolute inset-y-0 left-0 bg-primary/15 transition-all duration-500 ease-linear pointer-events-none"
                style={{ width: `${progress}%` }}
              />
            )}
            <span className="relative z-1">{currentIndex + 1}</span>
            <span className="relative z-1 text-muted-foreground">/</span>
            <span className="relative z-1">{activeImages.length}</span>

            {/* Random transition indicator badge */}
            {transitionEffect === 'random' && (
              <span
                title={`Active Transition: ${getEffectDisplayName(activeEffect)}`}
                className="relative z-1 flex items-center ml-1 text-primary opacity-80"
              >
                <Sparkles className="w-3 h-3 animate-pulse" />
              </span>
            )}
          </div>

          {/* Next Slide */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleNext();
            }}
            aria-label="Next Hero Image"
            title="Next (triggers random transition)"
            className="p-2 rounded-full glass hover:bg-primary hover:text-primary-foreground text-foreground transition-all shadow-md active:scale-95"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};
