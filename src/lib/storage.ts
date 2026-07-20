'use client';

import { Product, Category, Brand, Review, User, CartItem, WishlistItem, Order, Notification, SearchHistory } from './types';
import { getProducts, getCategories, getBrands, getReviews } from './data';

const STORAGE_KEYS = {
  PRODUCTS: 'ecom_products',
  CATEGORIES: 'ecom_categories',
  BRANDS: 'ecom_brands',
  REVIEWS: 'ecom_reviews',
  USERS: 'ecom_users',
  CURRENT_USER: 'ecom_current_user',
  CART: 'ecom_cart',
  WISHLIST: 'ecom_wishlist',
  ORDERS: 'ecom_orders',
  NOTIFICATIONS: 'ecom_notifications',
  THEME: 'ecom_theme',
  SEARCH_HISTORY: 'ecom_search_history',
  RECENTLY_VIEWED: 'ecom_recently_viewed',
  INITIALIZED: 'ecom_initialized',
};

function isBrowser(): boolean {
  return typeof window !== 'undefined';
}

function getFromStorage<T>(key: string, defaultValue: T): T {
  if (!isBrowser()) return defaultValue;
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch {
    return defaultValue;
  }
}

function setToStorage<T>(key: string, value: T): void {
  if (!isBrowser()) return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    console.warn(`Failed to save to localStorage: ${key}`);
  }
}

export function initializeData(): void {
  if (!isBrowser()) return;
  const initialized = getFromStorage(STORAGE_KEYS.INITIALIZED, false);
  if (!initialized) {
    setToStorage(STORAGE_KEYS.PRODUCTS, getProducts());
    setToStorage(STORAGE_KEYS.CATEGORIES, getCategories());
    setToStorage(STORAGE_KEYS.BRANDS, getBrands());
    setToStorage(STORAGE_KEYS.REVIEWS, getReviews());
    setToStorage(STORAGE_KEYS.USERS, [
      {
        id: 'user-1',
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
        avatar: '',
        phone: '+1 234 567 8900',
        addresses: [
          {
            id: 'addr-1',
            label: 'Home',
            firstName: 'John',
            lastName: 'Doe',
            street: '123 Main Street',
            apartment: 'Apt 4B',
            city: 'New York',
            state: 'NY',
            zipCode: '10001',
            country: 'United States',
            phone: '+1 234 567 8900',
            isDefault: true,
          },
        ],
        createdAt: new Date().toISOString(),
      },
    ]);
    setToStorage(STORAGE_KEYS.CART, []);
    setToStorage(STORAGE_KEYS.WISHLIST, []);
    setToStorage(STORAGE_KEYS.ORDERS, [
      {
        id: 'order-demo-1',
        userId: 'user-1',
        items: [
          { productId: 'prod-1', name: 'iPhone 15 Pro Max', price: 1199, quantity: 1, image: '' },
          { productId: 'prod-4', name: 'AirPods Pro 2', price: 249, quantity: 2, image: '' },
        ],
        subtotal: 1697,
        shipping: 0,
        tax: 135.76,
        total: 1832.76,
        status: 'delivered',
        shippingAddress: {
          id: 'addr-1',
          label: 'Home',
          firstName: 'John',
          lastName: 'Doe',
          street: '123 Main Street',
          apartment: 'Apt 4B',
          city: 'New York',
          state: 'NY',
          zipCode: '10001',
          country: 'United States',
          phone: '+1 234 567 8900',
          isDefault: true,
        },
        paymentMethod: 'Credit Card',
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        trackingNumber: 'TRK123456789',
      },
    ]);
    setToStorage(STORAGE_KEYS.NOTIFICATIONS, [
      {
        id: 'notif-1',
        title: 'Order Delivered',
        message: 'Your order #order-demo-1 has been delivered successfully!',
        type: 'order',
        read: false,
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        link: 'order-details',
      },
      {
        id: 'notif-2',
        title: 'Welcome to Luxe Store!',
        message: 'Thanks for joining! Enjoy 10% off your first order with code WELCOME10.',
        type: 'promotion',
        read: false,
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      },
    ]);
    setToStorage(STORAGE_KEYS.SEARCH_HISTORY, []);
    setToStorage(STORAGE_KEYS.RECENTLY_VIEWED, []);
    setToStorage(STORAGE_KEYS.INITIALIZED, true);
  }
}

// Products
export function getStoredProducts(): Product[] {
  return getFromStorage<Product[]>(STORAGE_KEYS.PRODUCTS, []);
}

// Categories
export function getStoredCategories(): Category[] {
  return getFromStorage<Category[]>(STORAGE_KEYS.CATEGORIES, []);
}

// Brands
export function getStoredBrands(): Brand[] {
  return getFromStorage<Brand[]>(STORAGE_KEYS.BRANDS, []);
}

// Reviews
export function getStoredReviews(): Review[] {
  return getFromStorage<Review[]>(STORAGE_KEYS.REVIEWS, []);
}

export function getProductReviews(productId: string): Review[] {
  return getStoredReviews().filter((r) => r.productId === productId);
}

export function addReview(review: Review): void {
  const reviews = getStoredReviews();
  reviews.push(review);
  setToStorage(STORAGE_KEYS.REVIEWS, reviews);
}

// Users
export function getStoredUsers(): User[] {
  return getFromStorage<User[]>(STORAGE_KEYS.USERS, []);
}

export function registerUser(user: User): boolean {
  const users = getStoredUsers();
  if (users.find((u) => u.email === user.email)) return false;
  users.push(user);
  setToStorage(STORAGE_KEYS.USERS, users);
  return true;
}

export function loginUser(email: string, password: string): User | null {
  const users = getStoredUsers();
  const user = users.find((u) => u.email === email && u.password === password);
  if (user) {
    setToStorage(STORAGE_KEYS.CURRENT_USER, user);
    return user;
  }
  return null;
}

export function getCurrentUser(): User | null {
  return getFromStorage<User | null>(STORAGE_KEYS.CURRENT_USER, null);
}

export function logoutUser(): void {
  setToStorage(STORAGE_KEYS.CURRENT_USER, null);
}

export function updateUser(updatedUser: User): void {
  const users = getStoredUsers();
  const index = users.findIndex((u) => u.id === updatedUser.id);
  if (index !== -1) {
    users[index] = updatedUser;
    setToStorage(STORAGE_KEYS.USERS, users);
  }
  setToStorage(STORAGE_KEYS.CURRENT_USER, updatedUser);
}

// Cart
export function getStoredCart(): CartItem[] {
  return getFromStorage<CartItem[]>(STORAGE_KEYS.CART, []);
}

export function addToCart(productId: string, quantity: number = 1): CartItem[] {
  const cart = getStoredCart();
  const existing = cart.find((item) => item.productId === productId);
  if (existing) {
    existing.quantity += quantity;
  } else {
    cart.push({ productId, quantity });
  }
  setToStorage(STORAGE_KEYS.CART, cart);
  return cart;
}

export function removeFromCart(productId: string): CartItem[] {
  const cart = getStoredCart().filter((item) => item.productId !== productId);
  setToStorage(STORAGE_KEYS.CART, cart);
  return cart;
}

export function updateCartQuantity(productId: string, quantity: number): CartItem[] {
  const cart = getStoredCart();
  const item = cart.find((i) => i.productId === productId);
  if (item) {
    item.quantity = Math.max(1, quantity);
  }
  setToStorage(STORAGE_KEYS.CART, cart);
  return cart;
}

export function clearCart(): void {
  setToStorage(STORAGE_KEYS.CART, []);
}

// Wishlist
export function getStoredWishlist(): WishlistItem[] {
  return getFromStorage<WishlistItem[]>(STORAGE_KEYS.WISHLIST, []);
}

export function toggleWishlist(productId: string): WishlistItem[] {
  const wishlist = getStoredWishlist();
  const index = wishlist.findIndex((item) => item.productId === productId);
  if (index !== -1) {
    wishlist.splice(index, 1);
  } else {
    wishlist.push({ productId, addedAt: new Date().toISOString() });
  }
  setToStorage(STORAGE_KEYS.WISHLIST, wishlist);
  return wishlist;
}

export function isInWishlist(productId: string): boolean {
  return getStoredWishlist().some((item) => item.productId === productId);
}

// Orders
export function getStoredOrders(): Order[] {
  return getFromStorage<Order[]>(STORAGE_KEYS.ORDERS, []);
}

export function addOrder(order: Order): void {
  const orders = getStoredOrders();
  orders.unshift(order);
  setToStorage(STORAGE_KEYS.ORDERS, orders);
  clearCart();
}

export function getUserOrders(userId: string): Order[] {
  return getStoredOrders().filter((o) => o.userId === userId);
}

// Notifications
export function getStoredNotifications(): Notification[] {
  return getFromStorage<Notification[]>(STORAGE_KEYS.NOTIFICATIONS, []);
}

export function addNotification(notification: Notification): void {
  const notifications = getStoredNotifications();
  notifications.unshift(notification);
  setToStorage(STORAGE_KEYS.NOTIFICATIONS, notifications);
}

export function markNotificationRead(id: string): void {
  const notifications = getStoredNotifications();
  const n = notifications.find((n) => n.id === id);
  if (n) n.read = true;
  setToStorage(STORAGE_KEYS.NOTIFICATIONS, notifications);
}

export function markAllNotificationsRead(): void {
  const notifications = getStoredNotifications();
  notifications.forEach((n) => (n.read = true));
  setToStorage(STORAGE_KEYS.NOTIFICATIONS, notifications);
}

// Search History
export function getSearchHistory(): SearchHistory[] {
  return getFromStorage<SearchHistory[]>(STORAGE_KEYS.SEARCH_HISTORY, []);
}

export function addSearchQuery(query: string): void {
  const history = getSearchHistory().filter((h) => h.query !== query);
  history.unshift({ query, searchedAt: new Date().toISOString() });
  setToStorage(STORAGE_KEYS.SEARCH_HISTORY, history.slice(0, 20));
}

export function clearSearchHistory(): void {
  setToStorage(STORAGE_KEYS.SEARCH_HISTORY, []);
}

// Recently Viewed
export function getRecentlyViewed(): string[] {
  return getFromStorage<string[]>(STORAGE_KEYS.RECENTLY_VIEWED, []);
}

export function addRecentlyViewed(productId: string): void {
  let viewed = getRecentlyViewed().filter((id) => id !== productId);
  viewed.unshift(productId);
  setToStorage(STORAGE_KEYS.RECENTLY_VIEWED, viewed.slice(0, 20));
}

// Theme
export function getStoredTheme(): string {
  return getFromStorage<string>(STORAGE_KEYS.THEME, 'system');
}

export function setStoredTheme(theme: string): void {
  setToStorage(STORAGE_KEYS.THEME, theme);
}
