'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, ShoppingBag, Star, Eye } from 'lucide-react';
import { useRouterStore, useCartStore, useWishlistStore } from '@/stores';
import { Product } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

function ProductImage({ src, alt, className = '' }: { src: string; alt: string; className?: string }) {
  const [error, setError] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const gradients = [
    'from-indigo-200 to-blue-200',
    'from-blue-200 to-cyan-200',
    'from-emerald-200 to-teal-200',
    'from-amber-200 to-orange-200',
    'from-rose-200 to-pink-200',
    'from-indigo-200 to-purple-200',
  ];
  const gradientIndex = alt.length % gradients.length;

  if (error || !src) {
    return (
      <div className={`bg-gradient-to-br ${gradients[gradientIndex]} flex items-center justify-center ${className}`}>
        <ShoppingBag className="h-8 w-8 text-white/60" />
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      {!loaded && (
        <div className={`absolute inset-0 bg-gradient-to-br ${gradients[gradientIndex]} animate-pulse`} />
      )}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        className={`w-full h-full object-cover transition-opacity duration-300 ${loaded ? 'opacity-100' : 'opacity-0'}`}
        onLoad={() => setLoaded(true)}
        onError={() => setError(true)}
        loading="lazy"
      />
    </div>
  );
}

export function Rating({ rating, count, size = 'sm' }: { rating: number; count?: number; size?: 'sm' | 'md' | 'lg' }) {
  const sizeClasses = { sm: 'h-3.5 w-3.5', md: 'h-4 w-4', lg: 'h-5 w-5' };
  const textClasses = { sm: 'text-xs', md: 'text-sm', lg: 'text-base' };

  return (
    <div className="flex items-center gap-1">
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`${sizeClasses[size]} ${
              star <= Math.round(rating) ? 'fill-amber-400 text-amber-400' : 'fill-muted text-muted'
            }`}
          />
        ))}
      </div>
      {count !== undefined && (
        <span className={`${textClasses[size]} text-muted-foreground ml-1`}>({count})</span>
      )}
    </div>
  );
}

export function ProductCard({ product, index = 0 }: { product: Product; index?: number }) {
  const { navigate } = useRouterStore();
  const { addItem } = useCartStore();
  const { toggleItem, isInWishlist } = useWishlistStore();
  const inWishlist = isInWishlist(product.id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addItem(product.id);
    toast.success('Added to cart', { description: product.name });
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleItem(product.id);
    toast.success(inWishlist ? 'Removed from wishlist' : 'Added to wishlist', {
      description: product.name,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.06, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="group cursor-pointer"
      onClick={() => navigate('product', { id: product.id })}
    >
      <div className="relative rounded-3xl overflow-hidden bg-card border border-border/40 hover:border-border/80 transition-all duration-500 hover-lift shadow-premium">
        {/* Image */}
        <div className="relative aspect-square overflow-hidden bg-muted">
          <ProductImage src={product.images[0]} alt={product.name} className="w-full h-full transition-transform duration-700 ease-out group-hover:scale-110" />

          {/* Overlay gradient on hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5">
            {product.discount > 0 && (
              <span className="px-2.5 py-1 rounded-xl bg-red-500/90 backdrop-blur-sm text-white text-xs font-semibold shadow-lg shadow-red-500/20">
                -{product.discount}%
              </span>
            )}
            {product.isNew && (
              <span className="px-2.5 py-1 rounded-xl bg-emerald-500/90 backdrop-blur-sm text-white text-xs font-semibold shadow-lg shadow-emerald-500/20">
                New
              </span>
            )}
            {product.bestSeller && (
              <span className="px-2.5 py-1 rounded-xl bg-amber-500/90 backdrop-blur-sm text-white text-xs font-semibold shadow-lg shadow-amber-500/20">
                Best Seller
              </span>
            )}
          </div>

          {/* Quick Actions - always visible on mobile, hover on desktop */}
          <div className="absolute top-3 right-3 flex flex-col gap-2 sm:opacity-0 sm:group-hover:opacity-100 transition-all duration-400 sm:translate-x-3 sm:group-hover:translate-x-0">
            <button
              onClick={handleWishlist}
              className={`h-9 w-9 sm:h-10 sm:w-10 rounded-2xl flex items-center justify-center backdrop-blur-md transition-all duration-300 shadow-lg ${
                inWishlist
                  ? 'bg-red-500 text-white shadow-red-500/30 scale-110'
                  : 'bg-white/80 text-gray-800 hover:bg-white hover:scale-110 shadow-black/10'
              }`}
              aria-label={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
            >
              <Heart className={`h-4 w-4 sm:h-[18px] sm:w-[18px] ${inWishlist ? 'fill-current' : ''}`} />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); navigate('product', { id: product.id }); }}
              className="h-9 w-9 sm:h-10 sm:w-10 rounded-2xl bg-white/80 text-gray-800 hover:bg-white hover:scale-110 flex items-center justify-center backdrop-blur-md transition-all duration-300 shadow-lg shadow-black/10"
              aria-label="Quick view"
            >
              <Eye className="h-4 w-4 sm:h-[18px] sm:w-[18px]" />
            </button>
          </div>

          {/* Add to Cart - always visible on mobile, hover on desktop */}
          <div className="absolute bottom-3 left-3 right-3 sm:bottom-4 sm:left-4 sm:right-4 sm:opacity-0 sm:group-hover:opacity-100 transition-all duration-400 sm:translate-y-3 sm:group-hover:translate-y-0">
            <Button
              onClick={handleAddToCart}
              className="w-full rounded-2xl bg-gray-900/90 dark:bg-white/90 text-white dark:text-gray-900 hover:bg-gray-900 dark:hover:bg-white backdrop-blur-md font-semibold shadow-xl h-10 sm:h-11 text-sm btn-shine transition-all duration-300"
              size="sm"
            >
              <ShoppingBag className="h-4 w-4 mr-2" /> Add to Cart
            </Button>
          </div>
        </div>

        {/* Info */}
        <div className="p-4 sm:p-5">
          <p className="text-xs text-muted-foreground mb-1.5 font-medium tracking-wide uppercase">{product.brand}</p>
          <h3 className="font-semibold text-sm leading-snug mb-2.5 line-clamp-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors duration-300">
            {product.name}
          </h3>
          <Rating rating={product.rating} count={product.reviewCount} />
          <div className="flex items-baseline gap-2.5 mt-3">
            <span className="font-bold text-xl tracking-tight">${product.price.toLocaleString()}</span>
            {product.discount > 0 && (
              <span className="text-sm text-muted-foreground line-through decoration-1">
                ${product.originalPrice.toLocaleString()}
              </span>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export function ProductGrid({ products, columns = 4 }: { products: Product[]; columns?: 2 | 3 | 4 }) {
  const colsClasses = {
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
  };

  return (
    <div className={`grid ${colsClasses[columns]} gap-4 lg:gap-6`}>
      {products.map((product, index) => (
        <ProductCard key={product.id} product={product} index={index} />
      ))}
    </div>
  );
}

export function EmptyState({ icon: Icon, title, description, action }: { icon: React.ElementType; title: string; description: string; action?: { label: string; onClick: () => void } }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="h-16 w-16 rounded-2xl bg-muted flex items-center justify-center mb-4">
        <Icon className="h-8 w-8 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground max-w-md mb-6">{description}</p>
      {action && (
        <Button onClick={action.onClick} className="rounded-xl">
          {action.label}
        </Button>
      )}
    </div>
  );
}

export function SkeletonCard() {
  return (
    <div className="rounded-2xl overflow-hidden bg-card border border-border/50">
      <div className="aspect-square bg-muted animate-pulse" />
      <div className="p-4 space-y-3">
        <div className="h-3 w-16 bg-muted rounded animate-pulse" />
        <div className="h-4 w-3/4 bg-muted rounded animate-pulse" />
        <div className="h-3 w-24 bg-muted rounded animate-pulse" />
        <div className="h-5 w-20 bg-muted rounded animate-pulse" />
      </div>
    </div>
  );
}

export { ProductImage };
