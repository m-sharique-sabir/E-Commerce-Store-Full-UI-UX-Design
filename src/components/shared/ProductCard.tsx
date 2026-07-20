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
    'from-violet-200 to-fuchsia-200',
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
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="group cursor-pointer"
      onClick={() => navigate('product', { id: product.id })}
    >
      <div className="relative rounded-2xl overflow-hidden bg-card border border-border/50 hover:border-border hover:shadow-lg transition-all duration-300">
        {/* Image */}
        <div className="relative aspect-square overflow-hidden bg-muted">
          <ProductImage src={product.images[0]} alt={product.name} className="w-full h-full" />

          {/* Overlay Actions */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300" />

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5">
            {product.discount > 0 && (
              <span className="px-2 py-0.5 rounded-lg bg-destructive text-destructive-foreground text-xs font-semibold">
                -{product.discount}%
              </span>
            )}
            {product.isNew && (
              <span className="px-2 py-0.5 rounded-lg bg-emerald-500 text-white text-xs font-semibold">
                New
              </span>
            )}
            {product.bestSeller && (
              <span className="px-2 py-0.5 rounded-lg bg-amber-500 text-white text-xs font-semibold">
                Best Seller
              </span>
            )}
          </div>

          {/* Quick Actions - always visible on mobile, hover on desktop */}
          <div className="absolute top-3 right-3 flex flex-col gap-2 sm:opacity-0 sm:group-hover:opacity-100 transition-all duration-300 sm:translate-x-2 sm:group-hover:translate-x-0">
            <button
              onClick={handleWishlist}
              className={`h-8 w-8 sm:h-9 sm:w-9 rounded-xl flex items-center justify-center backdrop-blur-sm transition-all ${
                inWishlist
                  ? 'bg-destructive text-destructive-foreground'
                  : 'bg-background/80 text-foreground hover:bg-background'
              }`}
              aria-label={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
            >
              <Heart className={`h-3.5 w-3.5 sm:h-4 sm:w-4 ${inWishlist ? 'fill-current' : ''}`} />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); navigate('product', { id: product.id }); }}
              className="h-8 w-8 sm:h-9 sm:w-9 rounded-xl bg-background/80 text-foreground hover:bg-background flex items-center justify-center backdrop-blur-sm transition-all"
              aria-label="Quick view"
            >
              <Eye className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            </button>
          </div>

          {/* Add to Cart - always visible on mobile, hover on desktop */}
          <div className="absolute bottom-2 left-2 right-2 sm:bottom-3 sm:left-3 sm:right-3 sm:opacity-0 sm:group-hover:opacity-100 transition-all duration-300 sm:translate-y-2 sm:group-hover:translate-y-0">
            <Button
              onClick={handleAddToCart}
              className="w-full rounded-xl bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white hover:from-violet-600 hover:to-fuchsia-600 shadow-lg h-9 sm:h-auto text-xs sm:text-sm"
              size="sm"
            >
              <ShoppingBag className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1.5 sm:mr-2" /> Add to Cart
            </Button>
          </div>
        </div>

        {/* Info */}
        <div className="p-4">
          <p className="text-xs text-muted-foreground mb-1">{product.brand}</p>
          <h3 className="font-medium text-sm leading-snug mb-2 line-clamp-2 group-hover:text-violet-500 transition-colors">
            {product.name}
          </h3>
          <Rating rating={product.rating} count={product.reviewCount} />
          <div className="flex items-center gap-2 mt-2">
            <span className="font-semibold text-lg">${product.price.toLocaleString()}</span>
            {product.discount > 0 && (
              <span className="text-sm text-muted-foreground line-through">
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
