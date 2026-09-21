"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import type { ProductImage } from "@/types";

interface ProductGalleryProps {
  images: ProductImage[];
  className?: string;
}

export function ProductGallery({ images, className }: ProductGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const thumbnailsRef = useRef<HTMLDivElement>(null);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const sortedImages = [...images].sort((a, b) => a.sortOrder - b.sortOrder);
  const currentImage = sortedImages[activeIndex];

  const goTo = useCallback(
    (index: number) => {
      if (index >= 0 && index < sortedImages.length) {
        setActiveIndex(index);
      }
    },
    [sortedImages.length]
  );

  const goNext = useCallback(() => {
    goTo(Math.min(activeIndex + 1, sortedImages.length - 1));
  }, [activeIndex, goTo, sortedImages.length]);

  const goPrev = useCallback(() => {
    goTo(Math.max(activeIndex - 1, 0));
  }, [activeIndex, goTo]);

  // Swipe handling for mobile
  const onTouchStart = useCallback((e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  }, []);

  const onTouchMove = useCallback((e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  }, []);

  const onTouchEnd = useCallback(() => {
    if (touchStart === null || touchEnd === null) return;
    const distance = touchStart - touchEnd;
    const minSwipe = 50;
    if (distance > minSwipe) goNext();
    else if (distance < -minSwipe) goPrev();
  }, [touchStart, touchEnd, goNext, goPrev]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") goPrev();
      if (e.key === "ArrowLeft") goNext();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [goNext, goPrev]);

  if (sortedImages.length === 0) {
    return (
      <div className={cn("flex items-center justify-center aspect-square bg-brand-secondary-light rounded-xl border border-brand-border-light", className)}>
        <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="text-brand-text-muted">
          <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
          <circle cx="9" cy="9" r="2" />
          <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
        </svg>
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col gap-4", className)}>
      {/* Main image */}
      <div
        className="relative aspect-square overflow-hidden rounded-xl bg-brand-secondary-light border border-brand-border-light"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        {currentImage && (
          <Image
            src={currentImage.url}
            alt={currentImage.alt_text || ""}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
            priority
          />
        )}

        {/* Navigation arrows */}
        {sortedImages.length > 1 && (
          <>
            <button
              onClick={goPrev}
              disabled={activeIndex === 0}
              className="absolute top-1/2 right-3 -translate-y-1/2 flex items-center justify-center w-9 h-9 rounded-full bg-white/80 text-brand-text shadow-md hover:bg-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              aria-label="الصورة السابقة"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m9 18 6-6-6-6" />
              </svg>
            </button>
            <button
              onClick={goNext}
              disabled={activeIndex === sortedImages.length - 1}
              className="absolute top-1/2 left-3 -translate-y-1/2 flex items-center justify-center w-9 h-9 rounded-full bg-white/80 text-brand-text shadow-md hover:bg-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              aria-label="الصورة التالية"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m15 18-6-6 6-6" />
              </svg>
            </button>
          </>
        )}

        {/* Dots indicator (mobile) */}
        {sortedImages.length > 1 && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 md:hidden">
            {sortedImages.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                className={cn(
                  "w-2 h-2 rounded-full transition-all cursor-pointer",
                  i === activeIndex ? "bg-brand-primary w-5" : "bg-brand-primary/30"
                )}
                aria-label={`صورة ${i + 1}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Thumbnails */}
      {sortedImages.length > 1 && (
        <div
          ref={thumbnailsRef}
          className="hidden md:flex items-center gap-2 overflow-x-auto pb-1"
        >
          {sortedImages.map((image, index) => (
            <button
              key={image.id}
              onClick={() => goTo(index)}
              className={cn(
                "relative shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all cursor-pointer",
                index === activeIndex
                  ? "border-brand-accent shadow-md"
                  : "border-brand-border-light hover:border-brand-border"
              )}
              aria-label={`صورة ${index + 1}`}
            >
              <Image
                src={image.url}
                alt={image.alt_text || ""}
                fill
                sizes="80px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
