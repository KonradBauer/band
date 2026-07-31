# Zmniejsz współdzielony JS bundle blokujący LCP na homepage — Checklist zadań

**Branch:** `feature/homepage-bundle-split`
**Ostatnia aktualizacja:** 2026-07-31

---

## Faza 1 — PlayerProvider zeskopowany do `/audio`

- [ ] Stwórz `src/app/(frontend)/audio/layout.tsx` (server component) opakowujący `children` w `<PlayerProvider>`, wzorem obecnego `src/app/(frontend)/layout.tsx:79-86`
- [ ] Usuń import i użycie `<PlayerProvider>` z `src/app/(frontend)/layout.tsx` (root layout), zostaw `SiteHeader`, `FloatingNotes`, `SiteFooter` bez zmian
- [ ] Test: nowy `tests/int/audio-player-scope.int.spec.ts` — `/audio` renderuje `AudioAlbumCard` bez błędu braku kontekstu; strona bez `/audio` (np. homepage) renderuje się poprawnie mimo braku providera w drzewie
- [ ] Test (e2e): otwórz `/audio`, kliknij play na dowolnym utworze, sprawdź że dźwięk zaczyna grać i UI odtwarzacza pokazuje status "playing"
- [ ] Test (e2e): otwórz `/` (homepage), sprawdź że strona ładuje się normalnie i konsola nie pokazuje błędu dot. brakującego PlayerContext
- [ ] Weryfikacja: `/audio` działa identycznie jak przed zmianą (play/pause/seek/playlist/next track)
- [ ] Weryfikacja: inne strony (`/`, `/kim-jestesmy`, `/galeria`, `/kontakt`) nie ładują `player-context`/`howler` w swoim JS payloadzie (potwierdzić bundle analyzerem, gdy dostępne środowisko z działającym `next build`)

---

## Faza 2 — `optimizePackageImports` w next.config.mjs

- [ ] Dodaj `experimental.optimizePackageImports: ['lucide-react', 'radix-ui']` w `next.config.mjs`
- [ ] Weryfikacja: build/typecheck konfiguracji przechodzi bez błędów
- [ ] Test (e2e): strony korzystające z ikon (`page.tsx` — `iconMap`) i z `ui/sheet`/`ui/dialog` (mobilne menu w `SiteHeader`) renderują się wizualnie identycznie jak przed zmianą

---

## Faza 3 — Dynamic import below-fold sekcji homepage

- [ ] W `src/app/(frontend)/page.tsx` zamień statyczny import `ParallaxSection` na `next/dynamic(..., { ssr: false })`
- [ ] Zamień statyczny import `FloatingParticles` na `next/dynamic(..., { ssr: false })`
- [ ] Zamień statyczny import `RichText` (sekcja "wolne terminy", l.142-165) na `next/dynamic(..., { ssr: false })`
- [ ] Zamień statyczne importy `StaggerChildren`/`StaggerItem` na `next/dynamic(..., { ssr: false })`
- [ ] Potwierdź: `HeroSlideshow`, `ScrollZoomHero`, `HeroAnimations`, `TextReveal` (above-fold) pozostają statyczne — bez zmian
- [ ] Test: jeśli brak istniejącego pokrycia renderowania homepage w `tests/int/`, dodaj `tests/int/homepage-render.int.spec.ts` sprawdzający że strona zwraca 200 i zawiera tekst sekcji "wolne terminy" mimo dynamic importu
- [ ] Test (e2e): otwórz `/`, przewiń do sekcji "Dlaczego ARMAGEDON?" i "wolne terminy" — treść i animacje pojawiają się poprawnie, bez pustych placeholderów, bez console errors
- [ ] Test (e2e): zmierz CLS na homepage po zmianie (agent-browser lub Lighthouse) — musi pozostać ≤0.1
- [ ] Weryfikacja: above-fold treść (hero) nie zależy od żadnego dynamic-imported modułu
- [ ] Weryfikacja: CLS pozostaje w zielonym progu (≤0.1) po zmianie

---

## Faza 4 — Dynamic import FloatingNotes (globalna dekoracja)

- [ ] W `src/app/(frontend)/layout.tsx` zamień statyczny import `FloatingNotes` na `next/dynamic(() => import('@/components/animations/floating-notes').then(m => m.FloatingNotes), { ssr: false })`
- [ ] Test: root layout renderuje się bez błędu gdy `FloatingNotes` ładuje się asynchronicznie
- [ ] Test (e2e): otwórz dowolną stronę, poczekaj 1-2s, potwierdź wizualnie że animacja nutek w tle się pojawia (opóźniona, ale obecna) bez layout shift
- [ ] Weryfikacja: efekt wizualny FloatingNotes obecny na wszystkich stronach po pełnym załadowaniu, bez wpływu na initial paint above-fold treści

---

## Po wdrożeniu wszystkich faz (ręczne)

- [ ] (ręczne) Deploy na produkcję
- [ ] (ręczne) Powtórz audyt `/cwv` na wszystkich 5 stronach, zaktualizuj tabelę przed/po w `docs/audits/2026-07-31-cwv-armagedon.md`
- [ ] (ręczne) Po ~28 dniach: sprawdź pole CrUX na produkcji czy LCP p75 spadło poniżej progu
