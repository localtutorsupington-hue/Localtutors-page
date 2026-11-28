/* BouReg pages: quote quiz, language switch and small fades. Shared by index.html and the town pages. */
// TODO: Add BouReg's WhatsApp number before going live.
// Format: country code + number, no "+", no spaces, no leading 0. Example: 27821234567
// While this is empty, WhatsApp opens with the message ready and the person picks who to send it to.
const WHATSAPP_NUMBER = "";

(function () {
  "use strict";


  /* ---------- Language: English is in the HTML, Afrikaans swaps in ---------- */

  var AF = {
    "Skip to content": "Gaan na inhoud",
    "BouReg, back to top": "BouReg, terug na bo",
    "WhatsApp us": "WhatsApp ons",
    "Built by pros with years of experience.": "Gebou deur vakmanne met jare se ondervinding.",
    "Not someone trying it for the first time.": "Nie iemand wat dit vir die eerste keer probeer nie.",
    "Cupboards, kitchens, backyard rooms, patios and bathrooms in Upington, Kimberley and Bloemfontein. One of our experienced pros calls you within 48 hours.": "Kaste, kombuise, buitekamers, patio's en badkamers in Upington, Kimberley en Bloemfontein. Een van ons ervare vakmanne bel jou binne 48 uur.",
    "Free quote": "Gratis kwotasie",
    "Back": "Terug",
    "Get your free quote": "Kry jou gratis kwotasie",
    "Your details first, then a few quick taps.": "Eers jou besonderhede, dan net 'n paar vinnige tikke.",
    "Job:": "Werk:",
    "Your name": "Jou naam",
    "Cell number": "Selnommer",
    "Our pro calls you on this number.": "Ons vakman bel jou op hierdie nommer.",
    "Next: about the job": "Volgende: oor die werk",
    "What do you want built?": "Wat wil jy laat bou?",
    "Cupboards and built-ins": "Ingeboude kaste",
    "Kitchen": "Kombuis",
    "Backyard room or flatlet": "Buitekamer of woonstelletjie",
    "Patio or lapa": "Patio of lapa",
    "Bathroom": "Badkamer",
    "Something else": "Iets anders",
    "Next": "Volgende",
    "Rough budget?": "Rowwe begroting?",
    "Which suburb do you stay in?": "In watter voorstad bly jy?",
    "Search, or pick it from the list.": "Soek, of kies dit uit die lys.",
    "Search your suburb": "Soek jou voorstad",
    "Slide to roughly what you want to spend. A rough idea helps our pro plan the visit.": "Skuif na omtrent wat jy wil spandeer. 'n Rowwe idee help ons vakman om die besoek te beplan.",
    "About": "Omtrent",
    "about": "omtrent",
    "or more": "of meer",
    "Use": "Gebruik",
    "Not on the list?": "Nie op die lys nie?",
    "When do you want it done?": "Wanneer wil jy dit klaar hê?",
    "Optional. Skip if you are not sure yet.": "Opsioneel. Slaan oor as jy nog nie seker is nie.",
    "This month": "Hierdie maand",
    "In 1 to 3 months": "Oor 1 tot 3 maande",
    "Later this year": "Later vanjaar",
    "Just looking": "Kyk net rond",
    "Skip this": "Slaan oor",
    "Tell us a bit more": "Vertel ons 'n bietjie meer",
    "Optional. English or Afrikaans is fine.": "Opsioneel. Afrikaans of Engels is reg.",
    "For example: two bedroom cupboards, about 2.4m wide each": "Byvoorbeeld: twee slaapkamerkaste, elk omtrent 2,4 m breed",
    "I agree that BouReg may contact me on WhatsApp about my job and share my details with the pro doing it.": "Ek stem in dat BouReg my op WhatsApp oor my werk mag kontak en my besonderhede mag deel met die vakman wat dit doen.",
    "Send to BouReg on WhatsApp": "Stuur na BouReg op WhatsApp",
    "Want to send photos? Add them in the WhatsApp chat.": "Wil jy foto's stuur? Voeg hulle in die gesprek op WhatsApp by.",
    "Nearly done": "Amper klaar",
    "WhatsApp is opening with your job details. Press send in the chat and BouReg has your job. One of our pros calls you within 48 hours.": "WhatsApp maak oop met die besonderhede van jou werk. Druk stuur in die gesprek en BouReg het jou werk. Een van ons vakmanne bel jou binne 48 uur.",
    "Open WhatsApp again": "Maak WhatsApp weer oop",
    "Change my answers": "Verander my antwoorde",
    "How we check our pros": "Hoe ons ons vakmanne nagaan",
    "3+ years experience": "3+ jaar ondervinding",
    "Real job photos checked": "Foto's van regte werk nagegaan",
    "Past clients phoned": "Vorige kliënte gebel",
    "What we build": "Wat ons bou",
    "Tap a job to start your free quote.": "Tik op 'n werk om jou gratis kwotasie te begin.",
    "Most asked": "Meeste gevra",
    "Cupboards and": "Ingeboude",
    "built-ins": "kaste",
    "Bedroom cupboards, wall units and storage, made to fit your space.": "Slaapkamerkaste, muureenhede en bergplek, gemaak om in jou spasie te pas.",
    "Kitchens": "Kombuise",
    "New kitchens and makeovers, with doors, tops and fitting done properly.": "Nuwe kombuise en opknappings, met deure, werkblaaie en installasie wat behoorlik gedoen word.",
    "Backyard rooms and flatlets": "Buitekamers en woonstelletjies",
    "An extra room or flatlet for family, guests or a tenant.": "'n Ekstra kamer of woonstelletjie vir familie, gaste of 'n huurder.",
    "Patios and lapas": "Patio's en lapas",
    "Covered outdoor space for the braai and long summer evenings.": "Oordekte buiteruimte vir die braai en lang somersaande.",
    "Bathrooms": "Badkamers",
    "A full bathroom redo, or a new shower, basin and tiles.": "'n Volledige badkameropknapping, of 'n nuwe stort, wasbak en teëls.",
    "Why our pros are different": "Hoekom ons vakmanne anders is",
    "No one gets a BouReg job on a promise. Every pro passes this check before they work for us.": "Niemand kry 'n BouReg werk op 'n belofte nie. Elke vakman slaag hierdie toets voordat hulle vir ons werk.",
    "BOUREG PRO CHECK": "BOUREG VAKMANTOETS",
    "Done before their first job": "Gedoen voor hul eerste werk",
    "At least 3 years doing this exact work": "Minstens 3 jaar in presies hierdie werk",
    "Not someone who does a bit of everything. Years on this kind of job.": "Nie iemand wat 'n bietjie van alles doen nie. Jare se ervaring met hierdie soort werk.",
    "At least 6 photos of real jobs they finished": "Minstens 6 foto's van regte werk wat hulle klaargemaak het",
    "Their own work, in real homes. Not pictures from the internet.": "Hul eie werk, in regte huise. Nie prente van die internet nie.",
    "We phone 2 of their past clients": "Ons bel 2 van hul vorige kliënte",
    "We ask if the work was good, on time and at the agreed price.": "Ons vra of die werk goed was, betyds klaar was en teen die afgespreekte prys.",
    "Written quote before any work starts": "Skriftelike kwotasie voordat enige werk begin",
    "You see the price and the materials on paper first.": "Jy sien eers die prys en die materiaal op papier.",
    "Fair deposit, never the full amount upfront": "Billike deposito, nooit die volle bedrag vooraf nie",
    "Your money is not all gone before the work begins.": "Jou geld is nie alles weg voordat die werk begin nie.",
    "They call you within 24 to 48 hours": "Hulle bel jou binne 24 tot 48 uur",
    "No chasing. No waiting weeks for someone to pitch up.": "Geen agternaloop nie. Geen weke wag vir iemand om op te daag nie.",
    "Our 48 hour promise": "Ons 48 uur belofte",
    "If our pro doesn't call you within 48 hours, we send another of our pros.": "As ons vakman jou nie binne 48 uur bel nie, stuur ons nog een van ons vakmanne.",
    "Free.": "Gratis.",
    "Free guide": "Gratis gids",
    "7 checks before you pay any builder a deposit": "7 dinge om na te gaan voordat jy enige bouer 'n deposito betaal",
    "Whoever you hire, do these first. Take a screenshot so you have it on your phone.": "Wie jy ook al aanstel, doen dit eers. Neem 'n skermskoot sodat jy dit op jou foon het.",
    "Rather let our pros handle it": "Laat eerder ons vakmanne dit hanteer",
    "See at least 6 photos of jobs they finished": "Sien minstens 6 foto's van werk wat hulle klaargemaak het",
    "Phone 2 past clients yourself": "Bel self 2 vorige kliënte",
    "Get the quote in writing, with materials named": "Kry die kwotasie op skrif, met die materiaal genoem",
    "Never pay the full amount upfront": "Moet nooit die volle bedrag vooraf betaal nie",
    "Agree on a start and finish date": "Spreek 'n begin en einddatum af",
    "Ask who buys the materials and keeps the slips": "Vra wie die materiaal koop en die strokies hou",
    "Check they have a real address and number": "Maak seker hulle het 'n regte adres en nommer",
    "Good to know": "Goed om te weet",
    "Is the quote free?": "Is die kwotasie gratis?",
    "Yes. The quote costs you nothing, and you decide if you go ahead.": "Ja. Die kwotasie kos jou niks, en jy besluit of jy voortgaan.",
    "Who are your pros?": "Wie is julle vakmanne?",
    "Independent, experienced local pros. We check every one before they work with us: at least 3 years of experience, photos of real jobs and calls to past clients.": "Onafhanklike, ervare plaaslike vakmanne. Ons gaan elkeen na voordat hulle met ons werk: minstens 3 jaar ondervinding, foto's van regte werk en oproepe na vorige kliënte.",
    "What if I'm not happy with the pro?": "Wat as ek nie tevrede is met die vakman nie?",
    "Tell us on WhatsApp and we send another of our pros.": "Laat weet ons op WhatsApp en ons stuur nog een van ons vakmanne.",
    "Which towns do you work in?": "In watter dorpe werk julle?",
    "Upington, Kimberley and Bloemfontein for now.": "Vir nou Upington, Kimberley en Bloemfontein.",
    "Do I pay BouReg?": "Betaal ek vir BouReg?",
    "No. The quote is free for you.": "Nee. Die kwotasie is gratis vir jou.",
    "Towns": "Dorpe",
    "For pros": "Vir vakmanne",
    "Are you a pro? Work with us": "Is jy 'n vakman? Werk saam met ons",
    "Our pros are independent businesses checked by BouReg.": "Ons vakmanne is onafhanklike besighede wat deur BouReg nagegaan is.",
    "Get my free quote": "Kry my gratis kwotasie",
    // Town pages
    "Upington homeowners: read this before you pay any builder a deposit.": "Huiseienaars in Upington: lees dit voordat jy enige bouer 'n deposito betaal.",
    "Kimberley homeowners: read this before you pay any builder a deposit.": "Huiseienaars in Kimberley: lees dit voordat jy enige bouer 'n deposito betaal.",
    "Bloemfontein homeowners: read this before you pay any builder a deposit.": "Huiseienaars in Bloemfontein: lees dit voordat jy enige bouer 'n deposito betaal.",
    "Cupboards, kitchens, backyard rooms, patios and bathrooms anywhere in Upington. One of our experienced pros calls you within 48 hours.": "Kaste, kombuise, buitekamers, patio's en badkamers enige plek in Upington. Een van ons ervare vakmanne bel jou binne 48 uur.",
    "Cupboards, kitchens, backyard rooms, patios and bathrooms anywhere in Kimberley. One of our experienced pros calls you within 48 hours.": "Kaste, kombuise, buitekamers, patio's en badkamers enige plek in Kimberley. Een van ons ervare vakmanne bel jou binne 48 uur.",
    "Cupboards, kitchens, backyard rooms, patios and bathrooms anywhere in Bloemfontein. One of our experienced pros calls you within 48 hours.": "Kaste, kombuise, buitekamers, patio's en badkamers enige plek in Bloemfontein. Een van ons ervare vakmanne bel jou binne 48 uur.",
    "At least 3 years doing this exact work. Not a first try.": "Minstens 3 jaar in presies hierdie werk. Nie 'n eerste probeerslag nie.",
    "We look at photos of their real jobs and phone 2 past clients.": "Ons kyk na foto's van hul regte werk en bel 2 vorige kliënte.",
    "Written quote first. Fair deposit, never the full amount upfront.": "Eers 'n skriftelike kwotasie. Billike deposito, nooit die volle bedrag vooraf nie.",
    "QUOTE": "KWOTASIE",
    "FREE": "GRATIS",
    "More about BouReg": "Meer oor BouReg",
    // Set from the script
    "Step {n} of {t}": "Stap {n} van {t}",
    "Done": "Klaar",
    "Add your name so our pro knows who to ask for.": "Gee jou naam sodat ons vakman weet na wie om te vra.",
    "Add a 10 digit cell number, like 082 123 4567.": "Gee 'n selnommer met 10 syfers, soos 082 123 4567.",
    "All set. Tap the button to open WhatsApp.": "Alles reg. Tik die knoppie om WhatsApp oop te maak.",
    "Some answers are missing. Tap Back to check them.": "Party antwoorde ontbreek. Tik Terug om hulle na te gaan.",
    "Tick the box so we can send your job.": "Merk die blokkie sodat ons jou werk kan stuur.",
    "Hi BouReg, I'd like a free quote for a job at my home.": "Hallo BouReg, ek wil graag 'n gratis kwotasie hê vir werk by my huis."
  };
  var TITLE_AF = document.documentElement.getAttribute("data-title-af") || "BouReg | Ervare vakmanne vir jou huis in Upington, Kimberley en Bloemfontein";
  var TITLE_EN = document.title;
  var lang = "en";

  function t(en) { return lang === "af" && AF[en] ? AF[en] : en; }

  // Remember every English text and label on the page once, before the script changes anything
  var textSlots = [];
  var attrSlots = [];
  (function capture() {
    var walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
      acceptNode: function (node) {
        var tag = node.parentNode && node.parentNode.nodeName;
        if (tag === "SCRIPT" || tag === "STYLE") return NodeFilter.FILTER_REJECT;
        return AF[node.nodeValue.trim()] ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP;
      }
    });
    var node;
    while ((node = walker.nextNode())) {
      var v = node.nodeValue;
      textSlots.push({ node: node, en: v, af: v.replace(v.trim(), function () { return AF[v.trim()]; }) });
    }
    document.querySelectorAll("[placeholder], [aria-label]").forEach(function (el) {
      ["placeholder", "aria-label"].forEach(function (name) {
        var v = el.getAttribute(name);
        if (v && AF[v]) attrSlots.push({ el: el, name: name, en: v });
      });
    });
  })();

  function paintLanguage() {
    textSlots.forEach(function (s) { s.node.nodeValue = lang === "af" ? s.af : s.en; });
    attrSlots.forEach(function (s) { s.el.setAttribute(s.name, t(s.en)); });
    document.documentElement.lang = lang;
    document.title = lang === "af" ? TITLE_AF : TITLE_EN;
    document.querySelectorAll(".lang__btn").forEach(function (b) {
      b.setAttribute("aria-pressed", b.getAttribute("data-lang") === lang ? "true" : "false");
    });
  }

  function pickStartLanguage() {
    var fromUrl = (location.search.match(/[?&]lang=(af|en)\b/) || [])[1];
    if (fromUrl) return fromUrl;
    try { var saved = localStorage.getItem("boureg-lang"); if (saved === "af" || saved === "en") return saved; } catch (err) {}
    return /^af\b/i.test(navigator.language || "") ? "af" : "en";
  }

  var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var EASE_OUT = "cubic-bezier(0.23, 1, 0.32, 1)";
  var TOTAL = 6;          // screens 0 to 5 are questions, 6 is "nearly done"
  var DONE = 6;

  var state = { job: "", place: null, budget: 0, timing: "" };
  var current = 0;
  var animations = [];
  var advanceTimer = null;

  var hero = document.querySelector(".hero");
  var flow = document.getElementById("quote");
  var form = document.getElementById("quote-form");
  var steps = Array.prototype.slice.call(form.querySelectorAll(".step"));
  var backBtn = document.getElementById("flow-back");
  var countEl = document.getElementById("flow-count");
  var barEl = document.getElementById("flow-bar");
  var nameInput = document.getElementById("name");
  var phoneInput = document.getElementById("phone");
  var detailsInput = document.getElementById("details");
  var consentInput = document.getElementById("consent");
  var sendBtn = document.getElementById("send");
  var statusEl = document.getElementById("send-status");
  var sentLink = document.getElementById("sent-link");
  var pickedEl = document.getElementById("picked");
  var pickedJob = document.getElementById("picked-job");

  function waLink(text) {
    return "https://wa.me/" + WHATSAPP_NUMBER.replace(/\D/g, "") + (text ? "?text=" + encodeURIComponent(text) : "");
  }

  function setHeaderLink() {
    document.querySelectorAll(".js-wa-direct").forEach(function (a) {
      a.href = waLink(t("Hi BouReg, I'd like a free quote for a job at my home."));
    });
  }

  /* ---------- Screen 1: details ---------- */

  // South African numbers: 0821234567, 082 123 4567, +27 82 123 4567 or 27821234567
  function cleanPhone(value) {
    var d = value.replace(/\D/g, "");
    if (/^27\d{9}$/.test(d)) d = "0" + d.slice(2);
    if (!/^0\d{9}$/.test(d)) return "";
    return d.slice(0, 3) + " " + d.slice(3, 6) + " " + d.slice(6);
  }

  var checks = [
    { input: nameInput, test: function (v) { return v.trim().length > 1; }, msg: "Add your name so our pro knows who to ask for." },
    { input: phoneInput, test: function (v) { return !!cleanPhone(v); }, msg: "Add a 10 digit cell number, like 082 123 4567." }
  ];
  var touched = {};

  function showError(check, on) {
    check.input.setAttribute("aria-invalid", on ? "true" : "false");
    document.getElementById(check.input.id + "-err").textContent = on ? t(check.msg) : "";
  }

  checks.forEach(function (check) {
    // Errors appear after someone leaves a field, and clear as soon as it is fixed
    check.input.addEventListener("blur", function () {
      if (check.input.value.trim()) touched[check.input.id] = true;
      if (touched[check.input.id]) showError(check, !check.test(check.input.value));
    });
    check.input.addEventListener("input", function () {
      if (check.input.getAttribute("aria-invalid") === "true" && check.test(check.input.value)) showError(check, false);
    });
  });
  phoneInput.addEventListener("blur", function () {
    var tidy = cleanPhone(phoneInput.value);
    if (tidy) phoneInput.value = tidy;
  });

  function detailsValid(showAll) {
    var firstBad = null;
    checks.forEach(function (check) {
      var ok = check.test(check.input.value);
      if (showAll) { touched[check.input.id] = true; showError(check, !ok); }
      if (!ok && !firstBad) firstBad = check.input;
    });
    return firstBad;
  }

  function nextFromDetails() {
    var bad = detailsValid(true);
    if (bad) { bad.focus(); return; }
    go(1);
  }
  document.getElementById("next-0").addEventListener("click", nextFromDetails);

  /* ---------- Moving between screens ---------- */

  function visibleStep() {
    for (var i = 0; i < steps.length; i++) if (!steps[i].hidden) return steps[i];
    return null;
  }

  function keepFlowInView() {
    var top = flow.getBoundingClientRect().top;
    var headerH = document.querySelector(".header").offsetHeight;
    if (top < headerH || top > window.innerHeight * 0.4) {
      flow.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
    }
  }

  function updateChrome() {
    backBtn.hidden = current === 0 || current === DONE;
    countEl.textContent = current === DONE ? t("Done") : t("Step {n} of {t}").replace("{n}", current + 1).replace("{t}", TOTAL);
    var progress = current === DONE ? 1 : (current + 1) / TOTAL;
    barEl.style.transform = "scaleX(" + progress + ")";
    // On phones the quiz takes over the top of the page, like a second page
    hero.classList.toggle("is-quiz", current > 0);
  }

  function go(n) {
    clearTimeout(advanceTimer);
    if (n === current && visibleStep() === steps[n]) return;
    var dir = n >= current ? 1 : -1;
    animations.forEach(function (a) { a.cancel(); });
    animations = [];

    var from = visibleStep();
    var to = steps[n];
    current = n;
    updateChrome();

    // Forward slides left, back slides right. Leaving is quicker than arriving.
    var shift = reduceMotion ? 0 : 16;
    function enter() {
      steps.forEach(function (s) { s.hidden = s !== to; });
      keepFlowInView();
      if (to.animate) {
        animations.push(to.animate(
          [{ opacity: 0, transform: "translateX(" + dir * shift + "px)" }, { opacity: 1, transform: "none" }],
          { duration: reduceMotion ? 200 : 260, easing: EASE_OUT }
        ));
      }
      var heading = to.querySelector(".step__q");
      if (heading) heading.focus({ preventScroll: true });
    }

    if (!from || from === to || !from.animate) { enter(); return; }
    var out = from.animate(
      [{ opacity: 1, transform: "none" }, { opacity: 0, transform: "translateX(" + -dir * shift + "px)" }],
      { duration: 140, easing: "ease" }
    );
    animations.push(out);
    out.onfinish = enter;
  }

  backBtn.addEventListener("click", function () { go(Math.max(0, current - 1)); });
  document.getElementById("change-answers").addEventListener("click", function () { go(5); });

  /* ---------- Quiz questions ---------- */

  function setChoice(field, value) {
    var group = form.querySelector('.chips[data-field="' + field + '"]');
    if (!group) return;
    group.querySelectorAll(".chip").forEach(function (chip) {
      chip.setAttribute("aria-pressed", chip.getAttribute("data-value") === value ? "true" : "false");
    });
    state[field] = value;
    update();
  }

  form.querySelectorAll(".chips").forEach(function (group) {
    var field = group.getAttribute("data-field");
    var stepIndex = steps.indexOf(group.closest(".step"));
    group.addEventListener("click", function (e) {
      var chip = e.target.closest(".chip");
      if (!chip) return;
      setChoice(field, chip.getAttribute("data-value"));
      // Let the chip fill in before moving on, so the choice registers
      clearTimeout(advanceTimer);
      advanceTimer = setTimeout(function () {
        if (current === stepIndex) go(stepIndex + 1);
      }, reduceMotion ? 150 : 320);
    });
  });

  form.querySelectorAll("[data-next]").forEach(function (btn) {
    btn.addEventListener("click", function () { go(Number(btn.getAttribute("data-next"))); });
  });

  function update() {
    // "Next" appears on a question once it has an answer, for people who come back with Back
    form.querySelectorAll(".js-step-next").forEach(function (btn) {
      btn.hidden = !state[btn.getAttribute("data-field")];
    });
    pickedEl.hidden = !state.job;
    pickedJob.textContent = t(state.job);

    var ready = consentInput.checked && state.job && state.place && !detailsValid(false);
    sendBtn.disabled = !ready;
    if (ready) {
      statusEl.textContent = t("All set. Tap the button to open WhatsApp.");
      statusEl.classList.add("is-ready");
    } else {
      statusEl.textContent = t(consentInput.checked ? "Some answers are missing. Tap Back to check them." : "Tick the box so we can send your job.");
      statusEl.classList.remove("is-ready");
    }
  }
  consentInput.addEventListener("change", update);

  /* ---------- Suburb picker ---------- */

  // Suburbs from postcode and property listings (Upington) and Wikipedia / property portals (Kimberley, Bloemfontein).
  // A town page (body data-town="...") only shows its own town.
  var SUBURBS = {
    Upington: ["Bellvue", "Blikkies", "Blydeville", "Die Rand", "Flora Park", "Hillside", "Keidebees", "Lemoendraai", "Louisvale", "Louisvaleweg", "Morning Glory", "Oosterville", "Paballelo", "Progress", "Rainbow", "Riverside", "Rosedale", "Straussburg", "Upington Central"],
    Kimberley: ["Albertynshof", "Ashburnham", "Beaconsfield", "Belgravia", "Camelot", "Carters Glen", "Cassandra", "Colville", "De Beers", "Diamant Park", "El Toro Park", "Ernestville", "Floors", "Galeshewe", "Gemdene", "Greenside", "Hadison Park", "Herlear", "Heuwelsig", "Hillcrest", "Homestead", "Homevale", "Kimberley Central", "Kimberley North", "Klisserville", "Labram", "Lerato Park", "Memorial Golf Estate", "Minerva Gardens", "Moghul Park", "Monument Heights", "New Park", "Northview", "Rhodesdene", "Riviera", "Roodepan", "Royldene", "Roylglen", "Verwoerdpark"],
    Bloemfontein: ["Arboretum", "Ashbury", "Bayswater", "Baysvalley", "Bloemfontein Central", "Bloemside", "Brandwag", "Dan Pienaar", "Ehrlich Park", "Fauna", "Fichardt Park", "Fleurdal", "Gardenia Park", "Generaal De Wet", "Grasslands", "Heidedal", "Heuwelsig", "Hospitaalpark", "Langenhoven Park", "Lourierpark", "Navalsig", "Noordhoek", "Pellissier", "Rodenbeck", "Uitsig", "Universitas", "Westdene", "Wilgehof", "Willows"]
  };
  var ALSO = { "Bellvue": "bellevue", "Upington Central": "sentraal middedorp cbd", "Kimberley Central": "sentraal cbd", "Bloemfontein Central": "sentraal cbd bloem", "Langenhoven Park": "langenhovenpark", "Hospitaalpark": "hospital park", "Lourierpark": "lourier park", "Straussburg": "strausburg", "Louisvaleweg": "louisvale road" };
  var TOWN = document.body.getAttribute("data-town") || "";
  var TOWNS = TOWN ? [TOWN] : ["Upington", "Kimberley", "Bloemfontein"];
  var PLACES = [];
  TOWNS.forEach(function (town) {
    SUBURBS[town].forEach(function (suburb) { PLACES.push({ suburb: suburb, town: town, also: ALSO[suburb] || "" }); });
  });
  var placeSearch = document.getElementById("place-search");
  var placeList = document.getElementById("place-list");
  var TICK = '<svg class="pick__tick" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>';

  function fold(s) { return s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/\s+/g, " ").trim(); }
  function esc(s) { return s.replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function samePlace(a, b) { return a && b && a.suburb === b.suburb && a.town === b.town; }
  function placeLabel(p) { return p.suburb + ", " + p.town; }

  function renderPlaces() {
    var q = fold(placeSearch.value);
    var hits = PLACES.filter(function (p) {
      // On the all towns page, typing a town name shows that town's suburbs
      return !q || fold(p.suburb + " " + p.also + (TOWN ? "" : " " + p.town)).indexOf(q) !== -1;
    });
    function row(p, own) {
      var on = samePlace(p, state.place);
      var name = own ? '<span class="pick__own">' + esc(t("Use") + " “" + p.suburb + "”") + "</span>" : "<span>" + esc(p.suburb) + "</span>";
      var town = TOWN && !own ? "" : '<span class="pick__town">' + esc(p.town) + "</span>";
      return '<button type="button" class="pick" aria-pressed="' + on + '" data-suburb="' + esc(p.suburb) + '" data-town="' + esc(p.town) + '">' +
        name + '<span style="display:flex;align-items:center;gap:8px">' + town + TICK + "</span></button>";
    }
    var html = "";
    TOWNS.forEach(function (town) {
      var mine = hits.filter(function (p) { return p.town === town; });
      if (mine.length) html += '<p class="picker__group">' + esc(town) + "</p>" + mine.map(function (p) { return row(p); }).join("");
    });
    // Not on the list: let them use what they typed
    var typed = placeSearch.value.trim().replace(/\s+/g, " ");
    if (typed.length > 1 && !hits.length) {
      html += '<p class="picker__group">' + esc(t("Not on the list?")) + "</p>" +
        TOWNS.map(function (town) { return row({ suburb: typed, town: town }, true); }).join("");
    }
    placeList.innerHTML = html;
  }

  placeSearch.addEventListener("input", renderPlaces);
  placeSearch.addEventListener("keydown", function (e) {
    // Enter picks the first match instead of submitting the form
    if (e.key !== "Enter") return;
    e.preventDefault();
    var first = placeList.querySelector(".pick");
    if (first) first.click();
  });
  placeList.addEventListener("click", function (e) {
    var btn = e.target.closest(".pick");
    if (!btn) return;
    state.place = { suburb: btn.getAttribute("data-suburb"), town: btn.getAttribute("data-town") };
    placeList.querySelectorAll(".pick").forEach(function (b) { b.setAttribute("aria-pressed", b === btn ? "true" : "false"); });
    update();
    clearTimeout(advanceTimer);
    advanceTimer = setTimeout(function () { if (current === 2) go(3); }, reduceMotion ? 150 : 320);
  });

  /* ---------- Budget slider ---------- */

  var BUDGETS = [5000, 10000, 15000, 20000, 25000, 30000, 40000, 50000, 60000, 75000, 100000, 150000, 200000, 250000];
  var budgetInput = document.getElementById("budget");
  var budgetValue = document.getElementById("budget-value");
  var budgetFill = document.getElementById("budget-fill");
  state.budget = Number(budgetInput.value);

  function rands(n, space) { return "R" + String(n).replace(/\B(?=(\d{3})+(?!\d))/g, space); }
  function budgetText(i, forMessage) {
    var last = i === BUDGETS.length - 1;
    var amount = rands(BUDGETS[i], forMessage ? " " : " ");
    if (forMessage) return last ? amount + " " + t("or more") : t("about") + " " + amount;
    return last ? amount + "+" : amount;
  }
  function paintBudget() {
    var i = state.budget;
    budgetValue.textContent = budgetText(i, false);
    budgetFill.style.transform = "scaleX(" + i / (BUDGETS.length - 1) + ")";
    budgetInput.setAttribute("aria-valuetext", budgetText(i, true));
  }
  budgetInput.addEventListener("input", function () {
    state.budget = Number(budgetInput.value);
    paintBudget();
  });
  budgetInput.max = String(BUDGETS.length - 1);

  // The message goes out in the language the person is reading
  function buildMessage() {
    var details = detailsInput.value.trim().replace(/\s+/g, " ");
    var L = lang === "af"
      ? { hi: "Hallo BouReg, ek is ", num: "Nommer", sub: "Voorstad", want: "Ek wil hê", town: "Dorp", budget: "Begroting", timing: "Wanneer", more: "Meer", notSure: "Nog nie seker nie", nothing: "Niks ekstra nie" }
      : { hi: "Hi BouReg, I'm ", num: "Number", sub: "Suburb", want: "I want", town: "Town", budget: "Budget", timing: "Timing", more: "More", notSure: "Not sure yet", nothing: "Nothing extra" };
    return L.hi + nameInput.value.trim().replace(/\s+/g, " ") +
      ". " + L.num + ": " + (cleanPhone(phoneInput.value) || phoneInput.value.trim()) +
      ". " + L.want + ": " + t(state.job) +
      ". " + L.sub + ": " + (state.place ? placeLabel(state.place) : "") +
      ". " + L.budget + ": " + budgetText(state.budget, true) +
      ". " + L.timing + ": " + (state.timing ? t(state.timing) : L.notSure) +
      ". " + L.more + ": " + (details || L.nothing);
  }

  function send() {
    update();
    if (sendBtn.disabled) return;
    var url = waLink(buildMessage());
    sentLink.href = url;
    go(DONE);
    var w = window.open(url, "_blank");
    if (w) { try { w.opener = null; } catch (err) {} }
    else { window.location.href = url; }
  }

  // Enter on screen 1 moves on; the submit button sends
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    if (current === 0) nextFromDetails();
    else if (current === 5) send();
  });

  window.BouReg = { buildUrl: function () { return waLink(buildMessage()); } };

  /* ---------- Links into the flow ---------- */

  function goToQuote() {
    flow.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
  }

  function onArrival(fn) {
    var headerH = document.querySelector(".header").offsetHeight;
    if (reduceMotion || Math.abs(flow.getBoundingClientRect().top - headerH - 16) < 4) { goToQuote(); fn(); return; }
    var done = false;
    function run() {
      if (done) return;
      done = true;
      window.removeEventListener("scrollend", run);
      fn();
    }
    window.addEventListener("scrollend", run);
    setTimeout(run, "onscrollend" in window ? 1500 : 700);
    goToQuote();
  }

  document.querySelectorAll(".js-to-quote").forEach(function (a) {
    a.addEventListener("click", function (e) {
      e.preventDefault();
      onArrival(function () {
        var heading = visibleStep() && visibleStep().querySelector(".step__q");
        if (heading) heading.focus({ preventScroll: true });
      });
    });
  });

  // "What we build" cards: scroll up to the quote, then fill in the job as the person arrives
  document.querySelectorAll(".js-pick-job").forEach(function (card) {
    card.addEventListener("click", function () {
      var value = card.getAttribute("data-job");
      onArrival(function () {
        setChoice("job", value);
        if (current === 0) nameInput.focus({ preventScroll: true });
        else if (current === 1) advanceTimer = setTimeout(function () { go(2); }, 400);
      });
    });
  });

  // iPhone Safari only shows :active press styles when a touch listener exists
  document.addEventListener("touchstart", function () {}, { passive: true });

  function setLanguage(next, save) {
    lang = next;
    paintLanguage();
    setHeaderLink();
    renderPlaces();
    paintBudget();
    updateChrome();
    update();
    checks.forEach(function (check) {
      if (check.input.getAttribute("aria-invalid") === "true") showError(check, true);
    });
    if (save) { try { localStorage.setItem("boureg-lang", lang); } catch (err) {} }
  }
  document.querySelectorAll(".lang__btn").forEach(function (b) {
    b.addEventListener("click", function () { setLanguage(b.getAttribute("data-lang"), true); });
  });

  setLanguage(pickStartLanguage(), false);

  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  if (!("IntersectionObserver" in window)) {
    document.querySelectorAll("[data-reveal]").forEach(function (el) { el.classList.add("is-in"); });
    return;
  }

  // Header line once the page scrolls
  var header = document.querySelector(".header");
  new IntersectionObserver(function (entries) {
    header.classList.toggle("is-scrolled", !entries[0].isIntersecting);
  }).observe(document.querySelector(".scroll-sentinel"));

  // Mobile sticky bar hides while the quote card is on screen
  var mbar = document.getElementById("mbar");
  if (mbar) new IntersectionObserver(function (entries) {
    var onScreen = entries[0].isIntersecting;
    mbar.classList.toggle("is-hidden", onScreen);
    mbar.setAttribute("aria-hidden", onScreen ? "true" : "false");
    mbar.querySelector("a").tabIndex = onScreen ? -1 : 0;
  }, { threshold: 0, rootMargin: "0px 0px -80px 0px" }).observe(flow);

  // Small fade in as sections enter the screen, 50ms apart inside a group
  document.querySelectorAll(".cards, .checks").forEach(function (group) {
    Array.prototype.forEach.call(group.children, function (el, i) { el.style.setProperty("--i", i); });
  });
  function settle(el) {
    el.removeAttribute("data-reveal");
    el.classList.remove("is-in");
    el.style.removeProperty("--i");
  }
  var revealer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      var el = entry.target;
      el.classList.add("is-in");
      revealer.unobserve(el);
      var i = parseFloat(el.style.getPropertyValue("--i")) || 0;
      setTimeout(function () { settle(el); }, 450 + i * 50);
    });
  }, { rootMargin: "0px 0px -40px 0px" });
  document.querySelectorAll("[data-reveal]").forEach(function (el) { revealer.observe(el); });
})();
