import React, { useState } from 'react';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Compass,
  ExternalLink,
  Apple,
  Building2,
  Layers,
  Calendar,
  Plus,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  Info,
  Power,
  Edit2,
  Check,
  X,
  Sparkles
} from 'lucide-react';
import { SiteSettings, FarmLocation, CustomHolidayOrClosure, FarmCalendarConfig } from '../../types';
import { defaultLocation2, defaultFarmCalendar } from '../../data/initialData';
import { HotlineChatBadges } from '../HotlineChatBadges';

interface AdminLocationTabProps {
  settings: SiteSettings;
  onUpdateSettings: (settings: SiteSettings) => void;
}

// Standard Philippine Holidays list for quick admin configuration
const STANDARD_PH_HOLIDAYS_PRESETS = [
  { mmdd: '01-01', name: "New Year's Day (Bagong Taon)", defaultStatus: 'closed', defaultHours: 'Closed All Day' },
  { mmdd: '01-29', name: 'Chinese Lunar New Year', defaultStatus: 'by_appointment', defaultHours: '7:00 AM – 12:00 PM' },
  { mmdd: '02-25', name: 'EDSA People Power Anniversary', defaultStatus: 'by_appointment', defaultHours: '7:00 AM – 1:00 PM' },
  { mmdd: '04-02', name: 'Maundy Thursday (Huwebes Santo)', defaultStatus: 'closed', defaultHours: 'Non-Operational / Closed' },
  { mmdd: '04-03', name: 'Good Friday (Biyernes Santo)', defaultStatus: 'closed', defaultHours: 'Closed All Day' },
  { mmdd: '04-04', name: 'Black Saturday (Sabado de Gloria)', defaultStatus: 'by_appointment', defaultHours: '8:00 AM – 11:00 AM Only' },
  { mmdd: '04-09', name: 'Araw ng Kagitingan (Day of Valor)', defaultStatus: 'by_appointment', defaultHours: '7:00 AM – 12:00 PM' },
  { mmdd: '05-01', name: 'Labor Day (Araw ng Manggagawa)', defaultStatus: 'by_appointment', defaultHours: '7:00 AM – 12:00 PM' },
  { mmdd: '06-12', name: 'Philippine Independence Day', defaultStatus: 'by_appointment', defaultHours: '7:00 AM – 12:00 PM' },
  { mmdd: '08-21', name: 'Ninoy Aquino Day', defaultStatus: 'by_appointment', defaultHours: '7:00 AM – 12:00 PM' },
  { mmdd: '08-31', name: 'National Heroes Day', defaultStatus: 'by_appointment', defaultHours: '7:00 AM – 12:00 PM' },
  { mmdd: '11-01', name: "All Saints' Day (Undas)", defaultStatus: 'closed', defaultHours: 'Closed All Day' },
  { mmdd: '11-02', name: "All Souls' Day", defaultStatus: 'by_appointment', defaultHours: '7:00 AM – 11:00 AM Only' },
  { mmdd: '11-30', name: 'Bonifacio Day', defaultStatus: 'by_appointment', defaultHours: '7:00 AM – 12:00 PM' },
  { mmdd: '12-08', name: 'Feast of the Immaculate Conception', defaultStatus: 'by_appointment', defaultHours: '7:00 AM – 12:00 PM' },
  { mmdd: '12-24', name: 'Christmas Eve (Bisperas)', defaultStatus: 'by_appointment', defaultHours: '7:00 AM – 12:00 PM Half Day' },
  { mmdd: '12-25', name: 'Christmas Day (Pasko)', defaultStatus: 'closed', defaultHours: 'Closed All Day' },
  { mmdd: '12-30', name: 'Rizal Day', defaultStatus: 'by_appointment', defaultHours: '7:00 AM – 12:00 PM' },
  { mmdd: '12-31', name: "New Year's Eve", defaultStatus: 'closed', defaultHours: 'Closed All Day' }
];

export const AdminLocationTab: React.FC<AdminLocationTabProps> = ({ settings, onUpdateSettings }) => {
  const [activeSubTab, setActiveSubTab] = useState<'loc1' | 'loc2' | 'calendar'>('loc1');

  // Location 1 state
  const [form, setForm] = useState<SiteSettings>(settings);

  // Location 2 state
  const [loc2, setLoc2] = useState<FarmLocation>(() => {
    return settings.location_2 || defaultLocation2;
  });

  // Calendar config state
  const [calendarConfig, setCalendarConfig] = useState<FarmCalendarConfig>(() => {
    return settings.farm_calendar || defaultFarmCalendar;
  });

  // Inline editing state for an existing closure item
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<{
    date: string;
    title: string;
    status: 'closed' | 'by_appointment' | 'special_hours' | 'regular_hours';
    time_of_operation: string;
    notes: string;
  }>({
    date: '',
    title: '',
    status: 'closed',
    time_of_operation: '',
    notes: ''
  });

  // New closure form
  const [newClosure, setNewClosure] = useState<{
    date: string;
    title: string;
    type: 'holiday' | 'maintenance' | 'special_hours' | 'closed';
    status: 'closed' | 'by_appointment' | 'special_hours' | 'regular_hours';
    time_of_operation: string;
    notes: string;
  }>({
    date: '',
    title: '',
    type: 'holiday',
    status: 'closed',
    time_of_operation: 'Closed All Day',
    notes: ''
  });

  const [toast, setToast] = useState('');

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3500);
  };

  const handleSaveAll = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: SiteSettings = {
      ...form,
      location_2: loc2,
      farm_calendar: calendarConfig
    };
    onUpdateSettings(updated);
    showToast('Farm locations, MapQuest routing, and operational calendar saved successfully!');
  };

  const handleToggleLocation2 = (enabled: boolean) => {
    const updatedLoc2 = { ...loc2, enabled };
    setLoc2(updatedLoc2);
    const updatedSettings = {
      ...form,
      location_2: updatedLoc2
    };
    onUpdateSettings(updatedSettings);
    showToast(enabled ? 'Location 2 is now ENABLED on website!' : 'Location 2 is now DISABLED and hidden!');
  };

  const handleAddClosure = () => {
    if (!newClosure.date || !newClosure.title) {
      alert('Please provide a date and title for the holiday or maintenance schedule.');
      return;
    }
    const closureItem: CustomHolidayOrClosure = {
      id: `closure-${Date.now()}`,
      date: newClosure.date,
      title: newClosure.title,
      type: newClosure.type,
      status: newClosure.status,
      time_of_operation: newClosure.time_of_operation || (newClosure.status === 'closed' ? 'Closed All Day' : '7:00 AM – 12:00 PM'),
      hours_note: newClosure.time_of_operation,
      notes: newClosure.notes
    };
    const updatedClosures = [...(calendarConfig.custom_closures || []), closureItem].sort((a, b) =>
      a.date.localeCompare(b.date)
    );
    setCalendarConfig({
      ...calendarConfig,
      custom_closures: updatedClosures
    });
    setNewClosure({
      date: '',
      title: '',
      type: 'holiday',
      status: 'closed',
      time_of_operation: 'Closed All Day',
      notes: ''
    });
    showToast(`Added "${closureItem.title}" to calendar!`);
  };

  const handleDeleteClosure = (id: string) => {
    const filtered = (calendarConfig.custom_closures || []).filter(c => c.id !== id);
    setCalendarConfig({
      ...calendarConfig,
      custom_closures: filtered
    });
    showToast('Schedule entry removed.');
  };

  const startEditClosure = (item: CustomHolidayOrClosure) => {
    setEditingId(item.id);
    setEditForm({
      date: item.date,
      title: item.title,
      status: item.status || 'closed',
      time_of_operation: item.time_of_operation || item.hours_note || (item.status === 'closed' ? 'Closed All Day' : '7:00 AM – 12:00 PM'),
      notes: item.notes || ''
    });
  };

  const saveEditClosure = (id: string) => {
    const updated = (calendarConfig.custom_closures || []).map(item => {
      if (item.id === id) {
        return {
          ...item,
          date: editForm.date,
          title: editForm.title,
          status: editForm.status,
          time_of_operation: editForm.time_of_operation,
          hours_note: editForm.time_of_operation,
          notes: editForm.notes
        };
      }
      return item;
    });
    setCalendarConfig({
      ...calendarConfig,
      custom_closures: updated
    });
    setEditingId(null);
    showToast('Updated date and time of operation!');
  };

  // Quick load standard Philippine holiday preset
  const handleQuickAddHoliday = (preset: typeof STANDARD_PH_HOLIDAYS_PRESETS[0]) => {
    const currentYear = new Date().getFullYear();
    const fullDate = `${currentYear}-${preset.mmdd}`;
    setNewClosure({
      date: fullDate,
      title: preset.name,
      type: 'holiday',
      status: preset.defaultStatus as any,
      time_of_operation: preset.defaultHours,
      notes: 'Philippine Official Holiday'
    });
  };

  // Previews
  const lat1 = form.lat || 14.8528759;
  const lng1 = form.lng || 120.5046859;
  const mapEmbed1 = `https://maps.google.com/maps?q=${lat1},${lng1}&hl=en&z=15&output=embed`;

  const lat2 = loc2.lat || 11.585300;
  const lng2 = loc2.lng || 122.751100;
  const mapEmbed2 = `https://maps.google.com/maps?q=${lat2},${lng2}&hl=en&z=15&output=embed`;

  return (
    <form onSubmit={handleSaveAll} className="space-y-6 animate-scale-in">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-foreground flex items-center gap-2">
            <MapPin className="w-5 h-5 text-primary" /> Multi-Location, MapQuest & Holiday Calendar
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Manage primary and secondary farm sites, enable MapQuest turn-by-turn routing, and control exact non-operational dates and times of operation.
          </p>
        </div>

        <button
          type="submit"
          className="py-2.5 px-6 rounded-xl bg-primary text-primary-foreground font-bold text-xs hover:bg-primary/90 shadow-md transition-all self-start sm:self-auto cursor-pointer"
        >
          Save All Changes
        </button>
      </div>

      {toast && (
        <div className="p-3.5 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{toast}</span>
        </div>
      )}

      {/* Sub-Tab Navigation Bar */}
      <div className="flex items-center gap-2 border-b border-border/60 pb-3 overflow-x-auto scrollbar-none">
        <button
          type="button"
          onClick={() => setActiveSubTab('loc1')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
            activeSubTab === 'loc1'
              ? 'bg-primary text-primary-foreground shadow-md'
              : 'text-muted-foreground hover:text-foreground hover:bg-muted/70'
          }`}
        >
          <Building2 className="w-3.5 h-3.5" />
          <span>Location 1: Main Hatchery</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('loc2')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
            activeSubTab === 'loc2'
              ? 'bg-primary text-primary-foreground shadow-md'
              : 'text-muted-foreground hover:text-foreground hover:bg-muted/70'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Location 2: Secondary Facility</span>
          <span
            className={`text-[9px] px-1.5 py-0.5 rounded-full font-extrabold ${
              loc2.enabled
                ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                : 'bg-muted text-muted-foreground border border-border'
            }`}
          >
            {loc2.enabled ? 'ENABLED' : 'OFF'}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('calendar')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
            activeSubTab === 'calendar'
              ? 'bg-primary text-primary-foreground shadow-md'
              : 'text-muted-foreground hover:text-foreground hover:bg-muted/70'
          }`}
        >
          <Calendar className="w-3.5 h-3.5" />
          <span>Philippine Holidays & Operating Times</span>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/20 text-primary font-bold">
            {calendarConfig.custom_closures?.length || 0} Dates
          </span>
        </button>
      </div>

      {/* ============================================================== */}
      {/* SUB-TAB 1: LOCATION 1 (MAIN HATCHERY)                          */}
      {/* ============================================================== */}
      {activeSubTab === 'loc1' && (
        <div className="grid lg:grid-cols-12 gap-6 items-start animate-scale-in">
          {/* Form Fields */}
          <div className="lg:col-span-6 space-y-4">
            <div className="glass-card rounded-2xl p-6 border border-border/70 space-y-4">
              <h3 className="font-bold text-sm text-foreground flex items-center gap-2">
                <Building2 className="w-4 h-4 text-primary" /> Location 1: Main Hatchery (Hermosa, Bataan)
              </h3>

              <div>
                <label className="text-xs font-semibold text-muted-foreground">Farm Facility Physical Address</label>
                <input
                  type="text"
                  required
                  value={form.address}
                  onChange={e => setForm({ ...form, address: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-muted border border-border text-foreground text-sm font-semibold mt-1"
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
                    className="w-full px-3 py-2 rounded-xl bg-muted border border-border text-foreground text-sm font-mono mt-1"
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
                    className="w-full px-3 py-2 rounded-xl bg-muted border border-border text-foreground text-sm font-mono mt-1"
                  />
                </div>
              </div>

              {/* Navigation App Direct URLs */}
              <div className="space-y-3 pt-2 border-t border-border/40">
                <div>
                  <label className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
                    <Apple className="w-3.5 h-3.5 text-foreground" />
                    <span>Apple Maps URL (iOS & Mac Navigation)</span>
                  </label>
                  <input
                    type="text"
                    value={form.apple_maps_url || ''}
                    onChange={e => setForm({ ...form, apple_maps_url: e.target.value })}
                    placeholder="https://maps.apple.com/?daddr=14.8528759,120.5046859"
                    className="w-full px-3 py-2 rounded-xl bg-muted border border-border text-foreground text-xs font-mono mt-1"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                    <Compass className="w-3.5 h-3.5 text-emerald-500" />
                    <span>MapQuest App Route URL</span>
                  </label>
                  <input
                    type="text"
                    value={form.mapquest_url || ''}
                    onChange={e => setForm({ ...form, mapquest_url: e.target.value })}
                    placeholder="https://www.mapquest.com/directions/to/14.8528759,120.5046859"
                    className="w-full px-3 py-2 rounded-xl bg-muted border border-border text-foreground text-xs font-mono mt-1"
                  />
                  <span className="text-[10px] text-muted-foreground mt-0.5 block">
                    Direct turn-by-turn routing via MapQuest.
                  </span>
                </div>
              </div>
            </div>

            {/* Hotline & Schedule */}
            <div className="glass-card rounded-2xl p-6 border border-border/70 space-y-4">
              <h3 className="font-bold text-sm text-foreground">Contact Hotline & Operating Schedule</h3>

              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-muted-foreground">Contact Phone / Hotline</label>
                  <input
                    type="text"
                    required
                    value={form.phone}
                    onChange={e => setForm({ ...form, phone: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-muted border border-border text-foreground text-sm mt-1"
                  />
                  <HotlineChatBadges phone={form.phone} variant="inline" className="mt-1" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground">Support Email</label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={e => setForm({ ...form, email: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-muted border border-border text-foreground text-sm mt-1"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-muted-foreground">
                  Operating Hours & Visiting Schedule (Multi-line)
                </label>
                <textarea
                  rows={3}
                  value={form.schedule || ''}
                  onChange={e => setForm({ ...form, schedule: e.target.value })}
                  placeholder="Mon - Fri: 7:00 AM - 5:00 PM&#10;Saturday: By Appointment&#10;Sunday: Closed"
                  className="w-full px-3 py-2 rounded-xl bg-muted border border-border text-foreground text-sm leading-relaxed mt-1"
                />
              </div>
            </div>
          </div>

          {/* Right: Live Map Preview */}
          <div className="lg:col-span-6 glass-card rounded-2xl p-5 border border-border/70 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-foreground flex items-center gap-1.5">
                <Compass className="w-4 h-4 text-primary" /> Location 1 Live Map Preview
              </span>
              <span className="font-mono text-muted-foreground text-[11px]">
                {lat1.toFixed(4)}, {lng1.toFixed(4)}
              </span>
            </div>

            <div className="rounded-xl overflow-hidden border border-border/60 aspect-[4/3] bg-black/40">
              <iframe
                src={mapEmbed1}
                title="Location 1 Base Map Preview"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                loading="lazy"
              />
            </div>

            <div className="pt-2 flex flex-wrap items-center justify-between gap-2 text-xs">
              <a
                href={`https://www.google.com/maps/dir/?api=1&destination=${lat1},${lng1}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline font-semibold flex items-center gap-1"
              >
                <span>Test Google Maps</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              <a
                href={form.apple_maps_url || `https://maps.apple.com/?daddr=${lat1},${lng1}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-foreground hover:underline font-semibold flex items-center gap-1"
              >
                <Apple className="w-3.5 h-3.5" />
                <span>Test Apple Maps</span>
              </a>

              <a
                href={form.mapquest_url || `https://www.mapquest.com/directions/to/${lat1},${lng1}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-emerald-500 hover:underline font-semibold flex items-center gap-1"
              >
                <Compass className="w-3.5 h-3.5" />
                <span>Test MapQuest</span>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* SUB-TAB 2: LOCATION 2 (SECONDARY LOCATION / EXTENSION)         */}
      {/* ============================================================== */}
      {activeSubTab === 'loc2' && (
        <div className="space-y-6 animate-scale-in">
          {/* Master Toggle Card */}
          <div
            className={`p-6 rounded-3xl border transition-all ${
              loc2.enabled
                ? 'bg-emerald-500/10 border-emerald-500/40 shadow-lg'
                : 'bg-muted/30 border-border'
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
                    loc2.enabled ? 'bg-emerald-500 text-white' : 'bg-muted text-muted-foreground'
                  }`}
                >
                  <Power className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-extrabold text-base text-foreground">
                      Location 2 (Secondary Facility) Visibility
                    </h3>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                        loc2.enabled
                          ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                          : 'bg-muted text-muted-foreground border border-border'
                      }`}
                    >
                      {loc2.enabled ? '● Active & Visible on Website' : '○ Disabled / Hidden'}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5 max-w-xl">
                    When enabled, visitors see a location switcher on the Location page allowing them to view directions, coordinates, map pin, and contact information for Location 2.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <label className="relative inline-flex items-center cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={loc2.enabled}
                    onChange={e => handleToggleLocation2(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-16 h-8 bg-muted border border-border peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-emerald-500 shadow-inner"></div>
                </label>
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-12 gap-6 items-start">
            {/* Form Fields for Location 2 */}
            <div className="lg:col-span-6 space-y-4">
              <div className="glass-card rounded-2xl p-6 border border-border/70 space-y-4">
                <h3 className="font-bold text-sm text-foreground flex items-center gap-2">
                  <Layers className="w-4 h-4 text-primary" /> Location 2 Details & Coordinates
                </h3>

                <div className="grid sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-2">
                    <label className="text-xs font-semibold text-muted-foreground">Facility Name</label>
                    <input
                      type="text"
                      value={loc2.name}
                      onChange={e => setLoc2({ ...loc2, name: e.target.value })}
                      placeholder="e.g. Mesina Farms Location 2 (Grow-Out Station)"
                      className="w-full px-3.5 py-2 rounded-xl bg-muted border border-border text-foreground text-sm font-semibold mt-1"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground">Type Badge</label>
                    <input
                      type="text"
                      value={loc2.badge || ''}
                      onChange={e => setLoc2({ ...loc2, badge: e.target.value })}
                      placeholder="e.g. Grow-Out Station"
                      className="w-full px-3.5 py-2 rounded-xl bg-muted border border-border text-foreground text-xs font-semibold mt-1"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-muted-foreground">Exact Address</label>
                  <input
                    type="text"
                    value={loc2.address}
                    onChange={e => setLoc2({ ...loc2, address: e.target.value })}
                    placeholder="Sitio, Barangay, Municipality/City, Province"
                    className="w-full px-3.5 py-2 rounded-xl bg-muted border border-border text-foreground text-sm mt-1"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground">Latitude (° N)</label>
                    <input
                      type="number"
                      step="0.000001"
                      value={loc2.lat}
                      onChange={e => setLoc2({ ...loc2, lat: parseFloat(e.target.value) || 0 })}
                      className="w-full px-3 py-2 rounded-xl bg-muted border border-border text-foreground text-sm font-mono mt-1"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground">Longitude (° E)</label>
                    <input
                      type="number"
                      step="0.000001"
                      value={loc2.lng}
                      onChange={e => setLoc2({ ...loc2, lng: parseFloat(e.target.value) || 0 })}
                      className="w-full px-3 py-2 rounded-xl bg-muted border border-border text-foreground text-sm font-mono mt-1"
                    />
                  </div>
                </div>

                {/* Routing URLs */}
                <div className="space-y-3 pt-2 border-t border-border/40">
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
                      <Apple className="w-3.5 h-3.5 text-foreground" />
                      <span>Apple Maps URL for Location 2</span>
                    </label>
                    <input
                      type="text"
                      value={loc2.apple_maps_url || ''}
                      onChange={e => setLoc2({ ...loc2, apple_maps_url: e.target.value })}
                      placeholder="https://maps.apple.com/?daddr=..."
                      className="w-full px-3 py-2 rounded-xl bg-muted border border-border text-foreground text-xs font-mono mt-1"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                      <Compass className="w-3.5 h-3.5 text-emerald-500" />
                      <span>MapQuest Navigation URL for Location 2</span>
                    </label>
                    <input
                      type="text"
                      value={loc2.mapquest_url || ''}
                      onChange={e => setLoc2({ ...loc2, mapquest_url: e.target.value })}
                      placeholder="https://www.mapquest.com/directions/to/..."
                      className="w-full px-3 py-2 rounded-xl bg-muted border border-border text-foreground text-xs font-mono mt-1"
                    />
                  </div>
                </div>
              </div>

              {/* Location 2 Contact & Schedule */}
              <div className="glass-card rounded-2xl p-6 border border-border/70 space-y-4">
                <h3 className="font-bold text-sm text-foreground">Location 2 Contact & Schedule</h3>

                <div className="grid sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground">Location 2 Phone / Hotline</label>
                    <input
                      type="text"
                      value={loc2.phone || ''}
                      onChange={e => setLoc2({ ...loc2, phone: e.target.value })}
                      placeholder="+63 9..."
                      className="w-full px-3 py-2 rounded-xl bg-muted border border-border text-foreground text-sm mt-1"
                    />
                    {loc2.phone && <HotlineChatBadges phone={loc2.phone} variant="inline" className="mt-1" />}
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground">Email</label>
                    <input
                      type="email"
                      value={loc2.email || ''}
                      onChange={e => setLoc2({ ...loc2, email: e.target.value })}
                      placeholder="depot@mesina.farm"
                      className="w-full px-3 py-2 rounded-xl bg-muted border border-border text-foreground text-sm mt-1"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-muted-foreground">Operating Schedule</label>
                  <textarea
                    rows={3}
                    value={loc2.schedule || ''}
                    onChange={e => setLoc2({ ...loc2, schedule: e.target.value })}
                    placeholder="Mon - Fri: 8:00 AM - 4:00 PM&#10;Saturday: By Appointment"
                    className="w-full px-3 py-2 rounded-xl bg-muted border border-border text-foreground text-sm leading-relaxed mt-1"
                  />
                </div>
              </div>
            </div>

            {/* Right: Live Map Preview for Location 2 */}
            <div className="lg:col-span-6 glass-card rounded-2xl p-5 border border-border/70 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-foreground flex items-center gap-1.5">
                  <Compass className="w-4 h-4 text-primary" /> Location 2 Live Map Preview
                </span>
                <span className="font-mono text-muted-foreground text-[11px]">
                  {lat2.toFixed(4)}, {lng2.toFixed(4)}
                </span>
              </div>

              <div className="rounded-xl overflow-hidden border border-border/60 aspect-[4/3] bg-black/40">
                <iframe
                  src={mapEmbed2}
                  title="Location 2 Base Map Preview"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  loading="lazy"
                />
              </div>

              <div className="pt-2 flex flex-wrap items-center justify-between gap-2 text-xs">
                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${lat2},${lng2}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline font-semibold flex items-center gap-1"
                >
                  <span>Test Google Maps</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>

                <a
                  href={loc2.apple_maps_url || `https://maps.apple.com/?daddr=${lat2},${lng2}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-foreground hover:underline font-semibold flex items-center gap-1"
                >
                  <Apple className="w-3.5 h-3.5" />
                  <span>Test Apple Maps</span>
                </a>

                <a
                  href={loc2.mapquest_url || `https://www.mapquest.com/directions/to/${lat2},${lng2}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-500 hover:underline font-semibold flex items-center gap-1"
                >
                  <Compass className="w-3.5 h-3.5" />
                  <span>Test MapQuest</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* SUB-TAB 3: PHILIPPINE HOLIDAYS & OPERATIONAL TIMES CONTROLLER   */}
      {/* ============================================================== */}
      {activeSubTab === 'calendar' && (
        <div className="space-y-6 animate-scale-in">
          {/* SECTION 0: MASTER CALENDAR & FARM OPERATIONAL STATUS CONTROLLER */}
          <div
            className={`p-6 rounded-3xl border-2 transition-all space-y-5 shadow-lg ${
              calendarConfig.operational_status === 'non_operational'
                ? 'bg-red-500/10 border-red-500/50'
                : calendarConfig.operational_status === 'maintenance'
                ? 'bg-blue-500/10 border-blue-500/50'
                : calendarConfig.operational_status === 'by_appointment'
                ? 'bg-amber-500/10 border-amber-500/50'
                : 'bg-emerald-500/10 border-emerald-500/40'
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/50 pb-4">
              <div className="flex items-start gap-3">
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
                    calendarConfig.operational_status === 'non_operational'
                      ? 'bg-red-500 text-white'
                      : calendarConfig.operational_status === 'maintenance'
                      ? 'bg-blue-500 text-white'
                      : calendarConfig.operational_status === 'by_appointment'
                      ? 'bg-amber-500 text-white'
                      : 'bg-emerald-500 text-white'
                  }`}
                >
                  <Power className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-extrabold text-base text-foreground">
                      Farm Calendar Operational Status
                    </h3>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-xs font-extrabold uppercase tracking-wider ${
                        calendarConfig.operational_status === 'non_operational'
                          ? 'bg-red-500/20 text-red-600 dark:text-red-400 border border-red-500/30'
                          : calendarConfig.operational_status === 'maintenance'
                          ? 'bg-blue-500/20 text-blue-600 dark:text-blue-400 border border-blue-500/30'
                          : calendarConfig.operational_status === 'by_appointment'
                          ? 'bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/30'
                          : 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                      }`}
                    >
                      {calendarConfig.operational_status === 'non_operational'
                        ? '● Non-Operational / Closed'
                        : calendarConfig.operational_status === 'maintenance'
                        ? '● Biosecurity Maintenance'
                        : calendarConfig.operational_status === 'by_appointment'
                        ? '● By Appointment Only'
                        : '● Operational (Open)'}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5 max-w-xl">
                    Controls whether the farm is marked as operational or temporarily non-operational on the public website and visitor calendar.
                  </p>
                </div>
              </div>

              {/* Master Calendar Visibility Toggle */}
              <div className="flex items-center gap-3 self-start sm:self-center">
                <label className="flex items-center gap-2 cursor-pointer bg-card px-3 py-1.5 rounded-xl border border-border shadow-xs">
                  <input
                    type="checkbox"
                    checked={calendarConfig.enabled !== false}
                    onChange={e =>
                      setCalendarConfig({ ...calendarConfig, enabled: e.target.checked })
                    }
                    className="w-4 h-4 accent-primary rounded"
                  />
                  <span className="text-xs font-bold text-foreground">
                    {calendarConfig.enabled !== false ? 'Calendar Visible on Site' : 'Calendar Hidden'}
                  </span>
                </label>
              </div>
            </div>

            {/* Operational Status Options Radio / Select */}
            <div className="grid sm:grid-cols-4 gap-3">
              <label
                className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between ${
                  (calendarConfig.operational_status || 'operational') === 'operational'
                    ? 'bg-emerald-500/20 border-emerald-500 text-foreground ring-2 ring-emerald-500/30'
                    : 'bg-card border-border/70 text-muted-foreground hover:bg-muted/50'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-extrabold text-xs text-emerald-600 dark:text-emerald-400">
                    🟢 Operational
                  </span>
                  <input
                    type="radio"
                    name="op_status"
                    checked={(calendarConfig.operational_status || 'operational') === 'operational'}
                    onChange={() =>
                      setCalendarConfig({
                        ...calendarConfig,
                        operational_status: 'operational',
                        status_message: 'Open for Visits & Regular Dispatch'
                      })
                    }
                    className="accent-emerald-500"
                  />
                </div>
                <p className="text-[11px] leading-tight opacity-80">
                  Open for visits and live pickups per posted weekly schedule.
                </p>
              </label>

              <label
                className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between ${
                  calendarConfig.operational_status === 'non_operational'
                    ? 'bg-red-500/20 border-red-500 text-foreground ring-2 ring-red-500/30'
                    : 'bg-card border-border/70 text-muted-foreground hover:bg-muted/50'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-extrabold text-xs text-red-600 dark:text-red-400">
                    🔴 Non-Operational
                  </span>
                  <input
                    type="radio"
                    name="op_status"
                    checked={calendarConfig.operational_status === 'non_operational'}
                    onChange={() =>
                      setCalendarConfig({
                        ...calendarConfig,
                        operational_status: 'non_operational',
                        status_message: 'Farm Operations Temporarily Paused'
                      })
                    }
                    className="accent-red-500"
                  />
                </div>
                <p className="text-[11px] leading-tight opacity-80">
                  Farm gates and dispatches temporarily closed to all visitors.
                </p>
              </label>

              <label
                className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between ${
                  calendarConfig.operational_status === 'by_appointment'
                    ? 'bg-amber-500/20 border-amber-500 text-foreground ring-2 ring-amber-500/30'
                    : 'bg-card border-border/70 text-muted-foreground hover:bg-muted/50'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-extrabold text-xs text-amber-600 dark:text-amber-400">
                    🟡 By Appointment
                  </span>
                  <input
                    type="radio"
                    name="op_status"
                    checked={calendarConfig.operational_status === 'by_appointment'}
                    onChange={() =>
                      setCalendarConfig({
                        ...calendarConfig,
                        operational_status: 'by_appointment',
                        status_message: 'Limited Operations: Prior Appointment Required'
                      })
                    }
                    className="accent-amber-500"
                  />
                </div>
                <p className="text-[11px] leading-tight opacity-80">
                  Pre-booking required 24–48 hours prior for all pickups.
                </p>
              </label>

              <label
                className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between ${
                  calendarConfig.operational_status === 'maintenance'
                    ? 'bg-blue-500/20 border-blue-500 text-foreground ring-2 ring-blue-500/30'
                    : 'bg-card border-border/70 text-muted-foreground hover:bg-muted/50'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-extrabold text-xs text-blue-600 dark:text-blue-400">
                    🔵 Maintenance
                  </span>
                  <input
                    type="radio"
                    name="op_status"
                    checked={calendarConfig.operational_status === 'maintenance'}
                    onChange={() =>
                      setCalendarConfig({
                        ...calendarConfig,
                        operational_status: 'maintenance',
                        status_message: 'Biosecurity Pond Disinfection In Progress'
                      })
                    }
                    className="accent-blue-500"
                  />
                </div>
                <p className="text-[11px] leading-tight opacity-80">
                  Biosecurity water refresh, drainage, and aeration maintenance.
                </p>
              </label>
            </div>

            {/* Custom Status Message & Reason Inputs */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-1">
              <div>
                <label className="text-xs font-bold text-foreground block mb-1">
                  Public Status Announcement Text
                </label>
                <input
                  type="text"
                  value={calendarConfig.status_message || ''}
                  onChange={e =>
                    setCalendarConfig({ ...calendarConfig, status_message: e.target.value })
                  }
                  placeholder="e.g. Open for Visits & Regular Dispatch"
                  className="w-full px-3 py-2 rounded-xl bg-card border border-border text-foreground text-xs font-bold"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-foreground block mb-1">
                  Target Reopening Date (Optional)
                </label>
                <input
                  type="date"
                  value={calendarConfig.reopen_date || ''}
                  onChange={e =>
                    setCalendarConfig({ ...calendarConfig, reopen_date: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-xl bg-card border border-border text-foreground text-xs font-mono font-bold"
                />
              </div>

              <div className="sm:col-span-2 lg:col-span-1">
                <label className="text-xs font-bold text-foreground block mb-1">
                  Public Explanation / Advisory Notice
                </label>
                <input
                  type="text"
                  value={calendarConfig.non_operational_reason || ''}
                  onChange={e =>
                    setCalendarConfig({
                      ...calendarConfig,
                      non_operational_reason: e.target.value
                    })
                  }
                  placeholder="e.g. Gates closed for scheduled biosecurity pond liming."
                  className="w-full px-3 py-2 rounded-xl bg-card border border-border text-foreground text-xs"
                />
              </div>
            </div>
          </div>

          {/* SECTION 1: Standard Recurring Weekly Times */}
          <div className="glass-card rounded-2xl p-6 border border-border/70 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-extrabold text-sm text-foreground flex items-center gap-2">
                  <Clock className="w-4 h-4 text-primary" /> Regular Weekly Times of Operation
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Set baseline daily opening and closing hours shown on the calendar when no special holiday or maintenance is scheduled.
                </p>
              </div>
            </div>

            <div className="grid sm:grid-cols-3 gap-4 pt-2">
              <div className="p-4 rounded-xl border border-border/70 bg-card space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-foreground">Weekdays (Mon – Fri)</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-bold">
                    Open Daily
                  </span>
                </div>
                <input
                  type="text"
                  value={calendarConfig.weekday_hours || '7:00 AM – 5:00 PM PHT'}
                  onChange={e => setCalendarConfig({ ...calendarConfig, weekday_hours: e.target.value })}
                  placeholder="e.g. 7:00 AM – 5:00 PM PHT"
                  className="w-full px-3 py-1.5 rounded-lg bg-muted border border-border text-foreground text-xs font-bold font-mono"
                />
                <span className="text-[10px] text-muted-foreground block">
                  Staff on duty for on-site grading & direct ordering.
                </span>
              </div>

              <div className="p-4 rounded-xl border border-border/70 bg-card space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-foreground">Saturdays</span>
                  <label className="text-[10px] flex items-center gap-1 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={calendarConfig.saturdays_by_appointment}
                      onChange={e => setCalendarConfig({ ...calendarConfig, saturdays_by_appointment: e.target.checked })}
                      className="w-3.5 h-3.5 accent-primary"
                    />
                    <span className="font-semibold text-amber-500">By Appointment</span>
                  </label>
                </div>
                <input
                  type="text"
                  value={calendarConfig.saturday_hours || '7:00 AM – 3:00 PM (By Appointment Only)'}
                  onChange={e => setCalendarConfig({ ...calendarConfig, saturday_hours: e.target.value })}
                  placeholder="e.g. 7:00 AM – 3:00 PM"
                  className="w-full px-3 py-1.5 rounded-lg bg-muted border border-border text-foreground text-xs font-bold font-mono"
                />
                <span className="text-[10px] text-muted-foreground block">
                  Bulk fingerling packaging and scheduled transports.
                </span>
              </div>

              <div className="p-4 rounded-xl border border-border/70 bg-card space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-foreground">Sundays</span>
                  <label className="text-[10px] flex items-center gap-1 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={calendarConfig.closed_on_sundays}
                      onChange={e => setCalendarConfig({ ...calendarConfig, closed_on_sundays: e.target.checked })}
                      className="w-3.5 h-3.5 accent-primary"
                    />
                    <span className="font-semibold text-red-500">Non-Operational</span>
                  </label>
                </div>
                <input
                  type="text"
                  value={calendarConfig.sunday_hours || 'Closed All Day (Pond Disinfection & Aeration Flushing)'}
                  onChange={e => setCalendarConfig({ ...calendarConfig, sunday_hours: e.target.value })}
                  placeholder="e.g. Closed All Day"
                  className="w-full px-3 py-1.5 rounded-lg bg-muted border border-border text-foreground text-xs font-bold font-mono"
                />
                <span className="text-[10px] text-muted-foreground block">
                  Biosecurity treatment and weekly farm disinfection.
                </span>
              </div>
            </div>
          </div>

          {/* SECTION 2: Add Custom Non-Operational Date or Holiday with Exact Time of Operation */}
          <div className="glass-card rounded-2xl p-6 border-2 border-primary/30 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="font-extrabold text-sm text-foreground flex items-center gap-2">
                  <Plus className="w-4 h-4 text-primary" /> Schedule a Non-Operational Date, Holiday, or Special Hours
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Pick any calendar date and specify the exact operational status and time of operation.
                </p>
              </div>
            </div>

            {/* Quick Presets Bar */}
            <div className="space-y-1.5 p-3 rounded-xl bg-muted/40 border border-border/50">
              <span className="text-[11px] font-bold text-foreground block">
                Quick-Fill Standard Philippine Holidays ({new Date().getFullYear()}):
              </span>
              <div className="flex flex-wrap gap-1.5">
                {STANDARD_PH_HOLIDAYS_PRESETS.slice(0, 10).map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleQuickAddHoliday(preset)}
                    className="px-2.5 py-1 rounded-lg text-[10px] font-semibold bg-card border border-border/70 hover:border-primary/50 text-foreground transition-all cursor-pointer"
                  >
                    + {preset.name.split('(')[0].trim()} ({preset.mmdd})
                  </button>
                ))}
              </div>
            </div>

            {/* Input Form */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
              <div>
                <label className="text-xs font-bold text-muted-foreground block mb-1">
                  Date (YYYY-MM-DD) <span className="text-destructive">*</span>
                </label>
                <input
                  type="date"
                  required
                  value={newClosure.date}
                  onChange={e => setNewClosure({ ...newClosure, date: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-muted border border-border text-foreground text-xs font-mono font-bold"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-muted-foreground block mb-1">
                  Title / Reason <span className="text-destructive">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. All Saints' Day / System Disinfection"
                  value={newClosure.title}
                  onChange={e => setNewClosure({ ...newClosure, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-muted border border-border text-foreground text-xs font-semibold"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-muted-foreground block mb-1">
                  Operational Status
                </label>
                <select
                  value={newClosure.status}
                  onChange={e => {
                    const st = e.target.value as any;
                    let defaultTime = newClosure.time_of_operation;
                    if (st === 'closed') defaultTime = 'Closed All Day';
                    else if (st === 'by_appointment') defaultTime = '7:00 AM – 11:00 AM (By Appointment)';
                    else if (st === 'special_hours') defaultTime = '8:00 AM – 1:00 PM (Half Day)';
                    else defaultTime = '7:00 AM – 5:00 PM PHT';
                    setNewClosure({ ...newClosure, status: st, time_of_operation: defaultTime });
                  }}
                  className="w-full px-3 py-2 rounded-xl bg-muted border border-border text-foreground text-xs font-bold"
                >
                  <option value="closed">● Non-Operational / Closed</option>
                  <option value="by_appointment">◐ By Appointment Only</option>
                  <option value="special_hours">◑ Special / Half-Day Hours</option>
                  <option value="regular_hours">○ Open Regular Hours</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-primary block mb-1">
                  Exact Time of Operation <span className="text-destructive">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Closed All Day or 7:00 AM – 12:00 PM"
                  value={newClosure.time_of_operation}
                  onChange={e => setNewClosure({ ...newClosure, time_of_operation: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-muted border border-primary/50 text-foreground text-xs font-bold font-mono"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-muted-foreground block mb-1">
                Advisory Notes for Farmers (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. Please place fingerling orders 24 hours prior for morning transport pickup."
                value={newClosure.notes}
                onChange={e => setNewClosure({ ...newClosure, notes: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-muted border border-border text-foreground text-xs"
              />
            </div>

            <div className="flex items-center justify-between pt-1">
              <span className="text-[11px] text-muted-foreground">
                Will be displayed with status badges on the public calendar and live status pill.
              </span>
              <button
                type="button"
                onClick={handleAddClosure}
                className="py-2.5 px-5 rounded-xl bg-primary text-primary-foreground font-bold text-xs hover:bg-primary/90 flex items-center gap-1.5 transition-all shadow-md cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Save Date to Calendar</span>
              </button>
            </div>
          </div>

          {/* SECTION 3: Configured Scheduled Dates List with Inline Editing */}
          <div className="glass-card rounded-2xl p-6 border border-border/70 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-extrabold text-sm text-foreground flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-primary" /> Configured Holidays & Non-Operational Dates ({calendarConfig.custom_closures?.length || 0})
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Click the edit icon on any entry to modify its time of operation or operational status.
                </p>
              </div>
            </div>

            <div className="divide-y divide-border/40">
              {(calendarConfig.custom_closures || []).length === 0 ? (
                <div className="py-8 text-center text-xs text-muted-foreground">
                  No custom holiday or non-operational dates scheduled yet. Use the form above to add dates.
                </div>
              ) : (
                calendarConfig.custom_closures.map(item => {
                  const isEditing = editingId === item.id;
                  const itemTime = item.time_of_operation || item.hours_note || (item.status === 'closed' ? 'Closed All Day' : '7:00 AM – 12:00 PM');

                  if (isEditing) {
                    return (
                      <div key={item.id} className="py-4 space-y-3 bg-muted/30 p-4 rounded-xl border border-primary/40 animate-scale-in">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-xs text-primary">Editing Date: {editForm.date}</span>
                          <div className="flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => saveEditClosure(item.id)}
                              className="px-3 py-1 rounded-lg bg-emerald-500 text-white text-xs font-bold flex items-center gap-1 hover:bg-emerald-600 transition-colors"
                            >
                              <Check className="w-3.5 h-3.5" /> Save
                            </button>
                            <button
                              type="button"
                              onClick={() => setEditingId(null)}
                              className="px-3 py-1 rounded-lg glass text-xs text-muted-foreground hover:text-foreground"
                            >
                              <X className="w-3.5 h-3.5" /> Cancel
                            </button>
                          </div>
                        </div>

                        <div className="grid sm:grid-cols-4 gap-2.5">
                          <div>
                            <label className="text-[10px] font-bold text-muted-foreground block">Date</label>
                            <input
                              type="date"
                              value={editForm.date}
                              onChange={e => setEditForm({ ...editForm, date: e.target.value })}
                              className="w-full px-2.5 py-1.5 rounded-lg bg-card border border-border text-foreground font-mono font-bold text-xs"
                            />
                          </div>
                          <div>
                            <label className="text-[10px] font-bold text-muted-foreground block">Title</label>
                            <input
                              type="text"
                              value={editForm.title}
                              onChange={e => setEditForm({ ...editForm, title: e.target.value })}
                              className="w-full px-2.5 py-1.5 rounded-lg bg-card border border-border text-foreground text-xs"
                            />
                          </div>
                          <div>
                            <label className="text-[10px] font-bold text-muted-foreground block">Status</label>
                            <select
                              value={editForm.status}
                              onChange={e => setEditForm({ ...editForm, status: e.target.value as any })}
                              className="w-full px-2.5 py-1.5 rounded-lg bg-card border border-border text-foreground text-xs font-semibold"
                            >
                              <option value="closed">Closed / Non-Operational</option>
                              <option value="by_appointment">By Appointment Only</option>
                              <option value="special_hours">Special / Half-Day</option>
                              <option value="regular_hours">Regular Hours</option>
                            </select>
                          </div>
                          <div>
                            <label className="text-[10px] font-bold text-primary block">Time of Operation</label>
                            <input
                              type="text"
                              value={editForm.time_of_operation}
                              onChange={e => setEditForm({ ...editForm, time_of_operation: e.target.value })}
                              className="w-full px-2.5 py-1.5 rounded-lg bg-card border border-primary/50 text-foreground font-mono font-bold text-xs"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="text-[10px] font-bold text-muted-foreground block">Notes</label>
                          <input
                            type="text"
                            value={editForm.notes}
                            onChange={e => setEditForm({ ...editForm, notes: e.target.value })}
                            className="w-full px-2.5 py-1.5 rounded-lg bg-card border border-border text-foreground text-xs"
                          />
                        </div>
                      </div>
                    );
                  }

                  return (
                    <div key={item.id} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 group">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-mono text-xs font-extrabold text-primary bg-primary/10 px-2 py-0.5 rounded-md">
                            {item.date}
                          </span>
                          <span className="font-bold text-xs text-foreground">{item.title}</span>
                          <span
                            className={`text-[9px] px-2 py-0.5 rounded-full font-extrabold uppercase ${
                              item.status === 'closed'
                                ? 'bg-red-500/15 text-red-600 dark:text-red-400 border border-red-500/20'
                                : item.status === 'by_appointment'
                                ? 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/20'
                                : 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                            }`}
                          >
                            {item.status.replace('_', ' ')}
                          </span>
                        </div>

                        <div className="text-xs text-muted-foreground flex items-center gap-2 flex-wrap">
                          <span className="font-semibold text-foreground flex items-center gap-1">
                            <Clock className="w-3 h-3 text-primary" /> Time of Operation:
                          </span>
                          <span className="font-mono font-bold text-primary px-1.5 py-0.5 rounded bg-muted">
                            {itemTime}
                          </span>
                          {item.notes && <span className="text-[11px] opacity-80">— {item.notes}</span>}
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 self-end sm:self-center shrink-0">
                        <button
                          type="button"
                          onClick={() => startEditClosure(item)}
                          className="p-1.5 rounded-lg text-muted-foreground hover:text-primary hover:bg-muted transition-colors cursor-pointer"
                          title="Edit Date or Time of Operation"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteClosure(item.id)}
                          className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors cursor-pointer"
                          title="Delete scheduled date"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}
    </form>
  );
};
