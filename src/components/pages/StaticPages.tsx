'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import {
  Search,
  MapPin,
  Phone,
  Mail,
  ChevronDown,
  ChevronUp,
  MessageSquare,
  Clock,
  Users,
  Award,
  Globe,
  Heart,
  HelpCircle,
  Home,
  Linkedin,
  Github,
  Code2,
  Smartphone,
  Palette,
  Zap,
  Server,
  ExternalLink,
} from 'lucide-react';
import { useRouterStore, useSearchStore } from '@/stores';
import {
  getStoredCategories,
  getStoredProducts,
  getSearchHistory,
  clearSearchHistory,
} from '@/lib/storage';
import {
  ProductGrid,
  EmptyState,
  ProductImage,
} from '@/components/shared';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/components/ui/accordion';
import { Card, CardContent } from '@/components/ui/card';
import { Product, Category } from '@/lib/types';
import { toast } from 'sonner';

// ─── Animation Variants ──────────────────────────────────────────────────────

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: 'easeOut' },
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const staggerItem = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
};

// ─── CategoriesPage ──────────────────────────────────────────────────────────

export function CategoriesPage() {
  const navigate = useRouterStore((s) => s.navigate);
  const [categories, setCategories] = useState<Category[]>(() => {
    if (typeof window !== 'undefined') return getStoredCategories();
    return [];
  });
  return (
    <div className="min-h-screen pb-16 sm:pb-24">
      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="relative rounded-3xl overflow-hidden mb-10 sm:mb-14"
      >
        <div className="mesh-gradient px-5 py-14 sm:px-10 sm:py-20 lg:px-16 lg:py-24 text-center text-white">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/15 border border-indigo-500/25 text-indigo-300 text-xs font-semibold tracking-wide uppercase mb-5 sm:mb-6"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-indigo-400 animate-pulse" />
            Explore Collections
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight"
          >
            <span className="gradient-text">Browse</span>{' '}
            <span>Categories</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-4 sm:mt-5 text-base sm:text-lg text-white/60 max-w-xl mx-auto leading-relaxed"
          >
            Discover curated collections crafted for every style, need, and ambition.
          </motion.p>
        </div>
      </motion.div>

      {/* Categories Grid */}
      <motion.div
        variants={staggerContainer}
        initial="initial"
        animate="animate"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 lg:gap-6"
      >
        {categories.map((category) => (
          <motion.div
            key={category.id}
            variants={staggerItem}
            className="cursor-pointer group"
            onClick={() => navigate('shop', { category: category.slug })}
          >
            <div className="relative rounded-3xl overflow-hidden bg-card border border-border/40 hover-lift">
              {/* Category Image */}
              <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                <ProductImage
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full transition-transform duration-700 ease-out group-hover:scale-110"
                />
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                {/* Product Count Badge */}
                <div className="absolute top-3 right-3 sm:top-4 sm:right-4 px-3 py-1.5 rounded-2xl bg-background/70 dark:bg-background/60 backdrop-blur-xl text-[11px] font-bold tracking-wide uppercase border border-white/10">
                  {category.productCount} items
                </div>
                {/* Hover Arrow */}
                <div className="absolute bottom-4 right-4 h-10 w-10 rounded-2xl bg-white/20 backdrop-blur-xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-2 group-hover:translate-y-0 border border-white/20">
                  <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </div>
              </div>

              {/* Category Info */}
              <div className="p-4 sm:p-5">
                <h3 className="font-bold text-base sm:text-lg mb-1.5 group-hover:text-indigo-500 dark:group-hover:text-indigo-400 transition-colors duration-300">
                  {category.name}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
                  {category.description}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {categories.length === 0 && (
        <EmptyState
          icon={HelpCircle}
          title="No categories found"
          description="Categories will appear here once available."
        />
      )}
    </div>
  );
}

// ─── SearchPage ──────────────────────────────────────────────────────────────

export function SearchPage() {
  const { params, navigate } = useRouterStore();
  const { addToHistory } = useSearchStore();
  const initialHistory = typeof window !== 'undefined' ? getSearchHistory() : [];
  const [query, setQuery] = useState(params.q || '');
  const [searchHistory, setSearchHistory] = useState<{ query: string; searchedAt: string }[]>(initialHistory);
  const [suggestions, setSuggestions] = useState<Product[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [results, setResults] = useState<Product[]>(() => {
    if (typeof window !== 'undefined' && params.q) {
      const products = getStoredProducts();
      const q = params.q.toLowerCase().trim();
      return products.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q)) ||
          p.category.toLowerCase().includes(q)
      );
    }
    return [];
  });
  const [hasSearched, setHasSearched] = useState(() => !!params.q);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  const performSearch = React.useCallback((searchQuery: string) => {
    const products = getStoredProducts();
    const q = searchQuery.toLowerCase().trim();
    if (!q) {
      setResults([]);
      setHasSearched(false);
      return;
    }
    const filtered = products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q)) ||
        p.category.toLowerCase().includes(q)
    );
    setResults(filtered);
    setHasSearched(true);
  }, []);

  // Auto-focus search input
  useEffect(() => {
    setTimeout(() => inputRef.current?.focus(), 100);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (value: string) => {
    setQuery(value);
    if (value.trim().length > 0) {
      const products = getStoredProducts();
      const q = value.toLowerCase().trim();
      const matches = products
        .filter((p) => p.name.toLowerCase().includes(q))
        .slice(0, 5);
      setSuggestions(matches);
      setShowSuggestions(matches.length > 0);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
      setResults([]);
      setHasSearched(false);
    }
  };

  const handleSearch = (searchQuery?: string) => {
    const q = (searchQuery || query).trim();
    if (!q) return;
    setQuery(q);
    addToHistory(q);
    performSearch(q);
    setShowSuggestions(false);
    setSearchHistory(getSearchHistory());
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleClearHistory = () => {
    clearSearchHistory();
    setSearchHistory([]);
  };

  const handleSuggestionClick = (product: Product) => {
    navigate('product', { id: product.id });
  };

  return (
    <div className="min-h-screen pb-12">
      {/* Search Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold tracking-tight mb-6">Search</h1>

        {/* Search Input */}
        <div className="relative" ref={suggestionsRef}>
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              ref={inputRef}
              type="text"
              placeholder="Search products, brands, categories..."
              value={query}
              onChange={(e) => handleInputChange(e.target.value)}
              onKeyDown={handleKeyDown}
              onFocus={() => {
                if (suggestions.length > 0) setShowSuggestions(true);
              }}
              className="pl-12 h-12 sm:h-14 text-lg rounded-2xl border-border/50 focus-visible:border-indigo-400 focus-visible:ring-indigo-400/20 shadow-sm"
            />
            <Button
              onClick={() => handleSearch()}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-xl bg-gradient-to-r from-indigo-500 to-blue-600 text-white hover:from-indigo-600 hover:to-blue-600"
            >
              Search
            </Button>
          </div>

          {/* Suggestions Dropdown */}
          {showSuggestions && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute top-full left-0 right-0 mt-2 bg-popover border border-border rounded-2xl shadow-xl z-50 overflow-hidden"
            >
              {suggestions.map((product) => (
                <button
                  key={product.id}
                  onClick={() => handleSuggestionClick(product)}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-muted/50 transition-colors text-left"
                >
                  <div className="h-10 w-10 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                    <ProductImage src={product.images[0]} alt={product.name} className="w-full h-full" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{product.name}</p>
                    <p className="text-xs text-muted-foreground">{product.brand}</p>
                  </div>
                  <span className="text-sm font-semibold">${product.price.toLocaleString()}</span>
                </button>
              ))}
            </motion.div>
          )}
        </div>
      </motion.div>

      {/* Search History */}
      {!hasSearched && searchHistory.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
              Recent Searches
            </h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClearHistory}
              className="text-xs text-muted-foreground hover:text-foreground"
            >
              Clear History
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {searchHistory.map((item, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setQuery(item.query);
                  handleSearch(item.query);
                }}
                className="px-4 py-2 rounded-xl bg-muted/60 hover:bg-muted text-sm font-medium transition-colors"
              >
                {item.query}
              </button>
            ))}
          </div>
        </motion.div>
      )}

      {/* Search Results */}
      {hasSearched && results.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-muted-foreground">
              Found <span className="font-semibold text-foreground">{results.length}</span>{' '}
              result{results.length !== 1 ? 's' : ''} for &ldquo;{query}&rdquo;
            </p>
          </div>
          <ProductGrid products={results} columns={4} />
        </motion.div>
      )}

      {/* No Results */}
      {hasSearched && results.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <EmptyState
            icon={Search}
            title="No products found"
            description={`We couldn't find any products matching "${query}". Try different keywords or browse our categories.`}
            action={{
              label: 'Browse Categories',
              onClick: () => navigate('categories'),
            }}
          />
        </motion.div>
      )}
    </div>
  );
}

// ─── AboutPage ───────────────────────────────────────────────────────────────

export function AboutPage() {
  const navigate = useRouterStore((s) => s.navigate);

  const services = [
    {
      icon: Globe,
      title: 'Complete SaaS Websites',
      description: 'Frontend, backend, database — full-stack SaaS platforms built from scratch.',
      gradient: 'from-indigo-500 to-blue-600',
    },
    {
      icon: Code2,
      title: 'Custom Business Websites',
      description: 'Professional, scalable web presence tailored to your company\'s needs.',
      gradient: 'from-blue-500 to-cyan-500',
    },
    {
      icon: Smartphone,
      title: 'Mobile Apps',
      description: 'Cross-platform mobile applications for both Android and iOS.',
      gradient: 'from-indigo-500 to-violet-500',
    },
    {
      icon: Palette,
      title: 'UI/UX Design',
      description: 'Modern, user-friendly interfaces that are responsive and beautiful.',
      gradient: 'from-violet-500 to-purple-500',
    },
    {
      icon: Zap,
      title: 'API Integration & Real-time',
      description: 'WebSockets, AI features, third-party APIs — dynamic systems that work.',
      gradient: 'from-blue-600 to-indigo-500',
    },
    {
      icon: Server,
      title: 'Database Architecture',
      description: 'Scalable data models, optimized queries, and reliable infrastructure.',
      gradient: 'from-cyan-500 to-blue-500',
    },
  ];

  const whyMe = [
    'Full Stack ownership — from database design to live deployment',
    'SaaS architecture experience — multi-tenancy, roles, real-time systems, AI integration',
    'Production-ready code — not just tutorials or demos',
    'Independent execution — minimal supervision needed',
    'Proven track record — real apps, real users, real systems',
  ];

  const stats = [
    { label: 'Years Experience', value: '2+', icon: Award },
    { label: 'Projects Delivered', value: '15+', icon: Globe },
    { label: 'Technologies', value: '10+', icon: Code2 },
    { label: 'Client Satisfaction', value: '100%', icon: Heart },
  ];

  return (
    <div className="min-h-screen pb-16 sm:pb-24">
      {/* Hero — Developer Profile */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="relative rounded-3xl overflow-hidden mb-10 sm:mb-14"
      >
        <div className="mesh-gradient px-5 py-16 sm:px-10 sm:py-20 lg:px-16 lg:py-24 text-center text-white">
          <div className="absolute top-10 left-[10%] h-48 w-48 sm:h-64 sm:w-64 rounded-full bg-indigo-500/15 blur-3xl animate-float" />
          <div className="absolute bottom-10 right-[10%] h-40 w-40 sm:h-56 sm:w-56 rounded-full bg-blue-500/12 blur-3xl animate-float" style={{ animationDelay: '1.5s' }} />

          {/* Profile Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="relative z-10 mb-6 sm:mb-8"
          >
            <div className="relative inline-block">
              <div className="h-40 w-40 sm:h-52 sm:w-52 lg:h-64 lg:w-64 rounded-full overflow-hidden border-4 border-white/20 shadow-2xl shadow-indigo-500/30 mx-auto">
                <img
                  src="/m-sharique-sabir.webp"
                  alt="Mohammad Sharique Sabir"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-1 -right-1 h-8 w-8 sm:h-9 sm:w-9 rounded-full bg-green-500 border-4 border-[#0c0e1a] flex items-center justify-center">
                <span className="text-white text-xs font-bold">✓</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.25 }}
            className="relative z-10 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/15 border border-indigo-500/25 text-indigo-300 text-xs font-semibold tracking-wide uppercase mb-5 sm:mb-6"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-indigo-400 animate-pulse" />
            Full Stack Developer
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.35 }}
            className="relative z-10 text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight"
          >
            <span>Mohammad Sharique</span>
            <br className="hidden sm:block" />
            <span className="gradient-text"> Sabir</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.45 }}
            className="relative z-10 mt-4 sm:mt-5 text-base sm:text-lg text-white/60 max-w-2xl mx-auto leading-relaxed"
          >
            React · Next.js · Laravel Specialist
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="relative z-10 mt-2 text-sm text-white/40"
          >
            📍 Islamabad, Pakistan
          </motion.p>

          {/* Social Links */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="relative z-10 mt-6 flex items-center justify-center gap-3"
          >
            <a
              href="https://www.linkedin.com/in/m-sharique-sabir/"
              target="_blank"
              rel="noopener noreferrer"
              className="h-10 w-10 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 flex items-center justify-center transition-all duration-300"
            >
              <Linkedin className="h-4 w-4 text-white" />
            </a>
            <a
              href="https://github.com/m-sharique-sabir"
              target="_blank"
              rel="noopener noreferrer"
              className="h-10 w-10 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 flex items-center justify-center transition-all duration-300"
            >
              <Github className="h-4 w-4 text-white" />
            </a>
            <a
              href="mailto:mohammadsharique2409950@gmail.com"
              className="h-10 w-10 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 flex items-center justify-center transition-all duration-300"
            >
              <Mail className="h-4 w-4 text-white" />
            </a>
            <a
              href="https://wa.me/923392409950"
              target="_blank"
              rel="noopener noreferrer"
              className="h-10 w-10 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 flex items-center justify-center transition-all duration-300"
            >
              <Phone className="h-4 w-4 text-white" />
            </a>
          </motion.div>
        </div>
      </motion.div>

      {/* About Me */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="mb-10 sm:mb-14"
      >
        <div className="relative rounded-3xl overflow-hidden border border-border/40 bg-card">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/[0.03] via-transparent to-blue-500/[0.03]" />
          <div className="relative p-6 sm:p-10 lg:p-12">
            <div className="flex flex-col lg:flex-row lg:items-start gap-6 lg:gap-10">
              <div className="flex-shrink-0">
                <div className="h-14 w-14 sm:h-16 sm:w-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center shadow-lg shadow-indigo-500/25">
                  <Code2 className="h-7 w-7 sm:h-8 sm:w-8 text-white" />
                </div>
              </div>
              <div className="flex-1">
                <h2 className="text-2xl sm:text-3xl font-bold mb-4">About Me</h2>
                <p className="text-muted-foreground leading-relaxed text-base sm:text-lg max-w-3xl">
                  I&apos;m Mohammad Sharique, a Full Stack Developer with 2+ years of hands-on experience
                  building scalable, production-grade web applications and enterprise SaaS platforms.
                  I worked at Gigbitesoft.com, where I developed complete SaaS websites — handling
                  everything from frontend and backend to database architecture and UI/UX design.
                  I specialize in React 19, Next.js, and Laravel 13, delivering complete systems
                  from database design to pixel-perfect interfaces. I don&apos;t just build interfaces —
                  I build complete systems.
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  {['React 19', 'Next.js', 'Laravel 13', 'Full Stack', 'SaaS'].map((tag) => (
                    <span key={tag} className="px-4 py-1.5 rounded-2xl bg-indigo-500/8 border border-indigo-500/15 text-indigo-600 dark:text-indigo-400 text-xs font-semibold tracking-wide uppercase">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* What I Do — Services */}
      <motion.div
        variants={staggerContainer}
        initial="initial"
        animate="animate"
        className="mb-10 sm:mb-14"
      >
        <motion.div variants={staggerItem} className="text-center mb-8 sm:mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold">What I Do</h2>
          <p className="text-muted-foreground mt-2 text-sm sm:text-base">Complete solutions from database to deployment</p>
        </motion.div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">
          {services.map((service) => (
            <motion.div key={service.title} variants={staggerItem}>
              <div className="group relative rounded-3xl border border-border/40 bg-card p-6 sm:p-8 h-full hover-lift overflow-hidden">
                <div className={`absolute top-0 right-0 h-32 w-32 bg-gradient-to-br ${service.gradient} opacity-[0.04] rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 group-hover:opacity-[0.08] transition-opacity duration-500`} />
                <div className={`relative h-13 w-13 sm:h-14 sm:w-14 rounded-2xl bg-gradient-to-br ${service.gradient} flex items-center justify-center mb-5 shadow-lg`}>
                  <service.icon className="h-6 w-6 sm:h-7 sm:w-7 text-white" />
                </div>
                <h3 className="relative text-lg font-bold mb-2.5">{service.title}</h3>
                <p className="relative text-sm sm:text-[15px] text-muted-foreground leading-relaxed">
                  {service.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Experience */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="mb-10 sm:mb-14"
      >
        <div className="text-center mb-8 sm:mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold">Experience</h2>
          <p className="text-muted-foreground mt-2 text-sm sm:text-base">Building real products, real systems</p>
        </div>
        <div className="relative rounded-3xl overflow-hidden border border-border/40 bg-card">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/[0.03] via-transparent to-blue-500/[0.03]" />
          <div className="relative p-6 sm:p-10 lg:p-12">
            <div className="flex flex-col sm:flex-row items-start gap-5 sm:gap-6">
              <div className="h-14 w-14 sm:h-16 sm:w-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-indigo-500/25">
                <Zap className="h-7 w-7 sm:h-8 sm:w-8 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl sm:text-2xl font-bold mb-1">Full Stack Developer</h3>
                <p className="text-indigo-500 dark:text-indigo-400 font-semibold text-sm sm:text-base mb-3">
                  Gigbitesoft.com
                </p>
                <p className="text-muted-foreground leading-relaxed text-sm sm:text-base max-w-3xl">
                  2 years of experience working on production-grade web applications and SaaS platforms,
                  designing complete frontend-backend architecture, and delivering projects end-to-end.
                  Built complete SaaS products handling frontend, backend, database design, and UI/UX —
                  from initial architecture to deployment.
                </p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {['React', 'Next.js', 'Laravel', 'MySQL', 'REST APIs', 'Git', 'SaaS'].map((tech) => (
                    <span key={tech} className="px-3 py-1 rounded-xl bg-muted/60 text-xs font-medium text-muted-foreground">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Why Work With Me */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.25 }}
        className="mb-10 sm:mb-14"
      >
        <div className="text-center mb-8 sm:mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold">Why Work With Me</h2>
          <p className="text-muted-foreground mt-2 text-sm sm:text-base">What sets my work apart</p>
        </div>
        <div className="relative rounded-3xl overflow-hidden border border-border/40 bg-card">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/[0.03] via-transparent to-blue-500/[0.03]" />
          <div className="relative p-6 sm:p-10 lg:p-12">
            <div className="space-y-4">
              {whyMe.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -15 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.3 + index * 0.08 }}
                  className="flex items-start gap-4"
                >
                  <div className="h-7 w-7 rounded-xl bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center flex-shrink-0 mt-0.5 shadow-md">
                    <span className="text-white text-xs font-bold">✦</span>
                  </div>
                  <p className="text-sm sm:text-[15px] text-muted-foreground leading-relaxed">{item}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="mb-10 sm:mb-14"
      >
        <div className="relative rounded-3xl overflow-hidden border border-border/40 bg-card">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/[0.03] via-transparent to-blue-500/[0.03]" />
          <div className="relative p-6 sm:p-10 lg:p-12">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
              {stats.map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="h-12 w-12 sm:h-14 sm:w-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center mx-auto mb-3 sm:mb-4 shadow-lg shadow-indigo-500/20">
                    <stat.icon className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                  </div>
                  <p className="text-2xl sm:text-3xl lg:text-4xl font-extrabold gradient-text">{stat.value}</p>
                  <p className="text-xs sm:text-sm text-muted-foreground mt-1 font-medium">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Contact CTA */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.35 }}
      >
        <div className="relative rounded-3xl overflow-hidden mesh-gradient px-5 py-12 sm:px-10 sm:py-16 text-center text-white">
          <h2 className="text-2xl sm:text-3xl font-bold mb-3">Let&apos;s Build Something Great</h2>
          <p className="text-white/60 mb-6 sm:mb-8 max-w-lg mx-auto text-sm sm:text-base">
            Get in touch today for your website or mobile app project.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
            <Button
              onClick={() => navigate('contact')}
              className="rounded-2xl bg-gradient-to-r from-indigo-500 to-blue-600 text-white hover:from-indigo-600 hover:to-blue-700 shadow-lg shadow-indigo-500/25 px-8 sm:px-10 h-12 sm:h-13 text-sm sm:text-base btn-shine"
            >
              <MessageSquare className="h-4 w-4 mr-2" />
              Contact Me
            </Button>
            <a
              href="https://wa.me/923392409950"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-2xl border border-white/20 text-white bg-white/5 hover:bg-white/10 font-semibold px-8 sm:px-10 h-12 sm:h-13 text-sm sm:text-base transition-all duration-300 backdrop-blur-sm flex items-center justify-center"
            >
              <Phone className="h-4 w-4 mr-2" />
              WhatsApp
            </a>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

// ─── ContactPage ─────────────────────────────────────────────────────────────

export function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      toast.error('Please fill in all fields');
      return;
    }
    toast.success('Message sent!', {
      description: "We'll get back to you as soon as possible.",
    });
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  const contactInfo = [
    {
      icon: MapPin,
      title: 'Location',
      detail: 'Islamabad, Pakistan',
      gradient: 'from-indigo-500 to-blue-600',
    },
    {
      icon: Phone,
      title: 'WhatsApp',
      detail: '+92 339 2409950',
      href: 'https://wa.me/923392409950',
      gradient: 'from-blue-500 to-cyan-500',
    },
    {
      icon: Mail,
      title: 'Email',
      detail: 'mohammadsharique2409950@gmail.com',
      href: 'mailto:mohammadsharique2409950@gmail.com',
      gradient: 'from-indigo-500 to-violet-500',
    },
    {
      icon: Linkedin,
      title: 'LinkedIn',
      detail: 'linkedin.com/in/m-sharique-sabir',
      href: 'https://www.linkedin.com/in/m-sharique-sabir/',
      gradient: 'from-blue-600 to-indigo-500',
    },
    {
      icon: Github,
      title: 'GitHub',
      detail: 'github.com/m-sharique-sabir',
      href: 'https://github.com/m-sharique-sabir',
      gradient: 'from-slate-600 to-slate-800',
    },
  ];

  return (
    <div className="min-h-screen pb-16 sm:pb-24">
      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="relative rounded-3xl overflow-hidden mb-10 sm:mb-14"
      >
        <div className="mesh-gradient px-5 py-14 sm:px-10 sm:py-20 lg:px-16 lg:py-24 text-center text-white">
          <div className="absolute top-10 right-[15%] h-48 w-48 sm:h-64 sm:w-64 rounded-full bg-indigo-500/15 blur-3xl animate-float" />
          <div className="absolute bottom-10 left-[15%] h-40 w-40 sm:h-56 sm:w-56 rounded-full bg-blue-500/12 blur-3xl animate-float" style={{ animationDelay: '1.5s' }} />

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="relative z-10 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/15 border border-indigo-500/25 text-indigo-300 text-xs font-semibold tracking-wide uppercase mb-5 sm:mb-6"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-indigo-400 animate-pulse" />
            Let&apos;s Connect
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="relative z-10 text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight"
          >
            <span>Get in</span>{' '}
            <span className="gradient-text">Touch</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="relative z-10 mt-4 sm:mt-5 text-base sm:text-lg text-white/60 max-w-xl mx-auto leading-relaxed"
          >
            Have a question, feedback, or partnership idea? We&apos;d love to hear from you.
          </motion.p>
        </div>
      </motion.div>

      {/* Two-Column: Form + Info */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5 sm:gap-6 lg:gap-8 mb-10 sm:mb-14">
        {/* Contact Form — wider column */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="lg:col-span-3"
        >
          <div className="relative rounded-3xl border border-border/40 bg-card overflow-hidden h-full">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/[0.02] via-transparent to-blue-500/[0.02]" />
            <div className="relative p-5 sm:p-8 lg:p-10">
              <h2 className="text-xl sm:text-2xl font-bold mb-1">Send a Message</h2>
              <p className="text-sm text-muted-foreground mb-6 sm:mb-8">We typically respond within 24 hours.</p>
              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                  <div>
                    <label className="text-sm font-semibold mb-2 block">Name</label>
                    <Input
                      placeholder="Your name"
                      value={formData.name}
                      onChange={(e) => handleChange('name', e.target.value)}
                      className="h-12 rounded-2xl bg-muted/30 border-border/40 focus-visible:border-indigo-400 focus-visible:ring-indigo-400/20"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-semibold mb-2 block">Email</label>
                    <Input
                      type="email"
                      placeholder="you@example.com"
                      value={formData.email}
                      onChange={(e) => handleChange('email', e.target.value)}
                      className="h-12 rounded-2xl bg-muted/30 border-border/40 focus-visible:border-indigo-400 focus-visible:ring-indigo-400/20"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-semibold mb-2 block">Subject</label>
                  <Input
                    placeholder="What is this about?"
                    value={formData.subject}
                    onChange={(e) => handleChange('subject', e.target.value)}
                    className="h-12 rounded-2xl bg-muted/30 border-border/40 focus-visible:border-indigo-400 focus-visible:ring-indigo-400/20"
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold mb-2 block">Message</label>
                  <textarea
                    placeholder="Tell us more..."
                    value={formData.message}
                    onChange={(e) => handleChange('message', e.target.value)}
                    rows={5}
                    className="border-input placeholder:text-muted-foreground focus-visible:border-indigo-400 focus-visible:ring-indigo-400/20 flex w-full rounded-2xl border bg-muted/30 px-4 py-3 text-base shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] md:text-sm resize-none min-h-[120px]"
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full sm:w-auto rounded-2xl bg-gradient-to-r from-indigo-500 to-blue-600 text-white hover:from-indigo-600 hover:to-blue-700 shadow-lg shadow-indigo-500/20 px-8 sm:px-10 h-12 sm:h-13 text-sm sm:text-base btn-shine"
                >
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Send Message
                </Button>
              </form>
            </div>
          </div>
        </motion.div>

        {/* Contact Info — narrower column */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="lg:col-span-2 flex flex-col gap-4 sm:gap-5"
        >
          {contactInfo.map((info, index) => (
            <motion.div
              key={info.title}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3 + index * 0.08 }}
            >
              <div className="group rounded-3xl border border-border/40 bg-card p-5 sm:p-6 hover-lift overflow-hidden relative">
                <div className={`absolute top-0 right-0 h-24 w-24 bg-gradient-to-br ${info.gradient} opacity-[0.04] rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 group-hover:opacity-[0.08] transition-opacity duration-500`} />
                <div className="relative flex items-start gap-4">
                  <div className={`h-12 w-12 rounded-2xl bg-gradient-to-br ${info.gradient} flex items-center justify-center flex-shrink-0 shadow-lg`}>
                    <info.icon className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm sm:text-base mb-1">{info.title}</h3>
                    {'href' in info && info.href ? (
                      <a
                        href={info.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-indigo-500 dark:text-indigo-400 hover:underline leading-relaxed break-all"
                      >
                        {info.detail}
                      </a>
                    ) : (
                      <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                        {info.detail}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Map Placeholder */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <div className="relative rounded-3xl overflow-hidden border border-border/40 bg-card">
          <div className="h-64 sm:h-80 lg:h-96 flex flex-col items-center justify-center relative">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/[0.03] via-transparent to-blue-500/[0.03]" />
            <div className="relative flex flex-col items-center">
              <div className="h-14 w-14 sm:h-16 sm:w-16 rounded-2xl bg-gradient-to-br from-indigo-500/10 to-blue-500/10 border border-indigo-500/15 flex items-center justify-center mb-4">
                <MapPin className="h-7 w-7 sm:h-8 sm:w-8 text-indigo-500 dark:text-indigo-400" />
              </div>
              <p className="text-base sm:text-lg font-bold mb-1">Islamabad</p>
              <p className="text-sm text-muted-foreground">Pakistan</p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

// ─── FAQPage ─────────────────────────────────────────────────────────────────

export function FAQPage() {
  const navigate = useRouterStore((s) => s.navigate);

  const faqItems = [
    {
      question: 'How long does shipping take?',
      answer:
        'Standard shipping typically takes 3-5 business days within the continental US. Expedited shipping (2-day) and overnight options are also available at checkout. International orders may take 7-14 business days depending on the destination and customs processing.',
    },
    {
      question: 'What is your return policy?',
      answer:
        'We offer a 30-day return policy on all unused items in their original packaging. Simply initiate a return through your account dashboard, and we\'ll provide a prepaid shipping label. Refunds are processed within 5-7 business days after we receive the returned item.',
    },
    {
      question: 'What payment methods do you accept?',
      answer:
        'We accept all major credit cards (Visa, MasterCard, American Express, Discover), debit cards, PayPal, Apple Pay, Google Pay, and Shop Pay. We also offer installment payment options through Klarna and Afterpay for qualifying orders.',
    },
    {
      question: 'How do I create an account?',
      answer:
        'Creating an account is easy! Click the "Register" button in the top navigation, fill in your name, email, and create a password. You\'ll receive a confirmation email to verify your account. Once verified, you can start shopping, save your preferences, and track your orders.',
    },
    {
      question: 'How can I track my order?',
      answer:
        'Once your order ships, you\'ll receive an email with a tracking number and a link to the carrier\'s website. You can also track your order by logging into your account and visiting the "Orders" section, where you\'ll find real-time status updates for all your purchases.',
    },
    {
      question: 'Do you offer international shipping?',
      answer:
        'Yes! We ship to over 50 countries worldwide. International shipping rates and delivery times vary by destination. You can check the available shipping options and costs during checkout by entering your delivery address. Please note that customs duties and taxes may apply.',
    },
    {
      question: 'Can I cancel or modify my order?',
      answer:
        'You can cancel or modify your order within 1 hour of placing it, provided it hasn\'t entered the processing stage. To make changes, go to your "Orders" page and click "Modify Order." If the option isn\'t available, please contact our support team immediately and we\'ll do our best to help.',
    },
    {
      question: 'How do I contact customer support?',
      answer:
        'Our customer support team is available 24/7 to assist you. You can reach us via email at hello@luxestore.com, by phone at +1 (555) 123-4567, or through the contact form on our Contact page. For urgent matters, our live chat is available during business hours.',
    },
    {
      question: 'Are your products authentic?',
      answer:
        'Absolutely. We source all our products directly from authorized distributors and brand partners. Every item comes with an authenticity guarantee. If you ever have concerns about a product\'s authenticity, please contact us immediately and we\'ll investigate.',
    },
    {
      question: 'Do you offer gift wrapping?',
      answer:
        'Yes! During checkout, you can select the gift wrapping option for $4.99 per item. We offer elegant wrapping with a personalized message card. Gift receipts are also available so the recipient can exchange the item without seeing the price.',
    },
  ];

  return (
    <div className="min-h-screen pb-12">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <div className="flex items-center gap-3 mb-2">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-indigo-100 to-blue-100 dark:from-indigo-950 dark:to-blue-950 flex items-center justify-center">
            <HelpCircle className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Frequently Asked Questions</h1>
        </div>
        <p className="text-muted-foreground mt-2">
          Find answers to the most common questions about our products and services.
        </p>
      </motion.div>

      {/* FAQ Accordion */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="mb-12"
      >
        <Card className="rounded-2xl border-border/50 shadow-sm">
          <CardContent className="p-4 sm:p-6">
            <Accordion type="single" collapsible className="w-full">
              {faqItems.map((item, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-left text-sm sm:text-base font-medium hover:no-underline hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                    {item.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed text-sm sm:text-base">
                    {item.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>
      </motion.div>

      {/* Still Have Questions CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card className="rounded-2xl border-border/50 shadow-sm bg-gradient-to-br from-muted/50 to-muted">
          <CardContent className="p-8 sm:p-12 text-center">
            <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center mx-auto mb-4">
              <MessageSquare className="h-7 w-7 text-white" />
            </div>
            <h2 className="text-xl font-bold mb-2">Still have questions?</h2>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Can&apos;t find what you&apos;re looking for? Our team is here to help with any questions you may have.
            </p>
            <Button
              onClick={() => navigate('contact')}
              className="rounded-xl bg-gradient-to-r from-indigo-500 to-blue-600 text-white hover:from-indigo-600 hover:to-blue-600 shadow-lg px-8"
            >
              <Mail className="h-4 w-4 mr-2" />
              Contact Us
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

// ─── NotFoundPage ────────────────────────────────────────────────────────────

export function NotFoundPage() {
  const navigate = useRouterStore((s) => s.navigate);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="text-center px-4 py-16"
      >
        {/* Large 404 Text */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
        >
          <h1
            className="text-7xl sm:text-8xl lg:text-[10rem] font-extrabold bg-gradient-to-br from-indigo-500 via-blue-600 to-indigo-600 bg-clip-text text-transparent leading-none"
          >
            404
          </h1>
        </motion.div>

        {/* Subtitle */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <h2 className="text-2xl sm:text-3xl font-bold mt-6 mb-3">Page Not Found</h2>
          <p className="text-muted-foreground max-w-md mx-auto mb-8">
            The page you&apos;re looking for doesn&apos;t exist or has been moved.
            Let&apos;s get you back on track.
          </p>
        </motion.div>

        {/* Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-3"
        >
          <Button
            onClick={() => navigate('home')}
            className="rounded-xl bg-gradient-to-r from-indigo-500 to-blue-600 text-white hover:from-indigo-600 hover:to-blue-600 shadow-lg px-8 h-12"
          >
            <Home className="h-4 w-4 mr-2" />
            Go Home
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate('shop')}
            className="rounded-xl px-8 h-12 border-border/50"
          >
            Browse Shop
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
}
