"use client";

import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import Image from "next/image";

interface Photo {
  id: number | string;
  url: string;
  thumbnailUrl?: string;
  largeUrl?: string;
  alt?: string | null;
}

interface PhotoGalleryProps {
  photos: Photo[];
}

export default function PhotoGallery({ photos }: PhotoGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const handlePrev = useCallback(() => {
    if (selectedIndex !== null) {
      setSelectedIndex((selectedIndex - 1 + photos.length) % photos.length);
    }
  }, [selectedIndex, photos.length]);

  const handleNext = useCallback(() => {
    if (selectedIndex !== null) {
      setSelectedIndex((selectedIndex + 1) % photos.length);
    }
  }, [selectedIndex, photos.length]);

  const handleClose = useCallback(() => {
    setSelectedIndex(null);
  }, []);

  useEffect(() => {
    if (selectedIndex === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") handlePrev();
      else if (e.key === "ArrowRight") handleNext();
      else if (e.key === "Escape") handleClose();
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [selectedIndex, handlePrev, handleNext, handleClose]);

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {photos.map((photo, index) => (
          <div
            key={photo.id}
            className="cursor-pointer rounded-lg overflow-hidden group"
            onClick={() => setSelectedIndex(index)}
          >
            <div className="relative h-48 md:h-56 transition-transform group-hover:scale-105">
              <Image
                src={photo.thumbnailUrl ?? photo.url}
                alt={photo.alt ?? ""}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
              />
            </div>
          </div>
        ))}
      </div>

      {/* Fullscreen lightbox */}
      {selectedIndex !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95"
          onClick={handleClose}
        >
          {/* Close button */}
          <button
            className="absolute top-4 right-4 z-10 text-white/70 hover:text-white transition-colors"
            onClick={handleClose}
          >
            <X className="size-8" />
          </button>

          {/* Prev */}
          <button
            className="absolute left-4 top-1/2 -translate-y-1/2 z-10 p-2 text-white/70 hover:text-white transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              handlePrev();
            }}
          >
            <ChevronLeft className="size-10" />
          </button>

          {/* Image */}
          <div
            className="relative w-[95vw] h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={photos[selectedIndex].largeUrl ?? photos[selectedIndex].url}
              alt={photos[selectedIndex].alt ?? ""}
              fill
              className="object-contain"
              sizes="95vw"
              priority
            />
          </div>

          {/* Next */}
          <button
            className="absolute right-4 top-1/2 -translate-y-1/2 z-10 p-2 text-white/70 hover:text-white transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              handleNext();
            }}
          >
            <ChevronRight className="size-10" />
          </button>
        </div>
      )}
    </>
  );
}
