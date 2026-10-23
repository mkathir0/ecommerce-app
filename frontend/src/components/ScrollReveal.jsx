import React, { useEffect, useRef, useState } from 'react';

/**
 * ScrollReveal: Detects when elements enter the viewport and triggers
 * smooth, high-end glide-in animations with cubic-bezier easing.
 */
export default function ScrollReveal({
  children,
  className = '',
  delay = 0,
  threshold = 0.1,
  direction = 'up', // 'up' | 'none' | 'scale'
}) {
  const ref = useRef(null);
  const [isRevealed, setIsRevealed] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    // If IntersectionObserver is not supported, reveal immediately
    if (!('IntersectionObserver' in window)) {
      setIsRevealed(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsRevealed(true);
          observer.unobserve(node);
        }
      },
      {
        threshold,
        rootMargin: '0px 0px -40px 0px',
      }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [threshold]);

  const style = delay ? { transitionDelay: `${delay}ms` } : undefined;

  let initialTransformClass = 'translate-y-8';
  if (direction === 'none') initialTransformClass = '';
  if (direction === 'scale') initialTransformClass = 'scale-95 translate-y-4';

  return (
    <div
      ref={ref}
      style={style}
      className={`transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
        isRevealed
          ? 'opacity-100 translate-y-0 scale-100'
          : `opacity-0 ${initialTransformClass}`
      } ${className}`}
    >
      {children}
    </div>
  );
}
