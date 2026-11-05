#!/usr/bin/env node
/**
 * build-slideshow.mjs — Markdown → single-file HTML slideshow (zero dependencies, Node >= 18).
 *
 *   node docs/slideshows/build-slideshow.mjs <deck.md> [options]
 *
 * Options
 *   -o, --out <file.html>   Output file (default: next to the .md, same name, .html)
 *   --media-dir <dir>       Where downloaded images are cached (default: <md folder>/media)
 *   --no-download           Do not download; use cached files if present, URLs otherwise
 *   --allow-attribution    Allow images that are not clearly public domain / CC0 (for PRIVATE use only,
 *                           never commit the result to the open-source repo)
 *   --inline                Embed cached images as base64 → one truly standalone file
 *                           (NOTE: this redistributes the images; check each licence first)
 *   -h, --help
 *
 * Images are referenced by URL in the Markdown. At build time they are downloaded once into the
 * media folder. The generated page tries the local copy first and falls back to the original URL
 * (and vice versa), so it works online, offline, and without the media folder.
 *
 * See docs/slideshows/README.md for the Markdown format.
 */
import { createHash } from 'node:crypto'
import { existsSync } from 'node:fs'
import { mkdir, readdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { setTimeout as sleep } from 'node:timers/promises'

const USER_AGENT = 'AstroClubSlides/1.0 (https://ollis-astro-club.com; educational slideshow builder)'

const STRINGS = {
  de: { source: 'Bildquelle', open: 'Originalseite öffnen', license: 'Lizenz', info: 'Info zum Bild', close: 'Schließen', fullscreen: 'Vollbild', notes: 'Notizen', help: 'Pfeiltasten / Klicker: weiter & zurück · B: Bildschirm schwarz · I: Bildinfo · F: Vollbild' },
  en: { source: 'Image source', open: 'Open original page', license: 'License', info: 'Image info', close: 'Close', fullscreen: 'Fullscreen', notes: 'Notes', help: 'Arrow keys / clicker: next & back · B: black screen · I: image info · F: fullscreen' },
}

// ───────────────────────── CLI ─────────────────────────
function parseArgs(argv) {
  const opts = { input: null, out: null, mediaDir: null, download: true, inline: false, allowAttribution: false }
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i]
    if (a === '-h' || a === '--help') { opts.help = true }
    else if (a === '-o' || a === '--out') opts.out = argv[++i]
    else if (a === '--media-dir') opts.mediaDir = argv[++i]
    else if (a === '--no-download') opts.download = false
    else if (a === '--inline') opts.inline = true
    else if (a === '--allow-attribution') opts.allowAttribution = true
    else if (a.startsWith('-')) throw new Error(`Unknown option: ${a}`)
    else opts.input = a
  }
  return opts
}

// ───────────────────────── Markdown parsing ─────────────────────────
function parseFrontMatter(text) {
  const meta = {}
  const m = text.match(/^---[ \t]*\r?\n([\s\S]*?)\r?\n---[ \t]*(?:\r?\n|$)/)
  if (!m) return { meta, body: text }
  for (const line of m[1].split(/\r?\n/)) {
    const kv = line.match(/^([A-Za-z][\w-]*)\s*:\s*(.*)$/)
    if (kv) meta[kv[1].toLowerCase()] = kv[2].trim().replace(/^["']|["']$/g, '')
  }
  return { meta, body: text.slice(m[0].length) }
}

function parseSlides(body) {
  const chunks = body.split(/^[ \t]*---[ \t]*$/m).map((c) => c.trim()).filter(Boolean)
  return chunks.map((chunk, index) => {
    const slide = { index, title: '', image: null, alt: '', source: null, layout: null, year: '', notes: '', text: '' }

    // <!-- key: value --> directives (value may span lines)
    chunk = chunk.replace(/<!--\s*([A-Za-z]+)\s*:\s*([\s\S]*?)-->/g, (_, key, value) => {
      key = key.toLowerCase(); value = value.trim()
      if (key === 'source') {
        const [label = '', url = '', license = ''] = value.split('|').map((s) => s.trim())
        slide.source = { label, url, license }
      } else if (key === 'layout') slide.layout = value.toLowerCase()
      else if (key === 'year') slide.year = value
      else if (key === 'notes') slide.notes = value
      return ''
    })

    // first image → hero
    chunk = chunk.replace(/!\[([^\]]*)\]\(\s*([^)\s]+)(?:\s+"[^"]*")?\s*\)/, (_, alt, url) => {
      if (!slide.image) { slide.image = url; slide.alt = alt; return '' }
      return _
    })

    // first heading → title
    chunk = chunk.replace(/^#{1,2}[ \t]+(.+)$/m, (_, t) => {
      if (!slide.title) { slide.title = t.trim(); return '' }
      return _
    })

    slide.text = chunk.trim()
    if (!slide.layout) slide.layout = index === 0 ? 'title' : slide.image ? 'image' : 'text'
    return slide
  })
}

// ───────────────────────── Tiny inline/block markdown → HTML ─────────────────────────
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c])

function inlineMd(s) {
  return esc(s)
    .replace(/\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>')
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/(^|[^*])\*([^*\n]+)\*(?!\*)/g, '$1<em>$2</em>')
}

function blockMd(text) {
  if (!text) return ''
  return text.split(/\n{2,}/).map((block) => {
    const lines = block.split('\n').map((l) => l.trimEnd()).filter(Boolean)
    if (lines.length && lines.every((l) => /^[-*]\s+/.test(l))) {
      return `<ul>${lines.map((l) => `<li>${inlineMd(l.replace(/^[-*]\s+/, ''))}</li>`).join('')}</ul>`
    }
    return `<p>${lines.map(inlineMd).join('<br>')}</p>`
  }).join('\n')
}

// ───────────────────────── Licence guard (open-source repo: public domain / CC0 only) ─────────────────────────
// Only images whose `source:` licence is clearly public domain / CC0 may be used. Anything that needs
// attribution (CC BY, CC BY-SA, …), is copyrighted, or has no licence stated is refused.
const FREE_RE = /public domain|gemeinfrei|\bpd\b|cc0|cc[- ]zero|no known copyright|no restrictions/i
const RESTRICTED_RE = /\bcc[- ]by|attribution|namensnennung|share-?alike|©|copyright(?! free)|all rights|fair use/i
const isFreeLicense = (lic) => !!lic && FREE_RE.test(lic) && !RESTRICTED_RE.test(lic)

function checkLicenses(slides, allow) {
  const bad = slides.filter((s) => s.image && !isFreeLicense(s.source?.license))
  if (!bad.length) return
  const list = bad.map((s) => `  slide ${s.index + 1} "${s.title}": ${s.source?.license ? 'licence "' + s.source.license + '"' : 'no licence given'}`).join('\n')
  if (allow) { console.warn(`  ! --allow-attribution: non-public-domain images used (private use only, do NOT commit):\n${list}`); return }
  throw new Error(`Only public-domain / CC0 images are allowed in this repository, but:\n${list}\nFix the "source:" comment (state the licence) or use another image. See docs/slideshows/README.md.`)
}

// ───────────────────────── Media handling ─────────────────────────
const isRemote = (u) => /^https?:\/\//i.test(u)
const EXT_BY_TYPE = { 'image/jpeg': '.jpg', 'image/png': '.png', 'image/gif': '.gif', 'image/webp': '.webp', 'image/svg+xml': '.svg', 'image/avif': '.avif' }
const TYPE_BY_EXT = Object.fromEntries(Object.entries(EXT_BY_TYPE).map(([t, e]) => [e, t]))
TYPE_BY_EXT['.jpeg'] = 'image/jpeg'

function cacheStem(url) {
  const last = decodeURIComponent(new URL(url).pathname.split('/').pop() || 'image').replace(/\.[A-Za-z0-9]+$/, '').replace(/^\d+px-/, '')
  const slug = last.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 40) || 'image'
  return `${slug}-${createHash('sha1').update(url).digest('hex').slice(0, 8)}`
}

async function findCached(mediaDir, stem) {
  if (!existsSync(mediaDir)) return null
  const hit = (await readdir(mediaDir)).find((f) => f.startsWith(stem + '.'))
  return hit ? path.join(mediaDir, hit) : null
}

async function download(url, mediaDir, stem) {
  for (let attempt = 1; attempt <= 4; attempt++) {
    const res = await fetch(url, { headers: { 'User-Agent': USER_AGENT, Accept: 'image/*' }, redirect: 'follow' })
    if (res.status === 429 || res.status >= 500) { await sleep(1500 * attempt); continue }
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const type = (res.headers.get('content-type') || '').split(';')[0].trim()
    if (!type.startsWith('image/')) throw new Error(`not an image (${type || 'unknown type'})`)
    const urlExt = path.extname(new URL(url).pathname).toLowerCase()
    const ext = EXT_BY_TYPE[type] ?? (urlExt || '.img')
    const file = path.join(mediaDir, stem + ext)
    await writeFile(file, Buffer.from(await res.arrayBuffer()))
    return file
  }
  throw new Error('too many retries (rate limited?)')
}

/** Resolve every slide image to { remote, local } and (optionally) download it. */
async function resolveMedia(slides, opts, mdDir, mediaDir) {
  const stats = { downloaded: 0, cached: 0, failed: 0 }
  const seen = new Map()
  for (const slide of slides) {
    if (!slide.image) continue
    const ref = slide.image
    if (seen.has(ref)) { slide.media = seen.get(ref); continue }
    let media
    if (isRemote(ref)) {
      const stem = cacheStem(ref)
      let local = await findCached(mediaDir, stem)
      if (local) stats.cached++
      else if (opts.download) {
        try {
          await mkdir(mediaDir, { recursive: true })
          local = await download(ref, mediaDir, stem)
          stats.downloaded++
          console.log(`  ↓ ${path.basename(local)}`)
          await sleep(400) // be polite to Wikimedia
        } catch (err) {
          stats.failed++
          console.warn(`  ! could not download ${ref}\n    ${err.message} — slide will use the online URL only`)
        }
      }
      media = { remote: ref, local }
    } else {
      const local = path.resolve(mdDir, ref)
      if (!existsSync(local)) { stats.failed++; console.warn(`  ! local image not found: ${local}`); media = { remote: null, local: null } }
      else media = { remote: null, local }
    }
    seen.set(ref, media)
    slide.media = media
  }
  return stats
}

async function imageSources(media, outDir, inline) {
  let src = media.remote || ''
  let remote = media.remote || ''
  if (media.local) {
    if (inline) {
      const type = TYPE_BY_EXT[path.extname(media.local).toLowerCase()] || 'application/octet-stream'
      src = `data:${type};base64,${(await readFile(media.local)).toString('base64')}`
    } else {
      src = path.relative(outDir, media.local).split(path.sep).map(encodeURIComponent).join('/')
    }
  }
  return { src, remote: src === remote ? '' : remote }
}

// ───────────────────────── HTML generation ─────────────────────────
async function renderSlide(slide, n, total, t, outDir, inline) {
  inline = inline && isFreeLicense(slide.source?.license) // never embed anything that is not public domain
  const cls = `slide layout-${esc(slide.layout)}`
  const parts = []
  let img = ''
  if (slide.media && (slide.media.local || slide.media.remote)) {
    const { src, remote } = await imageSources(slide.media, outDir, inline)
    const attrs = `src="${esc(src)}"${remote ? ` data-remote="${esc(remote)}"` : ''}`
    img = `<figure class="hero"><img class="bg" ${attrs} alt="" aria-hidden="true"><img class="fg" ${attrs} alt="${esc(slide.alt)}"></figure>`
  }
  parts.push(img)

  const chip = slide.year ? `<span class="chip">${esc(slide.year)}</span>` : ''
  const head = slide.title ? `<h2>${chip}${esc(slide.title)}</h2>` : ''
  parts.push(`<div class="caption">${head}<div class="text">${blockMd(slide.text)}</div></div>`)

  if (slide.source && (slide.source.label || slide.source.url)) {
    const s = slide.source
    const safeUrl = isRemote(s.url) ? s.url : ''
    parts.push(`<aside class="source" hidden><h3>${esc(t.source)}</h3><p class="label">${esc(s.label)}</p>${s.license ? `<p><span class="k">${esc(t.license)}:</span> ${esc(s.license)}</p>` : ''}${safeUrl ? `<p><a href="${esc(safeUrl)}" target="_blank" rel="noopener noreferrer">${esc(t.open)} ↗</a></p>` : ''}</aside>`)
  }
  if (slide.notes) parts.push(`<aside class="notes" hidden>${blockMd(slide.notes)}</aside>`)
  return `<section class="${cls}" id="s${n}" aria-label="${n} / ${total}${slide.title ? ': ' + esc(slide.title) : ''}">\n${parts.join('\n')}\n</section>`
}

const CSS = String.raw`
:root{--bg:#0b1020;--fg:#f4f6ff;--muted:#b9c2e6;--accent:#ffcf5c;--panel:rgba(14,20,44,.94)}
*{box-sizing:border-box}
html,body{margin:0;height:100%;background:var(--bg);color:var(--fg);overflow:hidden;
  font-family:ui-rounded,"Segoe UI",system-ui,-apple-system,"Helvetica Neue",Arial,sans-serif}
#deck{position:fixed;inset:0;background:radial-gradient(ellipse at 50% 0%,#1b2650 0%,var(--bg) 70%)}
.slide{position:absolute;inset:0;display:flex;flex-direction:column;opacity:0;visibility:hidden;transition:opacity .35s ease,visibility .35s}
.slide.active{opacity:1;visibility:visible}
.hero{position:relative;flex:1;min-height:0;margin:0;overflow:hidden;background:#05070f}
.hero img{position:absolute;inset:0;width:100%;height:100%}
.hero .bg{object-fit:cover;filter:blur(28px) brightness(.45) saturate(1.2);transform:scale(1.15)}
.hero .fg{object-fit:contain}
.caption{padding:clamp(.7rem,2.2vh,1.6rem) calc(clamp(2.8rem,8vmin,4.4rem)*2 + clamp(2rem,5vw,4rem)) clamp(1.4rem,4.5vh,3rem) clamp(1rem,4vw,4rem);
  background:linear-gradient(180deg,rgba(11,16,32,.96),#0b1020)}
.caption h2{margin:0 0 .3em;font-size:clamp(1.6rem,5.2vmin,4rem);line-height:1.1;color:var(--accent)}
.chip{display:inline-block;margin-right:.6em;padding:.05em .55em;border-radius:999px;background:var(--accent);color:#1a1a2e;
  font-size:.5em;font-weight:700;vertical-align:.18em;white-space:nowrap}
.text{font-size:clamp(1.15rem,3.5vmin,2.6rem);line-height:1.35;max-width:62em}
.text p{margin:.15em 0}.text ul{margin:.2em 0;padding-left:1.2em}
.text a{color:var(--accent)}
.layout-title,.layout-text{justify-content:center;align-items:center;text-align:center}
.layout-title .hero{position:absolute;inset:0;z-index:0}
.layout-title .hero .fg{object-fit:cover;opacity:.35}
.layout-title .caption,.layout-text .caption{position:relative;z-index:1;background:none;max-width:60em;padding:2rem}
.layout-title .caption h2{font-size:clamp(2.2rem,9vmin,7rem)}
.layout-title .text,.layout-text .text{font-size:clamp(1.3rem,4.2vmin,3rem);margin:0 auto}
.source,.notes{display:none}
#info-panel{position:fixed;right:clamp(.8rem,2vw,2rem);bottom:calc(clamp(3.4rem,8vmin,5.2rem) + 1rem);z-index:20;width:min(30rem,calc(100vw - 2rem));
  background:var(--panel);border:2px solid var(--accent);border-radius:1rem;padding:1rem 1.2rem;font-size:clamp(1rem,2.4vmin,1.4rem);
  box-shadow:0 .5rem 2rem rgba(0,0,0,.6)}
#info-panel h3{margin:0 0 .4em;color:var(--accent);font-size:1em}
#info-panel p{margin:.3em 0;overflow-wrap:anywhere}#info-panel .k{color:var(--muted)}
#info-panel a{color:var(--accent);font-weight:700}
#notes-panel{position:fixed;left:1rem;right:1rem;top:1rem;z-index:20;background:var(--panel);border:2px solid var(--muted);border-radius:1rem;
  padding:.8rem 1.2rem;font-size:clamp(1rem,2.4vmin,1.5rem)}
#notes-panel h3{margin:0 0 .3em;color:var(--muted);font-size:.8em;text-transform:uppercase;letter-spacing:.08em}
.btn{position:fixed;z-index:15;width:clamp(2.8rem,8vmin,4.4rem);height:clamp(2.8rem,8vmin,4.4rem);border-radius:50%;border:2px solid var(--accent);
  background:rgba(11,16,32,.8);color:var(--accent);font:700 clamp(1.4rem,4.4vmin,2.4rem)/1 Georgia,serif;cursor:pointer;display:grid;place-items:center;
  bottom:clamp(.6rem,1.6vw,1.4rem)}
.btn:hover,.btn:focus-visible{background:var(--accent);color:#1a1a2e;outline:none}
#btn-info{right:clamp(.8rem,2vw,2rem);font-style:italic}
#btn-full{right:calc(clamp(.8rem,2vw,2rem) + clamp(2.8rem,8vmin,4.4rem) + .6rem);font-family:system-ui,sans-serif;font-size:clamp(1.1rem,3.4vmin,1.9rem)}
#counter{position:fixed;right:clamp(.8rem,2vw,2rem);top:clamp(.6rem,1.6vw,1.2rem);z-index:15;font-size:clamp(.9rem,2.2vmin,1.3rem);color:var(--muted);
  background:rgba(11,16,32,.7);padding:.15em .7em;border-radius:999px}
#bar{position:fixed;left:0;top:0;height:.35rem;background:var(--accent);z-index:16;transition:width .3s}
#help{position:fixed;left:50%;bottom:1rem;transform:translateX(-50%);z-index:30;background:var(--panel);border:1px solid var(--muted);border-radius:.8rem;
  padding:.6rem 1.2rem;font-size:clamp(.9rem,2.2vmin,1.3rem);text-align:center;transition:opacity 1s;max-width:90vw}
#blank{position:fixed;inset:0;background:#000;z-index:50}
[hidden]{display:none!important}
@media (prefers-reduced-motion:reduce){.slide,#bar,#help{transition:none}}
@media print{
  html,body{overflow:visible;height:auto;background:#fff}
  #deck{position:static;background:none}
  .slide{position:relative;opacity:1;visibility:visible;height:100vh;page-break-after:always;break-after:page}
  .btn,#counter,#bar,#help,#info-panel,#notes-panel,#blank{display:none!important}
}`

const JS = String.raw`
(function(){
  var T = JSON.parse(document.getElementById('i18n').textContent);
  var slides = Array.prototype.slice.call(document.querySelectorAll('.slide'));
  var bar = document.getElementById('bar'), counter = document.getElementById('counter');
  var infoBtn = document.getElementById('btn-info'), infoPanel = document.getElementById('info-panel');
  var notesPanel = document.getElementById('notes-panel'), blank = document.getElementById('blank');
  var cur = -1;

  // images: local copy first, original URL as fallback
  Array.prototype.forEach.call(document.querySelectorAll('img[data-remote]'), function(img){
    img.addEventListener('error', function(){
      var r = img.getAttribute('data-remote');
      if (r && img.getAttribute('src') !== r) { img.setAttribute('src', r); img.removeAttribute('data-remote'); }
    });
  });

  function clamp(n){ return Math.max(0, Math.min(slides.length - 1, n)); }
  function fromHash(){ var n = parseInt((location.hash || '').replace('#',''), 10); return isNaN(n) ? 0 : clamp(n - 1); }

  function show(n, push){
    n = clamp(n); if (n === cur) return;
    if (cur >= 0) slides[cur].classList.remove('active');
    cur = n; var s = slides[n]; s.classList.add('active');
    bar.style.width = (slides.length > 1 ? (n / (slides.length - 1)) * 100 : 100) + '%';
    counter.textContent = (n + 1) + ' / ' + slides.length;
    var src = s.querySelector('.source');
    infoBtn.hidden = !src; infoPanel.hidden = true;
    infoPanel.innerHTML = src ? src.innerHTML : '';
    var nt = s.querySelector('.notes');
    notesPanel.innerHTML = nt ? '<h3>' + T.notes + '</h3>' + nt.innerHTML : '';
    if (!nt) notesPanel.hidden = true;
    if (push !== false && location.hash !== '#' + (n + 1)) history.replaceState(null, '', '#' + (n + 1));
    [n + 1, n - 1].forEach(function(i){ var im = slides[i] && slides[i].querySelector('img.fg'); if (im) { var p = new Image(); p.src = im.currentSrc || im.src; } });
  }
  function next(){ show(cur + 1); } function prev(){ show(cur - 1); }
  function toggleInfo(){ if (!infoBtn.hidden) infoPanel.hidden = !infoPanel.hidden; }
  function toggleNotes(){ if (notesPanel.innerHTML) notesPanel.hidden = !notesPanel.hidden; }
  function toggleBlank(){ blank.hidden = !blank.hidden; }
  function toggleFull(){
    if (document.fullscreenElement) document.exitFullscreen();
    else if (document.documentElement.requestFullscreen) document.documentElement.requestFullscreen();
  }

  // Keyboard — handheld clickers usually send PageUp/PageDown, arrows, B/. (black) or F5 (start).
  window.addEventListener('keydown', function(e){
    if (e.ctrlKey || e.metaKey || e.altKey) return;
    var k = e.key, handled = true;
    // black screen: any key just wakes it up again (so a clicker press doesn't skip a slide)
    if (!blank.hidden && k !== 'F5') { blank.hidden = true; e.preventDefault(); return; }
    switch (k) {
      case 'ArrowRight': case 'ArrowDown': case 'PageDown': case 'Enter': case 'n': next(); break;
      case ' ': e.shiftKey ? prev() : next(); break;
      case 'ArrowLeft': case 'ArrowUp': case 'PageUp': case 'Backspace': case 'p': prev(); break;
      case 'Home': show(0); break;
      case 'End': show(slides.length - 1); break;
      case 'b': case 'B': case '.': toggleBlank(); break;
      case 'i': case 'I': toggleInfo(); break;
      case 's': case 'S': toggleNotes(); break;
      case 'f': case 'F': case 'F5': toggleFull(); break;
      case 'Escape': if (!infoPanel.hidden) infoPanel.hidden = true; else if (!notesPanel.hidden) notesPanel.hidden = true; break;
      case '?': document.getElementById('help').hidden = false; break;
      default: handled = false;
    }
    if (handled) e.preventDefault();
  });

  // Mouse / touch: left quarter = back, everything else = forward
  document.getElementById('deck').addEventListener('click', function(e){
    if (e.target.closest('a,button,#info-panel,#notes-panel')) return;
    if (!infoPanel.hidden) { infoPanel.hidden = true; return; }
    (e.clientX < window.innerWidth * 0.25) ? prev() : next();
  });
  var tx = null;
  window.addEventListener('touchstart', function(e){ tx = e.touches[0].clientX; }, { passive: true });
  window.addEventListener('touchend', function(e){
    if (tx === null) return; var dx = e.changedTouches[0].clientX - tx; tx = null;
    if (Math.abs(dx) > 50) (dx < 0 ? next() : prev());
  }, { passive: true });

  infoBtn.addEventListener('click', function(e){ e.stopPropagation(); toggleInfo(); });
  document.getElementById('btn-full').addEventListener('click', function(e){ e.stopPropagation(); toggleFull(); });
  window.addEventListener('hashchange', function(){ show(fromHash(), false); });

  var help = document.getElementById('help');
  help.textContent = T.help;
  setTimeout(function(){ help.style.opacity = 0; setTimeout(function(){ help.hidden = true; help.style.opacity = 1; }, 1000); }, 6000);

  show(fromHash(), false);
})();`

async function buildHtml(meta, slides, outDir, inline) {
  const lang = (meta.lang || 'en').slice(0, 2).toLowerCase()
  const t = STRINGS[lang] || STRINGS.en
  const title = meta.title || slides.find((s) => s.title)?.title || 'Slideshow'
  const rendered = []
  for (let i = 0; i < slides.length; i++) rendered.push(await renderSlide(slides[i], i + 1, slides.length, t, outDir, inline))
  const i18n = JSON.stringify({ notes: t.notes, help: t.help }).replace(/</g, '\\u003c')

  return `<!DOCTYPE html>
<html lang="${esc(lang)}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(title)}</title>
<!-- Generated by docs/slideshows/build-slideshow.mjs — edit the .md source, not this file. -->
<style>${CSS}</style>
</head>
<body>
<div id="bar"></div>
<main id="deck">
${rendered.join('\n')}
</main>
<div id="counter" aria-hidden="true"></div>
<button class="btn" id="btn-full" type="button" title="${esc(t.fullscreen)} (F)" aria-label="${esc(t.fullscreen)}">⛶</button>
<button class="btn" id="btn-info" type="button" title="${esc(t.info)} (I)" aria-label="${esc(t.info)}">i</button>
<div id="info-panel" role="dialog" aria-label="${esc(t.source)}" hidden></div>
<div id="notes-panel" hidden></div>
<div id="help" hidden></div>
<div id="blank" hidden></div>
<script type="application/json" id="i18n">${i18n}</script>
<script>${JS}</script>
</body>
</html>
`
}

// ───────────────────────── main ─────────────────────────
async function main() {
  const opts = parseArgs(process.argv.slice(2))
  if (opts.help || !opts.input) {
    console.log(`Usage: node build-slideshow.mjs <deck.md> [-o out.html] [--media-dir DIR] [--no-download] [--inline]`)
    process.exit(opts.help ? 0 : 1)
  }
  const input = path.resolve(opts.input)
  const mdDir = path.dirname(input)
  const out = path.resolve(opts.out || input.replace(/\.md$/i, '') + '.html')
  const outDir = path.dirname(out)
  const mediaDir = path.resolve(opts.mediaDir || path.join(mdDir, 'media'))

  const { meta, body } = parseFrontMatter(await readFile(input, 'utf8'))
  const slides = parseSlides(body)
  if (!slides.length) throw new Error('No slides found in ' + input)
  checkLicenses(slides, opts.allowAttribution)

  console.log(`Building ${path.relative(process.cwd(), input)} — ${slides.length} slides`)
  const stats = await resolveMedia(slides, opts, mdDir, mediaDir)
  const html = await buildHtml(meta, slides, outDir, opts.inline)
  await mkdir(outDir, { recursive: true })
  await writeFile(out, html)

  console.log(`Done → ${path.relative(process.cwd(), out)}  (images: ${stats.downloaded} downloaded, ${stats.cached} cached, ${stats.failed} failed${opts.inline ? ', inlined' : ''}; ${(Buffer.byteLength(html) / 1024).toFixed(0)} kB)`)
}

main().catch((err) => { console.error('Error:', err.message); process.exit(1) })
