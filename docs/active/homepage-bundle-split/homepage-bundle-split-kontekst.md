# Zmniejsz współdzielony JS bundle blokujący LCP na homepage — Kontekst

**Branch:** `feature/homepage-bundle-split`
**Ostatnia aktualizacja:** 2026-07-31

## Powiązane pliki

- `src/app/(frontend)/layout.tsx` — root layout, współdzielony przez wszystkie strony; renderuje `PlayerProvider` (do usunięcia stąd), `FloatingNotes` (do dynamic import), `SiteHeader`, `SiteFooter`.
- `src/components/player-context.tsx` — Context Provider stanu odtwarzacza; importuje `audio-controller.ts`.
- `src/lib/audio-controller.ts` — `import { Howl } from 'howler'` na poziomie modułu (linia 1); singleton `audioController`.
- `src/components/audio-album-card.tsx` — jedyny konsument `PlayerContext`; używany wyłącznie w `src/app/(frontend)/audio/page.tsx`.
- `src/app/(frontend)/audio/page.tsx` — istniejąca route; dostanie sąsiedni `layout.tsx`.
- `src/app/(frontend)/audio/layout.tsx` — NOWY plik (Faza 1).
- `src/app/(frontend)/page.tsx` — homepage; above-fold: `HeroSlideshow` (l.90), `ScrollZoomHero`+`HeroAnimations`+`TextReveal` (l.94-134). Below-fold (kandydaci do dynamic import w Fazie 3): `SectionDivider` (l.139,166,197,238 — pominięty, zbyt drobny), RichText sekcji "wolne terminy" (l.142-165), `StaggerChildren`/`StaggerItem` (l.177-194), `ParallaxSection` (l.199-236), `FloatingParticles` (l.241).
- `next.config.mjs` — brak `experimental.optimizePackageImports`, brak `modularizeImports` (Faza 2).
- `src/components/photo-gallery.tsx` — wzorzec `FloatingSparkles` (l.119-170), analogiczny dekoracyjny komponent `aria-hidden`, potwierdza konwencję traktowania efektów ambientowych jako non-critical (wzorzec dla Fazy 4).

## Decyzje techniczne

- **PlayerProvider → nested layout `/audio`, nie lazy-load globalny**: `PlayerContext` ma dokładnie jednego konsumenta (`AudioAlbumCard`), istniejącego tylko na jednej route (zweryfikowane Grep). Przeniesienie całego providera usuwa `howler` z bundle'a innych stron całkowicie — silniejszy efekt niż odroczenie ładowania przy tej samej złożoności zmiany. (zob. plan techniczny)
- **`optimizePackageImports` zamiast ręcznych importów**: Next.js 16 ma wbudowaną obsługę tego dokładnego problemu (barrel-file pakiety `lucide-react`, `radix-ui`) — zero zmian w kodzie komponentów, zero ryzyka regresji wizualnej. (zob. plan techniczny)
- **`next/dynamic(..., { ssr: false })` dla below-fold sekcji**, nie przepisywanie na server components: komponenty używają `motion/react` (client-only hooks `useScroll`, `whileInView`) więc pozostają client components — jedyna dostępna dźwignia to przesunięcie parsowania/wykonania poza krytyczną ścieżkę, nie eliminacja. (zob. plan techniczny)
- **FloatingNotes też `dynamic(ssr:false)`**: czysto kosmetyczny efekt, brak treści, brak ryzyka layout shift przy opóźnionym mountowaniu. (zob. plan techniczny)

## Postęp

**Faza 1 (2026-07-31) — ukończona.** `PlayerProvider` przeniesiony z root `layout.tsx` do nowego `src/app/(frontend)/audio/layout.tsx`. Typecheck czysty, nowy test integracyjny (`tests/int/audio-player-scope.int.spec.ts`) przechodzi, cały pakiet testów (`test:int`) zielony. `pnpm run build` próbowany — fail identyczny jak przed zmianą (`next/font` nie może pobrać Google Fonts w tym sandboxie, błąd w `layout.tsx` na etapie font-fetch, przed jakąkolwiek analizą routingu) — potwierdzone że to pre-existing środowiskowy blocker, nie regresja tej zmiany. Pełna weryfikacja (że `howler` faktycznie zniknął z bundle'a innych stron) wymaga środowiska z działającym buildem.

## Zależności

- Wszystkie 4 fazy wzajemnie niezależne — kolejność rekomendowana (największy/najpewniejszy efekt najpierw): Faza 1 → Faza 2 → Faza 4 → Faza 3.
- Faza 3 wymaga empirycznego doboru kolejności below-fold komponentów po zmierzeniu rzeczywistego wkładu do bundle size — **odroczone do implementacji** (wymaga `next build` z pełnym dostępem sieciowym; obecny dev-sandbox blokuje `next/font`→Google Fonts, więc `pnpm run build` tam nie działa).
- Weryfikacja rzeczywistego efektu na LCP wymaga środowiska z działającym `next build`/bundle analyzer oraz docelowo re-pomiaru na produkcji po deployu (pole CrUX widoczne dopiero ~28 dni po deployu, lab data/Lighthouse wystarcza do natychmiastowego potwierdzenia).

## Źródła
- Plan techniczny: [docs/plans/2026-07-31-001-perf-homepage-bundle-splitting-plan.md](../../plans/2026-07-31-001-perf-homepage-bundle-splitting-plan.md)
