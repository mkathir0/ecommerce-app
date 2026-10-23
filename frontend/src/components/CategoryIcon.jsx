import React from 'react';
import { Shirt, Gem, Cpu } from 'lucide-react';

/**
 * Modern, professional vector icons for MeShop's 5 departments.
 * Replaces tacky emoji with sharp, luxury-grade vector line assets.
 */
export default function CategoryIcon({ id, className = '', size = 20, strokeWidth = 1.75 }) {
  const categoryId = (id || '').toLowerCase();

  switch (categoryId) {
    case 'mens':
      return (
        <Shirt
          size={size}
          strokeWidth={strokeWidth}
          className={`shrink-0 ${className}`}
          aria-hidden="true"
        />
      );

    case 'womens':
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`shrink-0 ${className}`}
          aria-hidden="true"
        >
          {/* Modern haute-couture dress silhouette */}
          <path d="M9 3h6l1.2 3.5-3.2.8-1-1.8-1 1.8-3.2-.8L9 3z" />
          <path d="M8 6.5L4.5 15l3.5 5.5h8l3.5-5.5-3.5-8.5" />
          <path d="M7.8 14.5c2.6 1 5.8 1 8.4 0" />
        </svg>
      );

    case 'jewellery':
      return (
        <Gem
          size={size}
          strokeWidth={strokeWidth}
          className={`shrink-0 ${className}`}
          aria-hidden="true"
        />
      );

    case 'electronics':
      return (
        <Cpu
          size={size}
          strokeWidth={strokeWidth}
          className={`shrink-0 ${className}`}
          aria-hidden="true"
        />
      );

    case 'footwear':
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`shrink-0 ${className}`}
          aria-hidden="true"
        >
          {/* Sleek low-top athletic sneaker */}
          <path d="M2.5 14.5c0 1.4 1 2.5 2.5 2.5h14.5c1.4 0 2.5-1 2.5-2.2 0-2.3-1.8-4.2-4.2-4.6l-3.6-.7-2.7 2.5h-4c-2.8 0-5 2.2-5 5z" />
          <path d="M2 17.5v1.2c0 .7.6 1.3 1.3 1.3h17.4c.7 0 1.3-.6 1.3-1.3v-1.2" />
          <path d="M10.5 12l2.2-2.5" />
          <path d="M13.2 12.2l2.3-2.2" />
        </svg>
      );

    default:
      return (
        <Shirt
          size={size}
          strokeWidth={strokeWidth}
          className={`shrink-0 ${className}`}
          aria-hidden="true"
        />
      );
  }
}
