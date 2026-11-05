# Markdown → single-file slideshows

`build-slideshow.mjs` turns one Markdown file into one self-contained HTML slideshow (no libraries, no
internet needed to *show* it). Built for astro-club talks: a big picture, a little text, and an ⓘ button
that shows where the picture comes from.

```bash
npm run slides -- docs/slideshows/first-in-space.de.md      # → first-in-space.de.html
# or directly:
node docs/slideshows/build-slideshow.mjs docs/slideshows/first-in-space.en.md
```

Open the generated `.html` in any browser (double-click is fine) and press **F** for fullscreen.

## Examples

| File | Content |
| --- | --- |
| `first-in-space.de.md` / `.html` | "Wer waren die ersten Menschen im Weltraum?" – for a 4th-grade audience (German) |
| `first-in-space.en.md` / `.html` | Same deck in English |

## Images: URL first, local copy for offline

Images are written into the Markdown **as URLs only**. On build the script downloads each one once into
`media/` (shared by all decks, file name = slug + hash of the URL, so re-running downloads nothing new).
The HTML tries the local copy first and falls back to the original URL – and the other way round if
the `media/` folder is missing. So the show works online, offline, and when only the HTML file was copied.

- `media/` is a **local cache and is git-ignored** – never commit downloaded images. After a fresh clone the
  build simply downloads them again. To use a show offline elsewhere, copy the `.html` *and* its `media/` folder.
- `--inline` embeds the images as base64 so the HTML is **one truly standalone file** (≈ 10 MB for the example).
  Only images with a public-domain/CC0 `source:` licence are embedded. Don't commit inlined files.
- `--no-download` builds without touching the network (uses cached files if present).
- A failed download only prints a warning; that slide then uses the online URL.
- Use ~1280 px thumbnail URLs (`…/thumb/…/1280px-Name.jpg`) to keep files small.

## Image & copyright rules (important – this is an open-source repo)

**Only public-domain or CC0 material may be used in decks that are committed to this repository.**
Nothing that is copyrighted or that requires attribution (CC BY, CC BY-SA, "free with credit", editorial or
press photos, logos, mission patches under trademark, …) may be referenced here, even by URL.

- Every slide with an image needs a `<!-- source: label | page URL | licence -->` comment, and the
  licence must say public domain / gemeinfrei / CC0. **The build fails otherwise** (also when no licence is given).
- Good sources: **NASA** (US government works; not logos/patches or images credited to other owners),
  **ESA only where an explicit CC0/PD notice exists**, **Wikimedia Commons files tagged Public domain / CC0**
  (open the file page and read the licence box – don't trust search results; check the "Author" and
  "Permission" fields too), and very old works whose copyright has expired.
- *Not* OK: CC BY / CC BY-SA photos (Wikipedia is full of them), Getty/AP/Reuters/agency photos, ESA images
  under CC BY-SA IGO, anything "used with permission", AI-generated images of real people.
- Prefer US-government/NASA material; stamps and other items tagged public domain by Commons rely on
  Commons' determination – if an uploader or rights holder objects, remove the image.
- If no suitable public-domain image exists, make the slide text-only or
  link to the source page in the text instead of embedding a picture.
- `--allow-attribution` switches the check off for **private** decks (e.g. your own talk, kept outside git).
  Don't commit the resulting `.md`, `.html` or `media/` files.
- Credit text in the ⓘ box is a courtesy and traceability aid; for public-domain items it is not legally required.

## Markdown format

```markdown
---
title: Browser tab title
lang: de            # de | en – language of the built-in UI texts
---

# First slide (automatically the title slide)

Subtitle text

---

# Slide title
![Alt text for screen readers](https://upload.wikimedia.org/…/1280px-Picture.jpg)
<!-- source: Label shown in the ⓘ box | https://page-of-the-original | Licence (e.g. CC BY-SA 3.0) -->
<!-- year: 12. April 1961 -->
<!-- notes: Speaker notes, shown with the S key -->

Short text. **Bold**, *italic*, [links](https://example.org) and `- bullet` lists work.
```

- `---` on its own line separates slides.
- First `#`/`##` heading = slide title. First image = hero picture.
- Directives are HTML comments, so the file still reads well anywhere:
  `source: label | url | licence`, `year:` (yellow chip next to the title), `notes:`,
  `layout: title | image | text` (auto: first slide = `title`, slide with image = `image`, otherwise `text`).
- Slides with an image but no `source:` produce a build warning.

## Presenting (handheld clicker supported)

| Key | Action |
| --- | --- |
| `→` `↓` `PageDown` `Space` `Enter` | next |
| `←` `↑` `PageUp` `Backspace` `Shift+Space` | back |
| `Home` / `End` | first / last slide |
| `B` or `.` | black screen (any key wakes it again) |
| `I` | image source box (ⓘ button) |
| `S` | speaker notes |
| `F` / `F5` | fullscreen |
| `Esc` | close boxes |

Typical USB clickers send `PageUp`/`PageDown` (and `B`/`.` or `F5` for their black-screen/start buttons),
so they work without setup – just make sure the browser window has focus. Click (right ¾ = next, left ¼ = back),
swipe, and URL hashes (`…html#5` jumps to slide 5) also work. Printing gives one slide per page.

## Image credits in the example decks

All pictures are referenced from Wikimedia Commons or NASA and are tagged **public domain**: NASA photos
(Sputnik 1, Freedom 7, Friendship 7, Apollo 11, Crew Dragon/ISS) and Soviet postage stamps (1961, 1963, 1965, 1978)
as determined by Commons. The exact file page of each is in the slide's ⓘ box and in the `source:` comment.
The Yang Liwei slide uses a museum photo of the Shenzhou 5 capsule and spacesuit, released by its photographer
(Gary Lee Todd) under **CC0**.
