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
  Clock
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
    { id: 'hero', label: 'Hero Slideshow', icon: Sparkles, module: 'hero' as PermissionModule },
    { id: 'why_choose_us', label: 'Why Choose Us', icon: Award, module: 'why_choose_us' as PermissionModule },
    { id: 'location', label: 'Location & Map', icon: MapPin, module: 'location' as PermissionModule },
    { id: 'about_settings', label: 'About & Branding', icon: Settings, module: 'about' as PermissionModule },
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

        {/* Tab Navigation Ribbon */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex gap-1 overflow-x-auto py-2 scrollbar-none">
          {visibleNavTabs.map(tab => {
            const isActive = activeTab === tab.id;
            const IconComp = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold shrink-0 flex items-center gap-1.5 transition-all ${
                  isActive
                    ? 'bg-primary text-primary-foreground shadow-md'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/60'
                }`}
              >
                <IconComp className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
                {typeof tab.badge === 'number' && tab.badge > 0 && (
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                    isActive ? 'bg-black/30 text-white' : 'bg-red-500 text-white'
                  }`}>
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {adminToast && (
          <div className="mb-6 p-3 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-semibold">
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
                <div className="text-[11px] text-emerald-500 font-semibold">Capiz, Iloilo, Cebu, Manila</div>
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
              <div className="lg:col-span-5 glass-card rounded-2xl p-6 border border-border/70 space-y-4">
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

        {/* VISITORS TAB */}
        {activeTab === 'visitors' && canAccess('visitors') && (
          <AdminVisitorsTab />
        )}

        {/* SMTP & ZITADEL TAB */}
        {activeTab === 'smtp_zitadel' && canAccess('smtp_zitadel') && (
          <AdminSmtpZitadelTab settings={settings} onUpdateSettings={onUpdateSettings} />
        )}
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
