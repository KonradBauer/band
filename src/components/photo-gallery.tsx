"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface Photo {
  id: number;
  gradient: string;
  label: string;
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
            <div
              className={cn(
                "h-48 md:h-56 bg-gradient-to-br transition-transform group-hover:scale-105 flex items-center justify-center",
                photo.gradient
              )}
            >
              <span className="text-muted-foreground/20 text-sm font-medium">
                {photo.label}
              </span>
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
              <div
                className={cn(
                  "h-[70vh] bg-gradient-to-br rounded-lg flex items-center justify-center",
                  photos[selectedIndex].gradient
                )}
              >
                <span className="text-muted-foreground/20 text-sm font-medium">
                  {photos[selectedIndex].label}
                </span>
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
