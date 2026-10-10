import React from 'react';
import { ExternalLink, MessageCircle } from 'lucide-react';

interface HotlineChatBadgesProps {
  phone: string;
  variant?: 'badges' | 'buttons' | 'inline';
  className?: string;
}

// Custom crisp SVG for Viber logo
export const ViberIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    aria-hidden="true"
  >
    <path d="M19.333 13.917c-.308-.224-2.023-1.07-2.316-1.173-.293-.102-.507-.154-.72.154-.214.308-.828 1.07-1.014 1.288-.187.218-.374.244-.682.09-.308-.154-1.303-.507-2.482-1.611-.918-.859-1.538-1.92-1.718-2.242-.18-.321-.02-.495.134-.649.139-.139.308-.36.462-.54.154-.18.206-.308.308-.514.103-.205.051-.385-.025-.54-.077-.154-.72-1.822-.986-2.495-.26-.653-.523-.564-.72-.574l-.615-.01c-.214 0-.563.082-.857.41-.294.328-1.127 1.161-1.127 2.833 0 1.673 1.157 3.29 1.318 3.515.161.226 2.278 3.69 5.626 5.068 2.784 1.145 3.35 1.017 3.948.96.6-.057 1.942-.843 2.215-1.657.274-.814.274-1.512.193-1.657-.082-.144-.294-.226-.602-.45zM12 2C6.477 2 2 6.477 2 12c0 1.892.527 3.662 1.442 5.176L2 22l4.982-1.39A9.957 9.957 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18c-1.653 0-3.193-.5-4.48-1.356l-.322-.213-2.957.825.836-2.883-.233-.352A7.953 7.953 0 014 12c0-4.411 3.589-8 8-8s8 3.589 8 8-3.589 8-8 8z" />
  </svg>
);

// Custom crisp SVG for WhatsApp logo
export const WhatsAppIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    aria-hidden="true"
  >
    <path d="M12.031 2C6.505 2 2.016 6.489 2.016 12.015c0 1.879.52 3.639 1.424 5.143L2 22l5.011-1.385a9.96 9.96 0 005.02 1.4c5.525 0 10.015-4.489 10.015-10.015S17.556 2 12.031 2zm0 18.258c-1.597 0-3.084-.46-4.348-1.258l-.312-.196-2.972.822.84-2.898-.225-.342a8.214 8.214 0 01-1.261-4.371c0-4.551 3.702-8.253 8.253-8.253 4.551 0 8.253 3.702 8.253 8.253 0 4.552-3.702 8.253-8.253 8.253zm4.524-6.185c-.248-.124-1.468-.724-1.696-.807-.228-.083-.394-.124-.56.124-.166.248-.642.807-.787.973-.145.166-.29.187-.539.062-.248-.124-1.049-.387-1.998-1.233-.739-.659-1.238-1.473-1.383-1.722-.145-.248-.016-.383.109-.506.112-.112.248-.29.373-.435.124-.145.166-.248.248-.415.083-.166.041-.311-.021-.435-.062-.124-.56-1.349-.767-1.847-.202-.484-.407-.418-.56-.426l-.477-.008c-.166 0-.435.062-.663.311-.228.248-.871.851-.871 2.075 0 1.224.892 2.407 1.016 2.573.124.166 1.755 2.68 4.252 3.758 2.497 1.079 2.497.719 2.953.678.456-.041 1.468-.601 1.676-1.181.207-.581.207-1.079.145-1.182-.062-.104-.228-.166-.477-.29z" />
  </svg>
);

export const HotlineChatBadges: React.FC<HotlineChatBadgesProps> = ({
  phone,
  variant = 'badges',
  className = ''
}) => {
  // Clean phone number for links
  // E.g. "+63 962 527 9820" -> "639625279820"
  const digitsOnly = phone.replace(/[^0-9]/g, '');
  const internationalPhone = digitsOnly.startsWith('0')
    ? `63${digitsOnly.slice(1)}`
    : digitsOnly.startsWith('63')
    ? digitsOnly
    : `63${digitsOnly}`;

  // WhatsApp link
  const whatsAppUrl = `https://wa.me/${internationalPhone}?text=${encodeURIComponent(
    'Hello Mesina Farms! I would like to inquire about catfish fingerlings & hatchery pickups.'
  )}`;

  // Viber link (viber://chat?number=...)
  const viberUrl = `viber://chat?number=%2B${internationalPhone}`;

  if (variant === 'inline') {
    return (
      <div className={`inline-flex items-center gap-1.5 ${className}`}>
        <a
          href={whatsAppUrl}
          target="_blank"
          rel="noopener noreferrer"
          title="Chat on WhatsApp"
          className="p-1 rounded-md text-emerald-500 hover:text-emerald-400 hover:bg-emerald-500/10 transition-colors"
        >
          <WhatsAppIcon className="w-3.5 h-3.5" />
        </a>
        <a
          href={viberUrl}
          title="Chat on Viber"
          className="p-1 rounded-md text-purple-500 hover:text-purple-400 hover:bg-purple-500/10 transition-colors"
        >
          <ViberIcon className="w-3.5 h-3.5" />
        </a>
      </div>
    );
  }

  if (variant === 'buttons') {
    return (
      <div className={`flex flex-wrap items-center gap-2 ${className}`}>
        {/* WhatsApp Button */}
        <a
          href={whatsAppUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="px-3 py-1.5 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 text-xs font-bold inline-flex items-center gap-1.5 transition-all shadow-xs hover:scale-105 active:scale-95"
        >
          <WhatsAppIcon className="w-3.5 h-3.5 text-emerald-500" />
          <span>WhatsApp Chat</span>
        </a>

        {/* Viber Button */}
        <a
          href={viberUrl}
          className="px-3 py-1.5 rounded-xl bg-purple-500/15 hover:bg-purple-500/25 text-purple-600 dark:text-purple-300 border border-purple-500/30 text-xs font-bold inline-flex items-center gap-1.5 transition-all shadow-xs hover:scale-105 active:scale-95"
        >
          <ViberIcon className="w-3.5 h-3.5 text-purple-500" />
          <span>Viber Hotline</span>
        </a>
      </div>
    );
  }

  // Default 'badges' variant
  return (
    <div className={`flex items-center gap-1.5 pt-1.5 ${className}`}>
      <span className="text-[10px] uppercase font-bold text-muted-foreground mr-0.5">
        Chat:
      </span>
      <a
        href={whatsAppUrl}
        target="_blank"
        rel="noopener noreferrer"
        title="Direct message via WhatsApp"
        className="px-2 py-0.5 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 text-[10px] font-extrabold inline-flex items-center gap-1 transition-all"
      >
        <WhatsAppIcon className="w-3 h-3 text-emerald-500" />
        <span>WhatsApp</span>
      </a>
      <a
        href={viberUrl}
        title="Direct chat via Viber Hotline"
        className="px-2 py-0.5 rounded-lg bg-purple-500/15 hover:bg-purple-500/25 text-purple-600 dark:text-purple-300 border border-purple-500/30 text-[10px] font-extrabold inline-flex items-center gap-1 transition-all"
      >
        <ViberIcon className="w-3 h-3 text-purple-500" />
        <span>Viber</span>
      </a>
    </div>
  );
};
