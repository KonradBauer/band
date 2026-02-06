import PhotoGallery from "@/components/photo-gallery";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Galeria - ARMAGEDON",
  description: "Galeria zdjęć zespołu weselnego ARMAGEDON",
};

const photos = [
  { id: 1, gradient: "from-[#1a1a2e] to-[#16213e]", label: "Wesele 2024" },
  { id: 2, gradient: "from-[#0f0f23] to-[#1a0a2e]", label: "Na scenie" },
  { id: 3, gradient: "from-[#1a1a1a] to-[#2d1810]", label: "Backstage" },
  { id: 4, gradient: "from-[#0a1628] to-[#1a2a1a]", label: "Zespół" },
  { id: 5, gradient: "from-[#1e1e2e] to-[#2e1e1e]", label: "Impreza firmowa" },
  { id: 6, gradient: "from-[#2e1a1a] to-[#1a2e1a]", label: "Bal sylwestrowy" },
  { id: 7, gradient: "from-[#1a2e2e] to-[#2e2e1a]", label: "Wesele 2023" },
  { id: 8, gradient: "from-[#2e1a2e] to-[#1a1a2e]", label: "Saksofon solo" },
  { id: 9, gradient: "from-[#1a1a1a] to-[#2a2a1a]", label: "Keyboard setup" },
  { id: 10, gradient: "from-[#0f1a2e] to-[#2e0f1a]", label: "Pierwszy taniec" },
  { id: 11, gradient: "from-[#1a2e0f] to-[#0f0f2e]", label: "Zabawa weselna" },
  { id: 12, gradient: "from-[#2e2e0f] to-[#0f2e2e]", label: "Oświetlenie" },
];

export default function GaleriaPage() {
  return (
    <div className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <h1 className="font-heading text-3xl md:text-4xl text-primary font-bold text-center">
        Galeria
      </h1>
      <p className="text-muted-foreground text-center mt-2 mb-12">
        Chwile, które uwieczniamy na każdym wydarzeniu
      </p>
      <PhotoGallery photos={photos} />
    </div>
  );
}
