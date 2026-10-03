import React, { useState } from 'react';
import { Settings, Upload, Image as ImageIcon, Plus, Trash2, Camera, Star } from 'lucide-react';
import { SiteSettings, StatItem } from '../../types';

interface AdminAboutSettingsTabProps {
  settings: SiteSettings;
  onUpdateSettings: (settings: SiteSettings) => void;
}

export const AdminAboutSettingsTab: React.FC<AdminAboutSettingsTabProps> = ({
  settings,
  onUpdateSettings
}) => {
  const [form, setForm] = useState<SiteSettings>(settings);
  const [newAboutImgUrl, setNewAboutImgUrl] = useState('');
  const [toast, setToast] = useState('');

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  const aboutImages = form.about_images && form.about_images.length > 0
    ? form.about_images
    : [form.about_image_url];

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      if (ev.target?.result) {
        setForm({ ...form, logo_url: ev.target.result as string });
        showToast('Company logo updated!');
      }
    };
    reader.readAsDataURL(file);
  };

  const handleAboutUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    (Array.from(files) as File[]).forEach(file => {
      const reader = new FileReader();
      reader.onload = ev => {
        if (ev.target?.result) {
          const dataUrl = ev.target.result as string;
          setForm(prev => {
            const current = prev.about_images && prev.about_images.length > 0
              ? [...prev.about_images]
              : [prev.about_image_url];
            return {
              ...prev,
              about_images: [...current, dataUrl]
            };
          });
          showToast('About Us photo uploaded!');
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleAddAboutUrl = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAboutImgUrl.trim()) return;
    const cur = form.about_images && form.about_images.length > 0 ? [...form.about_images] : [form.about_image_url];
    setForm({
      ...form,
      about_images: [...cur, newAboutImgUrl.trim()]
    });
    setNewAboutImgUrl('');
    showToast('About photo added');
  };

  const handleRemoveAboutImg = (index: number) => {
    if (aboutImages.length <= 1) {
      alert('Must maintain at least 1 image.');
      return;
    }
    const updated = aboutImages.filter((_, i) => i !== index);
    setForm({
      ...form,
      about_images: updated,
      about_image_url: updated[0] || form.about_image_url
    });
  };

  const handleSetPrimaryAbout = (index: number) => {
    const selected = aboutImages[index];
    const rest = aboutImages.filter((_, i) => i !== index);
    setForm({
      ...form,
      about_image_url: selected,
      about_images: [selected, ...rest]
    });
    showToast('Primary photo updated');
  };

  const handleUpdateFeature = (index: number, val: string) => {
    const feats = form.about_features ? [...form.about_features] : ['Pristine Water', 'Bio-Secure'];
    feats[index] = val;
    setForm({ ...form, about_features: feats });
  };

  const handleAddFeature = () => {
    const feats = form.about_features ? [...form.about_features] : [];
    setForm({ ...form, about_features: [...feats, 'New Bio-Standard Feature'] });
  };

  const handleRemoveFeature = (index: number) => {
    const feats = form.about_features ? [...form.about_features] : [];
    if (feats.length <= 1) return;
    setForm({ ...form, about_features: feats.filter((_, i) => i !== index) });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateSettings(form);
    showToast('Company branding & About Us content saved!');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-extrabold text-foreground flex items-center gap-2">
            <Settings className="w-5 h-5 text-primary" /> Company Branding & About Us Content
          </h2>
          <p className="text-xs text-muted-foreground">
            Update farm name, upload company logo, manage About Us multi-photo slideshow, and story text.
          </p>
        </div>
        <button
          type="submit"
          className="py-2.5 px-6 rounded-xl bg-primary text-primary-foreground font-bold text-xs hover:bg-primary/90 shadow-md"
        >
          Save Changes
        </button>
      </div>

      {toast && (
        <div className="p-3 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-semibold">
          ✓ {toast}
        </div>
      )}

      {/* Brand & Logo Section */}
      <div className="glass-card rounded-2xl p-6 border border-border/70 space-y-4">
        <h3 className="font-extrabold text-sm text-foreground">Company Name & Logo</h3>

        <div className="grid sm:grid-cols-2 gap-4 items-center">
          <div>
            <label className="text-xs font-semibold text-muted-foreground">Company / Farm Name</label>
            <input
              type="text"
              required
              value={form.farm_name}
              onChange={e => setForm({ ...form, farm_name: e.target.value })}
              className="w-full px-3 py-2.5 rounded-xl bg-muted border border-border text-foreground text-sm font-bold"
            />
          </div>

          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-primary/40 bg-black/30 shrink-0">
              <img src={form.logo_url} alt="Logo Preview" className="w-full h-full object-cover" />
            </div>

            <div className="space-y-1.5 flex-1">
              <label className="text-xs font-semibold text-muted-foreground">Upload New Logo</label>
              <div className="flex gap-2">
                <label className="cursor-pointer py-2 px-3 rounded-xl bg-primary/20 text-primary hover:bg-primary/30 text-xs font-semibold flex items-center gap-1.5 transition-colors">
                  <Upload className="w-3.5 h-3.5" />
                  <span>Choose File</span>
                  <input type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} />
                </label>
                <input
                  type="text"
                  placeholder="Or enter Logo URL"
                  value={form.logo_url}
                  onChange={e => setForm({ ...form, logo_url: e.target.value })}
                  className="flex-1 px-3 py-1.5 rounded-xl bg-muted border border-border text-foreground text-xs"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* About Us Multi-Image Slideshow */}
      <div className="glass-card rounded-2xl p-6 border border-border/70 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-extrabold text-sm text-foreground flex items-center gap-2">
              <Camera className="w-4 h-4 text-primary" /> About Us Gallery Photos ({aboutImages.length})
            </h3>
            <p className="text-xs text-muted-foreground">These images rotate in the About Us slideshow on the homepage.</p>
          </div>

          <label className="cursor-pointer py-1.5 px-3 rounded-xl bg-primary/20 text-primary hover:bg-primary/30 text-xs font-semibold flex items-center gap-1.5">
            <Upload className="w-3.5 h-3.5" />
            <span>Upload Multi-Photos</span>
            <input type="file" multiple accept="image/*" className="hidden" onChange={handleAboutUpload} />
          </label>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {aboutImages.map((img, idx) => (
            <div key={idx} className="relative aspect-video rounded-xl overflow-hidden border border-border/70 group bg-black/40">
              <img src={img} alt="about photo" className="w-full h-full object-cover" />
              {idx === 0 && (
                <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-primary text-primary-foreground text-[10px] font-bold">
                  Primary
                </span>
              )}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5">
                {idx !== 0 && (
                  <button
                    type="button"
                    onClick={() => handleSetPrimaryAbout(idx)}
                    title="Set as Primary"
                    className="p-1.5 rounded-lg bg-black/70 text-white hover:text-amber-400"
                  >
                    <Star className="w-4 h-4" />
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => handleRemoveAboutImg(idx)}
                  title="Remove image"
                  className="p-1.5 rounded-lg bg-black/70 text-white hover:text-destructive"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="flex gap-2">
          <input
            type="url"
            placeholder="Add photo by URL"
            value={newAboutImgUrl}
            onChange={e => setNewAboutImgUrl(e.target.value)}
            className="flex-1 px-3 py-2 rounded-xl bg-muted border border-border text-foreground text-xs"
          />
          <button
            type="button"
            onClick={handleAddAboutUrl}
            className="px-4 py-2 rounded-xl glass text-xs font-semibold text-foreground hover:bg-muted"
          >
            Add Photo URL
          </button>
        </div>
      </div>

      {/* About Us Content Inputs */}
      <div className="glass-card rounded-2xl p-6 border border-border/70 space-y-4">
        <h3 className="font-extrabold text-sm text-foreground">About Us Story & Copywriting</h3>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold text-muted-foreground">Kicker Tag</label>
            <input
              type="text"
              value={form.about_kicker || ''}
              onChange={e => setForm({ ...form, about_kicker: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-muted border border-border text-foreground text-sm"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-muted-foreground">Main Title</label>
            <input
              type="text"
              value={form.about_title || ''}
              onChange={e => setForm({ ...form, about_title: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-muted border border-border text-foreground text-sm font-bold"
            />
          </div>
        </div>

        <div>
          <label className="text-xs font-semibold text-muted-foreground">Paragraph 1</label>
          <textarea
            rows={3}
            value={form.about_paragraph_1 || ''}
            onChange={e => setForm({ ...form, about_paragraph_1: e.target.value })}
            className="w-full px-3 py-2 rounded-xl bg-muted border border-border text-foreground text-sm"
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-muted-foreground">Paragraph 2</label>
          <textarea
            rows={3}
            value={form.about_paragraph_2 || ''}
            onChange={e => setForm({ ...form, about_paragraph_2: e.target.value })}
            className="w-full px-3 py-2 rounded-xl bg-muted border border-border text-foreground text-sm"
          />
        </div>

        {/* Feature Highlights List */}
        <div className="space-y-2 pt-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-muted-foreground">Key Feature Bullets</label>
            <button
              type="button"
              onClick={handleAddFeature}
              className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Bullet</span>
            </button>
          </div>

          <div className="grid sm:grid-cols-2 gap-2">
            {(form.about_features || []).map((feat, idx) => (
              <div key={idx} className="flex gap-2">
                <input
                  type="text"
                  value={feat}
                  onChange={e => handleUpdateFeature(idx, e.target.value)}
                  className="flex-1 px-3 py-1.5 rounded-xl bg-muted border border-border text-foreground text-xs font-medium"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveFeature(idx)}
                  className="p-1.5 rounded-lg glass text-muted-foreground hover:text-destructive"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </form>
  );
};
