# Home Cooking with Naj — to-do list

Check off tasks as they are completed. The current site is a static Vite app; admin edits are saved only in the browser that made them.

## Before launch

- [ ] **Choose how site content will be published.** For a static launch, update and commit the seed recipes, Instagram tiles, and social settings in `src/store/`, then disable the browser-only admin. If Naj needs to edit the live site, complete the production admin work below first.
- [ ] **Set up and test the contact form.** Configure `VITE_FORMSUBMIT_ENDPOINT` for Naj's real inbox, complete FormSubmit's activation, and submit a real test enquiry. Confirm that Naj receives it and that the form shows the correct success or error state. (`src/pages/Contact.tsx`, `.env.example`)
- [ ] **Review the public content with Naj.** Confirm the biography, service descriptions and areas, response-time promise, brand-partner names/logos, social links, and every published recipe's ingredients and method. (`src/pages/`, `src/components/BrandPartners.tsx`, `src/store/recipes.ts`)
- [ ] **Replace the four sample Instagram tiles.** Use approved photos, accurate captions, and links to the specific posts; commit the finished tiles to `src/store/instagram.ts` for a static launch. The current tiles link to the profile.
- [ ] **Finalize imagery.** Replace the remaining Unsplash images in the service cards, home-page feature band, and Recipes header with approved images; check crops and loading on mobile. (`src/pages/Home.tsx`, `src/pages/Recipes.tsx`)
- [ ] **Finish metadata once the domain is known.** Add a social preview image and canonical site URL, and update the LocalBusiness `url`, `image`, and `sameAs` values. (`index.html`)
- [ ] **Run a launch review.** Check Home, Recipes, Contact, links, forms, and mobile navigation on phone and desktop; test keyboard navigation and the recipe dialog; run `npm run build` and verify the deployed preview before pointing the domain at it.

## If the live admin is needed

- [ ] **Replace browser-local storage with shared persistence.** Make recipes, Instagram tiles, settings, and uploaded images available to every visitor after Naj saves them. The Supabase package is present, but the current stores still use `localStorage`. (`src/store/`, `src/lib/image.ts`)
- [ ] **Replace the bundled admin password with real owner access control.** `VITE_ADMIN_PASSWORD` is included in public JavaScript and cannot protect writes. Require authenticated, authorized writes in the data service and verify that an anonymous visitor cannot edit content. (`src/pages/admin/`, `.env.example`)
- [ ] **Test content recovery.** Check edit, delete, image upload, reload, and a second browser; document how to back up and restore published content.

## After launch

- [ ] **Give Recipes and Contact their own URLs** if direct links, browser back/forward, and separate search results are important. Page changes currently happen only in React state. (`src/App.tsx`)
- [ ] **Add a small set of browser smoke tests** for navigation, recipe viewing, and contact-form success/error behavior once the launch workflow is stable.
- [ ] **Check real-device performance and accessibility** after deployment, then address any measured issues with images, contrast, focus, or loading.
