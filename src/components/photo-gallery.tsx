"use client";

import { useState } from "react";
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

  const width = !cover
    ? Math.round(
        Math.min(rect.width, (rect.height / slide.height) * slide.width),
      )
    : rect.width;

  const height = !cover
    ? Math.round(
        Math.min(rect.height, (rect.width / slide.width) * slide.height),
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

export default function PhotoGallery({ photos }: PhotoGalleryProps) {
  const [index, setIndex] = useState(-1);

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
          image: (props) => (
            <Image
              src={props.src as string}
              alt={(props.alt as string) || ""}
              width={props.width as number}
              height={props.height as number}
              sizes={props.sizes as string}
              className="rounded-lg"
              style={{ cursor: "pointer" }}
            />
          ),
        }}
      />

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
