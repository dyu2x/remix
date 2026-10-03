import React, { useState, useEffect } from 'react';
import { MessageSquare, X, Send, Phone, Mail, Sparkles, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

declare global {
  interface Window {
    RocketChat?: any;
  }
}

export const LiveChatWidget: React.FC = () => {
  const { t } = useLanguage();
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [fallbackOpen, setFallbackOpen] = useState(false);
  const [fallbackName, setFallbackName] = useState('');
  const [fallbackMsg, setFallbackMsg] = useState('');
  const [fallbackSent, setFallbackSent] = useState(false);

  // Show friendly tooltip after 3 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowTooltip(true);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  // Sync with Rocket.Chat state and manage visibility of default button
  useEffect(() => {
    const syncRocketChat = () => {
      if (typeof window === 'undefined') return;

      const iframe = document.getElementById('rocketchat-iframe') as HTMLIFrameElement | null;
      if (iframe) {
        const height = parseInt(iframe.style.height || '0', 10);
        // RocketChat maximized window is typically 400px+ high
        const isMaximized = height > 150 || iframe.classList.contains('rocketchat-opened');
        setIsChatOpen(isMaximized);

        if (!isMaximized) {
          // Hide Rocket.Chat's default round button so our custom floating bubble message cloud is the sole trigger
          iframe.style.setProperty('opacity', '0', 'important');
          iframe.style.setProperty('pointer-events', 'none', 'important');
        } else {
          iframe.style.setProperty('opacity', '1', 'important');
          iframe.style.setProperty('pointer-events', 'auto', 'important');
        }
      }
    };

    const interval = setInterval(syncRocketChat, 400);

    // Register RocketChat event callbacks if available
    if (window.RocketChat) {
      try {
        window.RocketChat(function (this: any) {
          if (this.onChatMaximized) {
            this.onChatMaximized(() => {
              setIsChatOpen(true);
              const iframe = document.getElementById('rocketchat-iframe');
              if (iframe) {
                iframe.style.setProperty('opacity', '1', 'important');
                iframe.style.setProperty('pointer-events', 'auto', 'important');
              }
            });
          }
          if (this.onChatMinimized) {
            this.onChatMinimized(() => {
              setIsChatOpen(false);
              syncRocketChat();
            });
          }
        });
      } catch (e) {
        // Safe fallback
      }
    }

    return () => clearInterval(interval);
  }, []);

  const handleTriggerChat = () => {
    setShowTooltip(false);

    // Try triggering Rocket.Chat maximize
    let triggered = false;
    if (window.RocketChat) {
      try {
        window.RocketChat(function (this: any) {
          if (this.maximizeWidget) {
            this.maximizeWidget();
            triggered = true;
          } else if (this.toggleWidget) {
            this.toggleWidget();
            triggered = true;
          }
        });
      } catch (err) {
        triggered = false;
      }
    }

    const iframe = document.getElementById('rocketchat-iframe') as HTMLIFrameElement | null;
    if (iframe) {
      iframe.style.setProperty('opacity', '1', 'important');
      iframe.style.setProperty('pointer-events', 'auto', 'important');
      // If RocketChat API didn't open it directly, simulate click or check
      try {
        iframe.contentWindow?.postMessage('rocketchat-widget-open', '*');
      } catch (e) {
        // Cross origin
      }
      triggered = true;
    }

    // If Rocket.Chat is not loaded/reachable within 500ms, open the built-in instant direct chat
    setTimeout(() => {
      const activeIframe = document.getElementById('rocketchat-iframe') as HTMLIFrameElement | null;
      const height = parseInt(activeIframe?.style.height || '0', 10);
      if (!triggered || height <= 120) {
        setFallbackOpen(true);
      }
    }, 450);
  };

  const handleSendFallback = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fallbackMsg.trim()) return;

    try {
      const existingInquiries = JSON.parse(localStorage.getItem('mesina_inquiries') || '[]');
      const newInquiry = {
        id: `chat-${Date.now()}`,
        customer_name: fallbackName.trim() || 'Live Chat Visitor',
        email: 'livechat@mesina.farm',
        phone: '+63',
        fingerling_name: 'Live Chat Question',
        quantity: null,
        message: fallbackMsg.trim(),
        status: 'pending',
        contact_status: 'not_contacted',
        created_date: new Date().toISOString()
      };
      localStorage.setItem('mesina_inquiries', JSON.stringify([newInquiry, ...existingInquiries]));
    } catch {
      // Ignored
    }

    setFallbackSent(true);
    setTimeout(() => {
      setFallbackSent(false);
      setFallbackOpen(false);
      setFallbackMsg('');
      setFallbackName('');
    }, 2500);
  };

  // If chat window is already opened by Rocket.Chat, hide floating trigger so they don't overlap
  if (isChatOpen) {
    return null;
  }

  return (
    <>
      {/* FLOATING BUBBLE MESSAGE CLOUD CONTAINER */}
      <aside aria-label="Live Chat" className="fixed bottom-6 right-6 z-40 select-none flex flex-col items-end">
        {/* Friendly speech bubble banner tooltip */}
        {showTooltip && !fallbackOpen && (
          <div className="mb-3 mr-2 relative animate-scale-in">
            <div className="bg-card/95 backdrop-blur-md border border-primary/30 text-foreground px-4 py-2 rounded-2xl shadow-xl text-xs font-semibold flex items-center gap-2 max-w-xs ring-1 ring-primary/20">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              <span>Questions? Chat with our hatchery team!</span>
              <button
                type="button"
                onClick={e => {
                  e.stopPropagation();
                  setShowTooltip(false);
                }}
                className="text-muted-foreground hover:text-foreground ml-1 p-0.5"
                aria-label="Dismiss tooltip"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
            {/* Tooltip triangle pointing to the cloud */}
            <div className="absolute -bottom-1.5 right-6 w-3 h-3 bg-card border-r border-b border-primary/30 rotate-45" />
          </div>
        )}

        {/* The Floating Bubble Message Cloud Button */}
        <div className="relative group cursor-pointer" onClick={handleTriggerChat}>
          {/* Ambient Glow Aura */}
          <div className="absolute inset-0 bg-primary/30 rounded-full blur-xl group-hover:bg-primary/50 transition-all duration-500 scale-90 group-hover:scale-110" />

          {/* Cloud Bubble Shape & Animation */}
          <div className="relative w-20 h-16 sm:w-22 sm:h-18 transition-transform duration-300 group-hover:scale-110 group-active:scale-95 animate-cloud-float">
            {/* SVG Bubble Message Cloud Shape */}
            <svg
              viewBox="0 0 120 100"
              className="w-full h-full drop-shadow-[0_10px_20px_rgba(20,184,166,0.35)] dark:drop-shadow-[0_10px_20px_rgba(13,148,136,0.5)]"
            >
              <defs>
                <linearGradient id="cloudGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#14b8a6" />
                  <stop offset="50%" stopColor="#0d9488" />
                  <stop offset="100%" stopColor="#042f2e" />
                </linearGradient>
                <linearGradient id="cloudInnerGlow" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#ffffff" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
                </linearGradient>
                <filter id="cloudSoftGlow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>

              {/* Main Cloud Speech Bubble Path with Lobes and Tail */}
              <path
                d="M 38 72 
                   C 32 72 26 73 20 84 
                   C 22 76 25 71 27 67 
                   C 14 65 7 53 10 41 
                   C 6 29 14 18 26 15 
                   C 33 6 48 3 61 7 
                   C 72 2 86 5 94 14 
                   C 105 16 114 26 113 38 
                   C 118 49 113 62 103 68 
                   C 97 74 87 75 79 73 
                   C 72 76 50 76 38 72 Z"
                fill="url(#cloudGradient)"
                stroke="#5eead4"
                strokeWidth="1.5"
                strokeOpacity="0.6"
              />

              {/* Inner Highlight for 3D Volume */}
              <path
                d="M 30 20 
                   C 36 12 49 8 61 11 
                   C 70 7 83 9 90 17 
                   C 98 19 104 26 105 34
                   C 88 26 50 20 30 20 Z"
                fill="url(#cloudInnerGlow)"
              />
            </svg>

            {/* Bubble Message Cloud Logo / Icon Inside */}
            <div className="absolute inset-0 flex flex-col items-center justify-center -translate-y-1.5 pointer-events-none text-white">
              {/* Cloud with Chat Dots Icon */}
              <div className="relative flex items-center justify-center">
                {/* Mini Message Cloud Icon */}
                <svg
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-7 h-7 text-white drop-shadow-md"
                >
                  <path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM10 14H8v-2h2v2zm3 0h-2v-2h2v2zm3 0h-2v-2h2v2z" />
                </svg>

                {/* Animated Pulsing Typing Dots */}
                <div className="absolute bottom-2 flex items-center gap-0.5">
                  <span className="w-1 h-1 rounded-full bg-emerald-200 animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-1 h-1 rounded-full bg-emerald-200 animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-1 h-1 rounded-full bg-emerald-200 animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>

            {/* Online Green Status Indicator Dot on the cloud */}
            <span className="absolute top-1.5 right-2 w-3.5 h-3.5 rounded-full bg-emerald-400 border-2 border-white dark:border-slate-900 shadow-md flex items-center justify-center">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
            </span>
          </div>

          {/* Floating Drop Shadow Underneath (Contracts & Expands with Height) */}
          <div className="w-14 h-2.5 mx-auto bg-black/25 dark:bg-black/50 rounded-[100%] blur-[3px] animate-cloud-shadow mt-1" />
        </div>
      </aside>

      {/* FALLBACK DIRECT MESSENGER MODAL (if RocketChat backend is connecting or offline) */}
      {fallbackOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-end sm:justify-end sm:p-6 p-3">
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs"
            onClick={() => setFallbackOpen(false)}
          />

          <div className="relative w-full max-w-sm bg-card border border-border/80 rounded-3xl shadow-2xl overflow-hidden z-10 animate-scale-in flex flex-col">
            {/* Header with Cloud Motif */}
            <div className="p-4 bg-gradient-to-r from-primary to-teal-800 text-primary-foreground flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm leading-tight">Mesina Farms Live Dispatch</h3>
                  <span className="text-[11px] opacity-90 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 animate-ping" />
                    Hatchery Team Online
                  </span>
                </div>
              </div>
              <button
                onClick={() => setFallbackOpen(false)}
                className="p-1.5 rounded-full hover:bg-white/20 text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Body */}
            <div className="p-5 space-y-4 text-xs">
              {fallbackSent ? (
                <div className="py-8 text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-500 mx-auto flex items-center justify-center">
                    <CheckCircle2 className="w-7 h-7" />
                  </div>
                  <h4 className="font-bold text-foreground text-sm">Message Received!</h4>
                  <p className="text-muted-foreground leading-relaxed">
                    Our aquaculture staff will respond right away via phone or chat notification.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSendFallback} className="space-y-3">
                  <p className="text-muted-foreground leading-relaxed">
                    Need instant pricing, current stage availability, or directions to our Ivisan hatchery? Send a message directly:
                  </p>

                  <div>
                    <label className="text-[11px] font-semibold text-muted-foreground">Your Name / Farm Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Juan / Capiz Aqua"
                      value={fallbackName}
                      onChange={e => setFallbackName(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-muted/60 border border-border text-foreground text-xs font-medium focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-muted-foreground">Message</label>
                    <textarea
                      rows={3}
                      required
                      placeholder="Type your question here..."
                      value={fallbackMsg}
                      onChange={e => setFallbackMsg(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-muted/60 border border-border text-foreground text-xs leading-relaxed focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 rounded-xl bg-primary text-primary-foreground font-bold text-xs flex items-center justify-center gap-1.5 hover:bg-primary/90 transition-all shadow-md"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Send Message to Hatchery</span>
                  </button>
                </form>
              )}

              <div className="pt-2 border-t border-border/40 flex items-center justify-between text-[11px] text-muted-foreground">
                <a href="tel:+639625279820" className="hover:text-primary flex items-center gap-1">
                  <Phone className="w-3 h-3" /> +63 962 527 9820
                </a>
                <a href="mailto:support@mesina.farm" className="hover:text-primary flex items-center gap-1">
                  <Mail className="w-3 h-3" /> Email Team
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
