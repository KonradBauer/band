# CWV Audit — armagedon.com.pl
**Data:** 2026-07-31 | **Tryb:** PROD (Lighthouse CLI bezpośrednio na prod URL — PSI API zwróciło 429 quota exceeded per-day, brak `PSI_API_KEY` w env; field data z CrUX niedostępne w tym przebiegu)

Zbadano 5 stron: `/`, `/audio`, `/kim-jestesmy`, `/galeria`, `/kontakt`. Strategia: mobile (throttling-method=simulate) + desktop.

## Wyniki

| Strona | Score mobile/desktop | LCP mobile | LCP desktop | CLS | TBT (proxy INP) mobile |
|---|---|---|---|---|---|
| `/` | 76 / 69 | 🔴 4.9 s | 🔴 4.6 s | 🟢 0 | 🟢 100 ms |
| `/audio` | 82 / 66 | 🔴 4.5 s | 🔴 4.5 s | 🟢 0 | 🟢 170 ms |
| `/kim-jestesmy` | 78 / 69 | 🔴 4.7 s | 🔴 4.6 s | 🟢 0 | 🟢 120 ms |
| `/galeria` | 68 / 58 | 🔴 7.9 s | 🔴 5.8 s | 🟢 0.009 | 🟡 300 ms |
| `/kontakt` | 66 / 70 | 🔴 6.9 s | 🔴 6.0 s | 🟢 0 | 🟢 100 ms |

**LCP failuje na wszystkich 5 stronach** (próg 4.0s). CLS i INP(proxy) w zieleni/żółci — nie priorytet.

## Diagnozy (posortowane wg wpływu)

### 🔴 LCP — entrance-animacje (Framer Motion) opóźniają paint elementu LCP na WSZYSTKICH stronach

- Dowód: `lcp-breakdown-insight` na każdej stronie pokazuje `elementRenderDelay` jako dominującą składową LCP, nieproporcjonalną do rozmiaru/typu treści:
  - `/` (LCP = hero img w `hero-slideshow.tsx`): elementRenderDelay **1999 ms** z 4.9s total
  - `/audio` (LCP = h1, czysty tekst): elementRenderDelay **1060 ms**
  - `/kim-jestesmy` (LCP = h1): elementRenderDelay **2676 ms**
  - `/kontakt` (LCP = h1): elementRenderDelay **2684 ms**
  - Element LCP w każdym przypadku to h1/hero-image renderowany jako pierwszy `initial={{opacity:0}}` w komponencie motion — text/image nie liczy się jako "painted" dopóki animacja wejścia nie ruszy.
- W kodzie:
  - `src/components/animations/hero-slideshow.tsx:39-45` — LCP image owinięty w `motion.div` z `initial={{opacity:0}}`, `animate={{opacity:1}}`, `transition duration:1.5s` (dla KAŻDEGO slajdu, także pierwszego, statycznego przy page-load).
  - `src/components/animations/animate-on-scroll.tsx:34-38` — `AnimateOnScroll` (używany do owijania h1 na `/audio`, `/kim-jestesmy`, `/kontakt`, `/galeria`, oraz sekcji na `/`) startuje z `initial={{opacity:0, y:60}}`, `whileInView` odpala animację dopiero po tym jak IntersectionObserver + hydracja JS potwierdzą, że element jest w viewport — nawet dla treści above-the-fold widocznej natychmiast przy załadowaniu strony.
- Naprawa: dla elementu LCP (pierwszy above-the-fold h1/hero image na każdej stronie) NIE stosować entrance-animacji gaszącej opacity od 0. Konkretnie:
  1. `hero-slideshow.tsx` — pierwszy slajd (index 0, ten obecny przy page-load) renderować bez `initial={{opacity:0}}` (np. `initial={false}` dla pierwszego mountu albo pomiń motion.div dla `current === 0` przy pierwszym renderze).
  2. `AnimateOnScroll` — dodać wariant/prop (np. `priority` albo pominięcie wrappera) dla nagłówków H1 na `/audio`, `/kim-jestesmy`, `/kontakt`, `/galeria` — renderować statycznie, bez fade-in, skoro i tak są w viewport od pierwszej klatki.
- Szacowany zysk: usunięcie ~1-2.7s render delay na każdej stronie → LCP powinno spaść poniżej progu 4.0s (potencjalnie do zielonego ≤2.5s po odjęciu TTFB+delay).

### 🔴 LCP — `/galeria`: LCP image zablokowany przez CAŁY batch 24 zdjęć

- Dowód: `src/components/photo-gallery.tsx:242` — klasa `opacity-0`/`opacity-100` sterowana przez `allLoaded`; `allLoaded` (linie 271-276) ustawia się na `true` dopiero gdy `loadedCount.current >= totalPhotos` — czyli gdy WSZYSTKIE zdjęcia w bieżącym batchu (`BATCH_SIZE = 24`, linia 251) się załadują, nie tylko pierwsze/priority (imgIndex<4).
- Efekt: nawet zdjęcie #1 z `priority={true}` i szybkim resource-load zostaje niewidoczne (opacity:0) dopóki najwolniejsze z 24 zdjęć nie skończy ładowania. To tłumaczy najgorszy wynik ze wszystkich stron (LCP mobile 7.9s).
- Naprawa: odsprzęgnij widoczność pojedynczego obrazu od stanu całego batcha — każdy `SkeletonImage` powinien pokazywać się na własnym `onLoad`, nie czekać na `allLoaded` globalne. Jeśli `allLoaded` służy do efektu "synchronicznego" pojawienia się siatki, ograniczyć ten wzorzec do zdjęć poza pierwszym viewportem (np. tylko dla `imgIndex >= 4`, poza priority).

### 🟡 Render-blocking CSS — spójne we wszystkich stronach (niższy priorytet)

- Dowód: `render-blocking-insight` → `_next/static/chunks/d052a930ebb71387.css` (14.3KB), wastedMs 500-705ms na każdej stronie.
- Uwaga: plik jest już preloadowany przez serwer (`Link: rel=preload; as="style"` w nagłówkach HTTP — potwierdzone `curl -I`), więc dalsza optymalizacja wymagałaby krytycznego CSS/inline — większa zmiana architektury, nie w zakresie szybkiej naprawy. Odłożone.

### ⚪ Redirect 1x na każdej stronie (190-450ms) — niepotwierdzone źródło

- Dowód: `document-latency-insight` zgłasza redirect na każdej stronie, ale ręczne `curl -I` na `https://armagedon.com.pl/`, bez trailing slash, i na `/kontakt` nie pokazuje żadnego 3xx — prawdopodobnie artefakt nawigacji headless Chrome (HSTS upgrade / internal), nie potwierdzony w warstwie HTTP. Wymaga weryfikacji w Network panel przed jakąkolwiek zmianą — nie rekomenduję fixu bez dowodu.

## Plan naprawy (kolejność) — FAZA B wykonana

Uwaga metodologiczna: podczas weryfikacji kodu (SSR HTML via `curl`) okazało się, że hipoteza dot. `hero-slideshow.tsx` była błędna — `AnimatePresence initial={false}` już poprawnie zapobiega opóźnieniu (potwierdzone: SSR wysyła `style="opacity:1"` dla hero image). Prawdziwa przyczyna renderDelay na 4 podstronach: `PageTransition` (owija CAŁĄ stronę, brak `AnimatePresence`/`initial={false}` → SSR wysyła `opacity:0` na root divie każdej podstrony) + `AnimateOnScroll` na h1 (ten sam wzorzec, drugi poziom gate). Zweryfikowane bezpośrednio: `curl https://armagedon.com.pl/kontakt` → `<div style="opacity:0;transform:translateY(60px)"><h1...`.

1. ✅ **`src/components/animations/page-transition.tsx`** — dodano moduł-level flagę `hasMountedBefore`; pierwszy mount (twardy load strony, SSR) renderuje `initial={false}` (bez gate'a opacity), kolejne client-side nawigacje zachowują pełną animację przejścia. Naprawia `/audio`, `/kim-jestesmy`, `/kontakt`, `/galeria` jednocześnie.
2. ✅ **`src/components/animations/animate-on-scroll.tsx`** — nowy prop `skipAnimation` (przekazuje `initial={false}` zamiast `initial={{opacity:0,...}}`); zastosowany na `<AnimateOnScroll>` owijającym h1 (element LCP) w `audio/page.tsx`, `kim-jestesmy/page.tsx`, `kontakt/page.tsx`, `galeria/page.tsx`. Pozostałe użycia (sekcje poniżej fold) bez zmian — zachowują scroll-reveal.
3. ✅ **`src/components/photo-gallery.tsx`** — `SkeletonImage` miał opacity obrazu sterowane globalnym `allLoaded` (ustawianym dopiero gdy WSZYSTKIE zdjęcia batcha, do 24, się załadują) — nawet zdjęcie #1 z `priority` czekało na najwolniejsze z 24. Naprawiono: dodano lokalny stan `loaded` per-obraz (`useState` + `handleLoad`), opacity zależy teraz od własnego stanu ładowania obrazu, nie od stanu całej siatki. `allLoaded` zostaje tylko do stagger-delay entrance animacji (bez wpływu na widoczność).
4. ⏸ **Homepage (`/`) — main-thread JS blocking** — LCP image ma już `opacity:1` w SSR (potwierdzone), ale `elementRenderDelay` (1999ms) wynika z ciężkiej pracy main threadu (współdzielony JS chunk `95cb0d50b6636334.js`, bootup-time 1.7-3.5s na WSZYSTKICH stronach) blokującej faktyczny paint. To większa zmiana (code-splitting/dynamic import) — **odłożone, zaproponuj `/dev-plan`** zamiast szybkiego fixu bez możliwości pomiaru.
5. ⏸ Render-blocking CSS (już preloadowany) i redirect (niepotwierdzone źródło) — odłożone, niski priorytet.

### Ograniczenie weryfikacji

Build lokalny (`pnpm run build`) zablokowany w tym środowisku — `next/font` nie ma dostępu do Google Fonts API z tego sandboxa (środowiskowe, nie związane z tą zmianą). Nie było możliwe wykonanie pełnego re-pomiaru Lighthouse przed/po lokalnie. Poprawki 1-3 zweryfikowane przez: typecheck (`tsc --noEmit` czysto), testy (`test:int` przechodzi), oraz bezpośrednią analizę przyczynowo-skutkową (SSR HTML diff potwierdzający dokładny mechanizm opisany w diagnozie). **Wymagany re-pomiar Lighthouse/PSI na produkcji po deployu** żeby potwierdzić rzeczywisty spadek LCP.
