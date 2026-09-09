# Home Cooking with Naj

Marketing site for Home Cooking with Naj, a private chef and culinary creator based in Ancaster, Ontario, serving Hamilton, Burlington, and Oakville. Views: Home (hero, about, brand partners, services, Instagram tiles, service area), Recipes, Contact, and a hidden admin for recipes, Instagram tiles, and social links.

## Stack

- [Vite](https://vite.dev) 8, [React](https://react.dev) 19, TypeScript
- [Tailwind CSS](https://tailwindcss.com) v4. Brand colours and fonts are theme tokens at the top of `src/index.css`.
- No router and no backend. Page switching is plain React state in `src/App.tsx`, so the whole site is served from `/` and any static host works.

## Run it locally

```sh
npm install
cp .env.example .env     # then edit the values (see Configuration)
npm run dev              # http://localhost:5173
```

Other scripts:

| Command | What it does |
| --- | --- |
| `npm run build` | Type-checks, then writes a production build to `dist/` |
| `npm run preview` | Serves `dist/` at http://localhost:4173 so you can check the build before deploying |
| `npm run typecheck` | Type-check only |
| `npm run format` | Format the codebase with oxfmt |

## Configuration

Settings live in `.env` (gitignored). `.env.example` documents each one. Vite bakes `VITE_*` variables into the JavaScript bundle at build time, which means:

- after changing a value, restart `npm run dev` or rebuild
- on your host, set the same variables in its environment settings so they are present when the build runs

| Variable | Purpose |
| --- | --- |
| `VITE_FORMSUBMIT_ENDPOINT` | Where the contact form posts. Uses [FormSubmit](https://formsubmit.co) in the form `https://formsubmit.co/ajax/<email>`. The first real submission triggers a one-time activation email to that address. If unset, the form shows an error instead of pretending to send. |
| `VITE_ADMIN_PASSWORD` | Password for the recipe admin page. If unset, the admin login is disabled. |

## Content and the admin

The admin lives behind the tiny dot at the bottom-right of the footer (password from `VITE_ADMIN_PASSWORD`). It has three tabs:

- **Recipes**: add, edit, and delete the recipes shown on the Recipes page. Photos can be pasted as a URL or uploaded (uploads are downscaled in the browser).
- **Instagram**: the tiles in the "Fresh from the Kitchen" section on the home page. Each tile has a photo, a link to the post, and a caption. The first 8 are shown, in the order listed; use the arrows to reorder. It starts with four placeholder tiles made from Naj's photos (`public/instagram/`) that link to the profile.
- **Settings**: Instagram handle and Facebook page URL, used by the footer, the contact page, and the Instagram section.

All three save through `src/store/storage.ts`, which currently writes to the browser's `localStorage`. See the note under "Before going live".

The "Trusted By" row on the home page is not in the admin. Its logos live in `src/assets/logos/` as white, transparent-background files, and the `BRANDS` list at the top of `src/components/BrandPartners.tsx` sets their order, alt text, and display height.

The seed recipes in `src/store/recipes.ts` are transcribed from recipes Naj published on Instagram; each one links back to its reel. Their photos are the reel cover frames, cropped to 3:2 and stored in `public/recipes/`. A comment above each recipe says whether the method is from her caption or was written to match the reel.

## Deploying

This is a static site. Point any static host (Netlify, Vercel, Cloudflare Pages, and similar) at the repo with:

| Setting | Value |
| --- | --- |
| Build command | `npm run build` |
| Output directory | `dist` |
| Node version | 20.19 or newer (see `engines` in `package.json`) |

No redirect or rewrite rules are needed because there is only one route. If you ever host under a sub-path (for example a GitHub Pages *project* site at `user.github.io/repo/`), set `base: '/repo/'` in `vite.config.ts`.

## Before going live

1. **Contact form.** Set `VITE_FORMSUBMIT_ENDPOINT` to Naj's real address and send one test message to complete FormSubmit's activation.
2. **The admin is browser-local.** Everything saved in the admin (recipes, Instagram tiles, social links) is stored in `localStorage` in *that browser only*. A change Naj makes on her laptop will not appear for visitors. Until `src/store/storage.ts` is backed by a real datastore, treat the admin as a preview tool and change what visitors see by editing the seed data in `src/store/recipes.ts`, `src/store/instagram.ts`, and `src/store/settings.ts`.
3. **The admin password is not secret.** It ships inside the JavaScript bundle. It keeps casual visitors out, nothing more.
4. **Photos.** `src/assets/` holds web-sized copies of photos from `pics/` (the originals, which are not deployed). The home hero, the About section, the Private In-Home Dinners service card, and the Contact page header use them. Stock Unsplash photos are still used for the other three service cards, the "every table deserves a little magic" band, and the Recipes page header. Swap any of them by dropping a file into `src/assets/` and updating the `src` in the relevant component.
5. **Social preview image and structured data.** Add an `og:image` tag to `index.html` with an absolute URL once the domain is known, and add `url` and `image` to the LocalBusiness JSON-LD block there. That block also hardcodes the Instagram and Facebook URLs in `sameAs`; update it if the handles change.
6. **Instagram tiles are curated, not a live feed.** Meta's Basic Display API was retired in December 2024, and the replacement Graph API needs a Business account, a Meta developer app, and a server to hold a token that expires every 60 days. The curated tiles need none of that. If a live feed becomes a requirement, it belongs in the same backend that will replace `localStorage`.
