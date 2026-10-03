import React, { useState, useEffect } from 'react';
import { MessageCircle, X } from 'lucide-react';

declare global {
  interface Window {
    RocketChat?: any;
  }
}

export const LiveChatWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    // Check initial state
    const checkState = () => {
      const widget = document.querySelector('.rocketchat-widget') as HTMLElement;
      if (widget) {
        const state = widget.getAttribute('data-state');
        setIsOpen(state === 'opened' || state === 'triggered');
      }
    };

    // Observe changes to rocketchat-widget data-state
    const observer = new MutationObserver(() => {
      checkState();
    });

    observer.observe(document.body, {
      attributes: true,
      subtree: true,
      attributeFilter: ['data-state', 'class', 'style']
    });

    // Hook into RocketChat callbacks if available
    if (window.RocketChat) {
      window.RocketChat(function (this: any) {
        if (typeof this.onChatMaximized === 'function') {
          this.onChatMaximized(() => setIsOpen(true));
        }
        if (typeof this.onChatMinimized === 'function') {
          this.onChatMinimized(() => setIsOpen(false));
        }
      });
    }

    const timer = setInterval(checkState, 800);

    return () => {
      observer.disconnect();
      clearInterval(timer);
    };
  }, []);

  const handleToggle = () => {
    if (window.RocketChat) {
      window.RocketChat(function (this: any) {
        if (isOpen) {
          if (typeof this.minimizeWidget === 'function') {
            this.minimizeWidget();
          }
        } else {
          if (typeof this.maximizeWidget === 'function') {
            this.maximizeWidget();
          }
        }
      });
    } else {
      // Fallback: click directly on rocketchat-widget or iframe
      const widget = document.querySelector('.rocketchat-widget') as HTMLElement;
      if (widget) {
        widget.click();
      }
    }
  };

  // If the chat window is currently opened, hide our launcher so it doesn't overlap
  if (isOpen) {
    return null;
  }

  return (
    <div className="fixed bottom-6 right-6 z-[12340] flex items-center gap-3 select-none">
      {/* Tooltip on hover */}
      {isHovered && (
        <div className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 rounded-full glass border border-primary/30 text-xs font-semibold text-foreground shadow-lg animate-scale-in">
          <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
          <span>Chat with Mesina Farms</span>
        </div>
      )}

      {/* Circle Launcher Button */}
      <button
        type="button"
        onClick={handleToggle}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        aria-label="Open Live Chat"
        title="Live Support Chat"
        className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-tr from-primary via-primary/95 to-accent text-primary-foreground shadow-2xl flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 group focus:outline-none focus:ring-4 focus:ring-primary/40"
        style={{
          boxShadow: '0 12px 32px -4px rgba(14, 165, 233, 0.45), 0 4px 16px rgba(0, 0, 0, 0.2)'
        }}
      >
        {/* Subtle breathing ripple ring */}
        <span className="absolute inset-0 rounded-full bg-primary/30 animate-ping opacity-60 pointer-events-none" />

        {/* Online Status Pill / Dot */}
        <span className="absolute top-0 right-0 w-4 h-4 rounded-full bg-emerald-400 border-2 border-background shadow-sm" />

        {/* Circular Chat Icon */}
        <MessageCircle className="w-7 h-7 group-hover:rotate-6 transition-transform drop-shadow" />
      </button>
    </div>
  );
};
