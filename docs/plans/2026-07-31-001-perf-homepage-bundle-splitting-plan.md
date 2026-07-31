---
title: Zmniejsz współdzielony JS bundle blokujący LCP na homepage
type: perf
status: active
date: 2026-07-31
---

# Zmniejsz współdzielony JS bundle blokujący LCP na homepage

## Przegląd

Homepage (`/`) na armagedon.com.pl ma LCP 4.6-4.9s (próg CWV: ≤4.0s). Element LCP (hero image w `hero-slideshow.tsx`) ma już poprawnie `opacity:1` w SSR HTML (zweryfikowane `curl`), ale Lighthouse `lcp-breakdown-insight` pokazuje `elementRenderDelay` ~1999ms — czyli main thread jest zbyt zajęty żeby faktycznie wymalować już-gotowy obraz. Przyczyna: współdzielony JS chunk (bootup-time 1.7-3.5s, obecny na WSZYSTKICH 5 stronach wg audytu `docs/audits/2026-07-31-cwv-armagedon.md`) zawiera kod niepotrzebny na initial paint — w tym całą bibliotekę `howler` (audio playback) ładowaną globalnie mimo że używana wyłącznie na `/audio`.

Plan redukuje wagę tego współdzielonego chunka i JS wykonywanego przed pierwszym paintem na homepage, bez zmiany zachowania funkcjonalnego (odtwarzacz audio, animacje dekoracyjne, treść).

## Ujęcie problemu

Lighthouse main-thread breakdown dla homepage: Other 1158ms, Style&Layout 985ms, Script Evaluation 918ms, Rendering 822ms — to blokuje faktyczny paint hero image, który jest technicznie gotowy (zasób załadowany, opacity:1) ale nie może się wymalować dopóki main thread nie ma okna czasowego. Ten sam współdzielony chunk (hash `95cb0d50b6636334.js` w audycie) ma bootup-time 1.7s (home), 2.9s (audio), 1.4s (kim-jestesmy), 3.5s (galeria), 1.8s (kontakt) — obciąża KAŻDĄ stronę niezależnie od tego, co dana strona faktycznie potrzebuje do pierwszego renderu.

## Śledzenie wymagań

- R1. Zmniejszyć rozmiar/czas wykonania JS ładowanego i wykonywanego przed pierwszym paintem na homepage, tak by main thread był dostępny wcześniej dla faktycznego namalowania gotowego hero image.
- R2. Nie zmieniać zachowania funkcjonalnego odtwarzacza audio (play/pause/resume/seek/playlist/lookahead/media session) na `/audio`.
- R3. Nie zmieniać zachowania wizualnego animacji dekoracyjnych (FloatingNotes, ParallaxSection, FloatingParticles) dla użytkownika — tylko czas/kolejność ładowania JS, nie wygląd.
- R4. Zero nowych zależności (reguła projektu: `NIGDY nie instaluj nowych zależności bez poinformowania usera`).

## Granice scope'u

- Nie zmieniamy render-blocking CSS ani nie badamy redirect z audytu CWV — to osobne, niżej-priorytetowe znaleziska, odłożone.
- Nie zmieniamy `force-dynamic` na stronie ani strategii renderowania (ISR/SSG) — poza zakresem, wymagałoby zgody usera per reguła CWV playbooka.
- Nie migrujemy z `howler` na inną bibliotekę audio — tylko zmieniamy KIEDY i GDZIE się ładuje.
- Nie ruszamy fixów już wdrożonych w tej sesji (PageTransition/AnimateOnScroll/photo-gallery — już scommitowane w `e0d7796`).
- Nie obejmuje pełnej optymalizacji `radix-ui`/`ui/` komponentów (sheet, dialog) — tylko flaga kompilatora (Unit 2), nie refaktor tych komponentów.

## Kontekst i research

### Relevantny kod i wzorce

- `src/app/(frontend)/layout.tsx` — root layout, współdzielony przez WSZYSTKIE strony pod `(frontend)`. Renderuje `<PlayerProvider>` (globalnie), `<FloatingNotes count={10} />` (globalnie, dekoracyjne), `<SiteHeader />`, `<SiteFooter />` (server component, bez JS).
- `src/components/player-context.tsx` — React Context Provider dla stanu odtwarzacza; importuje `src/lib/audio-controller.ts`.
- `src/lib/audio-controller.ts:1` — `import { Howl } from 'howler'` na poziomie modułu (eager) — cała biblioteka Howler ląduje w bundle'u wszędzie tam gdzie ten plik jest importowany, niezależnie od tego czy `play()` zostanie kiedykolwiek wywołane.
- `src/components/audio-album-card.tsx` — JEDYNY konsument `PlayerContext` (zweryfikowane: `Grep usePlayer|PlayerContext` → tylko `layout.tsx` [provider], `audio-album-card.tsx` [konsument], `player-context.tsx` [definicja]). `AudioAlbumCard` używany WYŁĄCZNIE w `src/app/(frontend)/audio/page.tsx` (zweryfikowane: `Grep AudioAlbumCard` → tylko te dwa pliki).
- `src/app/(frontend)/page.tsx` — homepage; above-fold: `HeroSlideshow` (linia 90), `ScrollZoomHero`+`HeroAnimations`+`TextReveal` (linie 94-134, hero heading). Below-fold: `SectionDivider` (139, 166, 197, 238 — powtarzalny, drobny), RichText render sekcji "wolne terminy" (142-165, `@payloadcms/richtext-lexical/react`), `StaggerChildren`/`StaggerItem` (177-194, grid features), `ParallaxSection` (199-236), `FloatingParticles` (241, sekcja CTA).
- `next.config.mjs` — brak `experimental.optimizePackageImports`, brak `modularizeImports`, brak `transpilePackages`.
- `src/components/animations/` — 13 plików `"use client"`; homepage importuje 9 z nich, ale tylko 3-4 są above-fold (HeroSlideshow, ScrollZoomHero, HeroAnimations, TextReveal).

### Wiedza instytucjonalna

Brak wpisów w `docs/solutions/` (katalog pusty, zweryfikowane Glob) — brak wcześniejszych podejść do bundle-splittingu w tym repo do naśladowania.

### Referencje zewnętrzne

Pominięto zewnętrzny research (tabela decyzyjna 1.2: repo ma jasny, dobrze udokumentowany problem techniczny; `next/dynamic` i nested App Router layouts to standardowe, stabilne API Next.js — nie wymaga weryfikacji best-practices na zewnątrz).

## Kluczowe decyzje techniczne

- **PlayerProvider przenosimy do nested layoutu `/audio`, nie lazy-loadujemy globalnie**: skoro `PlayerContext` ma dokładnie jednego konsumenta i ten konsument istnieje tylko na jednej route, przeniesienie całego providera (a więc i `audio-controller.ts`/`howler`) do `src/app/(frontend)/audio/layout.tsx` usuwa ten kod z bundle'a WSZYSTKICH innych stron całkowicie — silniejszy efekt niż odroczenie ładowania (dynamic import) przy tej samej złożoności zmiany (jeden nowy plik, jedna linijka usunięta z root layout).
- **`optimizePackageImports` zamiast ręcznego per-ikony importu**: Next.js 16 ma wbudowaną obsługę tego dokładnego problemu (duże barrel-file pakiety jak `lucide-react`, `radix-ui`) — jedna linia konfiguracji, zero zmian w kodzie komponentów, zero ryzyka regresji wizualnej.
- **`next/dynamic(..., { ssr: false })` dla below-fold homepage sekcji**, nie przepisywanie ich na server components: te komponenty używają `motion/react` (client-only hooks: `useScroll`, `whileInView` itp.) więc pozostają client components — jedyna dostępna dźwignia to przesunięcie ICH parsowania/wykonania poza krytyczną ścieżkę initial paint, nie eliminacja.
- **FloatingNotes (dekoracja globalna) też `dynamic(ssr:false)`**: czysto kosmetyczny efekt (unoszące się nutki w tle), brak treści, brak ryzyka layout shift przy opóźnionym mountowaniu — bezpieczny kandydat do odroczenia na wszystkich stronach jednocześnie.

## Otwarte pytania

### Rozwiązane podczas planowania

- Czy PlayerProvider jest potrzebny globalnie (np. mini-player w headerze)?: Nie — zweryfikowane przez Grep, `SiteHeader`/`site-header.tsx` nie odwołuje się do `PlayerContext`. Bezpiecznie skopować do `/audio`.
- Czy `photo-gallery.tsx` (react-photo-album + yet-another-react-lightbox) przecieka do wspólnego chunka?: Nie — statycznie importowany wyłącznie z `galeria/page.tsx`, brak współdzielonego re-eksportu. Poza zakresem tego planu.

### Odroczone do implementacji

- Rzeczywisty wkład każdego below-fold komponentu (Unit 3) do rozmiaru bundla — wymaga bundle analyzera / `next build` z pełnym dostępem sieciowym (obecny sandbox blokuje `next/font` fetch do Google Fonts, więc `pnpm run build` nie działa tutaj). Kolejność wdrożenia w Unit 3 może się zmienić po realnym pomiarze.
- Czy `optimizePackageImports` obejmuje pakiet `radix-ui` (umbrella package) tak samo skutecznie jak rozbite `@radix-ui/react-*` — wymaga zweryfikowania w zbudowanym bundle'u.
- Finalny próg LCP po wszystkich fixach (ten plan + już scommitowane fixy z audytu) — wymaga pomiaru na produkcji po deployu, nie da się przewidzieć z pewnością z samej analizy kodu.

## Implementation Units

- [x] **Unit 1: Zeskopuj PlayerProvider do route `/audio`**

**Cel:** Usunąć `player-context.tsx` → `audio-controller.ts` → `howler` z bundle'a każdej strony poza `/audio`.

**Wymagania:** R1, R2, R4

**Zależności:** Brak

**Pliki:**
- Stwórz: `src/app/(frontend)/audio/layout.tsx` (server component, wrapuje `children` w `<PlayerProvider>`, analogicznie do obecnego użycia w root layout)
- Modyfikuj: `src/app/(frontend)/layout.tsx` (usuń import i użycie `PlayerProvider`, `<main>` przestaje być opakowany w provider)
- Test (unit): `tests/int/audio-player-scope.int.spec.ts` — nowy plik, sprawdza że `/audio` route renderuje się z działającym kontekstem playera (nie throwuje "usePlayer must be used within PlayerProvider" ani podobnego), a inne route (np. homepage) renderują się bez błędu mimo braku providera w drzewie.

**Podejście:**
- `layout.tsx` w App Router zagnieżdża się automatycznie dla segmentu `audio/` — `audio/layout.tsx` opakuje `audio/page.tsx` dokładnie tak jak dziś root layout opakowuje wszystko.
- Root layout zachowuje `<SiteHeader />`, `<FloatingNotes />`, `<SiteFooter />` bez zmian — usuwamy WYŁĄCZNIE `<PlayerProvider>` i jego import.

**Wzorce do naśladowania:**
- Obecna struktura `src/app/(frontend)/layout.tsx:79-86` (jak provider opakowuje `<main>`) — powtórzyć identyczny wzorzec jeden poziom niżej.

**Scenariusze testowe:**
- [Unit] `/audio` page renderuje `AudioAlbumCard` bez rzucania błędu braku kontekstu.
- [Unit] Strona bez `/audio` (np. homepage) renderuje się poprawnie mimo że `PlayerProvider` nie jest już w jej drzewie (nie odwołuje się do `usePlayer`).
- [E2E] Otwórz `/audio`, kliknij play na dowolnym utworze, sprawdź że dźwięk zaczyna grać i UI odtwarzacza aktualizuje status na "playing".
- [E2E] Otwórz `/` (homepage), sprawdź że strona ładuje się normalnie i nie ma błędu w konsoli dot. brakującego PlayerContext.

**Weryfikacja:**
- Wszystkie inne strony (`/`, `/kim-jestesmy`, `/galeria`, `/kontakt`) nie mają `player-context`/`howler` w swoim JS payloadzie (potwierdzalne przez bundle analyzer po zbudowaniu — odroczone, patrz "Odroczone do implementacji").
- `/audio` działa identycznie jak przed zmianą (play/pause/seek/playlist/next track).

---

- [ ] **Unit 2: `optimizePackageImports` w next.config.mjs**

**Cel:** Włączyć wbudowaną optymalizację Next.js dla dużych barrel-file pakietów używanych na każdej stronie.

**Wymagania:** R1, R4

**Zależności:** Brak

**Pliki:**
- Modyfikuj: `next.config.mjs` — dodać `experimental.optimizePackageImports: ['lucide-react', 'radix-ui']`

**Podejście:**
- Jednolinijkowa zmiana konfiguracji, brak zmian w kodzie komponentów korzystających z tych pakietów (`iconMap` w `page.tsx`, `ui/sheet.tsx`, `ui/dialog.tsx` itd. działają bez modyfikacji).

**Wzorce do naśladowania:**
- Next.js 16 dokumentacja `experimental.optimizePackageImports` (wbudowana funkcja frameworka, nie wymaga nowej zależności).

**Scenariusze testowe:**
- [Unit] Build kończy się bez błędów konfiguracji (typecheck/lint konfiguracji Next).
- [E2E] Strony korzystające z ikon (`page.tsx` — iconMap) i z `ui/sheet`/`ui/dialog` (mobilne menu w `SiteHeader`) renderują się wizualnie identycznie jak przed zmianą.

**Weryfikacja:**
- Brak regresji wizualnej na żadnej z 5 stron; rozmiar chunka zawierającego te pakiety mniejszy (potwierdzenie odroczone do środowiska z działającym `next build`).

---

- [ ] **Unit 3: Dynamic import below-fold sekcji homepage**

**Cel:** Przenieść parsowanie/wykonanie JS dla sekcji poniżej pierwszego ekranu poza krytyczną ścieżkę initial paint homepage.

**Wymagania:** R1, R3

**Zależności:** Brak (niezależne od Unit 1-2)

**Pliki:**
- Modyfikuj: `src/app/(frontend)/page.tsx` — zamień statyczne importy na `next/dynamic(..., { ssr: false })` dla: `ParallaxSection`, `FloatingParticles`, `RichText` (sekcja "wolne terminy"), `StaggerChildren`/`StaggerItem`. `HeroSlideshow`, `ScrollZoomHero`, `HeroAnimations`, `TextReveal` (above-fold) POZOSTAJĄ statyczne — nie ruszać.
- Test (unit): brak nowego pliku testowego — istniejące testy integracyjne (`tests/int/`) nie pokrywają renderowania homepage; jeśli po zmianie okaże się że jest to jedyna weryfikacja, dodać `tests/int/homepage-render.int.spec.ts` sprawdzający że strona zwraca 200 i zawiera oczekiwany tekst sekcji "wolne terminy" mimo dynamic importu.

**Podejście:**
- `ssr:false` oznacza że te sekcje nie będą w initial HTML — świadomy trade-off: mały, kontrolowany layout shift gdy się domontują (elementy poniżej fold, użytkownik i tak przewija żeby je zobaczyć, więc CLS impact minimalny — zweryfikować w Fazie B/re-pomiarze że CLS nie pogorszy się powyżej 0.1).
- Kolejność wdrożenia (które komponenty najpierw) do ustalenia empirycznie po zmierzeniu rzeczywistego wkładu każdego do bundle size (patrz "Odroczone do implementacji") — zacząć od `ParallaxSection` i `RichText` (prawdopodobnie najcięższe: framer-motion scroll-linked + lexical renderer).

**Wzorce do naśladowania:**
- Next.js `next/dynamic` z opcją `ssr: false` — standardowy wzorzec dla client-only, below-fold komponentów w App Router.

**Scenariusze testowe:**
- [Unit] Homepage response zawiera above-fold treść (h1/hero) natychmiast w HTML (SSR), niezależnie od dynamic-imported sekcji.
- [E2E] Otwórz `/`, przewiń do sekcji "Dlaczego ARMAGEDON?" (features grid) i "wolne terminy" — sprawdź że treść i animacje pojawiają się poprawnie (bez pustych placeholderów, bez console errors).
- [E2E] Zmierz CLS na homepage po zmianie (agent-browser lub Lighthouse) — musi pozostać ≤0.1 (obecnie 0, mały margines na regresję z opóźnionego mountowania below-fold sekcji).

**Weryfikacja:**
- Homepage above-fold treść (hero) nie zależy od żadnego z dynamic-imported modułów.
- CLS pozostaje w zielonym progu (≤0.1) po zmianie.

---

- [ ] **Unit 4: Dynamic import FloatingNotes (globalna dekoracja)**

**Cel:** Odroczyć parsowanie/wykonanie czysto dekoracyjnej animacji (unoszące się nutki w tle) poza initial hydration na WSZYSTKICH stronach.

**Wymagania:** R1, R3

**Zależności:** Brak (niezależne od pozostałych unitów)

**Pliki:**
- Modyfikuj: `src/app/(frontend)/layout.tsx` — zamień statyczny import `FloatingNotes` na `next/dynamic(() => import('@/components/animations/floating-notes').then(m => m.FloatingNotes), { ssr: false })`.

**Podejście:**
- `FloatingNotes` nie niesie treści ani informacji — czysto ambientowa animacja tła (`aria-hidden` zgodnie z wzorcem `FloatingSparkles` w `photo-gallery.tsx`). Brak SSR i kilkusetmilisekundowe opóźnienie pojawienia się nie wpływa na UX ani dostępność.

**Wzorce do naśladowania:**
- `FloatingSparkles` w `src/components/photo-gallery.tsx:119-170` — analogiczny dekoracyjny komponent z `aria-hidden`, potwierdza że tego typu efekty w repo są już traktowane jako non-critical.

**Scenariusze testowe:**
- [Unit] Root layout renderuje się bez błędu gdy `FloatingNotes` ładuje się asynchronicznie.
- [E2E] Otwórz dowolną stronę, poczekaj 1-2s, sprawdź wizualnie że animacja nutek w tle się pojawia (opóźnione, ale obecne) i nie powoduje layout shift.

**Weryfikacja:**
- Efekt wizualny FloatingNotes obecny na wszystkich stronach po pełnym załadowaniu, bez wpływu na initial paint above-fold treści.

## Wpływ systemowy

- **Graf interakcji:** `PlayerProvider` (Unit 1) — jedyny konsument to `AudioAlbumCard`/`/audio`; przeniesienie nie wpływa na `SiteHeader`, `SiteFooter` ani żadną inną współdzieloną powierzchnię (zweryfikowane Grep).
- **Propagacja błędów:** jeśli w przyszłości ktoś doda komponent poza `/audio` odwołujący się do `usePlayer()`, dostanie błąd braku kontekstu przy renderze (React rzuci czytelny błąd) — to pożądane, nie cichy fallback.
- **Ryzyka cyklu życia stanu:** `audioController` to moduł-singleton (`export const audioController = new AudioController()`) — nawigacja z `/audio` na inną stronę i z powrotem odtwarza od nowa instancję modułu tylko jeśli cały chunk się przeładuje; w normalnej nawigacji SPA (Next.js App Router) moduł pozostaje w pamięci, więc stan odtwarzania (np. playlist w toku) POWINIEN przetrwać nawigację poza `/audio` i z powrotem — do zweryfikowania w E2E Unit 1 (czy to obecne zachowanie i czy plan go zachowuje — nested layout nie unmountuje modułu JS, tylko komponent Provider, co jest zgodne z obecnym zachowaniem gdy user zostaje na `/audio`).
- **Parytet surface API:** brak innych powierzchni (API routes, admin panel) dotkniętych tą zmianą — czysto frontend/bundling.

## Ryzyka i zależności

- **Brak możliwości lokalnej weryfikacji bundle size w tym środowisku** — `pnpm run build` failuje bo `next/font` (Google Fonts) nie ma dostępu sieciowego w obecnym sandboxie. Wykonanie (Unit 1-4) i pomiar rzeczywistego efektu wymaga środowiska z pełnym dostępem sieciowym (CI, lokalny dev z internetem, lub staging).
- **Unit 3 (dynamic ssr:false) może wprowadzić drobny CLS** jeśli below-fold sekcje nie mają zarezerwowanej wysokości przed zamontowaniem — do zweryfikowania w E2E scenariuszu tego unitu; jeśli wystąpi regresja, dodać `min-height` placeholder zgodnie z playbookiem CWV (CLS punkt 3-4).
- **Zależność między Unit 1 a testem E2E "nawigacja /audio → inna strona → powrót"**: obecne zachowanie odtwarzacza podczas nawigacji nie było jawnie testowane przed tą zmianą — warto potwierdzić że dzisiejsze zachowanie (przed zmianą) jest baseline, nie regresję wprowadzoną przez Unit 1.
- Wszystkie 4 unity są wzajemnie niezależne (można wdrażać i mierzyć osobno, zgodnie z regułą CWV "jedna naprawa → re-pomiar") — rekomendowana kolejność: Unit 1 (największy, najpewniejszy efekt) → Unit 2 (najniższe ryzyko) → Unit 4 → Unit 3 (najbardziej niepewny co do dokładnego zakresu, wymaga pomiaru żeby dobrać właściwe komponenty).

## Dokumentacja / Notatki operacyjne

- Po wdrożeniu i wdrożeniu na produkcję: powtórzyć audyt `/cwv` (Lighthouse na wszystkich 5 stronach) i zaktualizować `docs/audits/2026-07-31-cwv-armagedon.md` tabelą przed/po dla homepage.
- Pole CrUX (prawdziwe field data) będzie widoczne dopiero ~28 dni po deployu — lab data (Lighthouse) wystarczy do potwierdzenia natychmiastowego efektu.

## Źródła i referencje

- Audyt CWV: `docs/audits/2026-07-31-cwv-armagedon.md`
- Playbook: `.claude/skills/cwv/resources/metric-playbooks.md` (sekcja INP #1, sekcja LCP #6)
- Powiązany kod: `src/lib/audio-controller.ts`, `src/components/player-context.tsx`, `src/app/(frontend)/layout.tsx`, `src/app/(frontend)/page.tsx`, `next.config.mjs`
