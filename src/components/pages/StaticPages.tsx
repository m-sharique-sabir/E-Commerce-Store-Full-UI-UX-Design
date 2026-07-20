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
} from 'lucide-react';
import { useRouterStore, useSearchStore } from '@/stores';
import {
  getStoredCategories,
  getStoredProducts,
  getSearchHistory,
  clearSearchHistory,
} from '@/lib/storage';
import {
  ProductCard,
  ProductGrid,
  Rating,
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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
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
    <div className="min-h-screen pb-12">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold tracking-tight">Browse Categories</h1>
        <p className="text-muted-foreground mt-2">
          Explore our wide range of product categories
        </p>
      </motion.div>

      {/* Categories Grid */}
      <motion.div
        variants={staggerContainer}
        initial="initial"
        animate="animate"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6"
      >
        {categories.map((category, index) => (
          <motion.div
            key={category.id}
            variants={staggerItem}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            className="cursor-pointer"
            onClick={() => navigate('shop', { category: category.slug })}
          >
            <div className="rounded-2xl overflow-hidden bg-card border border-border/50 hover:border-border hover:shadow-lg transition-all duration-300">
              {/* Category Image */}
              <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                <ProductImage
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full"
                />
                {/* Product Count Badge */}
                <div className="absolute top-3 right-3 px-2.5 py-1 rounded-xl bg-background/80 backdrop-blur-sm text-xs font-semibold">
                  {category.productCount} items
                </div>
              </div>

              {/* Category Info */}
              <div className="p-4">
                <h3 className="font-semibold text-base mb-1 group-hover:text-violet-500 transition-colors">
                  {category.name}
                </h3>
                <p className="text-sm text-muted-foreground line-clamp-2">
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
              className="pl-12 h-14 text-lg rounded-2xl border-border/50 focus-visible:border-violet-400 focus-visible:ring-violet-400/20 shadow-sm"
            />
            <Button
              onClick={() => handleSearch()}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-xl bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white hover:from-violet-600 hover:to-fuchsia-600"
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

  const values = [
    {
      icon: Award,
      title: 'Quality',
      description:
        'We handpick every product to ensure it meets the highest standards of quality and craftsmanship.',
    },
    {
      icon: Globe,
      title: 'Innovation',
      description:
        'We stay ahead of trends, constantly sourcing the latest and most innovative products from around the world.',
    },
    {
      icon: Heart,
      title: 'Customer First',
      description:
        'Our customers are at the heart of everything we do. We strive to exceed expectations with every interaction.',
    },
  ];

  const team = [
    { name: 'Sarah Chen', role: 'CEO & Founder', color: 'from-violet-400 to-fuchsia-400' },
    { name: 'James Miller', role: 'Head of Product', color: 'from-emerald-400 to-teal-400' },
    { name: 'Aisha Patel', role: 'Creative Director', color: 'from-amber-400 to-orange-400' },
  ];

  const stats = [
    { label: 'Products', value: '100+', icon: Award },
    { label: 'Customers', value: '50K+', icon: Users },
    { label: 'Satisfaction', value: '99%', icon: Heart },
    { label: 'Support', value: '24/7', icon: Clock },
  ];

  return (
    <div className="min-h-screen pb-12">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="relative rounded-3xl overflow-hidden mb-12"
      >
        <div className="bg-gradient-to-br from-violet-500 via-fuchsia-500 to-pink-500 px-8 py-16 sm:px-16 sm:py-24 text-center text-white">
          <motion.h1
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4"
          >
            About Luxe
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-lg sm:text-xl text-white/80 max-w-2xl mx-auto"
          >
            Curating the world&apos;s finest products for discerning customers who appreciate quality, style, and innovation.
          </motion.p>
        </div>
      </motion.div>

      {/* Mission Section */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="mb-12"
      >
        <Card className="rounded-2xl border-border/50 shadow-sm">
          <CardContent className="p-6 sm:p-8">
            <div className="flex items-start gap-4">
              <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center flex-shrink-0">
                <Globe className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold mb-3">Our Mission</h2>
                <p className="text-muted-foreground leading-relaxed">
                  At Luxe, we believe everyone deserves access to premium products that enhance their daily lives.
                  Our mission is to bridge the gap between exceptional craftsmanship and the modern consumer,
                  making luxury accessible without compromise. We partner with the world&apos;s finest brands and
                  artisans to bring you a curated collection that reflects quality, innovation, and timeless elegance.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Values Section */}
      <motion.div
        variants={staggerContainer}
        initial="initial"
        animate="animate"
        className="mb-12"
      >
        <motion.h2
          variants={staggerItem}
          className="text-2xl font-bold mb-6 text-center"
        >
          Our Values
        </motion.h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 lg:gap-6">
          {values.map((value) => (
            <motion.div key={value.title} variants={staggerItem}>
              <Card className="rounded-2xl border-border/50 shadow-sm h-full hover:shadow-md transition-shadow">
                <CardContent className="p-6 text-center">
                  <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-violet-100 to-fuchsia-100 dark:from-violet-950 dark:to-fuchsia-950 flex items-center justify-center mx-auto mb-4">
                    <value.icon className="h-7 w-7 text-violet-600 dark:text-violet-400" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{value.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {value.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Team Section */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="mb-12"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Meet Our Team</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 lg:gap-6">
          {team.map((member, index) => (
            <motion.div
              key={member.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
            >
              <Card className="rounded-2xl border-border/50 shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-6 text-center">
                  <div
                    className={`h-20 w-20 rounded-full bg-gradient-to-br ${member.color} mx-auto mb-4 flex items-center justify-center`}
                  >
                    <span className="text-2xl font-bold text-white">
                      {member.name
                        .split(' ')
                        .map((n) => n[0])
                        .join('')}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold">{member.name}</h3>
                  <p className="text-sm text-muted-foreground">{member.role}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Stats Section */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        <Card className="rounded-2xl border-border/50 shadow-sm bg-gradient-to-br from-muted/50 to-muted">
          <CardContent className="p-6 sm:p-8">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
              {stats.map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center mx-auto mb-3">
                    <stat.icon className="h-6 w-6 text-white" />
                  </div>
                  <p className="text-2xl sm:text-3xl font-bold">{stat.value}</p>
                  <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
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
      title: 'Address',
      detail: '123 Commerce Street, Suite 456\nNew York, NY 10001',
    },
    {
      icon: Phone,
      title: 'Phone',
      detail: '+1 (555) 123-4567',
    },
    {
      icon: Mail,
      title: 'Email',
      detail: 'hello@luxestore.com',
    },
    {
      icon: Clock,
      title: 'Business Hours',
      detail: 'Mon - Fri: 9:00 AM - 6:00 PM\nSat - Sun: 10:00 AM - 4:00 PM',
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
        <h1 className="text-3xl font-bold tracking-tight">Get in Touch</h1>
        <p className="text-muted-foreground mt-2">
          Have a question or feedback? We&apos;d love to hear from you.
        </p>
      </motion.div>

      {/* Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 mb-8">
        {/* Contact Form */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card className="rounded-2xl border-border/50 shadow-sm h-full">
            <CardHeader>
              <CardTitle className="text-lg">Send us a message</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Name</label>
                  <Input
                    placeholder="Your name"
                    value={formData.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    className="rounded-xl"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Email</label>
                  <Input
                    type="email"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    className="rounded-xl"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Subject</label>
                  <Input
                    placeholder="What is this about?"
                    value={formData.subject}
                    onChange={(e) => handleChange('subject', e.target.value)}
                    className="rounded-xl"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Message</label>
                  <textarea
                    placeholder="Tell us more..."
                    value={formData.message}
                    onChange={(e) => handleChange('message', e.target.value)}
                    rows={5}
                    className="border-input placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 flex field-sizing-content min-h-16 w-full rounded-xl border bg-transparent px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] md:text-sm resize-none"
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full rounded-xl bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white hover:from-violet-600 hover:to-fuchsia-600 shadow-lg"
                >
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Send Message
                </Button>
              </form>
            </CardContent>
          </Card>
        </motion.div>

        {/* Contact Info */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="space-y-4"
        >
          {contactInfo.map((info, index) => (
            <motion.div
              key={info.title}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3 + index * 0.08 }}
            >
              <Card className="rounded-2xl border-border/50 shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-5">
                  <div className="flex items-start gap-4">
                    <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-violet-100 to-fuchsia-100 dark:from-violet-950 dark:to-fuchsia-950 flex items-center justify-center flex-shrink-0">
                      <info.icon className="h-5 w-5 text-violet-600 dark:text-violet-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-sm mb-1">{info.title}</h3>
                      <p className="text-sm text-muted-foreground whitespace-pre-line">
                        {info.detail}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
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
        <div className="h-64 rounded-2xl bg-muted flex flex-col items-center justify-center border border-border/50">
          <MapPin className="h-10 w-10 text-muted-foreground mb-3" />
          <p className="text-sm text-muted-foreground font-medium">Map View</p>
          <p className="text-xs text-muted-foreground/60 mt-1">123 Commerce Street, New York</p>
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
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-violet-100 to-fuchsia-100 dark:from-violet-950 dark:to-fuchsia-950 flex items-center justify-center">
            <HelpCircle className="h-5 w-5 text-violet-600 dark:text-violet-400" />
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
                  <AccordionTrigger className="text-left text-sm sm:text-base font-medium hover:no-underline hover:text-violet-600 dark:hover:text-violet-400 transition-colors">
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
            <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center mx-auto mb-4">
              <MessageSquare className="h-7 w-7 text-white" />
            </div>
            <h2 className="text-xl font-bold mb-2">Still have questions?</h2>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Can&apos;t find what you&apos;re looking for? Our team is here to help with any questions you may have.
            </p>
            <Button
              onClick={() => navigate('contact')}
              className="rounded-xl bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white hover:from-violet-600 hover:to-fuchsia-600 shadow-lg px-8"
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
            className="text-8xl sm:text-9xl lg:text-[12rem] font-extrabold bg-gradient-to-br from-violet-500 via-fuchsia-500 to-pink-500 bg-clip-text text-transparent leading-none"
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
            className="rounded-xl bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white hover:from-violet-600 hover:to-fuchsia-600 shadow-lg px-8 h-12"
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
