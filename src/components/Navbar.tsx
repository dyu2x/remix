import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Search, Sun, Moon, Menu, X, ArrowRight, Globe, Shield, ChevronDown } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { ImageWithFallback } from './ImageWithFallback';
import { SiteSettings } from '../types';

interface NavbarProps {
  settings: SiteSettings;
}

export const Navbar: React.FC<NavbarProps> = ({ settings }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  
  const { theme, toggleTheme } = useTheme();
  const { language, setLanguage, t, languages } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
    setSearchOpen(false);
    setLangDropdownOpen(false);
  }, [location.pathname]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/catalog?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  const navLinks = [
    { label: t.navHome, path: '/' },
    { label: t.navCatalog, path: '/catalog' },
    { label: t.navFishCare, path: '/fish-care' },
    { label: t.navLocation, path: '/location' },
    { label: t.navOrderInquiry, path: '/order-inquiry' }
  ];

  const currentLang = languages.find(l => l.code === language) || languages[0];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? 'glass-nav py-2.5 shadow-lg shadow-black/5' : 'py-4 bg-transparent'
        }`}
      >
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-3">
          {/* Logo & Farm Name */}
          <Link to="/" className="flex items-center gap-3 group shrink-0">
            <div className="relative w-10 h-10 sm:w-11 sm:h-11 rounded-full overflow-hidden ring-2 ring-primary/30 ring-offset-2 ring-offset-background group-hover:ring-primary/60 transition-all duration-300">
              <ImageWithFallback
                src={settings.logo_url}
                alt={`${settings.farm_name} Logo`}
                className="w-full h-full object-cover"
                fittingType="fill"
              />
            </div>
            <span className="font-heading font-bold text-lg sm:text-xl tracking-tight hidden sm:block">
              {settings.farm_name.includes(' ') ? (
                <>
                  {settings.farm_name.substring(0, settings.farm_name.lastIndexOf(' '))} <span className="text-primary">{settings.farm_name.split(' ').pop()}</span>
                </>
              ) : (
                <span className="text-primary">{settings.farm_name}</span>
              )}
            </span>
          </Link>

          {/* Desktop Links */}
          <div className="hidden lg:flex items-center gap-1 bg-card/40 backdrop-blur-md px-3 py-1.5 rounded-full border border-border/50">
            {navLinks.map(link => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-primary text-primary-foreground shadow-md font-semibold'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>

          {/* Actions & Utilities */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* Language Selector Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                className="p-2 sm:px-3 sm:py-2 rounded-full glass hover:bg-muted/50 transition-colors text-xs font-semibold text-foreground flex items-center gap-1.5 border border-border/50"
                title="Change Language"
                aria-label="Language Selector"
              >
                <Globe className="w-4 h-4 text-primary" />
                <span className="hidden sm:inline font-mono uppercase">{currentLang.code}</span>
                <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
              </button>

              {langDropdownOpen && (
                <>
                  <div
                    className="fixed inset-0 z-30"
                    onClick={() => setLangDropdownOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-card border border-border/70 shadow-2xl p-2 z-40 animate-scale-in">
                    <div className="px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-muted-foreground border-b border-border/40 mb-1">
                      {t.languageSelect}
                    </div>
                    <div className="max-h-72 overflow-y-auto space-y-1">
                      {languages.map(l => (
                        <button
                          key={l.code}
                          type="button"
                          onClick={() => {
                            setLanguage(l.code);
                            setLangDropdownOpen(false);
                          }}
                          className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between transition-colors ${
                            l.code === language
                              ? 'bg-primary text-primary-foreground font-bold shadow-sm'
                              : 'text-foreground hover:bg-muted'
                          }`}
                        >
                          <div>
                            <div className="font-semibold">{l.name}</div>
                            <div className="text-[10px] opacity-75">{l.nativeName}</div>
                          </div>
                          <span className="text-[10px] opacity-60 font-mono">
                            {l.region.split('/')[0]}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Quick Search Toggle */}
            <button
              onClick={() => setSearchOpen(true)}
              className="p-2.5 rounded-full glass hover:bg-muted/50 transition-colors text-muted-foreground hover:text-foreground"
              title="Search Catalog"
              aria-label="Search"
            >
              <Search className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-full glass hover:bg-muted/50 transition-colors text-muted-foreground hover:text-foreground"
              title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
              aria-label="Toggle Theme"
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 sm:w-5 sm:h-5 text-slate-700" />
              )}
            </button>

            {/* Direct Admin Portal Entrance */}
            <Link
              to="/connect/admin"
              className="p-2.5 rounded-full glass hover:bg-primary hover:text-primary-foreground transition-all text-muted-foreground"
              title="Staff / Admin Portal (/connect/admin)"
              aria-label="Admin Portal"
            >
              <Shield className="w-4 h-4 sm:w-5 sm:h-5" />
            </Link>

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-full glass lg:hidden text-muted-foreground hover:text-foreground"
              aria-label="Toggle Mobile Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="fixed top-20 left-4 right-4 bg-card/95 backdrop-blur-xl border border-border/60 rounded-3xl p-6 shadow-2xl space-y-4 animate-slide-up max-h-[85vh] overflow-y-auto">
            <div className="flex flex-col space-y-2">
              {navLinks.map(link => {
                const isActive = location.pathname === link.path;
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`px-4 py-3 rounded-2xl text-base font-semibold transition-all ${
                      isActive
                        ? 'bg-primary text-primary-foreground shadow-md'
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </div>

            <div className="pt-3 border-t border-border/40 space-y-3">
              <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                {t.languageSelect}
              </div>
              <div className="grid grid-cols-2 gap-2">
                {languages.map(l => (
                  <button
                    key={l.code}
                    type="button"
                    onClick={() => {
                      setLanguage(l.code);
                      setMobileMenuOpen(false);
                    }}
                    className={`p-2 rounded-xl text-xs text-left transition-all ${
                      l.code === language
                        ? 'bg-primary text-primary-foreground font-bold shadow-sm'
                        : 'glass text-muted-foreground hover:text-foreground hover:bg-muted'
                    }`}
                  >
                    <div className="font-semibold truncate">{l.name}</div>
                    <div className="text-[10px] opacity-75 truncate">{l.region}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-2 border-t border-border/40">
              <Link
                to="/connect/admin"
                className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl glass text-xs font-semibold text-foreground hover:bg-muted"
              >
                <Shield className="w-4 h-4 text-primary" />
                <span>Access Admin Portal (/connect/admin)</span>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Global Search Overlay */}
      {searchOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4">
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-md"
            onClick={() => setSearchOpen(false)}
          />
          <div className="relative w-full max-w-2xl bg-card border border-border/80 rounded-3xl shadow-2xl p-4 sm:p-6 z-10 animate-scale-in">
            <div className="flex items-center justify-between pb-3 border-b border-border/40 mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-primary">Search Fingerling Catalog</span>
              <button
                onClick={() => setSearchOpen(false)}
                className="p-1 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSearchSubmit} className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                autoFocus
                placeholder="Search starter, grow-out, jumbo, size..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-10 py-3.5 rounded-2xl bg-muted border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary text-base font-medium"
              />
            </form>
            <div className="pt-4 flex justify-end">
              <button
                onClick={handleSearchSubmit}
                className="px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 flex items-center gap-2"
              >
                <span>Search</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
