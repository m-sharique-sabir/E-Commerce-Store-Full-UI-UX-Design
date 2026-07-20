'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, TrendingUp, Truck, Shield, RotateCcw, HeadphonesIcon } from 'lucide-react';
import { useRouterStore, useCartStore, useDataStore } from '@/stores';
import { getStoredCategories, getStoredProducts } from '@/lib/storage';
import { ProductCard, Rating, ProductImage } from '@/components/shared';
import { Button } from '@/components/ui/button';
import { Product } from '@/lib/types';

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

export function HomePage() {
  const navigate = useRouterStore((s) => s.navigate);

  const products: Product[] =
    typeof window !== 'undefined' ? getStoredProducts() : [];
  const categories =
    typeof window !== 'undefined' ? getStoredCategories() : [];

  const featuredProducts = products.filter((p) => p.featured).slice(0, 8);
  const bestSellerProducts = products.filter((p) => p.bestSeller).slice(0, 8);
  const newArrivalProducts = products.filter((p) => p.isNew).slice(0, 4);

  return (
    <div className="min-h-screen">
      {/* ──────────────── Hero Section ──────────────── */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-500 to-fuchsia-500" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.15),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(255,255,255,0.1),transparent_60%)]" />

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8 lg:py-36 text-center"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="inline-flex items-center gap-2 rounded-full bg-white/20 backdrop-blur-sm px-4 py-1.5 mb-6 text-sm font-medium text-white"
          >
            <Sparkles className="h-4 w-4" />
            New Collection 2025
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-4xl sm:text-5xl lg:text-7xl font-bold text-white tracking-tight leading-tight"
          >
            Discover Premium
            <br />
            Products
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.45 }}
            className="mx-auto mt-6 max-w-2xl text-lg sm:text-xl text-white/85 leading-relaxed"
          >
            Curated collection of exceptional items from the world&apos;s finest
            brands
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Button
              size="lg"
              onClick={() => navigate('shop')}
              className="rounded-xl bg-white text-violet-600 hover:bg-white/90 font-semibold px-8 h-12 text-base shadow-lg shadow-violet-700/30"
            >
              Shop Now
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => navigate('categories')}
              className="rounded-xl border-white/40 text-white hover:bg-white/10 font-semibold px-8 h-12 text-base backdrop-blur-sm"
            >
              Explore Categories
            </Button>
          </motion.div>
        </motion.div>
      </section>

      {/* ──────────────── Category Showcase ──────────────── */}
      <motion.section
        {...fadeInUp}
        className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 lg:py-24"
      >
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
            Shop by Category
          </h2>
          <p className="mt-3 text-muted-foreground text-lg">
            Browse our wide range of product categories
          </p>
        </div>

        <motion.div
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: '-50px' }}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6"
        >
          {categories.slice(0, 8).map((category) => (
            <motion.div
              key={category.id}
              variants={fadeInUp}
              onClick={() => navigate('shop', { category: category.slug })}
              className="group cursor-pointer rounded-2xl overflow-hidden bg-card border border-border/50 hover:border-border hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <ProductImage
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h3 className="font-semibold text-white text-base sm:text-lg leading-tight">
                    {category.name}
                  </h3>
                  <p className="text-white/75 text-xs sm:text-sm mt-0.5 line-clamp-1">
                    {category.description}
                  </p>
                  <span className="inline-flex items-center gap-1 text-xs text-white/60 mt-1">
                    {category.productCount} products
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </motion.section>

      {/* ──────────────── Featured Products ──────────────── */}
      <motion.section
        {...fadeInUp}
        className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 lg:py-24"
      >
        <div className="flex items-center justify-between mb-10">
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
              Featured Collection
            </h2>
            <p className="mt-2 text-muted-foreground">
              Hand-picked products just for you
            </p>
          </div>
          <Button
            variant="ghost"
            onClick={() => navigate('shop')}
            className="group rounded-xl text-muted-foreground hover:text-foreground"
          >
            View All
            <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>
        </div>

        {featuredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6">
            {featuredProducts.map((product, index) => (
              <ProductCard
                key={product.id}
                product={product}
                index={index}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 text-muted-foreground">
            No featured products available yet.
          </div>
        )}
      </motion.section>

      {/* ──────────────── Best Sellers ──────────────── */}
      <motion.section
        {...fadeInUp}
        className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 lg:py-24"
      >
        <div className="flex items-center justify-between mb-10">
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight flex items-center gap-3">
              <TrendingUp className="h-8 w-8 text-amber-500" />
              Best Sellers
            </h2>
            <p className="mt-2 text-muted-foreground">
              Our most popular products loved by customers
            </p>
          </div>
          <Button
            variant="ghost"
            onClick={() => navigate('shop')}
            className="group rounded-xl text-muted-foreground hover:text-foreground"
          >
            View All
            <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>
        </div>

        {bestSellerProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6">
            {bestSellerProducts.map((product, index) => (
              <ProductCard
                key={product.id}
                product={product}
                index={index}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 text-muted-foreground">
            No best sellers available yet.
          </div>
        )}
      </motion.section>

      {/* ──────────────── Promo Banner ──────────────── */}
      <motion.section
        {...fadeInUp}
        className="relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900 to-slate-800" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(139,92,246,0.15),transparent_70%)]" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 lg:py-24 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-flex items-center gap-2 rounded-full bg-amber-500/20 backdrop-blur-sm px-4 py-1.5 mb-6 text-sm font-semibold text-amber-400 border border-amber-500/30">
              <Sparkles className="h-4 w-4" />
              Limited Time Offer
            </span>

            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tight">
              Up to{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-400">
                40% Off
              </span>
            </h2>

            <p className="mt-4 text-lg text-slate-300 max-w-xl mx-auto">
              Don&apos;t miss out on incredible deals across all categories.
              Shop now before they&apos;re gone!
            </p>

            <Button
              size="lg"
              onClick={() => navigate('shop', { sale: 'true' })}
              className="mt-8 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold px-8 h-12 text-base shadow-lg shadow-amber-500/25"
            >
              Shop the Sale
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </motion.div>
        </div>
      </motion.section>

      {/* ──────────────── New Arrivals ──────────────── */}
      <motion.section
        {...fadeInUp}
        className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 lg:py-24"
      >
        <div className="flex items-center justify-between mb-10">
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight flex items-center gap-3">
              <Sparkles className="h-8 w-8 text-emerald-500" />
              New Arrivals
            </h2>
            <p className="mt-2 text-muted-foreground">
              Fresh drops and latest additions
            </p>
          </div>
          <Button
            variant="ghost"
            onClick={() => navigate('shop')}
            className="group rounded-xl text-muted-foreground hover:text-foreground"
          >
            View All
            <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>
        </div>

        {newArrivalProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            {newArrivalProducts.map((product, index) => (
              <ProductCard
                key={product.id}
                product={product}
                index={index}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 text-muted-foreground">
            No new arrivals available yet.
          </div>
        )}
      </motion.section>

      {/* ──────────────── Features Bar ──────────────── */}
      <section className="border-t bg-muted/30">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 lg:py-16"
        >
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            <FeatureItem
              icon={Truck}
              title="Free Shipping"
              description="On orders over $100"
            />
            <FeatureItem
              icon={Shield}
              title="Secure Payment"
              description="100% secure checkout"
            />
            <FeatureItem
              icon={RotateCcw}
              title="Easy Returns"
              description="30-day return policy"
            />
            <FeatureItem
              icon={HeadphonesIcon}
              title="24/7 Support"
              description="Dedicated help center"
            />
          </div>
        </motion.div>
      </section>
    </div>
  );
}

/* ─── Helper Component ─── */

function FeatureItem({
  icon: Icon,
  title,
  description,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
}) {
  return (
    <div className="flex flex-col items-center text-center gap-3">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500/10 to-fuchsia-500/10 text-violet-500 shrink-0">
        <Icon className="h-7 w-7" />
      </div>
      <div>
        <h3 className="font-semibold text-base">{title}</h3>
        <p className="text-sm text-muted-foreground mt-0.5">{description}</p>
      </div>
    </div>
  );
}
