'use client';

import React, { useEffect } from 'react';
import { useRouterStore, useAuthStore, useCartStore, useWishlistStore, useNotificationStore, useRecentlyViewedStore, useDataStore } from '@/stores';
import { initializeData } from '@/lib/storage';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { HomePage } from '@/components/pages/HomePage';
import { ShopPage } from '@/components/pages/ShopPage';
import { ProductDetailPage } from '@/components/pages/ProductDetailPage';
import { LoginPage, RegisterPage, ForgotPasswordPage } from '@/components/pages/AuthPages';
import { CartPage, CheckoutPage, OrderSuccessPage } from '@/components/pages/CartCheckoutPages';
import { DashboardPage, ProfilePage, OrdersPage, OrderDetailsPage, NotificationsPage, WishlistPage } from '@/components/pages/DashboardPages';
import { CategoriesPage, SearchPage, AboutPage, ContactPage, FAQPage, NotFoundPage } from '@/components/pages/StaticPages';

function AppInitializer({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = React.useState(false);

  useEffect(() => {
    initializeData();
    useDataStore.getState().initialize();
    useAuthStore.getState().initialize();
    useCartStore.getState().initialize();
    useWishlistStore.getState().initialize();
    useNotificationStore.getState().initialize();
    useRecentlyViewedStore.getState().initialize();
    setReady(true);
  }, []);

  // Handle hash routing on load and back/forward
  useEffect(() => {
    if (!ready) return;

    const parseHash = () => {
      const hash = window.location.hash.slice(2); // remove '#/'
      if (!hash || hash === '/') {
        useRouterStore.getState().navigate('home');
        return;
      }
      const parts = hash.split('/');
      const page = parts[0] as any;
      const params: Record<string, string> = {};
      if (parts[1]) params.id = parts[1];
      // Also parse query params if present
      if (hash.includes('?')) {
        const queryPart = hash.split('?')[1];
        queryPart.split('&').forEach((pair) => {
          const [key, value] = pair.split('=');
          if (key && value) params[key] = decodeURIComponent(value);
        });
      }
      useRouterStore.getState().navigate(page, params);
    };

    parseHash();
    window.addEventListener('hashchange', parseHash);
    return () => window.removeEventListener('hashchange', parseHash);
  }, [ready]);

  if (!ready) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center animate-pulse">
            <svg className="h-6 w-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <path d="M16 10a4 4 0 01-8 0" />
            </svg>
          </div>
          <p className="text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

function PageRouter() {
  const { page, params } = useRouterStore();

  const pages: Record<string, React.ReactNode> = {
    home: <HomePage />,
    shop: <ShopPage />,
    categories: <CategoriesPage />,
    product: <ProductDetailPage />,
    search: <SearchPage />,
    wishlist: <WishlistPage />,
    cart: <CartPage />,
    checkout: <CheckoutPage />,
    'order-success': <OrderSuccessPage />,
    login: <LoginPage />,
    register: <RegisterPage />,
    'forgot-password': <ForgotPasswordPage />,
    dashboard: <DashboardPage />,
    profile: <ProfilePage />,
    orders: <OrdersPage />,
    'order-details': <OrderDetailsPage />,
    notifications: <NotificationsPage />,
    contact: <ContactPage />,
    about: <AboutPage />,
    faq: <FAQPage />,
    '404': <NotFoundPage />,
  };

  return pages[page] || <NotFoundPage />;
}

export default function Home() {
  return (
    <AppInitializer>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1">
          <PageRouter />
        </main>
        <Footer />
      </div>
    </AppInitializer>
  );
}
