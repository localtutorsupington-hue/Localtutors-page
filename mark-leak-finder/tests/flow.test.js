/* Mark Leak Finder acceptance checks.
   Run from ./mark-leak-finder: node tests/flow.test.js
   Uses the Playwright that is already installed (local or global). Serves index.html on localhost.
   Google Fonts requests are answered with an empty stylesheet so the test needs no network. */
const fs = require("fs");
const path = require("path");
const http = require("http");
const { execSync } = require("child_process");

function loadPlaywright(){
  try { return require("playwright"); } catch (e) {}
  const root = execSync("npm root -g").toString().trim();
  return require(path.join(root, "playwright"));
}
const { chromium } = loadPlaywright();

const DIR = path.resolve(__dirname, "..");
const HTML = fs.readFileSync(path.join(DIR, "index.html"), "utf8");
const README = fs.readFileSync(path.join(DIR, "README.md"), "utf8");
const SELF = fs.readFileSync(__filename, "utf8");

const results = [];
function record(n, name, pass, evidence){
  results.push({ n, name, pass, evidence });
  console.log(`${pass ? "PASS" : "FAIL"}  #${n} ${name}\n      ${evidence.split("\n").join("\n      ")}`);
}

function serve(){
  return new Promise(res => {
    const srv = http.createServer((req, rsp) => {
      const p = decodeURIComponent(req.url.split("?")[0].split("#")[0]);
      const file = path.join(DIR, p === "/" ? "index.html" : p);
      if (!file.startsWith(DIR) || !fs.existsSync(file) || fs.statSync(file).isDirectory()){ rsp.writeHead(404); rsp.end(); return; }
      rsp.writeHead(200, { "content-type": file.endsWith(".html") ? "text/html; charset=utf-8" : "text/plain" });
      fs.createReadStream(file).pipe(rsp);
    });
    srv.listen(0, "127.0.0.1", () => res(srv));
  });
}

let browser, BASE;
const outside = [];
async function newPage(width = 390, height = 844){
  const ctx = await browser.newContext({ viewport: { width, height } });
  const page = await ctx.newPage();
  page.errors = [];
  page.on("console", m => { if (m.type() === "error") page.errors.push(m.text()); });
  page.on("pageerror", e => page.errors.push("pageerror: " + e.message));
  await page.route("**/*", route => {
    const u = route.request().url();
    if (u.startsWith(BASE)) return route.continue();
    if (u.startsWith("https://fonts.googleapis.com/")) return route.fulfill({ status: 200, contentType: "text/css", body: "" });
    outside.push(u);
    return route.abort();
  });
  return page;
}

/* Answer plan entries: { j: optionIndex, sure: bool } or { idk: true }. "ok" picks the correct option, "bad" a wrong one. */
async function resolvePlan(page, plan){
  const okIdx = await page.evaluate("QS.map(q => q.o.findIndex(o => o.ok))");
  return plan.map((p, i) => {
    if (p.idk) return p;
    if (p.ok) return { j: okIdx[i], sure: p.sure };
    if (p.bad) return { j: okIdx[i] === 0 ? 1 : 0, sure: p.sure };
    return p;
  });
}
async function answerAll(page, plan){
  const steps = await resolvePlan(page, plan);
  for (let i = 0; i < steps.length; i++){
    await page.waitForFunction(`S.screen === "q" && S.qi === ${i}`);
    const s = steps[i];
    if (s.idk) await page.click('[data-act="idk"]');
    else {
      await page.click(`[data-act="choose"][data-j="${s.j}"]`);
      await page.waitForSelector("#conf.show");
      await page.click(`[data-act="sure"][data-v="${s.sure ? 1 : 0}"]`);
    }
  }
  await page.waitForFunction('S.screen === "analysing"');
  await page.waitForFunction('S.screen === "report"', null, { timeout: 5000 });
}
async function startWith(page, name, lang = "en"){
  await page.goto(BASE + "/index.html");
  if (lang === "af") await page.click('.lang [data-l="af"]');
  await page.fill("#nm", name);
  await page.press("#nm", "Enter");
  await page.waitForFunction('S.screen === "q"');
}
/* Put the page straight onto a report with a given plan, without clicking through. */
async function setReport(page, plan, name = "Liam", lang = "en"){
  const steps = await resolvePlan(page, plan);
  await page.evaluate(([steps, name, lang]) => {
    S.lang = lang; S.name = name; S.shared = null;
    S.answers = steps.map(s => s.idk ? { c: -1, sure: false } : { c: s.j, sure: s.sure });
    S.doneDay = today(); S.screen = "report"; render(true);
  }, [steps, name, lang]);
}
const MIX = [
  { ok:1, sure:true }, { ok:1, sure:false }, { bad:1, sure:true }, { idk:true },
  { ok:1, sure:true }, { bad:1, sure:false }, { ok:1, sure:true }, { bad:1, sure:true },
  { ok:1, sure:false }, { idk:true }, { bad:1, sure:true }, { ok:1, sure:true }
];
const ALL = (p) => Array.from({ length: 12 }, () => ({ ...p }));
const raf2 = (page) => page.evaluate(() => new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r))));

/* ===== 1. Forbidden strings ===== */
function check1(){
  const DASH = String.fromCharCode(0x2014);
  const terms = [DASH, "R1000", "R1 000", "spot", "Term 4 plan", "guarantee", "Evan", "countdown", "deadline"];
  const lines = [], bad = [];
  for (const [fname, text] of [["index.html", HTML], ["README.md", README]]){
    text.split("\n").forEach((ln, k) => {
      for (const t of terms){
        const re = new RegExp(t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "gi");
        let m;
        while ((m = re.exec(ln))){
          const word = (ln.slice(0, m.index).match(/[A-Za-z]*$/)[0] + ln.slice(m.index).match(/^[A-Za-z]*/)[0]);
          const allowed = (t === "Evan" && ln.includes("Evan to check before launch")) || (t === "spot" && word.toLowerCase() !== "spot" && word.toLowerCase() !== "spots");
          lines.push(`${fname}:${k + 1} "${t === DASH ? "U+2014" : t}" in "${word || m[0]}" ${allowed ? "(allowed)" : "(NOT allowed)"}`);
          if (!allowed) bad.push(lines[lines.length - 1]);
        }
      }
    });
  }
  const rands = [...HTML.matchAll(/\bR\s?\d[\d ]*/g)].map(m => m[0].trim());
  const okRands = ["R240", "R60", "R180", "R215", "R300"];
  const badRands = rands.filter(r => !okRands.includes(r));
  const selfDash = SELF.includes(String.fromCharCode(0x2014));
  record(1, "Forbidden strings", !bad.length && !badRands.length && !selfDash,
    `matches: ${lines.length ? "\n" + lines.join("\n") : "none"}\nrand amounts in index.html: ${[...new Set(rands)].join(", ")}${badRands.length ? " | NOT allowed: " + badRands.join(", ") : " (all inside questions)"}\nem dash in tests/flow.test.js: ${selfDash ? "yes" : "none"}`);
}

/* ===== 2. Overflow ===== */
async function check2(){
  const rows = []; let pass = true;
  for (const [w, h] of [[360, 740], [390, 844], [430, 932]]){
    const page = await newPage(w, h);
    const measure = async (label) => {
      const [sw, iw] = await page.evaluate(() => [document.documentElement.scrollWidth, innerWidth]);
      if (sw > iw) pass = false;
      rows.push(`${w}x${h} ${label}: scrollWidth ${sw} / innerWidth ${iw}`);
    };
    await page.goto(BASE + "/index.html");
    await page.click('[data-act="toggle-paste"]');
    await measure("welcome");
    await page.fill("#nm", "Bartholomewsandersen");
    await page.click('[data-act="start"]');
    await page.click('[data-act="choose"][data-j="0"]');
    await measure("question 1 + confidence panel");
    await page.evaluate("S.qi = 10; render(true)");
    await measure("question 11 (word problem)");
    await setReport(page, MIX, "Bartholomewsandersen");
    await page.waitForTimeout(450);
    await measure("report");
    await page.evaluate("window.scrollTo(0, 1600)"); await raf2(page);
    await measure("report, sticky bar region");
    const code = await page.evaluate("encode()");
    await page.goto(`${BASE}/index.html#${code}`);
    await page.waitForSelector(".banner");
    await page.waitForTimeout(450);
    await measure("shared view");
    await page.context().close();
  }
  record(2, "Overflow at 360, 390, 430", pass, rows.join("\n"));
}

/* ===== 3. Full flow in English ===== */
async function check3(){
  const page = await newPage();
  await page.goto(BASE + "/index.html");
  await page.click('[data-act="start"]');
  const errShown = await page.isVisible(".err-msg");
  await page.fill("#nm", "Liam");
  await page.press("#nm", "Enter");
  await page.waitForFunction('S.screen === "q"');
  await page.click('[data-act="back"]');
  const backToWelcome = await page.evaluate('S.screen === "welcome"');
  await page.click('[data-act="start"]');
  const t0 = Date.now();
  await answerAll(page, MIX);
  const ms = Date.now() - t0;
  const info = await page.evaluate(() => ({ h1: document.querySelector(".r-id h1").textContent, acc: document.querySelectorAll("details.acc").length, score: document.querySelector(".r-num").textContent, type: analyse().type, answers: S.answers.map(a => a.c < 0 ? "idk" : a.c + (a.sure ? "S" : "N")).join(" ") }));
  const pass = errShown && backToWelcome && !page.errors.length && info.h1 === "Liam's Leak Map" && info.acc === 6;
  record(3, "Full flow in English", pass,
    `name-required error shown: ${errShown}; Back from Q1 goes to welcome: ${backToWelcome}\nanswers recorded: ${info.answers}\nreport heading "${info.h1}", ${info.acc} accordions, score ${info.score}, type ${info.type}, flow incl. analysing ${ms}ms\nconsole errors: ${page.errors.length ? page.errors.join(" | ") : "none"}`);
  await page.context().close();
}

/* ===== 4. Roundtrip ===== */
async function check4(){
  const rows = []; let pass = true;
  const page = await newPage();
  await startWith(page, "Zoë", "af");
  await answerAll(page, MIX);
  const ui = await page.evaluate(() => {
    const code = document.getElementById("code").value, d = decode(code);
    return { code, same: JSON.stringify(d.answers) === JSON.stringify(S.answers), lang: d.lang, day: d.day === S.doneDay, name: d.name, expect: cleanName(S.name) };
  });
  pass = pass && ui.same && ui.lang === "af" && ui.day && ui.name === "Zoe" && ui.expect === "Zoe";
  rows.push(`Afrikaans UI run "Zoë": code ${ui.code}\n  answers identical ${ui.same}, lang ${ui.lang}, day identical ${ui.day}, name "${ui.name}" (expected "Zoe")`);
  for (const [name, lang] of [["Mary-Jane", "en"], ["Zoë", "en"], ["Liam", "af"], ["", "en"], ["Abcdefghijklmnopqrstuvwxyz", "af"]]){
    const r = await page.evaluate(([name, lang]) => {
      S.lang = lang; S.name = name; S.doneDay = today() - 3;
      S.answers = QS.map((q, i) => i % 5 === 4 ? { c: -1, sure: false } : { c: i % q.o.length, sure: i % 2 === 0 });
      const code = encode(), d = decode(code), want = cleanName(name);
      return { code, ok: JSON.stringify(d.answers) === JSON.stringify(S.answers) && d.lang === lang && d.day === S.doneDay && d.name === want, name: d.name, want };
    }, [name, lang]);
    pass = pass && r.ok;
    rows.push(`"${name}" ${lang}: ${r.code} -> name "${r.name}" (expected "${r.want}") ${r.ok ? "identical" : "MISMATCH"}`);
  }
  const msg = await page.evaluate(() => { const t = new URL(document.querySelector("#help-top a.btn").href).searchParams.get("text"); return { t, d: !!decode(t) }; });
  pass = pass && msg.d;
  rows.push(`decode() of the whole WhatsApp message text: ${msg.d ? "found the code" : "FAILED"}`);
  if (page.errors.length){ pass = false; rows.push("console errors: " + page.errors.join(" | ")); }
  record(4, "Roundtrip encode/decode", pass, rows.join("\n"));
  await page.context().close();
}

/* ===== 5. Shared view ===== */
async function check5(){
  const rows = []; let pass = true;
  const src = await newPage();
  await src.goto(BASE + "/index.html");
  await setReport(src, MIX, "Liam", "af");
  const code = await src.evaluate("encode()");
  await src.context().close();

  const page = await newPage();
  await page.goto(`${BASE}/index.html#${code}`);
  await page.waitForSelector(".banner");
  const s = await page.evaluate(() => ({
    banner: document.querySelector(".banner").innerText.replace(/\s+/g, " ").trim(),
    acc: document.querySelectorAll("details.acc").length, open: document.querySelectorAll("details.acc[open]").length,
    gone: ["#help-top", "#help", "#r-sticky", ".r-btn.dark", '.r-nav [data-to="help"]', 'a[href*="wa.me"]'].map(q => `${q}: ${document.querySelectorAll(q).length}`),
    restart: !!document.querySelector('[data-act="restart"]')
  }));
  pass = s.acc === 6 && s.open === 6 && s.gone.every(g => g.endsWith(": 0")) && s.restart && /LocalTutors-aansig|LocalTutors view/i.test(s.banner);
  rows.push(`opened index.html#${code}`, `banner: "${s.banner}"`, `accordions open: ${s.open}/${s.acc}`, `absent from DOM: ${s.gone.join(", ")}`, `"Take the check yourself" present: ${s.restart}`);

  await page.click('[data-act="restart"]');
  const after = await page.evaluate(() => ({ screen: S.screen, hash: location.hash }));
  pass = pass && after.screen === "welcome" && after.hash === "";
  rows.push(`after "Take the check yourself": screen ${after.screen}, hash "${after.hash}"`);

  const page2 = await newPage();
  await page2.goto(`${BASE}/index.html#lt-%E0%A4%A`);
  await page2.waitForSelector("#nm");
  const mangled = await page2.evaluate('S.screen');
  pass = pass && mangled === "welcome" && !page2.errors.length && !page.errors.length;
  rows.push(`mangled hash #lt-%E0%A4%A: screen ${mangled}, errors: ${page2.errors.length ? page2.errors.join(" | ") : "none"}`);

  await page2.click('[data-act="toggle-paste"]');
  await page2.fill("#pc", "nothing useful here");
  await page2.click('[data-act="open-code"]');
  const errVis = await page2.isVisible("#pc-err");
  await page2.fill("#pc", `Hi LocalTutors! ...\nCode: ${code}`);
  await page2.click('[data-act="open-code"]');
  const viaPaste = await page2.isVisible(".banner");
  pass = pass && errVis && viaPaste;
  rows.push(`report-code field: bad text shows error ${errVis}; pasted WhatsApp message opens shared view ${viaPaste}`);
  record(5, "Shared view", pass, rows.join("\n"));
  await page.context().close(); await page2.context().close();
}

/* ===== 6. WhatsApp link ===== */
async function check6(){
  const rows = []; let pass = true;
  const page = await newPage();
  await page.goto(BASE + "/index.html");
  await setReport(page, MIX, "Liam");
  const read = () => page.evaluate(() => {
    const hrefs = ["#help-top a.btn", "#help a.btn", ".r-btn.dark", "#r-sticky a"].map(q => document.querySelector(q).href);
    const u = new URL(hrefs[0]), R = analyse();
    return { same: hrefs.every(h => h === hrefs[0]), host: u.origin + u.pathname, text: u.searchParams.get("text"), code: encode(), title: TYPES[R.type].t(), right: R.correct, solid: R.cnt.solid };
  });
  const expect = (r, link) => [
    "Hi LocalTutors! I did the Mark Leak Finder and would like you to work out a 4-week programme for me.",
    "Name: Liam", `Result: ${r.title}`, "",
    ...(link ? ["Open full results:", link, ""] : []),
    `Score: ${r.right}/12 right (${r.solid} right and sure)`, `Code: ${r.code}`
  ];
  const banned = /\bR\s?\d|spot|deadline|closing|countdown|guarantee|free|Term 4 plan|bonus|only \d|left\b/i;

  await page.evaluate("CONFIG.pageUrl = 'https://example.test/'; render(false)");
  let r = await read();
  let want = expect(r, "https://example.test/#" + r.code), got = r.text.split("\n");
  let ok = JSON.stringify(got) === JSON.stringify(want) && r.same && r.host === "https://wa.me/27697346705" && !banned.test(r.text);
  pass = pass && ok;
  rows.push(`pageUrl "https://example.test/": ${ok ? "line order matches" : "MISMATCH"}, all 4 CTAs same href ${r.same}, ${r.host}`, ...got.map(l => "  | " + l));

  await page.evaluate("CONFIG.pageUrl = ''; render(false)");
  r = await read();
  want = expect(r, ""); got = r.text.split("\n");
  ok = JSON.stringify(got) === JSON.stringify(want) && !r.text.includes("Open full results") && r.text.includes(r.code) && !banned.test(r.text);
  pass = pass && ok;
  rows.push(`pageUrl "": ${ok ? "line order matches, Open full results lines gone" : "MISMATCH"}`, ...got.map(l => "  | " + l));
  rows.push(`price / spot / deadline wording in message: ${banned.test(r.text) ? "FOUND" : "none"}`);
  record(6, "WhatsApp link", pass, rows.join("\n"));
  await page.context().close();
}

/* ===== 7. Sticky bar ===== */
async function check7(){
  const rows = []; let pass = true;
  const page = await newPage(390, 844);
  await page.goto(BASE + "/index.html");
  await setReport(page, MIX, "Liam");
  await page.waitForTimeout(500);
  const state = async (y) => {
    await page.evaluate(y => window.scrollTo(0, y), y); await raf2(page);
    return page.evaluate(() => {
      const seen = id => { const r = document.getElementById(id).getBoundingClientRect(); return r.top < innerHeight && r.bottom > 0; };
      return { y: Math.round(scrollY), show: document.getElementById("r-sticky").classList.contains("show"), top: seen("help-top"), bottom: seen("help") };
    });
  };
  const fmt = s => `scrollY ${s.y}: sticky ${s.show ? "visible" : "hidden"} (#help-top in view ${s.top}, #help in view ${s.bottom})`;
  let s = await state(0); pass = pass && !s.show; rows.push(fmt(s));
  s = await state(800); rows.push(fmt(s));
  if (!s.top && !s.bottom) pass = pass && s.show;
  else {
    pass = pass && !s.show;
    const y = await page.evaluate(() => Math.ceil(document.getElementById("help-top").getBoundingClientRect().bottom + scrollY + 40));
    s = await state(Math.max(800, y)); pass = pass && !s.top && !s.bottom && s.show; rows.push("(blue CTA is on screen at 800 on this viewport, so also checked just past it)", fmt(s));
  }
  await page.waitForTimeout(350);
  const box = await page.evaluate(() => { const r = document.getElementById("r-sticky").getBoundingClientRect(); return { l: Math.round(r.left), w: Math.round(r.width), b: Math.round(r.bottom), vw: innerWidth, vh: innerHeight }; });
  const pinned = box.l === 0 && box.w === box.vw && Math.abs(box.b - box.vh) <= 1;
  pass = pass && pinned;
  rows.push(`visible bar box: left ${box.l}, width ${box.w}/${box.vw}, bottom ${box.b}/${box.vh} (${pinned ? "pinned to viewport bottom" : "NOT pinned"})`);
  const toEl = async (id) => { await page.evaluate(id => { const e = document.getElementById(id); window.scrollTo(0, e.getBoundingClientRect().top + scrollY - 200); }, id); await raf2(page); return page.evaluate(() => document.getElementById("r-sticky").classList.contains("show")); };
  const a = await toEl("help-top"), b = await toEl("help");
  pass = pass && !a && !b;
  rows.push(`with #help-top on screen: sticky ${a ? "visible" : "hidden"}`, `with #help on screen: sticky ${b ? "visible" : "hidden"}`);
  const usesIO = /IntersectionObserver[\s\S]{0,200}r-sticky|r-sticky[\s\S]{0,200}IntersectionObserver/.test(HTML);
  rows.push(`sticky bar driven by requestAnimationFrame scroll check: ${/requestAnimationFrame\(checkSticky\)/.test(HTML)}; IntersectionObserver near r-sticky: ${usesIO}`);
  record(7, "Sticky bar", pass && !usesIO, rows.join("\n"));
  await page.context().close();
}

/* ===== 8. Leak logic ===== */
async function check8(){
  const rows = []; let pass = true;
  const page = await newPage();
  await page.goto(BASE + "/index.html");
  const run = async (label, plan, wantType, wantScore) => {
    await setReport(page, plan);
    const r = await page.evaluate(() => ({ type: analyse().type, score: document.querySelector(".r-num").textContent.replace("of 100", "").trim(), solid: analyse().cnt.solid, right: analyse().correct }));
    const ok = r.type === wantType && (wantScore == null || r.score === wantScore);
    pass = pass && ok;
    rows.push(`${label}: type ${r.type}, score ${r.score}, right ${r.right}, right+sure ${r.solid} ${ok ? "" : "(expected " + wantType + (wantScore ? ", " + wantScore : "") + ")"}`);
  };
  await run("all correct and sure", ALL({ ok:1, sure:true }), "E", "100.00");
  await run("all I don't know yet", ALL({ idk:true }), "B", "0.00");
  const d1 = ALL({ ok:1, sure:true }); d1[10] = { bad:1, sure:true }; d1[11] = { bad:1, sure:false }; d1[3] = { ok:1, sure:false };
  await run("both word problems wrong, other 10 right, one Not sure", d1, "D");
  const d2 = ALL({ ok:1, sure:true }); d2[10] = { bad:1, sure:true }; d2[11] = { bad:1, sure:false };
  await run("both word problems wrong, other 10 right and Sure", d2, "E");
  record(8, "Leak logic", pass, rows.join("\n"));
  await page.context().close();
}

/* ===== 9. Language toggle ===== */
async function check9(){
  const rows = []; let pass = true;
  const page = await newPage();
  await page.goto(BASE + "/index.html");
  await page.addScriptTag({ content: "window.__pairs = []; const __L = L; L = function(en, af){ if (S.lang === 'af' && en !== af) __pairs.push(en); return __L(en, af); };" });
  const WORDS = ["the","your","you","and","with","what","question","questions","answer","answered","sure","right","wrong","send","get","programme","copy","open","back","start","working","quick","wins","leaks","mistakes","overview","learner","grade","finished","result","score","correct","holding","dripping","leaking","topics","session","heads","language","english","none","subject","mathematics","solve","simplify","expand","negative","fractions","exponents","equations","problems"];
  const scan = async (label) => {
    const r = await page.evaluate(() => {
      const strip = s => String(s).replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();
      const attrs = [...document.querySelectorAll("[aria-label],[placeholder],[title]")].map(e => [e.getAttribute("aria-label"), e.getAttribute("placeholder"), e.getAttribute("title")].filter(Boolean).join(" ")).join(" ");
      const text = (document.body.innerText + " " + attrs + " " + [...document.querySelectorAll("textarea")].map(t => t.value).join(" ")).replace(/\s+/g, " ");
      const left = [...new Set(__pairs.map(strip))].filter(en => en.length >= 3 && text.includes(en));
      __pairs = [];
      return { left, text, lang: document.documentElement.lang };
    });
    const clean = r.text.replace(/LocalTutors|Mark Leak Finder|Leak Map|WhatsApp/g, " ").replace(/lt-[0-9]{12}-[ae]-[0-9a-z]+-[A-Za-z0-9]+/g, " ");
    const words = WORDS.filter(w => new RegExp(`(^|[^A-Za-z\\u00C0-\\u017F'])${w}([^A-Za-z\\u00C0-\\u017F]|$)`, "i").test(clean));
    const ok = !r.left.length && !words.length && r.lang === "af";
    pass = pass && ok;
    rows.push(`${label}: html lang=${r.lang}, English L() strings left ${r.left.length ? JSON.stringify(r.left) : "none"}, English words ${words.length ? JSON.stringify(words) : "none"}`);
  };
  await page.click('.lang [data-l="af"]');
  await page.click('[data-act="start"]');
  await page.click('[data-act="toggle-paste"]');
  await page.fill("#pc", "x"); await page.click('[data-act="open-code"]');
  await scan("welcome (name error, code card open)");
  await page.fill("#nm", "Liam"); await page.click('[data-act="start"]');
  await page.click('[data-act="choose"][data-j="1"]');
  await scan("question 1 + confidence panel");
  await page.evaluate("S.qi = 6; render(true)"); await scan("question 7 (Vereenvoudig)");
  await page.evaluate("S.qi = 11; render(true)"); await scan("question 12 (word problem)");
  await page.evaluate("S.screen = 'analysing'; render(true)"); await scan("analysing");
  await page.evaluate("CONFIG.pageUrl = 'https://example.test/'");
  for (const [label, plan] of [["report, mixed answers", MIX], ["report, all right and sure", ALL({ ok:1, sure:true })], ["report, all don't know", ALL({ idk:true })]]){
    await setReport(page, plan, "Liam", "af");
    await page.evaluate("window.scrollTo(0, 1800)"); await raf2(page);
    await scan(label + " incl. CTAs and sticky bar");
  }
  const wa = await page.evaluate(() => new URL(document.querySelector("#help-top a.btn").href).searchParams.get("text"));
  const waOk = wa.startsWith("Hi LocalTutors! Ek het die Mark Leak Finder gedoen") && wa.includes("Naam:") && wa.includes("Maak volle uitslae oop:") && wa.includes("Punt:") && wa.includes("Kode:");
  pass = pass && waOk;
  rows.push(`Afrikaans WhatsApp message: ${waOk ? "Afrikaans" : "NOT Afrikaans"}: ${JSON.stringify(wa.split("\n").slice(0, 3))}`);
  const code = await page.evaluate("encode()");
  await page.goto(`${BASE}/index.html#${code}`);
  await page.waitForSelector(".banner");
  await page.addScriptTag({ content: "window.__pairs = []; const __L2 = L; L = function(en, af){ if (S.lang === 'af' && en !== af) __pairs.push(en); return __L2(en, af); }; render(false);" });
  await scan("shared LocalTutors view");
  await page.click('.lang [data-l="en"]');
  const back = await page.evaluate(() => document.querySelector(".banner .eyebrow").textContent);
  pass = pass && back === "LocalTutors view";
  rows.push(`toggle back to ENG on shared view: banner eyebrow "${back}"`);
  if (page.errors.length){ pass = false; rows.push("console errors: " + page.errors.join(" | ")); }
  record(9, "Language toggle (AFR)", pass, rows.join("\n"));
  await page.context().close();
}

/* ===== 10. Tap targets at 390px ===== */
async function check10(){
  const rows = []; let pass = true;
  const page = await newPage(390, 844);
  const measure = async (label) => {
    const r = await page.evaluate(() => {
      const out = { big: [], small: [], bad: [] };
      document.querySelectorAll("button, a").forEach(el => {
        const b = el.getBoundingClientRect();
        if (!b.width && !b.height) return;
        const big = el.matches(".btn, .opt"), min = big ? 48 : 36;
        (big ? out.big : out.small).push(b.height);
        if (b.height < min - 0.01) out.bad.push(`${el.className || el.tagName} "${el.textContent.trim().slice(0, 24)}" ${b.height.toFixed(1)}px`);
      });
      return out;
    });
    const mn = a => a.length ? Math.min(...a).toFixed(1) + "px" : "n/a";
    if (r.bad.length) pass = false;
    rows.push(`${label}: ${r.big.length} .btn/.opt min ${mn(r.big)}, ${r.small.length} other buttons/links min ${mn(r.small)}${r.bad.length ? " | too small: " + r.bad.join("; ") : ""}`);
  };
  await page.goto(BASE + "/index.html");
  await page.click('[data-act="toggle-paste"]');
  await measure("welcome");
  await page.fill("#nm", "Liam"); await page.click('[data-act="start"]');
  await page.click('[data-act="choose"][data-j="0"]');
  await measure("question + confidence panel");
  await setReport(page, MIX, "Liam");
  await page.waitForTimeout(450);
  await measure("report (learner)");
  const code = await page.evaluate("encode()");
  await page.goto(`${BASE}/index.html#${code}`);
  await page.waitForSelector(".banner");
  await page.waitForTimeout(450);
  await measure("shared view");
  record(10, "Tap targets at 390px", pass, rows.join("\n"));
  await page.context().close();
}

/* ===== 11. Phone Back during the questions ===== */
async function check11(){
  const rows = []; let pass = true;
  const page = await newPage();
  await page.goto("about:blank");
  await startWith(page, "Liam");
  for (let i = 0; i < 3; i++){
    await page.waitForFunction(`S.qi === ${i}`);
    await page.click('[data-act="choose"][data-j="1"]');
    await page.click('[data-act="sure"][data-v="1"]');
  }
  await page.waitForFunction("S.qi === 3");
  const where = () => page.evaluate(() => S.screen + (S.screen === "q" ? " Q" + (S.qi + 1) : "") + ", " + S.answers.filter(Boolean).length + " answers kept");
  await page.goBack(); await page.waitForTimeout(150);
  const a = await where(); pass = pass && a === "q Q3, 3 answers kept";
  await page.goBack(); await page.waitForTimeout(150);
  const b = await where(); pass = pass && b === "q Q2, 3 answers kept";
  rows.push(`at Q4, Back: ${a}`, `Back again: ${b}`);
  await page.click('[data-act="back"]'); await page.click('[data-act="back"]'); await page.waitForTimeout(150);
  const c = await where(); pass = pass && c.startsWith("welcome");
  await page.goBack(); await page.waitForTimeout(300);
  const left = page.url() === "about:blank"; pass = pass && left;
  rows.push(`in-app Back to welcome: ${c}`, `Back on welcome leaves the page: ${left}`);
  await startWith(page, "Liam");
  for (let i = 0; i < 12; i++){ await page.waitForFunction(`S.screen === "q" && S.qi === ${i}`); await page.click('[data-act="idk"]'); }
  await page.waitForFunction('S.screen === "report"', null, { timeout: 5000 });
  await page.goBack(); await page.waitForTimeout(300);
  const leftReport = page.url() === "about:blank"; pass = pass && leftReport;
  rows.push(`Back on the report leaves in one press: ${leftReport}`);
  if (page.errors.length){ pass = false; rows.push("console errors: " + page.errors.join(" | ")); }
  record(11, "Phone Back during the questions", pass, rows.join("\n"));
  await page.context().close();
}

(async () => {
  const srv = await serve();
  BASE = `http://127.0.0.1:${srv.address().port}`;
  browser = await chromium.launch();
  try {
    check1();
    for (const fn of [check2, check3, check4, check5, check6, check7, check8, check9, check10, check11]){
      try { await fn(); }
      catch (e) { record(+fn.name.slice(5), fn.name, false, "threw: " + (e.stack || e.message).split("\n").slice(0, 4).join(" ")); }
    }
  } finally {
    await browser.close();
    srv.close();
  }
  console.log(`\nRequests outside localhost and Google Fonts: ${outside.length ? [...new Set(outside)].join(", ") : "none"}`);
  const failed = results.filter(r => !r.pass);
  console.log(`\n${results.length - failed.length}/${results.length} checks passed`);
  process.exit(failed.length || outside.length ? 1 : 0);
})();
