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
  Apple
} from 'lucide-react';
import { SiteSettings } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface LocationProps {
  settings: SiteSettings;
}

export const Location: React.FC<LocationProps> = ({ settings }) => {
  const { t } = useLanguage();
  const [userLoc, setUserLoc] = useState<{ lat: number; lng: number } | null>(null);
  const [locating, setLocating] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [copiedCoords, setCopiedCoords] = useState(false);
  const [copiedAddress, setCopiedAddress] = useState(false);

  const lat = settings.lat || 11.535766;
  const lng = settings.lng || 122.652221;
  const address = settings.address || 'Brgy. Cabugao, Ivisan, Capiz, Philippines';
  const phone = settings.phone || '+63 962 527 9820';
  const email = settings.email || 'support@mesina.farm';

  // Google Maps base map embed
  const mapEmbedUrl = `https://maps.google.com/maps?q=${lat},${lng}&hl=en&z=15&output=embed`;
  const defaultNavUrl = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
  const appleNavUrl = settings.apple_maps_url || `https://maps.apple.com/?q=${encodeURIComponent(settings.farm_name)}&ll=${lat},${lng}`;

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
    navigator.clipboard.writeText(`${lat}, ${lng}`);
    setCopiedCoords(true);
    setTimeout(() => setCopiedCoords(false), 2000);
  };

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(address);
    setCopiedAddress(true);
    setTimeout(() => setCopiedAddress(false), 2000);
  };

  const activeNavUrl = userLoc
    ? `https://www.google.com/maps/dir/?api=1&origin=${userLoc.lat},${userLoc.lng}&destination=${lat},${lng}`
    : defaultNavUrl;

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
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
        {/* CONTACT & HOURS INFO GRID */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Address */}
          <div className="glass-card rounded-3xl p-6 space-y-3 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="p-3 rounded-2xl bg-primary/20 text-primary w-fit">
                <MapPin className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-base text-foreground">{t.locationAddress}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">{address}</p>
            </div>
            <button
              onClick={handleCopyAddress}
              className="text-[11px] font-semibold text-primary inline-flex items-center gap-1.5 pt-2 hover:underline"
            >
              {copiedAddress ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedAddress ? 'Address Copied!' : 'Copy Exact Address'}</span>
            </button>
          </div>

          {/* Coordinates */}
          <div className="glass-card rounded-3xl p-6 space-y-3 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="p-3 rounded-2xl bg-primary/20 text-primary w-fit">
                <Compass className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-base text-foreground">{t.locationCoordinates}</h3>
              <div className="text-xs text-muted-foreground space-y-0.5 font-mono">
                <div>Lat: <span className="text-foreground font-bold">{lat.toFixed(6)}° N</span></div>
                <div>Lng: <span className="text-foreground font-bold">{lng.toFixed(6)}° E</span></div>
              </div>
            </div>
            <button
              onClick={handleCopyCoords}
              className="text-[11px] font-semibold text-primary inline-flex items-center gap-1.5 pt-2 hover:underline"
            >
              {copiedCoords ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedCoords ? 'Coordinates Copied!' : 'Copy GPS Lat/Lng'}</span>
            </button>
          </div>

          {/* Hotline & Email */}
          <div className="glass-card rounded-3xl p-6 space-y-3 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="p-3 rounded-2xl bg-primary/20 text-primary w-fit">
                <Phone className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-base text-foreground">{t.locationPhone}</h3>
              <p className="text-xs text-muted-foreground">
                <a href={`tel:${phone}`} className="hover:text-primary transition-colors font-bold text-sm">
                  {phone}
                </a>
              </p>
              <div className="text-xs text-muted-foreground pt-1">
                <div className="font-semibold text-foreground">{t.locationEmail}:</div>
                <a href={`mailto:${email}`} className="text-primary hover:underline">
                  {email}
                </a>
              </div>
            </div>
          </div>

          {/* Operating Hours */}
          <div className="glass-card rounded-3xl p-6 space-y-3 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="p-3 rounded-2xl bg-primary/20 text-primary w-fit">
                <Clock className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-base text-foreground">{t.locationHours}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed whitespace-pre-line font-medium">
                {settings.schedule || "Mon - Fri: 7:00 AM - 5:00 PM\nSaturday: By Appointment\nSunday: Closed"}
              </p>
            </div>
            <div className="text-[11px] text-accent font-semibold pt-1">
              ✓ Hatchery Staff on Duty Daily
            </div>
          </div>
        </div>

        {/* MAP & ROUTE NAVIGATOR SECTION */}
        <div className="grid lg:grid-cols-12 gap-8 items-start">
          {/* Google Maps Base Map Embed Frame */}
          <div className="lg:col-span-8 glass-card rounded-3xl overflow-hidden border border-border/60 shadow-2xl relative min-h-[480px]">
            <div className="p-3 bg-card/70 border-b border-border/40 flex items-center justify-between text-xs text-muted-foreground px-4">
              <span className="font-semibold text-foreground flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-primary" /> Google Maps Base View: Mesina Farms
              </span>
              <span className="text-[11px] font-mono bg-muted/60 px-2 py-0.5 rounded-full">
                {lat.toFixed(4)}, {lng.toFixed(4)}
              </span>
            </div>
            <iframe
              src={mapEmbedUrl}
              title="Mesina Farms Google Maps Location"
              width="100%"
              height="480"
              style={{ border: 0 }}
              allowFullScreen={false}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="w-full h-full min-h-[480px]"
            />
          </div>

          {/* Navigation Controls & Apple Maps for Mac Users */}
          <div className="lg:col-span-4 glass-card rounded-3xl p-6 sm:p-8 space-y-6">
            <div>
              <h3 className="text-xl font-bold text-foreground mb-2 flex items-center gap-2">
                <Compass className="w-5 h-5 text-primary" /> Route Navigator
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Choose your preferred map application for direct turn-by-turn routing to our hatchery gate in Ivisan, Capiz.
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

            <div className="space-y-3.5">
              <button
                type="button"
                onClick={handleUseMyLocation}
                disabled={locating}
                className="w-full py-3 px-4 rounded-2xl glass font-semibold text-xs sm:text-sm text-foreground hover:ring-2 hover:ring-primary/40 transition-all flex items-center justify-center gap-2"
              >
                <Navigation className={`w-4 h-4 text-primary ${locating ? 'animate-spin' : ''}`} />
                <span>{locating ? 'Locating Your Position...' : t.locationCurrentLocation}</span>
              </button>

              {/* Google Maps Button */}
              <a
                href={activeNavUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3.5 px-4 rounded-2xl bg-primary text-primary-foreground font-bold text-xs sm:text-sm hover:bg-primary/90 transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-primary/25 hover:scale-[1.02]"
              >
                <span>{t.locationGoogleMaps}</span>
                <ExternalLink className="w-4 h-4" />
              </a>

              {/* Apple Maps Button for Mac/iOS users */}
              <a
                href={appleNavUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3.5 px-4 rounded-2xl bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 font-bold text-xs sm:text-sm hover:opacity-90 transition-all flex items-center justify-center gap-2 shadow-md hover:scale-[1.02]"
              >
                <Apple className="w-4 h-4 shrink-0" />
                <span>{t.locationAppleMaps} (Mac & iOS)</span>
                <ExternalLink className="w-4 h-4 ml-auto" />
              </a>
            </div>

            <div className="p-4 rounded-2xl bg-muted/40 border border-border/50 text-[11px] text-muted-foreground space-y-1">
              <div className="font-semibold text-foreground">Logistics Advisory:</div>
              <p>For live fingerling pickups, we recommend arriving early in the morning (7:00 AM - 9:00 AM) to maintain cool water transport conditions.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
