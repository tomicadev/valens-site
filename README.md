# valens-site

Phase 1 marketing landing for VALENS (workout tracker). Static site — no build step.

## Local preview

    npx http-server -p 8080 -c-1 .

Then open http://localhost:8080

## Before shipping

1. Open `config.js` and paste the Supabase **anon/publishable** key (Project Settings → API
   in the Supabase dashboard for project `lkkijojnuqnrjyqrqgnd`). Never use the `service_role` key.
2. Apply the newsletter table migration from the app repo (`D:\valens_app`), not from here:

       supabase db push

   using `supabase/newsletter_signups.sql` in this repo as the reference for what that
   migration should contain.
3. Send a test signup through the live form and confirm a row lands in
   `public.newsletter_signups`.

## Deploy (GitHub Pages)

1. Push this repo to `tomicadev/valens-site` (public).
2. GitHub → repo → Settings → Pages → Source: Deploy from a branch → `main` / `/ (root)`.
3. DNS at your registrar for `valens.rs`:
   - 4× `A` records at the apex → `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
   - `www` → `CNAME` → `tomicadev.github.io`
4. Wait for DNS propagation, then confirm `https://valens.rs` loads with a valid certificate
   (GitHub issues one automatically once DNS resolves correctly).
