'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, ShoppingBag, Heart, User, Menu, X, Sun, Moon, ChevronDown, Bell, Package, LogOut, Settings, ChevronRight,
} from 'lucide-react';
import { useRouterStore, useCartStore, useWishlistStore, useAuthStore, useNotificationStore, useSearchStore } from '@/stores';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { getStoredCategories } from '@/lib/storage';

export function Navbar() {
  const { navigate, page } = useRouterStore();
  const { getTotal } = useCartStore();
  const { items: wishlistItems } = useWishlistStore();
  const { isAuthenticated, user, logout } = useAuthStore();
  const { unreadCount } = useNotificationStore();
  const { theme, setTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [mounted, setMounted] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) setUserMenuOpen(false);
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) setSearchOpen(false);
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const totals = getTotal();
  const categories = typeof window !== 'undefined' ? getStoredCategories() : [];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      const { addToHistory } = useSearchStore.getState();
      addToHistory(searchQuery.trim());
      navigate('search', { q: searchQuery.trim() });
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  const navLinks = [
    { label: 'Home', page: 'home' as const },
    { label: 'Shop', page: 'shop' as const },
    { label: 'Categories', page: 'categories' as const },
    { label: 'About', page: 'about' as const },
    { label: 'Contact', page: 'contact' as const },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Logo */}
          <button onClick={() => navigate('home')} className="flex items-center gap-2 shrink-0">
            <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center">
              <ShoppingBag className="h-4 w-4 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight hidden sm:block">Luxe</span>
          </button>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <button
                key={link.page}
                onClick={() => navigate(link.page)}
                className={`px-4 py-2 text-sm font-medium rounded-xl transition-all duration-200 ${
                  page === link.page
                    ? 'bg-accent text-accent-foreground'
                    : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
                }`}
              >
                {link.label}
              </button>
            ))}
            {/* Categories dropdown */}
            <div className="relative group">
              <button className="px-4 py-2 text-sm font-medium rounded-xl text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-all duration-200 flex items-center gap-1">
                More <ChevronDown className="h-3 w-3" />
              </button>
              <div className="absolute top-full left-0 mt-2 w-56 bg-popover border border-border rounded-2xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 p-2 z-50">
                {categories.slice(0, 6).map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => navigate('shop', { category: cat.slug })}
                    className="w-full text-left px-3 py-2 text-sm rounded-xl hover:bg-accent transition-colors flex items-center justify-between"
                  >
                    {cat.name}
                    <ChevronRight className="h-3 w-3 text-muted-foreground" />
                  </button>
                ))}
              </div>
            </div>
          </nav>

          {/* Search + Actions */}
          <div className="flex items-center gap-2">
            {/* Search */}
            <div ref={searchRef} className="relative">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSearchOpen(!searchOpen)}
                className="rounded-xl h-10 w-10"
                aria-label="Search"
              >
                <Search className="h-5 w-5" />
              </Button>
              <AnimatePresence>
                {searchOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    className="absolute right-0 top-14 w-80 sm:w-96 bg-popover border border-border rounded-2xl shadow-2xl p-4 z-50"
                  >
                    <form onSubmit={handleSearch}>
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          placeholder="Search products..."
                          className="pl-10 rounded-xl"
                          autoFocus
                        />
                      </div>
                    </form>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Theme Toggle */}
            {mounted && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="rounded-xl h-10 w-10"
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </Button>
            )}

            {/* Notifications */}
            {isAuthenticated && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate('notifications')}
                className="rounded-xl h-10 w-10 relative"
                aria-label="Notifications"
              >
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full bg-destructive text-destructive-foreground text-[10px] font-bold flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </Button>
            )}

            {/* Wishlist */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('wishlist')}
              className="rounded-xl h-10 w-10 relative"
              aria-label="Wishlist"
            >
              <Heart className="h-5 w-5" />
              {wishlistItems.length > 0 && (
                <span className="absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full bg-violet-500 text-white text-[10px] font-bold flex items-center justify-center">
                  {wishlistItems.length}
                </span>
              )}
            </Button>

            {/* Cart */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('cart')}
              className="rounded-xl h-10 w-10 relative"
              aria-label="Cart"
            >
              <ShoppingBag className="h-5 w-5" />
              {totals.itemCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full bg-violet-500 text-white text-[10px] font-bold flex items-center justify-center">
                  {totals.itemCount}
                </span>
              )}
            </Button>

            {/* User Menu */}
            <div ref={userMenuRef} className="relative">
              {isAuthenticated ? (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="rounded-xl h-10 w-10"
                  aria-label="User menu"
                >
                  <div className="h-7 w-7 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center text-white text-xs font-bold">
                    {user?.name?.charAt(0) || 'U'}
                  </div>
                </Button>
              ) : (
                <Button
                  onClick={() => navigate('login')}
                  className="rounded-xl bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white hover:from-violet-600 hover:to-fuchsia-600 hidden sm:flex"
                  size="sm"
                >
                  Sign In
                </Button>
              )}
              <AnimatePresence>
                {userMenuOpen && isAuthenticated && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    className="absolute right-0 top-14 w-56 bg-popover border border-border rounded-2xl shadow-2xl p-2 z-50"
                  >
                    <div className="px-3 py-2 border-b border-border mb-2">
                      <p className="text-sm font-semibold">{user?.name}</p>
                      <p className="text-xs text-muted-foreground">{user?.email}</p>
                    </div>
                    {[
                      { icon: User, label: 'Profile', page: 'profile' as const },
                      { icon: Package, label: 'Orders', page: 'orders' as const },
                      { icon: Bell, label: 'Notifications', page: 'notifications' as const },
                      { icon: Settings, label: 'Dashboard', page: 'dashboard' as const },
                    ].map((item) => (
                      <button
                        key={item.page}
                        onClick={() => { navigate(item.page); setUserMenuOpen(false); }}
                        className="w-full flex items-center gap-3 px-3 py-2 text-sm rounded-xl hover:bg-accent transition-colors"
                      >
                        <item.icon className="h-4 w-4" /> {item.label}
                      </button>
                    ))}
                    <div className="border-t border-border mt-2 pt-2">
                      <button
                        onClick={() => { logout(); setUserMenuOpen(false); navigate('home'); }}
                        className="w-full flex items-center gap-3 px-3 py-2 text-sm rounded-xl hover:bg-accent transition-colors text-destructive"
                      >
                        <LogOut className="h-4 w-4" /> Sign Out
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Mobile Menu Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden rounded-xl h-10 w-10"
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-50"
              onClick={() => setMobileMenuOpen(false)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed right-0 top-0 bottom-0 w-80 bg-background border-l border-border z-50 p-6 overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-8">
                <span className="text-lg font-bold">Menu</span>
                <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(false)} className="rounded-xl">
                  <X className="h-5 w-5" />
                </Button>
              </div>
              <div className="space-y-1">
                {navLinks.map((link) => (
                  <button
                    key={link.page}
                    onClick={() => { navigate(link.page); setMobileMenuOpen(false); }}
                    className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                      page === link.page ? 'bg-accent text-accent-foreground' : 'hover:bg-accent/50'
                    }`}
                  >
                    {link.label}
                  </button>
                ))}
                <div className="pt-4 border-t border-border mt-4">
                  <p className="px-4 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Categories</p>
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => { navigate('shop', { category: cat.slug }); setMobileMenuOpen(false); }}
                      className="w-full text-left px-4 py-2 rounded-xl text-sm hover:bg-accent/50 transition-colors"
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
                {isAuthenticated && (
                  <div className="pt-4 border-t border-border mt-4">
                    <p className="px-4 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Account</p>
                    {[
                      { icon: User, label: 'Profile', page: 'profile' as const },
                      { icon: Package, label: 'Orders', page: 'orders' as const },
                      { icon: Heart, label: 'Wishlist', page: 'wishlist' as const },
                      { icon: Bell, label: 'Notifications', page: 'notifications' as const },
                    ].map((item) => (
                      <button
                        key={item.page}
                        onClick={() => { navigate(item.page); setMobileMenuOpen(false); }}
                        className="w-full flex items-center gap-3 px-4 py-2 rounded-xl text-sm hover:bg-accent/50 transition-colors"
                      >
                        <item.icon className="h-4 w-4" /> {item.label}
                      </button>
                    ))}
                    <button
                      onClick={() => { logout(); setMobileMenuOpen(false); navigate('home'); }}
                      className="w-full flex items-center gap-3 px-4 py-2 rounded-xl text-sm hover:bg-accent/50 transition-colors text-destructive mt-2"
                    >
                      <LogOut className="h-4 w-4" /> Sign Out
                    </button>
                  </div>
                )}
                {!isAuthenticated && (
                  <div className="pt-4 border-t border-border mt-4 space-y-2">
                    <Button onClick={() => { navigate('login'); setMobileMenuOpen(false); }} className="w-full rounded-xl">Sign In</Button>
                    <Button onClick={() => { navigate('register'); setMobileMenuOpen(false); }} variant="outline" className="w-full rounded-xl">Create Account</Button>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
