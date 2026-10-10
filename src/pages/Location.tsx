import React, { useState } from 'react';
import {
  MapPin,
  Phone,
  Mail,
  Navigation,
  Clock,
  ExternalLink,
  Compass,
  ShieldAlert,
  Copy,
  Check,
  Apple,
  Layers,
  Building2,
  Calendar
} from 'lucide-react';
import { SiteSettings, FarmLocation } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { HotlineChatBadges } from '../components/HotlineChatBadges';
import { FarmOperationsCalendar } from '../components/FarmOperationsCalendar';

interface LocationProps {
  settings: SiteSettings;
}

export const Location: React.FC<LocationProps> = ({ settings }) => {
  const { t } = useLanguage();

  // Active Location selection: 'loc1' or 'loc2'
  const [activeLocKey, setActiveLocKey] = useState<'loc1' | 'loc2'>('loc1');

  const [userLoc, setUserLoc] = useState<{ lat: number; lng: number } | null>(null);
  const [locating, setLocating] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [copiedCoords, setCopiedCoords] = useState(false);
  const [copiedAddress, setCopiedAddress] = useState(false);

  // Check if Location 2 is enabled
  const hasLocation2 = Boolean(settings.location_2 && settings.location_2.enabled);
  const loc2: FarmLocation | undefined = settings.location_2;

  // Resolved active location data
  const isLoc2 = activeLocKey === 'loc2' && hasLocation2 && loc2;
  const activeName = isLoc2 ? loc2.name : settings.farm_name;
  const activeBadge = isLoc2 ? loc2.badge || 'Secondary Facility' : 'Primary Hatchery';
  const activeLat = isLoc2 ? loc2.lat : settings.lat || 14.8528759;
  const activeLng = isLoc2 ? loc2.lng : settings.lng || 120.5046859;
  const activeAddress = isLoc2 ? loc2.address : settings.address || 'Brgy. Balsic, Hermosa, Bataan, Philippines';
  const activePhone = isLoc2 && loc2.phone ? loc2.phone : settings.phone || '+63 962 527 9820';
  const activeEmail = isLoc2 && loc2.email ? loc2.email : settings.email || 'support@mesinafarms.com';
  const activeSchedule = isLoc2 && loc2.schedule
    ? loc2.schedule
    : settings.schedule || "Mon - Fri: 7:00 AM - 5:00 PM\nSaturday: By Appointment\nSunday: Closed (Farm Maintenance)";

  // Maps & Nav URLs for active location
  const mapEmbedUrl = `https://maps.google.com/maps?q=${activeLat},${activeLng}&hl=en&z=15&output=embed`;
  const defaultGoogleNavUrl = `https://www.google.com/maps/dir/?api=1&destination=${activeLat},${activeLng}`;
  const activeAppleNavUrl = isLoc2
    ? loc2.apple_maps_url || `https://maps.apple.com/?q=${encodeURIComponent(activeName)}&ll=${activeLat},${activeLng}`
    : settings.apple_maps_url || `https://maps.apple.com/?q=${encodeURIComponent(settings.farm_name)}&ll=${activeLat},${activeLng}`;

  // MapQuest route navigation URL
  const activeMapQuestUrl = isLoc2
    ? loc2.mapquest_url || `https://www.mapquest.com/directions/to/${activeLat},${activeLng}`
    : settings.mapquest_url || `https://www.mapquest.com/directions/to/${activeLat},${activeLng}`;

  const handleUseMyLocation = () => {
    setLocating(true);
    setErrorMsg('');

    if (!navigator.geolocation) {
      setErrorMsg('Geolocation is not supported by your browser.');
      setLocating(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      pos => {
        setUserLoc({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude
        });
        setLocating(false);
      },
      () => {
        setErrorMsg('Unable to access location. Please enable location permissions in your browser settings.');
        setLocating(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const handleCopyCoords = () => {
    navigator.clipboard.writeText(`${activeLat}, ${activeLng}`);
    setCopiedCoords(true);
    setTimeout(() => setCopiedCoords(false), 2000);
  };

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(activeAddress);
    setCopiedAddress(true);
    setTimeout(() => setCopiedAddress(false), 2000);
  };

  const activeNavUrl = userLoc
    ? `https://www.google.com/maps/dir/?api=1&origin=${userLoc.lat},${userLoc.lng}&destination=${activeLat},${activeLng}`
    : defaultGoogleNavUrl;

  return (
    <div className="min-h-screen pt-28 pb-20">
      {/* HEADER BANNER */}
      <section className="py-12 text-center bg-card/20 border-b border-border/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-xs font-bold uppercase tracking-widest text-primary mb-2">
            Farm Finder & Logistics Hub
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold mb-4 text-foreground">
            {settings.location_page_title || t.locationTitle}
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto text-sm sm:text-base">
            {settings.location_page_subtitle || t.locationSubtitle}
          </p>

          {/* Location 1 vs Location 2 Switcher Tabs (when Location 2 is enabled) */}
          {hasLocation2 && (
            <div className="mt-8 inline-flex items-center gap-2 p-1.5 rounded-2xl glass border border-border/70 shadow-lg">
              <button
                type="button"
                onClick={() => setActiveLocKey('loc1')}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
                  activeLocKey === 'loc1'
                    ? 'bg-primary text-primary-foreground shadow-md'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <Building2 className="w-4 h-4" />
                <span>Location 1: Main Hatchery (Ivisan)</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveLocKey('loc2')}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
                  activeLocKey === 'loc2'
                    ? 'bg-primary text-primary-foreground shadow-md'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <Layers className="w-4 h-4" />
                <span>Location 2: {loc2?.name || 'Secondary Facility'}</span>
                {loc2?.badge && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/20 text-white font-extrabold hidden sm:inline-block">
                    {loc2.badge}
                  </span>
                )}
              </button>
            </div>
          )}
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
        {/* ACTIVE LOCATION BANNER (if multi-location) */}
        {hasLocation2 && (
          <div className="p-4 rounded-2xl bg-primary/10 border border-primary/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2.5">
              <span className="w-3 h-3 rounded-full bg-primary animate-pulse" />
              <span className="font-extrabold text-foreground text-sm">
                Viewing: {activeName}
              </span>
              <span className="px-2 py-0.5 rounded-full bg-primary/20 text-primary font-bold text-[10px]">
                {activeBadge}
              </span>
            </div>
            <span className="text-muted-foreground">
              GPS Coordinates: <b className="font-mono text-foreground">{activeLat.toFixed(6)}, {activeLng.toFixed(6)}</b>
            </span>
          </div>
        )}

        {/* CONTACT & HOURS INFO GRID */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Address */}
          <div className="glass-card rounded-3xl p-6 space-y-3 flex flex-col justify-between shadow-sm hover:border-primary/40 transition-all">
            <div className="space-y-3">
              <div className="p-3 rounded-2xl bg-primary/20 text-primary w-fit">
                <MapPin className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-base text-foreground">{t.locationAddress}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">{activeAddress}</p>
            </div>
            <button
              onClick={handleCopyAddress}
              className="text-[11px] font-semibold text-primary inline-flex items-center gap-1.5 pt-2 hover:underline cursor-pointer"
            >
              {copiedAddress ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedAddress ? 'Address Copied!' : 'Copy Exact Address'}</span>
            </button>
          </div>

          {/* Coordinates */}
          <div className="glass-card rounded-3xl p-6 space-y-3 flex flex-col justify-between shadow-sm hover:border-primary/40 transition-all">
            <div className="space-y-3">
              <div className="p-3 rounded-2xl bg-primary/20 text-primary w-fit">
                <Compass className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-base text-foreground">{t.locationCoordinates}</h3>
              <div className="text-xs text-muted-foreground space-y-0.5 font-mono">
                <div>Lat: <span className="text-foreground font-bold">{activeLat.toFixed(6)}° N</span></div>
                <div>Lng: <span className="text-foreground font-bold">{activeLng.toFixed(6)}° E</span></div>
              </div>
            </div>
            <button
              onClick={handleCopyCoords}
              className="text-[11px] font-semibold text-primary inline-flex items-center gap-1.5 pt-2 hover:underline cursor-pointer"
            >
              {copiedCoords ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedCoords ? 'Coordinates Copied!' : 'Copy GPS Lat/Lng'}</span>
            </button>
          </div>

          {/* Hotline & Email with Viber and WhatsApp badges */}
          <div className="glass-card rounded-3xl p-6 space-y-3 flex flex-col justify-between shadow-sm hover:border-primary/40 transition-all">
            <div className="space-y-3">
              <div className="p-3 rounded-2xl bg-primary/20 text-primary w-fit">
                <Phone className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-base text-foreground">{t.locationPhone}</h3>
              <div>
                <a
                  href={`tel:${activePhone}`}
                  className="hover:text-primary transition-colors font-bold text-sm text-foreground block"
                >
                  {activePhone}
                </a>

                {/* Direct Viber and WhatsApp badges */}
                <HotlineChatBadges phone={activePhone} variant="badges" className="mt-1" />
              </div>

              <div className="text-xs text-muted-foreground pt-1">
                <div className="font-semibold text-foreground">{t.locationEmail}:</div>
                <a href={`mailto:${activeEmail}`} className="text-primary hover:underline">
                  {activeEmail}
                </a>
              </div>
            </div>
          </div>

          {/* Operating Hours */}
          <div className="glass-card rounded-3xl p-6 space-y-3 flex flex-col justify-between shadow-sm hover:border-primary/40 transition-all">
            <div className="space-y-3">
              <div className="p-3 rounded-2xl bg-primary/20 text-primary w-fit">
                <Clock className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-base text-foreground">{t.locationHours}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed whitespace-pre-line font-medium">
                {activeSchedule}
              </p>
            </div>
            <div className="text-[11px] text-accent font-semibold pt-1">
              ✓ Staff on Duty During Gate Hours
            </div>
          </div>
        </div>

        {/* MAP & ROUTE NAVIGATOR SECTION */}
        <div className="grid lg:grid-cols-12 gap-8 items-start">
          {/* Google Maps Base Map Embed Frame */}
          <div className="lg:col-span-8 glass-card rounded-3xl overflow-hidden border border-border/60 shadow-2xl relative min-h-[500px]">
            <div className="p-3 bg-card/70 border-b border-border/40 flex items-center justify-between text-xs text-muted-foreground px-4">
              <span className="font-semibold text-foreground flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-primary" /> Google Maps Base View: {activeName}
              </span>
              <span className="text-[11px] font-mono bg-muted/60 px-2 py-0.5 rounded-full">
                {activeLat.toFixed(4)}, {activeLng.toFixed(4)}
              </span>
            </div>
            <iframe
              src={mapEmbedUrl}
              title={`${activeName} Google Maps Location`}
              width="100%"
              height="500"
              style={{ border: 0 }}
              allowFullScreen={false}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="w-full h-full min-h-[500px]"
            />
          </div>

          {/* Navigation Controls: Google Maps, Apple Maps, MapQuest */}
          <div className="lg:col-span-4 glass-card rounded-3xl p-6 sm:p-8 space-y-6">
            <div>
              <h3 className="text-xl font-bold text-foreground mb-1.5 flex items-center gap-2">
                <Compass className="w-5 h-5 text-primary" /> Route Navigator
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Choose your favorite navigation app for direct turn-by-turn directions to {activeName}.
              </p>
            </div>

            {errorMsg && (
              <div className="p-3 rounded-2xl bg-destructive/10 border border-destructive/30 text-destructive text-xs flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {userLoc && (
              <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs">
                ✓ Origin coordinates acquired! Ready for routing.
              </div>
            )}

            <div className="space-y-3">
              <button
                type="button"
                onClick={handleUseMyLocation}
                disabled={locating}
                className="w-full py-3 px-4 rounded-2xl glass font-semibold text-xs sm:text-sm text-foreground hover:ring-2 hover:ring-primary/40 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Navigation className={`w-4 h-4 text-primary ${locating ? 'animate-spin' : ''}`} />
                <span>{locating ? 'Locating Your Position...' : t.locationCurrentLocation}</span>
              </button>

              {/* 1. Google Maps Button */}
              <a
                href={activeNavUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3.5 px-4 rounded-2xl bg-primary text-primary-foreground font-bold text-xs sm:text-sm hover:bg-primary/90 transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-primary/25 hover:scale-[1.02]"
              >
                <span>{t.locationGoogleMaps}</span>
                <ExternalLink className="w-4 h-4" />
              </a>

              {/* 2. Apple Maps Button for Mac/iOS users */}
              <a
                href={activeAppleNavUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3.5 px-4 rounded-2xl bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 font-bold text-xs sm:text-sm hover:opacity-90 transition-all flex items-center justify-center gap-2 shadow-md hover:scale-[1.02]"
              >
                <Apple className="w-4 h-4 shrink-0" />
                <span>{t.locationAppleMaps} (Apple Maps)</span>
                <ExternalLink className="w-4 h-4 ml-auto" />
              </a>

              {/* 3. MapQuest App Navigation Button */}
              <a
                href={activeMapQuestUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3.5 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 shadow-md hover:scale-[1.02]"
              >
                <Compass className="w-4 h-4 shrink-0 text-emerald-200" />
                <span>MapQuest Route Navigation</span>
                <ExternalLink className="w-4 h-4 ml-auto" />
              </a>
            </div>

            <div className="p-4 rounded-2xl bg-muted/40 border border-border/50 text-[11px] text-muted-foreground space-y-1">
              <div className="font-semibold text-foreground">Live Delivery Advisory:</div>
              <p>For fingerling pickup containers, please bring aerated or oxygenated drums. Cool early mornings (7:00 AM – 9:00 AM) are best for low transit stress.</p>
            </div>
          </div>
        </div>

        {/* FARM OPERATIONS & PHILIPPINE HOLIDAYS CALENDAR */}
        <section id="calendar" className="pt-4">
          <FarmOperationsCalendar config={settings.farm_calendar} />
        </section>
      </div>
    </div>
  );
};
