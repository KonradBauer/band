import AudioPlayer from "@/components/audio-player";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Audio - ARMAGEDON",
  description: "Posłuchaj naszych nagrań - zespół weselny ARMAGEDON",
};

const tracks = [
  { title: "Wesele Hej - Na żywo", src: "/audio/track01.mp3" },
  { title: "Szła dzieweczka", src: "/audio/track02.mp3" },
  { title: "Hej sokoły", src: "/audio/track03.mp3" },
  { title: "Sto lat - wersja instrumentalna", src: "/audio/track04.mp3" },
  { title: "Macarena - na żywo", src: "/audio/track05.mp3" },
  { title: "Koko Euro Spoko", src: "/audio/track06.mp3" },
  { title: "Ona tańczy dla mnie", src: "/audio/track07.mp3" },
  { title: "Przez twe oczy zielone", src: "/audio/track08.mp3" },
  { title: "Jak się masz kochanie", src: "/audio/track09.mp3" },
  { title: "Biały miś", src: "/audio/track10.mp3" },
  { title: "Everybody Dance Now", src: "/audio/track11.mp3" },
  { title: "I Will Survive", src: "/audio/track12.mp3" },
  { title: "Sweet Caroline", src: "/audio/track13.mp3" },
  { title: "Don't Stop Me Now", src: "/audio/track14.mp3" },
  { title: "Uptown Funk", src: "/audio/track15.mp3" },
];

export default function AudioPage() {
  return (
    <div className="py-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      <h1 className="font-heading text-3xl md:text-4xl text-primary font-bold text-center">
        Nasze nagrania
      </h1>
      <p className="text-muted-foreground text-center mt-2 mb-12">
        Posłuchaj fragmentów naszego repertuaru
      </p>
      <AudioPlayer tracks={tracks} />
      <p className="text-sm text-muted-foreground text-center mt-8">
        Pełny repertuar omawiamy indywidualnie z Młodą Parą
      </p>
    </div>
  );
}
