"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";

interface Photo {
  id: number | string;
  url: string;
  thumbnailUrl?: string;
  largeUrl?: string;
  alt: string;
}

interface PhotoGalleryProps {
  photos: Photo[];
}

export default function PhotoGallery({ photos }: PhotoGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const handlePrev = () => {
    if (selectedIndex !== null) {
      setSelectedIndex((selectedIndex - 1 + photos.length) % photos.length);
    }
  };

  const handleNext = () => {
    if (selectedIndex !== null) {
      setSelectedIndex((selectedIndex + 1) % photos.length);
    }
  };

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
                alt={photo.alt}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
              />
            </div>
          </div>
        ))}
      </div>

      <Dialog
        open={selectedIndex !== null}
        onOpenChange={(open) => !open && setSelectedIndex(null)}
      >
        <DialogTitle className="sr-only">Galeria zdjęć</DialogTitle>
        <DialogContent className="max-w-4xl p-0 bg-transparent border-none">
          {selectedIndex !== null && (
            <div className="relative">
              <div className="relative h-[70vh] rounded-lg overflow-hidden">
                <Image
                  src={photos[selectedIndex].largeUrl ?? photos[selectedIndex].url}
                  alt={photos[selectedIndex].alt}
                  fill
                  className="object-contain"
                  sizes="90vw"
                />
              </div>

              <Button
                variant="ghost"
                size="icon"
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-background/50 hover:bg-background/80"
                onClick={handlePrev}
              >
                <ChevronLeft className="h-6 w-6" />
              </Button>

              <Button
                variant="ghost"
                size="icon"
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-background/50 hover:bg-background/80"
                onClick={handleNext}
              >
                <ChevronRight className="h-6 w-6" />
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
