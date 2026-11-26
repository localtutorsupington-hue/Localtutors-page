# Oase

'n Plek om asem te skep. Die Oase-webwerf: artikels in Afrikaans wat lesers na 'n gratis kontrole, WhatsApp en Facebook lei.

Gebou met Astro. Geen databasis nie. Netlify bou dit vanself (sien `../netlify.toml`).

## Hoe om 'n artikel by te voeg (van jou foon af)

1. Maak op GitHub die vouer `oase/src/content/artikels` oop en tik **Add file** > **Create new file**.
2. Noem die lêer na jou onderwerp, byvoorbeeld `bloeddruk.md` (klein letters, koppeltekens in plaas van spasies).
3. Kopieer die sjabloon hieronder, plak dit in en vul die velde tussen die `---` lyne in.
4. Skryf jou artikel onder die tweede `---`. Begin opskrifte met `## ` en lyste met `- `.
5. Tik **Commit changes** op die `main` tak. Netlify sit die artikel binne 'n paar minute aanlyn.

### Sjabloon

```markdown
---
title: "Hoe om jou *bloeddruk* te verstaan"
slug: "bloeddruk"
category: "gesondheid"
date: 2026-12-01
summary: "Een of twee sinne wat sê waaroor die artikel gaan."
image: ""
imageAlt: ""
leestyd: 3
omslag: "Bloeddruk"
kortliks:
  - "Eerste belangrike punt."
  - "Tweede belangrike punt."
bronne:
  - titel: "Naam van die bron"
    url: "https://..."
---

Jou artikel begin hier.

## Eerste opskrif
```

- `category` moet een van hierdie wees: `rus`, `liefde`, `beweeg`, `gesondheid`.
- `slug` word die webadres: `/artikels/bloeddruk/`. Gebruik dieselfde woord as die lêernaam.
- *Sterretjies* om een woord in die titel maak dit die pienk "pill"-woord.
- `omslag` is die groot woord op die kleurblok. `image` mag leeg bly.
- Wil jy 'n foto gebruik? Laai dit op na `oase/public/beelde/` en skryf `image: "/beelde/jou-foto.jpg"` en 'n kort beskrywing by `imageAlt`.
- Elke artikel **moet** ten minste een bron hê, anders bou die webwerf nie. Dit is met opset.
- Die gratis-kontrole kaart, die vrywaring, die bronnelys en die eind-knoppie kom vanself by. Jy hoef niks te doen nie.
- Moenie 'n spesifieke dokter of praktyk in 'n artikel noem nie (HPCSA-reëls). Mense kom by verskaffers uit deur die kontrole-knoppie.

## Instellings (`src/config.ts`)

| Waarde | Wat dit doen | Nou |
|---|---|---|
| `KONTROLE_URL` | Waar die "gratis kontrole" knoppies heen gaan. Leeg = WhatsApp met 'n klaar-geskrewe boodskap. | leeg |
| `WHATSAPP` | Jou WhatsApp-nommer in die formaat 27... | `27697635055` |
| `FACEBOOK_URL` | Oase se Facebook-bladsy. Leeg = skakels word versteek. | ingevul |
| `PRAKTISYN_URL` | Bladsy vir gesondheidswerkers wat wil aansluit (net in die voetskrif). Leeg = versteek. | leeg |
| `NEWSLETTER_URL` | Waarheen die nuusbrief-vorm stuur. Leeg = Netlify Forms. | leeg |
| `SITE_URL` | Jou webwerf se adres (vir deelskakels). | `https://oase-webwerf.netlify.app` |

Elke kontrole-skakel kry `?bron=<waar-die-leser-was>` (byvoorbeeld `?bron=slaap` of `?bron=tuisblad`). As die skakel na WhatsApp gaan, staan die bron ook in die boodskap, sodat jy kan sien watter artikel mense na jou toe stuur.

## Nuusbrief en POPIA

Die vorm vra net naam en WhatsApp-nommer, met 'n toestemmingsblokkie. As `NEWSLETTER_URL` leeg is, stoor Netlify die inskrywings: skakel **Forms > Enable form detection** aan in Netlify, en kyk dan onder **Forms > nuusbrief**. Die vorm belowe dat mense "STOP" kan stuur: hou by daardie belofte.

## Om na te gaan: [LAAT DOKTER NAGAAN]

Al ses artikels het bo-aan die lêer 'n `# [LAAT DOKTER NAGAAN]` lys met die presiese punte wat 'n dokter of verpleegster moet nagaan. Hierdie lyne wys nie op die webwerf nie. Vee hulle uit wanneer dit nagegaan is. Gaan ook die drie stappe in "Hoe dit werk" op die tuisblad na, sodat dit presies pas by hoe jou kontrole werk.

## Netlify

1. Netlify > **Add new site** > **Import an existing project** > kies hierdie GitHub-bewaarplek.
2. Netlify lees `netlify.toml` en bou die `oase` vouer. Jy hoef niks anders in te vul nie.

Op jou rekenaar: `npm install`, dan `npm run dev` (voorskou) of `npm run build` (bou na `dist/`).

## Ontwerp

- Navorsing en ontwerpopdrag: `research/notes.md`.
- Kleure en lettertipes: `src/styles/global.css` (Instrument Serif en DM Sans, self-gehuisves met @fontsource).
- Beweging: net CSS en 'n klein IntersectionObserver-skrip. Geen animasie-biblioteek, geen gladde-rol enjin, geen 3D nie, sodat die webwerf vinnig bly op 'n foon. Alles skakel af as iemand minder beweging verkies.
- Prente: tipografiese kleurblokke, geen voorraadfoto's nie.
