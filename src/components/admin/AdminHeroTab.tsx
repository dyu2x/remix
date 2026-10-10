import React, { useState } from 'react';
import {
  Image as ImageIcon,
  Upload,
  Trash2,
  Sparkles,
  Star,
  Clock,
  Sliders,
  Play,
  RefreshCw,
  Eye,
  Check
} from 'lucide-react';
import { SiteSettings } from '../../types';

interface AdminHeroTabProps {
  settings: SiteSettings;
  onUpdateSettings: (settings: SiteSettings) => void;
}

export const AdminHeroTab: React.FC<AdminHeroTabProps> = ({ settings, onUpdateSettings }) => {
  const [form, setForm] = useState<SiteSettings>({
    ...settings,
    hero_interval_seconds: settings.hero_interval_seconds ?? 180,
    hero_transition_duration_seconds: settings.hero_transition_duration_seconds ?? 1.5,
    hero_transition_effect: settings.hero_transition_effect ?? 'random',
  });
  const [newImgUrl, setNewImgUrl] = useState('');
  const [toast, setToast] = useState('');

  // Live test preview state
  const [previewIndex, setPreviewIndex] = useState(0);
  const [previewEffectActive, setPreviewEffectActive] = useState('random');
  const [previewIsAnimating, setPreviewIsAnimating] = useState(false);

  const heroImages = form.hero_images && form.hero_images.length > 0
    ? form.hero_images
    : [form.hero_image_url];

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    (Array.from(files) as File[]).forEach(file => {
      const reader = new FileReader();
      reader.onload = ev => {
        if (ev.target?.result) {
          const dataUrl = ev.target.result as string;
          setForm(prev => {
            const current = prev.hero_images && prev.hero_images.length > 0
              ? [...prev.hero_images]
              : [prev.hero_image_url];
            return {
              ...prev,
              hero_images: [...current, dataUrl]
            };
          });
          showToast('Hero photo uploaded!');
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleAddUrl = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newImgUrl.trim()) return;
    const current = form.hero_images && form.hero_images.length > 0
      ? [...form.hero_images]
      : [form.hero_image_url];
    setForm({
      ...form,
      hero_images: [...current, newImgUrl.trim()]
    });
    setNewImgUrl('');
    showToast('Hero image URL added');
  };

  const handleRemoveImage = (index: number) => {
    if (heroImages.length <= 1) {
      alert('You must keep at least 1 hero image.');
      return;
    }
    const updated = heroImages.filter((_, i) => i !== index);
    setForm({
      ...form,
      hero_images: updated,
      hero_image_url: updated[0] || form.hero_image_url
    });
    showToast('Hero image removed');
  };

  const handleSetPrimary = (index: number) => {
    const selected = heroImages[index];
    const rest = heroImages.filter((_, i) => i !== index);
    setForm({
      ...form,
      hero_image_url: selected,
      hero_images: [selected, ...rest]
    });
    showToast('Primary hero photo set');
  };

  const handleTestTransition = () => {
    if (heroImages.length <= 1) return;
    const effects = ['zoom-in', 'zoom-out', 'slide-left', 'slide-right', 'slide-up', 'blur-fade', 'diagonal-drift', 'fade'];
    const chosen = form.hero_transition_effect === 'random'
      ? effects[Math.floor(Math.random() * effects.length)]
      : (form.hero_transition_effect || 'zoom-in');

    setPreviewEffectActive(chosen);
    setPreviewIsAnimating(true);
    setPreviewIndex(prev => (prev + 1) % heroImages.length);

    setTimeout(() => {
      setPreviewIsAnimating(false);
    }, (form.hero_transition_duration_seconds || 1.5) * 1000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateSettings(form);
    showToast('Hero carousel & transition parameters saved!');
  };

  const intervalPresets = [
    { label: '30s', seconds: 30 },
    { label: '1 min', seconds: 60 },
    { label: '2 min', seconds: 120 },
    { label: '3 min (Default)', seconds: 180, isDefault: true },
    { label: '5 min', seconds: 300 },
    { label: '10 min', seconds: 600 },
  ];

  const durationPresets = [
    { label: '0.8s (Fast)', seconds: 0.8 },
    { label: '1.2s (Standard)', seconds: 1.2 },
    { label: '1.5s (Slow - Default)', seconds: 1.5, isDefault: true },
    { label: '2.0s (Cinematic Slow)', seconds: 2.0 },
    { label: '2.5s (Ultra Gentle)', seconds: 2.5 },
  ];

  const transitionEffectOptions = [
    { id: 'random', label: 'Random Transition Effect (Default)', desc: 'Cycles through unique animations dynamically on each slide' },
    { id: 'zoom-in', label: 'Cinematic Zoom In', desc: 'Smooth slow scale-in with crossfade' },
    { id: 'zoom-out', label: 'Gentle Zoom Out', desc: 'Starts compact and gracefully expands' },
    { id: 'slide-left', label: 'Smooth Slide Left', desc: 'Horizontal motion from right to left' },
    { id: 'slide-right', label: 'Smooth Slide Right', desc: 'Horizontal motion from left to right' },
    { id: 'slide-up', label: 'Upward Drift', desc: 'Soft vertical glide upwards' },
    { id: 'blur-fade', label: 'Soft Blur & Cross-Fade', desc: 'Dreamy soft blur resolution effect' },
    { id: 'diagonal-drift', label: 'Diagonal Drift', desc: 'Subtle combined scale and diagonal panning' },
    { id: 'fade', label: 'Standard Cross-Fade', desc: 'Classic clean opacity blend' },
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-extrabold text-foreground flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" /> Hero Section & Carousel Parameters
          </h2>
          <p className="text-xs text-muted-foreground">
            Manage multi-image rotation, 3-minute display timeframe, slow 1.5s random transitions, and copy.
          </p>
        </div>
        <button
          type="submit"
          className="py-2.5 px-6 rounded-xl bg-primary text-primary-foreground font-bold text-xs hover:bg-primary/90 shadow-md transition-transform active:scale-95"
        >
          Save Hero Changes
        </button>
      </div>

      {toast && (
        <div className="p-3 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-semibold animate-in fade-in">
          ✓ {toast}
        </div>
      )}

      {/* Multiple Hero Images Manager */}
      <div className="glass-card rounded-2xl p-6 border border-border/70 space-y-4">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
            <ImageIcon className="w-4 h-4 text-primary" /> Hero Banner Photos ({heroImages.length})
          </label>
          <label className="cursor-pointer py-1.5 px-3 rounded-xl bg-primary/20 text-primary hover:bg-primary/30 text-xs font-semibold flex items-center gap-1.5 transition-colors">
            <Upload className="w-3.5 h-3.5" />
            <span>Upload Multi-Photos</span>
            <input
              type="file"
              multiple
              accept="image/*"
              className="hidden"
              onChange={handleFileUpload}
            />
          </label>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {heroImages.map((img, idx) => (
            <div key={idx} className="relative aspect-video rounded-xl overflow-hidden border border-border/70 group bg-black/40">
              <img src={img} alt="hero slide" className="w-full h-full object-cover" />
              {idx === 0 && (
                <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-primary text-primary-foreground text-[10px] font-bold shadow">
                  Primary
                </span>
              )}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5">
                {idx !== 0 && (
                  <button
                    type="button"
                    onClick={() => handleSetPrimary(idx)}
                    title="Set as Primary"
                    className="p-1.5 rounded-lg bg-black/70 text-white hover:text-amber-400"
                  >
                    <Star className="w-4 h-4" />
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => handleRemoveImage(idx)}
                  title="Remove image"
                  className="p-1.5 rounded-lg bg-black/70 text-white hover:text-destructive"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="flex gap-2 pt-2">
          <input
            type="url"
            placeholder="Or enter direct image URL (https://...)"
            value={newImgUrl}
            onChange={e => setNewImgUrl(e.target.value)}
            className="flex-1 px-3 py-2 rounded-xl bg-muted border border-border text-foreground text-xs"
          />
          <button
            type="button"
            onClick={handleAddUrl}
            className="px-4 py-2 rounded-xl glass text-xs font-semibold text-foreground hover:bg-muted"
          >
            Add Image URL
          </button>
        </div>
      </div>

      {/* Hero Slideshow Transition Parameters */}
      <div className="glass-card rounded-2xl p-6 border border-border/70 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border/50 pb-4">
          <div>
            <h3 className="font-extrabold text-sm text-foreground flex items-center gap-2">
              <Sliders className="w-4 h-4 text-primary" /> Transition & Display Timeframe Parameters
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Control the rotation timeframe between pictures (default 3 minutes) and the slow animation speed (1.5s).
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleTestTransition}
              disabled={heroImages.length <= 1}
              className="py-1.5 px-3 rounded-xl bg-primary/20 text-primary hover:bg-primary/30 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
            >
              <Play className="w-3.5 h-3.5" />
              <span>Test Transition Animation</span>
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Parameter 1: Timeframe Between Hero Pictures */}
          <div className="space-y-3 bg-muted/30 p-4 rounded-xl border border-border/50">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-foreground flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-primary" /> Timeframe Between Pictures
              </label>
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-primary/15 text-primary border border-primary/20">
                {form.hero_interval_seconds ? `${(form.hero_interval_seconds / 60).toFixed(1)} min (${form.hero_interval_seconds}s)` : '3.0 min (180s)'}
              </span>
            </div>

            <p className="text-[11px] text-muted-foreground">
              How long each hero picture stays on screen before transitioning to the next image.
            </p>

            <div className="flex flex-wrap gap-1.5">
              {intervalPresets.map(preset => {
                const isSelected = form.hero_interval_seconds === preset.seconds;
                return (
                  <button
                    key={preset.seconds}
                    type="button"
                    onClick={() => setForm({ ...form, hero_interval_seconds: preset.seconds })}
                    className={`py-1.5 px-2.5 rounded-lg text-xs font-semibold transition-all ${
                      isSelected
                        ? 'bg-primary text-primary-foreground shadow-sm scale-102'
                        : 'bg-muted hover:bg-muted/80 text-foreground border border-border/60'
                    }`}
                  >
                    {preset.label}
                  </button>
                );
              })}
            </div>

            <div className="pt-1 flex items-center gap-2">
              <span className="text-[11px] text-muted-foreground">Custom Seconds:</span>
              <input
                type="number"
                min="5"
                max="3600"
                step="5"
                value={form.hero_interval_seconds || 180}
                onChange={e => setForm({ ...form, hero_interval_seconds: Math.max(5, Number(e.target.value)) })}
                className="w-24 px-2.5 py-1 rounded-lg bg-muted border border-border text-foreground text-xs font-bold"
              />
              <span className="text-[11px] text-muted-foreground">seconds</span>
            </div>
          </div>

          {/* Parameter 2: Transition Animation Duration (Slow speed) */}
          <div className="space-y-3 bg-muted/30 p-4 rounded-xl border border-border/50">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-foreground flex items-center gap-1.5">
                <RefreshCw className="w-3.5 h-3.5 text-primary" /> Transition Speed / Duration
              </label>
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-primary/15 text-primary border border-primary/20">
                {form.hero_transition_duration_seconds ? `${form.hero_transition_duration_seconds}s (Slow)` : '1.5s (Slow)'}
              </span>
            </div>

            <p className="text-[11px] text-muted-foreground">
              Controls how slowly and gracefully the crossfade and animation unfold (configured slow ~1.5s).
            </p>

            <div className="flex flex-wrap gap-1.5">
              {durationPresets.map(preset => {
                const isSelected = form.hero_transition_duration_seconds === preset.seconds;
                return (
                  <button
                    key={preset.seconds}
                    type="button"
                    onClick={() => setForm({ ...form, hero_transition_duration_seconds: preset.seconds })}
                    className={`py-1.5 px-2.5 rounded-lg text-xs font-semibold transition-all ${
                      isSelected
                        ? 'bg-primary text-primary-foreground shadow-sm scale-102'
                        : 'bg-muted hover:bg-muted/80 text-foreground border border-border/60'
                    }`}
                  >
                    {preset.label}
                  </button>
                );
              })}
            </div>

            <div className="pt-1 flex items-center gap-2">
              <span className="text-[11px] text-muted-foreground">Custom Duration:</span>
              <input
                type="number"
                min="0.3"
                max="5.0"
                step="0.1"
                value={form.hero_transition_duration_seconds || 1.5}
                onChange={e => setForm({ ...form, hero_transition_duration_seconds: Math.max(0.3, Number(e.target.value)) })}
                className="w-20 px-2.5 py-1 rounded-lg bg-muted border border-border text-foreground text-xs font-bold"
              />
              <span className="text-[11px] text-muted-foreground">seconds</span>
            </div>
          </div>
        </div>

        {/* Parameter 3: Transition Animation Effect Selector */}
        <div className="space-y-3 bg-muted/30 p-4 rounded-xl border border-border/50">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-foreground flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-primary" /> Transition Animation Effect
            </label>
            <span className="text-[11px] font-semibold text-muted-foreground">
              Selected: <strong className="text-foreground capitalize">{form.hero_transition_effect || 'random'}</strong>
            </span>
          </div>

          <div className="grid sm:grid-cols-3 gap-2.5">
            {transitionEffectOptions.map(option => {
              const isSelected = (form.hero_transition_effect || 'random') === option.id;
              return (
                <div
                  key={option.id}
                  onClick={() => setForm({ ...form, hero_transition_effect: option.id as any })}
                  className={`p-3 rounded-xl border cursor-pointer transition-all flex flex-col justify-between ${
                    isSelected
                      ? 'bg-primary/10 border-primary shadow-sm'
                      : 'bg-card/50 border-border/60 hover:border-primary/40'
                  }`}
                >
                  <div className="flex items-start justify-between gap-1.5">
                    <span className="text-xs font-bold text-foreground leading-snug">{option.label}</span>
                    {isSelected && <Check className="w-3.5 h-3.5 text-primary shrink-0" />}
                  </div>
                  <p className="text-[10px] text-muted-foreground mt-1.5 leading-relaxed">{option.desc}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Live Simulation / Preview Container */}
        {heroImages.length > 1 && (
          <div className="p-4 rounded-xl border border-border/60 bg-black/30 space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5 text-primary" /> Live Transition Simulator
              </span>
              <span className="text-[10px] text-foreground">
                Slide {previewIndex + 1} of {heroImages.length} • Effect: <span className="text-primary font-bold">{previewEffectActive}</span> ({form.hero_transition_duration_seconds}s)
              </span>
            </div>

            <div className="relative aspect-[21/9] sm:aspect-[24/9] rounded-lg overflow-hidden border border-border/50 bg-black/60">
              <img
                src={heroImages[previewIndex]}
                alt="preview"
                className={`w-full h-full object-cover transition-all ${
                  previewIsAnimating
                    ? 'scale-105 opacity-90'
                    : 'scale-100 opacity-100'
                }`}
                style={{
                  transitionDuration: `${form.hero_transition_duration_seconds || 1.5}s`,
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-3">
                <p className="text-[11px] text-white/90 font-medium">
                  Click &ldquo;Test Transition Animation&rdquo; above to preview the slow {form.hero_transition_duration_seconds}s {form.hero_transition_effect === 'random' ? 'random transition' : `${form.hero_transition_effect} transition`}.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Hero Content Copy Inputs */}
      <div className="glass-card rounded-2xl p-6 border border-border/70 space-y-4">
        <div>
          <label className="block text-xs font-semibold text-muted-foreground mb-1">Hero Badge</label>
          <input
            type="text"
            value={form.hero_badge || ''}
            onChange={e => setForm({ ...form, hero_badge: e.target.value })}
            className="w-full px-3 py-2.5 rounded-xl bg-muted border border-border text-foreground text-sm"
            placeholder="Clarias batrachus Hatchery & Grower"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-muted-foreground mb-1">Hero Main Title / Headline</label>
          <input
            type="text"
            required
            value={form.hero_title}
            onChange={e => setForm({ ...form, hero_title: e.target.value })}
            className="w-full px-3 py-2.5 rounded-xl bg-muted border border-border text-foreground text-sm font-bold"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-muted-foreground mb-1">Hero Subtitle</label>
          <textarea
            rows={3}
            value={form.hero_subtitle}
            onChange={e => setForm({ ...form, hero_subtitle: e.target.value })}
            className="w-full px-3 py-2.5 rounded-xl bg-muted border border-border text-foreground text-sm"
          />
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-muted-foreground mb-1">Primary CTA Button Text</label>
            <input
              type="text"
              value={form.hero_primary_btn_text || 'View Catalog'}
              onChange={e => setForm({ ...form, hero_primary_btn_text: e.target.value })}
              className="w-full px-3 py-2.5 rounded-xl bg-muted border border-border text-foreground text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-muted-foreground mb-1">Secondary CTA Button Text</label>
            <input
              type="text"
              value={form.hero_secondary_btn_text || 'Place Order Inquiry'}
              onChange={e => setForm({ ...form, hero_secondary_btn_text: e.target.value })}
              className="w-full px-3 py-2.5 rounded-xl bg-muted border border-border text-foreground text-sm"
            />
          </div>
        </div>
      </div>
    </form>
  );
};
