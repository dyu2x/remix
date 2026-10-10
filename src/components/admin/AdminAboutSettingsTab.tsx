import React, { useState } from 'react';
import { Settings, Upload, Image as ImageIcon, Plus, Trash2, Camera, Star, MessageSquare } from 'lucide-react';
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
            <p className="text-[11px] text-muted-foreground mt-1">
              Adjusts the company name displayed beside the logo in the top navbar and the footer at the bottom of the page.
            </p>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-4">
              <div className="relative group">
                <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-primary/50 bg-black/20 shadow-md flex items-center justify-center p-1 shrink-0">
                  <img src={form.logo_url} alt="Logo Preview" className="w-full h-full object-contain" />
                </div>
                <span className="absolute -bottom-1 -right-1 px-1.5 py-0.2 bg-background border border-border text-[9px] font-bold text-muted-foreground rounded-full shadow-sm">
                  Tab
                </span>
              </div>

              <div className="space-y-1.5 flex-1">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-muted-foreground">Company & Browser Tab Logo</label>
                  {form.logo_url !== '/round_transparent.png' && (
                    <button
                      type="button"
                      onClick={() => {
                        setForm({ ...form, logo_url: '/round_transparent.png' });
                        showToast('Reverted to default company logo');
                      }}
                      className="text-[10px] text-primary hover:underline font-semibold cursor-pointer"
                    >
                      Reset to Official Default Logo
                    </button>
                  )}
                </div>
                <div className="flex gap-2">
                  <label className="cursor-pointer py-2 px-3 rounded-xl bg-primary/20 text-primary hover:bg-primary/30 text-xs font-semibold flex items-center gap-1.5 transition-colors shrink-0">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload Image</span>
                    <input type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} />
                  </label>
                  <input
                    type="text"
                    placeholder="Or enter image / logo URL"
                    value={form.logo_url}
                    onChange={e => setForm({ ...form, logo_url: e.target.value })}
                    className="flex-1 px-3 py-1.5 rounded-xl bg-muted border border-border text-foreground text-xs"
                  />
                </div>
                <p className="text-[10px] text-muted-foreground">
                  Modifying the logo here dynamically updates the navigation bar, footer brand marks, and browser tab icon (favicon) in real-time.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Live Chat Support Widget Control */}
      <div className="glass-card rounded-2xl p-6 border border-border/70 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 transition-colors ${
              form.chat_widget_enabled !== false
                ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400'
                : 'bg-muted text-muted-foreground'
            }`}>
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-extrabold text-sm text-foreground">Live Chat Support Widget</h3>
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                  form.chat_widget_enabled !== false
                    ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                    : 'bg-muted text-muted-foreground border border-border'
                }`}>
                  {form.chat_widget_enabled !== false ? '● Active / Visible' : '○ Disabled / Hidden'}
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                Controls the visibility of the Rocket.Chat messenger bubble and the real-time blinking agent status tag across the entire website.
              </p>
            </div>
          </div>

          <label className="relative inline-flex items-center cursor-pointer select-none self-start sm:self-center">
            <input
              type="checkbox"
              checked={form.chat_widget_enabled !== false}
              onChange={e => {
                const nextVal = e.target.checked;
                setForm({ ...form, chat_widget_enabled: nextVal });
                showToast(nextVal ? 'Live Chat Widget enabled' : 'Live Chat Widget disabled');
              }}
              className="sr-only peer"
            />
            <div className="w-14 h-7 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-emerald-500"></div>
          </label>
        </div>

        <div className={`p-3.5 rounded-xl border text-xs flex items-center justify-between ${
          form.chat_widget_enabled !== false
            ? 'bg-emerald-500/10 border-emerald-500/25 text-emerald-700 dark:text-emerald-300'
            : 'bg-muted/50 border-border text-muted-foreground'
        }`}>
          <div>
            <b>Current Status: </b>
            {form.chat_widget_enabled !== false
              ? `The floating chat widget (${form.chat_widget_icon || 'message-circle'} • ${form.chat_widget_shape || 'circle'}) and live agent status tag are currently VISIBLE to all visitors.`
              : 'The floating chat widget and online/offline status tag are completely HIDDEN from visitors.'}
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
