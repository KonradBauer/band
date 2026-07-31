# Zmniejsz współdzielony JS bundle blokujący LCP na homepage — Plan

**Branch:** `feature/homepage-bundle-split`
**Ostatnia aktualizacja:** 2026-07-31

## Cele i zakres

Homepage (`/`) ma LCP 4.6-4.9s (próg CWV: ≤4.0s) mimo że element LCP (hero image) ma już poprawnie `opacity:1` w SSR — main thread jest zbyt zajęty żeby go faktycznie wymalować. Redukujemy wagę JS wykonywanego przed pierwszym paintem: usuwamy globalny leak biblioteki `howler` (używanej tylko na `/audio`) z bundle'a każdej strony, włączamy wbudowaną optymalizację Next.js dla dużych pakietów ikon/UI, i odraczamy JS dla below-fold sekcji homepage oraz globalnej dekoracji.

Granice scope'u:
- Nie zmieniamy render-blocking CSS ani redirect z audytu CWV (odłożone, niżej-priorytetowe).
- Nie zmieniamy `force-dynamic` ani strategii renderowania (ISR/SSG).
- Nie migrujemy z `howler` na inną bibliotekę.
- Nie ruszamy fixów już scommitowanych w `e0d7796` (PageTransition/AnimateOnScroll/photo-gallery).
- Nie obejmuje refaktoru komponentów `ui/` — tylko flaga kompilatora.

## Fazy

### Faza 1 — PlayerProvider zeskopowany do `/audio`

Cel: usunąć `player-context.tsx` → `audio-controller.ts` → `howler` z bundle'a każdej strony poza `/audio`. Jedyny konsument `PlayerContext` to `AudioAlbumCard`, używany wyłącznie na `/audio` — provider nie musi być globalny.

Zadania: nowy `audio/layout.tsx` opakowujący `PlayerProvider`, usunięcie providera z root layout, test integracyjny potwierdzający że kontekst działa na `/audio` i że inne strony renderują się bez niego.

Kryteria akceptacji: `/audio` działa identycznie (play/pause/seek/playlist); inne strony nie ładują `howler`.

### Faza 2 — `optimizePackageImports` w next.config.mjs

Cel: włączyć wbudowaną optymalizację Next.js 16 dla `lucide-react` i `radix-ui` (duże barrel-file pakiety importowane na każdej stronie). Jedna linia konfiguracji, zero zmian w komponentach.

Kryteria akceptacji: build bez błędów konfiguracji; brak regresji wizualnej na ikonach i komponentach `ui/sheet`, `ui/dialog`.

### Faza 3 — Dynamic import below-fold sekcji homepage

Cel: przenieść parsowanie/wykonanie JS dla `ParallaxSection`, `FloatingParticles`, `RichText` (sekcja "wolne terminy"), `StaggerChildren`/`StaggerItem` poza krytyczną ścieżkę initial paint. Above-fold komponenty (`HeroSlideshow`, `ScrollZoomHero`, `HeroAnimations`, `TextReveal`) pozostają statyczne.

Kryteria akceptacji: above-fold treść nie zależy od dynamic-imported modułów; CLS pozostaje ≤0.1.

### Faza 4 — Dynamic import FloatingNotes (globalna dekoracja)

Cel: odroczyć czysto dekoracyjną animację tła (nutki) poza initial hydration na wszystkich stronach — brak treści, brak wpływu na UX przy opóźnionym mountowaniu.

Kryteria akceptacji: efekt wizualny obecny po pełnym załadowaniu, bez wpływu na initial paint above-fold treści.

## Kryteria akceptacji całości

- Wszystkie 4 fazy niezależne — można wdrażać i mierzyć osobno (reguła CWV: jedna naprawa → re-pomiar).
- Zero regresji funkcjonalnej odtwarzacza audio i animacji dekoracyjnych.
- Zero nowych zależności.
- Po deployu: powtórzony audyt `/cwv` pokazuje spadek LCP na homepage poniżej 4.0s (docelowo ≤2.5s).

## Źródła
- Plan techniczny: [docs/plans/2026-07-31-001-perf-homepage-bundle-splitting-plan.md](../../plans/2026-07-31-001-perf-homepage-bundle-splitting-plan.md)
- Audyt CWV: [docs/audits/2026-07-31-cwv-armagedon.md](../../audits/2026-07-31-cwv-armagedon.md)
