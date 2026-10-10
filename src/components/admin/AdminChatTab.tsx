import React, { useState, useEffect } from 'react';
import {
  MessageSquare,
  MessageCircle,
  MessagesSquare,
  Headset,
  Fish,
  LifeBuoy,
  Send,
  HelpCircle,
  Sparkles,
  CheckCircle2,
  XCircle,
  Clock,
  ExternalLink,
  ShieldCheck,
  RefreshCw,
  Power,
  Upload,
  Image as ImageIcon,
  Shapes,
  Palette
} from 'lucide-react';
import { SiteSettings, ChatWidgetIconType, ChatWidgetShapeType } from '../../types';
import { getShapeClass, getDefaultShapeForIcon } from '../LivechatStatusTag';

interface AdminChatTabProps {
  settings: SiteSettings;
  onUpdateSettings: (settings: SiteSettings) => void;
}

interface IconOption {
  id: ChatWidgetIconType;
  label: string;
  defaultShape: ChatWidgetShapeType;
  defaultShapeLabel: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
}

const AVAILABLE_ICONS: IconOption[] = [
  {
    id: 'message-circle',
    label: 'Circle Chat',
    defaultShape: 'circle',
    defaultShapeLabel: 'Circle',
    description: 'Clean classic round chat bubble',
    icon: MessageCircle
  },
  {
    id: 'message-square',
    label: 'Square Chat',
    defaultShape: 'squircle',
    defaultShapeLabel: 'Squircle',
    description: 'Modern rounded squircle dialog',
    icon: MessageSquare
  },
  {
    id: 'messages-square',
    label: 'Multi-Chat',
    defaultShape: 'chat-bubble',
    defaultShapeLabel: 'Speech Bubble',
    description: 'Conversation bubbles with corner tail',
    icon: MessagesSquare
  },
  {
    id: 'headset',
    label: 'Support Agent',
    defaultShape: 'circle',
    defaultShapeLabel: 'Circle',
    description: 'Customer service & farmer hotline',
    icon: Headset
  },
  {
    id: 'fish',
    label: 'Catfish Hatchery',
    defaultShape: 'teardrop',
    defaultShapeLabel: 'Teardrop',
    description: 'Native Clarias batrachus farm icon',
    icon: Fish
  },
  {
    id: 'life-buoy',
    label: 'Lifesaver Buoy',
    defaultShape: 'circle',
    defaultShapeLabel: 'Circle',
    description: 'Emergency assistance & farm help',
    icon: LifeBuoy
  },
  {
    id: 'send',
    label: 'Direct Send',
    defaultShape: 'teardrop',
    defaultShapeLabel: 'Teardrop',
    description: 'Speedy order dispatch & quote inquiry',
    icon: Send
  },
  {
    id: 'help-circle',
    label: 'Help & FAQ',
    defaultShape: 'circle',
    defaultShapeLabel: 'Circle',
    description: 'Assistance, ordering guidance & specs',
    icon: HelpCircle
  },
  {
    id: 'sparkles',
    label: 'Aqua Concierge',
    defaultShape: 'squircle',
    defaultShapeLabel: 'Squircle',
    description: 'Bio-precision digital concierge',
    icon: Sparkles
  },
  {
    id: 'custom',
    label: 'Custom Image',
    defaultShape: 'squircle',
    defaultShapeLabel: 'Squircle',
    description: 'Upload farm logo or custom brand badge',
    icon: ImageIcon
  }
];

const AVAILABLE_SHAPES: { id: ChatWidgetShapeType; label: string; desc: string; previewClass: string }[] = [
  {
    id: 'circle',
    label: 'Circle',
    desc: 'Perfect 1:1 circle (rounded-full)',
    previewClass: 'rounded-full'
  },
  {
    id: 'squircle',
    label: 'Squircle',
    desc: 'iOS-style smooth superellipse (rounded-2xl)',
    previewClass: 'rounded-2xl'
  },
  {
    id: 'rounded',
    label: 'Rounded Square',
    desc: 'Crisp contemporary square (rounded-xl)',
    previewClass: 'rounded-xl'
  },
  {
    id: 'chat-bubble',
    label: 'Speech Bubble',
    desc: 'Conversation bubble with tail (rounded-3xl rounded-br-sm)',
    previewClass: 'rounded-2xl rounded-br-xs'
  },
  {
    id: 'teardrop',
    label: 'Teardrop',
    desc: 'Organic aqua teardrop badge (rounded-full rounded-br-none)',
    previewClass: 'rounded-full rounded-br-none'
  }
];

export const AdminChatTab: React.FC<AdminChatTabProps> = ({
  settings,
  onUpdateSettings
}) => {
  const [enabled, setEnabled] = useState<boolean>(settings.chat_widget_enabled !== false);
  const [selectedIcon, setSelectedIcon] = useState<ChatWidgetIconType>(settings.chat_widget_icon || 'message-circle');
  const [selectedShape, setSelectedShape] = useState<ChatWidgetShapeType>(
    settings.chat_widget_shape || getDefaultShapeForIcon(settings.chat_widget_icon || 'message-circle')
  );
  const [customIconUrl, setCustomIconUrl] = useState<string>(settings.chat_widget_custom_icon_url || '');

  const [toast, setToast] = useState<string>('');
  const [testingEndpoint, setTestingEndpoint] = useState<boolean>(false);
  const [endpointStatus, setEndpointStatus] = useState<'idle' | 'online' | 'offline' | 'checking'>('idle');
  const [phtTime, setPhtTime] = useState<string>('');
  const [isWithinPhtHours, setIsWithinPhtHours] = useState<boolean>(false);
  const [previewSimulatedOnline, setPreviewSimulatedOnline] = useState<boolean>(true);

  // Calculate current Philippine Standard Time (UTC+8)
  useEffect(() => {
    const updateTime = () => {
      try {
        const now = new Date();
        const utc = now.getTime() + now.getTimezoneOffset() * 60000;
        const pht = new Date(utc + 3600000 * 8);
        setPhtTime(
          pht.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: true
          })
        );
        const day = pht.getDay();
        const hour = pht.getHours();
        setIsWithinPhtHours(day >= 1 && day <= 6 && hour >= 7 && hour < 17);
      } catch (e) {
        // fallback
      }
    };

    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3500);
  };

  // When user selects an icon: Automatically change the widget shape to match the selected icon shape!
  const handleSelectIcon = (iconId: ChatWidgetIconType) => {
    setSelectedIcon(iconId);
    const matchingShape = getDefaultShapeForIcon(iconId);
    setSelectedShape(matchingShape);

    const updated = {
      ...settings,
      chat_widget_enabled: enabled,
      chat_widget_icon: iconId,
      chat_widget_shape: matchingShape,
      chat_widget_custom_icon_url: customIconUrl
    };
    onUpdateSettings(updated);
    showToast(`Widget icon set to ${iconId.replace('-', ' ')} with matching ${matchingShape} shape!`);
  };

  // Allow explicit shape change if desired
  const handleSelectShape = (shapeId: ChatWidgetShapeType) => {
    setSelectedShape(shapeId);
    const updated = {
      ...settings,
      chat_widget_enabled: enabled,
      chat_widget_icon: selectedIcon,
      chat_widget_shape: shapeId,
      chat_widget_custom_icon_url: customIconUrl
    };
    onUpdateSettings(updated);
    showToast(`Widget shape updated to ${shapeId}!`);
  };

  const handleToggle = (checked: boolean) => {
    setEnabled(checked);
    const updated = {
      ...settings,
      chat_widget_enabled: checked,
      chat_widget_icon: selectedIcon,
      chat_widget_shape: selectedShape,
      chat_widget_custom_icon_url: customIconUrl
    };
    onUpdateSettings(updated);
    showToast(
      checked
        ? 'Live Chat Support Widget is now ENABLED site-wide!'
        : 'Live Chat Support Widget is now DISABLED and hidden site-wide!'
    );
  };

  const handleCustomFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      if (ev.target?.result) {
        const dataUrl = ev.target.result as string;
        setCustomIconUrl(dataUrl);
        setSelectedIcon('custom');
        const updated = {
          ...settings,
          chat_widget_icon: 'custom' as ChatWidgetIconType,
          chat_widget_custom_icon_url: dataUrl
        };
        onUpdateSettings(updated);
        showToast('Custom chat widget icon uploaded successfully!');
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = {
      ...settings,
      chat_widget_enabled: enabled,
      chat_widget_icon: selectedIcon,
      chat_widget_shape: selectedShape,
      chat_widget_custom_icon_url: customIconUrl
    };
    onUpdateSettings(updated);
    showToast('Live Chat Support configuration and widget shape saved!');
  };

  const checkLivechatServer = async () => {
    setTestingEndpoint(true);
    setEndpointStatus('checking');
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 4000);
      const res = await fetch('https://messenger.mesina.farm/api/v1/livechat/config', {
        signal: controller.signal
      });
      clearTimeout(timeoutId);
      if (res.ok) {
        const data = await res.json();
        setEndpointStatus(data?.config?.online ? 'online' : 'offline');
      } else {
        setEndpointStatus('offline');
      }
    } catch (e) {
      setEndpointStatus('offline');
    } finally {
      setTestingEndpoint(false);
    }
  };

  // Render preview icon
  const renderPreviewIcon = () => {
    if (selectedIcon === 'custom' && customIconUrl) {
      return (
        <img
          src={customIconUrl}
          alt="Custom chat widget icon"
          className="w-7 h-7 object-contain rounded-md"
        />
      );
    }

    const found = AVAILABLE_ICONS.find(i => i.id === selectedIcon);
    if (found) {
      const Comp = found.icon;
      return <Comp className="w-7 h-7 text-primary-foreground transition-transform duration-300 group-hover:scale-110" />;
    }
    return <MessageCircle className="w-7 h-7 text-primary-foreground" />;
  };

  return (
    <form onSubmit={handleSave} className="space-y-8 animate-scale-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-foreground flex items-center gap-2">
            <MessageCircle className="w-5 h-5 text-primary" /> Live Chat Support Widget & Icon Designer
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Customize the chat widget visibility, choose your preferred icon, and the widget shape automatically adapts to match.
          </p>
        </div>

        <button
          type="submit"
          className="py-2.5 px-6 rounded-xl bg-primary text-primary-foreground font-bold text-xs hover:bg-primary/90 shadow-md transition-all self-start sm:self-auto"
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

      {/* 1. Main Enable / Disable Hero Card */}
      <div
        className={`glass-card rounded-3xl p-6 sm:p-8 border transition-all duration-300 shadow-xl ${
          enabled
            ? 'border-emerald-500/40 bg-gradient-to-br from-emerald-500/5 via-card/80 to-primary/5'
            : 'border-border/80 bg-muted/20'
        }`}
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div
              className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-lg transition-all ${
                enabled
                  ? 'bg-emerald-500 text-white shadow-emerald-500/25 ring-4 ring-emerald-500/20'
                  : 'bg-muted text-muted-foreground'
              }`}
            >
              <Power className="w-7 h-7" />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center gap-2.5 flex-wrap">
                <h3 className="font-extrabold text-lg text-foreground">
                  Chat Support Widget Visibility
                </h3>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider transition-all ${
                    enabled
                      ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/40'
                      : 'bg-muted text-muted-foreground border border-border'
                  }`}
                >
                  {enabled ? '● Online / Enabled' : '○ Offline / Disabled'}
                </span>
              </div>
              <p className="text-xs text-muted-foreground max-w-xl leading-relaxed">
                When <b>enabled</b>, visitors see your custom-shaped floating messenger button with the real-time blinking "Online" tag during business hours. When <b>disabled</b>, both the widget button and status tag are completely removed from all public pages.
              </p>
            </div>
          </div>

          {/* Toggle Switch */}
          <div className="flex flex-col sm:items-end gap-2 shrink-0">
            <label className="relative inline-flex items-center cursor-pointer select-none">
              <input
                type="checkbox"
                checked={enabled}
                onChange={e => handleToggle(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-16 h-8 bg-muted border border-border peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-emerald-500 shadow-inner"></div>
            </label>
            <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
              {enabled ? 'Click to Disable' : 'Click to Enable'}
            </span>
          </div>
        </div>
      </div>

      {/* 2. Interactive Icon Selector & Live Shape Adapter */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 border border-border/70 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="font-extrabold text-base text-foreground flex items-center gap-2">
              <Palette className="w-5 h-5 text-primary" /> Choose Widget Icon (Auto-Adapts Shape)
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Select an icon below. The widget container shape will dynamically adapt to naturally complement the icon's geometry.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground bg-muted/60 px-3 py-1.5 rounded-xl border border-border/60">
            <span>Current Shape:</span>
            <span className="text-primary font-bold uppercase">{selectedShape}</span>
          </div>
        </div>

        {/* Icon Options Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
          {AVAILABLE_ICONS.map(item => {
            const IconComponent = item.icon;
            const isSelected = selectedIcon === item.id;
            return (
              <div
                key={item.id}
                onClick={() => handleSelectIcon(item.id)}
                className={`p-4 rounded-2xl border cursor-pointer transition-all duration-300 flex flex-col items-center text-center gap-2.5 relative group ${
                  isSelected
                    ? 'bg-primary/10 border-primary ring-2 ring-primary/30 shadow-md'
                    : 'bg-card/60 hover:bg-muted/50 border-border/70 hover:border-primary/40'
                }`}
              >
                {/* Visual Icon Badge showing the auto-matched shape! */}
                <div
                  className={`w-12 h-12 flex items-center justify-center transition-all duration-300 shadow-md ${
                    getShapeClass(item.defaultShape)
                  } ${
                    isSelected
                      ? 'bg-primary text-primary-foreground scale-110 shadow-primary/25 ring-2 ring-white/20'
                      : 'bg-muted text-foreground group-hover:text-primary group-hover:bg-primary/10'
                  }`}
                >
                  <IconComponent className="w-6 h-6" />
                </div>

                <div>
                  <div className="text-xs font-bold text-foreground flex items-center justify-center gap-1">
                    <span>{item.label}</span>
                    {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-primary" />}
                  </div>
                  <span className="text-[10px] text-muted-foreground font-medium block mt-0.5">
                    Shape: <b className="text-primary">{item.defaultShapeLabel}</b>
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Custom Upload Drawer if Custom is selected */}
        {selectedIcon === 'custom' && (
          <div className="p-4 rounded-2xl bg-muted/40 border border-border/70 space-y-3 animate-scale-in">
            <h4 className="text-xs font-bold text-foreground flex items-center gap-2">
              <Upload className="w-4 h-4 text-primary" /> Custom Brand Icon or Farm Logo
            </h4>
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <label className="cursor-pointer py-2 px-4 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 text-xs font-bold flex items-center gap-2 transition-colors">
                <Upload className="w-3.5 h-3.5" />
                <span>Choose Image File</span>
                <input type="file" accept="image/*" className="hidden" onChange={handleCustomFileUpload} />
              </label>

              <input
                type="url"
                placeholder="Or paste image URL (https://...)"
                value={customIconUrl}
                onChange={e => {
                  setCustomIconUrl(e.target.value);
                  const updated = { ...settings, chat_widget_custom_icon_url: e.target.value };
                  onUpdateSettings(updated);
                }}
                className="flex-1 w-full px-3 py-2 rounded-xl bg-card border border-border text-foreground text-xs"
              />
            </div>
            {customIconUrl && (
              <div className="flex items-center gap-3 pt-1">
                <div className="w-10 h-10 rounded-xl bg-primary/10 p-1 border border-primary/20 flex items-center justify-center">
                  <img src={customIconUrl} alt="custom preview" className="w-full h-full object-contain" />
                </div>
                <span className="text-xs text-muted-foreground">Custom icon ready for display.</span>
              </div>
            )}
          </div>
        )}

        {/* Shape Fine-Tuning Override */}
        <div className="pt-4 border-t border-border/50 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-xs font-bold text-foreground flex items-center gap-1.5">
                <Shapes className="w-4 h-4 text-primary" /> Fine-Tune Widget Shape (Optional Override)
              </h4>
              <p className="text-[11px] text-muted-foreground">
                The shape automatically defaults to match the selected icon, but you can override it with any container shape below:
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {AVAILABLE_SHAPES.map(s => {
              const isShapeSelected = selectedShape === s.id;
              return (
                <button
                  type="button"
                  key={s.id}
                  onClick={() => handleSelectShape(s.id)}
                  className={`p-3 rounded-2xl border text-left transition-all duration-200 flex items-center gap-3 ${
                    isShapeSelected
                      ? 'bg-primary text-primary-foreground border-primary shadow-md'
                      : 'bg-muted/40 hover:bg-muted text-foreground border-border/70'
                  }`}
                >
                  <div
                    className={`w-7 h-7 shrink-0 border-2 transition-transform ${
                      isShapeSelected ? 'border-white bg-white/20' : 'border-primary bg-primary/20'
                    } ${s.previewClass}`}
                  />
                  <div>
                    <div className="text-xs font-bold">{s.label}</div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 3. Live Preview & Server Diagnostics */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Live Preview Box */}
        <div className="glass-card rounded-3xl p-6 border border-border/70 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-sm text-foreground flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-primary" /> Interactive Live Preview
            </h3>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setPreviewSimulatedOnline(!previewSimulatedOnline)}
                className="py-1 px-2.5 rounded-lg glass text-[10px] font-bold text-foreground hover:bg-muted"
                title="Toggle test status between Online & Offline"
              >
                Simulate: {previewSimulatedOnline ? 'Online' : 'Offline'}
              </button>
            </div>
          </div>

          <div className="relative h-56 rounded-2xl bg-gradient-to-b from-muted/30 to-muted/60 border border-border/60 overflow-hidden flex items-end justify-end p-6 select-none">
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#14b8a6_1px,transparent_1px)] [background-size:16px_16px]"></div>

            {enabled ? (
              <div className="relative flex flex-col items-end gap-2 animate-scale-in">
                {/* Blinking Status Tag */}
                <div
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold tracking-wide transition-all border ${
                    previewSimulatedOnline
                      ? 'animate-blink-green bg-emerald-500/15 dark:bg-emerald-950/90 text-emerald-600 dark:text-emerald-300 border-emerald-500 ring-1 ring-emerald-500/40 shadow-lg'
                      : 'bg-card/95 text-muted-foreground border-border/80 shadow-md'
                  }`}
                >
                  <span className="relative flex h-2 w-2">
                    {previewSimulatedOnline ? (
                      <>
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-90"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                      </>
                    ) : (
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-slate-400"></span>
                    )}
                  </span>
                  <span className="font-extrabold uppercase text-[10px] tracking-wider">
                    {previewSimulatedOnline ? 'Online' : 'Offline'}
                  </span>
                  <MessageCircle className="w-3 h-3 ml-0.5 text-emerald-600 dark:text-emerald-400" />
                </div>

                {/* Downward indicator triangle */}
                <div className="flex justify-center -mt-2 pr-6">
                  <div
                    className={`w-2 h-2 rotate-45 border-r border-b ${
                      previewSimulatedOnline
                        ? 'animate-blink-green bg-emerald-50 dark:bg-emerald-950/90 border-emerald-500'
                        : 'bg-card/95 border-border/80'
                    }`}
                  />
                </div>

                {/* The Custom Shaped Floating Action Button */}
                <div
                  className={`w-14 h-14 bg-primary text-primary-foreground shadow-2xl flex items-center justify-center cursor-pointer hover:scale-110 active:scale-95 transition-all duration-300 border-2 border-white/25 ring-4 ring-primary/20 ${getShapeClass(
                    selectedShape
                  )}`}
                >
                  {renderPreviewIcon()}
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center w-full h-full text-center text-muted-foreground space-y-1">
                <XCircle className="w-8 h-8 text-muted-foreground/60" />
                <div className="text-xs font-bold text-foreground">Widget is Disabled</div>
                <div className="text-[11px]">No floating button or tag will appear to visitors.</div>
              </div>
            )}
          </div>

          <div className="text-xs text-muted-foreground flex items-center justify-between">
            <span>Icon: <b className="text-foreground capitalize">{selectedIcon.replace('-', ' ')}</b></span>
            <span>Shape: <b className="text-foreground capitalize">{selectedShape}</b></span>
          </div>
        </div>

        {/* Integration Details & Server Health */}
        <div className="glass-card rounded-3xl p-6 border border-border/70 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-sm text-foreground flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-primary" /> Messenger Server Health
            </h3>
            <button
              type="button"
              onClick={checkLivechatServer}
              disabled={testingEndpoint}
              className="py-1 px-2.5 rounded-lg glass text-[11px] font-semibold text-foreground hover:bg-muted flex items-center gap-1.5 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-3 h-3 ${testingEndpoint ? 'animate-spin' : ''}`} />
              <span>Ping Server</span>
            </button>
          </div>

          <div className="space-y-2.5 text-xs">
            <div className="p-3 rounded-xl bg-muted/40 border border-border/50 flex items-center justify-between">
              <div>
                <div className="text-muted-foreground font-semibold">Self-Hosted Server URL</div>
                <div className="font-mono text-foreground text-[11px] mt-0.5">
                  https://messenger.mesina.farm
                </div>
              </div>
              <a
                href="https://messenger.mesina.farm"
                target="_blank"
                rel="noreferrer"
                className="p-1.5 rounded-lg glass text-primary hover:bg-muted"
                title="Open Rocket.Chat workspace"
              >
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            <div className="p-3 rounded-xl bg-muted/40 border border-border/50 flex items-center justify-between">
              <div>
                <div className="text-muted-foreground font-semibold">Operating Schedule</div>
                <div className="font-semibold text-foreground text-[11px] mt-0.5 flex items-center gap-1">
                  <Clock className="w-3 h-3 text-primary" />
                  <span>Mon – Sat: 7:00 AM – 5:00 PM PHT</span>
                </div>
              </div>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  isWithinPhtHours
                    ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400'
                    : 'bg-amber-500/20 text-amber-600 dark:text-amber-400'
                }`}
              >
                {isWithinPhtHours ? 'Within Hours' : 'After Hours'}
              </span>
            </div>

            {endpointStatus !== 'idle' && (
              <div
                className={`p-3 rounded-xl border text-[11px] flex items-center justify-between ${
                  endpointStatus === 'online'
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400'
                    : endpointStatus === 'checking'
                    ? 'bg-muted border-border text-foreground'
                    : 'bg-amber-500/10 border-amber-500/30 text-amber-600 dark:text-amber-400'
                }`}
              >
                <span>Server Endpoint Status:</span>
                <span className="font-bold uppercase tracking-wider">
                  {endpointStatus === 'checking' ? 'Testing Connection...' : endpointStatus}
                </span>
              </div>
            )}
          </div>

          <div className="pt-2 border-t border-border/40 flex justify-between items-center text-xs">
            <span className="text-muted-foreground">Admin Quick Action:</span>
            <button
              type="button"
              onClick={() => handleToggle(!enabled)}
              className={`py-1.5 px-3 rounded-xl text-xs font-bold transition-all shadow-sm ${
                enabled
                  ? 'bg-destructive/10 text-destructive hover:bg-destructive/20 border border-destructive/30'
                  : 'bg-emerald-500 text-white hover:bg-emerald-600'
              }`}
            >
              {enabled ? 'Disable Widget Now' : 'Enable Widget Now'}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};
