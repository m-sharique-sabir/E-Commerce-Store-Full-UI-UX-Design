'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  Heart,
  ShoppingBag,
  Minus,
  Plus,
  Share2,
  Truck,
  Shield,
  RotateCcw,
  Star,
  ChevronRight,
  Check,
} from 'lucide-react';
import { useRouterStore, useCartStore, useWishlistStore, useRecentlyViewedStore } from '@/stores';
import { getStoredProducts, getProductReviews, addReview } from '@/lib/storage';
import { ProductCard, Rating, ProductImage } from '@/components/shared';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Product, Review } from '@/lib/types';
import { useAuthStore } from '@/stores';
import { toast } from 'sonner';

export function ProductDetailPage() {
  const { params, navigate } = useRouterStore();
  const { addItem } = useCartStore();
  const { toggleItem, isInWishlist } = useWishlistStore();
  const { addProduct: addRecentlyViewed } = useRecentlyViewedStore();
  const { isAuthenticated, user } = useAuthStore();

  const productId = params.id;

  // UI state
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [prevProductId, setPrevProductId] = useState(productId);

  // Review form state
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewComment, setReviewComment] = useState('');
  const [hoverRating, setHoverRating] = useState(0);

  // Track review submissions so we can refresh
  const [reviewVersion, setReviewVersion] = useState(0);

  // Derived: product data (reads from localStorage, stable across renders)
  const allProducts = useMemo(() => getStoredProducts(), []);
  const product = useMemo(
    () => allProducts.find((p) => p.id === productId) || null,
    [allProducts, productId]
  );

  // Derived: reviews (re-compute on version change so new reviews appear)
  const reviews = useMemo(
    () => (product ? getProductReviews(product.id) : []),
    [product, reviewVersion]
  );

  // Derived: related products
  const relatedProducts = useMemo(() => {
    if (!product) return [];
    return allProducts
      .filter((p) => p.category === product.category && p.id !== product.id)
      .slice(0, 4);
  }, [allProducts, product]);

  // Derived: wishlist active
  const wishlistActive = product ? isInWishlist(product.id) : false;

  // Reset local UI state when product changes (adjusting state during render)
  // See: https://react.dev/learn/you-might-not-need-an-effect#adjusting-state-when-a-prop-changes
  if (prevProductId !== productId) {
    setPrevProductId(productId);
    setSelectedImage(0);
    setQuantity(1);
  }

  // Track recently viewed (side effect only)
  useEffect(() => {
    if (product) {
      addRecentlyViewed(product.id);
    }
  }, [product, addRecentlyViewed]);

  // Handlers
  const handleAddToCart = useCallback(() => {
    if (!product) return;
    addItem(product.id, quantity);
    toast.success('Added to cart', {
      description: `${quantity} × ${product.name}`,
    });
  }, [product, quantity, addItem]);

  const handleBuyNow = useCallback(() => {
    if (!product) return;
    addItem(product.id, quantity);
    navigate('checkout');
  }, [product, quantity, addItem, navigate]);

  const handleWishlistToggle = useCallback(() => {
    if (!product) return;
    toggleItem(product.id);
    toast.success(wishlistActive ? 'Removed from wishlist' : 'Added to wishlist', {
      description: product.name,
    });
  }, [product, wishlistActive, toggleItem]);

  const handleShare = useCallback(async () => {
    if (typeof window !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: product?.name,
          text: product?.shortDescription,
          url: window.location.href,
        });
      } catch {
        // User cancelled share
      }
    } else if (typeof window !== 'undefined') {
      await navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard');
    }
  }, [product]);

  const handleSubmitReview = useCallback(() => {
    if (!product) return;
    if (reviewRating === 0) {
      toast.error('Please select a rating');
      return;
    }
    if (!reviewTitle.trim()) {
      toast.error('Please enter a review title');
      return;
    }
    if (!reviewComment.trim()) {
      toast.error('Please enter a review comment');
      return;
    }

    const newReview: Review = {
      id: `review-${Date.now()}`,
      productId: product.id,
      userId: user?.id || 'anonymous',
      userName: user?.name || 'Anonymous',
      rating: reviewRating,
      title: reviewTitle,
      comment: reviewComment,
      createdAt: new Date().toISOString(),
      helpful: 0,
    };

    addReview(newReview);
    setReviewVersion((v) => v + 1);
    setReviewRating(0);
    setReviewTitle('');
    setReviewComment('');
    toast.success('Review submitted successfully!');
  }, [product, reviewRating, reviewTitle, reviewComment, user]);

  // Stock status helper
  const getStockStatus = useCallback((stock: number) => {
    if (stock === 0) return { label: 'Out of Stock', color: 'text-destructive', bg: 'bg-destructive/10' };
    if (stock <= 5) return { label: 'Low Stock', color: 'text-amber-600', bg: 'bg-amber-50 dark:bg-amber-950/30' };
    return { label: 'In Stock', color: 'text-emerald-600', bg: 'bg-emerald-50 dark:bg-emerald-950/30' };
  }, []);

  // Loading state
  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="h-16 w-16 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-4 animate-pulse">
            <ShoppingBag className="h-8 w-8 text-muted-foreground" />
          </div>
          <p className="text-muted-foreground">Loading product...</p>
        </div>
      </div>
    );
  }

  const stockStatus = getStockStatus(product.stock);
  const discountPercent =
    product.discount > 0
      ? product.discount
      : Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {/* ──────────────── Breadcrumb ──────────────── */}
        <motion.nav
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          aria-label="Breadcrumb"
          className="mb-6"
        >
          <ol className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <li>
              <button
                onClick={() => navigate('home')}
                className="hover:text-foreground transition-colors"
              >
                Home
              </button>
            </li>
            <li>
              <ChevronRight className="h-3.5 w-3.5" />
            </li>
            <li>
              <button
                onClick={() => navigate('shop')}
                className="hover:text-foreground transition-colors"
              >
                {product.category}
              </button>
            </li>
            <li>
              <ChevronRight className="h-3.5 w-3.5" />
            </li>
            <li>
              <span className="text-foreground font-medium truncate max-w-[200px] sm:max-w-none inline-block">
                {product.name}
              </span>
            </li>
          </ol>
        </motion.nav>

        {/* ──────────────── Main Product Section ──────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* ── Left: Product Gallery ── */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          >
            {/* Main Image */}
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-muted border border-border/50 mb-4">
              <ProductImage
                src={product.images[selectedImage] || ''}
                alt={product.name}
                className="w-full h-full"
              />
              {/* Discount Badge */}
              {discountPercent > 0 && (
                <div className="absolute top-4 left-4 px-3 py-1 rounded-xl bg-destructive text-destructive-foreground text-sm font-semibold">
                  -{discountPercent}%
                </div>
              )}
            </div>

            {/* Thumbnail Strip */}
            {product.images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`relative flex-shrink-0 w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden border-2 transition-all duration-200 ${
                      selectedImage === idx
                        ? 'border-violet-500 ring-2 ring-violet-500/20'
                        : 'border-border/50 hover:border-border'
                    }`}
                  >
                    <ProductImage
                      src={img}
                      alt={`${product.name} view ${idx + 1}`}
                      className="w-full h-full"
                    />
                    {selectedImage === idx && (
                      <div className="absolute inset-0 bg-violet-500/10" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </motion.div>

          {/* ── Right: Product Details ── */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut', delay: 0.1 }}
            className="flex flex-col"
          >
            {/* Brand */}
            <span className="text-sm text-violet-500 font-medium mb-1">{product.brand}</span>

            {/* Name */}
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-3">
              {product.name}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-2 mb-4">
              <Rating rating={product.rating} count={product.reviewCount} size="md" />
              <span className="text-sm text-muted-foreground">
                {product.rating.toFixed(1)} out of 5
              </span>
            </div>

            {/* Price */}
            <div className="flex items-center gap-3 mb-4 flex-wrap">
              <span className="text-3xl font-bold">${product.price.toLocaleString()}</span>
              {product.originalPrice > product.price && (
                <>
                  <span className="text-lg text-muted-foreground line-through">
                    ${product.originalPrice.toLocaleString()}
                  </span>
                  <span className="px-2 py-0.5 rounded-lg bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 text-sm font-semibold">
                    Save ${(product.originalPrice - product.price).toLocaleString()}
                  </span>
                </>
              )}
            </div>

            {/* Short Description */}
            <p className="text-muted-foreground leading-relaxed mb-5">
              {product.shortDescription}
            </p>

            {/* Stock Status */}
            <div className="flex items-center gap-2 mb-6">
              <div
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium ${stockStatus.bg} ${stockStatus.color}`}
              >
                {product.stock > 0 && <Check className="h-3.5 w-3.5" />}
                {stockStatus.label}
              </div>
              {product.stock > 0 && product.stock <= 5 && (
                <span className="text-xs text-amber-600">Only {product.stock} left</span>
              )}
            </div>

            {/* Quantity Selector */}
            <div className="flex items-center gap-4 mb-6">
              <span className="text-sm font-medium">Quantity:</span>
              <div className="flex items-center border border-border rounded-xl overflow-hidden">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                  className="h-10 w-10 flex items-center justify-center hover:bg-muted transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                  aria-label="Decrease quantity"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="h-10 w-12 flex items-center justify-center text-sm font-semibold border-x border-border">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  disabled={quantity >= product.stock}
                  className="h-10 w-10 flex items-center justify-center hover:bg-muted transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                  aria-label="Increase quantity"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 mb-4">
              <Button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                size="lg"
                className="flex-1 h-12 text-base font-semibold rounded-xl bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white hover:from-violet-600 hover:to-fuchsia-600 shadow-lg shadow-violet-500/25 transition-all duration-300 hover:shadow-xl hover:shadow-violet-500/30 disabled:opacity-50"
              >
                <ShoppingBag className="h-5 w-5 mr-2" />
                Add to Cart
              </Button>
              <Button
                onClick={handleBuyNow}
                disabled={product.stock === 0}
                size="lg"
                variant="outline"
                className="flex-1 h-12 text-base font-semibold rounded-xl border-2 hover:bg-violet-50 hover:border-violet-300 dark:hover:bg-violet-950/30 dark:hover:border-violet-700 transition-all disabled:opacity-50"
              >
                Buy Now
              </Button>
            </div>

            {/* Wishlist & Share */}
            <div className="flex items-center gap-3 mb-6">
              <Button
                variant="outline"
                size="sm"
                onClick={handleWishlistToggle}
                className={`rounded-xl gap-2 transition-all ${
                  wishlistActive
                    ? 'border-destructive/50 bg-destructive/5 text-destructive hover:bg-destructive/10'
                    : ''
                }`}
              >
                <Heart className={`h-4 w-4 ${wishlistActive ? 'fill-current' : ''}`} />
                {wishlistActive ? 'Wishlisted' : 'Wishlist'}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleShare}
                className="rounded-xl gap-2"
              >
                <Share2 className="h-4 w-4" />
                Share
              </Button>
            </div>

            {/* Features Bar */}
            <div className="grid grid-cols-3 gap-3">
              <div className="flex flex-col items-center gap-2 p-4 rounded-xl bg-muted/50 border border-border/50 text-center">
                <Truck className="h-5 w-5 text-violet-500" />
                <span className="text-xs font-medium">Free Shipping</span>
                <span className="text-[10px] text-muted-foreground">Orders $100+</span>
              </div>
              <div className="flex flex-col items-center gap-2 p-4 rounded-xl bg-muted/50 border border-border/50 text-center">
                <Shield className="h-5 w-5 text-violet-500" />
                <span className="text-xs font-medium">2-Year Warranty</span>
                <span className="text-[10px] text-muted-foreground">Full coverage</span>
              </div>
              <div className="flex flex-col items-center gap-2 p-4 rounded-xl bg-muted/50 border border-border/50 text-center">
                <RotateCcw className="h-5 w-5 text-violet-500" />
                <span className="text-xs font-medium">Free Returns</span>
                <span className="text-[10px] text-muted-foreground">30-day policy</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* ──────────────── Tabs Section ──────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut', delay: 0.2 }}
          className="mt-12"
        >
          <Tabs defaultValue="description" className="w-full">
            <TabsList className="w-full sm:w-auto justify-start rounded-xl p-1 bg-muted/60">
              <TabsTrigger value="description" className="rounded-lg px-5">
                Description
              </TabsTrigger>
              <TabsTrigger value="specifications" className="rounded-lg px-5">
                Specifications
              </TabsTrigger>
              <TabsTrigger value="reviews" className="rounded-lg px-5">
                Reviews ({reviews.length})
              </TabsTrigger>
            </TabsList>

            {/* Description Tab */}
            <TabsContent value="description" className="mt-6">
              <div className="rounded-2xl border border-border/50 p-6 sm:p-8 bg-card">
                <h3 className="text-lg font-semibold mb-4">Product Description</h3>
                <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                  {product.description}
                </p>
              </div>
            </TabsContent>

            {/* Specifications Tab */}
            <TabsContent value="specifications" className="mt-6">
              <div className="rounded-2xl border border-border/50 overflow-hidden bg-card">
                <div className="p-6 sm:p-8 border-b border-border/50">
                  <h3 className="text-lg font-semibold">Specifications</h3>
                </div>
                <div className="divide-y divide-border/50">
                  {Object.entries(product.specifications).map(([key, value], idx) => (
                    <div
                      key={key}
                      className={`flex items-center px-6 sm:px-8 py-4 ${
                        idx % 2 === 0 ? 'bg-muted/30' : ''
                      }`}
                    >
                      <span className="w-1/3 text-sm font-medium text-foreground">{key}</span>
                      <span className="w-2/3 text-sm text-muted-foreground">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>

            {/* Reviews Tab */}
            <TabsContent value="reviews" className="mt-6">
              <div className="space-y-6">
                {/* Reviews Summary */}
                <div className="rounded-2xl border border-border/50 p-6 sm:p-8 bg-card">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
                    <div className="text-center sm:text-left">
                      <div className="text-4xl font-bold">{product.rating.toFixed(1)}</div>
                      <Rating rating={product.rating} size="md" />
                      <p className="text-sm text-muted-foreground mt-1">
                        Based on {product.reviewCount} reviews
                      </p>
                    </div>
                  </div>

                  {/* Review List */}
                  {reviews.length > 0 ? (
                    <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                      {reviews.map((review) => (
                        <div
                          key={review.id}
                          className="border border-border/50 rounded-xl p-4 hover:border-border transition-colors"
                        >
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-violet-200 to-fuchsia-200 flex items-center justify-center text-xs font-semibold text-violet-700">
                                  {review.userName.charAt(0).toUpperCase()}
                                </div>
                                <span className="font-medium text-sm">{review.userName}</span>
                              </div>
                              <Rating rating={review.rating} size="sm" />
                            </div>
                            <span className="text-xs text-muted-foreground">
                              {new Date(review.createdAt).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                              })}
                            </span>
                          </div>
                          <h4 className="font-semibold text-sm mb-1">{review.title}</h4>
                          <p className="text-sm text-muted-foreground leading-relaxed">
                            {review.comment}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Star className="h-10 w-10 text-muted-foreground/40 mx-auto mb-3" />
                      <p className="text-muted-foreground">No reviews yet. Be the first to review!</p>
                    </div>
                  )}
                </div>

                {/* Write a Review */}
                {isAuthenticated ? (
                  <div className="rounded-2xl border border-border/50 p-6 sm:p-8 bg-card">
                    <h3 className="text-lg font-semibold mb-5">Write a Review</h3>

                    {/* Star Rating Selector */}
                    <div className="mb-4">
                      <label className="text-sm font-medium mb-2 block">Your Rating</label>
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            onClick={() => setReviewRating(star)}
                            onMouseEnter={() => setHoverRating(star)}
                            onMouseLeave={() => setHoverRating(0)}
                            className="p-0.5 transition-transform hover:scale-110"
                            aria-label={`Rate ${star} star${star > 1 ? 's' : ''}`}
                          >
                            <Star
                              className={`h-7 w-7 transition-colors ${
                                star <= (hoverRating || reviewRating)
                                  ? 'fill-amber-400 text-amber-400'
                                  : 'fill-muted text-muted'
                              }`}
                            />
                          </button>
                        ))}
                        {reviewRating > 0 && (
                          <span className="ml-2 text-sm text-muted-foreground">
                            {reviewRating} out of 5
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Title Input */}
                    <div className="mb-4">
                      <label className="text-sm font-medium mb-2 block">Review Title</label>
                      <Input
                        value={reviewTitle}
                        onChange={(e) => setReviewTitle(e.target.value)}
                        placeholder="Summarize your experience"
                        className="rounded-xl"
                      />
                    </div>

                    {/* Comment Textarea */}
                    <div className="mb-5">
                      <label className="text-sm font-medium mb-2 block">Your Review</label>
                      <Textarea
                        value={reviewComment}
                        onChange={(e) => setReviewComment(e.target.value)}
                        placeholder="What did you like or dislike about this product?"
                        rows={4}
                        className="rounded-xl resize-none"
                      />
                    </div>

                    {/* Submit Button */}
                    <Button
                      onClick={handleSubmitReview}
                      className="rounded-xl bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white hover:from-violet-600 hover:to-fuchsia-600 shadow-lg shadow-violet-500/25"
                    >
                      Submit Review
                    </Button>
                  </div>
                ) : (
                  <div className="rounded-2xl border border-dashed border-border p-8 text-center bg-muted/30">
                    <Star className="h-10 w-10 text-muted-foreground/40 mx-auto mb-3" />
                    <p className="text-muted-foreground mb-3">
                      Please log in to write a review
                    </p>
                    <Button
                      variant="outline"
                      onClick={() => navigate('login')}
                      className="rounded-xl"
                    >
                      Sign In
                    </Button>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>

        {/* ──────────────── Related Products ──────────────── */}
        {relatedProducts.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut', delay: 0.3 }}
            className="mt-14"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl sm:text-2xl font-bold">Related Products</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('shop')}
                className="text-violet-500 hover:text-violet-600 gap-1"
              >
                View All
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
              {relatedProducts.map((p, index) => (
                <ProductCard key={p.id} product={p} index={index} />
              ))}
            </div>
          </motion.section>
        )}
      </div>
    </div>
  );
}
