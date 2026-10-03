import React, { useState, useEffect } from 'react';
import { MessageCircle } from 'lucide-react';

export const LivechatStatusTag: React.FC = () => {
  // Determine initial status based on local time in Philippine Timezone (UTC+8)
  const getPHTBusinessHoursStatus = () => {
    try {
      const now = new Date();
      // Convert to UTC+8 (Philippine Standard Time)
      const utc = now.getTime() + now.getTimezoneOffset() * 60000;
      const pht = new Date(utc + 3600000 * 8);
      const day = pht.getDay(); // 0 is Sunday, 6 is Saturday
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
  const [widgetDetected, setWidgetDetected] = useState<boolean>(false);

  useEffect(() => {
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
    const interval = setInterval(checkLivechatOnline, 60000); // Check every 60s

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

    // 5. Watch for Rocket.Chat iframe appearing in DOM to ensure proper alignment
    const checkWidgetDOM = () => {
      const el = document.getElementById('rocketchat-iframe') ||
                 document.querySelector('iframe[name="rocketchat-iframe"]') ||
                 document.querySelector('.rocketchat-widget');
      if (el) {
        setWidgetDetected(true);
      }
    };
    checkWidgetDOM();
    const domInterval = setInterval(checkWidgetDOM, 1000);

    return () => {
      clearInterval(interval);
      clearInterval(domInterval);
      window.removeEventListener('rocketChatStatus', handleStatusEvent);
      window.removeEventListener('rocketChatAgentStatus', handleStatusEvent);
      window.removeEventListener('rocketChatVisibility', handleVisibilityEvent);
      window.removeEventListener('message', handleWindowMessage);
    };
  }, []);

  const handleOpenChat = () => {
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
    // Also try finding iframe or trigger
    const iframe = document.getElementById('rocketchat-iframe') as HTMLIFrameElement;
    if (iframe && iframe.contentWindow) {
      iframe.contentWindow.postMessage({ src: 'rocketchat', fn: 'maximize' }, '*');
    }
  };

  // If the chat window is currently maximized, hide the floating tag so it doesn't obstruct the conversation
  if (isChatOpen) {
    return null;
  }

  return (
    <div
      onClick={handleOpenChat}
      className="fixed bottom-[74px] right-4 sm:right-6 z-50 cursor-pointer select-none group transition-all duration-300 hover:scale-105 active:scale-95"
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

        {/* Small Chat Icon */}
        <MessageCircle
          className={`w-3 h-3 ml-0.5 transition-transform duration-200 group-hover:scale-110 ${
            isOnline ? 'text-emerald-600 dark:text-emerald-400' : 'text-muted-foreground'
          }`}
        />
      </div>

      {/* Downward indicator triangle pointing directly at the widget below */}
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
  );
};
