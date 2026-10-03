import React, { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Compass, ExternalLink, Apple } from 'lucide-react';
import { SiteSettings } from '../../types';

interface AdminLocationTabProps {
  settings: SiteSettings;
  onUpdateSettings: (settings: SiteSettings) => void;
}

export const AdminLocationTab: React.FC<AdminLocationTabProps> = ({ settings, onUpdateSettings }) => {
  const [form, setForm] = useState<SiteSettings>(settings);
  const [toast, setToast] = useState('');

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateSettings(form);
    showToast('Farm location & schedule updated!');
  };

  const lat = form.lat || 11.535766;
  const lng = form.lng || 122.652221;
  const mapEmbedUrl = `https://maps.google.com/maps?q=${lat},${lng}&hl=en&z=15&output=embed`;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-extrabold text-foreground flex items-center gap-2">
            <MapPin className="w-5 h-5 text-primary" /> Location, Maps & Visiting Hours
          </h2>
          <p className="text-xs text-muted-foreground">
            Configure Google Maps coordinates, Apple Maps navigation for Mac/iOS users, farm address, and operating hours.
          </p>
        </div>
        <button
          type="submit"
          className="py-2.5 px-6 rounded-xl bg-primary text-primary-foreground font-bold text-xs hover:bg-primary/90 shadow-md"
        >
          Save Location Settings
        </button>
      </div>

      {toast && (
        <div className="p-3 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-semibold">
          ✓ {toast}
        </div>
      )}

      <div className="grid lg:grid-cols-12 gap-6 items-start">
        {/* Left: Input Form */}
        <div className="lg:col-span-6 space-y-4">
          <div className="glass-card rounded-2xl p-6 border border-border/70 space-y-4">
            <h3 className="font-bold text-sm text-foreground">Exact Address & GPS Coordinates</h3>

            <div>
              <label className="text-xs font-semibold text-muted-foreground">Exact Farm Physical Address</label>
              <input
                type="text"
                required
                value={form.address}
                onChange={e => setForm({ ...form, address: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-muted border border-border text-foreground text-sm font-semibold"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-muted-foreground">Latitude (° N)</label>
                <input
                  type="number"
                  step="0.000001"
                  required
                  value={form.lat}
                  onChange={e => setForm({ ...form, lat: parseFloat(e.target.value) || 0 })}
                  className="w-full px-3 py-2 rounded-xl bg-muted border border-border text-foreground text-sm font-mono"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-muted-foreground">Longitude (° E)</label>
                <input
                  type="number"
                  step="0.000001"
                  required
                  value={form.lng}
                  onChange={e => setForm({ ...form, lng: parseFloat(e.target.value) || 0 })}
                  className="w-full px-3 py-2 rounded-xl bg-muted border border-border text-foreground text-sm font-mono"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
                <Apple className="w-3.5 h-3.5 text-foreground" />
                <span>Apple Maps URL (For Mac & iOS Users)</span>
              </label>
              <input
                type="text"
                value={form.apple_maps_url || ''}
                onChange={e => setForm({ ...form, apple_maps_url: e.target.value })}
                placeholder="https://maps.apple.com/?daddr=11.535766,122.652221"
                className="w-full px-3 py-2 rounded-xl bg-muted border border-border text-foreground text-xs font-mono"
              />
            </div>
          </div>

          <div className="glass-card rounded-2xl p-6 border border-border/70 space-y-4">
            <h3 className="font-bold text-sm text-foreground">Contact & Operating Schedule</h3>

            <div className="grid sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-muted-foreground">Contact Phone / Hotline</label>
                <input
                  type="text"
                  required
                  value={form.phone}
                  onChange={e => setForm({ ...form, phone: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-muted border border-border text-foreground text-sm"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-muted-foreground">Support Email</label>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-muted border border-border text-foreground text-sm"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-muted-foreground">
                Operating Hours & Visiting Schedule (Multi-line)
              </label>
              <textarea
                rows={4}
                value={form.schedule || ''}
                onChange={e => setForm({ ...form, schedule: e.target.value })}
                placeholder="Mon - Fri: 7:00 AM - 5:00 PM&#10;Saturday: By Appointment&#10;Sunday: Closed"
                className="w-full px-3 py-2 rounded-xl bg-muted border border-border text-foreground text-sm leading-relaxed"
              />
            </div>
          </div>
        </div>

        {/* Right: Live Map Preview */}
        <div className="lg:col-span-6 glass-card rounded-2xl p-5 border border-border/70 space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-foreground flex items-center gap-1.5">
              <Compass className="w-4 h-4 text-primary" /> Live Google Maps Base View Preview
            </span>
            <span className="font-mono text-muted-foreground text-[11px]">
              {lat.toFixed(4)}, {lng.toFixed(4)}
            </span>
          </div>

          <div className="rounded-xl overflow-hidden border border-border/60 aspect-[4/3] bg-black/40">
            <iframe
              src={mapEmbedUrl}
              title="Farm Base Map Preview"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              loading="lazy"
            />
          </div>

          <div className="pt-2 flex items-center justify-between text-xs">
            <a
              href={`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline font-semibold flex items-center gap-1"
            >
              <span>Test Google Maps Navigation</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>

            <a
              href={form.apple_maps_url || `https://maps.apple.com/?daddr=${lat},${lng}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground hover:underline font-semibold flex items-center gap-1"
            >
              <Apple className="w-3.5 h-3.5" />
              <span>Test Apple Maps Link</span>
            </a>
          </div>
        </div>
      </div>
    </form>
  );
};
