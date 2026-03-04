"use client";

import { useState, useCallback, useRef, useMemo } from "react";
import Image from "next/image";
import { MasonryPhotoAlbum } from "react-photo-album";
import "react-photo-album/masonry.css";
import Lightbox, {
  isImageSlide,
  isImageFitCover,
  useLightboxProps,
  useLightboxState,
  type RenderSlideProps,
  type Slide,
} from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import Counter from "yet-another-react-lightbox/plugins/counter";
import "yet-another-react-lightbox/plugins/counter.css";
import { motion, AnimatePresence } from "motion/react";
import { useIsMobile } from "@/hooks/use-is-mobile";

interface Photo {
  id: number | string;
  url: string;
  width: number;
  height: number;
  thumbnailUrl?: string;
  thumbnailWidth?: number;
  thumbnailHeight?: number;
  largeUrl?: string;
  alt?: string | null;
}

interface PhotoGalleryProps {
  photos: Photo[];
}

interface NextSlide extends Slide {
  width: number;
  height: number;
  src: string;
}

function isNextJsImage(slide: Slide): slide is NextSlide {
  return (
    isImageSlide(slide) &&
    typeof (slide as NextSlide).width === "number" &&
    typeof (slide as NextSlide).height === "number"
  );
}

function NextJsImage({
  slide,
  offset,
  rect,
}: Pick<RenderSlideProps, "slide" | "offset" | "rect">) {
  const {
    on: { click },
    carousel: { imageFit },
  } = useLightboxProps();

  const { currentIndex } = useLightboxState();

  const cover = isImageSlide(slide) && isImageFitCover(slide, imageFit);

  if (!isNextJsImage(slide)) return undefined;

  const maxWidth = Math.min(rect.width, slide.width);
  const maxHeight = Math.min(rect.height, slide.height);

  const width = !cover
    ? Math.round(
        Math.min(maxWidth, (maxHeight / slide.height) * slide.width),
      )
    : rect.width;

  const height = !cover
    ? Math.round(
        Math.min(maxHeight, (maxWidth / slide.width) * slide.height),
      )
    : rect.height;

  return (
    <div style={{ position: "relative", width, height }}>
      <Image
        fill
        alt=""
        src={slide.src}
        loading="eager"
        draggable={false}
        style={{
          objectFit: cover ? "cover" : "contain",
          cursor: click ? "pointer" : undefined,
        }}
        sizes={`${Math.ceil((width / window.innerWidth) * 100)}vw`}
        onClick={
          offset === 0 ? () => click?.({ index: currentIndex }) : undefined
        }
      />
    </div>
  );
}

/* ── Floating sparkle particles ── */

interface Sparkle {
  id: number;
  x: number;
  y: number;
  size: number;
  opacity: number;
  duration: number;
  delay: number;
  drift: number;
}

function FloatingSparkles({ count = 10 }: { count?: number }) {
  const isMobile = useIsMobile();
  const effectiveCount = isMobile ? Math.min(count, 4) : count;

  const sparkles = useMemo<Sparkle[]>(
    () =>
      Array.from({ length: effectiveCount }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: 3 + Math.random() * 5,
        opacity: 0.15 + Math.random() * 0.25,
        duration: 4 + Math.random() * 6,
        delay: Math.random() * 3,
        drift: (Math.random() - 0.5) * 30,
      })),
    [effectiveCount],
  );

  return (
    <div
      className="absolute inset-0 overflow-hidden pointer-events-none"
      aria-hidden
    >
      {sparkles.map((s) => (
        <motion.div
          key={s.id}
          className="absolute rounded-full bg-primary/60 will-change-transform"
          style={{
            left: `${s.x}%`,
            top: `${s.y}%`,
            width: s.size,
            height: s.size,
            filter: `blur(${s.size > 5 ? 1 : 0}px)`,
          }}
          animate={{
            y: [0, -25, 0],
            x: [0, s.drift, 0],
            opacity: [s.opacity, s.opacity * 2, s.opacity],
            scale: [1, 1.4, 1],
          }}
          transition={{
            duration: s.duration,
            delay: s.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

/* ── Skeleton with shimmer ── */

function SkeletonImage({
  src,
  alt,
  width,
  height,
  sizes,
  allLoaded,
  onLoad,
  index,
}: {
  src: string;
  alt: string;
  width: number;
  height: number;
  sizes: string;
  allLoaded: boolean;
  onLoad: () => void;
  index: number;
}) {
  return (
    <motion.div
      className="relative overflow-hidden rounded-lg gallery-hover"
      style={{ cursor: "pointer" }}
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={
        allLoaded
          ? { opacity: 1, y: 0, scale: 1 }
          : { opacity: 1, y: 0, scale: 1 }
      }
      transition={{
        duration: 0.5,
        delay: allLoaded ? index * 0.04 : 0,
        ease: "easeOut",
      }}
      whileHover={{
        scale: 1.03,
        transition: { duration: 0.3, ease: "easeOut" },
      }}
    >
      <AnimatePresence>
        {!allLoaded && (
          <motion.div
            className="absolute inset-0 rounded-lg overflow-hidden"
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className="absolute inset-0 bg-muted rounded-lg" />
            <motion.div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.06) 50%, transparent 100%)",
              }}
              animate={{ x: ["-100%", "100%"] }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        sizes={sizes}
        className={`rounded-lg transition-opacity duration-500 ${allLoaded ? "opacity-100" : "opacity-0"}`}
        onLoad={onLoad}
      />
    </motion.div>
  );
}

/* ── Main gallery ── */

export default function PhotoGallery({ photos }: PhotoGalleryProps) {
  const [index, setIndex] = useState(-1);
  const [allLoaded, setAllLoaded] = useState(false);
  const loadedCount = useRef(0);
  const totalPhotos = photos.length;
  const imageIndexMap = useRef(new Map<string, number>());

  // Build a stable index map for staggered animation
  if (imageIndexMap.current.size === 0) {
    photos.forEach((p, i) => {
      const src = p.thumbnailUrl ?? p.url;
      imageIndexMap.current.set(src, i);
    });
  }

  const handleImageLoad = useCallback(() => {
    loadedCount.current += 1;
    if (loadedCount.current >= totalPhotos) {
      setAllLoaded(true);
    }
  }, [totalPhotos]);

  const albumPhotos = photos.map((p) => ({
    src: p.thumbnailUrl ?? p.url,
    width: p.thumbnailWidth ?? p.width,
    height: p.thumbnailHeight ?? p.height,
    alt: p.alt ?? "",
    key: String(p.id),
  }));

  const lightboxSlides = photos.map((p) => ({
    src: p.largeUrl ?? p.url,
    width: p.width,
    height: p.height,
    alt: p.alt ?? "",
  }));

  return (
    <>
      <div className="gallery-container relative">
        <FloatingSparkles count={8} />

        <MasonryPhotoAlbum
          photos={albumPhotos}
          columns={(containerWidth) => {
            if (containerWidth < 500) return 2;
            if (containerWidth < 900) return 3;
            return 4;
          }}
          spacing={(containerWidth) => (containerWidth < 500 ? 8 : 16)}
          onClick={({ index: i }) => setIndex(i)}
          render={{
            image: (props) => {
              const imgIndex =
                imageIndexMap.current.get(props.src as string) ?? 0;
              return (
                <SkeletonImage
                  src={props.src as string}
                  alt={(props.alt as string) || ""}
                  width={props.width as number}
                  height={props.height as number}
                  sizes={props.sizes as string}
                  allLoaded={allLoaded}
                  onLoad={handleImageLoad}
                  index={imgIndex}
                />
              );
            },
          }}
        />
      </div>

      <Lightbox
        slides={lightboxSlides}
        open={index >= 0}
        index={index}
        close={() => setIndex(-1)}
        render={{ slide: NextJsImage }}
        plugins={[Zoom, Counter]}
        zoom={{ maxZoomPixelRatio: 3 }}
        counter={{ container: { style: { top: 0, bottom: "unset" } } }}
        styles={{ container: { backgroundColor: "rgba(0,0,0,.95)" } }}
      />
    </>
  );
}
