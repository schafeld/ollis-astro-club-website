# Content Plan

## Site Navigation Structure

```
Astro-Club
├── Home (/)
├── News (/news)                    ← Ollis Astro Club Blog
├── Infos (/info)                   ← Astronomy Information
│   ├── Links (/info/links)         ← Curated link lists
│   └── Live (/info/live)           ← Live NASA/ESA data
├── Spiele (/games)                 ← Games
│   ├── Asteroids (/games/asteroids)
│   ├── Moon Buggy (/games/moon-buggy)
│   ├── Moon Lander (/games/moon-lander)
│   └── Glücksrad (/games/gluecksrad)
├── Fun (/fun)                      ← Fun Stuff
│   ├── Galerie (/fun/gallery)      ← Cardboard crafts, photos
│   └── Videos (/fun/videos)
└── Dashboard (/dashboard)          ← Registered users only
    ├── Lesezeichen (/dashboard/bookmarks)
    ├── Highscores (/dashboard/highscores)
    └── Meine Bilder (/dashboard/images)
```

All routes are prefixed with `[locale]` (e.g., `/de/news`, `/en/news`).

## Content Sections — Detail

### 1. Home

The landing page introduces the Astro Club with a playful, inviting design.

**Content:**
- Hero section with logo and tagline ("Tipps für Sternenfreunde")
- Featured/latest blog post teaser
- Quick links to each section (News, Info, Spiele, Fun)
- "Astronomy Picture of the Day" widget (NASA APOD API)

**Source:** Static + Sanity (featured post) + NASA API (APOD).

### 2. Astro Club News (Blog)

A blog for astronomy club news, event recaps, and educational articles.

**Content types:**
- Club meeting summaries
- Astronomical event announcements (eclipses, meteor showers, conjunctions)
- Student contributions and observations
- Project showcases (crafts, experiments)

**CMS schema (Sanity):**
- title (string, localized)
- slug (slug)
- publishedAt (datetime)
- author (string)
- body (portable text, localized)
- mainImage (image with alt text)
- categories (array of references)
- excerpt (text, localized)

### 3. Info — Astronomy Information

Hub page with cards linking to sub-sections.

#### 3a. Links

Curated link lists, migrated from the existing homepage content:
- **Podcasts:** Sternengeschichten, Sternzeit (ARD)
- **Star charts:** Stellarium, Star Walk 2
- **Videos:** ESA Kids, Bayern Alpha, KurzGesagt
- **Telescopes & Science Toys:** Bresser, AliExpress items
- **Excursion Tips:** Planetenpfad Borken, Bresser Observatory
- **Web resources:** DLR, ESA

Each link category is a card. Links managed in Sanity for easy updates.

**CMS schema (Sanity):**
- title (string, localized)
- category (string: podcast, app, video, toy, trip, website)
- url (url)
- description (text, localized)
- icon/emoji (string)

#### 3b. Live Data

Real-time or near-real-time space data from public APIs:
- **NASA APOD** — Astronomy Picture of the Day with description
- **ISS Tracker** — Current position of the ISS (Open Notify / Where the ISS At API)
- **Upcoming launches** — Next rocket launches (Launch Library 2 API)
- **Near-Earth Objects** — Close asteroid approaches (NASA NeoWs API)

All fetched server-side with ISR caching.

### 4. Games

Retro-style JavaScript games with a space theme. Mobile-friendly, playable in the browser.

#### 4a. Asteroids
Classic asteroids game — steer a spaceship, avoid/destroy asteroids.
- Canvas-based or simple DOM game
- Touch controls for mobile
- Highscore tracking (if logged in)

#### 4b. Moon Buggy
Side-scrolling moon surface driving game.
- Jump over craters and obstacles
- Collect items for points
- Touch controls for mobile

#### 4c. Moon Lander
Lunar lander physics game — land safely on the moon surface.
- Thrust and rotation controls
- Score based on landing speed and accuracy
- Touch controls for mobile

#### 4d. Glücksrad (Wheel of Fortune)
Migrated from current `app/zufallszahlen/page.tsx`.
- Keep the animated SVG wheel, particle effects, and audio
- Integrate into the new design system
- Configurable number range

### 5. Fun Stuff

#### 5a. Gallery
Photo gallery of cardboard crafts, robots, aliens, astronauts, UFOs.
- Image grid with lightbox
- Images can be uploaded by admin via Sanity
- Students can upload images if logged in (stored on server)

#### 5b. Videos
Videos related to astronomy club activities, crafts, experiments.
- YouTube/Vimeo embeds managed via Sanity
- Lazy-loaded for performance

### 6. Dashboard (Authenticated)

Available to registered users (Auth0).

- **Bookmarks:** Save any page for quick access
- **Highscores:** Personal game scores and leaderboard
- **My Images:** Upload and manage personal images (crafts, observations)
- **Settings:** Language preference, dark/light mode, notification preferences

## i18n Content Strategy

| Content Type | German (primary) | English |
|---|---|---|
| UI labels, navigation | `messages/de.json` | `messages/en.json` |
| Blog posts | Written in German | Translated in Sanity (optional) |
| Link descriptions | German | English (if translated) |
| Game instructions | German | English |
| API content (NASA) | English original | English original |

- German is the primary authoring language
- English translations are provided as time allows
- Fallback: show German content if English translation is missing
- NASA/ESA API content is shown in its original language (usually English)

## Content Migration Plan

Existing content from the current `page.tsx` to be migrated:

| Current Section | Target Location | Source |
|---|---|---|
| Podcasts (Sternengeschichten, Sternzeit) | `/info/links` (category: podcast) | Sanity |
| Star charts (Stellarium, Star Walk) | `/info/links` (category: app) | Sanity |
| Videos (ESA, KurzGesagt, Bayern Alpha) | `/info/links` (category: video) | Sanity |
| Telescopes & Science Toys | `/info/links` (category: toy) | Sanity |
| Excursion Tips (Planetenpfad) | `/info/links` (category: trip) | Sanity |
| Web Links (DLR) | `/info/links` (category: website) | Sanity |
| Glücksrad | `/games/gluecksrad` | Code migration |
| Extras & Gimmicks | Distributed into relevant sections | — |
