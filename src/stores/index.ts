'use client';

import { create } from 'zustand';
import { RouterState, RoutePath, User, CartItem, WishlistItem, Order, Notification, Product } from '@/lib/types';
import * as storage from '@/lib/storage';

// Router Store
interface RouterStore {
  page: RoutePath;
  params: Record<string, string>;
  navigate: (page: RoutePath, params?: Record<string, string>) => void;
  goBack: () => void;
  history: { page: RoutePath; params: Record<string, string> }[];
}

export const useRouterStore = create<RouterStore>((set, get) => ({
  page: 'home',
  params: {},
  history: [],
  navigate: (page, params = {}) => {
    const { page: currentPage, params: currentParams, history } = get();
    set({
      history: [...history, { page: currentPage, params: currentParams }],
      page,
      params,
    });
    if (typeof window !== 'undefined') {
      const hash = params.id ? `#/${page}/${params.id}` : `#/${page}`;
      const queryParts = Object.entries(params)
        .filter(([k]) => k !== 'id')
        .map(([k, v]) => `${k}=${encodeURIComponent(v)}`);
      window.location.hash = queryParts.length > 0 ? `${hash}?${queryParts.join('&')}` : hash;
      window.scrollTo(0, 0);
    }
  },
  goBack: () => {
    const { history } = get();
    if (history.length > 0) {
      const prev = history[history.length - 1];
      set({ page: prev.page, params: prev.params, history: history.slice(0, -1) });
    }
  },
}));

// Auth Store
interface AuthStore {
  user: User | null;
  isAuthenticated: boolean;
  initialized: boolean;
  initialize: () => void;
  login: (email: string, password: string) => boolean;
  register: (name: string, email: string, password: string) => boolean;
  logout: () => void;
  updateProfile: (updates: Partial<User>) => void;
  addAddress: (address: User['addresses'][0]) => void;
  removeAddress: (addressId: string) => void;
  updateAddress: (address: User['addresses'][0]) => void;
}

export const useAuthStore = create<AuthStore>((set, get) => ({
  user: null,
  isAuthenticated: false,
  initialized: false,
  initialize: () => {
    const user = storage.getCurrentUser();
    set({ user, isAuthenticated: !!user, initialized: true });
  },
  login: (email, password) => {
    const user = storage.loginUser(email, password);
    if (user) {
      set({ user, isAuthenticated: true });
      return true;
    }
    return false;
  },
  register: (name, email, password) => {
    const newUser: User = {
      id: `user-${Date.now()}`,
      name,
      email,
      password,
      avatar: '',
      phone: '',
      addresses: [],
      createdAt: new Date().toISOString(),
    };
    const success = storage.registerUser(newUser);
    if (success) {
      storage.loginUser(email, password);
      set({ user: newUser, isAuthenticated: true });
      return true;
    }
    return false;
  },
  logout: () => {
    storage.logoutUser();
    set({ user: null, isAuthenticated: false });
  },
  updateProfile: (updates) => {
    const { user } = get();
    if (!user) return;
    const updated = { ...user, ...updates };
    storage.updateUser(updated);
    set({ user: updated });
  },
  addAddress: (address) => {
    const { user } = get();
    if (!user) return;
    const updated = { ...user, addresses: [...user.addresses, address] };
    storage.updateUser(updated);
    set({ user: updated });
  },
  removeAddress: (addressId) => {
    const { user } = get();
    if (!user) return;
    const updated = { ...user, addresses: user.addresses.filter((a) => a.id !== addressId) };
    storage.updateUser(updated);
    set({ user: updated });
  },
  updateAddress: (address) => {
    const { user } = get();
    if (!user) return;
    const updated = { ...user, addresses: user.addresses.map((a) => (a.id === address.id ? address : a)) };
    storage.updateUser(updated);
    set({ user: updated });
  },
}));

// Cart Store
interface CartStore {
  items: CartItem[];
  cartProducts: Product[];
  initialized: boolean;
  initialize: () => void;
  addItem: (productId: string, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearAll: () => void;
  getTotal: () => { subtotal: number; shipping: number; tax: number; total: number; itemCount: number };
}

export const useCartStore = create<CartStore>((set, get) => ({
  items: [],
  cartProducts: [],
  initialized: false,
  initialize: () => {
    const items = storage.getStoredCart();
    const products = storage.getStoredProducts();
    const cartProducts = items.map((item) => products.find((p) => p.id === item.productId)).filter(Boolean) as Product[];
    set({ items, cartProducts, initialized: true });
  },
  addItem: (productId, quantity = 1) => {
    const items = storage.addToCart(productId, quantity);
    const products = storage.getStoredProducts();
    const cartProducts = items.map((item) => products.find((p) => p.id === item.productId)).filter(Boolean) as Product[];
    set({ items, cartProducts });
  },
  removeItem: (productId) => {
    const items = storage.removeFromCart(productId);
    const cartProducts = get().cartProducts.filter((p) => p.id !== productId);
    set({ items, cartProducts });
  },
  updateQuantity: (productId, quantity) => {
    const items = storage.updateCartQuantity(productId, quantity);
    set({ items });
  },
  clearAll: () => {
    storage.clearCart();
    set({ items: [], cartProducts: [] });
  },
  getTotal: () => {
    const { items, cartProducts } = get();
    let subtotal = 0;
    items.forEach((item) => {
      const product = cartProducts.find((p) => p.id === item.productId);
      if (product) subtotal += product.price * item.quantity;
    });
    const shipping = subtotal > 100 ? 0 : 9.99;
    const tax = subtotal * 0.08;
    const total = subtotal + shipping + tax;
    const itemCount = items.reduce((acc, item) => acc + item.quantity, 0);
    return { subtotal, shipping, tax, total, itemCount };
  },
}));

// Wishlist Store
interface WishlistStore {
  items: WishlistItem[];
  wishlistProducts: Product[];
  initialized: boolean;
  initialize: () => void;
  toggleItem: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
}

export const useWishlistStore = create<WishlistStore>((set, get) => ({
  items: [],
  wishlistProducts: [],
  initialized: false,
  initialize: () => {
    const items = storage.getStoredWishlist();
    const products = storage.getStoredProducts();
    const wishlistProducts = items.map((item) => products.find((p) => p.id === item.productId)).filter(Boolean) as Product[];
    set({ items, wishlistProducts, initialized: true });
  },
  toggleItem: (productId) => {
    const items = storage.toggleWishlist(productId);
    const products = storage.getStoredProducts();
    const wishlistProducts = items.map((item) => products.find((p) => p.id === item.productId)).filter(Boolean) as Product[];
    set({ items, wishlistProducts });
  },
  isInWishlist: (productId) => {
    return get().items.some((item) => item.productId === productId);
  },
}));

// Notification Store
interface NotificationStore {
  notifications: Notification[];
  unreadCount: number;
  initialized: boolean;
  initialize: () => void;
  markRead: (id: string) => void;
  markAllRead: () => void;
  addNotification: (notification: Notification) => void;
}

export const useNotificationStore = create<NotificationStore>((set, get) => ({
  notifications: [],
  unreadCount: 0,
  initialized: false,
  initialize: () => {
    const notifications = storage.getStoredNotifications();
    const unreadCount = notifications.filter((n) => !n.read).length;
    set({ notifications, unreadCount, initialized: true });
  },
  markRead: (id) => {
    storage.markNotificationRead(id);
    const notifications = storage.getStoredNotifications();
    const unreadCount = notifications.filter((n) => !n.read).length;
    set({ notifications, unreadCount });
  },
  markAllRead: () => {
    storage.markAllNotificationsRead();
    set({ unreadCount: 0 });
    const notifications = storage.getStoredNotifications();
    set({ notifications });
  },
  addNotification: (notification) => {
    storage.addNotification(notification);
    const notifications = storage.getStoredNotifications();
    const unreadCount = notifications.filter((n) => !n.read).length;
    set({ notifications, unreadCount });
  },
}));

// Recently Viewed Store
interface RecentlyViewedStore {
  productIds: string[];
  products: Product[];
  initialized: boolean;
  initialize: () => void;
  addProduct: (productId: string) => void;
}

export const useRecentlyViewedStore = create<RecentlyViewedStore>((set) => ({
  productIds: [],
  products: [],
  initialized: false,
  initialize: () => {
    const productIds = storage.getRecentlyViewed();
    const allProducts = storage.getStoredProducts();
    const products = productIds.map((id) => allProducts.find((p) => p.id === id)).filter(Boolean) as Product[];
    set({ productIds, products, initialized: true });
  },
  addProduct: (productId) => {
    storage.addRecentlyViewed(productId);
    const productIds = storage.getRecentlyViewed();
    const allProducts = storage.getStoredProducts();
    const products = productIds.map((id) => allProducts.find((p) => p.id === id)).filter(Boolean) as Product[];
    set({ productIds, products });
  },
}));

// Search Store
interface SearchStore {
  query: string;
  history: string[];
  setQuery: (query: string) => void;
  addToHistory: (query: string) => void;
  clearHistory: () => void;
}

export const useSearchStore = create<SearchStore>((set) => ({
  query: '',
  history: [],
  setQuery: (query) => set({ query }),
  addToHistory: (query) => {
    storage.addSearchQuery(query);
    const history = storage.getSearchHistory().map((h) => h.query);
    set({ history });
  },
  clearHistory: () => {
    storage.clearSearchHistory();
    set({ history: [] });
  },
}));

// Data Store (products loaded from localStorage)
interface DataStore {
  products: Product[];
  initialized: boolean;
  initialize: () => void;
}

export const useDataStore = create<DataStore>((set) => ({
  products: [],
  initialized: false,
  initialize: () => {
    const products = storage.getStoredProducts();
    set({ products, initialized: true });
  },
}));
