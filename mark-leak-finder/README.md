# Mark Leak Finder

The 10-Minute Grade 9 Maths Mark Leak Finder for LocalTutors. The tool is one file: `index.html`.

## Hosting

Upload `index.html` to any static host (GitHub Pages, Netlify, Cloudflare Pages or a plain web server). There is no build step.

## CONFIG (top of the `<script>` in `index.html`)

- `pageUrl`: the live URL of the page. Builds the "Open full results" link in the WhatsApp message.
- `whatsapp` / `whatsappShown`: the LocalTutors WhatsApp number, international format without `+`, and as shown on screen.
- `supabaseUrl` / `supabaseKey`: where parent sign-ups and results are saved (project URL and publishable key). Empty means nothing is saved.

## Saving sign-ups

Run `supabase/leads.sql` once in the Supabase SQL editor. The page can only add rows; read them in Table Editor, or the `leads_with_results` view for one line per learner.

## Tests

With Playwright installed, run `node tests/flow.test.js` from this folder.
