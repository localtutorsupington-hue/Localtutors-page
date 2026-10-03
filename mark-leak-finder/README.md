# Mark Leak Finder

The 10-Minute Grade 9 Maths Mark Leak Finder for LocalTutors. Everything lives in one file: `index.html`.

## Hosting

1. Upload `index.html` to any static host (GitHub Pages, Netlify, Cloudflare Pages, or a plain web server).
2. There is no build step, no backend and no other file to upload.

## Two CONFIG values

At the top of the `<script>` in `index.html`:

- `pageUrl`: the live URL of the page once hosted, for example `https://example.com/mark-leak-finder/`. While it is empty, the WhatsApp message leaves out the "Open full results" link and only sends the report code.
- `whatsapp`: the LocalTutors WhatsApp number in international format without `+` (currently `27697346705`). Update `whatsappShown` to match.

## Tests

With Playwright installed, run `node tests/flow.test.js` from this folder.
