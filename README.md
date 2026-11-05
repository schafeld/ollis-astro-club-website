# Nuxt Minimal Starter

Look at the [Nuxt documentation](https://nuxt.com/docs/getting-started/introduction) to learn more.

## Setup

Make sure to install dependencies:

```bash
# npm
npm install

# pnpm
pnpm install

# yarn
yarn install

# bun
bun install
```

## Development Server

Start the development server on `http://localhost:3000`:

```bash
# npm
npm run dev

# pnpm
pnpm dev

# yarn
yarn dev

# bun
bun run dev
```

## Production

Build the application for production:

```bash
# npm
npm run build

# pnpm
pnpm build

# yarn
yarn build

# bun
bun run build
```

Locally preview production build:

```bash
# npm
npm run preview

# pnpm
pnpm preview

# yarn
yarn preview

# bun
bun run preview
```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.

## Slideshows

`docs/slideshows/` contains a small zero-dependency tool that builds single-file HTML slideshows from Markdown
(`npm run slides -- docs/slideshows/<deck>.md`) plus example decks. See
[docs/slideshows/README.md](docs/slideshows/README.md).

## Content, images & copyright policy

This is an open-source repository. To keep it freely reusable:

- **Do not commit anything copyrighted or anything that requires attribution** – no photos, graphics, fonts,
  text excerpts, logos or media under CC BY, CC BY-SA, "free with credit", agency/press licences or similar.
- **Only public-domain / CC0 material, or work you created yourself and release under this repo's licence (MIT),
  may be added.** Check the licence on the original file page – not on a search result or a re-upload.
- Referencing an image only by URL is not a loophole: it must still be public domain / CC0 here.
  The slideshow builder enforces this for slide images (it refuses anything without a clear public-domain licence).
- Downloaded copies of third-party images are local caches only (git-ignored, e.g. `docs/slideshows/media/`).
- Website content (news, pictures) lives in Sanity, not in this repo; keep it there.
- Third-party **code** dependencies stay under their own licences via npm; don't paste copied code or
  assets without a compatible licence.
- If you spot something that violates this, open an issue or remove it.

## License

The source code and original documentation in this repository are released under the [MIT License](LICENSE).
This covers the code only: the organisation's name and logo, and the website content managed in Sanity
(news, photos, texts), are not part of the MIT grant and stay with their respective owners.
Third-party dependencies keep their own licences.
