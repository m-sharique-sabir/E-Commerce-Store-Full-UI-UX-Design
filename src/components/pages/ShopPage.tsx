'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SlidersHorizontal, X, Grid3X3, LayoutList } from 'lucide-react';
import { useRouterStore } from '@/stores';
import { getStoredProducts, getStoredCategories, getStoredBrands } from '@/lib/storage';
import { ProductCard, ProductGrid, ProductImage, EmptyState, Rating } from '@/components/shared';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';
import { Checkbox } from '@/components/ui/checkbox';
import { Product, Category, Brand } from '@/lib/types';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import {
  Pagination as PaginationNav,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
} from '@/components/ui/pagination';

const PRODUCTS_PER_PAGE = 12;

type SortOption = 'newest' | 'price-asc' | 'price-desc' | 'rating' | 'name-asc';
type ViewMode = 'grid' | 'list';

/* ───────── Filter Sidebar (shared between desktop & mobile) ───────── */
interface FilterSidebarProps {
  categories: Category[];
  brands: Brand[];
  products: Product[];
  selectedCategories: string[];
  selectedBrands: string[];
  priceRange: [number, number];
  minRating: number;
  hasActiveFilters: boolean;
  onCategoryToggle: (slug: string) => void;
  onBrandToggle: (name: string) => void;
  onPriceChange: (value: number[]) => void;
  onRatingFilter: (rating: number) => void;
  onClearAll: () => void;
}

function FilterSidebar({
  categories,
  brands,
  products,
  selectedCategories,
  selectedBrands,
  priceRange,
  minRating,
  hasActiveFilters,
  onCategoryToggle,
  onBrandToggle,
  onPriceChange,
  onRatingFilter,
  onClearAll,
}: FilterSidebarProps) {
  return (
    <div className="space-y-2">
      <Accordion type="multiple" defaultValue={['categories', 'brands', 'price', 'rating']} className="w-full">
        {/* Category Filter */}
        <AccordionItem value="categories">
          <AccordionTrigger className="text-sm font-semibold py-3 hover:no-underline">
            Categories
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2.5 max-h-64 overflow-y-auto pr-1 custom-scrollbar">
              {categories.map((category) => (
                <label
                  key={category.id}
                  className="flex items-center gap-2.5 cursor-pointer group"
                >
                  <Checkbox
                    checked={selectedCategories.includes(category.slug)}
                    onCheckedChange={() => onCategoryToggle(category.slug)}
                    className="group-hover:border-primary/50"
                  />
                  <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors flex-1">
                    {category.name}
                  </span>
                  <span className="text-xs text-muted-foreground/60">
                    ({category.productCount})
                  </span>
                </label>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Brand Filter */}
        <AccordionItem value="brands">
          <AccordionTrigger className="text-sm font-semibold py-3 hover:no-underline">
            Brands
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2.5 max-h-64 overflow-y-auto pr-1 custom-scrollbar">
              {brands.map((brand) => {
                const count = products.filter((p) => p.brand === brand.name).length;
                return (
                  <label
                    key={brand.id}
                    className="flex items-center gap-2.5 cursor-pointer group"
                  >
                    <Checkbox
                      checked={selectedBrands.includes(brand.name)}
                      onCheckedChange={() => onBrandToggle(brand.name)}
                      className="group-hover:border-primary/50"
                    />
                    <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors flex-1">
                      {brand.logo} {brand.name}
                    </span>
                    <span className="text-xs text-muted-foreground/60">
                      ({count})
                    </span>
                  </label>
                );
              })}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Price Range Filter */}
        <AccordionItem value="price">
          <AccordionTrigger className="text-sm font-semibold py-3 hover:no-underline">
            Price Range
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4 px-1">
              <Slider
                min={0}
                max={3000}
                step={10}
                value={priceRange}
                onValueChange={onPriceChange}
                className="w-full"
              />
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium text-muted-foreground">${priceRange[0]}</span>
                <span className="text-muted-foreground/50">—</span>
                <span className="font-medium text-muted-foreground">${priceRange[1]}</span>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Rating Filter */}
        <AccordionItem value="rating">
          <AccordionTrigger className="text-sm font-semibold py-3 hover:no-underline">
            Rating
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-1">
              {[4, 3, 2, 1].map((rating) => (
                <button
                  key={rating}
                  onClick={() => onRatingFilter(rating)}
                  className={`flex items-center gap-2 w-full px-2 py-2 rounded-lg transition-all text-left ${
                    minRating === rating
                      ? 'bg-primary/10 text-primary'
                      : 'hover:bg-muted text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <Rating rating={rating} />
                  <span className="text-sm ml-1">& Up</span>
                  {minRating === rating && (
                    <X className="h-3.5 w-3.5 ml-auto" />
                  )}
                </button>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      {/* Clear All Filters */}
      {hasActiveFilters && (
        <div className="pt-4 px-1">
          <Button
            variant="outline"
            size="sm"
            onClick={onClearAll}
            className="w-full rounded-xl text-destructive hover:text-destructive hover:bg-destructive/10 border-destructive/30"
          >
            <X className="h-4 w-4 mr-1.5" />
            Clear All Filters
          </Button>
        </div>
      )}
    </div>
  );
}

/* ───────── List View Item ───────── */
function ProductListItem({ product, index }: { product: Product; index: number }) {
  const navigate = useRouterStore((s) => s.navigate);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.04 }}
      className="group cursor-pointer"
      onClick={() => navigate('product', { id: product.id })}
    >
      <div className="flex gap-4 sm:gap-6 rounded-2xl border bg-card p-4 hover:shadow-lg hover:border-border transition-all duration-300">
        {/* Image */}
        <div className="relative w-24 h-24 sm:w-32 sm:h-32 rounded-xl overflow-hidden bg-muted shrink-0">
          <ProductImage src={product.images[0]} alt={product.name} className="w-full h-full" />
          <div className="absolute top-1.5 left-1.5 flex flex-col gap-1">
            {product.discount > 0 && (
              <span className="px-1.5 py-0.5 rounded-md bg-destructive text-destructive-foreground text-[10px] font-semibold">
                -{product.discount}%
              </span>
            )}
            {product.isNew && (
              <span className="px-1.5 py-0.5 rounded-md bg-emerald-500 text-white text-[10px] font-semibold">
                New
              </span>
            )}
          </div>
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0 py-1">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
            <div className="min-w-0">
              <p className="text-xs text-muted-foreground mb-0.5">{product.brand}</p>
              <h3 className="font-medium text-sm sm:text-base leading-snug line-clamp-2 group-hover:text-indigo-500 transition-colors">
                {product.name}
              </h3>
              <div className="flex items-center gap-2 mt-1.5">
                <Rating rating={product.rating} count={product.reviewCount} size="sm" />
              </div>
              <p className="text-xs text-muted-foreground mt-2 line-clamp-2 hidden sm:block">
                {product.shortDescription}
              </p>
            </div>
            <div className="flex flex-col items-end shrink-0">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-lg">${product.price.toLocaleString()}</span>
                {product.discount > 0 && (
                  <span className="text-sm text-muted-foreground line-through">
                    ${product.originalPrice.toLocaleString()}
                  </span>
                )}
              </div>
              {product.discount > 0 && (
                <Badge variant="destructive" className="mt-1 text-[10px] px-1.5 py-0">
                  -{product.discount}%
                </Badge>
              )}
              <div className="flex gap-1.5 mt-2">
                {product.isNew && (
                  <Badge variant="outline" className="text-[10px] px-1.5 py-0 text-emerald-500 border-emerald-500/30">
                    New
                  </Badge>
                )}
                {product.bestSeller && (
                  <Badge variant="outline" className="text-[10px] px-1.5 py-0 text-amber-500 border-amber-500/30">
                    Best Seller
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/* ───────── Shop Page ───────── */
export function ShopPage() {
  const { params, navigate } = useRouterStore();

  // Data from storage
  const products = typeof window !== 'undefined' ? getStoredProducts() : [];
  const categories = typeof window !== 'undefined' ? getStoredCategories() : [];
  const brands = typeof window !== 'undefined' ? getStoredBrands() : [];

  // Filter state
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    params.category ? [params.category] : []
  );
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 3000]);
  const [minRating, setMinRating] = useState<number>(0);
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [currentPage, setCurrentPage] = useState(1);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Search query from router params
  const searchQuery = params.q?.toLowerCase() || '';

  // Filtered & sorted products
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Search filter
    if (searchQuery) {
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(searchQuery) ||
          p.description.toLowerCase().includes(searchQuery) ||
          p.brand.toLowerCase().includes(searchQuery) ||
          p.category.toLowerCase().includes(searchQuery) ||
          p.tags.some((t) => t.toLowerCase().includes(searchQuery))
      );
    }

    // Category filter
    if (selectedCategories.length > 0) {
      result = result.filter((p) => selectedCategories.includes(p.categorySlug));
    }

    // Brand filter
    if (selectedBrands.length > 0) {
      result = result.filter((p) => selectedBrands.includes(p.brand));
    }

    // Price range filter
    result = result.filter((p) => p.price >= priceRange[0] && p.price <= priceRange[1]);

    // Rating filter
    if (minRating > 0) {
      result = result.filter((p) => p.rating >= minRating);
    }

    // Sorting
    switch (sortBy) {
      case 'newest':
        result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case 'price-asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        result.sort((a, b) => b.rating - a.rating);
        break;
      case 'name-asc':
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
    }

    return result;
  }, [products, searchQuery, selectedCategories, selectedBrands, priceRange, minRating, sortBy]);

  // Pagination
  const totalPages = Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE);
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * PRODUCTS_PER_PAGE;
    return filteredProducts.slice(start, start + PRODUCTS_PER_PAGE);
  }, [filteredProducts, currentPage]);

  // Reset page when filters change
  const handleCategoryToggle = (slug: string) => {
    setSelectedCategories((prev) =>
      prev.includes(slug) ? prev.filter((c) => c !== slug) : [...prev, slug]
    );
    setCurrentPage(1);
  };

  const handleBrandToggle = (name: string) => {
    setSelectedBrands((prev) =>
      prev.includes(name) ? prev.filter((b) => b !== name) : [...prev, name]
    );
    setCurrentPage(1);
  };

  const handlePriceChange = (value: number[]) => {
    setPriceRange([value[0], value[1]]);
    setCurrentPage(1);
  };

  const handleRatingFilter = (rating: number) => {
    setMinRating(minRating === rating ? 0 : rating);
    setCurrentPage(1);
  };

  const clearAllFilters = () => {
    setSelectedCategories([]);
    setSelectedBrands([]);
    setPriceRange([0, 3000]);
    setMinRating(0);
    setCurrentPage(1);
  };

  const hasActiveFilters =
    selectedCategories.length > 0 ||
    selectedBrands.length > 0 ||
    priceRange[0] > 0 ||
    priceRange[1] < 3000 ||
    minRating > 0;

  // Active filter badges
  const activeFilterBadges = useMemo(() => {
    const badges: { label: string; onRemove: () => void }[] = [];

    selectedCategories.forEach((slug) => {
      const cat = categories.find((c) => c.slug === slug);
      badges.push({
        label: cat?.name || slug,
        onRemove: () => handleCategoryToggle(slug),
      });
    });

    selectedBrands.forEach((name) => {
      badges.push({
        label: name,
        onRemove: () => handleBrandToggle(name),
      });
    });

    if (priceRange[0] > 0 || priceRange[1] < 3000) {
      badges.push({
        label: `$${priceRange[0]} - $${priceRange[1]}`,
        onRemove: () => {
          setPriceRange([0, 3000]);
          setCurrentPage(1);
        },
      });
    }

    if (minRating > 0) {
      badges.push({
        label: `${minRating}+ Stars`,
        onRemove: () => {
          setMinRating(0);
          setCurrentPage(1);
        },
      });
    }

    if (searchQuery) {
      badges.push({
        label: `Search: "${params.q}"`,
        onRemove: () => navigate('shop'),
      });
    }

    return badges;
  }, [selectedCategories, selectedBrands, priceRange, minRating, searchQuery, categories, params.q, navigate]);

  // Pagination range
  const getPaginationRange = () => {
    const range: (number | 'ellipsis')[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) range.push(i);
    } else {
      range.push(1);
      if (currentPage > 3) range.push('ellipsis');
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      for (let i = start; i <= end; i++) range.push(i);
      if (currentPage < totalPages - 2) range.push('ellipsis');
      range.push(totalPages);
    }
    return range;
  };

  // Shared filter props
  const filterProps: FilterSidebarProps = {
    categories,
    brands,
    products,
    selectedCategories,
    selectedBrands,
    priceRange,
    minRating,
    hasActiveFilters,
    onCategoryToggle: handleCategoryToggle,
    onBrandToggle: handleBrandToggle,
    onPriceChange: handlePriceChange,
    onRatingFilter: handleRatingFilter,
    onClearAll: clearAllFilters,
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-10">
        {/* ───── Breadcrumb ───── */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-6"
        >
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink
                  className="cursor-pointer"
                  onClick={() => navigate('home')}
                >
                  Home
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Shop</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </motion.div>

        {/* ───── Header ───── */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.05 }}
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6"
        >
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
              {searchQuery ? `Search: "${params.q}"` : selectedCategories.length === 1 ? categories.find(c => c.slug === selectedCategories[0])?.name || 'All Products' : 'All Products'}
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'} found
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Sort Dropdown */}
            <Select value={sortBy} onValueChange={(v) => setSortBy(v as SortOption)}>
              <SelectTrigger className="w-[140px] sm:w-[180px] rounded-xl">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest</SelectItem>
                <SelectItem value="price-asc">Price: Low to High</SelectItem>
                <SelectItem value="price-desc">Price: High to Low</SelectItem>
                <SelectItem value="rating">Top Rated</SelectItem>
                <SelectItem value="name-asc">Name: A to Z</SelectItem>
              </SelectContent>
            </Select>

            {/* View Toggle */}
            <div className="hidden sm:flex items-center border rounded-xl overflow-hidden">
              <Button
                variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
                size="icon"
                className="rounded-none h-9 w-9"
                onClick={() => setViewMode('grid')}
                aria-label="Grid view"
              >
                <Grid3X3 className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'secondary' : 'ghost'}
                size="icon"
                className="rounded-none h-9 w-9"
                onClick={() => setViewMode('list')}
                aria-label="List view"
              >
                <LayoutList className="h-4 w-4" />
              </Button>
            </div>

            {/* Mobile Filter Button */}
            <Sheet open={mobileFiltersOpen} onOpenChange={setMobileFiltersOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="lg:hidden rounded-xl relative"
                >
                  <SlidersHorizontal className="h-4 w-4 mr-1.5" />
                  Filters
                  {hasActiveFilters && (
                    <span className="absolute -top-1.5 -right-1.5 h-4 w-4 rounded-full bg-primary text-[10px] font-bold text-primary-foreground flex items-center justify-center">
                      {activeFilterBadges.length}
                    </span>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-80 overflow-y-auto">
                <SheetHeader className="mb-4">
                  <SheetTitle className="flex items-center gap-2">
                    <SlidersHorizontal className="h-5 w-5" />
                    Filters
                  </SheetTitle>
                </SheetHeader>
                <FilterSidebar {...filterProps} />
              </SheetContent>
            </Sheet>
          </div>
        </motion.div>

        {/* ───── Active Filter Badges ───── */}
        <AnimatePresence>
          {activeFilterBadges.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="flex flex-wrap items-center gap-2 mb-6"
            >
              <span className="text-sm text-muted-foreground mr-1">Active Filters:</span>
              {activeFilterBadges.map((badge, i) => (
                <motion.div
                  key={`${badge.label}-${i}`}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.15 }}
                >
                  <Badge
                    variant="secondary"
                    className="rounded-lg pl-2.5 pr-1.5 py-1 text-xs font-medium gap-1.5 cursor-pointer hover:bg-secondary/80 transition-colors"
                    onClick={badge.onRemove}
                  >
                    {badge.label}
                    <X className="h-3 w-3 opacity-60 hover:opacity-100 transition-opacity" />
                  </Badge>
                </motion.div>
              ))}
              <Button
                variant="ghost"
                size="sm"
                onClick={clearAllFilters}
                className="text-xs text-muted-foreground hover:text-destructive h-7 px-2"
              >
                Clear all
              </Button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ───── Main Content ───── */}
        <div className="flex gap-6 lg:gap-8">
          {/* Desktop Sidebar */}
          <motion.aside
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="hidden lg:block w-56 lg:w-64 shrink-0"
          >
            <div className="sticky top-24 rounded-2xl border bg-card p-5">
              <h3 className="font-semibold text-sm flex items-center gap-2 mb-4">
                <SlidersHorizontal className="h-4 w-4" />
                Filters
              </h3>
              <FilterSidebar {...filterProps} />
            </div>
          </motion.aside>

          {/* Product Area */}
          <main className="flex-1 min-w-0">
            {paginatedProducts.length > 0 ? (
              <>
                {viewMode === 'grid' ? (
                  <ProductGrid products={paginatedProducts} columns={3} />
                ) : (
                  <div className="space-y-4">
                    {paginatedProducts.map((product, index) => (
                      <ProductListItem key={product.id} product={product} index={index} />
                    ))}
                  </div>
                )}

                {/* ───── Pagination ───── */}
                {totalPages > 1 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="mt-10"
                  >
                    <PaginationNav>
                      <PaginationContent>
                        <PaginationItem>
                          <PaginationPrevious
                            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                            className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                          />
                        </PaginationItem>

                        {getPaginationRange().map((page, i) =>
                          page === 'ellipsis' ? (
                            <PaginationItem key={`ellipsis-${i}`}>
                              <PaginationEllipsis />
                            </PaginationItem>
                          ) : (
                            <PaginationItem key={page}>
                              <PaginationLink
                                isActive={currentPage === page}
                                onClick={() => setCurrentPage(page)}
                                className="cursor-pointer"
                              >
                                {page}
                              </PaginationLink>
                            </PaginationItem>
                          )
                        )}

                        <PaginationItem>
                          <PaginationNext
                            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                            className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                          />
                        </PaginationItem>
                      </PaginationContent>
                    </PaginationNav>
                  </motion.div>
                )}
              </>
            ) : (
              <EmptyState
                icon={SlidersHorizontal}
                title="No products found"
                description="Try adjusting your filters or search query to find what you're looking for."
                action={{
                  label: 'Clear All Filters',
                  onClick: clearAllFilters,
                }}
              />
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
