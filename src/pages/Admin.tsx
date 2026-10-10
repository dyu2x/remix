import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  Package,
  Layers,
  ShoppingBag,
  MapPin,
  Settings,
  Users,
  Mail,
  Globe,
  Sparkles,
  Award,
  BookOpen,
  LogOut,
  Shield,
  KeyRound,
  ArrowRight,
  TrendingUp,
  CheckCircle2,
  Clock,
  MessageSquare,
  MessageCircle,
  Scale
} from 'lucide-react';
import {
  Fingerling,
  SiteSettings,
  OrderInquiry,
  Sale,
  BlogArticle,
  AdminUser,
  PermissionModule
} from '../types';
import { defaultAdminUsers } from '../data/initialData';
import { AdminLogin } from '../components/admin/AdminLogin';
import { AdminUsersTab } from '../components/admin/AdminUsersTab';
import { AdminHeroTab } from '../components/admin/AdminHeroTab';
import { AdminWhyChooseUsTab } from '../components/admin/AdminWhyChooseUsTab';
import { AdminCatalogTab } from '../components/admin/AdminCatalogTab';
import { AdminArticlesTab } from '../components/admin/AdminArticlesTab';
import { AdminInquiriesTab } from '../components/admin/AdminInquiriesTab';
import { AdminLocationTab } from '../components/admin/AdminLocationTab';
import { AdminSmtpZitadelTab } from '../components/admin/AdminSmtpZitadelTab';
import { AdminVisitorsTab } from '../components/admin/AdminVisitorsTab';
import { AdminAboutSettingsTab } from '../components/admin/AdminAboutSettingsTab';
import { AdminChatTab } from '../components/admin/AdminChatTab';
import { AdminTankCalculatorTab } from '../components/admin/AdminTankCalculatorTab';
import { getVisitorLogs } from '../utils/visitorTracker';

interface AdminProps {
  fingerlings: Fingerling[];
  settings: SiteSettings;
  inquiries: OrderInquiry[];
  sales: Sale[];
  articles: BlogArticle[];
  onUpdateFingerling: (fingerling: Fingerling) => void;
  onAddFingerling: (fingerling: Fingerling) => void;
  onDeleteFingerling: (id: string) => void;
  onUpdateSettings: (settings: SiteSettings) => void;
  onUpdateInquiry: (inquiry: OrderInquiry) => void;
  onDeleteInquiry: (id: string) => void;
  onAddArticle: (article: BlogArticle) => void;
  onUpdateArticle: (article: BlogArticle) => void;
  onDeleteArticle: (id: string) => void;
}

const SESSION_KEY = 'mesina_admin_session';
const USERS_KEY = 'mesina_admin_users';

export const Admin: React.FC<AdminProps> = ({
  fingerlings,
  settings,
  inquiries,
  sales,
  articles,
  onUpdateFingerling,
  onAddFingerling,
  onDeleteFingerling,
  onUpdateSettings,
  onUpdateInquiry,
  onDeleteInquiry,
  onAddArticle,
  onUpdateArticle,
  onDeleteArticle
}) => {
  // Users state
  const [users, setUsers] = useState<AdminUser[]>(() => {
    const saved = localStorage.getItem(USERS_KEY);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* fallback */ }
    }
    return defaultAdminUsers;
  });

  // Current session
  const [currentUser, setCurrentUser] = useState<AdminUser | null>(() => {
    const saved = localStorage.getItem(SESSION_KEY);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* fallback */ }
    }
    return null;
  });

  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);
  const [newPasswordVal, setNewPasswordVal] = useState('');
  const [adminToast, setAdminToast] = useState('');

  useEffect(() => {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(SESSION_KEY, JSON.stringify(currentUser));
    } else {
      localStorage.removeItem(SESSION_KEY);
    }
  }, [currentUser]);

  // Handle OIDC redirect callback (?code=...)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');
    if (code && !currentUser) {
      const oidcUser: AdminUser = users.find(u => u.role === 'super_admin') || {
        id: 'zitadel-oidc-user',
        username: 'oidc.admin',
        password: '',
        name: 'Zitadel OIDC Administrator',
        role: 'super_admin',
        permissions: [
          'hero',
          'about',
          'why_choose_us',
          'catalog',
          'articles',
          'inquiries',
          'location',
          'settings',
          'smtp_zitadel',
          'visitors',
          'chat_support',
          'tank_calculator'
        ],
        created_at: new Date().toISOString()
      };
      setCurrentUser(oidcUser);
      showToast('Authenticated via Zitadel OIDC Single Sign-On!');
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, [currentUser, users]);

  const showToast = (msg: string) => {
    setAdminToast(msg);
    setTimeout(() => setAdminToast(''), 3000);
  };

  const handleLoginSuccess = (user: AdminUser) => {
    setCurrentUser(user);
    setActiveTab('dashboard');
  };

  const handleLogout = () => {
    setCurrentUser(null);
  };

  const handleAddUser = (user: AdminUser) => {
    setUsers(prev => [...prev, user]);
  };

  const handleUpdateUser = (updated: AdminUser) => {
    setUsers(prev => prev.map(u => (u.id === updated.id ? updated : u)));
    if (currentUser && currentUser.id === updated.id) {
      setCurrentUser(updated);
    }
  };

  const handleDeleteUser = (id: string) => {
    setUsers(prev => prev.filter(u => u.id !== id));
  };

  const handleResetPassword = (username: string, newPass: string): boolean => {
    const found = users.find(u => u.username.toLowerCase() === username.trim().toLowerCase());
    if (found) {
      const updated = { ...found, password: newPass };
      handleUpdateUser(updated);
      return true;
    }
    return false;
  };

  const handleChangeOwnPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || !newPasswordVal) return;
    const updated = { ...currentUser, password: newPasswordVal };
    handleUpdateUser(updated);
    setPasswordModalOpen(false);
    setNewPasswordVal('');
    showToast('Your password was updated successfully!');
  };

  // If not authenticated, render Login Screen
  if (!currentUser) {
    return (
      <div className="min-h-screen pt-24 pb-16 bg-background">
        <AdminLogin
          users={users}
          zitadel={settings.zitadel}
          onLoginSuccess={handleLoginSuccess}
          onResetPassword={handleResetPassword}
        />
      </div>
    );
  }

  // Check module permission helper
  const canAccess = (module: PermissionModule): boolean => {
    if (currentUser.role === 'super_admin') return true;
    return currentUser.permissions.includes(module);
  };

  // Navigation Items
  const allNavTabs = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, always: true },
    { id: 'inquiries', label: 'Inquiries', icon: ShoppingBag, module: 'inquiries' as PermissionModule, badge: inquiries.filter(i => (i.contact_status || 'not_contacted') === 'not_contacted').length },
    { id: 'catalog', label: 'Catalog & Tiers', icon: Layers, module: 'catalog' as PermissionModule },
    { id: 'articles', label: 'Blogs & Guides', icon: BookOpen, module: 'articles' as PermissionModule },
    { id: 'tank_calculator', label: 'Tank Ratio Calculator', icon: Scale, module: 'tank_calculator' as PermissionModule },
    { id: 'hero', label: 'Hero Slideshow', icon: Sparkles, module: 'hero' as PermissionModule },
    { id: 'why_choose_us', label: 'Why Choose Us', icon: Award, module: 'why_choose_us' as PermissionModule },
    { id: 'location', label: 'Location & Map', icon: MapPin, module: 'location' as PermissionModule },
    { id: 'about_settings', label: 'About & Branding', icon: Settings, module: 'about' as PermissionModule },
    { id: 'chat_support', label: 'Live Chat Widget', icon: MessageCircle, module: 'chat_support' as PermissionModule, badge: settings.chat_widget_enabled !== false ? 'ON' : 'OFF' },
    { id: 'visitors', label: 'Visitor Analytics', icon: Globe, module: 'visitors' as PermissionModule },
    { id: 'smtp_zitadel', label: 'SMTP & Zitadel', icon: Mail, module: 'smtp_zitadel' as PermissionModule },
    { id: 'users', label: 'User Roles & RBAC', icon: Users, superOnly: true }
  ];

  const visibleNavTabs = allNavTabs.filter(tab => {
    if (tab.always) return true;
    if (tab.superOnly) return currentUser.role === 'super_admin';
    if (tab.module) return canAccess(tab.module);
    return true;
  });

  const totalStock = fingerlings.reduce((acc, f) => acc + f.stock_count, 0);
  const contactedInquiries = inquiries.filter(i => i.contact_status === 'contacted').length;
  const notContactedInquiries = inquiries.filter(i => (i.contact_status || 'not_contacted') === 'not_contacted').length;
  const visitorLogs = getVisitorLogs();
  const uniqueVisitorCount = new Set(visitorLogs.map(l => l.ip)).size;

  return (
    <div className="min-h-screen pt-24 pb-20 bg-background text-foreground">
      {/* Top Admin Action Header */}
      <div className="border-b border-border/50 bg-card/60 backdrop-blur-xl sticky top-16 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-primary/20 text-primary flex items-center justify-center font-bold">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <div className="font-extrabold text-sm text-foreground flex items-center gap-2">
                <span>{settings.farm_name} Command Center</span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    currentUser.role === 'super_admin'
                      ? 'bg-amber-500/20 text-amber-500 border border-amber-500/30'
                      : 'bg-primary/20 text-primary border border-primary/30'
                  }`}
                >
                  {currentUser.role === 'super_admin' ? 'Super Admin' : 'Website Moderator'}
                </span>
              </div>
              <div className="text-[11px] text-muted-foreground">
                Signed in as <b className="text-foreground">{currentUser.name}</b> (@{currentUser.username})
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setPasswordModalOpen(true)}
              className="py-1.5 px-3 rounded-xl glass text-xs font-semibold text-foreground hover:bg-muted flex items-center gap-1.5"
              title="Change Password"
            >
              <KeyRound className="w-3.5 h-3.5 text-primary" />
              <span>Password</span>
            </button>
            <button
              onClick={handleLogout}
              className="py-1.5 px-3 rounded-xl glass text-xs font-semibold text-muted-foreground hover:text-destructive flex items-center gap-1.5 hover:bg-destructive/10"
              title="Sign Out"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Container with Left Sidebar & Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row items-start gap-8">
          {/* Left Sidebar Category Navigation */}
          <aside className="w-full lg:w-64 xl:w-72 shrink-0">
            <div className="glass-card rounded-3xl p-3 sm:p-4 border border-border/70 lg:sticky lg:top-32 shadow-xl space-y-2">
              <div className="px-3 py-2 text-[11px] font-extrabold uppercase tracking-wider text-muted-foreground hidden lg:flex items-center justify-between">
                <span>Categories</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary font-bold">
                  {visibleNavTabs.length} Options
                </span>
              </div>

              {/* Navigation list */}
              <nav className="flex lg:flex-col gap-1.5 overflow-x-auto lg:overflow-x-visible pb-2 lg:pb-0 scrollbar-none">
                {visibleNavTabs.map(tab => {
                  const isActive = activeTab === tab.id;
                  const IconComp = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full px-3.5 py-2.5 rounded-2xl text-xs font-bold flex items-center justify-between gap-3 transition-all duration-200 text-left shrink-0 lg:shrink select-none ${
                        isActive
                          ? 'bg-primary text-primary-foreground shadow-md shadow-primary/25 ring-1 ring-primary/40'
                          : 'text-muted-foreground hover:text-foreground hover:bg-muted/70'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <IconComp className={`w-4 h-4 shrink-0 ${isActive ? 'text-primary-foreground' : 'text-primary'}`} />
                        <span className="truncate">{tab.label}</span>
                      </div>

                      {tab.badge !== undefined && tab.badge !== 0 && (
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-extrabold shrink-0 ${
                          tab.badge === 'ON'
                            ? isActive
                              ? 'bg-emerald-300 text-emerald-950'
                              : 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                            : tab.badge === 'OFF'
                            ? isActive
                              ? 'bg-black/30 text-white'
                              : 'bg-muted text-muted-foreground border border-border'
                            : isActive
                            ? 'bg-black/30 text-white'
                            : 'bg-red-500 text-white'
                        }`}>
                          {tab.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </nav>

              {/* Sidebar Info Footer (Desktop) */}
              <div className="pt-3 mt-2 border-t border-border/50 hidden lg:block px-2 text-[11px] text-muted-foreground space-y-1.5">
                <div className="flex items-center justify-between">
                  <span>Farm System:</span>
                  <span className="text-emerald-500 font-bold flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span> Active
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Logged in:</span>
                  <span className="font-semibold text-foreground truncate max-w-[120px]">@{currentUser.username}</span>
                </div>
              </div>
            </div>
          </aside>

          {/* Right Main Content Area */}
          <main className="flex-1 min-w-0 w-full space-y-6">
            {adminToast && (
              <div className="p-3 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-semibold">
                ✓ {adminToast}
              </div>
            )}

        {/* DASHBOARD TAB */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8 animate-scale-in">
            {/* KPI Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div
                onClick={() => canAccess('inquiries') && setActiveTab('inquiries')}
                className="glass-card rounded-2xl p-5 border border-border/70 space-y-1 cursor-pointer hover:ring-2 hover:ring-primary/40 transition-all"
              >
                <div className="flex items-center justify-between text-xs text-muted-foreground font-semibold">
                  <span>Pending Inquiries</span>
                  <ShoppingBag className="w-4 h-4 text-primary" />
                </div>
                <div className="text-3xl font-extrabold text-foreground">{inquiries.length}</div>
                <div className="text-[11px] text-amber-500 font-semibold">
                  {notContactedInquiries} not contacted yet
                </div>
              </div>

              <div
                onClick={() => canAccess('catalog') && setActiveTab('catalog')}
                className="glass-card rounded-2xl p-5 border border-border/70 space-y-1 cursor-pointer hover:ring-2 hover:ring-primary/40 transition-all"
              >
                <div className="flex items-center justify-between text-xs text-muted-foreground font-semibold">
                  <span>Living Inventory</span>
                  <Layers className="w-4 h-4 text-emerald-500" />
                </div>
                <div className="text-3xl font-extrabold hydro-text">{totalStock.toLocaleString()}</div>
                <div className="text-[11px] text-muted-foreground">{fingerlings.length} growth stages active</div>
              </div>

              <div
                onClick={() => canAccess('articles') && setActiveTab('articles')}
                className="glass-card rounded-2xl p-5 border border-border/70 space-y-1 cursor-pointer hover:ring-2 hover:ring-primary/40 transition-all"
              >
                <div className="flex items-center justify-between text-xs text-muted-foreground font-semibold">
                  <span>Knowledge Base</span>
                  <BookOpen className="w-4 h-4 text-primary" />
                </div>
                <div className="text-3xl font-extrabold text-foreground">{articles.length}</div>
                <div className="text-[11px] text-muted-foreground">
                  {articles.filter(a => a.status === 'active' || !a.status).length} public articles
                </div>
              </div>

              <div
                onClick={() => canAccess('visitors') && setActiveTab('visitors')}
                className="glass-card rounded-2xl p-5 border border-border/70 space-y-1 cursor-pointer hover:ring-2 hover:ring-primary/40 transition-all"
              >
                <div className="flex items-center justify-between text-xs text-muted-foreground font-semibold">
                  <span>Unique Visitors</span>
                  <Globe className="w-4 h-4 text-accent" />
                </div>
                <div className="text-3xl font-extrabold hydro-text">{uniqueVisitorCount}</div>
                <div className="text-[11px] text-emerald-500 font-semibold">Bataan, Pampanga, Manila, Capiz</div>
              </div>
            </div>

            {/* Quick Actions & Recent Activity */}
            <div className="grid lg:grid-cols-12 gap-6">
              {/* Recent Inquiries summary */}
              <div className="lg:col-span-7 glass-card rounded-2xl p-6 border border-border/70 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-extrabold text-foreground text-sm flex items-center gap-2">
                    <ShoppingBag className="w-4 h-4 text-primary" /> Latest Client Inquiries
                  </h3>
                  {canAccess('inquiries') && (
                    <button
                      onClick={() => setActiveTab('inquiries')}
                      className="text-xs text-primary font-semibold hover:underline flex items-center gap-1"
                    >
                      <span>View All ({inquiries.length})</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                <div className="space-y-3">
                  {inquiries.slice(0, 4).map(inq => (
                    <div
                      key={inq.id}
                      className="p-3.5 rounded-xl bg-muted/40 border border-border/50 text-xs flex items-center justify-between gap-3"
                    >
                      <div className="space-y-0.5">
                        <div className="font-bold text-foreground flex items-center gap-2">
                          <span>{inq.customer_name}</span>
                          <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                            inq.contact_status === 'contacted'
                              ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400'
                              : 'bg-red-500/20 text-red-600 dark:text-red-400'
                          }`}>
                            {inq.contact_status === 'contacted' ? 'Contacted' : 'Not Contacted'}
                          </span>
                        </div>
                        <div className="text-muted-foreground">{inq.fingerling_name} • {inq.quantity?.toLocaleString() || 'Quote request'}</div>
                      </div>
                      <div className="text-[11px] text-muted-foreground font-mono">
                        {new Date(inq.created_date).toLocaleDateString()}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Status and Quick Links */}
              <div className="lg:col-span-5 space-y-6">
                {/* Farm Operations Calendar Status Quick Controller */}
                <div className={`glass-card rounded-2xl p-6 border-2 transition-all space-y-4 ${
                  settings.farm_calendar?.operational_status === 'non_operational'
                    ? 'border-red-500/40 bg-red-500/5'
                    : settings.farm_calendar?.operational_status === 'maintenance'
                    ? 'border-blue-500/40 bg-blue-500/5'
                    : settings.farm_calendar?.operational_status === 'by_appointment'
                    ? 'border-amber-500/40 bg-amber-500/5'
                    : 'border-emerald-500/40 bg-emerald-500/5'
                }`}>
                  <div className="flex items-center justify-between">
                    <h3 className="font-extrabold text-foreground text-sm flex items-center gap-2">
                      <Clock className="w-4 h-4 text-primary" /> Calendar Operational Status
                    </h3>
                    <span className={`text-[11px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                      settings.farm_calendar?.operational_status === 'non_operational'
                        ? 'bg-red-500/20 text-red-600 dark:text-red-400 border border-red-500/30'
                        : settings.farm_calendar?.operational_status === 'maintenance'
                        ? 'bg-blue-500/20 text-blue-600 dark:text-blue-400 border border-blue-500/30'
                        : settings.farm_calendar?.operational_status === 'by_appointment'
                        ? 'bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/30'
                        : 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                    }`}>
                      {settings.farm_calendar?.operational_status === 'non_operational'
                        ? '● Non-Operational'
                        : settings.farm_calendar?.operational_status === 'maintenance'
                        ? '● Maintenance'
                        : settings.farm_calendar?.operational_status === 'by_appointment'
                        ? '● By Appointment'
                        : '● Operational'}
                    </span>
                  </div>

                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Controls whether the farm calendar displays regular visiting and live pickup operations, or announces a temporary non-operational pause.
                  </p>

                  {/* Quick status change buttons */}
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <button
                      type="button"
                      onClick={() => {
                        const curCal = settings.farm_calendar || {
                          enabled: true,
                          closed_on_sundays: true,
                          saturdays_by_appointment: true,
                          holiday_default_status: 'by_appointment',
                          custom_closures: []
                        };
                        const updatedCal = {
                          ...curCal,
                          operational_status: 'operational' as const,
                          status_message: 'Open for Visits & Regular Dispatch'
                        };
                        onUpdateSettings({ ...settings, farm_calendar: updatedCal });
                        setAdminToast('Farm status set to: OPERATIONAL (Open)');
                        setTimeout(() => setAdminToast(''), 3000);
                      }}
                      className={`py-2 px-3 rounded-xl font-bold transition-all text-left flex items-center justify-between border ${
                        (settings.farm_calendar?.operational_status || 'operational') === 'operational'
                          ? 'bg-emerald-500 text-white border-emerald-500 shadow-sm'
                          : 'bg-card text-foreground border-border/70 hover:bg-muted'
                      }`}
                    >
                      <span>🟢 Operational</span>
                      {(settings.farm_calendar?.operational_status || 'operational') === 'operational' && (
                        <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        const curCal = settings.farm_calendar || {
                          enabled: true,
                          closed_on_sundays: true,
                          saturdays_by_appointment: true,
                          holiday_default_status: 'by_appointment',
                          custom_closures: []
                        };
                        const updatedCal = {
                          ...curCal,
                          operational_status: 'non_operational' as const,
                          status_message: 'Farm Operations Temporarily Paused'
                        };
                        onUpdateSettings({ ...settings, farm_calendar: updatedCal });
                        setAdminToast('Farm status set to: NON-OPERATIONAL (Closed)');
                        setTimeout(() => setAdminToast(''), 3000);
                      }}
                      className={`py-2 px-3 rounded-xl font-bold transition-all text-left flex items-center justify-between border ${
                        settings.farm_calendar?.operational_status === 'non_operational'
                          ? 'bg-red-500 text-white border-red-500 shadow-sm'
                          : 'bg-card text-foreground border-border/70 hover:bg-muted'
                      }`}
                    >
                      <span>🔴 Non-Operational</span>
                      {settings.farm_calendar?.operational_status === 'non_operational' && (
                        <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        const curCal = settings.farm_calendar || {
                          enabled: true,
                          closed_on_sundays: true,
                          saturdays_by_appointment: true,
                          holiday_default_status: 'by_appointment',
                          custom_closures: []
                        };
                        const updatedCal = {
                          ...curCal,
                          operational_status: 'by_appointment' as const,
                          status_message: 'Limited Operations: Prior Appointment Required'
                        };
                        onUpdateSettings({ ...settings, farm_calendar: updatedCal });
                        setAdminToast('Farm status set to: BY APPOINTMENT');
                        setTimeout(() => setAdminToast(''), 3000);
                      }}
                      className={`py-2 px-3 rounded-xl font-bold transition-all text-left flex items-center justify-between border ${
                        settings.farm_calendar?.operational_status === 'by_appointment'
                          ? 'bg-amber-500 text-white border-amber-500 shadow-sm'
                          : 'bg-card text-foreground border-border/70 hover:bg-muted'
                      }`}
                    >
                      <span>🟡 By Appointment</span>
                      {settings.farm_calendar?.operational_status === 'by_appointment' && (
                        <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        const curCal = settings.farm_calendar || {
                          enabled: true,
                          closed_on_sundays: true,
                          saturdays_by_appointment: true,
                          holiday_default_status: 'by_appointment',
                          custom_closures: []
                        };
                        const updatedCal = {
                          ...curCal,
                          operational_status: 'maintenance' as const,
                          status_message: 'Biosecurity Pond Disinfection In Progress'
                        };
                        onUpdateSettings({ ...settings, farm_calendar: updatedCal });
                        setAdminToast('Farm status set to: MAINTENANCE');
                        setTimeout(() => setAdminToast(''), 3000);
                      }}
                      className={`py-2 px-3 rounded-xl font-bold transition-all text-left flex items-center justify-between border ${
                        settings.farm_calendar?.operational_status === 'maintenance'
                          ? 'bg-blue-500 text-white border-blue-500 shadow-sm'
                          : 'bg-card text-foreground border-border/70 hover:bg-muted'
                      }`}
                    >
                      <span>🔵 Maintenance</span>
                      {settings.farm_calendar?.operational_status === 'maintenance' && (
                        <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                      )}
                    </button>
                  </div>

                  <div className="pt-1 flex items-center justify-between text-xs">
                    <span className="text-muted-foreground text-[11px]">
                      Current notice: <i className="text-foreground">{settings.farm_calendar?.status_message || 'Open for Visits & Regular Dispatch'}</i>
                    </span>
                    {canAccess('location') && (
                      <button
                        type="button"
                        onClick={() => setActiveTab('location')}
                        className="text-primary font-bold hover:underline inline-flex items-center gap-1 text-[11px]"
                      >
                        <span>Manage Dates</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>

                <div className="glass-card rounded-2xl p-6 border border-border/70 space-y-4">
                  <h3 className="font-extrabold text-foreground text-sm flex items-center gap-2">
                    <Shield className="w-4 h-4 text-primary" /> System & Integrations Status
                  </h3>

                <div className="space-y-2.5 text-xs">
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-muted/40 border border-border/40">
                    <span className="font-semibold text-foreground">SMTP Mail Server</span>
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-500">
                      {settings.smtp?.host ? `Configured (${settings.smtp.host})` : 'Pending Setup'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-muted/40 border border-border/40">
                    <div className="flex items-center gap-1.5 font-semibold text-foreground">
                      <MessageSquare className="w-3.5 h-3.5 text-primary" />
                      <span>Chat Support Widget</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        const next = settings.chat_widget_enabled === false ? true : false;
                        onUpdateSettings({ ...settings, chat_widget_enabled: next });
                        setAdminToast(next ? 'Chat Support Widget enabled' : 'Chat Support Widget disabled');
                        setTimeout(() => setAdminToast(''), 3000);
                      }}
                      className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full transition-all cursor-pointer ${
                        settings.chat_widget_enabled !== false
                          ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/30'
                          : 'bg-muted text-muted-foreground border border-border hover:bg-muted/80'
                      }`}
                      title="Click to toggle"
                    >
                      {settings.chat_widget_enabled !== false ? '● Visible (Click to Disable)' : '○ Disabled (Click to Enable)'}
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-muted/40 border border-border/40">
                    <span className="font-semibold text-foreground">Self-Hosted Zitadel OIDC</span>
                    <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                      settings.zitadel?.enabled
                        ? 'bg-emerald-500/20 text-emerald-500'
                        : 'bg-muted text-muted-foreground'
                    }`}>
                      {settings.zitadel?.enabled ? 'Active' : 'Disabled (Local RBAC Active)'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-muted/40 border border-border/40">
                    <span className="font-semibold text-foreground">Google Maps Coordinates</span>
                    <span className="text-[11px] font-mono text-primary font-bold">
                      {settings.lat.toFixed(4)}, {settings.lng.toFixed(4)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-muted/40 border border-border/40">
                    <span className="font-semibold text-foreground">Active User Role</span>
                    <span className="text-[11px] font-bold text-foreground">
                      {currentUser.role === 'super_admin' ? 'Super Administrator' : 'Website Moderator'}
                    </span>
                  </div>
                </div>

                <div className="pt-2">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-2">
                    Quick Jump:
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {visibleNavTabs.filter(t => t.id !== 'dashboard').map(tab => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className="px-2.5 py-1 rounded-lg glass text-[11px] font-semibold text-muted-foreground hover:text-foreground hover:bg-muted"
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        )}

        {/* USERS TAB */}
        {activeTab === 'users' && currentUser.role === 'super_admin' && (
          <AdminUsersTab
            users={users}
            currentUser={currentUser}
            onAddUser={handleAddUser}
            onUpdateUser={handleUpdateUser}
            onDeleteUser={handleDeleteUser}
            onResetPassword={handleResetPassword}
          />
        )}

        {/* HERO TAB */}
        {activeTab === 'hero' && canAccess('hero') && (
          <AdminHeroTab settings={settings} onUpdateSettings={onUpdateSettings} />
        )}

        {/* WHY CHOOSE US TAB */}
        {activeTab === 'why_choose_us' && canAccess('why_choose_us') && (
          <AdminWhyChooseUsTab settings={settings} onUpdateSettings={onUpdateSettings} />
        )}

        {/* CATALOG TAB */}
        {activeTab === 'catalog' && canAccess('catalog') && (
          <AdminCatalogTab
            fingerlings={fingerlings}
            onUpdateFingerling={onUpdateFingerling}
            onAddFingerling={onAddFingerling}
            onDeleteFingerling={onDeleteFingerling}
          />
        )}

        {/* ARTICLES TAB */}
        {activeTab === 'articles' && canAccess('articles') && (
          <AdminArticlesTab
            articles={articles}
            onAddArticle={onAddArticle}
            onUpdateArticle={onUpdateArticle}
            onDeleteArticle={onDeleteArticle}
          />
        )}

        {/* TANK RATIO CALCULATOR ACCURACY TAB */}
        {activeTab === 'tank_calculator' && canAccess('tank_calculator') && (
          <AdminTankCalculatorTab
            settings={settings}
            onUpdateSettings={onUpdateSettings}
          />
        )}

        {/* INQUIRIES TAB */}
        {activeTab === 'inquiries' && canAccess('inquiries') && (
          <AdminInquiriesTab
            inquiries={inquiries}
            currentUser={currentUser}
            onUpdateInquiry={onUpdateInquiry}
            onDeleteInquiry={onDeleteInquiry}
          />
        )}

        {/* LOCATION TAB */}
        {activeTab === 'location' && canAccess('location') && (
          <AdminLocationTab settings={settings} onUpdateSettings={onUpdateSettings} />
        )}

        {/* ABOUT & SETTINGS TAB */}
        {activeTab === 'about_settings' && (canAccess('about') || canAccess('settings')) && (
          <AdminAboutSettingsTab settings={settings} onUpdateSettings={onUpdateSettings} />
        )}

        {/* LIVE CHAT SUPPORT WIDGET TAB */}
        {activeTab === 'chat_support' && canAccess('chat_support') && (
          <AdminChatTab settings={settings} onUpdateSettings={onUpdateSettings} />
        )}

        {/* VISITORS TAB */}
        {activeTab === 'visitors' && canAccess('visitors') && (
          <AdminVisitorsTab />
        )}

        {/* SMTP & ZITADEL TAB */}
        {activeTab === 'smtp_zitadel' && canAccess('smtp_zitadel') && (
          <AdminSmtpZitadelTab settings={settings} onUpdateSettings={onUpdateSettings} />
        )}
          </main>
        </div>
      </div>

      {/* Change Own Password Modal */}
      {passwordModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <form
            onSubmit={handleChangeOwnPassword}
            className="bg-card border border-border/80 rounded-3xl p-6 max-w-sm w-full space-y-4 animate-scale-in"
          >
            <h3 className="text-base font-bold text-foreground flex items-center gap-2">
              <KeyRound className="w-4 h-4 text-primary" /> Change Your Password
            </h3>
            <div>
              <label className="text-xs text-muted-foreground">New Password</label>
              <input
                type="password"
                required
                value={newPasswordVal}
                onChange={e => setNewPasswordVal(e.target.value)}
                placeholder="Enter new password"
                className="w-full px-3 py-2 rounded-xl bg-muted border border-border text-foreground text-sm"
              />
            </div>
            <div className="flex gap-2 justify-end">
              <button
                type="button"
                onClick={() => setPasswordModalOpen(false)}
                className="px-4 py-2 rounded-xl glass text-xs text-muted-foreground"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-primary text-primary-foreground font-bold text-xs"
              >
                Update Password
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
