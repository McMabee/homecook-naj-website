# Home Cooking with Naj

Marketing site for Home Cooking with Naj, a private home chef and culinary creator based in Ancaster, Ontario, serving Hamilton, Burlington, and Oakville. Views: Home (hero, about, brand partners, services, Instagram tiles, service area), Recipes, Contact, and a hidden admin for recipes, Instagram tiles, and social links.

## Stack

- [Vite](https://vite.dev) 8, [React](https://react.dev) 19, TypeScript
- [Tailwind CSS](https://tailwindcss.com) v4. Brand colours and fonts are theme tokens at the top of `src/index.css`.
- No router. Page switching is plain React state in `src/App.tsx`, so the whole site is served from `/` and any static host works.
- [Supabase](https://supabase.com) for the live content and the admin login: one `site_content` table, one public `images` bucket, and Supabase Auth. The browser talks to it directly with the publishable key, and row-level security policies decide who may write.

## Run it locally

```sh
npm install
cp .env.example .env.local     # then edit the values (see Configuration)
npm run dev              # http://localhost:5173
```

Other scripts:

| Command | What it does |
| --- | --- |
| `npm run build` | Type-checks, then writes a production build to `dist/` |
| `npm run preview` | Serves `dist/` at http://localhost:4173 so you can check the build before deploying |
| `npm run typecheck` | Type-check only |
| `npm run format` | Format the codebase with oxfmt |
| `npm run content:export` | Saves the live `site_content` rows to `backups/content/` (see Content backup and recovery) |
| `npm run images:export` | Downloads the `images` bucket to `backups/images/` |
| `npm run content:restore -- <file>` | Writes a content export back to Supabase; needs the secret key in `.env.local` |

## Configuration

Settings live in `.env.local` (gitignored). `.env.example` documents each one. Vite bakes `VITE_*` variables into the JavaScript bundle at build time, which means:

- after changing a value, restart `npm run dev` or rebuild
- on your host, set the same variables in its environment settings so they are present when the build runs

| Variable | Purpose |
| --- | --- |
| `VITE_FORMSUBMIT_ENDPOINT` | Where the contact form posts. Uses [FormSubmit](https://formsubmit.co) in the form `https://formsubmit.co/ajax/<email>`. The first real submission triggers a one-time activation email to that address. If unset, the form shows an error instead of pretending to send. |
| `VITE_SUPABASE_URL` | The Supabase project URL, e.g. `https://abcdefghijkl.supabase.co`. |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | The project's publishable key (`sb_publishable_…`). Safe to ship: reads are public and writes need a signed-in owner. Never put the secret key here. |

If the two Supabase values are missing, visitors see the seed content from `src/store/` and the admin shows a "not set up" message. A `DATABASE_PASSWORD` line in `.env.local` is only for direct SQL access from tooling; Vite ignores it because it has no `VITE_` prefix.

## Content and the admin

The admin lives behind the tiny dot at the bottom-right of the footer. Sign in with the owner's Supabase Auth email and password; "Forgot your password?" emails a reset link, which needs the site's address in the project's redirect allow-list. It has three tabs:

- **Recipes**: add, edit, and delete the recipes shown on the Recipes page. Photos can be pasted as a URL or uploaded; uploads are downscaled to 1600px in the browser and stored in the `images` bucket under `recipes/` or `instagram/`, each with a new file name so nothing is ever served stale. Replaced photos are not deleted from the bucket.
- **Instagram**: the tiles in the "Fresh from the Kitchen" section on the home page. Each tile has a photo, a link to the post, and a caption. The first 8 are shown, in the order listed; use the arrows to reorder. It starts with four placeholder tiles made from Naj's photos (`public/instagram/`) that link to the profile.
- **Settings**: Instagram handle and Facebook page URL, used by the footer, the contact page, and the Instagram section.

All three save through `src/store/storage.ts`, which reads and upserts one JSON row per key in the `site_content` table. `src/store/content.tsx` loads the three rows once when the app mounts and shares them with every page; the admin panels push their saved results into it, so a change is live for visitors on their next page load. Until the first save, and whenever the backend cannot be reached, the seed data in `src/store/` is shown instead.

The "Trusted By" row on the home page is not in the admin. Its logos live in `src/assets/logos/` as white, transparent-background files, and the `BRANDS` list at the top of `src/components/BrandPartners.tsx` sets their order, alt text, and display height.

The seed recipes in `src/store/recipes.ts` are transcribed from recipes Naj published on Instagram; each one links back to its reel. Their photos are the reel cover frames, cropped to 3:2 and stored in `public/recipes/`. A comment above each recipe says whether the method is from her caption or was written to match the reel.

## Content backup and recovery

Everything Naj edits in the admin lives in the Supabase project: the three rows of the `site_content` table (`chef_recipes`, `naj_instagram_posts`, `naj_settings`) and the uploaded photos in the `images` bucket. The Supabase Free plan takes no automatic database backups, and a database backup would not contain the photo files anyway, only their metadata. So back up by hand after any significant editing session, and keep at least one recent copy somewhere other than the Supabase project itself: the content export is small enough to commit to this repo, and the photo backup belongs in a cloud drive.

### Back up the content rows

```sh
npm run content:export
```

This reads the `site_content` rows with the publishable key (they are public by design, so the script needs nothing more) and writes them to `backups/content/site-content-<timestamp>.json`. Open the file and check that all three keys are there. A key is missing only if the admin has never saved that section, in which case the site shows the seed content from `src/store/` for it; the script warns when that happens.

### Back up the photos

```sh
npm run images:export
```

This lists the `images` bucket and downloads every file into `backups/images/`, keeping the `recipes/` and `instagram/` folders. Files already present locally are skipped, which is safe because an upload never overwrites an existing object. `backups/images/` is gitignored (binary, and it grows), so copy it to a cloud drive after running it.

The same files can also be downloaded one at a time in the Supabase dashboard under Storage → images, or all at once with the Supabase CLI once it is logged in and linked to the project:

```sh
npx supabase login
npx supabase link --project-ref <project-ref>
npx supabase storage cp -r ss://images backups/images --experimental --linked
```

### Restore the content rows

1. Find the newest known-good `backups/content/site-content-*.json`.
2. In the Supabase dashboard, under Project Settings → API Keys, copy the project's **secret** key (`sb_secret_…`) and add it to `.env.local` as `SUPABASE_SECRET_KEY=…`. The name must not start with `VITE_`: the secret key bypasses row-level security, and Vite bakes every `VITE_` variable into the public site. Never commit it and never add it to the host's build environment; the restore script refuses to run if it finds a `VITE_SUPABASE_SECRET_KEY`.
3. Preview, then write:

   ```sh
   npm run content:restore -- backups/content/site-content-<timestamp>.json --dry-run
   npm run content:restore -- backups/content/site-content-<timestamp>.json
   ```

   The script upserts the rows by key, so it works whether the table is empty or holds bad data, and it prints the table's keys afterwards.
4. Remove `SUPABASE_SECRET_KEY` from `.env.local` again.

### Restore the photos

The content rows reference photos by their full public URL, so a missing photo must go back under exactly its original path. In the dashboard, open Storage → images, open the matching folder (`recipes` or `instagram`), and upload the file from `backups/images/` with the same name. The CLI can copy a whole folder back: `npx supabase storage cp -r backups/images ss://images --experimental --linked`.

### Check, and the last resort

After a restore, open the public site without signing in and check the recipes, the Instagram tiles and their order, the Facebook URL, and that every photo loads.

If no usable backup exists, the seed content in `src/store/` is the fallback: with the three rows deleted (or the table empty) the site shows the seed content, and Naj can re-enter her changes in the admin. Recovery order, best first: the newest JSON export, then the newest photo backup, then older exports and photo backups, then the in-code seed content.

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
2. **Supabase project.** The admin needs the `site_content` table and the `images` bucket with their row-level security policies, one owner account, and sign-ups turned off under Authentication. While sign-ups are open, anyone who registers counts as `authenticated` and passes the write policies. The full checklist, in order, is in `TODO.md`.
3. **Backups.** The free tier has no automatic database backups. After Naj's editing sessions run `npm run content:export` and `npm run images:export`, and commit the JSON export; the restore steps are under "Content backup and recovery" above.
4. **Photos.** `src/assets/` holds web-sized copies of photos from `pics/` (the originals, which are not deployed). The home hero, the About section, the Private In-Home Dinners service card, and the Contact page header use them. Stock Unsplash photos are still used for the other three service cards, the "every table deserves a little magic" band, and the Recipes page header. Swap any of them by dropping a file into `src/assets/` and updating the `src` in the relevant component.
5. **Social preview image and structured data.** Add an `og:image` tag to `index.html` with an absolute URL once the domain is known, and add `url` and `image` to the LocalBusiness JSON-LD block there. That block also hardcodes the Instagram and Facebook URLs in `sameAs`; update it if the handles change.
6. **Instagram tiles are curated, not a live feed.** Meta's Basic Display API was retired in December 2024, and the replacement Graph API needs a Business account, a Meta developer app, and a server to hold a token that expires every 60 days. The curated tiles need none of that. If a live feed becomes a requirement, it belongs in the Supabase project alongside the rest of the content.
