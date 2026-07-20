'use client';

import React from 'react';
import { ShoppingBag, Mail, MapPin, Phone, Linkedin, Github } from 'lucide-react';
import { useRouterStore } from '@/stores';
import { getStoredCategories } from '@/lib/storage';

export function Footer() {
  const { navigate } = useRouterStore();
  const categories = typeof window !== 'undefined' ? getStoredCategories() : [];

  return (
    <footer className="relative border-t border-border/50 bg-gray-950 dark:bg-[#060812] text-white overflow-hidden">
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-indigo-950/10 via-transparent to-transparent pointer-events-none" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <button onClick={() => navigate('home')} className="flex items-center gap-2.5 mb-5">
              <div className="h-9 w-9 rounded-2xl bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center shadow-lg shadow-indigo-500/25">
                <ShoppingBag className="h-4 w-4 text-white" />
              </div>
              <span className="text-2xl font-bold tracking-tight">Luxe</span>
            </button>
            <p className="text-sm text-white/50 leading-relaxed mb-6 max-w-xs">
              Premium e-commerce experience with curated products from the world&apos;s best brands. Quality, style, and innovation delivered to your door.
            </p>
            <div className="flex items-center gap-2 text-sm text-white/40">
              <Mail className="h-4 w-4" />
              <a href="mailto:mohammadsharique2409950@gmail.com" className="hover:text-white transition-colors">
                mohammadsharique2409950@gmail.com
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-semibold mb-5 text-white/70 uppercase tracking-wider">Quick Links</h4>
            <ul className="space-y-3">
              {[
                { label: 'Home', page: 'home' as const },
                { label: 'Shop', page: 'shop' as const },
                { label: 'Categories', page: 'categories' as const },
                { label: 'About', page: 'about' as const },
                { label: 'Contact', page: 'contact' as const },
                { label: 'FAQ', page: 'faq' as const },
              ].map((link) => (
                <li key={link.page}>
                  <button
                    onClick={() => navigate(link.page)}
                    className="text-sm text-white/40 hover:text-white transition-colors duration-300"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-xs font-semibold mb-5 text-white/70 uppercase tracking-wider">Categories</h4>
            <ul className="space-y-3">
              {categories.slice(0, 6).map((cat) => (
                <li key={cat.id}>
                  <button
                    onClick={() => navigate('shop', { category: cat.slug })}
                    className="text-sm text-white/40 hover:text-white transition-colors duration-300"
                  >
                    {cat.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-xs font-semibold mb-5 text-white/70 uppercase tracking-wider">Contact Us</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-sm text-white/40">
                <MapPin className="h-4 w-4 mt-0.5 shrink-0" />
                <span>Islamabad, Pakistan</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-white/40">
                <Phone className="h-4 w-4 shrink-0" />
                <a href="https://wa.me/923392409950" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                  +92 339 2409950
                </a>
              </li>
              <li className="flex items-center gap-3 text-sm text-white/40">
                <Mail className="h-4 w-4 shrink-0" />
                <a href="mailto:mohammadsharique2409950@gmail.com" className="hover:text-white transition-colors">
                  mohammadsharique2409950@gmail.com
                </a>
              </li>
              <li className="flex items-center gap-3 text-sm text-white/40">
                <Linkedin className="h-4 w-4 shrink-0" />
                <a href="https://www.linkedin.com/in/m-sharique-sabir/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                  LinkedIn
                </a>
              </li>
              <li className="flex items-center gap-3 text-sm text-white/40">
                <Github className="h-4 w-4 shrink-0" />
                <a href="https://github.com/m-sharique-sabir" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                  GitHub
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-white/30">
            &copy; {new Date().getFullYear()} Mohammad Sharique Sabir. All rights reserved.
          </p>
          <div className="flex items-center gap-8">
            <button className="text-sm text-white/30 hover:text-white/70 transition-colors duration-300">Privacy Policy</button>
            <button className="text-sm text-white/30 hover:text-white/70 transition-colors duration-300">Terms of Service</button>
          </div>
        </div>
      </div>
    </footer>
  );
}
