// Maak die Middeljare Facebook-varianten as PNG, teen 2x (2160x2700) vir skerp beelde.
// Gebruik (in die oase-vouer): node scripts/social/render-varianten.mjs
import { chromium } from "playwright";
import { fileURLToPath, pathToFileURL } from "node:url";
import { mkdirSync } from "node:fs";
import path from "node:path";

const hier = path.dirname(fileURLToPath(import.meta.url));
const uit = path.resolve(hier, "../../content/social/beelde");
mkdirSync(uit, { recursive: true });

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1200, height: 1400 }, deviceScaleFactor: 2 });
await page.goto(pathToFileURL(path.join(hier, "middeljare-varianten.html")).href);
await page.evaluate(() => document.fonts.ready);
const kaarte = await page.$$(".kaart");
for (const k of kaarte) {
  const naam = await k.getAttribute("data-naam");
  // Kyk of iets buite die kaart val, of te naby aan die onderkant kom.
  const oorloop = await k.evaluate((el) => {
    const r = el.getBoundingClientRect();
    const buite = [...el.querySelectorAll("*:not(.sirkel)")].some((c) => {
      const b = c.getBoundingClientRect();
      return b.width > 0 && (b.left < r.left - 1 || b.right > r.right + 1 || b.bottom > r.bottom - 40);
    });
    return buite || el.scrollHeight > el.clientHeight + 1;
  });
  const f = path.join(uit, `middeljare-fb-${naam}.png`);
  await k.screenshot({ path: f });
  console.log(`${path.basename(f)}  oorloop: ${oorloop}`);
}
await browser.close();
