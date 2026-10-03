import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { LanguageProvider } from './context/LanguageContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { Home } from './pages/Home';
import { Catalog } from './pages/Catalog';
import { FishCare } from './pages/FishCare';
import { Location } from './pages/Location';
import { OrderInquiry } from './pages/OrderInquiry';
import { Admin } from './pages/Admin';
import { NotFound } from './pages/NotFound';
import { LiveChatWidget } from './components/LiveChatWidget';
import {
  defaultSiteSettings,
  defaultFingerlings,
  defaultArticles,
  defaultOrderInquiries,
  defaultSales
} from './data/initialData';
import { Fingerling, SiteSettings, OrderInquiry as OrderInquiryType, Sale, BlogArticle } from './types';
import { recordVisitorVisit } from './utils/visitorTracker';

// Scroll to top & record visitor analytics on route navigation
const RouteTracker = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = 'Mesina Farms';
    recordVisitorVisit(pathname);
  }, [pathname]);
  return null;
};

export default function App() {
  // Fingerlings State
  const [fingerlings, setFingerlings] = useState<Fingerling[]>(() => {
    const saved = localStorage.getItem('mesina_fingerlings');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* fallback */ }
    }
    return defaultFingerlings;
  });

  // Settings State
  const [settings, setSettings] = useState<SiteSettings>(() => {
    const saved = localStorage.getItem('mesina_settings');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* fallback */ }
    }
    return defaultSiteSettings;
  });

  // Inquiries State
  const [inquiries, setInquiries] = useState<OrderInquiryType[]>(() => {
    const saved = localStorage.getItem('mesina_inquiries');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* fallback */ }
    }
    return defaultOrderInquiries;
  });

  // Articles State
  const [articles, setArticles] = useState<BlogArticle[]>(() => {
    const saved = localStorage.getItem('mesina_articles');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* fallback */ }
    }
    return defaultArticles;
  });

  // Sales State
  const [sales] = useState<Sale[]>(() => {
    const saved = localStorage.getItem('mesina_sales');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* fallback */ }
    }
    return defaultSales;
  });

  // Persistence Effects
  useEffect(() => {
    localStorage.setItem('mesina_fingerlings', JSON.stringify(fingerlings));
  }, [fingerlings]);

  useEffect(() => {
    localStorage.setItem('mesina_settings', JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem('mesina_inquiries', JSON.stringify(inquiries));
  }, [inquiries]);

  useEffect(() => {
    localStorage.setItem('mesina_articles', JSON.stringify(articles));
  }, [articles]);

  // Handlers
  const handleUpdateFingerling = (updated: Fingerling) => {
    setFingerlings(prev => prev.map(f => (f.id === updated.id ? updated : f)));
  };

  const handleAddFingerling = (newFish: Fingerling) => {
    setFingerlings(prev => [...prev, newFish]);
  };

  const handleDeleteFingerling = (id: string) => {
    setFingerlings(prev => prev.filter(f => f.id !== id));
  };

  const handleUpdateSettings = (updated: SiteSettings) => {
    setSettings(updated);
  };

  const handleAddInquiry = (newInquiry: Omit<OrderInquiryType, 'id' | 'created_date'>) => {
    const fullInquiry: OrderInquiryType = {
      ...newInquiry,
      id: `ord-${Date.now()}`,
      contact_status: 'not_contacted',
      created_date: new Date().toISOString()
    };
    setInquiries(prev => [fullInquiry, ...prev]);
  };

  const handleUpdateInquiry = (updated: OrderInquiryType) => {
    setInquiries(prev => prev.map(i => (i.id === updated.id ? updated : i)));
  };

  const handleDeleteInquiry = (id: string) => {
    setInquiries(prev => prev.filter(i => i.id !== id));
  };

  const handleAddArticle = (article: BlogArticle) => {
    setArticles(prev => [article, ...prev]);
  };

  const handleUpdateArticle = (updated: BlogArticle) => {
    setArticles(prev => prev.map(a => (a.id === updated.id ? updated : a)));
  };

  const handleDeleteArticle = (id: string) => {
    setArticles(prev => prev.filter(a => a.id !== id));
  };

  return (
    <ThemeProvider>
      <LanguageProvider>
        <BrowserRouter>
          <RouteTracker />
          <div className="min-h-screen flex flex-col bg-background text-foreground selection:bg-primary selection:text-primary-foreground font-sans">
            <Navbar settings={settings} />

            <main className="flex-1">
              <Routes>
                <Route
                  path="/"
                  element={
                    <Home
                      fingerlings={fingerlings}
                      articles={articles}
                      settings={settings}
                    />
                  }
                />
                <Route
                  path="/catalog"
                  element={<Catalog fingerlings={fingerlings} />}
                />
                <Route
                  path="/fish-care"
                  element={<FishCare articles={articles} />}
                />
                <Route
                  path="/location"
                  element={<Location settings={settings} />}
                />
                <Route
                  path="/order-inquiry"
                  element={
                    <OrderInquiry
                      fingerlings={fingerlings}
                      onAddInquiry={handleAddInquiry}
                    />
                  }
                />
                <Route
                  path="/connect/admin"
                  element={
                    <Admin
                      fingerlings={fingerlings}
                      settings={settings}
                      inquiries={inquiries}
                      sales={sales}
                      articles={articles}
                      onUpdateFingerling={handleUpdateFingerling}
                      onAddFingerling={handleAddFingerling}
                      onDeleteFingerling={handleDeleteFingerling}
                      onUpdateSettings={handleUpdateSettings}
                      onUpdateInquiry={handleUpdateInquiry}
                      onDeleteInquiry={handleDeleteInquiry}
                      onAddArticle={handleAddArticle}
                      onUpdateArticle={handleUpdateArticle}
                      onDeleteArticle={handleDeleteArticle}
                    />
                  }
                />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>

            <Footer settings={settings} />
            <LiveChatWidget />
          </div>
        </BrowserRouter>
      </LanguageProvider>
    </ThemeProvider>
  );
}
