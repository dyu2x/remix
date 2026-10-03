import React, { useState } from 'react';
import { Image as ImageIcon, Upload, Trash2, Plus, Sparkles, Star } from 'lucide-react';
import { SiteSettings } from '../../types';

interface AdminHeroTabProps {
  settings: SiteSettings;
  onUpdateSettings: (settings: SiteSettings) => void;
}

export const AdminHeroTab: React.FC<AdminHeroTabProps> = ({ settings, onUpdateSettings }) => {
  const [form, setForm] = useState<SiteSettings>(settings);
  const [newImgUrl, setNewImgUrl] = useState('');
  const [toast, setToast] = useState('');

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateSettings(form);
    showToast('Hero section updated successfully!');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-extrabold text-foreground flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" /> Hero Section & Carousel
          </h2>
          <p className="text-xs text-muted-foreground">
            Upload multiple rotating banner backgrounds and customize headline copy.
          </p>
        </div>
        <button
          type="submit"
          className="py-2.5 px-6 rounded-xl bg-primary text-primary-foreground font-bold text-xs hover:bg-primary/90 shadow-md"
        >
          Save Hero Changes
        </button>
      </div>

      {toast && (
        <div className="p-3 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-semibold">
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

      {/* Hero Content Inputs */}
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
