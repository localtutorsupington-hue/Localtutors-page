// Maak die sosiale kaarte as PNG.
// Gebruik (in die oase-vouer): node scripts/social/render.mjs
import { chromium } from "playwright";
import { fileURLToPath, pathToFileURL } from "node:url";
import path from "node:path";

const hier = path.dirname(fileURLToPath(import.meta.url));
const uit = path.resolve(hier, "../../public/images/artikels");

const kaarte = [
  { html: "fb.html", png: "te-gemaklik-fb.png", width: 1080, height: 1350 },
  { html: "og.html", png: "te-gemaklik-og.png", width: 1200, height: 630 },
  { html: "middeljare-fb.html", png: "middeljare-fb.png", width: 1080, height: 1350 },
];

const browser = await chromium.launch();
for (const k of kaarte) {
  const page = await browser.newPage({ viewport: { width: k.width, height: k.height }, deviceScaleFactor: 1 });
  await page.goto(pathToFileURL(path.join(hier, k.html)).href);
  await page.evaluate(() => document.fonts.ready);
  const fonts = await page.evaluate(() => [...document.fonts].filter((f) => f.status === "loaded").map((f) => `${f.family} ${f.style}`));
  // Kyk of die teks binne die kaart pas.
  const oorloop = await page.evaluate(() => {
    const k = document.querySelector(".kaart").getBoundingClientRect();
    return [...document.querySelectorAll("h1, .etiket, .merk, .leuse, .oproep, .simptome")].some((el) => {
      const r = el.getBoundingClientRect();
      return r.left < k.left || r.right > k.right || r.top < k.top || r.bottom > k.bottom || el.scrollWidth > el.clientWidth + 1;
    });
  });
  await page.screenshot({ path: path.join(uit, k.png), clip: { x: 0, y: 0, width: k.width, height: k.height } });
  console.log(`${k.png}: ${k.width}x${k.height}, fonts: ${fonts.join(", ")}, oorloop: ${oorloop}`);
  await page.close();
}
await browser.close();
