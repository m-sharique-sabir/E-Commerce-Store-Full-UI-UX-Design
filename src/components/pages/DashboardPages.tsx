'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  User,
  Package,
  Heart,
  Bell,
  Settings,
  MapPin,
  Phone,
  Mail,
  Edit,
  Trash2,
  Plus,
  ChevronRight,
  Eye,
  ShoppingBag,
  Calendar,
  CreditCard,
  Truck,
  Check,
  X,
  Star,
} from 'lucide-react';
import { useRouterStore, useAuthStore, useWishlistStore, useCartStore, useNotificationStore } from '@/stores';
import { getStoredProducts, getStoredOrders, getUserOrders, addReview, getProductReviews } from '@/lib/storage';
import { ProductCard, ProductImage, Rating, EmptyState } from '@/components/shared';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { Order, Product } from '@/lib/types';

/* ═══════════════════════════════════════════════════════════
   Shared Helpers & Animation Variants
   ═══════════════════════════════════════════════════════════ */

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const staggerItem = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' } },
};

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

function timeAgo(dateStr: string): string {
  const now = new Date();
  const date = new Date(dateStr);
  const diffMs = now.getTime() - date.getTime();
  const diffMinutes = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMinutes < 1) return 'Just now';
  if (diffMinutes < 60) return `${diffMinutes}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 30) return `${diffDays}d ago`;
  return formatDate(dateStr);
}

const statusConfig: Record<Order['status'], { color: string; label: string }> = {
  pending: { color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400', label: 'Pending' },
  processing: { color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400', label: 'Processing' },
  shipped: { color: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400', label: 'Shipped' },
  delivered: { color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400', label: 'Delivered' },
  cancelled: { color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400', label: 'Cancelled' },
};

/* ─── Breadcrumb Helper ─── */

function PageBreadcrumb({
  items,
}: {
  items: { label: string; onClick?: () => void }[];
}) {
  return (
    <nav aria-label="breadcrumb" className="mb-6">
      <ol className="flex flex-wrap items-center gap-1.5 text-sm text-muted-foreground sm:gap-2.5">
        {items.map((item, i) => (
          <React.Fragment key={i}>
            {i > 0 && (
              <li role="presentation" aria-hidden="true">
                <ChevronRight className="h-3.5 w-3.5" />
              </li>
            )}
            <li className="inline-flex items-center gap-1.5">
              {item.onClick ? (
                <button
                  onClick={item.onClick}
                  className="hover:text-foreground transition-colors"
                >
                  {item.label}
                </button>
              ) : (
                <span className="text-foreground font-normal">{item.label}</span>
              )}
            </li>
          </React.Fragment>
        ))}
      </ol>
    </nav>
  );
}

/* ═══════════════════════════════════════════════════════════
   DashboardPage
   ═══════════════════════════════════════════════════════════ */

export function DashboardPage() {
  const navigate = useRouterStore((s) => s.navigate);
  const user = useAuthStore((s) => s.user);
  const cartItems = useCartStore((s) => s.items);
  const wishlistProducts = useWishlistStore((s) => s.wishlistProducts);
  const unreadCount = useNotificationStore((s) => s.unreadCount);

  const recentOrders = useMemo(() => {
    if (!user) return [];
    return getUserOrders(user.id).slice(0, 3);
  }, [user]);

  const stats = [
    {
      label: 'Total Orders',
      value: recentOrders.length,
      icon: Package,
      color: 'from-indigo-500 to-blue-600',
      shadowColor: 'shadow-indigo-500/25',
    },
    {
      label: 'Wishlist Items',
      value: wishlistProducts.length,
      icon: Heart,
      color: 'from-rose-500 to-pink-500',
      shadowColor: 'shadow-rose-500/25',
    },
    {
      label: 'Cart Items',
      value: cartItems.length,
      icon: ShoppingBag,
      color: 'from-amber-500 to-orange-500',
      shadowColor: 'shadow-amber-500/25',
    },
    {
      label: 'Notifications',
      value: unreadCount,
      icon: Bell,
      color: 'from-emerald-500 to-teal-500',
      shadowColor: 'shadow-emerald-500/25',
    },
  ];

  const quickLinks = [
    { label: 'Edit Profile', icon: Edit, page: 'profile' as const, color: 'from-indigo-500 to-blue-600' },
    { label: 'View Orders', icon: Package, page: 'orders' as const, color: 'from-blue-500 to-cyan-500' },
    { label: 'Wishlist', icon: Heart, page: 'wishlist' as const, color: 'from-rose-500 to-pink-500' },
    { label: 'Notifications', icon: Bell, page: 'notifications' as const, color: 'from-amber-500 to-orange-500' },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <PageBreadcrumb
          items={[
            { label: 'Home', onClick: () => navigate('home') },
            { label: 'Dashboard' },
          ]}
        />

        {/* Welcome */}
        <motion.div variants={fadeIn} initial="hidden" animate="visible" className="mb-8">
          <h1 className="text-2xl font-bold sm:text-3xl">
            Welcome back, <span className="bg-gradient-to-r from-indigo-500 to-blue-600 bg-clip-text text-transparent">{user?.name || 'Guest'}</span> 👋
          </h1>
          <p className="text-muted-foreground mt-1">Here&apos;s what&apos;s happening with your account today.</p>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4 mb-8"
        >
          {stats.map((stat) => (
            <motion.div key={stat.label} variants={staggerItem}>
              <Card className="relative overflow-hidden border-border/50 hover:shadow-md transition-shadow">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex items-center gap-3">
                    <div className={`flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-xl bg-gradient-to-br ${stat.color} shadow-lg ${stat.shadowColor}`}>
                      <stat.icon className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold sm:text-3xl">{stat.value}</p>
                      <p className="text-xs text-muted-foreground sm:text-sm">{stat.label}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Recent Orders */}
        <motion.div variants={fadeIn} initial="hidden" animate="visible" className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold sm:text-xl">Recent Orders</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('orders')}
              className="text-indigo-600 hover:text-indigo-700 dark:text-indigo-400"
            >
              View All <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>

          {recentOrders.length === 0 ? (
            <Card className="border-border/50">
              <CardContent className="p-6">
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <Package className="h-10 w-10 text-muted-foreground mb-3" />
                  <p className="text-sm text-muted-foreground">No orders yet</p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {recentOrders.map((order, idx) => (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: idx * 0.08 }}
                >
                  <Card
                    className="border-border/50 hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => navigate('order-details', { orderId: order.id })}
                  >
                    <CardContent className="p-4 sm:p-6">
                      <div className="flex items-center justify-between gap-4">
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <p className="font-semibold text-sm sm:text-base">#{order.id.slice(-8)}</p>
                            <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${statusConfig[order.status].color}`}>
                              {statusConfig[order.status].label}
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">
                            {formatDate(order.createdAt)} · {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                          </p>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="font-semibold">${order.total.toFixed(2)}</p>
                          <ChevronRight className="h-4 w-4 text-muted-foreground ml-auto mt-1" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Quick Links */}
        <motion.div variants={staggerContainer} initial="hidden" animate="visible">
          <h2 className="text-lg font-semibold sm:text-xl mb-4">Quick Links</h2>
          <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
            {quickLinks.map((link) => (
              <motion.div key={link.label} variants={staggerItem}>
                <Card
                  className="border-border/50 hover:shadow-md transition-all cursor-pointer group"
                  onClick={() => navigate(link.page)}
                >
                  <CardContent className="p-4 sm:p-6 flex flex-col items-center text-center gap-3">
                    <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${link.color} shadow-lg group-hover:scale-110 transition-transform`}>
                      <link.icon className="h-6 w-6 text-white" />
                    </div>
                    <p className="font-medium text-sm">{link.label}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   ProfilePage
   ═══════════════════════════════════════════════════════════ */

export function ProfilePage() {
  const navigate = useRouterStore((s) => s.navigate);
  const { user, isAuthenticated, updateProfile, addAddress, removeAddress, updateAddress } = useAuthStore();

  const [name, setName] = useState(() => user?.name ?? '');
  const [email, setEmail] = useState(() => user?.email ?? '');
  const [phone, setPhone] = useState(() => user?.phone ?? '');
  const [activeTab, setActiveTab] = useState('personal');

  // Address form state
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null);
  const [addressForm, setAddressForm] = useState({
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
  });

  // Settings state
  const [darkMode, setDarkMode] = useState(false);
  const [notifOrders, setNotifOrders] = useState(true);
  const [notifPromos, setNotifPromos] = useState(true);
  const [notifSystem, setNotifSystem] = useState(true);

  // Keep form fields in sync when user changes
  const [prevUser, setPrevUser] = useState(user);
  if (user !== prevUser) {
    setPrevUser(user);
    if (user) {
      setName(user.name);
      setEmail(user.email);
      setPhone(user.phone);
    }
  }

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('login');
    }
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated || !user) return null;

  const handleSaveProfile = () => {
    if (!name.trim() || !email.trim()) {
      toast.error('Name and email are required');
      return;
    }
    updateProfile({ name, email, phone });
    toast.success('Profile updated successfully');
  };

  const resetAddressForm = () => {
    setAddressForm({
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
    });
    setEditingAddressId(null);
    setShowAddressForm(false);
  };

  const handleSaveAddress = () => {
    if (!addressForm.label.trim() || !addressForm.street.trim() || !addressForm.city.trim()) {
      toast.error('Please fill in required address fields');
      return;
    }
    if (editingAddressId) {
      updateAddress({ ...addressForm, id: editingAddressId });
      toast.success('Address updated');
    } else {
      addAddress({ ...addressForm, id: `addr-${Date.now()}` });
      toast.success('Address added');
    }
    resetAddressForm();
  };

  const handleEditAddress = (addr: (typeof user.addresses)[0]) => {
    setEditingAddressId(addr.id);
    setAddressForm({
      label: addr.label,
      firstName: addr.firstName,
      lastName: addr.lastName,
      street: addr.street,
      apartment: addr.apartment,
      city: addr.city,
      state: addr.state,
      zipCode: addr.zipCode,
      country: addr.country,
      phone: addr.phone,
      isDefault: addr.isDefault,
    });
    setShowAddressForm(true);
  };

  const handleDeleteAddress = (addressId: string) => {
    removeAddress(addressId);
    toast.success('Address removed');
  };

  const initial = user.name.charAt(0).toUpperCase();

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <PageBreadcrumb
          items={[
            { label: 'Home', onClick: () => navigate('home') },
            { label: 'Dashboard', onClick: () => navigate('dashboard') },
            { label: 'Profile' },
          ]}
        />

        {/* Profile Header */}
        <motion.div variants={fadeIn} initial="hidden" animate="visible" className="mb-8">
          <Card className="border-border/50 overflow-hidden">
            <CardContent className="p-6 sm:p-8">
              <div className="flex items-center gap-4 sm:gap-6">
                <div className="flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-blue-600 text-white text-2xl sm:text-3xl font-bold shadow-lg shadow-indigo-500/25 shrink-0">
                  {initial}
                </div>
                <div className="min-w-0">
                  <h1 className="text-xl font-bold sm:text-2xl truncate">{user.name}</h1>
                  <p className="text-sm text-muted-foreground flex items-center gap-1.5 mt-1">
                    <Mail className="h-3.5 w-3.5 shrink-0" />
                    <span className="truncate">{user.email}</span>
                  </p>
                  {user.phone && (
                    <p className="text-sm text-muted-foreground flex items-center gap-1.5 mt-0.5">
                      <Phone className="h-3.5 w-3.5 shrink-0" />
                      <span>{user.phone}</span>
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Tabs */}
        <motion.div variants={fadeIn} initial="hidden" animate="visible">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="w-full sm:w-auto">
              <TabsTrigger value="personal" className="flex-1 sm:flex-none">
                <User className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Personal Info</span>
                <span className="sm:hidden">Info</span>
              </TabsTrigger>
              <TabsTrigger value="addresses" className="flex-1 sm:flex-none">
                <MapPin className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Addresses</span>
                <span className="sm:hidden">Address</span>
              </TabsTrigger>
              <TabsTrigger value="settings" className="flex-1 sm:flex-none">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </TabsTrigger>
            </TabsList>

            {/* Personal Info Tab */}
            <TabsContent value="personal" className="mt-6">
              <Card className="border-border/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Personal Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-3 sm:gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="profile-name">Full Name</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="profile-name"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="pl-10"
                          placeholder="Your name"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="profile-email">Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="profile-email"
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="pl-10"
                          placeholder="your@email.com"
                        />
                      </div>
                    </div>
                    <div className="space-y-2 sm:col-span-2">
                      <Label htmlFor="profile-phone">Phone</Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="profile-phone"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          className="pl-10"
                          placeholder="+1 234 567 8900"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="mt-6 flex justify-end">
                    <Button
                      onClick={handleSaveProfile}
                      className="bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-indigo-600 hover:to-blue-700 text-white shadow-lg shadow-indigo-500/25"
                    >
                      <Check className="h-4 w-4 mr-2" />
                      Save Changes
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Addresses Tab */}
            <TabsContent value="addresses" className="mt-6">
              <Card className="border-border/50">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <MapPin className="h-5 w-5" />
                      Saved Addresses
                    </CardTitle>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        resetAddressForm();
                        setShowAddressForm(true);
                      }}
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Add New
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {/* Address Form */}
                  {showAddressForm && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mb-6 rounded-xl border border-border/50 p-4 sm:p-6 bg-muted/30"
                    >
                      <h3 className="font-semibold mb-4">
                        {editingAddressId ? 'Edit Address' : 'Add New Address'}
                      </h3>
                      <div className="grid gap-3 sm:gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                          <Label>Label</Label>
                          <Input
                            placeholder="Home, Office, etc."
                            value={addressForm.label}
                            onChange={(e) => setAddressForm((f) => ({ ...f, label: e.target.value }))}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>First Name</Label>
                          <Input
                            placeholder="John"
                            value={addressForm.firstName}
                            onChange={(e) => setAddressForm((f) => ({ ...f, firstName: e.target.value }))}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Last Name</Label>
                          <Input
                            placeholder="Doe"
                            value={addressForm.lastName}
                            onChange={(e) => setAddressForm((f) => ({ ...f, lastName: e.target.value }))}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Street</Label>
                          <Input
                            placeholder="123 Main St"
                            value={addressForm.street}
                            onChange={(e) => setAddressForm((f) => ({ ...f, street: e.target.value }))}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Apartment</Label>
                          <Input
                            placeholder="Apt 4B"
                            value={addressForm.apartment}
                            onChange={(e) => setAddressForm((f) => ({ ...f, apartment: e.target.value }))}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>City</Label>
                          <Input
                            placeholder="New York"
                            value={addressForm.city}
                            onChange={(e) => setAddressForm((f) => ({ ...f, city: e.target.value }))}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>State</Label>
                          <Input
                            placeholder="NY"
                            value={addressForm.state}
                            onChange={(e) => setAddressForm((f) => ({ ...f, state: e.target.value }))}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>ZIP Code</Label>
                          <Input
                            placeholder="10001"
                            value={addressForm.zipCode}
                            onChange={(e) => setAddressForm((f) => ({ ...f, zipCode: e.target.value }))}
                          />
                        </div>
                        <div className="space-y-2 sm:col-span-2">
                          <Label>Phone</Label>
                          <Input
                            placeholder="+1 234 567 8900"
                            value={addressForm.phone}
                            onChange={(e) => setAddressForm((f) => ({ ...f, phone: e.target.value }))}
                          />
                        </div>
                      </div>
                      <div className="mt-4 flex justify-end gap-2">
                        <Button variant="outline" onClick={resetAddressForm}>
                          <X className="h-4 w-4 mr-1" />
                          Cancel
                        </Button>
                        <Button
                          onClick={handleSaveAddress}
                          className="bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-indigo-600 hover:to-blue-700 text-white"
                        >
                          <Check className="h-4 w-4 mr-1" />
                          {editingAddressId ? 'Update' : 'Save'} Address
                        </Button>
                      </div>
                    </motion.div>
                  )}

                  {/* Address List */}
                  {user.addresses.length === 0 && !showAddressForm ? (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                      <MapPin className="h-10 w-10 text-muted-foreground mb-3" />
                      <p className="text-sm text-muted-foreground">No saved addresses</p>
                      <Button
                        variant="outline"
                        size="sm"
                        className="mt-3"
                        onClick={() => setShowAddressForm(true)}
                      >
                        <Plus className="h-4 w-4 mr-1" />
                        Add Address
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {user.addresses.map((addr, idx) => (
                        <motion.div
                          key={addr.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: idx * 0.05 }}
                          className="flex items-start gap-4 rounded-xl border border-border/50 p-4 hover:border-border transition-colors"
                        >
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted">
                            <MapPin className="h-5 w-5 text-muted-foreground" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-semibold text-sm">{addr.label}</span>
                              {addr.isDefault && (
                                <Badge variant="secondary" className="text-xs">Default</Badge>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">
                              {addr.firstName} {addr.lastName}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {addr.street}{addr.apartment ? `, ${addr.apartment}` : ''}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {addr.city}, {addr.state} {addr.zipCode}
                            </p>
                            {addr.phone && (
                              <p className="text-sm text-muted-foreground">{addr.phone}</p>
                            )}
                          </div>
                          <div className="flex gap-1 shrink-0">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => handleEditAddress(addr)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-destructive hover:text-destructive"
                              onClick={() => handleDeleteAddress(addr.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Settings Tab */}
            <TabsContent value="settings" className="mt-6">
              <Card className="border-border/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5" />
                    Preferences
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Theme */}
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-sm">Dark Mode</p>
                      <p className="text-xs text-muted-foreground">Toggle dark/light theme</p>
                    </div>
                    <button
                      onClick={() => {
                        setDarkMode(!darkMode);
                        toast.info(darkMode ? 'Light mode enabled' : 'Dark mode enabled');
                      }}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        darkMode ? 'bg-indigo-500' : 'bg-muted'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          darkMode ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>

                  <Separator />

                  {/* Notification Preferences */}
                  <div>
                    <h3 className="font-medium text-sm mb-4">Notification Preferences</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm">Order Updates</p>
                          <p className="text-xs text-muted-foreground">Get notified about order status changes</p>
                        </div>
                        <button
                          onClick={() => {
                            setNotifOrders(!notifOrders);
                            toast.info(notifOrders ? 'Order notifications disabled' : 'Order notifications enabled');
                          }}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            notifOrders ? 'bg-indigo-500' : 'bg-muted'
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              notifOrders ? 'translate-x-6' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm">Promotions</p>
                          <p className="text-xs text-muted-foreground">Receive deals and special offers</p>
                        </div>
                        <button
                          onClick={() => {
                            setNotifPromos(!notifPromos);
                            toast.info(notifPromos ? 'Promo notifications disabled' : 'Promo notifications enabled');
                          }}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            notifPromos ? 'bg-indigo-500' : 'bg-muted'
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              notifPromos ? 'translate-x-6' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm">System Alerts</p>
                          <p className="text-xs text-muted-foreground">Important account notifications</p>
                        </div>
                        <button
                          onClick={() => {
                            setNotifSystem(!notifSystem);
                            toast.info(notifSystem ? 'System notifications disabled' : 'System notifications enabled');
                          }}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            notifSystem ? 'bg-indigo-500' : 'bg-muted'
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              notifSystem ? 'translate-x-6' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Danger Zone */}
                  <div>
                    <h3 className="font-medium text-sm text-destructive mb-2">Danger Zone</h3>
                    <p className="text-xs text-muted-foreground mb-3">
                      Once you delete your account, there is no going back.
                    </p>
                    <Button variant="destructive" size="sm" onClick={() => toast.info('Account deletion is not available in demo mode')}>
                      Delete Account
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   OrdersPage
   ═══════════════════════════════════════════════════════════ */

export function OrdersPage() {
  const navigate = useRouterStore((s) => s.navigate);
  const { user, isAuthenticated } = useAuthStore();
  const orders = useMemo(() => {
    if (!user) return [];
    return getUserOrders(user.id);
  }, [user]);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('login');
    }
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated || !user) return null;

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <PageBreadcrumb
          items={[
            { label: 'Home', onClick: () => navigate('home') },
            { label: 'Dashboard', onClick: () => navigate('dashboard') },
            { label: 'Orders' },
          ]}
        />

        <motion.div variants={fadeIn} initial="hidden" animate="visible" className="mb-6">
          <h1 className="text-2xl font-bold sm:text-3xl">My Orders</h1>
          <p className="text-muted-foreground mt-1">Track and manage your orders</p>
        </motion.div>

        {orders.length === 0 ? (
          <motion.div variants={fadeIn} initial="hidden" animate="visible">
            <EmptyState
              icon={Package}
              title="No orders yet"
              description="When you place orders, they will appear here."
              action={{ label: 'Start Shopping', onClick: () => navigate('shop') }}
            />
          </motion.div>
        ) : (
          <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="space-y-4">
            {orders.map((order, idx) => (
              <motion.div key={order.id} variants={staggerItem}>
                <Card className="border-border/50 hover:shadow-md transition-shadow">
                  <CardContent className="p-4 sm:p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-semibold">#{order.id.slice(-8)}</h3>
                          <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${statusConfig[order.status].color}`}>
                            {statusConfig[order.status].label}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground flex-wrap">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3.5 w-3.5" />
                            {formatDate(order.createdAt)}
                          </span>
                          <span className="flex items-center gap-1">
                            <ShoppingBag className="h-3.5 w-3.5" />
                            {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                          </span>
                        </div>
                        {/* Items Preview */}
                        <div className="flex items-center gap-2 mt-3">
                          {order.items.slice(0, 3).map((item) => (
                            <div
                              key={item.productId}
                              className="h-10 w-10 rounded-lg bg-muted overflow-hidden shrink-0"
                            >
                              {item.image ? (
                                <ProductImage src={item.image} alt={item.name} className="h-full w-full" />
                              ) : (
                                <div className="h-full w-full flex items-center justify-center">
                                  <Package className="h-4 w-4 text-muted-foreground" />
                                </div>
                              )}
                            </div>
                          ))}
                          {order.items.length > 3 && (
                            <span className="text-xs text-muted-foreground">
                              +{order.items.length - 3} more
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="font-bold text-lg">${order.total.toFixed(2)}</p>
                        <Button
                          variant="outline"
                          size="sm"
                          className="mt-2"
                          onClick={() => navigate('order-details', { orderId: order.id })}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          View Details
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   OrderDetailsPage
   ═══════════════════════════════════════════════════════════ */

export function OrderDetailsPage() {
  const navigate = useRouterStore((s) => s.navigate);
  const params = useRouterStore((s) => s.params);
  const order = useMemo(() => {
    const orderId = params.orderId;
    if (!orderId) return null;
    const allOrders = getStoredOrders();
    return allOrders.find((o) => o.id === orderId) || null;
  }, [params.orderId]);

  const products = useMemo(() => getStoredProducts(), []);

  if (!order) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <EmptyState
          icon={Package}
          title="Order not found"
          description="The order you're looking for doesn't exist."
          action={{ label: 'Back to Orders', onClick: () => navigate('orders') }}
        />
      </div>
    );
  }

  const statusSteps: { key: Order['status']; label: string; icon: React.ElementType }[] = [
    { key: 'pending', label: 'Pending', icon: Calendar },
    { key: 'processing', label: 'Processing', icon: Settings },
    { key: 'shipped', label: 'Shipped', icon: Truck },
    { key: 'delivered', label: 'Delivered', icon: Check },
  ];

  const currentStepIndex = statusSteps.findIndex((s) => s.key === order.status);
  const isCancelled = order.status === 'cancelled';

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <PageBreadcrumb
          items={[
            { label: 'Home', onClick: () => navigate('home') },
            { label: 'Dashboard', onClick: () => navigate('dashboard') },
            { label: 'Orders', onClick: () => navigate('orders') },
            { label: `#${order.id.slice(-8)}` },
          ]}
        />

        {/* Header */}
        <motion.div variants={fadeIn} initial="hidden" animate="visible" className="mb-6 flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-bold sm:text-3xl">Order #{order.id.slice(-8)}</h1>
            <p className="text-muted-foreground mt-1">Placed on {formatDate(order.createdAt)}</p>
          </div>
          <span className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${statusConfig[order.status].color}`}>
            {statusConfig[order.status].label}
          </span>
        </motion.div>

        {/* Status Timeline */}
        <motion.div variants={fadeIn} initial="hidden" animate="visible" className="mb-8">
          <Card className="border-border/50">
            <CardContent className="p-4 sm:p-6">
              {isCancelled ? (
                <div className="flex items-center gap-3 text-destructive">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-destructive/10">
                    <X className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-semibold">Order Cancelled</p>
                    <p className="text-sm text-muted-foreground">This order has been cancelled.</p>
                  </div>
                </div>
              ) : (
                <div>
                  {/* Mobile: Vertical Timeline */}
                  <div className="sm:hidden space-y-3">
                    {statusSteps.map((step, idx) => {
                      const isCompleted = idx <= currentStepIndex;
                      const isCurrent = idx === currentStepIndex;
                      return (
                        <div key={step.key} className="flex items-center gap-3">
                          <div
                            className={`flex h-8 w-8 items-center justify-center rounded-full border-2 transition-all shrink-0 ${
                              isCompleted
                                ? 'bg-gradient-to-br from-indigo-500 to-blue-600 border-indigo-500 text-white shadow-lg shadow-indigo-500/25'
                                : 'bg-background border-muted text-muted-foreground'
                            } ${isCurrent ? 'scale-110' : ''}`}
                          >
                            <step.icon className="h-3.5 w-3.5" />
                          </div>
                          <p className={`text-sm font-medium ${isCompleted ? 'text-foreground' : 'text-muted-foreground'}`}>
                            {step.label}
                          </p>
                          {isCurrent && (
                            <span className="ml-auto text-xs text-indigo-500 font-medium">Current</span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                  {/* Desktop: Horizontal Timeline */}
                  <div className="hidden sm:flex items-center justify-between relative">
                    {/* Connecting Line */}
                    <div className="absolute top-5 left-0 right-0 h-0.5 bg-muted mx-10" />
                    <div
                      className="absolute top-5 left-0 h-0.5 bg-gradient-to-r from-indigo-500 to-blue-600 transition-all"
                      style={{ width: `${(currentStepIndex / (statusSteps.length - 1)) * 100}%`, marginLeft: '2.5rem' }}
                    />

                    {statusSteps.map((step, idx) => {
                      const isCompleted = idx <= currentStepIndex;
                      const isCurrent = idx === currentStepIndex;
                      return (
                        <div key={step.key} className="flex flex-col items-center relative z-10 flex-1">
                          <div
                            className={`flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all ${
                              isCompleted
                                ? 'bg-gradient-to-br from-indigo-500 to-blue-600 border-indigo-500 text-white shadow-lg shadow-indigo-500/25'
                                : 'bg-background border-muted text-muted-foreground'
                            } ${isCurrent ? 'scale-110' : ''}`}
                          >
                            <step.icon className="h-4 w-4" />
                          </div>
                          <p className={`text-xs mt-2 font-medium ${isCompleted ? 'text-foreground' : 'text-muted-foreground'}`}>
                            {step.label}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Items */}
            <motion.div variants={fadeIn} initial="hidden" animate="visible">
              <Card className="border-border/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ShoppingBag className="h-5 w-5" />
                    Order Items ({order.items.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {order.items.map((item) => {
                      const product = products.find((p) => p.id === item.productId);
                      return (
                        <div
                          key={item.productId}
                          className="flex items-center gap-4 rounded-xl border border-border/50 p-3 hover:border-border transition-colors cursor-pointer"
                          onClick={() => navigate('product', { id: item.productId })}
                        >
                          <div className="h-16 w-16 rounded-lg bg-muted overflow-hidden shrink-0">
                            {item.image ? (
                              <ProductImage src={item.image} alt={item.name} className="h-full w-full" />
                            ) : product?.images[0] ? (
                              <ProductImage src={product.images[0]} alt={item.name} className="h-full w-full" />
                            ) : (
                              <div className="h-full w-full flex items-center justify-center">
                                <Package className="h-6 w-6 text-muted-foreground" />
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm truncate">{item.name}</p>
                            <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                          </div>
                          <div className="text-right shrink-0">
                            <p className="font-semibold">${(item.price * item.quantity).toFixed(2)}</p>
                            <p className="text-xs text-muted-foreground">${item.price.toFixed(2)} each</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Shipping Address */}
            <motion.div variants={fadeIn} initial="hidden" animate="visible">
              <Card className="border-border/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    Shipping Address
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-sm space-y-1">
                    <p className="font-medium">{order.shippingAddress.firstName} {order.shippingAddress.lastName}</p>
                    <p className="text-muted-foreground">{order.shippingAddress.street}</p>
                    {order.shippingAddress.apartment && (
                      <p className="text-muted-foreground">{order.shippingAddress.apartment}</p>
                    )}
                    <p className="text-muted-foreground">
                      {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}
                    </p>
                    <p className="text-muted-foreground">{order.shippingAddress.country}</p>
                    {order.shippingAddress.phone && (
                      <p className="text-muted-foreground">{order.shippingAddress.phone}</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Payment Method */}
            <motion.div variants={fadeIn} initial="hidden" animate="visible">
              <Card className="border-border/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <CreditCard className="h-5 w-5" />
                    Payment
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                      <CreditCard className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{order.paymentMethod}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Tracking */}
            {order.trackingNumber && (
              <motion.div variants={fadeIn} initial="hidden" animate="visible">
                <Card className="border-border/50">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base">
                      <Truck className="h-5 w-5" />
                      Tracking
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm font-mono bg-muted rounded-lg px-3 py-2">{order.trackingNumber}</p>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Order Summary */}
            <motion.div variants={fadeIn} initial="hidden" animate="visible">
              <Card className="border-border/50">
                <CardHeader>
                  <CardTitle className="text-base">Order Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span>${order.subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Shipping</span>
                      <span>{order.shipping === 0 ? 'Free' : `$${order.shipping.toFixed(2)}`}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Tax</span>
                      <span>${order.tax.toFixed(2)}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between font-bold text-base">
                      <span>Total</span>
                      <span>${order.total.toFixed(2)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   NotificationsPage
   ═══════════════════════════════════════════════════════════ */

export function NotificationsPage() {
  const navigate = useRouterStore((s) => s.navigate);
  const { notifications, markRead, markAllRead, unreadCount } = useNotificationStore();

  const notificationIcons: Record<string, React.ElementType> = {
    order: Package,
    promotion: Star,
    system: Settings,
    info: Bell,
  };

  const notificationColors: Record<string, string> = {
    order: 'from-indigo-500 to-blue-600 shadow-indigo-500/25',
    promotion: 'from-amber-500 to-orange-500 shadow-amber-500/25',
    system: 'from-emerald-500 to-teal-500 shadow-emerald-500/25',
    info: 'from-blue-500 to-cyan-500 shadow-blue-500/25',
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <PageBreadcrumb
          items={[
            { label: 'Home', onClick: () => navigate('home') },
            { label: 'Dashboard', onClick: () => navigate('dashboard') },
            { label: 'Notifications' },
          ]}
        />

        {/* Header */}
        <motion.div variants={fadeIn} initial="hidden" animate="visible" className="mb-6 flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-bold sm:text-3xl">Notifications</h1>
            <p className="text-muted-foreground mt-1">
              {unreadCount > 0 ? `You have ${unreadCount} unread notification${unreadCount !== 1 ? 's' : ''}` : 'You\'re all caught up!'}
            </p>
          </div>
          {unreadCount > 0 && (
            <Button variant="outline" size="sm" onClick={() => { markAllRead(); toast.success('All notifications marked as read'); }}>
              <Check className="h-4 w-4 mr-1" />
              Mark all as read
            </Button>
          )}
        </motion.div>

        {notifications.length === 0 ? (
          <motion.div variants={fadeIn} initial="hidden" animate="visible">
            <EmptyState
              icon={Bell}
              title="No notifications"
              description="You don't have any notifications right now. We'll let you know when something comes up!"
            />
          </motion.div>
        ) : (
          <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="space-y-3">
            {notifications.map((notif, idx) => {
              const Icon = notificationIcons[notif.type] || Bell;
              const colorClass = notificationColors[notif.type] || notificationColors.info;

              return (
                <motion.div
                  key={notif.id}
                  variants={staggerItem}
                  className={`group cursor-pointer rounded-xl border transition-all hover:shadow-md ${
                    notif.read ? 'border-border/50 bg-card' : 'border-border bg-card shadow-sm'
                  }`}
                  onClick={() => {
                    if (!notif.read) markRead(notif.id);
                    if (notif.link) {
                      navigate(notif.link as any, notif.link === 'order-details' ? { orderId: notif.message.match(/#(\S+)/)?.[1] || '' } : {});
                    }
                  }}
                >
                  <div className="flex items-start gap-3 sm:gap-4 p-4 sm:p-5">
                    {/* Icon */}
                    <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${colorClass} shadow-lg`}>
                      <Icon className="h-5 w-5 text-white" />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <h3 className={`text-sm font-semibold truncate ${!notif.read ? '' : 'text-muted-foreground'}`}>
                              {notif.title}
                            </h3>
                            {!notif.read && (
                              <span className="h-2 w-2 rounded-full bg-indigo-500 shrink-0" />
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground mt-0.5 line-clamp-2">
                            {notif.message}
                          </p>
                        </div>
                        <span className="text-xs text-muted-foreground whitespace-nowrap shrink-0">
                          {timeAgo(notif.createdAt)}
                        </span>
                      </div>
                    </div>

                    {/* Chevron */}
                    {notif.link && (
                      <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0 mt-1 group-hover:text-foreground transition-colors" />
                    )}
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   WishlistPage
   ═══════════════════════════════════════════════════════════ */

export function WishlistPage() {
  const navigate = useRouterStore((s) => s.navigate);
  const { wishlistProducts } = useWishlistStore();

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <PageBreadcrumb
          items={[
            { label: 'Home', onClick: () => navigate('home') },
            { label: 'Wishlist' },
          ]}
        />

        <motion.div variants={fadeIn} initial="hidden" animate="visible" className="mb-6">
          <h1 className="text-2xl font-bold sm:text-3xl">My Wishlist</h1>
          <p className="text-muted-foreground mt-1">
            {wishlistProducts.length > 0
              ? `${wishlistProducts.length} item${wishlistProducts.length !== 1 ? 's' : ''} saved`
              : 'Save items you love for later'}
          </p>
        </motion.div>

        {wishlistProducts.length === 0 ? (
          <motion.div variants={fadeIn} initial="hidden" animate="visible">
            <EmptyState
              icon={Heart}
              title="Your wishlist is empty"
              description="Start adding items you love to your wishlist by tapping the heart icon on any product."
              action={{ label: 'Explore Products', onClick: () => navigate('shop') }}
            />
          </motion.div>
        ) : (
          <motion.div variants={staggerContainer} initial="hidden" animate="visible">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6">
              {wishlistProducts.map((product, idx) => (
                <motion.div key={product.id} variants={staggerItem}>
                  <ProductCard product={product} index={idx} />
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
