import React, { useState, useEffect } from 'react';
import {
  MessageCircle,
  MessageSquare,
  MessagesSquare,
  Headset,
  Fish,
  LifeBuoy,
  Send,
  HelpCircle,
  Sparkles
} from 'lucide-react';
import { ChatWidgetIconType, ChatWidgetShapeType } from '../types';

interface LivechatStatusTagProps {
  enabled?: boolean;
  icon?: ChatWidgetIconType | string;
  shape?: ChatWidgetShapeType | string;
  customIconUrl?: string;
}

export const getShapeClass = (shape?: string): string => {
  switch (shape) {
    case 'circle':
      return 'rounded-full';
    case 'squircle':
      return 'rounded-2xl';
    case 'rounded':
      return 'rounded-xl';
    case 'chat-bubble':
      return 'rounded-3xl rounded-br-sm';
    case 'teardrop':
      return 'rounded-full rounded-br-none';
    default:
      return 'rounded-full';
  }
};

export const getDefaultShapeForIcon = (icon?: string): ChatWidgetShapeType => {
  switch (icon) {
    case 'message-circle':
    case 'headset':
    case 'life-buoy':
    case 'help-circle':
      return 'circle';
    case 'message-square':
    case 'sparkles':
      return 'squircle';
    case 'messages-square':
      return 'chat-bubble';
    case 'fish':
    case 'send':
      return 'teardrop';
    case 'custom':
      return 'squircle';
    default:
      return 'circle';
  }
};

export const LivechatStatusTag: React.FC<LivechatStatusTagProps> = ({
  enabled = true,
  icon = 'message-circle',
  shape,
  customIconUrl
}) => {
  // If shape is not explicitly provided, use the default shape matching the icon
  const resolvedShape = shape || getDefaultShapeForIcon(icon);
  const shapeClass = getShapeClass(resolvedShape);

  // Determine initial status based on local time in Philippine Timezone (UTC+8)
  const getPHTBusinessHoursStatus = () => {
    try {
      const now = new Date();
      const utc = now.getTime() + now.getTimezoneOffset() * 60000;
      const pht = new Date(utc + 3600000 * 8);
      const day = pht.getDay();
      const hour = pht.getHours();
      // Monday to Saturday: 7:00 AM to 5:00 PM
      if (day >= 1 && day <= 6 && hour >= 7 && hour < 17) {
        return true;
      }
      return false;
    } catch (e) {
      return true;
    }
  };

  const [isOnline, setIsOnline] = useState<boolean>(() => getPHTBusinessHoursStatus());
  const [isChatOpen, setIsChatOpen] = useState<boolean>(false);

  // Manage visibility of the Rocket.Chat widget iframe in DOM
  useEffect(() => {
    const styleId = 'rocketchat-disable-override';
    let styleTag = document.getElementById(styleId) as HTMLStyleElement | null;

    if (!enabled) {
      if (!styleTag) {
        styleTag = document.createElement('style');
        styleTag.id = styleId;
        styleTag.innerHTML = `
          #rocketchat-iframe,
          .rocketchat-widget,
          iframe[name*="rocketchat"],
          iframe[id*="rocketchat"],
          iframe[src*="messenger.mesina.farm"],
          div[class*="rocketchat"],
          .rocketchat-overlay {
            display: none !important;
            visibility: hidden !important;
            pointer-events: none !important;
            opacity: 0 !important;
          }
        `;
        document.head.appendChild(styleTag);
      }

      if (typeof (window as any).RocketChat === 'function') {
        try {
          (window as any).RocketChat(function (this: any) {
            if (typeof this.minimizeWidget === 'function') {
              this.minimizeWidget();
            }
          });
        } catch (e) {
          // ignore
        }
      }
    } else {
      // When enabled but chat is closed/minimized, hide default Rocket.Chat bubble so our custom icon & shape button shows
      if (!styleTag) {
        styleTag = document.createElement('style');
        styleTag.id = styleId;
        document.head.appendChild(styleTag);
      }
      if (!isChatOpen) {
        styleTag.innerHTML = `
          #rocketchat-iframe:not(.rocketchat-opened),
          iframe[name*="rocketchat"]:not(.rocketchat-opened) {
            opacity: 0 !important;
            pointer-events: none !important;
          }
        `;
      } else {
        styleTag.innerHTML = ``;
      }
    }

    return () => {
      // keep clean
    };
  }, [enabled, isChatOpen]);

  useEffect(() => {
    if (!enabled) return;

    // 1. Try querying Rocket.Chat livechat config API endpoint
    const checkLivechatOnline = async () => {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 4000);
        const res = await fetch('https://messenger.mesina.farm/api/v1/livechat/config', {
          signal: controller.signal
        });
        clearTimeout(timeoutId);
        if (res.ok) {
          const data = await res.json();
          if (data && data.config) {
            if (typeof data.config.online === 'boolean') {
              setIsOnline(data.config.online);
            }
          }
        }
      } catch (err) {
        // Fallback to schedule-based status if endpoint is unreachable or CORS blocked
        setIsOnline(getPHTBusinessHoursStatus());
      }
    };

    checkLivechatOnline();
    const interval = setInterval(checkLivechatOnline, 60000);

    // 2. Listen to custom events dispatched from RocketChat callback
    const handleStatusEvent = (e: any) => {
      const status = e.detail?.status;
      if (status === 'online' || status === true) {
        setIsOnline(true);
      } else if (status === 'offline' || status === false) {
        setIsOnline(false);
      }
    };

    const handleVisibilityEvent = (e: any) => {
      setIsChatOpen(Boolean(e.detail?.open));
    };

    window.addEventListener('rocketChatStatus', handleStatusEvent);
    window.addEventListener('rocketChatAgentStatus', handleStatusEvent);
    window.addEventListener('rocketChatVisibility', handleVisibilityEvent);

    // 3. Listen to window postMessage from Rocket.Chat iframe
    const handleWindowMessage = (e: MessageEvent) => {
      try {
        if (!e.data) return;
        const data = typeof e.data === 'string' ? JSON.parse(e.data) : e.data;
        if (data.src === 'rocketchat' || data.event) {
          if (data.fn === 'chat-maximized' || data.event === 'chat-maximized') {
            setIsChatOpen(true);
          } else if (data.fn === 'chat-minimized' || data.event === 'chat-minimized') {
            setIsChatOpen(false);
          }
          if (data.fn === 'status' || data.event === 'status') {
            const st = data.args ? data.args[0] : data.data;
            setIsOnline(st === 'online' || st === true);
          }
        }
      } catch (err) {
        // Ignore non-json or external messages
      }
    };

    window.addEventListener('message', handleWindowMessage);

    // 4. Hook into window.RocketChat API when available
    if (typeof (window as any).RocketChat === 'function') {
      try {
        (window as any).RocketChat(function (this: any) {
          if (typeof this.onServiceStatusChanged === 'function') {
            this.onServiceStatusChanged((status: any) => {
              setIsOnline(status === 'online' || status === true);
            });
          }
          if (typeof this.onAgentStatusChange === 'function') {
            this.onAgentStatusChange((status: any) => {
              setIsOnline(status === 'online' || status === 'available');
            });
          }
          if (typeof this.onChatMaximized === 'function') {
            this.onChatMaximized(() => setIsChatOpen(true));
          }
          if (typeof this.onChatMinimized === 'function') {
            this.onChatMinimized(() => setIsChatOpen(false));
          }
        });
      } catch (e) {
        // fallback
      }
    }

    return () => {
      clearInterval(interval);
      window.removeEventListener('rocketChatStatus', handleStatusEvent);
      window.removeEventListener('rocketChatAgentStatus', handleStatusEvent);
      window.removeEventListener('rocketChatVisibility', handleVisibilityEvent);
      window.removeEventListener('message', handleWindowMessage);
    };
  }, [enabled]);

  const handleOpenChat = () => {
    setIsChatOpen(true);
    if (typeof (window as any).RocketChat === 'function') {
      try {
        (window as any).RocketChat(function (this: any) {
          if (typeof this.maximizeWidget === 'function') {
            this.maximizeWidget();
          }
        });
      } catch (e) {
        // fallback
      }
    }
    // Also dispatch postMessage to iframe
    const iframe = document.getElementById('rocketchat-iframe') as HTMLIFrameElement;
    if (iframe && iframe.contentWindow) {
      iframe.contentWindow.postMessage({ src: 'rocketchat', fn: 'maximize' }, '*');
    }
  };

  // If the chat widget is disabled or currently maximized, hide the custom floating trigger
  if (!enabled || isChatOpen) {
    return null;
  }

  // Render the selected icon
  const renderIcon = () => {
    if (icon === 'custom' && customIconUrl) {
      return (
        <img
          src={customIconUrl}
          alt="Chat support"
          className="w-7 h-7 object-contain rounded-md"
        />
      );
    }

    switch (icon) {
      case 'message-square':
        return <MessageSquare className="w-7 h-7 text-primary-foreground transition-transform duration-300 group-hover:scale-110" />;
      case 'messages-square':
        return <MessagesSquare className="w-7 h-7 text-primary-foreground transition-transform duration-300 group-hover:scale-110" />;
      case 'headset':
        return <Headset className="w-7 h-7 text-primary-foreground transition-transform duration-300 group-hover:scale-110" />;
      case 'fish':
        return <Fish className="w-7 h-7 text-primary-foreground transition-transform duration-300 group-hover:scale-110" />;
      case 'life-buoy':
        return <LifeBuoy className="w-7 h-7 text-primary-foreground transition-transform duration-300 group-hover:scale-110" />;
      case 'send':
        return <Send className="w-6 h-6 text-primary-foreground transition-transform duration-300 group-hover:scale-110 translate-x-0.5" />;
      case 'help-circle':
        return <HelpCircle className="w-7 h-7 text-primary-foreground transition-transform duration-300 group-hover:scale-110" />;
      case 'sparkles':
        return <Sparkles className="w-7 h-7 text-primary-foreground transition-transform duration-300 group-hover:scale-110" />;
      case 'message-circle':
      default:
        return <MessageCircle className="w-7 h-7 text-primary-foreground transition-transform duration-300 group-hover:scale-110" />;
    }
  };

  return (
    <div className="fixed bottom-4 right-4 sm:right-6 z-40 flex flex-col items-end gap-1.5 select-none pointer-events-auto">
      {/* 1. Real-Time Online / Offline Status Tag */}
      <div
        onClick={handleOpenChat}
        className="cursor-pointer group transition-all duration-300 hover:scale-105 active:scale-95"
        style={{ filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.15))' }}
        title={isOnline ? 'Agent is Online — Click to chat' : 'Agent is Offline — Leave a message'}
      >
        <div
          className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold tracking-wide transition-all duration-300 border ${
            isOnline
              ? 'animate-blink-green bg-emerald-500/15 dark:bg-emerald-950/90 text-emerald-600 dark:text-emerald-300 border-emerald-500 ring-1 ring-emerald-500/40'
              : 'bg-card/95 text-muted-foreground border-border/80 shadow-md'
          }`}
        >
          {/* Status Dot Indicator */}
          <span className="relative flex h-2 w-2">
            {isOnline ? (
              <>
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-90"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500 shadow-sm shadow-emerald-400"></span>
              </>
            ) : (
              <span className="relative inline-flex rounded-full h-2 w-2 bg-slate-400 dark:bg-slate-500"></span>
            )}
          </span>

          {/* Tag Text */}
          <span className="font-extrabold uppercase text-[10px] tracking-wider">
            {isOnline ? 'Online' : 'Offline'}
          </span>

          {/* Small Icon in Tag */}
          <MessageCircle
            className={`w-3 h-3 ml-0.5 transition-transform duration-200 group-hover:scale-110 ${
              isOnline ? 'text-emerald-600 dark:text-emerald-400' : 'text-muted-foreground'
            }`}
          />
        </div>

        {/* Downward indicator triangle pointing directly at the custom widget button below */}
        <div className="flex justify-center -mt-1">
          <div
            className={`w-2 h-2 rotate-45 border-r border-b ${
              isOnline
                ? 'animate-blink-green bg-emerald-50 dark:bg-emerald-950/90 border-emerald-500'
                : 'bg-card/95 border-border/80'
            }`}
          />
        </div>
      </div>

      {/* 2. Custom Shaped Floating Action Button */}
      <button
        type="button"
        onClick={handleOpenChat}
        aria-label="Open Live Chat Support"
        title="Open Live Chat Support"
        className={`w-14 h-14 bg-primary text-primary-foreground flex items-center justify-center cursor-pointer shadow-2xl hover:scale-110 active:scale-95 transition-all duration-300 border-2 border-white/25 ring-4 ring-primary/20 group relative overflow-hidden ${shapeClass}`}
      >
        {/* Subtle glass reflection highlight */}
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-white/20 pointer-events-none" />

        {/* The Selected Icon */}
        <div className="relative z-10">
          {renderIcon()}
        </div>
      </button>
    </div>
  );
};
