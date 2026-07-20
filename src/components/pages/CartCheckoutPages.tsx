'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Minus,
  Plus,
  Trash2,
  ShoppingBag,
  ArrowRight,
  Tag,
  Truck,
  Shield,
  CreditCard,
  Banknote,
  ChevronRight,
  Check,
  Package,
} from 'lucide-react';
import { useRouterStore, useCartStore, useAuthStore, useNotificationStore } from '@/stores';
import { addOrder } from '@/lib/storage';
import { ProductImage, EmptyState } from '@/components/shared';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Order, OrderItem, Address } from '@/lib/types';
import { toast } from 'sonner';
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';

/* ═══════════════════════════════════════════════════════════
   Shared Helpers
   ═══════════════════════════════════════════════════════════ */

function formatPrice(amount: number): string {
  return `$${amount.toFixed(2)}`;
}

const emptyAddress: Omit<Address, 'id'> = {
  label: '',
  firstName: '',
  lastName: '',
  street: '',
  apartment: '',
  city: '',
  state: '',
  zipCode: '',
  country: 'United States',
  phone: '',
  isDefault: false,
};

/* ═══════════════════════════════════════════════════════════
   Order Summary Card (shared between Cart & Checkout)
   ═══════════════════════════════════════════════════════════ */

interface OrderSummaryProps {
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  itemCount: number;
  showPromo?: boolean;
  readOnly?: boolean;
}

function OrderSummaryCard({ subtotal, shipping, tax, total, itemCount, showPromo = false, readOnly = false }: OrderSummaryProps) {
  const [promoCode, setPromoCode] = useState('');

  const handleApplyPromo = () => {
    if (promoCode.trim()) {
      toast.success('Promo code applied!');
      setPromoCode('');
    }
  };

  return (
    <Card className="border-border/50">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg">Order Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Line items breakdown */}
        <div className="space-y-2.5 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Subtotal ({itemCount} {itemCount === 1 ? 'item' : 'items'})</span>
            <span>{formatPrice(subtotal)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Shipping</span>
            <span className={shipping === 0 ? 'text-emerald-500 font-medium' : ''}>
              {shipping === 0 ? 'FREE' : formatPrice(shipping)}
            </span>
          </div>
          {shipping === 0 && (
            <p className="text-xs text-emerald-500 flex items-center gap-1">
              <Truck className="h-3 w-3" /> Free shipping on orders over $100
            </p>
          )}
          <div className="flex justify-between">
            <span className="text-muted-foreground">Tax (8%)</span>
            <span>{formatPrice(tax)}</span>
          </div>
        </div>

        <Separator />

        {/* Total */}
        <div className="flex justify-between font-semibold text-lg">
          <span>Total</span>
          <span>{formatPrice(total)}</span>
        </div>

        {/* Promo code */}
        {showPromo && !readOnly && (
          <>
            <Separator />
            <div className="space-y-2">
              <Label className="text-sm flex items-center gap-1.5">
                <Tag className="h-3.5 w-3.5" /> Promo Code
              </Label>
              <div className="flex gap-2">
                <Input
                  placeholder="Enter promo code"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  className="rounded-lg text-sm"
                  onKeyDown={(e) => { if (e.key === 'Enter') handleApplyPromo(); }}
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleApplyPromo}
                  className="rounded-lg shrink-0"
                  disabled={!promoCode.trim()}
                >
                  Apply
                </Button>
              </div>
            </div>
          </>
        )}

        {/* Trust badges */}
        <div className="flex items-center justify-center gap-4 pt-2 text-muted-foreground">
          <div className="flex items-center gap-1 text-xs">
            <Shield className="h-3.5 w-3.5" />
            <span>Secure</span>
          </div>
          <div className="flex items-center gap-1 text-xs">
            <Truck className="h-3.5 w-3.5" />
            <span>Fast Delivery</span>
          </div>
          <div className="flex items-center gap-1 text-xs">
            <Package className="h-3.5 w-3.5" />
            <span>Easy Returns</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

/* ═══════════════════════════════════════════════════════════
   CartPage
   ═══════════════════════════════════════════════════════════ */

export function CartPage() {
  const navigate = useRouterStore((s) => s.navigate);
  const { items, cartProducts, removeItem, updateQuantity, getTotal } = useCartStore();
  const { subtotal, shipping, tax, total, itemCount } = getTotal();

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Breadcrumb */}
        <Breadcrumb className="mb-6">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink onClick={() => navigate('home')} className="cursor-pointer">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Cart</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <EmptyState
          icon={ShoppingBag}
          title="Your cart is empty"
          description="Looks like you haven't added anything to your cart yet. Browse our products and find something you love!"
          action={{ label: 'Start Shopping', onClick: () => navigate('shop') }}
        />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      {/* Breadcrumb */}
      <Breadcrumb className="mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink onClick={() => navigate('home')} className="cursor-pointer">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Cart</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <h1 className="text-2xl md:text-3xl font-bold mb-8">Shopping Cart</h1>

      <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
        {/* Cart Items */}
        <div className="flex-1 space-y-4">
          <AnimatePresence mode="popLayout">
            {items.map((item) => {
              const product = cartProducts.find((p) => p.id === item.productId);
              if (!product) return null;

              const lineTotal = product.price * item.quantity;

              return (
                <motion.div
                  key={item.productId}
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20, height: 0, marginBottom: 0, overflow: 'hidden' }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="border-border/50 hover:border-border transition-colors">
                    <CardContent className="p-3 sm:p-4 md:p-6">
                      <div className="flex gap-3 sm:gap-4">
                        {/* Product Image */}
                        <div
                          className="h-20 w-20 sm:h-24 sm:w-24 md:h-28 md:w-28 rounded-xl overflow-hidden shrink-0 cursor-pointer bg-muted"
                          onClick={() => navigate('product', { id: product.id })}
                        >
                          <ProductImage
                            src={product.images[0]}
                            alt={product.name}
                            className="w-full h-full"
                          />
                        </div>

                        {/* Product Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                            <div className="min-w-0">
                              <p className="text-xs text-muted-foreground mb-0.5">{product.brand}</p>
                              <h3
                                className="font-medium text-sm md:text-base leading-snug line-clamp-2 cursor-pointer hover:text-indigo-500 transition-colors"
                                onClick={() => navigate('product', { id: product.id })}
                              >
                                {product.name}
                              </h3>
                              <div className="flex items-center gap-2 mt-1.5">
                                <span className="font-semibold">{formatPrice(product.price)}</span>
                                {product.discount > 0 && (
                                  <span className="text-xs text-muted-foreground line-through">
                                    {formatPrice(product.originalPrice)}
                                  </span>
                                )}
                              </div>
                            </div>

                            {/* Line Total (desktop) */}
                            <div className="hidden sm:block text-right shrink-0">
                              <p className="font-semibold">{formatPrice(lineTotal)}</p>
                            </div>
                          </div>

                          {/* Quantity Controls + Remove */}
                          <div className="flex items-center justify-between mt-3">
                            <div className="flex items-center gap-1 bg-muted/50 rounded-lg border border-border/50">
                              <button
                                onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                                className="h-9 w-9 flex items-center justify-center rounded-l-lg hover:bg-muted transition-colors disabled:opacity-40"
                                disabled={item.quantity <= 1}
                                aria-label="Decrease quantity"
                              >
                                <Minus className="h-3.5 w-3.5" />
                              </button>
                              <span className="w-10 text-center text-sm font-medium">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                                className="h-9 w-9 flex items-center justify-center rounded-r-lg hover:bg-muted transition-colors"
                                aria-label="Increase quantity"
                              >
                                <Plus className="h-3.5 w-3.5" />
                              </button>
                            </div>

                            <div className="flex items-center gap-3">
                              {/* Line Total (mobile) */}
                              <span className="sm:hidden font-semibold">{formatPrice(lineTotal)}</span>

                              <button
                                onClick={() => {
                                  removeItem(item.productId);
                                  toast.success('Item removed from cart');
                                }}
                                className="h-9 w-9 flex items-center justify-center rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                                aria-label="Remove item"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Sidebar - Order Summary */}
        <div className="lg:w-[360px] xl:w-[380px] shrink-0 space-y-4">
          <OrderSummaryCard
            subtotal={subtotal}
            shipping={shipping}
            tax={tax}
            total={total}
            itemCount={itemCount}
            showPromo
          />

          <Button
            onClick={() => navigate('checkout')}
            className="w-full h-12 rounded-xl text-base font-semibold bg-gradient-to-r from-indigo-500 to-blue-600 text-white hover:from-indigo-600 hover:to-blue-700 shadow-lg shadow-indigo-500/25 transition-all"
            size="lg"
          >
            Proceed to Checkout
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   CheckoutPage
   ═══════════════════════════════════════════════════════════ */

export function CheckoutPage() {
  const navigate = useRouterStore((s) => s.navigate);
  const { items, cartProducts, clearAll, getTotal } = useCartStore();
  const { subtotal, shipping, tax, total, itemCount } = getTotal();
  const { user, isAuthenticated, addAddress } = useAuthStore();
  const addNotification = useNotificationStore((s) => s.addNotification);

  const [paymentMethod, setPaymentMethod] = useState('credit-card');
  const [selectedAddressId, setSelectedAddressId] = useState<string>(
    user?.addresses.find((a) => a.isDefault)?.id ?? user?.addresses[0]?.id ?? ''
  );
  const [showNewAddressForm, setShowNewAddressForm] = useState(user?.addresses.length === 0);
  const [newAddress, setNewAddress] = useState<Omit<Address, 'id'>>(emptyAddress);
  const [placing, setPlacing] = useState(false);

  // Auth guard
  if (!isAuthenticated) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <Breadcrumb className="mb-6">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink onClick={() => navigate('home')} className="cursor-pointer">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink onClick={() => navigate('cart')} className="cursor-pointer">Cart</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Checkout</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="h-16 w-16 rounded-2xl bg-muted flex items-center justify-center mb-4">
            <Shield className="h-8 w-8 text-muted-foreground" />
          </div>
          <h2 className="text-xl font-semibold mb-2">Please sign in</h2>
          <p className="text-sm text-muted-foreground max-w-md mb-6">
            You need to be signed in to complete your purchase. Sign in to continue to checkout.
          </p>
          <Button
            onClick={() => navigate('login')}
            className="rounded-xl bg-gradient-to-r from-indigo-500 to-blue-600 text-white hover:from-indigo-600 hover:to-blue-700"
          >
            Sign In
          </Button>
        </div>
      </div>
    );
  }

  const handleAddressFieldChange = (field: keyof Omit<Address, 'id'>, value: string | boolean) => {
    setNewAddress((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveNewAddress = () => {
    const address: Address = {
      ...newAddress,
      id: `addr-${Date.now()}`,
    };
    addAddress(address);
    setSelectedAddressId(address.id);
    setShowNewAddressForm(false);
    setNewAddress(emptyAddress);
    toast.success('Address added successfully');
  };

  const getSelectedAddress = (): Address | null => {
    if (showNewAddressForm) return null;
    return user?.addresses.find((a) => a.id === selectedAddressId) ?? null;
  };

  const isAddressComplete = (addr: Omit<Address, 'id'>): boolean => {
    return !!(
      addr.firstName.trim() &&
      addr.lastName.trim() &&
      addr.street.trim() &&
      addr.city.trim() &&
      addr.state.trim() &&
      addr.zipCode.trim() &&
      addr.phone.trim()
    );
  };

  const handlePlaceOrder = () => {
    const selectedAddress = getSelectedAddress();

    // If showing new address form, validate it
    if (showNewAddressForm) {
      if (!isAddressComplete(newAddress)) {
        toast.error('Please complete the shipping address');
        return;
      }
    } else if (!selectedAddress) {
      toast.error('Please select a shipping address');
      return;
    }

    if (items.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    setPlacing(true);

    // Build order items
    const orderItems: OrderItem[] = items.map((item) => {
      const product = cartProducts.find((p) => p.id === item.productId);
      return {
        productId: item.productId,
        name: product?.name ?? 'Unknown Product',
        price: product?.price ?? 0,
        quantity: item.quantity,
        image: product?.images[0] ?? '',
      };
    });

    const shippingAddress: Address = showNewAddressForm
      ? { ...newAddress, id: `addr-${Date.now()}` }
      : selectedAddress!;

    const paymentMethodLabel =
      paymentMethod === 'credit-card'
        ? 'Credit Card'
        : paymentMethod === 'paypal'
          ? 'PayPal'
          : 'Bank Transfer';

    const order: Order = {
      id: `order-${Date.now()}`,
      userId: user!.id,
      items: orderItems,
      subtotal,
      shipping,
      tax,
      total,
      status: 'pending',
      shippingAddress,
      paymentMethod: paymentMethodLabel,
      createdAt: new Date().toISOString(),
    };

    // Simulate a brief delay
    setTimeout(() => {
      addOrder(order);
      addNotification({
        id: `notif-${Date.now()}`,
        title: 'Order Placed',
        message: `Your order #${order.id} has been placed successfully!`,
        type: 'order',
        read: false,
        createdAt: new Date().toISOString(),
        link: 'order-details',
      });
      clearAll();
      setPlacing(false);
      navigate('order-success', { orderId: order.id });
    }, 800);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      {/* Breadcrumb */}
      <Breadcrumb className="mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink onClick={() => navigate('home')} className="cursor-pointer">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink onClick={() => navigate('cart')} className="cursor-pointer">Cart</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Checkout</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <h1 className="text-2xl md:text-3xl font-bold mb-8">Checkout</h1>

      <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
        {/* Left Column - Shipping & Payment */}
        <div className="flex-1 space-y-8">
          {/* Shipping Address Section */}
          <section>
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Truck className="h-5 w-5 text-indigo-500" />
              Shipping Address
            </h2>

            {/* Saved Addresses */}
            {user?.addresses && user.addresses.length > 0 && !showNewAddressForm && (
              <div className="space-y-3 mb-4">
                {user.addresses.map((address) => (
                  <motion.div
                    key={address.id}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                  >
                    <Card
                      className={`cursor-pointer transition-all border-2 ${
                        selectedAddressId === address.id
                          ? 'border-indigo-500 shadow-md shadow-indigo-500/10'
                          : 'border-border/50 hover:border-border'
                      }`}
                      onClick={() => setSelectedAddressId(address.id)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-sm font-medium">{address.label || 'Address'}</span>
                              {address.isDefault && (
                                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400 font-medium">
                                  Default
                                </span>
                              )}
                              {selectedAddressId === address.id && (
                                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400 font-medium flex items-center gap-0.5">
                                  <Check className="h-2.5 w-2.5" /> Selected
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {address.firstName} {address.lastName}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {address.street}
                              {address.apartment ? `, ${address.apartment}` : ''}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {address.city}, {address.state} {address.zipCode}
                            </p>
                            {address.phone && (
                              <p className="text-sm text-muted-foreground">{address.phone}</p>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}

                <Button
                  variant="outline"
                  onClick={() => {
                    setShowNewAddressForm(true);
                    setSelectedAddressId('');
                  }}
                  className="w-full rounded-xl border-dashed"
                >
                  <Plus className="h-4 w-4 mr-2" /> Add New Address
                </Button>
              </div>
            )}

            {/* New Address Form */}
            {showNewAddressForm && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="border-border/50">
                  <CardContent className="p-4 md:p-6 space-y-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium">New Shipping Address</h3>
                      {user?.addresses && user.addresses.length > 0 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setShowNewAddressForm(false);
                            setSelectedAddressId(
                              user.addresses.find((a) => a.isDefault)?.id ?? user.addresses[0]?.id ?? ''
                            );
                          }}
                        >
                          Cancel
                        </Button>
                      )}
                    </div>

                    {/* Label */}
                    <div className="space-y-1.5">
                      <Label htmlFor="addr-label">Address Label</Label>
                      <Input
                        id="addr-label"
                        placeholder="e.g. Home, Office"
                        value={newAddress.label}
                        onChange={(e) => handleAddressFieldChange('label', e.target.value)}
                        className="rounded-lg"
                      />
                    </div>

                    {/* Name Row */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <Label htmlFor="addr-firstName">First Name *</Label>
                        <Input
                          id="addr-firstName"
                          placeholder="John"
                          value={newAddress.firstName}
                          onChange={(e) => handleAddressFieldChange('firstName', e.target.value)}
                          className="rounded-lg"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="addr-lastName">Last Name *</Label>
                        <Input
                          id="addr-lastName"
                          placeholder="Doe"
                          value={newAddress.lastName}
                          onChange={(e) => handleAddressFieldChange('lastName', e.target.value)}
                          className="rounded-lg"
                        />
                      </div>
                    </div>

                    {/* Street */}
                    <div className="space-y-1.5">
                      <Label htmlFor="addr-street">Street Address *</Label>
                      <Input
                        id="addr-street"
                        placeholder="123 Main Street"
                        value={newAddress.street}
                        onChange={(e) => handleAddressFieldChange('street', e.target.value)}
                        className="rounded-lg"
                      />
                    </div>

                    {/* Apartment */}
                    <div className="space-y-1.5">
                      <Label htmlFor="addr-apartment">Apartment, Suite, etc.</Label>
                      <Input
                        id="addr-apartment"
                        placeholder="Apt 4B"
                        value={newAddress.apartment}
                        onChange={(e) => handleAddressFieldChange('apartment', e.target.value)}
                        className="rounded-lg"
                      />
                    </div>

                    {/* City / State / Zip */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div className="col-span-2 sm:col-span-1 space-y-1.5">
                        <Label htmlFor="addr-city">City *</Label>
                        <Input
                          id="addr-city"
                          placeholder="New York"
                          value={newAddress.city}
                          onChange={(e) => handleAddressFieldChange('city', e.target.value)}
                          className="rounded-lg"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="addr-state">State *</Label>
                        <Input
                          id="addr-state"
                          placeholder="NY"
                          value={newAddress.state}
                          onChange={(e) => handleAddressFieldChange('state', e.target.value)}
                          className="rounded-lg"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="addr-zipCode">Zip Code *</Label>
                        <Input
                          id="addr-zipCode"
                          placeholder="10001"
                          value={newAddress.zipCode}
                          onChange={(e) => handleAddressFieldChange('zipCode', e.target.value)}
                          className="rounded-lg"
                        />
                      </div>
                    </div>

                    {/* Phone */}
                    <div className="space-y-1.5">
                      <Label htmlFor="addr-phone">Phone *</Label>
                      <Input
                        id="addr-phone"
                        placeholder="+1 234 567 8900"
                        value={newAddress.phone}
                        onChange={(e) => handleAddressFieldChange('phone', e.target.value)}
                        className="rounded-lg"
                      />
                    </div>

                    <Button
                      onClick={handleSaveNewAddress}
                      className="rounded-xl bg-gradient-to-r from-indigo-500 to-blue-600 text-white hover:from-indigo-600 hover:to-blue-700"
                      disabled={!isAddressComplete(newAddress)}
                    >
                      Save Address
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </section>

          {/* Payment Method Section */}
          <section>
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-indigo-500" />
              Payment Method
            </h2>

            <RadioGroup
              value={paymentMethod}
              onValueChange={setPaymentMethod}
              className="space-y-3"
            >
              {/* Credit Card */}
              <Card className={`border-2 transition-all cursor-pointer ${
                paymentMethod === 'credit-card'
                  ? 'border-indigo-500 shadow-md shadow-indigo-500/10'
                  : 'border-border/50 hover:border-border'
              }`} onClick={() => setPaymentMethod('credit-card')}>
                <CardContent className="p-4 flex items-center gap-3">
                  <RadioGroupItem value="credit-card" id="pay-credit-card" />
                  <Label htmlFor="pay-credit-card" className="flex items-center gap-2 cursor-pointer flex-1">
                    <CreditCard className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Credit Card</span>
                  </Label>
                  <div className="flex gap-1.5">
                    <div className="h-7 w-11 rounded bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-[8px] text-white font-bold">VISA</div>
                    <div className="h-7 w-11 rounded bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center text-[8px] text-white font-bold">MC</div>
                  </div>
                </CardContent>
              </Card>

              {/* PayPal */}
              <Card className={`border-2 transition-all cursor-pointer ${
                paymentMethod === 'paypal'
                  ? 'border-indigo-500 shadow-md shadow-indigo-500/10'
                  : 'border-border/50 hover:border-border'
              }`} onClick={() => setPaymentMethod('paypal')}>
                <CardContent className="p-4 flex items-center gap-3">
                  <RadioGroupItem value="paypal" id="pay-paypal" />
                  <Label htmlFor="pay-paypal" className="flex items-center gap-2 cursor-pointer flex-1">
                    <Banknote className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">PayPal</span>
                  </Label>
                  <span className="text-xs text-muted-foreground">Pay securely with PayPal</span>
                </CardContent>
              </Card>

              {/* Bank Transfer */}
              <Card className={`border-2 transition-all cursor-pointer ${
                paymentMethod === 'bank-transfer'
                  ? 'border-indigo-500 shadow-md shadow-indigo-500/10'
                  : 'border-border/50 hover:border-border'
              }`} onClick={() => setPaymentMethod('bank-transfer')}>
                <CardContent className="p-4 flex items-center gap-3">
                  <RadioGroupItem value="bank-transfer" id="pay-bank-transfer" />
                  <Label htmlFor="pay-bank-transfer" className="flex items-center gap-2 cursor-pointer flex-1">
                    <Banknote className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Bank Transfer</span>
                  </Label>
                  <span className="text-xs text-muted-foreground">Direct bank payment</span>
                </CardContent>
              </Card>
            </RadioGroup>
          </section>
        </div>

        {/* Right Column - Order Summary */}
        <div className="lg:w-[360px] xl:w-[380px] shrink-0 space-y-4">
          <OrderSummaryCard
            subtotal={subtotal}
            shipping={shipping}
            tax={tax}
            total={total}
            itemCount={itemCount}
            readOnly
          />

          {/* Item Preview */}
          <Card className="border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-muted-foreground">
                {itemCount} {itemCount === 1 ? 'item' : 'items'} in your order
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 max-h-48 overflow-y-auto">
              {items.map((item) => {
                const product = cartProducts.find((p) => p.id === item.productId);
                if (!product) return null;
                return (
                  <div key={item.productId} className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-lg overflow-hidden shrink-0 bg-muted">
                      <ProductImage src={product.images[0]} alt={product.name} className="w-full h-full" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{product.name}</p>
                      <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                    </div>
                    <span className="text-sm font-medium shrink-0">
                      {formatPrice(product.price * item.quantity)}
                    </span>
                  </div>
                );
              })}
            </CardContent>
          </Card>

          {/* Place Order Button */}
          <Button
            onClick={handlePlaceOrder}
            disabled={placing || (!showNewAddressForm && !selectedAddressId) || items.length === 0}
            className="w-full h-14 rounded-xl text-base font-semibold bg-gradient-to-r from-indigo-500 to-blue-600 text-white hover:from-indigo-600 hover:to-blue-700 shadow-lg shadow-indigo-500/25 transition-all disabled:opacity-50"
            size="lg"
          >
            {placing ? (
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Processing...
              </div>
            ) : (
              <>
                Place Order
                <ArrowRight className="h-4 w-4 ml-2" />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   OrderSuccessPage
   ═══════════════════════════════════════════════════════════ */

export function OrderSuccessPage() {
  const navigate = useRouterStore((s) => s.navigate);
  const params = useRouterStore((s) => s.params);
  const orderId = params.orderId ?? '';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.1 }}
          className="mb-8"
        >
          {/* Animated Check Icon */}
          <div className="relative h-28 w-28 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-xl shadow-emerald-500/30">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 300, damping: 12, delay: 0.4 }}
            >
              <Check className="h-14 w-14 text-white" strokeWidth={3} />
            </motion.div>
            {/* Pulse rings */}
            <motion.div
              className="absolute inset-0 rounded-full border-4 border-emerald-400"
              initial={{ scale: 1, opacity: 0.5 }}
              animate={{ scale: 1.5, opacity: 0 }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'easeOut' }}
            />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <h1 className="text-3xl md:text-4xl font-bold mb-3">Order Confirmed!</h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.65 }}
        >
          <p className="text-muted-foreground text-base md:text-lg mb-2">
            Thank you for your purchase
          </p>
        </motion.div>

        {orderId && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="mb-8"
          >
            <p className="text-sm text-muted-foreground">
              Order number:{' '}
              <span className="font-mono font-semibold text-foreground">{orderId}</span>
            </p>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.95 }}
          className="flex flex-col sm:flex-row gap-3 mt-4"
        >
          <Button
            onClick={() => navigate('home')}
            variant="outline"
            size="lg"
            className="rounded-xl min-w-[180px]"
          >
            Continue Shopping
          </Button>
          {orderId && (
            <Button
              onClick={() => navigate('order-details', { orderId })}
              size="lg"
              className="rounded-xl min-w-[180px] bg-gradient-to-r from-indigo-500 to-blue-600 text-white hover:from-indigo-600 hover:to-blue-700 shadow-lg shadow-indigo-500/25"
            >
              View Order
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          )}
        </motion.div>
      </div>
    </div>
  );
}
